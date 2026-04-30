
import React, { useState } from 'react';
import { Company } from '../types';
import { Phone, Globe, MapPin, Clock, MoreHorizontal, Check, Plus, MessageCircle, Map, Kanban, CheckSquare, Square } from 'lucide-react';
import { translations, Language } from '../utils/i18n';

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
  onToggleContacted
}) => {
  const t = translations[lang];

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
      const query = encodeURIComponent(`${company.nome_fantasia} ${company.endereco || company.cidade}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const openWhatsApp = (e: React.MouseEvent, phone: string) => {
      e.stopPropagation();
      const cleanPhone = phone.replace(/\D/g, '');
      let finalPhone = cleanPhone;
      // Basic logic to ensure BR country code if missing
      if (finalPhone.length >= 10 && finalPhone.length <= 11) {
          finalPhone = '55' + finalPhone;
      }
      // Use whatsapp:// protocol to force Desktop App
      window.open(`whatsapp://send?phone=${finalPhone}`, '_blank');
  };

  const normalize = (s: string) => s ? s.toLowerCase().trim() : '';
  const showLegalName = normalize(company.razão_social) !== normalize(company.nome_fantasia);

  return (
    <div className={`group bg-nexus-surface rounded border shadow-subtle hover:shadow-card-hover transition-all duration-200 flex flex-col h-full overflow-hidden relative ${isContacted ? 'border-l-4 border-l-emerald-500 bg-emerald-50/10' : 'border-nexus-sand'}`}>
      
      {/* Top Border Indicator (HubSpot Style) - Only if not contacted (since contacted has left border) */}
      {!isContacted && <div className="absolute top-0 left-0 right-0 h-1 bg-nexus-sandLight group-hover:bg-nexus-royal transition-colors"></div>}

      {/* Header */}
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
                <p className="text-xs text-nexus-warmGray line-clamp-1" title={company.razão_social}>
                    {company.razão_social}
                </p>
            )}
        </div>
        <button className="text-nexus-warmGray hover:text-nexus-dark p-1 rounded hover:bg-nexus-sandLight transition-colors">
            <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Properties Grid */}
      <div className="px-5 py-2 flex-grow space-y-3">
        
        {/* Source Badge */}
        <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide border ${
                company.source === 'GOOGLE_MAPS' ? 'bg-nexus-accent text-nexus-royal border-nexus-royal/20' :
                company.source === 'GOV_DATA' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                'bg-nexus-sandLight text-nexus-charcoal border-nexus-sand'
            }`}>
                {company.source.replace(/_/g, ' ')}
            </span>
            {isContacted && (
                 <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3" /> {t.contacted}
                 </span>
            )}
        </div>

        <div className="h-px bg-nexus-sandLight my-2"></div>

        {/* Data Rows */}
        <div className="space-y-2.5">
            {/* Location */}
            <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-nexus-warmGray mt-0.5 shrink-0" />
                <div className="flex flex-col">
                    <span 
                        className="text-xs font-medium text-nexus-charcoal line-clamp-2" 
                        title={company.endereco}
                    >
                        {company.endereco || company.cidade}
                    </span>
                    {!company.endereco && company.bairro && <span className="text-[10px] text-nexus-warmGray">{company.bairro}</span>}
                </div>
            </div>

            {/* Phone & WhatsApp */}
             <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-nexus-warmGray shrink-0" />
                <span className="text-xs font-medium text-nexus-charcoal select-all truncate">
                    {company.telefone || <span className="text-nexus-warmGray italic">--</span>}
                </span>
                {company.telefone && (
                    <button 
                        onClick={(e) => openWhatsApp(e, company.telefone!)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors ml-auto flex items-center gap-1 text-[10px] font-bold border border-transparent hover:border-green-200"
                        title="Conversar no WhatsApp"
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden group-hover:inline">WhatsApp</span>
                    </button>
                )}
            </div>

            {/* Website */}
            <div className="flex items-center gap-3">
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

            {/* Hours */}
            <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-nexus-warmGray shrink-0" />
                <span className="text-xs text-nexus-charcoal truncate">
                    {company.opening_hours || <span className="text-nexus-warmGray italic">{t.hours_unavailable}</span>}
                </span>
            </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-4 mt-2 border-t border-nexus-sandLight bg-nexus-offWhite flex items-center justify-between">
          
          <div className="flex items-center gap-2">
             {/* Contacted Toggle */}
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
             {/* Create Deal Button */}
             {onAddToPipeline && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddToPipeline(company); }}
                  className="p-1.5 bg-nexus-surface border border-nexus-sand text-nexus-warmGray hover:text-nexus-royal hover:border-nexus-royal rounded shadow-subtle transition-all"
                  title="Criar Negócio no Pipeline"
                >
                    <Kanban className="w-3.5 h-3.5" />
                </button>
             )}

            {/* Save List Button */}
            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSaveClick(company); }}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded transition-all border shadow-subtle ${
                    isSaved 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                    : 'bg-nexus-surface text-nexus-royal border-nexus-sand hover:border-nexus-royal hover:bg-nexus-accent'
                }`}>
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
