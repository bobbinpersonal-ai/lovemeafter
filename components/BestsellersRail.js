import ProductCard from '@/components/ProductCard';
import { SECTION_COPY } from '@/lib/constants';

export default function BestsellersRail({ products }) {
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
      <h2 className="text-center font-display text-3xl italic md:text-4xl">{SECTION_COPY.bestsellers.heading}</h2>
      <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
