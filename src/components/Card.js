import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  ...props
}) => {
  const hoverClass = hover 
    ? 'hover:shadow-premium-hover hover:-translate-y-0.5 border-neutral-200/60' 
    : '';

  return (
    <div
      className={`bg-white border border-neutral-200/80 rounded-xl shadow-premium overflow-hidden transition-all duration-300 ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-5 border-b border-neutral-100 ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-5 border-t border-neutral-100 bg-neutral-50/50 ${className}`} {...props}>
    {children}
  </div>
);
