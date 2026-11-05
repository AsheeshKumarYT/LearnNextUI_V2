import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, ChevronDown, LogOut, Settings, UserRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { interceptLeave } from '@/utils/leaveGuard';
import { Dropdown } from '@/components/ui/Dropdown';
import { Avatar } from '@/components/ui/Avatar';
import { THEME_OPTIONS } from './ThemeToggle';
import { roleCanOpen } from '@/config/roles';
import { LogoutDialog } from './LogoutDialog';

export function UserMenu() {
  const { user, role, roles, logout, switchRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const go = (to) => interceptLeave(to) || navigate(to); // a page with unsaved changes can step in first

  const handleLogout = () => {
    setConfirmLogout(false);
    logout();
    toast.info('You have been signed out', { afterLoad: true }); // once the sign-in page is showing
  };

  return (
    <>
      <Dropdown
        className="w-60"
        header={
          <div className="mb-1 flex items-center gap-3 border-b border-border px-2.5 pb-3 pt-2">
            <Avatar name={user?.name} src={user?.avatar} size="md" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-text">{user?.name}</p>
              <p className="truncate text-xs text-text-muted">{user?.email}</p>
            </div>
          </div>
        }
        items={[
          { label: 'My Profile', icon: UserRound, onSelect: () => go('/profile') },
          // Only roles that may open Settings (not Super Admin)
          ...(roleCanOpen(role, '/settings') ? [{ label: 'Settings', icon: Settings, onSelect: () => go('/settings') }] : []),
          // Accounts with several roles (e.g. Admin + Participant): back to the "Continue as" picker
          // The picker then opens the chosen role's own start page (see switchRole in AuthContext)
          ...(roles.length > 1
            ? [
                {
                  label: 'Switch role',
                  icon: ArrowLeftRight,
                  onSelect: () => {
                    if (interceptLeave('/choose-role')) return;
                    switchRole();
                  },
                },
              ]
            : []),
          { type: 'separator' },
          { type: 'label', label: 'Theme' },
          ...THEME_OPTIONS.map((o) => ({ key: `theme-${o.value}`, label: o.label, icon: o.icon, checked: theme === o.value, onSelect: () => setTheme(o.value) })),
          { type: 'separator' },
          // Asks for confirmation first (same dialog as the sidebar)
          { label: 'Log out', icon: LogOut, onSelect: () => setConfirmLogout(true) },
        ]}
        trigger={
          <button
            type="button"
            aria-label="Open user menu"
            className="flex items-center gap-2 rounded-full p-0.5 pr-0.5 transition-colors hover:bg-surface-sunken focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus sm:rounded-lg sm:pr-2"
          >
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
            <span className="hidden max-w-32 truncate text-[13px] font-medium text-text xl:block">{user?.name?.split(' ')[0]}</span>
            <ChevronDown className="hidden size-4 text-text-muted sm:block" aria-hidden="true" />
          </button>
        }
      />
      <LogoutDialog open={confirmLogout} onClose={() => setConfirmLogout(false)} onConfirm={handleLogout} />
    </>
  );
}
