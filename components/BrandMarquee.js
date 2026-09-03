import { BRAND } from '@/lib/constants';

const REPEAT_COUNT = 8;

export default function BrandMarquee() {
  const items = Array.from({ length: REPEAT_COUNT });

  return (
    <div className="overflow-hidden border-y border-platinum/10 bg-obsidian py-6">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[...items, ...items].map((_, i) => (
          <span key={i} className="font-display text-3xl italic tracking-tight text-platinum/20 md:text-5xl">
            {BRAND.name}
          </span>
        ))}
      </div>
    </div>
  );
}
