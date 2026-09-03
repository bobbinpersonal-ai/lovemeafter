'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, FREE_SHIPPING_THRESHOLD } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, subtotal } = useCart();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-obsidian/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-obsidian border-l border-platinum/10"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-platinum/10 px-6 py-5">
              <h2 className="font-display text-lg">Your Bag ({items.length})</h2>
              <button type="button" onClick={closeDrawer} aria-label="Close bag">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="border-b border-platinum/10 px-6 py-4">
              {unlocked ? (
                <p className="text-xs uppercase tracking-widest2 text-gold">
                  Free express shipping unlocked
                </p>
              ) : (
                <p className="text-xs uppercase tracking-widest2 text-platinum/70">
                  {formatPrice(remaining)} away from free express shipping
                </p>
              )}
              <div className="mt-2 h-[2px] w-full bg-platinum/15">
                <div
                  className="h-full bg-gold transition-all duration-500 ease-luxury"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <p className="pt-10 text-center text-sm text-platinum/60">Your bag is empty.</p>
              ) : (
                <ul className="flex flex-col gap-6">
                  {items.map((item) => (
                    <li key={item.variantId} className="flex gap-4">
                      <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden bg-platinum/5">
                        {item.image && (
                          <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm">{item.title}</p>
                          <p className="text-xs text-platinum/50">{item.variantTitle}</p>
                          <p className="mt-1 text-sm text-gold">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-platinum/20 px-2 py-1">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="text-[11px] uppercase tracking-widest2 text-platinum/50 underline hover:text-gold"
                            onClick={() => removeItem(item.variantId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-platinum/10 px-6 py-6">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="uppercase tracking-widest2 text-platinum/70">Subtotal</span>
                <span className="font-display text-lg">{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                className={`btn-cta w-full ${items.length === 0 ? 'pointer-events-none opacity-40' : ''}`}
              >
                Checkout
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
