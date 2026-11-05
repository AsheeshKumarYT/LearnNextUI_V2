/**
 * Shared class strings for every text-like control (Input, Textarea, Select,
 * pickers, comboboxes) so they look identical. Change control styling here.
 */
export const controlBase =
  'w-full min-w-0 rounded-control border bg-control text-sm text-text shadow-xs transition-[border-color,box-shadow] duration-150 ' +
  'placeholder:text-text-muted hover:border-control-border-hover ' +
  'focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-focus ' +
  'disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:text-text-muted disabled:hover:border-control-border';

export const controlBorder = (invalid) =>
  invalid ? 'border-danger hover:border-danger focus:border-danger focus:ring-danger/20' : 'border-control-border';

export const controlHeight = 'h-10 sm:h-9';
