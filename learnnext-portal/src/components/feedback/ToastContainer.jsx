import { createPortal } from 'react-dom';
import { Toast } from './Toast';

/**
 * Fixed toast stack.
 *  Phones (picked from previews: "From the top"): drops in at the top, just under the portal header — so it never lands
 *  on the tab bar, an open menu sheet or bottom buttons. Pages without the portal shell (sign-in, system pages) use the
 *  top edge. The shell is detected by BottomNav marking <body data-tabbar>.
 *  Larger screens: bottom-right; small tablets (tab bar still shown) lift it above the tab bar.
 */
export function ToastContainer({ toasts, onDismiss, onPause, onResume }) {
  return createPortal(
    <div
      aria-live="polite"
      className={
        'pointer-events-none fixed inset-x-0 top-0 z-[90] flex flex-col items-center gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))] max-sm:[body[data-tabbar]_&]:pt-[calc(4.25rem+env(safe-area-inset-top))] ' +
        'sm:inset-x-auto sm:bottom-0 sm:right-0 sm:top-auto sm:w-[380px] sm:items-end sm:p-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-md:[body[data-tabbar]_&]:pb-[calc(5.125rem+env(safe-area-inset-bottom))]'
      }
    >
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} onPause={onPause} onResume={onResume} />
      ))}
    </div>,
    document.body,
  );
}
