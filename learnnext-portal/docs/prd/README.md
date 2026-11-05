# LearnNext Portal: Product Requirements Documents

These are the functional PRDs for **LearnNext Portal**, the single application for every role on the LearnNext training platform. One login can hold several roles and chooses one after sign-in ("Continue as"). Today two portals are built: the **Training Partner** portal (clients, programs, facilitators, support and settings) and the reduced **Super Admin** portal (managing the training partners themselves). The Facilitator, Participant and Client SPOC portals are "coming soon". The PRDs describe what each module does, why it exists, how users interact with it, the rules it follows, how inputs are validated and what happens after each action. They are written for developers, QA engineers and technical stakeholders.

The documents describe **behaviour, not implementation**: there is no code, API, database or architecture detail. Every PRD was derived from the current build. Unknown rules are marked `Requires Confirmation` rather than assumed.

- **Version:** 1.0 (Draft)
- **Last updated:** 2026-11-05 (product renamed LearnNext Portal; the former "Admin" portal and role is now **Training Partner**; multi-role sign-in with the "Continue as" role picker; new Super Admin PRD)

## Start here

| Document | What it contains |
|---|---|
| [Product overview](product-overview.md) | What the product is, who uses it, the main journeys and how the modules depend on each other |
| [Module inventory](module-inventory.md) | Every module, page, tab, Settings master and placeholder menu item, with its status and PRD, plus the user roles |
| [Shared requirements](shared-requirements.md) | Behaviour common to all modules (SH-001 to SH-013): roles, validation timing, toasts, dialogs, lists, states, formats, phone layout |
| [PRD template and conventions](prd-template.md) | The 16-section structure, ID formats, status labels and priority levels used by every PRD |
| [Open questions](open-questions.md) | 14 cross-cutting business decisions and all 235 module-level open questions (231 open, 4 resolved) |
| [Coverage report](coverage-report.md) | Final audit: counts, per-module coverage, cross-module inconsistencies, missing rules and messages |

## Module PRDs

| # | Module | Document ID | PRD |
|---|---|---|---|
| 1 | Authentication | PRD-AUTH | [authentication-prd.md](modules/authentication-prd.md) |
| 2 | App Shell and Navigation | PRD-SHELL | [app-shell-navigation-prd.md](modules/app-shell-navigation-prd.md) |
| 3 | Dashboard | PRD-DASH | [dashboard-prd.md](modules/dashboard-prd.md) |
| 4 | My Profile | PRD-PROF | [profile-prd.md](modules/profile-prd.md) |
| 5 | All Clients (list, Add / Edit client) | PRD-CLI | [clients-prd.md](modules/clients-prd.md) |
| 6 | Client Details | PRD-CLD | [client-detail-prd.md](modules/client-detail-prd.md) |
| 7 | Manage Content | PRD-CNT | [manage-content-prd.md](modules/manage-content-prd.md) |
| 8 | Facilitators | PRD-FAC | [facilitators-prd.md](modules/facilitators-prd.md) |
| 9 | Support Desk | PRD-SUP | [support-desk-prd.md](modules/support-desk-prd.md) |
| 10 | Settings Hub | PRD-SET | [settings-hub-prd.md](modules/settings-hub-prd.md) |
| 11 | Settings: Finance masters | PRD-FIN | [settings-finance-masters-prd.md](modules/settings-finance-masters-prd.md) |
| 12 | Settings: Location masters | PRD-LOC | [settings-location-masters-prd.md](modules/settings-location-masters-prd.md) |
| 13 | Settings: Industry and job masters | PRD-PPL | [settings-industry-job-masters-prd.md](modules/settings-industry-job-masters-prd.md) |
| 14 | Settings: Program and Content masters | PRD-PRG | [settings-program-content-masters-prd.md](modules/settings-program-content-masters-prd.md) |
| 15 | Settings: Menu and Role access | PRD-ACC | [settings-access-masters-prd.md](modules/settings-access-masters-prd.md) |
| 16 | System Pages | PRD-SYS | [system-pages-prd.md](modules/system-pages-prd.md) |
| 17 | Super Admin (Manage Clients, Client details, Add / Edit client) | PRD-SA | [super-admin-prd.md](modules/super-admin-prd.md) |

Modules 1–16 describe the Training Partner portal (Authentication, App Shell, My Profile and System Pages also cover the Super Admin where its behaviour differs). Module 17 describes the Super Admin portal.

## How to read a PRD

Every module PRD has the same 16 sections:

1. Document Information
2. Purpose and Objective
3. Module and Page Overview
4. User Roles and Access
5. Page Functionality and Behavior
6. User Workflow
7. Forms and Field-Level Specifications
8. Validation and Business Rules
9. Success Messages and User Feedback
10. Search, Filters, Tables, and Listings
11. Empty States, Errors, and Edge Cases
12. Cross-Module Dependencies
13. Acceptance Criteria
14. QA Test Scenarios
15. Open Questions and Gaps
16. PRD Completeness Checklist

**Where to look:**
- **Developers:** sections 5–8 and 12.
- **QA engineers:** sections 7–11, 13 and 14.
- **Stakeholders:** sections 2–4 and 15.

**IDs:**
- Requirements use the module prefix: `BR-CLI-004`, `AC-CLI-010`, `TC-CLI-022`, `OQ-CLI-003`.
- Shared behaviour is referenced as `SH-001` to `SH-013`.
- Statuses and priorities (P0–P3) are defined in the [template](prd-template.md).

## Important notes for QA

- **Demo data:** the current build runs on demo data. Created or edited records last until the page is reloaded (SH-001).
- **Roles:** the demo login holds four roles (Training Partner, Super Admin, Facilitator, Participant), so after sign-in it opens the "Continue as" role picker. Choose **Training Partner** or **Super Admin** to test that portal; Facilitator and Participant show a "coming soon" screen. **Switch role** in the user menu returns to the picker (SH-002, SH-003).
- **Role permissions:** the Roles & Access permissions are stored but not enforced yet, so every Training Partner user can perform every Training Partner action (SH-002, OQ-GEN-002).
- **Unconfirmed rules:** test cases that depend on an unconfirmed rule say so in their Expected Result.
