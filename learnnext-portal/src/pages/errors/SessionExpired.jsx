import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Avatar, Button } from '@/components/ui';
import { ErrorScreen, primaryOnDark, usePreview } from './components/ErrorScreen';
import { SleepyMoon } from './components/Illustrations';

/**
 * Session expired — navigate here when the API rejects the token (401). Signing in again clears the old session.
 * In the UI Preview gallery the buttons don't sign you out.
 */
export default function SessionExpired() {
  const preview = usePreview();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, logout } = useAuth();

  const signInAgain = () => {
    if (preview) {
      toast.info('Preview only', { description: 'In real use this signs you out and opens the sign-in page.' });
      return;
    }
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <ErrorScreen
      tone="indigo"
      docTitle="Session expired"
      showAccount={false}
      illustration={<SleepyMoon />}
      eyebrow="Session expired"
      title="Your session took a nap"
      description="For your security, we signed you out after a period of inactivity. Sign in again to pick up where you left off."
      actions={
        <Button size="lg" leftIcon={LogIn} onClick={signInAgain} className={primaryOnDark}>
          Sign in again
        </Button>
      }
      extra={
        user && (
          <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-1.5 pr-4 text-left backdrop-blur-md">
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <span className="text-xs leading-tight">
              <span className="block text-white/55">Last signed in as</span>
              <span className="block font-semibold text-white">{user.name}</span>
            </span>
          </div>
        )
      }
    />
  );
}
