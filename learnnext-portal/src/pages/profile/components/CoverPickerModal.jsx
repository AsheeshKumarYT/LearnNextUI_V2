import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Image, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, Button, Modal, SegmentedControl } from '@/components/ui';
import { ALL_COVERS, CoverScene, DEFAULT_COVER, coverById } from './coverScenes';

// Scenes render at a fixed "hero-like" size and are scaled to fit, so every preview looks identical to the real cover
const BASE_W = 1000;
const BASE_H = 240;

/**
 * Live, scaled cover scene (also used by the UI Preview gallery). It fills its box like `object-fit: cover`: scaled to
 * the wider of width / height and centred, so taller boxes (the reel swatches) crop the sides instead of letterboxing.
 * `className` sets the box's shape (default: the hero's 25:6). `children` render on top.
 */
export function LiveThumb({ id, sceneProps, className, children }) {
  const ref = useRef(null);
  const [box, setBox] = useState({ w: 300, h: 72 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = Math.max(box.w / BASE_W, box.h / BASE_H);
  const left = (box.w - BASE_W * scale) / 2;
  return (
    <div ref={ref} className={cn('relative aspect-[25/6] w-full overflow-hidden rounded-xl', className)}>
      <div className="absolute top-0 origin-top-left overflow-hidden" style={{ left, width: BASE_W, height: BASE_H, transform: `scale(${scale})` }}>
        <CoverScene id={id} {...sceneProps} />
      </div>
      {children}
    </div>
  );
}

// The two kinds of cover — Static first (user's order), Animated second
const KINDS = [
  { id: 'static', label: 'Static', icon: Image, chip: 'Preview' },
  { id: 'animated', label: 'Animated', icon: Sparkles, chip: 'Live preview' },
];

/**
 * Choose a cover ("Live preview + reel", picked from previews):
 *  - the shared Static / Animated SegmentedControl right above the covers (style cards with peeks were confusing);
 *  - a reel of swatches for that style.
 * Above them a big preview of the chosen cover, with your photo, name and the cover's description under it.
 * Switching style jumps the preview to that style's first cover (or back to the one you had in it).
 * Reel swatches stay still until hovered / focused (ln-thumb) so only the preview animates — six live scenes at once
 * made it lag. Applies on "Apply cover".
 */
export function CoverPickerModal({ open, onClose, current, onSave }) {
  const { user } = useAuth();
  const start = current ?? DEFAULT_COVER;
  const [selected, setSelected] = useState(start);
  const [kind, setKind] = useState(coverById(start).kind);
  const [saving, setSaving] = useState(false);
  const cover = coverById(selected);
  const isCurrent = selected === start;
  const reel = ALL_COVERS.filter((c) => c.kind === kind);
  const meta = KINDS.find((k) => k.id === cover.kind);

  useEffect(() => {
    if (open) {
      setSelected(start);
      setKind(coverById(start).kind);
    }
  }, [open, start]);

  // Remember the last pick in each style, so flipping back and forth doesn't lose it
  const lastPick = useRef({});
  const pickKind = (k) => {
    if (k === kind) return;
    lastPick.current[kind] = selected;
    setKind(k);
    const back = lastPick.current[k] ?? (coverById(start).kind === k ? start : ALL_COVERS.find((c) => c.kind === k).id);
    setSelected(back);
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(selected);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title="Choose a cover"
      description="Animated scenes or calm still art — pick the one that feels like you."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} loading={saving} disabled={isCurrent}>
            Apply cover
          </Button>
        </>
      }
    >
      {/* Preview: the chosen cover, then your photo and name with the cover's name and description beside them */}
      <div className="rounded-2xl border border-border bg-surface p-2 pb-4 shadow-xs dark:bg-surface-secondary">
        {/* key: replay the fade when the scene changes */}
        <LiveThumb key={cover.id} id={cover.id} className="aspect-[25/7] animate-fade-in rounded-xl sm:aspect-[25/6]">
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <meta.icon className="size-3" aria-hidden="true" />
            {meta.chip}
          </span>
          {isCurrent && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary-text">
              <Check className="size-3" strokeWidth={3} aria-hidden="true" />
              Current
            </span>
          )}
        </LiveThumb>
        {/* Photo and name in one row under the cover, centred on each other */}
        <div className="flex items-center gap-3 px-2 pt-3">
          <Avatar name={user?.name} src={user?.avatar} size="lg" className="shrink-0 rounded-full" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-text">{user?.name}</p>
            <p className="truncate text-xs text-text-secondary">
              <span className="font-medium text-text">{cover.label}</span> · {cover.description}
            </p>
          </div>
        </div>
      </div>

      {/* The same segmented switch as elsewhere (Dashboard period, Leaderboard), right above the covers it filters */}
      <SegmentedControl
        tabs={KINDS.map((k) => ({ value: k.id, label: k.label, icon: k.icon }))}
        value={kind}
        onChange={pickKind}
        ariaLabel="Cover style"
        className="mb-3 mt-5"
      />
      <div key={kind} className="grid grid-cols-3 gap-2.5 motion-safe:animate-fade-in sm:grid-cols-6" role="radiogroup" aria-label={`${kind === 'animated' ? 'Animated' : 'Static'} covers`}>
        {reel.map((c) => {
          const on = c.id === selected;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSelected(c.id)}
              title={c.description}
              className="ln-thumb group flex flex-col items-center gap-1.5 rounded-xl text-center focus-visible:outline-none"
            >
              <span
                className={cn(
                  'block w-full rounded-xl p-0.5 transition-shadow duration-200',
                  on ? 'shadow-[0_0_0_2px_var(--color-primary)]' : 'group-hover:shadow-[0_0_0_2px_var(--color-border-strong)] group-focus-visible:shadow-[0_0_0_2px_var(--color-focus)]',
                )}
              >
                <LiveThumb id={c.id} className="aspect-[4/3] rounded-[10px]">
                  {on && (
                    <span className="absolute right-1.5 top-1.5 inline-flex size-5 animate-scale-in items-center justify-center rounded-full bg-primary text-primary-fg ring-2 ring-white/70">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                  )}
                </LiveThumb>
              </span>
              <span className={cn('text-xs leading-tight', on ? 'font-semibold text-primary-text' : 'font-medium text-text-secondary')}>{c.label}</span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
