# Settings – Industry & Job Masters: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Settings – Industry & Job Masters PRD |
| Module name | Settings – Industry & Job Masters (Department, Designation, Role, Industry type) |
| Document ID | PRD-PPL |
| Version | 1.1 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (the four lists are built and read-only; the values they hold are not yet used by the client, SPOC and participant forms) |
| Last updated | 2026-11-03 (v1.1: phone layout) |
| Phone layout (v1.1) | The CRM sync note becomes one short line on phones: "Read-only · synced from CRM · <date>". See SH-013. |
| Related modules/pages | [settings-hub-prd.md](settings-hub-prd.md), [clients-prd.md](clients-prd.md), [client-detail-prd.md](client-detail-prd.md), [facilitators-prd.md](facilitators-prd.md), [profile-prd.md](profile-prd.md), [settings-access-masters-prd.md](settings-access-masters-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

The Industry & job group in Settings holds the reference lists that describe clients and the people in them: **Department**, **Designation**, **Role** and **Industry type**. These lists are owned by the company's CRM portal. LearnNext Admin shows them so that Admin users can see what values exist, their approval state in the CRM, and how they relate to each other. Nothing can be added, edited or deleted here.

Objectives:

- Give Admin users a single place to look up departments, designations, roles and industry types.
- Show each value's CRM approval state (departments and designations) or enabled state (designations and roles).
- Show how values are used: designations per department, clients per industry type.
- Make it clear that the data comes from the CRM and is read-only, and when it was last synced.

## 3. Module and Page Overview

All four pages open from **Settings › Industry & job** (see [settings-hub-prd.md](settings-hub-prd.md)). The header breadcrumb reads "Settings › \<master name>" (SH-009).

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Department | Lists departments synced from the CRM, with parent department and CRM approval status | Admin user | Filter by status pill, search, open Filters (status, level, parent), sort, paginate | Designation, Settings hub |
| Designation | Lists job titles synced from the CRM, with department, parent designation, enabled state and approval status | Admin user | Filter by status pill, search, open Filters (status, department, enabled), sort, paginate | Department, Settings hub |
| Role | Lists roles people play in programs, synced from the CRM, with description and enabled state | Admin user | Filter by Enabled / Disabled pill, search, sort, paginate | Settings hub |
| Industry type | Lists industries synced from the CRM, with the number of clients in each | Admin user | Filter by In use / Not in use pill, search, sort, paginate | All Clients, Settings hub |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Admin user (any signed-in staff member) | All four pages (SH-002, SH-003) | View, search, filter, sort and paginate | Cannot add, edit or delete any value; changes are made in the CRM portal. Role-based limits defined in Roles & Access are not enforced (SH-002). |
| Signed-out visitor | None | None | Redirected to Sign in (SH-003). |

## 5. Page Functionality and Behavior

### 5.1 Shared frame (all four pages)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| List card | Holds the toolbar, the sync note and the list | Open the page | One card fills the page height on large screens, following the All Clients list pattern (SH-008) | — | Consistent list layout |
| Summary pills | Count and filter | Click a pill | The list is limited to that group; the active pill is highlighted | Counts are of all records, not of the filtered list | List filtered |
| Search box | Find a value by text | Type | Rows filter as the user types (short delay of about 0.15 s). Matching ignores case and surrounding spaces | Fields searched differ per page (section 10) | Matching rows only |
| Result line | Explain the current filter | Search or filter | Shows "**N** of **Total** \<noun>" with chips for applied drawer filters and a **Clear all** link (SH-008) | Shown only when a pill other than "All", a search, or a drawer filter is active | Clear view of what is shown |
| CRM sync note | Explain the data source | — | A strip under the toolbar reads "**Synced from the CRM portal.** Read-only here — \<noun> are added and edited in the CRM." and, at the right, "Last synced \<relative time>" | Relative time follows SH-012 | User knows why there is no Add/Edit |
| No Add, Edit or Delete | The data belongs to the CRM | — | There is no Add button, no row actions and rows do not open anything | — | Read-only list |
| Table / cards | Show records | Scroll, sort, page | Table from tablet width upward with a header that stays pinned while scrolling on large screens; cards on phones (SH-008) | Default sort: name ascending. 10 rows per page; choices 10, 20, 50 rows or "All rows" | — |
| Loading | Show progress | Open the page | Skeleton rows and pill placeholders (SH-007) | — | — |
| Load failure | Recover | Click **Try again** | Table: "Couldn’t load data" with the error text; phone cards: "Couldn’t load the list" with the error text | Failures do not normally occur with demo data (SH-001) | List reloads |

### 5.2 Department

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by CRM approval state | Click | Pills: "All departments", "Approved", "Pending", "Rejected", each with its count. Tooltips: "Show all departments", "Show approved departments", "Show departments awaiting approval in the CRM", "Show rejected departments" | Pill and the drawer's Status control set the same filter | Filtered list |
| Department column | Identify the department | — | Building icon, department name, and below it "N designation" / "N designations" | Count = designations in the Designation master whose department has exactly this name | — |
| Parent department column | Show hierarchy | — | Parent name with a hierarchy icon, or "—" for a top-level department | Hidden below tablet width | — |
| Status column | Show CRM approval | — | Status dot + word: Approved, Pending or Rejected (status badge pattern) | — | — |
| Phone card | Phone layout | — | Title = name; subtitle = designation count; status badge; footer "Under \<parent>" or "Top level" | — | — |
| Filters button | Open the filter drawer | Click **Filters** | Opens "Filter departments" (section 5.6) | The button shows the number of applied level/parent filters (status is not counted) | — |

### 5.3 Designation

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by CRM approval state | Click | "All designations", "Approved", "Pending", "Rejected" with counts. Tooltips: "Show all designations", "Show approved designations", "Show designations awaiting approval in the CRM", "Show rejected designations" | Same filter as the drawer's Status control | Filtered list |
| Designation column | Identify the title | — | ID-card icon, designation name; below large width the department is shown under the name | — | — |
| Department column | Owning department | — | Department name with icon, or "—" | Shown from large width | — |
| Parent designation column | Reporting line | — | Parent designation with icon, or "—" | Shown from tablet width | — |
| Enabled column | Whether the value is active in the CRM | — | "Yes" (green dot) or "No" (grey dot) | Shown from extra-large width; sortable | — |
| Status column | CRM approval | — | Approved / Pending / Rejected | — | — |
| Phone card | Phone layout | — | Title = name; subtitle = department; status badge plus a "Disabled" badge when not enabled; footer "Reports to \<parent>" or "No parent designation" | — | — |
| Filters button | Open the filter drawer | Click | Opens "Filter designations" (section 5.6) | Count = applied enabled + department filters | — |

### 5.4 Role

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by enabled state | Click | "All roles", "Enabled", "Disabled" with counts. Tooltips: "Show all roles", "Show enabled roles", "Show disabled roles" | — | Filtered list |
| Role name column | Identify the role | — | User-gear icon and role name; below tablet width the description is shown under the name | — | — |
| Description column | Explain the role | — | Description on one line, full text on hover | Shown from tablet width; not sortable | — |
| Enabled column | Active in the CRM | — | "Yes" / "No" | Sortable | — |
| No Filters button | — | — | There is nothing else to filter by, so the page has no Filters drawer | — | — |
| Phone card | Phone layout | — | Title = role; Yes/No badge; footer = description | — | — |

These CRM roles (for example "HR Manager", "Trainer", "Participant") describe what people do in programs. They are **not** the admin roles managed in Roles & Access ([settings-access-masters-prd.md](settings-access-masters-prd.md)).

### 5.5 Industry type

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by usage | Click | "All industry types", "In use", "Not in use" with counts. Tooltips: "Show all industry types", "Industry types that have clients", "Industry types with no clients yet" | In use = at least one client has exactly this industry | Filtered list |
| Industry type name column | Identify the industry | — | Factory icon and name | — | — |
| Clients column | Show usage | — | "N client" / "N clients" with a people icon, or "No clients yet" in muted text | Counts clients in the current session's client list (SH-001), so a client added or edited in this tab changes the count after the page is reopened | — |
| No Filters button | — | — | No Filters drawer | — | — |
| Phone card | Phone layout | — | Title = name; footer = clients label | — | — |

### 5.6 Filter drawers (Department and Designation)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Combine filters | Open via **Filters** | Title "Filter departments" / "Filter designations"; description "By status, level or parent" / "By status, department or enabled". Opens with the currently applied filters | Changes are a draft until applied | — |
| Section clear | Clear one section | Click the section's clear control | Resets that section only | Shown only when the section has a non-default value | — |
| Reset | Clear all drafts | Click **Reset** | All drawer controls return to defaults | Does not apply until the apply button is clicked | — |
| Apply button | Apply the draft | Click | Label shows the live count: "Show N departments" / "Show 1 department" (or designation(s)); the drawer closes and filters apply | When the draft matches nothing, the button reads "No matching departments" / "No matching designations" and is disabled | Filtered list |
| Closing without applying | Abandon | ×, Esc or backdrop (SH-006) | Draft discarded | — | Filters unchanged |

## 6. User Workflow

### 6.1 Look up a department and its designations

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Settings › Industry & job › Department | Page loads with skeletons, then the list sorted A–Z | Signed in | All departments listed |
| 2 | Type part of a name in "Search department…" | Rows filter by department or parent name | Case-insensitive | Matching departments |
| 3 | Read the designation count under the name | — | — | User knows how many designations sit in it |
| 4 | Open Settings › Designation, open **Filters**, pick the department, click "Show N designations" | List limited to that department | Count > 0 | Designations of that department shown |

### 6.2 Find departments awaiting CRM approval

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the **Pending** pill | List shows pending departments; result line "N of Total departments" | — | Pending list |
| 2 | Click **Clear all** | Pill returns to All, search cleared | — | Full list |

### 6.3 Check which industries have clients

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Industry type | List with client counts | — | — |
| 2 | Click **Not in use** | Industries with no clients | — | Candidates for clean-up in the CRM |

## 7. Forms and Field-Level Specifications

The masters have no data-entry forms. The only inputs are search boxes and filters.

### 7.1 Department – search and filters

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search department… | Search text | Filter by department or parent name | Optional | N/A | Requires Confirmation | Any text; case-insensitive "contains" | Empty | None | Narrows to an icon in medium layouts (SH-008) | N/A |
| Summary pill | Single-select pills | Filter by status | Optional | N/A | N/A | All departments, Approved, Pending, Rejected | All departments | None | Same value as drawer Status | N/A |
| Status (drawer) | Segmented control | Filter by status | Optional | N/A | N/A | All, Approved, Pending, Rejected (each with count) | Current pill value | None | — | N/A |
| Parent department – level (drawer) | Segmented control | Top-level vs child | Optional | N/A | N/A | All, Top level, Has a parent | All | None | Choosing "Top level" clears selected parents and hides the parent picker | N/A |
| Parent department – parents (drawer) | Searchable multi-select | Departments under chosen parents | Optional | N/A | N/A | Distinct parent names, each described "N under it"; search box "Search departments…" | None ("Under any parent") | None | Hidden when level = Top level | N/A |

### 7.2 Designation – search and filters

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search designation or department… | Search text | Filter | Optional | N/A | Requires Confirmation | Matches designation, department or parent designation | Empty | None | — | N/A |
| Summary pill | Single-select pills | Filter by status | Optional | N/A | N/A | All designations, Approved, Pending, Rejected | All designations | None | Same as drawer Status | N/A |
| Status (drawer) | Segmented control | Filter by status | Optional | N/A | N/A | All, Approved, Pending, Rejected | Current pill | None | — | N/A |
| Department (drawer) | Searchable multi-select | Filter by department | Optional | N/A | N/A | Distinct departments A–Z, each "N designations"; search "Search departments…" | None ("Any department") | None | — | N/A |
| Enabled (drawer) | Segmented control | Filter by enabled | Optional | N/A | N/A | All, Yes, No (with counts) | All | None | Chip reads "Enabled" or "Disabled" | N/A |

### 7.3 Role – search and pills

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search role or description… | Search text | Filter | Optional | N/A | Requires Confirmation | Matches role name or description | Empty | None | — | N/A |
| Summary pill | Single-select pills | Filter by enabled | Optional | N/A | N/A | All roles, Enabled, Disabled | All roles | None | — | N/A |

### 7.4 Industry type – search and pills

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search industry type… | Search text | Filter | Optional | N/A | Requires Confirmation | Matches industry name | Empty | None | — | N/A |
| Summary pill | Single-select pills | Filter by usage | Optional | N/A | N/A | All industry types, In use, Not in use | All industry types | None | — | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-PPL-001 | CRM-owned data | Departments, designations, roles and industry types are created and edited only in the CRM portal | Always | No add, edit or delete controls; rows do not open | User looks for an Add button | CRM sync note: "Synced from the CRM portal. Read-only here — … are added and edited in the CRM." |
| BR-PPL-002 | Last synced time | The page shows when the list was last synced | When the sync time is known | "Last synced \<relative time>" | No sync time | The "Last synced" text is hidden |
| BR-PPL-003 | Approval state | Departments and designations carry the CRM approval state Approved, Pending or Rejected | Always | Shown as a status dot + word | — | — |
| BR-PPL-004 | Designations per department | A department's count is the number of designations whose department name matches exactly | Department list | "N designation(s)" under the name | Name spelt differently in the two lists | Count is 0 |
| BR-PPL-005 | Clients per industry | An industry's count is the number of clients whose industry matches the name exactly | Industry type list | "N client(s)" or "No clients yet"; drives In use / Not in use | — | — |
| BR-PPL-006 | Top-level departments | A department without a parent is top level | Department list and filters | "—" in the Parent column; "Top level" on phone cards | — | — |
| BR-PPL-007 | Filter draft | Drawer changes apply only when the apply button is clicked | Department and Designation drawers | Live count on the apply button | Draft matches nothing | Button disabled: "No matching departments" / "No matching designations" |
| BR-PPL-008 | Values used elsewhere [Partially Implemented] | These masters should supply the choices in client, SPOC and participant forms | Add client, SPOC form, Participants | Current build: the forms use their own fixed lists (section 12); only facilitator industries come from the Industry type master | Value added in the CRM | Does not appear in client/SPOC forms |
| BR-PPL-009 | Session data | Data follows SH-001 | Always | — | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Viewing any of the four lists | Always | Inline note | "Synced from the CRM portal. Read-only here — \<noun> are added and edited in the CRM." + "Last synced \<time>" | Under the toolbar | Make changes in the CRM |
| Search/filter active | At least one filter | Result line | "N of Total \<noun>" with chips and **Clear all** | Above the list | Remove chips or clear |
| No toasts | — | — | The pages perform no saves, so no toasts are shown | — | — |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Department search | Find | Contains, case-insensitive | Department name, parent department | "No departments match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| Designation search | Find | Contains | Designation, department, parent designation | "No designations match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| Role search | Find | Contains | Role name, description | "No roles match" / "Try a different search." + **Clear search & filters** |
| Industry search | Find | Contains | Industry name | "No industry types match" / "Try a different search." + **Clear search & filters** |
| Department columns | — | Department, Parent department, Status — all sortable | Default: Department A–Z | Empty master: "No departments yet" / "Departments appear here once they're synced from the CRM portal." |
| Designation columns | — | Designation, Department, Parent designation, Enabled, Status — all sortable | Default: Designation A–Z | "No designations yet" / "Designations appear here once they're synced from the CRM portal." |
| Role columns | — | Role name (sortable), Description, Enabled (sortable) | Default: Role name A–Z | "No roles yet" / "Roles appear here once they're synced from the CRM portal." |
| Industry columns | — | Industry type name, Clients — both sortable | Default: name A–Z | "No industry types yet" / "Industry types appear here once they're synced from the CRM portal." |
| Pagination | — | SH-008 | 10 / 20 / 50 rows / All rows; default 10 | — |
| Filter chips (Department) | Show applied drawer filters | Removable | "Top level", "Has a parent", "Under \<parent>" | — |
| Filter chips (Designation) | Show applied drawer filters | Removable | "Enabled", "Disabled", \<department name> | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| Master empty | CRM has synced nothing | Empty state, no action | e.g. "No departments yet" / "Departments appear here once they're synced from the CRM portal." | Sync from the CRM |
| No matches | Search/filter excludes all rows | Empty state with button | e.g. "No departments match" … **Clear search & filters** | Click the button |
| Load failure | Data cannot be loaded | Error state | "Couldn’t load data" (table) / "Couldn’t load the list" (phone) + error text + **Try again** | Retry |
| Drawer draft matches nothing | Combination excludes all | Apply disabled | "No matching departments" / "No matching designations" | Change the draft or Reset |
| Department name mismatch | Designation's department is not spelled like any department | Department shows "0 designations" | — | Correct in the CRM |
| Parent not in list | A designation's parent is not a designation (for example a department name) | Shown as text as-is | — | Correct in the CRM |
| Long text | Long names/descriptions | Truncated on one line; description shows full text on hover | — | — |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Settings hub ([settings-hub-prd.md](settings-hub-prd.md)) | Entry point; group "Industry & job" — "How clients and participants are described." Items: Department ("Teams a participant belongs to"), Designation ("Job titles and levels"), Role ("Roles people play in programs"), Industry type ("Industries clients operate in") | Open a master | Page opens and is added to "Recently opened" | — |
| All Clients / Add client ([clients-prd.md](clients-prd.md)) | Industry type counts clients by their industry | Client created or edited | Count changes when the Industry type page is next opened | BR-PPL-005 |
| Add client – Industry and Designation fields ([clients-prd.md](clients-prd.md)) [Partially Implemented] | Should use these masters | Choosing an industry or designation | Current build uses a separate fixed list (14 industries including "Other"; 12 designations such as "Intern" … "CXO"), not these masters | BR-PPL-008, OQ-PPL-001 |
| Client detail – SPOC form and Participants tab ([client-detail-prd.md](client-detail-prd.md)) [Partially Implemented] | Department and Designation choices | Adding a SPOC / viewing participants | Current build uses separate fixed department and designation lists, not these masters | BR-PPL-008, OQ-PPL-001 |
| Facilitators ([facilitators-prd.md](facilitators-prd.md)) | Facilitator industry experience uses Industry type names | Viewing a facilitator profile | Industries shown on facilitators come from this master | — |
| My Profile ([profile-prd.md](profile-prd.md)) | The profile "Department" choice uses a separate internal list, not this master | — | No link | OQ-PPL-001 |
| Roles & Access ([settings-access-masters-prd.md](settings-access-masters-prd.md)) | Different concept: admin roles vs CRM roles | — | None | — |

## 13. Acceptance Criteria

**AC-PPL-001: Read-only masters**
- Given an Admin user opens Department, Designation, Role or Industry type
- When the page loads
- Then there is no Add button, no edit/delete row actions and rows do not open anything
- And the note "Synced from the CRM portal. Read-only here — \<noun> are added and edited in the CRM." is shown with "Last synced \<relative time>"

**AC-PPL-002: Status pills filter the list**
- Given the Department page is loaded
- When the user clicks **Pending**
- Then only pending departments are listed and the result line reads "N of 16 departments" (demo data)
- And clicking **Clear all** shows all departments again

**AC-PPL-003: Department filter drawer**
- Given the Department filter drawer is open
- When the user selects level "Top level"
- Then the parent picker is hidden and any selected parents are cleared
- And the apply button reads "Show N departments" with the live count

**AC-PPL-004: Draft that matches nothing (negative)**
- Given the Designation drawer is open
- When the user chooses a combination that no designation satisfies (for example Status Rejected + Enabled No)
- Then the apply button reads "No matching designations" and is disabled

**AC-PPL-005: Search with no results (negative)**
- Given any of the four pages
- When the user searches for text that matches nothing
- Then the empty state "No … match" appears with **Clear search & filters**
- And clicking it restores the full list

**AC-PPL-006: Usage counts**
- Given the Industry type page
- When it loads
- Then each industry shows its number of clients or "No clients yet"
- And **In use** + **Not in use** counts add up to **All industry types**

**AC-PPL-007: Designation count per department**
- Given the Department page
- When it loads
- Then each department shows the number of designations whose department matches its name (for example "Sales" shows "5 designations")

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-PPL-001 | AC-PPL-001 | No edit controls on any of the four masters | Signed in | — | No Add, no row actions, row click does nothing | P1 |
| TC-PPL-002 | AC-PPL-002 | Department pill counts | Fresh reload | Demo data | All 16, Approved 13, Pending 2, Rejected 1 | P2 |
| TC-PPL-003 | AC-PPL-002 | Designation pill counts | Fresh reload | Demo data | All 15, Approved 12, Pending 2, Rejected 1 | P2 |
| TC-PPL-004 | 5.4 | Role pill counts | Fresh reload | Demo data | All 11, Enabled 10, Disabled 1 ("Guest Reviewer") | P2 |
| TC-PPL-005 | AC-PPL-003 | Top level hides parent picker | Department drawer open | Select parent "Operations", then level "Top level" | Picker hidden, parent cleared, count = 11 | P2 |
| TC-PPL-006 | AC-PPL-003 | Parent filter | Department drawer | Parent "Operations" | "Show 2 departments" (Operations Support, Digital Transformation); chip "Under Operations" | P2 |
| TC-PPL-007 | AC-PPL-004 | Empty draft disables apply | Designation drawer | Status Rejected + Enabled No | "No matching designations", disabled | P2 |
| TC-PPL-008 | 7.2 | Designation search matches department | — | Search "sales" | 5 Sales designations (plus any whose parent contains "sales") | P2 |
| TC-PPL-009 | AC-PPL-005 | Search no results | — | Search "zzzz" | "No departments match" + Clear search & filters | P2 |
| TC-PPL-010 | AC-PPL-007 | Designation count | — | Department "HR" | "3 designations"; "Human Resources" shows "0 designations" | P3 |
| TC-PPL-011 | AC-PPL-006 | Industry counts update | Add a client with industry "Banking" in the same tab | Reopen Industry type | Banking count increased by 1 | P2 |
| TC-PPL-012 | 5.1 | Pagination | Designation list | Choose "All rows" | All 15 on one page, page buttons hidden | P3 |
| TC-PPL-013 | 5.1 | Phone cards | 375 px width | Department | Cards with "Under X" / "Top level" footer | P3 |
| TC-PPL-014 | 5.3 | Responsive columns | Widths 768 / 1024 / 1280 | Designation | Parent from tablet, Department from large, Enabled from extra-large | P3 |
| TC-PPL-015 | BR-PPL-008 | Client form not linked (gap) | — | Open Add client industry list | List contains "Other" and not "NGOs" (differs from master) | P2 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-PPL-001 | Client, SPOC, participant and profile forms | Forms use their own fixed department, designation and industry lists instead of these masters | Values added in the CRM never reach the forms; counts may not match | Confirm that the forms should read from these masters and whether only Approved + Enabled values are offered | Open |
| OQ-PPL-002 | Department / Designation | Should Pending and Rejected values be selectable anywhere? | Affects which values the forms offer | Define the rule per status | Open |
| OQ-PPL-003 | All | Sync frequency, manual "Sync now", and behaviour when sync fails are not defined | Users cannot tell whether data is stale | Define the sync schedule and failure message | Open |
| OQ-PPL-004 | Role | Where are CRM roles used in LearnNext? No page uses them today | Purpose of the master is unclear | Confirm usage | Open |
| OQ-PPL-005 | Industry type | Client counts use exact name matches; clients with "Other" or a name not in the master are not counted anywhere | Totals may not equal the number of clients | Decide how unmatched industries are handled | Open |
| OQ-PPL-006 | Search boxes | Maximum search length is not defined | Minor | Confirm or mark None defined | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and key actions: Complete
- [x] User roles and access: Complete (no role enforcement, SH-002)
- [x] Fields (search and filters): Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (search length not defined, see OQ-PPL-006)
- [x] Validation and business rules: Complete
- [x] Success, error and empty messages: Complete
- [x] Search, filters, tables and listings: Complete
- [ ] Cross-module data links: Incomplete (forms do not use these masters, see OQ-PPL-001)
- [ ] Data sync behaviour: Incomplete (see OQ-PPL-003)
- [x] Acceptance criteria and QA scenarios: Complete
- [x] Add/edit/delete forms: Not applicable (read-only CRM masters)
