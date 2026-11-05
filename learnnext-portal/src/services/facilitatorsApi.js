/** Facilitators: list, KYC, payment setup and portfolio. (Split from services/api.js — import from '@/services/api', which re-exports everything.) */
import { startOfDay, addDays } from '@/utils/formatDate';
import * as demo from '@/data/demoData';
import { uid } from '@/utils/helpers';
import { programStore } from './contentApi';
import { mock } from './coreApi';
import { seeded } from './dashboardApi';
import { entityStore, subEntityStore } from './financeMastersApi';

/* --------------------------------------------------------------- Facilitators */
/*
 * A facilitator moves through: KYC pending (added, KYC link sent) → Payment setup pending (KYC done, no bank details
 * yet) → Active (agreement running) → Expired agreement. Experience, industries, certifications and ratings come in
 * with the KYC, so they're empty before it.
 */
const FAC_STREETS = ['MG Road', 'Park Street', 'Linking Road', 'Anna Salai', 'Residency Road', 'Sector 29', 'Banjara Hills Rd 12', 'FC Road', 'Salt Lake Sector V', 'CG Road'];
const FAC_AREAS = ['Near City Mall', 'Opp. Metro Station', 'Behind Central Park', 'Tower B, 4th floor', 'Green Valley Apartments', 'Lane 3'];
const FAC_PEOPLE = ['Neha Verma', 'Atul Kumar', 'Priya Sharma', 'Rohan Kapoor'];
// Demo profile photos: hand-picked Unsplash headshots (clear, face-centred), matched to the first name and handed out
// in turn so neighbours differ; a real photo comes in with the KYC
const FAC_WOMEN = new Set(['Archana', 'Nandita', 'Preeti', 'Rumi', 'Shreya', 'Maya', 'Kavita', 'Ritu', 'Sunita', 'Pooja', 'Lakshmi', 'Farah', 'Ishita', 'Kiran', 'Neha', 'Priyanka', 'Sanjana', 'Uma', 'Yamini', 'Anjali', 'Chitra']);
const FAC_PHOTOS = {
  women: ['1494790108377-be9c29b29330', '1438761681033-6461ffad8d80', '1544005313-94ddf0286df2', '1534528741775-53994a69daeb', '1531123897727-8f129e1688ce', '1580489944761-15a19d654956', '1488426862026-3ee34a7d66df', '1573496359142-b8d87734a5a2', '1573497019940-1c28c88b4f3e', '1508214751196-bcfd4ca60f91', '1554151228-14d9def656e4', '1567532939604-b6b5b0db2604', '1607746882042-944635dfe10e', '1601412436009-d964bd02edbc', '1619895862022-09114b41f16f', '1614644147724-2d4785d69962', '1609505848912-b7c3b8b4beda'],
  men: ['1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e', '1472099645785-5658abf4ff4e', '1506794778202-cad84cf45f1d', '1539571696357-5a69c17a67c6', '1570295999919-56ceb5ecca61', '1633332755192-727a05c4013d', '1557862921-37829c790f19', '1560250097-0b93528c311a', '1564564321837-a57b7070ac4f', '1618077360395-f3068be8e001', '1600486913747-55e5470d6f40', '1590086782957-93c06ef21604', '1612349317150-e413f6a5b16d', '1581803118522-7b72a50f7e9f', '1519085360753-af0119f7cbe7'],
};
const facPhotoTurn = { women: 0, men: 0 };
const facPhoto = (name) => {
  const first = name.split(' ').find((w) => w.length > 1) ?? name;
  const set = FAC_WOMEN.has(first) ? 'women' : 'men';
  const id = FAC_PHOTOS[set][facPhotoTurn[set]++ % FAC_PHOTOS[set].length];
  return `https://images.unsplash.com/photo-${id}?w=160&h=160&fit=crop&crop=faces&q=80`;
};

export const facilitatorStore = (() => {
  const r = seeded(4242);
  const n = (max) => Math.floor(r() * max);
  const pick = (arr) => arr[n(arr.length)];
  const some = (arr, min, max) => [...arr].sort(() => r() - 0.5).slice(0, min + n(max - min + 1));
  const today = startOfDay(new Date());
  const ago = (days) => addDays(today, -days).toISOString();
  const industries = demo.crmIndustries.map((x) => x.name);
  const entities = entityStore.filter((e) => e.status === 'active').map((e) => e.id);
  return demo.facilitatorSeeds.map(([name, type, status, city, state], i) => {
    const slug = name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '');
    const kycDone = status !== 'kyc';
    // A few of those still in KYC have filled it in and wait for an admin to approve it
    const submitted = status === 'kyc' && i > 10 && i % 3 === 1;
    const profile = kycDone || submitted; // what the KYC form brings in
    const delivered = status === 'active' || status === 'expired';
    const trainings = delivered ? 4 + n(140) : 0;
    const createdDays = kycDone ? 60 + n(700) : 2 + n(13);
    const sentDays = kycDone ? createdDays : 1 + n(createdDays - 1);
    return {
      id: `fac-${i + 1}`,
      name,
      photo: profile ? facPhoto(name) : null,
      email: `${slug}@${pick(['gmail.com', 'outlook.com', 'yahoo.in'])}`,
      mobile: `9${String(100000000 + n(899999999)).slice(0, 9)}`,
      address: { line1: `${12 + n(380)}, ${pick(FAC_STREETS)}`, line2: pick(FAC_AREAS), country: 'India', state, city },
      entities: some(entities, 1, 3),
      type,
      status,
      kycSentAt: ago(sentDays),
      kycReminders: kycDone || submitted ? 0 : n(3),
      kycSubmittedAt: submitted ? ago(n(sentDays)) : kycDone ? ago(createdDays - 5) : null,
      documents: profile
        ? { pan: `${'ABCDEFGHJK'[n(10)]}${'LMNPQRSTUV'[n(10)]}${'XYZABCDEFG'[n(10)]}P${name[0]}${1000 + n(8999)}${'ABCDEFGHJK'[n(10)]}`, aadhaar: `XXXX XXXX ${1000 + n(8999)}`, cv: `${slug.replace(/\./g, '-')}-profile.pdf` }
        : null,
      kycDoneAt: status === 'payment' ? ago(1 + n(10)) : kycDone ? ago(createdDays - 7) : null,
      experience: profile ? 3 + n(30) + (r() < 0.5 ? 0.5 : 0) : null,
      trainings,
      industries: profile ? some(industries, 1, 4) : [],
      certifications: profile ? some(demo.facilitatorCertifications, 1, 4) : [],
      rating: delivered ? { score: Math.round((3.6 + r() * 1.4) * 10) / 10, count: 5 + n(Math.max(6, trainings)) } : null,
      agreementEnd: status === 'active' ? addDays(today, 20 + n(500)).toISOString() : status === 'expired' ? ago(5 + n(200)) : null,
      createdAt: ago(createdDays),
      createdBy: pick(FAC_PEOPLE),
    };
  });
})();

/*
 * Payment setup (Payment setup pending): an admin sets the agreement, fees and travel & stay, then sends it to the
 * facilitator, who approves it (→ Active) or rejects it with a reason (→ back to the admin to revise).
 * f.paymentSetup = null (not set up yet) | { ...form, state: 'sent' | 'rejected', sentAt, sentBy, round, rejection: { at, reason },
 *   history: [{ kind: 'sent', round, at, by, terms } | { kind: 'rejected', round, at, by, reason }] } — oldest first
 */
const fyOf = (d) => {
  const y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1; // the Indian financial year runs April → March
  return `${y}-${String(y + 1).slice(2)}`;
};
const PAYMENT_SETUP_LOOKUPS = {
  categories: [
    { value: 'new', label: 'New' },
    { value: 'renewal', label: 'Renewal' },
  ],
  validity: [3, 6, 12, 24, 36].map((m) => ({ value: String(m), label: `${m} months` })),
  financialYears: (() => {
    const now = new Date();
    const start = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    return [start - 1, start, start + 1].map((y) => `${y}-${String(y + 1).slice(2)}`);
  })(),
  // Feedback ranges and the bonus each earns, as on the old screen ("1.00 to 1.50 | 0.00%")
  feedbackSlabs: [
    ['1.00', '1.50', 0],
    ['1.50', '2.00', 0],
    ['2.00', '2.50', 0],
    ['2.50', '3.00', 0],
    ['3.00', '3.50', 0],
    ['3.50', '4.00', 0],
    ['4.00', '4.50', 0],
    ['4.50', '5.00', 0],
    ['5.10', '5.30', 0],
    ['5.30', '5.40', 0],
    ['5.40', '6.00', 10],
  ].map(([from, to, pct]) => ({ value: `${from}-${to}`, label: `${from} to ${to}`, bonus: `${pct.toFixed(2)}%` })),
  flights: [
    { value: 'economy', label: 'Economy' },
    { value: 'premium', label: 'Premium economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First class' },
  ],
  hotels: [3, 4, 5, 6, 7].map((s) => ({ value: String(s), label: `${s} star` })),
};
export const financialYearOf = fyOf;
// The terms that go to the facilitator (a payment setup minus its state and log)
const termsOf = (p) => {
  const { state, sentAt, sentBy, round, rejection, history, ...terms } = p;  
  return terms;
};
// Demo: of those waiting for a payment setup, one came back rejected, and one was rejected, revised and sent again
facilitatorStore
  .filter((f) => f.status === 'payment')
  .slice(0, 2)
  .forEach((f, i) => {
    const day = (n) => addDays(startOfDay(new Date()), -n);
    const start = addDays(startOfDay(new Date()), 7);
    const terms = {
      category: 'new',
      startDate: start.toISOString(),
      validity: '12',
      financialYear: fyOf(start),
      agreementType: f.type === 'partner' ? 'sales' : f.type === 'both' ? 'both' : 'facilitator',
      onBehalfOf: 'person',
      dayFee: '15000',
      feedbackSlab: '5.40-6.00',
      coaching: true,
      coachingF2F: '17000',
      coachingVirtual: '15000',
      flights: ['economy'],
      hotels: ['3', '4'],
    };
    const reason = i
      ? 'The day fee is lower than we discussed — I’d expect ₹18,000 a day, as on my last agreement.'
      : 'Please raise the day fee to ₹18,000 and allow 5 star hotels for outstation sessions.';
    const rejection = { at: day(i ? 2 : 4).toISOString(), reason };
    const history = [
      { kind: 'sent', round: 1, at: day(i ? 3 : 6).toISOString(), by: 'Atul Kumar', terms },
      { kind: 'rejected', round: 1, at: rejection.at, by: f.name, reason },
    ];
    if (i) {
      f.paymentSetup = { ...terms, state: 'rejected', sentAt: history[0].at, sentBy: 'Atul Kumar', round: 1, rejection, history };
    } else {
      const revised = { ...terms, dayFee: '18000', hotels: ['3', '4', '5'] };
      history.push({ kind: 'sent', round: 2, at: day(1).toISOString(), by: 'Atul Kumar', terms: revised });
      f.paymentSetup = { ...revised, state: 'sent', sentAt: day(1).toISOString(), sentBy: 'Atul Kumar', round: 2, rejection: null, history };
    }
  });

/*
 * What a facilitator filled in on the KYC form (the Verify page shows it section by section). Built the same way every
 * time for the same facilitator, from what's on their record (name, address, industries, certifications, entities).
 */
const KYC_BANKS = [
  ['ICICI Bank', 'ICIC'],
  ['HDFC Bank', 'HDFC'],
  ['State Bank of India', 'SBIN'],
  ['Axis Bank', 'UTIB'],
  ['Kotak Mahindra Bank', 'KKBK'],
];
const KYC_COLLEGES = ['Institute for Executive Coaching and Leadership', 'XLRI Jamshedpur', 'IIM Ahmedabad', 'Symbiosis Institute of Business Management', 'Delhi University', 'ICF Learning Academy'];
const KYC_PINS = { Delhi: '110024', Haryana: '122002', Maharashtra: '400050', Karnataka: '560034', 'Tamil Nadu': '600018', Telangana: '500034', 'West Bengal': '700091', Gujarat: '380009', 'Uttar Pradesh': '201301' };

function kycDetailsFor(f) {
  const r = seeded([...f.id].reduce((a, ch) => a + ch.charCodeAt(0) * 31, 7));
  const n = (max) => Math.floor(r() * max);
  const pick = (arr) => arr[n(arr.length)];
  const slug = f.email.split('@')[0];
  const initials = f.name
    .split(' ')
    .filter((w) => w.length > 1)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  const firm = f.type !== 'facilitator';
  const pin = KYC_PINS[f.address.state] ?? '110001';
  const [bank, ifscCode] = pick(KYC_BANKS);
  const pan = f.documents?.pan ?? `AB${initials[0] ?? 'X'}P${1000 + n(8999)}K`;
  const gst = firm ? `${pin.slice(0, 2)}${pan}1Z${n(9)}` : null;
  const year = new Date().getFullYear();
  // Every uploaded KYC document opens the sample PDF in the preview (no real uploads in the mock)
  const file = (name) => ({ name, size: 90_000 + n(900_000), type: 'application/pdf', url: '/samples/sample-document.pdf' });
  const experience = f.experience ?? 5;
  return {
    code: `TR${initials}${100 + n(899)}`,
    comment: `LinkedIn: https://www.linkedin.com/in/${slug.replace(/\./g, '-')}/`,
    personal: {
      dob: new Date(year - 30 - n(25), n(12), 1 + n(27)).toISOString(),
      mobile: f.mobile,
      altMobile: r() < 0.4 ? `9${String(100000000 + n(899999999)).slice(0, 9)}` : null,
      email: f.email,
      altEmail: r() < 0.3 ? `${slug}.work@gmail.com` : null,
      signature: f.name,
    },
    address: {
      current: { ...f.address, pin },
      // Most give the same address twice; some have a different permanent one
      permanent: r() < 0.7 ? { ...f.address, pin } : { line1: `${10 + n(200)}, Civil Lines`, line2: 'Near Ram Mandir', country: 'India', state: f.address.state, city: f.address.city, pin },
    },
    tax: {
      gst,
      gstDoc: gst ? file('GST-certificate.pdf') : null,
      pan,
      panDoc: file('PAN-card.pdf'),
      cin: firm ? `U80${100 + n(899)}DL20${10 + n(14)}PTC${100000 + n(899999)}` : null,
      cinDoc: firm ? file('Certificate-of-incorporation.pdf') : null,
    },
    banks: {
      primary: {
        bank,
        account: `${String(10000000 + n(89999999))}${100 + n(899)}`,
        ifsc: `${ifscCode}0${String(1000 + n(8999)).padStart(6, '0')}`,
        holder: firm ? `${f.name.split(' ').slice(-1)[0]} Consulting` : f.name,
        branchCode: r() < 0.5 ? String(1000 + n(8999)) : null,
        branchName: `${f.address.city} ${pick(['Main', 'Central', 'MG Road', 'Sector 18'])}`,
        cheque: file('Cancelled-cheque.pdf'),
        passbook: r() < 0.4 ? file('Passbook.jpg') : null,
      },
      secondary: r() < 0.3 ? [{ bank: 'HDFC Bank', account: `${50100000000 + n(899999999)}`, ifsc: `HDFC000${1000 + n(8999)}`, holder: f.name, branchCode: null, branchName: f.address.city, cheque: file('Cancelled-cheque-2.pdf'), passbook: null }] : [],
    },
    qualifications: [
      { type: 'Degree', course: pick(['MBA', 'PGDM (HR)', 'M.A. Psychology', 'B.Tech']), start: year - Math.ceil(experience) - 3, end: year - Math.ceil(experience) - 1, college: pick(KYC_COLLEGES), doc: file('Degree.pdf') },
      ...f.certifications.map((c, i) => ({ type: 'Certification', course: c, start: year - 4 + i, end: year - 3 + i, college: pick(KYC_COLLEGES), doc: file(`${c.replace(/[^a-z0-9]+/gi, '-')}.pdf`) })),
    ],
    experience: f.industries.map((ind, i) => ({ industry: ind, type: 'Experienced', years: i === 0 ? experience : Math.max(1, Math.round(experience / (i + 2))) })),
    certifications: f.entities.map((eid) => {
      const sub = subEntityStore.find((s) => s.entity === eid);
      const program = programStore.find((p) => p.entity === eid) ?? programStore[n(programStore.length)];
      return { entity: entityStore.find((e) => e.id === eid)?.name ?? '—', subEntity: sub?.name ?? '—', program: program?.name ?? '—', certificate: r() < 0.5 ? file('Program-certificate.pdf') : null };
    }),
    firm: firm
      ? {
          name: `${f.name.split(' ').slice(-1)[0]} Consulting`,
          email: `hello@${f.name.split(' ').slice(-1)[0].toLowerCase()}consulting.in`,
          mobile: `9${String(100000000 + n(899999999)).slice(0, 9)}`,
          website: r() < 0.5 ? `www.${f.name.split(' ').slice(-1)[0].toLowerCase()}consulting.in` : null,
          address: { line1: `${10 + n(300)}, Business Park`, line2: `Floor ${1 + n(6)}`, country: 'India', state: f.address.state, city: f.address.city, pin },
        }
      : null,
    social: { linkedin: `https://www.linkedin.com/in/${slug.replace(/\./g, '-')}/`, twitter: r() < 0.5 ? `https://x.com/${slug.replace(/\./g, '')}` : null, facebook: r() < 0.3 ? `https://facebook.com/${slug}` : null },
  };
}

export const facilitatorsApi = {
  /** A facilitator with what they filled in on the KYC form ({ ...facilitator, kyc }), for the Verify page; null if not found */
  kyc(id) {
    const f = facilitatorStore.find((x) => x.id === id);
    return mock(f ? { ...structuredClone(f), kyc: kycDetailsFor(f) } : null);
  },

  /**
   * Finishes verifying a submitted KYC. `decisions` = { [section]: { valid: bool, note? } }. All valid → approved: on to
   * Payment setup pending. Anything not valid → sent back: KYC pending again, with the notes, and the link re-sent.
   */
  async verifyKyc(id, decisions, by) {
    const f = facilitatorStore.find((x) => x.id === id);
    if (!f) throw new Error('This facilitator no longer exists.');
    if (f.status !== 'kyc' || !f.kycSubmittedAt) throw new Error('There’s no submitted KYC waiting for verification.');
    const at = new Date().toISOString();
    const issues = Object.entries(decisions).filter(([, d]) => !d.valid);
    if (issues.length) {
      Object.assign(f, { kycSubmittedAt: null, kycSentAt: at, kycReminders: f.kycReminders + 1, kycReturned: { at, by, issues: issues.map(([section, d]) => ({ section, note: d.note })) } });
    } else {
      Object.assign(f, { status: 'payment', kycDoneAt: at, kycApprovedBy: by });
    }
    return mock({ approved: !issues.length }, 700);
  },

  /** Every facilitator, newest first */
  list: () => mock([...facilitatorStore].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))),

  /** One facilitator for the edit form (null if not found) */
  get: (id) => structuredClone(facilitatorStore.find((f) => f.id === id) ?? null),

  /** Options for the add / edit form: active entities (Onboarding for) and country → state → cities */
  lookups: () => ({
    entities: entityStore.filter((e) => e.status === 'active').map((e) => ({ id: e.id, name: e.name, prefix: e.invoicePrefix })),
    geo: demo.clientLookups.geo,
  }),

  /** True if another facilitator already uses this email */
  emailTaken: (email, exceptId) => facilitatorStore.some((f) => f.id !== exceptId && f.email.toLowerCase() === email.trim().toLowerCase()),

  /** Adds a facilitator and sends them the KYC link (status: KYC pending) */
  async create(form, by) {
    if (facilitatorsApi.emailTaken(form.email)) throw new Error('Another facilitator already uses this email.');
    const at = new Date().toISOString();
    const f = {
      ...structuredClone(form),
      id: uid('fac'),
      name: form.name.trim(),
      email: form.email.trim(),
      status: 'kyc',
      photo: null,
      kycSubmittedAt: null,
      documents: null,
      kycSentAt: at,
      kycReminders: 0,
      kycDoneAt: null,
      experience: null,
      trainings: 0,
      industries: [],
      certifications: [],
      rating: null,
      agreementEnd: null,
      createdAt: at,
      createdBy: by,
    };
    facilitatorStore.unshift(f);
    return mock(f, 700);
  },

  /** Saves contact, location, entities and type */
  async update(id, form) {
    const f = facilitatorStore.find((x) => x.id === id);
    if (!f) throw new Error('This facilitator no longer exists.');
    if (facilitatorsApi.emailTaken(form.email, id)) throw new Error('Another facilitator already uses this email.');
    const { name, email, mobile, address, entities, type } = structuredClone(form);
    Object.assign(f, { name: name.trim(), email: email.trim(), mobile, address, entities, type });
    return mock(f, 600);
  },

  /** Sends the KYC link again to those still pending; returns how many were sent */
  async resendKyc(ids) {
    const at = new Date().toISOString();
    let sent = 0;
    facilitatorStore.forEach((f) => {
      if (ids.includes(f.id) && f.status === 'kyc' && !f.kycSubmittedAt) {
        f.kycSentAt = at;
        f.kycReminders += 1;
        sent++;
      }
    });
    return mock(sent, 600);
  },

  /** Options for the payment setup form */
  paymentSetupLookups: () => PAYMENT_SETUP_LOOKUPS,

  /**
   * Saves a facilitator's payment setup (agreement, fees, travel & stay) and sends it to them for approval. Their answer
   * comes from their side: approved → Active (the agreement runs from the start date for the chosen months); rejected →
   * back here with their reason, to revise and send again.
   */
  async sendPaymentSetup(id, form, by) {
    const f = facilitatorStore.find((x) => x.id === id);
    if (!f) throw new Error('This facilitator no longer exists.');
    if (f.status !== 'payment') throw new Error('This facilitator isn’t waiting for a payment setup.');
    const terms = termsOf(structuredClone(form));
    const sentAt = new Date().toISOString();
    const round = (f.paymentSetup?.round ?? 0) + 1;
    // Every send (and every answer from the facilitator) is kept, so each revision can be traced
    const history = [...(f.paymentSetup?.history ?? []), { kind: 'sent', round, at: sentAt, by, terms }];
    f.paymentSetup = { ...terms, state: 'sent', sentAt, sentBy: by, rejection: null, round, history };
    return mock(structuredClone(f), 700);
  },

  /** Sends the agreement for renewal to a facilitator whose agreement has ended */
  async sendRenewal(id) {
    const f = facilitatorStore.find((x) => x.id === id);
    if (!f) throw new Error('This facilitator no longer exists.');
    f.renewalSentAt = new Date().toISOString();
    return mock(true, 500);
  },
};
