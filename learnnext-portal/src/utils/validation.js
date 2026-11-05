/**
 * Tiny, dependency-free validation helpers.
 *
 * Rules are functions (value, allValues) => errorMessage | undefined.
 * Usage:
 *   const schema = { email: [required(), email()], password: [required(), minLength(8)] };
 *   const errors = validate(values, schema); // { email: 'Enter a valid email' }
 */
export const required = (message = 'This field is required') => (v) =>
  v === undefined || v === null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length)
    ? message
    : undefined;

export const email = (message = 'Enter a valid email address') => (v) =>
  v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? message : undefined;

export const minLength = (n, message) => (v) =>
  v && v.length < n ? message || `Must be at least ${n} characters` : undefined;

export const maxLength = (n, message) => (v) =>
  v && v.length > n ? message || `Must be ${n} characters or fewer` : undefined;

export const matches = (field, message = 'Values do not match') => (v, all) =>
  v !== all?.[field] ? message : undefined;

export const phone = (message = 'Enter a valid phone number') => (v) =>
  v && !/^[+\d][\d\s().-]{6,}$/.test(v) ? message : undefined;

export function validate(values, schema) {
  const errors = {};
  Object.entries(schema).forEach(([field, rules]) => {
    for (const rule of rules) {
      const err = rule(values[field], values);
      if (err) {
        errors[field] = err;
        break;
      }
    }
  });
  return errors;
}

/** Returns { score: 0-4, label, tone } */
export function passwordStrength(pw = '') {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  if (!pw) score = 0;
  const map = [
    { label: 'Too weak', tone: 'danger' },
    { label: 'Weak', tone: 'danger' },
    { label: 'Fair', tone: 'warning' },
    { label: 'Good', tone: 'success' },
    { label: 'Strong', tone: 'success' },
  ];
  return { score, ...map[score] };
}
