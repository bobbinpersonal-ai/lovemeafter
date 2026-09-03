'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function Accordion({ items }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <div className="border-t border-platinum/10">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="border-b border-platinum/10">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between py-4 text-left text-sm uppercase tracking-widest2 text-platinum/80 hover:text-gold"
            >
              {item.label}
              {isOpen ? <Minus size={14} /> : <Plus size={14} />}
            </button>
            {isOpen && <div className="pb-4 text-sm leading-relaxed text-platinum/60">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
