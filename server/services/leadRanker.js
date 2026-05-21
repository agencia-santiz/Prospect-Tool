import { getCompanySignals } from './feedbackStore.js';

const calculateScore = (lead, intent = 'NONE') => {
  let score = 20;
  const reasons = [];

  const businessStatus = lead.businessStatus || lead.business_status;
  if (businessStatus === 'CLOSED_PERMANENTLY') {
    score -= 100;
    reasons.push('Fechado permanentemente');
  } else if (businessStatus === 'CLOSED_TEMPORARILY') {
    score -= 30;
    reasons.push('Fechado temporariamente');
  }

  if (lead.telefone) {
    const phoneDigits = lead.telefone.replace(/\D/g, '');
    const isRepeatedSequence = /(\d)\1{6,}/.test(phoneDigits);
    const isTooShort = phoneDigits.length < 8; // Local numbers have at least 8 digits
    
    if (isRepeatedSequence || isTooShort) {
      score -= 20;
      reasons.push('Telefone suspeito/falso (-)');
    } else {
      score += 30;
      reasons.push('Telefone válido (+)');
    }
  } else {
    score -= 20;
    reasons.push('Sem telefone (-)');
  }

  if (lead.website || lead.websiteDomain) {
    const url = (lead.website || lead.websiteDomain || "").toLowerCase();
    const isGenericDomain = [
      'instagram.com', 'facebook.com', 'linkedin.com', 
      'linktr.ee', 'google.com', 'youtube.com', 'twitter.com',
      'whatsapp.com', 'wa.me', 'beacons.ai', 't.me'
    ].some(domain => url.includes(domain));

    // Store it in the lead for intent checks
    lead._isGenericDomain = isGenericDomain;

    if (isGenericDomain) {
      score += 5;
      reasons.push('Perfil social / Linktree');
    } else {
      score += 20;
      reasons.push('Domínio próprio (+)');
    }
  }

  const rating = Number(lead.rating);
  if (Number.isFinite(rating)) {
    const normalizedRating = Math.max(0, Math.min(5, rating));
    const ratingBoost = Math.round((normalizedRating - 3) * 10);
    score += ratingBoost;
    const ratingReason = ratingBoost === 0
      ? `Avaliação Google (${normalizedRating.toFixed(1)})`
      : `Avaliação Google (${normalizedRating.toFixed(1)}) (${ratingBoost > 0 ? '+' : '-'}${Math.abs(ratingBoost)})`;
    reasons.push(ratingReason);
  }

  const reviewsCount = Number(lead.userRatingsTotal || lead.user_ratings_total || 0);
  if (reviewsCount >= 100) {
    score += 10;
    reasons.push('Muitas avaliações');
  } else if (reviewsCount >= 25) {
    score += 5;
  }

  if (lead.sectorValidation?.isConfirmed) {
    score += 20;
    reasons.push('Setor confirmado');
  } else if (lead.sectorValidation?.isRejected) {
    score -= 20;
    reasons.push('Setor divergente');
  }

  // COMMERCIAL INTENT RULES
  if (intent === 'B2B_SERVICES' || intent === 'SOFTWARE') {
    if ((lead.website || lead.websiteDomain) && !lead._isGenericDomain) {
      score += 15;
      reasons.push('Digital/B2B (+)');
    }
    // High tickets/software usually don't care if a place is "open now", but if they have linkedin:
    if (lead.socials?.linkedin) {
      score += 10;
      reasons.push('Presença corporativa (+)');
    }
  } else if (intent === 'LOCAL_SUPPLY') {
    if (lead.endereco || lead.cidade) {
      score += 10;
      reasons.push('Local físico (+)');
    }
    if (Number.isFinite(rating) && rating >= 4.0 && reviewsCount > 20) {
      score += 10;
      reasons.push('Alta circulação/relevância (+)');
    }
  }

  // FEEDBACK LOOP - Apply accumulated user signals
  const companyName = lead.nome_fantasia || lead.tradeName || '';
  const signals = getCompanySignals(companyName);
  if (signals) {
    if (signals.net > 0) {
      // Users have marked this company as a good lead
      const boost = Math.min(signals.net * 5, 25); // Cap at +25
      score += boost;
      reasons.push(`Feedback positivo (+${boost})`);
    } else if (signals.net < 0) {
      // Users have flagged issues with this company
      const penalty = Math.min(Math.abs(signals.net) * 5, 30); // Cap at -30
      score -= penalty;

      // Add specific penalty labels (deduplicated)
      const uniquePenalties = [...new Set(signals.penalties)];
      const penaltyLabels = {
        duplicado: 'Reportado duplicado',
        fora_cidade: 'Fora da cidade',
        fora_segmento: 'Fora do segmento',
        sem_contato: 'Sem contato útil',
      };
      for (const p of uniquePenalties) {
        if (penaltyLabels[p]) {
          reasons.push(`⚠ ${penaltyLabels[p]}`);
        }
      }
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    reasons
  };
};

export const createLeadRanker = () => {
  const rankLeads = (leads = [], intent = 'NONE') => {
    const rankedLeads = leads.map(lead => {
      const { score, reasons } = calculateScore(lead, intent);
      const { _isGenericDomain, ...cleanLead } = lead;
      return {
        ...cleanLead,
        score,
        rankingReasons: reasons
      };
    });

    rankedLeads.sort((a, b) => b.score - a.score);

    return rankedLeads;
  };

  return { rankLeads };
};
