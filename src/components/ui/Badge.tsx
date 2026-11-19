import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'wine' | 'champagne' | 'pending';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gold',
  className = '',
  children,
  ...props
}) => {
  const variantClasses = {
    gold: 'bg-gold/15 text-gold-dark border border-gold/30',
    wine: 'bg-wine-deep text-offwhite border border-gold/20',
    champagne: 'bg-champagne-dark/60 text-graphite border border-champagne-dark',
    pending: 'bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-mono',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-caption uppercase tracking-wider font-medium ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
