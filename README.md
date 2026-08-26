# Arcfinity — Website

A fast, SEO-optimised, mobile-first marketing site for **Arcfinity**, a construction
and design company serving Thiruvananthapuram (Trivandrum) and Kerala.

Built with **[Astro](https://astro.build)** — ships almost no JavaScript, so pages
are fast and Core Web Vitals stay green. No CSS framework, no heavy dependencies.

---

## ⚠️ Before you go live — replace the placeholders

Nothing on the site is fabricated as if real, but several values are **placeholders**
you must replace with genuine information. Search the codebase for `PLACEHOLDER`.

| What | Where | Notes |
|------|-------|-------|
| Phone, WhatsApp, email, address, hours, Google Business, socials, coordinates | `src/config/site.ts` | Single source of truth for all contact info. |
| Production domain | `src/config/site.ts` **and** `astro.config.mjs` (`site`) **and** `public/robots.txt` | Keep all three in sync. |
| Real projects | `src/content/projects/*.md` | Delete the 4 sample entries (`isSample: true`) and add real ones. |
| Client testimonials | `src/config/testimonials.ts` | Add only **genuine** quotes. Empty by default. |
| Team members | `src/pages/about.astro` (team section) | Replace the editor note with real people + photos. |
| Legal pages | `src/pages/privacy-policy.astro`, `terms.astro` | Starter templates — have a professional review them. |
| Project / hero photography | see **Images** below | Branded SVG placeholders render until you add real photos. |

> Do **not** invent awards, ratings, review counts, years of experience or project
> statistics. Leave a field out rather than fake it.

---

## Commands

```bash
npm install        # install dependencies
npm run dev        # local dev server at http://localhost:4321
npm run build      # production build to ./dist
npm run preview    # preview the production build

node scripts/gen-assets.mjs   # regenerate favicon / OG / app icons from SVG sources
node scripts/audit.mjs        # SEO audit of ./dist (run after build)
```

The audit checks: unique titles & descriptions, exactly one `<h1>` per page,
canonical tags, broken internal links, accidental `noindex`, and sitemap/robots
presence.

---

## Project structure

```
src/
  config/
    site.ts          # ← all business info (PLACEHOLDERS live here)
    nav.ts           # navigation + canonical services list
    testimonials.ts  # real testimonials (empty) + fallback commitments
  content/
    services/        # 8 service pages (rich frontmatter + prose)
    projects/        # portfolio entries (4 samples to replace)
    blog/            # resources / guides (real, useful content)
  content.config.ts  # content collection schemas (zod)
  components/        # Header, Footer, LeadForm, cards, Icon, etc.
  layouts/           # BaseLayout, PageHeader
  pages/             # routes (file-based)
  utils/seo.ts       # canonical URLs + Schema.org builders
  styles/global.css  # the whole design system
public/              # robots.txt, favicons, manifest, OG image
scripts/             # asset generation + audit
```

---

## The lead form

`src/components/LeadForm.astro` is portable:

- **No backend?** It falls back to opening a prefilled **WhatsApp** chat — works on
  any static host with zero configuration.
- **Have a backend?** Pass an endpoint and it will POST the form instead:

  ```astro
  <LeadForm endpoint="https://your-form-endpoint" />
  ```

  Options: Netlify Forms, Formspree, a Vercel/Cloudflare serverless function, etc.
  On success it redirects to `/thank-you`.

Spam protection is built in (honeypot field + time-trap) with no third-party
CAPTCHA. For high volume, add a server-side check (Cloudflare Turnstile / hCaptcha)
at your endpoint.

---

## Content admin panel (no-code editing)

A **Sveltia CMS** admin lets you add/edit projects (including **3D Design** works)
and blog posts through a form — no code.

- **URL:** **`/admin`** (no trailing slash) — e.g. `http://localhost:4321/admin`.
  `/admin/index.html` also works. `/admin/` *with* a trailing slash will 404 because
  of the site's clean-URL setting, so don't use that form.
- **Local editing (no login):** `npm run dev`, open `/admin` in **Chrome or Edge**,
  choose *"Work with Local Repository"*, and pick the project folder. Edits write
  straight to your files.
- **Live team editing:** connect a GitHub repo + Sveltia auth (see the notes at the
  bottom of `public/admin/config.yml`). Publishing then commits to GitHub and your
  host auto-rebuilds — new work is live in ~1–2 minutes, no manual build.

Config lives in `public/admin/config.yml`; the field definitions there must stay in
sync with `src/content.config.ts`.

## Images

Real photography is the single biggest visual upgrade. Until then, branded SVG
placeholders render automatically (no layout shift, no network cost).

To add real photos the performant way, use Astro's `astro:assets`:

```astro
---
import { Image } from 'astro:assets';
import photo from '../assets/projects/villa-1.jpg';
---
<Image src={photo} alt="Descriptive alt text" widths={[400, 800, 1200]}
  sizes="(max-width: 800px) 100vw, 800px" format="avif" loading="lazy" />
```

Astro then emits responsive AVIF/WebP with correct `srcset`, `sizes` and
`width`/`height`. For project photos, add them to a project's `images:` array in its
markdown frontmatter. Load the hero/first image with `loading="eager"` +
`fetchpriority="high"`; lazy-load everything below the fold.

---

## SEO / analytics readiness

- **sitemap** — `dist/sitemap-index.xml` (auto-generated, submit to Search Console).
- **robots.txt** — `public/robots.txt` (update the domain + sitemap URL).
- **Structured data** — Organization, WebSite, GeneralContractor (LocalBusiness),
  BreadcrumbList, Service, FAQPage, Article. Validate at
  <https://validator.schema.org> and Google's Rich Results Test after deploying.
- **Analytics** — none included by design. Add a lightweight, privacy-respecting
  analytics snippet (e.g. in `BaseHead.astro`) if/when needed, and update the
  Privacy Policy.
- **Google Business Profile** — link is in `site.ts`; keep NAP (name, address,
  phone) identical between the site and the profile.

---

## Deployment (portable)

Static output in `dist/`. Deploy to Netlify, Vercel, Cloudflare Pages, or any static
host / CDN. Recommended settings:

- Build command: `npm run build`
- Publish directory: `dist`
- Enable Brotli/gzip compression and long-cache headers for `/_astro/*` (hashed,
  immutable).
- **301 redirects** — add a host config (`_redirects` for Netlify/Cloudflare,
  `vercel.json` for Vercel) as needed. Clean, extension-less URLs are already
  configured.

---

## Accessibility & performance notes

- Semantic HTML, skip link, keyboard-operable nav and FAQ (native `<details>`),
  labelled form fields, visible focus states, `prefers-reduced-motion` respected.
- One self-hosted variable font (Space Grotesk) + system font stack for body.
- Sticky mobile action bar (call / WhatsApp / enquire); click-to-call everywhere.
- Map is click-to-load (no heavy iframe on first paint).
