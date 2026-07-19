import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  iconLeft,
  iconRight,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-800 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {iconLeft && (
          <div className="absolute inset-y-0 left-0 pl-3 inline-flex items-center pointer-events-none text-neutral-400">
            {iconLeft}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            block w-full rounded-lg text-sm text-neutral-900 border transition-all duration-200
            ${iconLeft ? 'pl-10' : 'pl-3.5'}
            ${iconRight ? 'pr-10' : 'pr-3.5'}
            py-2.5 bg-white placeholder-neutral-400
            focus:outline-none focus:ring-2
            ${hasError 
              ? 'border-semantic-error focus:ring-rose-500 focus:border-rose-500' 
              : 'border-neutral-200 focus:ring-primary-500 focus:border-primary-500 hover:border-neutral-300'
            }
            disabled:bg-neutral-50 disabled:text-neutral-500 disabled:border-neutral-200
          `}
          {...props}
        />
        {iconRight && (
          <div className="absolute inset-y-0 right-0 pr-3 inline-flex items-center text-neutral-400">
            {iconRight}
          </div>
        )}
      </div>
      {hasError && (
        <p className="mt-1.5 text-xs text-semantic-error font-medium" id={`${inputId}-error`}>
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p className="mt-1.5 text-xs text-neutral-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
