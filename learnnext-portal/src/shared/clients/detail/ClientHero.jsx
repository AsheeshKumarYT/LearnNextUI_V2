import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, MoreVertical, Pencil } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLogoColor } from '@/hooks/useLogoColor';
import { Button, Card, Dropdown, IconButton, useSlidingIndicator } from '@/components/ui';
import { ClientLogo, monogramColor } from '../components/ClientLogo';
import { CodeChip } from '../components/clientColumns';

/**
 * Client page hero — a card with who the client is, and the section tabs joined to its bottom edge (like a profile
 * banner). The tabs are a separate, sticky bar so they pin under the top bar while you scroll; that's why this
 * returns two siblings — render it straight inside the page's column (not inside a gap / overflow wrapper).
 */
// backLabel: the back button's wording (Super Admin's page says "Manage clients"; defaults to "All clients")
export function ClientHero({ client, tabs, tab, onTab, onBack, onEdit, backLabel = 'All clients' }) {
  const active = client.status === 'active';
  // The wash from the top-left follows the logo: its main colour, or the monogram tile's colour when there's no logo
  // (blue while an image is read, or for a colourless one)
  const imageColor = useLogoColor(client.logo);
  const logoColor = client.logo ? imageColor : monogramColor(client.code);

  return (
    <>
    <Card tint="primary" tintColor={logoColor} padding="none" className="overflow-hidden rounded-b-none border-b-0">
      {/* Identity + actions */}
      <div className="flex flex-col gap-5 px-5 py-6 sm:px-7 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4 sm:items-center">
          {/* Just the logo's own thin ring — no drop shadow lifting it off the card */}
          <ClientLogo client={client} size="lg" className="size-14 rounded-2xl text-lg sm:size-16" />
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-6 text-text max-sm:pr-8 sm:text-2xl sm:leading-8">{client.name}</h1>
            {/* One quiet line, one kind of separator: code chip, industry · city (phones drop the industry) · ● status */}
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-text-secondary">
              <CodeChip code={client.code} />
              {[
                { text: client.industry, className: 'hidden sm:inline' },
                { text: client.city },
              ]
                .filter((p) => p.text)
                .map((p, i) => (
                  <span key={p.text} className={cn('inline-flex items-center gap-x-2.5', p.className)}>
                    {i > 0 && <span className="text-text-muted/60" aria-hidden="true">·</span>}
                    {p.text}
                  </span>
                ))}
              <span className="inline-flex items-center gap-x-2.5">
                <span className="text-text-muted/60" aria-hidden="true">·</span>
                <span className={cn('inline-flex items-center gap-1.5 font-medium', active ? 'text-success' : 'text-text-secondary')}>
                  <span className={cn('size-1.5 rounded-full', active ? 'bg-success-main' : 'bg-text-muted')} aria-hidden="true" />
                  {active ? 'Active' : 'Inactive'}
                </span>
              </span>
            </p>
          </div>
        </div>
        <HeroMobileActions onBack={onBack} backLabel={backLabel} actions={[{ icon: Pencil, label: 'Edit client', onClick: onEdit, primary: true }]} />
        <div className="flex shrink-0 gap-2 max-sm:hidden [&>*]:flex-1 sm:[&>*]:flex-none">
          <Button variant="secondary" leftIcon={ArrowLeft} onClick={onBack}>
            {backLabel}
          </Button>
          <Button leftIcon={Pencil} onClick={onEdit}>
            Edit
          </Button>
        </div>
      </div>
    </Card>    <SectionTabs tabs={tabs} value={tab} onChange={onTab} />
    </>
  );
}

/**
 * Phones: the hero's actions as a light icon row on top of the card (picked from previews: "Icon row top-right") — a
 * round ← back on the left, round icon buttons on the right (the last one = primary, e.g. Edit). The labelled buttons
 * hide on phones. actions = [{ icon, label, onClick, primary }]
 */
export function HeroMobileActions({ onBack, backLabel, actions = [] }) {
  return (
    // A ⋯ in the card's top-right corner opening a menu (asked for, after an icon row — top or centred — didn't work)
    <div className="absolute right-3 top-3 sm:hidden">
      <Dropdown
        items={[{ label: backLabel, icon: ArrowLeft, onSelect: onBack }, ...actions.map((a) => ({ label: a.label, icon: a.icon, onSelect: a.onClick }))]}
        trigger={<IconButton icon={MoreVertical} label="Actions" variant="ghost" className="text-text" />}
      />
    </div>
  );
}

/**
 * Section tabs on the hero's bottom edge: plain labels with a blue underline that glides to the open one along the card's bottom edge. When the row is wider than
 * the screen, edge fades and arrow buttons show there's more, and the open tab scrolls into view.
 * Also used under other heroes (e.g. a program's content page): `ariaLabel` names the bar, `idBase` matches the page's TabPanel.
 */
export function SectionTabs({ tabs, value, onChange, ariaLabel = 'Client sections', idBase = 'client', end, onEndFit }) {
  const listRef = useRef(null);
  const pos = useSlidingIndicator(listRef, value, tabs.length);
  const [edges, setEdges] = useState({ left: false, right: false });

  // Pinned? A 1px sentinel sits where the bar starts; once it slides up under the top bar, the bar is floating
  const sentinelRef = useRef(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    // The bar pins where the app's top bar ends — its height, or 0 while it has slid away on scroll down (the Header
    // marks that on <html>), so check against wherever it is now on every scroll
    const update = () => {
      const top = document.documentElement.hasAttribute('data-header-hidden') ? 0 : (document.querySelector('header.sticky')?.offsetHeight ?? 64);
      const el = sentinelRef.current;
      if (el) setStuck(el.getBoundingClientRect().top < top + 1);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Tell pinned table headings further down to sit under this bar, not behind it: --page-bar-h = the bar's height + the
  // soft page-colour band that fades out 28px below it (see DataTable). Set for as long as the page is open — not only
  // while pinned — so it's already in place however fast you scroll (a table below can only reach the top once this bar
  // has pinned there anyway). Cleared when the page closes.
  const pillRef = useRef(null);
  useEffect(() => {
    const root = document.documentElement;
    const set = () => pillRef.current && root.style.setProperty('--page-bar-h', `${pillRef.current.offsetHeight + 28}px`);
    set();
    window.addEventListener('resize', set);
    return () => {
      window.removeEventListener('resize', set);
      root.style.removeProperty('--page-bar-h');
    };
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const update = () => {
      setEdges({ left: list.scrollLeft > 4, right: list.scrollLeft + list.clientWidth < list.scrollWidth - 4 });
    };
    update();
    list.addEventListener('scroll', update, { passive: true });
    // Re-check whenever the row or any tab changes size (web fonts finishing, layout changes…)
    const ro = new ResizeObserver(update);
    ro.observe(list);
    [...list.querySelectorAll('[role=tab]')].forEach((el) => ro.observe(el));
    document.fonts?.ready.then(update);
    const raf = requestAnimationFrame(update); // after the first paint
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      list.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      ro.disconnect();
    };
  }, [value, stuck]); // and again when the open tab changes or the bar pins

  // Does the optional `end` action fit beside all the tabs? Measured (not a fixed breakpoint): the tabs' natural width +
  // the action's width against the bar. When it doesn't, it's taken out of the flow (still measurable) and the page is
  // told via onEndFit(false), so it can show that action elsewhere (e.g. in its hero) instead.
  const endRef = useRef(null);
  const [endFits, setEndFits] = useState(true);
  useEffect(() => {
    if (!end) return undefined;
    const check = () => {
      const bar = pillRef.current;
      const list = listRef.current;
      const tabsEl = [...list.querySelectorAll('[role=tab]')];
      if (!bar || !tabsEl.length || !endRef.current) return;
      const tabsWidth = tabsEl.at(-1).offsetLeft + tabsEl.at(-1).offsetWidth - tabsEl[0].offsetLeft + 24; // + the list's side padding
      const fits = tabsWidth + endRef.current.offsetWidth <= bar.clientWidth;
      setEndFits(fits);
      onEndFit?.(fits);
    };
    // Measure once layout has settled (a resize can report before the new widths are in)
    let timer = 0;
    const later = () => {
      clearTimeout(timer);
      timer = setTimeout(check, 60);
    };
    check();
    const ro = new ResizeObserver(later);
    ro.observe(pillRef.current);
    document.fonts?.ready.then(later);
    window.addEventListener('resize', later);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener('resize', later);
    };
  }, [end ? 1 : 0, tabs.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the open tab in view: jump there on first load (e.g. a link to ?tab=settings), glide on later switches
  const firstScroll = useRef(true);
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector(`[data-value="${value}"]`);
    if (el && list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2, behavior: firstScroll.current ? 'instant' : 'smooth' });
    }
    firstScroll.current = false;
  }, [value]);

  const arrow = (dir) => (
    <button
      type="button"
      onClick={() => listRef.current?.scrollBy({ left: dir * listRef.current.clientWidth * 0.6, behavior: 'smooth' })}
      aria-label={dir < 0 ? 'Scroll sections left' : 'Scroll sections right'}
      tabIndex={-1}
      className={cn(
        'absolute top-1/2 z-10 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-border-strong bg-surface text-text-secondary shadow-sm transition-opacity duration-200 hover:text-primary-text dark:bg-surface-secondary',
        dir < 0 ? 'left-2' : 'right-2',
        (dir < 0 ? edges.left : edges.right) ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      {dir < 0 ? <ChevronLeft className="size-4" aria-hidden="true" /> : <ChevronRight className="size-4" aria-hidden="true" />}
    </button>
  );

  return (
    <>
    <div ref={sentinelRef} className="-mb-px h-px" aria-hidden="true" />
    {/* Sticky under the top bar (its height = --app-header-h; 0 while the bar has slid away on scroll down, so this rides
        up with it). Pinned, it floats: fully rounded, nudged off the top bar, deeper shadow and a more solid background */}
    <div className="sticky top-[var(--app-header-h)] z-20 transition-[top] duration-300 ease-out">
      {/* Pinned: a band in the page colour spans the whole content width behind the bar (edge to edge, like an
          extension of the top bar), its bottom edge fading out — so content disappears under it instead of
          touching the bar. The negative insets match the page's side padding. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -inset-x-3 top-0 -bottom-7 bg-background/90 backdrop-blur-md transition-opacity duration-300 [mask-image:linear-gradient(to_bottom,black_70%,transparent)] sm:-inset-x-6',
          stuck ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        ref={pillRef}
        className={cn(
          'relative flex items-center overflow-hidden border border-glass-border backdrop-blur-xl transition-[border-radius,box-shadow,background-color,transform] duration-300',
          stuck
            ? 'translate-y-2 rounded-card bg-surface/90 shadow-raised dark:bg-surface-secondary/90' // nudged off the top bar without shifting the page
            : 'rounded-b-card bg-surface-sunken/70 shadow-card dark:bg-surface-sunken/60',
        )}
      >

      <div className="relative min-w-0 flex-1">
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        className={cn(
          'relative flex gap-1 overflow-x-auto scroll-smooth px-3 scrollbar-none',
          edges.left && edges.right && '[mask-image:linear-gradient(to_right,transparent,black_56px,black_calc(100%-56px),transparent)]',
          edges.left && !edges.right && '[mask-image:linear-gradient(to_right,transparent,black_56px)]',
          !edges.left && edges.right && '[mask-image:linear-gradient(to_left,transparent,black_56px)]',
        )}
      >
        {/* Sliding underline — a 3px blue bar on the card's bottom edge that glides to the open section (inset a little from the tab's sides) */}
        {pos && (
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute bottom-0 left-0 h-[3px] rounded-t-full bg-primary',
              pos.animate && 'transition-[transform,width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none',
            )}
            style={{ width: Math.max(pos.w - 16, 0), transform: `translateX(${pos.x + 8}px)` }}
          />
        )}
        {tabs.map((t) => {
          const on = t.value === value;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              data-value={t.value}
              id={`${idBase}-tab-${t.value}`}
              aria-selected={on}
              aria-controls={`${idBase}-panel-${t.value}`}
              onClick={() => onChange(t.value)}
              className={cn(
                // Plain labels; the open one is bold blue above the sliding underline. The others read as clickable: pointer
                // cursor, and on hover a soft rounded wash behind the label (inset from the bar's edges) + darker text
                'group relative isolate flex h-12 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap px-3 text-[13px] transition-colors duration-200 focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
                'before:absolute before:inset-x-0.5 before:inset-y-2 before:-z-10 before:rounded-lg before:transition-colors before:duration-200',
                // Same rounded wash for hover and the open tab (grey on hover, faint blue when open), so they read as one family
                on ? 'font-semibold text-primary-text before:bg-primary/[0.08]' : 'font-medium text-text-secondary hover:text-text hover:before:bg-text-muted/[0.09] active:before:bg-text-muted/[0.14]',
              )}
            >
              <t.icon className={cn('size-4 shrink-0 transition-colors', on ? 'text-primary-text' : 'text-text-muted group-hover:text-text-secondary')} aria-hidden="true" />
              {t.label}
              {/* Optional `dot` (a string = its tooltip), e.g. unsaved changes in that section */}
              {t.dot && <span className="size-1.5 shrink-0 rounded-full bg-primary" title={typeof t.dot === 'string' ? t.dot : undefined} aria-label={typeof t.dot === 'string' ? t.dot : undefined} />}
            </button>
          );
        })}
      </div>
      {arrow(-1)}
      {arrow(1)}
      </div>
      {/* Optional `end`: an action at the bar's right end (e.g. a facilitator's Portfolio) — only while it fits beside
          all the tabs (see endFits); otherwise it steps out (kept off-screen for measuring) and the page shows it elsewhere */}
      {end && (
        <div
          ref={endRef}
          aria-hidden={!endFits || undefined}
          className={cn('flex shrink-0 items-center pr-3 pl-1', !endFits && 'pointer-events-none invisible absolute right-0')}
        >
          {end}
        </div>
      )}
      </div>
    </div>
    </>
  );
}
