import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, LayoutGrid, Pin, PinOff, Search, SearchX, Star, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button, Card, Kbd } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { MASTER_COUNT, MASTERS, RECENT_KEY, SEARCH_KEYWORDS, SETTINGS_GROUPS } from './settingsMasters';
import { GROUP_TONES } from './groupTones';

const PINNED_KEY = 'ln.settings.pinned';
const TIP_DONE_KEY = 'ln.settings.pinTipDone'; // true once the pin tip is dismissed or something gets pinned
const RECENT_MAX = 6;

// Special entry at the top of the group list: the user's pinned masters + the ones opened recently
// (only listed once there is something in it)
const MINE = 'mine';
const LEGACY = { quick: MINE, pinned: MINE, suggested: MINE }; // older links

/** Every master, flat, with the text the filter looks at */
const ALL = SETTINGS_GROUPS.flatMap((g) => g.items.map((m) => ({ ...m, group: g, haystack: `${m.label} ${m.description} ${g.title} ${SEARCH_KEYWORDS[m.slug] ?? ''}`.toLowerCase() })));

/** Every word must appear somewhere; names that start with / contain the query rank first */
function search(q) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const score = (m) => {
    const label = m.label.toLowerCase();
    if (label.startsWith(q)) return 0;
    if (label.includes(q)) return 1;
    if (words.every((w) => label.includes(w))) return 2;
    return 3;
  };
  return ALL.filter((m) => words.every((w) => m.haystack.includes(w))).sort((a, b) => score(a) - score(b));
}

const groupById = (id) => SETTINGS_GROUPS.find((g) => g.id === id);
const isView = (id) => id === MINE || Boolean(groupById(id));
const viewFromHash = (hash) => {
  const id = LEGACY[hash.slice(1)] ?? hash.slice(1);
  return isView(id) ? id : null;
};

/**
 * Settings — two panes in one card, like phone settings:
 *  • left: Quick access (pinned + recently opened, once there's anything in it), then the groups — jump links;
 *  • right: a top bar (title + a filter for every master) over every group at once — each a section with its masters in
 *    two columns, scrolling on its own; the left list highlights the group you're looking at (scroll-spy). Quick access
 *    and the filter results replace the sections while they're open;
 *  • the choice lives in the URL hash, so coming back from a master (/settings#group) scrolls back to its group.
 * On large screens the card fills the window, so the page itself never scrolls.
 */
export default function Settings() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useLocalStorage(PINNED_KEY, []);
  const [recent, setRecent] = useLocalStorage(RECENT_KEY, []);
  const [tipDone, setTipDone] = useLocalStorage(TIP_DONE_KEY, false);
  const [view, setView] = useState(() => viewFromHash(hash) ?? SETTINGS_GROUPS[0].id);
  const [spy, setSpy] = useState(() => view); // the group in view while scrolling the all-groups pane
  const [jump, setJump] = useState(0); // bumps on every pick, so picking the same group again still scrolls to it
  const [flash, setFlash] = useState(null); // the group just picked — its section is tinted for a moment

  const q = query.trim().toLowerCase();
  const results = useMemo(() => search(q), [q]);
  useEffect(() => setActive(0), [q]);

  // Back from a master (/settings#program) — reopen that group
  useEffect(() => {
    const id = viewFromHash(hash);
    if (id) setView(id);
  }, [hash]);

  // Once anything is pinned, the pin tip has done its job — never show it again
  useEffect(() => {
    if (pinned.length && !tipDone) setTipDone(true);
  }, [pinned.length, tipDone, setTipDone]);

  // Small screens (groups in a sideways row): keep the chosen one in view
  useEffect(() => {
    // After layout settles (on first load the row is measured before it has its final width)
    const t = setTimeout(() => {
      const row = document.getElementById('settings-nav');
      const on = row?.querySelector('[aria-current="true"]');
      if (row && on && row.scrollWidth > row.clientWidth) row.scrollLeft = on.parentElement.offsetLeft - 8;
    }, 60);
    return () => clearTimeout(t);
  }, [view]);

  // "/" focuses the filter from anywhere on the page
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
      if (e.key === '/' && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pick = (id) => {
    setView(id);
    setJump((n) => n + 1);
    setQuery('');
    window.history.replaceState(window.history.state, '', `#${id}`); // remember it without a navigation
  };
  const clearFilter = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const onFilterKey = (e) => {
    if (e.key === 'Escape') return setQuery('');
    if (!results.length) return undefined;
    // Row-major grid: ↓ / ↑ move a whole row (cols = 1 or 2), → / ← move within the row
    const cols = columnsNow(results.length);
    const n = results.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + cols < n ? a + cols : cols === 1 ? 0 : a));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - cols >= 0 ? a - cols : cols === 1 ? n - 1 : a));
    } else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.shiftKey && cols === 2) {
      e.preventDefault();
      setActive((a) => (e.key === 'ArrowRight' ? (a % 2 === 0 && a + 1 < n ? a + 1 : a) : a % 2 === 1 ? a - 1 : a));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      navigate(`/settings/${results[active].slug}`);
    }
    return undefined;
  };

  const togglePin = (slug) => setPinned((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]));
  const pinnedItems = pinned.map((s) => MASTERS[s]).filter(Boolean);
  const recentItems = recent
    .filter((s) => !pinned.includes(s))
    .map((s) => MASTERS[s])
    .filter(Boolean)
    .slice(0, RECENT_MAX);
  const mineCount = pinnedItems.length + recentItems.length;
  const showTip = !tipDone && pinnedItems.length === 0;

  // What the right pane shows (Quick access falls back to the first group once it's empty)
  const shown = view === MINE && !mineCount ? SETTINGS_GROUPS[0].id : view;
  const group = groupById(shown) ?? SETTINGS_GROUPS[0];
  const head = q
    ? { icon: Search, tone: 'primary', meta: null, title: results.length ? `${results.length} match${results.length === 1 ? '' : 'es'}` : 'No matches' }
    : shown === MINE
      ? { icon: Star, tone: 'warning', meta: null, title: 'Quick access' }
      : { icon: LayoutGrid, tone: group.tone, meta: null, title: 'All masters' };

  // Fade cues on both scrolling lists (re-measured when their content changes)
  const [navRef, navFade] = useScrollFade(`nav-${mineCount}-${showTip}`);
  const [paneRef, paneFade] = useScrollFade(q ? `filter-${results.length}` : shown === MINE ? MINE : 'all');
  const allGroups = !q && shown !== MINE;

  // All-groups pane: picking a group (or arriving with #group) scrolls to its section — instantly the first time.
  // The picked group stays highlighted on the left until you scroll yourself (spyLock): the scroll we start isn't
  // allowed to move the highlight — near the bottom a short group can't reach the top, and the spy would otherwise
  // mark the last group instead of the one you clicked.
  const scrolledOnce = useRef(false);
  const spyLock = useRef(false);
  useEffect(() => {
    if (!allGroups) return;
    const pane = paneRef.current;
    const el = pane?.querySelector(`#settings-group-${shown}`);
    if (!pane || !el) return;
    pane.scrollTo({ top: el.offsetTop - 16, behavior: scrolledOnce.current ? 'smooth' : 'instant' });
    scrolledOnce.current = true;
    spyLock.current = true;
    setSpy(shown);
    // Picked in the left list (not on first load): tint its section briefly so it's obvious where you landed
    if (!jump) return;
    setFlash(shown);
    const timer = setTimeout(() => setFlash(null), 1100);
    return () => clearTimeout(timer);
  }, [allGroups, shown, jump, paneRef]);

  // Scroll-spy: the last section whose top has passed a trigger line. The line sits near the pane's top, then slides
  // down over the last stretch of scrolling — so short sections at the end (which can never reach the top) still
  // light up one by one instead of jumping straight to the last group.
  useEffect(() => {
    const pane = paneRef.current;
    if (!allGroups || !pane) return undefined;
    const onScroll = () => {
      if (spyLock.current) return;
      const sections = [...pane.querySelectorAll('[data-group]')];
      const maxScroll = pane.scrollHeight - pane.clientHeight;
      const span = Math.min(maxScroll, pane.clientHeight * 0.5);
      const t = span > 0 ? Math.max(0, (pane.scrollTop - (maxScroll - span)) / span) : 1;
      const line = 40 + t * (pane.clientHeight - 100);
      const current = sections.filter((s) => s.offsetTop - pane.scrollTop <= line).at(-1) ?? sections[0];
      if (current) setSpy(current.dataset.group);
    };
    // Your own scrolling (wheel, touch, keys, dragging the scrollbar) hands the highlight back to the spy
    const unlock = () => {
      spyLock.current = false;
    };
    const userEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    pane.addEventListener('scroll', onScroll, { passive: true });
    userEvents.forEach((ev) => pane.addEventListener(ev, unlock, { passive: true }));
    return () => {
      pane.removeEventListener('scroll', onScroll);
      userEvents.forEach((ev) => pane.removeEventListener(ev, unlock));
    };
  }, [allGroups, paneRef]);

  return (
    <div className="flex flex-col gap-5">
      {/* Large screens: the card is a fixed, full-window panel (6.75rem = the header + page padding above it + a small gap below);
          long lists scroll inside it, and the page footer sits just below the fold (scroll the page to see it). */}
      <Card padding="none" className="ln-flat-mobile grid grid-cols-1 overflow-hidden lg:h-[calc(100dvh-6.75rem)] lg:min-h-[20rem] lg:grid-cols-[248px_minmax(0,1fr)]">
        {/* Left: the groups (a sideways-scrolling row on small screens) */}
        <nav aria-label="Setting groups" className="flex min-h-0 min-w-0 flex-col border-b border-border bg-surface-sunken/40 p-2 max-sm:hidden lg:border-b-0 lg:border-r">
          <ul ref={navRef} style={navFade} id="settings-nav" className="relative flex min-h-0 gap-1 overflow-x-auto p-0.5 pb-1 scrollbar-none lg:flex-1 lg:flex-col lg:overflow-y-auto">
            {mineCount > 0 && (
              <>
                <NavItem icon={Star} tone="warning" label="Quick access" count={mineCount} on={!q && shown === MINE} onClick={() => pick(MINE)} />
                <li className="mx-2 my-1 hidden h-px bg-border lg:block" aria-hidden="true" />
              </>
            )}
            {SETTINGS_GROUPS.map((g) => (
              <NavItem key={g.id} icon={g.icon} tone={g.tone} label={g.title} count={g.items.length} on={allGroups && spy === g.id} onClick={() => pick(g.id)} />
            ))}
          </ul>
          {/* The one place the pin tip appears — until it's dismissed or something is pinned */}
          {showTip && <PinTip onDismiss={() => setTipDone(true)} />}
        </nav>

        {/* Right: top bar (what's shown + the filter), then the masters list */}
        <div className="flex min-h-0 min-w-0 flex-col">
          <TopBar head={head}>
            <div className="relative w-full sm:w-72">
              <label htmlFor="settings-search" className="sr-only">
                Filter masters
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                id="settings-search"
                type="search"
                role="combobox"
                aria-expanded={Boolean(q)}
                aria-controls="settings-results"
                aria-activedescendant={q && results[active] ? `result-${results[active].slug}` : undefined}
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onFilterKey}
                placeholder={`Filter ${MASTER_COUNT} masters…`}
                className="h-10 w-full rounded-xl border border-border-strong bg-surface pl-10 pr-10 text-sm text-text shadow-xs placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-focus dark:bg-surface-secondary [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={clearFilter}
                  aria-label="Clear filter"
                  className="absolute right-2 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-text-muted hover:bg-surface-sunken hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              ) : (
                <Kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 sm:inline-flex" aria-hidden="true">
                  /
                </Kbd>
              )}
            </div>
          </TopBar>

          {/* The masters — scrolls on its own; the footer below is outside it, so it never covers the last row */}
          <div ref={paneRef} style={paneFade} className="@container relative min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]" role="region" aria-labelledby="settings-pane-title">
            <div key={q ? 'filter' : shown === MINE ? MINE : 'all'} className="motion-safe:animate-fade-in">
              {q ? (
                <FilterResults results={results} query={query.trim()} active={active} setActive={setActive} pinned={pinned} onPin={togglePin} onClear={clearFilter} />
              ) : shown === MINE ? (
                <>
                  {pinnedItems.length > 0 && (
                    <>
                      <SectionLabel>Pinned</SectionLabel>
                      <MasterList
                        aria-label="Pinned masters"
                        items={pinnedItems}
                        render={({ item, group: g }, i, edge) => <MasterItem key={item.slug} m={item} group={g} pinned onPin={togglePin} groupInline className={edge} />}
                      />
                    </>
                  )}
                  {recentItems.length > 0 && (
                    <>
                      <SectionLabel
                        action={
                          <button
                            type="button"
                            onClick={() => setRecent([])}
                            className="rounded px-1.5 text-xs font-semibold text-text-secondary hover:text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                          >
                            Clear history
                          </button>
                        }
                      >
                        Recently opened
                      </SectionLabel>
                      <MasterList
                        aria-label="Recently opened masters"
                        items={recentItems}
                        render={({ item, group: g }, i, edge) => <MasterItem key={item.slug} m={item} group={g} pinned={pinned.includes(item.slug)} onPin={togglePin} groupInline className={edge} />}
                      />
                    </>
                  )}
                </>
              ) : (
                // Every group, one after another, each a light card
                <div className="flex flex-col gap-4 p-4 max-sm:gap-3 max-sm:px-3 max-sm:pt-3 sm:p-5">
                  {SETTINGS_GROUPS.map((g) => (
                    <GroupSection key={g.id} group={g} flash={flash === g.id}>
                      <MasterList
                        aria-label={`${g.title} masters`}
                        items={g.items}
                        twoCol
                        render={(m, i, edge) => <MasterItem key={m.slug} m={m} group={g} pinned={pinned.includes(m.slug)} onPin={togglePin} className={edge} />}
                      />
                    </GroupSection>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Keyboard hints (+ pinned count once there is one). Solid, outside the scroll area; hidden on short windows */}
          <div className="hidden h-11 shrink-0 items-center justify-between gap-4 border-t border-border bg-surface px-5 text-xs text-text-secondary sm:flex sm:px-6 dark:bg-surface-secondary [@media(max-height:699px)]:hidden!">
            <span className="inline-flex items-center gap-2">
              {pinnedItems.length > 0 && (
                <>
                  <Star className="size-3.5 shrink-0 fill-current text-warning" aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-text">{pinnedItems.length}</span> pinned
                  </span>
                  <span className="text-text-muted" aria-hidden="true">
                    ·
                  </span>
                  <button
                    type="button"
                    onClick={() => pick(MINE)}
                    className="rounded-sm font-semibold text-primary-text underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    Manage
                  </button>
                </>
              )}
            </span>
            <span className="inline-flex items-center gap-4 text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Kbd>/</Kbd> Filter
              </span>
              <span className="hidden items-center gap-1.5 md:inline-flex">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                <Kbd>←</Kbd>
                <Kbd>→</Kbd> Move
              </span>
              <span className="hidden items-center gap-1.5 md:inline-flex">
                <Kbd>Enter</Kbd> Open
              </span>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

/** One entry in the left list: coloured icon, name, count; the chosen one sits on a white pill (aria-current) */
function NavItem({ icon: Icon, tone, label, count, on, onClick }) {
  return (
    <li className="shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-current={on ? 'true' : undefined}
        className={cn(
          // A real 1px border (transparent until selected) — a ring would be cropped by the scrolling list
          'flex h-10 w-full items-center gap-2.5 whitespace-nowrap rounded-lg border px-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus motion-reduce:transition-none',
          on ? 'border-border-strong bg-surface font-semibold text-text shadow-xs dark:bg-elevated' : 'border-transparent text-text-secondary hover:bg-surface/70 hover:text-text',
        )}
      >
        <Icon className={cn('size-4 shrink-0', GROUP_TONES[tone].icon)} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {count != null && <span className="text-xs tabular-nums text-text-muted">{count}</span>}
      </button>
    </li>
  );
}

/**
 * One group in the all-groups pane, as a light card of its own, headed by just its name in plain text (the left list has the counts).
 * `flash` briefly outlines the card in blue — after picking the group in the left list.
 */
function GroupSection({ group, flash, children }) {
  return (
    <section
      id={`settings-group-${group.id}`}
      data-group={group.id}
      aria-labelledby={`settings-group-${group.id}-title`}
      className={cn(
        'rounded-2xl border bg-surface/90 pb-2 shadow-xs transition-[border-color,box-shadow] duration-500 motion-reduce:transition-none dark:bg-surface-secondary/70',
        flash ? 'border-primary/50 shadow-[0_0_0_3px] shadow-primary/15' : 'border-border-strong',
      )}
    >
      <div className="flex items-center gap-2 px-4 pb-1 pt-4 sm:px-5">
        {/* Section-label style (small caps, spaced, muted) so it reads as a heading, not another master name */}
        <h3 id={`settings-group-${group.id}-title`} className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-secondary">
          {group.title}
        </h3>
      </div>
      {children}
    </section>
  );
}
/** Small uppercase heading over a section of the Quick access pane, with an optional action on the right */
function SectionLabel({ children, action }) {
  return (
    <div className="flex items-center justify-between px-5 pt-4 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">{children}</p>
      {action}
    </div>
  );
}

/** Compact, dismissible one-line tip at the bottom of the group list */
function PinTip({ onDismiss }) {
  return (
    <div className="mt-2 hidden items-center gap-2 rounded-lg bg-warning-main/[0.06] py-1.5 pl-3 pr-1 text-xs text-text-secondary lg:flex">
      <Pin className="size-3.5 shrink-0 text-warning" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">Pin masters you use often</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss tip"
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Right-pane top bar — one slim row so more masters fit above the fold: icon tile + title + a small count pill
 * (e.g. "15 masters") on the left, the filter on the right (wraps below on narrow screens).
 */
function TopBar({ head, children }) {
  const { icon: Icon, tone, meta, title } = head;
  const t = GROUP_TONES[tone];
  return (
    // Phones: no wash to clip and no padding, so overflow stays visible — a clip there cut off the filter's focus ring
    <div className="relative isolate flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2.5 overflow-hidden max-sm:overflow-visible border-b border-border bg-surface px-5 py-2.5 max-sm:border-b-0 max-sm:bg-transparent max-sm:px-3 max-sm:pb-0 max-sm:pt-1 sm:px-6 dark:bg-surface-secondary max-sm:dark:bg-transparent">
      <span className={cn('pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r via-transparent to-transparent max-sm:hidden', t.wash)} aria-hidden="true" />
      {/* Phones: no "All masters" title — the group row above already says where you are */}
      <div className="flex min-w-[12rem] flex-1 items-center gap-3 max-sm:hidden">
        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ring-1 ring-inset', t.head)}>
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
        <h2 id="settings-pane-title" className="truncate text-lg font-bold tracking-[-0.01em] text-text">
          {title}
        </h2>
        {/* Just the number, quiet, beside the title (as on the client tabs: "Participants 9") */}
        {meta != null && <span className="shrink-0 text-sm font-medium tabular-nums text-text-muted">{meta}</span>}
      </div>
      {children}
    </div>
  );
}

/**
 * Scroll cue for a scrolling list: fades the edge where more content is hidden (top and/or bottom), using a mask so
 * it works on any background. Re-measures on scroll, resize and when `contentKey` changes.
 */
function useScrollFade(contentKey) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setEdges({ top: el.scrollTop > 2, bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 2 });
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    [...el.children].forEach((c) => ro.observe(c));
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [contentKey]);
  const { top, bottom } = edges;
  const mask = top || bottom ? `linear-gradient(to bottom, ${top ? 'transparent, #000 28px' : '#000'}, ${bottom ? '#000 calc(100% - 40px), transparent' : '#000'})` : undefined;
  return [ref, mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined];
}

/** More than 6 masters → two columns (from the sm breakpoint); otherwise one */
const twoColumns = (count) => count > 6;
const columnsNow = (count) => (twoColumns(count) && window.matchMedia('(min-width: 640px)').matches ? 2 : 1);

/**
 * Settings-style list: rows with hairline dividers, in data order, left to right then down (row-major), so the
 * first row reads "Entity | Sub-entity". `edge(i)` drops the divider under the last row.
 */
function listLayout(count, forceTwo = false) {
  const two = twoColumns(count);
  const lastRowStart = count - (count % 2 || 2); // first index on the last row of a 2-column grid
  // forceTwo (the all-groups sections): two columns once the pane itself is wide enough (container query on the pane),
  // so names aren't cut off when the window is narrower
  if (forceTwo) {
    return {
      // No dividers between rows here — the sections' spacing does the grouping
      className: 'grid grid-cols-1 px-3 pt-1 sm:px-4 @[40rem]:grid-cols-2 @[40rem]:gap-x-6',
      edge: () => 'border-b-0 py-0.5',
    };
  }
  return {
    className: cn('grid grid-cols-1 px-3 py-1 sm:px-4', two && 'sm:grid-cols-2 sm:gap-x-8'),
    edge: (i) => cn(i === count - 1 && 'border-b-0', two && i >= lastRowStart && 'sm:border-b-0'),
  };
}

/** A list of masters laid out by listLayout; `render(item, i, edgeClass)` draws each one */
function MasterList({ items, render, twoCol, ...props }) {
  const { className, edge } = listLayout(items.length, twoCol);
  return (
    <ul className={className} {...props}>
      {items.map((item, i) => render(item, i, edge(i)))}
    </ul>
  );
}

/**
 * One master — a single link to its page (icon, name, description, chevron), plus a pin toggle at the
 * far right. The chevron is always there (muted); hover, keyboard focus and the filter's keyboard highlight (`active`)
 * all look the same: the row lifts onto a white tile (border + soft shadow), blue name, blue chevron nudged right. The pin shows on hover/focus and stays
 * visible once pinned.
 */
function MasterItem({ m, group, pinned, onPin, showGroup, groupInline, active, id, onHover, className }) {
  const t = GROUP_TONES[group.tone];
  return (
    <li
      id={id}
      role={id ? 'option' : undefined}
      aria-selected={id ? Boolean(active) : undefined}
      onMouseEnter={onHover}
      className={cn('group/item relative border-b border-border/70 py-1', className)}
    >
      <Link
        to={`/settings/${m.slug}`}
        data-lit={active ? '' : undefined}
        className="group/link flex cursor-pointer items-center gap-3.5 rounded-xl border border-transparent px-2 py-2.5 pr-12 max-sm:pr-2 transition-[background-color,border-color,box-shadow] duration-200 hover:border-border-strong hover:bg-surface hover:shadow-xs focus-visible:border-border-strong focus-visible:bg-surface focus-visible:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus data-[lit]:border-border-strong data-[lit]:bg-surface data-[lit]:shadow-xs dark:hover:bg-surface-secondary dark:data-[lit]:bg-surface-secondary motion-reduce:transition-none"
      >
        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', t.tile)}>
          <m.icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          {/* While filtering across groups: which group it's in */}
          {showGroup && (
            <span className="mb-0.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-text-muted">
              <span className={cn('size-1.5 shrink-0 rounded-full bg-current', t.icon)} aria-hidden="true" />
              <span className="truncate">{group.title}</span>
            </span>
          )}
          <span className="block truncate text-[15px] font-semibold text-text transition-colors group-hover/item:text-primary-text group-focus-within/item:text-primary-text group-data-[lit]/link:text-primary-text motion-reduce:transition-none">
            {m.label}
          </span>
          <span className="mt-0.5 block text-[13px] text-text-secondary sm:truncate">{groupInline ? `${group.title} · ${m.description}` : m.description}</span>
        </span>
        <ChevronRight
          className={cn(
            'size-4 shrink-0 transition-[color,translate] duration-200 motion-reduce:transition-none',
            active
              ? 'translate-x-0.5 text-primary-text'
              : 'text-text-muted group-hover/item:translate-x-0.5 group-hover/item:text-primary-text group-focus-within/item:translate-x-0.5 group-focus-within/item:text-primary-text',
          )}
          aria-hidden="true"
        />
      </Link>
      <button
        type="button"
        onClick={() => onPin(m.slug)}
        aria-label={pinned ? `Unpin ${m.label}` : `Pin ${m.label}`}
        aria-pressed={pinned}
        title={pinned ? 'Unpin' : 'Pin'}
        className={cn(
          'absolute right-2 top-1/2 inline-flex size-8 max-sm:hidden -translate-y-1/2 items-center justify-center rounded-full transition-opacity hover:bg-surface focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus motion-reduce:transition-none [@media(hover:none)]:opacity-100',
          pinned ? 'text-warning opacity-100' : 'text-text-muted opacity-0 group-focus-within/item:opacity-100 group-hover/item:opacity-100',
        )}
      >
        {pinned ? <PinOff className="size-3.5" aria-hidden="true" /> : <Pin className="size-3.5" aria-hidden="true" />}
      </button>
    </li>
  );
}

/** Filter results across every group — keyboard-driven (↑ ↓ ← → Enter), best matches first, each with its group */
function FilterResults({ results, query, active, setActive, pinned, onPin, onClear }) {
  // Keep the keyboard-highlighted result in view as the arrows move through a long list
  const activeSlug = results[active]?.slug;
  useEffect(() => {
    if (activeSlug) document.getElementById(`result-${activeSlug}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeSlug]);

  if (!results.length) {
    return (
      <EmptyState
        icon={SearchX}
        title={`No masters match “${query}”`}
        description="Try a simpler word — e.g. “city”, “fee”, “trainer”, “assessment” or “bank”."
        action={
          <Button variant="secondary" leftIcon={X} onClick={onClear}>
            Clear filter
          </Button>
        }
      />
    );
  }
  return (
    <MasterList
      id="settings-results"
      role="listbox"
      aria-label="Matching masters"
      items={results}
      render={(m, i, edge) => (
        <MasterItem
          key={m.slug}
          id={`result-${m.slug}`}
          m={m}
          group={m.group}
          pinned={pinned.includes(m.slug)}
          onPin={onPin}
          showGroup
          active={i === active}
          onHover={() => setActive(i)}
          className={edge}
        />
      )}
    />
  );
}
