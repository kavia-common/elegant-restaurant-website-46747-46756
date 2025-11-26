import React, { useEffect, useMemo, useState, Suspense, lazy } from 'react';
import './App.css';
import { Button, Card, Section as UiSection } from './components/ui';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Menu from './sections/Menu';
import Reservation from './sections/Reservation';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';

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
          <Reservation />
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
