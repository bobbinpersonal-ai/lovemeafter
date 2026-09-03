import { HERO_COPY } from '@/lib/constants';
import { isUsingMockData } from '@/lib/shopify';

/**
 * Placeholder landing page confirming the architecture/design-system
 * foundation renders correctly. The real editorial homepage (hero video,
 * asymmetrical featured-collections grid, marquee, men's teaser) is the
 * next build step -- see project notes.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      {mockDataNotice()}
      <p className="eyebrow">Love Me After</p>
      <h1 className="max-w-3xl font-display text-5xl italic leading-tight md:text-7xl">
        {HERO_COPY.tagline}
      </h1>
      <p className="max-w-xl text-sm text-platinum/70 md:text-base">{HERO_COPY.subheadline}</p>
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <a href="/collections/dresses" className="btn-cta">
          {HERO_COPY.shopDressesCta}
        </a>
        <a href="/collections/heels" className="btn-cta-outline">
          {HERO_COPY.shopHeelsCta}
        </a>
      </div>
    </main>
  );
}

function mockDataNotice() {
  if (!isUsingMockData()) return null;
  return (
    <p className="text-[11px] uppercase tracking-widest2 text-platinum/40">
      Previewing mock catalog — set SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_ACCESS_TOKEN for live data
    </p>
  );
}
