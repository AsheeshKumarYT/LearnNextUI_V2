/**
 * Every master in Settings, grouped. Single source for the Settings hub, its search and the master pages.
 * To add a master: add an item here (slug must be unique) — it shows up in the hub, search and routing.
 * `tone` (per group): primary | info | success | warning | violet | danger — matches Card / CardHeader tones.
 */
import {
  AlarmClock,
  Banknote,
  Blocks,
  BriefcaseBusiness,
  Building,
  Building2,
  CreditCard,
  Factory,
  FolderTree,
  Globe,
  GraduationCap,
  Handshake,
  IdCard,
  IndianRupee,
  Landmark,
  ListTree,
  Map,
  MapPin,
  MessageSquareWarning,
  Network,
  ReceiptText,
  ShieldCheck,
  UserCog,
  UserRoundCog,
  UsersRound,
} from 'lucide-react';

// Group order: most-used first, related groups side by side (Finance → Banks), read-only CRM-synced groups after the
// editable ones, and the rarely changed / not-yet-built Alert messages last.
export const SETTINGS_GROUPS = [
  {
    // Who can sign in, what each role may do, and which pages exist (was "Others")
    id: 'users-access',
    title: 'Users & Access',
    description: 'Logins, roles and what they can open.',
    icon: UsersRound,
    tone: 'warning',
    items: [
      { slug: 'manage-users', label: 'Manage Users', description: 'Logins, passwords and who reports to whom', icon: UserRoundCog },
      { slug: 'roles-access', label: 'Roles & Access', description: 'What each role can see and do', icon: ShieldCheck },
      { slug: 'menu-mapping-access', label: 'Menu Mapping & Access', description: 'Pages in the Training Partner menu and their order', icon: ListTree },
    ],
  },
  {
    id: 'programs',
    title: 'Program & Content',
    description: 'How programs are grouped and phased.',
    icon: GraduationCap,
    tone: 'success',
    items: [
      { slug: 'program-category', label: 'Program Category', description: 'Categories programs are grouped in', icon: FolderTree },
      { slug: 'modules', label: 'Modules', description: 'Program phases — Pre, During, Post', icon: Blocks },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Billing entities, SAP partners and expense heads.',
    icon: IndianRupee,
    tone: 'primary',
    items: [
      { slug: 'entity', label: 'Entity', description: 'Legal entities that bill programs', icon: Building2 },
      { slug: 'sub-entity', label: 'Sub-entity', description: 'Units under each entity', icon: Network },
      { slug: 'sap-bp', label: 'SAP BP', description: 'SAP business partner codes', icon: Handshake },
      { slug: 'expense-head', label: 'Expense head', description: 'Cost categories for programs', icon: ReceiptText },
    ],
  },
  {
    id: 'banks',
    title: 'Banks',
    description: 'Bank accounts used for billing.',
    icon: Landmark,
    tone: 'info',
    items: [
      { slug: 'bank-master', label: 'Bank master', description: 'Banks and branches', icon: Banknote },
      { slug: 'house-bank-master', label: 'House bank master', description: 'Your own receiving accounts', icon: CreditCard },
    ],
  },
  {
    id: 'industry-job',
    title: 'Industry & job',
    description: 'How clients and participants are described.',
    icon: BriefcaseBusiness,
    tone: 'violet',
    items: [
      { slug: 'department', label: 'Department', description: 'Teams a participant belongs to', icon: Building },
      { slug: 'designation', label: 'Designation', description: 'Job titles and levels', icon: IdCard },
      { slug: 'role', label: 'Role', description: 'Roles people play in programs', icon: UserCog },
      { slug: 'industry-type', label: 'Industry type', description: 'Industries clients operate in', icon: Factory },
    ],
  },
  {
    id: 'location',
    title: 'Location',
    description: 'Countries, states and cities used in addresses.',
    icon: Globe,
    tone: 'info',
    items: [
      { slug: 'country', label: 'Country', description: 'Countries you work in', icon: Globe },
      { slug: 'state', label: 'State', description: 'States within each country', icon: Map },
      { slug: 'city', label: 'City', description: 'Cities within each state', icon: MapPin },
    ],
  },
  {
    id: 'alerts',
    title: 'Alert messages',
    description: 'Wording of automatic messages.',
    icon: MessageSquareWarning,
    tone: 'danger',
    items: [{ slug: 'alert-message-templates', label: 'Alert message templates', description: 'Emails and alerts sent automatically', icon: AlarmClock }],
  },
];

/** slug → { item, group } */
export const MASTERS = Object.fromEntries(SETTINGS_GROUPS.flatMap((g) => g.items.map((item) => [item.slug, { item, group: g }])));

export const MASTER_COUNT = Object.keys(MASTERS).length;

/** localStorage key for the masters a user opened most recently (newest first) — shown in Settings */
export const RECENT_KEY = 'ln.settings.recent';

/**
 * Extra words people search with that aren't in a master's name or description (slug → words). Keeps search
 * forgiving: "trainer" finds Facilitator, "quiz" finds assessments, "email" finds alert templates, and so on.
 */
export const SEARCH_KEYWORDS = {
  country: 'location nation place',
  state: 'location region province place',
  city: 'location town place',
  department: 'team function',
  designation: 'title job position level',
  role: 'job position',
  'industry-type': 'sector domain',
  'sap-bp': 'sap business partner bp vendor customer code finance',
  entity: 'company legal billing gst finance',
  'sub-entity': 'branch unit division',
  'expense-head': 'cost expense budget finance',
  'bank-master': 'bank ifsc branch account',
  'house-bank-master': 'bank account receiving gst',
  'alert-message-templates': 'email sms notification message reminder template',
  modules: 'module feature product platform',
  'menu-mapping-access': 'menu navigation sidebar mapping access module',
  'roles-access': 'role permission rights access admin user privilege',
  'manage-users': 'user users login account password reset username staff people member admin',
  'program-category': 'program category course type group',
};
