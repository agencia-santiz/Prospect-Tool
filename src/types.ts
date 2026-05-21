
export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  CONVERTED = 'CONVERTED'
}

export type DataSource = 'GOOGLE_MAPS' | 'GOV_DATA' | 'WEB_SCRAP' | 'LINKEDIN' | 'OPEN_DATA';
export type WhatsAppStatus = 'CONFIRMED' | 'UNCONFIRMED' | 'NONE';

export type UserPlan = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: UserPlan;
  companyName?: string;
  usage: number; // Current extractions this month
  limit: number; // Max extractions per month (100 for Free)
}

export interface Company {
  id: string;
  cnpj: string; // Can be Tax ID for international
  razao_social: string;
  nome_fantasia: string;
  endereco?: string; // New field: Full Address
  cidade: string;
  uf: string;
  pais: string; // Added country
  bairro?: string;
  cep?: string;
  // Financials removed
  opening_hours?: string; // New field: "Seg-Sex: 08:00 - 18:00"
  is_open_now?: boolean;  // New field
  atividade_principal: string;
  telefone?: string;
  email?: string;
  website?: string;
  websiteDomain?: string;
  rating?: number;
  userRatingsTotal?: number;
  whatsappStatus?: WhatsAppStatus;
  status: LeadStatus;
  score: number; // 0 to 100
  rankingReasons?: string[];
  relevance_summary?: string;
  provenance?: any;
  partners?: string[];
  source: DataSource; 
  googleMapsUri?: string;
  socials?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}
export interface SearchParams {
  city: string;
  segment: string;
  intent?: string;
}

export interface SavedList {
  id: string;
  name: string;
  createdAt: string;
  leads: Company[];
  params: SearchParams;
  groupName?: string;
}

// CRM TYPES

export interface PipelineStage {
  id: string;
  name: string;
  color: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  isDefault?: boolean;
}

export interface DealContactInfo {
    phone?: string;
    email?: string;
    website?: string;
    location?: string;
}

export interface DealCustomField {
    label: string;
    value: string;
    section?: 'commercial' | 'production' | 'custom';
}

export interface ActivityLog {
    id: string;
    type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE';
    content: string;
    createdAt: string;
    user: string; // The user who performed the action
}

export interface LeadPerson {
    id: string;
    name: string;
    title: string;
    location: string;
    department: string;
    email?: string;
    phone?: string;
    emailRevealed: boolean;
}

export interface DealTask {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
}

export interface Deal {
  id: string;
  companyId?: string; 
  ownerUserId?: string;
  companyName: string;
  value: number;
  pipelineId: string;
  stageId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  summary?: string;
  nextStep?: string;
  contactInfo?: DealContactInfo;
  customFields: DealCustomField[];
  activities: ActivityLog[];
  people: LeadPerson[];
  tasks: DealTask[]; // Added for persistence
}

export interface CardVisibilityConfig {
  showId: boolean;
  showValue: boolean;
  showPriority: boolean;
  showDate: boolean;
  showContactInfo: boolean;
  showLocation: boolean;
  showTags: boolean;
}
