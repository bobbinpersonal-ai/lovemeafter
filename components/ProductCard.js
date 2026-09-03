'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import QuickAddDrawer from '@/components/QuickAddDrawer';

export default function ProductCard({ product }) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];

  return (
    <>
      <div className="group flex flex-col">
        <Link href={`/products/${product.handle}`} className="relative block aspect-[4/5] overflow-hidden bg-platinum/5">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className={`object-cover transition-opacity duration-500 ease-luxury ${
                secondaryImage ? 'group-hover:opacity-0' : ''
              }`}
            />
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.altText || product.title}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-500 ease-luxury group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <Link href={`/products/${product.handle}`}>
              <h3 className="font-display text-base italic leading-snug hover:text-gold">{product.title}</h3>
            </Link>
            <p className="mt-1 text-sm text-platinum/60">{formatPrice(product.price, product.currencyCode)}</p>
          </div>
          <button
            type="button"
            onClick={() => setQuickAddOpen(true)}
            className="whitespace-nowrap text-[10px] uppercase tracking-widest2 text-platinum/60 underline underline-offset-4 transition-colors hover:text-gold"
          >
            Quick Add
          </button>
        </div>
      </div>

      <QuickAddDrawer product={product} open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </>
  );
}
