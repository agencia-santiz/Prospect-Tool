
import React, { useState } from 'react';
import { X, LayoutTemplate, CheckSquare, Square, GitBranch, Plus, Trash2, Edit2, ChevronRight, GripVertical, Palette, Check } from 'lucide-react';
import { CardVisibilityConfig, Pipeline, PipelineStage } from '../types';
import { STAGE_COLORS } from '../constants';
import ModalShell from './ModalShell';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardConfig: CardVisibilityConfig;
  onUpdateCardConfig: (key: keyof CardVisibilityConfig) => void;
  pipelines: Pipeline[];
  setPipelines: (pipelines: Pipeline[]) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  cardConfig, 
  onUpdateCardConfig,
  pipelines,
  setPipelines
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'stages'>('stages');
  const [expandedColorPicker, setExpandedColorPicker] = useState<string | null>(null);

  if (!isOpen) return null;

  // Since we only have one pipeline now, we always edit the first one
  const activePipeline = pipelines[0];

  const updatePipelineName = (name: string) => {
      const updated = pipelines.map(p => p.id === activePipeline.id ? { ...p, name } : p);
      setPipelines(updated);
  };

  const updateStage = (stageId: string, updates: Partial<PipelineStage>) => {
      const newStages = activePipeline.stages.map(s => s.id === stageId ? { ...s, ...updates } : s);
      const updated = pipelines.map(p => p.id === activePipeline.id ? { ...p, stages: newStages } : p);
      setPipelines(updated);
  };

  const addStage = () => {
      const newStage: PipelineStage = {
          id: crypto.randomUUID(),
          name: 'Nova Etapa',
          color: STAGE_COLORS[0]
      };
      const updated = pipelines.map(p => 
          p.id === activePipeline.id ? { ...p, stages: [...p.stages, newStage] } : p
      );
      setPipelines(updated);
  };

  const removeStage = (stageId: string) => {
       if (activePipeline.stages.length <= 1) return;
       const updated = pipelines.map(p => 
          p.id === activePipeline.id ? { ...p, stages: p.stages.filter(s => s.id !== stageId) } : p
      );
      setPipelines(updated);
  };

  // --- Render Helpers ---

  const OptionRow = ({ label, configKey }: { label: string, configKey: keyof CardVisibilityConfig }) => (
      <div 
        onClick={() => onUpdateCardConfig(configKey)}
        className="flex items-center justify-between p-3 rounded border border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors group"
      >
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {cardConfig[configKey] ? (
              <CheckSquare className="w-5 h-5 text-nexus-royal" />
          ) : (
              <Square className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
          )}
      </div>
  );

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName="z-[1400] bg-nexus-sidebar/80"
      panelClassName="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh]"
    >
        
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
            <h2 className="text-lg font-bold text-nexus-dark flex items-center gap-2">
                Configurações do Funil
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 shrink-0 bg-white">
            <button 
                onClick={() => setActiveTab('stages')}
                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'stages' ? 'border-nexus-royal text-nexus-royal' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <GitBranch className="w-4 h-4" /> Etapas do Funil
            </button>
            <button 
                onClick={() => setActiveTab('view')}
                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'view' ? 'border-nexus-royal text-nexus-royal' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                Visualização do Cartão
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-gray-50/50">
            
            {/* STAGES CONFIG TAB */}
            {activeTab === 'stages' && (
                <div className="flex-1 overflow-y-auto p-8 h-full">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nome do Funil</label>
                            <input 
                                type="text" 
                                value={activePipeline.name}
                                onChange={(e) => updatePipelineName(e.target.value)}
                                className="w-full text-lg font-bold text-nexus-dark border-b border-gray-300 focus:border-nexus-royal outline-none py-1 bg-transparent placeholder-gray-300"
                                placeholder="Ex: Funil de Vendas Padrão"
                            />
                        </div>

                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <GitBranch className="w-4 h-4 text-nexus-royal" />
                                Etapas ({activePipeline.stages.length})
                            </h3>
                            <button 
                                onClick={addStage}
                                className="text-xs font-bold text-nexus-royal bg-white border border-nexus-royal/20 px-3 py-1.5 rounded hover:bg-blue-50 flex items-center gap-1 shadow-sm transition-all"
                            >
                                <Plus className="w-3 h-3" /> Adicionar Etapa
                            </button>
                        </div>

                        <div className="space-y-3">
                            {activePipeline.stages.map((stage, index) => (
                                <div key={stage.id} className="bg-white p-4 rounded border border-gray-200 shadow-sm group transition-all hover:border-nexus-royal/30">
                                    <div className="flex items-center gap-4">
                                        <div className="text-gray-300 cursor-grab hover:text-gray-500">
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                        
                                        {/* Color Picker - INLINE */}
                                        <div className="relative">
                                            <button 
                                                onClick={() => setExpandedColorPicker(expandedColorPicker === stage.id ? null : stage.id)}
                                                className="w-6 h-6 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-nexus-royal"
                                                style={{ backgroundColor: stage.color }}
                                                title="Mudar Cor"
                                            ></button>
                                        </div>

                                        <div className="flex-1">
                                             <input 
                                                type="text" 
                                                value={stage.name}
                                                onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                                                className="w-full text-sm font-bold text-gray-700 outline-none border-b border-transparent focus:border-nexus-royal bg-transparent transition-colors"
                                                placeholder="Nome da etapa"
                                            />
                                        </div>

                                        <button 
                                            onClick={() => removeStage(stage.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded"
                                            title="Remover Etapa"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Inline Color Palette */}
                                    {expandedColorPicker === stage.id && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn flex items-center gap-2 overflow-x-auto pb-1">
                                            <span className="text-[10px] text-gray-400 font-bold uppercase mr-2">Cor:</span>
                                            {STAGE_COLORS.map(c => (
                                                <button 
                                                    key={c}
                                                    onClick={() => { updateStage(stage.id, { color: c }); setExpandedColorPicker(null); }}
                                                    className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center shrink-0 ${stage.color === c ? 'border-gray-400 scale-110 ring-1 ring-gray-300' : 'border-gray-100 hover:scale-110'}`}
                                                    style={{ backgroundColor: c }}
                                                >
                                                    {stage.color === c && <Check className="w-3 h-3 text-gray-600/50" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW CONFIG TAB */}
            {activeTab === 'view' && (
                <div className="p-8 h-full overflow-y-auto">
                    <div className="max-w-lg mx-auto">
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-nexus-slate uppercase tracking-wider mb-3 flex items-center gap-2">
                                <LayoutTemplate className="w-4 h-4" /> Personalizar Cartões
                            </h3>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                                Escolha quais informações aparecem nos cartões do Pipeline para otimizar a visualização e focar no que importa.
                            </p>

                            <div className="space-y-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <OptionRow label="ID do Negócio" configKey="showId" />
                                <OptionRow label="Valor Estimado" configKey="showValue" />
                                <OptionRow label="Prioridade" configKey="showPriority" />
                                <OptionRow label="Data de Criação" configKey="showDate" />
                                <OptionRow label="Telefone e Website" configKey="showContactInfo" />
                                <OptionRow label="Localização" configKey="showLocation" />
                                <OptionRow label="Tags / Campos Personalizados" configKey="showTags" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end shrink-0">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-nexus-royal text-white text-sm font-bold rounded shadow-sm hover:bg-blue-700 transition-colors"
            >
                Concluir
            </button>
        </div>
    </ModalShell>
  );
};

export default SettingsModal;
