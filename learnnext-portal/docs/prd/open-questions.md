# Open Questions and Gaps

This document collects every unresolved requirement found while writing the LearnNext Portal PRDs.

- **Section 1** lists the cross-cutting business decisions, each of which affects several modules. Resolve these first; one answer closes many module questions at once.
- **Section 2** reproduces each module's own open-questions table, copied unchanged from section 15 of that module's PRD.

Almost every question has the status **Open**; three module questions (OQ-AUTH-013, OQ-CLI-018, OQ-SET-004) are **Resolved** and keep their row with the decision. Once a question is answered, update the module PRD and change its status here to **Resolved**, recording the decision.

**Totals:** 235 module questions across 17 PRDs (232 open, 3 resolved), plus 14 cross-cutting questions.

---

## 1. Cross-cutting questions

| Question ID | Topic | Missing or Unclear Requirement | Why It Matters | Related module questions | Status |
|---|---|---|---|---|---|
| OQ-GEN-001 | Unbuilt modules | 13 items open a placeholder: Projects, the six Finance pages (All Invoices, Credit Note, Debit Note, E-Invoice, Trainer Invoice, Invoice Approvals), Assessments, Polls & Surveys, Reports, and the Bank master, House bank master and Alert message templates masters. Their scope, priority and requirements are not defined. | No PRD can be written for them, and Client details (Invoices), Dashboard figures and Roles & Access rows already refer to them. | OQ-SHELL-006, OQ-CLD-012, OQ-SET-002 | Open |
| OQ-GEN-002 | Role-based access | The portal role chosen at sign-in (Training Partner or Super Admin) now decides which portal and pages a login sees (SH-002). Inside the Training Partner portal, however, Roles & Access stores a page × action permission matrix that no user is linked to and nothing enforces, and Menu Mapping does not change the real sidebar. Who grants a login its portal roles is also undefined. | Without enforcement every Training Partner user can do everything, including finance and settings changes. | OQ-ACC-001, OQ-ACC-002, OQ-ACC-003, OQ-SHELL-012, OQ-CNT-011, OQ-SUP-012, OQ-PROF-011, OQ-SET-005, OQ-AUTH-011 | Open |
| OQ-GEN-003 | Masters vs. forms | The Settings masters are not used by the forms that should read them. Location masters feed no address form, Industry & job masters don't feed the client, SPOC or participant forms, Modules don't drive the content stages, and the Entity master is not captured on clients. Those forms use separate fixed lists that already disagree with the masters (for example "United States" vs "United States of America"). | Training Partner users will expect a change in Settings to appear in the forms, and the two sets of values will drift apart. | OQ-LOC-001, OQ-CLI-003, OQ-CLD-003, OQ-CNT-008, OQ-FIN-011, OQ-SA-012, settings-industry-job-masters OQs | Open |
| OQ-GEN-004 | Field length limits | Maximum lengths are not defined for most text fields in every module. Some fields stop typing at a limit with no rule recorded. | QA cannot test boundaries, and a real back end will impose its own limits. | OQ-CLI-004, OQ-CLD-010, OQ-PROF-002, OQ-FIN-003, OQ-CNT-001, OQ-CNT-010, OQ-ACC-005, OQ-SUP-006, OQ-SA-010 | Open |
| OQ-GEN-005 | Validation timing | Shared requirement SH-004 says "required" errors appear only after Save. Several forms instead show them when the user leaves the field: the client form's text fields, the SPOC form, the program form, the finance masters and the Super Admin's Add / Edit client form. | Inconsistent feedback across forms; the rule needs choosing once and applying everywhere. | OQ-CLI-005, OQ-CLD-011, OQ-CNT-006, OQ-FIN-013, OQ-SA-004 | Open |
| OQ-GEN-006 | Unsaved-changes protection | Only four Training Partner pages (and the Super Admin's Add / Edit client) warn before leaving with unsaved changes, and even those skip the warning on browser Back, page reload, Log out and the Support desk card. Roles & Access, Personal details, client Settings and the Super Admin's Settings & Configuration tab lose changes silently. | Typed work can be lost without warning. | OQ-SHELL-008, OQ-SHELL-009, OQ-CLI-010, OQ-CNT-012, OQ-ACC-008, OQ-PROF-009, OQ-CLD-008, OQ-SA-008 | Open |
| OQ-GEN-007 | Dialog closing | SH-006 says modals close on a backdrop click. Many forms (SPOC, program, element, menu, finance masters, Change password) deliberately do not. | The intended rule should be confirmed, so it can be applied consistently and tested. | OQ-CLD-013, OQ-PROF-012, OQ-FIN-013, settings-access-masters PRD section 11 | Open |
| OQ-GEN-008 | Accepted upload types | Upload hints do not match what is accepted. For example, "JPG/PNG/WebP" accepts any image, and the program overview accepts images as well as PDF. | Users get misleading guidance, and QA cannot tell which behaviour is correct. | OQ-PROF-005, OQ-CNT-002, OQ-CNT-003, OQ-CLI-014, OQ-FIN-012, OQ-SUP-005 | Open |
| OQ-GEN-009 | Delete, retire and archive lifecycle | Clients, training partners, programs, SPOCs and support tickets cannot be deleted, retired or archived. Deleting an entity or sub-entity is not blocked when programs use it. | The data can only grow; mistakes can't be removed, and references can break. | OQ-CLI-001, OQ-SA-005, OQ-CNT-005, OQ-CLD-001, OQ-SUP-016, OQ-FIN-006 | Open |
| OQ-GEN-010 | Meaning of "Inactive" | What an Inactive client, training partner, entity or other record may and may not do is not defined consistently. | Status switches exist but have no agreed effect. | OQ-CLI-019, OQ-CLD-005, OQ-FIN-010, OQ-SA-002 | Open |
| OQ-GEN-011 | Real sign-in, password and session | Sign-in uses one demo account (holding four roles). The password reset and change flows are simulations. Profile email changes do not change the sign-in email. Session expiry is not defined, and the error pages are never triggered. | Security behaviour must be specified before a real back end is connected. | authentication-prd OQs, OQ-PROF-001, OQ-PROF-003, OQ-PROF-004, OQ-SYS-001, OQ-SYS-008 | Open |
| OQ-GEN-012 | Global search | The Ctrl+K / ⌘K search now returns records (pages, clients, programs, facilitators, support tickets and Settings masters for Training Partner; pages and training partners for Super Admin). Still undefined: whether SPOCs, participants and program content should be searchable, and which pages belong in "Jump to". | Users may expect to find any record from one place, and "Jump to" lists placeholder pages. | OQ-SHELL-001, OQ-SHELL-002, OQ-CLI-018, OQ-SET-004 | Open |
| OQ-GEN-013 | "New this month" counts | The "New this month" figures count the last 30 days, not the calendar month. | Labels and numbers disagree. | OQ-CLI-002, OQ-CNT-013 | Open |
| OQ-GEN-014 | Development-only pages | The "System pages" gallery is visible to every Training Partner user in every build (Super Admin does not see it). | A developer aid appears in production navigation. | OQ-SHELL-010, OQ-SYS-009 | Open |

---

## 2. Module questions

### Authentication

Source: [authentication-prd.md](modules/authentication-prd.md), section 15. 18 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-AUTH-001 | Sign in | No limit on failed attempts, no lockout, no CAPTCHA policy | Brute-force risk | Define attempt limit, lockout duration and message | Open |
| OQ-AUTH-002 | Session | No inactivity timeout or session expiry; the Session expired page is never reached automatically | Unattended portals stay signed in indefinitely | Define timeout length and whether "Keep me signed in" has a maximum age | Open |
| OQ-AUTH-003 | Forgot / Reset password | Reset link is not validated; the stated 30-minute expiry, single use and resend limits are not enforced; Reset password and Reset success open without a link | Anyone can reach the reset form | Define link validity, expiry, reuse and resend throttling, and the expired-link message | Open |
| OQ-AUTH-004 | Reset password | Completing a reset does not change the password; "different from previously used passwords" is not checked | The journey reports success that did not happen | Confirm behaviour once a real back end exists, and how many previous passwords are blocked | Open |
| OQ-AUTH-005 | Sign in | The "Demo account" panel shows real credentials on the sign-in page | Must not reach production | Confirm removal for production builds | Open |
| OQ-AUTH-006 | All auth forms | No maximum length for email or password | Data quality and security | Define maximum lengths | Open |
| OQ-AUTH-007 | Reset password | Policy is minimum 8 characters and 3 of 4 character types; maximum length, spaces and banned/common passwords are not defined | Consistent password policy | Confirm the policy | Open |
| OQ-AUTH-008 | Sign in | Is there a second sign-in factor (one-time code)? Code entry exists only in Profile → Change password | Training Partner and Super Admin accounts hold client and finance data | Confirm whether two-step sign-in is required | Open |
| OQ-AUTH-009 | Auth page frame | Auth pages do not set a browser tab title (differs from SH-009) | After logging out the tab still shows the last portal page's name | Define titles, e.g. "Sign in · LearnNext" | Open |
| OQ-AUTH-010 | Session | Logging out in one tab does not sign out other open tabs until they reload | Shared computers | Confirm whether sign-out should apply to all tabs immediately | Open |
| OQ-AUTH-011 | Sign in | Only one demo account (holding four roles); no user management, and no way to grant or remove a login's roles | Multiple staff need accounts with the right roles | Confirm account provisioning, who assigns portal roles, and per-role access (SH-002) | Open |
| OQ-AUTH-012 | Auth page frame | Terms of Service and Privacy Policy are placeholder text | Legal compliance | Provide final legal copy | Open |
| OQ-AUTH-013 | Auth page frame | Resolved 2026-11-05: the brand panel no longer shows figures or course/instructor wording; it shows only the headline, the brand line and feature names | — | — | Resolved |
| OQ-AUTH-014 | Log out | Logging out returns the user to the same page on the next sign-in in that tab | Could be unexpected on a shared computer | Confirm intended | Open |
| OQ-AUTH-015 | Role picker | "Remember my choice on this device" never expires, survives sign-out and can only be cleared through **Switch role** (there is no setting for it in My Profile) | A shared device keeps skipping the picker; users may not find how to undo it | Confirm expiry, whether sign-out should clear it, and whether My Profile needs a "Default role" setting | Open |
| OQ-AUTH-016 | Role picker / landing | Chosen in the picker, Super Admin always opens Manage Clients; with a remembered Super Admin choice, a requested Manage Clients address (for example a client's address from a Training Partner bookmark) is opened as is, and may point to a different record or none | Inconsistent landing; possible "not found" or wrong record | Confirm that Super Admin should always land on Manage Clients, also with a remembered choice | Open |
| OQ-AUTH-017 | Role picker, coming-soon screen | **Sign out** there ends the session at once, with no confirmation and no "You have been signed out" toast, unlike **Log out** in the user menu | Inconsistent sign-out feedback | Confirm whether these should confirm and/or show the toast | Open |
| OQ-AUTH-018 | Coming-soon roles | Facilitator, Participant and Client SPOC portals are not built; their launch scope and timing, and whether coming-soon roles should be listed in the picker at all, are not defined | Users see roles they cannot use | Confirm scope, timing and picker visibility | Open |

### App Shell and Navigation

Source: [app-shell-navigation-prd.md](modules/app-shell-navigation-prd.md), section 15. 16 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-SHELL-001 | Global search | Resolved 2026-11-02: the search now finds pages, clients, programs, facilitators, support tickets and Settings masters (best matches first, 4 per group with "+N more"), and each result opens its record. Still open: whether SPOCs, participants and program content should also be searchable | Coverage of the search | Confirm any further sources | Open |
| OQ-SHELL-002 | Global search | "Jump to" lists placeholder pages and the Dev only "System pages" item, but not My Profile, Support desk or Settings masters | Users may jump to empty pages and miss real ones | Confirm which pages belong in "Jump to" | Open |
| OQ-SHELL-003 | Notifications | No Notifications page or "View all" link; only five items are visible; items do not open the related record | Older or important notifications cannot be reached or acted on | Decide whether a Notifications page is needed and what each notification type links to | Open |
| OQ-SHELL-004 | Notifications | Notifications are fixed demo items about courses, enrolments and instructor payouts; nothing in the application creates notifications, and read state resets on reload | Content does not match the Training Partner portal's domain | Define notification events (e.g. KYC submitted, ticket received, invoice approval), delivery, retention and read-state persistence | Open |
| OQ-SHELL-005 | Notifications | Notification rows can only be clicked with a mouse; they cannot be focused or activated by keyboard (differs from SH-010) | Accessibility | Confirm rows must be keyboard operable | Open |
| OQ-SHELL-006 | Placeholder pages | Projects, six Finance pages, Assessments, Polls & Surveys and Reports show "Nothing here yet" | Users see menu items that do nothing | Confirm scope and timing, and whether unbuilt items should be hidden until ready | Open |
| OQ-SHELL-007 | Help & Support | A Help & Support drawer (FAQ, Email support, Send feedback, shortcuts) exists but nothing opens it; its FAQ refers to courses and instructors | Users have no in-app help | Decide whether to add a Help entry point and provide correct FAQ copy | Open |
| OQ-SHELL-008 | Log out / leave guard | Log out does not check for unsaved changes on Add client, Edit client, Program content or Verify KYC; work is lost after confirming | Data loss | Confirm whether Log out should show the page's discard dialog first | Open |
| OQ-SHELL-009 | Leave guard | The full-sidebar Support desk card and the browser Back/Forward buttons bypass the guard; Add client / Edit client give no warning on reload or tab close, while Program content and Verify KYC do | Inconsistent protection against data loss | Confirm that every exit, including Back and reload, should ask on all guarded pages, and which other forms need a guard | Open |
| OQ-SHELL-010 | Dev only section | "System pages" is shown to every Training Partner in every build (not to Super Admin) | Development tools visible to business users | Confirm it is hidden in production builds | Open |
| OQ-SHELL-011 | Footer | "All systems operational · v0.1.0" is fixed text | May mislead users during an outage; version never changes | Decide whether to show live status and the real release version, or remove | Open |
| OQ-SHELL-012 | Sidebar / access | The portal role now decides the shell (Training Partner vs Super Admin), but within the Training Partner portal the Menu Mapping & Access and Roles & Access settings are still not applied to the menu, search or header (SH-002) | Every Training Partner sees every module | Define per-role menu visibility inside the Training Partner portal and behaviour for hidden pages opened by address | Open |
| OQ-SHELL-013 | Keyboard shortcuts | Ctrl+K / ⌘K is the only shortcut; it works while typing in fields and overrides the browser's Ctrl+K | Possible conflict with user expectations | Confirm the shortcut set and whether shortcuts should be ignored while typing | Open |
| OQ-SHELL-014 | Notifications badge | No cap on the unread number in the badge (e.g. "9+") | Large numbers overflow the small circle | Define the display rule for large counts | Open |
| OQ-SHELL-015 | Phone layout (SH-013) | To keep phones uncluttered some features are not available there: list summary pills, the Settings group tabs, pin buttons and Quick access (pinned / recently opened masters), and pages without a filter drawer show no counts at all | Phone users cannot pin masters or see list counts | Confirm these are acceptable on phones, or name the ones that must come back (e.g. a "Pinned" card on Settings) | Open |
| OQ-SHELL-016 | Super Admin shell | On phones the Super Admin's **More** tab opens a sheet that holds only the profile row; there are no notifications, no Settings and no support entry for the Super Admin | A near-empty tab; unclear how a Super Admin gets help or alerts | Confirm the Super Admin's phone tabs and whether it needs notifications, settings or support | Open |

### Dashboard

Source: [dashboard-prd.md](modules/dashboard-prd.md), section 15. 13 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-DASH-001 | All cards | Every figure is demo data; the real definition and source of each metric (which programs count, when a program is "completed", which invoices count as "invoiced" and "collected") is not defined. | The dashboard must match finance and project records once a back end is connected. | Define each metric's source and calculation. | Open |
| OQ-DASH-002 | Period switch | "This month" (month to date?), "Quarter" (calendar quarter or last 13 weeks?) and "Year" (calendar, financial year April–March, or last 12 months?) are not defined. | Indian finance teams usually report by financial year. | Confirm each period's exact date range. | Open |
| OQ-DASH-003 | Program status | In progress and Upcoming counts do not change with the period while Completed and Pending approval do. | Totals and percentages may be misleading. | Confirm whether all statuses should be period-based. | Open |
| OQ-DASH-004 | To approve → Review queue | The link opens Projects, which is a placeholder page; there is no approval queue page. | The main call to action leads nowhere useful. | Define the approval queue destination (and filter). | Open |
| OQ-DASH-005 | Period switch | The chosen period is not remembered between visits. | Users who always look at a different period must re-select it. | Confirm whether to remember the choice. | Open |
| OQ-DASH-006 | Collection status | The 60% / 25% thresholds for green / amber / red are not business-approved. | Colour drives attention. | Confirm thresholds. | Open |
| OQ-DASH-007 | Leaderboard | How points are earned, the ranking window ("Current") and tie-breaking (two trainers with 75 pts) are not defined. | Rankings must be fair and explainable. | Define the points model and tie rule. | Open |
| OQ-DASH-008 | All cards | No card links to detail (client, partner, agreement, program). | Users cannot act on what they see. | Confirm whether drill-down links are required. *Proposed:* link Top clients rows to Client details. | Open |
| OQ-DASH-009 | Refresh / period change | A failure after figures were shown leaves old figures with no message. | User may trust stale numbers. | *Proposed:* show an error toast "Couldn’t refresh the dashboard". | Open |
| OQ-DASH-010 | Live today | What makes a program "live today" (any session today, or a session in progress now) is not defined. | Drives the live indicator. | Define "live". | Open |
| OQ-DASH-011 | Access | Billing figures are visible to every role. | Finance data may be sensitive. | Confirm role restrictions once Roles & Access is enforced. | Open |
| OQ-DASH-012 | Partner agreements | Whether expiring agreements are included in Active, and whether Pending signature agreements can expire, is not stated. | Totals may double count. | Confirm bucket rules. | Open |
| OQ-DASH-013 | Top clients, Leaderboard, Usage ranking | No empty-state message is defined when these lists have no data. | New installations would show blank cards. | *Proposed:* "No data for this period yet." | Open |

### My Profile

Source: [profile-prd.md](modules/profile-prd.md), section 15. 16 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-PROF-001 | Personal details: Email address | Changing the profile email does not change the sign-in email and is not verified | Two different "emails" for one account; codes may go to an unverified address | Decide whether email is editable, whether it is the sign-in identity, and whether a change needs verification | Open |
| OQ-PROF-002 | Personal details | No maximum lengths for Full name, Email, Mobile, Location or Designation; mobile has no country or length rule; name minimum counts spaces | Data quality, layout overflow | Define limits and the mobile number format | Open |
| OQ-PROF-003 | Change password | The change does not alter the sign-in password; no current-password field; no check that the new password differs from the current or previous ones | The flow reports a success that did not happen | Confirm the one-time code fully replaces the current password, and the password-history rule | Open |
| OQ-PROF-004 | Change password: code | 5-minute expiry and 30-second resend wait exist, but no limit on wrong attempts or resends; the demo code is shown on screen | Brute-force risk; must not reach production | Define attempt and resend limits, lockout and message; remove the demo note | Open |
| OQ-PROF-005 | Avatar picker: upload | Hint says JPG, PNG or WebP, but any image type is accepted; no minimum dimensions; crop is automatic centre-square with no adjustment | Inconsistent rule; poor crops | Confirm allowed types, minimum size and whether users can adjust the crop | Open |
| OQ-PROF-006 | Avatar picker: upload | If the browser cannot store a large photo, it shows now but is silently lost after reload | Unexpected loss | Define storage of photos and a failure message | Open |
| OQ-PROF-007 | My activity | Only profile, picture, cover and password changes are recorded; actions elsewhere and sign-ins are not; session entries disappear on reload while profile changes persist | Header promises "Everything you’ve done across LearnNext" | Define which actions are logged, retention and the source of sign-in/device entries | Open |
| OQ-PROF-008 | Account: Last sign-in | Fixed demo value, not the actual last sign-in | Misleading security information | Confirm it should show the real previous sign-in (time, device, location) | Open |
| OQ-PROF-009 | Personal details | No unsaved-changes warning when leaving the page | Edits lost silently | Confirm whether the leave guard (SH-006) should apply | Open |
| OQ-PROF-010 | Security | 90-day rotation is advisory only | Policy enforcement | Confirm whether expiry should force a change at sign-in | Open |
| OQ-PROF-011 | Account: Access level, Employee ID | Values are fixed; not linked to Roles & Access; who maintains them is undefined | Role shown may not match permissions | Define the source and owner of these facts | Open |
| OQ-PROF-012 | Change password dialog | Backdrop click does not close it (differs from SH-006) | Consistency | Confirm intended (protects the flow from accidental closing) | Open |
| OQ-PROF-013 | Banner, Account | Copy gives no feedback when the clipboard is blocked | User may think it copied | Define a fallback message | Open |
| OQ-PROF-014 | Personal details: About | "Shown to your team" but the bio is not displayed anywhere, including on this page outside the form | Purpose unclear | Confirm where the bio appears | Open |
| OQ-PROF-015 | Attribution | Records keep the name used when they were created; a later name change is not reflected [Inferred] | Audit trail consistency | Confirm whether attribution should follow the user or stay historical | Open |
| OQ-PROF-016 | My activity: alert | **Secure your account** only opens Change password; no way to sign out other devices or report the sign-in | Incident response | Define the security actions available | Open |

### All Clients (list, Add / Edit client)

Source: [clients-prd.md](modules/clients-prd.md), section 15. 19 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-CLI-001 | All Clients | No Export, bulk actions or client deletion exist | Reporting and data clean-up | Confirm whether Export (format, columns), bulk status change or delete/archive are required | Open |
| OQ-CLI-002 | Summary pills | "New this month" counts the last 30 days, and "+N this year" counts the last 12 months, not calendar periods | Labels may mislead | Confirm calendar month/year or rename the labels | Open |
| OQ-CLI-003 | Add client | Company type, Industry, Department, Designation and Country/State/City are fixed lists, not the Settings masters (which are synced from the CRM). No LearnNext entity is captured | Lists drift from master data | Confirm the source of each list and whether an entity is needed | Open |
| OQ-CLI-004 | Add client | No maximum length for company/participant name, email, website, address lines, SEZ number, Govt. ID or search fields | Data quality, layout | Define limits | Open |
| OQ-CLI-005 | Add client | Required errors appear on leaving a field (unlike SH-004), but only on Continue for selects, radios, dates and uploads | Inconsistent behaviour | Align with SH-004 or document as intended | Open |
| OQ-CLI-006 | Add client | No duplicate check on individual email/mobile, on mobile numbers, or on GSTINs (within a client or across clients); GSTIN state code not checked against the address state; individual GST certificate optional even with a GST No. | Duplicate or inconsistent tax data | Define duplicate and GST consistency rules | Open |
| OQ-CLI-007 | Individual | Govt. ID has no type selection or format check | ID accuracy | Define accepted ID types and formats | Open |
| OQ-CLI-008 | Lower TDS | A 0% rate is accepted; meaning of "Amount" (limit covered by the certificate?) undefined; no section format; expired validity accepted | Tax correctness | Confirm rate range, amount meaning and whether expired certificates are allowed | Open |
| OQ-CLI-009 | Edit client | Save changes is always enabled and logs "Updated details of" even with no change; after save or Cancel the user lands on All Clients even when they came from Client details | Noisy audit trail; lost context | Decide whether to disable Save without changes and return to the originating page | Open |
| OQ-CLI-010 | Add/Edit client | Browser Back, reload, closing the tab and Log out are not guarded; an unsaved billing panel is dropped silently | Data loss | Decide whether to extend the guard | Open |
| OQ-CLI-011 | CRM fetch | The CRM portal is simulated (25 companies, generated details). Behaviour for partial data, timeouts, and when the name is edited after a fetch is undefined | Production integration | Define the real CRM integration and its error handling | Open |
| OQ-CLI-012 | Add client | Switching Company ↔ Individual keeps the other type's hidden values | Stale data may be saved with the client | Confirm whether switching should clear the other type's values | Open |
| OQ-CLI-013 | Demo data | Demo clients use industry "Training", which is not in the Industry list; Edit shows "Education & Training" | Silent change of industry on save | Align demo industries with the list | Open |
| OQ-CLI-014 | Logo | Hint says "PNG, JPG or SVG" but any image type is accepted; logo errors show only as toasts | Inconsistent rule | Confirm accepted logo types | Open |
| OQ-CLI-015 | Client code | New codes are "CMP"/"PRT" + a sequence based on the number of clients, unlike the demo codes (for example "HIL001"); uniqueness rule not stated | Duplicate or confusing codes | Confirm the code format and how uniqueness is guaranteed | Open |
| OQ-CLI-016 | Table | Third click on a header clears the sort (SH-008 describes asc/desc only) | Consistency | Confirm intended sort cycle | Open |
| OQ-CLI-017 | Filters | Mobile filter accepts text without digits, showing a chip that filters nothing | Confusing | Restrict to digits or validate | Open |
| OQ-CLI-018 | Global search | Resolved 2026-11-02: clients are searchable (name, code, mobile, city, industry) and open their Client details page | — | — | Resolved |
| OQ-CLI-019 | Status | Meaning of "Inactive" is not enforced (see OQ-CLD-005 in [client-detail-prd.md](client-detail-prd.md)) | Misleading promise on the Status card | Define what inactive status blocks | Open |

### Client Details

Source: [client-detail-prd.md](modules/client-detail-prd.md), section 15. 14 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-CLD-001 | SPOCs | There is no way to remove or deactivate a SPOC | Ex-employees keep project access | Decide whether SPOCs can be removed or deactivated, with confirmation and activity logging | Open |
| OQ-CLD-002 | SPOCs | Designation and address lines are captured but never displayed | Data entered cannot be checked | Decide where designation and full address appear (list, drawer, matrix tooltip) | Open |
| OQ-CLD-003 | SPOC form | Department, Designation and Country/State/City use fixed lists, not the Settings masters | Lists can drift from master data | Confirm the source of these options | Open |
| OQ-CLD-004 | Projects / Participants | No create, edit or archive of projects or participants on this page | Training Partner users may expect to manage them here | Confirm where project and participant management lives | Open |
| OQ-CLD-005 | Settings | "Inactive clients … don’t appear in new schedules" is not enforced | Misleading promise | Define what inactive status blocks | Open |
| OQ-CLD-006 | Settings | Portal access, SPOC emails, session reminders and product access are stored but have no effect | Expectations of SPOCs/participants | Confirm downstream behaviour of each switch | Open |
| OQ-CLD-007 | Activity History | Adding or editing a SPOC is not logged; SPOC access entries are sample data | Audit trail incomplete | Decide which actions must be logged | Open |
| OQ-CLD-008 | Settings | Unsaved settings are lost on tab switch without warning | Data loss | Decide whether to warn (as SH-006 unsaved-changes guard) | Open |
| OQ-CLD-009 | Tax & Billing | A certificate ending today shows "Ends in 0 days" | Wording | Confirm wording (for example "Ends today") | Open |
| OQ-CLD-010 | SPOC form | No maximum length for SPOC name or email; no rule on mobile's first digit | Data quality | Define limits | Open |
| OQ-CLD-011 | SPOC form | Required errors show on leaving a field, unlike SH-004 | Inconsistent UX | Confirm whether to align with SH-004 | Open |
| OQ-CLD-012 | Invoices | Invoices section and Overview invoice figures are placeholders | Billing visibility | Define invoice list, columns and actions | Open |
| OQ-CLD-013 | SPOC modal | The modal can be closed while a save is running | User may think the save was cancelled | Confirm whether closing should be blocked while saving | Open |
| OQ-CLD-014 | Header | No status, CRM or other quick actions in the header | Faster everyday work for Training Partner users | Confirm whether header actions are wanted | Open |

### Manage Content

Source: [manage-content-prd.md](modules/manage-content-prd.md), section 15. 18 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-CNT-001 | Program modal | No maximum length or character rules for Program name | Data quality, display truncation | Define limits | Open |
| OQ-CNT-002 | Program logo | Hint says "PNG, JPG or SVG", but any image type (for example GIF, WebP) is accepted | Inconsistent rule | Confirm the allowed types | Open |
| OQ-CNT-003 | Executive overview | Overview accepts images (JPG, PNG) as well as PDF | An "executive overview" is usually a document | Confirm allowed types and the 5 MB limit | Open |
| OQ-CNT-004 | Fee | Maximum of ₹1,00,00,000, whole rupees only, "before tax" — limits and tax handling are not specified anywhere else | Pricing accuracy | Confirm the range, decimals and tax treatment | Open |
| OQ-CNT-005 | Programs | No way to delete, archive or deactivate a program | Retired programs stay in the catalogue | Decide the lifecycle (delete / inactive) and its rules | Open |
| OQ-CNT-006 | Program modal validation | Program name and Fees per person show "required" errors on blur, unlike SH-004 | Inconsistent validation timing | Confirm which behaviour is intended | Open |
| OQ-CNT-007 | Entity mapping | An entity with no active sub-entity cannot be used; deleting or deactivating an entity / sub-entity used by programs is not blocked and leaves "Removed entity" / "Removed sub-entity" | Broken billing mapping | Define in-use protection and what editing shows for inactive values | Open |
| OQ-CNT-008 | Stages | Each program has its own modules (BR-CNT-018), but there is no screen to add, rename, reorder or remove a program's modules; it will be managed from the Projects page | Training Partner users cannot change a program's modules yet | Define the module management on the Projects page (names, order, removing a module that holds content) | Open |
| OQ-CNT-009 | Element uploader | Video menu says "MP4, MOV or WebM" but any video is accepted; no limit on items per element, elements per stage or total size | Storage cost and consistency | Confirm types and count / total limits | Open |
| OQ-CNT-010 | Element form | No maximum length for element name, description, item names or links | Display and data quality | Define limits | Open |
| OQ-CNT-011 | Content Permissions | Where and how the levels are enforced for trainers and participants; whether "Download only" means no in-app viewing; confirm defaults (Trainers View & download, Participants View only) | Permissions currently have no effect | Define the consuming experience and rules | Open |
| OQ-CNT-012 | Leave guard | Browser Back is not intercepted; Discard in the save bar has no confirmation | Possible loss of changes | Confirm required coverage | Open |
| OQ-CNT-013 | Summary pill | "New this month" means the last 30 days, not the calendar month | Label may mislead | Confirm label or rule | Open |
| OQ-CNT-014 | History | Reordering within a stage is not recorded; category renames from the master are not recorded (OQ-PRG-003) | Audit completeness | Confirm what must be logged | Open |
| OQ-CNT-015 | Elements | Duplicate element names and the same file added twice are allowed | Confusing content | Decide uniqueness rules | Open |
| OQ-CNT-016 | Search | Maximum search length not defined | Minor | Confirm | Open |
| OQ-CNT-017 | Files | Uploaded files are held only for the browser session (SH-001); storage, retention and virus scanning are not defined | Production readiness | Define file storage requirements | Open |
| OQ-CNT-018 | Roles & Access | An "Export" action is listed for Manage Content, but the page has no export | Dead permission | Confirm whether export is needed | Open |

### Facilitators

Source: [facilitators-prd.md](modules/facilitators-prd.md), section 15. 20 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-FAC-001 | KYC link / emails | What the KYC, KYC resend, payment setup, renewal and send-back emails contain; link validity; how notes reach the facilitator | Facilitator experience and support load | Define email templates and link expiry | Open |
| OQ-FAC-002 | Payment setup approval | How the facilitator approves or rejects the payment setup on their side (outside this app), and how the user is notified of either answer | Nothing in this app approves or rejects; the user only sees the state change in the list | Define the facilitator-side approval/rejection flow and its notifications | Open |
| OQ-FAC-003 | Lifecycle | How and when Active becomes Agreement expired (automatic on end date?) | Status accuracy | Confirm automatic expiry rule and timezone | Open |
| OQ-FAC-004 | Send agreement renewal | What happens after renewal is sent; how the person returns to Active; no record of renewal is visible | Expired people may stay expired forever | Define renewal flow and show "renewal sent" in the list | Open |
| OQ-FAC-005 | Facilitators list | No delete, deactivate, or outright reject; Facilitator details opens for Active people only (not Agreement expired) | Data hygiene; offboarding | Confirm whether these are needed | Open |
| OQ-FAC-006 | Payment setup: feedback slabs | The slabs copy the old screen: the scale runs to 6.00, the range 5.00–5.10 is missing, and only 5.40–6.00 pays a bonus (10%) | A gap or wrong scale would misstate what the facilitator is paid | Confirm the rating scale (5 or 6), the missing 5.00–5.10 range, and what the bonus % is applied to | Open |
| OQ-FAC-007 | Verify KYC | Send-back notes and history are stored but not shown anywhere in the portal (e.g. on the KYC pending row) | Training Partner users can't see why someone was sent back | Show last send-back reason / history | Open |
| OQ-FAC-008 | Verify KYC | Mobile numbers always show "+91", even for facilitators outside India | Incorrect display | Use the country's dial code | Open |
| OQ-FAC-009 | Bulk confirmation / waiting line | Description says "1 facilitators" when one person is waiting; the Payment setup waiting line reads "need a payment setup or  waiting on it" | Wording | *Proposed: "1 facilitator will get…"* and *Proposed: "N need a payment setup or are waiting on one"* | Open |
| OQ-FAC-010 | Verify KYC leave guard | Cancel and the sidebar Support desk card leave without the "Leave without finishing?" check | Lost verdicts | Confirm whether all exits should be guarded | Open |
| OQ-FAC-011 | Add / Edit | Maximum lengths for name, email and address lines | Data quality | Define limits | Open |
| OQ-FAC-012 | Add / Edit | Editing the email of a KYC pending person does not resend the link | Link may go to the wrong address | Decide whether email change should resend | Open |
| OQ-FAC-013 | Validation timing | Required errors show on blur, unlike SH-004 | Consistency | Confirm intended timing | Open |
| OQ-FAC-014 | Roles | "approve" permission exists in Roles & Access but is not enforced on Verify KYC | Segregation of duties | Confirm enforcement | Open |
| OQ-FAC-015 | Verify KYC | Facilitator code format and the "profile note" from the KYC form (not displayed) | Completeness | Confirm code format and whether the note should show | Open |
| OQ-FAC-016 | Payment setup: sales agreements | Agreement type Sales or Both uses the same fee fields as a facilitator agreement; there are no commission fields | Channel partners may be paid on commission, not day fees | Confirm whether sales agreements need commission fields | Open |
| OQ-FAC-017 | Payment setup: approval outcome | What happens on approval: does the person become Active at once or from the contract start date; is the agreement end date the start date + validity − 1 day as shown; what if the start date is in the past or its financial year is not one of the three offered | Status and agreement dates in the list depend on it | Define the Active and agreement-date rules on approval and limits on the start date | Open |
| OQ-FAC-018 | Payment setup: editing while sent | Edit & resend replaces a setup that is still with the facilitator, with no withdrawal step or notice to them; every send and rejection is now kept in the revision log (BR-FAC-033) | The person may act on an outdated setup | Decide whether editing while sent is allowed and how the earlier version is withdrawn | Open |
| OQ-FAC-019 | Portfolio: participant feedback | "What participants say" shows sample comments; the "how I work" points and the About text are generated, not written by the facilitator | A client-facing page must not show invented quotes | Connect real session feedback (with consent) and decide whether facilitators can write their own bio and approach | Open |
| OQ-FAC-020 | Portfolio: sharing | The portfolio opens only for signed-in Training Partner users; it contains personal contact details | Clients can't open the link; privacy of contact details | Decide whether a public share link is needed, what it hides, and whether it expires | Open |

### Support Desk

Source: [support-desk-prd.md](modules/support-desk-prd.md), section 15. 17 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-SUP-001 | Ticket creation and requester replies | Tickets and requester replies come from outside this application; the channel, required fields, categories and attachment rules on the requester side are not defined here | The Training Partner view depends on them | Define the participant / facilitator ticket forms and how replies arrive | Open |
| OQ-SUP-002 | Reply / close / reopen | Whether the requester is notified (email, in-app) of a reply, close or reopen | Requesters may never see answers | Define notifications and their content | Open |
| OQ-SUP-003 | Lifecycle | No priority, assignee/owner, internal notes or response-time targets exist | Workload sharing and escalation | Confirm whether priorities, assignment and SLAs are required | Open |
| OQ-SUP-004 | Ticket number | Format "C/189/613613" is not explained (the letter appears to follow the category; the middle number is unknown) | Users quote it when following up | Define the number format | Open |
| OQ-SUP-005 | Attachments | File types are limited only by the picker filter; other types are accepted. Limits for requester attachments are unknown. | Security and consistency | Confirm allowed types and enforce them on pick | Open |
| OQ-SUP-006 | Reply message | No maximum length for a reply | Data quality | Define a limit | Open |
| OQ-SUP-007 | Reopen feedback | Reopen shows "Ticket reopened" from the row and board but no toast from details or chat | Inconsistent feedback | Show the same toast everywhere | Open |
| OQ-SUP-008 | Close ticket | Closing has no confirmation and silently hides an unsent reply | Accidental closes; lost replies | Confirm whether to ask first or warn about unsent text | Open |
| OQ-SUP-009 | Lifecycle | What happens when a requester writes on a Closed ticket (auto-reopen, new ticket, blocked) | Requests could be missed | Define the rule | Open |
| OQ-SUP-010 | Filter options | Option counts say "1 tickets" for a single ticket, and count all tickets rather than the current list | Wording / clarity | *Proposed: "1 ticket"* | Open |
| OQ-SUP-011 | Cross-module | Tickets are not linked to the facilitator, participant, client or program record | Training Partner users cannot see context or navigate | Confirm whether links are needed | Open |
| OQ-SUP-012 | Roles | Roles & Access stores view / edit / export for Support desk and a Support Executive role, but nothing is enforced and there is no export | Segregation of duties; missing export | Confirm enforcement and whether export is needed | Open |
| OQ-SUP-013 | Board | Drag and drop has no keyboard alternative on the board; the board has no pagination | Accessibility; scale with many tickets | Confirm keyboard support and paging/limits | Open |
| OQ-SUP-014 | Summary pills | Pill counts follow search and filters (Facilitators' counts do not); clicking a selected pill does not return to All | Consistency across list pages | Confirm intended behaviour | Open |
| OQ-SUP-015 | Loading and errors | No loading, saving or failure states; actions are instant | Real back end will need them (SH-007) | Define loading and failure behaviour | Open |
| OQ-SUP-016 | Data management | No delete, archive, merge or re-categorise; search excludes email, description and messages | Housekeeping; findability | Confirm whether needed | Open |
| OQ-SUP-017 | Times | Relative times ("2h") and date separators use the device's clock; no timezone rule | Teams across timezones | Confirm timezone handling (SH-012) | Open |

### Settings Hub

Source: [settings-hub-prd.md](modules/settings-hub-prd.md), section 15. 5 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-SET-001 | No-match empty state | The suggestion text names "fee", "trainer" and "assessment", but none of these words match any master today. | Users following the hint get another "No matches". | Update the suggested words or add matching synonyms/masters. | Open |
| OQ-SET-002 | Banks / Alert messages | Bank master, House bank master and Alert message templates are placeholders; their fields and rules are undefined. | Billing and automatic messages depend on them. | Provide requirements for these three masters. | Open |
| OQ-SET-003 | Pins and history | Pins and recent history are stored per browser, not per user account. | Training Partner users switching devices lose them; shared computers mix users. | Confirm whether they should follow the user account. | Open |
| OQ-SET-004 | Global search | Resolved 2026-11-02: masters are searchable (name, description, group and search keywords) and open the master | — | — | Resolved |
| OQ-SET-005 | Access control | Roles & Access permissions (including for "/settings") are not enforced (SH-002). | Any Training Partner user can change finance masters. | Confirm who may view/edit each master. | Open |

### Settings: Finance masters

Source: [settings-finance-masters-prd.md](modules/settings-finance-masters-prd.md), section 15. 15 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-FIN-001 | Entity – Parent entity | The group's top entity is stored as its own parent; the edit form cannot offer it, the drawer has no "Top-level" option, and the Parent column shows the entity itself | Hierarchy and top-level filtering are unclear | Decide whether a top entity has no parent or itself as parent | Open |
| OQ-FIN-002 | Entity | Entity name, PAN, CIN and GSTIN are not checked for duplicates | Two records for the same legal entity could be created | Confirm which fields must be unique | Open |
| OQ-FIN-003 | All forms and searches | Maximum lengths for entity name, address lines, LUT declaration, sub-entity name and search boxes are not defined | Very long values may break invoices and layouts | Define limits | Open |
| OQ-FIN-004 | Entity – LUT No. | No format check for the LUT number; no LUT validity period/financial year captured | LUT is renewed each year | Define format and whether expiry/FY should be stored | Open |
| OQ-FIN-005 | Entity – address | Country list comes from the client form (not the Country master); for non-India entities the phone is still "+91" 10 digits and PAN/GSTIN/LUT are still required | Foreign entities cannot be captured correctly | Define rules for non-Indian entities | Open |
| OQ-FIN-006 | Entity / Sub-entity delete | Deletion is not blocked by programs, facilitators or invoices that use the record; programs then show "Removed entity" / "Removed sub-entity" | Historical and financial records lose their billing entity | Decide whether to block delete, or allow only deactivation, when in use | Open |
| OQ-FIN-007 | Sub-entity edit / Expense head | A sub-entity's entity can be changed, but its expense heads keep the old entity | Entity and sub-entity on an expense head can disagree | Decide whether moving is allowed and how dependants follow | Open |
| OQ-FIN-008 | Expense head | The four expense head types are a fixed list with no master to maintain them; GL code has no format or uniqueness rule | New expense types cannot be added; wrong GL codes are not caught | Confirm ownership of the type list and GL code rules | Open |
| OQ-FIN-009 | SAP BP | Units are a fixed list not linked to the Entity master; trainers are not linked to Facilitators; no sync time or sync-failure behaviour | Data may drift from SAP and from the masters | Define the source, sync schedule and links | Open |
| OQ-FIN-010 | Inactive status | Inactive entities are still offered in the Sub-entity and Expense head forms, inactive sub-entities in the Expense head form; the effect of an inactive expense head is not defined | Inconsistent use of status | Define what Inactive means per master | Open |
| OQ-FIN-011 | Cross-module | Add client captures no entity; the Dashboard "Billing by entity" widget uses separate figures; client projects store sub-entity names; expense heads are used nowhere | The masters do not yet drive billing | Confirm which modules should read from these masters | Open |
| OQ-FIN-012 | Logo / signature upload | Hints say "PNG, JPG or SVG" / "PNG or JPG" but any image type is accepted; the signature size error reads "Logo must be under 2 MB." | Misleading guidance | Confirm accepted types and wording | Open |
| OQ-FIN-013 | All finance forms | "Required" errors appear when leaving a visited field, not only on save (differs from SH-004); backdrop click does not close modals (differs from SH-006) | Consistency across the app | Confirm the intended behaviour | Open |
| OQ-FIN-014 | Entity name | The entity name is not trimmed on save (sub-entity names are) | Leading/trailing spaces may be stored | Confirm trimming | Open |
| OQ-FIN-015 | Facilitators | Facilitators onboarded for an entity that becomes inactive show "—" for that entity | Loss of information on facilitator records | Decide how inactive entities display on existing records | Open |

### Settings: Location masters

Source: [settings-location-masters-prd.md](modules/settings-location-masters-prd.md), section 15. 7 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-LOC-001 | Add client, SPOC form, Entity, Facilitators | Every address form uses its own fixed 5-country list (and facilitators their own dialling codes) instead of these masters | Places added in the CRM never reach the forms; names differ ("United States" vs "United States of America") | Confirm that address forms should read Country → State → City (and mobile codes) from these masters | Open |
| OQ-LOC-002 | All three | Duplicate rule is not defined (country name; state name within a country; city name within a state) | Duplicates synced from the CRM would appear twice and confuse filters | Define uniqueness within the parent and how duplicates are handled on sync | Open |
| OQ-LOC-003 | Country, State | Behaviour when a country or state with children is removed or deactivated in the CRM is not defined; the lists have no active/inactive state | Orphan states/cities and addresses that point to removed places | Define the deactivate/delete rule and whether inactive places are shown | Open |
| OQ-LOC-004 | State – GST code | A non-Indian state (North Holland) carries a GST code "97", while the "No GST code" tooltip says "(outside India)" | GST code may be used for tax on invoices | Confirm GST codes apply only to Indian states | Open |
| OQ-LOC-005 | Country – codes | Country codes mix two- and three-letter forms ("IN", "TUR", "ITA") and use "UK"; no format is defined for country, mobile or GST codes | Codes may be used in integrations | Confirm the standard (for example ISO two-letter) and formats | Open |
| OQ-LOC-006 | All | Sync frequency, manual "Sync now", and behaviour when sync fails are not defined | Users cannot tell whether data is stale | Define the sync schedule and failure message | Open |
| OQ-LOC-007 | Search boxes | Maximum search length is not defined | Minor | Confirm or mark None defined | Open |

### Settings: Industry and job masters

Source: [settings-industry-job-masters-prd.md](modules/settings-industry-job-masters-prd.md), section 15. 6 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-PPL-001 | Client, SPOC, participant and profile forms | Forms use their own fixed department, designation and industry lists instead of these masters | Values added in the CRM never reach the forms; counts may not match | Confirm that the forms should read from these masters and whether only Approved + Enabled values are offered | Open |
| OQ-PPL-002 | Department / Designation | Should Pending and Rejected values be selectable anywhere? | Affects which values the forms offer | Define the rule per status | Open |
| OQ-PPL-003 | All | Sync frequency, manual "Sync now", and behaviour when sync fails are not defined | Users cannot tell whether data is stale | Define the sync schedule and failure message | Open |
| OQ-PPL-004 | Role | Where are CRM roles used in LearnNext? No page uses them today | Purpose of the master is unclear | Confirm usage | Open |
| OQ-PPL-005 | Industry type | Client counts use exact name matches; clients with "Other" or a name not in the master are not counted anywhere | Totals may not equal the number of clients | Decide how unmatched industries are handled | Open |
| OQ-PPL-006 | Search boxes | Maximum search length is not defined | Minor | Confirm or mark None defined | Open |

### Settings: Program and Content masters

Source: [settings-program-content-masters-prd.md](modules/settings-program-content-masters-prd.md), section 15. 6 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-PRG-001 | Modules | The Modules master is not connected to any program. Each program has its own modules (most use Pre / During / Post; some demo programs have more), to be managed from the Projects page later | How the master's modules relate to a program's own modules is undefined | Define, with the Projects page, how a program's modules are chosen and whether they must come from this master | Open |
| OQ-PRG-002 | Modules – delete | Should deleting a phase that holds program content be blocked, like categories? | Risk of losing the journey structure | Define the in-use rule | Open |
| OQ-PRG-003 | Category rename | Renaming does not add a "Category changed" entry to each program's history | Audit trail gap | Confirm whether bulk renames should be logged | Open |
| OQ-PRG-004 | Both | Maximum lengths (60 and 40) exist in the form only; are they the agreed limits? Allowed characters are not defined | Data quality | Confirm limits and character rules | Open |
| OQ-PRG-005 | Program Category | Should categories have an active/inactive state instead of only delete? | Retiring a category without moving programs | Decide | Open |
| OQ-PRG-006 | Search | Maximum search length is not defined | Minor | Confirm | Open |

### Settings: Menu and Role access

Source: [settings-access-masters-prd.md](modules/settings-access-masters-prd.md), section 15. 17 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-ACC-001 | Menu Mapping & Access | Menu changes are not applied to the sidebar, search "Jump to" list or routes (see OQ-SHELL-012) | The master has no effect; users may think they changed the menu | Confirm the master should drive the sidebar, and what happens to a menu whose address has no built page | Open |
| OQ-ACC-002 | Roles & Access | Permissions are saved but not enforced; no user is linked to a role (SH-002) | No access control exists | Define how users get roles, and how each action is enforced (hidden vs disabled, pages opened by address) | Open |
| OQ-ACC-003 | Roles & Access | Roles cannot be added, renamed, described or deleted, and people cannot be assigned; counts are fixed demo data | Role list cannot evolve | Confirm where roles and memberships are maintained | Open |
| OQ-ACC-004 | Menu – Page URL | Only spaces and duplicates are checked; trailing "/", allowed characters, external links and whether the page exists are not defined | Broken or duplicate links | Define the URL format rules | Open |
| OQ-ACC-005 | Menu fields | Limits of 40 (Menu name), 60 (Page name) and 120 (Page URL) exist in the form only | Data quality | Confirm the limits | Open |
| OQ-ACC-006 | Menu – Module | Only "Training Partner" exists; "Choose the module" can never appear | Purpose of the field unclear | Confirm which other portals will be added | Open |
| OQ-ACC-007 | Roles – actions per page | Available actions are fixed by page address; new menus always get View, Add, Edit, Delete, Export (never Approve); changing an address changes the actions | Training Partner users cannot configure actions per page | Decide whether actions should be set per menu in Menu Mapping | Open |
| OQ-ACC-008 | Roles & Access | Leaving the page (sidebar, breadcrumb, Back) with unsaved changes does not ask | Data loss | Confirm the page should use the shell's leave guard | Open |
| OQ-ACC-009 | Roles – column checkbox | The column checkbox changes hidden pages while a page search is active | Unexpected bulk changes | Confirm whether it should apply only to visible rows | Open |
| OQ-ACC-010 | Roles – new / changed menus | New menus start with no access for every editable role; a page that becomes a parent loses its own permissions from view | Training Partner users may forget to grant access | Confirm default access for new menus and handling when a page becomes a group | Open |
| OQ-ACC-011 | Menu – delete | Any menu without sub-menus can be deleted with no warning about roles that have access to it, including built pages such as Dashboard | Accidental removal | Define usage checks and warnings | Open |
| OQ-ACC-012 | Menu – nesting | Only one level of sub-menus is allowed | Future menu structures | Confirm one level is the rule | Open |
| OQ-ACC-013 | Both | Creator and creation date are recorded for menus but not shown; no history of permission changes | Audit trail | Define audit needs for menu and permission changes | Open |
| OQ-ACC-014 | Roles – grid | A parent with one sub-page reads "1 sub-pages" | Copy error | Confirm wording "1 sub-page" | Open |
| OQ-ACC-015 | Searches | Maximum lengths of the menu, module, parent, icon, role and page searches are not defined | Minor | Confirm | Open |
| OQ-ACC-016 | Menu modal | Edit Save is enabled by spaces-only changes (other masters ignore them); Enter-to-save is not defined | Consistency with other masters | Confirm both behaviours | Open |
| OQ-ACC-017 | Menu list | Default 50 rows per page with options 20/50/All, and no column sorting, differ from SH-008; a parent and its sub-menus can split across pages | Consistency | Confirm the paging rule for the tree | Open |

### System Pages

Source: [system-pages-prd.md](modules/system-pages-prd.md), section 15. 12 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-SYS-001 | Server error, Maintenance, Session expired | Nothing in the application opens these pages; the gallery says "API returns 500 / 503 / 401" | Real failures would show module error states or nothing, not these pages | Define which failures open each page (all requests or only page loads), and whether 401 always means session expiry | Open |
| OQ-SYS-002 | Server error, Maintenance | **Try again** and **Check again** reload the error page's own address, so they never return to the page that failed | Users cannot retry the original action | Confirm that retry should return to the failed page, and whether Maintenance should check status automatically | Open |
| OQ-SYS-003 | Server error | The reference is random and not linked to any real request or log | Support cannot trace the incident | Confirm the reference should come from the server | Open |
| OQ-SYS-004 | Maintenance | "Back in about 15 minutes" and the progress bar are fixed; no way back to the Dashboard except the logo | May mislead users during real maintenance | Define where the estimate comes from and whether a Dashboard button is needed | Open |
| OQ-SYS-005 | Offline | Detection relies on the device's connection status; **Try again** while offline shows the browser's own error; no automatic retry beyond waiting for the device | Some outages go undetected; retry leaves the application | Confirm detection approach and whether **Try again** should check the connection instead of reloading | Open |
| OQ-SYS-006 | Page crash, Server error | Crashes are only written to the browser console; "We’ve been notified" and "Your data is safe" are fixed statements | Promises not backed by reporting | Decide on error reporting and approve the wording | Open |
| OQ-SYS-007 | Page crash | No feedback when copying fails | Users may think details were copied | *Proposed: "Couldn’t copy — select the text instead"* as an error toast | Open |
| OQ-SYS-008 | Session expired | The page claims the user was signed out but the session stays active until **Sign in again**; the logo still opens the Dashboard; after signing in the user lands on the Dashboard, not the previous page | Inconsistent security message and lost context | Confirm the session should end when the page opens and whether to return the user to their previous page | Open |
| OQ-SYS-009 | Gallery | The gallery and previews are shown to every Training Partner in every build (see OQ-SHELL-010); the back-online state has no card of its own | Development tools visible to business users | Confirm hiding in production and whether more states (for example back online) need cards | Open |
| OQ-SYS-010 | All system pages | Always dark regardless of the chosen theme; footer differs from the portal footer | Consistency with SH-010 | Confirm the dark-only design is intended | Open |
| OQ-SYS-011 | Not found, Page crash, Server error (Super Admin) | For a Super Admin the button still reads **Back to dashboard** and Not found still lists Dashboard, All Clients and Projects, although all of them open Manage Clients | Labels promise pages the role does not have | Confirm per-role wording and destinations (e.g. "Back to Manage Clients") | Open |
| OQ-SYS-012 | Preview mode | Previews no longer carry any "Preview mode" marker or way back to the gallery; the page looks exactly like a real error and its actions (reload, email support, go to Dashboard) are real | Testers may mistake a preview for a real failure, and the Session expired / Offline previews behave differently from real use without saying so | Confirm that no marker is wanted, or define a subtle one | Open |

### Super Admin

Source: [super-admin-prd.md](modules/super-admin-prd.md), section 15. 16 questions.

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-SA-001 | Settings & Configuration: CRM fetching | The switch is stored only; the Training Partner's Add client offers the CRM look-up regardless | The setting promises a behaviour that does not happen | Confirm that "off" should remove the CRM look-up (manual entry only) from that partner's Add client, and what "on" requires (CRM connection details) | Open |
| OQ-SA-002 | Settings: status, portal access, email updates | "Inactive clients … can’t sign in", "Training Partner portal access" and "Email updates to the contact person" have no effect | Security and communication expectations are not met | Define the effect of each on the partner team's sign-in, its sub clients and email sending | Open |
| OQ-SA-003 | Sub clients | How a Training Partner client is linked to its training partner is not defined; the demo shares clients out in turn | Counts and sub-client lists depend on it | Define the ownership rule (one partner per client, set when the partner's user adds it?) | Open |
| OQ-SA-004 | Add / Edit client validation timing | "Required" errors appear when an empty field is left, not only after Continue / Save (differs from SH-004) | Inconsistent form behaviour | Confirm which timing is intended (see OQ-GEN-005) | Open |
| OQ-SA-005 | Manage Clients | No delete, archive, export, bulk actions or Filters drawer | Partners can only be made inactive; reporting is manual | Decide whether deletion / export / more filters are needed | Open |
| OQ-SA-006 | Duplicate rules | Only the company name is checked, and only against other training partners. Email, mobile and GSTIN may repeat | Duplicate partners can slip in | Define the uniqueness keys | Open |
| OQ-SA-007 | Overview | The office address is captured but not shown anywhere on Client details | Data entered is invisible | Decide whether Overview should show the office address | Open |
| OQ-SA-008 | Settings tab | Unsaved settings are lost on switching tabs or leaving, without warning | Silent data loss | Decide whether the leave guard should cover the Settings tab | Open |
| OQ-SA-009 | Status and edit logging | Status can be changed in Edit client and in Settings; Save changes is always enabled and logs "Updated details of" even without changes | Duplicate controls and noisy audit trail | Confirm one place for status and whether no-change saves should be blocked / not logged | Open |
| OQ-SA-010 | Field limits | Maximum lengths for company name, contact name, email, website, address lines and the Lower TDS amount, and date bounds, are not defined | Data quality | Define limits | Open |
| OQ-SA-011 | Sub clients | Sub clients are view only and cannot be opened | Super Admin cannot see a sub client's details | Decide whether a sub client should open a read-only details view | Open |
| OQ-SA-012 | Add client form | The Super Admin form has no Special Economic Zone question, presets Industry to "Education & Training", and uses fixed type / industry / location lists | Billing and tax data may be incomplete; lists may differ from the Settings masters | Confirm the fields needed for invoicing training partners and the source of the lists | Open |
| OQ-SA-013 | Client code | The next TPR code is the highest existing + 1, shown before saving; behaviour beyond TPR999 and with simultaneous adds is undefined | Code collisions | Define the code scheme and when it is assigned | Open |
| OQ-SA-014 | Phone layout | Status pills stay visible on phones here, unlike SH-013 | Inconsistency with other lists | Confirm this exception (no filter drawer) is intended | Open |
| OQ-SA-015 | My Profile | The profile shows the account's role text ("Training Partner" for the demo login) while in the Super Admin portal | Confusing identity | Decide whether the profile should show the chosen portal role | Open |
| OQ-SA-016 | Terminology and contact person | Screens call training partners "clients" ("Add client", "Client details"); the contact person's relationship to the partner's portal logins is undefined | Users may confuse partners with sub clients; account set-up unclear | Confirm the wording and whether the contact person becomes the partner's first portal user | Open |

