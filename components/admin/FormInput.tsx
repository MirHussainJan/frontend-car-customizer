'use client';

import React from "react"

import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function FormInput({
  label,
  error,
  helperText,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        {...props}
        className={cn(
          'w-full px-4 py-2 rounded-lg border border-border bg-card',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          'transition-colors',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ value: string; label: string }>;
}

export function FormSelect({
  label,
  error,
  options,
  className,
  ...props
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <select
        {...props}
        className={cn(
          'w-full px-4 py-2 rounded-lg border border-border bg-card',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          'transition-colors',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function FormTextarea({
  label,
  error,
  helperText,
  className,
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={cn(
          'w-full px-4 py-2 rounded-lg border border-border bg-card',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          'transition-colors resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}
