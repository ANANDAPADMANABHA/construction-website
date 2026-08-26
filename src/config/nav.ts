/**
 * Navigation + the canonical list of services.
 * The `services` array here is the ordering/metadata source for menus, the
 * services grid, the footer and internal links. Long-form content for each
 * service lives in `src/content/services/*.md`.
 */

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface ServiceMeta {
  slug: string;
  title: string; // Short menu/card title
  /** One-line summary used on cards and menus. */
  summary: string;
  /** Icon key handled by the Icon component. */
  icon: string;
}

/** Ordered list of services. Slugs map to /services/<slug>. */
export const services: ServiceMeta[] = [
  {
    slug: 'house-construction',
    title: 'House Construction',
    summary: 'Full home construction — foundation to finishing — built to spec, on time.',
    icon: 'home',
  },
  {
    slug: 'commercial-construction',
    title: 'Commercial Construction',
    summary: 'Shops, offices and commercial buildings engineered for durability and use.',
    icon: 'building',
  },
  {
    slug: 'home-renovation',
    title: 'Home Renovation',
    summary: 'Structural and cosmetic renovation that modernises without the guesswork.',
    icon: 'renovation',
  },
  {
    slug: 'interior-design',
    title: 'Interior Design',
    summary: 'Functional, elegant interiors with fabrication and turnkey execution.',
    icon: 'interior',
  },
  {
    slug: '2d-house-plans',
    title: '2D House Plans',
    summary: 'Vastu-aware, permit-ready floor plans that balance flow, light and budget.',
    icon: 'plan',
  },
  {
    slug: '3d-elevation-design',
    title: '3D Elevation Design',
    summary: 'Photoreal exterior elevations so you see the home before we build it.',
    icon: 'elevation',
  },
  {
    slug: 'building-permit',
    title: 'Building Permit',
    summary: 'Panchayat/Corporation permit drawings and approvals, handled end to end.',
    icon: 'permit',
  },
  {
    slug: 'mep-drawings',
    title: 'MEP Drawings',
    summary: 'Mechanical, electrical and plumbing drawings coordinated with the build.',
    icon: 'mep',
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/** Primary header navigation. */
export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
  },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Resources', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

/** Footer link groups (built partly from services for consistency). */
export const footerServices = services.slice(0, 8).map((s) => ({
  label: s.title,
  href: `/services/${s.slug}`,
}));

export const footerCompany: NavItem[] = [
  { label: 'About Arcfinity', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resources & Guides', href: '/blog' },
  { label: 'Service Areas', href: '/service-areas' },
  { label: 'Contact', href: '/contact' },
];

export const footerLegal: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

/** Project type options — used in the lead form and project taxonomy. */
export const projectTypes = [
  'New Home Construction',
  'Renovation',
  'Interior',
  'Commercial Construction',
  '2D Plan',
  '3D Elevation',
  'Building Permit',
  'Other',
] as const;

export const projectCategories = [
  'Residential',
  'Commercial',
  'Renovation',
  'Interior',
  '3D Design',
] as const;
