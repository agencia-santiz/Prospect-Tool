import React from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface BloomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border border-nexus-royal bg-nexus-royal text-white hover:bg-nexus-crimsonLight',
  secondary: 'border border-nexus-border bg-white text-nexus-charcoal hover:bg-nexus-bg',
  ghost: 'border border-transparent bg-transparent text-nexus-charcoal hover:bg-nexus-accent',
  success: 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
  icon: 'border border-nexus-border bg-white text-nexus-warmGray hover:border-nexus-royal hover:text-nexus-royal',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
  icon: 'h-9 w-9 p-0',
};

const BloomButton = React.forwardRef<HTMLButtonElement, BloomButtonProps>(
  ({ className, variant = 'secondary', size = 'md', fullWidth = false, type = 'button', disabled, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  ),
);

BloomButton.displayName = 'BloomButton';

export default BloomButton;
