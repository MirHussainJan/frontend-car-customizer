'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 ${
              isDangerous ? 'text-red-500' : 'text-blue-500'
            }`}
          >
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className={isDangerous ? 'bg-red-500 hover:bg-red-600' : ''}
          >
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
