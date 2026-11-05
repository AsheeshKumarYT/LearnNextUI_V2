import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with Tailwind conflict resolution.
 * Every component accepts `className` and passes it through cn() last,
 * so callers can override styles: <Button className="w-full" />.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
