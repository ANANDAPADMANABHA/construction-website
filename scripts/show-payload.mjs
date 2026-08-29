/**
 * Shows the EXACT JSON payload the function sends to your CRM — without making
 * a real CRM call and without needing the real key. It intercepts the outgoing
 * request so nothing is actually created.
 *
 * Run:  node scripts/show-payload.mjs
 */

// A dummy key so the function proceeds past its "is the key set?" check.
process.env.CRM_API_KEY = 'dummy-key-for-demo';

// Intercept fetch so no real CRM request happens; just capture what would go.
let captured = null;
globalThis.fetch = async (url, opts) => {
  captured = { url, headers: opts.headers, body: opts.body };
  return new Response(JSON.stringify({ ok: true, id: 0 }), {
    status: 201,
    headers: { 'content-type': 'application/json' },
  });
};

const { default: handler } = await import('../netlify/functions/lead.mjs');

// A sample form submission — note the Message text.
const sample = {
  name: 'Priya Menon',
  phone: '7306221165',
  email: 'priya@example.com',
  location: 'Neyyattinkara, Trivandrum',
  project_type: 'residential_construction',
  area: '1800 sqft',
  message: 'We want a 3BHK on a 5 cent plot, budget around 40 lakhs, hoping to start after monsoon.',
};

const req = new Request('http://localhost/api/lead', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(sample),
});

await handler(req);

console.log('\n──────── What the website sends to your CRM ────────\n');
console.log('POST', captured.url);
console.log('Headers:', { ...captured.headers, 'X-API-Key': '***(your secret key, hidden)***' });
console.log('\nJSON body:\n');
console.log(JSON.stringify(JSON.parse(captured.body), null, 2));
console.log('\n────────────────────────────────────────────────────');
console.log('Note: "message" and "area" are included above. Per your CRM spec,');
console.log('the CRM stores them in the lead\'s NOTES field — look there.\n');
