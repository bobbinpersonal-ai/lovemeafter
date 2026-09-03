'use client';

import { useState } from 'react';
import { MENS_TEASER } from '@/lib/constants';

export default function MensTeaser() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [error, setError] = useState('');

  if (!MENS_TEASER.enabled) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setError('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <section id="mens-teaser" className="relative overflow-hidden border-t border-platinum/10 bg-obsidian py-24">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 grayscale"
        style={{ backgroundImage: "url('https://cdn.shopify.com/s/files/placeholder/mens-teaser.jpg?width=1600')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian" />

      <div className="relative z-10 mx-auto max-w-xl px-6 text-center">
        <p className="eyebrow">{MENS_TEASER.eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl italic md:text-5xl">{MENS_TEASER.heading}</h2>
        <p className="mt-2 text-sm uppercase tracking-widest2 text-platinum/50">{MENS_TEASER.subheading}</p>

        {status === 'success' ? (
          <p className="mt-8 text-sm text-gold">You&rsquo;re on the list. We&rsquo;ll be in touch.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-sm gap-3">
            <label htmlFor="mens-waitlist-email" className="sr-only">
              Email address
            </label>
            <input
              id="mens-waitlist-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={MENS_TEASER.waitlistPlaceholder}
              className="flex-1 border-b border-platinum/30 bg-transparent px-1 py-2 text-sm text-platinum placeholder:text-platinum/40 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="whitespace-nowrap text-xs uppercase tracking-widest2 text-gold underline underline-offset-4 disabled:opacity-50"
            >
              {status === 'submitting' ? 'Sending…' : MENS_TEASER.waitlistCta}
            </button>
          </form>
        )}
        {status === 'error' && <p className="mt-3 text-xs text-red-400">{error}</p>}
      </div>
    </section>
  );
}
