import Hero from '@/components/Hero';
import FeaturedCollectionsGrid from '@/components/FeaturedCollectionsGrid';
import BrandMarquee from '@/components/BrandMarquee';
import BestsellersRail from '@/components/BestsellersRail';
import MensTeaser from '@/components/MensTeaser';
import { getAllProducts } from '@/lib/shopify';

export default async function HomePage() {
  const products = await getAllProducts();
  const bestsellers = products.filter((product) => product.tags.includes('bestseller'));

  return (
    <main>
      <Hero />
      <FeaturedCollectionsGrid />
      <BrandMarquee />
      <BestsellersRail products={bestsellers.length ? bestsellers : products.slice(0, 4)} />
      <MensTeaser />
    </main>
  );
}
