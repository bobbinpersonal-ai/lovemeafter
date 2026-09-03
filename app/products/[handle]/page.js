import { notFound } from 'next/navigation';
import ProductGallery from '@/components/ProductGallery';
import ProductPurchasePanel from '@/components/ProductPurchasePanel';
import { getProductByHandle } from '@/lib/shopify';

export default async function ProductPage({ params }) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />
        <ProductPurchasePanel product={product} />
      </div>
    </main>
  );
}
