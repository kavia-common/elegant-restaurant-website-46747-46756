import React, { useEffect, useMemo, useState, Suspense, lazy } from 'react';
import './App.css';
import { Button, Card, Section as UiSection } from './components/ui';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';

/**
 * PUBLIC_INTERFACE
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

// Lazy-load Gallery to keep initial bundle small
const Gallery = lazy(() =>
  import('./components/Gallery').catch(() => ({
    default: () => <div className="card">Gallery is not available right now.</div>,
  }))
);

function Menu() {
  return (
    <Card>
      <h3 className="mb-4">Today’s Highlights</h3>
      <ul style={{ margin: 0, paddingLeft: '1rem', color: 'var(--color-text-light)' }}>
        <li>Seared Scallops with Citrus Glaze</li>
        <li>Grilled Salmon with Herb Butter</li>
        <li>Lobster Risotto with Saffron</li>
      </ul>
    </Card>
  );
}

function Reservations() {
  return (
    <Card>
      <p className="mb-4">Call us or drop by to reserve. Online form coming soon.</p>
      <Button
        as="a"
        variant="secondary"
        href="#contact"
        onClick={(e) => {
          e.preventDefault();
          scrollToId('contact');
        }}
      >
        Contact Us
      </Button>
    </Card>
  );
}

function Testimonials() {
  return (
    <Card variant="outlined">
      <blockquote className="mb-2" style={{ margin: 0, fontStyle: 'italic' }}>
        “An unforgettable dining experience. The flavors were exquisite.”
      </blockquote>
      <p style={{ margin: 0, color: 'var(--color-muted)' }}>— A Happy Guest</p>
    </Card>
  );
}

function Contact() {
  return (
    <Card>
      <p className="mb-2">
        <strong>Location:</strong> 123 Seaside Ave, Bay City
      </p>
      <p className="mb-2">
        <strong>Hours:</strong> Tue–Sun, 5pm–10pm
      </p>
      <p className="mb-4">
        <strong>Phone:</strong> (123) 456-7890
      </p>
      <Button as="a" variant="secondary" href="tel:+11234567890">
        Call Now
      </Button>
    </Card>
  );
}

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // IDs aligned to request: #home, #menu, #reservations, #testimonials, #gallery, #contact
  const sectionLinks = useMemo(
    () => [
      { id: 'home', label: 'Home' },
      { id: 'menu', label: 'Menu' },
      { id: 'reservations', label: 'Reservations' },
      { id: 'testimonials', label: 'Testimonials' },
      { id: 'gallery', label: 'Gallery' },
      { id: 'contact', label: 'Contact' },
    ],
    []
  );

  const [active, setActive] = useState(sectionLinks[0].id);

  // Track active link on scroll
  useEffect(() => {
    const ids = sectionLinks.map((l) => l.id);
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
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
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
        <section id="home" aria-label="Hero" style={{ paddingTop: 'var(--space-6)' }}>
          <Hero
            onViewMenu={() => handleNavigate('menu')}
            onBookTable={() => handleNavigate('reservations')}
          />
        </section>

        <UiSection
          id="menu"
          title="Our Menu"
          description="A curated selection of ocean-inspired dishes, crafted daily by our chefs."
          soft
        >
          <Menu />
        </UiSection>

        <UiSection
          id="reservations"
          title="Reservations"
          description="Book your table and enjoy an evening of culinary delight."
        >
          <Reservations />
        </UiSection>

        <UiSection
          id="testimonials"
          title="What Guests Say"
          description="Real experiences from diners who loved their time with us."
          soft
        >
          <Testimonials />
        </UiSection>

        <UiSection id="gallery" title="Gallery" description="A glimpse into our ambience and signature plates.">
          <Suspense fallback={<div className="card">Loading gallery…</div>}>
            <Gallery />
          </Suspense>
        </UiSection>

        <UiSection
          id="contact"
          title="Contact Us"
          description="We’d love to hear from you. Reach out for reservations or questions."
          soft
        >
          <Contact />
        </UiSection>
      </main>

      <Footer />
    </div>
  );
}

export default App;
