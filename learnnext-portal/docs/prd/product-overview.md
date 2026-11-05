# LearnNext Portal: Product Overview

Last updated: 2026-11-05 (renamed from "LearnNext Admin" to **LearnNext Portal**; the "Admin" portal and role are now **Training Partner**; multi-role sign-in and the portal list added)

## 1. What the product is

LearnNext delivers training programs to organisations and to individuals. **LearnNext Portal** is one application for every role that works with LearnNext. Everyone signs in on the same page, and each role then gets its own portal: its own menu, pages and home page.

The most complete portal is the **Training Partner** portal, the back-office used to run the training business. Training Partner users use it to:

- onboard and maintain **clients** (companies and individuals), their points of contact (SPOCs), training projects and participants;
- maintain the **program catalogue** and the learning content delivered before, during and after each program;
- onboard **facilitators** (trainers) through a KYC verification process;
- answer **support tickets** raised by participants and facilitators;
- keep the **reference data** that billing and forms rely on: legal entities, tax registrations, expense heads, locations, job data, program categories, menus and role permissions;
- see a **dashboard** of business performance.

Until their own portals are built, facilitators, client SPOCs and participants appear only as records in the Training Partner portal (SH-002).

## 2. Who uses it

### 2.1 One sign-in, several roles

- Every role signs in on the same [Sign in](modules/authentication-prd.md) page with one email and password.
- A login can be linked to several roles (for example Training Partner and Super Admin). After signing in, such a login sees a **"Continue as"** step: one tile per role with a short description, a "Remember my choice on this device" option and a **Continue as ‹role›** button. A login with a single role skips this step.
- The chosen role decides which portal opens and where it starts. The user can change role later with **Switch role** in the user menu ([App Shell](modules/app-shell-navigation-prd.md)).
- A portal opens only its own pages. Opening an address outside them takes the user to that portal's home page.

### 2.2 Portals

| Portal (role) | Who uses it | What it covers | Home page | Status |
|---|---|---|---|---|
| **Training Partner** | Staff of a training partner company running day-to-day operations | The full back-office: Dashboard, All Clients and Client Details, Manage Content, Facilitators, Support Desk, Settings and My Profile (the module PRDs in section 3) | Dashboard | Built |
| **Super Admin** | LearnNext staff who manage the training-partner companies | **Manage Clients**: the training-partner companies and each company's own sub clients, plus My Profile. See [PRD-SA: Super Admin](modules/super-admin-prd.md) | Manage Clients | Built |
| **Facilitator** | Trainers and coaches | Their sessions, attendance and session content | — | Coming soon: shown at "Continue as" but cannot be picked yet |
| **Participant** | Learners | Their programs, modules, assessments and progress | — | Coming soon (as above) |
| **Client SPOC** | A client company's point of contact | Their company's projects, participants and reports | — | Coming soon (as above) |

### 2.3 Users of the Training Partner portal

| User | Description | Access in the current build |
|---|---|---|
| Training Partner user | A signed-in user continuing as Training Partner | Every page and action of the Training Partner portal. Role permissions are defined in Settings but are not enforced yet. See [settings-access-masters-prd.md](modules/settings-access-masters-prd.md). |

## 3. Main user journeys

Training Partner portal:

| Journey | Modules involved |
|---|---|
| Sign in, pick Training Partner if asked, and reach the dashboard | [Authentication](modules/authentication-prd.md) → [Dashboard](modules/dashboard-prd.md) |
| Add a new client (from the CRM or manually), then manage its SPOCs and settings | [All Clients](modules/clients-prd.md) → [Client Details](modules/client-detail-prd.md) |
| Review a client's projects, participants, billing and history | [Client Details](modules/client-detail-prd.md) |
| Add a program and upload its content, then set who may see it | [Manage Content](modules/manage-content-prd.md) and [Program & Content masters](modules/settings-program-content-masters-prd.md) |
| Invite a facilitator to KYC and verify the submission | [Facilitators](modules/facilitators-prd.md) |
| Answer, close and reopen support tickets | [Support Desk](modules/support-desk-prd.md) |
| Maintain billing entities and expense heads | [Finance masters](modules/settings-finance-masters-prd.md) via the [Settings Hub](modules/settings-hub-prd.md) |
| Configure menus and role permissions | [Menu & Role access](modules/settings-access-masters-prd.md) |
| Update one's own profile, picture and password | [My Profile](modules/profile-prd.md) |

Super Admin portal: add and maintain training-partner companies and look at their sub clients; see [PRD-SA](modules/super-admin-prd.md). My Profile is shared with the Training Partner portal.

Every journey runs inside the common [App Shell](modules/app-shell-navigation-prd.md): the sidebar, header, search, notifications and user menu, each showing the current portal's own menu and pages. Failures surface on the [System Pages](modules/system-pages-prd.md).

## 4. How the modules depend on each other

| From | To | Dependency |
|---|---|---|
| Program Category master | Manage Content | Programs are grouped by category. Renaming a category moves its programs, and a category in use cannot be deleted. |
| Entity and Sub-entity masters | Manage Content, Facilitators | The program form and the facilitator "Onboarding for" field offer only active entities. Deleting an entity is not blocked by programs that use it. |
| Add / Edit client | Client Details, Dashboard | Saved client data appears on Client details and in its Activity History. |
| Client Details (Settings) | All Clients | Changing a client's status updates the list and logs activity. |
| Support Desk | App Shell | The sidebar Support desk card shows the "Awaiting reply" count. |
| My Profile | App Shell, Dashboard, records everywhere | The signed-in user's name and picture appear in the header, the greeting and "Created by". |
| Menu Mapping | Roles & Access | New menus appear as rows in the permission grid. |
| Location, Industry & job masters | (none yet) | The forms use their own fixed lists. See OQ-GEN-003. |
| Roles & Access | (none yet) | Permissions are not enforced. See OQ-GEN-002. |

## 5. Current state of the build

- **Demo data:** the application runs on built-in demo data. Changes last until the page is reloaded (SH-001).
- **Portals:** the Training Partner and Super Admin portals are built. The Facilitator, Participant and Client SPOC portals are "Coming soon".
- **Built modules:** see the [module inventory](module-inventory.md) for every built module and its PRD.
- **Placeholders:** several Training Partner menu items and Settings masters are placeholders. See the [module inventory](module-inventory.md).
- **Open questions:** the main business decisions still open are listed in [open-questions.md](open-questions.md), and the overall audit is in the [coverage report](coverage-report.md).
