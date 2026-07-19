import React, { useState } from 'react';

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm font-medium',
    lg: 'h-12 w-12 text-base font-medium',
    xl: 'h-16 w-16 text-lg font-semibold',
    '2xl': 'h-24 w-24 text-2xl font-semibold',
  };

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);

  // Curated list of soft background gradients for avatars
  const bgGradients = [
    'from-violet-500 to-indigo-600',
    'from-emerald-400 to-teal-600',
    'from-rose-400 to-pink-600',
    'from-sky-400 to-blue-600',
    'from-amber-400 to-orange-600'
  ];

  // Pick background based on name string hash code
  const getGradient = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % bgGradients.length;
    return bgGradients[index];
  };

  const gradientClass = getGradient(name || 'User');

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        onError={() => setHasError(true)}
        className={`rounded-full object-cover border border-neutral-100 flex-shrink-0 ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }

  return (
    <div
      className={`
        rounded-full flex items-center justify-center text-white bg-gradient-to-br ${gradientClass}
        border border-white/20 select-none flex-shrink-0 ${sizes[size]} ${className}
      `}
      {...props}
    >
      {initials || '?'}
    </div>
  );
};
