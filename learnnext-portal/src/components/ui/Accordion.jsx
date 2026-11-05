import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * <Accordion items={[{ id, title, content, description }]} type="single" defaultOpen={['a']} />
 * type: single (one open at a time) | multiple
 */
export function Accordion({ items = [], type = 'single', defaultOpen = [], className }) {
  const [open, setOpen] = useState(defaultOpen);
  const base = useId();
  const toggle = (id) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : type === 'single' ? [id] : [...o, id]));

  return (
    <div className={cn('divide-y divide-border rounded-card border border-border bg-surface', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${base}-${item.id}`}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-focus sm:px-5"
              >
                <span>
                  <span className="block text-[13.5px] font-medium text-text">{item.title}</span>
                  {item.description && <span className="mt-0.5 block text-xs text-text-muted">{item.description}</span>}
                </span>
                <ChevronDown className={cn('size-4 shrink-0 text-text-muted transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={`${base}-${item.id}`}
              role="region"
              className={cn('grid transition-[grid-template-rows] duration-200 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 text-[13px] leading-6 text-text-secondary sm:px-5">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
