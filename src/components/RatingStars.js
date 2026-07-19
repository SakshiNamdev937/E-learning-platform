import React from 'react';

export const RatingStars = ({
  rating = 0,
  maxStars = 5,
  size = 'sm',
  interactive = false,
  onChange,
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const roundedRating = Math.round(rating * 2) / 2; // round to nearest 0.5

  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    const isInteractive = interactive && onChange;
    
    // Determine fill: full star, half star, or empty star
    let fillType = 'empty';
    if (i <= roundedRating) {
      fillType = 'full';
    } else if (i - 0.5 === roundedRating) {
      fillType = 'half';
    }

    stars.push(
      <button
        key={i}
        type="button"
        disabled={!isInteractive}
        onClick={() => isInteractive && onChange(i)}
        className={`focus:outline-none ${isInteractive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
      >
        <svg
          className={`${sizes[size]} ${
            fillType === 'full' 
              ? 'text-amber-400 fill-amber-400' 
              : fillType === 'half' 
                ? 'text-amber-400 fill-amber-400' // Simple fill fallback or dual-stop gradient
                : 'text-neutral-200 fill-neutral-200'
          }`}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          {fillType === 'half' ? (
            <>
              <defs>
                <linearGradient id={`halfStarGradient-${i}`}>
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#e5e5e5" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#halfStarGradient-${i})`}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </>
          ) : (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          )}
        </svg>
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-0.5 ${className}`} {...props}>
      {stars}
    </div>
  );
};
