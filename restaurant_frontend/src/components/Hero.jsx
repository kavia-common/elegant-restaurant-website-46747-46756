import React from 'react';
import { Button } from './ui';
import heroImg from '../assets/hero.jpg';

/**
 * PUBLIC_INTERFACE
 * Hero component for the home section.
 * - Ocean Professional styling: gradient overlay, subtle imagery, clean typography
 * - Accessible headings and descriptive text
 * - Two CTAs: primary "View Menu" scrolls to #menu, secondary "Book a Table" scrolls to #reservations
 * - Responsive layout with background image/gradient blend
 */
export default function Hero({ onViewMenu, onBookTable }) {
  // Local smooth scroll helper with adjustable offset for sticky navbar
  const scrollToId = (id, offset = 72) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const handleViewMenu = (e) => {
    e.preventDefault();
    if (typeof onViewMenu === 'function') {
      onViewMenu();
    } else {
      scrollToId('menu');
    }
  };

  const handleBookTable = (e) => {
    e.preventDefault();
    if (typeof onBookTable === 'function') {
      onBookTable();
    } else {
      scrollToId('reservations');
    }
  };

  return (
    <div
      className="hero"
      style={{
        position: 'relative',
        isolation: 'isolate',
        minHeight: '64vh',
        display: 'grid',
        alignItems: 'center',
        padding: 'var(--space-12) 0',
        background:
          'linear-gradient(180deg, rgba(37, 99, 235, 0.08), rgba(249, 250, 251, 1))',
        overflow: 'hidden',
      }}
      aria-label="Welcome to Ocean Bistro"
    >
      {/* Decorative background image with gradient overlay for visual depth */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.22,
          mixBlendMode: 'multiply',
          filter: 'saturate(0.9) contrast(1.05)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(249,250,251,0.9))',
        }}
      />

      <div className="container container-xl" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            maxWidth: 880,
            display: 'grid',
            gap: 'var(--space-6)',
          }}
        >
          <header>
            <p
              className="mb-2"
              style={{
                margin: 0,
                fontWeight: 700,
                color: 'var(--color-primary-700)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                fontSize: 'var(--text-sm)',
              }}
            >
              Ocean Bistro
            </p>
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(2rem, 3vw + 1.5rem, 3rem)',
                lineHeight: 1.1,
              }}
            >
              Savor the Ocean, Dine with Elegance
            </h1>
            <p
              className="mb-0"
              style={{
                maxWidth: '60ch',
                marginTop: 'var(--space-3)',
                color: 'var(--color-text-light)',
                fontSize: 'clamp(1rem, 0.6vw + 0.9rem, 1.125rem)',
              }}
            >
              Fresh seafood, seasonal ingredients, and a modern dining experience on the bay.
              Join us for thoughtfully crafted plates and a serene atmosphere.
            </p>
          </header>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              flexWrap: 'wrap',
            }}
          >
            <Button
              as="a"
              href="#menu"
              onClick={handleViewMenu}
              aria-label="View our menu and signature dishes"
              data-testid="hero-cta-menu"
            >
              View Menu
            </Button>
            <Button
              as="a"
              variant="ghost"
              href="#reservations"
              onClick={handleBookTable}
              aria-label="Book a table for your visit"
              data-testid="hero-cta-reservations"
            >
              Book a Table
            </Button>
          </div>

          {/* Inline announcement - accessible */}
          <div style={{ maxWidth: 520 }}>
            <div
              className="ui-toast ui-toast--info"
              role="status"
              aria-live="polite"
              aria-label="Announcement"
            >
              <div className="ui-toast__content">
                <div className="ui-toast__title">Weekend Reservations Open</div>
                <div className="ui-toast__message">
                  Reserve early to secure waterfront seating.
                </div>
              </div>
            </div>
          </div>

          {/* Small feature list for extra context */}
          <ul
            aria-label="Highlights"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
              margin: 0,
              padding: 0,
              listStyle: 'none',
              color: 'var(--color-text-light)',
              fontSize: 'var(--text-sm)',
            }}
          >
            <li style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              🐟 Sustainably Sourced
            </li>
            <li style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              🍷 Curated Wine Pairings
            </li>
            <li style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              🌊 Waterfront Ambience
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
