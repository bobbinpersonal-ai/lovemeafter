'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

const DRESS_CHART = [
  { size: 'XS', bust: '31–32"', waist: '24–25"', hips: '34–35"' },
  { size: 'S', bust: '33–34"', waist: '26–27"', hips: '36–37"' },
  { size: 'M', bust: '35–36"', waist: '28–29"', hips: '38–39"' },
  { size: 'L', bust: '37–39"', waist: '30–32"', hips: '40–42"' },
];

const HEEL_CHART = [
  { us: '6', eu: '36' },
  { us: '7', eu: '37' },
  { us: '8', eu: '38' },
  { us: '9', eu: '39' },
  { us: '10', eu: '40' },
];

export default function SizeGuideDrawer({ open, onClose, category = 'dresses' }) {
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
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg border-t border-platinum/10 bg-obsidian px-6 py-6 md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-w-sm md:border-l md:border-t-0"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Find your fit"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg italic">Find Your Fit</h3>
              <button type="button" onClick={onClose} aria-label="Close size guide">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <table className="mt-6 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-platinum/15 text-xs uppercase tracking-widest2 text-platinum/50">
                  {category === 'heels' ? (
                    <>
                      <th className="py-2">US</th>
                      <th className="py-2">EU</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2">Size</th>
                      <th className="py-2">Bust</th>
                      <th className="py-2">Waist</th>
                      <th className="py-2">Hips</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {(category === 'heels' ? HEEL_CHART : DRESS_CHART).map((row) => (
                  <tr key={row.size || row.us} className="border-b border-platinum/5 text-platinum/70">
                    {category === 'heels' ? (
                      <>
                        <td className="py-2">{row.us}</td>
                        <td className="py-2">{row.eu}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-2">{row.size}</td>
                        <td className="py-2">{row.bust}</td>
                        <td className="py-2">{row.waist}</td>
                        <td className="py-2">{row.hips}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-4 text-xs text-platinum/40">
              Between sizes? We recommend sizing up for a relaxed fit, or down for a sculpted one.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
