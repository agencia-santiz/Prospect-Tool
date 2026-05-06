
import React, { useState, useEffect } from 'react';
import { Pipeline, Company } from '../types';
import { Kanban, X, Check } from 'lucide-react';

interface AddToPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pipelineId: string) => void;
  pipelines: Pipeline[];
  company: Company | null;
}

const AddToPipelineModal: React.FC<AddToPipelineModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  pipelines,
  company
}) => {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');

  useEffect(() => {
    if (pipelines.length > 0) {
      // Default to the first pipeline or the default one
      const defaultPipe = pipelines.find(p => p.isDefault) || pipelines[0];
      setSelectedPipelineId(defaultPipe.id);
    }
  }, [pipelines, isOpen]);

  if (!isOpen || !company) return null;

  const handleSubmit = () => {
    if (selectedPipelineId) {
      onConfirm(selectedPipelineId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-nexus-sidebar/80 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-nexus-surface rounded-xl shadow-float w-full max-w-md border border-nexus-sand overflow-hidden">
        <div className="p-5 border-b border-nexus-sandLight flex justify-between items-center bg-nexus-offWhite">
          <div>
            <h3 className="font-bold text-nexus-dark text-lg">Adicionar ao Pipeline</h3>
            <p className="text-xs text-nexus-warmGray mt-1">Empresa: <span className="font-semibold text-nexus-royal">{company.nome_fantasia}</span></p>
          </div>
          <button onClick={onClose} className="text-nexus-warmGray hover:text-nexus-charcoal transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <label className="block text-xs font-bold text-nexus-warmGray uppercase tracking-wide mb-2">
            Escolha o Funil de Destino
          </label>
          <div className="space-y-2">
            {pipelines.map((pipeline) => (
              <label 
                key={pipeline.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedPipelineId === pipeline.id 
                    ? 'border-nexus-royal bg-nexus-accent ring-1 ring-nexus-royal' 
                    : 'border-nexus-sand hover:border-nexus-charcoal hover:bg-nexus-sandLight'
                }`}
              >
                <input
                  type="radio"
                  name="pipeline_select"
                  value={pipeline.id}
                  checked={selectedPipelineId === pipeline.id}
                  onChange={(e) => setSelectedPipelineId(e.target.value)}
                  className="w-4 h-4 text-nexus-royal border-gray-300 focus:ring-nexus-royal"
                />
                <div className="flex-1">
                  <div className="font-bold text-sm text-nexus-dark">{pipeline.name}</div>
                  <div className="text-xs text-nexus-warmGray">{pipeline.stages.length} etapas</div>
                </div>
                {selectedPipelineId === pipeline.id && <Check className="w-4 h-4 text-nexus-royal" />}
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-nexus-sandLight bg-nexus-offWhite flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-nexus-charcoal hover:bg-nexus-sandLight rounded transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-nexus-royal text-white text-sm font-bold rounded shadow-sm hover:bg-nexus-crimsonLight transition-colors flex items-center gap-2"
          >
            <Kanban className="w-4 h-4" />
            Criar Negócio
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToPipelineModal;
