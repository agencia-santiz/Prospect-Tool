import React, { useEffect, useState } from 'react';
import { Deal, Pipeline, ActivityLog, LeadPerson, DealTask } from '../types';
import { translations, Language } from '../utils/i18n';
import { buildWhatsAppChatUrl, getWhatsAppChatTarget, getWhatsAppStatus } from '../utils/whatsappLink.js';
import { formatCurrency } from '../utils/estimation';
import { NextActionBlock, getDealAgeInfo, getDealPriorityInfo } from './dealWidgets';
import BloomBadge from './ui/badge';
import BloomButton from './ui/button';
import BloomCard from './ui/card';
import {
  Activity,
  AlertCircle,
  BadgeInfo,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Clock3,
  Database,
  FileText,
  Link as LinkIcon,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  Plus,
  Save,
  Settings,
  Sparkles,
  Phone,
  Trash2,
  Users,
  X,
} from 'lucide-react';

interface DealDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onSave: (updatedDeal: Deal) => void;
  onDelete: (dealId: string) => void;
  lang: Language;
  pipelines: Pipeline[];
  workspaceMembers: Array<{
    userId: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
}

const TAB_ITEMS = ['Visão Geral', 'Atividades', 'Contatos'] as const;

const CUSTOM_FIELD_SECTION_ORDER = ['commercial', 'production', 'custom'] as const;
type CustomFieldSection = (typeof CUSTOM_FIELD_SECTION_ORDER)[number];
const CUSTOM_FIELD_SECTION_LABELS: Record<CustomFieldSection, string> = {
  commercial: 'Comercial',
  production: 'Produção',
  custom: 'Outros',
};

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

const resolveCustomFieldSection = (field: { label: string; section?: string }): CustomFieldSection => {
  if (field.section && CUSTOM_FIELD_SECTION_ORDER.includes(field.section as CustomFieldSection)) {
    return field.section as CustomFieldSection;
  }

  return inferCustomFieldSection(field.label);
};

const DetailLabel: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({
  label,
  value,
  className = '',
}) => (
  <div className={className}>
    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
      {label}
    </div>
    <div className="mt-1.5 text-sm leading-relaxed text-nexus-charcoal break-words">{value}</div>
  </div>
);

const PanelCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className = '' }) => (
  <BloomCard className={`h-full rounded-2xl border-nexus-border bg-white shadow-subtle ${className}`}>
    <div className="flex items-center gap-2 border-b border-nexus-border/70 px-5 py-4">
      <span className="text-nexus-warmGray">{icon}</span>
      <h3 className="text-sm font-bold text-nexus-charcoal">{title}</h3>
    </div>
    <div className="p-5">{children}</div>
  </BloomCard>
);

const SummaryTile: React.FC<{
  label: string;
  value: React.ReactNode;
  accent?: React.ReactNode;
}> = ({ label, value, accent }) => (
  <div className="flex min-h-[92px] flex-col justify-center bg-white px-5 py-4">
    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
      {label}
    </div>
    <div className="mt-3 flex items-center gap-2 text-sm font-bold text-nexus-charcoal">
      {accent}
      <span className="min-w-0 truncate">{value}</span>
    </div>
  </div>
);

const TimelineItem: React.FC<{
  label: string;
  time: string;
  detail: string;
  last?: boolean;
}> = ({ label, time, detail, last = false }) => (
  <div className="relative pl-8">
    <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-nexus-border bg-white" />
    {!last && <span className="absolute left-[6px] top-5 h-full w-px bg-nexus-border" />}
    <div className="text-xs text-nexus-warmGray">{time}</div>
    <div className="mt-1 text-sm font-semibold text-nexus-charcoal">{label}</div>
    <p className="mt-1 text-sm leading-relaxed text-nexus-warmGray">{detail}</p>
  </div>
);

const SidebarSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <section className="border-b border-nexus-border last:border-b-0">
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2 text-sm font-bold text-nexus-charcoal">
        <span className="text-nexus-warmGray">{icon}</span>
        {title}
      </div>
      <Settings className="h-3.5 w-3.5 text-nexus-warmGray" />
    </div>
    <div className="px-5 pb-5">{children}</div>
  </section>
);

const DealDetailsModal: React.FC<DealDetailsModalProps> = ({
  isOpen,
  onClose,
  deal,
  onSave,
  onDelete,
  lang,
  pipelines,
  workspaceMembers,
}) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<Deal | null>(null);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [activeTab, setActiveTab] = useState<(typeof TAB_ITEMS)[number]>('Visão Geral');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [newActivityContent, setNewActivityContent] = useState('');
  const [activityType, setActivityType] = useState<'CALL' | 'EMAIL' | 'MEETING' | 'NOTE'>('NOTE');
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonTitle, setNewPersonTitle] = useState('');

  useEffect(() => {
    if (!deal) {
      setFormData(null);
      setMode('view');
      return;
    }

    setFormData({
      ...deal,
      ownerUserId: deal.ownerUserId || '',
      summary: deal.summary || '',
      nextStep: deal.nextStep || '',
      activities: deal.activities || [],
      people: deal.people || [],
      tasks: deal.tasks || [],
      customFields: (deal.customFields || []).map((field) => ({
        ...field,
        section: resolveCustomFieldSection(field),
      })),
    });
    setMode('view');
  }, [deal]);

  if (!isOpen || !formData) {
    return null;
  }

  const currentPipeline = pipelines.find((pipeline) => pipeline.id === formData.pipelineId);
  const currentStageName =
    currentPipeline?.stages.find((stage) => stage.id === formData.stageId)?.name || 'Cold';
  const dealAgeInfo = getDealAgeInfo(formData);
  const dealPriorityInfo = getDealPriorityInfo(formData.priority);
  const whatsappTarget = getWhatsAppChatTarget({
    telefone: formData.contactInfo?.phone,
    website: formData.contactInfo?.website,
  });
  const whatsappStatus = getWhatsAppStatus({
    telefone: formData.contactInfo?.phone,
    website: formData.contactInfo?.website,
  });
  const sourceLabel = formData.customFields.find((field) => field.label === 'Source')?.value || 'Origem local';
  const industryLabel =
    formData.customFields.find((field) => field.label === 'Industry')?.value || 'Segmento não informado';
  const locationLabel = formData.contactInfo?.location || 'Localização não informada';
  const ownerMember = workspaceMembers.find((member) => member.userId === formData.ownerUserId) || null;
  const responsibleLabel = ownerMember?.name || 'Não definido';
  const summaryValue = formatCurrency(formData.value || 0);
  const summaryLabel = formData.summary?.trim() || 'Nenhum resumo registrado.';
  const customFieldsWithSections = (formData.customFields || []).map((field, index) => ({
    ...field,
    index,
    section: resolveCustomFieldSection(field),
  }));
  const groupedCustomFields = CUSTOM_FIELD_SECTION_ORDER.map((section) => ({
    section,
    fields: customFieldsWithSections.filter((field) => field.section === section),
  }));
  const productionFileField = customFieldsWithSections.find(
    (field) => field.section === 'production' && field.label.trim().toLowerCase() === 'arquivo',
  );
  const timelineEntries = [
    {
      label: 'Lead criado',
      time: new Date(formData.createdAt).toLocaleString('pt-BR'),
      detail: `Entrada da oportunidade em ${currentPipeline?.name || 'pipeline padrão'}.`,
    },
    ...(formData.activities || []).slice(0, 3).map((activity: ActivityLog) => ({
      label:
        activity.type === 'CALL'
          ? 'Ligação registrada'
          : activity.type === 'EMAIL'
            ? 'Email enviado'
            : activity.type === 'MEETING'
              ? 'Reunião agendada'
              : 'Nota adicionada',
      time: new Date(activity.createdAt).toLocaleString('pt-BR'),
      detail: activity.content,
    })),
  ].slice(0, 4);

  const warnings = [
    !formData.contactInfo?.phone ? 'Telefone não informado' : null,
    !formData.contactInfo?.website ? 'Website não informado' : null,
    !formData.nextStep?.trim() ? 'Sem próxima ação definida' : null,
    (formData.activities || []).length === 0 ? 'Sem interação registrada' : null,
    (formData.people || []).length === 0 ? 'Sem contato vinculado' : null,
  ].filter(Boolean) as string[];

  const openCall = () => {
    const phone = formData.contactInfo?.phone?.trim();
    if (!phone) return;

    window.open(`tel:${phone}`, '_self');
  };

  const openWhatsApp = () => {
    if (!whatsappTarget) return;

    const url = buildWhatsAppChatUrl(whatsappTarget);
    if (!url) return;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openWebsite = () => {
    const website = formData.contactInfo?.website;
    if (!website) return;

    const finalUrl = website.startsWith('http://') || website.startsWith('https://') ? website : `https://${website}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask: DealTask = {
      id: Date.now().toString(),
      text: newTaskInput.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setFormData({
      ...formData,
      tasks: [...(formData.tasks || []), newTask],
    });
    setNewTaskInput('');
    setShowTaskInput(false);
  };

  const toggleTask = (taskId: string) => {
    setFormData({
      ...formData,
      tasks: (formData.tasks || []).map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    });
  };

  const handleLogActivity = () => {
    if (!newActivityContent.trim()) return;

    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      type: activityType,
      content: newActivityContent.trim(),
      createdAt: new Date().toISOString(),
      user: 'Você',
    };

    setFormData({
      ...formData,
      activities: [newActivity, ...(formData.activities || [])],
    });
    setNewActivityContent('');
  };

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;

    const newPerson: LeadPerson = {
      id: Date.now().toString(),
      name: newPersonName.trim(),
      title: newPersonTitle.trim(),
      location: formData.contactInfo?.location || 'Desconhecido',
      department: 'Geral',
      emailRevealed: false,
    };

    setFormData({
      ...formData,
      people: [...(formData.people || []), newPerson],
    });
    setIsAddingPerson(false);
    setNewPersonName('');
    setNewPersonTitle('');
  };

  const removePerson = (personId: string) => {
    setFormData({
      ...formData,
      people: (formData.people || []).filter((person) => person.id !== personId),
    });
  };

  const revealEmail = (personId: string) => {
    setFormData({
      ...formData,
      people: (formData.people || []).map((person) => {
        if (person.id !== personId) {
          return person;
        }

        const cleanName = person.name.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
        const cleanCompany = formData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
        return {
          ...person,
          emailRevealed: true,
          email: `${cleanName}@${cleanCompany}.com.br`,
        };
      }),
    });
  };

  const handleEnableEdit = () => setMode('edit');

  const handleCancelEdit = () => {
    if (!deal) {
      return;
    }

    setFormData({
      ...deal,
      ownerUserId: deal.ownerUserId || '',
      summary: deal.summary || '',
      nextStep: deal.nextStep || '',
      activities: deal.activities || [],
      people: deal.people || [],
      tasks: deal.tasks || [],
      customFields: (deal.customFields || []).map((field) => ({
        ...field,
        section: resolveCustomFieldSection(field),
      })),
    });
    setMode('view');
  };

  const updateField = <K extends keyof Deal>(key: K, value: Deal[K]) => {
    setFormData((current) => {
      if (!current) {
        return current;
      }

      return { ...current, [key]: value };
    });
  };

  const updateContactField = (key: keyof NonNullable<Deal['contactInfo']>, value: string) => {
    setFormData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        contactInfo: {
          ...(current.contactInfo || {}),
          [key]: value,
        },
      };
    });
  };

  const updateCustomField = (index: number, key: 'label' | 'value' | 'section', value: string) => {
    setFormData((current) => {
      if (!current) {
        return current;
      }

      const nextFields = [...(current.customFields || [])];
      if (!nextFields[index]) {
        return current;
      }

      nextFields[index] = { ...nextFields[index], [key]: value };
      return { ...current, customFields: nextFields };
    });
  };

  const upsertCustomField = (label: string, value: string, section: CustomFieldSection) => {
    setFormData((current) => {
      if (!current) {
        return current;
      }

      const normalizedLabel = label.trim().toLowerCase();
      const nextFields = [...(current.customFields || [])];
      const existingIndex = nextFields.findIndex((field) => field.label.trim().toLowerCase() === normalizedLabel);

      if (existingIndex >= 0) {
        nextFields[existingIndex] = {
          ...nextFields[existingIndex],
          label,
          value,
          section,
        };
      } else {
        nextFields.push({ label, value, section });
      }

      return { ...current, customFields: nextFields };
    });
  };

  const updatePersonField = (personId: string, key: keyof LeadPerson, value: string | boolean) => {
    setFormData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        people: (current.people || []).map((person) =>
          person.id === personId ? { ...person, [key]: value } : person,
        ),
      };
    });
  };

  const updateTaskText = (taskId: string, text: string) => {
    setFormData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        tasks: (current.tasks || []).map((task) => (task.id === taskId ? { ...task, text } : task)),
      };
    });
  };

  const addCustomField = (section: CustomFieldSection = 'custom') => {
    setFormData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        customFields: [...(current.customFields || []), { label: 'Novo campo', value: '', section }],
      };
    });
  };

  const removeCustomField = (index: number) => {
    setFormData((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        customFields: (current.customFields || []).filter((_, fieldIndex) => fieldIndex !== index),
      };
    });
  };

  const renderOverview = () => (
    <div className="space-y-5">
      <div className="grid gap-px overflow-hidden rounded-3xl border border-nexus-border bg-nexus-border shadow-subtle xl:grid-cols-4">
        <SummaryTile
          label="Status"
          value={currentStageName}
          accent={<span className="h-2.5 w-2.5 rounded-full bg-red-500" />}
        />
        <SummaryTile
          label="Prioridade"
          value={dealPriorityInfo.label}
          accent={dealPriorityInfo.icon}
        />
        <SummaryTile
          label="Etapa"
          value={currentStageName}
          accent={<LayoutGridIcon />}
        />
        <SummaryTile
          label="Responsável"
          value={responsibleLabel}
          accent={<Users className="h-3.5 w-3.5 text-nexus-warmGray" />}
        />
      </div>

      <div className="grid gap-px overflow-hidden rounded-3xl border border-nexus-border bg-nexus-border shadow-subtle xl:grid-cols-3">
        <PanelCard title="Situação atual" icon={<Building2 className="h-4 w-4" />}>
          <div className="space-y-4">
            {mode === 'edit' ? (
              <div className="grid gap-3">
                <input
                  type="text"
                  className="h-11 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  placeholder="Nome da empresa"
                />
                <textarea
                  className="min-h-[96px] rounded-xl border border-nexus-border bg-white p-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                  value={formData.summary || ''}
                  onChange={(e) => updateField('summary', e.target.value)}
                  placeholder="Resumo do lead"
                />
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-nexus-charcoal">
                {formData.companyName} está na etapa <strong>{currentStageName}</strong> com prioridade{' '}
                <strong>{dealPriorityInfo.label.toLowerCase()}</strong>.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <BloomBadge variant="brand" className="uppercase tracking-[0.14em]">
                {dealAgeInfo.label}
              </BloomBadge>
              <BloomBadge variant="info" className="uppercase tracking-[0.14em]">
                {whatsappStatus === 'CONFIRMED'
                  ? t.whatsapp_confirmed
                  : whatsappStatus === 'UNCONFIRMED'
                    ? t.whatsapp_unconfirmed
                    : t.whatsapp_not_available}
              </BloomBadge>
            </div>
            <div className="rounded-2xl border border-nexus-border bg-nexus-bg p-4">
              {mode === 'edit' ? (
                <textarea
                  className="min-h-[120px] w-full rounded-xl border border-nexus-border bg-white p-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                  value={formData.summary || ''}
                  onChange={(e) => updateField('summary', e.target.value)}
                  placeholder="Descreva o resumo do lead"
                />
              ) : (
                <DetailLabel label="Resumo do lead" value={summaryLabel} />
              )}
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Próxima ação" icon={<CheckSquare className="h-4 w-4" />}>
          {mode === 'edit' ? (
            <textarea
              className="min-h-[140px] w-full rounded-xl border border-nexus-border bg-white p-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
              value={formData.nextStep || ''}
              onChange={(e) => updateField('nextStep', e.target.value)}
              placeholder="Próxima ação"
            />
          ) : (
            <NextActionBlock
              action={formData.nextStep}
              fallback="Sem próxima ação definida."
              ageLabel={dealAgeInfo.label}
              ageTone={dealAgeInfo.tone}
            />
          )}
        </PanelCard>

        <PanelCard title="Dados comerciais" icon={<Database className="h-4 w-4" />}>
          <div className="grid gap-4">
            {mode === 'edit' ? (
              <>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">Origem</div>
                  <input
                    type="text"
                    className="mt-1.5 h-11 w-full rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                    value={sourceLabel}
                    onChange={(e) => upsertCustomField('Source', e.target.value, 'commercial')}
                    placeholder="Origem"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">Responsável</div>
                  <select
                    className="mt-1.5 h-11 w-full rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                    value={formData.ownerUserId || ''}
                    onChange={(e) => updateField('ownerUserId', e.target.value)}
                  >
                    <option value="">Sem responsável</option>
                    {workspaceMembers.map((member) => (
                      <option key={member.userId} value={member.userId}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">Valor do negócio</div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1.5 h-11 w-full rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                    value={formData.value}
                    onChange={(e) => updateField('value', Number(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">Prioridade</div>
                  <select
                    className="mt-1.5 h-11 w-full rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                    value={formData.priority}
                    onChange={(e) => updateField('priority', e.target.value as Deal['priority'])}
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">Etapa</div>
                  <select
                    className="mt-1.5 h-11 w-full rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                    value={formData.stageId}
                    onChange={(e) => updateField('stageId', e.target.value)}
                  >
                    {(currentPipeline?.stages || []).map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">Pipeline</div>
                  <select
                    className="mt-1.5 h-11 w-full rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                    value={formData.pipelineId}
                    onChange={(e) => {
                      const nextPipeline = pipelines.find((pipeline) => pipeline.id === e.target.value);
                      const nextStageId = nextPipeline?.stages[0]?.id || formData.stageId;
                      setFormData((current) =>
                        current
                          ? { ...current, pipelineId: e.target.value, stageId: nextStageId }
                          : current,
                      );
                    }}
                  >
                    {pipelines.map((pipeline) => (
                      <option key={pipeline.id} value={pipeline.id}>
                        {pipeline.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <DetailLabel label="Origem" value={sourceLabel} />
                <DetailLabel label="Valor do negócio" value={summaryValue} />
                <DetailLabel label="Responsável" value={responsibleLabel} />
                <DetailLabel label="Prazo máximo" value={dealAgeInfo.label} />
                <DetailLabel label="Etapa" value={currentStageName} />
              </>
            )}
          </div>
        </PanelCard>

        <PanelCard title="Produção" icon={<Briefcase className="h-4 w-4" />}>
          <div className="grid gap-4">
            {mode === 'edit' ? (
              <>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">Produto</div>
                  <input
                    type="text"
                    className="mt-1.5 h-11 w-full rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                    value={industryLabel}
                    onChange={(e) => upsertCustomField('Industry', e.target.value, 'production')}
                    placeholder="Produto / segmento"
                  />
                </div>
                <DetailLabel label="Pipeline" value={currentPipeline?.name || 'Pipeline padrão'} />
                <DetailLabel label="Prazo" value={dealAgeInfo.label} />
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">Arquivo</div>
                  <input
                    type="text"
                    className="mt-1.5 h-11 w-full rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                    value={productionFileField?.value || ''}
                    onChange={(e) => upsertCustomField('Arquivo', e.target.value, 'production')}
                    placeholder="Arquivo"
                  />
                </div>
                <DetailLabel label="Proposta / PDF" value="Sem proposta vinculada" />
              </>
            ) : (
              <>
                <DetailLabel label="Produto" value={industryLabel} />
                <DetailLabel label="Pipeline" value={currentPipeline?.name || 'Pipeline padrão'} />
                <DetailLabel label="Prazo" value={dealAgeInfo.label} />
                <DetailLabel label="Arquivo" value={productionFileField?.value || 'Sem arquivo vinculado'} />
                <DetailLabel label="Proposta / PDF" value="Sem proposta vinculada" />
              </>
            )}
          </div>
        </PanelCard>

        <PanelCard title="Pendências" icon={<AlertCircle className="h-4 w-4" />}>
          {warnings.length > 0 ? (
            <ul className="space-y-3 text-sm text-nexus-charcoal">
              {warnings.map((warning) => (
                <li key={warning} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-nexus-royal" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-nexus-border bg-nexus-bg p-4 text-sm text-nexus-warmGray">
              Nenhuma pendência relevante no momento.
            </div>
          )}
        </PanelCard>

        <PanelCard title="Histórico curto" icon={<Clock3 className="h-4 w-4" />}>
          {timelineEntries.length > 0 ? (
            <div className="space-y-5">
              {timelineEntries.map((entry, index) => (
                <TimelineItem
                  key={`${entry.label}-${entry.time}`}
                  label={entry.label}
                  time={entry.time}
                  detail={entry.detail}
                  last={index === timelineEntries.length - 1}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-nexus-border bg-nexus-bg p-4 text-sm text-nexus-warmGray">
              Nenhum histórico registrado.
            </div>
          )}
        </PanelCard>
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="space-y-5">
      <BloomCard className="rounded-2xl border-nexus-border bg-white shadow-subtle">
        <div className="flex flex-wrap items-center gap-2 border-b border-nexus-border/70 bg-nexus-offWhite p-4">
          <button
            type="button"
            onClick={() => setActivityType('NOTE')}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
              activityType === 'NOTE'
                ? 'bg-white text-nexus-charcoal shadow-sm'
                : 'text-nexus-warmGray hover:bg-white hover:text-nexus-charcoal'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Nota
          </button>
          <button
            type="button"
            onClick={() => setActivityType('CALL')}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
              activityType === 'CALL'
                ? 'bg-white text-nexus-charcoal shadow-sm'
                : 'text-nexus-warmGray hover:bg-white hover:text-nexus-charcoal'
            }`}
          >
            <Phone className="h-3.5 w-3.5" />
            Ligação
          </button>
          <button
            type="button"
            onClick={() => setActivityType('EMAIL')}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
              activityType === 'EMAIL'
                ? 'bg-white text-nexus-charcoal shadow-sm'
                : 'text-nexus-warmGray hover:bg-white hover:text-nexus-charcoal'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setActivityType('MEETING')}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
              activityType === 'MEETING'
                ? 'bg-white text-nexus-charcoal shadow-sm'
                : 'text-nexus-warmGray hover:bg-white hover:text-nexus-charcoal'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            Reunião
          </button>
        </div>

        <div className="p-4">
          <textarea
            className="min-h-[110px] w-full resize-y rounded-xl border border-nexus-border bg-white p-3 text-sm text-nexus-charcoal outline-none transition-colors focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
            placeholder={`Descreva a ${
              activityType === 'CALL' ? 'ligação' : activityType === 'NOTE' ? 'nota' : activityType === 'EMAIL' ? 'mensagem' : 'reunião'
            }...`}
            value={newActivityContent}
            onChange={(e) => setNewActivityContent(e.target.value)}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-nexus-warmGray">
              <Mic className="h-4 w-4" />
              <Settings className="h-4 w-4" />
            </div>
            <BloomButton
              variant="primary"
              size="sm"
              onClick={handleLogActivity}
              disabled={!newActivityContent.trim()}
            >
              Registrar atividade
            </BloomButton>
          </div>
        </div>
      </BloomCard>

      <BloomCard className="rounded-2xl border-nexus-border bg-white shadow-subtle">
        <div className="border-b border-nexus-border/70 px-5 py-4">
          <h3 className="text-sm font-bold text-nexus-charcoal">Linha do tempo</h3>
        </div>
        <div className="space-y-6 p-5">
          {(formData.activities || []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-nexus-border bg-nexus-bg p-6 text-sm text-nexus-warmGray">
              Nenhuma atividade registrada. Comece adicionando uma nota.
            </div>
          ) : (
            (formData.activities || []).map((activity, index) => (
              <div key={activity.id}>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-nexus-border bg-nexus-bg">
                    {activity.type === 'CALL' ? (
                      <Phone className="h-4 w-4 text-nexus-royal" />
                    ) : activity.type === 'EMAIL' ? (
                      <Mail className="h-4 w-4 text-blue-600" />
                    ) : activity.type === 'MEETING' ? (
                      <Users className="h-4 w-4 text-amber-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-nexus-royal" />
                    )}
                  </div>
                  <div className="flex-1 rounded-2xl border border-nexus-border bg-white p-4 shadow-subtle">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-nexus-charcoal">
                        {activity.user} registrou{' '}
                        {activity.type === 'CALL'
                          ? 'uma ligação'
                          : activity.type === 'EMAIL'
                            ? 'um email'
                            : activity.type === 'MEETING'
                              ? 'uma reunião'
                              : 'uma nota'}
                      </span>
                      <span className="text-[10px] text-nexus-warmGray">
                        {new Date(activity.createdAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-nexus-warmGray">
                      {activity.content}
                    </p>
                  </div>
                </div>
                {index !== (formData.activities || []).length - 1 && (
                  <div className="ml-6 mt-4 h-4 w-px bg-nexus-border" />
                )}
              </div>
            ))
          )}
        </div>
      </BloomCard>
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-5">
      <BloomCard className="rounded-2xl border-nexus-border bg-white shadow-subtle">
        <div className="flex items-center justify-between border-b border-nexus-border/70 px-5 py-4">
          <h3 className="text-sm font-bold text-nexus-charcoal">
            Pessoas ({formData.people?.length || 0})
          </h3>
          <BloomButton variant="secondary" size="sm" onClick={() => setIsAddingPerson(true)}>
            <Plus className="h-3.5 w-3.5" />
            Adicionar pessoa
          </BloomButton>
        </div>

        <div className="p-5">
          {isAddingPerson && (
            <div className="mb-5 rounded-2xl border border-nexus-border bg-nexus-bg p-4">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
                Novo contato
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Nome completo"
                  className="h-10 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Cargo / título"
                  className="h-10 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                  value={newPersonTitle}
                  onChange={(e) => setNewPersonTitle(e.target.value)}
                />
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <BloomButton variant="secondary" size="sm" onClick={() => setIsAddingPerson(false)}>
                  Cancelar
                </BloomButton>
                <BloomButton variant="primary" size="sm" onClick={handleAddPerson}>
                  Salvar
                </BloomButton>
              </div>
            </div>
          )}

          {(formData.people || []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-nexus-border bg-nexus-bg p-6 text-sm text-nexus-warmGray">
              Nenhum contato adicionado. Clique em "Adicionar pessoa" para começar.
            </div>
          ) : (
            <div className="grid gap-3">
              {(formData.people || []).map((person) => (
                <div
                  key={person.id}
                  className="group flex items-center justify-between rounded-2xl border border-nexus-border bg-white p-4 shadow-subtle transition-colors hover:border-nexus-royal/30"
                >
                  {mode === 'edit' ? (
                    <div className="grid flex-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <input
                        type="text"
                        className="h-10 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20 md:col-span-1"
                        value={person.name}
                        onChange={(e) => updatePersonField(person.id, 'name', e.target.value)}
                        placeholder="Nome"
                      />
                      <input
                        type="text"
                        className="h-10 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20 md:col-span-1"
                        value={person.title}
                        onChange={(e) => updatePersonField(person.id, 'title', e.target.value)}
                        placeholder="Cargo / título"
                      />
                      <div className="flex items-start gap-2 md:col-span-3">
                        <input
                          type="text"
                          className="h-10 flex-1 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                          value={person.phone || ''}
                          onChange={(e) => updatePersonField(person.id, 'phone', e.target.value)}
                          placeholder="Telefone"
                        />
                        <input
                          type="email"
                          className="h-10 flex-1 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                          value={person.email || ''}
                          onChange={(e) => updatePersonField(person.id, 'email', e.target.value)}
                          placeholder="E-mail"
                        />
                        <button
                          type="button"
                          onClick={() => removePerson(person.id)}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-nexus-border px-3 text-nexus-warmGray transition-colors hover:border-red-200 hover:text-red-500"
                          aria-label={`Remover ${person.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-nexus-accent text-sm font-bold text-nexus-royal">
                          {person.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-nexus-charcoal">{person.name}</div>
                          <div className="text-xs text-nexus-warmGray">{person.title || 'Sem cargo informado'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {person.emailRevealed ? (
                            <div className="text-xs font-medium text-nexus-charcoal">{person.email}</div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => revealEmail(person.id)}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-nexus-royal hover:underline"
                            >
                              <Mail className="h-3 w-3" />
                              Revelar email
                            </button>
                          )}
                          <div className="text-[10px] text-nexus-warmGray">{person.location}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePerson(person.id)}
                          className="text-nexus-warmGray transition-colors hover:text-red-500"
                          aria-label={`Remover ${person.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </BloomCard>
    </div>
  );

  const renderSidebar = () => (
    <aside className="hidden xl:flex xl:w-[300px] xl:flex-col xl:overflow-y-auto xl:border-r xl:border-nexus-border xl:bg-white">
      <SidebarSection title="Detalhes da empresa" icon={<Building2 className="h-4 w-4" />}>
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
              Indústria
            </div>
            <div className="mt-2">
              <BloomBadge variant="neutral" className="uppercase tracking-[0.14em]">
                {industryLabel}
              </BloomBadge>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
              Contato
            </div>
            {mode === 'edit' ? (
              <div className="mt-2 grid gap-2">
                <input
                  type="text"
                  className="h-10 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                  value={formData.contactInfo?.phone || ''}
                  onChange={(e) => updateContactField('phone', e.target.value)}
                  placeholder="Telefone"
                />
                <input
                  type="email"
                  className="h-10 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                  value={formData.contactInfo?.email || ''}
                  onChange={(e) => updateContactField('email', e.target.value)}
                  placeholder="E-mail"
                />
                <input
                  type="text"
                  className="h-10 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                  value={formData.contactInfo?.website || ''}
                  onChange={(e) => updateContactField('website', e.target.value)}
                  placeholder="Website"
                />
                <input
                  type="text"
                  className="h-10 rounded-xl border border-nexus-border bg-white px-3 text-sm outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                  value={formData.contactInfo?.location || ''}
                  onChange={(e) => updateContactField('location', e.target.value)}
                  placeholder="Localização"
                />
              </div>
            ) : (
              <div className="mt-2 space-y-2 text-sm text-nexus-charcoal">
                <div>{formData.contactInfo?.phone || 'Telefone não informado'}</div>
                <div className="break-words">{formData.contactInfo?.website || 'Website não informado'}</div>
              </div>
            )}
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
              Links
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={openWhatsApp}
                disabled={!whatsappTarget}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-nexus-border bg-white text-nexus-warmGray transition-colors hover:border-nexus-royal hover:text-nexus-royal disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Abrir WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openWebsite}
                disabled={!formData.contactInfo?.website}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-nexus-border bg-white text-nexus-warmGray transition-colors hover:border-nexus-royal hover:text-nexus-royal disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Abrir site"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </SidebarSection>

      <SidebarSection title="Detalhes do registro" icon={<Database className="h-4 w-4" />}>
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
              Etapa
            </div>
            <div className="mt-2">
              <BloomBadge variant="brand" className="uppercase tracking-[0.14em]">
                {currentStageName}
              </BloomBadge>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
              Última atividade
            </div>
            <div className="mt-2 text-sm text-nexus-charcoal">
              {formData.activities?.[0]?.createdAt
                ? new Date(formData.activities[0].createdAt).toLocaleDateString('pt-BR')
                : 'Nenhuma atividade'}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
              Valor
            </div>
            <div className="mt-2 text-sm font-bold text-nexus-charcoal">{summaryValue}</div>
          </div>
        </div>
      </SidebarSection>

      <SidebarSection title="Campos personalizados" icon={<BadgeInfo className="h-4 w-4" />}>
        <div className="space-y-4">
          {groupedCustomFields.map(({ section, fields }) => (
            <div key={section} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
                  {CUSTOM_FIELD_SECTION_LABELS[section]}
                </div>
                {mode === 'edit' && (
                  <button
                    type="button"
                    onClick={() => addCustomField(section)}
                    className="text-[10px] font-semibold uppercase tracking-[0.14em] text-nexus-royal hover:underline"
                  >
                    + Campo
                  </button>
                )}
              </div>

              {fields.length === 0 ? (
                <div className="rounded-xl border border-dashed border-nexus-border bg-nexus-bg p-3 text-xs text-nexus-warmGray">
                  Nenhum campo nesta seção.
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field) => (
                    <div key={`${section}-${field.index}`} className="rounded-xl border border-nexus-border bg-nexus-bg p-3">
                      {mode === 'edit' ? (
                        <div className="space-y-2">
                          <select
                            className="h-10 w-full rounded-lg border border-nexus-border bg-white px-3 text-xs outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                            value={field.section}
                            onChange={(e) => updateCustomField(field.index, 'section', e.target.value)}
                          >
                            {CUSTOM_FIELD_SECTION_ORDER.map((option) => (
                              <option key={option} value={option}>
                                {CUSTOM_FIELD_SECTION_LABELS[option]}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            className="h-10 w-full rounded-lg border border-nexus-border bg-white px-3 text-xs outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                            value={field.label}
                            onChange={(e) => updateCustomField(field.index, 'label', e.target.value)}
                            placeholder="Rótulo"
                          />
                          <input
                            type="text"
                            className="h-10 w-full rounded-lg border border-nexus-border bg-white px-3 text-xs outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20"
                            value={field.value}
                            onChange={(e) => updateCustomField(field.index, 'value', e.target.value)}
                            placeholder="Valor"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeCustomField(field.index)}
                              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-red-500 hover:underline"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-nexus-warmGray">
                            {field.label}
                          </div>
                          <div className="text-xs text-nexus-charcoal">{field.value || 'Sem valor'}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SidebarSection>

      <SidebarSection title="Tarefas" icon={<CheckSquare className="h-4 w-4" />}>
        <div className="space-y-4">
          {(formData.tasks || []).length === 0 && !showTaskInput ? (
            <div className="flex items-start gap-3 opacity-70">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-nexus-border" />
              <p className="text-xs leading-relaxed text-nexus-warmGray">
                Adicione uma tarefa para destacar os próximos passos para esta conta.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(formData.tasks || []).map((task) => (
                <div key={task.id} className="flex items-start gap-2 group">
                  <button type="button" onClick={() => toggleTask(task.id)}>
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-300 group-hover:border-nexus-royal" />
                    )}
                  </button>
                  {mode === 'edit' ? (
                    <div className="flex-1">
                      <input
                        type="text"
                        className={`w-full rounded-lg border border-nexus-border bg-white px-3 py-2 text-xs outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal/20 ${
                          task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                        }`}
                        value={task.text}
                        onChange={(e) => updateTaskText(task.id, e.target.value)}
                        placeholder="Texto da tarefa"
                      />
                    </div>
                  ) : (
                    <span className={`text-xs ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                      {task.text}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {showTaskInput ? (
            <form onSubmit={handleAddTask}>
              <input
                autoFocus
                type="text"
                className="mb-2 w-full rounded border border-nexus-border p-2 text-xs outline-none focus:border-nexus-royal focus:ring-1 focus:ring-nexus-royal"
                placeholder="Digite a tarefa..."
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                onBlur={() => {
                  if (!newTaskInput) setShowTaskInput(false);
                }}
              />
              <button type="submit" className="rounded bg-nexus-royal px-3 py-1 text-xs font-bold text-white">
                Adicionar
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowTaskInput(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-nexus-warmGray hover:text-nexus-royal"
            >
              <Plus className="h-3 w-3" /> Nova tarefa
            </button>
          )}
        </div>
      </SidebarSection>

      <SidebarSection title="Oportunidades" icon={<Activity className="h-4 w-4" />}>
        <div className="rounded-md border border-nexus-border bg-nexus-bg p-3">
          <div className="truncate text-xs font-bold text-nexus-charcoal">{formData.companyName}</div>
          <div className="mt-1 text-[10px] text-nexus-warmGray">
            Criado em {new Date(formData.createdAt).toLocaleDateString('pt-BR')}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-bold text-green-600">{summaryValue}</span>
            <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              {currentPipeline?.name || 'Pipeline'}
            </span>
          </div>
        </div>
      </SidebarSection>
    </aside>
  );

  const handleSaveChanges = () => {
    if (!formData) return;

    const normalizedDeal: Deal = {
      ...formData,
      companyName: formData.companyName.trim(),
      ownerUserId: formData.ownerUserId || ownerMember?.userId || workspaceMembers[0]?.userId || '',
      summary: formData.summary?.trim(),
      nextStep: formData.nextStep?.trim(),
      contactInfo: formData.contactInfo
        ? {
            ...formData.contactInfo,
            phone: formData.contactInfo.phone?.trim(),
            email: formData.contactInfo.email?.trim(),
            website: formData.contactInfo.website?.trim(),
            location: formData.contactInfo.location?.trim(),
          }
        : undefined,
      customFields: (formData.customFields || []).map((field) => ({
        label: field.label.trim(),
        value: field.value.trim(),
        section: resolveCustomFieldSection(field),
      })),
    };

    if (!normalizedDeal.companyName) {
      window.alert('O nome da empresa é obrigatório.');
      return;
    }

    onSave(normalizedDeal);
    setFormData(normalizedDeal);
    setMode('view');
  };

  const handleCloseModal = () => {
    if (mode === 'edit') {
      const shouldClose = window.confirm('Existem alterações não salvas. Deseja descartá-las?');
      if (!shouldClose) {
        return;
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1300] flex items-start justify-center bg-nexus-sidebar/50 p-4 pt-6 backdrop-blur-sm">
      <div className="flex h-[calc(100vh-3rem)] w-[min(96vw,96rem)] overflow-hidden rounded-3xl border border-nexus-border bg-white shadow-2xl">
        {renderSidebar()}
        <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-nexus-border bg-white px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[11px] text-nexus-warmGray">
              <span>Empresas</span>
              <ChevronRight className="h-3 w-3" />
              <span>Detalhes</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-nexus-border bg-nexus-bg">
                <Building2 className="h-5 w-5 text-nexus-warmGray" />
              </div>
              <div className="min-w-0">
                {mode === 'edit' ? (
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="w-full max-w-[52rem] bg-transparent text-2xl font-bold tracking-tight text-nexus-charcoal outline-none placeholder:text-nexus-warmGray"
                    placeholder="Nome da empresa"
                  />
                ) : (
                  <div className="w-full max-w-[52rem] truncate text-2xl font-bold tracking-tight text-nexus-charcoal">
                    {formData.companyName}
                  </div>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <BloomBadge variant="neutral" className="uppercase tracking-[0.14em]">
                    {industryLabel}
                  </BloomBadge>
                  <span className="text-xs text-nexus-warmGray">{locationLabel}</span>
                  <span className="text-xs text-nexus-warmGray">•</span>
                  <span className="text-xs text-nexus-warmGray">{sourceLabel}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <BloomButton variant="secondary" size="sm" onClick={openCall} disabled={!formData.contactInfo?.phone}>
              <Phone className="h-3.5 w-3.5" />
              Ligar
            </BloomButton>
            <BloomButton
              variant="secondary"
              size="sm"
              onClick={openWhatsApp}
              disabled={!whatsappTarget}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              WhatsApp
            </BloomButton>
            <BloomButton variant="secondary" size="sm" disabled title="Recurso em breve">
              <Sparkles className="h-3.5 w-3.5" />
              Gerar proposta
            </BloomButton>
            {mode === 'edit' ? (
              <>
                <BloomButton variant="secondary" size="sm" onClick={handleCancelEdit}>
                  Cancelar
                </BloomButton>
                <BloomButton variant="primary" size="sm" onClick={handleSaveChanges}>
                  <Save className="h-3.5 w-3.5" />
                  Salvar alterações
                </BloomButton>
              </>
            ) : (
              <BloomButton variant="primary" size="sm" onClick={handleEnableEdit}>
                Editar
              </BloomButton>
            )}
            <BloomButton variant="icon" size="icon" onClick={handleCloseModal} aria-label="Fechar detalhe">
              <X className="h-5 w-5" />
            </BloomButton>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-nexus-border bg-white px-6 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <BloomBadge variant="brand" className="uppercase tracking-[0.14em]">
              Etapa: {currentStageName}
            </BloomBadge>
            <BloomBadge variant="info" className="uppercase tracking-[0.14em]">
              Score: {formData.score || 0}
            </BloomBadge>
            <BloomBadge
              variant={whatsappStatus === 'CONFIRMED' ? 'success' : whatsappStatus === 'UNCONFIRMED' ? 'warning' : 'neutral'}
              className="uppercase tracking-[0.14em]"
            >
              {whatsappStatus === 'CONFIRMED'
                ? t.whatsapp_confirmed
                : whatsappStatus === 'UNCONFIRMED'
                  ? t.whatsapp_unconfirmed
                  : t.whatsapp_not_available}
            </BloomBadge>
          </div>
          <div className="flex items-center gap-2 text-xs text-nexus-warmGray">
            <Clock3 className="h-3.5 w-3.5" />
            {dealAgeInfo.label}
          </div>
        </div>

        <div className="border-b border-nexus-border bg-white px-6">
          <div className="flex gap-6 overflow-x-auto py-1 text-sm no-scrollbar">
            {TAB_ITEMS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 py-4 font-bold transition-colors ${
                  activeTab === tab
                    ? 'border-nexus-charcoal text-nexus-charcoal'
                    : 'border-transparent text-nexus-warmGray hover:text-nexus-charcoal'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F8F9FC] p-6">
          {activeTab === 'Visão Geral' && renderOverview()}
          {activeTab === 'Atividades' && renderActivities()}
          {activeTab === 'Contatos' && renderContacts()}
        </div>
        </div>
      </div>
    </div>
  );
};

const LayoutGridIcon = () => (
  <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-nexus-border text-[9px] text-nexus-warmGray">
    ▦
  </span>
);

export default DealDetailsModal;
