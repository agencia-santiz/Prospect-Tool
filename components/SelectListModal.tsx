import React, { useState } from 'react';
import { SavedList } from '../types';
import { translations, Language } from '../utils/i18n';
import { FolderOpen, Plus, X, Save } from 'lucide-react';

interface SelectListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (listId: string | 'NEW', newListName?: string) => void;
  savedLists: SavedList[];
  lang: Language;
}

const SelectListModal: React.FC<SelectListModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  savedLists, 
  lang 
}) => {
  const t = translations[lang];
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [newListName, setNewListName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListId) return;
    
    if (selectedListId === 'NEW' && !newListName.trim()) {
      return;
    }

    onConfirm(selectedListId, newListName);
    // Reset
    setSelectedListId('');
    setNewListName('');
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-nexus-sidebar/80 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-nexus-surface rounded-[10px] p-6 w-full max-w-md shadow-float border border-nexus-sand relative">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-nexus-warmGray hover:text-nexus-dark"
        >
            <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-nexus-sidebar mb-6 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-nexus-primary" />
            {t.select_list_title}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-xs font-bold text-nexus-slate uppercase mb-2 ml-1">
                 {t.select_list_placeholder}
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <label 
                     className={`flex items-center gap-3 p-3 rounded-[10px] border cursor-pointer transition-all ${selectedListId === 'NEW' ? 'bg-nexus-primary/10 border-nexus-primary' : 'bg-white border-nexus-border/30 hover:bg-nexus-bg'}`}
                  >
                     <input 
                       type="radio" 
                       name="listSelect" 
                       value="NEW" 
                       checked={selectedListId === 'NEW'}
                       onChange={(e) => setSelectedListId(e.target.value)}
                       className="w-4 h-4 text-nexus-primary border-gray-300 focus:ring-nexus-primary"
                     />
                     <span className="text-sm font-bold text-nexus-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> {t.create_new_list}
                     </span>
                  </label>

                  {savedLists.map(list => (
                     <label 
                        key={list.id}
                        className={`flex items-center gap-3 p-3 rounded-[10px] border cursor-pointer transition-all ${selectedListId === list.id ? 'bg-nexus-slate/10 border-nexus-slate' : 'bg-white border-nexus-border/30 hover:bg-nexus-bg'}`}
                     >
                        <input 
                          type="radio" 
                          name="listSelect" 
                          value={list.id} 
                          checked={selectedListId === list.id}
                          onChange={(e) => setSelectedListId(e.target.value)}
                          className="w-4 h-4 text-nexus-primary border-gray-300 focus:ring-nexus-primary"
                        />
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-nexus-sidebar">{list.name}</span>
                           <span className="text-[10px] text-nexus-slate">{list.leads.length} Leads • {list.createdAt}</span>
                        </div>
                     </label>
                  ))}
              </div>
           </div>

           {selectedListId === 'NEW' && (
              <div className="animate-fadeIn">
                 <label className="block text-xs font-bold text-nexus-slate uppercase mb-2 ml-1">
                    {t.new_list_name}
                 </label>
                 <input 
                    autoFocus
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Ex: Startups SP"
                    className="w-full p-3 border border-nexus-border/30 rounded-[10px] focus:border-nexus-primary outline-none font-medium text-nexus-sidebar bg-nexus-bg/20"
                 />
              </div>
           )}

           <div className="flex justify-end gap-3 pt-4 border-t border-nexus-sandLight">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2.5 text-nexus-slate font-bold hover:bg-nexus-bg rounded-[10px] transition-colors text-xs uppercase tracking-wide"
              >
                {t.actions_cancel}
              </button>
              <button 
                type="submit"
                disabled={!selectedListId || (selectedListId === 'NEW' && !newListName.trim())}
                className="px-6 py-2.5 bg-nexus-primary text-white font-bold rounded-[10px] hover:bg-nexus-accent shadow-md text-xs uppercase tracking-wide flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {t.add_to_list}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default SelectListModal;