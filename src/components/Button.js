import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  iconLeft,
  iconRight,
  type = 'button',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md active:bg-primary-800',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm hover:shadow-md active:bg-secondary-700',
    outline: 'border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:text-neutral-900',
    ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
    danger: 'bg-semantic-error hover:bg-rose-700 text-white shadow-sm hover:shadow-md',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && iconLeft && <span className="mr-2 inline-flex">{iconLeft}</span>}
      <span>{children}</span>
      {!loading && iconRight && <span className="ml-2 inline-flex">{iconRight}</span>}
    </button>
  );
};
