import { MoreHorizontal } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { IconButton } from './IconButton';

/**
 * Row "⋯" menu. Items use the Dropdown item shape.
 * <TableActions label={`Actions for ${row.title}`} items={[{ label: 'Edit', icon: Pencil, onSelect }]} />
 */
export function TableActions({ items, label = 'Row actions' }) {
  return (
    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <Dropdown items={items} trigger={<IconButton icon={MoreHorizontal} label={label} size="sm" tooltip={false} />} />
    </div>
  );
}
