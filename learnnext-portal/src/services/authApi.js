/** Auth (mock sign-in) and the signed-in person’s profile + own activity. (Split from services/api.js — import from '@/services/api', which re-exports everything.) */
import * as demo from '@/data/demoData';
import { sleep, uid } from '@/utils/helpers';
import { STORAGE_KEYS } from '@/config/app';
import { mock } from './coreApi';

/* ------------------------------------------------------------------ Auth */
/** Shown on the login screen while auth is mocked. Remove with the mock layer. */
export const DEMO_CREDENTIALS = demo.demoCredentials;

export const authApi = {
  async login({ email, password }) {
    await sleep(700);
    const ok = email.trim().toLowerCase() === demo.demoCredentials.email && password === demo.demoCredentials.password;
    if (!ok) {
      const err = new Error('The email or password you entered is incorrect.');
      err.status = 401;
      throw err;
    }
    return { token: uid('tok'), user: readProfile() };
  },
  /** Current user's profile — refreshed on app load so a stored session never shows stale details. */
  me: () => mock(readProfile(), 0),
  async requestPasswordReset(email) {
    await sleep(700);
    return { email };
  },
  async resetPassword() {
    await sleep(700);
    return { ok: true };
  },
};

/* --------------------------------------------------------------- Profile */
// Mock-only: profile edits are kept in localStorage so they survive a reload (a real API would persist them).
function readProfile() {
  try {
    // Role / roles always come from the account (never a saved copy), so a renamed role shows everywhere at once
    const { role, roles, ...saved } = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile) || '{}');
    return { ...demo.demoUser, ...saved };
  } catch {
    return { ...demo.demoUser };
  }
}
function writeProfile(patch) {
  const next = { ...readProfile(), ...patch };
  try {
    const { id, ...rest } = next;
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(rest));
  } catch {
    /* storage full or unavailable — keep the in-memory result */
  }
  return next;
}
const maskEmail = (e) => e.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '•'.repeat(Math.max(2, b.length)) + c);
const maskPhone = (p) => p.replace(/\d(?=(?:\D*\d){4})/g, '•');

export const DEMO_OTP = demo.demoOtp;

// Mock-only: the activity feed lives in memory; profile actions below add entries so the feed reacts live.
const activityStore = [...demo.activityLog];
const logActivity = (entry) => activityStore.unshift({ id: uid('act'), at: new Date().toISOString(), ...entry });
const FIELD_LABELS = { name: 'name', email: 'email', phone: 'mobile number', location: 'location', department: 'department', designation: 'designation', bio: 'about' };

function logProfileChange(before, patch) {
  if ('avatar' in patch) return logActivity({ module: 'profile', kind: 'avatar', verb: patch.avatar ? 'Changed your' : 'Removed your', entity: 'profile picture', detail: 'Visible across LearnNext' });
  if ('cover' in patch) return logActivity({ module: 'profile', kind: 'cover', verb: 'Switched your', entity: 'profile cover', detail: 'New animated cover' });
  const changed = Object.keys(patch).filter((k) => FIELD_LABELS[k] && (patch[k] ?? '') !== (before[k] ?? ''));
  if (!changed.length) return;
  const names = changed.map((k) => FIELD_LABELS[k]);
  logActivity({
    module: 'profile',
    kind: 'profile',
    verb: 'Updated your',
    entity: names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2} more` : names.join(' & '),
    detail: 'Personal details',
  });
}

export const profileApi = {
  get: () => mock(readProfile(), 300),
  departments: () => demo.departments,
  /** Where a verification code can be sent, with masked destinations for display */
  otpChannels() {
    const p = readProfile();
    return [
      { channel: 'email', destination: maskEmail(p.email) },
      { channel: 'phone', destination: maskPhone(p.phone) },
    ];
  },
  async update(patch) {
    await sleep(600);
    logProfileChange(readProfile(), patch);
    return structuredClone(writeProfile(patch));
  },
  /** { entries: newest first, heat: [{ date, count }] for the last 84 days } */
  activity() {
    // Today's cell also counts what happened in this session
    const today = new Date().toDateString();
    const todayCount = activityStore.filter((a) => new Date(a.at).toDateString() === today).length;
    const heat = demo.activityHeat.map((d, i, all) => (i === all.length - 1 ? { ...d, count: Math.max(d.count, todayCount) } : d));
    return mock({ entries: activityStore, heat }, 350);
  },
  /** channel: email | phone. Returns where the code went (masked) and how long it's valid. */
  async sendOtp(channel) {
    await sleep(800);
    const p = readProfile();
    return { channel, destination: channel === 'phone' ? maskPhone(p.phone) : maskEmail(p.email), expiresIn: 300 };
  },
  async verifyOtp(code) {
    await sleep(700);
    if (code !== demo.demoOtp) {
      const err = new Error('That code isn’t right. Check it and try again.');
      err.status = 422;
      throw err;
    }
    return { token: uid('otp') };
  },
  async changePassword() {
    await sleep(800);
    logActivity({ module: 'security', kind: 'password', verb: 'Changed your', entity: 'password', detail: 'Verified with a one-time code' });
    return structuredClone(writeProfile({ passwordChangedAt: new Date().toISOString() }));
  },
};
