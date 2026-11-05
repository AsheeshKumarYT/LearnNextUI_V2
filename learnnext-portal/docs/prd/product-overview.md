# LearnNext Admin: Product Overview

## 1. What the product is

LearnNext delivers training programs to organisations and to individuals. **LearnNext Admin** is the internal back-office that LearnNext staff use to run that business.

LearnNext staff use it to:

- onboard and maintain **clients** (companies and individuals), their points of contact (SPOCs), training projects and participants;
- maintain the **program catalogue** and the learning content delivered before, during and after each program;
- onboard **facilitators** (trainers) through a KYC verification process;
- answer **support tickets** raised by participants and facilitators;
- keep the **reference data** that billing and forms rely on: legal entities, tax registrations, expense heads, locations, job data, program categories, menus and role permissions;
- see a **dashboard** of business performance.

Facilitators, SPOCs and participants are records in this application. They do not sign in to it (SH-002).

## 2. Who uses it

| User | Description | Access in the current build |
|---|---|---|
| Admin user | A signed-in LearnNext staff member | Every page and action. Role permissions are defined in Settings but are not enforced yet. See [settings-access-masters-prd.md](modules/settings-access-masters-prd.md). |

## 3. Main user journeys

| Journey | Modules involved |
|---|---|
| Sign in and reach the dashboard | [Authentication](modules/authentication-prd.md) → [Dashboard](modules/dashboard-prd.md) |
| Add a new client (from the CRM or manually), then manage its SPOCs and settings | [All Clients](modules/clients-prd.md) → [Client Details](modules/client-detail-prd.md) |
| Review a client's projects, participants, billing and history | [Client Details](modules/client-detail-prd.md) |
| Add a program and upload its content, then set who may see it | [Manage Content](modules/manage-content-prd.md) and [Program & Content masters](modules/settings-program-content-masters-prd.md) |
| Invite a facilitator to KYC and verify the submission | [Facilitators](modules/facilitators-prd.md) |
| Answer, close and reopen support tickets | [Support Desk](modules/support-desk-prd.md) |
| Maintain billing entities and expense heads | [Finance masters](modules/settings-finance-masters-prd.md) via the [Settings Hub](modules/settings-hub-prd.md) |
| Configure menus and role permissions | [Menu & Role access](modules/settings-access-masters-prd.md) |
| Update one's own profile, picture and password | [My Profile](modules/profile-prd.md) |

Every journey runs inside the common [App Shell](modules/app-shell-navigation-prd.md): the sidebar, header, search, notifications and user menu. Failures surface on the [System Pages](modules/system-pages-prd.md).

## 4. How the modules depend on each other

| From | To | Dependency |
|---|---|---|
| Program Category master | Manage Content | Programs are grouped by category. Renaming a category moves its programs, and a category in use cannot be deleted. |
| Entity and Sub-entity masters | Manage Content, Facilitators | The program form and the facilitator "Onboarding for" field offer only active entities. Deleting an entity is not blocked by programs that use it. |
| Add / Edit client | Client Details, Dashboard | Saved client data appears on Client details and in its Activity History. |
| Client Details (Settings) | All Clients | Changing a client's status updates the list and logs activity. |
| Support Desk | App Shell | The sidebar Support desk card shows the "Awaiting reply" count. |
| My Profile | App Shell, Dashboard, records everywhere | The admin's name and picture appear in the header, the greeting and "Created by". |
| Menu Mapping | Roles & Access | New menus appear as rows in the permission grid. |
| Location, Industry & job masters | (none yet) | The forms use their own fixed lists. See OQ-GEN-003. |
| Roles & Access | (none yet) | Permissions are not enforced. See OQ-GEN-002. |

## 5. Current state of the build

- **Demo data:** the application runs on built-in demo data. Changes last until the page is reloaded (SH-001).
- **Built modules:** 16 modules are built and documented.
- **Placeholders:** 10 menu items and 3 Settings masters are placeholders. See the [module inventory](module-inventory.md).
- **Open questions:** the main business decisions still open are listed in [open-questions.md](open-questions.md), and the overall audit is in the [coverage report](coverage-report.md).
