import React, { useState } from 'react';
import { Company } from '../types';
import { Phone, Globe, MapPin, Clock, MoreHorizontal, Check, Plus, MessageCircle, Map, Kanban, CheckSquare, Square } from 'lucide-react';
import { translations, Language } from '../utils/i18n';
import { buildWhatsAppChatUrl, getWhatsAppChatTarget, getWhatsAppStatus } from '../utils/whatsappLink.js';
import { sendLeadFeedback } from '../services/feedbackService.js';

interface LeadCardProps {
  company: Company;
  lang: Language;
  onSaveClick: (company: Company) => void;
  onAddToPipeline?: (company: Company) => void;
  isSaved?: boolean;
  isContacted: boolean;
  onToggleContacted: () => void;
}

const LeadCard: React.FC<LeadCardProps> = ({
  company,
  lang,
  onSaveClick,
  onAddToPipeline,
  isSaved = false,
  isContacted,
  onToggleContacted,
}) => {
  const t = translations[lang];
  const [showFeedbackMenu, setShowFeedbackMenu] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleFeedback = async (e: React.MouseEvent, type: string) => {
    e.stopPropagation();
    setShowFeedbackMenu(false);
    setFeedbackSent(true);
    await sendLeadFeedback(company.id, type);
  };

  const sourceLabel = (() => {
    switch (company.source) {
      case 'GOOGLE_MAPS':
        return t.source_google;
      case 'GOV_DATA':
        return t.source_gov;
      case 'WEB_SCRAP':
        return t.source_web;
      case 'OPEN_DATA':
        return t.source_open_data;
      case 'LINKEDIN':
        return 'LinkedIn';
      default:
        return company.source.replace(/_/g, ' ');
    }
  })();

  const sourceBadgeClass = (() => {
    switch (company.source) {
      case 'GOOGLE_MAPS':
        return 'bg-nexus-accent text-nexus-royal border-nexus-royal/20';
      case 'GOV_DATA':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'OPEN_DATA':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'WEB_SCRAP':
        return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100';
      default:
        return 'bg-nexus-sandLight text-nexus-charcoal border-nexus-sand';
    }
  })();

  const whatsappStatus = company.whatsappStatus || getWhatsAppStatus(company);
  const whatsappTarget = getWhatsAppChatTarget(company);

  const whatsappBadge = (() => {
    switch (whatsappStatus) {
      case 'CONFIRMED':
        return {
          label: t.whatsapp_confirmed,
          className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        };
      case 'UNCONFIRMED':
        return {
          label: t.whatsapp_unconfirmed,
          className: 'bg-amber-50 text-amber-700 border-amber-100',
        };
      default:
        return {
          label: t.whatsapp_not_available,
          className: 'bg-slate-50 text-slate-500 border-slate-200',
        };
    }
  })();

  const openWebsite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!company.website) return;
    let url = company.website;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    window.open(url, '_blank');
  };

  const openGoogleMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (company.googleMapsUri) {
      window.open(company.googleMapsUri, '_blank');
      return;
    }
    const query = encodeURIComponent(`${company.nome_fantasia} ${company.endereco || company.cidade}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const openWhatsApp = (e: React.MouseEvent, target: string) => {
    e.stopPropagation();
    const url = buildWhatsAppChatUrl(target);
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const legalName = company.razao_social;
  const showLegalName = legalName && legalName !== company.nome_fantasia;

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded border shadow-subtle transition-all duration-200 hover:shadow-card-hover ${
        isContacted ? 'border-l-4 border-l-emerald-500 bg-emerald-50/10' : 'border-nexus-sand bg-nexus-surface'
      }`}
    >
      {!isContacted && (
        <div className="absolute left-0 right-0 top-0 h-1 bg-nexus-sandLight transition-colors group-hover:bg-nexus-royal" />
      )}

      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex-1 pr-4">
          <div className="mb-1 flex items-center gap-2">
            <h3
              className={`cursor-pointer line-clamp-1 text-base font-bold ${
                isContacted ? 'text-nexus-warmGray' : 'text-nexus-dark hover:text-nexus-royal'
              }`}
              title={company.nome_fantasia}
            >
              {company.nome_fantasia}
            </h3>
            {company.is_open_now && <span className="h-2 w-2 rounded-full bg-emerald-500" title={t.status_open} />}
          </div>
          {showLegalName && (
            <p className="line-clamp-1 text-xs text-nexus-warmGray" title={legalName}>
              {legalName}
            </p>
          )}
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFeedbackMenu(!showFeedbackMenu);
            }}
            className="rounded p-1 text-nexus-warmGray transition-colors hover:bg-nexus-sandLight hover:text-nexus-dark"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
          {showFeedbackMenu && (
            <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded border border-nexus-sand bg-white py-1 shadow-lg">
              {feedbackSent ? (
                <div className="px-3 py-2 text-xs font-medium text-emerald-600">Feedback enviado!</div>
              ) : (
                <>
                  <div className="px-3 py-1 text-[10px] font-bold uppercase text-nexus-warmGray">Feedback</div>
                  <button onClick={(e) => handleFeedback(e, 'bom_lead')} className="w-full px-3 py-1.5 text-left text-xs text-nexus-charcoal hover:bg-nexus-accent">
                    Bom Lead
                  </button>
                  <button onClick={(e) => handleFeedback(e, 'duplicado')} className="w-full px-3 py-1.5 text-left text-xs text-nexus-charcoal hover:bg-nexus-accent">
                    Duplicado
                  </button>
                  <button onClick={(e) => handleFeedback(e, 'fora_cidade')} className="w-full px-3 py-1.5 text-left text-xs text-nexus-charcoal hover:bg-nexus-accent">
                    Fora da cidade
                  </button>
                  <button onClick={(e) => handleFeedback(e, 'fora_segmento')} className="w-full px-3 py-1.5 text-left text-xs text-nexus-charcoal hover:bg-nexus-accent">
                    Fora do segmento
                  </button>
                  <button onClick={(e) => handleFeedback(e, 'sem_contato')} className="w-full px-3 py-1.5 text-left text-xs text-nexus-charcoal hover:bg-nexus-accent">
                    Sem contato
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow space-y-3 px-5 py-2">
        <div className="flex items-center gap-2">
          <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${sourceBadgeClass}`}>
            {sourceLabel}
          </span>
          {typeof company.score === 'number' && (
            <span className="rounded border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-indigo-700">
              Score: {company.score}
            </span>
          )}
          {isContacted && (
            <span className="flex items-center gap-1 rounded border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700">
              <Check className="h-3 w-3" /> {t.contacted}
            </span>
          )}
        </div>

        <div className="my-2 h-px bg-nexus-sandLight" />

        <div className="space-y-2.5">
          <div className="flex items-start gap-3" title={company.provenance?.endereco ? `Fonte do endereço: ${company.provenance.endereco}` : undefined}>
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-nexus-warmGray" />
            <div className="flex flex-col">
              <span className="line-clamp-2 text-xs font-medium text-nexus-charcoal" title={company.endereco}>
                {company.endereco || company.cidade}
              </span>
              {!company.endereco && company.bairro && <span className="text-[10px] text-nexus-warmGray">{company.bairro}</span>}
              <button onClick={openGoogleMaps} className="mt-1 flex items-center gap-1 text-[10px] font-bold text-nexus-royal hover:underline">
                <Map className="h-3 w-3" />
                Google Maps
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3" title={company.provenance?.telefone ? `Fonte do telefone: ${company.provenance.telefone}` : undefined}>
            <Phone className="h-4 w-4 shrink-0 text-nexus-warmGray" />
            <span className="truncate text-xs font-medium text-nexus-charcoal select-all">
              {company.telefone || <span className="italic text-nexus-warmGray">--</span>}
            </span>
            {whatsappTarget && (
              <button
                onClick={(e) => openWhatsApp(e, whatsappTarget)}
                className="ml-auto flex items-center gap-1 rounded-full border border-transparent p-1 text-[10px] font-bold text-green-600 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="hidden group-hover:inline">WhatsApp</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pl-7">
            <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${whatsappBadge.className}`}>
              {whatsappBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-3" title={company.provenance?.website ? `Fonte do website: ${company.provenance.website}` : undefined}>
            <Globe className="h-4 w-4 shrink-0 text-nexus-warmGray" />
            {company.website ? (
              <span onClick={openWebsite} className="max-w-[180px] truncate cursor-pointer text-xs font-medium text-nexus-royal hover:underline">
                {company.website}
              </span>
            ) : (
              <span className="text-xs italic text-nexus-warmGray">--</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 shrink-0 text-nexus-warmGray" />
            <span className="truncate text-xs text-nexus-charcoal">
              {company.opening_hours || <span className="italic text-nexus-warmGray">{t.hours_unavailable}</span>}
            </span>
          </div>

          {company.rankingReasons && company.rankingReasons.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {company.rankingReasons.map((reason, idx) => (
                <span key={idx} className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] text-slate-600 border border-slate-200">
                  {reason}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-nexus-sandLight bg-nexus-offWhite px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleContacted();
            }}
            className={`flex items-center gap-1.5 rounded border px-2 py-1.5 text-[10px] font-bold transition-colors ${
              isContacted
                ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                : 'border-nexus-sand bg-nexus-surface text-nexus-warmGray hover:border-nexus-charcoal'
            }`}
            title="Marcar como contatado"
          >
            {isContacted ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
            {t.mark_contacted}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onAddToPipeline && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToPipeline(company);
              }}
              className="rounded border border-nexus-sand bg-nexus-surface p-1.5 text-nexus-warmGray shadow-subtle transition-all hover:border-nexus-royal hover:text-nexus-royal"
              title="Criar Negócio no Pipeline"
            >
              <Kanban className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSaveClick(company);
            }}
            className={`flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-bold shadow-subtle transition-all ${
              isSaved
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'border-nexus-sand bg-nexus-surface text-nexus-royal hover:border-nexus-royal hover:bg-nexus-accent'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="h-3.5 w-3.5" /> {t.actions_saved}
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> {t.actions_save}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
