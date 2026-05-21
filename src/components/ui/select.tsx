import React from 'react';
import { cn } from '../../lib/cn';

interface BloomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const BloomSelect = React.forwardRef<HTMLSelectElement, BloomSelectProps>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'h-10 w-full rounded-md border border-nexus-border bg-white px-3 text-sm text-nexus-dark shadow-subtle transition-colors duration-200 focus:border-nexus-royal focus:outline-none',
      className,
    )}
    {...props}
  >
    {children}
  </select>
));

BloomSelect.displayName = 'BloomSelect';

export default BloomSelect;
