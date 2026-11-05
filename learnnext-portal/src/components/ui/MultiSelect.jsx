import { useMemo } from 'react';
import { X } from 'lucide-react';
import { Popover } from './Popover';
import { OptionList, normalizeOptions } from './OptionList';
import { SelectTrigger } from './SelectTrigger';

/**
 * Multi-select with search and removable chips.
 * <MultiSelect options={opts} value={['a','b']} onChange={setValues} maxChips={2} />
 */
export function MultiSelect({
  options: rawOptions = [],
  value = [],
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  maxChips = 2,
  disabled,
  className,
}) {
  const options = useMemo(() => normalizeOptions(rawOptions), [rawOptions]);
  const selected = options.filter((o) => value.includes(o.value));
  const toggle = (v) => onChange?.(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <Popover
      matchWidth
      role="listbox"
      className="p-0"
      triggerClassName={className ?? 'w-full'}
      trigger={
        <SelectTrigger placeholder={placeholder} disabled={disabled} onClear={() => onChange?.([])}>
          {selected.length
            ? [
                ...selected.slice(0, maxChips).map((o) => (
                  <span
                    key={o.value}
                    className="inline-flex h-6 max-w-[10rem] items-center gap-1 rounded-md bg-surface-sunken pl-2 pr-1 text-xs font-medium text-text"
                  >
                    <span className="truncate">{o.label}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label={`Remove ${o.label}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(o.value);
                      }}
                      className="inline-flex size-4 items-center justify-center rounded text-text-muted hover:bg-border hover:text-text"
                    >
                      <X className="size-3" />
                    </span>
                  </span>
                )),
                selected.length > maxChips && (
                  <span key="more" className="text-xs font-medium text-text-muted">
                    +{selected.length - maxChips}
                  </span>
                ),
              ]
            : null}
        </SelectTrigger>
      }
    >
      <OptionList
        multiple
        options={options}
        isSelected={(v) => value.includes(v)}
        onSelect={(o) => toggle(o.value)}
        searchPlaceholder={searchPlaceholder}
        footer={
          <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-text-muted">
            <span>{value.length} selected</span>
            <button type="button" className="font-medium text-primary-text hover:underline" onClick={() => onChange?.([])}>
              Clear
            </button>
          </div>
        }
      />
    </Popover>
  );
}
