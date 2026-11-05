export function formatNumber(value, options = {}, locale = 'en-US') {
  if (value == null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat(locale, options).format(value);
}

/** 12.4K, 1.2M */
export function formatCompact(value) {
  return formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 });
}

export function formatCurrency(value, currency = 'USD') {
  // Rupees use Indian digit grouping (₹1,80,000)
  return formatNumber(value, { style: 'currency', currency, maximumFractionDigits: 0 }, currency === 'INR' ? 'en-IN' : 'en-US');
}

/** 1250000 -> "₹12.5L" (Indian lakhs) */
export function formatLakhs(value) {
  return `₹${formatNumber(value / 1e5, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}L`;
}

/** Compact rupees in Indian units: 16680766 -> "₹1.67 Cr", 6292000 -> "₹62.9 L", 83500 -> "₹83,500" */
export function formatRupeesCompact(value) {
  if (value == null || Number.isNaN(value)) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e7) return `₹${formatNumber(value / 1e7, { maximumFractionDigits: 2 })} Cr`;
  if (abs >= 1e5) return `₹${formatNumber(value / 1e5, { maximumFractionDigits: 1 })} L`;
  return formatCurrency(value, 'INR');
}

/** 0.124 -> "12.4%"; pass raw=true when value is already a percentage */
export function formatPercent(value, { raw = false, digits = 1 } = {}) {
  const v = raw ? value / 100 : value;
  return formatNumber(v, { style: 'percent', maximumFractionDigits: digits });
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${units[i]}`;
}
