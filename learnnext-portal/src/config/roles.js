import { Building2, Crown, GraduationCap, Presentation, ShieldCheck } from 'lucide-react';

/**
 * The roles a person can sign in as. One email + password can carry several (e.g. Training Partner and Super Admin);
 * after signing in they pick one on /choose-role (listed in the order of the account's `roles`). `ready` = that role's
 * portal exists — the rest land on the "on its way" screen (/coming-soon) until it's built.
 *
 * Here: who a role is and what it may open —
 *   label     its name (role picker, the line under the logo)
 *   home      where it starts after picking the role
 *   allow     path prefixes it may open (a "limited" portal); anything else sends it to `home`. No list = everything.
 * What its shell shows (menu, tabs, page names, search…) lives in src/portals/<role>/portal.js.
 * tint = icon tile colours (soft, as everywhere else).
 */
export const PORTAL_ROLES = {
  admin: {
    label: 'Training Partner',
    description: 'Clients and content', // short: shown on one line in a half-width role tile
    icon: ShieldCheck,
    tint: 'bg-primary-soft text-primary-text',
    ready: true,
    home: '/dashboard',
  },
  'super-admin': {
    label: 'Super Admin',
    description: 'Manage clients',
    icon: Crown,
    tint: 'bg-warning-soft text-warning',
    ready: true,
    home: '/clients',
    allow: ['/clients', '/profile'],
  },
  facilitator: {
    label: 'Facilitator',
    description: 'Run your sessions',
    icon: Presentation,
    tint: 'bg-success-soft text-success',
    ready: false,
    coming: 'Your sessions, attendance and session content — all in one place.',
  },
  participant: {
    label: 'Participant',
    description: 'Your learning journey',
    icon: GraduationCap,
    tint: 'bg-[#f3eefe] text-[#6d4fc2] dark:bg-[#6d4fc2]/20 dark:text-[#c4b2f5]',
    ready: false,
    coming: 'Your programs, modules, assessments and progress — step by step.',
  },
  spoc: {
    label: 'Client SPOC',
    description: 'Your company’s programs',
    icon: Building2,
    tint: 'bg-[#e8f4f1] text-[#2f7f72] dark:bg-[#2f7f72]/20 dark:text-[#9fd8cc]',
    ready: false,
    coming: 'Your company’s projects, participants and reports at a glance.',
  },
};

/** The user's roles (known ones only); accounts without a list are Training Partners */
export const rolesOf = (user) => (user?.roles?.length ? user.roles : ['admin']).filter((r) => PORTAL_ROLES[r]);

/** May this role open `path`? (no `allow` list = everything) */
export function roleCanOpen(role, path) {
  const allow = PORTAL_ROLES[role]?.allow;
  if (!allow) return true;
  const p = path.split(/[?#]/)[0];
  return allow.some((a) => p === a || p.startsWith(`${a}/`));
}
