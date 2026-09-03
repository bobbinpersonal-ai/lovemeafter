import Link from 'next/link';
import { BRAND } from '@/lib/constants';

const FOOTER_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'Dresses', href: '/collections/dresses' },
      { label: 'Heels', href: '/collections/heels' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Shipping & Returns', href: '/pages/shipping-returns' },
      { label: 'Size Guide', href: '/pages/size-guide' },
      { label: 'Contact', href: '/pages/contact' },
    ],
  },
  {
    heading: 'Follow',
    links: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'TikTok', href: 'https://tiktok.com' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-platinum/10 bg-obsidian">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-xl">{BRAND.name}</p>
          <p className="mt-3 max-w-[220px] text-xs text-platinum/50">Wear it once. Remember it forever.</p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <div key={column.heading}>
            <p className="text-xs uppercase tracking-widest2 text-platinum/50">{column.heading}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-platinum/80 hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-platinum/10 px-6 py-6 text-center text-[11px] uppercase tracking-widest2 text-platinum/40">
        © {new Date().getFullYear()} {BRAND.name}
      </div>
    </footer>
  );
}
