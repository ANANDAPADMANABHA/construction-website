/**
 * Client testimonials.
 *
 * ⚠️  ONLY add GENUINE testimonials from real clients (with their consent).
 *     Never fabricate reviews, names or ratings — it is dishonest and it
 *     violates Google's review guidelines.
 *
 * While this array is empty, the site shows a genuine "Our commitments"
 * section instead of an empty testimonials block. Add real quotes here and the
 * testimonials section will appear automatically.
 */
export interface TestimonialItem {
  quote: string;
  name: string;
  detail?: string; // e.g. "Homeowner, Neyyattinkara"
}

export const testimonials: TestimonialItem[] = [
  // Example shape (delete this comment and add real entries):
  // {
  //   quote: 'Arcfinity kept the costing transparent from day one and handed over on time.',
  //   name: 'Client Name',
  //   detail: 'Homeowner, Thiruvananthapuram',
  // },
];

/** Genuine commitments shown when no real testimonials exist yet. */
export const commitments = [
  {
    icon: 'handshake',
    title: 'One accountable team',
    text: 'Design, structure and finishing under a single contract — no blame-shifting between vendors.',
  },
  {
    icon: 'layers',
    title: 'Transparent, stage-wise costing',
    text: 'An itemised cost sheet and a written agreement, so you know what each stage costs before it starts.',
  },
  {
    icon: 'shield',
    title: 'Engineering supervision',
    text: 'Qualified supervision at the stages that decide how a building performs for decades.',
  },
  {
    icon: 'clock',
    title: 'On-time, documented handover',
    text: 'A realistic schedule, honest updates when things change, and a clean, documented handover.',
  },
];
