/**
 * Secure lead-intake proxy (Netlify Function).
 *
 * The website form POSTs a JSON lead here. This function adds the secret
 * X-API-Key (read from the CRM_API_KEY environment variable — NEVER hardcoded)
 * and forwards the lead to the CRM server-side. This keeps the key off the
 * public website and sidesteps browser CORS restrictions.
 *
 * Set the secret in Netlify:  Site settings → Environment variables → CRM_API_KEY
 */

const CRM_URL = 'https://gk-erp-n0v2.onrender.com/api/public/lead-intake/';

// This function answers POST /api/lead
export const config = { path: '/api/lead' };

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  let data;
  try {
    data = await req.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  // Spam honeypot: bots fill the hidden "company" field. Accept silently,
  // but don't forward to the CRM.
  if (data && data.company) return json({ ok: true, skipped: true });

  const name = (data?.name ?? '').toString().trim();
  if (!name) return json({ ok: false, error: 'missing_name' }, 400);

  const apiKey = process.env.CRM_API_KEY;
  if (!apiKey) return json({ ok: false, error: 'server_not_configured' }, 500);

  // Only forward the fields the CRM expects.
  const payload = {
    name,
    phone: (data.phone ?? '').toString(),
    email: (data.email ?? '').toString(),
    location: (data.location ?? '').toString(),
    project_type: (data.project_type ?? '').toString(),
    area: (data.area ?? '').toString(),
    message: (data.message ?? '').toString(),
  };

  try {
    const res = await fetch(CRM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 201) {
      const body = await res.json().catch(() => ({}));
      return json({ ok: true, id: body.id ?? null });
    }

    // Surface a compact reason; the form will fall back to WhatsApp on any failure.
    const text = await res.text().catch(() => '');
    return json({ ok: false, status: res.status, error: text.slice(0, 200) }, 502);
  } catch {
    // CRM unreachable (e.g. cold start / network). Form falls back to WhatsApp.
    return json({ ok: false, error: 'upstream_unreachable' }, 502);
  }
};
