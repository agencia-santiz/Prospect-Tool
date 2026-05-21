import React from 'react';
import { Clock3, Flag, Sparkles } from 'lucide-react';
import { Deal } from '../types';
import { cn } from '../lib/cn';
import BloomBadge from './ui/badge';

export type StatusTone = 'neutral' | 'brand' | 'success' | 'info' | 'warning' | 'danger';

const toneToVariant: Record<StatusTone, React.ComponentProps<typeof BloomBadge>['variant']> = {
  neutral: 'neutral',
  brand: 'brand',
  success: 'success',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
};

export const StatusBadge: React.FC<{
  label: React.ReactNode;
  tone?: StatusTone;
  icon?: React.ReactNode;
  className?: string;
  title?: string;
}> = ({ label, tone = 'neutral', icon, className, title }) => {
  const accessibleLabel =
    typeof label === 'string' || typeof label === 'number' ? String(label) : title;

  return (
    <BloomBadge
      variant={toneToVariant[tone]}
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em]', className)}
      title={title ?? accessibleLabel}
      aria-label={title ?? accessibleLabel}
    >
      {icon ? <span aria-hidden="true" className="shrink-0">{icon}</span> : null}
      <span className="min-w-0 truncate">{label}</span>
    </BloomBadge>
  );
};

export const getDealAgeInfo = (deal: Pick<Deal, 'createdAt' | 'activities'>) => {
  const referenceCreatedAt = deal.activities?.[0]?.createdAt || deal.createdAt;
  const referenceDate = new Date(referenceCreatedAt);
  const referenceTime = referenceDate.getTime();

  if (Number.isNaN(referenceTime)) {
    return {
      label: 'Aging indisponível',
      tone: 'neutral' as StatusTone,
    };
  }

  const elapsedDays = Math.max(0, Math.floor((Date.now() - referenceTime) / 86400000));

  if (elapsedDays === 0) {
    return { label: 'Atualizado hoje', tone: 'success' as StatusTone };
  }

  if (elapsedDays === 1) {
    return { label: 'Há 1 dia', tone: 'info' as StatusTone };
  }

  if (elapsedDays <= 7) {
    return { label: `Há ${elapsedDays} dias`, tone: 'warning' as StatusTone };
  }

  return { label: `Sem atividade há ${elapsedDays} dias`, tone: 'danger' as StatusTone };
};

export const getDealPriorityInfo = (priority: Deal['priority']) => {
  switch (priority) {
    case 'HIGH':
      return {
        label: 'Prioridade alta',
        tone: 'warning' as StatusTone,
        icon: <Flag className="h-3 w-3" />,
      };
    case 'MEDIUM':
      return {
        label: 'Prioridade média',
        tone: 'info' as StatusTone,
        icon: <Sparkles className="h-3 w-3" />,
      };
    default:
      return {
        label: 'Prioridade baixa',
        tone: 'neutral' as StatusTone,
        icon: <Sparkles className="h-3 w-3" />,
      };
  }
};

export const NextActionBlock: React.FC<{
  action?: string | null;
  fallback: string;
  ageLabel: string;
  ageTone?: StatusTone;
  className?: string;
  variant?: 'light' | 'dark';
}> = ({ action, fallback, ageLabel, ageTone = 'neutral', className, variant = 'light' }) => (
  <section
    className={cn(
      variant === 'dark'
        ? 'rounded-[18px] border border-white/10 bg-[#2a2c44] p-4 text-white shadow-none'
        : 'rounded-2xl border border-nexus-sandLight bg-white p-4 shadow-subtle',
      className,
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className={cn('text-[10px] font-semibold uppercase tracking-[0.16em]', variant === 'dark' ? 'text-white/45' : 'text-nexus-warmGray')}>
          Próxima ação
        </div>
        <p className={cn('mt-2 break-words text-sm leading-relaxed', variant === 'dark' ? 'text-white/92' : 'text-nexus-charcoal')}>
          {action && action.trim() ? action.trim() : fallback}
        </p>
      </div>
      <StatusBadge
        tone={ageTone}
        label={ageLabel}
        icon={<Clock3 className="h-3 w-3" />}
        className={variant === 'dark' ? 'border-white/10 bg-white/8 text-white/80' : 'shrink-0'}
        title={ageLabel}
      />
    </div>
  </section>
);
