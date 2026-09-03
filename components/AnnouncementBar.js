import { ANNOUNCEMENT_BAR_TEXT } from '@/lib/constants';

export default function AnnouncementBar() {
  return (
    <div className="bg-obsidian border-b border-platinum/10 py-2.5 text-center">
      <p className="text-[11px] uppercase tracking-widest2 text-platinum/80">{ANNOUNCEMENT_BAR_TEXT}</p>
    </div>
  );
}
