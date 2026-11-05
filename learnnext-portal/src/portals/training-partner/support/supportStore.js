import { useSyncExternalStore } from 'react';

/*
 * Support tickets — raised by participants (from the client programs) and by facilitators; answered by admins on the
 * Support desk page. Demo data in a small module store (survives page changes; resets on reload). Each ticket keeps
 * its conversation: the requester's messages and the admins' replies.
 *
 * Ticket: { id, number, from: 'participant' | 'facilitator', name, email, photo, org (participant's company),
 *           category, subCategory, subject, description, status: 'open' | 'closed', createdAt, closedBy, closedAt, messages[] }
 * Message: { id, by: 'user' | 'admin', author, text, at, files: [{ id, name, type, size, url }] }
 */
const ago = (h) => new Date(Date.now() - h * 36e5).toISOString();
const photo = (id) => `https://images.unsplash.com/photo-${id}?w=96&h=96&fit=crop&crop=faces&q=80`;
const user = (text, h) => ({ by: 'user', text, at: ago(h) });
const admin = (author, text, h) => ({ by: 'admin', author, text, at: ago(h) });

const SEED = [
  {
    number: 'C/189/613613', from: 'facilitator', name: 'Ashok Iyer', email: 'ashok.iyer@gmail.com', photo: photo('1507003211169-0a1dd7228f2d'),
    category: 'Career development', subCategory: 'Skill assessment', subject: 'Resilience assessment link',
    messages: [user('Hi team, the resilience assessment link for my Chennai cohort isn’t opening for participants. Could you check?', 2.2)],
  },
  {
    number: 'P/14/652144', from: 'participant', name: 'Rucha Deshmukh', email: 'rucha.d@mindsprint.com', org: 'Mindsprint Learning Solutions', photo: photo('1494790108377-be9c29b29330'),
    category: 'Performance improvement', subCategory: 'Goal setting', subject: 'Goal sheet template',
    status: 'closed', closedBy: 'Training Partner',
    messages: [
      user('Where can I download the goal-setting template shared in yesterday’s session?', 26),
      admin('Training Partner', 'It’s in your learner portal under Resources › Week 2. I’ve also emailed it to you.', 25),
      user('Got it, thank you!', 24.5),
    ],
  },
  {
    number: 'C/14/820542', from: 'participant', name: 'Rucha Deshmukh', email: 'rucha.d@mindsprint.com', org: 'Mindsprint Learning Solutions', photo: photo('1494790108377-be9c29b29330'),
    category: 'Communication skills', subCategory: 'Active listening', subject: 'Missed the listening workshop',
    messages: [
      user('I missed the active listening workshop due to travel. Is there a recording?', 27),
      admin('Atul Kumar', 'There’s no recording, but you can join the repeat batch next Thursday. Shall I add you?', 20),
      user('Yes please, add me to Thursday’s batch.', 3.5),
    ],
  },
  {
    number: 'P/14/531402', from: 'participant', name: 'Karan Malhotra', email: 'karan.m@infosys.com', org: 'Infosys', photo: photo('1500648767791-00dcc994a43e'),
    category: 'Performance improvement', subCategory: 'Time management', subject: 'Certificate name is misspelt',
    messages: [user('My completion certificate says “Karan Malhothra” — could it be corrected to Karan Malhotra?', 5)],
  },
  {
    number: 'L/14/672575', from: 'facilitator', name: 'Krishan Kanhaiya', email: 'krishan.k@outlook.com', photo: photo('1472099645785-5658abf4ff4e'),
    category: 'Leadership coaching', subCategory: 'Decision making', subject: 'Session slides for Pune batch',
    messages: [
      user('Could you share the updated decision-making deck before Friday’s Pune session?', 30),
      admin('Training Partner', 'Uploaded to Manage Content › Leadership Coaching (v3). You should see it now.', 28),
    ],
  },
  {
    number: 'L/166/627503', from: 'facilitator', name: 'Vipin Singh', email: 'vipin.singh@gmail.com', photo: photo('1506794778202-cad84cf45f1d'),
    category: 'Leadership coaching', subCategory: 'Decision making', subject: 'Payment for May sessions',
    messages: [user('The payment for my four May sessions hasn’t reached my account yet.', 9)],
  },
  {
    number: 'C/166/590585', from: 'participant', name: 'Neha Verma', email: 'neha.verma@tatasteel.com', org: 'Tata Steel', photo: photo('1438761681033-6461ffad8d80'),
    category: 'Career development', subCategory: 'Career planning', subject: 'Can’t open the career map worksheet',
    messages: [user('The career map worksheet opens blank on my laptop. Is there another format?', 12)],
  },
  {
    number: 'T/166/498505', from: 'participant', name: 'Arjun Mehta', email: 'arjun.mehta@wipro.com', org: 'Wipro', photo: photo('1539571696357-5a69c17a67c6'),
    category: 'Team management', subCategory: 'Employee engagement', subject: 'Request to change batch',
    status: 'closed', closedBy: 'Atul Kumar',
    messages: [
      user('Can I move from the morning batch to the evening one? I have client calls in the mornings.', 72),
      admin('Atul Kumar', 'Done — you’re in the evening batch from next week. Same link.', 70),
    ],
  },
  {
    number: 'C/166/159635', from: 'facilitator', name: 'Farah Khan', email: 'farah.khan@yahoo.in', photo: photo('1573496359142-b8d87734a5a2'),
    category: 'Communication skills', subCategory: 'Presentation skills', subject: 'Participant list not updated',
    messages: [
      user('Three participants who joined late aren’t on my attendance list for the Gurugram batch.', 20),
      admin('Atul Kumar', 'Thanks Farah — I’ve added Rahul, Sneha and Imran to the Gurugram batch. Could you refresh and confirm they show on your list?', 6),
    ],
  },
  {
    number: 'C/166/842929', from: 'participant', name: 'Meera Iyer', email: 'meera.iyer@hcltech.com', org: 'HCLTech', photo: photo('1534528741775-53994a69daeb'),
    category: 'Career development', subCategory: 'Career planning', subject: 'Feedback form not submitting',
    messages: [user('The session feedback form keeps showing an error when I press submit.', 34)],
  },
  {
    number: 'P/189/301744', from: 'facilitator', name: 'Kavita Rao', email: 'kavita.rao@gmail.com', photo: photo('1508214751196-bcfd4ca60f91'),
    category: 'Performance improvement', subCategory: 'Coaching conversations', subject: 'Update bank account',
    messages: [user('I’ve changed banks — how do I update the account for my payouts?', 44)],
  },
  {
    number: 'L/189/118265', from: 'participant', name: 'Sunita Joshi', email: 'sunita.joshi@mahindra.com', org: 'Mahindra', photo: photo('1580489944761-15a19d654956'),
    category: 'Leadership coaching', subCategory: 'Delegation', subject: 'Portal login link expired',
    status: 'closed', closedBy: 'Training Partner',
    messages: [
      user('My learner portal login link says it has expired.', 100),
      admin('Training Partner', 'I’ve sent you a fresh link — it’s valid for 7 days.', 98),
    ],
  },
];

// What the requester wrote when raising the ticket (the "Description" in the old screen)
const DESCRIPTION = {
  'C/189/613613': 'Participants of the Chennai cohort (batch 3) get a “page not found” error when they open the resilience assessment link from their dashboard. It worked last week. The session is on Friday, so they need it before then. Screenshot attached.',
  'P/14/652144': 'In yesterday’s goal-setting session the facilitator mentioned a template for writing SMART goals. I can’t find it in the learner portal.',
  'C/14/820542': 'I was travelling for work and missed the active listening workshop on 21 October. I’d like to catch up — a recording or a repeat batch would help.',
  'P/14/531402': 'My name is misspelt on the completion certificate for the time-management program. It should read “Karan Malhotra”. Certificate attached.',
  'L/14/672575': 'The Pune leadership batch is on Friday. I need the latest decision-making deck (with the new case study) a couple of days before to prepare.',
  'L/166/627503': 'I delivered four sessions in May (6, 13, 20 and 27 May) for the decision-making program, but the payment hasn’t been credited yet. Invoice attached.',
  'C/166/590585': 'The career map worksheet from module 2 opens as a blank page on my laptop (Windows, Chrome). Screenshot attached.',
  'T/166/498505': 'I have client calls every morning, so I can’t attend the 9:30 AM batch. I’d like to move to the evening batch for the rest of the program.',
  'C/166/159635': 'Three participants who joined the Gurugram presentation-skills batch late (Rahul, Sneha and Imran) are missing from my attendance list.',
  'C/166/842929': 'When I press Submit on the session feedback form it shows “Something went wrong”. I’ve tried twice on different days.',
  'P/189/301744': 'I’ve moved my salary account from HDFC to ICICI. Please let me know how to update the account my payouts go to. New cancelled cheque attached.',
  'L/189/118265': 'The login link in my welcome email says it has expired, so I can’t get into the learner portal.',
};
// Files the requester attached when raising the ticket (demo: an image or the sample PDF)
const img = (name, id, size) => ({ name, type: 'image/jpeg', size, url: `https://images.unsplash.com/photo-${id}?w=1400&q=80` });
const pdf = (name, size) => ({ name, type: 'application/pdf', size, url: '/samples/sample-document.pdf' });
// Ashok's screenshot: a drawn browser window showing the broken assessment link (an inline SVG, so it always loads
// and matches the ticket — a stock photo didn't)
const LINK_ERROR_SHOT = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760" font-family="Segoe UI, Arial, sans-serif">
<rect width="1200" height="760" fill="#eef2f8"/>
<rect x="60" y="50" width="1080" height="660" rx="18" fill="#ffffff" stroke="#d5dde8"/>
<rect x="60" y="50" width="1080" height="64" rx="18" fill="#f4f6fa"/><rect x="60" y="96" width="1080" height="18" fill="#f4f6fa"/>
<circle cx="100" cy="82" r="8" fill="#f2a7a0"/><circle cx="126" cy="82" r="8" fill="#f5d08a"/><circle cx="152" cy="82" r="8" fill="#a8d9a0"/>
<rect x="190" y="64" width="760" height="36" rx="18" fill="#ffffff" stroke="#dde3ec"/>
<text x="214" y="88" font-size="17" fill="#6b7a8c">learn.learnnext.io/assessments/resilience/chennai-b3</text>
<line x1="60" y1="114" x2="1140" y2="114" stroke="#e3e8ef"/>
<text x="600" y="330" text-anchor="middle" font-size="120" font-weight="700" fill="#cfd9e8">404</text>
<text x="600" y="400" text-anchor="middle" font-size="34" font-weight="600" fill="#2b3a4d">Page not found</text>
<text x="600" y="448" text-anchor="middle" font-size="20" fill="#6b7a8c">This assessment link isn’t available. It may have expired or been moved.</text>
<rect x="510" y="490" width="180" height="50" rx="10" fill="#2a69b2"/>
<text x="600" y="522" text-anchor="middle" font-size="18" font-weight="600" fill="#ffffff">Go to dashboard</text>
</svg>`)}`;

const FILES = {
  'C/189/613613': [{ name: 'link-error.png', type: 'image/svg+xml', size: 184_320, url: LINK_ERROR_SHOT }],
  'P/14/531402': [pdf('certificate-karan.pdf', 212_480)],
  'L/166/627503': [pdf('invoice-may-sessions.pdf', 96_256), img('bank-statement.jpg', '1554224155-6726b3ff858f', 241_664)],
  'C/166/590585': [img('blank-worksheet.jpg', '1460925895917-afdab827c52f', 156_672)],
  'P/189/301744': [pdf('cancelled-cheque-icici.pdf', 120_832)],
};

let tickets = SEED.map((t, i) => {
  const msgs = t.messages.map((m, j) => ({
    ...m,
    id: `m-${i}-${j}`,
    author: m.by === 'user' ? t.name : m.author,
    files: j === 0 ? (FILES[t.number] ?? []).map((f, k) => ({ ...f, id: `f-${i}-${k}` })) : [],
  }));
  return {
    status: 'open',
    closedBy: null,
    ...t,
    description: DESCRIPTION[t.number] ?? msgs[0].text,
    id: `tk-${i + 1}`,
    messages: msgs,
    createdAt: msgs[0].at,
    closedAt: t.status === 'closed' ? msgs[msgs.length - 1].at : null,
  };
});

const listeners = new Set();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l) => (listeners.add(l), () => listeners.delete(l));
const update = (id, fn) => {
  tickets = tickets.map((t) => (t.id === id ? fn(t) : t));
  emit();
};

/** All tickets right now (not live) — for the header's global search */
export const getTickets = () => tickets;

/** All tickets (live) */
export function useTickets() {
  return useSyncExternalStore(subscribe, () => tickets);
}

/** The latest message on a ticket */
export const lastMessage = (t) => t.messages[t.messages.length - 1];
/** Waiting on us: open, and the last word is the requester's */
export const awaitingReply = (t) => t.status === 'open' && lastMessage(t).by === 'user';
/** Every file on a ticket — `by` 'user' for what the requester sent, 'admin' for ours */
export const ticketFiles = (t, by) => t.messages.filter((m) => !by || m.by === by).flatMap((m) => m.files ?? []);

export const supportActions = {
  /** A reply from us: text and/or files ({ name, type, size, url }) */
  reply(id, author, text, files = []) {
    const at = new Date().toISOString();
    const stamp = Date.now();
    update(id, (t) => ({
      ...t,
      messages: [...t.messages, { id: `m-${stamp}`, by: 'admin', author, text, at, files: files.map((f, k) => ({ ...f, id: `f-${stamp}-${k}` })) }],
    }));
  },
  close(id, by) {
    update(id, (t) => ({ ...t, status: 'closed', closedBy: by, closedAt: new Date().toISOString() }));
  },
  reopen(id) {
    update(id, (t) => ({ ...t, status: 'open', closedBy: null, closedAt: null }));
  },
};
