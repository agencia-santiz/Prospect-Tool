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

  const handleFeedback = async (e: React.MouseEvent, type: any) => {
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
      url = 'https://' + url;
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

  const normalize = (s: string) => (s ? s.toLowerCase().trim() : '');
  const legalName = company['raz\u00e3o_social'];
  const showLegalName = normalize(legalName) !== normalize(company.nome_fantasia);

  return (
    <div className={`group bg-nexus-surface rounded border shadow-subtle hover:shadow-card-hover transition-all duration-200 flex flex-col h-full overflow-hidden relative ${isContacted ? 'border-l-4 border-l-emerald-500 bg-emerald-50/10' : 'border-nexus-sand'}`}>
      {!isContacted && <div className="absolute top-0 left-0 right-0 h-1 bg-nexus-sandLight group-hover:bg-nexus-royal transition-colors"></div>}

      <div className="p-5 pb-3 flex justify-between items-start">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-base font-bold cursor-pointer line-clamp-1 ${isContacted ? 'text-nexus-warmGray' : 'text-nexus-dark hover:text-nexus-royal'}`} title={company.nome_fantasia}>
              {company.nome_fantasia}
            </h3>
            {company.is_open_now && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" title={t.status_open}></span>
            )}
          </div>
          {showLegalName && (
            <p className="text-xs text-nexus-warmGray line-clamp-1" title={legalName}>
              {legalName}
            </p>
          )}
        </div>
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowFeedbackMenu(!showFeedbackMenu); }}
            className="text-nexus-warmGray hover:text-nexus-dark p-1 rounded hover:bg-nexus-sandLight transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          {showFeedbackMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-nexus-sand shadow-lg rounded z-10 py-1">
              {feedbackSent ? (
                <div className="px-3 py-2 text-xs text-emerald-600 font-medium">Feedback enviado!</div>
              ) : (
                <>
                  <div className="px-3 py-1 text-[10px] font-bold text-nexus-warmGray uppercase">Feedback</div>
                  <button onClick={(e) => handleFeedback(e, 'bom_lead')} className="w-full text-left px-3 py-1.5 text-xs hover:bg-nexus-accent text-nexus-charcoal">Bom Lead</button>
                  <button onClick={(e) => handleFeedback(e, 'duplicado')} className="w-full text-left px-3 py-1.5 text-xs hover:bg-nexus-accent text-nexus-charcoal">Duplicado</button>
                  <button onClick={(e) => handleFeedback(e, 'fora_cidade')} className="w-full text-left px-3 py-1.5 text-xs hover:bg-nexus-accent text-nexus-charcoal">Fora da cidade</button>
                  <button onClick={(e) => handleFeedback(e, 'fora_segmento')} className="w-full text-left px-3 py-1.5 text-xs hover:bg-nexus-accent text-nexus-charcoal">Fora do segmento</button>
                  <button onClick={(e) => handleFeedback(e, 'sem_contato')} className="w-full text-left px-3 py-1.5 text-xs hover:bg-nexus-accent text-nexus-charcoal">Sem contato</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-2 flex-grow space-y-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide border ${sourceBadgeClass}`}>
            {sourceLabel}
          </span>
          {(company.score !== undefined) && (
            <span className="text-[10px] px-2 py-0.5 rounded font-bold tracking-wide border bg-indigo-50 text-indigo-700 border-indigo-200">
              Score: {company.score}
            </span>
          )}
          {isContacted && (
            <span className="text-[10px] px-2 py-0.5 rounded font-bold tracking-wide bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Check className="w-3 h-3" /> {t.contacted}
            </span>
          )}
        </div>

        <div className="h-px bg-nexus-sandLight my-2"></div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3" title={company.provenance?.endereco ? `Fonte do endereço: ${company.provenance.endereco}` : undefined}>
            <MapPin className="w-4 h-4 text-nexus-warmGray mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-nexus-charcoal line-clamp-2" title={company.endereco}>
                {company.endereco || company.cidade}
              </span>
              {!company.endereco && company.bairro && <span className="text-[10px] text-nexus-warmGray">{company.bairro}</span>}
              <button
                onClick={openGoogleMaps}
                className="mt-1 flex items-center gap-1 text-[10px] font-bold text-nexus-royal hover:underline"
              >
                <Map className="w-3 h-3" />
                Google Maps
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3" title={company.provenance?.telefone ? `Fonte do telefone: ${company.provenance.telefone}` : undefined}>
            <Phone className="w-4 h-4 text-nexus-warmGray shrink-0" />
            <span className="text-xs font-medium text-nexus-charcoal select-all truncate">
              {company.telefone || <span className="text-nexus-warmGray italic">--</span>}
            </span>
            {whatsappTarget && (
              <button
                onClick={(e) => openWhatsApp(e, whatsappTarget)}
                className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors ml-auto flex items-center gap-1 text-[10px] font-bold border border-transparent hover:border-green-200"
                title="Conversar no WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden group-hover:inline">WhatsApp</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pl-7">
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide border ${whatsappBadge.className}`}>
              {whatsappBadge.label}
            </span>
          </div>

          <div className="flex items-center gap-3" title={company.provenance?.website ? `Fonte do website: ${company.provenance.website}` : undefined}>
            <Globe className="w-4 h-4 text-nexus-warmGray shrink-0" />
            {company.website ? (
              <span
                onClick={openWebsite}
                className="text-xs font-medium text-nexus-royal hover:underline cursor-pointer truncate max-w-[180px]"
              >
                {company.website}
              </span>
            ) : (
              <span className="text-xs text-nexus-warmGray italic">--</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-nexus-warmGray shrink-0" />
            <span className="text-xs text-nexus-charcoal truncate">
              {company.opening_hours || <span className="text-nexus-warmGray italic">{t.hours_unavailable}</span>}
            </span>
          </div>

          {company.rankingReasons && company.rankingReasons.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {company.rankingReasons.map((reason, idx) => (
                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {reason}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-4 mt-2 border-t border-nexus-sandLight bg-nexus-offWhite flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleContacted(); }}
            className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1.5 rounded border transition-colors ${isContacted ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-nexus-surface text-nexus-warmGray border-nexus-sand hover:border-nexus-charcoal'}`}
            title="Marcar como contatado"
          >
            {isContacted ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            {t.mark_contacted}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onAddToPipeline && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToPipeline(company); }}
              className="p-1.5 bg-nexus-surface border border-nexus-sand text-nexus-warmGray hover:text-nexus-royal hover:border-nexus-royal rounded shadow-subtle transition-all"
              title="Criar Negócio no Pipeline"
            >
              <Kanban className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSaveClick(company); }}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded transition-all border shadow-subtle ${
              isSaved
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-nexus-surface text-nexus-royal border-nexus-sand hover:border-nexus-royal hover:bg-nexus-accent'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" /> {t.actions_saved}
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> {t.actions_save}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
