import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 ${className}`}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-accent mb-5 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-serif font-bold text-ink mb-2 max-w-sm">{title}</h3>
      <p className="text-sm text-ink-muted mb-6 max-w-md leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
