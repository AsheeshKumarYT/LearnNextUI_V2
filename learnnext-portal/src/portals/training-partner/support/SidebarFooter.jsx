import { useNavigate } from 'react-router-dom';
import { Headset } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SidebarItem } from '@/components/navigation/SidebarItem';
import { SupportCard } from './SupportCard';

/**
 * Training Partner's sidebar footer (moved here from the shared Sidebar): the Support desk card in the expanded
 * sidebar (requests we answer); a compact icon item in the collapsed rail. (Who's signed in, profile and log out live in
 * the header's user menu — not repeated here.)
 */
export function SidebarFooter({ collapsed, onNavigate }) {
  const navigate = useNavigate();
  // The card / rail item opens the Support desk page (closing the mobile drawer on the way)
  const openSupport = () => {
    navigate('/support');
    onNavigate?.();
  };
  return (
    <div className={cn('relative shrink-0 p-3 pt-4', collapsed && 'flex flex-col items-center gap-1')}>
      {/* Soft fading divider instead of a hard rule */}
      <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" aria-hidden="true" />
      {!collapsed ? (
        <SupportCard onOpen={openSupport} />
      ) : (
        <ul className="flex w-full flex-col gap-0.5">
          <SidebarItem icon={Headset} label="Support desk" to="/support" collapsed={collapsed} onClick={onNavigate} />
        </ul>
      )}
    </div>
  );
}
