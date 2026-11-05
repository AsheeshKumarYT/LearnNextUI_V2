import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { PORTAL_ROLES, roleCanOpen } from '@/config/roles';
import { cn } from '@/utils/cn';
import { Avatar, Button, Checkbox } from '@/components/ui';
import { AuthHeading } from './components/AuthHeading';

/**
 * "Continue as" — after sign-in, a login linked to several roles picks one here, in the same card as the sign-in form.
 * Works like a form (picked from previews: "Two-column tiles"): radio tiles, 2 per row (icon beside name + one-line
 * description; the chosen one tinted with its icon tile filled in) so many roles stay compact, roles whose portal isn't built yet faded and disabled, "Remember my choice", then one big "Continue as …" button. Remembering skips this
 * next time on this device (Switch role in the user menu brings it back).
 */
export default function ChooseRole() {
  const { user, roles, chooseRole, logout, switching } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [rememberIt, setRememberIt] = useState(false);
  const [selected, setSelected] = useState(() => roles.find((k) => PORTAL_ROLES[k].ready) ?? null);
  const first = user?.name?.split(' ')[0] ?? 'there';

  // Nothing to choose (a single-role account landing here) — straight on
  const only = roles.length === 1 ? roles[0] : null;
  useEffect(() => {
    if (!only) return;
    chooseRole(only);
    navigate(PORTAL_ROLES[only].ready ? '/dashboard' : '/coming-soon', { replace: true });
  }, [only, chooseRole, navigate]);
  if (only) return null;

  const onContinue = (e) => {
    e.preventDefault();
    if (!selected) return;
    chooseRole(selected, rememberIt);
    // Back to the page they asked for if this role may open it, else the role's own home (Super Admin → Manage Clients)
    const from = location.state?.from;
    // A limited portal (Super Admin) always starts on its home: the same address can mean a different page there
    // (e.g. /clients/cl-1 is a Training Partner's client, not one of Super Admin's)
    const own = !PORTAL_ROLES[selected].allow;
    const back = own && !switching && from && roleCanOpen(selected, from.pathname) && from.pathname !== '/dashboard' ? `${from.pathname}${from.search ?? ''}` : null;
    toast.success(`Welcome back, ${first}`, { afterLoad: true }); // shown once the portal's page has loaded
    navigate(back ?? PORTAL_ROLES[selected].home ?? '/dashboard', { replace: true });
  };

  return (
    <>
      {/* Who's signed in — so a shared device makes it obvious */}
      <div className="mb-6 flex items-center gap-3 max-lg:mb-4">
        <Avatar name={user?.name} src={user?.avatar} size="md" />
        <div className="min-w-0 text-[13px] leading-5">
          <p className="truncate font-semibold text-text">Hi {first}</p>
          <p className="truncate text-text-muted">{user?.email}</p>
        </div>
      </div>

      <AuthHeading
        title="Continue as"
        description={`Your login is linked to ${roles.length} roles. Choose the one you want to use for this visit.`}
        className="!mb-5"
      />

      <form onSubmit={onContinue} className="flex flex-col gap-5 max-lg:gap-4">
        {/* Two-column tiles (picked from previews): icon tile + name + short line, so more roles fit without a long list */}
        <fieldset className="grid grid-cols-2 gap-2.5 max-lg:gap-2">
          <legend className="sr-only">Your roles</legend>
          {roles.map((key, i) => {
            const r = PORTAL_ROLES[key];
            const on = selected === key;
            return (
              <label
                key={key}
                title={r.ready ? r.description : `${r.label} — coming soon`}
                className={cn(
                  // Phones (half-width tiles are narrow): icon above the name so nothing is cut off
                  'flex min-w-0 animate-rise items-center gap-2.5 rounded-xl border p-3 max-sm:flex-col max-sm:items-start max-sm:gap-2 max-sm:p-2.5 transition-[background-color,border-color,box-shadow] has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-focus',
                  !r.ready
                    ? // Only the content fades — the dashed border stays at full strength so the tile keeps a clear edge
                      'cursor-not-allowed border-dashed border-text-muted/45 [&>*]:opacity-50'
                    : on
                      ? 'cursor-pointer border-primary/60 bg-primary-soft/70 dark:bg-primary/15'
                      : 'cursor-pointer border-border-strong bg-surface hover:border-primary/40 lg:border-primary/20 lg:bg-white/40 dark:lg:border-white/15 dark:lg:bg-white/[0.03]',
                )}
                style={{ animationDelay: `${100 + i * 50}ms` }}
              >
                <input type="radio" name="role" value={key} checked={on} disabled={!r.ready} onChange={() => setSelected(key)} className="sr-only" />
                <span
                  className={cn(
                    'inline-flex size-9 shrink-0 items-center max-sm:size-8 justify-center rounded-lg transition-colors',
                    // Chosen: the icon tile fills in (with a little pop) — no extra check mark needed
                    on ? 'bg-primary text-white motion-safe:animate-toast-pop' : 'bg-surface-sunken text-text-secondary dark:bg-white/[0.06]',
                  )}
                  aria-hidden="true"
                >
                  <r.icon className="size-[18px]" />
                </span>
                <span className="min-w-0 flex-1 leading-5 max-sm:w-full">
                  <span className={cn('block truncate text-[14px] font-semibold', on ? 'text-primary-text' : 'text-text')}>{r.label}</span>
                  <span className="block truncate text-[12px] leading-[18px] text-text-secondary">{r.ready ? r.description : 'Coming soon'}</span>
                </span>
              </label>
            );
          })}
        </fieldset>

        <Checkbox label="Remember my choice on this device" checked={rememberIt} onChange={(e) => setRememberIt(e.target.checked)} />

        <Button type="submit" size="lg" fullWidth rightIcon={ArrowRight} disabled={!selected}>
          {selected ? `Continue as ${PORTAL_ROLES[selected].label}` : 'Continue'}
        </Button>
      </form>

      <p className="mt-5 text-center text-[13px] text-text-muted max-lg:mt-3">
        Not you?{' '}
        <button
          type="button"
          onClick={logout}
          className="rounded font-medium text-primary-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          Sign out
        </button>
      </p>
    </>
  );
}
