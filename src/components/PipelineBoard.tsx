
import React, { useState } from 'react';
import { Pipeline, Deal, CardVisibilityConfig } from '../types';
import { Plus, MoreHorizontal, Calendar, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/estimation';

interface PipelineBoardProps {
  pipeline: Pipeline;
  deals: Deal[];
  onDealMove: (dealId: string, newStageId: string) => void;
  onDealClick: (deal: Deal) => void;
  onAddDeal: (stageId: string) => void;
  cardConfig: CardVisibilityConfig;
}

const PipelineBoard: React.FC<PipelineBoardProps> = ({ 
  pipeline, 
  deals, 
  onDealMove,
  onDealClick,
  onAddDeal,
  cardConfig
}) => {
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    setDraggedDealId(dealId);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent ghost image or custom logic could go here
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault(); // Necessary to allow dropping
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
      setDraggedDealId(null);
    }
  };

  // Calculate totals per stage
  const getStageSummary = (stageId: string) => {
      const stageDeals = deals.filter(d => d.stageId === stageId && d.pipelineId === pipeline.id);
      const totalValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);
      return { count: stageDeals.length, value: totalValue };
  };

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden pb-4">
      <div className="flex h-full gap-4 min-w-max px-1">
        {pipeline.stages.map((stage) => {
          const stageDeals = deals.filter(deal => deal.stageId === stage.id && deal.pipelineId === pipeline.id);
          const summary = getStageSummary(stage.id);
          const isOver = dragOverStageId === stage.id;

          return (
            <div 
              key={stage.id}
              className={`flex flex-col w-80 max-w-xs rounded-xl transition-colors duration-200 ${isOver ? 'bg-nexus-accent ring-2 ring-nexus-royal/20' : 'bg-nexus-sandLight/50'}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-nexus-sand/50 shrink-0 bg-nexus-surface/40 rounded-t-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                     <span className="font-bold text-sm text-nexus-dark uppercase tracking-tight">{stage.name}</span>
                     <span className="bg-nexus-sandLight text-nexus-charcoal px-1.5 py-0.5 rounded text-[10px] font-bold">{summary.count}</span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-nexus-warmGray cursor-pointer hover:text-nexus-dark" />
                </div>
                <div className="h-1 w-full rounded-full bg-nexus-sandLight overflow-hidden mb-2">
                    <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: stage.color }}></div>
                </div>
                <div className="text-xs text-nexus-warmGray font-medium">
                   {formatCurrency(summary.value)}
                </div>
              </div>

              {/* Deals Container */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    onClick={() => onDealClick(deal)}
                    className={`bg-nexus-surface p-3 rounded-lg border border-nexus-sand shadow-subtle cursor-grab active:cursor-grabbing hover:shadow-card-hover transition-all group relative border-l-4 ${draggedDealId === deal.id ? 'opacity-50 rotate-3 scale-95' : 'opacity-100'}`}
                    style={{ borderLeftColor: stage.color }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-sm font-bold text-nexus-dark line-clamp-2 leading-tight flex-1">
                            {deal.companyName}
                        </span>
                        {cardConfig.showId && (
                            <span className="shrink-0 text-[10px] font-bold text-nexus-warmGray bg-nexus-sandLight px-1.5 py-0.5 rounded border border-nexus-sand/50">
                                #{deal.id.slice(-6).toUpperCase()}
                            </span>
                        )}
                    </div>

                    {cardConfig.showContactInfo && (deal.contactInfo?.phone || deal.contactInfo?.email || deal.contactInfo?.website) && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            {deal.contactInfo?.phone && (
                                <span className="text-[10px] px-2 py-0.5 rounded border border-nexus-sand/60 bg-nexus-sandLight text-nexus-charcoal truncate max-w-full">
                                    {deal.contactInfo.phone}
                                </span>
                            )}
                            {deal.contactInfo?.email && (
                                <span className="text-[10px] px-2 py-0.5 rounded border border-nexus-sand/60 bg-nexus-sandLight text-nexus-charcoal truncate max-w-full">
                                    {deal.contactInfo.email}
                                </span>
                            )}
                            {deal.contactInfo?.website && (
                                <span className="text-[10px] px-2 py-0.5 rounded border border-nexus-sand/60 bg-nexus-sandLight text-nexus-charcoal truncate max-w-full">
                                    {deal.contactInfo.website}
                                </span>
                            )}
                        </div>
                    )}

                    {cardConfig.showLocation && deal.contactInfo?.location && (
                        <div className="mt-2 text-[10px] text-nexus-warmGray line-clamp-1">
                            {deal.contactInfo.location}
                        </div>
                    )}

                    {cardConfig.showTags && deal.customFields.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {deal.customFields.slice(0, 3).map((field) => (
                                <span
                                    key={`${deal.id}-${field.label}`}
                                    className="text-[10px] px-2 py-0.5 rounded-full border border-nexus-sand bg-white text-nexus-charcoal truncate max-w-full"
                                >
                                    {field.label}: {field.value}
                                </span>
                            ))}
                        </div>
                    )}

                    {(cardConfig.showValue || (cardConfig.showPriority && deal.priority === 'HIGH')) && (
                        <div className="flex items-center justify-between mt-3">
                            {cardConfig.showValue ? (
                                <span className="text-xs font-bold text-nexus-charcoal bg-nexus-sandLight px-2 py-1 rounded border border-nexus-sand/50">
                                   {formatCurrency(deal.value)}
                                </span>
                            ) : <span />}

                            {cardConfig.showPriority && deal.priority === 'HIGH' && (
                                 <AlertCircle className="w-4 h-4 text-nexus-royal" title="Alta Prioridade" />
                            )}
                        </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-nexus-sandLight flex items-center justify-between text-[10px] text-nexus-warmGray">
                        <span className="flex items-center gap-1 min-h-4">
                            {cardConfig.showDate && (
                                <>
                                    <Calendar className="w-3 h-3" /> {new Date(deal.createdAt).toLocaleDateString('pt-BR')}
                                </>
                            )}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-nexus-royal text-white flex items-center justify-center font-bold text-[8px]">
                            {deal.companyName.charAt(0)}
                        </div>
                    </div>
                  </div>
                ))}
                
                {/* Empty State / Drop Target Hint */}
                {stageDeals.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-nexus-sand rounded-lg flex items-center justify-center text-nexus-warmGray text-xs italic">
                        Arraste negócios aqui
                    </div>
                )}
              </div>

              {/* Add Button */}
              <div className="p-2 pt-0 shrink-0">
                  <button 
                    onClick={() => onAddDeal(stage.id)}
                    className="w-full py-2 flex items-center justify-center gap-1 text-xs font-bold text-nexus-warmGray hover:text-nexus-royal hover:bg-nexus-surface rounded transition-colors"
                  >
                      <Plus className="w-3.5 h-3.5" /> Novo Negócio
                  </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineBoard;
