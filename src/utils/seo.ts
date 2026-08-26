/**
 * SEO + Schema.org helpers.
 * All structured data is built from the genuine (or clearly-placeholder)
 * business config — no fabricated reviews, ratings, awards or counts.
 */
import { site } from '../config/site';
import { services } from '../config/nav';

export interface SeoProps {
  title: string;
  description: string;
  /** Path beginning with "/" — canonical is derived from site.url. */
  path: string;
  /** Absolute or root-relative image path for OG/Twitter. */
  image?: string;
  /** article | website — controls og:type. */
  type?: 'website' | 'article';
  /** Set true only on pages that must not be indexed. */
  noindex?: boolean;
  /** Article-specific metadata. */
  publishedTime?: string;
  modifiedTime?: string;
}

export function canonical(path: string): string {
  const base = site.url.replace(/\/$/, '');
  if (path === '/' || path === '') return base + '/';
  return base + '/' + path.replace(/^\//, '');
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return site.url.replace(/\/$/, '') + '/' + pathOrUrl.replace(/^\//, '');
}

/** Map Schema.org day arrays into openingHoursSpecification. */
function openingHours() {
  return site.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  }));
}

/**
 * GeneralContractor is the most accurate LocalBusiness subtype for a
 * construction company. Includes areaServed for local SEO.
 */
export function localBusinessSchema() {
  const c = site.contact;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': canonical('/') + '#business',
    name: site.name,
    legalName: site.legalName,
    url: canonical('/'),
    description: site.shortDescription,
    email: c.email,
    telephone: c.phoneE164,
    image: absoluteUrl(site.defaultOgImage),
    logo: absoluteUrl('/favicon.svg'),
    priceRange: '₹₹',
    openingHoursSpecification: openingHours(),
    areaServed: site.serviceAreas.map((a) => ({
      '@type': 'City',
      name: a.name,
    })),
    sameAs: site.socials.map((s) => s.href),
  };

  if (!c.serviceAreaOnly) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: c.address.streetAddress,
      addressLocality: c.address.locality,
      addressRegion: c.address.region,
      postalCode: c.address.postalCode,
      addressCountry: c.address.country,
    };
    if (c.geo) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: c.geo.latitude,
        longitude: c.geo.longitude,
      };
    }
  } else {
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: c.address.locality,
      addressRegion: c.address.region,
      addressCountry: c.address.country,
    };
  }

  return schema;
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': canonical('/') + '#organization',
    name: site.name,
    legalName: site.legalName,
    url: canonical('/'),
    logo: absoluteUrl('/favicon.svg'),
    description: site.shortDescription,
    email: site.contact.email,
    telephone: site.contact.phoneE164,
    sameAs: site.socials.map((s) => s.href),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': canonical('/') + '#website',
    url: canonical('/'),
    name: site.name,
    description: site.shortDescription,
    publisher: { '@id': canonical('/') + '#organization' },
    inLanguage: 'en-IN',
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: canonical(c.path),
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    serviceType: opts.name,
    provider: { '@id': canonical('/') + '#business' },
    areaServed: site.serviceAreas.map((a) => ({ '@type': 'City', name: a.name })),
    url: canonical(`/services/${opts.slug}`),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    image: opts.image ? absoluteUrl(opts.image) : absoluteUrl(site.defaultOgImage),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { '@id': canonical('/') + '#organization' },
    publisher: { '@id': canonical('/') + '#organization' },
    mainEntityOfPage: canonical(opts.path),
    inLanguage: 'en-IN',
  };
}

export { services };
