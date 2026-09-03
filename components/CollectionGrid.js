'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { SORT_OPTIONS } from '@/lib/constants';

function sortProducts(products, sortValue) {
  const sorted = [...products];
  switch (sortValue) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'new-arrivals':
      return sorted.sort((a, b) => Number(b.tags.includes('new-arrival')) - Number(a.tags.includes('new-arrival')));
    case 'bestsellers':
    default:
      return sorted.sort((a, b) => Number(b.tags.includes('bestseller')) - Number(a.tags.includes('bestseller')));
  }
}

export default function CollectionGrid({ products, title }) {
  const [sortValue, setSortValue] = useState('bestsellers');
  const sortedProducts = useMemo(() => sortProducts(products, sortValue), [products, sortValue]);

  return (
    <div>
      <div className="sticky top-[73px] z-30 border-b border-platinum/10 bg-obsidian/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="font-display text-2xl italic">{title}</h1>
          <label className="flex items-center gap-2 text-xs uppercase tracking-widest2 text-platinum/60">
            Sort by
            <select
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
              className="border border-platinum/25 bg-obsidian px-2 py-1.5 text-platinum focus:border-gold focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {sortedProducts.length === 0 ? (
          <p className="py-20 text-center text-sm text-platinum/50">No products in this collection yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
