# Coverage Report and Cross-Module Review

This report is the final audit of the LearnNext Portal PRD set (Phase 4 and Phase 5).

- **Date:** 2026-10-29 (Facilitators counts refreshed 2026-11-03; App Shell counts refreshed 2026-11-03 for the bottom tab bar, tablet sidebar, phone layout and the installable app; My Profile for the new cover picker; Authentication and App Shell refreshed 2026-11-04 for the phone sign-in, sheet taps and the on-screen keyboard; all counts recounted from the PRDs on 2026-11-05 for the multi-role sign-in, the "Training Partner" naming, the System Pages update and the new Super Admin PRD).
- **Source of evidence:** the current build of the application. Every PRD was traced from the application's pages, forms, rules and messages. No application code was changed.

---

## 1. Summary

| Measure | Count |
|---|---|
| Modules discovered with functional behaviour | 17 |
| Module PRDs generated | 17 |
| Menu items and masters discovered with no behaviour yet (placeholders) | 13 (10 menu items + 3 Settings masters), listed in the [module inventory](module-inventory.md), plus the three coming-soon portals (Facilitator, Participant, Client SPOC) |
| Business rules documented | 382 |
| Acceptance criteria written | 289 |
| QA test scenarios written | 641 |
| Module open questions | 235 (231 open, 4 resolved) |
| Cross-cutting open questions | 14 |
| PRDs with every checklist item complete | 0 (each PRD has 1–5 items that are incomplete because of open questions, not missing documentation) |

**Documentation status:** every module PRD is a complete **Draft**. All 16 template sections are present and filled in. No PRD is marked as fully documented, because each one still depends on business decisions recorded in [open-questions.md](open-questions.md).

---

## 2. Per-module coverage

| Module PRD | Implementation status | Business rules | Acceptance criteria | Test cases | Open questions | Checklist items incomplete |
|---|---|---|---|---|---|---|
| [Authentication](modules/authentication-prd.md) | Partially Implemented (one demo account holding four roles; password reset is simulated; Facilitator and Participant portals are "coming soon") | 23 | 20 | 37 | 18 | 2 |
| [App Shell and Navigation](modules/app-shell-navigation-prd.md) | Partially Implemented (notifications are demo items, Help drawer unreachable, 10 placeholder menu items) | 31 | 18 | 52 | 16 | 4 |
| [Dashboard](modules/dashboard-prd.md) | Implemented (all figures are demo data) | 16 | 12 | 22 | 13 | 2 |
| [My Profile](modules/profile-prd.md) | Partially Implemented (password change is simulated) | 29 | 15 | 35 | 16 | 3 |
| [All Clients](modules/clients-prd.md) | Implemented (CRM portal simulated) | 35 | 27 | 68 | 19 | 3 |
| [Client Details](modules/client-detail-prd.md) | Partially Implemented (Invoices placeholder) | 31 | 25 | 55 | 14 | 3 |
| [Manage Content](modules/manage-content-prd.md) | Partially Implemented (no program retirement; permissions unused) | 25 | 17 | 40 | 18 | 4 |
| [Facilitators](modules/facilitators-prd.md) | Partially Implemented (the facilitator's payment setup approval and later steps are outside the app) | 34 | 27 | 54 | 20 | 3 |
| [Support Desk](modules/support-desk-prd.md) | Partially Implemented (ticket intake and requester side are outside the app) | 20 | 17 | 37 | 17 | 3 |
| [Settings Hub](modules/settings-hub-prd.md) | Partially Implemented (15 of 18 masters built) | 9 | 11 | 22 | 5 | 1 |
| [Finance masters](modules/settings-finance-masters-prd.md) | Implemented (links to other modules partial) | 25 | 16 | 36 | 15 | 5 |
| [Location masters](modules/settings-location-masters-prd.md) | Partially Implemented (read-only; not used by any form) | 11 | 8 | 19 | 7 | 4 |
| [Industry and job masters](modules/settings-industry-job-masters-prd.md) | Partially Implemented (read-only; not used by forms) | 9 | 7 | 15 | 6 | 3 |
| [Program and Content masters](modules/settings-program-content-masters-prd.md) | Partially Implemented (Modules master not used elsewhere) | 12 | 10 | 19 | 6 | 2 |
| [Menu and Role access](modules/settings-access-masters-prd.md) | Partially Implemented (sidebar unaffected; permissions not enforced) | 18 | 16 | 32 | 17 | 5 |
| [System Pages](modules/system-pages-prd.md) | Partially Implemented (500, 503 and session-expired pages are never triggered) | 20 | 13 | 29 | 12 | 3 |
| [Super Admin](modules/super-admin-prd.md) | Partially Implemented (demo data; CRM fetching, portal access, email update and inactive-status settings are stored only) | 34 | 30 | 69 | 16 | 4 |
| **Total** | | **382** | **289** | **641** | **235** | **54** |

Counts are the requirement rows in each PRD (My Profile includes the sub-numbered rows BR-PROF-014 ×2 and TC-PROF-019a / 019b). The open-question count includes four resolved questions (OQ-AUTH-013, OQ-CLI-018, OQ-SET-004, OQ-SA-015).

### Fully implemented vs. partially implemented

- **Fully implemented functionality (within the demo-data build):** Dashboard, All Clients and Finance masters.
- **Partially implemented:** the other 14 modules. The reason for each is given in the table above and in section 1 of each PRD.

---

## 3. Cross-module review

The review compared the shared workflows, fields, messages and rules across all 17 PRDs. The findings below are inconsistencies in the **application**. The PRDs document actual behaviour and do not resolve these. Each has an open question.

### 3.1 Inconsistent rules for the same concept

| # | Inconsistency | Where | Open question |
|---|---|---|---|
| X-01 | Settings masters exist, but the forms use separate fixed lists. This covers Country / State / City in Add client, SPOC, Entity and Facilitator; Department and Designation in Add client and SPOC; Industry in Add client. Program content modules are set per program, not from the Modules master. | Clients, Client Details, Facilitators, Finance masters, Manage Content vs. the Location, Industry & job and Program masters | OQ-GEN-003 |
| X-02 | The same country has two names: the forms say "United States", the Country master says "United States of America". | Forms vs. Location masters | OQ-LOC-001 |
| X-03 | "Required" errors appear on Save in some forms and on leaving the field in others. | Clients, SPOC, program, finance masters, Super Admin Add / Edit client vs. SH-004 | OQ-GEN-005, OQ-SA-004 |
| X-04 | Some dialogs close on a backdrop click and others do not. | Many modals vs. SH-006 | OQ-GEN-007 |
| X-05 | Only some pages warn about unsaved changes, and the warning is bypassed by Back, reload, Log out and the Support desk card. | App Shell, Clients, Manage Content, Facilitators, Roles & Access, Profile, Client Settings tab, Super Admin Settings & Configuration tab | OQ-GEN-006, OQ-SA-008 |
| X-06 | Deleting an entity or sub-entity is not blocked by programs that use it, whereas a program category in use cannot be deleted. | Finance masters vs. Program Category | OQ-FIN-006, OQ-GEN-009 |
| X-07 | Duplicate rules differ. Program categories and menu names reject duplicates, but entity name, PAN and GSTIN are not checked, sub-entity names are unique only within their entity, and the Super Admin checks only the training partner's company name. | Finance masters, Menu Mapping, Program Category, Super Admin | OQ-FIN-002, OQ-SA-006 |
| X-08 | "New this month" counts the last 30 days. | All Clients, Manage Content | OQ-GEN-013 |
| X-09 | Upload hints and accepted file types disagree. | Profile, Clients, Manage Content, Finance masters | OQ-GEN-008 |
| X-10 | Support desk pill counts follow the current search, while other lists' pills show totals. Clicking a selected pill does not clear it there. | Support Desk vs. SH-008 | OQ-SUP-014 |
| X-11 | The meaning of Active / Inactive status differs between clients, training partners and finance records; the Super Admin's "can't sign in" promise is not enforced. | Clients, Client Details, Finance masters, Super Admin | OQ-GEN-010, OQ-SA-002 |
| X-12 | Roles & Access shows actions (Export, Approve) for pages that have no such action. | Roles & Access vs. Clients, Manage Content, Support Desk | OQ-ACC-007, OQ-CNT-018, OQ-SUP-012 |
| X-13 | ~~My Profile shows the login's fixed access level even inside the Super Admin portal.~~ **Resolved 2026-11-05:** My Profile now shows the portal role in use. | My Profile vs. Super Admin | OQ-SA-015 (Resolved), OQ-PROF-011 |
| X-14 | The Super Admin's status pills stay visible on phones, whereas other lists hide their summary pills on phones. | Super Admin (Manage Clients, Sub clients) vs. SH-013 | OQ-SA-014, OQ-SHELL-015 |
| X-15 | For a Super Admin, system pages still offer **Back to dashboard** and list Dashboard, All Clients and Projects, although each of them opens Manage Clients. | System Pages vs. Super Admin | OQ-SYS-011 |
| X-16 | **Sign out** on the role picker and the coming-soon screen ends the session at once, with no confirmation and no "You have been signed out" toast, unlike **Log out** in the user menu. | Authentication | OQ-AUTH-017 |
| X-17 | The Super Admin screens call training partners "clients" (Manage Clients, Add client, Client details), the same words the Training Partner portal uses for its own clients. | Super Admin vs. All Clients, Client Details | OQ-SA-016 |

### 3.2 Consistent across modules (verified)

- **Who did it:** the signed-in user's name is used consistently for "Created by", activity entries, ticket replies and "Closed by".
- **Program categories:** Program Category ↔ Manage Content behave the same in both PRDs. Renaming a category moves its programs, and a category in use cannot be deleted.
- **Support desk count:** the sidebar Support desk card and the Support desk page use the same "Awaiting reply" count.
- **Activity timeline:** the timeline behaves the same on Client details, the Super Admin's Activity History and My Profile (summary without heatmap).
- **Shared client steps:** the Super Admin's Addresses and Billing steps and its Tax & Billing tab reuse the Training Partner's Add client and Client details behaviour (PRD-CLI, PRD-CLD).
- **Profile details:** profile name, email and picture appear consistently in the header, Dashboard greeting and system pages.

### 3.3 Messages that are missing or unclear

| Message issue | Where | Open question |
|---|---|---|
| "1 tickets" and "1 sub-pages" (wrong singular) | Support Desk filters; Menu Mapping | OQ-SUP-010, OQ-ACC-014 |
| The signature size error says "Logo" | Entity modal | OQ-FIN-012 |
| "Ends in 0 days" on the day a TDS certificate expires | Client Tax & Billing | OQ-CLD-009 |
| No feedback when copying fails | Profile, Page crash | OQ-PROF-013, OQ-SYS-007 |
| The reopen toast appears from the list but not from the details or chat views | Support Desk | OQ-SUP-007 |
| No confirmation before closing a ticket; an unsent reply is hidden | Support Desk | OQ-SUP-008 |
| "We've been notified" and "Your data is safe" are promised but not backed | Page crash | OQ-SYS-006 |
| A Module error message can never appear (only one option) | Menu Mapping | OQ-ACC-006 |
| An empty-state suggestion names terms that match nothing | Settings Hub | OQ-SET-001 |
| Notifications and the Help & Support FAQ still refer to courses, enrolments and instructors | App Shell | OQ-SHELL-004, OQ-SHELL-007 |
| System page previews carry no marker that they are previews | System Pages | OQ-SYS-012 |

### 3.4 Validation rules that are missing

- **Maximum lengths:** not defined for most text fields in every module (OQ-GEN-004).
- **Formats not defined:**
  - client code (OQ-CLI-015);
  - Govt. ID (OQ-CLI-007);
  - LUT number (OQ-FIN-004);
  - GL code (OQ-FIN-008);
  - Page URL beyond "no spaces" (OQ-ACC-004);
  - ticket number (OQ-SUP-004);
  - training partner (TPR) code beyond TPR999 and with simultaneous adds (OQ-SA-013).
- **Number limits:** the maximum fee and whether decimals are allowed (OQ-CNT-004), and the Lower TDS rate and amount rules (OQ-CLI-008).
- **Non-Indian records:** rules for non-Indian entities (OQ-FIN-005).
- **Upload limits:** no file type or count limits for support attachments and some content uploads (OQ-SUP-005, OQ-CNT-009).

### 3.5 Business decisions that are unresolved

These are the 14 cross-cutting questions OQ-GEN-001 to OQ-GEN-014 in [open-questions.md](open-questions.md). The most important are:

1. **Unbuilt modules:** the scope of the 13 placeholder modules and masters.
2. **Role-based access:** portal roles (Training Partner, Super Admin) now decide which portal a login opens, but permissions inside the Training Partner portal are not enforced, users are not linked to permission roles, and who grants a login its portal roles is undefined.
3. **Settings masters:** whether the forms must use the masters.
4. **Record lifecycle:** delete, retire and archive rules for clients, programs, SPOCs and tickets.
5. **Real sign-in:** real sign-in, password and session behaviour.

---

## 4. Page coverage check

Every route and view in the [module inventory](module-inventory.md) is covered by a module PRD, apart from the 13 placeholders, which have no behaviour to document. This includes the "Continue as" role picker, the role coming-soon screen and Switch role (PRD-AUTH), and every Super Admin page (PRD-SA). The coming-soon portals (Facilitator, Participant, Client SPOC) have no pages beyond the coming-soon screen (OQ-AUTH-018).

**Corrections to earlier assumptions**, now reflected in the inventory:
- **Help & Support drawer:** it exists, but nothing opens it.
- **Location and Industry & job masters:** these are read-only lists synced from the CRM.
- **Statuses:** several module statuses changed from Implemented to Partially Implemented.

---

## 5. Recommended next steps

1. **Cross-cutting questions:** review OQ-GEN-001 to OQ-GEN-014 with the product owner, then update the affected PRDs.
2. **Module questions:** answer the module questions, prioritising those behind P0/P1 test cases.
3. **Version 1.1:** once answers arrive, change "Requires Confirmation" cells to confirmed values, move the PRDs from Draft to Approved, and bump the version to 1.1.
4. **Keep the PRDs current:** update each PRD whenever its module changes.
