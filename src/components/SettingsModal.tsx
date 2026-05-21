import React, { useState } from 'react';
import { X, LayoutTemplate, CheckSquare, Square, GitBranch, Plus, Trash2, GripVertical, Check } from 'lucide-react';
import { CardVisibilityConfig, Pipeline, PipelineStage } from '../types';
import { STAGE_COLORS } from '../constants';
import ModalShell from './ModalShell';
import BloomButton from './ui/button';
import BloomCard from './ui/card';
import BloomInput from './ui/input';
import { BloomTabsList, BloomTab } from './ui/tabs';

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
  setPipelines,
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'stages'>('stages');
  const [expandedColorPicker, setExpandedColorPicker] = useState<string | null>(null);

  if (!isOpen) return null;

  const activePipeline = pipelines[0];

  const updatePipelineName = (name: string) => {
    const updated = pipelines.map((p) => (p.id === activePipeline.id ? { ...p, name } : p));
    setPipelines(updated);
  };

  const updateStage = (stageId: string, updates: Partial<PipelineStage>) => {
    const newStages = activePipeline.stages.map((s) => (s.id === stageId ? { ...s, ...updates } : s));
    const updated = pipelines.map((p) => (p.id === activePipeline.id ? { ...p, stages: newStages } : p));
    setPipelines(updated);
  };

  const addStage = () => {
    const newStage: PipelineStage = {
      id: crypto.randomUUID(),
      name: 'Nova Etapa',
      color: STAGE_COLORS[0],
    };
    const updated = pipelines.map((p) => (p.id === activePipeline.id ? { ...p, stages: [...p.stages, newStage] } : p));
    setPipelines(updated);
  };

  const removeStage = (stageId: string) => {
    if (activePipeline.stages.length <= 1) return;
    const updated = pipelines.map((p) =>
      p.id === activePipeline.id ? { ...p, stages: p.stages.filter((s) => s.id !== stageId) } : p,
    );
    setPipelines(updated);
  };

  const OptionRow = ({ label, configKey }: { label: string; configKey: keyof CardVisibilityConfig }) => (
    <div
      onClick={() => onUpdateCardConfig(configKey)}
      className="flex cursor-pointer items-center justify-between rounded-lg border border-nexus-border p-3 transition-colors hover:bg-nexus-bg"
    >
      <span className="text-sm font-medium text-nexus-charcoal">{label}</span>
      {cardConfig[configKey] ? (
        <CheckSquare className="w-5 h-5 text-nexus-royal" />
      ) : (
        <Square className="w-5 h-5 text-nexus-sand group-hover:text-nexus-warmGray" />
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
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-nexus-dark">
          Configurações do Funil
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex shrink-0 border-b border-gray-200 bg-white px-6">
        <BloomTabsList className="border-0 bg-transparent p-0">
          <BloomTab
            value="stages"
            activeValue={activeTab}
            onClick={() => setActiveTab('stages')}
            className="gap-2 rounded-t-none border-b-2 border-transparent px-4 py-3"
          >
            <GitBranch className="w-4 h-4" /> Etapas do Funil
          </BloomTab>
          <BloomTab
            value="view"
            activeValue={activeTab}
            onClick={() => setActiveTab('view')}
            className="rounded-t-none border-b-2 border-transparent px-4 py-3"
          >
            Visualização do Cartão
          </BloomTab>
        </BloomTabsList>
      </div>

      <div className="flex-1 overflow-hidden bg-gray-50/50">
        {activeTab === 'stages' && (
          <div className="h-full overflow-y-auto p-8">
            <div className="mx-auto max-w-2xl">
              <BloomCard className="mb-6 p-6">
                <label className="mb-2 block text-xs font-bold uppercase text-gray-400">Nome do Funil</label>
                <BloomInput
                  type="text"
                  value={activePipeline.name}
                  onChange={(e) => updatePipelineName(e.target.value)}
                  className="h-11 rounded-none border-0 border-b border-gray-300 px-0 text-lg font-bold shadow-none focus:border-nexus-royal"
                  placeholder="Ex: Funil de Vendas Padrão"
                />
              </BloomCard>

              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <GitBranch className="w-4 h-4 text-nexus-royal" />
                  Etapas ({activePipeline.stages.length})
                </h3>
                <BloomButton onClick={addStage} variant="secondary" size="sm" className="gap-1">
                  <Plus className="w-3 h-3" /> Adicionar Etapa
                </BloomButton>
              </div>

              <div className="space-y-3">
                {activePipeline.stages.map((stage) => (
                  <BloomCard key={stage.id} className="p-4 transition-all hover:border-nexus-royal/30">
                    <div className="flex items-center gap-4">
                      <div className="cursor-grab text-gray-300 hover:text-gray-500">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <div className="relative">
                        <button
                          onClick={() => setExpandedColorPicker(expandedColorPicker === stage.id ? null : stage.id)}
                          className="h-6 w-6 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-nexus-royal"
                          style={{ backgroundColor: stage.color }}
                          title="Mudar Cor"
                        />
                      </div>

                      <div className="flex-1">
                        <BloomInput
                          type="text"
                          value={stage.name}
                          onChange={(e) => updateStage(stage.id, { name: e.target.value })}
                          className="h-10 rounded-none border-0 border-b border-transparent px-0 text-sm font-bold shadow-none focus:border-nexus-royal"
                          placeholder="Nome da etapa"
                        />
                      </div>

                      <button
                        onClick={() => removeStage(stage.id)}
                        className="rounded p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                        title="Remover Etapa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {expandedColorPicker === stage.id && (
                      <div className="mt-3 flex items-center gap-2 overflow-x-auto border-t border-gray-100 pb-1 pt-3 animate-fadeIn">
                        <span className="mr-2 text-[10px] font-bold uppercase text-gray-400">Cor:</span>
                        {STAGE_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              updateStage(stage.id, { color: c });
                              setExpandedColorPicker(null);
                            }}
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                              stage.color === c ? 'scale-110 border-gray-400 ring-1 ring-gray-300' : 'border-gray-100 hover:scale-110'
                            }`}
                            style={{ backgroundColor: c }}
                          >
                            {stage.color === c && <Check className="w-3 h-3 text-gray-600/50" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </BloomCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'view' && (
          <div className="h-full overflow-y-auto p-8">
            <div className="mx-auto max-w-lg">
              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-nexus-slate">
                  <LayoutTemplate className="w-4 h-4" /> Personalizar Cartões
                </h3>
                <p className="mb-6 text-xs leading-relaxed text-gray-500">
                  Escolha quais informações aparecem nos cartões do Pipeline para otimizar a visualização e focar no que importa.
                </p>

                <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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

      <div className="flex shrink-0 justify-end border-t border-gray-200 bg-gray-50 p-4">
        <BloomButton onClick={onClose} variant="primary" size="sm">
          Concluir
        </BloomButton>
      </div>
    </ModalShell>
  );
};

export default SettingsModal;
