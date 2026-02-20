'use client';

import React from "react"

interface PremiumBadgeProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function PremiumBadge({
  variant = 'primary',
  children,
  size = 'md',
}: PremiumBadgeProps) {
  const variantClasses = {
    primary: 'bg-primary/20 text-primary border-primary/30',
    secondary: 'bg-secondary/20 text-secondary border-secondary/30',
    accent: 'bg-accent/20 text-accent border-accent/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-flex items-center border rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}
