import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Check, Building2, ShieldCheck, Sparkles } from 'lucide-react';
import ModalShell from './ModalShell';
import BloomButton from './ui/button';
import BloomCard from './ui/card';
import BloomBadge from './ui/badge';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlanId = 'FREE' | 'PRO' | 'ENTERPRISE';

type PlanDefinition = {
  id: PlanId;
  label: string;
  priceLabel: string;
  leadLimit: number | null;
  summary: string;
  bullets: string[];
};

const PLAN_CATALOG: Record<PlanId, PlanDefinition> = {
  FREE: {
    id: 'FREE',
    label: 'Free',
    priceLabel: 'R$ 0',
    leadLimit: 100,
    summary: 'Plano de entrada para validar o fluxo principal e organizar as primeiras listas.',
    bullets: ['Ideal para validacao inicial', 'Limite mensal real carregado do auth', 'Busca, listas e pipeline disponiveis'],
  },
  PRO: {
    id: 'PRO',
    label: 'Pro',
    priceLabel: 'R$ 97',
    leadLimit: 1000,
    summary: 'Plano para operacao recorrente com volume maior de prospeccao e acompanhamento.',
    bullets: ['Maior teto mensal de leads', 'Para uso continuo da equipe', 'Pensado para rotina comercial ativa'],
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    label: 'Enterprise',
    priceLabel: 'Sob consulta',
    leadLimit: null,
    summary: 'Plano comercial com limite negociado e acompanhamento dedicado para times maiores.',
    bullets: ['Limite negociado com o time comercial', 'Ajustado por contrato', 'Para multiplos usuarios e demandas customizadas'],
  },
};

const PLAN_ORDER: PlanId[] = ['FREE', 'PRO', 'ENTERPRISE'];

const normalizePlan = (plan?: string | null): PlanId => {
  switch ((plan || 'free').toLowerCase()) {
    case 'pro':
      return 'PRO';
    case 'enterprise':
      return 'ENTERPRISE';
    default:
      return 'FREE';
  }
};

const formatLeadLimit = (limit: number | null) => {
  if (limit === null) {
    return 'Sob consulta';
  }

  return `${limit.toLocaleString()} leads/mes`;
};

const formatMemberCount = (count: number) => `${count} membro${count === 1 ? '' : 's'}`;

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { user, workspace } = useAuth();

  if (!isOpen) return null;

  const currentPlan = normalizePlan(workspace?.plan ?? user?.plan);
  const currentPlanInfo = PLAN_CATALOG[currentPlan];
  const usageLimit = user?.limit ?? currentPlanInfo.leadLimit ?? 0;
  const usageCount = user?.usage ?? 0;
  const memberCount = workspace?.memberCount ?? 1;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName="z-[2000] bg-nexus-sidebar/90"
      panelClassName="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-gray-200 overflow-hidden relative flex flex-col md:flex-row"
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full hover:bg-gray-100 transition-colors">
        <X className="w-5 h-5 text-gray-500" />
      </button>

      <div className="w-full md:w-2/5 bg-nexus-sidebar text-white p-8 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-nexus-royal/20 rounded-full blur-3xl"></div>

        <div className="relative z-10">
            <BloomBadge variant="brand" className="mb-6 gap-2 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-yellow-400" /> Plano do workspace
            </BloomBadge>
          <h2 className="text-3xl font-bold mb-4">{currentPlanInfo.label}</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Os dados abaixo vem do workspace autenticado. Nao ha simulacao de pagamento nesta tela.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-green-500/20 rounded mt-0.5">
                <Check className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-sm font-medium">Ate {usageLimit.toLocaleString()} leads/mes</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 bg-green-500/20 rounded mt-0.5">
                <Check className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-sm font-medium">Exportacao para Excel/CSV</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 bg-green-500/20 rounded mt-0.5">
                <Check className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-sm font-medium">Gestao de listas e contatos</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-nexus-royal" />
            <div>
              <p className="text-xs text-slate-400">Uso real do workspace</p>
              <p className="text-sm font-bold">
                {currentPlanInfo.label} - {usageCount.toLocaleString()}/{usageLimit.toLocaleString()} leads usados
              </p>
              <p className="text-xs text-slate-400">{formatMemberCount(memberCount)} ativos no workspace</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/5 bg-white p-8 md:p-12">
        <div className="mb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-nexus-dark">Planos reais</h3>
              <p className="text-sm text-gray-500 mt-2">
                A tela reflete o catalogo atual do produto e o estado real da conta.
              </p>
              <BloomButton
                type="button"
                onClick={onClose}
                variant="primary"
                size="sm"
                className="upgrade-btn mt-4"
              >
                Ajustar plano
              </BloomButton>
            </div>
            <BloomBadge variant="brand" className="gap-2 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Checkout ainda nao conectado
            </BloomBadge>
          </div>
        </div>

        <div className="space-y-4">
          {PLAN_ORDER.map((planId) => {
            const plan = PLAN_CATALOG[planId];
            const isActive = planId === currentPlan;

            return (
              <BloomCard
                key={plan.id}
                className={`rounded-2xl border p-5 transition-all ${
                  isActive ? 'border-nexus-royal bg-nexus-accent/40 shadow-subtle' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">{plan.label}</p>
                    <div className="flex items-end gap-2 mt-1">
                      <span className="text-2xl font-black text-nexus-dark">{plan.priceLabel}</span>
                      {plan.priceLabel !== 'Sob consulta' && <span className="text-sm text-gray-400 mb-1">/mes</span>}
                    </div>
                  </div>
                  <BloomBadge variant={isActive ? 'brand' : 'neutral'} className="uppercase tracking-wide">
                    {isActive ? 'Plano atual' : 'Disponivel'}
                  </BloomBadge>
                </div>

                <p className="text-sm text-gray-600 mt-4">{plan.summary}</p>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-nexus-royal" />
                  Limite de {formatLeadLimit(plan.leadLimit)}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.bullets.map((bullet) => (
                    <BloomBadge
                      key={bullet}
                      className="gap-1.5"
                    >
                      <Check className="w-3 h-3 text-nexus-royal" />
                      {bullet}
                    </BloomBadge>
                  ))}
                </div>
              </BloomCard>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-bold text-gray-600 mb-1">Observacao</p>
          <p className="text-[10px] text-gray-500">
            Esta modal mostra apenas o plano e os limites carregados do auth/Data Connect. O fluxo de faturamento ainda
            nao foi conectado ao checkout.
          </p>
        </div>
      </div>
    </ModalShell>
  );
};

export default PricingModal;
