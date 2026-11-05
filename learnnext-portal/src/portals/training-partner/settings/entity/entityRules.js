/**
 * Entity form — empty values and validation (Settings → Finance → Entity).
 * Documents are { name, size, type, url? }; logo / signature are image URLs (uploads become data URLs).
 */
export const EMPTY_ENTITY = {
  name: '',
  parent: '',
  logo: '',
  invoicePrefix: '',
  status: 'active',
  pan: '',
  panDoc: null,
  cinType: 'CIN',
  cin: '',
  cinDoc: null,
  lut: '',
  lutDoc: null,
  lutDeclaration: '',
  signature: '',
  address: { line1: '', line2: '', country: 'India', state: '', city: '', pin: '' },
  phone: '',
  gstin: '',
  gstDoc: null,
};

const PAN = /^[A-Z]{5}\d{4}[A-Z]$/;
const CIN = /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/;
const LLPIN = /^[A-Z]{3}-\d{4}$/;
const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PREFIX = /^[A-Z0-9]{1,6}$/;

/** What the registration number is called for each registration type */
export const REG_LABEL = { CIN: 'CIN', LLPIN: 'LLPIN' };

/**
 * Returns { field: message } for everything that needs fixing (address fields keyed "address.<field>").
 * `prefixTaken(prefix)` checks the invoice initial is unique (new entities only — it's locked when editing).
 */
/** Which fields each step of the form holds (address fields as "address.<field>") */
export const ENTITY_STEPS = [
  { label: 'Details', fields: ['name', 'parent', 'invoicePrefix', 'logo'] },
  { label: 'Registration', fields: ['pan', 'panDoc', 'cin', 'cinDoc', 'lut', 'lutDoc', 'signature', 'lutDeclaration'] },
  { label: 'Tax & billing', fields: ['address.line1', 'address.line2', 'address.country', 'address.state', 'address.city', 'address.pin', 'phone', 'gstin', 'gstDoc'] },
];

export function validateEntity(f, { isEdit, prefixTaken }) {
  const e = {};
  const blank = (v) => !String(v ?? '').trim();

  if (blank(f.name)) e.name = 'Enter the entity’s legal name';
  if (!f.logo) e.logo = 'Upload a logo';
  if (!isEdit) {
    if (blank(f.invoicePrefix)) e.invoicePrefix = 'Enter an invoice initial';
    else if (!PREFIX.test(f.invoicePrefix)) e.invoicePrefix = 'Up to 6 letters or digits';
    else if (prefixTaken(f.invoicePrefix)) e.invoicePrefix = 'Another entity uses this initial';
  }

  if (blank(f.pan)) e.pan = 'Enter the PAN';
  else if (!PAN.test(f.pan)) e.pan = 'PAN looks like ABCDE1234F';
  if (!f.panDoc) e.panDoc = 'Upload the PAN card';

  const reg = REG_LABEL[f.cinType];
  if (blank(f.cin)) e.cin = `Enter the ${reg}`;
  else if (!(f.cinType === 'LLPIN' ? LLPIN : CIN).test(f.cin)) e.cin = f.cinType === 'LLPIN' ? 'LLPIN looks like AAB-1234' : 'CIN is 21 characters';
  if (!f.cinDoc) e.cinDoc = `Upload the ${reg} certificate`;

  if (blank(f.lut)) e.lut = 'Enter the LUT number';
  if (!f.lutDoc) e.lutDoc = 'Upload the LUT';
  if (blank(f.lutDeclaration)) e.lutDeclaration = 'Add the LUT declaration';
  if (!f.signature) e.signature = 'Upload the signature';

  const a = f.address;
  if (blank(a.line1)) e['address.line1'] = 'Enter address line 1';
  if (blank(a.line2)) e['address.line2'] = 'Enter address line 2';
  if (blank(a.country)) e['address.country'] = 'Choose a country';
  if (blank(a.state)) e['address.state'] = 'Choose a state';
  if (blank(a.city)) e['address.city'] = 'Choose a city';
  if (blank(a.pin)) e['address.pin'] = 'Enter the pin code';
  else if (a.country === 'India' && !/^\d{6}$/.test(a.pin)) e['address.pin'] = 'Pin code is 6 digits';

  if (blank(f.phone)) e.phone = 'Enter a phone number';
  else if (!/^\d{10}$/.test(f.phone)) e.phone = 'Phone number is 10 digits';

  if (blank(f.gstin)) e.gstin = 'Enter the GSTIN';
  else if (!GSTIN.test(f.gstin)) e.gstin = 'GSTIN is 15 characters, e.g. 07AABCB1234K1Z9';
  else if (PAN.test(f.pan) && f.gstin.slice(2, 12) !== f.pan) e.gstin = 'GSTIN should contain the PAN';
  if (!f.gstDoc) e.gstDoc = 'Upload the GST certificate';

  return e;
}
