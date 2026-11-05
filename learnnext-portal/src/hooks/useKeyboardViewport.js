import { useEffect, useState } from 'react';

/**
 * Phones: keeps a fixed full-screen layer (sheets, drawers, modals) inside the part of the screen the on-screen keyboard
 * leaves visible. Mobile browsers (iOS Safari, Android Chrome) don't shrink the page when the keyboard opens — they
 * only shrink the "visual viewport" — so anything pinned to the bottom ends up hidden behind the keyboard.
 *
 * Returns an inline style ({ top, height, bottom: 'auto' }) to spread on the `fixed inset-0` layer while the keyboard is
 * up, or undefined otherwise (no effect on desktop, or when nothing is focused).
 */
export function useKeyboardViewport(active = true) {
  const [box, setBox] = useState(null);

  useEffect(() => {
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (!active || !vv) return undefined;
    const update = () => {
      // Only when something (the keyboard) takes a real chunk of the screen — ignores pinch-zoom and toolbar wobble
      const covered = window.innerHeight - vv.height;
      const open = covered > 80;
      setBox(open ? { top: vv.offsetTop, height: vv.height } : null);
      // Once the layer has shrunk, bring the field being typed in back into view (the smallest scroll that shows it) —
      // e.g. a field low in a tall drawer would otherwise sit under the keyboard or slide out the top
      if (open) {
        requestAnimationFrame(() => {
          const el = document.activeElement;
          if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) el.scrollIntoView({ block: 'nearest' });
        });
      }
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      setBox(null);
    };
  }, [active]);

  return box ? { top: box.top, height: box.height, bottom: 'auto' } : undefined;
}
