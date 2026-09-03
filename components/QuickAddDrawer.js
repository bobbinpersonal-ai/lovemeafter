'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';

/** Reads the "Size" selected option off a variant, if present. */
function sizeOf(variant) {
  return variant.selectedOptions?.find((option) => option.name.toLowerCase() === 'size')?.value ?? variant.title;
}

export default function QuickAddDrawer({ product, open, onClose }) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(null);

  const variants = product.variants || [];
  const selectedVariant = variants.find((variant) => variant.id === selectedVariantId);

  function handleAdd() {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, 1);
    setSelectedVariantId(null);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-obsidian/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-xl border-t border-platinum/10 bg-obsidian px-6 py-6"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={`Quick add ${product.title}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg italic">{product.title}</h3>
                <p className="mt-1 text-sm text-gold">
                  {formatPrice(selectedVariant?.price?.amount ?? product.price, product.currencyCode)}
                </p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close quick add">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-widest2 text-platinum/50">Select Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={!variant.availableForSale}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`min-w-[3rem] border px-3 py-2 text-xs uppercase transition-colors ${
                      selectedVariantId === variant.id
                        ? 'border-gold bg-gold text-obsidian'
                        : 'border-platinum/25 text-platinum/80 hover:border-gold hover:text-gold'
                    } ${!variant.availableForSale ? 'cursor-not-allowed opacity-30 line-through' : ''}`}
                  >
                    {sizeOf(variant)}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={!selectedVariant}
              onClick={handleAdd}
              className={`btn-cta mt-6 w-full ${!selectedVariant ? 'cursor-not-allowed opacity-40' : ''}`}
            >
              {selectedVariant ? 'Add to Bag' : 'Select a Size'}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
