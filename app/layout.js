import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

// Display serif for luxury headlines
const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

// Clean neo-grotesque sans for UI/body copy
const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'LOVE ME AFTER',
  description: 'Wear it once. Remember it forever.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
