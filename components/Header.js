'use client';

import Link from 'next/link';
import { Search, User, ShoppingBag } from 'lucide-react';
import { NAV_LINKS, BRAND } from '@/lib/constants';
import { useCart } from '@/lib/cart-context';

export default function Header() {
  const { itemCount, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-platinum/10 bg-obsidian/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 py-5">
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-widest2 text-platinum/80 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="justify-self-center font-display text-xl tracking-wide text-platinum"
          aria-label={`${BRAND.name} home`}
        >
          {BRAND.name}
        </Link>

        <div className="flex items-center justify-end gap-5">
          <button type="button" aria-label="Search" className="text-platinum/80 transition-colors hover:text-gold">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <Link href="/account" aria-label="Account" className="text-platinum/80 transition-colors hover:text-gold">
            <User size={18} strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            aria-label={`Bag, ${itemCount} items`}
            onClick={openDrawer}
            className="flex items-center gap-1.5 text-platinum/80 transition-colors hover:text-gold"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="text-xs">({itemCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
