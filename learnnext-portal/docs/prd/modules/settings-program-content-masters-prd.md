# Settings – Program & Content Masters: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Settings – Program & Content Masters PRD |
| Module name | Settings – Program & Content Masters (Program Category, Modules) |
| Document ID | PRD-PRG |
| Version | 1.1 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (Program Category is fully linked to Manage Content; the Modules master is built but not yet used by any other page — a program's own modules are managed separately, from the Projects page later) |
| Last updated | 2026-11-05 (v1.1: naming: LearnNext Portal; "Training Partner" replaces "Admin") |
| Related modules/pages | [settings-hub-prd.md](settings-hub-prd.md), [manage-content-prd.md](manage-content-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

The **Program & Content** group in Settings ("How programs are grouped and phased.") holds two masters:

- **Program Category**: the categories programs are filed under. Every program in Manage Content belongs to one category.
- **Modules**: the phases of the program journey (Pre, During and Post).

Objectives:

- Let Training Partner users add, rename and delete program categories, while protecting programs from losing their category.
- Show how many programs use each category, and which ones.
- Let Training Partner users maintain the list of journey phases and switch each one on or off.

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Program Category list (Settings › Program Category) | Maintain the categories programs are grouped in | Training Partner user | Filter by usage pill, search, sort, paginate, see program names, add, edit, delete | Manage Content |
| Add / Edit program category modal | Enter or rename a category | Training Partner user | Type a name, save, cancel | Program Category list |
| Delete category dialogs | Confirm deletion, or explain why it is blocked | Training Partner user | Delete, cancel, go to Manage Content | Manage Content |
| Modules list (Settings › Modules) | Maintain the program phases | Training Partner user | Filter by enabled pill, search, sort, paginate, add, edit, delete | — |
| Add / Edit module modal | Enter a module name and its enable status | Training Partner user | Type a name, switch Enable status, save, cancel | Modules list |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Training Partner user | Both pages (SH-002) | All actions listed in section 3 | A category used by programs cannot be deleted. Role permissions from Roles & Access are not enforced (SH-002). |
| Signed-out visitor | None | None | Redirected to Sign in (SH-003) |

## 5. Page Functionality and Behavior

### 5.1 Program Category list

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Count and filter by usage | Click | "All categories", "In use", "Not in use" with counts. Tooltips: "Show all categories", "Categories that have programs", "Categories with no programs yet" | In use = at least one program has this category | Filtered list |
| Search | Find a category | Type in "Search category…" | Filters by category name, case-insensitive (SH-008) | — | Matching rows |
| **Add category** button | Create a category | Click | Opens the Add program category modal (section 7.1) | At the right end of the toolbar | Modal opens |
| Category name column | Identify | — | Folder-tree icon and name; below tablet width the program count is shown under the name | Sortable | — |
| Programs column | Show usage | Click the count | When the category has programs, the count ("1 program" / "N programs") is a button. Clicking it opens a small panel titled "Programs in \<category>" listing program names A–Z (scrolls if long). It does not open the edit modal | When no program uses it: "Not used yet" in muted text (not clickable). Sortable by count | User sees which programs use it |
| Created by column | Audit | — | Avatar initials and name | Sortable; new categories show the signed-in user's name | — |
| Created on column | Audit | Hover | Date (SH-012); relative time on hover | Sortable | — |
| Row actions | Edit / delete | Click pencil or bin | Pencil opens the Edit modal; bin opens a delete dialog (section 5.3). Tooltips/labels "Edit \<name>", "Delete \<name>" | Plain ghost icons | — |
| Row click | Quick edit | Click a row | Opens the Edit category modal | Not when clicking the Programs button or row actions | — |
| Phone card | Phone layout | Tap | Title = name; subtitle = programs label; edit/delete actions; footer = creator and date. Tapping the card opens Edit | The program-name panel is not available on cards | — |
| Table settings | — | — | Default sort: Category name A–Z. 10 rows per page; 10, 20, 50 or All rows | SH-008 | — |

### 5.2 Add / Edit program category modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Title and description | Context | — | Add: "Add program category" / "A group programs can be filed under." Edit: "Edit category" / \<current name> | Small modal; bottom sheet on phones (SH-006) | — |
| Category name | The only field | Type | See section 7.1. Focus starts in the field | — | — |
| Rename note | Explain impact | — | When editing a category that has programs, helper text: "Its N programs move with it when renamed." ("Its 1 program moves with it when renamed.") | Only when the category is in use | — |
| **Save category** / **Save changes** | Save | Click, or press Enter in the field | Validates (BR-PRG-001/002). If valid, saves with a spinner (SH-007), shows a success toast, closes and refreshes the list | In Edit, the button is disabled until the name differs from the saved name (ignoring surrounding spaces) | Saved |
| **Cancel** / × / Esc | Close | Click / press | Closes directly when nothing changed. If the name was changed, asks first (section 5.4) | Clicking the dimmed backdrop does **not** close this modal (differs from SH-006) | — |

### 5.3 Delete category dialogs

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Delete (category not used) | Confirm removal | Click bin | Dialog "Delete this category?" / "\<name> will be removed. No programs use it." with **Cancel** and red **Delete** | SH-006 | On Delete: toast "Category deleted" (description = name), list refreshes |
| Delete blocked (category in use) | Explain and redirect | Click bin | Information dialog: "\<name> can’t be deleted yet" / "N programs are in this category. Move them to another category in Manage Content first." (singular: "1 program is in this category. Move it to another category in Manage Content first."). Buttons **Close** and **Go to Manage Content** | No Delete button is offered | Go to Manage Content opens the Manage Content page |
| Delete failure | Safety net | — | If the category gained programs in the meantime, toast "Couldn’t delete the category" with "N programs are in this category — move them to another category first." | — | Dialog stays open |

### 5.4 Discard-changes dialogs (both modals)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Discard dialog – category | Prevent accidental loss | Close a modal with changes | Add: "Discard this category?" / "The name you’ve entered won’t be saved." Edit: "Discard your changes?" / "Your edits to this category won’t be saved." Buttons **Keep editing** and **Discard** | Not shown while saving | Discard closes the modal without saving |
| Discard dialog – module | Same | Same | Add: "Discard this module?" / "The details you’ve entered won’t be saved." Edit: "Discard your changes?" / "Your edits to this module won’t be saved." | A change to the name or the switch counts | Same |

### 5.5 Modules list

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Count and filter | Click | "All modules", "Enabled", "Disabled" with counts. Tooltips: "Show all modules", "Show enabled modules", "Show disabled modules" | — | Filtered list |
| Search | Find | Type in "Search module…" | Matches module name | — | — |
| **Add module** button | Create | Click | Opens the Add module modal | — | — |
| Module name column | Identify | — | Icon tile and name. Pre, During and Post each have their own icon and a hint under the name: "Before the sessions", "While the sessions run", "After the sessions". Any other name gets a generic icon and no hint | Matching the three names ignores case and spaces | — |
| Created by / Created on | Audit | — | Avatar + name; date with relative time on hover | Sortable | — |
| Enable status column | State | — | "Yes" / "No" | Sortable | — |
| Row actions / row click | Edit / delete | Click | Pencil or row → Edit modal; bin → delete dialog | — | — |
| Default order | Journey order | — | Sorted by Created on, oldest first, so Pre → During → Post | 10 rows per page; 10/20/50/All rows | — |
| Phone card | Phone layout | Tap | Title, hint, Yes/No badge, actions, creator/date footer; tap opens Edit | — | — |

### 5.6 Add / Edit module modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Title and description | Context | — | Add: "Add module" / "A phase like Pre, During or Post." Edit: "Edit module" / \<current name> | — | — |
| Module name | Name | Type | Section 7.2 | — | — |
| Enable status | Switch | Toggle | Switch labelled "Enabled" or "Disabled". Helper: "Shown wherever modules are picked." (on) / "Hidden from module pickers until enabled." (off) | New modules start Enabled | — |
| **Save module** / **Save changes** | Save | Click / Enter | Validates; saves; toast "Module added" / "Module updated" with "\<name> · Enabled" or "\<name> · Disabled" | Edit: disabled until name or switch changes | — |
| Cancel / × / Esc | Close | — | As in 5.2 (backdrop click does not close) | — | — |

### 5.7 Delete module

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Delete dialog | Confirm | Click bin | "Delete this module?" / "\<name> will be removed from the program journey." **Cancel** / red **Delete** | No usage check — any module, including Pre, During and Post, can be deleted | Toast "Module deleted" (description = name); list refreshes |
| Delete failure | — | — | Toast "Couldn’t delete the module" with the reason | — | — |

## 6. User Workflow

### 6.1 Add a program category

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Add category** | Modal opens with focus in Category name | — | — |
| 2 | Type a name, click **Save category** | Checks name | Not empty; not a duplicate (any case) | — |
| 3 | — | Saves (short delay), toast "Category added" with the name, modal closes | — | Category appears with "Not used yet"; it is now offered in the Manage Content program form |

### 6.2 Rename a category in use

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click a row or its pencil | Edit modal with the current name and the note "Its N programs move with it when renamed." | — | — |
| 2 | Change the name, click **Save changes** | Saves; toast "Category updated" | Unique name | Every program in the old category now shows the new name in Manage Content |

### 6.3 Try to delete a category in use

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the bin on a category with programs | Blocked dialog "\<name> can’t be deleted yet" | Category has ≥ 1 program | — |
| 2 | Click **Go to Manage Content** | Manage Content opens | — | User re-files the programs, returns and deletes |

### 6.4 Disable a module

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open the module, switch Enable status off | Helper changes to "Hidden from module pickers until enabled." | — | — |
| 2 | Click **Save changes** | Toast "Module updated" / "\<name> · Disabled" | — | Row shows "No"; appears under the Disabled pill |

## 7. Forms and Field-Level Specifications

Validation timing for both modals follows SH-004: the "Enter the …" error appears only after Save is pressed; the duplicate-name error appears when the user leaves a field that has text in it, and again on Save. Errors clear as soon as the value becomes valid.

### 7.1 Add / Edit program category

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Category name | Text (placeholder "e.g. Leadership") | Name of the category | Required | 1 non-space character | 60 characters (typing stops at 60) | Any characters; surrounding spaces removed on save | Empty (Add); current name (Edit) | Spaces-only counts as empty. Must be unique among categories, ignoring case and surrounding spaces (SH-011); the category's own name is allowed in Edit | Edit: helper "Its N programs move with it when renamed." when in use | Empty: "Enter the category name". Duplicate: "A category with this name already exists" |

### 7.2 Add / Edit module

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Module name | Text (placeholder "e.g. Pre") | Phase name | Required | 1 non-space character | 40 characters (typing stops at 40) | Any characters; trimmed on save | Empty / current name | Spaces-only = empty. Unique ignoring case and surrounding spaces | The names Pre, During, Post get their own icon and hint | Empty: "Enter the module name". Duplicate: "A module with this name already exists" |
| Enable status | Switch | Whether the module is offered in pickers | Optional (always has a value) | N/A | N/A | Enabled / Disabled | Enabled (Add); saved value (Edit) | None | Helper text changes with the state | N/A |

### 7.3 List search and pills

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search category… | Search text | Filter categories | Optional | N/A | Requires Confirmation | Contains, case-insensitive, on name | Empty | None | — | N/A |
| Category usage pill | Single-select pills | Filter | Optional | N/A | N/A | All categories, In use, Not in use | All categories | None | — | N/A |
| Search module… | Search text | Filter modules | Optional | N/A | Requires Confirmation | Contains, on name | Empty | None | — | N/A |
| Module state pill | Single-select pills | Filter | Optional | N/A | N/A | All modules, Enabled, Disabled | All modules | None | — | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-PRG-001 | Category name required | A category must have a name | Save | Not saved | Empty or spaces only | "Enter the category name" |
| BR-PRG-002 | Unique category name | No two categories share a name, ignoring case and surrounding spaces | Blur (with text) and Save | Not saved | "leadership" when "Leadership" exists | "A category with this name already exists" (inline). If it slips through at save: toast "Couldn’t add the category" / "Couldn’t save the category" with "A category with this name already exists." |
| BR-PRG-003 | Rename moves programs | Renaming a category updates every program filed under it | Save in Edit | Programs show the new category name in Manage Content | — | Helper note before saving; toast "Category updated" |
| BR-PRG-004 | No orphaned programs | A category used by any program cannot be deleted | Delete | Delete is not offered; the user is sent to Manage Content | Category with programs | "\<name> can’t be deleted yet" dialog |
| BR-PRG-005 | Categories feed Manage Content | The program form's "Program category" choices are exactly this master, A–Z | Manage Content program add/edit | Added categories appear; deleted ones disappear | — | — |
| BR-PRG-006 | Module name required | — | Save | Not saved | Empty | "Enter the module name" |
| BR-PRG-007 | Unique module name | Ignoring case and surrounding spaces | Blur and Save | Not saved | "pre" when "Pre" exists | "A module with this name already exists" |
| BR-PRG-008 | Journey order | Modules list in the order they were created | Default sort | Pre, During, Post | — | — |
| BR-PRG-009 | Module enable status [Partially Implemented] | Disabled modules should be hidden from module pickers | Anywhere modules are picked | No page currently uses the Modules master. Adding a module here does **not** add it to programs; each program has its own modules (BR-CNT-018), to be managed from the Projects page later | — | — |
| BR-PRG-010 | Module delete without checks [Requires Confirmation] | Any module can be deleted | Delete | Removed immediately after confirmation | Deleting "During" | No warning beyond the dialog |
| BR-PRG-011 | No change, no save | Edit Save is disabled until something changes | Edit modals | Button disabled | Only spaces added around the name | Button stays disabled |
| BR-PRG-012 | Creator | New records record the signed-in user's name and the current date | Add | Shown in Created by / Created on | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Add category | Saved | Success toast | "Category added" — \<name> | After save | — |
| Edit category | Saved | Success toast | "Category updated" — \<name> | After save | — |
| Add/edit category fails | Error | Error toast | "Couldn’t add the category" / "Couldn’t save the category" — reason (for example "A category with this name already exists." or "This category no longer exists.") | After save attempt | Fix and retry |
| Delete category | Deleted | Success toast | "Category deleted" — \<name> | After confirm | — |
| Delete category fails | Error | Error toast | "Couldn’t delete the category" — reason | After confirm | Move programs first |
| Add module | Saved | Success toast | "Module added" — "\<name> · Enabled/Disabled" | After save | — |
| Edit module | Saved | Success toast | "Module updated" — "\<name> · Enabled/Disabled" | After save | — |
| Add/edit module fails | Error | Error toast | "Couldn’t add the module" / "Couldn’t save the module" — reason | — | — |
| Delete module | Deleted | Success toast | "Module deleted" — \<name> | — | — |
| Delete module fails | Error | Error toast | "Couldn’t delete the module" — reason | — | — |

Toasts follow SH-005.

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Category list | All categories | Sortable: Category name, Programs, Created by, Created on | Default Category name A–Z; 10/20/50/All rows | Empty master: "No program categories yet" / "Add the groups programs are filed under." + **Add category**. No match: "No categories match" / "Try a different search." + **Clear search & filters** |
| Programs panel | Program names in a category | Opens under the count; closes on outside click or Esc | Names A–Z | Only offered when count > 0 |
| Module list | All modules | Sortable: Module name, Created by, Created on, Enable status | Default Created on oldest first | Empty: "No modules yet" / "Add the parts of the program journey, like Pre, During and Post." + **Add module**. No match: "No modules match" / "Try a different search." + **Clear search & filters** |
| Result line | Filter summary | SH-008 | "N of Total categories" / "N of Total modules" + **Clear all** | — |
| Load failure | — | Error state with **Try again** (SH-007) | "Couldn’t load data" (table) / "Couldn’t load the list" (cards) | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| No categories | All deleted | Empty state with Add | "No program categories yet" | **Add category** |
| Delete category in use | Category has programs | Blocked dialog | "\<name> can’t be deleted yet" … | **Go to Manage Content** |
| Category deleted elsewhere while editing | Same session, edit modal open | Save fails | Toast "Couldn’t save the category" — "This category no longer exists." | Close and reload |
| Case-only rename | "sales" → "Sales" | Allowed (own name excluded from duplicate check) | Toast "Category updated" | — |
| Name at limit | 60 (category) / 40 (module) characters | Further typing is ignored | — | — |
| Unsaved close | Changed modal closed via Cancel/×/Esc | Discard dialog | Section 5.4 | Keep editing or Discard |
| Backdrop click | Click outside an open modal | Nothing happens | — | Use Cancel/× |
| All modules deleted | — | Empty state | "No modules yet" | **Add module** |
| Program counts stale | A program is added in Manage Content | Counts update when the page is reopened | — | Reopen page |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Manage Content ([manage-content-prd.md](manage-content-prd.md)) | Program form "Program category" select lists all categories A–Z | Add/delete category | Option added/removed | BR-PRG-005 |
| Manage Content | Category names shown on programs, cards, drawer and in the Category filter | Rename category | Programs show the new name. The program's change history does **not** record a "Category changed" entry for a rename done here | BR-PRG-003, OQ-PRG-003 |
| Manage Content | Delete blocked dialog links to it | **Go to Manage Content** | Opens the program list | BR-PRG-004 |
| Manage Content – content sections | Pre-program / During / Post-program sections of a program | Changes in Modules | No effect today (sections are fixed) | BR-PRG-009 |
| Settings hub ([settings-hub-prd.md](settings-hub-prd.md)) | Entry point: "Program Category" ("Categories programs are grouped in") and "Modules" ("Program phases — Pre, During, Post") | Open | Added to Recently opened | — |

## 13. Acceptance Criteria

**AC-PRG-001: Add a category**
- Given the Add program category modal is open
- When the user enters "Negotiation" and clicks **Save category**
- Then the toast "Category added" appears, the modal closes and "Negotiation" is listed with "Not used yet"
- And "Negotiation" is offered in the Manage Content program form

**AC-PRG-002: Required error only after Save (negative)**
- Given the Add modal is open with an empty name
- When the user tabs out of the field
- Then no error is shown
- And when the user clicks **Save category**, "Enter the category name" appears and nothing is saved

**AC-PRG-003: Duplicate name on blur (negative)**
- Given a category "Leadership" exists
- When the user types " leadership " and leaves the field
- Then "A category with this name already exists" appears and Save does not save

**AC-PRG-004: Rename moves programs**
- Given a category with programs
- When the user renames it and saves
- Then every program previously in it shows the new category in Manage Content

**AC-PRG-005: Delete blocked while in use (negative)**
- Given a category used by 3 programs
- When the user clicks its bin
- Then the dialog "\<name> can’t be deleted yet" explains "3 programs are in this category…" with **Close** and **Go to Manage Content**
- And no Delete button is offered

**AC-PRG-006: Delete unused category**
- Given a category with no programs
- When the user confirms **Delete**
- Then the toast "Category deleted" appears and the row disappears

**AC-PRG-007: Program names popover**
- Given a category with programs
- When the user clicks its "N programs" count
- Then a panel "Programs in \<category>" lists the program names A–Z and the edit modal does not open

**AC-PRG-008: Module add and enable switch**
- Given the Add module modal
- When the user enters "Follow-up", switches Enable status off and saves
- Then the toast "Module added" / "Follow-up · Disabled" appears and the row shows "No"

**AC-PRG-009: Unsaved changes**
- Given an Edit modal with a changed value
- When the user presses Esc
- Then "Discard your changes?" appears; **Keep editing** returns to the form and **Discard** closes without saving

**AC-PRG-010: Edit Save disabled until changed**
- Given an Edit modal just opened
- Then the **Save changes** button is disabled until the name (ignoring surrounding spaces) or switch changes

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-PRG-001 | AC-PRG-001 | Add category | — | "Negotiation" | Added, "Not used yet" | P1 |
| TC-PRG-002 | AC-PRG-002 | Empty name | Add modal | "" then "   " | "Enter the category name" only after Save | P1 |
| TC-PRG-003 | AC-PRG-003 | Duplicate, other case | — | " leadership " | Duplicate error on blur | P1 |
| TC-PRG-004 | 7.1 | Max length | — | 61 characters | Only 60 accepted | P2 |
| TC-PRG-005 | 7.1 | Trim on save | — | "  Ethics  " | Saved as "Ethics" | P2 |
| TC-PRG-006 | AC-PRG-004 | Rename in-use category | Category "Sales" has programs | Rename to "Sales Excellence" | Programs show "Sales Excellence" in Manage Content | P1 |
| TC-PRG-007 | AC-PRG-005 | Delete blocked | Category in use | Click bin | Info dialog; Go to Manage Content navigates | P1 |
| TC-PRG-008 | AC-PRG-006 | Delete unused | New category | Delete | Toast "Category deleted" | P1 |
| TC-PRG-009 | AC-PRG-007 | Program names | Category in use | Click count | Panel lists names A–Z; edit modal does not open | P2 |
| TC-PRG-010 | 5.1 | Pills | Demo data | Click In use / Not in use | Counts add up to All (6 seed categories) | P3 |
| TC-PRG-011 | AC-PRG-010 | Save disabled | Edit "Coaching" | Add a trailing space | Save remains disabled | P2 |
| TC-PRG-012 | AC-PRG-009 | Discard dialog | Add modal with text | Esc | "Discard this category?" | P2 |
| TC-PRG-013 | 11 | Backdrop click | Modal open | Click outside | Modal stays open | P3 |
| TC-PRG-014 | 5.5 | Module default order | Demo data | Open Modules | Pre, During, Post with hints | P3 |
| TC-PRG-015 | 7.2 | Module duplicate | — | "post" | "A module with this name already exists" | P1 |
| TC-PRG-016 | 7.2 | Module max length | — | 41 characters | Only 40 accepted | P3 |
| TC-PRG-017 | AC-PRG-008 | Disable a module | Edit "Post" | Switch off, save | Toast "Post · Disabled"; Disabled pill count 1 | P2 |
| TC-PRG-018 | BR-PRG-009 | Module not linked (gap) | Delete "During" | Open a program's content | Manage Content still shows its During section | P2 |
| TC-PRG-019 | 5.1 | Phone cards | 375 px | Category list | Cards; tap opens Edit | P3 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-PRG-001 | Modules | The Modules master is not connected to any program. Each program has its own modules (most use Pre / During / Post; some demo programs have more), to be managed from the Projects page later | How the master's modules relate to a program's own modules is undefined | Define, with the Projects page, how a program's modules are chosen and whether they must come from this master | Open |
| OQ-PRG-002 | Modules – delete | Should deleting a phase that holds program content be blocked, like categories? | Risk of losing the journey structure | Define the in-use rule | Open |
| OQ-PRG-003 | Category rename | Renaming does not add a "Category changed" entry to each program's history | Audit trail gap | Confirm whether bulk renames should be logged | Open |
| OQ-PRG-004 | Both | Maximum lengths (60 and 40) exist in the form only; are they the agreed limits? Allowed characters are not defined | Data quality | Confirm limits and character rules | Open |
| OQ-PRG-005 | Program Category | Should categories have an active/inactive state instead of only delete? | Retiring a category without moving programs | Decide | Open |
| OQ-PRG-006 | Search | Maximum search length is not defined | Minor | Confirm | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages, modals and dialogs: Complete
- [x] User roles and access: Complete
- [x] Field specifications: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (form limits need confirmation, see OQ-PRG-004, OQ-PRG-006)
- [x] Validation timing and messages: Complete
- [x] Success and error messages: Complete
- [x] Search, filters and tables: Complete
- [ ] Cross-module behaviour of Modules: Incomplete (not linked, see OQ-PRG-001)
- [x] Acceptance criteria and QA scenarios: Complete
