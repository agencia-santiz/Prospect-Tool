
import React, { useState, useEffect, useRef } from 'react';
import { NAV_STRUCTURE, STAGE_COLORS } from './constants';
import { Company, SearchParams, SavedList, Pipeline, Deal, PipelineStage } from './types';
import { fetchEnrichedLeads } from './services/geminiService';
import { fetchBrazilianCities, CityOption } from './services/locationService';
import { translations, Language } from './utils/i18n';
import LeadCard from './components/LeadCard';
import LeadListView from './components/LeadListView';
import SelectListModal from './components/SelectListModal';
import AddToPipelineModal from './components/AddToPipelineModal';
import DealDetailsModal from './components/DealDetailsModal';
import PipelineBoard from './components/PipelineBoard';
import LoadingBar from './components/LoadingBar';
import LoginScreen from './components/LoginScreen';
import { useAuth } from './contexts/AuthContext';
import { Search, Loader2, Hexagon, Save, LayoutGrid, List, Download, MapPin, Globe, Check, AlertOctagon, PinOff, Bell, User, PanelLeftOpen, PanelLeftClose, Filter, Plus, Phone, Globe2, MoreHorizontal, LogOut, X, RefreshCw } from 'lucide-react';

const ITEMS_PER_PAGE = 50;

// Helper function for fuzzy matching (removes accents/diacritics)
const normalizeText = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

// Helper to generate consistent key for Contacted status (ignoring random ID)
const getCompanyUniqueKey = (company: Company) => {
    return `NAME:${normalizeText(company.nome_fantasia)}_${normalizeText(company.cidade)}`;
};

// Helper for safe UUID generation
const generateUUID = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const DEFAULT_PIPELINE: Pipeline = {
    id: 'default_pipeline',
    name: 'Funil de Vendas Padrão',
    isDefault: true,
    stages: [
        { id: 'stage_1', name: 'Prospecção', color: STAGE_COLORS[0] },
        { id: 'stage_2', name: 'Qualificação', color: STAGE_COLORS[1] },
        { id: 'stage_3', name: 'Apresentação', color: STAGE_COLORS[2] },
        { id: 'stage_4', name: 'Negociação', color: STAGE_COLORS[3] },
        { id: 'stage_5', name: 'Fechamento', color: STAGE_COLORS[4] },
    ]
};

const App: React.FC = () => {
  const { user, isAuthenticated, logout, loading: authLoading, incrementUsage } = useAuth();

  // --- LAYOUT STATE ---
  const [activeModuleId, setActiveModuleId] = useState('explore'); 
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const isSidebarExpanded = isSidebarPinned || isSidebarHovered;
  
  // --- DATA STATE ---
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); 
  const [searchParams, setSearchParams] = useState<SearchParams>({ city: '', segment: '' });
  const [quantityInput, setQuantityInput] = useState(''); 
  
  const [leads, setLeads] = useState<Company[]>([]);
  const [contactedKeys, setContactedKeys] = useState<Set<string>>(new Set());

  // Loading States
  const [loading, setLoading] = useState(false); 
  const [isLoadingMore, setIsLoadingMore] = useState(false); 
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');
  
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  
  // --- CRM STATE ---
  const [contacts, setContacts] = useState<Company[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([DEFAULT_PIPELINE]);
  const [deals, setDeals] = useState<Deal[]>([]);

  // --- MODALS ---
  const [isSaveListModalOpen, setIsSaveListModalOpen] = useState(false);
  const [listNameInput, setListNameInput] = useState('');
  const [isSelectListModalOpen, setIsSelectListModalOpen] = useState(false);
  const [leadToSave, setLeadToSave] = useState<Company | null>(null);
  
  // Pipeline Modals
  const [isAddToPipelineModalOpen, setIsAddToPipelineModalOpen] = useState(false);
  const [leadToPipeline, setLeadToPipeline] = useState<Company | null>(null);
  const [isDealDetailsModalOpen, setIsDealDetailsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // --- I18N ---
  const [currentLang, setCurrentLang] = useState<Language>('pt');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = translations[currentLang];

  // --- CITY AUTOCOMPLETE ---
  const [allCities, setAllCities] = useState<CityOption[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityOption[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [validCitySelected, setValidCitySelected] = useState(false);
  const cityInputRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<any>(null);

  // --- INIT ---
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadCities = async () => {
      setCitiesLoading(true);
      const cities = await fetchBrazilianCities();
      setAllCities(cities);
      setCitiesLoading(false);
    };
    loadCities();

    // Load Data from LocalStorage
    const saved = localStorage.getItem('nexus_saved_lists');
    if (saved) try { setSavedLists(JSON.parse(saved)); } catch(e) {}

    const savedContacts = localStorage.getItem('nexus_contacts');
    if (savedContacts) try { setContacts(JSON.parse(savedContacts)); } catch(e) {}
    
    const savedPipelines = localStorage.getItem('nexus_pipelines');
    if (savedPipelines) try { setPipelines(JSON.parse(savedPipelines)); } catch(e) {}

    const savedDeals = localStorage.getItem('nexus_deals');
    if (savedDeals) try { setDeals(JSON.parse(savedDeals)); } catch(e) {}

    const savedContacted = localStorage.getItem('nexus_contacted_keys');
    if (savedContacted) try { setContactedKeys(new Set(JSON.parse(savedContacted))); } catch(e) {}

    
    const handleClickOutside = (event: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAuthenticated]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000); 
  };

  const handleExport = () => {
      showNotification("Exportação CSV iniciada...");
  };

  // --- CONTACTED HANDLER ---
  const handleToggleContacted = (company: Company) => {
      const key = getCompanyUniqueKey(company);
      const newSet = new Set(contactedKeys);
      if (newSet.has(key)) {
          newSet.delete(key);
      } else {
          newSet.add(key);
      }
      setContactedKeys(newSet);
      localStorage.setItem('nexus_contacted_keys', JSON.stringify(Array.from(newSet)));
  };

  // --- PIPELINE HANDLERS ---

  const handleOpenAddToPipeline = (company: Company) => {
      setLeadToPipeline(company);
      setIsAddToPipelineModalOpen(true);
  };

  const confirmAddToPipeline = (pipelineId: string) => {
      if (!leadToPipeline) return;
      
      const pipeline = pipelines.find(p => p.id === pipelineId) || pipelines[0];
      const initialStage = pipeline.stages[0];

      const newDeal: Deal = {
          id: generateUUID(),
          companyId: leadToPipeline.id,
          companyName: leadToPipeline.nome_fantasia,
          value: 0,
          pipelineId: pipeline.id,
          stageId: initialStage.id,
          priority: 'MEDIUM',
          createdAt: new Date().toISOString(),
          contactInfo: {
              phone: leadToPipeline.telefone,
              website: leadToPipeline.website || undefined,
              location: leadToPipeline.cidade
          },
          customFields: [
              { label: 'Industry', value: leadToPipeline.atividade_principal },
              { label: 'Source', value: leadToPipeline.source }
          ],
          activities: [],
          people: [],
          tasks: []
      };

      const updatedDeals = [...deals, newDeal];
      setDeals(updatedDeals);
      localStorage.setItem('nexus_deals', JSON.stringify(updatedDeals));
      
      showNotification("Negócio criado com sucesso! Visualize no Pipeline.");
      setIsAddToPipelineModalOpen(false);
      setLeadToPipeline(null);

      // Add to contacts if not exists
      if (!contacts.some(c => c.id === leadToPipeline.id)) {
           const updatedContacts = [...contacts, leadToPipeline];
           setContacts(updatedContacts);
           localStorage.setItem('nexus_contacts', JSON.stringify(updatedContacts));
      }
  };

  const handleDealMove = (dealId: string, newStageId: string) => {
      const updatedDeals = deals.map(d => 
          d.id === dealId ? { ...d, stageId: newStageId } : d
      );
      setDeals(updatedDeals);
      localStorage.setItem('nexus_deals', JSON.stringify(updatedDeals));
  };

  const handleDealClick = (deal: Deal) => {
      setSelectedDeal(deal);
      setIsDealDetailsModalOpen(true);
  };

  const handleSaveDeal = (updatedDeal: Deal) => {
      const updatedDeals = deals.map(d => d.id === updatedDeal.id ? updatedDeal : d);
      setDeals(updatedDeals);
      localStorage.setItem('nexus_deals', JSON.stringify(updatedDeals));
      setIsDealDetailsModalOpen(false);
      showNotification("Negócio atualizado com sucesso!");
  };

  const handleDeleteDeal = (dealId: string) => {
      if (window.confirm("Tem certeza que deseja excluir este negócio?")) {
          const updatedDeals = deals.filter(d => d.id !== dealId);
          setDeals(updatedDeals);
          localStorage.setItem('nexus_deals', JSON.stringify(updatedDeals));
          setIsDealDetailsModalOpen(false);
          showNotification("Negócio excluído.");
      }
  };

  // --- SEARCH HANDLERS ---

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams(prev => ({ ...prev, city: value }));
    setValidCitySelected(false);
    
    if (value.length > 0) {
      const normalizedInput = normalizeText(value);
      
      const filtered = allCities
        .filter(city => {
          const normalizedCity = normalizeText(city.label);
          return normalizedCity.includes(normalizedInput);
        })
        .sort((a, b) => {
           const normA = normalizeText(a.label);
           const normB = normalizeText(b.label);
           if (normA === normalizedInput && normB !== normalizedInput) return -1;
           if (normB === normalizedInput && normA !== normalizedInput) return 1;
           const startsA = normA.startsWith(normalizedInput);
           const startsB = normB.startsWith(normalizedInput);
           if (startsA && !startsB) return -1;
           if (!startsA && startsB) return 1;
           return a.label.localeCompare(b.label);
        })
        .slice(0, 20); 

      setFilteredCities(filtered);
      setShowCitySuggestions(true);
    } else {
      setShowCitySuggestions(false);
    }
  };

  const selectCity = (city: string) => {
    setSearchParams(prev => ({ ...prev, city }));
    setValidCitySelected(true);
    setShowCitySuggestions(false);
  };

  const runProgressSimulation = () => {
     if (progressInterval.current) clearInterval(progressInterval.current);
     setLoadingProgress(0);
     
     progressInterval.current = setInterval(() => {
        setLoadingProgress((prev) => {
            if (prev >= 90) return prev; 
            if (prev === 20) setLoadingStatus('Analisando empresas encontradas...');
            if (prev === 50) setLoadingStatus('Verificando dados...');
            if (prev === 80) setLoadingStatus('Formatando resultados...');
            const increment = prev < 50 ? 5 : prev < 80 ? 2 : 0.5;
            return prev + increment;
        });
    }, 400);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validCitySelected || !searchParams.segment) return;
    
    const desiredQuantity = quantityInput ? parseInt(quantityInput) : 9;

    // Reset State
    setLoading(true);
    setLoadingStatus('Iniciando busca no Google Maps...');
    setHasSearched(true);
    setHasMoreResults(true); 
    setError(null);
    setLeads([]);
    setCurrentPage(1);
    setLocalSearchTerm('');
    setShowCitySuggestions(false);
    setActiveListId(null);

    runProgressSimulation();
    
    try {
        const results = await fetchEnrichedLeads(searchParams.city, searchParams.segment, [], desiredQuantity);
        
        // INCREMENT QUOTA (Free App - just tracking)
        incrementUsage(results.length);

        setLeads(results);
        if (results.length === 0) setHasMoreResults(false);
        setLoadingProgress(100);
        setLoadingStatus('Concluído!');
    } catch (err) {
        setError("Falha ao buscar empresas. Tente novamente.");
        setLoadingProgress(0);
    } finally {
        clearInterval(progressInterval.current);
        setTimeout(() => setLoading(false), 500);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMoreResults || isLoadingMore) return;
    
    const desiredQuantity = quantityInput ? parseInt(quantityInput) : 9;

    setIsLoadingMore(true);
    setLoadingStatus('Buscando mais empresas...');
    runProgressSimulation();

    try {
        const currentNames = leads.map(l => l.nome_fantasia);
        const newResults = await fetchEnrichedLeads(
            searchParams.city, 
            searchParams.segment, 
            currentNames,
            desiredQuantity
        );

        const uniqueNewResults = newResults.filter(
            newLead => !leads.some(
                existing => normalizeText(existing.nome_fantasia) === normalizeText(newLead.nome_fantasia)
            )
        );

        incrementUsage(uniqueNewResults.length);

        if (uniqueNewResults.length === 0) {
            if(newResults.length === 0) {
                setHasMoreResults(false);
                showNotification("Não encontramos mais resultados únicos para este termo.", "error");
            } else {
                 showNotification("Resultados duplicados filtrados. Tente novamente para novos.", "error");
            }
        } else {
            setLeads(prev => [...prev, ...uniqueNewResults]);
            setLoadingProgress(100);
        }
    } catch (err) {
        showNotification("Erro ao carregar mais resultados.", "error");
    } finally {
        clearInterval(progressInterval.current);
        setTimeout(() => setIsLoadingMore(false), 500);
    }
  };

  const filteredLeads = leads.filter(lead => {
     if (localSearchTerm) {
         const term = normalizeText(localSearchTerm);
         return normalizeText(lead.nome_fantasia).includes(term) || normalizeText(lead.razão_social).includes(term);
     }
     return true;
  });

  const currentLeads = filteredLeads; 

  const handleSaveSingleLead = (lead: Company) => { setLeadToSave(lead); setIsSelectListModalOpen(true); };
  
  const confirmSaveLeadToList = (listId: string | 'NEW', newListName?: string) => {
      if (!leadToSave) return;
      let updatedLists = [...savedLists];
      if (listId === 'NEW' && newListName) {
          const newList: SavedList = {
              id: Date.now().toString(),
              name: newListName,
              createdAt: new Date().toLocaleDateString(),
              leads: [leadToSave],
              params: { city: leadToSave.cidade, segment: leadToSave.atividade_principal }
          };
          updatedLists = [newList, ...updatedLists];
      } else {
          updatedLists = updatedLists.map(list => {
              if (list.id === listId) {
                  const exists = list.leads.some(l => l.id === leadToSave.id);
                  if (!exists) return { ...list, leads: [...list.leads, leadToSave] };
              }
              return list;
          });
      }
      setSavedLists(updatedLists);
      localStorage.setItem('nexus_saved_lists', JSON.stringify(updatedLists));

      // Also add to global contacts if saved
      if (!contacts.some(c => c.id === leadToSave.id)) {
          const updatedContacts = [...contacts, leadToSave];
          setContacts(updatedContacts);
          localStorage.setItem('nexus_contacts', JSON.stringify(updatedContacts));
      }

      setIsSelectListModalOpen(false);
      setLeadToSave(null);
      showNotification(t.lead_saved_success);
  };

  const handleOpenList = (list: SavedList) => {
      setLeads(list.leads);
      setSearchParams(list.params);
      setHasSearched(true);
      setActiveListId(list.id);
      setActiveModuleId('explore'); 
      setValidCitySelected(true);
      setHasMoreResults(false); 
  };

  const confirmSaveBatchList = (e: React.FormEvent) => {
      e.preventDefault();
      const finalName = listNameInput.trim() || `${searchParams.segment} - ${searchParams.city}`;
      const newList: SavedList = {
          id: Date.now().toString(),
          name: finalName,
          createdAt: new Date().toLocaleDateString(),
          leads: [...leads],
          params: { ...searchParams }
      };
      const updatedLists = [newList, ...savedLists];
      setSavedLists(updatedLists);
      localStorage.setItem('nexus_saved_lists', JSON.stringify(updatedLists));
      
      // Add all to global contacts
      let newContacts = [...contacts];
      leads.forEach(lead => {
          if (!newContacts.some(c => c.id === lead.id)) {
              newContacts.push(lead);
          }
      });
      setContacts(newContacts);
      localStorage.setItem('nexus_contacts', JSON.stringify(newContacts));

      setIsSaveListModalOpen(false);
      showNotification(t.list_saved_success);
  };

  // --- VIEW RENDERERS ---

  const renderExploreView = () => (
      <div className="space-y-6">
          <div className="bg-nexus-surface rounded border border-nexus-sand shadow-subtle p-5">
              <div className="flex flex-col md:flex-row gap-5 items-end">
                   <div className="flex-[2] w-full relative group" ref={cityInputRef}>
                        <label className="block text-xs font-bold text-nexus-dark mb-2">Localização <span className="text-nexus-royal">*</span></label>
                        <div className="relative">
                            <MapPin className={`absolute left-3 top-3 h-4 w-4 ${validCitySelected ? 'text-nexus-royal' : 'text-nexus-warmGray'}`} />
                            <input 
                                type="text"
                                placeholder={t.search_city_placeholder}
                                className={`w-full h-11 pl-10 pr-4 bg-nexus-surface border rounded text-sm outline-none focus:ring-2 focus:ring-nexus-royal/20 transition-all ${!validCitySelected && searchParams.city.length > 0 ? 'border-nexus-royal/50' : 'border-nexus-sand focus:border-nexus-royal'}`}
                                value={searchParams.city}
                                onChange={handleCityInputChange}
                                onFocus={() => { if(searchParams.city.length > 0) setShowCitySuggestions(true); }}
                            />
                        </div>
                         {showCitySuggestions && filteredCities.length > 0 && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-nexus-surface border border-nexus-sand rounded-md shadow-float max-h-64 overflow-y-auto z-[100]">
                                {filteredCities.map((city) => (
                                  <button key={city.value} onClick={() => selectCity(city.value)} className="w-full text-left px-4 py-3 text-sm text-nexus-charcoal hover:bg-nexus-accent border-b border-nexus-sandLight last:border-0">
                                    {city.label}
                                  </button>
                                ))}
                              </div>
                         )}
                   </div>

                   <div className="flex-[2] w-full">
                        <label className="block text-xs font-bold text-nexus-dark mb-2">Segmento / Indústria <span className="text-nexus-royal">*</span></label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-nexus-warmGray" />
                            <input 
                                type="text"
                                placeholder={t.search_segment_placeholder}
                                className="w-full h-11 pl-10 pr-4 bg-nexus-surface border border-nexus-sand rounded text-sm outline-none focus:border-nexus-royal focus:ring-2 focus:ring-nexus-royal/20 transition-all"
                                value={searchParams.segment}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, segment: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                        </div>
                   </div>

                   <div className="flex-[0.5] w-full min-w-[100px]">
                        <label className="block text-xs font-bold text-nexus-dark mb-2">Qtd</label>
                        <div className="relative">
                            {/* Replaced Hash with Search for now or just generic icon */}
                            <Search className="absolute left-3 top-3 h-4 w-4 text-nexus-warmGray" />
                            <input 
                                type="number"
                                min="1"
                                max="50"
                                placeholder="9"
                                className="w-full h-11 pl-9 pr-2 bg-nexus-surface border border-nexus-sand rounded text-sm outline-none focus:border-nexus-royal focus:ring-2 focus:ring-nexus-royal/20 transition-all"
                                value={quantityInput}
                                onChange={(e) => setQuantityInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                        </div>
                   </div>

                   <button 
                      onClick={handleSearch}
                      disabled={loading || isLoadingMore || !validCitySelected || !searchParams.segment}
                      className="h-11 px-8 bg-nexus-royal text-white font-bold text-sm rounded shadow-sm hover:bg-nexus-crimsonLight transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                   >
                       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t.search_btn}
                   </button>
              </div>
          </div>

          {loading && (
             <LoadingBar progress={loadingProgress} status={loadingStatus} />
          )}

          {hasSearched && !loading && (
              <div className="animate-fadeIn space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2 border-b border-nexus-sand">
                      <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-nexus-dark">
                              {activeListId ? savedLists.find(l => l.id === activeListId)?.name : 'Empresas'}
                          </h2>
                          <span className="bg-nexus-sandLight text-nexus-charcoal px-2 py-0.5 rounded text-xs font-bold">
                              {filteredLeads.length}
                          </span>
                      </div>

                      <div className="flex items-center gap-3">
                           <div className="relative">
                               <input 
                                   type="text" 
                                   placeholder={t.search_local_placeholder}
                                   value={localSearchTerm}
                                   onChange={(e) => setLocalSearchTerm(e.target.value)}
                                   className="h-9 pl-3 pr-8 text-xs border border-nexus-sand rounded bg-nexus-surface w-56 focus:border-nexus-royal outline-none focus:ring-1 focus:ring-nexus-royal/20"
                               />
                               <Filter className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-nexus-warmGray" />
                           </div>

                           <div className="flex bg-nexus-surface p-0.5 rounded border border-nexus-sand">
                               <button 
                                  onClick={() => setViewMode('list')} 
                                  className={`p-1.5 rounded-sm transition-all ${viewMode === 'list' ? 'bg-nexus-sandLight text-nexus-royal font-bold' : 'text-nexus-warmGray hover:text-nexus-charcoal'}`}
                                  title={t.view_list}
                               >
                                   <List className="w-4 h-4" />
                               </button>
                               <div className="w-px bg-nexus-sand my-1"></div>
                               <button 
                                  onClick={() => setViewMode('grid')} 
                                  className={`p-1.5 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-nexus-sandLight text-nexus-royal font-bold' : 'text-nexus-warmGray hover:text-nexus-charcoal'}`}
                                  title={t.view_grid}
                               >
                                   <LayoutGrid className="w-4 h-4" />
                               </button>
                           </div>

                           <button onClick={handleExport} className="h-9 px-3 border border-nexus-sand font-bold text-xs rounded hover:bg-nexus-sandLight flex items-center gap-2 bg-nexus-surface text-nexus-charcoal">
                               <Download className="w-3.5 h-3.5" />
                               <span className="hidden sm:inline">{t.export_btn}</span>
                           </button>

                           {!activeListId && (
                               <button onClick={() => setIsSaveListModalOpen(true)} className="h-9 px-3 bg-nexus-royal text-white border border-nexus-royal font-bold text-xs rounded shadow-sm hover:bg-nexus-crimsonLight flex items-center gap-2">
                                   <Save className="w-3.5 h-3.5" />
                                   <span className="hidden sm:inline">{t.save_list}</span>
                               </button>
                           )}
                      </div>
                  </div>

                  {error && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded flex items-center gap-3 text-red-700 text-sm font-medium">
                          <AlertOctagon className="w-5 h-5" /> {error}
                      </div>
                  )}

                  {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                            {currentLeads.map(lead => (
                                <LeadCard 
                                    key={lead.id} 
                                    company={lead} 
                                    lang={currentLang} 
                                    onSaveClick={handleSaveSingleLead}
                                    onAddToPipeline={handleOpenAddToPipeline}
                                    isSaved={!!activeListId}
                                    isContacted={contactedKeys.has(getCompanyUniqueKey(lead))}
                                    onToggleContacted={() => handleToggleContacted(lead)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div>
                            <LeadListView 
                                leads={currentLeads} 
                                lang={currentLang} 
                                onSaveLead={handleSaveSingleLead}
                                onAddToPipeline={handleOpenAddToPipeline}
                                isContacted={(lead) => contactedKeys.has(getCompanyUniqueKey(lead))}
                                onToggleContacted={handleToggleContacted}
                            />
                        </div>
                    )}
                    
                   {!activeListId && (
                       <div className="py-8 pb-20 flex flex-col items-center justify-center">
                           {isLoadingMore ? (
                               <LoadingBar progress={loadingProgress} status={loadingStatus} />
                           ) : hasMoreResults ? (
                               <button 
                                   onClick={handleLoadMore}
                                   className="group relative flex items-center gap-2 px-8 py-3 bg-nexus-surface border font-bold rounded-full shadow-sm hover:shadow-card-hover transition-all border-nexus-royal/30 text-nexus-royal hover:bg-nexus-accent"
                               >
                                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                    Carregar Mais Resultados
                               </button>
                           ) : (
                               <div className="flex flex-col items-center gap-2 animate-fadeIn mt-4">
                                   <div className="w-12 h-1 bg-nexus-sand rounded-full mb-2"></div>
                                   <div className="flex items-center gap-2 px-4 py-2 bg-nexus-sandLight rounded-full text-nexus-warmGray text-xs font-bold uppercase tracking-widest border border-nexus-sand">
                                       <PinOff className="w-3.5 h-3.5" /> Fim dos Resultados
                                   </div>
                               </div>
                           )}
                       </div>
                   )}
              </div>
          )}
          
          {!hasSearched && !loading && (
              <div className="flex flex-col items-center justify-center py-24 bg-nexus-surface border border-nexus-sand rounded shadow-subtle">
                  <div className="w-20 h-20 bg-nexus-accent rounded-full flex items-center justify-center mb-6">
                      <Globe className="w-10 h-10 text-nexus-royal" />
                  </div>
                  <h3 className="text-xl font-bold text-nexus-dark mb-2">Comece sua Prospecção Global</h3>
                  <p className="text-nexus-warmGray max-w-md text-center mb-8 leading-relaxed">
                      Utilize os filtros acima para encontrar empresas reais validadas via Google Maps. Dados de contato, status e horários em tempo real.
                  </p>
                  
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs text-nexus-charcoal bg-nexus-sandLight px-3 py-1.5 rounded border border-nexus-sand">
                        <Check className="w-3 h-3 text-green-500" /> Google Maps
                    </div>
                    <div className="flex items-center gap-2 text-xs text-nexus-charcoal bg-nexus-sandLight px-3 py-1.5 rounded border border-nexus-sand">
                        <Check className="w-3 h-3 text-green-500" /> Horários
                    </div>
                  </div>
              </div>
          )}
      </div>
  );

  const renderListsView = () => (
      <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center bg-nexus-surface p-5 rounded border border-nexus-sand shadow-subtle">
             <div>
                <h2 className="text-xl font-bold text-nexus-dark">Minhas Listas</h2>
                <p className="text-sm text-nexus-warmGray mt-1">Gerencie seus grupos de prospecção salvos.</p>
             </div>
             <button onClick={() => setActiveModuleId('explore')} className="flex items-center gap-2 text-sm font-bold text-white bg-nexus-royal px-5 py-2.5 rounded shadow-sm hover:bg-nexus-crimsonLight transition-all">
                 <Plus className="w-4 h-4" /> Criar Nova Lista
             </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedLists.map(list => (
                  <div key={list.id} onClick={() => handleOpenList(list)} className="bg-nexus-surface p-6 rounded border border-nexus-sand shadow-subtle hover:shadow-card-hover hover:border-nexus-royal cursor-pointer transition-all group relative">
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-nexus-accent rounded text-nexus-royal group-hover:bg-nexus-royal group-hover:text-white transition-colors">
                              <List className="w-6 h-6" />
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-nexus-warmGray hover:text-nexus-charcoal" />
                      </div>
                      <h3 className="font-bold text-nexus-dark text-lg mb-1 truncate">{list.name}</h3>
                      <p className="text-xs text-nexus-warmGray mb-4">{list.leads.length} empresas • Criado em {list.createdAt}</p>
                      <div className="flex items-center gap-2 border-t border-nexus-sandLight pt-3">
                           <span className="text-[10px] uppercase font-bold tracking-wider bg-nexus-sandLight px-2 py-1 rounded text-nexus-charcoal truncate">
                               {list.params.city.split('-')[0]}
                           </span>
                           <span className="text-[10px] uppercase font-bold tracking-wider bg-nexus-sandLight px-2 py-1 rounded text-nexus-charcoal truncate">
                               {list.params.segment}
                           </span>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
  
  const renderPipelineView = () => (
     <div className="h-full flex flex-col animate-fadeIn">
         <div className="flex justify-between items-center mb-6">
             <div>
                 <h2 className="text-xl font-bold text-nexus-dark">{pipelines[0].name}</h2>
                 <p className="text-sm text-nexus-warmGray">Arraste e solte para mover os negócios.</p>
             </div>
             <div className="flex items-center gap-3">
                 <button 
                    onClick={() => { setActiveModuleId('explore'); }}
                    className="bg-nexus-royal text-white px-4 py-2 rounded text-sm font-bold hover:bg-nexus-crimsonLight flex items-center gap-2"
                 >
                     <Plus className="w-4 h-4" /> Adicionar Negócio
                 </button>
             </div>
         </div>
         <div className="flex-1 min-h-0">
             <PipelineBoard 
                 pipeline={pipelines[0]}
                 deals={deals}
                 onDealMove={handleDealMove}
                 onDealClick={handleDealClick}
                 onAddDeal={(stageId) => {
                     // Quick add not implemented fully in this snippet, redirects to explore
                     setActiveModuleId('explore');
                     showNotification("Busque uma empresa para adicionar ao pipeline.");
                 }}
             />
         </div>
     </div>
  );

  const renderContactsView = () => (
      <div className="bg-nexus-surface border border-nexus-sand rounded shadow-subtle overflow-hidden animate-fadeIn">
          <div className="p-5 border-b border-nexus-sand flex justify-between items-center bg-nexus-offWhite">
               <div>
                   <h2 className="text-lg font-bold text-nexus-dark">Todos os Contatos</h2>
                   <p className="text-xs text-nexus-warmGray">Gerencie sua base de relacionamentos.</p>
               </div>
               <div className="text-xs font-bold text-nexus-warmGray bg-nexus-surface px-3 py-1 border border-nexus-sand rounded shadow-subtle">
                   Total: {contacts.length}
               </div>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-nexus-surface border-b border-nexus-sand text-xs font-bold text-nexus-warmGray uppercase tracking-wide">
                          <th className="px-5 py-3 w-10"><input type="checkbox" className="rounded" /></th>
                          <th className="px-5 py-3">Empresa / Nome</th>
                          <th className="px-5 py-3">Email / Telefone</th>
                          <th className="px-5 py-3">Localização</th>
                          <th className="px-5 py-3"></th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {contacts.map(contact => (
                              <tr 
                                key={contact.id} 
                                className="hover:bg-nexus-accent/50 transition-colors group"
                              >
                                  <td className="px-5 py-3"><input type="checkbox" className="rounded" /></td>
                                  <td className="px-5 py-3">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-nexus-royal/10 text-nexus-royal flex items-center justify-center text-xs font-bold shrink-0">
                                              {contact.nome_fantasia.charAt(0)}
                                          </div>
                                          <div className="truncate max-w-[200px]">
                                              <div className="font-bold text-sm text-nexus-dark">{contact.nome_fantasia}</div>
                                              <div className="text-xs text-nexus-warmGray">{contact.razão_social}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-5 py-3">
                                      <div className="flex flex-col gap-1">
                                          {contact.telefone ? (
                                              <div className="flex items-center gap-2 text-xs text-gray-700">
                                                  <Phone className="w-3 h-3 text-nexus-warmGray" /> {contact.telefone}
                                              </div>
                                          ) : <span className="text-xs text-nexus-warmGray">--</span>}
                                          {contact.website ? (
                                              <div className="flex items-center gap-2 text-xs text-nexus-royal cursor-pointer hover:underline truncate max-w-[150px]">
                                                  <Globe2 className="w-3 h-3 text-nexus-warmGray" /> {contact.website}
                                              </div>
                                          ) : <span className="text-xs text-nexus-warmGray">--</span>}
                                      </div>
                                  </td>
                                  <td className="px-5 py-3">
                                      <div className="text-xs text-gray-700 line-clamp-1" title={contact.endereco || contact.cidade}>
                                          {contact.endereco || contact.cidade}
                                      </div>
                                      <div className="text-[10px] text-nexus-warmGray">{contact.uf}</div>
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                      <button className="text-nexus-warmGray hover:text-nexus-royal p-1">
                                          <MoreHorizontal className="w-4 h-4" />
                                      </button>
                                  </td>
                              </tr>
                          )
                      )}
                      {contacts.length === 0 && (
                          <tr>
                              <td colSpan={6} className="text-center py-12 text-nexus-warmGray text-sm">
                                  Nenhum contato salvo ainda. Salve empresas para vê-las aqui.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
  );

  if (authLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-nexus-bg">
              <Loader2 className="w-8 h-8 text-nexus-royal animate-spin" />
          </div>
      );
  }

  if (!isAuthenticated) {
      return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-nexus-bg font-sans flex text-nexus-dark overflow-hidden">
      
      <aside 
         className={`bg-nexus-sidebar text-white flex flex-col transition-all duration-300 ease-in-out z-50 shadow-float border-r border-nexus-dark/30 ${isSidebarExpanded ? 'w-64' : 'w-16'}`}
         onMouseEnter={() => !isSidebarPinned && setIsSidebarHovered(true)}
         onMouseLeave={() => !isSidebarPinned && setIsSidebarHovered(false)}
      >
          <div className="h-14 flex items-center px-4 border-b border-white/10 shrink-0 bg-nexus-sidebar">
               <div className="w-8 h-8 bg-nexus-royal rounded flex items-center justify-center shrink-0 shadow-sm">
                    <Hexagon size={18} fill="currentColor" className="text-white" />
               </div>
               <div className={`ml-3 overflow-hidden transition-opacity duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
                   <h1 className="font-bold text-lg tracking-tight whitespace-nowrap">Bloom Leads</h1>
               </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-hide">
              {NAV_STRUCTURE.map((group) => (
                  <div key={group.title}>
                      {isSidebarExpanded && (
                          <div className="px-5 mb-2 text-[10px] font-bold text-nexus-sand uppercase tracking-wider animate-fadeIn">
                              {group.title}
                          </div>
                      )}
                      {!isSidebarExpanded && <div className="mx-4 mb-2 border-t border-white/10"></div>}

                      <div className="space-y-0.5 px-2">
                          {group.items.map(item => (
                              <button
                                 key={item.id}
                                 onClick={() => setActiveModuleId(item.id)}
                                 className={`w-full flex items-center h-9 px-3 rounded transition-all duration-200 group relative ${
                                     activeModuleId === item.id 
                                     ? 'bg-nexus-royal text-white shadow-md font-medium' 
                                     : 'text-nexus-sand hover:bg-white/10 hover:text-white'
                                 }`}
                              >
                                  <item.icon className={`w-4 h-4 shrink-0 transition-colors ${activeModuleId === item.id ? 'text-white' : 'text-nexus-sand group-hover:text-white'}`} />
                                  <span className={`ml-3 text-sm whitespace-nowrap transition-all duration-300 ${isSidebarExpanded ? 'opacity-100' : 'opacity-0 absolute left-10 pointer-events-none'}`}>
                                      {item.label}
                                  </span>
                                  
                                  {!isSidebarExpanded && (
                                      <div className="absolute left-full ml-2 px-2 py-1 bg-nexus-sidebar text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-white/10">
                                          {item.label}
                                      </div>
                                  )}
                              </button>
                          ))}
                      </div>
                  </div>
              ))}
          </div>

          <div className="p-4 border-t border-white/10 shrink-0">
               <button 
                  onClick={() => { setIsSidebarPinned(!isSidebarPinned); setIsSidebarHovered(!isSidebarPinned); }}
                  className="w-full flex items-center justify-center h-8 rounded hover:bg-white/10 text-nexus-sand hover:text-white transition-colors"
                  title={isSidebarPinned ? "Fixar Menu" : "Desafixar Menu"}
               >
                   {isSidebarPinned ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
               </button>
          </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
           
           <header className="h-14 bg-nexus-surface border-b border-nexus-sand flex items-center justify-between px-6 shrink-0 z-40 shadow-subtle">
                <div className="flex items-center w-full max-w-xl">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-2 w-4 h-4 text-nexus-warmGray" />
                        <input 
                            type="text" 
                            placeholder="Pesquisar no Bloom Leads (Ctrl+K)" 
                            className="w-full h-8 pl-9 pr-4 bg-nexus-sandLight border border-transparent rounded text-sm focus:bg-nexus-surface focus:border-nexus-royal focus:ring-2 focus:ring-nexus-royal/20 transition-all outline-none placeholder-nexus-warmGray text-nexus-charcoal"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 ml-6">
                    <button className="p-1.5 text-nexus-warmGray hover:bg-nexus-sandLight rounded-full relative transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-nexus-royal rounded-full border border-nexus-surface"></span>
                    </button>
                    
                    <div className="relative group cursor-pointer">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-nexus-sand shadow-sm hover:ring-2 ring-offset-2 ring-nexus-royal transition-all">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-nexus-royal text-white flex items-center justify-center font-bold text-xs">
                                    {user?.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-nexus-surface rounded-lg shadow-float border border-nexus-sand p-2 hidden group-hover:block animate-fadeIn z-50">
                            <div className="px-3 py-2 border-b border-nexus-sandLight mb-2">
                                <p className="text-sm font-bold text-nexus-dark truncate">{user?.name}</p>
                                <p className="text-[10px] text-nexus-warmGray truncate">{user?.email}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-nexus-royal/10 text-nexus-royal">
                                    {user?.plan} PLAN
                                </span>
                            </div>
                            <button onClick={logout} className="w-full text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded flex items-center gap-2">
                                <LogOut className="w-3.5 h-3.5" /> Sair da conta
                            </button>
                        </div>
                    </div>
                </div>
           </header>

           <div className="h-16 border-b border-nexus-sand bg-nexus-surface px-8 flex items-center justify-between shrink-0">
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs mb-0.5">
                        <span className="font-semibold text-nexus-warmGray uppercase tracking-wide">
                            {NAV_STRUCTURE.find(g => g.items.some(i => i.id === activeModuleId))?.title}
                        </span>
                        <span className="text-nexus-sand">/</span>
                    </div>
                    <h1 className="font-bold text-nexus-dark text-xl tracking-tight">
                        {NAV_STRUCTURE.flatMap(g => g.items).find(i => i.id === activeModuleId)?.label}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                     {activeModuleId === 'explore' && (
                         <button className="flex items-center gap-1.5 text-xs font-bold text-nexus-royal bg-nexus-surface border border-nexus-royal/30 px-4 py-2 rounded shadow-subtle hover:bg-nexus-accent transition-colors">
                             <Filter className="w-3.5 h-3.5" /> Filtros Salvos
                         </button>
                     )}
                </div>
           </div>

           <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-nexus-bg">
                <div className="max-w-[1600px] mx-auto h-full flex flex-col">
                    {activeModuleId === 'explore' && renderExploreView()}
                    {activeModuleId === 'lists' && renderListsView()}
                    {activeModuleId === 'pipeline' && renderPipelineView()}
                    {activeModuleId === 'contacts' && renderContactsView()} 
                    {!['explore', 'lists', 'contacts', 'pipeline'].includes(activeModuleId) && (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                            <div className="w-16 h-16 bg-nexus-sandLight rounded-full flex items-center justify-center mb-4">
                                <User className="w-8 h-8 text-nexus-sand" />
                            </div>
                            <h3 className="text-lg font-bold text-nexus-charcoal">Módulo em Desenvolvimento</h3>
                            <p>Esta funcionalidade estará disponível na próxima atualização.</p>
                        </div>
                    )}
                </div>
           </div>
      </div>

      {notification && (
          <div className={`fixed bottom-6 right-6 z-[2000] px-6 py-4 rounded shadow-float animate-slideIn flex items-center gap-3 border-l-4 max-w-md ${notification.type === 'success' ? 'bg-nexus-sidebar text-white border-nexus-royal' : 'bg-nexus-accent text-nexus-crimsonDark border-nexus-royal'}`}>
             {notification.type === 'success' ? <Check className="w-5 h-5 text-green-400 shrink-0" /> : <AlertOctagon className="w-5 h-5 shrink-0" />}
             <div>
               <p className="font-bold text-sm mb-0.5">{notification.type === 'success' ? 'Sucesso!' : 'Atenção'}</p>
               <p className="text-xs opacity-90 leading-relaxed">{notification.message}</p>
             </div>
             <button onClick={() => setNotification(null)} className="ml-2 opacity-70 hover:opacity-100">
                 <X className="w-4 h-4" />
             </button>
          </div>
      )}

      {isSaveListModalOpen && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-nexus-sidebar/50 backdrop-blur-sm p-4 animate-fadeIn">
             <div className="bg-nexus-surface rounded p-6 w-full max-w-md shadow-float border border-nexus-sand">
                 <h3 className="font-bold text-lg mb-1 text-gray-900">Salvar Lista</h3>
                 <p className="text-xs text-nexus-warmGray mb-4">Crie um novo grupo para organizar seus leads.</p>
                 <input type="text" value={listNameInput} onChange={(e) => setListNameInput(e.target.value)} className="w-full border border-nexus-sand p-2.5 rounded mb-4 text-sm focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal outline-none" placeholder="Nome da lista (Ex: Padarias SP)" autoFocus />
                 <div className="flex justify-end gap-2">
                     <button onClick={() => setIsSaveListModalOpen(false)} className="px-4 py-2 text-nexus-charcoal font-bold text-xs hover:bg-nexus-sandLight rounded transition-colors">Cancelar</button>
                     <button onClick={confirmSaveBatchList} className="px-4 py-2 bg-nexus-royal text-white font-bold text-xs rounded hover:bg-nexus-crimsonLight transition-colors shadow-sm">Salvar Lista</button>
                 </div>
             </div>
          </div>
      )}

      <SelectListModal 
           isOpen={isSelectListModalOpen}
           onClose={() => setIsSelectListModalOpen(false)}
           onConfirm={confirmSaveLeadToList}
           savedLists={savedLists}
           lang={currentLang}
      />

      <AddToPipelineModal 
          isOpen={isAddToPipelineModalOpen}
          onClose={() => setIsAddToPipelineModalOpen(false)}
          onConfirm={confirmAddToPipeline}
          pipelines={pipelines}
          company={leadToPipeline}
      />

      <DealDetailsModal 
          isOpen={isDealDetailsModalOpen}
          onClose={() => setIsDealDetailsModalOpen(false)}
          deal={selectedDeal}
          onSave={handleSaveDeal}
          onDelete={handleDeleteDeal}
          lang={currentLang}
          pipelines={pipelines}
      />

    </div>
  );
};

export default App;
