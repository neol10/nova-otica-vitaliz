import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-300 ease-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantClasses = {
    primary:
      'bg-wine-deep text-offwhite-pure hover:bg-wine-soft border border-gold/40 shadow-subtle-gold hover:border-gold',
    secondary:
      'bg-gold text-wine-deep hover:bg-gold-light border border-gold shadow-sm font-semibold',
    outline:
      'border border-gold text-graphite hover:bg-gold/10 hover:border-gold-dark',
    ghost:
      'text-graphite hover:bg-champagne-dark/50 hover:text-wine-deep',
  }[variant];

  const sizeClasses = {
    sm: 'text-caption tracking-wider uppercase px-4 py-2 rounded-sm',
    md: 'text-body-sm tracking-wide px-6 py-3 rounded-sm',
    lg: 'text-body-md tracking-wide px-8 py-4 rounded-sm',
  }[size];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
