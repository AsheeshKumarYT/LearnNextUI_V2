import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Input } from './Input';

/**
 * Toolbar above a DataTable: search on the left, filters/actions on the right.
 * Wraps cleanly on mobile.
 *
 * <TableToolbar search={q} onSearchChange={setQ} searchPlaceholder="Search courses…"
 *   filters={<SegmentedControl …/>} actions={<><ColumnVisibility …/><Button …/></>} />
 */
export function TableToolbar({ search, onSearchChange, searchPlaceholder = 'Search…', filters, actions, className, children }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      <div className="flex min-w-0 flex-[1_1_320px] flex-wrap items-center gap-3">
        {onSearchChange && (
          <Input
            type="search"
            leftIcon={Search}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="min-w-0 flex-[1_1_220px] sm:max-w-xs"
          />
        )}
        {filters && <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2">{filters}</div>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
