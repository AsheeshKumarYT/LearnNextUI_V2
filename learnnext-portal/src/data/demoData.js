/**
 * Demo data for the starter UI.
 *
 * Pages never import this file directly — they go through src/services/api.js,
 * so this module can be deleted once a real backend is connected.
 * Dates are generated relative to "now" so the demo always looks current.
 */
import { addDays, startOfWeek } from '@/utils/formatDate';

const now = new Date();
const daysAgo = (n, h = 10, m = 0) => {
  const d = addDays(now, -n);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
const minutesAgo = (n) => new Date(now.getTime() - n * 60000).toISOString();

export const demoUser = {
  id: 'u-1',
  name: 'Atul Kumar',
  email: 'admin@learnnext.io',
  phone: '+91 98200 41120',
  role: 'Training Partner',
  // Every role this login can sign in as (picked after sign-in; see src/config/roles.js)
  roles: ['admin', 'super-admin', 'facilitator', 'participant'],
  department: 'Learning Operations',
  designation: 'Head of Learning Operations',
  employeeId: 'LN-0142',
  location: 'Mumbai, India',
  bio: 'Runs the LearnNext academic operations team — course quality, instructor onboarding and learner success.',
  avatar: '/avatars/atul-kumar.jpg',
  cover: 'fireflies',
  joinedAt: daysAgo(1124),
  lastLoginAt: minutesAgo(42),
  passwordChangedAt: daysAgo(96),
};

/** Department options for the profile form */
export const departments = ['Learning Operations', 'Finance & Billing', 'Content & Curriculum', 'Facilitator Network', 'Client Success', 'Sales & Partnerships', 'Technology', 'Human Resources'];

/** Mock OTP for the password-change flow (shown on screen while auth is mocked) */
export const demoOtp = '246810';

/**
 * The signed-in admin's own activity (newest first).
 * module: projects | finance | content | security | profile — kind picks the icon. `alert` flags unfamiliar sign-ins.
 */
const hoursAgo = (h) => new Date(now.getTime() - h * 3600000).toISOString();
export const activityLog = [
  { id: 'act-1', module: 'security', kind: 'signin', verb: 'Signed in on', entity: 'Chrome · Windows', detail: 'Mumbai, India', at: minutesAgo(42) },
  { id: 'act-2', module: 'finance', kind: 'approve', verb: 'Approved invoice', entity: 'INV-2025-0418', detail: 'Tata Steel · Leadership Accelerator', amount: 482000, at: hoursAgo(2.4) },
  { id: 'act-3', module: 'projects', kind: 'create', verb: 'Created project', entity: 'Women in Leadership — Cohort 4', detail: 'Infosys · 24 participants', at: hoursAgo(4.8) },
  { id: 'act-4', module: 'content', kind: 'publish', verb: 'Published module', entity: 'Design Thinking 101', detail: 'Manage Content · 6 lessons', at: hoursAgo(6.5) },
  { id: 'act-5', module: 'projects', kind: 'assign', verb: 'Assigned facilitator', entity: 'Rohan Kapoor', detail: 'Strategic Negotiation — Batch 2', at: daysAgo(1, 16, 20) },
  { id: 'act-6', module: 'finance', kind: 'credit', verb: 'Issued credit note', entity: 'CN-0091', detail: 'Wipro · adjusted for 2 no-shows', amount: 36000, at: daysAgo(1, 12, 5) },
  { id: 'act-7', module: 'security', kind: 'newdevice', verb: 'New sign-in on', entity: 'Safari · iPhone', detail: 'Pune, India · first time on this device', alert: true, at: daysAgo(1, 9, 40) },
  { id: 'act-8', module: 'projects', kind: 'complete', verb: 'Marked complete', entity: 'Sales Excellence Bootcamp', detail: 'HDFC Bank · feedback 4.7 / 5', at: daysAgo(2, 18, 0) },
  { id: 'act-9', module: 'finance', kind: 'einvoice', verb: 'Generated e-invoice', entity: 'INV-2025-0411', detail: 'Mahindra · IRN generated', amount: 215500, at: daysAgo(2, 11, 30) },
  { id: 'act-10', module: 'content', kind: 'survey', verb: 'Launched survey', entity: 'Post-program Feedback', detail: 'Polls & Surveys · sent to 86 learners', at: daysAgo(3, 15, 40) },
  { id: 'act-11', module: 'profile', kind: 'profile', verb: 'Updated your', entity: 'designation', detail: 'Head of Learning Operations', at: daysAgo(3, 10, 10) },
  { id: 'act-12', module: 'content', kind: 'upload', verb: 'Uploaded assessment', entity: 'Leadership Styles Quiz', detail: 'Assessments · 20 questions', at: daysAgo(4, 12, 0) },
  { id: 'act-13', module: 'projects', kind: 'reschedule', verb: 'Rescheduled session', entity: 'Coaching Circle — Week 3', detail: 'Moved to Thursday, 10:00 AM', at: daysAgo(5, 14, 45) },
  { id: 'act-14', module: 'finance', kind: 'approve', verb: 'Approved trainer invoice', entity: 'TI-0233', detail: 'Maya Fernandes · 3 sessions', amount: 54000, at: daysAgo(6, 17, 0) },
  { id: 'act-15', module: 'projects', kind: 'create', verb: 'Created project', entity: 'First-time Managers Program', detail: 'Bajaj Finserv · 32 participants', at: daysAgo(8, 11, 20) },
  { id: 'act-16', module: 'finance', kind: 'debit', verb: 'Raised debit note', entity: 'DN-0047', detail: 'L&T · extra venue day', amount: 28000, at: daysAgo(9, 16, 10) },
  { id: 'act-17', module: 'security', kind: 'signin', verb: 'Signed in on', entity: 'Edge · Windows', detail: 'Mumbai, India', at: daysAgo(10, 9, 5) },
  { id: 'act-18', module: 'content', kind: 'publish', verb: 'Published module', entity: 'Feedback That Lands', detail: 'Manage Content · 4 lessons', at: daysAgo(12, 13, 30) },
  { id: 'act-19', module: 'security', kind: 'password', verb: 'Changed your', entity: 'password', detail: 'Verified with a one-time code', at: daysAgo(96, 11, 0) },
];

/** Actions per day for the last 84 days (oldest first) — drives the activity heatmap. Deterministic so it never jumps. */
export const activityHeat = (() => {
  let seed = 4321;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 84 }, (_, i) => {
    const date = addDays(now, i - 83);
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const busy = rand();
    const count = weekend ? (busy > 0.8 ? 1 + Math.floor(rand() * 2) : 0) : busy < 0.12 ? 0 : Math.round(1 + rand() * 7 * (0.5 + i / 168));
    return { date: date.toISOString(), count };
  });
})();

/** Accepted demo credentials (mock auth) */
export const demoCredentials = { email: 'admin@learnnext.io', password: 'learnnext123' };

export const categories = ['Engineering', 'Design', 'Data Science', 'Business', 'Marketing'];

export const instructors = [
  { id: 'i-1', name: 'Rohan Kapoor', email: 'rohan.k@learnnext.io', specialty: 'Engineering', courses: 4, students: 1284, rating: 4.9, status: 'active', joined: daysAgo(620) },
  { id: 'i-2', name: 'Maya Fernandes', email: 'maya.f@learnnext.io', specialty: 'Design', courses: 3, students: 942, rating: 4.8, status: 'active', joined: daysAgo(410) },
  { id: 'i-3', name: 'Daniel Okafor', email: 'daniel.o@learnnext.io', specialty: 'Data Science', courses: 5, students: 1710, rating: 4.7, status: 'active', joined: daysAgo(880) },
  { id: 'i-4', name: 'Sara Lindqvist', email: 'sara.l@learnnext.io', specialty: 'Business', courses: 2, students: 518, rating: 4.6, status: 'away', joined: daysAgo(300) },
  { id: 'i-5', name: 'Kenji Watanabe', email: 'kenji.w@learnnext.io', specialty: 'Engineering', courses: 3, students: 760, rating: 4.8, status: 'active', joined: daysAgo(190) },
  { id: 'i-6', name: 'Priya Raman', email: 'priya.r@learnnext.io', specialty: 'Marketing', courses: 1, students: 204, rating: 4.5, status: 'invited', joined: daysAgo(12) },
];

export const courses = [
  { id: 'c-101', title: 'Modern React Patterns', category: 'Engineering', instructorId: 'i-1', students: 482, lessons: 36, status: 'published', progress: 78, price: 149, updatedAt: daysAgo(2) },
  { id: 'c-102', title: 'Product Design Foundations', category: 'Design', instructorId: 'i-2', students: 356, lessons: 28, status: 'published', progress: 64, price: 129, updatedAt: daysAgo(5) },
  { id: 'c-103', title: 'Applied Machine Learning', category: 'Data Science', instructorId: 'i-3', students: 611, lessons: 42, status: 'published', progress: 71, price: 199, updatedAt: daysAgo(1) },
  { id: 'c-104', title: 'SQL for Analysts', category: 'Data Science', instructorId: 'i-3', students: 298, lessons: 20, status: 'published', progress: 83, price: 89, updatedAt: daysAgo(9) },
  { id: 'c-105', title: 'Go Microservices in Practice', category: 'Engineering', instructorId: 'i-5', students: 0, lessons: 18, status: 'draft', progress: 0, price: 179, updatedAt: daysAgo(0, 9) },
  { id: 'c-106', title: 'Strategic Finance Essentials', category: 'Business', instructorId: 'i-4', students: 174, lessons: 16, status: 'review', progress: 52, price: 119, updatedAt: daysAgo(3) },
  { id: 'c-107', title: 'Design Systems at Scale', category: 'Design', instructorId: 'i-2', students: 221, lessons: 24, status: 'published', progress: 59, price: 159, updatedAt: daysAgo(14) },
  { id: 'c-108', title: 'Growth Marketing Playbook', category: 'Marketing', instructorId: 'i-6', students: 0, lessons: 12, status: 'draft', progress: 0, price: 99, updatedAt: daysAgo(4) },
  { id: 'c-109', title: 'TypeScript Deep Dive', category: 'Engineering', instructorId: 'i-1', students: 405, lessons: 30, status: 'published', progress: 74, price: 139, updatedAt: daysAgo(21) },
  {
    id: 'c-110',
    title: 'Data Visualization with Python',
    category: 'Data Science',
    instructorId: 'i-3',
    students: 0,
    lessons: 22,
    status: 'archived',
    progress: 0,
    price: 109,
    updatedAt: daysAgo(120),
  },
];

const firstNames = [
  'Arjun',
  'Emily',
  'Lucas',
  'Zara',
  'Noah',
  'Isha',
  'Liam',
  'Chloe',
  'Kabir',
  'Mia',
  'Ethan',
  'Ananya',
  'Oliver',
  'Fatima',
  'Leo',
  'Sofia',
  'Vikram',
  'Grace',
  'Mateo',
  'Nina',
  'Aarav',
  'Hannah',
  'Yusuf',
  'Ava',
];
const lastNames = [
  'Sharma',
  'Clarke',
  'Moreau',
  'Ali',
  'Bennett',
  'Iyer',
  'Walsh',
  'Nguyen',
  'Singh',
  'Rossi',
  'Turner',
  'Nair',
  'Brooks',
  'Haddad',
  'Fischer',
  'García',
  'Menon',
  'Park',
  'Silva',
  'Novak',
  'Joshi',
  'Becker',
  'Rahman',
  'Cohen',
];
const studentStatuses = ['active', 'active', 'active', 'active', 'inactive', 'pending'];

export const students = firstNames.map((first, i) => {
  const last = lastNames[i];
  const course = courses[i % 4 === 3 ? 6 : i % 4];
  return {
    id: `s-${1001 + i}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace('í', 'i')}@mail.com`,
    courseId: course.id,
    courseTitle: course.title,
    progress: (i * 37) % 100,
    status: studentStatuses[i % studentStatuses.length],
    enrolledAt: daysAgo(3 + i * 4),
    lastActive: daysAgo(i % 6, 8 + (i % 9)),
  };
});

/** Sessions for the current week (Mon-based). dayOffset 0 = Monday. */
const weekStart = startOfWeek(now);
const at = (dayOffset, h, m = 0) => {
  const d = addDays(weekStart, dayOffset);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};
export const sessions = [
  { id: 'ss-1', title: 'React Server Components', courseId: 'c-101', instructorId: 'i-1', start: at(0, 10), end: at(0, 11, 30), type: 'live', room: 'Studio A' },
  { id: 'ss-2', title: 'Critique: Onboarding flows', courseId: 'c-102', instructorId: 'i-2', start: at(1, 14), end: at(1, 15), type: 'workshop', room: 'Zoom' },
  { id: 'ss-3', title: 'Gradient boosting lab', courseId: 'c-103', instructorId: 'i-3', start: at(2, 9, 30), end: at(2, 11), type: 'lab', room: 'Lab 2' },
  { id: 'ss-4', title: 'Office hours', courseId: 'c-104', instructorId: 'i-3', start: at(2, 16), end: at(2, 17), type: 'office', room: 'Zoom' },
  { id: 'ss-5', title: 'Token architecture', courseId: 'c-107', instructorId: 'i-2', start: at(3, 11), end: at(3, 12, 30), type: 'live', room: 'Studio B' },
  { id: 'ss-6', title: 'Valuation case study', courseId: 'c-106', instructorId: 'i-4', start: at(4, 13), end: at(4, 14, 30), type: 'workshop', room: 'Room 4' },
  { id: 'ss-7', title: 'Generics & inference', courseId: 'c-109', instructorId: 'i-1', start: at(4, 17), end: at(4, 18), type: 'live', room: 'Studio A' },
];

export const conversations = [
  {
    id: 'cv-1',
    name: 'Maya Fernandes',
    role: 'Instructor',
    online: true,
    unread: 2,
    messages: [
      { id: 'm1', from: 'them', text: 'Hi Atul — the new module for Design Systems at Scale is ready for review.', at: minutesAgo(48) },
      { id: 'm2', from: 'me', text: 'Great, I’ll take a look this afternoon. Any changes to the assessments?', at: minutesAgo(40) },
      { id: 'm3', from: 'them', text: 'Two new quizzes and a capstone brief. I’ve attached the outline in the course notes.', at: minutesAgo(12) },
      { id: 'm4', from: 'them', text: 'Could we publish by Friday?', at: minutesAgo(11) },
    ],
  },
  {
    id: 'cv-2',
    name: 'Daniel Okafor',
    role: 'Instructor',
    online: false,
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Lab 2 is booked for Wednesday’s session.', at: daysAgo(1, 15) },
      { id: 'm2', from: 'me', text: 'Perfect, thanks Daniel.', at: daysAgo(1, 15, 20) },
    ],
  },
  {
    id: 'cv-3',
    name: 'Zara Ali',
    role: 'Student',
    online: true,
    unread: 1,
    messages: [{ id: 'm1', from: 'them', text: 'I can’t access the SQL for Analysts certificate download. Can you help?', at: minutesAgo(130) }],
  },
  {
    id: 'cv-4',
    name: 'Learner Success Team',
    role: 'Team',
    online: false,
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Weekly retention report is attached in Analytics.', at: daysAgo(2, 9) },
      { id: 'm2', from: 'me', text: 'Thanks — retention is looking healthier this month.', at: daysAgo(2, 10) },
    ],
  },
  {
    id: 'cv-5',
    name: 'Kenji Watanabe',
    role: 'Instructor',
    online: false,
    unread: 0,
    messages: [{ id: 'm1', from: 'me', text: 'Draft for Go Microservices looks good — let’s schedule a review.', at: daysAgo(4, 12) }],
  },
  {
    id: 'cv-6',
    name: 'Sneha Kapoor',
    role: 'Coach',
    online: true,
    unread: 3,
    messages: [
      { id: 'm1', from: 'me', text: 'Hi Sneha, how did the chemistry sessions with Vedanta Group A go?', at: minutesAgo(95) },
      { id: 'm2', from: 'them', text: 'Really well! 9 of 12 coachees confirmed the match.', at: minutesAgo(30) },
      { id: 'm3', from: 'them', text: 'The remaining 3 want to meet one more coach before deciding.', at: minutesAgo(29) },
      { id: 'm4', from: 'them', text: 'Can you share two more coach profiles with them?', at: minutesAgo(28) },
    ],
  },
  {
    id: 'cv-7',
    name: 'Rahul Verma',
    role: 'HR · HDFC Life',
    online: true,
    unread: 1,
    messages: [{ id: 'm1', from: 'them', text: 'Hello! Our Ops Managers cohort is ready to start. When can we expect the coach mapping?', at: minutesAgo(75) }],
  },
  {
    id: 'cv-8',
    name: 'Nikhil Bose',
    role: 'Coach',
    online: false,
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'I’ve submitted my invoice for Airtel Group A — ₹90,000.', at: daysAgo(1, 11) },
      { id: 'm2', from: 'me', text: 'Got it, it’s with Finance. I’ll chase it today.', at: daysAgo(1, 11, 25) },
      { id: 'm3', from: 'them', text: 'Thank you 🙏', at: daysAgo(1, 11, 30) },
    ],
  },
  {
    id: 'cv-9',
    name: 'Ananya Iyer',
    role: 'Coach',
    online: true,
    unread: 0,
    messages: [
      { id: 'm1', from: 'me', text: 'Ananya, the Intas goal-setting templates are uploaded.', at: daysAgo(0, 9, 10) },
      { id: 'm2', from: 'them', text: 'Perfect, I’ll use them in tomorrow’s sessions.', at: daysAgo(0, 9, 40) },
    ],
  },
  {
    id: 'cv-10',
    name: 'Priya Malhotra',
    role: 'Coachee · Wipro',
    online: false,
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Is it possible to reschedule my session to next Tuesday?', at: daysAgo(2, 16) },
      { id: 'm2', from: 'me', text: 'Sure — I’ve moved it to Tuesday 4 PM. You’ll get a calendar update shortly.', at: daysAgo(2, 16, 20) },
    ],
  },
  {
    id: 'cv-11',
    name: 'Finance Team',
    role: 'Team',
    online: false,
    unread: 2,
    messages: [
      { id: 'm1', from: 'them', text: 'Two advance invoices are awaiting your approval.', at: minutesAgo(200) },
      { id: 'm2', from: 'them', text: 'Mahindra ADV-2026-012 and ADN-2026-003.', at: minutesAgo(199) },
    ],
  },
  {
    id: 'cv-12',
    name: 'Farah Menon',
    role: 'Coach',
    online: true,
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'IDP drafts for the HDFC Leadership Cohort are done. Sharing with coachees this week.', at: daysAgo(1, 17) },
      { id: 'm2', from: 'me', text: 'Brilliant, thanks Farah!', at: daysAgo(1, 17, 15) },
    ],
  },
  {
    id: 'cv-13',
    name: 'Arjun Sharma',
    role: 'Student',
    online: false,
    unread: 0,
    messages: [{ id: 'm1', from: 'them', text: 'Thanks for unlocking Module 3!', at: daysAgo(3, 10) }],
  },
  {
    id: 'cv-14',
    name: 'Kavya Shah',
    role: 'Coach',
    online: false,
    unread: 0,
    messages: [
      { id: 'm1', from: 'me', text: 'Kavya, Mahindra Senior Leaders kicks off in two weeks — are you available for orientation on the 21st?', at: daysAgo(5, 14) },
      { id: 'm2', from: 'them', text: 'Yes, blocked it in my calendar.', at: daysAgo(5, 15) },
    ],
  },
];

export const notifications = [
  { id: 'n-1', type: 'enrollment', title: '24 new enrollments', body: 'Modern React Patterns had 24 new enrollments today.', at: minutesAgo(25), read: false },
  { id: 'n-2', type: 'review', title: 'Course submitted for review', body: 'Sara Lindqvist submitted “Strategic Finance Essentials”.', at: minutesAgo(140), read: false },
  { id: 'n-3', type: 'message', title: 'New message from Maya Fernandes', body: 'Could we publish by Friday?', at: minutesAgo(11), read: false },
  { id: 'n-4', type: 'system', title: 'Scheduled maintenance', body: 'Video transcoding will pause Sunday 02:00–03:00 IST.', at: daysAgo(1, 18), read: true },
  { id: 'n-5', type: 'alert', title: 'Payout failed', body: 'An instructor payout could not be processed. Check billing details.', at: daysAgo(2, 11), read: true },
  { id: 'n-6', type: 'enrollment', title: 'Milestone reached', body: 'Applied Machine Learning passed 600 active learners.', at: daysAgo(3, 16), read: true },
];

export const activity = [
  { id: 'a-1', actor: 'Maya Fernandes', action: 'published a new lesson in', target: 'Design Systems at Scale', at: minutesAgo(18), type: 'publish' },
  { id: 'a-2', actor: 'Zara Ali', action: 'completed', target: 'SQL for Analysts', at: minutesAgo(64), type: 'complete' },
  { id: 'a-3', actor: 'Sara Lindqvist', action: 'submitted for review', target: 'Strategic Finance Essentials', at: minutesAgo(140), type: 'review' },
  { id: 'a-4', actor: 'Kenji Watanabe', action: 'created a draft', target: 'Go Microservices in Practice', at: daysAgo(0, 9), type: 'create' },
  { id: 'a-5', actor: 'Priya Raman', action: 'accepted the instructor invite', target: '', at: daysAgo(1, 13), type: 'invite' },
];

const monthLabels = Array.from({ length: 12 }, (_, i) => {
  const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
  return d.toLocaleDateString('en-US', { month: 'short' });
});
const enrollSeries = [820, 910, 880, 1040, 1120, 1080, 1260, 1340, 1290, 1480, 1560, 1690];
const completionSeries = [410, 470, 450, 520, 590, 560, 640, 700, 680, 760, 820, 880];

export const analytics = {
  monthly: monthLabels.map((label, i) => ({
    label,
    enrollments: enrollSeries[i],
    completions: completionSeries[i],
    revenue: enrollSeries[i] * 38,
  })),
  weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
    label,
    active: [3120, 3480, 3610, 3390, 3720, 2410, 2180][i],
    minutes: [41, 46, 48, 44, 52, 33, 29][i],
  })),
  byCategory: [
    { name: 'Engineering', value: 1648 },
    { name: 'Data Science', value: 909 },
    { name: 'Design', value: 577 },
    { name: 'Business', value: 174 },
    { name: 'Marketing', value: 96 },
  ],
  kpis: {
    activeLearners: { value: 3404, change: 12.4 },
    completionRate: { value: 0.684, change: 3.1 },
    revenue: { value: 64220, change: 8.6 },
    avgRating: { value: 4.76, change: -0.4 },
    newEnrollments: { value: 1690, change: 8.3 },
    watchMinutes: { value: 41.9, change: 5.2 },
  },
};

export const loginActivity = [
  { id: 'l-1', device: 'Chrome on Windows', location: 'Mumbai, IN', at: minutesAgo(5), current: true },
  { id: 'l-2', device: 'Safari on iPhone', location: 'Mumbai, IN', at: daysAgo(1, 21) },
  { id: 'l-3', device: 'Chrome on macOS', location: 'Pune, IN', at: daysAgo(6, 10) },
];

/* ---------------------------------------------------------------- Coaching (dashboard) */

/** Funnel stages in order. Upcoming engagements sit in "Setup" until they start. */
export const coachingStages = ['Setup', 'Coach approval', 'Orientation', 'Chemistry', 'Tripartite', 'Goal Setting', 'IDP', 'Reviews'];

const coaches = ['S. Kapoor', 'N. Bose', 'A. Iyer', 'F. Menon', 'R. Das', 'M. Rao', 'K. Shah', 'P. Nair', 'D. Sethi', 'L. Thomas', 'V. Gupta', 'J. Pillai', 'H. Mehra', 'T. Banerjee'];

// status: active | upcoming | completed · health: on-track | attention | blocked
const eng = (id, client, program, coach, status, stage, health, coachees, totalSessions, delivered, start, end) => ({
  id: `e-${id}`,
  client,
  program,
  coach,
  status,
  stage,
  health,
  coachees,
  totalSessions,
  delivered,
  startDate: daysAgo(start),
  endDate: end == null ? null : daysAgo(end),
});

export const coaching = {
  stages: coachingStages,
  coaches,
  engagements: [
    eng(1, 'Vedanta', 'Group A', 'S. Kapoor', 'active', 'Chemistry', 'attention', 12, 24, 0, 18),
    eng(2, 'Airtel', 'Group A', 'N. Bose', 'active', 'Reviews', 'on-track', 18, 36, 12, 140),
    eng(3, 'Wipro', 'Emerging Leaders', 'N. Bose', 'active', 'Orientation', 'on-track', 12, 24, 0, 9),
    eng(4, 'Intas', 'Leadership', 'A. Iyer', 'active', 'Goal Setting', 'on-track', 10, 20, 0, 35),
    eng(5, 'Wipro', 'Sales Heads', 'S. Kapoor', 'active', 'Tripartite', 'attention', 10, 20, 0, 28),
    eng(6, 'HDFC Life', 'Ops Managers', 'A. Iyer', 'active', 'Coach approval', 'blocked', 10, 20, 2, 12),
    eng(7, 'Maruti Suzuki', 'Mid-Mgmt', 'S. Kapoor', 'active', 'Reviews', 'on-track', 18, 36, 18, 160),
    eng(8, 'HDFC Life', 'Leadership Cohort', 'F. Menon', 'active', 'IDP', 'attention', 12, 24, 8, 75),
    eng(9, 'ICICI', 'Branch Heads', 'R. Das', 'active', 'Chemistry', 'on-track', 8, 16, 0, 15),
    eng(10, 'Tata Steel', 'Plant Leaders', 'F. Menon', 'active', 'Goal Setting', 'on-track', 10, 20, 4, 50),
    eng(11, 'Infosys', 'New Managers', 'R. Das', 'active', 'Coach approval', 'blocked', 12, 24, 0, 6),
    eng(12, 'Airtel', 'Group B', 'N. Bose', 'active', 'Orientation', 'on-track', 10, 20, 0, 4),
    eng(13, 'Vedanta', 'Group B', 'A. Iyer', 'active', 'Reviews', 'on-track', 12, 24, 14, 120),
    eng(14, 'Cipla', 'HiPo Program', 'M. Rao', 'active', 'IDP', 'attention', 8, 16, 6, 70),
    eng(15, 'Bajaj Finserv', 'Sales Leaders', 'M. Rao', 'active', 'Tripartite', 'on-track', 10, 20, 2, 40),
    eng(16, 'ICICI', 'New Request', 'Unassigned', 'upcoming', 'Setup', 'attention', 6, 12, 0, -10),
    eng(17, 'Mahindra', 'Senior Leaders', 'K. Shah', 'upcoming', 'Setup', 'on-track', 8, 16, 0, -14),
    eng(18, 'Asian Paints', 'First-time Managers', 'K. Shah', 'upcoming', 'Setup', 'on-track', 12, 24, 0, -21),
    eng(19, 'Wipro', 'Women Leaders', 'S. Kapoor', 'upcoming', 'Setup', 'on-track', 10, 20, 0, -30),
    eng(20, 'HDFC Life', 'Pilot Cohort', 'A. Iyer', 'completed', null, 'on-track', 6, 12, 12, 300, 120),
    eng(21, 'Infosys', 'Directors', 'R. Das', 'completed', null, 'on-track', 8, 16, 16, 200, 20),
    eng(22, 'Maruti Suzuki', 'Plant Heads', 'S. Kapoor', 'completed', null, 'on-track', 10, 20, 20, 180, 5),
    eng(23, 'Tata Steel', 'CXO Circle', 'F. Menon', 'completed', null, 'on-track', 4, 8, 8, 400, 200),
    eng(24, 'Cipla', 'Managers', 'M. Rao', 'completed', null, 'on-track', 10, 20, 20, 240, 60),
  ],
  /** queue: pm (admin team) | coachee | coach */
  actions: [
    { id: 'a-1', queue: 'pm', action: 'Complete coach–coachee mapping', client: 'HDFC Life', program: 'Ops Managers', details: '5 coaches added, but not mapped', ageDays: 5 },
    { id: 'a-2', queue: 'pm', action: 'Set up Chemistry component', client: 'Vedanta', program: 'Group A', details: 'Enabled but not configured — locks once started', ageDays: 1 },
    { id: 'a-3', queue: 'pm', action: 'Approve facilitator invoice', client: 'HDFC Life', program: 'Leadership Cohort', details: 'F. Menon · ₹92,000', ageDays: 2 },
    { id: 'a-4', queue: 'pm', action: 'Manual coaching setup', client: 'ICICI', program: 'New Request', details: 'Marketplace request awaiting admin setup', ageDays: 3 },
    { id: 'a-5', queue: 'pm', action: 'Review overdue invoice', client: 'Airtel', program: 'Group A', details: 'N. Bose · ₹90,000 stuck at Finance', ageDays: 12 },
    { id: 'a-6', queue: 'coachee', action: 'Pick a coach', client: 'Infosys', program: 'New Managers', details: '4 of 12 coachees haven’t chosen a coach', ageDays: 6 },
    { id: 'a-7', queue: 'coachee', action: 'Complete pre-assessment', client: 'Wipro', program: 'Emerging Leaders', details: '7 coachees pending the 360° survey', ageDays: 4 },
    { id: 'a-8', queue: 'coachee', action: 'Book chemistry session', client: 'ICICI', program: 'Branch Heads', details: '3 coachees haven’t booked a slot', ageDays: 2 },
    { id: 'a-9', queue: 'coachee', action: 'Submit goals', client: 'Intas', program: 'Leadership', details: 'Goal sheet due after tripartite', ageDays: 8 },
    { id: 'a-10', queue: 'coachee', action: 'Sign off IDP', client: 'Cipla', program: 'HiPo Program', details: '2 IDPs awaiting coachee sign-off', ageDays: 3 },
    { id: 'a-11', queue: 'coachee', action: 'Confirm tripartite slot', client: 'Wipro', program: 'Sales Heads', details: 'Manager + coachee availability pending', ageDays: 1 },
    { id: 'a-12', queue: 'coachee', action: 'Rate last session', client: 'Airtel', program: 'Group A', details: '9 feedback forms outstanding', ageDays: 9 },
    { id: 'a-13', queue: 'coach', action: 'Accept engagement', client: 'HDFC Life', program: 'Ops Managers', details: 'A. Iyer hasn’t accepted the assignment', ageDays: 4 },
    { id: 'a-14', queue: 'coach', action: 'Publish availability', client: 'Infosys', program: 'New Managers', details: 'R. Das has no open slots next 2 weeks', ageDays: 3 },
    { id: 'a-15', queue: 'coach', action: 'Upload session notes', client: 'Vedanta', program: 'Group B', details: '6 sessions without notes', ageDays: 7 },
    { id: 'a-16', queue: 'coach', action: 'Submit invoice', client: 'Maruti Suzuki', program: 'Mid-Mgmt', details: 'S. Kapoor · Q3 sessions not billed', ageDays: 11 },
  ],
  /** type: client-invoice | client-debit-note | advance-invoice | advance-debit-note · arStatus: approved | pending | rejected */
  invoices: [
    { id: 'inv-1', number: 'INV-2026-041', type: 'client-invoice', client: 'Airtel', program: 'Group A', amount: 180000, date: daysAgo(3), arStatus: 'pending' },
    { id: 'inv-2', number: 'INV-2026-040', type: 'client-invoice', client: 'Maruti Suzuki', program: 'Mid-Mgmt', amount: 160000, date: daysAgo(6), arStatus: 'approved' },
    { id: 'inv-3', number: 'INV-2026-039', type: 'client-invoice', client: 'HDFC Life', program: 'Leadership Cohort', amount: 120000, date: daysAgo(9), arStatus: 'approved' },
    { id: 'inv-4', number: 'INV-2026-038', type: 'client-invoice', client: 'Vedanta', program: 'Group B', amount: 110000, date: daysAgo(12), arStatus: 'pending' },
    { id: 'inv-5', number: 'INV-2026-037', type: 'client-invoice', client: 'Tata Steel', program: 'Plant Leaders', amount: 90000, date: daysAgo(15), arStatus: 'approved' },
    { id: 'inv-6', number: 'INV-2026-036', type: 'client-invoice', client: 'Cipla', program: 'HiPo Program', amount: 75000, date: daysAgo(20), arStatus: 'rejected' },
    { id: 'inv-7', number: 'INV-2026-031', type: 'client-invoice', client: 'Infosys', program: 'Directors', amount: 65000, date: daysAgo(48), arStatus: 'approved' },
    { id: 'inv-8', number: 'INV-2026-024', type: 'client-invoice', client: 'Bajaj Finserv', program: 'Sales Leaders', amount: 50000, date: daysAgo(95), arStatus: 'approved' },
    { id: 'inv-9', number: 'CDN-2026-007', type: 'client-debit-note', client: 'Airtel', program: 'Group A', amount: 18000, date: daysAgo(4), arStatus: 'pending' },
    { id: 'inv-10', number: 'CDN-2026-006', type: 'client-debit-note', client: 'Wipro', program: 'Sales Heads', amount: 12000, date: daysAgo(26), arStatus: 'approved' },
    { id: 'inv-11', number: 'ADV-2026-012', type: 'advance-invoice', client: 'Mahindra', program: 'Senior Leaders', amount: 95000, date: daysAgo(2), arStatus: 'pending' },
    { id: 'inv-12', number: 'ADV-2026-011', type: 'advance-invoice', client: 'Asian Paints', program: 'First-time Managers', amount: 80000, date: daysAgo(8), arStatus: 'approved' },
    { id: 'inv-13', number: 'ADV-2026-010', type: 'advance-invoice', client: 'Wipro', program: 'Women Leaders', amount: 65000, date: daysAgo(17), arStatus: 'approved' },
    { id: 'inv-14', number: 'ADV-2026-008', type: 'advance-invoice', client: 'ICICI', program: 'Branch Heads', amount: 50000, date: daysAgo(70), arStatus: 'approved' },
    { id: 'inv-15', number: 'ADN-2026-003', type: 'advance-debit-note', client: 'Mahindra', program: 'Senior Leaders', amount: 12000, date: daysAgo(5), arStatus: 'pending' },
    { id: 'inv-16', number: 'ADN-2026-002', type: 'advance-debit-note', client: 'ICICI', program: 'Branch Heads', amount: 8000, date: daysAgo(40), arStatus: 'approved' },
  ],
};

/* ------------------------------------------------------- Admin dashboard */
/**
 * Base figures = "last month" (from the previous admin UI). services/api.js scales the
 * period-dependent parts (programs, billing, usage) for other periods.
 */
// 24 people (≥ the largest demo session) so a session never lists the same person twice.
const cohort = [
  'Ananya Rao',
  'Vikram Shah',
  'Neha Kapoor',
  'Rohit Verma',
  'Priya Nair',
  'Karan Mehta',
  'Sneha Iyer',
  'Arjun Das',
  'Meera Joshi',
  'Aditya Kulkarni',
  'Pooja Menon',
  'Rahul Bose',
  'Ishita Sen',
  'Varun Malhotra',
  'Divya Reddy',
  'Nikhil Jain',
  'Tanvi Shetty',
  'Siddharth Rao',
  'Kavya Nair',
  'Manav Gill',
  'Riya Chopra',
  'Harsh Vora',
  'Ayesha Khan',
  'Dev Patel',
];
// Stable id per person, so the same participant is recognised across sessions
const participants = (n, offset = 0) =>
  Array.from({ length: n }, (_, i) => {
    const idx = (i + offset) % cohort.length;
    return { id: `pt-${idx}`, name: cohort[idx] };
  });

export const dashboard = {
  programs: { completed: 39, inProgress: 6, upcoming: 9, pending: 14 },
  liveToday: [],
  upcoming: [
    { id: 'pg-1', title: 'XSEED Phase I (ALR)', client: 'Hindalco Industries Ltd', brand: 'Blanchard', date: daysAgo(-1, 9, 30), participants: participants(9, 0) },
    { id: 'pg-2', title: 'XSEED Phase I (ALR)', client: 'Hindalco Industries Ltd', brand: 'Blanchard', date: daysAgo(-1, 14, 0), participants: participants(9, 3) },
    { id: 'pg-3', title: 'Situational Leadership II', client: 'Titan Company Ltd', brand: 'Blanchard', date: daysAgo(-2, 10, 0), participants: participants(14, 1) },
    { id: 'pg-4', title: 'Crucial Conversations', client: 'Hero MotoCorp Ltd', brand: 'DOOR Training', date: daysAgo(-3, 9, 0), participants: participants(18, 5) },
    { id: 'pg-5', title: 'First-Time Manager Lab', client: 'BYLD Consulting India Pvt Ltd', brand: 'Leadership Consulting', date: daysAgo(-5, 11, 0), participants: participants(11, 2) },
    { id: 'pg-6', title: 'Coaching for Performance', client: 'Crucial Learning India', brand: 'BYLD Consulting', date: daysAgo(-6, 10, 30), participants: participants(6, 7) },
    { id: 'pg-7', title: 'Leading at the Speed of Trust', client: 'Titan Company Ltd', brand: 'DOOR Training', date: daysAgo(-7, 9, 30), participants: participants(20, 4) },
    { id: 'pg-8', title: 'XSEED Phase II (ALR)', client: 'Hindalco Industries Ltd', brand: 'Blanchard', date: daysAgo(-9, 9, 30), participants: participants(12, 6) },
    { id: 'pg-9', title: 'Design Thinking Bootcamp', client: 'Hero MotoCorp Ltd', brand: 'Leadership Consulting', date: daysAgo(-10, 10, 0), participants: participants(16, 8) },
  ],
  billing: {
    invoiced: 16680766,
    received: 7005922, // ~42% collected (last month)
    entities: [
      { code: 'B', name: 'Blanchard', value: 6292000 },
      { code: 'L', name: 'Leadership Consulting', value: 5993266 },
      { code: 'D', name: 'DOOR Training', value: 4312000 },
      { code: 'BYLDC', name: 'BYLD Consulting', value: 83500 },
    ],
  },
  /** Lifetime billing — not period dependent */
  topClients: [
    { name: 'Hindalco Industries Ltd', value: 34925190 },
    { name: 'Titan Company Ltd', value: 18746660 },
    { name: 'Hero MotoCorp Ltd', value: 13410146 },
    { name: 'BYLD Consulting India Pvt Ltd', value: 12344331 },
    { name: 'Crucial Learning India', value: 11280882 },
  ],
  partners: { trainers: 136, coaches: 6, channelPartners: 12 },
  agreements: {
    active: 8,
    pending: 5,
    expired: 0,
    expiring: [
      { key: '30', label: 'Within 30 days', count: 2 },
      { key: '60', label: '31–60 days', count: 3 },
      { key: '90', label: '61–90 days', count: 3 },
    ],
  },
  leaderboard: {
    trainer: [
      { id: 't1', name: 'Ashish Test', meta: '14 programs delivered', points: 80 },
      { id: 't2', name: 'Rucha Deshpande', meta: '12 programs delivered', points: 75 },
      { id: 't3', name: 'Satish Chandra', meta: '11 programs delivered', points: 75 },
      { id: 't4', name: 'Kavita Sharma', meta: '9 programs delivered', points: 71 },
      { id: 't5', name: 'Manish Gupta', meta: '8 programs delivered', points: 66 },
    ],
    coach: [
      { id: 'c1', name: 'Nandini Rao', meta: '22 sessions coached', points: 88 },
      { id: 'c2', name: 'Farhan Qureshi', meta: '19 sessions coached', points: 81 },
      { id: 'c3', name: 'Deepa Pillai', meta: '15 sessions coached', points: 74 },
      { id: 'c4', name: 'Sanjay Bhatt', meta: '12 sessions coached', points: 69 },
      { id: 'c5', name: 'Lata Krishnan', meta: '9 sessions coached', points: 61 },
    ],
    channel: [
      { id: 'cp1', name: 'Blanchard Research And Training India LLP', meta: '37 programs sourced', points: 92 },
      { id: 'cp2', name: 'DOOR Training And Consulting India Pvt Ltd', meta: '28 programs sourced', points: 84 },
      { id: 'cp3', name: 'Leadership Consulting Pvt Ltd', meta: '18 programs sourced', points: 73 },
      { id: 'cp4', name: 'BYLD Consulting India Pvt Ltd', meta: '7 programs sourced', points: 58 },
      { id: 'cp5', name: 'Mindsprint Learning Solutions', meta: '4 programs sourced', points: 44 },
    ],
  },
  usage: {
    brand: [
      { name: 'Blanchard Research And Training India LLP', value: 37 },
      { name: 'DOOR Training And Consulting India Pvt Ltd', value: 28 },
      { name: 'Leadership Consulting Pvt Ltd', value: 18 },
      { name: 'BYLD Consulting India Pvt Ltd', value: 7 },
      { name: 'Mindsprint Learning Solutions', value: 4 },
      { name: 'Thinkplace Learning Pvt Ltd', value: 2 },
    ],
    program: [
      { name: 'XSEED Phase I (ALR)', value: 22 },
      { name: 'Situational Leadership II', value: 19 },
      { name: 'Leading at the Speed of Trust', value: 14 },
      { name: 'Crucial Conversations', value: 11 },
      { name: 'Coaching for Performance', value: 6 },
      { name: 'Design Thinking Bootcamp', value: 3 },
    ],
  },
};

/* ---------------------------------------------------------------- Clients (All Clients page) */
// [code, name, industry, city, mobile, createdBy, createdAt (YYYY-MM-DD), status, logo]
const CLIENT_ROWS = [
  ['HIL001', 'Hindalco Industries Ltd', 'Manufacturing', 'Mumbai', '+91 98200 41120', 'Atul Kumar', '2025-03-04', 'active', null],
  ['TCL002', 'Titan Company Ltd', 'Retail', 'Bengaluru', '+91 98451 22719', 'Priya Sharma', '2025-03-18', 'active', '/logos/mark-ring.svg'],
  ['HMC003', 'Hero MotoCorp Ltd', 'Automotive', 'New Delhi', '+91 98110 63452', 'Rohan Kapoor', '2025-04-02', 'active', null],
  ['BYC004', 'BYLD Consulting India Pvt Ltd', 'Consulting', 'Gurugram', '+91 98717 30418', 'Atul Kumar', '2025-04-21', 'active', '/logos/mark-chevron.svg'],
  ['CLI005', 'Crucial Learning India', 'Training', 'Pune', '+91 98220 77105', 'Neha Verma', '2025-05-09', 'active', null],
  ['TSL006', 'Tata Steel Ltd', 'Manufacturing', 'Jamshedpur', '+91 94310 58842', 'Vikram Rao', '2025-05-27', 'active', null],
  ['INF007', 'Infosys Ltd', 'IT Services', 'Bengaluru', '+91 98860 14473', 'Priya Sharma', '2025-06-11', 'active', '/logos/mark-hexagon.svg'],
  ['WIP008', 'Wipro Ltd', 'IT Services', 'Bengaluru', '+91 99016 82230', 'Rohan Kapoor', '2025-06-30', 'inactive', null],
  ['HDB009', 'HDFC Bank Ltd', 'Banking', 'Mumbai', '+91 98190 26654', 'Atul Kumar', '2025-07-14', 'active', null],
  ['MAM010', 'Mahindra & Mahindra Ltd', 'Automotive', 'Mumbai', '+91 98921 40087', 'Neha Verma', '2025-07-29', 'active', '/logos/mark-wave.svg'],
  ['APL011', 'Asian Paints Ltd', 'Manufacturing', 'Mumbai', '+91 98673 51196', 'Vikram Rao', '2025-08-12', 'inactive', null],
  ['BJF012', 'Bajaj Finserv Ltd', 'Financial Services', 'Pune', '+91 98230 69941', 'Priya Sharma', '2025-08-26', 'active', null],
  ['LNT013', 'Larsen & Toubro Ltd', 'Engineering', 'Mumbai', '+91 98200 93327', 'Atul Kumar', '2025-09-09', 'active', '/logos/mark-bars.svg'],
  ['ICB014', 'ICICI Bank Ltd', 'Banking', 'Mumbai', '+91 98694 17788', 'Rohan Kapoor', '2025-09-25', 'active', null],
  ['GCP015', 'Godrej Consumer Products', 'FMCG', 'Mumbai', '+91 98331 25604', 'Neha Verma', '2025-10-08', 'inactive', null],
  ['MSI016', 'Maruti Suzuki India Ltd', 'Automotive', 'Gurugram', '+91 98101 47236', 'Vikram Rao', '2025-10-23', 'active', null],
  ['DRL017', "Dr. Reddy's Laboratories", 'Pharma', 'Hyderabad', '+91 98490 33815', 'Priya Sharma', '2025-11-06', 'active', '/logos/mark-leaf.svg'],
  ['CIP018', 'Cipla Ltd', 'Pharma', 'Mumbai', '+91 98192 60471', 'Atul Kumar', '2025-11-20', 'active', null],
  ['NIL019', 'Nestlé India Ltd', 'FMCG', 'Gurugram', '+91 98731 85502', 'Rohan Kapoor', '2025-12-04', 'active', null],
  ['BAL020', 'Bharti Airtel Ltd', 'Telecom', 'New Delhi', '+91 98100 72249', 'Neha Verma', '2025-12-19', 'inactive', null],
  ['TML021', 'Tech Mahindra Ltd', 'IT Services', 'Pune', '+91 98507 11638', 'Vikram Rao', '2026-01-08', 'active', '/logos/mark-spark.svg'],
  ['MRL022', 'Marico Ltd', 'FMCG', 'Mumbai', '+91 98201 54490', 'Priya Sharma', '2026-01-27', 'active', null],
  ['DIL023', 'Dabur India Ltd', 'FMCG', 'Ghaziabad', '+91 98990 38817', 'Atul Kumar', '2026-02-16', 'active', null],
  ['ITC024', 'ITC Ltd', 'FMCG', 'Kolkata', '+91 98310 92265', 'Rohan Kapoor', '2026-03-05', 'active', null],
  ['AXB025', 'Axis Bank Ltd', 'Banking', 'Mumbai', '+91 98199 47703', 'Neha Verma', '2026-04-14', 'active', '/logos/mark-circles.svg'],
  ['SPI026', 'Sun Pharmaceutical Industries', 'Pharma', 'Mumbai', '+91 98679 20158', 'Vikram Rao', '2026-05-22', 'inactive', null],
  ['UTC027', 'UltraTech Cement Ltd', 'Manufacturing', 'Mumbai', '+91 98207 66341', 'Priya Sharma', '2026-07-03', 'active', null],
  ['MLS028', 'Mindsprint Learning Solutions', 'Training', 'Chennai', '+91 98400 15592', 'Atul Kumar', '2026-08-18', 'active', null],
  ['LCP029', 'Leadership Consulting Pvt Ltd', 'Consulting', 'Mumbai', '+91 98923 74416', 'Rohan Kapoor', '2026-09-24', 'active', null],
  ['DTC030', 'DOOR Training and Consulting', 'Training', 'New Delhi', '+91 98112 58830', 'Neha Verma', '2026-10-06', 'active', '/logos/mark-ring.svg'],
];

export const clients = CLIENT_ROWS.map(([code, name, industry, city, mobile, createdBy, createdAt, status, logo], i) => ({
  id: `cl-${i + 1}`,
  code,
  name,
  industry,
  city,
  mobile,
  createdBy,
  createdAt: `${createdAt}T10:30:00`,
  status,
  logo,
}));

/* ---------------------------------------------------------------- Client projects (client detail → Projects) */
// What the mock projects are built from (see projectsFor in services/api.js)
export const projectCatalog = {
  // Project names, as admins tend to name them
  names: [
    'Executive Coaching Program',
    'Leadership Pipeline 2026',
    'New Manager Bootcamp',
    'Sales Leadership Academy',
    'Women Leaders Cohort',
    'Customer First Initiative',
    'Plant Supervisors Upskilling',
    'Change Champions Network',
  ],
  // [program, type]
  programs: [
    ['Authentic Executive Presence – Speaker Series', 'Coaching'],
    ['Coaching Essentials for Managers', 'Coaching'],
    ['Situational Leadership® II', 'Workshop'],
    ['Crucial Conversations® for Mastering Dialogue', 'Workshop'],
    ['First-Time Manager Program', 'Blended'],
    ['Women in Leadership Journey', 'Blended'],
    ['Building Trust', 'Virtual'],
    ['Leading Through Change', 'Virtual'],
    ['Customer Service Excellence', 'Workshop'],
    ['High-Impact Presentations', 'Workshop'],
  ],
  // How a project is run (shown on the Projects tab, filterable)
  projectTypes: ['Standard Program', 'Coaching'],
  // [entity, sub-entity]
  entities: [
    ['Blanchard Research and Training India LLP', 'Blanchard'],
    ['Crucial Learning India Pvt Ltd', 'Crucial Learning'],
    ['BYLD Group Learning Pvt Ltd', 'BYLD Learning'],
  ],
};

/* ---------------------------------------------------------------- Entity master (Settings → Finance → Entity) */
// Legal entities that bill programs. `parent` = an entity's id; the group's top entity is listed as its own parent (as in the old system). Documents are
// placeholders ({ name, size, type }) until real files are attached.
const doc = (name, size) => ({ name, size, type: 'application/pdf' });
// Demo signature as an SVG data URL (handwritten style)
const svgUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
const signatureImage = (name) =>
  svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 70'><text x='10' y='46' font-family='Brush Script MT, Segoe Script, cursive' font-size='34' fill='#1e3a8a'>${name}</text></svg>`);
export const entities = [
  {
    id: 'ent-1',
    name: 'BYLD Group Learning Pvt Ltd',
    parent: 'ent-1',
    invoicePrefix: 'BYLD',
    status: 'active',
    pan: 'AABCB1234K',
    cinType: 'CIN',
    cin: 'U80301DL2009PTC193221',
    lut: 'AD070325012345K',
    lutDeclaration: 'We declare that supplies of services are made under LUT without payment of IGST, as per the bond filed for FY 2025–26.',
    address: { line1: 'BYLD House, 32 Nehru Place', line2: 'Near Metro Station', country: 'India', state: 'Delhi', city: 'New Delhi', pin: '110019' },
    phone: '9811045210',
    gstin: '07AABCB1234K1Z9',
    createdBy: 'Atul Kumar',
    createdAt: '2025-04-02T10:15:00',
  },
  {
    id: 'ent-2',
    name: 'Blanchard Research and Training India LLP',
    parent: 'ent-1',
    invoicePrefix: 'BRTI',
    status: 'active',
    pan: 'AAHFB5678M',
    cinType: 'LLPIN',
    cin: 'AAB-4521',
    lut: 'AD070325019876L',
    lutDeclaration: 'Export of services under LUT without payment of integrated tax for FY 2025–26.',
    address: { line1: '4th Floor, Tower B, Global Business Park', line2: 'MG Road', country: 'India', state: 'Haryana', city: 'Gurugram', pin: '122002' },
    phone: '9810456789',
    gstin: '06AAHFB5678M1Z2',
    createdBy: 'Neha Verma',
    createdAt: '2025-05-18T14:40:00',
  },
  {
    id: 'ent-3',
    name: 'Crucial Learning India Pvt Ltd',
    parent: 'ent-1',
    invoicePrefix: 'CLIP',
    status: 'active',
    pan: 'AAFCC9012P',
    cinType: 'CIN',
    cin: 'U80900MH2016PTC284512',
    lut: 'AD270325004561C',
    lutDeclaration: 'Supplies are made under LUT ARN AD270325004561C without payment of IGST.',
    address: { line1: '702, Lotus Corporate Park', line2: 'Goregaon East', country: 'India', state: 'Maharashtra', city: 'Mumbai', pin: '400063' },
    phone: '9820034511',
    gstin: '27AAFCC9012P1Z5',
    createdBy: 'Rohan Kapoor',
    createdAt: '2025-06-09T11:05:00',
  },
  {
    id: 'ent-4',
    name: 'BYLD Consulting India Pvt Ltd',
    parent: 'ent-1',
    invoicePrefix: 'BCIP',
    status: 'active',
    pan: 'AAGCB3456Q',
    cinType: 'CIN',
    cin: 'U74140KA2018PTC112908',
    lut: 'AD290325007788B',
    lutDeclaration: 'Zero-rated supply of services under LUT for FY 2025–26.',
    address: { line1: 'Prestige Tech Park, Block 3', line2: 'Outer Ring Road', country: 'India', state: 'Karnataka', city: 'Bengaluru', pin: '560103' },
    phone: '9845012367',
    gstin: '29AAGCB3456Q1Z1',
    createdBy: 'Priya Sharma',
    createdAt: '2025-08-21T09:30:00',
  },
  {
    id: 'ent-5',
    name: 'Leadership Consulting India LLP',
    parent: 'ent-1',
    invoicePrefix: 'LCIL',
    status: 'active',
    pan: 'AAJFL7890R',
    cinType: 'LLPIN',
    cin: 'AAC-9134',
    lut: 'AD240325002219F',
    lutDeclaration: 'We declare that the export of services is under LUT without payment of IGST.',
    address: { line1: '12, Ashram Road', line2: 'Navrangpura', country: 'India', state: 'Gujarat', city: 'Ahmedabad', pin: '380009' },
    phone: '9824056712',
    gstin: '24AAJFL7890R1Z8',
    createdBy: 'Vikram Rao',
    createdAt: '2025-11-03T16:20:00',
  },
  {
    id: 'ent-6',
    name: 'DOOR Training and Consulting India Pvt Ltd',
    parent: 'ent-1',
    invoicePrefix: 'DOOR',
    status: 'inactive',
    pan: 'AAKCD2468S',
    cinType: 'CIN',
    cin: 'U80904TN2019PTC127734',
    lut: 'AD330325005512D',
    lutDeclaration: 'Services exported under LUT without payment of IGST (FY 2024–25).',
    address: { line1: 'Olympia Tech Park, 6th Floor', line2: 'Guindy', country: 'India', state: 'Tamil Nadu', city: 'Chennai', pin: '600032' },
    phone: '9840023456',
    gstin: '33AAKCD2468S1Z4',
    createdBy: 'Atul Kumar',
    createdAt: '2026-02-14T12:00:00',
  },
].map((e, i) => ({
  ...e,
  // Same logo marks the demo clients use (public/logos)
  logo: ['/logos/mark-hexagon.svg', '/logos/mark-leaf.svg', '/logos/mark-wave.svg', '/logos/mark-chevron.svg', '/logos/mark-spark.svg', '/logos/mark-ring.svg'][i],
  signature: signatureImage(e.createdBy),
  panDoc: doc(`PAN-${e.invoicePrefix}.pdf`, 148_000),
  cinDoc: doc(`${e.cinType}-Certificate-${e.invoicePrefix}.pdf`, 212_000),
  lutDoc: doc(`LUT-${e.invoicePrefix}-FY26.pdf`, 176_000),
  gstDoc: doc(`GST-Certificate-${e.invoicePrefix}.pdf`, 194_000),
}));

/* ---------------------------------------------------------------- SAP BP master (Settings → Finance → SAP BP) */
// Each trainer's SAP Business Partner code (alphanumeric) per entity (as in the old system — read-only here, codes come from SAP).
// '' = no code yet for that entity.
export const sapBpUnits = [
  { key: 'door', label: 'DOOR' },
  { key: 'blanchard', label: 'Blanchard' },
  { key: 'lcpl', label: 'LCPL' },
  { key: 'byldConsulting', label: 'BYLD Consulting' },
];
export const sapBpTrainers = [
  ['Test Tony', '', '', '', ''],
  ['Amitabh Kumar', 'DTC0418A', 'BRT2K592', '', 'BYC0117B'],
  ['Archana Gupta', 'DTC0427A', 'BRT2K604', 'LCP23A41', 'BYC0125B'],
  ['Aditya Sisodia', '', 'BRT2K611', '', ''],
  ['Nandita Warrier', 'DTC0433C', 'BRT2K618', 'LCP24B07', 'BYC0131B'],
  ['Preeti Das', 'DTC0441A', '', '', 'BYC0140D'],
  ['Rumi Bhattacharya', 'DTC0456B', 'BRT2K630', 'LCP25C19', 'BYC0152B'],
  ['Anupam Sharma', '', 'BRT3M637', '', ''],
  ['Mandeep Merwah', 'DTC0462A', 'BRT3M645', 'LCP26A66', 'BYC0163C'],
  ['Shreya Basu', 'DTC0470D', 'BRT3M652', 'LCP27D72', 'BYC0170B'],
  ['Maya Fernandes', 'DTC0485A', 'BRT3M660', '', 'BYC0184A'],
  ['Rohan Mehta', '', '', '', ''],
  ['Kavita Iyer', 'DTC0491B', 'BRT3M671', 'LCP28B80', 'BYC0192B'],
  ['Sameer Khanna', 'DTC0503A', '', 'LCP29A91', ''],
  ['Ritu Malhotra', 'DTC0510C', 'BRT4P689', 'LCP30C05', 'BYC0207A'],
].map(([name, door, blanchard, lcpl, byldConsulting], i) => ({ id: `tr-${i + 1}`, name, codes: { door, blanchard, lcpl, byldConsulting } }));

/* ---------------------------------------------------------------- Facilitators */
// The people who deliver programs (and channel partners who bring business). services/api.js builds each record from
// these: [name, type (facilitator | partner | both), status (kyc | payment | active | expired), city, state].
export const facilitatorSeeds = [
  ['Abhinay Tomar', 'facilitator', 'active', 'Chennai', 'Tamil Nadu'],
  ['Amitabh Kumar', 'facilitator', 'active', 'New Delhi', 'Delhi'],
  ['Archana Gupta', 'both', 'active', 'Gurugram', 'Haryana'],
  ['Aditya Sisodia', 'facilitator', 'kyc', 'Lucknow', 'Uttar Pradesh'],
  ['Nandita Warrier', 'facilitator', 'active', 'Bengaluru', 'Karnataka'],
  ['Preeti Das', 'facilitator', 'payment', 'Kolkata', 'West Bengal'],
  ['Rumi Bhattacharya', 'both', 'active', 'Kolkata', 'West Bengal'],
  ['Anupam Sharma', 'facilitator', 'kyc', 'Pune', 'Maharashtra'],
  ['Mandeep Merwah', 'facilitator', 'active', 'Mumbai', 'Maharashtra'],
  ['Shreya Basu', 'facilitator', 'expired', 'Kolkata', 'West Bengal'],
  ['Maya Fernandes', 'facilitator', 'active', 'Mumbai', 'Maharashtra'],
  ['Rohan Mehta', 'partner', 'kyc', 'Ahmedabad', 'Gujarat'],
  ['Kavita Iyer', 'facilitator', 'active', 'Chennai', 'Tamil Nadu'],
  ['Sameer Khanna', 'facilitator', 'payment', 'New Delhi', 'Delhi'],
  ['Ritu Malhotra', 'both', 'active', 'Gurugram', 'Haryana'],
  ['Vikram Rao', 'facilitator', 'active', 'Hyderabad', 'Telangana'],
  ['Sunita Menon', 'facilitator', 'expired', 'Bengaluru', 'Karnataka'],
  ['Harish Venkatesh', 'facilitator', 'active', 'Chennai', 'Tamil Nadu'],
  ['Pooja Arora', 'partner', 'payment', 'New Delhi', 'Delhi'],
  ['Deepak Chopra', 'facilitator', 'kyc', 'Mumbai', 'Maharashtra'],
  ['Lakshmi Narayanan', 'facilitator', 'active', 'Coimbatore', 'Tamil Nadu'],
  ['Farah Khan', 'facilitator', 'active', 'Hyderabad', 'Telangana'],
  ['Gaurav Bhatia', 'both', 'kyc', 'Gurugram', 'Haryana'],
  ['Ishita Sen', 'facilitator', 'active', 'Kolkata', 'West Bengal'],
  ['Jatin Malik', 'partner', 'active', 'New Delhi', 'Delhi'],
  ['Kiran Desai', 'facilitator', 'payment', 'Ahmedabad', 'Gujarat'],
  ['Manoj Pillai', 'facilitator', 'active', 'Mysuru', 'Karnataka'],
  ['Neha Saxena', 'facilitator', 'expired', 'Noida', 'Uttar Pradesh'],
  ['Om Prakash Joshi', 'facilitator', 'kyc', 'Kanpur', 'Uttar Pradesh'],
  ['Priyanka Reddy', 'facilitator', 'active', 'Hyderabad', 'Telangana'],
  ['Rajiv Thomas', 'both', 'active', 'Bengaluru', 'Karnataka'],
  ['Sanjana Kapoor', 'facilitator', 'kyc', 'Mumbai', 'Maharashtra'],
  ['Tarun Gill', 'facilitator', 'active', 'Faridabad', 'Haryana'],
  ['Uma Krishnan', 'facilitator', 'payment', 'Chennai', 'Tamil Nadu'],
  ['Varun Sethi', 'partner', 'expired', 'New Delhi', 'Delhi'],
  ['Yamini Bose', 'facilitator', 'active', 'Kolkata', 'West Bengal'],
  ['Zubin Mistry', 'facilitator', 'kyc', 'Pune', 'Maharashtra'],
  ['Anjali Nair', 'facilitator', 'active', 'Madurai', 'Tamil Nadu'],
  ['Bhavesh Patel', 'both', 'kyc', 'Surat', 'Gujarat'],
  ['Chitra Raman', 'facilitator', 'active', 'Bengaluru', 'Karnataka'],
];
// What a facilitator can be certified to deliver (shown as Programs / Certifications)
export const facilitatorCertifications = [
  'Situational Leadership® II', 'Crucial Conversations', 'Influencer', 'MBTI® Certified', 'DISC', 'Hogan Assessments', 'ICF ACC', 'ICF PCC',
  'Design Thinking', 'Self Leadership', 'Building High Performing Teams', 'Coaching Essentials', 'Emotional Intelligence (EQ-i 2.0)',
];

/* ---------------------------------------------------------------- Location masters (Settings → Locations: Country / State / City) */
// Synced from the CRM portal — read-only in LearnNext. Countries: [name, code, mobile code]. States: country → [state,
// GST state code ('' = not applicable outside India), cities].
export const geoCountries = [
  ['India', 'IN', '91'],
  ['Kuwait', 'KW', '965'],
  ['Jordan', 'JO', '962'],
  ['Australia', 'AU', '61'],
  ['Turkiye', 'TUR', '90'],
  ['Singapore', 'SG', '65'],
  ['Poland', 'PL', '48'],
  ['Italy', 'ITA', '39'],
  ['United Kingdom', 'UK', '44'],
  ['Saudi Arabia', 'SA', '966'],
  ['Belgium', 'BE', '32'],
  ['United Arab Emirates', 'AE', '971'],
  ['United States of America', 'US', '1'],
  ['Netherlands', 'NL', '31'],
].map(([name, code, dial], i) => ({ id: `cty-${i + 1}`, name, code, dial, syncedAt: '2026-10-22T06:30:00' }));
export const geoStates = {
  India: [
    ['Delhi', '07', ['New Delhi', 'Dwarka', 'Rohini']],
    ['Gujarat', '24', ['Ahmedabad', 'Surat', 'Vadodara', 'Dahej']],
    ['Haryana', '06', ['Gurugram', 'Faridabad']],
    ['Karnataka', '29', ['Bengaluru', 'Mysuru']],
    ['Maharashtra', '27', ['Mumbai', 'Pune', 'Nagpur']],
    ['Tamil Nadu', '33', ['Chennai', 'Coimbatore']],
    ['Telangana', '36', ['Hyderabad']],
    ['Uttar Pradesh', '09', ['Noida', 'Lucknow']],
    ['West Bengal', '19', ['Kolkata']],
    ['Jharkhand', '20', ['Jamshedpur', 'Ranchi']],
  ],
  Kuwait: [['Al Asimah Governorate', '', ['Kuwait City']]],
  Jordan: [['Amman Governorate', '', ['Amman']]],
  Australia: [
    ['New South Wales', '', ['Sydney']],
    ['Victoria', '', ['Melbourne']],
  ],
  Turkiye: [['Istanbul', '', ['Kadikoy']]],
  Singapore: [['Singapore', '', ['Singapore']]],
  Poland: [['Lesser Poland Voivodeship', '', ['Krakow']]],
  Italy: [['Verona', '', ['Verona']]],
  'United Kingdom': [
    ['England', '', ['London', 'Manchester']],
    ['Scotland', '', ['Edinburgh']],
  ],
  'Saudi Arabia': [['Riyadh Province', '', ['Riyadh']]],
  Belgium: [['Brussels-Capital Region', '', ['Brussels']]],
  'United Arab Emirates': [
    ['Dubai', '', ['Dubai', 'Mirdif']],
    ['Abu Dhabi', '', ['Abu Dhabi']],
  ],
  'United States of America': [
    ['Ohio', '', ['Akron']],
    ['California', '', ['San Francisco']],
  ],
  Netherlands: [['North Holland', '97', ['Amsterdam']]],
};

/* ---------------------------------------------------------------- People masters (Settings → People: Department / Designation / Role / Industry type) */
// Synced from the CRM portal — read-only in LearnNext. Status (approved / pending / rejected) is the CRM's approval state.
const CRM_SYNC = '2026-10-22T06:30:00';
// [department, parent department ('' = top level), status]
export const crmDepartments = [
  ['Operations', '', 'approved'],
  ['Human Resources', '', 'approved'],
  ['Water Management', 'Project Management', 'rejected'],
  ['Corporate Office Management', 'Corporate HR, Head Office', 'approved'],
  ['Project Management', '', 'approved'],
  ['Business Support', '', 'approved'],
  ['Corporate HR, Head Office', '', 'approved'],
  ['HR', '', 'approved'],
  ['Talent Development', '', 'approved'],
  ['Global Regulatory Affairs', '', 'approved'],
  ['Sales', '', 'approved'],
  ['Marketing', '', 'approved'],
  ['Finance', '', 'approved'],
  ['Learning & Development', 'Human Resources', 'approved'],
  ['Operations Support', 'Operations', 'pending'],
  ['Digital Transformation', 'Operations', 'pending'],
].map(([name, parent, status], i) => ({ id: `dep-${i + 1}`, name, parent, status, syncedAt: CRM_SYNC }));
// [department, designation, parent designation ('' = none), enabled, status]
export const crmDesignations = [
  ['HR', 'HR Management Trainee', 'HR Executive', true, 'pending'],
  ['Marketing', 'Executive', '', true, 'approved'],
  ['Sales', 'Vice President', 'Head L&D', true, 'rejected'],
  ['Water Management', 'Junior Engineer', 'Front Desk Coordinator', true, 'approved'],
  ['Corporate HR, Head Office', 'CFO', '', true, 'approved'],
  ['Business Support', 'Senior Project Manager', 'Operations Support', true, 'approved'],
  ['HR', 'Employee Experience Manager', '', true, 'approved'],
  ['Sales', 'TL-BD', '', true, 'approved'],
  ['Sales', 'Sr. KAM', '', true, 'approved'],
  ['Sales', 'Sr. BDE', '', true, 'approved'],
  ['HR', 'HR Executive', '', true, 'approved'],
  ['Learning & Development', 'Head L&D', '', true, 'approved'],
  ['Operations', 'Front Desk Coordinator', '', false, 'approved'],
  ['Sales', 'BDE', 'Sr. BDE', false, 'approved'],
  ['Finance', 'Finance Manager', 'CFO', true, 'pending'],
].map(([department, name, parent, enabled, status], i) => ({ id: `des-${i + 1}`, department, name, parent, enabled, status, syncedAt: CRM_SYNC }));
// [role, description, enabled]
export const crmRoles = [
  ['HR Manager', 'Manages people operations and approvals', true],
  ['SE Tester', 'Facilitates testing of program content', true],
  ['Program Manager', 'Runs programs end to end', true],
  ['Participant', 'Attends programs and completes the learning journey', true],
  ['Channel Partner', 'Brings in and manages partner-led programs', true],
  ['Manager', 'Oversees a team of participants', true],
  ['BD', 'Business development', true],
  ['Finance', 'Invoicing, payments and reconciliation', true],
  ['Audit', 'Read-only access for audits', true],
  ['Trainer', 'Delivers sessions and coaching', true],
  ['Guest Reviewer', 'Temporary access to review content', false],
].map(([name, description, enabled], i) => ({ id: `role-${i + 1}`, name, description, enabled, syncedAt: CRM_SYNC }));
// Industry types: the old list plus the ones clients already use
export const crmIndustries = [
  'NGOs', 'Marketing', 'Life Science', 'KPOs', 'Hospitality', 'Energy', 'BPOs', 'Alcobev', 'Telecom', 'Technology Services',
  'Automotive', 'Banking', 'Consulting', 'Education & Training', 'Engineering', 'Financial Services', 'FMCG', 'Healthcare', 'IT Services', 'Manufacturing', 'Pharma', 'Retail',
].map((name, i) => ({ id: `ind-${i + 1}`, name, syncedAt: CRM_SYNC }));

/* ---------------------------------------------------------------- Sub-entity master (Settings → Finance → Sub-entity) */
// Units under each entity (`entity` = an entity's id). Logo is optional — the ones without show the monogram tile.
export const subEntities = [
  ['YBS', 'ent-6', '/logos/mark-bars.svg', 'Atul Kumar', '2026-02-20T11:10:00'],
  ['LOVFINSTORE Technologies', 'ent-6', '', 'Neha Verma', '2026-03-04T15:25:00'],
  ['LOVEINSTORE Services', 'ent-6', '', 'Neha Verma', '2026-03-04T15:40:00'],
  ['LCPL', 'ent-5', '/logos/mark-circles.svg', 'Vikram Rao', '2025-11-12T10:00:00'],
  ['Internal & Others', 'ent-1', '', 'Atul Kumar', '2025-04-10T09:30:00'],
  ['GC', 'ent-4', '', 'Priya Sharma', '2025-09-02T13:45:00'],
  ['BYLD Group', 'ent-1', '/logos/mark-hexagon.svg', 'Atul Kumar', '2025-04-05T12:20:00'],
  ['BYLD Consulting', 'ent-4', '/logos/mark-chevron.svg', 'Priya Sharma', '2025-08-25T17:05:00'],
  ['Blanchard', 'ent-2', '/logos/mark-leaf.svg', 'Neha Verma', '2025-05-20T10:50:00'],
  ['Crucial Learning', 'ent-3', '/logos/mark-wave.svg', 'Rohan Kapoor', '2025-06-12T14:15:00'],
  ['BYLD Learning', 'ent-1', '', 'Rohan Kapoor', '2025-07-01T11:00:00'],
  ['DOOR Academy', 'ent-6', '', 'Atul Kumar', '2026-02-16T16:30:00'],
].map(([name, entity, logo, createdBy, createdAt], i) => ({ id: `sub-${i + 1}`, name, entity, logo, status: i === 2 ? 'inactive' : 'active', createdBy, createdAt }));

/* ---------------------------------------------------------------- Expense head master (Settings → Finance → Expense head) */
// The kinds of expense (the "Expense head" list in the form) and each one's GL code per sub-entity (`entity` / `sub`
// = ids). A head + sub-entity pair is unique.
export const expenseHeadTypes = ['Revenue Invoice', 'Flight & Hotel Booking', 'Food Expenses', 'Courier Services'];
const GL_BASE = { 'Revenue Invoice': 41130000, 'Flight & Hotel Booking': 51210000, 'Food Expenses': 51340000, 'Courier Services': 51420000 };
const EXPENSE_COMMENTS = { 'Flight & Hotel Booking': 'Trainer travel and stay for in-person programs', 'Courier Services': 'Kits and certificates to participants' };
export const expenseHeads = [
  ...subEntities.map((s) => ['Revenue Invoice', s]),
  ...subEntities.filter((_, i) => i % 2 === 0).map((s) => ['Flight & Hotel Booking', s]),
  ...subEntities.filter((_, i) => i % 3 === 0).map((s) => ['Food Expenses', s]),
  ...subEntities.filter((_, i) => i % 4 === 1).map((s) => ['Courier Services', s]),
].map(([head, s], i) => ({
  id: `exp-${i + 1}`,
  head,
  entity: s.entity,
  sub: s.id,
  glCode: String(GL_BASE[head] + 8 + Number(s.id.split('-')[1])),
  comment: EXPENSE_COMMENTS[head] ?? '',
  status: i === 5 || i === 17 ? 'inactive' : 'active',
  createdBy: s.createdBy,
  createdAt: new Date(new Date(s.createdAt).getTime() + (i % 5) * 864e5 * 3).toISOString(),
}));

/* ---------------------------------------------------------------- Manage Content (programs) */
// Program categories (the "Program category" select)
export const programCategories = ['Leadership', 'Communication', 'Coaching', 'Sales', 'Customer service', 'Personal effectiveness'];
// [name, category, entity id, sub-entity id, fee per person (₹), created (days ago), created by,
//  changes since: [days ago, kind, from, to, by]] — kinds: name | category | logo | mapping | fee | overview
const PROGRAMS = [
  ['Situational Leadership® II', 'Leadership', 'ent-2', 'sub-9', 18500, 210, 'Neha Verma', [[120, 'fee', 15000, 16000, 'Atul Kumar'], [40, 'overview', 'SLII-overview-v1.pdf', 'SLII-executive-overview.pdf', 'Atul Kumar'], [2, 'fee', 16000, 18500, 'Neha Verma']]],
  ['Crucial Conversations® for Mastering Dialogue', 'Communication', 'ent-3', 'sub-10', 22000, 12, 'Rohan Kapoor', [[5, 'logo', null, null, 'Atul Kumar']]],
  ['Coaching Essentials for Managers', 'Coaching', 'ent-1', 'sub-11', 9000, 150, 'Priya Sharma', [[90, 'name', 'Coaching Basics for Managers', 'Coaching Essentials for Managers', 'Priya Sharma'], [20, 'category', 'Leadership', 'Coaching', 'Priya Sharma']]],
  ['First-Time Manager Program', 'Leadership', 'ent-1', 'sub-7', 14500, 320, 'Atul Kumar', [[200, 'logo', null, null, 'Atul Kumar'], [60, 'fee', 12500, 14500, 'Vikram Rao']]],
  ['Women in Leadership Journey', 'Leadership', 'ent-4', 'sub-8', 16000, 95, 'Priya Sharma', [[30, 'name', 'Women Leaders Journey', 'Women in Leadership Journey', 'Neha Verma']]],
  ['Building Trust', 'Personal effectiveness', 'ent-2', 'sub-9', 12000, 260, 'Neha Verma', [[75, 'mapping', 'BYLD Learning · BYLD Group Learning Pvt Ltd', 'Blanchard · Blanchard Research and Training India LLP', 'Atul Kumar']]],
  ['Leading Through Change', 'Leadership', 'ent-5', 'sub-4', 11000, 48, 'Vikram Rao', [[18, 'overview', 'LTC-overview-draft.pdf', 'LTC-executive-overview.pdf', 'Vikram Rao']]],
  ['Customer Service Excellence', 'Customer service', 'ent-6', 'sub-12', 8500, 120, 'Atul Kumar', [[9, 'fee', 9500, 8500, 'Rohan Kapoor']]],
  ['High-Impact Presentations', 'Communication', 'ent-6', 'sub-1', 7500, 6, 'Neha Verma', []],
  ['Authentic Executive Presence – Speaker Series', 'Coaching', 'ent-4', 'sub-6', 35000, 180, 'Vikram Rao', [[14, 'fee', 30000, 35000, 'Vikram Rao']]],
  ['Sales Leadership Accelerator', 'Sales', 'ent-5', 'sub-4', 19500, 400, 'Rohan Kapoor', [[150, 'category', 'Leadership', 'Sales', 'Atul Kumar'], [3, 'overview', 'SLA-overview.pdf', 'SLA-executive-overview-2026.pdf', 'Rohan Kapoor']]],
];
const slug = (s) => s.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Demo program logos, like real program artwork: an emblem (a symbol from the Lucide set the app uses, 24-unit grid)
// with the program's name as a wordmark underneath, on white. Each program has its own symbol, colours and layout
// (stack = emblem over the name, badge = emblem in a ring, mark = emblem in a filled hexagon).
const LOGO_GLYPHS = {
  compass: `<circle cx='12' cy='12' r='10'/><path d='m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z'/>`,
  messages: `<path d='M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'/><path d='M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1'/>`,
  sprout: `<path d='M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3'/><path d='M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4'/><path d='M5 21h14'/>`,
  flag: `<path d='M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528'/>`,
  mountain: `<path d='m8 3 4 8 5-5 5 15H2L8 3z'/>`,
  shield: `<path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'/><path d='m9 12 2 2 4-4'/>`,
  refresh: `<path d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8'/><path d='M21 3v5h-5'/><path d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16'/><path d='M8 16H3v5'/>`,
  headset: `<path d='M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z'/><path d='M21 16v2a4 4 0 0 1-4 4h-5'/>`,
  presentation: `<path d='M2 3h20'/><path d='M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3'/><path d='m7 21 5-5 5 5'/>`,
  mic: `<path d='M12 19v3'/><path d='M19 10v2a7 7 0 0 1-14 0v-2'/><rect x='9' y='2' width='6' height='13' rx='3'/>`,
  trending: `<path d='M16 7h6v6'/><path d='m22 7-8.5 8.5-5-5L2 17'/>`,
};
// name → [layout, symbol, main colour, accent colour, wordmark line 1, line 2]
const PROGRAM_LOGOS = {
  'Situational Leadership® II': ['stack', 'compass', '#1f3a68', '#4a90d9', 'SITUATIONAL', 'LEADERSHIP® II'],
  'Crucial Conversations® for Mastering Dialogue': ['badge', 'messages', '#0f5e6e', '#f08a3c', 'CRUCIAL', 'CONVERSATIONS®'],
  'Coaching Essentials for Managers': ['stack', 'sprout', '#2f6b3a', '#7cc04b', 'COACHING', 'ESSENTIALS'],
  'First-Time Manager Program': ['mark', 'flag', '#c2413b', '#1f2f4d', 'FIRST-TIME', 'MANAGER'],
  'Women in Leadership Journey': ['badge', 'mountain', '#6b2d63', '#d77fb7', 'WOMEN IN', 'LEADERSHIP'],
  'Building Trust': ['stack', 'shield', '#1c2b4a', '#d4a43a', 'BUILDING', 'TRUST'],
  'Leading Through Change': ['mark', 'refresh', '#e0782f', '#23476e', 'LEADING', 'THROUGH CHANGE'],
  'Customer Service Excellence': ['badge', 'headset', '#127c74', '#45b8ac', 'CUSTOMER', 'SERVICE EXCELLENCE'],
  'High-Impact Presentations': ['stack', 'presentation', '#2a2440', '#d6407c', 'HIGH-IMPACT', 'PRESENTATIONS'],
  'Authentic Executive Presence – Speaker Series': ['badge', 'mic', '#1d1d1f', '#c9a227', 'EXECUTIVE', 'PRESENCE'],
  'Sales Leadership Accelerator': ['mark', 'trending', '#1b8a4c', '#1d3557', 'SALES', 'ACCELERATOR'],
};
const glyph = (name, x, y, scale, color, width = 2) =>
  `<g transform='translate(${x} ${y}) scale(${scale})' fill='none' stroke='${color}' stroke-width='${width}' stroke-linecap='round' stroke-linejoin='round'>${LOGO_GLYPHS[name]}</g>`;
// A wordmark line that never runs past the canvas: long words are squeezed to fit
const word = (text, y, size, color, { weight = 800, spacing = 0, max = 104 } = {}) => {
  const width = text.length * size * (weight >= 700 ? 0.68 : 0.62) + spacing * text.length;
  const fit = width > max ? ` textLength='${max}' lengthAdjust='spacingAndGlyphs'` : '';
  return `<text x='60' y='${y}' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-weight='${weight}' font-size='${size}' letter-spacing='${spacing}' fill='${color}'${fit}>${text.replace('&', '&amp;')}</text>`;
};
const programArt = (name) => {
  const [layout, symbol, main, accent, line1, line2] = PROGRAM_LOGOS[name] ?? ['stack', 'compass', '#334155', '#64748b', name.toUpperCase(), ''];
  let body;
  if (layout === 'badge') {
    body =
      `<circle cx='60' cy='46' r='30' fill='none' stroke='${accent}' stroke-width='3'/><circle cx='22' cy='46' r='3.5' fill='${accent}'/><circle cx='98' cy='46' r='3.5' fill='${accent}'/>` +
      glyph(symbol, 44, 30, 1.35, main) +
      word(line1, 96, 13, main) +
      word(line2, 109, 7.5, accent, { weight: 700, spacing: 1.5 });
  } else if (layout === 'mark') {
    body =
      `<polygon points='60,12 87,27 87,57 60,72 33,57 33,27' fill='${main}'/>` +
      glyph(symbol, 46, 28, 1.2, '#fff', 2.2) +
      word(line1, 94, 15, accent) +
      word(line2, 107, 7.5, main, { weight: 700, spacing: 1.8 });
  } else {
    body =
      glyph(symbol, 39, 12, 1.75, accent, 2) +
      `<rect x='44' y='60' width='32' height='3' rx='1.5' fill='${main}' opacity='0.25'/>` +
      word(line1, 86, 14, main) +
      word(line2, 101, 8, accent, { weight: 700, spacing: 1.6 });
  }
  return svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><rect width='120' height='120' fill='#ffffff'/>${body}</svg>`);
};
export const programs = PROGRAMS.map(([name, category, entity, sub, fee, created, createdBy, changes], i) => {
  const logo = programArt(name);
  const id = `prg-${i + 1}`;
  const history = [
    { id: `${id}-h0`, kind: 'created', by: createdBy, at: daysAgo(created, 10, 15) },
    ...changes.map(([ago, kind, from, to, by], k) => ({ id: `${id}-e${k + 1}`, kind, from, to, by, at: daysAgo(ago, 16, 20) })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at));
  return {
    id,
    name,
    category,
    entity,
    sub,
    logo,
    fee,
    overview: doc(`${slug(name)}-executive-overview.pdf`, 380_000 + i * 41_000),
    history,
    createdBy,
    createdAt: daysAgo(created, 10, 15),
  };
});

/* ---------------------------------------------------------------- Program content (Program page → Upload Content) */
// Each program's content in three buckets — pre / during / post — as elements (name, description) holding files:
// documents, videos or links. Demo documents have no url (no preview); demo videos play short public-domain (CC0)
// sample clips from MDN's examples so the video preview can be tried; links point to example addresses.
// [name, description, created (days ago), by, files: [kind, name, size | url]]
const SAMPLE_VIDEOS = ['https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4'];
let sampleVideo = 0;
const file = ([kind, name, x], i) =>
  kind === 'url'
    ? { id: `f${i}`, kind, name, url: x }
    : kind === 'video'
      ? { id: `f${i}`, kind, name, size: x, type: 'video/mp4', url: SAMPLE_VIDEOS[sampleVideo++ % SAMPLE_VIDEOS.length] }
      : { id: `f${i}`, kind, name, size: x, type: /\.pdf$/i.test(name) ? 'application/pdf' : 'application/octet-stream' };
const element = (programId, stage) => ([name, description, ago, by, files], i) => ({
  id: `${programId}-${stage}-${i + 1}`,
  name,
  description,
  files: files.map((f, k) => ({ ...file(f, k), id: `${programId}-${stage}-${i + 1}-f${k + 1}` })),
  createdBy: by,
  createdAt: daysAgo(ago, 11, 30),
});
const CONTENT = {
  'prg-1': {
    pre: [
      ['Welcome kit', 'What participants read and set up before day one.', 34, 'Neha Verma', [['document', 'SLII welcome letter.pdf', 240_000], ['document', 'Pre-read – the four leadership styles.pdf', 1_850_000], ['url', 'Self-assessment', 'https://example.com/slii/self-assessment']]],
      ['Pre-program survey', 'Five questions on the leadership challenges each participant faces today.', 30, 'Atul Kumar', [['url', 'Survey form', 'https://forms.example.com/slii-pre']]],
    ],
    during: [
      ['Day 1 – Diagnose & match', 'Facilitator deck with the two session videos.', 21, 'Neha Verma', [['document', 'SLII day 1 slides.pptx', 6_200_000], ['video', 'Diagnosing development level.mp4', 48_000_000], ['video', 'Matching styles – role play.mp4', 62_000_000]]],
      ['Role-play scenarios', 'Practice cases for pairs, with observer notes.', 20, 'Atul Kumar', [['document', 'Role-play cards.pdf', 900_000]]],
    ],
    post: [
      ['30-day action plan', 'A template to apply the model back at work, reviewed with the manager.', 12, 'Neha Verma', [['document', 'Action plan template.docx', 120_000]]],
    ],
    boosters: [
      ['Week 6 refresher', 'A 45-minute call to revisit the four styles with real cases.', 8, 'Neha Verma', [['video', 'Refresher recording.mp4', 38_000_000], ['url', 'Booster call link', 'https://example.com/slii/booster']]],
    ],
  },
  'prg-4': {
    pre: [['Manager readiness check', 'A short self-assessment before the first module.', 40, 'Atul Kumar', [['url', 'Readiness check', 'https://forms.example.com/ftm-readiness']]]],
    self: [
      ['Time and priorities', 'Planning the week as a manager, not a doer.', 33, 'Vikram Rao', [['document', 'Weekly planner.pdf', 310_000], ['video', 'From doer to manager.mp4', 52_000_000]]],
      ['Personal style profile', 'Each participant’s profile with a debrief guide.', 31, 'Vikram Rao', [['document', 'Style profile guide.pdf', 780_000]]],
    ],
    others: [['Feedback that lands', 'The feedback model with practice scripts.', 24, 'Atul Kumar', [['document', 'Feedback model.pdf', 640_000], ['document', 'Practice scripts.docx', 95_000]]]],
    team: [['Running a team meeting', 'Agenda template and a short demo video.', 15, 'Vikram Rao', [['document', 'Team meeting agenda.docx', 60_000], ['video', 'A good team huddle.mp4', 41_000_000]]]],
    post: [['90-day manager plan', 'Goals agreed with the participant’s own manager.', 6, 'Atul Kumar', [['document', '90-day plan template.docx', 110_000]]]],
  },
  'prg-5': {
    pre: [['Journey welcome', 'What the six months look like and how the circles work.', 60, 'Priya Sharma', [['document', 'Journey guide.pdf', 1_100_000]]]],
    during: [['Leadership presence workshop', 'Workshop deck and the story-telling exercise.', 45, 'Neha Verma', [['document', 'Presence workshop.pptx', 5_400_000]]]],
    circles: [
      ['Circle 1 – Owning your voice', 'Discussion prompts for the first peer circle.', 38, 'Priya Sharma', [['document', 'Circle 1 prompts.pdf', 220_000]]],
      ['Circle 2 – Negotiating for yourself', 'Prompts and a short case for the second circle.', 24, 'Priya Sharma', [['document', 'Circle 2 prompts.pdf', 240_000], ['url', 'Case reading', 'https://example.com/wil/negotiation-case']]],
    ],
    mentoring: [['Mentoring guide', 'How mentor and mentee plan their four conversations.', 30, 'Neha Verma', [['document', 'Mentoring guide.pdf', 680_000], ['url', 'Book a mentor slot', 'https://example.com/wil/mentors']]]],
    post: [],
  },
  'prg-11': {
    pre: [['Sales context pack', 'Market notes and the team’s current pipeline numbers.', 9, 'Rohan Kapoor', [['document', 'Pipeline snapshot.xlsx', 410_000], ['url', 'CRM dashboard', 'https://example.com/crm/pipeline']]]],
    during: [['Coaching the sale', 'Module videos and the coaching framework.', 5, 'Rohan Kapoor', [['video', 'Coaching conversations.mp4', 75_000_000], ['document', 'Coaching framework.pdf', 1_200_000]]]],
    post: [],
  },
};
/**
 * A program's own modules (its content lanes), in order — [key, name?, hint?]. Most programs use the standard
 * Pre / During / Post; these few have more. pre / during / post need no name (the board knows them). Which modules a
 * program has will be managed from the Projects page later.
 */
export const programModules = {
  'prg-1': [['pre'], ['during'], ['post'], ['boosters', 'Booster sessions', 'Short refreshers in the weeks after']],
  'prg-4': [
    ['pre'],
    ['self', 'Leading yourself', 'Module 1 — habits, time and style'],
    ['others', 'Leading others', 'Module 2 — feedback and delegation'],
    ['team', 'Leading the team', 'Module 3 — goals and team rhythm'],
    ['post'],
  ],
  'prg-5': [['pre'], ['during'], ['circles', 'Peer circles', 'Small groups that meet between sessions'], ['mentoring', 'Mentoring', 'One-to-one time with a senior leader'], ['post']],
};

export const programContent = Object.fromEntries(
  Object.entries(CONTENT).map(([id, stages]) => [id, Object.fromEntries(Object.entries(stages).map(([stage, list]) => [stage, list.map(element(id, stage))]))]),
);
/* ---------------------------------------------------------------- Client participants (Participants tab) */
// Name parts for the mock participant list (departments and designations come from clientLookups)
export const participantCatalog = {
  firstNames: [
    'Tavisha',
    'Tanuj',
    'Rahul',
    'Aiva',
    'Abhishek',
    'Dheeraj',
    'Aman',
    'Ritika',
    'Sanjana',
    'Kunal',
    'Megha',
    'Yash',
    'Pallavi',
    'Gaurav',
    'Shruti',
    'Mohit',
    'Nidhi',
    'Ankit',
    'Simran',
    'Vivek',
    'Anjali',
    'Saurabh',
    'Kritika',
    'Rajat',
  ],
  lastNames: ['Rao', 'Tiwari', 'Banwal', 'Sharma', 'Gupta', 'Mehra', 'Bhatia', 'Saxena', 'Arora', 'Kohli', 'Pandey', 'Mishra', 'Chauhan', 'Agarwal', 'Bansal', 'Sethi'],
  mailDomains: ['gmail.com', 'outlook.com', 'yahoo.co.in'],
};

/* ---------------------------------------------------------------- Add client form lookups */
export const clientLookups = {
  // Company directory for the searchable Company name field (existing clients are added by the API)
  companyDirectory: [
    'Adani Enterprises Ltd',
    'Apollo Hospitals Enterprise Ltd',
    'Bajaj Auto Ltd',
    'Bharat Petroleum Corporation Ltd',
    'Britannia Industries Ltd',
    'Coal India Ltd',
    'Eicher Motors Ltd',
    'Grasim Industries Ltd',
    'HCL Technologies Ltd',
    'Hindustan Unilever Ltd',
    'IndusInd Bank Ltd',
    'JSW Steel Ltd',
    'Kotak Mahindra Bank Ltd',
    'LTIMindtree Ltd',
    'NTPC Ltd',
    'Oil and Natural Gas Corporation',
    'Power Grid Corporation of India',
    'Reliance Industries Ltd',
    'SBI Life Insurance',
    'Shree Cement Ltd',
    'State Bank of India',
    'Tata Consultancy Services',
    'Tata Motors Ltd',
    'Tata Power Company Ltd',
    'Zomato Ltd',
  ],
  // Dummy CRM portal profiles for the directory: [industry, company type, state, city]. The rest is generated by the mock API.
  crmProfiles: {
    'Adani Enterprises Ltd': ['Engineering', 'Public Limited', 'Gujarat', 'Ahmedabad'],
    'Apollo Hospitals Enterprise Ltd': ['Healthcare', 'Public Limited', 'Tamil Nadu', 'Chennai'],
    'Bajaj Auto Ltd': ['Automotive', 'Public Limited', 'Maharashtra', 'Pune'],
    'Bharat Petroleum Corporation Ltd': ['Manufacturing', 'Government / PSU', 'Maharashtra', 'Mumbai'],
    'Britannia Industries Ltd': ['FMCG', 'Public Limited', 'West Bengal', 'Kolkata'],
    'Coal India Ltd': ['Manufacturing', 'Government / PSU', 'West Bengal', 'Kolkata'],
    'Eicher Motors Ltd': ['Automotive', 'Public Limited', 'Haryana', 'Gurugram'],
    'Grasim Industries Ltd': ['Manufacturing', 'Public Limited', 'Maharashtra', 'Mumbai'],
    'HCL Technologies Ltd': ['IT Services', 'Public Limited', 'Uttar Pradesh', 'Noida'],
    'Hindustan Unilever Ltd': ['FMCG', 'Multinational (MNC)', 'Maharashtra', 'Mumbai'],
    'IndusInd Bank Ltd': ['Banking', 'Public Limited', 'Maharashtra', 'Mumbai'],
    'JSW Steel Ltd': ['Manufacturing', 'Public Limited', 'Karnataka', 'Bengaluru'],
    'Kotak Mahindra Bank Ltd': ['Banking', 'Public Limited', 'Maharashtra', 'Mumbai'],
    'LTIMindtree Ltd': ['IT Services', 'Public Limited', 'Karnataka', 'Bengaluru'],
    'NTPC Ltd': ['Engineering', 'Government / PSU', 'Delhi', 'New Delhi'],
    'Oil and Natural Gas Corporation': ['Engineering', 'Government / PSU', 'Delhi', 'New Delhi'],
    'Power Grid Corporation of India': ['Engineering', 'Government / PSU', 'Haryana', 'Gurugram'],
    'Reliance Industries Ltd': ['Manufacturing', 'Public Limited', 'Maharashtra', 'Mumbai'],
    'SBI Life Insurance': ['Financial Services', 'Public Limited', 'Maharashtra', 'Mumbai'],
    'Shree Cement Ltd': ['Manufacturing', 'Public Limited', 'West Bengal', 'Kolkata'],
    'State Bank of India': ['Banking', 'Government / PSU', 'Maharashtra', 'Mumbai'],
    'Tata Consultancy Services': ['IT Services', 'Public Limited', 'Maharashtra', 'Mumbai'],
    'Tata Motors Ltd': ['Automotive', 'Public Limited', 'Maharashtra', 'Pune'],
    'Tata Power Company Ltd': ['Engineering', 'Public Limited', 'Maharashtra', 'Mumbai'],
    'Zomato Ltd': ['Retail', 'Public Limited', 'Haryana', 'Gurugram'],
  },
  companyTypes: ['Private Limited', 'Public Limited', 'Limited Liability Partnership (LLP)', 'Partnership Firm', 'Sole Proprietorship', 'Government / PSU', 'Non-profit / NGO', 'Multinational (MNC)'],
  industries: [
    'Automotive',
    'Banking',
    'Consulting',
    'Education & Training',
    'Engineering',
    'Financial Services',
    'FMCG',
    'Healthcare',
    'IT Services',
    'Manufacturing',
    'Pharma',
    'Retail',
    'Telecom',
    'Other',
  ],
  participantDepartments: [
    'Administration',
    'Customer Service',
    'Engineering',
    'Finance',
    'Human Resources',
    'Information Technology',
    'Legal',
    'Marketing',
    'Operations',
    'Procurement',
    'Sales',
    'Other',
  ],
  designations: [
    'Intern',
    'Executive',
    'Senior Executive',
    'Assistant Manager',
    'Manager',
    'Senior Manager',
    'Associate General Manager',
    'General Manager',
    'Director',
    'Vice President',
    'CXO',
    'Consultant',
  ],
  // country -> state -> cities
  geo: {
    India: {
      Delhi: ['New Delhi', 'Dwarka', 'Rohini'],
      Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Gandhinagar'],
      Haryana: ['Gurugram', 'Faridabad', 'Panipat'],
      Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi'],
      Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
      Telangana: ['Hyderabad', 'Warangal'],
      'Uttar Pradesh': ['Noida', 'Ghaziabad', 'Lucknow', 'Kanpur'],
      'West Bengal': ['Kolkata', 'Howrah', 'Durgapur'],
      Jharkhand: ['Jamshedpur', 'Ranchi'],
    },
    'United Arab Emirates': { Dubai: ['Dubai'], 'Abu Dhabi': ['Abu Dhabi', 'Al Ain'], Sharjah: ['Sharjah'] },
    Singapore: { Singapore: ['Singapore'] },
    'United Kingdom': { England: ['London', 'Manchester', 'Birmingham'], Scotland: ['Edinburgh', 'Glasgow'] },
    'United States': { California: ['San Francisco', 'Los Angeles', 'San Jose'], 'New York': ['New York City', 'Buffalo'], Texas: ['Austin', 'Dallas', 'Houston'] },
  },
};
