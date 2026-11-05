import { Blocks, CalendarClock, Flag, Presentation } from 'lucide-react';
import { IconTile } from '@/components/ui/CardHeader';

// The program phases each get their own icon + soft tone; any other module gets the generic one
const META = {
  pre: { icon: CalendarClock, tone: 'info', hint: 'Before the sessions' },
  during: { icon: Presentation, tone: 'primary', hint: 'While the sessions run' },
  post: { icon: Flag, tone: 'violet', hint: 'After the sessions' },
};
const FALLBACK = { icon: Blocks, tone: 'success', hint: null };

export const moduleMeta = (name) => META[name.trim().toLowerCase()] ?? FALLBACK;

/** A module's icon tile (Pre / During / Post have their own) */
export function ModuleIcon({ name, className = 'size-10' }) {
  const { icon, tone } = moduleMeta(name);
  return <IconTile icon={icon} tone={tone} className={className} />;
}
