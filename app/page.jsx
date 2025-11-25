'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import recipesData from './data/recipes.json';
import RatingStars from './components/RatingStars';
import FavoriteButton from './components/FavoriteButton';

const ALL_RECIPES = ((recipesData?.recipes ?? [])).map(recipe => ({
  ...recipe,
  time: String(recipe.time ?? ''),
}));

const FAVORITES_STORAGE_KEY = 'My_favs';

const readStoredFavorites = () => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn('Failed to load favorites', error);
    return {};
  }
};

export default function HomePage() {
  // UI State
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // favorites persisted to localStorage
  const [favorites, setFavorites] = useState(readStoredFavorites);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites', e);
    }
  }, [favorites]);

  const categories = useMemo(() => {
    const set = new Set();
    ALL_RECIPES.forEach(r => set.add(r.category));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtering and searching
  const filtered = useMemo(() => {
    let list = ALL_RECIPES.slice();

    // favorites only filter
    if (favoritesOnly) {
      list = list.filter(r => favorites[r.id]);
    }

    // category
    if (category !== 'All') {
      list = list.filter(r => r.category === category);
    }

    // search query (title or description)
    if (query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
    }

    // sort
    switch (sortBy) {
      case 'popular':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'time':
        // naive time sort (time formatted like "25 min")
        list.sort((a, b) => {
          const ta = parseInt(a.time) || 0;
          const tb = parseInt(b.time) || 0;
          return ta - tb;
        });
        break;
      case 'new':
        // for demo purposes shuffle slightly
        list.sort((a, b) => a.id.localeCompare(b.id));
        break;
      default:
        break;
    }

    return list;
  }, [query, category, sortBy, favoritesOnly, favorites]);

  // pagination
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const normalizedPage = Math.min(Math.max(1, currentPage), pageCount);

  const pageItems = useMemo(() => {
    const start = (normalizedPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, normalizedPage, perPage]);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  };

  // small UI helpers for rendering
  const renderBreadcrumbs = () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#666' }}>
      <span>Home</span>
      <span>›</span>
      <span style={{ fontWeight: 600 }}>{category}</span>
    </div>
  );

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto', minHeight: '80vh' }}>
      {/* header area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, color: '#2E8B57' }}>The Best Recipes</h1>
          <p style={{ marginTop: 8, color: '#666' }}>Browse a large curated collection of recipes.</p>
          <div style={{ marginTop: 12 }}>{renderBreadcrumbs()}</div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => setFavoritesOnly(!favoritesOnly)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #eee', background: favoritesOnly ? '#FFFAF0' : '#fff' }}>
            {favoritesOnly ? 'Showing favorites' : 'All recipes'}
          </button>
        </div>
      </div>

      {/* controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search recipes, ingredients, descriptions" style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #ddd' }} />

        <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: 10, border: '1px solid #ddd' }}>
          {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ padding: '10px', borderRadius: 10, border: '1px solid #ddd' }}
        >
          <option value="popular">Popular</option>
          <option value="rating">Highest rating</option>
          <option value="time">Shortest time</option>
          <option value="new">Newest</option>
        </select>

        <select value={perPage} onChange={e => setPerPage(parseInt(e.target.value))} style={{ padding: '10px', borderRadius: 10, border: '1px solid #ddd' }}>
          <option value={6}>6 / page</option>
          <option value={12}>12 / page</option>
          <option value={24}>24 / page</option>
        </select>
      </div>

      {/* grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
        {pageItems.map(r => (
          <article key={r.id} className="card" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden', borderRadius: 12 }}>
              <Image
                src={r.image || '/images/spaghetti.jpg'}
                alt={r.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                priority={r.id === pageItems[0]?.id}
              />
            </div>

            <div style={{ padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>{r.title}</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <RatingStars initialRating={r.rating} />
                </div>
              </div>

              <p style={{ color: '#666', marginTop: 8, minHeight: 42 }}>{r.description}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#888' }}>
                  <span style={{ background: '#FFFAF0', padding: '6px 10px', borderRadius: 8, fontSize: 12 }}>{r.category}</span>
                  <span style={{ fontSize: 12 }}>{r.time}</span>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <FavoriteButton
                    recipeId={r.id}
                    isFavorite={Boolean(favorites[r.id])}
                    onToggle={toggleFavorite}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 28 }}>
        <button
          onClick={() =>
            setCurrentPage(p => {
              const sanitized = Math.min(Math.max(1, p), pageCount);
              return Math.max(1, sanitized - 1);
            })
          }
          style={{ padding: '8px 12px', borderRadius: 8 }}
        >
          Prev
        </button>
        <div>Page {normalizedPage} of {pageCount}</div>
        <button
          onClick={() =>
            setCurrentPage(p => {
              const sanitized = Math.min(Math.max(1, p), pageCount);
              return Math.min(pageCount, sanitized + 1);
            })
          }
          style={{ padding: '8px 12px', borderRadius: 8 }}
        >
          Next
        </button>
      </div>

      {/* small footer note */}
      <div style={{ marginTop: 40, color: '#999', textAlign: 'center' }}>
        Showing {filtered.length} recipes — {pageItems.length} on this page.
      </div>
    </main>
  );
}
