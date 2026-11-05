import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Building2, FolderKanban, LayoutDashboard, LogIn, UserRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { ErrorScreen, Numerals, Planet, ghostOnDark, primaryOnDark } from './components/ErrorScreen';
import { Astronaut } from './components/Illustrations';

const DESTINATIONS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'All Clients', to: '/clients', icon: Building2 },
  { label: 'Projects', to: '/projects', icon: FolderKanban },
  { label: 'My Profile', to: '/profile', icon: UserRound },
];

/** 404 — full screen, top-level catch-all route (works signed in or out). */
export default function NotFound() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const canGoBack = typeof window !== 'undefined' && window.history.length > 1;

  return (
    <ErrorScreen
      tone="violet"
      docTitle="Page not found"
      title="Lost in space"
      description="The page you’re looking for drifted off the map — it may have moved, or the link is mistyped."
      illustration={
        <>
          <Numerals label="404">
            {'4'}
            <Planet moon={false} />
            {'4'}
          </Numerals>
          <div className="pointer-events-none absolute -right-20 -top-8 hidden w-24 sm:block lg:-right-28 lg:w-28" aria-hidden="true">
            <Astronaut />
          </div>
        </>
      }
      actions={
        <>
          <Button as={Link} to={isAuthenticated ? '/dashboard' : '/login'} size="lg" leftIcon={isAuthenticated ? LayoutDashboard : LogIn} className={primaryOnDark}>
            {isAuthenticated ? 'Back to dashboard' : 'Go to sign in'}
          </Button>
          {canGoBack && (
            <Button size="lg" variant="ghost" leftIcon={ArrowLeft} onClick={() => navigate(-1)} className={ghostOnDark}>
              Go back
            </Button>
          )}
        </>
      }
      extra={
        <div className="flex flex-col items-center gap-8">
          <p className="max-w-full truncate rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-xs text-white/65">{pathname}</p>
          {isAuthenticated && (
            <nav aria-label="Popular destinations">
              <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                {DESTINATIONS.map(({ label, to, icon: Icon }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="group inline-flex items-center gap-1.5 rounded text-[13px] font-medium text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {label}
                      <ArrowRight className="size-3.5 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-70" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      }
    />
  );
}
