import React from 'react';
import logo from '../assets/logo.svg';

/**
 * PUBLIC_INTERFACE
 * Navbar component
 * - Sticky at the top
 * - Smooth-scroll anchor links to in-page sections
 * - Highlights the active link based on the active prop
 */
export default function Navbar({
  links = [],
  active,
  onNavigate,
  onToggleTheme,
  theme = 'light',
}) {
  return (
    <nav
      className="navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
      aria-label="Primary"
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          justifyContent: 'space-between',
          padding: '0.75rem 0',
        }}
      >
        <a
          href="#home"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('home');
          }}
          aria-label="Go to home"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <img
            src={logo}
            width="28"
            height="28"
            alt=""
            aria-hidden="true"
            style={{ display: 'block' }}
          />
          <span><strong>Ocean</strong> Bistro</span>
        </a>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) onNavigate(l.id);
              }}
              className={active === l.id ? 'active' : ''}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                color:
                  active === l.id
                    ? 'var(--color-primary)'
                    : 'var(--color-text-light)',
                fontWeight: active === l.id ? 700 : 600,
                background:
                  active === l.id
                    ? 'color-mix(in srgb, var(--color-primary) 10%, white)'
                    : 'transparent',
              }}
              aria-current={active === l.id ? 'page' : undefined}
            >
              {l.label}
            </a>
          ))}
          <button
            className="btn ghost"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title="Toggle theme"
            type="button"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
}
