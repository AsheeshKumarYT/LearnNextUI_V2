import { useMemo, useState } from 'react';
import { Popover } from './Popover';
import { OptionList, normalizeOptions } from './OptionList';
import { SelectTrigger } from './SelectTrigger';

/**
 * Single-select combobox with search.
 * <SearchableSelect options={[{ value, label, description, icon }]} value={v} onChange={setV} placeholder="Choose…" clearable />
 */
export function SearchableSelect({
  options: rawOptions = [],
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText,
  clearable,
  disabled,
  icon,
  className,
}) {
  const [open, setOpen] = useState(false);
  const options = useMemo(() => normalizeOptions(rawOptions), [rawOptions]);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      matchWidth
      role="listbox"
      className="p-0"
      triggerClassName={className ?? 'w-full'}
      trigger={
        <SelectTrigger
          icon={icon}
          placeholder={placeholder}
          disabled={disabled}
          onClear={clearable ? () => onChange?.('') : undefined}
        >
          {selected && <span className="truncate">{selected.label}</span>}
        </SelectTrigger>
      }
    >
      <OptionList
        options={options}
        isSelected={(v) => v === value}
        onSelect={(o) => {
          onChange?.(o.value);
          setOpen(false);
        }}
        searchPlaceholder={searchPlaceholder}
        emptyText={emptyText}
        autoScrollToSelected
      />
    </Popover>
  );
}
