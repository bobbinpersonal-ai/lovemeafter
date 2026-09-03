/**
 * Placeholder account route. A real integration wires this to Shopify's
 * customer accounts (classic or new customer account flow), not a custom
 * auth system.
 */
export default function AccountPage() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl italic">Account</h1>
      <p className="mt-3 text-sm text-platinum/60">
        Sign-in will connect to Shopify customer accounts once a live store is wired up.
      </p>
    </main>
  );
}
