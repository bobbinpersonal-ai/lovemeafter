'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/format';
import { PDP_ACCORDIONS } from '@/lib/constants';
import Accordion from '@/components/Accordion';
import SizeGuideDrawer from '@/components/SizeGuideDrawer';

function sizeOf(variant) {
  return variant.selectedOptions?.find((option) => option.name.toLowerCase() === 'size')?.value ?? variant.title;
}

export default function ProductPurchasePanel({ product }) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((v) => v.availableForSale)?.id ?? product.variants[0]?.id ?? null
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const price = Number(selectedVariant?.price?.amount ?? product.price);
  const installment = useMemo(() => (price / 4).toFixed(2), [price]);

  function handleAddToBag() {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  const accordionItems = PDP_ACCORDIONS.map((section) => ({
    id: section.id,
    label: section.label,
    content: accordionContent(section.id, product),
  }));

  return (
    <div className="flex flex-col">
      <h1 className="font-display text-3xl italic">{product.title}</h1>
      <p className="mt-2 text-lg text-gold">{formatPrice(price, product.currencyCode)}</p>
      <p className="mt-1 text-xs uppercase tracking-widest2 text-platinum/50">
        or 4 interest-free payments of {formatPrice(installment, product.currencyCode)}
      </p>

      {product.description && <p className="mt-6 text-sm leading-relaxed text-platinum/70">{product.description}</p>}

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest2 text-platinum/50">
            Size{selectedVariant ? `: ${sizeOf(selectedVariant)}` : ''}
          </p>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="text-[11px] uppercase tracking-widest2 text-platinum/50 underline underline-offset-4 hover:text-gold"
          >
            Find Your Fit
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.variants.map((variant) => (
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

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        disabled={!selectedVariant}
        onClick={handleAddToBag}
        className={`btn-cta mt-8 w-full ${!selectedVariant ? 'cursor-not-allowed opacity-40' : ''}`}
      >
        {justAdded ? 'Added to Bag ✓' : selectedVariant ? 'Add to Bag' : 'Select a Size'}
      </motion.button>

      <div className="mt-10">
        <Accordion items={accordionItems} />
      </div>

      <SizeGuideDrawer
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.collection === 'heels' ? 'heels' : 'dresses'}
      />
    </div>
  );
}

function accordionContent(sectionId, product) {
  switch (sectionId) {
    case 'fit-fabric':
      return 'Cut for a true-to-size fit. Fabric composition and care details are listed on the product tag.';
    case 'the-look':
      return `Style ${product.title.toLowerCase()} with pieces you already reach for -- it's built to be worn beyond the moment it was bought for.`;
    case 'shipping-returns':
      return 'Complimentary overnight shipping on orders over $300. Unworn items may be returned within 14 days.';
    default:
      return null;
  }
}
