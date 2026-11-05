import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Check, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PORTAL_ROLES } from '@/config/roles';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui';

// Where the portal stands, as a quiet three-step track: [label, state]
const STAGES = [
  ['Designed', 'done'],
  ['Building', 'now'],
  ['Launch', 'next'],
];

/**
 * "On its way" — shown to a role whose portal isn't built yet (Facilitator, Participant, Client SPOC for now), in the
 * sign-in card. Offers Switch role (accounts with several roles) and Sign out.
 */
export default function RoleComingSoon() {
  const { role, roles, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const r = PORTAL_ROLES[role];
  if (!role || !r) return <Navigate to="/choose-role" replace />;
  if (r.ready) return <Navigate to="/dashboard" replace />;

  const switchTo = () => {
    switchRole();
    navigate('/choose-role', { replace: true });
  };

  return (
    <>
      <span className={cn('mb-5 inline-flex size-12 animate-scale-in items-center justify-center rounded-2xl', r.tint)}>
        <r.icon className="size-6" aria-hidden="true" />
      </span>
      <h1 className="text-2xl font-semibold tracking-[-0.025em] text-text">The {r.label} space is on its way</h1>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {r.coming} We’re still building it — check back soon.
      </p>

      {/* Quiet progress track */}
      <ol className="mt-6 flex items-center gap-2 text-xs" aria-label="Progress">
        {STAGES.map(([label, state], i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full',
                state === 'done' && 'bg-success-soft text-success',
                state === 'now' && 'bg-primary-soft ring-[3px] ring-primary/15',
                state === 'next' && 'border border-border-strong',
              )}
            >
              {state === 'done' && <Check className="size-3" strokeWidth={3} aria-hidden="true" />}
              {state === 'now' && <span className="size-1.5 rounded-full bg-primary motion-safe:animate-pulse" />}
            </span>
            <span className={cn('font-medium', state === 'next' ? 'text-text-muted' : 'text-text')}>
              {label}
              {state === 'now' && <span className="sr-only"> (current)</span>}
            </span>
            {i < STAGES.length - 1 && <span className="h-px min-w-3 flex-1 bg-border-strong" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-2.5">
        {roles.length > 1 && (
          <Button size="lg" fullWidth leftIcon={ArrowLeftRight} onClick={switchTo}>
            Switch role
          </Button>
        )}
        <Button size="lg" fullWidth variant={roles.length > 1 ? 'ghost' : 'primary'} leftIcon={LogOut} onClick={logout}>
          Sign out
        </Button>
      </div>
    </>
  );
}
