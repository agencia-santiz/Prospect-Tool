import React, { useEffect, useState } from 'react';
import { translations, Language } from '../utils/i18n';
import { X, Save, FolderOpen } from 'lucide-react';
import BloomButton from './ui/button';
import BloomCard from './ui/card';
import BloomInput from './ui/input';

interface SelectListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newListName: string, groupName?: string) => void;
  lang: Language;
}

const SelectListModal: React.FC<SelectListModalProps> = ({ isOpen, onClose, onConfirm, lang }) => {
  const t = translations[lang];
  const [newListName, setNewListName] = useState('');
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setNewListName('');
      setGroupName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newListName.trim();
    if (!trimmedName) return;

    onConfirm(trimmedName, groupName.trim() || undefined);
    setNewListName('');
    setGroupName('');
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-nexus-sidebar/80 backdrop-blur-sm animate-fadeIn p-4">
      <BloomCard className="relative w-full max-w-md p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-nexus-warmGray hover:text-nexus-dark"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-nexus-sidebar">
          <FolderOpen className="h-5 w-5 text-nexus-primary" />
          Salvar lead
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 ml-1 block text-xs font-bold uppercase text-nexus-slate">
              Nome da lista
            </label>
            <BloomInput
              autoFocus
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Ex: Padarias SP"
            />
          </div>

          <div>
            <label className="mb-2 ml-1 block text-xs font-bold uppercase text-nexus-slate">
              Grupo da lista
            </label>
            <BloomInput
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Alimentacao"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-nexus-sandLight pt-4">
            <BloomButton type="button" onClick={onClose} variant="secondary" size="sm">
              {t.actions_cancel}
            </BloomButton>
            <BloomButton
              type="submit"
              disabled={!newListName.trim()}
              variant="primary"
              size="sm"
              className="flex items-center gap-2 uppercase tracking-wide"
            >
              <Save className="h-4 w-4" />
              Salvar lista
            </BloomButton>
          </div>
        </form>
      </BloomCard>
    </div>
  );
};

export default SelectListModal;
