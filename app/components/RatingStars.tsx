'use client';

import React from 'react';

type RatingStarsProps = {
  rating?: number;
  initialRating?: number;
  max?: number;
};

const DEFAULT_MAX_STARS = 5;

const getDisplayValue = (value: number, max: number) => {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), max);
};

export default function RatingStars({ rating, initialRating, max = DEFAULT_MAX_STARS }: RatingStarsProps) {
  const value = getDisplayValue(rating ?? initialRating ?? 0, max);
  const roundedDisplay = Number.isInteger(value) ? value.toString() : value.toFixed(1);

  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <div role="img" aria-label={`Rating: ${value} out of ${max}`} style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: max }).map((_, idx) => {
          const filled = idx < Math.round(value);
          return (
            <span key={idx} aria-hidden="true" style={{ color: filled ? '#FBBF24' : '#E5E7EB', fontSize: 16 }}>
              ★
            </span>
          );
        })}
      </div>
      <span style={{ fontSize: 12, color: '#6B7280' }}>{roundedDisplay}</span>
    </div>
  );
}

