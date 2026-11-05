import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Check, Download, Eye, Lock, Minus, Pencil, Plus, Search, SearchX, Trash2, UserCog, Users, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useToast } from '@/hooks/useToast';
import { useAsync } from '@/hooks/useAsync';
import { ACCESS_ACTIONS, menuActions, menusApi, rolesAccessApi } from '@/services/api';
import { Button, Card, ConfirmDialog } from '@/components/ui';
import { EmptyState } from '@/components/feedback';
import { GROUP_TONES } from '../groupTones';
import { menuIcon } from '../menu-mapping/menuIcons';
import { toTree } from '../menu-mapping/menuTree';

const ACTION_META = {
  view: { label: 'View', icon: Eye },
  add: { label: 'Add', icon: Plus },
  edit: { label: 'Edit', icon: Pencil },
  delete: { label: 'Delete', icon: Trash2 },
  export: { label: 'Export', icon: Download },
  approve: { label: 'Approve', icon: BadgeCheck },
};
/**
 * The grid's checkbox. Draws its ✓ / – itself (no CSS `:checked` + sibling trick — that tick failed to paint inside the
 * sticky header in some browsers). Unticked = white box with a firm outline, so it stands out on the tinted rows.
 */
function GridBox({ checked, indeterminate, disabled, onChange, label }) {
  const on = checked || indeterminate;
  const Mark = indeterminate ? Minus : Check;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : Boolean(checked)}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        'inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] border shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50',
        on ? 'border-primary bg-primary text-white' : 'border-text-muted/55 bg-surface hover:border-primary/60',
      )}
    >
      {on && <Mark className="size-3" strokeWidth={3} aria-hidden="true" />}
    </button>
  );
}

// Colours handed out to roles in turn (any number of roles)
const ROLE_TONES = ['primary', 'rose', 'success', 'violet', 'warning', 'info'];

// The colour behind each role's header glow (same hues as its tile)
const ROLE_GLOW = {
  primary: 'var(--color-chart-1)',
  info: 'var(--color-info-main)',
  success: 'var(--color-success-main)',
  warning: 'var(--color-warning-main)',
  violet: 'var(--color-chart-4)',
  rose: '#e0527f',
};
const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
/** Keep actions in the standard order; any action implies View */
const normalize = (acts) => {
  const set = new Set(acts);
  if (set.size && !set.has('view')) set.add('view');
  return ACCESS_ACTIONS.filter((a) => set.has(a));
};
/** Aggregate state of a set of booleans → { checked, indeterminate } */
const agg = (values) => {
  const on = values.filter(Boolean).length;
  return { checked: values.length > 0 && on === values.length, indeterminate: on > 0 && on < values.length };
};

/**
 * Roles & Access (Settings → Others): what each admin role can open and do. Picked from previews: "Roles rail + matrix"
 * (a later "pages with action chips" version was undone — the user preferred this checkbox grid). No Add role here.
 * Left: the roles (initials tile in the role's colour, people and pages it can open); Super Admin is locked to full access.
 * Right: the selected role's access as a grid — the admin menu from Menu Mapping & Access down the side (Finance with its
 * sub-pages), actions across the top (View · Add · Edit · Delete · Export · Approve). Each page only offers the actions
 * that make sense for it (a quiet dot where an action doesn't apply). Row, column and parent checkboxes set many at once;
 * any action switches View on, and View off clears the row. Changes collect in a draft — a save bar slides up with the
 * count, Discard and Save; switching role with unsaved changes asks first.
 */
export default function RolesAccess() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => Promise.all([rolesAccessApi.list(), menusApi.list()]), []);
  // Roles are dynamic: one without a colour gets the next one in the palette, by its place in the list
  const roles = useMemo(() => (data?.[0] ?? []).map((r, i) => ({ ...r, tone: r.tone ?? ROLE_TONES[i % ROLE_TONES.length] })), [data]);
  const menus = useMemo(() => data?.[1] ?? [], [data]);

  const [roleId, setRoleId] = useState(null);
  // Opens on the first role you can edit (Admin) — Super Admin is locked, so there's nothing to do there by default
  const role = roles.find((r) => r.id === roleId) ?? roles.find((r) => !r.locked) ?? roles[0];
  const [draft, setDraft] = useState({});
  // A fresh draft whenever the role (or its saved access) changes
  useEffect(() => {
    if (role) setDraft(structuredClone(role.access));
  }, [role]);

  const [q, setQ] = useState('');
  const [roleQ, setRoleQ] = useState('');
  const shownRoles = roles.filter((r) => r.name.toLowerCase().includes(roleQ.trim().toLowerCase()));
  const [pendingRole, setPendingRole] = useState(null);
  const [saving, setSaving] = useState(false);

  // The menu as a tree; each row with the actions it offers, parents with their sub-pages
  const tree = useMemo(() => {
    const rows = toTree(menus).map((m) => ({ ...m, actions: menuActions(m, m.childCount > 0) }));
    return rows.map((m) => (m.childCount ? { ...m, kids: rows.filter((k) => k.parent === m.id) } : m));
  }, [menus]);
  const leaves = useMemo(() => tree.filter((m) => !m.childCount), [tree]);

  // Search keeps a parent when it or any sub-page matches (and all its sub-pages when the parent matches)
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return tree;
    const hit = (m) => m.name.toLowerCase().includes(s);
    return tree.filter((m) => {
      if (m.depth === 0) return hit(m) || m.kids?.some(hit);
      const parent = tree.find((p) => p.id === m.parent);
      return hit(m) || hit(parent);
    });
  }, [tree, q]);

  const locked = Boolean(role?.locked);
  const has = (id, a) => Boolean(draft[id]?.includes(a));
  const setActs = (id, acts) => setDraft((d) => ({ ...d, [id]: normalize(acts) }));
  const toggle = (m, a) => {
    const cur = draft[m.id] ?? [];
    if (cur.includes(a)) setActs(m.id, a === 'view' ? [] : cur.filter((x) => x !== a));
    else setActs(m.id, [...cur, a]);
  };
  // Set one action on many pages at once (only where it applies)
  const setMany = (targets, a, on) =>
    setDraft((d) => {
      const next = { ...d };
      targets.forEach((m) => {
        if (!m.actions.includes(a)) return;
        const cur = next[m.id] ?? [];
        next[m.id] = on ? normalize([...cur, a]) : a === 'view' ? [] : cur.filter((x) => x !== a);
      });
      return next;
    });
  const setFull = (targets, on) =>
    setDraft((d) => {
      const next = { ...d };
      targets.forEach((m) => (next[m.id] = on ? [...m.actions] : []));
      return next;
    });

  // Unsaved changes = (page, action) pairs that differ from what's saved
  const changes = useMemo(() => {
    if (!role) return 0;
    return leaves.reduce((n, m) => n + m.actions.filter((a) => has(m.id, a) !== Boolean(role.access[m.id]?.includes(a))).length, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, role, leaves]);
  const openPages = leaves.filter((m) => has(m.id, 'view')).length;

  const pick = (id) => {
    if (id === role?.id) return;
    if (changes) setPendingRole(id);
    else setRoleId(id);
  };
  const discard = () => role && setDraft(structuredClone(role.access));
  const save = async () => {
    setSaving(true);
    try {
      await rolesAccessApi.save(role.id, draft);
      toast.success('Access saved', { description: `${role.name} · ${changes} ${changes === 1 ? 'change' : 'changes'}` });
      reload();
    } catch (e) {
      toast.error('Couldn’t save access', { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <Card className="flex flex-col justify-center lg:flex-1">
        <EmptyState icon={SearchX} title="Couldn’t load roles" description={error.message} action={<Button onClick={reload}>Try again</Button>} />
      </Card>
    );
  }

  const tone = GROUP_TONES[role?.tone ?? 'primary'];

  return (
    <>
      <Card padding="none" className="grid grid-cols-1 overflow-hidden lg:h-[calc(100dvh-6.75rem)] lg:min-h-[24rem] lg:grid-cols-[248px_minmax(0,1fr)]">
        {/* Left: the roles */}
        <nav aria-label="Roles" className="flex min-h-0 min-w-0 flex-col border-b border-border bg-surface-sunken/40 lg:border-b-0 lg:border-r">
          <p className="hidden items-center justify-between px-4 pb-1 pt-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted lg:flex">
            Roles <span className="tabular-nums tracking-normal">{roles.length}</span>
          </p>
          {/* Roles grow over time — a quick filter by name */}
          <div className="px-2 pt-2 lg:pt-1">
            <label className="flex h-8 items-center gap-2 rounded-lg border border-border-strong bg-surface px-2.5 text-[13px] focus-within:ring-[3px] focus-within:ring-focus dark:bg-surface-secondary">
              <Search className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
              <input
                value={roleQ}
                onChange={(e) => setRoleQ(e.target.value)}
                placeholder="Search roles…"
                aria-label="Search roles"
                className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-muted"
              />
              {roleQ && (
                <button type="button" onClick={() => setRoleQ('')} aria-label="Clear role search" className="rounded text-text-muted hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              )}
            </label>
          </div>
          {shownRoles.length === 0 && <p className="px-4 py-6 text-center text-xs text-text-muted">No roles match “{roleQ.trim()}”</p>}
          <ul className="flex min-h-0 gap-1 overflow-x-auto p-2 scrollbar-none lg:flex-1 lg:flex-col lg:overflow-y-auto">
            {shownRoles.map((r) => {
              const on = r.id === role?.id;
              return (
                <li key={r.id} className="shrink-0">
                  {/* Kept simple, like the Settings hub's list: the role icon in the role's colour, the name (a lock on Super
                      Admin); the chosen one sits on a white pill */}
                  <button
                    type="button"
                    onClick={() => pick(r.id)}
                    aria-current={on ? 'true' : undefined}
                    className={cn(
                      'flex h-10 w-full items-center gap-2 whitespace-nowrap rounded-lg border px-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus',
                      on ? 'border-border-strong bg-surface font-semibold text-text shadow-xs dark:bg-elevated' : 'border-transparent font-medium text-text-secondary hover:bg-surface/70 hover:text-text',
                    )}
                  >
                    {/* Roles are dynamic, so every role gets the same role icon (user + gear), tinted in its own colour */}
                    <UserCog className={cn('size-4 shrink-0', GROUP_TONES[r.tone]?.icon ?? GROUP_TONES.primary.icon)} aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{r.name}</span>
                    {r.locked && <Lock className="size-3.5 shrink-0 text-text-muted" aria-label="Locked" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right: the selected role's access */}
        <section aria-label={role ? `${role.name} access` : 'Access'} className="relative flex min-h-0 min-w-0 flex-col">
          {/* Header: who, what it's for, how much it can open, search */}
          <div className="relative isolate flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-border px-5 py-3.5 sm:px-6">
            {/* A soft glow of the role's colour from the top-left corner (not a flat band across the whole header) */}
            <span
              className="pointer-events-none absolute inset-0 -z-10"
              style={{ background: `radial-gradient(70% 160% at 0% 0%, color-mix(in srgb, ${ROLE_GLOW[role?.tone] ?? ROLE_GLOW.primary} 11%, transparent), transparent 70%)` }}
              aria-hidden="true"
            />
            {role && (
              // Its details stay on one line; when there isn't room the search drops to a full-width row below
              // grow-[999]: on a shared row the details take the spare room, so the search keeps its 15rem
              <div className="flex min-w-[min(100%,26rem)] grow-[999] basis-0 items-center gap-3">
                <span className={cn('inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold ring-1 ring-inset', tone.head)}>{initials(role.name)}</span>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-text">{role.name}</h2>
                  <p className="flex items-center gap-x-2 overflow-hidden whitespace-nowrap text-xs text-text-muted">
                    {/* The description is the first thing to go on narrow screens; people + pages always fit */}
                    <span className="hidden truncate sm:inline">{role.description}</span>
                    <span className="hidden sm:inline" aria-hidden="true">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3" aria-hidden="true" />
                      {role.members} {role.members === 1 ? 'person' : 'people'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      Opens {openPages} of {leaves.length} pages
                    </span>
                  </p>
                </div>
              </div>
            )}
            {/* 15rem beside the details; when it wraps to its own row it grows to the full width */}
            <label className="flex h-9 grow basis-60 items-center gap-2 rounded-control border border-border-strong bg-surface px-3 text-sm focus-within:ring-[3px] focus-within:ring-focus dark:bg-surface-secondary">
              <Search className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages…" aria-label="Search pages" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-text-muted" />
            </label>
          </div>

          {locked && (
            <p className="flex items-center gap-2 border-b border-border bg-surface-sunken/50 px-5 py-2 text-xs text-text-secondary sm:px-6">
              <Lock className="size-3.5 shrink-0 text-text-muted" aria-hidden="true" />
              Super Admin always has every permission on every page — it can’t be changed.
            </p>
          )}

          {/* The grid: pages × actions */}
          <div className="min-h-0 flex-1 overflow-auto">
            {loading && !data ? (
              <p className="p-8 text-center text-sm text-text-muted">Loading access…</p>
            ) : rows.length === 0 ? (
              <EmptyState compact icon={SearchX} title="No pages match" description="Try a different search." />
            ) : (
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="sticky top-0 z-10 border-b border-border bg-surface px-5 py-2.5 text-left text-xs font-semibold text-text-secondary sm:px-6 dark:bg-surface-secondary">
                      Page
                    </th>
                    {ACCESS_ACTIONS.map((a) => {
                      const { label } = ACTION_META[a];
                      const targets = leaves.filter((m) => m.actions.includes(a));
                      const st = agg(targets.map((m) => has(m.id, a)));
                      return (
                        <th key={a} scope="col" className="sticky top-0 z-10 w-[96px] border-b border-border bg-surface px-1.5 py-2 text-center dark:bg-surface-secondary">
                          {/* Column header: one small pill — its checkbox sets the action on every page */}
                          <label
                            title={`${label} on every page`}
                            className={cn(
                              'inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-text-secondary transition-colors',
                              !locked && 'cursor-pointer hover:bg-surface-sunken hover:text-text',
                            )}
                          >
                            <GridBox
                              checked={st.checked}
                              indeterminate={st.indeterminate}
                              disabled={locked}
                              onChange={() => setMany(targets, a, !st.checked)}
                              label={`${label} on every page`}
                            />
                            {label}
                          </label>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((m) => {
                    const Icon = menuIcon(m.icon);
                    const group = m.childCount > 0;
                    const targets = group ? m.kids : [m];
                    // Row checkbox: every action on this page (a parent: on all its sub-pages)
                    const rowState = agg(targets.flatMap((t) => t.actions.map((a) => has(t.id, a))));
                    const open = targets.some((t) => has(t.id, 'view'));
                    return (
                      <tr key={m.id} className={cn('group/row transition-colors hover:bg-primary-soft/25', group && 'bg-surface-sunken/35')}>
                        <th scope="row" className="border-b border-border px-5 py-2.5 text-left font-normal sm:px-6">
                          <div className={cn('relative flex items-center gap-3', m.depth === 1 && 'pl-8')}>
                            {/* Tree connector for a sub-page */}
                            {m.depth === 1 && (
                              <span aria-hidden="true">
                                <span className={cn('absolute left-[7px] top-[-0.75rem] w-px bg-border-strong', m.last ? 'h-[calc(50%+0.75rem)]' : '-bottom-3')} />
                                <span className="absolute left-[7px] top-1/2 h-px w-4 bg-border-strong" />
                              </span>
                            )}
                            <GridBox
                              checked={rowState.checked}
                              indeterminate={rowState.indeterminate}
                              disabled={locked}
                              onChange={() => setFull(targets, !rowState.checked)}
                              label={`Full access to ${m.name}`}
                            />
                            <span
                              className={cn(
                                'inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                                open ? 'bg-primary-soft text-primary-text' : 'bg-surface-sunken text-text-muted ring-1 ring-inset ring-border',
                              )}
                            >
                              <Icon className="size-4" aria-hidden="true" />
                            </span>
                            <span className="min-w-0">
                              <span className={cn('block truncate', group ? 'font-semibold text-text' : open ? 'font-medium text-text' : 'text-text-secondary')}>{m.name}</span>
                              <span className="block truncate text-xs text-text-muted">{group ? `${m.childCount} sub-pages` : m.url}</span>
                            </span>
                          </div>
                        </th>
                        {ACCESS_ACTIONS.map((a) => {
                          const applies = group ? m.kids.filter((k) => k.actions.includes(a)) : m.actions.includes(a) ? [m] : [];
                          if (!applies.length) {
                            return (
                              <td key={a} className="border-b border-border text-center">
                                <span className="mx-auto block h-0.5 w-3 rounded-full bg-text-muted/40" title={`${ACTION_META[a].label} isn’t available on this page`} />
                              </td>
                            );
                          }
                          const st = agg(applies.map((t) => has(t.id, a)));
                          return (
                            <td key={a} className="border-b border-border text-center">
                              <span className="inline-flex">
                                <GridBox
                                  checked={st.checked}
                                  indeterminate={st.indeterminate}
                                  disabled={locked}
                                  onChange={() => (group ? setMany(applies, a, !st.checked) : toggle(m, a))}
                                  label={`${ACTION_META[a].label} — ${m.name}`}
                                />
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Unsaved changes: a bar slides up with the count, Discard and Save */}
          {changes > 0 && !locked && (
            <div className="flex animate-slide-up items-center justify-between gap-3 border-t border-border bg-surface/95 px-5 py-3 backdrop-blur sm:px-6 dark:bg-surface-secondary/95">
              <p className="flex items-center gap-2 text-[13px] text-text-secondary">
                <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                <span>
                  <span className="font-semibold tabular-nums text-text">{changes}</span> unsaved {changes === 1 ? 'change' : 'changes'} to {role.name}
                </span>
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={discard} disabled={saving}>
                  Discard
                </Button>
                <Button onClick={save} loading={saving}>
                  Save changes
                </Button>
              </div>
            </div>
          )}
        </section>
      </Card>

      <ConfirmDialog
        open={Boolean(pendingRole)}
        onClose={() => setPendingRole(null)}
        onConfirm={() => {
          setRoleId(pendingRole);
          setPendingRole(null);
        }}
        title="Discard your changes?"
        description={role ? `Your ${changes} unsaved ${changes === 1 ? 'change' : 'changes'} to ${role.name} won’t be saved.` : ''}
        confirmLabel="Discard"
        cancelLabel="Keep editing"
      />
    </>
  );
}
