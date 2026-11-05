# Module Inventory

This inventory lists every module, page, tab and menu item found in the current build of LearnNext Portal (the Training Partner portal and the Super Admin portal), along with the PRD that covers it.

**Status** uses the labels from the [PRD template](prd-template.md): Implemented, Partially Implemented, Not Implemented, Proposed, Requires Confirmation.

---

## 1. Modules with PRDs

| # | Module | Prefix | PRD | Implementation status |
|---|---|---|---|---|
| 1 | Authentication | AUTH | [authentication-prd.md](modules/authentication-prd.md) | Partially Implemented |
| 2 | App Shell and Navigation | SHELL | [app-shell-navigation-prd.md](modules/app-shell-navigation-prd.md) | Partially Implemented |
| 3 | Dashboard | DASH | [dashboard-prd.md](modules/dashboard-prd.md) | Implemented |
| 4 | My Profile | PROF | [profile-prd.md](modules/profile-prd.md) | Partially Implemented |
| 5 | All Clients (list, Add / Edit client) | CLI | [clients-prd.md](modules/clients-prd.md) | Implemented |
| 6 | Client Details | CLD | [client-detail-prd.md](modules/client-detail-prd.md) | Partially Implemented |
| 7 | Manage Content | CNT | [manage-content-prd.md](modules/manage-content-prd.md) | Partially Implemented |
| 8 | Facilitators | FAC | [facilitators-prd.md](modules/facilitators-prd.md) | Partially Implemented |
| 9 | Support Desk | SUP | [support-desk-prd.md](modules/support-desk-prd.md) | Partially Implemented |
| 10 | Settings Hub | SET | [settings-hub-prd.md](modules/settings-hub-prd.md) | Partially Implemented |
| 11 | Settings: Finance masters | FIN | [settings-finance-masters-prd.md](modules/settings-finance-masters-prd.md) | Implemented |
| 12 | Settings: Location masters | LOC | [settings-location-masters-prd.md](modules/settings-location-masters-prd.md) | Partially Implemented |
| 13 | Settings: Industry and job masters | PPL | [settings-industry-job-masters-prd.md](modules/settings-industry-job-masters-prd.md) | Partially Implemented |
| 14 | Settings: Program and Content masters | PRG | [settings-program-content-masters-prd.md](modules/settings-program-content-masters-prd.md) | Partially Implemented |
| 15 | Settings: Menu and Role access masters | ACC | [settings-access-masters-prd.md](modules/settings-access-masters-prd.md) | Partially Implemented (permissions are stored but not enforced) |
| 16 | System Pages | SYS | [system-pages-prd.md](modules/system-pages-prd.md) | Partially Implemented |
| 17 | Super Admin (Manage Clients, Client details, Add / Edit client) | SA | [super-admin-prd.md](modules/super-admin-prd.md) | Partially Implemented (works on demo data; the CRM fetching, portal access, email update and inactive-status settings are stored only) |

The status column gives a summary only. The **Module implementation status** in each PRD's section 1 is authoritative.

---

## 2. Page inventory

| Module | Page / view | How it is reached | Type | Status |
|---|---|---|---|---|
| Authentication | Sign in | `/login`, or any protected page while signed out | Page | Implemented |
| Authentication | Forgot password | Link on Sign in | Page | Implemented |
| Authentication | Reset password | After the forgot-password step | Page | Implemented |
| Authentication | Reset success | After a successful reset | Page | Implemented |
| Authentication | Role picker ("Continue as") | After sign-in, for a login with several roles and no role remembered on the device; any portal page while no role is chosen | Page | Implemented |
| Authentication | Role coming soon ("The <role> space is on its way") | Choosing, or being signed in as, a role whose portal is not built (Facilitator, Participant, Client SPOC) | Page | Implemented (the portals themselves are Not Implemented) |
| Authentication | Switch role | User menu (logins with several roles) or the coming-soon screen → back to "Continue as" | Menu action | Implemented |
| Authentication | Log out confirmation | Header user menu | Dialog | Implemented |
| App Shell | Sidebar, header, breadcrumbs, user menu, theme toggle | Every Training Partner page | Layout | Implemented |
| App Shell | Super Admin shell (single menu item Manage Clients; no bell, Settings, Support card or Dev only section) | Every Super Admin page | Layout | Implemented |
| App Shell | Global search (⌘K / Ctrl+K) | Header | Command palette | Implemented (finds pages and records: clients, programs, facilitators, support tickets and Settings masters; for Super Admin, its pages and training partners) |
| App Shell | Notifications menu | Header bell | Popover | Implemented |
| App Shell | Help & Support drawer | Nothing opens it (OQ-SHELL-007) | Drawer | Not Implemented |
| App Shell | Support desk card | Sidebar footer | Card link | Implemented |
| App Shell | "Nothing here yet" placeholder | Menu items not yet built (see section 3) | Page | Implemented (placeholder) |
| Dashboard | Dashboard | `/dashboard`; the default page after sign-in | Page | Implemented |
| My Profile | My Profile | User menu → My Profile (`/profile`) | Page | Implemented |
| My Profile | Change cover, Change avatar, Change password | Buttons on My Profile | Modals | Implemented |
| All Clients | All Clients list (table / cards) | Sidebar → All Clients (`/clients`) | Page | Implemented |
| All Clients | Client filters | Filters button | Drawer | Implemented |
| All Clients | Add client (Company / Individual, multi-step) | Add client button (`/clients/new`) | Page | Implemented |
| All Clients | Edit client | Edit action (`/clients/:id/edit`) | Page | Implemented |
| Client Details | Client details: hero header | Click a client (`/clients/:id`) | Page | Implemented |
| Client Details | Overview tab | Client details | Tab | Implemented |
| Client Details | Projects tab (schedule / list) | Client details | Tab | Implemented |
| Client Details | Participants tab and learning-journey drawer | Client details | Tab, Drawer | Implemented |
| Client Details | SPOCs tab (access matrix / list), Add / Edit SPOC | Client details | Tab, Modal | Implemented |
| Client Details | Tax & Billing tab | Client details | Tab | Implemented |
| Client Details | Settings tab | Client details | Tab | Implemented |
| Client Details | Activity tab | Client details | Tab | Implemented |
| Manage Content | Program list (table / cards), program history | Sidebar → Manage Content (`/content`) | Page, Drawer | Implemented |
| Manage Content | Add / Edit program | Manage Content | Modal | Implemented |
| Manage Content | Program content: Upload content and Permissions tabs | `/content/:id` | Page | Implemented |
| Facilitators | Facilitators list by status; Send KYC | Sidebar → Facilitators (`/facilitators`) | Page, Modal | Implemented |
| Facilitators | Verify KYC | Approval pending row (`/facilitators/:id/verify`) | Page | Implemented |
| Facilitators | Payment setup (set up, view with revision history, revise; sent to the facilitator for approval) | Payment setup pending row | Modal | Implemented |
| Facilitators | Facilitator details (Overview, Personal & address, Tax & bank, Qualifications, Experience, Partner firm) | Active row (`/facilitators/:id`) | Page | Implemented |
| Facilitators | Portfolio (one-page website, Download PDF) | Facilitator details → View portfolio (`/facilitators/:id/portfolio`, new tab, no app shell) | Page | Implemented (feedback quotes are sample content) |
| Support Desk | Ticket list, ticket chat, ticket details | Sidebar support card (`/support`) | Page, Drawer, Modal | Implemented |
| Settings Hub | All masters (groups, filter, pins, recents) | Sidebar → Settings (`/settings`) | Page | Implemented |
| Settings masters | Each master | `/settings/<master>` | Page | See section 4 |
| System Pages | Not found (404) | Any unknown address | Full-screen page | Implemented |
| System Pages | Page crash | An unexpected error while showing a page | Full-screen page | Implemented |
| System Pages | Server error (500) | `/error` | Full-screen page | Implemented |
| System Pages | Service unavailable (503) | `/maintenance` | Full-screen page | Implemented |
| System Pages | Offline | Device goes offline | Full-screen page | Implemented |
| System Pages | Session expired | `/session-expired` | Full-screen page | Implemented |
| System Pages | System pages gallery (development only; Training Partner portal only) | Sidebar "Dev only" → System pages (`/ui-preview`); each card opens a live preview of the page in a new tab, with no preview marker | Page | Implemented |
| Super Admin | Manage Clients list of training partners (table / cards, status pills, search) | Choose Super Admin in "Continue as" (`/clients`); the Super Admin's only menu item and home | Page | Implemented |
| Super Admin | Client details: hero header | Click a training partner (`/clients/:id`) | Page | Implemented |
| Super Admin | Overview tab | Client details | Tab | Implemented |
| Super Admin | Sub clients tab (view only) | Client details (`?tab=sub-clients`) | Tab | Implemented |
| Super Admin | Tax & Billing tab (view only) | Client details (`?tab=billing`) | Tab | Implemented |
| Super Admin | Settings & Configuration tab (status, CRM fetching, portal access, email updates) | Client details (`?tab=settings`) | Tab | Partially Implemented (settings are stored but have no effect) |
| Super Admin | Activity History tab | Client details (`?tab=activity`) | Tab | Implemented |
| Super Admin | Add client (3-step wizard: Details → Addresses → Billing; no CRM look-up) | Add client button (`/clients/new`) | Page | Implemented |
| Super Admin | Edit client (same 3 steps, any step can be opened) | Edit action or Client details → Edit (`/clients/:id/edit`) | Page | Implemented |
| Super Admin | Client not found | An unknown details or edit address under `/clients` | Page card | Implemented |
| Super Admin | My Profile | User menu → My Profile (`/profile`) | Page | Implemented (as PRD-PROF) |

The Super Admin portal uses the same addresses as the Training Partner's client pages (`/clients…`); which pages appear depends on the role chosen in "Continue as". For a Super Admin, any address outside `/clients…` and `/profile` opens Manage Clients (BR-SA-002).

---

## 3. Menu items not yet built

These items appear in the Training Partner sidebar but open the "Nothing here yet" placeholder. They are listed for completeness. No PRD is written for them, because no functional behaviour exists to document. Their requirements are recorded as open questions (`OQ-GEN-001` in [open-questions.md](open-questions.md)).

| Menu item | Location | Status |
|---|---|---|
| Projects | Sidebar | Not Implemented |
| Finance → All Invoices | Sidebar submenu | Not Implemented |
| Finance → Credit Note | Sidebar submenu | Not Implemented |
| Finance → Debit Note | Sidebar submenu | Not Implemented |
| Finance → E-Invoice | Sidebar submenu | Not Implemented |
| Finance → Trainer Invoice | Sidebar submenu | Not Implemented |
| Finance → Invoice Approvals | Sidebar submenu | Not Implemented |
| Assessments | Sidebar | Not Implemented |
| Polls & Surveys | Sidebar | Not Implemented |
| Reports | Sidebar | Not Implemented |

---

## 4. Settings masters

The Settings page lists 18 masters in 7 groups.

| Group | Master | Status | PRD |
|---|---|---|---|
| Finance | Entity | Implemented | [settings-finance-masters-prd.md](modules/settings-finance-masters-prd.md) |
| Finance | Sub-entity | Implemented | [settings-finance-masters-prd.md](modules/settings-finance-masters-prd.md) |
| Finance | SAP BP | Implemented | [settings-finance-masters-prd.md](modules/settings-finance-masters-prd.md) |
| Finance | Expense head | Implemented | [settings-finance-masters-prd.md](modules/settings-finance-masters-prd.md) |
| Location | Country | Implemented (read-only, CRM-synced) | [settings-location-masters-prd.md](modules/settings-location-masters-prd.md) |
| Location | State | Implemented (read-only, CRM-synced) | [settings-location-masters-prd.md](modules/settings-location-masters-prd.md) |
| Location | City | Implemented (read-only, CRM-synced) | [settings-location-masters-prd.md](modules/settings-location-masters-prd.md) |
| Industry & job | Department | Implemented | [settings-industry-job-masters-prd.md](modules/settings-industry-job-masters-prd.md) |
| Industry & job | Designation | Implemented | [settings-industry-job-masters-prd.md](modules/settings-industry-job-masters-prd.md) |
| Industry & job | Role | Implemented | [settings-industry-job-masters-prd.md](modules/settings-industry-job-masters-prd.md) |
| Industry & job | Industry type | Implemented | [settings-industry-job-masters-prd.md](modules/settings-industry-job-masters-prd.md) |
| Banks | Bank master | Not Implemented ("is on the way" placeholder) | [settings-hub-prd.md](modules/settings-hub-prd.md) |
| Banks | House bank master | Not Implemented ("is on the way" placeholder) | [settings-hub-prd.md](modules/settings-hub-prd.md) |
| Alert messages | Alert message templates | Not Implemented ("is on the way" placeholder) | [settings-hub-prd.md](modules/settings-hub-prd.md) |
| Program & Content | Program Category | Implemented | [settings-program-content-masters-prd.md](modules/settings-program-content-masters-prd.md) |
| Program & Content | Modules | Implemented | [settings-program-content-masters-prd.md](modules/settings-program-content-masters-prd.md) |
| Others | Menu Mapping & Access | Partially Implemented | [settings-access-masters-prd.md](modules/settings-access-masters-prd.md) |
| Others | Roles & Access | Partially Implemented | [settings-access-masters-prd.md](modules/settings-access-masters-prd.md) |

---

## 5. User roles

LearnNext Portal is one application with a portal per role (SH-002). One login (email and password) can hold several roles: after sign-in it chooses one on "Continue as", or uses the role remembered on the device, and can change it with **Switch role** in the user menu ([authentication-prd.md](modules/authentication-prd.md)). The demo login holds Training Partner, Super Admin, Facilitator and Participant.

| Role | Description | Source |
|---|---|---|
| Training Partner | Runs clients, programs, facilitators, support and settings. Can open every Training Partner page and perform every action; the portal does not hide or block anything by staff role. Most module PRDs describe this portal. | Implemented (SH-002) |
| Super Admin | Manages LearnNext's own customers, the training partners, in a reduced portal: Manage Clients (list, details, add, edit) and My Profile only. Any other address opens Manage Clients. | Partially Implemented ([PRD-SA](modules/super-admin-prd.md)) |
| Facilitator, Participant, Client SPOC | Portal roles that are defined but not built. In the role picker they show "Coming soon"; a login in one of these roles sees only the "on its way" screen. | Not Implemented (OQ-AUTH-018) |
| Permission roles defined in Roles & Access (demo: Super Admin, Training Partner, Finance Manager, Program Manager, Support Executive) | Each role has a page × action permission matrix. The matrix is stored but not yet enforced, and no user is linked to these roles. They are separate from the portal roles above: continuing as Super Admin does not use the "Super Admin" row of this master. | Partially Implemented (OQ-GEN-002) |
| Facilitators, client SPOCs and participants as records | In the Training Partner portal they are records that the Training Partner manages. They cannot sign in to their own portals yet. | Implemented |
