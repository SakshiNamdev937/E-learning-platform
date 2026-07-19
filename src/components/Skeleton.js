import React from 'react';

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-neutral-200 animate-pulse rounded';

  const variants = {
    text: 'h-4 w-full',
    circle: 'rounded-full',
    rect: 'w-full h-32',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-4 space-y-4">
    <Skeleton variant="rect" className="h-44 rounded-lg" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-1/4 h-3" />
      <Skeleton variant="text" className="w-3/4 h-5" />
      <Skeleton variant="text" className="w-1/2 h-3" />
    </div>
    <div className="border-t border-neutral-100 pt-3 flex justify-between items-center">
      <Skeleton variant="circle" className="h-8 w-8" />
      <Skeleton variant="text" className="w-1/4 h-6" />
    </div>
  </div>
);
