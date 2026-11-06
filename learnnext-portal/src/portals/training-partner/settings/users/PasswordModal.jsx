import { useEffect, useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { usersApi } from '@/services/api';
import { Button, FormField, Input, Modal } from '@/components/ui';
import { passwordProblem } from './userRules';
import { PasswordHint, PasswordMatch } from './PasswordHint';

/**
 * "Change password" for one user (the old list's Manage Password → edit): new password twice. Guidance picked from
 * previews ("One quiet hint line"): a thin strength bar + one rule line under New password, "✓ Passwords match" under
 * Confirm. Messages: missing values after Save; a weak / mismatched password once the field is left.
 */
export function PasswordModal({ user, onClose }) {
  const toast = useToast();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({});
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setPw('');
      setConfirm('');
      setTouched({});
      setTried(false);
      setSaving(false);
    }
  }, [user]);

  const pwError = passwordProblem(pw);
  const confirmError = !confirm ? 'Type the password again' : confirm !== pw ? 'The passwords don’t match' : '';
  const show = (k, msg, value) => (tried || (touched[k] && value) ? msg || undefined : undefined);

  const save = async () => {
    setTried(true);
    if (pwError || confirmError) return;
    setSaving(true);
    try {
      await usersApi.setPassword(user.id);
      toast.success('Password changed', { description: `${user.name} can sign in with the new password.` });
      onClose();
    } catch (e) {
      toast.error('Couldn’t change the password', { description: e.message });
      setSaving(false);
    }
  };

  return (
    <Modal
      open={Boolean(user)}
      onClose={onClose}
      size="md"
      icon={KeyRound}
      title="Change password"
      description={user ? `${user.name} · ${user.username}` : ''}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={save} loading={saving}>
            Change password
          </Button>
        </>
      }
    >
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <FormField label="New password" required error={show('pw', pwError, pw)}>
          <Input type="password" autoComplete="new-password" autoFocus placeholder="Set a new password" value={pw} onChange={(e) => setPw(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, pw: true }))} />
          <PasswordHint password={pw} />
        </FormField>
        <FormField label="Confirm password" required error={show('confirm', confirmError, confirm)}>
          <Input type="password" autoComplete="new-password" placeholder="Type it again" value={confirm} onChange={(e) => setConfirm(e.target.value)} onBlur={() => setTouched((t) => ({ ...t, confirm: true }))} />
          <PasswordMatch password={pw} confirm={confirm} />
        </FormField>
        <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}
