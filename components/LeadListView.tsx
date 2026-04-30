
import React from 'react';
import { Company } from '../types';
import { Phone, Globe2, Clock, MapPin, ArrowUpDown, Building, Map, MessageCircle, Check, Kanban, CheckSquare, Square } from 'lucide-react';
import { translations, Language } from '../utils/i18n';

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
    onToggleContacted
}) => {
  const t = translations[lang];

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

  const openWhatsApp = (e: React.MouseEvent, phone: string) => {
      e.stopPropagation();
      const cleanPhone = phone.replace(/\D/g, '');
      let finalPhone = cleanPhone;
      if (finalPhone.length >= 10 && finalPhone.length <= 11) {
          finalPhone = '55' + finalPhone;
      }
      // Use whatsapp:// protocol to force Desktop App
      window.open(`whatsapp://send?phone=${finalPhone}`, '_blank');
  };

  const normalize = (s: string) => s ? s.toLowerCase().trim() : '';

  return (
    <div className="bg-nexus-surface border border-nexus-sand rounded shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-nexus-offWhite border-b border-nexus-sand text-xs font-bold text-nexus-warmGray uppercase tracking-wide">
              <th className="px-3 py-3 w-8 text-center border-r border-gray-100">
                  {/* Select All Checkbox - Not implemented logic yet */}
                  <div className="w-3 h-3 border border-nexus-sand rounded mx-auto"></div>
              </th>
              <th className="px-3 py-3 w-10 text-center" title="Status de Contato">
                  <CheckSquare className="w-4 h-4 mx-auto text-nexus-warmGray" />
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-1">
                  Empresa
                  <ArrowUpDown className="w-3 h-3 text-nexus-sand group-hover:text-nexus-warmGray" />
                </div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors group">
                 <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className="w-3 h-3 text-nexus-sand group-hover:text-nexus-warmGray" />
                 </div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors group">
                 <div className="flex items-center gap-1">
                  Contato
                  <ArrowUpDown className="w-3 h-3 text-nexus-sand group-hover:text-nexus-warmGray" />
                 </div>
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors group">
                 <div className="flex items-center gap-1">
                  Localização
                  <ArrowUpDown className="w-3 h-3 text-gray-300 group-hover:text-gray-500" />
                 </div>
              </th>
              <th className="px-4 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-nexus-sandLight bg-nexus-surface">
            {leads.map((lead) => {
              const showLegalName = normalize(lead.razão_social) !== normalize(lead.nome_fantasia);
              const contacted = isContacted(lead);

              return (
              <tr key={lead.id} className={`hover:bg-nexus-accent/40 transition-colors group text-sm ${contacted ? 'bg-emerald-50/30' : ''}`}>
                <td className="px-3 py-3 text-center border-r border-gray-50">
                    <input type="checkbox" className="rounded border-nexus-sand text-nexus-royal focus:ring-nexus-royal cursor-pointer" />
                </td>
                
                <td className="px-3 py-3 text-center">
                    <button 
                        onClick={() => onToggleContacted(lead)}
                        className={`hover:scale-110 transition-transform ${contacted ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-400'}`}
                        title={contacted ? "Marcar como não contatado" : "Marcar como contatado"}
                    >
                         {contacted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>
                </td>

                <td className="px-4 py-3 max-w-xs">
                  <div className="flex items-start gap-3">
                      <div className="mt-1 w-8 h-8 rounded bg-nexus-sandLight flex items-center justify-center text-nexus-warmGray shrink-0">
                          <Building className="w-4 h-4" />
                      </div>
                      <div>
                          <div className={`font-bold cursor-pointer truncate ${contacted ? 'text-nexus-warmGray line-through decoration-nexus-sand' : 'text-nexus-dark hover:text-nexus-royal'}`} title={lead.nome_fantasia}>
                              {lead.nome_fantasia}
                          </div>
                          {showLegalName && (
                            <div className="text-xs text-nexus-warmGray truncate" title={lead.razão_social}>
                                {lead.razão_social}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-nexus-warmGray uppercase">{lead.source}</span>
                          </div>
                      </div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                        {lead.is_open_now ? (
                            <span className="inline-flex items-center w-fit gap-1.5 px-2 py-0.5 rounded text-emerald-700 bg-emerald-50 text-[10px] font-bold border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t.status_open}
                            </span>
                        ) : (
                            <span className="inline-flex items-center w-fit gap-1.5 px-2 py-0.5 rounded text-nexus-warmGray bg-nexus-sandLight text-[10px] font-bold border border-nexus-sand">
                            <span className="w-1.5 h-1.5 rounded-full bg-nexus-warmGray"></span> {t.status_closed}
                            </span>
                        )}
                         <div className="text-xs text-gray-500 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-nexus-sand" />
                            <span className="truncate max-w-[120px]">{lead.opening_hours || "-"}</span>
                        </div>
                    </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {lead.telefone ? (
                        <div className="flex items-center gap-2 text-xs text-gray-700 font-medium select-all">
                            <Phone className="w-3.5 h-3.5 text-nexus-warmGray" />
                            {lead.telefone}
                             <button 
                                onClick={(e) => openWhatsApp(e, lead.telefone!)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full p-0.5 transition-colors"
                                title="WhatsApp Web"
                            >
                                <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-400 italic flex items-center gap-2">
                             <Phone className="w-3.5 h-3.5 text-nexus-sand" /> --
                        </div>
                    )}
                    
                    {lead.website ? (
                        <button 
                            onClick={() => openWebsite(lead.website)}
                            className="flex items-center gap-2 text-xs text-nexus-royal hover:underline truncate max-w-[180px] group/link"
                        >
                            <Globe2 className="w-3.5 h-3.5 text-nexus-warmGray group-hover/link:text-nexus-royal" />
                            {lead.website}
                        </button>
                    ) : (
                        <div className="text-xs text-gray-400 italic flex items-center gap-2">
                             <Globe2 className="w-3.5 h-3.5 text-nexus-sand" /> --
                        </div>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-xs text-gray-900 font-medium flex items-center gap-1.5" title={lead.endereco}>
                        <MapPin className="w-3.5 h-3.5 text-nexus-warmGray" />
                        <span className="truncate max-w-[150px]">{lead.endereco || lead.cidade}</span>
                    </div>
                    {lead.bairro && !lead.endereco?.includes(lead.bairro) && <div className="text-[11px] text-nexus-warmGray pl-5">{lead.bairro}</div>}
                  </div>
                </td>

                <td className="px-4 py-3 text-right">
                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       
                       <button 
                         onClick={() => openGoogleMaps(lead)}
                         className="p-1.5 bg-nexus-surface border border-nexus-sand hover:border-nexus-royal text-nexus-warmGray hover:text-nexus-royal rounded shadow-subtle transition-all"
                         title="Ver no Google Maps"
                       >
                           <Map className="w-3.5 h-3.5" />
                       </button>

                       {onAddToPipeline && (
                          <button 
                            onClick={() => onAddToPipeline(lead)}
                            className="p-1.5 bg-nexus-surface border border-nexus-sand hover:border-nexus-royal text-nexus-warmGray hover:text-nexus-royal rounded shadow-subtle transition-all"
                            title="Criar Negócio"
                          >
                             <Kanban className="w-3.5 h-3.5" />
                          </button>
                       )}

                       <button 
                        onClick={() => onSaveLead(lead)}
                        className="px-3 py-1 bg-nexus-surface border border-nexus-sand hover:border-nexus-royal text-nexus-warmGray hover:text-nexus-royal rounded shadow-subtle text-xs font-bold transition-all"
                      >
                         Salvar
                      </button>
                      
                   </div>
                </td>
              </tr>
            )})}
            
            {leads.length === 0 && (
                <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <Building className="w-10 h-10 mb-3 text-nexus-sand" />
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
