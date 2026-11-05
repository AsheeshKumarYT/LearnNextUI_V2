/**
 * Add client form: starting values, steps and validation.
 * Errors are keyed by field path ("companyName", "comm.pin", "office.city", …).
 */

export const EMPTY_ADDRESS = { line1: '', line2: '', country: 'India', state: '', city: '', pin: '' };
export const EMPTY_BILLING = { ...EMPTY_ADDRESS, gstNo: '', gstDoc: null };

export const INITIAL_CLIENT = {
  trainingFor: '', // 'company' | 'individual'
  code: '',
  // Company
  companyType: '',
  companyName: '',
  industry: '',
  website: '',
  stdCode: '',
  phone: '',
  sez: '', // 'yes' | 'no'
  sezNo: '', // SEZ number + its document — required only when sez is 'yes'
  sezDoc: null,
  // Individual
  participantName: '',
  email: '',
  govtId: '',
  govtIdDoc: null,
  gstNo: '',
  gstDoc: null,
  department: '',
  designation: '',
  // Both
  mobile: '',
  logo: '',
  lowerTds: false, // "Do you have Lower TDS details?"
  tdsRate: '',
  tdsAmount: '',
  tdsSection: '',
  tdsFrom: null,
  tdsTo: null,
  tdsCert: null,
  comm: { ...EMPTY_ADDRESS },
  officeSame: true,
  office: { ...EMPTY_ADDRESS },
  billing: [], // companies: [{ id, ...EMPTY_BILLING }]
};

/** The four steps (wording adapts to the type). Billing: companies add billing addresses; individuals their GST. Both: Lower TDS. */
export function stepsFor(trainingFor) {
  const individual = trainingFor === 'individual';
  return [
    { key: 'type', label: 'Training for', description: 'Company or individual' },
    { key: 'details', label: 'Details', description: individual ? 'Participant & contact' : 'Company & contact' },
    { key: 'address', label: 'Addresses', description: 'Communication & office' },
    { key: 'billing', label: 'Billing', description: individual ? 'GST & TDS' : 'Addresses, GST & TDS' },
  ];
}

const blank = (v) => !v || !String(v).trim();
const digits = (v = '') => String(v).replace(/\D/g, '');
export const GSTIN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export function addressErrors(a, prefix) {
  const e = {};
  if (blank(a.line1)) e[`${prefix}.line1`] = 'Enter address line 1';
  if (blank(a.line2)) e[`${prefix}.line2`] = 'Enter address line 2';
  if (blank(a.country)) e[`${prefix}.country`] = 'Choose a country';
  if (blank(a.state)) e[`${prefix}.state`] = 'Choose a state';
  if (blank(a.city)) e[`${prefix}.city`] = 'Choose a city';
  if (blank(a.pin)) e[`${prefix}.pin`] = 'Enter the pin code';
  else if (a.country === 'India' && !/^[1-9]\d{5}$/.test(a.pin)) e[`${prefix}.pin`] = 'Pin code is 6 digits';
  else if (a.country !== 'India' && !/^[A-Za-z0-9 -]{3,10}$/.test(a.pin)) e[`${prefix}.pin`] = 'Enter a valid postal code';
  return e;
}

/** Step "details" */
export function detailsErrors(v) {
  const e = {};
  if (!/^[6-9]\d{9}$/.test(digits(v.mobile))) e.mobile = blank(v.mobile) ? 'Enter a mobile number' : 'Enter a valid 10-digit mobile number';
  if (v.trainingFor === 'company') {
    if (blank(v.companyName)) e.companyName = 'Enter the company name';
    else if (v.companyName.trim().length < 2) e.companyName = 'Name looks too short';
    if (blank(v.companyType)) e.companyType = 'Choose a company type';
    if (blank(v.industry)) e.industry = 'Choose an industry';
    if (v.website && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(v.website.trim())) e.website = 'Enter a valid website, e.g. tatasteel.com';
    if (v.phone || v.stdCode) {
      if (!/^0?\d{2,4}$/.test(digits(v.stdCode))) e.stdCode = 'STD code';
      if (!/^\d{6,8}$/.test(digits(v.phone))) e.phone = 'Enter a 6–8 digit number';
    }
    if (!v.sez) e.sez = 'Choose Yes or No';
    else if (v.sez === 'yes') {
      if (blank(v.sezNo)) e.sezNo = 'Enter the SEZ number';
      if (!v.sezDoc) e.sezDoc = 'Upload the SEZ document';
    }
  } else {
    if (blank(v.participantName)) e.participantName = 'Enter the participant’s name';
    if (blank(v.email)) e.email = 'Enter an email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email address';
  }
  return e;
}

/** Step "billing" — individual GST and Lower TDS (company billing addresses are checked as each one is saved) */
export function billingStepErrors(v) {
  const e = {};
  if (v.trainingFor === 'individual' && v.gstNo && !GSTIN.test(v.gstNo.trim())) e.gstNo = 'GST No. is 15 characters, e.g. 27AAPFU0939F1ZV';
  if (v.lowerTds) {
    const rate = Number(v.tdsRate);
    if (blank(v.tdsRate)) e.tdsRate = 'Enter the lower TDS rate';
    else if (!(rate >= 0 && rate < 100)) e.tdsRate = 'Enter a rate between 0 and 100';
    if (blank(v.tdsAmount)) e.tdsAmount = 'Enter the amount';
    else if (!(Number(v.tdsAmount) > 0)) e.tdsAmount = 'Enter an amount above 0';
    if (blank(v.tdsSection)) e.tdsSection = 'Enter the section, e.g. 194J';
    if (!v.tdsFrom) e.tdsFrom = 'Choose a start date';
    if (!v.tdsTo) e.tdsTo = 'Choose an end date';
    else if (v.tdsFrom && new Date(v.tdsTo) < new Date(v.tdsFrom)) e.tdsTo = 'Must be on or after the start date';
    if (!v.tdsCert) e.tdsCert = 'Upload the certificate';
  }
  return e;
}

/** Step "addresses" */
export function addressStepErrors(v) {
  return { ...addressErrors(v.comm, 'comm'), ...(v.officeSame ? {} : addressErrors(v.office, 'office')) };
}

/** One billing address in the add/edit panel (GST No. and its document are required) */
export function billingErrors(b) {
  const e = addressErrors(b, 'bill');
  if (blank(b.gstNo)) e['bill.gstNo'] = 'Enter the company GST No.';
  else if (!GSTIN.test(b.gstNo.trim())) e['bill.gstNo'] = 'GST No. is 15 characters, e.g. 27AAPFU0939F1ZV';
  if (!b.gstDoc) e['bill.gstDoc'] = 'Attach the GST certificate';
  return e;
}

/** Errors for a step key */
export function errorsForStep(key, v) {
  if (key === 'type') return v.trainingFor ? {} : { trainingFor: 'Choose who the training is for' };
  if (key === 'details') return detailsErrors(v);
  if (key === 'address') return addressStepErrors(v);
  return billingStepErrors(v);
}

/** True once the user has entered anything beyond the training type */
export function isDirty(v) {
  const { trainingFor, code, comm, office, officeSame, billing, ...rest } = v;
  return (
    billing.length > 0 ||
    Object.values(rest).some((x) => x && x !== '') ||
    Object.entries(comm).some(([k, x]) => k !== 'country' && x) ||
    (!officeSame && Object.entries(office).some(([k, x]) => k !== 'country' && x))
  );
}
