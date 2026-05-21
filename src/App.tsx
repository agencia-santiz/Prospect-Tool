
import React, { useState, useEffect, useRef } from 'react';
import { APP_NAME, NAV_STRUCTURE, STAGE_COLORS } from './constants';
import { Company, SearchParams, SavedList, Pipeline, Deal, PipelineStage, CardVisibilityConfig, WhatsAppStatus } from './types';
import { fetchEnrichedLeads } from './services/geminiService';
import { fetchBrazilianCities, CityOption } from './services/locationService';
import { translations, Language } from './utils/i18n';
import { buildWhatsAppChatUrl, getWhatsAppChatTarget } from './utils/whatsappLink.js';
import LeadCard from './components/LeadCard';
import LeadListView from './components/LeadListView';
import SelectListModal from './components/SelectListModal';
import AddToPipelineModal from './components/AddToPipelineModal';
import DealDetailsModal from './components/DealDetailsModal';
import PricingModal from './components/PricingModal';
import SettingsModal from './components/SettingsModal';
import PipelineBoard from './components/PipelineBoard';
import LoadingBar from './components/LoadingBar';
import LoginScreen from './components/LoginScreen';
import { JobWorker } from './components/JobWorker';
import WhatsAppStatusDropdown from './components/WhatsAppStatusDropdown';
import BloomBadge from './components/ui/badge';
import BloomButton from './components/ui/button';
import BloomCard from './components/ui/card';
import BloomInput from './components/ui/input';
import FloatingMenu from './components/ui/floating-menu';
import { useAuth } from './contexts/AuthContext';
import { DEFAULT_CARD_CONFIG, CARD_CONFIG_STORAGE_KEY, parseCardConfig, serializeCardConfig } from './utils/cardConfigStore.js';
import { getCompanyContactKey, migrateContactedKeys } from './utils/companyIdentity.js';
import { getSegmentSuggestions, resolveSegmentQuery } from './utils/segmentDatabase.js';
import { getCompanyWhatsAppStatus, setCompanyWhatsAppStatusOverride, readStoredWhatsAppStatusOverrides, writeStoredWhatsAppStatusOverrides } from './utils/whatsappStatusStore.js';
import { readPersistentValue, writePersistentValue } from './utils/persistentStorage.js';
import { createWorkspaceRemoteSnapshot, flushWorkspaceOutboxRecords } from './services/workspaceSyncService.js';
import { firebaseDataConnect, isDataConnectSyncEnabled } from './lib/firebase';
import { formatCurrency } from './utils/estimation';
import { Search, Loader2, Hexagon, Save, LayoutGrid, List, MapPin, Globe, Check, AlertOctagon, PinOff, Bell, User, PanelLeftOpen, PanelLeftClose, Filter, Plus, Phone, Globe2, MoreHorizontal, LogOut, X, RefreshCw, Settings, Sparkles, Clock, ExternalLink, MessageCircle, BadgeInfo, FolderOpen, Star, Eye } from 'lucide-react';
import { readWorkspaceData, writeWorkspaceData } from './utils/workspaceDataStore.js';
import { appendWorkspaceOutboxRecords, buildWorkspaceMutationRecords, readWorkspaceOutbox, writeWorkspaceOutbox } from './utils/mutationOutbox.js';
import { resolveWorkspaceSyncState } from './utils/workspaceSyncState.js';

const ITEMS_PER_PAGE = 50;
type SegmentSuggestion = {
  label: string;
  aliases: string[];
  category: string;
};

type ProspectingSnapshot = {
  searchParams: SearchParams;
  leads: Company[];
  hasSearched: boolean;
  hasMoreResults: boolean;
  validCitySelected: boolean;
  currentPage: number;
  localSearchTerm: string;
};

// Helper function for fuzzy matching (removes accents/diacritics)
const normalizeText = (text: string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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

const upsertById = <T extends { id: string }>(items: T[], nextItem: T) => {
  const existingIndex = items.findIndex((item) => item.id === nextItem.id);

  if (existingIndex === -1) {
    return [...items, nextItem];
  }

  const nextItems = [...items];
  nextItems[existingIndex] = nextItem;
  return nextItems;
};

const formatDateLabel = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('pt-BR');
};

const CUSTOM_FIELD_SECTION_ORDER = ['commercial', 'production', 'custom'] as const;
type CustomFieldSection = (typeof CUSTOM_FIELD_SECTION_ORDER)[number];

const inferCustomFieldSection = (label: string): CustomFieldSection => {
  const normalized = label.trim().toLowerCase();

  if (normalized.includes('source') || normalized.includes('origem')) {
    return 'commercial';
  }

  if (normalized.includes('industry') || normalized.includes('segment') || normalized.includes('produto')) {
    return 'production';
  }

  return 'custom';
};

const normalizeCustomFieldSection = (field: { label: string; section?: string }) =>
  field.section && CUSTOM_FIELD_SECTION_ORDER.includes(field.section as CustomFieldSection)
    ? (field.section as CustomFieldSection)
    : inferCustomFieldSection(field.label);

const normalizeDealRecord = (deal: Deal, fallbackOwnerUserId?: string): Deal => ({
  ...deal,
  ownerUserId: deal.ownerUserId || fallbackOwnerUserId || '',
  summary: deal.summary ?? '',
  nextStep: deal.nextStep ?? '',
  customFields: (deal.customFields || []).map((field) => ({
    ...field,
    section: normalizeCustomFieldSection(field),
  })),
  activities: deal.activities || [],
  people: deal.people || [],
  tasks: deal.tasks || [],
});

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

const PLAN_LIMITS_ENABLED = false;

const App: React.FC = () => {
  const { user, workspace, workspaceMembers, workspaceOrigin, isAuthenticated, logout, loading: authLoading, incrementUsage } = useAuth();

  // --- LAYOUT STATE ---
  const [activeModuleId, setActiveModuleId] = useState('explore');
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const isSidebarExpanded = isSidebarPinned || isSidebarHovered;

  // --- DATA STATE ---
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchParams, setSearchParams] = useState<SearchParams>({ city: '', segment: '' });
  const [quantityInput, setQuantityInput] = useState('9');

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
  const [searchNotice, setSearchNotice] = useState<{ title: string; message: string } | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<Company | null>(null);
  const [isLeadDetailsOpen, setIsLeadDetailsOpen] = useState(false);
  const [listGroupInput, setListGroupInput] = useState('');
  const [whatsappStatusOverrides, setWhatsAppStatusOverrides] = useState<Record<string, WhatsAppStatus>>(() => {
    if (typeof window === 'undefined') {
      return {};
    }

    return readStoredWhatsAppStatusOverrides() as Record<string, WhatsAppStatus>;
  });

  // --- CRM STATE ---
  const [contacts, setContacts] = useState<Company[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([DEFAULT_PIPELINE]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [cardConfig, setCardConfig] = useState<CardVisibilityConfig>(DEFAULT_CARD_CONFIG);

  // --- MODALS ---
  const [isSaveListModalOpen, setIsSaveListModalOpen] = useState(false);
  const [listNameInput, setListNameInput] = useState('');
  const [isSelectListModalOpen, setIsSelectListModalOpen] = useState(false);
  const [leadToSave, setLeadToSave] = useState<Company | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Pipeline Modals
  const [isAddToPipelineModalOpen, setIsAddToPipelineModalOpen] = useState(false);
  const [leadToPipeline, setLeadToPipeline] = useState<Company | null>(null);
  const [isDealDetailsModalOpen, setIsDealDetailsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [workspaceHydrated, setWorkspaceHydrated] = useState(false);
  const [pendingMutationCount, setPendingMutationCount] = useState(0);
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    return window.navigator.onLine;
  });
  const workspaceSnapshotRef = useRef<{
    savedLists: SavedList[];
    contacts: Company[];
    pipelines: Pipeline[];
    deals: Deal[];
  } | null>(null);
  const syncInFlightRef = useRef(false);
  const applyingRemoteSnapshotRef = useRef(false);

  // --- I18N ---
  const [currentLang, setCurrentLang] = useState<Language>('pt');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = translations[currentLang];

  // --- CITY AUTOCOMPLETE ---
  const [allCities, setAllCities] = useState<CityOption[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityOption[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredSegments, setFilteredSegments] = useState<SegmentSuggestion[]>([]);
  const [showSegmentSuggestions, setShowSegmentSuggestions] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [validCitySelected, setValidCitySelected] = useState(false);
  const prospectingSnapshotRef = useRef<ProspectingSnapshot | null>(null);
  const cityInputRef = useRef<HTMLDivElement>(null);
  const citySuggestionsRef = useRef<HTMLDivElement>(null);
  const segmentInputRef = useRef<HTMLDivElement>(null);
  const segmentSuggestionsRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const progressInterval = useRef<any>(null);
  const hydrateWorkspaceData = (workspaceId: string) => {
      const workspaceData = readWorkspaceData(workspaceId);
      const hydratedSnapshot = {
        savedLists: workspaceData?.savedLists || [],
        contacts: workspaceData?.contacts || [],
        pipelines: workspaceData?.pipelines?.length ? workspaceData.pipelines : [DEFAULT_PIPELINE],
        deals: (workspaceData?.deals || []).map((deal) => normalizeDealRecord(deal, workspace?.ownerUserId || user?.id)),
      };

      setSavedLists(hydratedSnapshot.savedLists);
      setContacts(hydratedSnapshot.contacts);
      setPipelines(hydratedSnapshot.pipelines);
      setDeals(hydratedSnapshot.deals);
      workspaceSnapshotRef.current = hydratedSnapshot;
  };

  // --- INIT ---
  useEffect(() => {
    if (!isAuthenticated) {
      setWorkspaceHydrated(false);
      setSavedLists([]);
      setContacts([]);
      setPipelines([DEFAULT_PIPELINE]);
      setDeals([]);
      workspaceSnapshotRef.current = null;
      return;
    }

    if (!workspace) {
      setWorkspaceHydrated(false);
      workspaceSnapshotRef.current = null;
      return;
    }

    const loadCities = async () => {
      setCitiesLoading(true);
      const cities = await fetchBrazilianCities();
      setAllCities(cities);
      setCitiesLoading(false);
    };
    loadCities();
    hydrateWorkspaceData(workspace.id);

    const savedContacted = readPersistentValue('nexus_contacted_keys');
    if (savedContacted) try { setContactedKeys(new Set(JSON.parse(savedContacted))); } catch(e) {}

    const savedCardConfig = readPersistentValue(CARD_CONFIG_STORAGE_KEY);
    setCardConfig(parseCardConfig(savedCardConfig));


    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const cityInputContains = cityInputRef.current?.contains(target) ?? false;
      const cityMenuContains = citySuggestionsRef.current?.contains(target) ?? false;
      if (!cityInputContains && !cityMenuContains) {
        setShowCitySuggestions(false);
      }

      const segmentInputContains = segmentInputRef.current?.contains(target) ?? false;
      const segmentMenuContains = segmentSuggestionsRef.current?.contains(target) ?? false;
      if (!segmentInputContains && !segmentMenuContains) {
        setShowSegmentSuggestions(false);
      }

      if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    setWorkspaceHydrated(true);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAuthenticated, workspace?.id]);

  useEffect(() => {
    if (!isAuthenticated || !workspace || !workspaceHydrated) {
      return;
    }

    if (applyingRemoteSnapshotRef.current) {
      writeWorkspaceData(workspace.id, {
        savedLists,
        contacts,
        pipelines,
        deals,
      });
      workspaceSnapshotRef.current = {
        savedLists,
        contacts,
        pipelines,
        deals,
      };
      return;
    }

    writeWorkspaceData(workspace.id, {
      savedLists,
      contacts,
      pipelines,
      deals,
    });

    const previousSnapshot = workspaceSnapshotRef.current;
    if (previousSnapshot) {
      const mutationRecords = buildWorkspaceMutationRecords(workspace.id, previousSnapshot, {
        savedLists,
        contacts,
        pipelines,
        deals,
      });

      if (mutationRecords.length > 0) {
        appendWorkspaceOutboxRecords(workspace.id, mutationRecords);
      }
    }

    workspaceSnapshotRef.current = {
      savedLists,
      contacts,
      pipelines,
      deals,
    };
  }, [isAuthenticated, workspaceHydrated, workspace?.id, savedLists, contacts, pipelines, deals]);

  useEffect(() => {
    if (!isAuthenticated || !workspaceHydrated) return;
    writePersistentValue(CARD_CONFIG_STORAGE_KEY, serializeCardConfig(cardConfig));
  }, [isAuthenticated, workspaceHydrated, cardConfig]);

  useEffect(() => {
    if (!isAuthenticated || !workspaceHydrated || leads.length === 0) return;
    setContactedKeys((current) => migrateContactedKeys(current, leads));
  }, [isAuthenticated, workspaceHydrated, leads]);

  useEffect(() => {
    if (!isAuthenticated || !workspaceHydrated) return;
    writePersistentValue('nexus_contacted_keys', JSON.stringify(Array.from(contactedKeys)));
  }, [isAuthenticated, workspaceHydrated, contactedKeys]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    writeStoredWhatsAppStatusOverrides(whatsappStatusOverrides);
  }, [whatsappStatusOverrides]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !workspace || !workspaceHydrated) {
      setPendingMutationCount(0);
      return;
    }

    setPendingMutationCount(readWorkspaceOutbox(workspace.id).length);
  }, [isAuthenticated, workspaceHydrated, workspace?.id, savedLists, contacts, pipelines, deals]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !workspace ||
      !workspaceHydrated ||
      workspaceOrigin !== 'remote' ||
      !isOnline ||
      !isDataConnectSyncEnabled ||
      !firebaseDataConnect ||
      syncInFlightRef.current
    ) {
      return;
    }

    let cancelled = false;
    const workspaceId = workspace.id;

    const runSync = async () => {
      syncInFlightRef.current = true;

      try {
        const pendingRecords = readWorkspaceOutbox(workspaceId);
        if (pendingRecords.length > 0) {
          const flushResult = await flushWorkspaceOutboxRecords(firebaseDataConnect, workspaceId, pendingRecords);
          if (cancelled) {
            return;
          }

          writeWorkspaceOutbox(workspaceId, flushResult.remainingRecords);
          setPendingMutationCount(flushResult.remainingRecords.length);

          if (flushResult.remainingRecords.length > 0) {
            return;
          }
        }

        const remoteSnapshot = await createWorkspaceRemoteSnapshot(firebaseDataConnect, workspaceId);
        if (cancelled) {
          return;
        }

        applyingRemoteSnapshotRef.current = true;
        setSavedLists(remoteSnapshot.savedLists);
        setContacts(remoteSnapshot.contacts);
        setPipelines(remoteSnapshot.pipelines.length ? remoteSnapshot.pipelines : [DEFAULT_PIPELINE]);
        setDeals(remoteSnapshot.deals);
        workspaceSnapshotRef.current = remoteSnapshot;
        writeWorkspaceData(workspaceId, remoteSnapshot);
        setPendingMutationCount(readWorkspaceOutbox(workspaceId).length);
        setTimeout(() => {
          applyingRemoteSnapshotRef.current = false;
        }, 0);
      } catch (error) {
        if (!cancelled) {
          console.warn('Workspace sync failed.', error);
        }
      } finally {
        syncInFlightRef.current = false;
      }
    };

    void runSync();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, workspaceHydrated, workspace?.id, workspaceOrigin, isOnline, pendingMutationCount]);

  const syncState = workspace && workspaceHydrated
    ? resolveWorkspaceSyncState({
        isAuthenticated,
        workspaceOrigin,
        isOnline,
        pendingMutationCount,
        workspaceId: workspace.id,
        workspaceSlug: workspace.slug,
      })
    : null;

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000);
  };

  const captureProspectingSnapshot = () => {
    if (activeListId) {
      return;
    }

    prospectingSnapshotRef.current = {
      searchParams: { ...searchParams },
      leads: [...leads],
      hasSearched,
      hasMoreResults,
      validCitySelected,
      currentPage,
      localSearchTerm,
    };
  };

  const restoreProspectingSnapshot = () => {
    const snapshot = prospectingSnapshotRef.current;
    if (!snapshot) {
      return false;
    }

    setSearchParams(snapshot.searchParams);
    setLeads(snapshot.leads);
    setHasSearched(snapshot.hasSearched);
    setHasMoreResults(snapshot.hasMoreResults);
    setValidCitySelected(snapshot.validCitySelected);
    setCurrentPage(snapshot.currentPage);
    setLocalSearchTerm(snapshot.localSearchTerm);
    setFilteredSegments(getSegmentSuggestions(snapshot.searchParams.segment, 8));
    setShowCitySuggestions(false);
    setShowSegmentSuggestions(false);
    setActiveListId(null);

    return true;
  };

  const handleGoToExplore = () => {
    if (activeListId) {
      const restored = restoreProspectingSnapshot();
      if (!restored) {
        setActiveListId(null);
      }
    }

    setActiveModuleId('explore');
  };

  const sidebarUserInitial = user?.name?.charAt(0).toUpperCase() || 'B';

  const fetchLeadsWithFallback = async (
    city: string,
    segment: string,
    excludeNames: string[],
    desiredQuantity: number,
    intent: string = 'NONE'
  ) => {
    try {
      const enrichedLeads = await fetchEnrichedLeads(city, segment, excludeNames, desiredQuantity, intent);
      if (enrichedLeads.length > 0) {
        return enrichedLeads;
      }
    } catch (error) {
      console.warn('Backend enrichment failed.', error);
    }

    return [];
  };

  // --- CONTACTED HANDLER ---
  const handleToggleContacted = (company: Company) => {
      const key = getCompanyContactKey(company);
      const newSet = new Set(contactedKeys);
      if (newSet.has(key)) {
          newSet.delete(key);
      } else {
          newSet.add(key);
      }
      setContactedKeys(newSet);
  };

  const getResolvedWhatsAppStatus = (company: Company) =>
    getCompanyWhatsAppStatus(company, whatsappStatusOverrides);

  const handleUpdateWhatsAppStatus = (company: Company, nextStatus: WhatsAppStatus) => {
    setWhatsAppStatusOverrides((current) => setCompanyWhatsAppStatusOverride(current, company, nextStatus));
  };

  // --- PIPELINE HANDLERS ---

  const handleOpenAddToPipeline = (company: Company) => {
      setLeadToPipeline(company);
      setIsAddToPipelineModalOpen(true);
  };

  const handleOpenLeadDetails = (company: Company) => {
      setSelectedLeadDetails(company);
      setIsLeadDetailsOpen(true);
  };

  const handleCloseLeadDetails = () => {
      setIsLeadDetailsOpen(false);
      setSelectedLeadDetails(null);
  };

  const confirmAddToPipeline = (pipelineId: string) => {
      if (!leadToPipeline) return;

      const pipeline = pipelines.find(p => p.id === pipelineId) || pipelines[0];
      const initialStage = pipeline.stages[0];

      const newDeal: Deal = {
          id: generateUUID(),
          companyId: leadToPipeline.id,
          ownerUserId: user?.id || workspace?.ownerUserId || '',
          companyName: leadToPipeline.nome_fantasia,
          value: 0,
          pipelineId: pipeline.id,
          stageId: initialStage.id,
          priority: 'MEDIUM',
          createdAt: new Date().toISOString(),
          summary: '',
          nextStep: '',
          contactInfo: {
              phone: leadToPipeline.telefone,
              website: leadToPipeline.website || undefined,
              location: leadToPipeline.cidade
          },
          customFields: [
              { label: 'Industry', value: leadToPipeline.atividade_principal, section: 'production' },
              { label: 'Source', value: leadToPipeline.source, section: 'commercial' }
          ],
          activities: [],
          people: [],
          tasks: []
      };

      setDeals((currentDeals) => [...currentDeals, newDeal]);

      showNotification("Oportunidade criada com sucesso. Visualize no pipeline.");
      setIsAddToPipelineModalOpen(false);
      setLeadToPipeline(null);

      // Add to contacts if not exists
      setContacts((currentContacts) => upsertById(currentContacts, leadToPipeline));
  };

  const handleDealMove = (dealId: string, newStageId: string) => {
      const updatedDeals = deals.map(d =>
          d.id === dealId ? { ...d, stageId: newStageId } : d
      );
      setDeals(updatedDeals);
  };

  const handleDealClick = (deal: Deal) => {
      setSelectedDeal(deal);
      setIsDealDetailsModalOpen(true);
  };

  const handleUpdateCardConfig = (key: keyof CardVisibilityConfig) => {
      setCardConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveDeal = (updatedDeal: Deal) => {
      const normalizedDeal = normalizeDealRecord(updatedDeal, user?.id || workspace?.ownerUserId);
      const updatedDeals = deals.map(d => d.id === normalizedDeal.id ? normalizedDeal : d);
      setDeals(updatedDeals);
      setIsDealDetailsModalOpen(false);
      showNotification("Oportunidade atualizada com sucesso.");
  };

  const handleDeleteDeal = (dealId: string) => {
      if (window.confirm("Tem certeza que deseja excluir esta oportunidade?")) {
          const updatedDeals = deals.filter(d => d.id !== dealId);
          setDeals(updatedDeals);
          setIsDealDetailsModalOpen(false);
          showNotification("Oportunidade excluída.");
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

  const handleSegmentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchParams(prev => ({ ...prev, segment: value }));

    if (value.length > 0) {
      setFilteredSegments(getSegmentSuggestions(value, 8));
      setShowSegmentSuggestions(true);
    } else {
      setFilteredSegments([]);
      setShowSegmentSuggestions(false);
    }
  };

  const selectSegment = (segment: string) => {
    setSearchParams(prev => ({ ...prev, segment }));
    setFilteredSegments([]);
    setShowSegmentSuggestions(false);
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

  const resolveRequestedQuantity = () => {
    const parsedQuantity = Number.parseInt(quantityInput, 10);
    return Number.isFinite(parsedQuantity) && parsedQuantity > 0 ? parsedQuantity : 9;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedSegment = resolveSegmentQuery(searchParams.segment);
    if (!validCitySelected || !resolvedSegment) return;

    if (PLAN_LIMITS_ENABLED && user && user.usage >= user.limit) {
      setError("Você atingiu o limite mensal de leads do seu plano. Aguarde o próximo mês ou faça upgrade.");
      return;
    }

    const desiredQuantity = resolveRequestedQuantity();
    const actualQuantity = desiredQuantity;

    // Reset State
    setLoading(true);
    setLoadingStatus('Iniciando busca na fonte ativa...');
    setHasSearched(true);
    setHasMoreResults(true);
    setError(null);
    setSearchNotice(null);
    setLeads([]);
    setCurrentPage(1);
    setLocalSearchTerm('');
    setShowCitySuggestions(false);
    setShowSegmentSuggestions(false);
    setFilteredSegments([]);
    setActiveListId(null);
    setSearchParams(prev => ({ ...prev, segment: resolvedSegment }));
    setSelectedLeadDetails(null);
    setIsLeadDetailsOpen(false);

    runProgressSimulation();

    try {
        const results = await fetchLeadsWithFallback(searchParams.city, resolvedSegment, [], actualQuantity, searchParams.intent || 'NONE');

        // INCREMENT QUOTA (Free App - just tracking)
        incrementUsage(results.length);

        setLeads(results);
        if (results.length === 0) {
          setHasMoreResults(false);
          setSearchNotice({
            title: 'Nenhum resultado encontrado',
            message: `Não encontramos empresas para "${resolvedSegment}" em "${searchParams.city}". Tente ampliar o segmento, ajustar a cidade ou pesquisar um termo mais geral.`
          });
        }
        setLoadingProgress(100);
        setLoadingStatus('Concluído!');
    } catch (err) {
        setError("Falha ao buscar empresas. Tente novamente.");
        setSearchNotice(null);
        setLoadingProgress(0);
    } finally {
        clearInterval(progressInterval.current);
        setTimeout(() => setLoading(false), 500);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMoreResults || isLoadingMore) return;

    if (PLAN_LIMITS_ENABLED && user && user.usage >= user.limit) {
      showNotification("Limite mensal atingido. Faça upgrade para continuar.", "error");
      return;
    }

    const desiredQuantity = resolveRequestedQuantity();
    const actualQuantity = desiredQuantity;

    const resolvedSegment = resolveSegmentQuery(searchParams.segment);

    setIsLoadingMore(true);
    setLoadingStatus('Buscando mais empresas...');
    runProgressSimulation();

    try {
        const currentNames = leads.map(l => l.nome_fantasia);
        const newResults = await fetchLeadsWithFallback(
            searchParams.city,
            resolvedSegment,
            currentNames,
            actualQuantity,
            searchParams.intent || 'NONE'
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
                setSearchNotice(prev => prev ?? {
                    title: 'Sem novos resultados',
                    message: 'N?o encontramos novos leads ?nicos para este termo. Tente ampliar a busca ou ajustar os filtros.'
                });
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
         return normalizeText(lead.nome_fantasia).includes(term) || normalizeText(lead.razao_social).includes(term);
     }
     return true;
  });

  const currentLeads = filteredLeads;
  const exploreHeaderTitle = activeListId
    ? savedLists.find((list) => list.id === activeListId)?.name || 'Empresas'
    : [searchParams.segment, searchParams.city].filter(Boolean).join(' - ') || 'Empresas';

  const handleSaveSingleLead = (lead: Company) => {
      setLeadToSave(lead);
      setListGroupInput('');
      setIsSelectListModalOpen(true);
  };

  const renderLeadDetailPanel = () => {
      const lead = isLeadDetailsOpen ? selectedLeadDetails : null;

      if (!lead) return null;

      const sourceLabel = lead.source.replace(/_/g, ' ');
      const scoreLabel = lead.score ?? '--';
      const ratingLabel = Number.isFinite(Number(lead.rating)) ? Number(lead.rating).toFixed(1) : null;
      const reviewCountLabel = Number.isFinite(Number(lead.userRatingsTotal)) ? Number(lead.userRatingsTotal).toLocaleString('pt-BR') : null;
      const whatsappTarget = getWhatsAppChatTarget(lead);
      const whatsappStatus = getResolvedWhatsAppStatus(lead);
      const isLeadContacted = contactedKeys.has(getCompanyContactKey(lead));
      const whatsappStatusLabel =
        whatsappStatus === 'CONFIRMED'
          ? t.whatsapp_confirmed
          : whatsappStatus === 'UNCONFIRMED'
            ? t.whatsapp_unconfirmed
            : t.whatsapp_not_available;
      const relevanceSummary =
        lead.relevance_summary || 'Resumo nao disponivel para este lead.';
      const rankingReasons = Array.isArray(lead.rankingReasons) ? lead.rankingReasons : [];
      const legalName = lead.razao_social || lead.nome_fantasia;
      const showLegalName = legalName && legalName !== lead.nome_fantasia;
      const locationLine = [lead.bairro, lead.uf, lead.pais].filter(Boolean).join(' • ') || '--';

      const openWebsite = () => {
        if (!lead.website) return;

        let finalUrl = lead.website;
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
          finalUrl = `https://${finalUrl}`;
        }

        window.open(finalUrl, '_blank', 'noopener,noreferrer');
      };

      const openGoogleMaps = () => {
        if (lead.googleMapsUri) {
          window.open(lead.googleMapsUri, '_blank', 'noopener,noreferrer');
          return;
        }

        const query = encodeURIComponent(`${lead.nome_fantasia} ${lead.endereco || lead.cidade}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
      };

      const openWhatsApp = () => {
        if (!whatsappTarget) return;

        const url = buildWhatsAppChatUrl(whatsappTarget);
        if (!url) return;

        window.open(url, '_blank', 'noopener,noreferrer');
      };

      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-nexus-sidebar/50 backdrop-blur-sm p-4">
              <BloomCard className="flex max-h-[calc(100vh-2rem)] w-[min(64rem,calc(100vw-2rem))] flex-col overflow-hidden border-nexus-border bg-white shadow-float">
              <div className="flex items-start justify-between gap-3 border-b border-nexus-border bg-nexus-offWhite p-5">
                  <div className="min-w-0">
                      <BloomBadge variant="neutral" className="uppercase tracking-[0.16em]">
                          Detalhe do lead
                      </BloomBadge>
                      <h3 className="mt-2 line-clamp-2 text-xl font-bold tracking-tight text-nexus-charcoal">
                          {lead.nome_fantasia}
                      </h3>
                      <p className="mt-1 line-clamp-1 text-sm text-nexus-warmGray">
                          {showLegalName ? legalName : lead.atividade_principal}
                      </p>
                  </div>

                  <BloomButton variant="icon" size="icon" onClick={handleCloseLeadDetails} aria-label="Fechar painel">
                      <X className="h-4 w-4" />
                  </BloomButton>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto p-5">
                  <div className="flex flex-wrap gap-2">
                      <BloomBadge variant="brand" className="uppercase tracking-[0.14em]">
                          {sourceLabel}
                      </BloomBadge>
                      <BloomBadge variant="info" className="uppercase tracking-[0.14em]">
                          Score: {scoreLabel}
                      </BloomBadge>
                      {ratingLabel && (
                          <BloomBadge variant="neutral" className="uppercase tracking-[0.14em]">
                              {ratingLabel} ★{reviewCountLabel ? ` • ${reviewCountLabel}` : ''}
                          </BloomBadge>
                      )}
                      <BloomBadge variant={lead.is_open_now ? 'success' : 'neutral'} className="uppercase tracking-[0.14em]">
                          {lead.is_open_now ? t.status_open : t.status_closed}
                      </BloomBadge>
                      <BloomBadge variant={whatsappStatus === 'CONFIRMED' ? 'success' : whatsappStatus === 'UNCONFIRMED' ? 'warning' : 'neutral'} className="uppercase tracking-[0.14em]">
                          {whatsappStatusLabel}
                      </BloomBadge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-nexus-border bg-nexus-offWhite p-4">
                          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
                              <MapPin className="h-3.5 w-3.5" />
                              Localizacao
                          </div>
                          <div className="mt-3 text-sm font-medium text-nexus-charcoal">
                              {lead.endereco || lead.cidade || '--'}
                          </div>
                          <div className="mt-1 text-xs text-nexus-warmGray">{locationLine}</div>
                          <BloomButton variant="ghost" size="sm" className="mt-4" onClick={openGoogleMaps}>
                              <ExternalLink className="h-3.5 w-3.5" />
                              {t.google_business_btn}
                          </BloomButton>
                      </div>

                      <div className="rounded-2xl border border-nexus-border bg-nexus-offWhite p-4">
                          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
                              <Phone className="h-3.5 w-3.5" />
                              Contato
                          </div>
                          <div className="mt-3 space-y-1 text-sm text-nexus-charcoal">
                              <div>{lead.telefone || '--'}</div>
                              <div>{lead.email || '--'}</div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                              <BloomButton
                                  variant="success"
                                  size="sm"
                                  onClick={openWhatsApp}
                                  disabled={!whatsappTarget}
                              >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                  WhatsApp
                              </BloomButton>
                              <WhatsAppStatusDropdown
                                  company={lead}
                                  lang={currentLang}
                                  status={whatsappStatus}
                                  onUpdateWhatsAppStatus={handleUpdateWhatsAppStatus}
                                  buttonClassName="min-w-[168px] justify-between"
                                  triggerLabelClassName="max-w-[120px]"
                              />
                          </div>
                      </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-nexus-border bg-white p-4 shadow-subtle">
                          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
                              <Globe className="h-3.5 w-3.5" />
                              Website
                          </div>
                          <div className="mt-3 text-sm text-nexus-charcoal">
                              {lead.website ? (
                                  <span className="break-all">{lead.website}</span>
                              ) : (
                                  '--'
                              )}
                          </div>
                          <BloomButton variant="secondary" size="sm" className="mt-4" onClick={openWebsite} disabled={!lead.website}>
                              <ExternalLink className="h-3.5 w-3.5" />
                              Abrir site
                          </BloomButton>
                      </div>

                      <div className="rounded-2xl border border-nexus-border bg-white p-4 shadow-subtle">
                          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
                              <Clock className="h-3.5 w-3.5" />
                              Horario
                          </div>
                          <div className="mt-3 text-sm text-nexus-charcoal">
                              {lead.opening_hours || t.hours_unavailable}
                          </div>
                          <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-nexus-warmGray">
                              Dados do lead
                          </div>
                      </div>
                  </div>

                  <div className="rounded-2xl border border-nexus-border bg-nexus-offWhite p-4">
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
                          <BadgeInfo className="h-3.5 w-3.5" />
                          Resumo do lead
                      </div>
                      <p className="mt-2 min-h-[4.5rem] text-sm leading-relaxed text-nexus-charcoal">
                          {relevanceSummary}
                      </p>
                  </div>

                  <div className="rounded-2xl border border-nexus-border bg-white p-4 shadow-subtle">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
                          Motivos do score
                      </div>
                      {rankingReasons.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                              {rankingReasons.map((reason, index) => (
                                  <span
                                      key={index}
                                      className="rounded-full border border-nexus-border bg-nexus-bg px-2.5 py-1 text-[10px] font-medium text-nexus-charcoal"
                                  >
                                      {reason}
                                  </span>
                              ))}
                          </div>
                      ) : (
                          <div className="mt-3 rounded-2xl border border-dashed border-nexus-border bg-nexus-bg p-4 text-sm text-nexus-warmGray">
                              Nenhum motivo registrado para este lead.
                          </div>
                      )}
                  </div>
              </div>

              <div className="border-t border-nexus-border bg-nexus-offWhite p-4">
                  <div className="flex flex-wrap gap-2">
                      <BloomButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSaveSingleLead(lead)}
                      >
                          <Save className="h-3.5 w-3.5" />
                          Salvar lead
                      </BloomButton>

                      <BloomButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenAddToPipeline(lead)}
                      >
                          <Plus className="h-3.5 w-3.5" />
                          Adicionar ao pipeline
                      </BloomButton>

                      <BloomButton
                          variant={isLeadContacted ? 'success' : 'secondary'}
                          size="sm"
                          onClick={() => handleToggleContacted(lead)}
                      >
                          <Check className="h-3.5 w-3.5" />
                          {isLeadContacted ? t.contacted : t.mark_contacted}
                      </BloomButton>
                  </div>
              </div>
              </BloomCard>
          </div>
      );
  };

  const confirmSaveLeadToList = async (newListName: string, groupName?: string) => {
      if (!leadToSave || !workspace) return;
      const finalName = newListName.trim();
      if (!finalName) return;

      const nextLead = { ...leadToSave };

      const nextList: SavedList = {
          id: generateUUID(),
          name: finalName,
          createdAt: new Date().toISOString(),
          leads: [nextLead],
          params: { ...searchParams },
          groupName: groupName?.trim() || undefined,
      };

      setSavedLists((currentLists) => [...currentLists, nextList]);

      setContacts((currentContacts) => upsertById(currentContacts, nextLead));

      setIsSelectListModalOpen(false);
      setLeadToSave(null);
      showNotification(t.lead_saved_success);
  };

  const handleOpenList = (list: SavedList) => {
      captureProspectingSnapshot();
      setLeads(list.leads);
      setSearchParams(list.params);
      setHasSearched(true);
      setSelectedLeadDetails(null);
      setIsLeadDetailsOpen(false);
      setActiveListId(list.id);
      setActiveModuleId('explore');
      setValidCitySelected(true);
      setHasMoreResults(false);
  };

  const confirmSaveBatchList = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!workspace) return;

      const finalName = listNameInput.trim() || `${searchParams.segment} - ${searchParams.city}`;
      const finalGroupName = listGroupInput.trim() || undefined;
      const listId = generateUUID();
      const nextLeads = leads.map((lead) => ({ ...lead }));

      setSavedLists((currentLists) => [
          ...currentLists,
          {
              id: listId,
              name: finalName,
              createdAt: new Date().toISOString(),
              leads: nextLeads,
              params: { ...searchParams },
              groupName: finalGroupName,
          },
      ]);

      setContacts((currentContacts) => {
          let nextContacts = [...currentContacts];
          nextLeads.forEach((lead) => {
              nextContacts = upsertById(nextContacts, lead);
          });
          return nextContacts;
      });

      setIsSaveListModalOpen(false);
      setListNameInput('');
      setListGroupInput('');
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
                              <FloatingMenu
                                  anchorRef={cityInputRef}
                                  menuRef={citySuggestionsRef}
                                  open
                                  className="overflow-y-auto"
                              >
                                {filteredCities.map((city) => (
                                  <button key={city.value} onClick={() => selectCity(city.value)} className="w-full text-left px-4 py-3 text-sm text-nexus-charcoal hover:bg-nexus-accent border-b border-nexus-sandLight last:border-0">
                                    {city.label}
                                  </button>
                                ))}
                              </FloatingMenu>
                         )}
                   </div>

                   <div className="flex-[2] w-full relative" ref={segmentInputRef}>
                        <label className="block text-xs font-bold text-nexus-dark mb-2">Segmento / Indústria <span className="text-nexus-royal">*</span></label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-nexus-warmGray" />
                            <input
                                type="text"
                                placeholder={t.search_segment_placeholder}
                                className="w-full h-11 pl-10 pr-4 bg-nexus-surface border border-nexus-sand rounded text-sm outline-none focus:border-nexus-royal focus:ring-2 focus:ring-nexus-royal/20 transition-all"
                                value={searchParams.segment}
                                onChange={handleSegmentInputChange}
                                onFocus={() => {
                                    if (searchParams.segment.length > 0) {
                                      setFilteredSegments(getSegmentSuggestions(searchParams.segment, 8));
                                      setShowSegmentSuggestions(true);
                                    }
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                        </div>
                        {showSegmentSuggestions && searchParams.segment.length > 0 && (
                            <FloatingMenu
                                anchorRef={segmentInputRef}
                                menuRef={segmentSuggestionsRef}
                                open
                                className="overflow-y-auto"
                            >
                                {filteredSegments.length > 0 ? (
                                    filteredSegments.map((segment) => (
                                        <button
                                            key={segment.label}
                                            onClick={() => selectSegment(segment.label)}
                                            className="w-full text-left px-4 py-3 text-sm text-nexus-charcoal hover:bg-nexus-accent border-b border-nexus-sandLight last:border-0 transition-colors"
                                        >
                                            <div className="font-medium text-nexus-dark">{segment.label}</div>
                                            <div className="text-[11px] text-nexus-warmGray mt-0.5">{segment.category}</div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-nexus-warmGray">
                                        Nenhum segmento encontrado. Tente termos como "adm", "tech" ou "saude".
                                    </div>
                                )}
                            </FloatingMenu>
                        )}
                   </div>

                   <div className="flex-[0.5] w-full min-w-[100px]">
                        <label className="block text-xs font-bold text-nexus-dark mb-2">Qtd</label>
                        <div className="relative">
                            {/* Replaced Hash with Search for now or just generic icon */}
                            <Search className="absolute left-3 top-3 h-4 w-4 text-nexus-warmGray" />
                            <input
                                type="number"
                                min="1"
                                placeholder="9"
                                className="w-full h-11 pl-9 pr-2 bg-nexus-surface border border-nexus-sand rounded text-sm outline-none focus:border-nexus-royal focus:ring-2 focus:ring-nexus-royal/20 transition-all"
                                value={quantityInput}
                                onChange={(e) => setQuantityInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                        </div>
                   </div>

                   <div className="flex-[0.8] w-full min-w-[130px]">
                        <label htmlFor="intent-select" className="block text-xs font-bold text-nexus-dark mb-2">Perfil Comercial</label>
                        <select
                            id="intent-select"
                            aria-label="Perfil comercial"
                            className="w-full h-11 px-3 bg-nexus-surface border border-nexus-sand rounded text-sm outline-none focus:border-nexus-royal focus:ring-2 focus:ring-nexus-royal/20 transition-all text-nexus-charcoal cursor-pointer"
                            value={searchParams.intent || 'NONE'}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, intent: e.target.value }))}
                        >
                            <option value="NONE">Automático</option>
                            <option value="B2B_SERVICES">B2B / Serviços</option>
                            <option value="SOFTWARE">Software / Tech</option>
                            <option value="LOCAL_SUPPLY">Fornecedor Local</option>
                        </select>
                   </div>

                   <button
                      onClick={handleSearch}
                      disabled={loading || isLoadingMore || !validCitySelected || !resolveSegmentQuery(searchParams.segment)}
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
                              {exploreHeaderTitle}
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

                  {searchNotice && !error && (
                      <div className="p-4 bg-nexus-accent border border-nexus-sand rounded flex items-start gap-3 text-nexus-charcoal text-sm">
                          <Sparkles className="w-5 h-5 text-nexus-royal shrink-0 mt-0.5" />
                          <div className="space-y-1">
                              <p className="font-bold text-sm text-nexus-dark">{searchNotice.title}</p>
                              <p className="leading-relaxed text-nexus-warmGray">{searchNotice.message}</p>
                          </div>
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
                            isContacted={contactedKeys.has(getCompanyContactKey(lead))}
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
                                  isContacted={(lead) => contactedKeys.has(getCompanyContactKey(lead))}
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
                      Utilize os filtros acima para encontrar empresas reais com dados abertos (OpenStreetMap / Overpass) e, quando configurado, enriquecimento complementar. A cobertura varia conforme o mapeamento disponível.
                  </p>

                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs text-nexus-charcoal bg-nexus-sandLight px-3 py-1.5 rounded border border-nexus-sand">
                        <Check className="w-3 h-3 text-green-500" /> Dados Abertos
                    </div>
                    <div className="flex items-center gap-2 text-xs text-nexus-charcoal bg-nexus-sandLight px-3 py-1.5 rounded border border-nexus-sand">
                        <Check className="w-3 h-3 text-green-500" /> Horários
                    </div>
                  </div>
              </div>
          )}
      </div>
  );

  const renderExploreViewNew = () => {
      const hasResults = hasSearched && !loading;

      return (
          <div className="space-y-6">
              <div className="space-y-6 min-w-0">
                  <BloomCard className="overflow-visible border-nexus-border bg-white shadow-subtle">
                      <div className="p-5">
                          <form
                              className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.4fr)_160px_220px_auto]"
                              onSubmit={handleSearch}
                          >
                              <div className="relative" ref={cityInputRef}>
                                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-nexus-warmGray">
                                      Localização <span className="text-nexus-royal">*</span>
                                  </label>
                                  <div className="relative">
                                      <MapPin className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${validCitySelected ? 'text-nexus-royal' : 'text-nexus-warmGray'}`} />
                                      <BloomInput
                                          type="text"
                                          placeholder={t.search_city_placeholder}
                                          className={`h-11 rounded-2xl pl-10 pr-4 shadow-subtle ${!validCitySelected && searchParams.city.length > 0 ? 'border-nexus-royal/50' : 'border-nexus-border'}`}
                                          value={searchParams.city}
                                          onChange={handleCityInputChange}
                                          onFocus={() => { if (searchParams.city.length > 0) setShowCitySuggestions(true); }}
                                      />
                                  </div>

                                  {showCitySuggestions && filteredCities.length > 0 && (
                                      <FloatingMenu
                                          anchorRef={cityInputRef}
                                          menuRef={citySuggestionsRef}
                                          open
                                          className="overflow-y-auto"
                                      >
                                          {filteredCities.map((city) => (
                                              <button
                                                  key={city.value}
                                                  type="button"
                                                  onClick={() => selectCity(city.value)}
                                                  className="w-full border-b border-nexus-border px-4 py-3 text-left text-sm text-nexus-charcoal transition-colors hover:bg-nexus-bg last:border-b-0"
                                              >
                                                  {city.label}
                                              </button>
                                          ))}
                                      </FloatingMenu>
                                  )}
                              </div>

                              <div className="relative" ref={segmentInputRef}>
                                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-nexus-warmGray">
                                      Segmento / Indústria <span className="text-nexus-royal">*</span>
                                  </label>
                                  <div className="relative">
                                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nexus-warmGray" />
                                      <BloomInput
                                          type="text"
                                          placeholder={t.search_segment_placeholder}
                                          className="h-11 rounded-2xl pl-10 pr-4 shadow-subtle border-nexus-border"
                                          value={searchParams.segment}
                                          onChange={handleSegmentInputChange}
                                          onFocus={() => {
                                            if (searchParams.segment.length > 0) {
                                              setFilteredSegments(getSegmentSuggestions(searchParams.segment, 8));
                                              setShowSegmentSuggestions(true);
                                            }
                                          }}
                                          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                      />
                                  </div>

                                  {showSegmentSuggestions && searchParams.segment.length > 0 && (
                                      <FloatingMenu
                                          anchorRef={segmentInputRef}
                                          menuRef={segmentSuggestionsRef}
                                          open
                                          className="overflow-y-auto"
                                      >
                                          {filteredSegments.length > 0 ? (
                                              filteredSegments.map((segment) => (
                                                  <button
                                                      key={segment.label}
                                                      type="button"
                                                      onClick={() => selectSegment(segment.label)}
                                                      className="w-full border-b border-nexus-border px-4 py-3 text-left text-sm text-nexus-charcoal transition-colors hover:bg-nexus-bg last:border-b-0"
                                                  >
                                                      <div className="font-medium text-nexus-charcoal">{segment.label}</div>
                                                      <div className="mt-0.5 text-[11px] text-nexus-warmGray">{segment.category}</div>
                                                  </button>
                                              ))
                                          ) : (
                                              <div className="px-4 py-3 text-sm text-nexus-warmGray">
                                                  Nenhum segmento encontrado. Tente termos como "adm", "tech" ou "saude".
                                              </div>
                                          )}
                                      </FloatingMenu>
                                  )}
                              </div>

                              <div className="min-w-0">
                                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-nexus-warmGray">
                                      Qtd
                                  </label>
                                  <div className="relative">
                                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nexus-warmGray" />
                                      <BloomInput
                                          type="number"
                                          min="1"
                                          inputMode="numeric"
                                          placeholder="9"
                                          className="h-11 rounded-2xl pl-10 pr-3 shadow-subtle border-nexus-border"
                                          value={quantityInput}
                                          onChange={(e) => setQuantityInput(e.target.value)}
                                          onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                      />
                                  </div>
                              </div>

                              <div className="min-w-0">
                                  <label htmlFor="intent-toolbar-select" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-nexus-warmGray">
                                      Perfil comercial
                                  </label>
                                  <select
                                      id="intent-toolbar-select"
                                      aria-label="Perfil comercial"
                                      className="h-11 w-full cursor-pointer rounded-2xl border border-nexus-border bg-white px-3 text-sm text-nexus-charcoal shadow-subtle outline-none transition-colors focus:border-nexus-royal"
                                      value={searchParams.intent || 'NONE'}
                                      onChange={(e) => setSearchParams(prev => ({ ...prev, intent: e.target.value }))}
                                  >
                                      <option value="NONE">Automático</option>
                                      <option value="B2B_SERVICES">B2B / Serviços</option>
                                      <option value="SOFTWARE">Software / Tech</option>
                                      <option value="LOCAL_SUPPLY">Fornecedor Local</option>
                                  </select>
                              </div>

                              <div className="flex items-end">
                                  <BloomButton
                                      type="submit"
                                      variant="primary"
                                      size="lg"
                                      fullWidth
                                      disabled={loading || isLoadingMore || !validCitySelected || !resolveSegmentQuery(searchParams.segment)}
                                  >
                                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                      {t.search_btn}
                                  </BloomButton>
                              </div>
                          </form>
                      </div>
                  </BloomCard>

                  {loading && <LoadingBar progress={loadingProgress} status={loadingStatus} />}

                  {hasResults && (
                      <div className="space-y-6">
                          <BloomCard className="border-nexus-border bg-white p-4 shadow-subtle">
                              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                  <div className="min-w-0">
                                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-nexus-warmGray">
                                          Resultados
                                      </p>
                                      <div className="mt-1 flex flex-wrap items-center gap-2">
                                          <h3 className="text-lg font-bold tracking-tight text-nexus-charcoal">
                                              {exploreHeaderTitle}
                                          </h3>
                                          <BloomBadge variant="neutral">{currentLeads.length}</BloomBadge>
                                          {activeListId && <BloomBadge variant="brand">Lista salva</BloomBadge>}
                                      </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2">
                                      <div className="relative w-full sm:w-64">
                                          <BloomInput
                                              type="text"
                                              placeholder={t.search_local_placeholder}
                                              value={localSearchTerm}
                                              onChange={(e) => setLocalSearchTerm(e.target.value)}
                                              className="h-10 rounded-full border-nexus-border bg-white pl-4 pr-10 shadow-subtle"
                                          />
                                          <Filter className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-nexus-warmGray" />
                                      </div>

                                      <div className="inline-flex items-center rounded-full border border-nexus-border bg-nexus-offWhite p-1 shadow-subtle">
                                          <BloomButton
                                              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                              size="icon"
                                              onClick={() => setViewMode('list')}
                                              className={`rounded-full ${viewMode === 'list' ? 'bg-white text-nexus-royal shadow-sm' : 'bg-transparent text-nexus-warmGray'}`}
                                              title={t.view_list}
                                          >
                                              <List className="h-4 w-4" />
                                          </BloomButton>
                                          <BloomButton
                                              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                              size="icon"
                                              onClick={() => setViewMode('grid')}
                                              className={`rounded-full ${viewMode === 'grid' ? 'bg-white text-nexus-royal shadow-sm' : 'bg-transparent text-nexus-warmGray'}`}
                                              title={t.view_grid}
                                          >
                                              <LayoutGrid className="h-4 w-4" />
                                          </BloomButton>
                                      </div>

                                      {!activeListId && (
                                          <BloomButton variant="primary" size="sm" onClick={() => setIsSaveListModalOpen(true)}>
                                              <Save className="h-3.5 w-3.5" />
                                              <span className="hidden sm:inline">{t.save_list}</span>
                                          </BloomButton>
                                      )}
                                  </div>
                              </div>
                          </BloomCard>

                          {error && (
                              <BloomCard className="border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-subtle">
                                  <div className="flex items-start gap-3">
                                      <AlertOctagon className="h-5 w-5 shrink-0" />
                                      <div className="font-medium">{error}</div>
                                  </div>
                              </BloomCard>
                          )}

                          {searchNotice && !error && (
                              <BloomCard className="border-nexus-border bg-white p-4 shadow-subtle">
                                  <div className="flex items-start gap-3">
                                      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-nexus-royal" />
                                      <div className="space-y-1">
                                          <p className="text-sm font-bold text-nexus-charcoal">{searchNotice.title}</p>
                                          <p className="text-sm leading-relaxed text-nexus-warmGray">{searchNotice.message}</p>
                                      </div>
                                  </div>
                              </BloomCard>
                          )}

                          <div className="space-y-6 min-w-0">
                              <div className="space-y-6 min-w-0">
                                  {currentLeads.length > 0 ? (
                                      viewMode === 'grid' ? (
                                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                                              {currentLeads.map((lead) => (
                                              <LeadCard
                                                      key={lead.id}
                                                      company={lead}
                                                      lang={currentLang}
                                                      onSaveClick={handleSaveSingleLead}
                                                      onAddToPipeline={handleOpenAddToPipeline}
                                                      isSaved={!!activeListId}
                                                      isContacted={contactedKeys.has(getCompanyContactKey(lead))}
                                                      onToggleContacted={() => handleToggleContacted(lead)}
                                                  />
                                              ))}
                                          </div>
                                      ) : (
                                          <LeadListView
                                              leads={currentLeads}
                                              lang={currentLang}
                                              onSaveLead={handleSaveSingleLead}
                                              onAddToPipeline={handleOpenAddToPipeline}
                                              isContacted={(lead) => contactedKeys.has(getCompanyContactKey(lead))}
                                              onToggleContacted={handleToggleContacted}
                                          />
                                      )
                                  ) : (
                                      <BloomCard className="flex min-h-[24rem] flex-col items-center justify-center border-nexus-border bg-white p-8 text-center shadow-subtle">
                                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nexus-accent text-nexus-royal">
                                              <Globe className="h-8 w-8" />
                                          </div>
                                          <h3 className="text-xl font-bold text-nexus-charcoal">
                                              {hasSearched ? 'Nenhum resultado encontrado' : 'Comece sua prospecção'}
                                          </h3>
                                      </BloomCard>
                                  )}

                                  {!activeListId && currentLeads.length > 0 && (
                                      <div className="flex flex-col items-center justify-center gap-4 pb-8 pt-2">
                                          {isLoadingMore ? (
                                              <LoadingBar progress={loadingProgress} status={loadingStatus} />
                                          ) : hasMoreResults ? (
                                              <BloomButton
                                                  variant="secondary"
                                                  size="lg"
                                                  onClick={handleLoadMore}
                                                  className="rounded-full border-nexus-royal/30 text-nexus-royal"
                                              >
                                                  <RefreshCw className="h-4 w-4" />
                                                  Carregar mais resultados
                                              </BloomButton>
                                          ) : (
                                              <div className="flex flex-col items-center gap-2">
                                                  <div className="h-1 w-12 rounded-full bg-nexus-sand" />
                                                  <BloomBadge variant="neutral" className="uppercase tracking-[0.18em]">
                                                      Fim dos resultados
                                                  </BloomBadge>
                                              </div>
                                          )}
                                      </div>
                                  )}
                              </div>

                          </div>
                      </div>
                  )} 

                  {!hasSearched && !loading && (
                      <BloomCard className="flex min-h-[24rem] flex-col items-center justify-center border-nexus-border bg-white p-8 text-center shadow-subtle">
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nexus-accent text-nexus-royal">
                              <Globe className="h-8 w-8" />
                          </div>
                          <h3 className="text-xl font-bold text-nexus-charcoal">
                              Comece sua prospecção
                          </h3>
                      </BloomCard>
                  )}
              </div>
          </div>
      );
  };

  const renderListsView = () => {
      const groupedLists = savedLists.reduce<Record<string, SavedList[]>>((acc, list) => {
          const groupKey = list.groupName?.trim() || 'Sem grupo';
          acc[groupKey] = acc[groupKey] || [];
          acc[groupKey].push(list);
          return acc;
      }, {});

      const listGroupEntries = Object.entries(groupedLists).sort(([groupA], [groupB]) => {
          if (groupA === groupB) return 0;
          if (groupA === 'Sem grupo') return 1;
          if (groupB === 'Sem grupo') return -1;
          return groupA.localeCompare(groupB, 'pt-BR');
      });

      return (
          <div className="space-y-4 animate-fadeIn">
              <BloomCard className="overflow-hidden border-nexus-border bg-white shadow-subtle">
                  <div className="flex flex-col gap-4 border-b border-nexus-border bg-nexus-offWhite p-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-nexus-warmGray">
                              Organização
                          </p>
                          <h2 className="mt-1 text-2xl font-bold tracking-tight text-nexus-charcoal">
                              Minhas Listas
                          </h2>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                          <BloomBadge variant="neutral" className="uppercase tracking-[0.16em]">
                              {savedLists.length} listas
                          </BloomBadge>
                          <BloomBadge variant="brand" className="uppercase tracking-[0.16em]">
                              {listGroupEntries.length} pastas
                          </BloomBadge>
                          <BloomButton variant="primary" size="sm" onClick={handleGoToExplore}>
                              <Plus className="h-3.5 w-3.5" />
                              Nova busca
                          </BloomButton>
                      </div>
                  </div>
              </BloomCard>

              {savedLists.length > 0 ? (
                  <div className="space-y-4">
                      {listGroupEntries.map(([groupName, groupLists]) => (
                          <BloomCard key={groupName} className="overflow-hidden border-nexus-border bg-white p-4 shadow-subtle">
                              <div className="flex items-center justify-between gap-3 border-b border-nexus-border pb-3">
                                  <div className="flex items-center gap-2">
                                      <FolderOpen className="h-4 w-4 text-nexus-royal" />
                                      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-nexus-charcoal">
                                          {groupName}
                                      </h3>
                                  </div>
                                  <BloomBadge variant="neutral" className="uppercase tracking-[0.14em]">
                                      {groupLists.length}
                                  </BloomBadge>
                              </div>

                              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
                                  {groupLists.map((list) => (
                                      <BloomCard
                                          key={list.id}
                                          className="group cursor-pointer overflow-hidden border-nexus-border bg-white p-5 shadow-subtle transition-all hover:-translate-y-0.5 hover:border-nexus-royal/30 hover:shadow-float"
                                          onClick={() => handleOpenList(list)}
                                      >
                                          <div className="flex items-start justify-between gap-4">
                                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-nexus-accent text-nexus-royal transition-colors group-hover:bg-nexus-royal group-hover:text-white">
                                                  <List className="h-5 w-5" />
                                              </div>
                                              <MoreHorizontal className="h-4 w-4 text-nexus-warmGray" />
                                          </div>

                                          <h3 className="mt-4 truncate text-lg font-bold text-nexus-charcoal">
                                              {list.name}
                                          </h3>
                                          <p className="mt-1 text-sm text-nexus-warmGray">
                                              {list.leads.length} empresas • Criado em {formatDateLabel(list.createdAt)}
                                          </p>

                                          <div className="mt-4 flex flex-wrap gap-2">
                                              <BloomBadge variant="neutral" className="uppercase tracking-[0.14em]">
                                                  {list.params.city.split('-')[0] || 'Cidade'}
                                              </BloomBadge>
                                              <BloomBadge variant="brand" className="uppercase tracking-[0.14em]">
                                                  {list.params.segment || 'Segmento'}
                                              </BloomBadge>
                                          </div>
                                      </BloomCard>
                                  ))}
                              </div>
                          </BloomCard>
                      ))}
                  </div>
              ) : (
                  <BloomCard className="flex min-h-[16rem] flex-col items-center justify-center border-dashed border-nexus-border bg-white p-8 text-center shadow-subtle">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nexus-accent text-nexus-royal">
                          <List className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold text-nexus-charcoal">Nenhuma lista salva</h3>
                      <BloomButton variant="primary" size="sm" className="mt-6" onClick={handleGoToExplore}>
                          <Plus className="h-3.5 w-3.5" />
                          Criar a primeira lista
                      </BloomButton>
                  </BloomCard>
              )}
          </div>
      );
  };

  const renderPipelineView = () => (
     <div className="space-y-4 animate-fadeIn">
         <BloomCard className="overflow-hidden border-nexus-border bg-white shadow-subtle">
             <div className="flex flex-col gap-4 border-b border-nexus-border bg-nexus-offWhite p-5 lg:flex-row lg:items-center lg:justify-between">
                 <div className="min-w-0">
                     <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-nexus-warmGray">
                         Operação comercial
                     </p>
                     <h2 className="mt-1 text-2xl font-bold tracking-tight text-nexus-charcoal">
                         {pipelines[0].name}
                     </h2>
                 </div>

                 <div className="flex flex-wrap items-center gap-2">
                     <BloomBadge variant="neutral" className="uppercase tracking-[0.16em]">
                         {deals.length} negócios
                     </BloomBadge>
                     <BloomBadge variant="brand" className="uppercase tracking-[0.16em]">
                         {pipelines[0].stages.length} etapas
                     </BloomBadge>
                     <BloomButton variant="primary" size="sm" onClick={handleGoToExplore}>
                         <Plus className="h-3.5 w-3.5" />
                         Adicionar oportunidade
                     </BloomButton>
                 </div>
             </div>
         </BloomCard>

         <BloomCard className="overflow-hidden border-nexus-border bg-white p-4 shadow-subtle">
             <PipelineBoard
                 pipeline={pipelines[0]}
                 deals={deals}
                 onDealMove={handleDealMove}
                 onDealClick={handleDealClick}
                 onAddDeal={(stageId) => {
                    handleGoToExplore();
                    showNotification("Busque uma empresa para adicionar ao pipeline.");
                }}
                 cardConfig={cardConfig}
                 workspaceMembers={workspaceMembers}
             />
         </BloomCard>
     </div>
  );

  const renderContactsView = () => (
      <div className="space-y-4 animate-fadeIn">
          <BloomCard className="overflow-hidden border-nexus-border bg-white shadow-subtle">
              <div className="flex flex-col gap-4 border-b border-nexus-border bg-nexus-offWhite p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-nexus-warmGray">
                          Relacionamentos
                      </p>
                      <h2 className="mt-1 text-2xl font-bold tracking-tight text-nexus-charcoal">
                          Todos os Contatos
                      </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                      <BloomBadge variant="neutral" className="uppercase tracking-[0.16em]">
                          {contacts.length} contatos
                      </BloomBadge>
                      <BloomBadge variant="brand" className="uppercase tracking-[0.16em]">
                          Base ativa
                      </BloomBadge>
                  </div>
              </div>
          </BloomCard>

          {contacts.length > 0 ? (
              <BloomCard className="overflow-hidden border-nexus-border bg-white shadow-subtle">
                  <div className="overflow-x-auto">
                      <table className="w-full min-w-[1120px] table-fixed border-collapse text-left">
                          <thead className="bg-nexus-offWhite">
                              <tr className="border-b border-nexus-border text-[11px] font-semibold uppercase tracking-[0.16em] text-nexus-warmGray">
                                  <th className="w-10 px-5 py-4">
                                      <input type="checkbox" className="rounded border-nexus-border" />
                                  </th>
                                  <th className="px-5 py-4 w-[32%]">Empresa / Nome</th>
                                  <th className="px-5 py-4 w-[28%]">Email / Telefone</th>
                                  <th className="px-5 py-4 w-[32%]">Localização</th>
                                  <th className="w-[12%] px-5 py-4 text-right"></th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-nexus-border bg-white">
                              {contacts.map((contact) => (
                                  <tr
                                      key={contact.id}
                                      role="button"
                                      tabIndex={0}
                                      onClick={() => handleOpenLeadDetails(contact)}
                                      onKeyDown={(e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                              e.preventDefault();
                                              handleOpenLeadDetails(contact);
                                          }
                                      }}
                                      className="group cursor-pointer transition-colors hover:bg-nexus-bg/80 focus:bg-nexus-bg/80"
                                  >
                                      <td className="px-5 py-4">
                                          <input
                                              type="checkbox"
                                              className="rounded border-nexus-border"
                                              onClick={(e) => e.stopPropagation()}
                                          />
                                      </td>
                                      <td className="px-5 py-4 align-middle">
                                          <div className="flex items-center gap-3">
                                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-nexus-accent text-sm font-bold text-nexus-royal">
                                                  {contact.nome_fantasia.charAt(0)}
                                              </div>
                                              <div className="min-w-0">
                                                  <div className="line-clamp-2 text-sm font-semibold leading-snug text-nexus-charcoal">
                                                      {contact.nome_fantasia}
                                                  </div>
                                                  <div className="line-clamp-1 text-xs text-nexus-warmGray">
                                                      {contact.razao_social}
                                                  </div>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-5 py-4 align-middle">
                                          <div className="flex flex-col gap-1 text-xs">
                                              {contact.telefone ? (
                                                  <div className="flex items-start gap-2 text-nexus-charcoal">
                                                      <Phone className="h-3.5 w-3.5 text-nexus-warmGray" />
                                                      <span className="break-words leading-relaxed">{contact.telefone}</span>
                                                  </div>
                                              ) : (
                                                  <span className="text-nexus-warmGray">--</span>
                                              )}
                                              {contact.website ? (
                                                  <div className="flex items-start gap-2 text-nexus-royal">
                                                      <Globe2 className="h-3.5 w-3.5 text-nexus-warmGray" />
                                                      <span className="break-words leading-relaxed">{contact.website}</span>
                                                  </div>
                                              ) : (
                                                  <span className="text-nexus-warmGray">--</span>
                                              )}
                                          </div>
                                      </td>
                                      <td className="px-5 py-4 align-middle">
                                          <div className="space-y-1">
                                              <div
                                                  className="line-clamp-2 text-sm leading-relaxed text-nexus-charcoal"
                                                  title={contact.endereco || contact.cidade}
                                              >
                                                  {contact.endereco || contact.cidade}
                                              </div>
                                              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-nexus-warmGray">
                                                  {[contact.cidade, contact.uf].filter(Boolean).join(' • ') || '--'}
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-5 py-4 text-right align-middle">
                                          <div className="flex justify-end gap-2">
                                              <BloomButton
                                                  variant="secondary"
                                                  size="sm"
                                                  className="opacity-0 transition-opacity group-hover:opacity-100"
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleOpenLeadDetails(contact);
                                                  }}
                                              >
                                                  Detalhes
                                              </BloomButton>
                                              <BloomButton
                                                  variant="icon"
                                                  size="icon"
                                                  className="ml-auto"
                                                  aria-label="Ver detalhes"
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleOpenLeadDetails(contact);
                                                  }}
                                              >
                                                  <Eye className="h-4 w-4" />
                                          </BloomButton>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </BloomCard>
          ) : (
              <BloomCard className="flex min-h-[20rem] flex-col items-center justify-center border-dashed border-nexus-border bg-white p-8 text-center shadow-subtle">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nexus-accent text-nexus-royal">
                      <Phone className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-nexus-charcoal">Nenhum contato salvo ainda</h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-nexus-warmGray">
                      Salve empresas a partir da exploração para construir sua base de relacionamento e acelerar follow-up.
                  </p>
              </BloomCard>
          )}
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
    <div className="min-h-screen bg-nexus-bg font-sans flex text-nexus-charcoal overflow-hidden">

      <aside
         className={`sticky top-0 flex h-screen flex-col bg-nexus-sidebar text-white shadow-float transition-all duration-300 ease-in-out border-r border-white/10 ${isSidebarExpanded ? 'w-72' : 'w-20'}`}
         onMouseEnter={() => !isSidebarPinned && setIsSidebarHovered(true)}
         onMouseLeave={() => !isSidebarPinned && setIsSidebarHovered(false)}
      >
          <div className="flex h-20 items-center gap-3 border-b border-white/10 px-4">
               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-nexus-royal/20 ring-1 ring-white/10">
                    <Hexagon size={19} fill="currentColor" className="text-white" />
               </div>
               <div className={`min-w-0 overflow-hidden transition-all duration-300 ${isSidebarExpanded ? 'opacity-100' : 'w-0 opacity-0'}`}>
                   <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-nexus-sand/70">Bloom Leads</p>
                   <h1 className="truncate text-lg font-bold tracking-tight whitespace-nowrap">{APP_NAME}</h1>
               </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="space-y-6">
              {NAV_STRUCTURE.map((group) => (
                  <div key={group.title}>
                      {isSidebarExpanded && (
                          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-nexus-sand/60">
                              {group.title}
                          </div>
                      )}

                      <div className="space-y-1">
                          {group.items.map(item => (
                              <button
                                 key={item.id}
                                 onClick={() => item.id === 'explore' ? handleGoToExplore() : setActiveModuleId(item.id)}
                                 className={`group relative flex h-11 w-full items-center gap-3 rounded-2xl px-3 text-left transition-colors duration-200 ${
                                     activeModuleId === item.id
                                     ? 'bg-white text-nexus-sidebar shadow-sm'
                                     : 'text-nexus-sand hover:bg-white/10 hover:text-white'
                                 }`}
                              >
                                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors ${activeModuleId === item.id ? 'bg-nexus-royal text-white' : 'bg-white/10 text-nexus-sand group-hover:text-white'}`}>
                                    <item.icon className="h-4 w-4" />
                                  </span>
                                  <span className={`min-w-0 flex-1 truncate text-sm font-medium transition-all duration-300 ${isSidebarExpanded ? 'opacity-100' : 'w-0 opacity-0'}`}>
                                      {item.label}
                                  </span>

                                  {activeModuleId === item.id && <span className="h-2 w-2 rounded-full bg-nexus-royal" />}

                                  {!isSidebarExpanded && (
                                      <div className="absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-nexus-sidebar px-3 py-1 text-xs font-medium text-white shadow-xl group-hover:block">
                                          {item.label}
                                      </div>
                                  )}
                              </button>
                          ))}
                      </div>
                  </div>
              ))}
            </div>

            <BloomCard className={`mt-6 border-white/10 bg-white/5 text-white ${isSidebarExpanded ? 'p-4' : 'p-3'}`}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-nexus-sand">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className={`min-w-0 ${isSidebarExpanded ? 'block' : 'hidden'}`}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-nexus-sand/70">Uso pessoal</p>
                  <h3 className="mt-1 text-sm font-semibold">Sem bloqueio de plano</h3>
                  <p className="mt-1 text-xs leading-relaxed text-nexus-sand/70">
                    As buscas seguem liberadas enquanto este modo estiver ativo.
                  </p>
                  <BloomButton
                    variant="secondary"
                    size="sm"
                    fullWidth
                    onClick={() => setIsPricingModalOpen(true)}
                    className="mt-4 border-white/10 bg-white text-nexus-charcoal hover:bg-nexus-offWhite"
                  >
                    Detalhes
                  </BloomButton>
                </div>
              </div>
            </BloomCard>
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

           <header className="flex items-center justify-between gap-4 border-b border-nexus-border bg-nexus-surface/95 px-4 py-4 shrink-0 z-40 shadow-subtle backdrop-blur-sm md:px-6">
                <div className="flex items-center w-full max-w-xl">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nexus-warmGray" />
                        <BloomInput
                            type="text"
                            placeholder={`Pesquisar no ${APP_NAME} (Ctrl+K)`}
                            className="h-11 rounded-2xl border-nexus-border bg-white pl-11 pr-4 shadow-subtle placeholder:text-nexus-warmGray/80"
                        />
                    </div>
                </div>

                <div className="ml-6 flex items-center gap-3">
                    {syncState && (
                        <BloomBadge
                            variant={syncState.variant}
                            className="hidden max-w-[15rem] truncate uppercase tracking-[0.14em] md:inline-flex"
                            title={syncState.detail}
                        >
                            {syncState.label}
                        </BloomBadge>
                    )}
                    <BloomButton variant="icon" size="icon" aria-label="Notificações">
                        <div className="relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-nexus-royal ring-2 ring-white" />
                        </div>
                    </BloomButton>

                    <div className="relative" ref={accountMenuRef}>
                        <BloomButton
                            variant="secondary"
                            size="sm"
                            onClick={() => setIsAccountMenuOpen((current) => !current)}
                            className="rounded-full border-nexus-border bg-white px-2.5 text-nexus-charcoal hover:bg-nexus-bg"
                        >
                            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-nexus-royal text-xs font-bold text-white">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="User" className="h-full w-full object-cover" />
                                ) : (
                                    user?.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <span className="hidden max-w-[10rem] truncate text-left text-xs font-semibold text-nexus-charcoal md:block">
                                {user?.name}
                            </span>
                        </BloomButton>

                        {isAccountMenuOpen && (
                            <div className="absolute right-0 top-full mt-3 w-64">
                                <BloomCard className="overflow-hidden border-nexus-border bg-white p-2 shadow-float">
                                    <div className="border-b border-nexus-border px-3 py-2">
                                        <p className="truncate text-sm font-bold text-nexus-charcoal">{user?.name}</p>
                                        <p className="truncate text-[11px] text-nexus-warmGray">{user?.email}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            {syncState ? (
                                                <BloomBadge variant={syncState.variant} className="uppercase tracking-[0.14em]">
                                                    {syncState.label}
                                                </BloomBadge>
                                            ) : (
                                                <BloomBadge variant="neutral" className="uppercase tracking-[0.14em]">
                                                    Carregando sync
                                                </BloomBadge>
                                            )}
                                        </div>
                                        {syncState && (
                                            <p className="mt-2 text-[11px] leading-relaxed text-nexus-warmGray">
                                                {syncState.detail}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1 px-1 py-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAccountMenuOpen(false);
                                                setIsSettingsModalOpen(true);
                                            }}
                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-nexus-charcoal hover:bg-nexus-bg"
                                        >
                                            <Settings className="h-3.5 w-3.5" />
                                            Configurações
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAccountMenuOpen(false);
                                                setIsPricingModalOpen(true);
                                            }}
                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-nexus-royal hover:bg-nexus-accent/60"
                                        >
                                            <Sparkles className="h-3.5 w-3.5" />
                                            Detalhes do workspace
                                        </button>
                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="h-3.5 w-3.5" />
                                            Sair da conta
                                        </button>
                                    </div>
                                </BloomCard>
                            </div>
                        )}
                    </div>
                </div>
           </header>

           <div className="flex-1 overflow-y-auto bg-nexus-bg px-4 py-4 md:px-6 md:py-6">
                <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col gap-6">
                    {activeModuleId === 'explore' && renderExploreViewNew()}
                    {activeModuleId === 'lists' && renderListsView()}
                    {activeModuleId === 'pipeline' && renderPipelineView()}
                    {activeModuleId === 'contacts' && renderContactsView()}
                    {!['explore', 'lists', 'contacts', 'pipeline'].includes(activeModuleId) && (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                            <div className="w-16 h-16 bg-nexus-sandLight rounded-full flex items-center justify-center mb-4">
                                <User className="w-8 h-8 text-nexus-sand" />
                            </div>
                            <h3 className="text-lg font-bold text-nexus-charcoal">Módulo em construção</h3>
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
                 <p className="text-xs text-nexus-warmGray mb-4">Crie a lista e, se quiser, associe a uma pasta.</p>
                 <input type="text" value={listNameInput} onChange={(e) => setListNameInput(e.target.value)} className="w-full border border-nexus-sand p-2.5 rounded mb-4 text-sm focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal outline-none" placeholder="Nome da lista (Ex: Padarias SP)" autoFocus />
                 <input type="text" value={listGroupInput} onChange={(e) => setListGroupInput(e.target.value)} className="w-full border border-nexus-sand p-2.5 rounded mb-4 text-sm focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal outline-none" placeholder="Grupo da lista (opcional)" />
                 <div className="flex justify-end gap-2">
                     <button onClick={() => { setIsSaveListModalOpen(false); setListNameInput(''); setListGroupInput(''); }} className="px-4 py-2 text-nexus-charcoal font-bold text-xs hover:bg-nexus-sandLight rounded transition-colors">Cancelar</button>
                     <button onClick={confirmSaveBatchList} className="px-4 py-2 bg-nexus-royal text-white font-bold text-xs rounded hover:bg-nexus-crimsonLight transition-colors shadow-sm">Salvar Lista</button>
                 </div>
             </div>
          </div>
      )}

      <SelectListModal
           isOpen={isSelectListModalOpen}
           onClose={() => { setIsSelectListModalOpen(false); setLeadToSave(null); }}
           onConfirm={confirmSaveLeadToList}
           lang={currentLang}
      />

      <AddToPipelineModal
          isOpen={isAddToPipelineModalOpen}
          onClose={() => setIsAddToPipelineModalOpen(false)}
          onConfirm={confirmAddToPipeline}
          pipelines={pipelines}
          company={leadToPipeline}
      />

      <PricingModal
          isOpen={isPricingModalOpen}
          onClose={() => setIsPricingModalOpen(false)}
      />

      <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          cardConfig={cardConfig}
          onUpdateCardConfig={handleUpdateCardConfig}
          pipelines={pipelines}
          setPipelines={setPipelines}
      />

      <DealDetailsModal
          isOpen={isDealDetailsModalOpen}
          onClose={() => setIsDealDetailsModalOpen(false)}
          deal={selectedDeal}
          onSave={handleSaveDeal}
          onDelete={handleDeleteDeal}
          lang={currentLang}
          pipelines={pipelines}
          workspaceMembers={workspaceMembers}
      />

      <JobWorker />
    </div>
  );
};

export default App;
