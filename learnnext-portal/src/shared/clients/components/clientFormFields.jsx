import { useId, useMemo, useState } from 'react';
import { Building2, ChevronDown, CircleCheck, DatabaseZap, Eye, FileImage, FileText, ImagePlus, Plus, RefreshCw, Trash2, UploadCloud } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatFileSize } from '@/utils/formatNumber';
import { Button, Card, CardHeader, FormField, Input, SearchableSelect } from '@/components/ui';
import { FilePreviewModal } from './FilePreview';

/**
 * One section of the Add client form, in the same style as the rest of the app: a glass card with a soft
 * colour wash and an icon tile header. `tone` = primary | info | success | warning | danger | violet.
 */
export function FormCard({ icon, tone = 'primary', title, description, action, className, children }) {
  return (
    // focus-within:z-20 — the card being typed in sits above the cards below, so its dropdowns aren't hidden
    <Card tint={tone} subtleTint className={cn('focus-within:z-20', className)}>
      <CardHeader icon={icon} iconTone={tone} title={title} description={description} action={action} />
      {children}
    </Card>
  );
}

/** Highlights the typed part of a name */
function Highlight({ text, query }) {
  const i = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="font-semibold text-primary-text">{text.slice(i, i + query.length)}</span>
      {text.slice(i + query.length)}
    </>
  );
}

/**
 * Searchable company name: type to filter `options`; pick one, or keep typing and choose "Add … as a new company".
 * Names in `taken` (already clients) are tagged so duplicates are easy to spot.
 * onPick(name, isNew) fires when an item is chosen; listLabel adds a small heading to the list.
 * Keyboard: ↓/↑ to move, Enter to pick, Esc to close.
 */
export function CompanyCombobox({ value, onChange, onPick, onBlur, options = [], taken = [], listLabel, placeholder = 'Search or type a company name', invalid }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const q = value.trim();
  const takenSet = useMemo(() => new Set(taken.map((n) => n.toLowerCase())), [taken]);

  const matches = useMemo(() => {
    const all = [...new Set([...options, ...taken])].sort((a, b) => a.localeCompare(b));
    return (q ? all.filter((n) => n.toLowerCase().includes(q.toLowerCase())) : all).slice(0, 8);
  }, [options, taken, q]);
  const exact = matches.some((n) => n.toLowerCase() === q.toLowerCase());
  const items = [...matches.map((n) => ({ name: n, isNew: false })), ...(q && !exact ? [{ name: q, isNew: true }] : [])];

  const pick = (it) => {
    onChange(it.name);
    setOpen(false);
    onPick?.(it.name, it.isNew);
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % Math.max(items.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + items.length) % Math.max(items.length, 1));
    } else if (e.key === 'Enter' && open && items[active]) {
      e.preventDefault();
      pick(items[active]);
    } else if (e.key === 'Escape' && open) {
      e.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <Input
        role="combobox"
        aria-expanded={open && items.length > 0}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={open && items[active] ? `${id}-opt-${active}` : undefined}
        autoComplete="off"
        placeholder={placeholder}
        invalid={invalid}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => setOpen(false), 120);
          onBlur?.();
        }}
        onKeyDown={onKeyDown}
        rightSlot={<ChevronDown className="mr-1.5 size-4 text-text-muted" aria-hidden="true" />}
      />
      {open && items.length > 0 && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label="Companies"
          className="absolute inset-x-0 top-full z-20 mt-1.5 max-h-72 animate-fade-in overflow-y-auto rounded-pop border border-border bg-elevated p-1 shadow-pop"
        >
          {listLabel && (
            <li role="presentation" className="flex items-center gap-1.5 px-2.5 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-chart-1">
              <DatabaseZap className="size-3" aria-hidden="true" />
              {listLabel}
            </li>
          )}
          {items.map((it, i) => {
            const isTaken = !it.isNew && takenSet.has(it.name.toLowerCase());
            return (
              <li
                key={`${it.isNew ? 'new-' : ''}${it.name}`}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(it)}
                className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px]', i === active && 'bg-surface-sunken', it.isNew && 'border-t border-border mt-1')}
              >
                {it.isNew ? (
                  <>
                    <Plus className="size-4 shrink-0 text-primary-text" aria-hidden="true" />
                    <span className="min-w-0 truncate text-text">
                      Add <span className="font-semibold">“{it.name}”</span> as a new company
                    </span>
                  </>
                ) : (
                  <>
                    <Building2 className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-text">
                      <Highlight text={it.name} query={q} />
                    </span>
                    {isTaken && <span className="shrink-0 rounded-md bg-warning-soft px-1.5 py-0.5 text-[10px] font-bold text-warning">Already a client</span>}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Text input with a fixed prefix shown inside the box (e.g. "+91") */
export function PrefixInput({ prefix, className, inputClassName, ...props }) {
  return (
    <div className={cn('relative w-full', className)}>
      <span className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center border-r border-border-strong px-3 text-[13px] font-semibold tabular-nums text-text-secondary">
        {prefix}
      </span>
      <Input inputClassName={cn('pl-14 tabular-nums', inputClassName)} {...props} />
    </div>
  );
}

/**
 * Square logo tile + Upload / Remove (data URL, max 2 MB). With a logo, the tile opens it full size (eye overlay on hover).
 * hint replaces the line under the buttons (e.g. a required field's own wording); invalid turns it red.
 */
export function LogoPicker({ value, onChange, onError, label = 'Upload logo', hint = 'Optional · PNG, JPG or SVG, up to 2 MB', invalid }) {
  const id = useId();
  const [preview, setPreview] = useState(false);
  const read = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return onError?.('Please choose an image file.');
    if (file.size > 2 * 1024 * 1024) return onError?.('Logo must be under 2 MB.');
    const r = new FileReader();
    r.onload = () => onChange(r.result);
    r.readAsDataURL(file);
  };
  return (
    <div className="flex items-center gap-4">
      {/* Empty: the tile uploads (soft brand tint, not grey, so it doesn't look disabled). With a logo: it opens the full view. */}
      {value ? (
        <button
          type="button"
          onClick={() => setPreview(true)}
          title="View full size"
          className="group relative inline-flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-strong bg-white focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus"
        >
          <img src={value} alt="Logo" className="size-full object-contain" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
            <Eye className="size-5" />
          </span>
        </button>
      ) : (
        <label
          htmlFor={id}
          title={label}
          className="inline-flex size-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-dashed border-chart-1/45 bg-chart-1/10 text-primary-text transition-colors hover:border-chart-1/70 hover:bg-chart-1/15"
        >
          <ImagePlus className="size-6" aria-hidden="true" />
        </label>
      )}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <Button as="label" htmlFor={id} variant="secondary" size="sm" className="cursor-pointer focus-within:ring-[3px] focus-within:ring-focus">
            {value ? 'Change' : label}
            <input id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => { read(e.target.files?.[0]); e.target.value = ''; }} />
          </Button>
          {value && (
            <Button variant="ghost" size="sm" onClick={() => onChange('')}>
              Remove
            </Button>
          )}
        </div>
        <p className={cn('text-xs', invalid ? 'text-danger' : 'text-text-muted')}>{hint}</p>
      </div>
      <FilePreviewModal file={preview && value ? { name: 'Logo', url: value, type: value.startsWith('data:') ? value.slice(5, value.indexOf(';')) : undefined } : null} onClose={() => setPreview(false)} />
    </div>
  );
}

const DOC_MAX = 5 * 1024 * 1024;
const DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

/**
 * Supporting document upload — a small drop zone (icon, what to upload, accepted files, Browse)
 * that becomes a file row (type tile, the name as a link that opens it, type · size · source badge, Replace / Remove).
 * `label` names the document, e.g. "Govt. ID proof" or "GST certificate".
 */
export function DocUpload({ value, onChange, label = 'supporting document', required, error, onError }) {
  const id = useId();
  const [over, setOver] = useState(false);
  const [localError, setLocalError] = useState('');
  const [preview, setPreview] = useState(false);

  const take = (f) => {
    if (!f) return;
    if (!DOC_TYPES.includes(f.type)) return fail('Use a PDF, JPG or PNG file.');
    if (f.size > DOC_MAX) return fail('File must be under 5 MB.');
    setLocalError('');
    // url: an in-memory link to the file so it can be previewed full size
    onChange({ name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f) });
  };
  const fail = (m) => {
    setLocalError(m);
    onError?.(m);
  };
  const input = (
    <input
      id={id}
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      className="sr-only"
      onChange={(e) => {
        take(e.target.files?.[0]);
        e.target.value = '';
      }}
    />
  );

  if (value) {
    const isPdf = value.type === 'application/pdf' || /\.pdf$/i.test(value.name);
    const Icon = isPdf ? FileText : FileImage;
    return (
      // A calm file row: neutral card, the file's name is the link that opens it (so is the type tile), where it came
      // from as a small soft badge, then Replace / Remove (icons, so it fits half-width fields)
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-border-strong bg-surface px-3 py-2.5 shadow-xs dark:bg-surface-secondary">
        <button
          type="button"
          onClick={() => setPreview(true)}
          tabIndex={-1}
          aria-hidden="true"
          className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-lg', isPdf ? 'bg-danger-soft text-danger' : 'bg-info-soft text-info')}
        >
          <Icon className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setPreview(true)}
            title={`View ${value.name}`}
            className="block max-w-full truncate rounded-sm text-left text-[13px] font-semibold text-text underline-offset-2 hover:text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {value.name}
          </button>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-text-muted">
            <span>{isPdf ? 'PDF' : 'Image'}</span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap tabular-nums">{formatFileSize(value.size)}</span>
            {value.fromCrm ? (
              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-primary-soft px-1.5 py-px text-[11px] font-semibold text-primary-text">
                <DatabaseZap className="size-3" aria-hidden="true" />
                From CRM
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-success-soft px-1.5 py-px text-[11px] font-semibold text-success">
                <CircleCheck className="size-3" aria-hidden="true" />
                Uploaded
              </span>
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <label
            htmlFor={id}
            title="Replace"
            className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-text-muted hover:bg-surface-sunken hover:text-primary-text focus-within:ring-2 focus-within:ring-focus"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            <span className="sr-only">Replace {value.name}</span>
            {input}
          </label>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Remove ${value.name}`}
            title="Remove"
            className="inline-flex size-8 items-center justify-center rounded-md text-text-muted hover:bg-danger-soft hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>        <FilePreviewModal file={preview ? value : null} onClose={() => setPreview(false)} />
      </div>
    );
  }

  const message = localError || error;
  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        take(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        'group mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-3 py-2.5 transition-colors focus-within:ring-[3px] focus-within:ring-focus',
        // At rest: a white drop zone with a firmer dashed edge, so it doesn't fade into the tinted card
        message
          ? 'border-danger/60 bg-danger-soft/30'
          : over
            ? 'border-primary bg-primary-soft/60'
            : 'border-text-muted/45 bg-surface shadow-xs hover:border-primary/60 hover:bg-primary-soft/30 dark:bg-surface-secondary',
      )}
    >
      <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors', message ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary-text')}>
        <UploadCloud className="size-[18px]" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-text">
          Upload {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </span>
        <span className={cn('block text-xs', message ? 'text-danger' : 'text-text-muted')}>{message || 'PDF, JPG or PNG · max 5 MB'}</span>
      </span>
      <span className="shrink-0 rounded-md border border-border-strong bg-surface px-2.5 py-1 text-xs font-semibold text-text-secondary shadow-xs group-hover:text-primary-text">Browse</span>
      {input}
    </label>
  );
}

/**
 * Address block: line 1/2, then Country → State → City (each narrows the next) and pin code.
 * `value` = { line1, line2, country, state, city, pin }; `errors` keyed "<prefix>.<field>".
 */
export function AddressFields({ value, onChange, errors, prefix, geo, onBlur }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const countries = useMemo(() => Object.keys(geo).map((c) => ({ value: c, label: c })), [geo]);
  const states = useMemo(() => Object.keys(geo[value.country] ?? {}).sort().map((s) => ({ value: s, label: s })), [geo, value.country]);
  const cities = useMemo(() => (geo[value.country]?.[value.state] ?? []).map((c) => ({ value: c, label: c })), [geo, value.country, value.state]);
  const err = (k) => errors[`${prefix}.${k}`];
  const blur = (k) => () => onBlur?.(`${prefix}.${k}`);

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
      <FormField label="Address line 1" required error={err('line1')}>
        <Input placeholder="Building, street" value={value.line1} onChange={(e) => set({ line1: e.target.value })} onBlur={blur('line1')} />
      </FormField>
      <FormField label="Address line 2" required error={err('line2')}>
        <Input placeholder="Area, landmark" value={value.line2} onChange={(e) => set({ line2: e.target.value })} onBlur={blur('line2')} />
      </FormField>
      <FormField label="Country" required error={err('country')}>
        <SearchableSelect options={countries} value={value.country} onChange={(country) => set({ country, state: '', city: '' })} placeholder="Choose a country" searchPlaceholder="Search countries…" />
      </FormField>
      <FormField label="State" required error={err('state')}>
        <SearchableSelect
          options={states}
          value={value.state}
          onChange={(state) => set({ state, city: '' })}
          placeholder={value.country ? 'Choose a state' : 'Choose a country first'}
          searchPlaceholder="Search states…"
          disabled={!value.country}
        />
      </FormField>
      <FormField label="City" required error={err('city')}>
        <SearchableSelect
          options={cities}
          value={value.city}
          onChange={(city) => set({ city })}
          placeholder={value.state ? 'Choose a city' : 'Choose a state first'}
          searchPlaceholder="Search cities…"
          disabled={!value.state}
        />
      </FormField>
      <FormField label={value.country === 'India' ? 'Pin code' : 'Postal code'} required error={err('pin')}>
        <Input
          inputMode={value.country === 'India' ? 'numeric' : 'text'}
          maxLength={value.country === 'India' ? 6 : 10}
          placeholder={value.country === 'India' ? '6 digits, e.g. 400001' : 'Postal code'}
          className="tabular-nums"
          value={value.pin}
          onChange={(e) => set({ pin: value.country === 'India' ? e.target.value.replace(/\D/g, '') : e.target.value })}
          onBlur={blur('pin')}
        />
      </FormField>
    </div>
  );
}
