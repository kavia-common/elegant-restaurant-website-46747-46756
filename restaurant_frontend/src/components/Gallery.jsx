import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Gallery component (lazy-loaded).
 * Displays a simple responsive grid of image placeholders for now.
 */
export default function Gallery() {
  const items = Array.from({ length: 6 }, (_, i) => i + 1);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: 'var(--space-4)'
    }}>
      {items.map((n) => (
        <div key={n} className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            aria-label={`Gallery item ${n}`}
            style={{
              aspectRatio: '4 / 3',
              width: '100%',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.15))',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--color-text-light)',
              fontWeight: 700
            }}
          >
            Image {n}
          </div>
        </div>
      ))}
    </div>
  );
}
