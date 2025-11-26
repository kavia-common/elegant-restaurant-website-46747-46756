import React, { useMemo, useState } from 'react';
import { Button, Card, Toast } from '../components/ui';
import api from '../utils/api';

/**
 * PUBLIC_INTERFACE
 * Reservation section - accessible form with HTML5 validation and client-side checks.
 * - Fields: name, email, phone, date, time, guests, specialRequests
 * - Submits to `/reservations` using utils/api which handles env base and mock fallback.
 * - Shows success/error Toast. Handles loading/disabled and aria-busy on submit button.
 */
export default function Reservation() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const minDate = useMemo(() => {
    // yyyy-mm-dd for today
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // API base and mock handling are encapsulated in utils/api

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'guests' ? Number(value) : value }));
  };

  const validate = () => {
    // Extra client-side validation beyond HTML5 attributes
    if (!form.name.trim()) return 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email address.';
    if (!form.phone.trim()) return 'Please enter your phone number.';
    if (!form.date) return 'Please select a date.';
    if (!form.time) return 'Please select a time.';
    if (!Number.isFinite(form.guests) || form.guests < 1 || form.guests > 12) {
      return 'Guests must be between 1 and 12.';
    }
    // Basic sanity: date/time shouldn't be in the past (rough check if selected day is today and time passed)
    try {
      const selected = new Date(`${form.date}T${form.time}:00`);
      const now = new Date();
      if (selected < now) {
        return 'Selected date and time cannot be in the past.';
      }
    } catch {
      // ignore parse errors, rely on HTML inputs
    }
    return null;
  };

  const showToast = (variant, title, message, duration = 5000) => {
    setToast({ variant, title, message, duration });
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
      const payload = { ...form };
      await api.post('/reservations', payload, { mockData: { ok: true, id: Math.random().toString(36).slice(2) } });
      showToast('success', 'Reservation Confirmed', 'Your table has been reserved. We look forward to serving you!');
      // Reset most fields except perhaps special requests
      setForm({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: 2,
        specialRequests: '',
      });
    } catch (error) {
      showToast('error', 'Submission Failed', error?.message || 'We could not process your reservation right now.');
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

      <Card
        aria-labelledby="reservation-title"
        header={<h3 id="reservation-title" style={{ margin: 0 }}>Book a Table</h3>}
      >
        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              display: 'grid',
              gap: 'var(--space-4)',
              gridTemplateColumns: '1fr',
            }}
          >
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <div style={{ display: 'grid', gap: '6px' }}>
                <label htmlFor="res-name"><strong>Name</strong></label>
                <input
                  id="res-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  aria-required="true"
                />
              </div>

              <div style={{ display: 'grid', gap: '6px' }}>
                <label htmlFor="res-email"><strong>Email</strong></label>
                <input
                  id="res-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  aria-required="true"
                />
              </div>

              <div style={{ display: 'grid', gap: '6px' }}>
                <label htmlFor="res-phone"><strong>Phone</strong></label>
                <input
                  id="res-phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="(123) 456-7890"
                  value={form.phone}
                  onChange={handleChange}
                  aria-required="true"
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gap: 'var(--space-3)',
                gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
              }}
            >
              <div style={{ display: 'grid', gap: '6px' }}>
                <label htmlFor="res-date"><strong>Date</strong></label>
                <input
                  id="res-date"
                  name="date"
                  type="date"
                  required
                  min={minDate}
                  value={form.date}
                  onChange={handleChange}
                  aria-required="true"
                />
              </div>

              <div style={{ display: 'grid', gap: '6px' }}>
                <label htmlFor="res-time"><strong>Time</strong></label>
                <input
                  id="res-time"
                  name="time"
                  type="time"
                  required
                  value={form.time}
                  onChange={handleChange}
                  aria-required="true"
                />
              </div>

              <div style={{ display: 'grid', gap: '6px' }}>
                <label htmlFor="res-guests"><strong>Guests</strong></label>
                <input
                  id="res-guests"
                  name="guests"
                  type="number"
                  required
                  min={1}
                  max={12}
                  value={form.guests}
                  onChange={handleChange}
                  aria-required="true"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gap: '6px' }}>
              <label htmlFor="res-requests"><strong>Special Requests</strong> <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(optional)</span></label>
              <textarea
                id="res-requests"
                name="specialRequests"
                rows={4}
                placeholder="Allergies, celebrations, seating preference, etc."
                value={form.specialRequests}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                type="submit"
                loading={submitting}
                disabled={submitting}
                aria-busy={submitting ? 'true' : 'false'}
              >
                {submitting ? 'Submitting…' : 'Reserve Now'}
              </Button>
              <span style={{ color: 'var(--color-text-light)', fontSize: 'var(--text-sm)' }}>
                We’ll confirm via email shortly after submission.
              </span>
            </div>
          </div>
        </form>
      </Card>

      <style>{`
        /* Minimal form control styling aligned with Ocean Professional theme */
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
    </div>
  );
}
