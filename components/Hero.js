'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HERO_COPY } from '@/lib/constants';

export default function Hero() {
  return (
    <section className="relative flex h-[calc(100vh-108px)] min-h-[560px] items-end overflow-hidden bg-obsidian">
      {/* Editorial hero image -- swap for a hero video by replacing this img with a <video autoPlay muted loop playsInline> */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{
          backgroundImage:
            "url('https://cdn.shopify.com/s/files/placeholder/hero-editorial.jpg?width=2000')",
        }}
        role="img"
        aria-label="Editorial campaign image"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-6 pb-20 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-5xl italic leading-[1.05] md:text-7xl">{HERO_COPY.tagline}</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-platinum/70 md:text-base">{HERO_COPY.subheadline}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/collections/dresses" className="btn-cta">
            {HERO_COPY.shopDressesCta}
          </Link>
          <Link href="/collections/heels" className="btn-cta-outline">
            {HERO_COPY.shopHeelsCta}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
