import { cn } from '@/utils/cn';

const widths = { narrow: 'max-w-4xl', default: 'max-w-[1440px]', wide: 'max-w-[1600px]', full: 'max-w-none' };

/**
 * Horizontal page gutter + max width. AdminLayout wraps every page in one;
 * use `size="narrow"` inside a page for form-heavy content (profile, settings).
 */
export function ContentContainer({ size = 'default', className, children }) {
  return <div className={cn('mx-auto w-full px-3 sm:px-6', widths[size], className)}>{children}</div>;
}
