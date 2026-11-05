import { Columns3 } from 'lucide-react';
import { Popover } from './Popover';
import { Button } from './Button';
import { Checkbox } from './Checkbox';

/**
 * Toggle which DataTable columns are shown.
 * const [hidden, setHidden] = useState([]);
 * <ColumnVisibility columns={columns} hidden={hidden} onChange={setHidden} />
 * <DataTable columns={columns} hiddenColumns={hidden} … />
 * Columns opt out with `hideable: false`.
 */
export function ColumnVisibility({ columns, hidden = [], onChange, label = 'Columns' }) {
  const hideable = columns.filter((c) => c.hideable !== false && c.header);
  return (
    <Popover
      placement="bottom-end"
      className="w-56 p-1.5"
      trigger={
        <Button variant="secondary" leftIcon={Columns3} aria-label="Choose visible columns">
          <span className="hidden sm:inline">{label}</span>
        </Button>
      }
    >
      <p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">Visible columns</p>
      {hideable.map((c) => (
        <div key={c.key} className="rounded-md px-2 py-1.5 hover:bg-surface-sunken">
          <Checkbox
            label={c.header}
            checked={!hidden.includes(c.key)}
            onChange={(e) => onChange(e.target.checked ? hidden.filter((k) => k !== c.key) : [...hidden, c.key])}
            className="w-full"
          />
        </div>
      ))}
      {hidden.length > 0 && (
        <button type="button" onClick={() => onChange([])} className="mt-1 w-full rounded-md px-2 py-1.5 text-left text-[13px] font-medium text-primary-text hover:bg-surface-sunken">
          Show all
        </button>
      )}
    </Popover>
  );
}
