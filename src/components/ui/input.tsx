import React from 'react';
import { cn } from '../../lib/cn';

interface BloomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const BloomInput = React.forwardRef<HTMLInputElement, BloomInputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-10 w-full rounded-md border border-nexus-border bg-white px-3 text-sm text-nexus-dark placeholder:text-nexus-warmGray shadow-subtle transition-colors duration-200 focus:border-nexus-royal focus:outline-none',
      className,
    )}
    {...props}
  />
));

BloomInput.displayName = 'BloomInput';

export default BloomInput;
