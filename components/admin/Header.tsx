'use client';

import { Button } from '@/components/ui/button';
import { Bell, Settings, HelpCircle } from 'lucide-react';

interface HeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Header({ title, description, action }: HeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 lg:px-8 py-6">
        <div className="ml-16 lg:ml-0">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {action && (
            <Button onClick={action.onClick} className="hidden sm:flex">
              {action.label}
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
