/**
 * Program form (Manage Content) — empty values, the modal's steps and validation. Every field is required.
 * logo = an image URL (uploads become data URLs); overview = { name, size, type, url? }; fee = digits (₹ per person).
 */
export const EMPTY_PROGRAM = { name: '', category: '', logo: '', entity: '', sub: '', fee: '', overview: null };

/** Which fields each step of the modal holds */
export const PROGRAM_STEPS = [
  { label: 'Program', fields: ['name', 'category', 'logo'] },
  { label: 'Mapping & fees', fields: ['entity', 'sub', 'fee', 'overview'] },
];

export const MAX_FEE = 10_000_000;

/** Returns { field: message } for everything that needs fixing. `nameTaken(name)` checks names are unique. */
export function validateProgram(f, { nameTaken }) {
  const e = {};
  if (!f.name.trim()) e.name = 'Enter the program name';
  else if (nameTaken(f.name)) e.name = 'Another program already has this name';
  if (!f.category) e.category = 'Choose a category';
  if (!f.logo) e.logo = 'Upload the program logo';
  if (!f.entity) e.entity = 'Choose an entity';
  if (!f.sub) e.sub = f.entity ? 'Choose a sub-entity' : 'Choose an entity first';
  if (!String(f.fee).trim()) e.fee = 'Enter the fee per person';
  else if (!(Number(f.fee) > 0)) e.fee = 'Fee must be more than ₹0';
  else if (Number(f.fee) > MAX_FEE) e.fee = 'That looks too high — check the amount';
  if (!f.overview) e.overview = 'Upload the executive overview';
  return e;
}
