/**
 * Local test for the CRM lead function — runs the ACTUAL function code
 * (netlify/functions/lead.mjs) against your real CRM, with NO Netlify CLI and
 * NO Deno required. It confirms the end-to-end: function → CRM.
 *
 * Run from the project root:
 *   node --env-file=.env scripts/test-lead.mjs
 *
 * (.env must contain your real CRM_API_KEY. This creates one test lead in your
 *  CRM — named "Website Local Test" — which you can delete afterwards.)
 */
import handler from '../netlify/functions/lead.mjs';

const sample = {
  name: 'Website Local Test',
  phone: '7306221165',
  email: 'test@example.com',
  location: 'Trivandrum',
  project_type: 'residential_construction',
  area: '1800 sqft',
  message: 'Local test submission from scripts/test-lead.mjs — please ignore/delete.',
};

console.log('Sending test lead to the function → CRM …\n');

const req = new Request('http://localhost/api/lead', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(sample),
});

const res = await handler(req);
const body = await res.text();

console.log('HTTP status from function:', res.status);
console.log('Response body:', body, '\n');

if (res.status === 200 && body.includes('"ok":true')) {
  console.log('✅ SUCCESS — a lead was created in your CRM. Check the leads table (source = "website").');
} else if (res.status === 500) {
  console.log('⚠️  CRM_API_KEY was not loaded. Make sure .env has your real key and run:');
  console.log('    node --env-file=.env scripts/test-lead.mjs');
} else if (res.status === 502) {
  console.log('❌ Reached the function, but the CRM rejected it or was unreachable (maybe a cold start — try again).');
} else {
  console.log('❌ Unexpected result — see the status/body above.');
}
