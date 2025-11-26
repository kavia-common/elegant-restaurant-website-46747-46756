import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Button } from '../components/ui';

/**
 * PUBLIC_INTERFACE
 * Testimonials section that displays a responsive grid of testimonial cards.
 * - Each card shows an avatar, name, role, and quote.
 * - Optional auto-advance carousel behavior that rotates visible items with setInterval.
 * - Accessible: aria-live for changing content, alt text for avatars, and proper labeling.
 *
 * Props:
 * - items?: Array<{ id?: string|number, name: string, role: string, quote: string, avatar?: string, avatarAlt?: string }>
 * - autoAdvance?: boolean (default: true)
 * - intervalMs?: number (default: 5000)
 * - perPage?: number | 'auto' (default: 'auto') -> auto uses CSS grid to fit cards; number forces carousel pagination size
 *
 * Behavior:
 * - When perPage === 'auto', autoAdvance cycles one "page" by scrolling the start index but cards are all laid out in grid.
 *   The aria-live region announces the currently featured testimonial succinctly for SR users.
 * - When perPage is a number, the component shows a sliding window of that many items and provides previous/next controls.
 */
export default function Testimonials({
  items: itemsProp,
  autoAdvance = true,
  intervalMs = 5000,
  perPage = 'auto',
}) {
  // Sample data if not provided
  const items = useMemo(
    () =>
      itemsProp && itemsProp.length
        ? itemsProp
        : [
            {
              id: 't1',
              name: 'Ava Martinez',
              role: 'Food Critic',
              quote:
                'An unforgettable dining experience. The flavors were exquisite and the ambience serene.',
              avatar:
                'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=256&auto=format&fit=crop',
              avatarAlt: 'Portrait of Ava Martinez',
            },
            {
              id: 't2',
              name: 'Liam Johnson',
              role: 'Local Guide',
              quote:
                'Fresh seafood prepared to perfection. Highly recommend the lobster risotto!',
              avatar:
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop',
              avatarAlt: 'Portrait of Liam Johnson',
            },
            {
              id: 't3',
              name: 'Sophia Chen',
              role: 'Sommelier',
              quote:
                'Thoughtful pairings and balanced plates. A must-visit for waterfront dining.',
              avatar:
                'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop',
              avatarAlt: 'Portrait of Sophia Chen',
            },
            {
              id: 't4',
              name: 'Noah Williams',
              role: 'Travel Blogger',
              quote:
                'Stunning views and a refined menu. Every bite felt like a seaside escape.',
              avatar:
                'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop',
              avatarAlt: 'Portrait of Noah Williams',
            },
          ],
    [itemsProp]
  );

  // Carousel state (logical featured index). For 'auto' layout, this is used to highlight/announce.
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const pageSize = typeof perPage === 'number' && perPage > 0 ? perPage : items.length;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const next = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };
  const prev = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Auto-advance
  useEffect(() => {
    if (!autoAdvance || items.length <= 1) return undefined;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, Math.max(2000, intervalMs));
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoAdvance, intervalMs, items.length]);

  // Compute visible items for fixed perPage
  const visibleItems = useMemo(() => {
    if (typeof perPage !== 'number' || perPage <= 0 || perPage >= items.length) {
      // show all
      return items;
    }
    const start = Math.floor(index / perPage) * perPage;
    const end = Math.min(items.length, start + perPage);
    return items.slice(start, end);
  }, [index, items, perPage]);

  const featured = items[index % items.length];

  return (
    <div>
      {/* Live region announcing the featured testimonial for screen readers */}
      <div
        aria-live="polite"
        role="status"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          clip: 'rect(1px, 1px, 1px, 1px)',
          clipPath: 'inset(50%)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {featured ? `${featured.name} says: ${featured.quote}` : ''}
      </div>

      {/* Controls shown only when perPage is a number (carousel windowed view) */}
      {typeof perPage === 'number' && perPage > 0 && perPage < items.length ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-3)',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={prev}
            aria-label="Show previous testimonials"
            type="button"
          >
            ← Prev
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={next}
            aria-label="Show next testimonials"
            type="button"
          >
            Next →
          </Button>
          <span
            aria-hidden="true"
            style={{ color: 'var(--color-text-light)', alignSelf: 'center' }}
          >
            Page {Math.floor(index / pageSize) + 1} of {totalPages}
          </span>
        </div>
      ) : null}

      {/* Grid of testimonials - responsive and Ocean Professional styling */}
      <div
        aria-label="Guest testimonials"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {(typeof perPage === 'number' && perPage > 0 && perPage < items.length
          ? visibleItems
          : items
        ).map((t, i) => (
          <Card
            key={t.id || `${t.name}-${i}`}
            variant="outlined"
            aria-label={`Testimonial from ${t.name}, ${t.role}`}
            className="testimonial-card"
          >
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <img
                  src={
                    t.avatar ||
                    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=256&auto=format&fit=crop'
                  }
                  alt={t.avatarAlt || `Portrait of ${t.name}`}
                  width={56}
                  height={56}
                  loading="lazy"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid color-mix(in srgb, var(--color-primary) 30%, var(--color-border))',
                  }}
                />
                <div style={{ display: 'grid', gap: 2 }}>
                  <strong style={{ margin: 0 }}>{t.name}</strong>
                  <span style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
                    {t.role}
                  </span>
                </div>
              </div>

              <blockquote
                style={{
                  margin: 0,
                  color: 'var(--color-text-light)',
                  fontStyle: 'italic',
                }}
              >
                “{t.quote}”
              </blockquote>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
