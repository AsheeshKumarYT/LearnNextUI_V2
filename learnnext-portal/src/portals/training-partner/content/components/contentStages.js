import { CalendarCheck, FileText, Flag, Layers, Link2, PlayCircle, Sunrise } from 'lucide-react';
import { useMemo } from 'react';
import { useAsync } from '@/hooks/useAsync';
import { programsApi } from '@/services/api';

/**
 * A program's content buckets ("stages") are the program's own modules, in order (Pre / During / Post for most). Each gets a soft
 * colour (static class names for Tailwind; amber is avoided; lanes are a flat tint in their arrow's hue, a step lighter
 * than the arrow — it reads loud). `lane` = the lane's faint wash, `dot` = the numbered stage dot, `tile` = icon tile,
 * `ring` = the dot's halo, `edge` = the lane's "+ Add" button border, `chipDark` = the selected phone module chip in dark mode
 * (its light tint barely showed on the dark page). The three original phases keep their own icon, hint and colour (BUILT_IN); any other module
 * takes the next of the EXTRA looks in turn.
 */
const BUILT_IN = [
  {
    key: 'pre',
    label: 'Pre-program',
    hint: 'Before the program starts',
    icon: Sunrise,
    lane: 'bg-chart-2/[0.07] border-chart-2/20',
    arrow: 'bg-chart-2/[0.11] text-info',
    dot: 'bg-chart-2 text-primary-fg',
    ring: 'ring-chart-2/20',
    tile: 'bg-chart-2/12 text-info',
    slot: 'bg-chart-2/[0.18] text-info',
    outline: 'stroke-chart-2/55',
    edge: 'border-chart-2/60',
    chipDark: 'dark:bg-chart-2/[0.24] dark:ring-chart-2/60',
  },
  {
    key: 'during',
    label: 'During',
    hint: 'Used in the sessions',
    icon: CalendarCheck,
    lane: 'bg-chart-1/[0.065] border-chart-1/15',
    arrow: 'bg-chart-1/[0.10] text-chart-1',
    dot: 'bg-chart-1 text-primary-fg',
    ring: 'ring-chart-1/20',
    tile: 'bg-chart-1/10 text-chart-1',
    slot: 'bg-chart-1/[0.15] text-chart-1',
    outline: 'stroke-chart-1/45',
    edge: 'border-chart-1/50',
    chipDark: 'dark:bg-chart-1/[0.26] dark:ring-chart-1/60',
  },
  {
    key: 'post',
    label: 'Post-program',
    hint: 'After the program, to keep it going',
    icon: Flag,
    lane: 'bg-success-main/[0.065] border-success-main/20',
    arrow: 'bg-success-main/[0.10] text-success',
    dot: 'bg-success-main text-primary-fg',
    ring: 'ring-success-main/20',
    tile: 'bg-success-main/12 text-success',
    slot: 'bg-success-main/[0.17] text-success',
    outline: 'stroke-success-main/50',
    edge: 'border-success-main/55',
    chipDark: 'dark:bg-success-main/[0.22] dark:ring-success-main/55',
  },
];
const BUILT_IN_BY_KEY = Object.fromEntries(BUILT_IN.map((s) => [s.key, s]));

// Looks for the modules added in Settings: violet, rose, then a quiet slate — taken in turn
const EXTRA = [
  {
    lane: 'bg-chart-4/[0.05] border-chart-4/15',
    arrow: 'bg-chart-4/[0.09] text-chart-4',
    dot: 'bg-chart-4 text-primary-fg',
    ring: 'ring-chart-4/20',
    tile: 'bg-chart-4/10 text-chart-4',
    slot: 'bg-chart-4/[0.13] text-chart-4',
    outline: 'stroke-chart-4/45',
    edge: 'border-chart-4/50',
    chipDark: 'dark:bg-chart-4/[0.24] dark:ring-chart-4/60',
  },
  {
    lane: 'bg-[#e0527f]/[0.05] border-[#e0527f]/15',
    arrow: 'bg-[#e0527f]/[0.09] text-[#c2416d] dark:text-[#f472a0]',
    dot: 'bg-[#e0527f] text-primary-fg',
    ring: 'ring-[#e0527f]/20',
    tile: 'bg-[#e0527f]/10 text-[#c2416d] dark:text-[#f472a0]',
    slot: 'bg-[#e0527f]/[0.13] text-[#c2416d] dark:text-[#f472a0]',
    outline: 'stroke-[#e0527f]/45',
    edge: 'border-[#e0527f]/50',
    chipDark: 'dark:bg-[#e0527f]/[0.22] dark:ring-[#e0527f]/55',
  },
  {
    lane: 'bg-text-muted/[0.05] border-text-muted/15',
    arrow: 'bg-text-muted/[0.09] text-text-secondary',
    dot: 'bg-text-secondary text-primary-fg',
    ring: 'ring-text-muted/20',
    tile: 'bg-text-muted/10 text-text-secondary',
    slot: 'bg-text-muted/[0.13] text-text-secondary',
    outline: 'stroke-text-muted/45',
    edge: 'border-text-muted/50',
    chipDark: 'dark:bg-text-muted/[0.22] dark:ring-text-muted/55',
  },
];

/** Board stages for a program's modules ([{ key, name, hint }]), each with its look */
export function toStages(modules = []) {
  let extra = 0;
  return modules.map((m) => {
    const own = BUILT_IN_BY_KEY[m.key];
    if (own) return { ...own, label: m.name ?? own.label };
    return { ...EXTRA[extra++ % EXTRA.length], key: m.key, label: m.name, hint: m.hint || 'Its own part of the program', icon: Layers };
  });
}

/** The stage with this key (a quiet stand-in if its module has since been disabled or removed) */
export const stageIn = (stages, key) => stages?.find((s) => s.key === key) ?? { ...EXTRA[2], key, label: 'Module', hint: '', icon: Layers };

/** A program's stages — { stages, byKey, loading, error } — its own modules (Pre / During / Post unless it has more) */
export function useContentStages(programId) {
  const { data, loading, error, reload } = useAsync(() => programsApi.stages(programId), [programId]);
  const stages = useMemo(() => (data ? toStages(data) : null), [data]);
  const byKey = useMemo(() => Object.fromEntries((stages ?? []).map((s) => [s.key, s])), [stages]);
  return { stages, byKey, loading, error, reload };
}

/** What an element's files can be — label, icon and a soft tile tone */
export const FILE_KINDS = {
  document: { label: 'Document', plural: 'Documents', icon: FileText, tile: 'bg-chart-4/10 text-chart-4', text: 'text-chart-4', head: 'bg-chart-4/[0.06]' },
  video: { label: 'Video', plural: 'Videos', icon: PlayCircle, tile: 'bg-danger-main/10 text-danger', text: 'text-danger', head: 'bg-danger-main/[0.045]' },
  url: { label: 'Link', plural: 'Links', icon: Link2, tile: 'bg-chart-2/12 text-info', text: 'text-info', head: 'bg-chart-2/[0.07]' },
};
export const KIND_ORDER = ['document', 'video', 'url'];

/** "3 elements · 7 files" */
export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * A readable starting name for an added item — what participants see; the user can type over it:
 * "Check-in_guide v2.pdf" → "Check-in guide v2"; slug-style names (no spaces) lose their hyphens too
 * ("manager-conversation-v2.docx" → "Manager conversation v2"); a link → its last path part ("…/checkin-form" →
 * "Checkin form") or its site.
 */
export function smartTitle(item) {
  const tidy = (s) => {
    const words = /\s/.test(s.replace(/_/g, '')) ? s.replace(/_+/g, ' ') : s.replace(/[_-]+/g, ' ');
    const t = words.replace(/\s+/g, ' ').trim();
    return t ? t[0].toUpperCase() + t.slice(1) : '';
  };
  if (item.kind === 'url' || item.source === 'link') {
    const host = videoHost(item.url);
    if (host) return `${host} video`;
    try {
      const u = new URL(item.url);
      const last = decodeURIComponent(u.pathname.split('/').filter(Boolean).pop() ?? '');
      return tidy(last.replace(/[-]+/g, ' ')) || u.hostname.replace(/^www\./, '');
    } catch {
      return item.name;
    }
  }
  return tidy(item.name.replace(/\.[^.]+$/, '')) || item.name;
}

/** "YouTube" / "Vimeo" for a link to a video on those sites, else null */
export function videoHost(url = '') {
  if (/(^|\.)(youtube\.com|youtu\.be)$/i.test(hostOf(url))) return 'YouTube';
  if (/(^|\.)vimeo\.com$/i.test(hostOf(url))) return 'Vimeo';
  return null;
}

function hostOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}