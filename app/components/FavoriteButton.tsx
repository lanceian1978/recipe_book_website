'use client';

import React from 'react';

type FavoriteButtonProps = {
  recipeId: string;
  isFavorite: boolean;
  onToggle: (id: string) => void;
};

export default function FavoriteButton({ recipeId, isFavorite, onToggle }: FavoriteButtonProps) {
  const label = isFavorite ? 'Remove from favorites' : 'Add to favorites';

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={label}
      onClick={() => onToggle(recipeId)}
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        border: '1px solid #fcd34d',
        background: isFavorite ? '#fbbf24' : '#fffbea',
        color: isFavorite ? '#92400e' : '#b45309',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        transition: 'background 0.15s ease, transform 0.15s ease',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 16 }}>
        {isFavorite ? '★' : '☆'}
      </span>
      <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
    </button>
  );
}

