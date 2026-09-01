import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-out active:scale-[0.96] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none min-h-[44px] cursor-pointer';

    const sizeStyles = {
      sm: 'px-3.5 py-1.5 text-xs gap-1.5 min-h-[36px]',
      md: 'px-4 py-2 text-sm gap-2 min-h-[44px]',
      lg: 'px-6 py-3 text-base gap-2.5 min-h-[48px]',
    };

    const variantStyles = {
      primary:
        'bg-accent text-white hover:bg-accent-hover shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-xs',
      secondary:
        'bg-surface text-ink border border-border hover:bg-bg hover:border-accent/30 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0',
      outline:
        'border border-border text-ink hover:bg-surface hover:border-accent hover:text-accent active:translate-y-0',
      ghost:
        'text-ink hover:bg-ink/5 hover:text-accent active:bg-ink/10',
      destructive:
        'bg-destructive text-white hover:opacity-95 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            baseStyles,
            sizeStyles[size],
            variantStyles[variant],
            className
          )
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
