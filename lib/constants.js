/**
 * Centralized brand copy for LOVE ME AFTER. Keeping this in one place means
 * the homepage, nav, and future pages all quote the approved copy
 * consistently instead of re-typing it per component.
 */

export const BRAND = {
  name: 'LOVE ME AFTER',
  domain: 'lovemeafter.com',
};

export const ANNOUNCEMENT_BAR_TEXT = 'COMPLIMENTARY OVERNIGHT SHIPPING ON ORDERS OVER $300';

export const HERO_COPY = {
  tagline: 'Wear it once. Remember it forever.',
  subheadline: 'Architectural silhouettes and high-voltage heels designed for the bold.',
  primaryCta: 'EXPLORE THE COLLECTION',
  shopDressesCta: 'Shop Dresses',
  shopHeelsCta: 'Shop Heels',
};

export const SECTION_COPY = {
  dressEdit: {
    eyebrow: 'The Dress Edit',
    heading: 'The Aftermath',
  },
  heelEdit: {
    eyebrow: 'Heels That Speak First',
    heading: 'Designed to be Removed',
  },
  bestsellers: {
    heading: 'Too Good to Keep Quiet',
  },
};

export const MENS_TEASER = {
  enabled: true, // Flip to false to hide the teaser entirely once not needed.
  eyebrow: "HIS TURN IS COMING",
  heading: 'Love Me After Men',
  subheading: 'Fall 2026',
  waitlistPlaceholder: 'Your email',
  waitlistCta: 'NOTIFY ME',
};

export const NAV_LINKS = [
  { label: 'Dresses', href: '/collections/dresses' },
  { label: 'Heels', href: '/collections/heels' },
  { label: 'Tease Men', href: '#mens-teaser' },
];

export const SORT_OPTIONS = [
  { label: 'Bestsellers', value: 'bestsellers' },
  { label: 'New Arrivals', value: 'new-arrivals' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

export const PDP_ACCORDIONS = [
  { id: 'fit-fabric', label: 'Fit & Fabric' },
  { id: 'the-look', label: 'The Look (Styling Notes)' },
  { id: 'shipping-returns', label: 'Shipping & Returns' },
];
