import { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { Popover } from './Popover';
import { OptionList } from './OptionList';
import { SelectTrigger } from './SelectTrigger';

const fmt = (h, m) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

/**
 * <TimePicker value="09:30" onChange={setTime} step={15} min="08:00" max="20:00" />
 * Values are 24h "HH:mm" strings.
 */
export function TimePicker({ value, onChange, step = 30, min = '00:00', max = '23:59', placeholder = 'Select time', disabled, className }) {
  const [open, setOpen] = useState(false);
  const options = useMemo(() => {
    const toMin = (s) => {
      const [h, m] = s.split(':').map(Number);
      return h * 60 + m;
    };
    const out = [];
    for (let t = toMin(min); t <= toMin(max); t += step) {
      const h = Math.floor(t / 60);
      const m = t % 60;
      out.push({ value: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, label: fmt(h, m) });
    }
    return out;
  }, [step, min, max]);

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
        <SelectTrigger icon={Clock} placeholder={placeholder} disabled={disabled}>
          {selected ? selected.label : null}
        </SelectTrigger>
      }
    >
      <OptionList
        options={options}
        searchable={false}
        isSelected={(v) => v === value}
        onSelect={(o) => {
          onChange?.(o.value);
          setOpen(false);
        }}
        autoScrollToSelected
      />
    </Popover>
  );
}
