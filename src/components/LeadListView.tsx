import React from 'react';
import { Company } from '../types';
import { Phone, Globe2, Clock, MapPin, ArrowUpDown, Building, Map, MessageCircle, Check, Kanban, CheckSquare, Square } from 'lucide-react';
import { translations, Language } from '../utils/i18n';
import { buildWhatsAppChatUrl, getWhatsAppChatTarget, getWhatsAppStatus } from '../utils/whatsappLink.js';

interface LeadListViewProps {
  leads: Company[];
  lang: Language;
  onSaveLead: (company: Company) => void;
  onAddToPipeline?: (company: Company) => void;
  isContacted: (lead: Company) => boolean;
  onToggleContacted: (lead: Company) => void;
}

const LeadListView: React.FC<LeadListViewProps> = ({
  leads,
  lang,
  onSaveLead,
  onAddToPipeline,
  isContacted,
  onToggleContacted,
}) => {
  const t = translations[lang];

  const getSourceLabel = (source: string) => {
    switch (source) {
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
        return source.replace(/_/g, ' ');
    }
  };

  const openWebsite = (url: string | undefined) => {
    if (!url) return;
    let finalUrl = url;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    window.open(finalUrl, '_blank');
  };

  const openGoogleMaps = (company: Company) => {
    const query = encodeURIComponent(`${company.nome_fantasia} ${company.endereco || company.cidade}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const openWhatsApp = (e: React.MouseEvent, target: string) => {
    e.stopPropagation();
    const url = buildWhatsAppChatUrl(target);
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getWhatsAppBadge = (status: string) => {
    switch (status) {
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
  };

  return (
    <div className="overflow-hidden rounded border border-nexus-sand bg-nexus-surface shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-nexus-sand bg-nexus-offWhite text-xs font-bold uppercase tracking-wide text-nexus-warmGray">
              <th className="w-8 border-r border-gray-100 px-3 py-3 text-center">
                <div className="mx-auto h-3 w-3 rounded border border-nexus-sand" />
              </th>
              <th className="w-10 px-3 py-3 text-center" title="Status de Contato">
                <CheckSquare className="mx-auto h-4 w-4 text-nexus-warmGray" />
              </th>
              <th className="cursor-pointer px-4 py-3 transition-colors hover:bg-gray-100 group">
                <div className="flex items-center gap-1">
                  Empresa
                  <ArrowUpDown className="h-3 w-3 text-nexus-sand group-hover:text-nexus-warmGray" />
                </div>
              </th>
              <th className="cursor-pointer px-4 py-3 transition-colors hover:bg-gray-100 group">
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className="h-3 w-3 text-nexus-sand group-hover:text-nexus-warmGray" />
                </div>
              </th>
              <th className="cursor-pointer px-4 py-3 transition-colors hover:bg-gray-100 group">
                <div className="flex items-center gap-1">
                  Contato
                  <ArrowUpDown className="h-3 w-3 text-nexus-sand group-hover:text-nexus-warmGray" />
                </div>
              </th>
              <th className="cursor-pointer px-4 py-3 transition-colors hover:bg-gray-100 group">
                <div className="flex items-center gap-1">
                  Localização
                  <ArrowUpDown className="h-3 w-3 text-gray-300 group-hover:text-gray-500" />
                </div>
              </th>
              <th className="px-4 py-3 text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-nexus-sandLight bg-nexus-surface">
            {leads.map((lead) => {
              const legalName = lead.razao_social;
              const showLegalName = Boolean(legalName && legalName !== lead.nome_fantasia);
              const contacted = isContacted(lead);
              const whatsappStatus = lead.whatsappStatus || getWhatsAppStatus(lead);
              const whatsappTarget = getWhatsAppChatTarget(lead);
              const whatsappBadge = getWhatsAppBadge(whatsappStatus);

              return (
                <tr key={lead.id} className={`group text-sm transition-colors hover:bg-nexus-accent/40 ${contacted ? 'bg-emerald-50/30' : ''}`}>
                  <td className="border-r border-gray-50 px-3 py-3 text-center">
                    <input type="checkbox" className="cursor-pointer rounded border-nexus-sand text-nexus-royal focus:ring-nexus-royal" />
                  </td>

                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => onToggleContacted(lead)}
                      className={`transition-transform hover:scale-110 ${contacted ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-400'}`}
                      title={contacted ? 'Marcar como não contatado' : 'Marcar como contatado'}
                    >
                      {contacted ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                    </button>
                  </td>

                  <td className="max-w-xs px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-nexus-sandLight text-nexus-warmGray">
                        <Building className="h-4 w-4" />
                      </div>
                      <div>
                        <div className={`cursor-pointer truncate font-bold ${contacted ? 'text-nexus-warmGray line-through decoration-nexus-sand' : 'text-nexus-dark hover:text-nexus-royal'}`} title={lead.nome_fantasia}>
                          {lead.nome_fantasia}
                        </div>
                        {showLegalName && (
                          <div className="truncate text-xs text-nexus-warmGray" title={legalName}>
                            {legalName}
                          </div>
                        )}
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] uppercase text-nexus-warmGray">{getSourceLabel(lead.source)}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {lead.is_open_now ? (
                        <span className="inline-flex w-fit items-center gap-1.5 rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {t.status_open}
                        </span>
                      ) : (
                        <span className="inline-flex w-fit items-center gap-1.5 rounded border border-nexus-sand bg-nexus-sandLight px-2 py-0.5 text-[10px] font-bold text-nexus-warmGray">
                          <span className="h-1.5 w-1.5 rounded-full bg-nexus-warmGray" /> {t.status_closed}
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="h-3 w-3 text-nexus-sand" />
                        <span className="max-w-[120px] truncate">{lead.opening_hours || '-'}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {lead.telefone ? (
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-700 select-all">
                          <Phone className="h-3.5 w-3.5 text-nexus-warmGray" />
                          {lead.telefone}
                          <button
                            onClick={(e) => openWhatsApp(e, whatsappTarget || lead.telefone!)}
                            className="rounded-full p-0.5 text-green-600 transition-colors hover:bg-green-50 hover:text-green-700"
                            title="WhatsApp Web"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs italic text-gray-400">
                          <Phone className="h-3.5 w-3.5 text-nexus-sand" /> --
                          {whatsappTarget && (
                            <button
                              onClick={(e) => openWhatsApp(e, whatsappTarget)}
                              className="rounded-full p-0.5 text-green-600 transition-colors hover:bg-green-50 hover:text-green-700"
                              title="WhatsApp Web"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${whatsappBadge.className}`}>
                          <MessageCircle className="h-3 w-3" />
                          {whatsappBadge.label}
                        </span>
                      </div>

                      {lead.website ? (
                        <button
                          onClick={() => openWebsite(lead.website)}
                          className="flex max-w-[180px] items-center gap-2 truncate text-xs text-nexus-royal hover:underline group/link"
                        >
                          <Globe2 className="h-3.5 w-3.5 text-nexus-warmGray group-hover/link:text-nexus-royal" />
                          {lead.website}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-xs italic text-gray-400">
                          <Globe2 className="h-3.5 w-3.5 text-nexus-sand" /> --
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-900" title={lead.endereco}>
                        <MapPin className="h-3.5 w-3.5 text-nexus-warmGray" />
                        <span className="max-w-[150px] truncate">{lead.endereco || lead.cidade}</span>
                      </div>
                      {lead.bairro && !lead.endereco?.includes(lead.bairro) && (
                        <div className="pl-5 text-[11px] text-nexus-warmGray">{lead.bairro}</div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => openGoogleMaps(lead)}
                        className="rounded border border-nexus-sand bg-nexus-surface p-1.5 text-nexus-warmGray shadow-subtle transition-all hover:border-nexus-royal hover:text-nexus-royal"
                        title="Ver no Google Maps"
                      >
                        <Map className="h-3.5 w-3.5" />
                      </button>

                      {onAddToPipeline && (
                        <button
                          onClick={() => onAddToPipeline(lead)}
                          className="rounded border border-nexus-sand bg-nexus-surface p-1.5 text-nexus-warmGray shadow-subtle transition-all hover:border-nexus-royal hover:text-nexus-royal"
                          title="Criar Negócio"
                        >
                          <Kanban className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onSaveLead(lead)}
                        className="rounded border border-nexus-sand bg-nexus-surface px-3 py-1 text-xs font-bold text-nexus-warmGray shadow-subtle transition-all hover:border-nexus-royal hover:text-nexus-royal"
                      >
                        Salvar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Building className="mb-3 h-10 w-10 text-nexus-sand" />
                    <span className="text-sm font-medium">Nenhum registro encontrado.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadListView;
