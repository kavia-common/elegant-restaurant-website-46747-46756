import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Footer component with business info and quick links
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="section"
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
      aria-label="Footer"
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: '0.5rem',
          }}
        >
          <div className="brand" aria-label="Ocean Bistro">
            <strong>Ocean</strong> Bistro
          </div>
          <p style={{ margin: 0 }}>
            123 Seaside Ave, Bay City • Tue–Sun, 5pm–10pm • (123) 456-7890
          </p>
        </div>

        <hr />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <nav aria-label="Quick links" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a href="#home">Home</a>
            <a href="#menu">Menu</a>
            <a href="#reservations">Reservations</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </nav>
          <p style={{ margin: 0, color: 'var(--color-muted)' }}>
            © {year} Ocean Bistro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
