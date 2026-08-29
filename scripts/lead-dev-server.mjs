/**
 * Tiny local dev server that runs the lead function — so you can test the full
 * browser form flow locally WITHOUT the Netlify CLI (and without Deno).
 *
 * How it works: Astro's dev server proxies /api/lead to this server (see the
 * `vite.server.proxy` block in astro.config.mjs). This server runs the exact
 * same function code that runs in production, and forwards leads to your CRM.
 *
 * Run it (in its own terminal) alongside `npm run dev`:
 *   node --env-file=.env scripts/lead-dev-server.mjs
 */
import http from 'node:http';
import handler from '../netlify/functions/lead.mjs';

const PORT = 8787;

const server = http.createServer(async (req, res) => {
  if (!req.url || !req.url.startsWith('/api/lead')) {
    res.writeHead(404, { 'content-type': 'application/json' });
    return res.end('{"ok":false,"error":"not_found"}');
  }

  // Collect the request body.
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString('utf8');

  // Adapt Node's request into the Web `Request` the function expects.
  const request = new Request('http://localhost' + req.url, {
    method: req.method,
    headers: { 'content-type': req.headers['content-type'] || 'application/json' },
    body: req.method === 'POST' ? body : undefined,
  });

  try {
    const response = await handler(request);
    const text = await response.text();
    res.writeHead(response.status, { 'content-type': 'application/json' });
    res.end(text);
  } catch (err) {
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: false, error: String(err) }));
  }
});

server.listen(PORT, () => {
  console.log(`\n✅ Lead dev server running on http://localhost:${PORT}`);
  console.log('   Astro proxies /api/lead here. Keep this running, and in another');
  console.log('   terminal run:  npm run dev   → then open http://localhost:4321/contact\n');
});
