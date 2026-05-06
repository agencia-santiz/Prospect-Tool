export const DOMAIN_CONTRACT_VERSION = '2026-05-05';

export const DOMAIN_NAMES = [
  'search',
  'company',
  'lead',
  'contact',
  'deal',
  'pipeline',
  'workspace',
] as const;

export type DomainName = (typeof DOMAIN_NAMES)[number];

export interface DomainEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SearchContract extends DomainEntity {
  workspaceId?: string;
  city: string;
  region?: string;
  segment: string;
  segmentCanonicalId?: string;
  sourcePriority: string[];
  status: 'queued' | 'running' | 'completed' | 'failed';
  requestedQuantity?: number;
  resultCount?: number;
  filters?: Record<string, string | number | boolean | null>;
}

export interface CompanyContract extends DomainEntity {
  workspaceId?: string;
  sourceId?: string;
  taxId?: string;
  legalName: string;
  tradeName: string;
  segment: string;
  website?: string;
  websiteDomain?: string;
  emails?: string[];
  phones?: string[];
  whatsappStatus?: 'confirmed' | 'unconfirmed' | 'none';
  address?: {
    line1?: string;
    neighborhood?: string;
    city: string;
    region: string;
    country: string;
    postalCode?: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  score?: number;
  provenance?: Record<string, string>;
}

export interface LeadContract extends DomainEntity {
  workspaceId?: string;
  searchId?: string;
  companyId: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  rank?: number;
  score?: number;
  reason?: string;
  source?: string;
}

export interface ContactContract extends DomainEntity {
  workspaceId?: string;
  companyId: string;
  leadId?: string;
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  whatsappStatus?: 'confirmed' | 'unconfirmed' | 'none';
  preferredChannel?: 'email' | 'phone' | 'whatsapp';
}

export interface PipelineContract extends DomainEntity {
  workspaceId?: string;
  name: string;
  isDefault?: boolean;
  stages: Array<{
    id: string;
    name: string;
    order: number;
    color?: string;
  }>;
}

export interface DealContract extends DomainEntity {
  workspaceId?: string;
  companyId?: string;
  pipelineId: string;
  stageId: string;
  title: string;
  value?: number;
  priority?: 'low' | 'medium' | 'high';
  contactId?: string;
  nextStep?: string;
  notes?: string;
}

export interface WorkspaceContract extends DomainEntity {
  ownerUserId: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  memberCount?: number;
}

export interface SavedListContract extends DomainEntity {
  workspaceId?: string;
  name: string;
  searchId?: string;
  leadIds: string[];
}

export interface DomainContractsIndex {
  version: string;
  domains: readonly DomainName[];
}

export const DOMAIN_CONTRACTS: DomainContractsIndex = {
  version: DOMAIN_CONTRACT_VERSION,
  domains: DOMAIN_NAMES,
};
