'use client';

import { Card } from '@/components/ui/card';

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Header Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
          </Card>
        ))}
      </div>

      {/* Content Skeleton */}
      <Card className="p-6 space-y-4">
        <div className="h-6 w-40 bg-muted rounded animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full bg-muted rounded animate-pulse" />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function LoadingSpinner({
  size = 'md',
}: {
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-4 border-muted border-t-primary rounded-full animate-spin`}
      />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-center">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
