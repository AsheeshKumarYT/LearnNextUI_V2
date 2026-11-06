import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { Popover } from './Popover';
import { Calendar } from './Calendar';
import { SelectTrigger } from './SelectTrigger';
import { Button } from './Button';

/**
 * <DatePicker value={date} onChange={setDate} placeholder="Pick a date" minDate={new Date()} />
 * value / onChange use Date objects (or null).
 * pickMonthYear: month + year dropdowns in the calendar header (far-off dates, e.g. date of birth).
 * "Today" shows only when today is allowed by minDate / maxDate.
 */
export function DatePicker({ value, onChange, placeholder = 'Pick a date', minDate, maxDate, pickMonthYear, clearable = true, disabled, className }) {
  const [open, setOpen] = useState(false);
  const now = new Date();
  const todayAllowed = !(minDate && now < minDate) && !(maxDate && now > maxDate);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      triggerClassName={className ?? 'w-full'}
      trigger={
        <SelectTrigger icon={CalendarDays} placeholder={placeholder} disabled={disabled} onClear={clearable ? () => onChange?.(null) : undefined}>
          {value ? formatDate(value) : null}
        </SelectTrigger>
      }
    >
      <Calendar
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        pickMonthYear={pickMonthYear}
        onSelect={(d) => {
          onChange?.(d);
          setOpen(false);
        }}
      />
      <div className={todayAllowed ? 'flex justify-between border-t border-border px-3 py-2' : 'flex justify-end border-t border-border px-3 py-2'}>
        {todayAllowed && (
          <Button variant="ghost" size="xs" onClick={() => { onChange?.(new Date()); setOpen(false); }}>
            Today
          </Button>
        )}
        <Button variant="ghost" size="xs" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    </Popover>
  );
}
