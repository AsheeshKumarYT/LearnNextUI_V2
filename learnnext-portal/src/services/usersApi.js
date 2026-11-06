/** Settings → Users & Access → Manage Users: the people who can sign in, with their login details. (Import from '@/services/api'.) */
import * as demo from '@/data/demoData';
import { uid } from '@/utils/helpers';
import { mock } from './coreApi';

/** Which app a login is for — Requires Confirmation (from the old system's "Application" field) */
export const USER_APPLICATIONS = ['LearnNext', 'Prism'];
export const USER_GENDERS = ['Female', 'Male', 'Other'];

const face = (id) => `https://images.unsplash.com/photo-${id}?w=96&h=96&fit=crop&crop=faces&q=80`;
const ago = (days) => new Date(Date.now() - days * 864e5).toISOString();
const ADDR = {
  delhi: { line1: '12, Nehru Place', line2: 'Near Metro Station', country: 'India', state: 'Delhi', city: 'New Delhi', pin: '110019' },
  gurugram: { line1: 'Tower B, Global Business Park', line2: 'MG Road', country: 'India', state: 'Haryana', city: 'Gurugram', pin: '122002' },
  mumbai: { line1: '702, Lotus Corporate Park', line2: 'Goregaon East', country: 'India', state: 'Maharashtra', city: 'Mumbai', pin: '400063' },
  pune: { line1: 'B-14, Magarpatta City', line2: 'Hadapsar', country: 'India', state: 'Maharashtra', city: 'Pune', pin: '411013' },
  bengaluru: { line1: 'Prestige Tech Park, Block 3', line2: 'Outer Ring Road', country: 'India', state: 'Karnataka', city: 'Bengaluru', pin: '560103' },
};

// [name, gender, role, designation, username, email, mobile, city, application, isAdmin, parentIndex, photoId, daysAgo, status]
const SEED = [
  ['Meera Iyer', 'Female', 'HR Manager', 'Head L&D', 'meera.iyer@titan.example', 'meera.iyer@titan.example', '9810011223', 'bengaluru', 'LearnNext', true, null, '1494790108377-be9c29b29330', 3, 'active'],
  ['Kunal Bhatia', 'Male', 'Participant', 'Sr. KAM', 'kunal.bhatia@titan.example', 'kunal.bhatia@titan.example', '9810011224', 'bengaluru', 'LearnNext', false, 0, '1500648767791-00dcc994a43e', 3, 'active'],
  ['Sneha Rao', 'Female', 'Participant', 'HR Executive', 'sneha.rao@titan.example', 'sneha.rao@titan.example', '9810011225', 'bengaluru', 'LearnNext', false, 0, '1438761681033-6461ffad8d80', 4, 'active'],
  ['Vikram Sethi', 'Male', 'Program Manager', 'Senior Project Manager', 'vikram.sethi', 'vikram.sethi@learnnext.example', '9810011226', 'delhi', 'LearnNext', true, null, '1506794778202-cad84cf45f1d', 40, 'active'],
  ['Ananya Kulkarni', 'Female', 'Trainer', '', 'TRANA201', 'ananya.k@trainers.example', '9810011227', 'pune', 'LearnNext', false, 3, '1544005313-94ddf0286df2', 22, 'active'],
  ['Rahul Menon', 'Male', 'Trainer', '', 'TRRAH202', 'rahul.menon@trainers.example', '', 'mumbai', 'LearnNext', false, 3, '', 21, 'active'],
  ['Pooja Nair', 'Female', 'Participant', 'Executive', 'pooja.nair@hero.example', 'pooja.nair@hero.example', '9810011228', 'gurugram', 'Prism', false, 7, '', 9, 'active'],
  ['Arvind Chauhan', 'Male', 'Manager', 'Vice President', 'arvind.chauhan@hero.example', 'arvind.chauhan@hero.example', '9810011229', 'gurugram', 'Prism', true, null, '1472099645785-5658abf4ff4e', 10, 'active'],
  ['Farah Siddiqui', 'Female', 'Participant', 'BDE', 'farah.s@hero.example', 'farah.s@hero.example', '9810011230', 'gurugram', 'Prism', false, 7, '1534528741775-53994a69daeb', 9, 'inactive'],
  ['Deepak Joshi', 'Male', 'Finance', 'Finance Manager', 'deepak.joshi', 'deepak.joshi@learnnext.example', '9810011231', 'delhi', 'LearnNext', false, null, '', 60, 'active'],
  ['Tanvi Desai', 'Female', 'Channel Partner', '', 'tanvi.desai@partners.example', 'tanvi.desai@partners.example', '9810011232', 'mumbai', 'LearnNext', false, null, '', 15, 'active'],
  ['Harish Pillai', 'Male', 'Participant', 'Junior Engineer', 'harish.pillai@hindalco.example', 'harish.pillai@hindalco.example', '', 'mumbai', 'LearnNext', false, 12, '', 2, 'active'],
  ['Ritika Bansal', 'Female', 'HR Manager', 'Employee Experience Manager', 'ritika.bansal@hindalco.example', 'ritika.bansal@hindalco.example', '9810011233', 'mumbai', 'LearnNext', true, null, '1580489944761-15a19d654956', 2, 'active'],
  ['Sanjay Verma', 'Male', 'Audit', '', 'sanjay.verma', 'sanjay.verma@learnnext.example', '9810011234', 'delhi', 'LearnNext', false, null, '', 90, 'inactive'],
  ['Neelam Arora', 'Female', 'Trainer', '', 'TRNEE203', 'neelam.arora@trainers.example', '9810011235', 'delhi', 'LearnNext', false, 3, '', 18, 'active'],
  ['Aditya Rao', 'Male', 'BD', 'TL-BD', 'aditya.rao', 'aditya.rao@learnnext.example', '9810011236', 'bengaluru', 'LearnNext', false, null, '', 33, 'active'],
  ['Kavya Reddy', 'Female', 'Participant', 'HR Management Trainee', 'kavya.reddy@titan.example', 'kavya.reddy@titan.example', '9810011237', 'bengaluru', 'Prism', false, 0, '', 1, 'active'],
  ['Imran Qureshi', 'Male', 'Participant', 'Sr. BDE', 'imran.q@hindalco.example', 'imran.q@hindalco.example', '9810011238', 'pune', 'LearnNext', false, 12, '', 1, 'active'],
];

export const userStore = SEED.map(([name, gender, role, designation, username, email, mobile, city, application, isAdmin, parent, photo, days, status], i) => ({
  id: `usr-${i + 1}`,
  name,
  gender,
  dob: `19${85 + (i % 12)}-0${(i % 9) + 1}-1${i % 9}`,
  email,
  altEmail: '',
  mobile,
  altMobile: '',
  address: { ...ADDR[city] },
  role,
  designation,
  isAdmin,
  parent: parent === null ? '' : `usr-${parent + 1}`,
  application,
  username,
  photo: photo ? face(photo) : '',
  status,
  createdAt: ago(days),
  passwordChangedAt: ago(Math.max(0, days - 1)),
}));

const same = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();
const strip = ({ password, confirmPassword, ...rest }) => rest; // passwords are never stored or sent back

export const usersApi = {
  /** Every user, newest first (filtering / sorting happen on the page) */
  list: () => mock([...userStore].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))),

  get: (id) => structuredClone(userStore.find((u) => u.id === id) ?? null),

  /** Dropdown lists for the form: roles and designations from their masters (enabled only), locations, applications */
  lookups: () => ({
    roles: demo.crmRoles.filter((r) => r.enabled).map((r) => r.name),
    designations: [...new Set(demo.crmDesignations.filter((d) => d.enabled).map((d) => d.name))].sort(),
    geo: demo.clientLookups.geo,
    applications: USER_APPLICATIONS,
    genders: USER_GENDERS,
  }),

  /** Usernames and emails must be unique (case-insensitive) */
  usernameTaken: (username, exceptId) => userStore.some((u) => u.id !== exceptId && same(u.username, username)),
  emailTaken: (email, exceptId) => userStore.some((u) => u.id !== exceptId && same(u.email, email)),

  async create(form) {
    if (usersApi.usernameTaken(form.username)) throw new Error('Another user already has this username.');
    if (usersApi.emailTaken(form.email)) throw new Error('Another user already uses this email.');
    const now = new Date().toISOString();
    const user = { ...strip(structuredClone(form)), id: uid('usr'), username: form.username.trim(), status: 'active', createdAt: now, passwordChangedAt: now };
    userStore.unshift(user);
    return mock(user, 700);
  },

  async update(id, form) {
    const i = userStore.findIndex((u) => u.id === id);
    if (i < 0) throw new Error('This user no longer exists.');
    if (usersApi.usernameTaken(form.username, id)) throw new Error('Another user already has this username.');
    if (usersApi.emailTaken(form.email, id)) throw new Error('Another user already uses this email.');
    userStore[i] = { ...userStore[i], ...strip(structuredClone(form)) };
    return mock(userStore[i], 700);
  },

  /** Sets a new password (demo: only the "changed" date is kept) */
  async setPassword(id) {
    const u = userStore.find((x) => x.id === id);
    if (!u) throw new Error('This user no longer exists.');
    u.passwordChangedAt = new Date().toISOString();
    return mock(true, 600);
  },

  /** Removes a user; anyone reporting to them loses their parent user */
  async remove(id) {
    const i = userStore.findIndex((u) => u.id === id);
    if (i >= 0) userStore.splice(i, 1);
    userStore.forEach((u) => {
      if (u.parent === id) u.parent = '';
    });
    return mock(true, 400);
  },
};
