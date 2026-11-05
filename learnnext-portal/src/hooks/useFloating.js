import { useCallback, useLayoutEffect, useState } from 'react';

const MARGIN = 8;

/**
 * Positions a fixed floating element next to an anchor, flipping vertically
 * when there is no room and clamping horizontally so it never leaves the viewport.
 * placement: 'bottom-start' | 'bottom-end' | 'bottom' | 'top-start' | 'top-end' | 'top' | 'right-start'
 * ('right-start' = beside the anchor, top-aligned — e.g. flyouts from the collapsed sidebar rail)
 */
export function useFloating(open, anchorRef, floatingRef, { placement = 'bottom-start', offset = 6, matchWidth = false } = {}) {
  const [style, setStyle] = useState({ position: 'fixed', top: -9999, left: -9999 });

  const update = useCallback(() => {
    const a = anchorRef.current;
    const f = floatingRef.current;
    if (!a || !f) return;
    const r = a.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fw = Math.min(f.offsetWidth, vw - MARGIN * 2);
    const fh = f.offsetHeight;
    const [side, align = 'center'] = placement.split('-');

    if (side === 'right') {
      const top = Math.max(MARGIN, Math.min(r.top, vh - fh - MARGIN));
      const left = Math.min(r.right + offset, vw - fw - MARGIN);
      setStyle({ position: 'fixed', top, left, maxWidth: vw - MARGIN * 2, maxHeight: vh - MARGIN * 2 });
      return;
    }

    let top = side === 'top' ? r.top - offset - fh : r.bottom + offset;
    const spaceBelow = vh - r.bottom - offset - MARGIN;
    const spaceAbove = r.top - offset - MARGIN;
    if (side === 'bottom' && fh > spaceBelow && spaceAbove > spaceBelow) top = r.top - offset - fh;
    if (side === 'top' && fh > spaceAbove && spaceBelow > spaceAbove) top = r.bottom + offset;
    top = Math.max(MARGIN, Math.min(top, vh - fh - MARGIN));

    let left = align === 'start' ? r.left : align === 'end' ? r.right - fw : r.left + r.width / 2 - fw / 2;
    left = Math.max(MARGIN, Math.min(left, vw - fw - MARGIN));

    setStyle({
      position: 'fixed',
      top,
      left,
      minWidth: matchWidth ? r.width : undefined,
      maxWidth: vw - MARGIN * 2,
      maxHeight: Math.max(160, Math.max(spaceBelow, spaceAbove)),
    });
  }, [anchorRef, floatingRef, placement, offset, matchWidth]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    update();
    const raf = requestAnimationFrame(update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, update]);

  return { style, update };
}
