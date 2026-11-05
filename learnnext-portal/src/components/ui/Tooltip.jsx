import { useId, useLayoutEffect, useState, useRef, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

/**
 * Lightweight tooltip rendered in a portal (never clipped by overflow).
 * <Tooltip content="Edit"><button>…</button></Tooltip>
 * side: top | bottom | left | right. Set disabled to skip rendering.
 * It sizes to its text (one line up to 20rem, so short labels never break into a column) and is nudged back inside the
 * window when it would spill past an edge (e.g. for row actions at the far right of a table).
 */
export function Tooltip({ content, side = 'top', disabled, delay = 250, children }) {
  const [pos, setPos] = useState(null);
  const id = useId();
  const timer = useRef();
  const tipRef = useRef(null);
  const [shift, setShift] = useState(0);

  // Keep it on screen: measure once shown and slide it sideways by however much it spills over
  useLayoutEffect(() => {
    if (!pos || !tipRef.current) return;
    const r = tipRef.current.getBoundingClientRect();
    const margin = 8;
    const overRight = r.right - (window.innerWidth - margin);
    const overLeft = margin - r.left;
    setShift(overRight > 0 ? -overRight : overLeft > 0 ? overLeft : 0);
  }, [pos]);

  if (disabled || !content) return children;

  const show = (e) => {
    const el = e.currentTarget;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const r = el.getBoundingClientRect();
      const gap = 8;
      const p = {
        top: { top: r.top - gap, left: r.left + r.width / 2, transform: 'translate(-50%, -100%)' },
        bottom: { top: r.bottom + gap, left: r.left + r.width / 2, transform: 'translate(-50%, 0)' },
        left: { top: r.top + r.height / 2, left: r.left - gap, transform: 'translate(-100%, -50%)' },
        right: { top: r.top + r.height / 2, left: r.right + gap, transform: 'translate(0, -50%)' },
      }[side];
      setShift(0);
      setPos(p);
    }, delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setPos(null);
  };

  const child = cloneElement(children, {
    'aria-describedby': pos ? id : undefined,
    onMouseEnter: (e) => {
      children.props.onMouseEnter?.(e);
      show(e);
    },
    onMouseLeave: (e) => {
      children.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e) => {
      children.props.onFocus?.(e);
      if (e.currentTarget.matches(':focus-visible')) show(e);
    },
    onBlur: (e) => {
      children.props.onBlur?.(e);
      hide();
    },
    onClick: (e) => {
      children.props.onClick?.(e);
      hide();
    },
  });

  return (
    <>
      {child}
      {pos &&
        createPortal(
          <div
            id={id}
            ref={tipRef}
            role="tooltip"
            style={{ position: 'fixed', ...pos, marginLeft: shift }}
            className={cn(
              'pointer-events-none z-[100] w-max max-w-[20rem] animate-fade-in rounded-md px-2 py-1 text-xs font-medium',
              'bg-[#111827] text-white shadow-pop dark:bg-[#e7ebf2] dark:text-[#0a0d13]',
            )}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  );
}
