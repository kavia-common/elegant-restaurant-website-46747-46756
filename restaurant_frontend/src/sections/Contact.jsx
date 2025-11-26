import React, { useMemo, useState } from 'react';
import { Button, Card, Toast } from '../components/ui';

/**
 * PUBLIC_INTERFACE
 * Contact section with business details, map placeholder, and an accessible contact form.
 * - Shows address, hours, phone, email, and social links
 * - Embeds a map iframe using REACT_APP_MAP_IFRAME_URL or a default
 * - Form fields: name, email, message
 * - On submit, posts to `${REACT_APP_API_BASE||REACT_APP_BACKEND_URL}/contact` via utils/api if present; otherwise mock success
 * - Displays success/error Toast, handles loading/disabled and aria-busy
 */
export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const apiBase = (process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '').replace(/\/+$/, '');

  const mapSrc = useMemo(() => {
    const envSrc = process.env.REACT_APP_MAP_IFRAME_URL;
    if (envSrc && typeof envSrc === 'string') return envSrc;
    // Default Google Maps embed pointing to a generic bay area waterfront
    return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.379302572273!2d-122.402!3d37.793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064c0%3A0x0!2sWaterfront!5e0!3m2!1sen!2sus!4v1610000000000';
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email address.';
    if (!form.message.trim()) return 'Please enter a message.';
    return null;
  };

  const showToast = (variant, title, message, duration = 5000) => {
    setToast({ variant, title, message, duration });
  };

  // Try to use utils/api if present
  const tryLoadApi = async () => {
    try {
      const mod = await import(/* webpackIgnore: true */ '../utils/api').catch(() => null);
      return mod;
    } catch {
      return null;
    }
  };

  const submitToApi = async (payload) => {
    const apiMod = await tryLoadApi();
    if (apiMod && typeof apiMod.post === 'function') {
      return apiMod.post('/contact', payload);
    }
    if (apiBase) {
      const res = await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Request failed with status ${res.status}`);
      }
      return res.json().catch(() => ({}));
    }
    // Mock fallback
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ok: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const err = validate();
    if (err) {
      showToast('error', 'Invalid Information', err);
      return;
    }
    setSubmitting(true);
    try {
      await submitToApi({ ...form });
      showToast('success', 'Message Sent', 'Thanks for reaching out! We will reply shortly.');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      showToast('error', 'Submission Failed', error?.message || 'We could not send your message right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {toast ? (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Toast
            variant={toast.variant}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={() => setToast(null)}
          />
        </div>
      ) : null}

      <div
        style={{
          display: 'grid',
          gap: 'var(--space-4)',
          gridTemplateColumns: '1fr',
        }}
      >
        {/* Details + Map */}
        <div
          style={{
            display: 'grid',
            gap: 'var(--space-4)',
            gridTemplateColumns: '1fr',
          }}
        >
          <Card
            aria-labelledby="contact-details-title"
            header={<h3 id="contact-details-title" style={{ margin: 0 }}>Visit & Contact</h3>}
          >
            <div
              style={{
                display: 'grid',
                gap: 'var(--space-4)',
                gridTemplateColumns: '1fr',
              }}
            >
              <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                <p style={{ margin: 0 }}><strong>Address</strong></p>
                <address style={{ margin: 0, fontStyle: 'normal', color: 'var(--color-text-light)' }}>
                  123 Seaside Ave, Bay City, CA 94000
                </address>
              </div>

              <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                <p style={{ margin: 0 }}><strong>Hours</strong></p>
                <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
                  Tuesday–Sunday, 5:00 PM – 10:00 PM
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gap: 'var(--space-2)',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                }}
              >
                <div style={{ display: 'grid', gap: 6 }}>
                  <p style={{ margin: 0 }}><strong>Phone</strong></p>
                  <a href="tel:+11234567890" aria-label="Call us at (123) 456-7890">
                    (123) 456-7890
                  </a>
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <p style={{ margin: 0 }}><strong>Email</strong></p>
                  <a href="mailto:hello@oceanbistro.example" aria-label="Email us at hello at ocean bistro dot example">
                    hello@oceanbistro.example
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }} aria-label="Social links">
                <a href="https://instagram.com" target="_blank" rel="noreferrer noopener" aria-label="Instagram">Instagram</a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer noopener" aria-label="Facebook">Facebook</a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer noopener" aria-label="Twitter">Twitter/X</a>
                <a href="https://maps.google.com" target="_blank" rel="noreferrer noopener" aria-label="Google Maps">Maps</a>
              </div>

              <div>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <iframe
                    title="Ocean Bistro Location Map"
                    src={mapSrc}
                    width="100%"
                    height="320"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <Card
          aria-labelledby="contact-form-title"
          header={<h3 id="contact-form-title" style={{ margin: 0 }}>Send us a message</h3>}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <div
                style={{
                  display: 'grid',
                  gap: 'var(--space-3)',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                }}
              >
                <div style={{ display: 'grid', gap: 6 }}>
                  <label htmlFor="contact-name"><strong>Name</strong></label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={onChange}
                    aria-required="true"
                  />
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <label htmlFor="contact-email"><strong>Email</strong></label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={onChange}
                    aria-required="true"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gap: 6 }}>
                <label htmlFor="contact-message"><strong>Message</strong></label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="How can we help?"
                  value={form.message}
                  onChange={onChange}
                  aria-required="true"
                />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting}
                  aria-busy={submitting ? 'true' : 'false'}
                >
                  {submitting ? 'Sending…' : 'Send Message'}
                </Button>
                <span style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
                  We typically respond within 1 business day.
                </span>
              </div>
            </div>
          </form>

          <style>{`
            /* Inputs styling consistent with Reservation form */
            input, textarea, select {
              padding: var(--space-3);
              border-radius: var(--radius-md);
              border: 1px solid var(--color-border);
              background: var(--color-surface);
              color: var(--color-text);
              font: inherit;
            }
            input:focus, textarea:focus, select:focus {
              outline: 3px solid color-mix(in srgb, var(--color-primary) 40%, white);
              outline-offset: 2px;
              border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
            }
            label { color: var(--color-text-light); }
          `}</style>
        </Card>
      </div>
    </div>
  );
}
