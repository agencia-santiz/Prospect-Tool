import React from 'react';
import { cn } from '../../lib/cn';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  activeValue: string;
}

export const BloomTabs: React.FC<TabsProps> = ({ value, onValueChange, children, className }) => (
  <div data-value={value} data-onchange={Boolean(onValueChange)} className={className}>
    {children}
  </div>
);

export const BloomTabsList: React.FC<TabsListProps> = ({ className, ...props }) => (
  <div
    className={cn('inline-flex items-center gap-1 rounded-lg border border-nexus-border bg-white p-1', className)}
    {...props}
  />
);

export const BloomTab: React.FC<TabsTriggerProps> = ({ value, activeValue, className, children, ...props }) => (
  <button
    type="button"
    aria-selected={activeValue === value}
    className={cn(
      'inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-semibold transition-colors',
      activeValue === value
        ? 'bg-nexus-accent text-nexus-royal'
        : 'text-nexus-warmGray hover:bg-nexus-sandLight hover:text-nexus-charcoal',
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export default BloomTabs;
