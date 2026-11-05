import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

/** Shared "Log out of LearnNext?" confirmation — used by the sidebar profile card and the header user menu. */
export function LogoutDialog({ open, onClose, onConfirm }) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      tone="primary"
      title="Log out of LearnNext?"
      description="You’ll need to sign in again to continue."
      confirmLabel="Log out"
      cancelLabel="Cancel"
    />
  );
}
