import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl italic">Not Found</h1>
      <p className="mt-3 text-sm text-platinum/60">This page doesn&rsquo;t exist, or the item is no longer available.</p>
      <Link href="/" className="btn-cta-outline mt-6">
        Back to Home
      </Link>
    </main>
  );
}
