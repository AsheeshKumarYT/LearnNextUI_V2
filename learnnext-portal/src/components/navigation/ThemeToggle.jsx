import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Dropdown } from '@/components/ui/Dropdown';
import { IconButton } from '@/components/ui/IconButton';

export const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

/** Header theme menu: Light / Dark / System. `className` styles the trigger (e.g. light on the sign-in page's navy hero). */
export function ThemeToggle({ className }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <Dropdown
      className="min-w-40"
      items={THEME_OPTIONS.map((o) => ({ label: o.label, icon: o.icon, checked: theme === o.value, onSelect: () => setTheme(o.value) }))}
      trigger={<IconButton icon={resolvedTheme === 'dark' ? Moon : Sun} label="Change theme" className={className} />}
    />
  );
}
