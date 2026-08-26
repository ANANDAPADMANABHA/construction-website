/**
 * ============================================================================
 *  ARCFINITY — CENTRAL BUSINESS CONFIGURATION
 * ============================================================================
 *  This is the SINGLE SOURCE OF TRUTH for all business information used across
 *  the website: header, footer, contact page, click-to-call, WhatsApp links,
 *  structured data (Schema.org), Open Graph tags and the sitemap.
 *
 *  ⚠️  VALUES MARKED "PLACEHOLDER" ARE NOT REAL.
 *      Replace every placeholder below with Arcfinity's genuine details before
 *      the site goes live. Nothing here is fabricated as if it were real — the
 *      placeholders are deliberately obvious (XXXXX, example.com, etc.).
 *
 *      Do NOT invent awards, review counts, ratings, years of experience or
 *      project statistics. Leave a field empty rather than fake it.
 * ============================================================================
 */

export interface ServiceArea {
  name: string;
  /** Slug used only if a dedicated area page is created. */
  slug: string;
  /** True for the primary market shown most prominently. */
  primary?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
  /** Icon key handled by the Icon component. */
  icon: 'instagram' | 'facebook' | 'youtube' | 'linkedin' | 'google';
}

export const site = {
  // ── Identity ──────────────────────────────────────────────────────────
  name: 'Arcfinity',
  legalName: 'Arcfinity', // PLACEHOLDER — use the registered legal entity name.
  tagline: 'Building Homes. Shaping Possibilities.',
  shortDescription:
    'Arcfinity is a construction and design company in Thiruvananthapuram, Kerala — delivering full house construction, renovation, interiors and architectural design with engineering rigour and transparent communication.',

  // The canonical production URL. Keep in sync with astro.config.mjs `site`.
  url: 'https://www.arcfinity.in', // PLACEHOLDER domain.

  // ── Contact (ALL PLACEHOLDERS — replace before launch) ────────────────
  contact: {
    // Store phone in international format for tel: links and WhatsApp.
    phoneDisplay: '+91 00000 00000', // PLACEHOLDER
    phoneE164: '+910000000000', // PLACEHOLDER — used for tel: and wa.me
    // WhatsApp number in wa.me format (country code + number, no +, no spaces).
    whatsapp: '910000000000', // PLACEHOLDER
    email: 'hello@arcfinity.in', // PLACEHOLDER
    // Physical address / office. If the business is service-area only (no
    // storefront), leave streetAddress blank and rely on `serviceAreaOnly`.
    address: {
      streetAddress: 'Office address line', // PLACEHOLDER
      locality: 'Thiruvananthapuram',
      region: 'Kerala',
      postalCode: '695000', // PLACEHOLDER
      country: 'IN',
    },
    // Set true if Arcfinity serves clients at their sites without a public
    // storefront. This changes how LocalBusiness structured data is emitted.
    serviceAreaOnly: false,
    // Google Business Profile short link / Maps place link. PLACEHOLDER.
    googleBusinessProfile: 'https://maps.google.com/?q=Arcfinity+Thiruvananthapuram',
    // A "Get directions" deep link (place URL). PLACEHOLDER.
    directionsUrl: 'https://maps.google.com/?q=Arcfinity+Thiruvananthapuram',
    // Approximate coordinates for LocalBusiness geo. PLACEHOLDER — set the real
    // office coordinates, or remove `geo` if service-area only.
    geo: {
      latitude: 8.5241,
      longitude: 76.9366,
    },
  },

  // ── Business hours (edit to match reality) ────────────────────────────
  // dayOfWeek uses Schema.org day names. Times are 24h "HH:MM".
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
    { days: ['Saturday'], opens: '09:00', closes: '17:00' },
    // Sunday intentionally omitted = closed. Add if the business opens Sundays.
  ] as Array<{ days: string[]; opens: string; closes: string }>,
  hoursHuman: 'Mon–Fri: 9:00 AM – 6:00 PM · Sat: 9:00 AM – 5:00 PM · Sun: Closed',

  // ── Service areas (list ONLY genuinely served locations) ──────────────
  serviceAreas: [
    { name: 'Thiruvananthapuram', slug: 'thiruvananthapuram', primary: true },
    { name: 'Neyyattinkara', slug: 'neyyattinkara' },
    { name: 'Kollam', slug: 'kollam' },
    { name: 'Attingal', slug: 'attingal' },
    { name: 'Nedumangad', slug: 'nedumangad' },
  ] as ServiceArea[],

  // ── Social profiles (remove any the business does not have) ───────────
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/arcfinity', icon: 'instagram' }, // PLACEHOLDER
    { label: 'Facebook', href: 'https://facebook.com/arcfinity', icon: 'facebook' }, // PLACEHOLDER
    { label: 'Google Business Profile', href: 'https://maps.google.com/?q=Arcfinity+Thiruvananthapuram', icon: 'google' }, // PLACEHOLDER
  ] as SocialLink[],

  // ── Defaults for SEO / social sharing ─────────────────────────────────
  defaultOgImage: '/og/arcfinity-og.png',
  themeColor: '#16181d',
  locale: 'en_IN',
  language: 'en',
} as const;

/**
 * Pre-built links derived from the config, so components never re-assemble
 * tel:/wa.me strings by hand.
 */
export const links = {
  tel: `tel:${site.contact.phoneE164}`,
  /** Build a WhatsApp link with an optional prefilled message. */
  whatsapp(message = "Hi Arcfinity, I'd like to discuss a construction project."): string {
    return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  },
  mailto: `mailto:${site.contact.email}`,
};

export type Site = typeof site;
