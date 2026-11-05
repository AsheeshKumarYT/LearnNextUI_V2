/**
 * Lets a page with unsaved changes intercept in-app links that live outside it (the header breadcrumbs, the sidebar,
 * the search palette and the user menu all check it).
 * The app uses <BrowserRouter>, where react-router's useBlocker isn't available, so this is a tiny opt-in registry.
 *
 *   // in the page
 *   useEffect(() => setLeaveGuard((to) => (changed ? (askToDiscard(to), true) : false)), [changed]);
 *   // in the link
 *   onClick={(e) => interceptLeave(to) && e.preventDefault()}
 *
 * A guard returns true when it has taken over (e.g. opened a "Discard changes?" dialog), false to let the link work.
 */
let guard = null;

/** Register the current page's guard; returns a cleanup that removes it (use as a useEffect return value) */
export function setLeaveGuard(fn) {
  guard = fn;
  return () => {
    if (guard === fn) guard = null;
  };
}

/** True if the current page's guard handled navigating to `to` (so the link should not navigate) */
export function interceptLeave(to) {
  return guard ? guard(to) === true : false;
}
