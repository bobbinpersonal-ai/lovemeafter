import Link from 'next/link';
import { SECTION_COPY } from '@/lib/constants';

const TILES = [
  {
    ...SECTION_COPY.dressEdit,
    href: '/collections/dresses',
    cta: 'Shop Dresses',
    image: 'https://cdn.shopify.com/s/files/placeholder/dress-edit.jpg?width=1200',
    span: 'md:col-span-7',
    aspect: 'aspect-[4/5] md:aspect-[3/4]',
  },
  {
    ...SECTION_COPY.heelEdit,
    href: '/collections/heels',
    cta: 'Shop Heels',
    image: 'https://cdn.shopify.com/s/files/placeholder/heel-edit.jpg?width=1200',
    span: 'md:col-span-5',
    aspect: 'aspect-[4/5] md:aspect-square md:mt-16',
  },
];

export default function FeaturedCollectionsGrid() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {TILES.map((tile) => (
          <Link key={tile.href} href={tile.href} className={`group relative block ${tile.span} ${tile.aspect} overflow-hidden bg-platinum/5`}>
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-luxury group-hover:scale-105"
              style={{ backgroundImage: `url('${tile.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <p className="eyebrow">{tile.eyebrow}</p>
              <h3 className="mt-2 font-display text-3xl italic md:text-4xl">{tile.heading}</h3>
              <span className="mt-4 inline-block text-xs uppercase tracking-widest2 text-platinum/80 underline underline-offset-4 group-hover:text-gold">
                {tile.cta}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
