import React, { useState } from 'react';
import { Pipeline, Deal, CardVisibilityConfig } from '../types';
import { Plus, MoreHorizontal, Calendar, Phone, Globe, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/estimation';
import { NextActionBlock, StatusBadge, getDealAgeInfo, getDealPriorityInfo } from './dealWidgets';
import BloomBadge from './ui/badge';
import BloomButton from './ui/button';
import BloomCard from './ui/card';

interface PipelineBoardProps {
  pipeline: Pipeline;
  deals: Deal[];
  onDealMove: (dealId: string, newStageId: string) => void;
  onDealClick: (deal: Deal) => void;
  onAddDeal: (stageId: string) => void;
  cardConfig: CardVisibilityConfig;
  workspaceMembers: Array<{
    userId: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  }>;
}

const PipelineBoard: React.FC<PipelineBoardProps> = ({
  pipeline,
  deals,
  onDealMove,
  onDealClick,
  onAddDeal,
  cardConfig,
  workspaceMembers,
}) => {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedDealId(null);
    setDragOverStageId(null);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();

    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId);
    }
  };

  const handleDragLeave = () => {
    setDragOverStageId(null);
  };

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStageId(null);

    if (draggedDealId) {
      onDealMove(draggedDealId, stageId);
    }

    handleDragEnd();
  };

  const getStageSummary = (stageId: string) => {
    const stageDeals = deals.filter((deal) => deal.stageId === stageId && deal.pipelineId === pipeline.id);
    const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    return { count: stageDeals.length, value: totalValue };
  };

  const getOwnerLabel = (deal: Deal) => {
    if (!deal.ownerUserId) return null;
    const member = workspaceMembers.find((item) => item.userId === deal.ownerUserId);
    if (!member) return null;
    return `${member.name} (Vendedor)`;
  };

  const getCustomFieldValue = (deal: Deal, label: string) => {
    const field = deal.customFields.find((customField) => customField.label.toLowerCase() === label.toLowerCase());
    return field?.value || '';
  };

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden pb-4">
      <div className="flex h-full min-w-max gap-4 px-1">
        {pipeline.stages.map((stage) => {
          const stageDeals = deals.filter((deal) => deal.stageId === stage.id && deal.pipelineId === pipeline.id);
          const summary = getStageSummary(stage.id);
          const isOver = dragOverStageId === stage.id;
          const summaryLabel =
            summary.count === 0
              ? 'Sem negócios nesta etapa'
              : `${summary.count} negócio${summary.count === 1 ? '' : 's'} • ${formatCurrency(summary.value)}`;

          return (
            <BloomCard
              key={stage.id}
              className={`flex w-80 max-w-xs flex-col overflow-hidden transition-all duration-200 ${
                isOver ? 'border-nexus-royal/30 bg-nexus-accent/25 ring-2 ring-nexus-royal/20' : 'border-nexus-border bg-white'
              }`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="shrink-0 border-b border-nexus-border bg-nexus-offWhite p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
                      Etapa
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="min-w-0 truncate text-sm font-bold text-nexus-charcoal">{stage.name}</span>
                      <BloomBadge variant="neutral" className="shrink-0 uppercase tracking-[0.14em]">
                        {summary.count}
                      </BloomBadge>
                    </div>
                    <p className="mt-1 text-xs text-nexus-warmGray">{summaryLabel}</p>
                  </div>

                  <MoreHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-nexus-warmGray" aria-hidden="true" />
                </div>

                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-nexus-sandLight">
                  <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: stage.color }} />
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-3 custom-scrollbar">
                {stageDeals.map((deal) => {
                  const ageInfo = getDealAgeInfo(deal);
                  const priorityInfo = getDealPriorityInfo(deal.priority);
                  const ownerLabel = getOwnerLabel(deal);
                  const sourceField = getCustomFieldValue(deal, 'Source');
                  const industryField = getCustomFieldValue(deal, 'Industry');
                  const visibleCustomFields = deal.customFields.filter((field) => {
                    const label = field.label.toLowerCase();
                    return label !== 'source' && label !== 'industry';
                  });

                  return (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onDealClick(deal)}
                      className={`group relative cursor-grab rounded-[18px] border border-[#2a2c44] bg-gradient-to-br from-[#17192f] via-[#121628] to-[#0f1322] p-3.5 text-white shadow-[0_18px_30px_rgba(8,10,22,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_38px_rgba(8,10,22,0.24)] active:cursor-grabbing ${
                        draggedDealId === deal.id ? 'scale-95 rotate-1 opacity-50' : 'opacity-100'
                      }`}
                      style={{ borderLeftColor: stage.color }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex-1 text-[13px] font-medium leading-snug text-white line-clamp-2">
                          {deal.companyName}
                        </span>
                        {ownerLabel && (
                          <span className="shrink-0 rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] font-medium text-white/75">
                            {ownerLabel}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {cardConfig.showContactInfo && deal.contactInfo?.phone && (
                          <span className="inline-flex max-w-full items-center gap-1 rounded-lg border border-white/10 bg-white/8 px-2 py-1 text-[10px] text-white/80">
                            <Phone className="h-3 w-3 shrink-0 opacity-80" />
                            <span className="truncate">{deal.contactInfo.phone}</span>
                          </span>
                        )}
                        {cardConfig.showContactInfo && deal.contactInfo?.website && (
                          <span className="inline-flex max-w-full items-center gap-1 rounded-lg border border-white/10 bg-white/8 px-2 py-1 text-[10px] text-white/80">
                            <Globe className="h-3 w-3 shrink-0 opacity-80" />
                            <span className="truncate">{deal.contactInfo.website}</span>
                          </span>
                        )}
                      </div>

                      {cardConfig.showLocation && deal.contactInfo?.location && (
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/55 line-clamp-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{deal.contactInfo.location}</span>
                        </div>
                      )}

                      {(sourceField || industryField || (cardConfig.showTags && visibleCustomFields.length > 0)) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {sourceField && (
                            <span className="rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] text-white/80">
                              {sourceField}
                            </span>
                          )}
                          {industryField && (
                            <span className="rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] text-white/80">
                              {industryField}
                            </span>
                          )}
                          {cardConfig.showTags &&
                            visibleCustomFields.slice(0, 1).map((field) => (
                              <span
                                key={`${deal.id}-${field.label}`}
                                className="max-w-full truncate rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] text-white/80"
                              >
                                {field.label}: {field.value}
                              </span>
                            ))}
                          {cardConfig.showTags && visibleCustomFields.length > 1 && (
                            <span className="rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] text-white/55">
                              +{visibleCustomFields.length - 1}
                            </span>
                          )}
                        </div>
                      )}

                      <NextActionBlock
                        action={deal.nextStep}
                        fallback="Próxima ação ainda não definida."
                        ageLabel={ageInfo.label}
                        ageTone={ageInfo.tone}
                        className="mt-3"
                        variant="dark"
                      />

                      {(cardConfig.showValue || cardConfig.showPriority) && (
                        <div className="mt-3 flex items-center justify-between gap-2">
                          {cardConfig.showValue ? (
                            <span className="rounded-full border border-white/10 bg-white/8 px-2 py-1 text-xs font-bold text-white">
                              {formatCurrency(deal.value)}
                            </span>
                          ) : (
                            <span />
                          )}

                          {cardConfig.showPriority && (
                            <StatusBadge
                              tone={priorityInfo.tone}
                              label={priorityInfo.label.replace('Prioridade ', '')}
                              icon={priorityInfo.icon}
                              className="border-white/10 bg-white/8 text-white/85 capitalize"
                            />
                          )}
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/55">
                        <span className="flex min-h-4 items-center gap-1">
                          {cardConfig.showDate && (
                            <>
                              <Calendar className="h-3 w-3" /> {new Date(deal.createdAt).toLocaleDateString('pt-BR')}
                            </>
                          )}
                        </span>
                        <div className="h-5 w-5 rounded-full bg-[#ef1958] text-[8px] font-bold text-white flex items-center justify-center">
                          {deal.companyName.charAt(0)}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {stageDeals.length === 0 && (
                  <div
                    className={`flex h-24 flex-col items-center justify-center rounded-2xl border border-dashed px-4 text-center text-xs italic transition-colors ${
                      isOver ? 'border-nexus-royal bg-nexus-accent/20 text-nexus-royal' : 'border-nexus-border bg-nexus-bg text-nexus-warmGray'
                    }`}
                  >
                    <span className="text-sm font-semibold not-italic text-nexus-charcoal">
                      Solte negócios aqui
                    </span>
                    <span className="mt-1 not-italic">
                      ou clique em <span className="font-semibold text-nexus-charcoal">Novo negócio</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-nexus-border p-3">
                <BloomButton
                  onClick={() => onAddDeal(stage.id)}
                  variant="secondary"
                  size="sm"
                  fullWidth
                  className="justify-center"
                >
                  <Plus className="h-3.5 w-3.5" /> Novo negócio
                </BloomButton>
              </div>
            </BloomCard>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineBoard;
