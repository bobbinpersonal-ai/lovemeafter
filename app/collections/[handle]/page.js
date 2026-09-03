import { notFound } from 'next/navigation';
import CollectionGrid from '@/components/CollectionGrid';
import { COLLECTIONS, getProductsByCollection } from '@/lib/shopify';

// Only expose routes for collections with live inventory. COLLECTIONS.MENS
// stays defined in lib/shopify.js as the categorization hook, but the route
// itself 404s until there's real product data to show -- the "His Turn Is
// Coming" section links to the waitlist, not to an empty collection page.
const VALID_HANDLES = [COLLECTIONS.DRESSES, COLLECTIONS.HEELS];

const TITLES = {
  [COLLECTIONS.DRESSES]: 'Dresses',
  [COLLECTIONS.HEELS]: 'Heels',
  [COLLECTIONS.MENS]: 'Men',
};

export function generateStaticParams() {
  // Only pre-render collections with live inventory hooks; "mens" stays
  // dynamic until real product data exists for it.
  return [{ handle: COLLECTIONS.DRESSES }, { handle: COLLECTIONS.HEELS }];
}

export default async function CollectionPage({ params }) {
  const { handle } = params;

  if (!VALID_HANDLES.includes(handle)) {
    notFound();
  }

  const products = await getProductsByCollection(handle);

  return <CollectionGrid products={products} title={TITLES[handle] ?? handle} />;
}
