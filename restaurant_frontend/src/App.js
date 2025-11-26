import React, { useEffect, useMemo, useState, Suspense, lazy } from 'react';
import './App.css';

/**
 * Smooth scroll helper for in-page anchors. Accounts for a fixed navbar offset.
 */
function scrollToId(id, offset = 72) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/**
 * Determine the currently visible section based on scroll position.
 */
function getActiveSection(sectionIds, offset = 80) {
  const scrollPos = window.scrollY + offset + 1;
  let current = sectionIds[0];
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.offsetTop <= scrollPos) current = id;
  }
  return current;
}

/**
 * Simple brand logo text.
 */
function Brand() {
  return (
    <a href="#hero" className="brand" onClick={(e) => { e.preventDefault(); scrollToId('hero'); }}>
      <strong>Ocean</strong> Bistro
    </a>
  );
}

/**
 * Navbar with anchored links and active state.
 */
function Navbar({ links, active, onNavigate, onToggleTheme, theme }) {
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
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', padding: '0.75rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Brand />
          <span className="sr-only" aria-hidden="true" />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => { e.preventDefault(); onNavigate(l.id); }}
              className={active === l.id ? 'active' : ''}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                color: active === l.id ? 'var(--color-primary)' : 'var(--color-text-light)',
                fontWeight: active === l.id ? 700 : 600,
                background: active === l.id ? 'color-mix(in srgb, var(--color-primary) 10%, white)' : 'transparent',
              }}
            >
              {l.label}
            </a>
          ))}
          <button
            className="btn ghost"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
}

/**
 * Footer with simple credits.
 */
function Footer() {
  return (
    <footer
      className="section"
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} Ocean Bistro. All rights reserved.</p>
        <p style={{ margin: 0 }}>Crafted with <span aria-hidden>💙</span> using React.</p>
      </div>
    </footer>
  );
}

/**
 * Section wrappers
 */
function Section({ id, title, children, soft = false, description }) {
  return (
    <section id={id} className={`section${soft ? ' soft' : ''}`} aria-labelledby={`${id}-title`}>
      <div className="container">
        <header style={{ marginBottom: 'var(--space-6)' }}>
          <h2 id={`${id}-title`}>{title}</h2>
          {description ? <p style={{ maxWidth: 720 }}>{description}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}

// Lazy-load Gallery to keep initial bundle small
const Gallery = lazy(() => import('./components/Gallery').catch(() => ({ default: () => (
  <div className="card">Gallery is not available right now.</div>
)})));

/**
 * Temporary placeholder components for each section content.
 */
function Hero() {
  return (
    <div className="container" style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-12)' }}>
      <div className="card" style={{ textAlign: 'center', background: 'var(--gradient-soft)' }}>
        <h1 className="mb-4">Savor the Ocean, Dine with Elegance</h1>
        <p className="mb-6">Fresh seafood, seasonal ingredients, and a modern dining experience.</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <a className="btn" href="#reservation" onClick={(e) => { e.preventDefault(); scrollToId('reservation'); }}>Reserve a Table</a>
          <a className="btn ghost" href="#menu" onClick={(e) => { e.preventDefault(); scrollToId('menu'); }}>View Menu</a>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  return (
    <div className="card">
      <h3 className="mb-4">Today’s Highlights</h3>
      <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--color-text-light)' }}>
        <li>Seared Scallops with Citrus Glaze</li>
        <li>Grilled Salmon with Herb Butter</li>
        <li>Lobster Risotto with Saffron</li>
      </ul>
    </div>
  );
}

function Reservation() {
  return (
    <div className="card">
      <p className="mb-4">Call us or drop by to reserve. Online form coming soon.</p>
      <a className="btn" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }}>Contact Us</a>
    </div>
  );
}

function Testimonials() {
  return (
    <div className="card">
      <blockquote className="mb-2" style={{ margin: 0, fontStyle: 'italic' }}>
        “An unforgettable dining experience. The flavors were exquisite.”
      </blockquote>
      <p style={{ margin: 0, color: 'var(--color-muted)' }}>— A Happy Guest</p>
    </div>
  );
}

function Contact() {
  return (
    <div className="card">
      <p className="mb-2"><strong>Location:</strong> 123 Seaside Ave, Bay City</p>
      <p className="mb-2"><strong>Hours:</strong> Tue–Sun, 5pm–10pm</p>
      <p className="mb-4"><strong>Phone:</strong> (123) 456-7890</p>
      <a className="btn secondary" href="tel:+11234567890">Call Now</a>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const sectionLinks = useMemo(() => ([
    { id: 'hero', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'reservation', label: 'Reservation' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ]), []);

  const [active, setActive] = useState(sectionLinks[0].id);

  // Track active link on scroll
  useEffect(() => {
    const ids = sectionLinks.map(l => l.id);
    const onScroll = () => {
      const current = getActiveSection(ids);
      setActive(current);
      // Update hash without jumping
      if (window.history && current !== window.location.hash.replace('#', '')) {
        window.history.replaceState(null, '', `#${current}`);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionLinks]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleNavigate = (id) => {
    scrollToId(id);
    setActive(id);
  };

  return (
    <div className="App">
      <Navbar
        links={sectionLinks}
        active={active}
        onNavigate={handleNavigate}
        onToggleTheme={toggleTheme}
        theme={theme}
      />

      <main>
        <section id="hero" aria-label="Hero" style={{ paddingTop: 'var(--space-6)' }}>
          <Hero />
        </section>

        <Section
          id="menu"
          title="Our Menu"
          description="A curated selection of ocean-inspired dishes, crafted daily by our chefs."
          soft
        >
          <Menu />
        </Section>

        <Section
          id="reservation"
          title="Reservation"
          description="Book your table and enjoy an evening of culinary delight."
        >
          <Reservation />
        </Section>

        <Section
          id="testimonials"
          title="What Guests Say"
          description="Real experiences from diners who loved their time with us."
          soft
        >
          <Testimonials />
        </Section>

        <Section
          id="gallery"
          title="Gallery"
          description="A glimpse into our ambience and signature plates."
        >
          <Suspense fallback={<div className="card">Loading gallery…</div>}>
            <Gallery />
          </Suspense>
        </Section>

        <Section
          id="contact"
          title="Contact Us"
          description="We’d love to hear from you. Reach out for reservations or questions."
          soft
        >
          <Contact />
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
