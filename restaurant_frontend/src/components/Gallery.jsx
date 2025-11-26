import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Gallery component (lazy-loaded).
 * - Responsive masonry-style gallery using CSS columns
 * - Images lazy-load
 * - Lightbox overlay with keyboard (Esc) and click-to-close
 * - Ocean Professional styling and accessibility
 */
export default function Gallery() {
  // Prefer local placeholder assets; can be replaced with real images later
  const local = (n) => require(`../assets/gallery/${n}.jpg`);
  const items = useMemo(
    () => [
      { id: 'g1', src: local(1), alt: 'Grilled salmon with herbs, plated elegantly', width: 1200, height: 800 },
      { id: 'g2', src: local(2), alt: 'Close-up of seared scallops with garnish', width: 1100, height: 733 },
      { id: 'g3', src: local(3), alt: 'Restaurant interior with waterfront ambience', width: 1000, height: 1500 },
      { id: 'g4', src: local(4), alt: 'Lobster risotto with saffron, top-down view', width: 1200, height: 800 },
      { id: 'g5', src: local(5), alt: 'Chef plating seafood linguine', width: 1200, height: 800 },
      { id: 'g6', src: local(6), alt: 'Dessert with citrus tart and cream', width: 900, height: 600 },
    ],
    []
  );

  // Lightbox state
  const [activeIndex, setActiveIndex] = useState(-1);
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  const triggerRefs = useRef({}); // map of id -> element to return focus

  // Open/close handlers
  const openLightbox = useCallback((index, triggerEl) => {
    setActiveIndex(index);
    // Save trigger to restore focus later
    const item = items[index];
    if (item) {
      triggerRefs.current[item.id] = triggerEl;
    }
  }, [items]);

  const closeLightbox = useCallback(() => {
    const prevIndex = activeIndex;
    setActiveIndex(-1);
    // Restore focus to trigger for accessibility
    if (prevIndex >= 0) {
      const prevItem = items[prevIndex];
      const trigger = prevItem ? triggerRefs.current[prevItem.id] : null;
      if (trigger && typeof trigger.focus === 'function') {
        setTimeout(() => trigger.focus(), 0);
      }
    }
  }, [activeIndex, items]);

  // Keyboard handling for Esc to close and arrow navigation
  useEffect(() => {
    if (activeIndex < 0) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % items.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + items.length) % items.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, items.length, closeLightbox]);

  // Focus management when opening overlay
  useEffect(() => {
    if (activeIndex >= 0 && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [activeIndex]);

  // Masonry layout via CSS columns
  return (
    <div>
      <div
        aria-label="Photo gallery"
        style={{
          columnCount: 1,
          columnGap: 'var(--space-4)',
        }}
      >
        <style>{`
          @media (min-width: 560px) {
            [data-gallery-masonry] { column-count: 2; }
          }
          @media (min-width: 900px) {
            [data-gallery-masonry] { column-count: 3; }
          }
          [data-gallery-item] {
            break-inside: avoid;
            margin-bottom: var(--space-4);
          }
          .gallery-thumb {
            position: relative;
            display: block;
            border-radius: var(--radius-lg);
            overflow: hidden;
            border: 1px solid var(--color-border);
            background: var(--color-surface);
            box-shadow: var(--shadow-sm);
            transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
          }
          .gallery-thumb:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: color-mix(in srgb, var(--color-primary) 30%, var(--color-border));
          }
          .gallery-thumb img {
            width: 100%;
            height: auto;
            display: block;
          }

          /* Lightbox styles */
          .lightbox-overlay {
            position: fixed;
            inset: 0;
            background: color-mix(in srgb, #000 60%, transparent);
            display: grid;
            place-items: center;
            z-index: 1000;
            padding: var(--space-4);
            animation: lb-fade var(--transition) ease;
          }
          @keyframes lb-fade { from { opacity: 0; } to { opacity: 1; } }

          .lightbox-dialog {
            position: relative;
            max-width: min(92vw, 1200px);
            max-height: 92vh;
            background: var(--color-surface);
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-border);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
          }
          .lightbox-body {
            position: relative;
            background: #000;
          }
          .lightbox-img {
            max-width: 100%;
            max-height: 80vh;
            display: block;
            width: auto;
            height: auto;
            margin: 0 auto;
            object-fit: contain;
          }
          .lightbox-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--space-3);
            padding: var(--space-3) var(--space-4);
            background: color-mix(in srgb, var(--color-bg) 60%, white);
            border-top: 1px solid var(--color-border);
          }
          .lightbox-actions {
            display: flex;
            gap: var(--space-2);
            align-items: center;
            flex-wrap: wrap;
          }
          .lb-nav-btn {
            background: transparent;
            color: #fff;
            border: 1px solid color-mix(in srgb, #fff 40%, transparent);
            border-radius: var(--radius-full);
            padding: 0.5rem 0.75rem;
            cursor: pointer;
          }
          .lb-nav-btn:hover {
            background: color-mix(in srgb, #ffffff 12%, transparent);
          }
          .lb-close-btn {
            border-radius: var(--radius-full);
          }
        `}</style>

        <div data-gallery-masonry>
          {items.map((img, index) => (
            <figure
              key={img.id}
              data-gallery-item
              style={{ margin: 0 }}
            >
              <button
                type="button"
                className="gallery-thumb"
                onClick={(e) => openLightbox(index, e.currentTarget)}
                aria-label={`Open image: ${img.alt}`}
              >
                <img
                  src={`${img.src}&dpr=1`}
                  alt={img.alt}
                  loading="lazy"
                  width={img.width}
                  height={img.height}
                />
              </button>
              <figcaption
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-light)',
                  marginTop: '6px',
                }}
              >
                {img.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {activeIndex >= 0 ? (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={(e) => {
            // Click on backdrop closes; prevent close when clicking inside dialog
            if (e.target === overlayRef.current) {
              closeLightbox();
            }
          }}
          ref={overlayRef}
        >
          <div
            className="lightbox-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-body">
              <img
                className="lightbox-img"
                src={`${items[activeIndex].src}&dpr=2`}
                alt={items[activeIndex].alt}
              />
              {/* Overlay minimal nav on image (top corners) */}
              <div
                style={{
                  position: 'absolute',
                  insetInline: 0,
                  top: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3)',
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              >
                <button
                  type="button"
                  className="lb-nav-btn"
                  onClick={() => setActiveIndex((i) => (i - 1 + items.length) % items.length)}
                  style={{ pointerEvents: 'auto' }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="lb-nav-btn"
                  onClick={() => setActiveIndex((i) => (i + 1) % items.length)}
                  style={{ pointerEvents: 'auto' }}
                  aria-label="Next image"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="lightbox-footer">
              <div style={{ display: 'grid' }}>
                <strong style={{ margin: 0, color: 'var(--color-text)' }}>
                  {items[activeIndex].alt}
                </strong>
                <span style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
                  {activeIndex + 1} of {items.length}
                </span>
              </div>
              <div className="lightbox-actions">
                <button
                  type="button"
                  className="ui-btn ui-btn--ghost ui-btn--sm lb-close-btn"
                  onClick={closeLightbox}
                  aria-label="Close preview"
                  ref={closeBtnRef}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
