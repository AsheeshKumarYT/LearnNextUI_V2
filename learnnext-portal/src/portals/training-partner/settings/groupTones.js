/**
 * Accent tokens for the Settings groups — one entry per `tone` used in SETTINGS_GROUPS (settingsMasters.js).
 * Built only from the theme's semantic colours (src/styles/index.css), so light and dark themes follow automatically:
 *   icon colour → --ln-chart-1 / --ln-info / --ln-success / --ln-warning / --ln-chart-4 / --ln-danger
 *   tints       → the matching *-main colour (or chart colour) at low opacity over the surface
 * Contrast (checked against the composited tile background, light + dark): every icon colour is ≥ 3:1 (WCAG AA for
 * graphics, 1.4.11). Text never uses these colours — labels stay on text / text-secondary / text-muted.
 * Static class names so Tailwind can see them.
 *
 *   icon – icon colour (group list, header, colour dot)
 *   tile – master row icon tile: ~14% tint + full-colour icon (amber/red a touch lower — they read stronger)
 *   head – header icon tile: soft gradient + hairline ring
 *   wash – faint band behind the panel header
 */
export const GROUP_TONES = {
  primary: {
    icon: 'text-chart-1',
    tile: 'bg-chart-1/[0.14] text-chart-1',
    head: 'from-chart-1/20 to-chart-1/5 text-chart-1 ring-chart-1/20',
    wash: 'from-chart-1/[0.07]',
  },
  info: {
    icon: 'text-info',
    tile: 'bg-info-main/[0.14] text-info',
    head: 'from-info-main/20 to-info-main/5 text-info ring-info-main/20',
    wash: 'from-info-main/[0.07]',
  },
  success: {
    icon: 'text-success',
    tile: 'bg-success-main/[0.14] text-success',
    head: 'from-success-main/[0.16] to-success-main/[0.04] text-success ring-success-main/20',
    wash: 'from-success-main/[0.055]',
  },
  warning: {
    icon: 'text-warning',
    tile: 'bg-warning-main/[0.13] text-warning',
    head: 'from-warning-main/[0.13] to-warning-main/[0.03] text-warning ring-warning-main/15',
    wash: 'from-warning-main/[0.04]',
  },
  violet: {
    icon: 'text-chart-4',
    tile: 'bg-chart-4/[0.14] text-chart-4',
    head: 'from-chart-4/20 to-chart-4/5 text-chart-4 ring-chart-4/20',
    wash: 'from-chart-4/[0.06]',
  },
  // A soft rose — for things that need their own colour apart from blue / green / violet / amber (e.g. the Admin role)
  rose: {
    icon: 'text-[#c2416d] dark:text-[#f472a0]',
    tile: 'bg-[#e0527f]/[0.12] text-[#c2416d] dark:text-[#f472a0]',
    head: 'from-[#e0527f]/[0.16] to-[#e0527f]/[0.04] text-[#c2416d] ring-[#e0527f]/20 dark:text-[#f472a0]',
    wash: 'from-[#e0527f]/[0.05]',
  },
  danger: {
    icon: 'text-danger',
    tile: 'bg-danger-main/[0.11] text-danger',
    head: 'from-danger-main/[0.11] to-danger-main/[0.03] text-danger ring-danger-main/[0.12]',
    wash: 'from-danger-main/[0.035]',
  },
};
