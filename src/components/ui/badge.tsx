import React from 'react';
import { cn } from '../../lib/cn';

type BadgeVariant = 'neutral' | 'brand' | 'success' | 'info' | 'warning' | 'danger';

interface BloomBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border-nexus-border bg-white text-nexus-warmGray',
  brand: 'border-nexus-royal/20 bg-nexus-accent text-[#b0002d]',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-red-200 bg-red-50 text-red-700',
};

const BloomBadge: React.FC<BloomBadgeProps> = ({ className, variant = 'neutral', ...props }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold leading-none',
      variantClasses[variant],
      className,
    )}
    {...props}
  />
);

export default BloomBadge;
