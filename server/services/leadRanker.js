const calculateScore = (lead) => {
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
    score += 30;
    reasons.push('Possui telefone (+)');
  } else {
    score -= 20;
    reasons.push('Sem telefone (-)');
  }

  if (lead.website || lead.websiteDomain) {
    score += 20;
    reasons.push('Possui website (+)');
  }

  if (lead.rating && typeof lead.rating === 'number') {
    if (lead.rating >= 4.0) {
      score += 15;
      reasons.push(`Boa avaliação (${lead.rating})`);
    } else if (lead.rating < 3.0) {
      score -= 10;
      reasons.push(`Avaliação baixa (${lead.rating})`);
    }
  }

  const reviewsCount = lead.userRatingsTotal || lead.user_ratings_total || 0;
  if (reviewsCount > 50) {
    score += 15;
    reasons.push('Muitas avaliações');
  } else if (reviewsCount > 10) {
    score += 5;
  }

  if (lead.sectorValidation?.isConfirmed) {
    score += 20;
    reasons.push('Setor confirmado');
  } else if (lead.sectorValidation?.isRejected) {
    score -= 20;
    reasons.push('Setor divergente');
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    reasons
  };
};

export const createLeadRanker = () => {
  const rankLeads = (leads = []) => {
    const rankedLeads = leads.map(lead => {
      const { score, reasons } = calculateScore(lead);
      return {
        ...lead,
        score,
        rankingReasons: reasons
      };
    });

    rankedLeads.sort((a, b) => b.score - a.score);

    return rankedLeads;
  };

  return { rankLeads };
};
