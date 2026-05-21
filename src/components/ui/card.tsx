import React from 'react';
import { cn } from '../../lib/cn';

interface BloomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

const BloomCard: React.FC<BloomCardProps> = ({ className, elevated = false, ...props }) => (
  <div
    className={cn(
      'rounded-xl border border-nexus-border bg-white shadow-subtle',
      elevated && 'shadow-sm',
      className,
    )}
    {...props}
  />
);

export default BloomCard;
