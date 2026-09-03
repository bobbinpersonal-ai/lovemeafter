/**
 * Placeholder checkout route. A real integration hands off to Shopify's
 * hosted checkout (via a Cart API `checkoutUrl`) rather than building a
 * custom checkout page here -- do not build a custom payment form.
 */
export default function CheckoutPage() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl italic">Checkout</h1>
      <p className="mt-3 text-sm text-platinum/60">
        This build is running on mock product data, so there&rsquo;s no live cart to check out with yet. Once
        connected to a real Shopify store, this route redirects to Shopify&rsquo;s hosted checkout via the Cart
        API&rsquo;s{' '}
        <code className="text-platinum/80">checkoutUrl</code>.
      </p>
    </main>
  );
}
