'use client';

import { type LucideIcon } from 'lucide-react';

interface FeatureHighlightProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlighted?: boolean;
}

export function FeatureHighlight({
  icon: Icon,
  title,
  description,
  highlighted = false,
}: FeatureHighlightProps) {
  return (
    <div
      className={`p-6 rounded-xl border transition-all duration-300 ${
        highlighted
          ? 'border-primary bg-primary/5 hover:border-primary/80'
          : 'border-border bg-card hover:border-primary/50'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${
          highlighted
            ? 'bg-primary/20 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
