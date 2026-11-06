/**
 * Manage Users form — empty values, steps and validation (Settings → Users & Access → Manage Users).
 * Field list follows the old system's "Personal Detail" + "User Detail" form.
 */
export const EMPTY_USER = {
  name: '',
  gender: '',
  dob: '',
  email: '',
  altEmail: '',
  mobile: '',
  altMobile: '',
  photo: '',
  address: { line1: '', line2: '', country: 'India', state: '', city: '', pin: '' },
  role: '',
  designation: '',
  isAdmin: false,
  parent: '',
  application: '',
  username: '',
  password: '',
  status: 'active',
};

/** Which fields each step holds (address fields as "address.<field>"); the password only when adding */
export const USER_STEPS = [
  { label: 'Personal', fields: ['name', 'gender', 'dob', 'email', 'altEmail', 'mobile', 'altMobile', 'photo'] },
  { label: 'Address', fields: ['address.line1', 'address.line2', 'address.country', 'address.state', 'address.city', 'address.pin'] },
  { label: 'Login & role', fields: ['role', 'designation', 'isAdmin', 'parent', 'application', 'username', 'password'] },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE = /^[6-9]\d{9}$/;
const USERNAME = /^[A-Za-z0-9._@-]{4,60}$/;

/**
 * A password needs the first three rules of the app's strength checklist (PasswordStrength): 8+ characters, upper and
 * lowercase letters, a number (a symbol only makes it stronger). Returns a message, or '' when it's fine.
 */
export function passwordProblem(p) {
  if (!p) return 'Enter a password';
  if (p.length < 8) return 'Use at least 8 characters';
  if (!/[A-Z]/.test(p) || !/[a-z]/.test(p)) return 'Use upper and lowercase letters';
  if (!/\d/.test(p)) return 'Add at least one number';
  return '';
}

/** Today minus `years`, as yyyy-mm-dd (date-of-birth limits) */
export const yearsAgo = (years) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return d.toISOString().slice(0, 10);
};

/**
 * Returns { field: message } for everything that needs fixing. `required` lists which messages are "missing value"
 * ones — the form shows those only after Next / Save (typed-value problems such as format or duplicates show on blur).
 */
export function validateUser(f, { isEdit, usernameTaken, emailTaken }) {
  const e = {};
  const missing = new Set();
  const blank = (v) => !String(v ?? '').trim();
  const need = (k, msg) => {
    e[k] = msg;
    missing.add(k);
  };

  if (blank(f.name)) need('name', 'Enter the full name');
  if (blank(f.gender)) need('gender', 'Choose a gender');
  if (blank(f.dob)) need('dob', 'Enter the date of birth');
  else if (f.dob > yearsAgo(16)) e.dob = 'The user must be at least 16';
  else if (f.dob < yearsAgo(100)) e.dob = 'Check the year';

  if (blank(f.email)) need('email', 'Enter an email address');
  else if (!EMAIL.test(f.email.trim())) e.email = 'Enter a valid email, e.g. name@company.com';
  else if (emailTaken(f.email)) e.email = 'Another user already uses this email';
  if (!blank(f.altEmail)) {
    if (!EMAIL.test(f.altEmail.trim())) e.altEmail = 'Enter a valid email, e.g. name@company.com';
    else if (f.altEmail.trim().toLowerCase() === f.email.trim().toLowerCase()) e.altEmail = 'Use a different email from the main one';
  }

  if (blank(f.mobile)) need('mobile', 'Enter a mobile number');
  else if (!MOBILE.test(f.mobile)) e.mobile = 'Mobile number is 10 digits starting 6–9';
  if (!blank(f.altMobile)) {
    if (!MOBILE.test(f.altMobile)) e.altMobile = 'Mobile number is 10 digits starting 6–9';
    else if (f.altMobile === f.mobile) e.altMobile = 'Use a different number from the main one';
  }

  const a = f.address;
  if (blank(a.line1)) need('address.line1', 'Enter address line 1');
  if (blank(a.country)) need('address.country', 'Choose a country');
  if (blank(a.state)) need('address.state', 'Choose a state');
  if (blank(a.city)) need('address.city', 'Choose a city');
  if (blank(a.pin)) need('address.pin', 'Enter the pincode');
  else if (a.country === 'India' && !/^\d{6}$/.test(a.pin)) e['address.pin'] = 'Pincode is 6 digits';

  if (blank(f.role)) need('role', 'Choose a role');
  if (blank(f.designation)) need('designation', 'Choose a designation');
  if (blank(f.application)) need('application', 'Choose an application');
  if (blank(f.username)) need('username', 'Enter a username');
  else if (!USERNAME.test(f.username.trim())) e.username = '4–60 letters, digits or . _ @ -';
  else if (usernameTaken(f.username)) e.username = 'Another user already has this username';
  if (!isEdit) {
    const p = passwordProblem(f.password);
    if (p) {
      e.password = p;
      if (!f.password) missing.add('password');
    }
  }

  return { errors: e, missing };
}
