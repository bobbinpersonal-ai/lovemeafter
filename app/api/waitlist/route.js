import { NextResponse } from 'next/server';

/**
 * Men's collection waitlist signup.
 *
 * TODO: this currently validates and accepts the request but does not yet
 * persist the email anywhere. Before this goes live, wire it to a real
 * subscriber list -- e.g. Klaviyo's "Subscribe profile" API (server-side,
 * using a private API key from an env var, never the client) or Shopify's
 * customer API with a "mens-waitlist" tag. Do not ship this route as-is
 * to production; the current 200 response would otherwise silently
 * discard every signup.
 */
export async function POST(request) {
  let email;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 422 });
  }

  // TODO: replace with real persistence (Klaviyo / Shopify customer API).
  console.log('[mens-waitlist] signup received (not yet persisted):', email);

  return NextResponse.json({ ok: true });
}
