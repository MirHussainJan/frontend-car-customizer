'use client';

import { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
}

export function PremiumCard({
  children,
  className = '',
  hover = true,
  interactive = false,
}: PremiumCardProps) {
  const baseStyles =
    'rounded-xl border border-border bg-card transition-all duration-300';
  const hoverStyles = hover ? 'hover:border-primary/50 hover:shadow-lg' : '';
  const interactiveStyles = interactive
    ? 'cursor-pointer hover:bg-card/80'
    : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${interactiveStyles} ${className}`}>
      {children}
    </div>
  );
}
