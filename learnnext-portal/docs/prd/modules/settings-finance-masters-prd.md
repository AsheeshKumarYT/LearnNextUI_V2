# Settings – Finance Masters: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Settings – Finance Masters PRD |
| Module name | Settings – Finance Masters (Entity, Sub-entity, SAP BP, Expense head) |
| Document ID | PRD-FIN |
| Version | 1.0 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Implemented (Entity, Sub-entity and Expense head can be added, edited and deleted; SAP BP is a read-only list by design). Some links to other modules are partial (section 12). |
| Last updated | 2026-10-29 |
| Related modules/pages | [settings-hub-prd.md](settings-hub-prd.md), [manage-content-prd.md](manage-content-prd.md), [facilitators-prd.md](facilitators-prd.md), [dashboard-prd.md](dashboard-prd.md), [clients-prd.md](clients-prd.md), [client-detail-prd.md](client-detail-prd.md), [settings-location-masters-prd.md](settings-location-masters-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

The Finance group in Settings holds the reference lists that decide **who bills** a program and **how costs are booked**:

- **Entity**: the legal companies and LLPs that raise invoices, with their registration numbers (PAN, CIN or LLPIN, LUT, GSTIN), supporting documents, logo, authorised signature and billing address.
- **Sub-entity**: the business units that sit under an entity (for example "Blanchard" under Blanchard Research and Training India LLP). Programs are mapped to an entity and one of its sub-entities.
- **SAP BP**: each trainer's SAP Business Partner code for each billing unit. The codes come from SAP and are read-only here.
- **Expense head**: the GL code that each kind of expense (for example "Revenue Invoice", "Food Expenses") books to, for each sub-entity.

Objectives:

- Give finance and operations staff one place to maintain billing entities and their statutory details, with format checks that catch mistyped PAN, CIN/LLPIN and GSTIN numbers.
- Keep each entity's invoice initial unique and unchangeable once issued, because invoice numbers start with it.
- Keep the entity → sub-entity → expense head chain consistent: a sub-entity always belongs to an entity, and an expense head is defined once per sub-entity.
- Prevent deletions that would leave orphaned child records (entities under a parent, sub-entities under an entity, expense heads under a sub-entity).
- Let staff see at a glance which trainers are missing SAP codes for which billing unit.

## 3. Module and Page Overview

All four pages open from **Settings › Finance** ("Billing entities, SAP partners and expense heads."). See [settings-hub-prd.md](settings-hub-prd.md) for navigation, pins, recent history and the master page frame. The header breadcrumb reads "Settings › \<master name>" (SH-009).

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Entity | Lists the legal entities that bill programs | Admin user | Filter by status pill, search, open Filters (status, parent, state, registration type), sort, paginate, Add entity, Edit, Delete | Sub-entity, Expense head, Manage Content, Facilitators |
| Add / Edit entity (modal) | Capture an entity's details, registrations, documents and billing address in 3 steps | Admin user | Fill steps Details → Registration → Tax & billing, upload documents, save, discard | Entity |
| Sub-entity | Lists the units under each entity | Admin user | Filter by status pill, search, open Filters (status, entity), sort, paginate, Add sub-entity, Edit, Delete | Entity, Expense head, Manage Content |
| Add / Edit sub-entity (modal) | Capture the parent entity, name, optional logo and (when editing) status | Admin user | Save, discard | Sub-entity |
| SAP BP | Shows each trainer's SAP Business Partner code per billing unit (read-only) | Admin user | Filter by mapping pill, search, open Filters (entity, mapping, missing code), sort, paginate | Facilitators (conceptually) |
| Expense head | Lists the GL code each expense type books to, per sub-entity | Admin user | Filter by status pill, search, open Filters (status, expense head, entity, sub-entity), sort, paginate, Add expense head, Edit, Delete | Entity, Sub-entity |
| Add / Edit expense head (modal) | Capture expense head, entity, sub-entity, GL code, comment and (when editing) status | Admin user | Save, discard | Expense head |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Admin user (any signed-in staff member) | All four pages (SH-002, SH-003) | Entity, Sub-entity, Expense head: view, search, filter, sort, paginate, add, edit, change status, delete. SAP BP: view, search, filter, sort, paginate | SAP BP codes cannot be added or changed here. An entity's invoice initial cannot be changed after it is created. Role-based limits defined in Roles & Access are not enforced (SH-002). |
| Signed-out visitor | None | None | Redirected to Sign in (SH-003). |

## 5. Page Functionality and Behavior

### 5.1 Shared list frame (all four pages)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| List card | Holds the toolbar and the list | Open the page | One card fills the page height on large screens, following the All Clients list pattern (SH-008) | — | Consistent list layout |
| Summary pills | Count and filter | Click a filterable pill | The list is limited to that group; the active pill is highlighted ("All" is never highlighted) | Counts are of all records, not of the filtered list. "New this month" pills are counts only and cannot be clicked | List filtered |
| Search box | Find a record by text | Type | Rows filter as the user types (short delay of about 0.15 s). Matching is case-insensitive "contains" and ignores surrounding spaces | Fields searched differ per page (section 10) | Matching rows only |
| Result line | Explain the current filter | Search or filter | Shows "**N** of **Total** \<noun>" with a removable chip per drawer filter and a **Clear all** link (SH-008) | Shown only when a pill other than "All", a search or a drawer filter is active | Clear view of what is shown |
| Filters button | Open the filter drawer | Click **Filters** | Opens the page's filter drawer (sections 5.3, 5.6, 5.8, 5.10) | The button shows the number of chips (drawer filters); the status/mapping pill is not counted | — |
| Add button | Create a record | Click **Add entity** / **Add sub-entity** / **Add expense head** | Opens the add modal over the list | Not present on SAP BP | Modal opens |
| Table / cards | Show records | Scroll, sort, page | Table from tablet width upward with a header that stays pinned while scrolling on large screens; cards on phones (SH-008) | 10 rows per page; choices 10, 20, 50 rows or "All rows" | — |
| Row click | Edit a record | Click a row or a phone card | Opens the edit modal for that record | Entity, Sub-entity, Expense head only. SAP BP rows do not open anything | Edit modal |
| Row actions | Edit / delete | Click the pencil or bin icon | Pencil opens the edit modal; bin starts the delete flow. Icons have tooltips "Edit \<name>" / "Delete \<name>" (Expense head: "Edit \<head> for \<sub-entity>" / "Delete \<head> for \<sub-entity>") | Plain icon buttons; a small arrow appears on row hover | — |
| Created on column | Show when the record was added | Hover | Date (SH-012); tooltip "\<relative time> · by \<name>" | Shown only on extra-wide screens so the row actions stay in view; sortable | — |
| Loading | Show progress | Open the page | Skeleton rows and pill placeholders (SH-007) | — | — |
| Load failure | Recover | Click **Try again** | Table: "Couldn’t load data" with the error text; phone cards: "Couldn’t load the list" with the error text | Failures do not normally occur with demo data (SH-001) | List reloads |

### 5.2 Entity list

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by status | Click | "All entities", "Active", "Inactive" (filterable) and "New this month" (count only). Tooltips: "Show all entities", "Show active entities", "Show inactive entities", "Added in the last 30 days" | Pill and the drawer's Status control set the same filter | Filtered list |
| Search | Find an entity | Type in "Search name, PAN, GSTIN, city…" | Matches entity name, invoice initial, PAN, GSTIN, CIN/LLPIN, city or state | — | Matching entities |
| Entity name column | Identify the entity | — | Logo (or a monogram tile when there is no logo), entity name (full name on hover) and below it "\<city> · \<state>" | Sortable; default sort A–Z | — |
| Parent entity column | Show the group structure | — | Parent entity name with a hierarchy icon, or "—" when there is no parent | Shown from extra-large width; sortable by parent name | — |
| Created on column | — | — | See 5.1 | Extra-wide screens only | — |
| Invoice initial column | Show the invoice prefix | — | Code chip, for example "BYLD" | Sortable | — |
| Status column | Show status | — | Status dot + word: Active or Inactive | Shown from tablet width; sortable | — |
| Phone card | Phone layout | — | Logo, name, "\<city> · \<state>", invoice-initial chip and status; footer shows the parent entity name (or "No parent") and the created date; Edit / Delete icons | — | — |
| Delete – entities sit under it | Protect the group structure | Click the bin icon | No dialog opens. Error toast "Can’t delete this entity yet" with "1 entity sits under it — change their parent first." / "N entities sit under it — change their parent first." | Applies when any other entity has this entity as its parent | Nothing deleted |
| Delete – confirmation | Confirm a destructive action | Click the bin icon | Dialog "Delete this entity?" — "\<name> (\<invoice initial>) will be removed. Invoices already raised keep their details." with **Cancel** and red **Delete** (SH-006) | — | — |
| Delete – confirmed | Remove the entity | Click **Delete** | Success toast "Entity deleted" with the entity name; the list reloads | Fails when sub-entities sit under the entity: error toast "Couldn’t delete the entity" with "Sub-entities sit under this one — move or delete them first."; the dialog stays open | Entity removed or kept |
| Delete – programs using it | — | — | Deletion is **not** blocked by programs, facilitators or invoices that refer to the entity. Programs then show "Removed entity" (section 12) | — | See OQ-FIN-006 |

### 5.3 Entity filter drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Combine filters | Click **Filters** | Title "Filter entities"; description "By status, parent, state or registration type". Opens with the currently applied filters | Changes are a draft until applied | — |
| Status | Filter by status | Choose | Segmented control: All, Active, Inactive (with counts) | Same value as the summary pill | — |
| Parent entity | Filter by parent | Pick one or more | Searchable multi-select ("Any parent"; search "Search entities…"). Options are the entities that are a parent of at least one entity, plus "Top-level (no parent)" when any entity has no parent | Chips: "Under \<parent>" or "Top-level" | — |
| State | Filter by address state | Pick one or more | Searchable multi-select ("Any state"; search "Search states…"), states used by entities A–Z | Chip = state name | — |
| Registration type | Company vs LLP | Choose | Segmented control: All, CIN (company), LLPIN (LLP) | Chip "CIN" or "LLPIN" | — |
| Section clear | Clear one section | Click the section's clear control | Resets that section only | Shown only when the section has a non-default value | — |
| Reset | Clear all drafts | Click **Reset** | All drawer controls return to defaults | Applies only after the apply button is clicked | — |
| Apply button | Apply the draft | Click | Label shows the live count: "Show N entities" / "Show 1 entity"; the drawer closes and filters apply | When the draft (combined with the current search) matches nothing, the button reads "No matching entities" and is disabled | Filtered list |
| Closing without applying | Abandon | ×, Esc or backdrop (SH-006) | Draft discarded | — | Filters unchanged |

### 5.4 Add / Edit entity modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Modal header | Identify the task | Open | Add: title "Add entity", description "A legal entity that raises invoices." Edit: title "Edit entity", description = entity name | Wide modal; bottom sheet on phones (SH-006) | — |
| Step bar | Show progress | Click a step | Three steps: **Details**, **Registration**, **Tax & billing**. Footer shows "Step N of 3" (hidden on phones) | Add: only steps already reached can be clicked. Edit: all steps can be clicked from the start (the bar works as tabs) | Step changes; the form scrolls to the top |
| Details step | Identity | — | Entity name, Parent entity, Invoice initial, Logo; plus Status when editing (section 7.1) | — | — |
| Registration step | Statutory numbers and documents | — | A checklist with one row per registration (PAN, CIN or LLPIN, LUT): label, number and its document upload; then Authorised signature and LUT declaration (section 7.2) | Each row shows one message: the number's problem first, otherwise the document's | — |
| Company / LLP toggle | Choose the registration type | Click **Company** or **LLP** | Switches the row label, placeholder and format between CIN and LLPIN | Switching clears the number already typed (the uploaded certificate is kept) | — |
| Registration document upload | Attach PAN card, CIN/LLPIN certificate, LUT | Click "Upload \<document>" | File picker for PDF, JPG or PNG; tooltip "PDF, JPG or PNG · max 5 MB". Once attached, a green pill shows the file name (click to view it full size) and a × to remove it | Wrong type: error toast "Use a PDF, JPG or PNG file."; over 5 MB: error toast "File must be under 5 MB." | Document attached |
| Tax & billing step | Billing address and GST | — | Address line 1, Address line 2, Country, State, City, Pin code, Phone, GSTIN No. and GST certificate upload (section 7.3) | — | — |
| GST certificate upload | Attach the GST certificate | Click or drag a file onto "Upload GST certificate *" | Drop zone with "PDF, JPG or PNG · max 5 MB" and **Browse**. Once attached: file row with the name (click to view), "PDF" or "Image", size, an "Uploaded" badge, and Replace / Remove icons | Wrong type / too big: the message replaces the hint in red and also shows as an error toast | Document attached |
| Logo / signature picker | Upload an image | Click the tile or "Upload logo" / "Upload signature" | Accepts image files up to 2 MB; once chosen the tile shows the image (click to view full size) with **Change** and **Remove** | Not an image: error toast "Please choose an image file."; over 2 MB: error toast "Logo must be under 2 MB." (same wording for the signature) | Image attached |
| Footer – add mode | Move through steps | Click | Step 1: **Cancel**, **Next**. Step 2: **Back**, **Next**. Step 3: **Back**, **Save entity** | **Next** checks the current step; if anything is wrong, all of that step's errors appear and the step does not change | — |
| Footer – edit mode | Save from any step | Click | **Cancel** (step 1) or **Back**, **Next** (steps 1–2), and **Save changes** — shown only once something has changed | — | — |
| Save | Store the entity | Click **Save entity** / **Save changes** | All three steps are checked. If any has errors, the form jumps to the first step with errors, shows all errors and an error toast "Check the highlighted fields" — "1 field needs a fix in \<step>." / "N fields need a fix in \<step>." Otherwise the button shows a spinner (SH-007), then success toast "Entity added" / "Entity updated" with "\<name> (\<invoice initial>)"; the modal closes and the list reloads | New entities are always saved as **Active** | Entity saved |
| Save failure | Report a failed save | — | Error toast "Couldn’t add the entity" / "Couldn’t save the entity" with the reason (for example "Another entity already uses this invoice initial." or "This entity no longer exists.") | Modal stays open | — |
| Close with unsaved changes | Avoid losing work | ×, Esc or **Cancel** after changing something | Dialog: add — "Discard this entity?" / "The details you’ve entered won’t be saved."; edit — "Discard your changes?" / "Your edits to this entity won’t be saved." Buttons **Keep editing** and **Discard** | Clicking the backdrop does **not** close the modal. With no changes, the modal closes directly | — |

### 5.5 Sub-entity list

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by status | Click | "All sub-entities", "Active", "Inactive" (filterable), "New this month" (count only). Tooltips: "Show all sub-entities", "Show active sub-entities", "Show inactive sub-entities", "Added in the last 30 days" | Same filter as the drawer's Status | Filtered list |
| Search | Find a sub-entity | Type in "Search sub-entity or entity…" | Matches sub-entity name, entity name or the entity's invoice initial | — | — |
| Sub-entity name column | Identify the unit | — | Logo (or monogram tile), name; below tablet width the entity name shows under it | Sortable; default A–Z | — |
| Entity column | Parent entity | — | Entity name with a building icon, or "—" if the entity no longer exists | Shown from tablet width; sortable | — |
| Created on / Status | — | — | See 5.1; Active / Inactive status dot + word | Status shown from tablet width | — |
| Phone card | Phone layout | — | Logo, name, entity name, status; footer = creator's avatar, name and created date; Edit / Delete icons | — | — |
| Delete – confirmation | Confirm | Click the bin icon | Dialog "Delete this sub-entity?" — "\<name> (under \<entity>) will be removed." with **Cancel** and red **Delete** | — | — |
| Delete – confirmed | Remove | Click **Delete** | Success toast "Sub-entity deleted" with the name; list reloads | Fails when expense heads use the sub-entity: error toast "Couldn’t delete the sub-entity" with "1 expense head uses it — move or delete it first." / "N expense heads use it — move or delete them first."; the dialog stays open. Not blocked by programs that use it (they then show "Removed sub-entity") | Removed or kept |

### 5.6 Sub-entity filter drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Combine filters | Click **Filters** | Title "Filter sub-entities"; description "By status or entity" | Draft until applied | — |
| Status | Filter by status | Choose | All, Active, Inactive (with counts) | Same as pill | — |
| Entity | Filter by parent entity | Pick one or more | Searchable multi-select ("Any entity"; search "Search entities…"); only entities that have sub-entities, A–Z, each described "N sub-entities" | Chip = entity name | — |
| Reset / Apply / Close | — | — | As in 5.3. Apply reads "Show N sub-entities" / "Show 1 sub-entity", or "No matching sub-entities" (disabled) | — | — |

### 5.7 Add / Edit sub-entity modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Modal header | Identify the task | Open | Add: "Add sub-entity" — "A unit under one of your entities." Edit: "Edit sub-entity" — the sub-entity name | Medium-size modal | — |
| Fields | Capture details | — | Entity, Sub-entity name, Logo (optional), Status (edit only) (section 7.4) | — | — |
| Footer | Save | Click | **Cancel** and **Save sub-entity** / **Save changes** | When editing, **Save changes** is disabled until something changes | — |
| Save | Store | Click save | Errors for every invalid field appear (SH-004); otherwise spinner, then success toast "Sub-entity added" / "Sub-entity updated" with the name; modal closes; list reloads | New sub-entities are always **Active** | Saved |
| Save failure | Report | — | Error toast "Couldn’t add the sub-entity" / "Couldn’t save the sub-entity" with the reason (for example "This entity already has a sub-entity with that name.") | Modal stays open | — |
| Close with unsaved changes | Avoid losing work | ×, Esc, **Cancel** | "Discard this sub-entity?" / "The details you’ve entered won’t be saved." (add) or "Discard your changes?" / "Your edits to this sub-entity won’t be saved." (edit); **Keep editing** / **Discard** | Backdrop click does not close | — |

### 5.8 SAP BP (read-only)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by mapping completeness | Click | "All trainers", "Fully mapped", "Missing codes". Tooltips: "Show all trainers", "Trainers with a code for every entity in view", "Trainers missing at least one code" | Fully mapped / Missing are counted only over the entity columns in view (see Entity filter) | Filtered list |
| Search | Find a trainer or code | Type in "Search trainer or SAP code…" | Matches trainer name or any SAP code in the columns in view | — | — |
| Trainer name column | Identify the trainer | — | Avatar, name, and below it "All N codes set" or "M of N codes set" | Sortable; default A–Z | — |
| One column per billing unit | Show the code | — | Columns "DOOR", "Blanchard", "LCPL", "BYLD Consulting": the code as a chip, or "Not set" (tooltip "No \<unit> code yet") | Each column sortable | — |
| No Add, Edit or Delete | Codes come from SAP | — | No Add button, no row actions; rows do not open | — | Read-only list |
| No sync note | — | — | Unlike the CRM masters, this page shows no "synced from" note or last-synced time | — | See OQ-FIN-009 |
| Phone card | Phone layout | — | Avatar, name, "codes set" line, and a two-column list of each unit with its code or "Not set" | — | — |

### 5.9 SAP BP filter drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Combine filters | Click **Filters** | Title "Filter trainers"; description "By entity, mapping or a missing code" | Draft until applied | — |
| Entity | Choose which unit columns to show | Pick one or more | Multi-select ("All entities"; search "Search entities…"); each option described "N of Total trainers have a code" | Narrows the table to the chosen unit columns; mapping counts, the pills and the search then consider only those columns. Chip = unit name | — |
| Mapping | Fully mapped vs missing | Choose | All, Fully mapped, Missing (counts follow the units chosen in the draft) | Same value as the pill | — |
| Missing a code for | Find gaps for a unit | Pick one or more | Multi-select ("Any entity"); each option described "N without a code" | A trainer matches if any chosen unit has no code. Chip "No \<unit> code" | — |
| Reset / Apply / Close | — | — | As in 5.3. Apply reads "Show N trainers" / "Show 1 trainer", or "No matching trainers" (disabled) | — | — |

### 5.10 Expense head list and filters

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by status | Click | "All expense heads", "Active", "Inactive" (filterable), "New this month" (count only). Tooltips: "Show all expense heads", "Show active expense heads", "Show inactive expense heads", "Added in the last 30 days" | — | Filtered list |
| Search | Find a row | Type in "Search head, entity or GL code…" | Matches expense head, GL code, entity name or sub-entity name | — | — |
| Expense head column | Identify the head | — | Icon tile per type (receipt, plane, cutlery, parcel; a tag for others), head name; below tablet width the sub-entity, otherwise the comment (full text on hover) | Sortable | — |
| Entity column | Entity | — | Entity name or "—" | Shown from extra-large width; sortable | — |
| Sub-entity column | Sub-entity | — | Sub-entity name or "—"; tooltip "\<sub-entity> · \<entity>" | Shown from tablet width; sortable | — |
| GL code column | Booking code | — | Code chip | Sortable | — |
| Created on / Status | — | — | See 5.1 | Status shown from large width | — |
| Default sort | — | — | **Created on, newest first** (unlike the other finance masters, which sort by name) | — | — |
| Phone card | Phone layout | — | Icon, head, "\<sub-entity> · \<entity>", GL code chip and status; footer creator and date; Edit / Delete | — | — |
| Delete | Remove a row | Bin icon → **Delete** | Dialog "Delete this expense head?" — "\<head> for \<sub-entity> (GL \<code>) will be removed."; on confirm success toast "Expense head deleted" with "\<head> · \<sub-entity>" | Never blocked | Removed |
| Filter drawer | Combine filters | Click **Filters** | Title "Filter expense heads"; description "By status, expense head, entity or sub-entity". Status (All / Active / Inactive with counts); Expense head (the four types, each "N sub-entities"; "Any expense head"); Entity (only entities with expense heads, each "N expense heads"; "Any entity"); Sub-entity (only sub-entities with expense heads, narrowed to the chosen entities, each described by its entity name; "Any sub-entity") | Removing an entity also removes its sub-entities from the draft; clearing the Entity section clears Sub-entity too. Apply: "Show N expense heads" / "Show 1 expense head" or "No matching expense heads" (disabled). Chips: head name, entity name, sub-entity name | Filtered list |

### 5.11 Add / Edit expense head modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Modal header | Identify the task | Open | Add: "Add expense head" — "The GL code an expense books to, per sub-entity." Edit: "Edit expense head" — "\<head> · GL \<code>" | Medium modal | — |
| Fields | Capture details | — | Expense head, Entity, Sub-entity, GL code, Comment (optional), Status (edit only) (section 7.5) | — | — |
| Entity → Sub-entity | Keep the pair consistent | Change Entity | Sub-entity list shows only that entity's sub-entities; changing the entity clears the chosen sub-entity | — | — |
| Footer / Save | Save | Click | **Cancel** and **Save expense head** / **Save changes** (disabled in edit until something changes). Success toast "Expense head added" / "Expense head updated" with "\<head> · GL \<code>" | New rows are always **Active** | Saved |
| Save failure | Report | — | Error toast "Couldn’t add the expense head" / "Couldn’t save the expense head" with the reason (for example "This sub-entity already has that expense head.") | — | — |
| Close with unsaved changes | Avoid losing work | ×, Esc, **Cancel** | "Discard this expense head?" / "The details you’ve entered won’t be saved." (add) or "Discard your changes?" / "Your edits to this expense head won’t be saved." (edit); **Keep editing** / **Discard** | Backdrop click does not close | — |

## 6. User Workflow

### 6.1 Add an entity

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Settings › Finance › Entity and click **Add entity** | Modal "Add entity" opens on **Details** | — | Empty form |
| 2 | Enter Entity name, optionally a Parent entity, an Invoice initial, and upload a Logo; click **Next** | Step 1 is checked | Name and logo required; initial required, up to 6 letters/digits, unique | Moves to **Registration**, or shows step errors |
| 3 | Enter PAN and upload the PAN card; choose **Company** or **LLP** and enter the CIN/LLPIN and upload its certificate; enter the LUT number and upload the LUT; upload the authorised signature; type the LUT declaration; click **Next** | Step 2 is checked | PAN, CIN/LLPIN formats (section 8) | Moves to **Tax & billing** |
| 4 | Enter address lines, choose Country → State → City, enter pin code, phone and GSTIN; upload the GST certificate; click **Save entity** | All steps are checked; spinner | GSTIN format and must contain the PAN; pin 6 digits for India; phone 10 digits | Toast "Entity added"; new entity appears (Active) |
| 5 (alt) | Click **Cancel** / × / Esc after typing | Discard dialog | — | **Keep editing** returns; **Discard** closes without saving |

### 6.2 Edit an entity

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click a row or the pencil icon | "Edit entity" opens with all steps reachable | — | Current values shown; invoice initial locked |
| 2 | Click any step and change values (for example toggle Status to Inactive) | **Save changes** appears in the footer | — | — |
| 3 | Click **Save changes** | All steps checked; if invalid, jumps to the first bad step with toast "Check the highlighted fields" | — | Toast "Entity updated"; list reloads |

### 6.3 Delete an entity

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the bin icon on an entity | If other entities sit under it, error toast "Can’t delete this entity yet" and stop | Child entities exist | — |
| 2 | Otherwise confirm **Delete** in "Delete this entity?" | Deletion attempted | Sub-entities under it block deletion: toast "Couldn’t delete the entity" / "Sub-entities sit under this one — move or delete them first." | — |
| 3 | — | Entity removed; toast "Entity deleted" | No child entities, no sub-entities | Programs that used it show "Removed entity" |

### 6.4 Add a sub-entity

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Sub-entity and click **Add sub-entity** | Modal opens | — | — |
| 2 | Choose the Entity, type the Sub-entity name, optionally upload a logo, click **Save sub-entity** | Checks fields | Name unique within the chosen entity | Toast "Sub-entity added"; appears as Active |

### 6.5 Define an expense head's GL code for a sub-entity

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Expense head and click **Add expense head** | Modal opens | — | — |
| 2 | Choose Expense head, Entity, then Sub-entity | Sub-entity list limited to the entity's sub-entities | The head + sub-entity pair must not already exist | Duplicate shows "This sub-entity already has this expense head" |
| 3 | Enter the GL code, optionally a comment, click **Save expense head** | Saves | GL code required | Toast "Expense head added"; row appears at the top (newest first) |

### 6.6 Find trainers missing SAP codes

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open SAP BP and click **Missing codes** | Trainers missing at least one code are listed | — | Gap list |
| 2 | Open **Filters**, pick "Blanchard" under **Missing a code for**, click "Show N trainers" | Only trainers without a Blanchard code | — | Chip "No Blanchard code" |
| 3 | Fix the codes in SAP | — | Not possible here | — |

## 7. Forms and Field-Level Specifications

Validation timing in these forms differs from SH-004: an error — including a "required" error — appears as soon as the user leaves a field they visited (or picks a value in a dropdown), and every error of a step appears when **Next** or the save button is clicked. Errors clear as soon as the value becomes valid.

### 7.1 Entity – Details step

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Entity name | Text | Registered legal name | Required | 1 non-space character | Requires Confirmation | Any text; placeholder "Registered legal name" | Empty | Spaces-only counts as empty. Not checked for duplicates (OQ-FIN-002) | — | "Enter the entity’s legal name" |
| Parent entity | Searchable single-select, clearable | Group structure | Optional | N/A | N/A | Any other entity (name, with invoice initial as description); placeholder "Select parent"; search "Search entities…" | Empty (add) / current parent (edit) | An entity cannot pick itself | — | N/A |
| Invoice initial | Text (add) / locked display (edit) | Prefix that starts every invoice number | Required | 1 character | 6 characters | Letters A–Z and digits only; typed letters become upper case and other characters are removed; placeholder "e.g. BYLD" | Empty | Unique across entities, ignoring case | When editing it is shown locked with a padlock and tooltip "Can’t be changed — issued invoices carry it" | "Enter an invoice initial"; "Up to 6 letters or digits"; "Another entity uses this initial" |
| Logo | Image upload | Entity logo on documents and lists | Required | N/A | 2 MB | Any image file (hint "PNG, JPG or SVG · up to 2 MB") | None | Must be an image under 2 MB | Hint line turns red with the error | "Upload a logo"; toasts "Please choose an image file." / "Logo must be under 2 MB." |
| Status | Switch | Active / Inactive | Optional (edit only) | N/A | N/A | Active, Inactive (label follows the switch) | Current status | None | Shown only when editing; new entities are Active | N/A |

### 7.2 Entity – Registration step

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| PAN No. | Text | Permanent account number ("Permanent account no.") | Required | 10 characters | 10 characters | 5 letters, 4 digits, 1 letter (for example ABCDE1234F); typed in upper case, spaces removed | Empty | Format check | — | "Enter the PAN"; "PAN looks like ABCDE1234F" |
| PAN card | Document upload | Proof of PAN | Required | N/A | 5 MB | PDF, JPG, PNG | None | Type and size checked on upload | Button "Upload PAN card" | "Upload the PAN card"; toasts "Use a PDF, JPG or PNG file." / "File must be under 5 MB." |
| Registration type | Segmented toggle | Company or LLP | Required | N/A | N/A | Company (CIN), LLP (LLPIN) | Company | None | Switching clears the CIN/LLPIN number | N/A |
| CIN No. | Text | Company identification number | Required (Company) | 21 characters | 21 characters | L or U, 5 digits, 2 letters, 4 digits, 3 letters, 6 digits; placeholder "U80301DL2009PTC193221"; upper case, spaces removed | Empty | Format check | Shown when Company is selected | "Enter the CIN"; "CIN is 21 characters" |
| LLPIN No. | Text | LLP identification number | Required (LLP) | 8 characters | 8 characters | 3 letters, a hyphen, 4 digits (for example AAB-1234) | Empty | Format check | Shown when LLP is selected | "Enter the LLPIN"; "LLPIN looks like AAB-1234" |
| CIN / LLPIN certificate | Document upload | Proof of registration | Required | N/A | 5 MB | PDF, JPG, PNG | None | As PAN card | Button "Upload CIN certificate" / "Upload LLPIN certificate" | "Upload the CIN certificate" / "Upload the LLPIN certificate"; upload toasts as above |
| LUT No. | Text | Letter of undertaking number | Required | 1 character | Requires Confirmation | Any; upper case, spaces removed; placeholder "e.g. AD070325012345K" | Empty | No format check (OQ-FIN-004) | — | "Enter the LUT number" |
| LUT | Document upload | LUT copy | Required | N/A | 5 MB | PDF, JPG, PNG | None | As PAN card | Button "Upload LUT" | "Upload the LUT"; upload toasts as above |
| Authorised signature | Image upload | Signature printed on invoices | Required | N/A | 2 MB | Any image file (hint "PNG or JPG · up to 2 MB") | None | Image under 2 MB | Button "Upload signature" | "Upload the signature"; toasts "Please choose an image file." / "Logo must be under 2 MB." |
| LUT declaration | Multi-line text (3 rows) | Declaration text for invoices | Required | 1 non-space character | Requires Confirmation | Any text; placeholder "We declare that the supply of services is made under LUT without payment of IGST…" | Empty | Spaces-only counts as empty | — | "Add the LUT declaration" |

### 7.3 Entity – Tax & billing step

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Address line 1 | Text | Billing address | Required | 1 non-space character | Requires Confirmation | Placeholder "Building, street" | Empty | — | — | "Enter address line 1" |
| Address line 2 | Text | Billing address | Required | 1 non-space character | Requires Confirmation | Placeholder "Area, landmark" | Empty | — | — | "Enter address line 2" |
| Country | Searchable single-select | Billing country | Required | N/A | N/A | India, United Arab Emirates, Singapore, United Kingdom, United States (same list as the client form); search "Search countries…" | India | — | Changing it clears State and City | "Choose a country" |
| State | Searchable single-select | Billing state | Required | N/A | N/A | States of the chosen country, A–Z; search "Search states…" | Empty | — | Disabled until a country is chosen; changing it clears City | "Choose a state" |
| City | Searchable single-select | Billing city | Required | N/A | N/A | Cities of the chosen state; placeholder "Pick a state first" until a state is chosen, then "Select city" | Empty | — | Disabled until a state is chosen | "Choose a city" |
| Pin code | Text (numeric keypad) | Postal code | Required | India: 6 digits | India: 6 digits; other countries: 10 characters | India: digits only (other characters are removed); other countries: any characters | Empty | India: exactly 6 digits | Rules depend on Country | "Enter the pin code"; "Pin code is 6 digits" |
| Phone | Text with fixed "+91" prefix | Contact number | Required | 10 digits | 10 digits | Digits only (others removed); placeholder "98765 43210" | Empty | Exactly 10 digits | Prefix is "+91" for every country (OQ-FIN-005) | "Enter a phone number"; "Phone number is 10 digits" |
| GSTIN No. | Text | GST registration | Required | 15 characters | 15 characters | 2 digits, the 10-character PAN pattern, 1 character 1–9 or A–Z, "Z", 1 letter or digit (for example 07AABCB1234K1Z9); upper case, spaces removed | Empty | Format check; characters 3–12 must equal the PAN (checked only when the PAN is valid) | — | "Enter the GSTIN"; "GSTIN is 15 characters, e.g. 07AABCB1234K1Z9"; "GSTIN should contain the PAN" |
| GST certificate | Document upload (click or drag and drop) | Proof of GST registration | Required | N/A | 5 MB | PDF, JPG, PNG | None | Type and size checked | Attached file can be viewed, replaced or removed | "Upload the GST certificate"; inline + toast "Use a PDF, JPG or PNG file." / "File must be under 5 MB." |

### 7.4 Sub-entity form

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Entity | Searchable single-select | Entity the unit sits under | Required | N/A | N/A | All entities A–Z, each described by its invoice initial, or "\<initial> · Inactive" for inactive entities; placeholder "Select entity"; search "Search entities…" | Empty | — | Can be changed when editing | "Choose the entity it sits under" |
| Sub-entity name | Text | Unit name | Required | 1 non-space character | Requires Confirmation | Any text; placeholder "e.g. BYLD Learning"; trimmed when saved | Empty | Unique within the chosen entity, ignoring case and surrounding spaces (SH-011); the same name may exist under another entity | Re-checked when the entity changes | "Enter the sub-entity name"; "This entity already has a sub-entity with this name" |
| Logo | Image upload | Unit logo | Optional | N/A | 2 MB | Any image file (hint "PNG, JPG or SVG · up to 2 MB") | None | Image under 2 MB | Without a logo, lists show a monogram tile | Toasts "Please choose an image file." / "Logo must be under 2 MB." |
| Status | Switch | Active / Inactive | Optional (edit only) | N/A | N/A | Active, Inactive | Current status | None | Edit only; new = Active | N/A |

### 7.5 Expense head form

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Expense head | Searchable single-select | Kind of expense | Required | N/A | N/A | Revenue Invoice, Flight & Hotel Booking, Food Expenses, Courier Services; placeholder "Select expense head"; search "Search expense heads…" | Empty | — | — | "Choose the expense head" |
| Entity | Searchable single-select | Entity of the sub-entity | Required | N/A | N/A | All entities A–Z with invoice initial (inactive entities are not marked); placeholder "Select entity" | Empty | — | Changing it clears Sub-entity | "Choose the entity" |
| Sub-entity | Searchable single-select | Unit the GL code applies to | Required | N/A | N/A | Sub-entities of the chosen entity A–Z; inactive ones described "Inactive"; search "Search sub-entities…" | Empty | Expense head + sub-entity pair must be unique | Disabled with placeholder "Pick an entity first" until an entity is chosen, or "No sub-entities yet" when the entity has none; otherwise "Select sub-entity" | "Choose the sub-entity"; "This sub-entity already has this expense head" |
| GL code | Text | General-ledger code | Required | 1 character | 20 characters | Any characters; letters become upper case and spaces are removed; placeholder "e.g. 41130015" | Empty | Not checked for duplicates or format (OQ-FIN-008) | — | "Enter the GL code" |
| Comment | Multi-line text with character counter | Notes for finance | Optional | N/A | 250 characters | Any text; placeholder "Anything finance should know about this head" | Empty | — | Shown under the head name in the list | N/A |
| Status | Switch | Active / Inactive | Optional (edit only) | N/A | N/A | Active, Inactive | Current status | None | Edit only; new = Active | N/A |

### 7.6 Search boxes and filters

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search name, PAN, GSTIN, city… | Search text | Entity search | Optional | N/A | Requires Confirmation | Contains, case-insensitive | Empty | None | Narrows to an icon in medium layouts (SH-008) | N/A |
| Entity – Status / Parent entity / State / Registration type | Segmented, multi-select, multi-select, segmented | Entity filters | Optional | N/A | N/A | See 5.3 | All / none / none / All | None | — | N/A |
| Search sub-entity or entity… | Search text | Sub-entity search | Optional | N/A | Requires Confirmation | Contains | Empty | None | — | N/A |
| Sub-entity – Status / Entity | Segmented, multi-select | Sub-entity filters | Optional | N/A | N/A | See 5.6 | All / none | None | — | N/A |
| Search trainer or SAP code… | Search text | SAP BP search | Optional | N/A | Requires Confirmation | Contains; codes searched only in columns in view | Empty | None | — | N/A |
| SAP BP – Entity / Mapping / Missing a code for | Multi-select, segmented, multi-select | SAP BP filters | Optional | N/A | N/A | See 5.9 | none / All / none | None | Entity choice changes the columns and counts | N/A |
| Search head, entity or GL code… | Search text | Expense head search | Optional | N/A | Requires Confirmation | Contains (head, GL code, entity, sub-entity) | Empty | None | — | N/A |
| Expense head – Status / Expense head / Entity / Sub-entity | Segmented, multi-selects | Expense head filters | Optional | N/A | N/A | See 5.10 | All / none / none / none | None | Sub-entity options narrow to chosen entities | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-FIN-001 | Unique invoice initial | Each entity's invoice initial is unique, ignoring case | Adding an entity | Checked on leaving the field and on save | Initial already used | "Another entity uses this initial" (on save, if missed: "Another entity already uses this invoice initial.") |
| BR-FIN-002 | Invoice initial is permanent | The initial cannot change after creation because issued invoices carry it | Editing an entity | Field is locked | — | Tooltip "Can’t be changed — issued invoices carry it" |
| BR-FIN-003 | Invoice initial format | Up to 6 letters or digits, upper case | Adding an entity | Other characters removed while typing | Invalid value | "Up to 6 letters or digits" |
| BR-FIN-004 | PAN format | 5 letters + 4 digits + 1 letter | Entity form | Checked | Wrong pattern | "PAN looks like ABCDE1234F" |
| BR-FIN-005 | CIN / LLPIN format | Company: 21-character CIN; LLP: LLPIN "AAA-1234" | Entity form | Checked against the selected type | Wrong pattern | "CIN is 21 characters" / "LLPIN looks like AAB-1234" |
| BR-FIN-006 | GSTIN format and PAN match | 15-character GSTIN whose characters 3–12 equal the PAN | Entity form | Checked | Wrong pattern / PAN mismatch | "GSTIN is 15 characters, e.g. 07AABCB1234K1Z9" / "GSTIN should contain the PAN" |
| BR-FIN-007 | Statutory documents required | PAN card, CIN/LLPIN certificate, LUT and GST certificate must be attached; logo and signature images too | Entity form | Save blocked until attached | Missing file | Field-specific "Upload …" messages (section 7) |
| BR-FIN-008 | Document file limits | Registration documents: PDF, JPG or PNG up to 5 MB. Logo and signature: image files up to 2 MB | Uploads | File rejected | Wrong type / too large | "Use a PDF, JPG or PNG file." / "File must be under 5 MB." / "Please choose an image file." / "Logo must be under 2 MB." |
| BR-FIN-009 | Indian pin code and phone | Pin code is 6 digits when Country is India; phone is 10 digits with "+91" | Entity form | Checked | Wrong length | "Pin code is 6 digits" / "Phone number is 10 digits" |
| BR-FIN-010 | Step-by-step checking | **Next** moves on only when the current step is valid; save checks every step and opens the first one with errors | Entity form | — | Errors on another step | Toast "Check the highlighted fields" — "N fields need a fix in \<step>." |
| BR-FIN-011 | No child entities on delete | An entity that other entities sit under cannot be deleted | Entity delete | Blocked before the confirmation dialog | Child entities exist | Toast "Can’t delete this entity yet" — "N entities sit under it — change their parent first." |
| BR-FIN-012 | No sub-entities on entity delete | An entity with sub-entities cannot be deleted | Entity delete (after confirming) | Blocked | Sub-entities exist | Toast "Couldn’t delete the entity" — "Sub-entities sit under this one — move or delete them first." |
| BR-FIN-013 | Program usage does not block delete [Requires Confirmation] | Deleting an entity or sub-entity is not checked against programs, facilitators or invoices | Delete | Deletion goes ahead | Programs use it | Programs show "Removed entity" / "Removed sub-entity" (OQ-FIN-006) |
| BR-FIN-014 | Sub-entity name unique within entity | Names are compared ignoring case and surrounding spaces, within the same entity only | Sub-entity form | Checked on blur and save | Duplicate | "This entity already has a sub-entity with this name" |
| BR-FIN-015 | No expense heads on sub-entity delete | A sub-entity used by expense heads cannot be deleted | Sub-entity delete | Blocked after confirming | Expense heads use it | Toast "Couldn’t delete the sub-entity" — "N expense heads use it — move or delete them first." |
| BR-FIN-016 | One GL code per head per sub-entity | An expense head + sub-entity pair is unique | Expense head form | Checked when both are chosen | Pair exists | "This sub-entity already has this expense head" |
| BR-FIN-017 | Sub-entity belongs to the chosen entity | The expense head form offers only the chosen entity's sub-entities | Expense head form | Changing entity clears sub-entity | — | Placeholder "Pick an entity first" / "No sub-entities yet" |
| BR-FIN-018 | New records are active | Entities, sub-entities and expense heads are created as Active; status can be changed only when editing | Add forms | — | — | — |
| BR-FIN-019 | Inactive entities and sub-entities are hidden from consumers | Only active entities are offered in the Manage Content program form and the facilitator "Onboarding for" field; only active sub-entities in the program form | Other modules | Inactive records not offered | — | — |
| BR-FIN-020 | Inactive records still offered inside Finance [Requires Confirmation] | Inactive entities can be chosen in the Sub-entity and Expense head forms; inactive sub-entities in the Expense head form (marked "Inactive") | Finance forms | Allowed | — | OQ-FIN-010 |
| BR-FIN-021 | SAP codes are read-only | SAP BP codes come from SAP | SAP BP | No add/edit/delete | — | Missing codes show "Not set" |
| BR-FIN-022 | Mapping counts follow the columns in view | "Fully mapped" means a code for every unit column currently shown | SAP BP | Pills and Mapping filter recount when the Entity filter changes | — | — |
| BR-FIN-023 | Unsaved-changes guard | Closing a changed modal asks to discard; the backdrop never closes these modals | All finance modals | Discard dialog | — | "Discard …?" dialogs (section 9) |
| BR-FIN-024 | Text clean-up | Sub-entity names and GL codes are trimmed on save; PAN, CIN/LLPIN, LUT, GSTIN and GL code have spaces removed and are upper-cased while typing. The entity name is not trimmed [Requires Confirmation] | Saving | — | — | OQ-FIN-014 |
| BR-FIN-025 | Session data | Data follows SH-001 | Always | Changes last until reload | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Entity added | Save succeeds | Success toast | "Entity added" — "\<name> (\<initial>)" | After save | — |
| Entity updated | Save succeeds | Success toast | "Entity updated" — "\<name> (\<initial>)" | After save | — |
| Entity save blocked | Errors on any step | Error toast | "Check the highlighted fields" — "1 field needs a fix in \<step>." / "N fields need a fix in \<step>." | On save | Fix fields |
| Entity save failed | Save rejected | Error toast | "Couldn’t add the entity" / "Couldn’t save the entity" — reason | On save | Retry |
| Entity delete blocked (children) | Child entities | Error toast | "Can’t delete this entity yet" — "N entities sit under it — change their parent first." | On bin click | Re-parent children |
| Entity deleted | Success | Success toast | "Entity deleted" — name | After confirm | — |
| Entity delete failed | Sub-entities exist | Error toast | "Couldn’t delete the entity" — "Sub-entities sit under this one — move or delete them first." | After confirm | Cancel; delete sub-entities first |
| Sub-entity added / updated | Success | Success toast | "Sub-entity added" / "Sub-entity updated" — name | After save | — |
| Sub-entity save failed | Rejected | Error toast | "Couldn’t add the sub-entity" / "Couldn’t save the sub-entity" — reason | — | — |
| Sub-entity deleted | Success | Success toast | "Sub-entity deleted" — name | After confirm | — |
| Sub-entity delete failed | Expense heads use it | Error toast | "Couldn’t delete the sub-entity" — "N expense heads use it — move or delete them first." | After confirm | Delete or move the expense heads |
| Expense head added / updated | Success | Success toast | "Expense head added" / "Expense head updated" — "\<head> · GL \<code>" | After save | — |
| Expense head save failed | Rejected | Error toast | "Couldn’t add the expense head" / "Couldn’t save the expense head" — reason | — | — |
| Expense head deleted | Success | Success toast | "Expense head deleted" — "\<head> · \<sub-entity>" | After confirm | — |
| Expense head delete failed | Rejected | Error toast | "Couldn’t delete the expense head" — reason | After confirm | Retry |
| File rejected | Wrong type / too large | Error toast | "Use a PDF, JPG or PNG file." / "File must be under 5 MB." / "Please choose an image file." / "Logo must be under 2 MB." | On upload | Choose another file |
| Discard prompt | Closing with changes | Confirmation dialog | Titles "Discard this entity?" / "Discard this sub-entity?" / "Discard this expense head?" / "Discard your changes?"; buttons **Keep editing**, **Discard** | On close | Choose |
| Search/filter active | At least one filter | Result line | "N of Total \<noun>" with chips and **Clear all** | Above the list | Remove chips or clear |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Entity search | Find | Contains, case-insensitive | Name, invoice initial, PAN, GSTIN, CIN/LLPIN, city, state | "No entities match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| Entity columns | — | Entity name, Parent entity, Created on, Invoice initial, Status — all sortable; actions column | Default: Entity name A–Z | Empty master: "No entities yet" / "Add the legal entities that bill programs." + **Add entity** |
| Sub-entity search | Find | Contains | Sub-entity name, entity name, entity invoice initial | "No sub-entities match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| Sub-entity columns | — | Sub-entity name, Entity, Created on, Status — sortable | Default: name A–Z | "No sub-entities yet" / "Add the units that sit under your entities." + **Add sub-entity** |
| SAP BP search | Find | Contains | Trainer name, codes in the columns in view | "No trainers match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| SAP BP columns | — | Trainer name + one column per unit (DOOR, Blanchard, LCPL, BYLD Consulting) — sortable | Default: Trainer name A–Z | "No trainers yet" / "Trainers and their SAP codes appear here once they're synced from SAP." (no action) |
| Expense head search | Find | Contains | Expense head, GL code, entity, sub-entity | "No expense heads match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| Expense head columns | — | Expense head, Entity, Sub-entity, GL code, Created on, Status — sortable | Default: Created on, newest first | "No expense heads yet" / "Add the GL code each kind of expense books to." + **Add expense head** |
| Pagination | — | SH-008 | 10 / 20 / 50 rows / All rows; default 10 | — |
| Filter chips | Show applied drawer filters | Removable | Entity: "Under \<parent>", "Top-level", state, "CIN"/"LLPIN". Sub-entity: entity name. SAP BP: unit name, "No \<unit> code". Expense head: head, entity, sub-entity names | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| Master empty | No records | Empty state with add action (none on SAP BP) | Section 10 messages | Add a record |
| No matches | Search/filter excludes all rows | Empty state | "No … match" + **Clear search & filters** | Click the button |
| Drawer draft matches nothing | Combination excludes all | Apply disabled | "No matching entities" / "No matching sub-entities" / "No matching trainers" / "No matching expense heads" | Change the draft or Reset |
| Load failure | Data cannot be loaded | Error state | "Couldn’t load data" / "Couldn’t load the list" + **Try again** | Retry |
| Entity is its own parent | In the demo data the group's top entity ("BYLD Group Learning Pvt Ltd") lists itself as parent | Its Parent entity column shows its own name; it is not counted as its own child; the drawer offers no "Top-level" option; in the edit form the parent picker does not offer the entity itself | — | OQ-FIN-001 |
| Delete chain | Every demo entity except the top one has sub-entities, and every demo sub-entity has at least one expense head | Deletes fail until the dependants are removed, bottom-up: expense heads → sub-entities → entity | Section 9 messages | Remove dependants first |
| Deleted entity / sub-entity still referenced | Program or expense head refers to a removed record | Programs show "Removed entity" / "Removed sub-entity"; lists here show "—" | — | OQ-FIN-006 |
| Sub-entity moved to another entity | A sub-entity's Entity is changed while expense heads use it | Expense heads keep the old entity, so Entity and Sub-entity columns can disagree | — | OQ-FIN-007 |
| Entity with no sub-entities in expense head form | Chosen entity has none | Sub-entity disabled | Placeholder "No sub-entities yet" | Add a sub-entity first |
| Non-India entity | Country other than India | Pin code accepts any characters up to 10; phone still "+91" and 10 digits; PAN, GSTIN still required | — | OQ-FIN-005 |
| Switching Company ↔ LLP | User toggles registration type | Number is cleared; certificate kept | — | Re-enter the number |
| Saving while saving | Double click | Save button shows a spinner and is disabled (SH-007) | — | Wait |
| Long names | Long entity / sub-entity names | Truncated on one line; full name on hover | — | — |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Settings hub ([settings-hub-prd.md](settings-hub-prd.md)) | Entry point; group "Finance" — "Billing entities, SAP partners and expense heads." Items: Entity ("Legal entities that bill programs"), Sub-entity ("Units under each entity"), SAP BP ("SAP business partner codes"), Expense head ("Cost categories for programs") | Open a master | Page opens and is added to "Recently opened" | — |
| Manage Content ([manage-content-prd.md](manage-content-prd.md)) | The program form's Entity and Sub-entity choices come from these masters (active entities; active sub-entities of the chosen entity). Programs store the link, so renames show up in programs | Add / edit / deactivate / delete an entity or sub-entity | Inactive records disappear from the program form; deleted ones show as "Removed entity" / "Removed sub-entity" on programs; deletion is not blocked | BR-FIN-013, BR-FIN-019, OQ-FIN-006 |
| Facilitators ([facilitators-prd.md](facilitators-prd.md)) | "Onboarding for" offers active entities; facilitator lists, filters and the verification page show entity names from active entities only | Deactivate or delete an entity | The entity is no longer offered, and facilitators already onboarded for it show "—" in its place | BR-FIN-019, OQ-FIN-015 |
| Dashboard ([dashboard-prd.md](dashboard-prd.md)) [Partially Implemented] | "Billing by entity" widget shows invoiced share per entity | — | Uses its own demo figures and short names (for example "Blanchard (B)", "DOOR Training (D)"), not the Entity master; changes here do not affect it | OQ-FIN-011 |
| All Clients / Add client ([clients-prd.md](clients-prd.md)) | The Add client form captures no entity or sub-entity | — | No link | OQ-FIN-011 |
| Client detail – Projects tab ([client-detail-prd.md](client-detail-prd.md)) | "Delivered by" shows sub-entity names stored with each project, not linked to this master | — | Renames here do not change project data | OQ-FIN-011 |
| SAP BP ↔ Entity / Facilitators [Partially Implemented] | SAP BP units (DOOR, Blanchard, LCPL, BYLD Consulting) and trainers are a separate fixed list, not linked to the Entity master or the Facilitators list | Add an entity or a facilitator | No new column / row appears in SAP BP | OQ-FIN-009 |
| Location masters ([settings-location-masters-prd.md](settings-location-masters-prd.md)) | The entity address uses the client form's country/state/city list, not the Location masters | — | Countries offered differ from the Country master | OQ-FIN-005 |
| Expense head consumers | No other page uses expense heads or GL codes yet | — | None | OQ-FIN-011 |

## 13. Acceptance Criteria

**AC-FIN-001: Add an entity in three steps**
- Given the Admin opens **Add entity**
- When they complete Details, Registration and Tax & billing with valid values and all documents, and click **Save entity**
- Then the toast "Entity added" — "\<name> (\<initial>)" appears, the modal closes and the entity appears as Active
- And its invoice initial is stored in upper case

**AC-FIN-002: Next checks only the current step (negative)**
- Given the Details step is empty
- When the Admin clicks **Next**
- Then "Enter the entity’s legal name", "Enter an invoice initial" and "Upload a logo" appear and the step does not change

**AC-FIN-003: Duplicate invoice initial (negative)**
- Given an entity with initial "BYLD" exists
- When the Admin types "byld" in Invoice initial and leaves the field
- Then the value shows "BYLD" and the error "Another entity uses this initial" appears

**AC-FIN-004: Invoice initial locked on edit**
- Given an existing entity is opened for editing
- When the Admin views the Details step
- Then the initial is shown locked with the tooltip "Can’t be changed — issued invoices carry it"

**AC-FIN-005: GSTIN must contain the PAN (negative)**
- Given PAN "AABCB1234K"
- When the GSTIN "07AAHFB5678M1Z2" is entered
- Then "GSTIN should contain the PAN" appears and the entity cannot be saved

**AC-FIN-006: Save jumps to the first step with errors**
- Given an entity being edited with a cleared PAN, while the Admin is on Tax & billing
- When they click **Save changes**
- Then the Registration step opens with "Enter the PAN" and the toast "Check the highlighted fields" — "1 field needs a fix in Registration."

**AC-FIN-007: Entity delete blocked by child entities (negative)**
- Given "BYLD Group Learning Pvt Ltd" is the parent of 5 other entities
- When the Admin clicks its bin icon
- Then no dialog opens and the toast "Can’t delete this entity yet" — "5 entities sit under it — change their parent first." appears

**AC-FIN-008: Entity delete blocked by sub-entities (negative)**
- Given "Leadership Consulting India LLP" has the sub-entity "LCPL"
- When the Admin confirms **Delete**
- Then the toast "Couldn’t delete the entity" — "Sub-entities sit under this one — move or delete them first." appears and the entity remains

**AC-FIN-009: Sub-entity name unique within an entity (negative)**
- Given "BYLD Learning" exists under "BYLD Group Learning Pvt Ltd"
- When the Admin adds " byld learning " under the same entity
- Then "This entity already has a sub-entity with this name" appears
- And the same name under a different entity is accepted

**AC-FIN-010: Sub-entity delete blocked by expense heads (negative)**
- Given the sub-entity "LCPL" has 2 expense heads
- When the Admin confirms its deletion
- Then the toast "Couldn’t delete the sub-entity" — "2 expense heads use it — move or delete them first." appears

**AC-FIN-011: Expense head pair unique (negative)**
- Given "Revenue Invoice" exists for sub-entity "Blanchard"
- When the Admin chooses Revenue Invoice + Blanchard Research and Training India LLP + Blanchard
- Then "This sub-entity already has this expense head" appears under Sub-entity

**AC-FIN-012: Sub-entity follows entity**
- Given the expense head form with an entity and sub-entity chosen
- When the Admin changes the Entity
- Then the Sub-entity is cleared and only the new entity's sub-entities are offered

**AC-FIN-013: SAP BP is read-only and shows gaps**
- Given the SAP BP page
- When it loads
- Then there is no Add button and no row actions, and missing codes show "Not set"
- And "Fully mapped" + "Missing codes" equal "All trainers"

**AC-FIN-014: SAP BP entity filter narrows columns**
- Given the SAP BP drawer
- When the Admin selects only "Blanchard" and applies
- Then only the Trainer name and Blanchard columns show and the pills count mapping over Blanchard only

**AC-FIN-015: Unsaved changes guard**
- Given a finance modal with changes
- When the Admin presses Esc or clicks **Cancel**
- Then a "Discard …?" dialog appears with **Keep editing** and **Discard**
- And clicking the backdrop does not close the modal

**AC-FIN-016: Inactive entity hidden from programs**
- Given an entity is switched to Inactive and saved
- When the Admin opens the Manage Content program form
- Then that entity is not offered as an Entity choice

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-FIN-001 | 5.2 | Entity pill counts | Fresh reload | Demo data, 2026-10-29 | All 6, Active 5, Inactive 1 (DOOR Training and Consulting India Pvt Ltd), New this month 0 | P2 |
| TC-FIN-002 | AC-FIN-001 | Add entity happy path | — | Name "Test Learning Pvt Ltd", initial "TLP1", PAN "AAACT1234Z", CIN "U80301DL2009PTC193221", LUT "AD000000000001A", Delhi / New Delhi, pin "110001", phone "9876543210", GSTIN "07AAACT1234Z1Z5", all files | "Entity added"; Active row | P1 |
| TC-FIN-003 | AC-FIN-002 | Step 1 required errors | Add modal | Click **Next** empty | Three errors; stays on Details | P1 |
| TC-FIN-004 | AC-FIN-003 | Duplicate initial | — | "byld" | Shows "BYLD"; "Another entity uses this initial" | P1 |
| TC-FIN-005 | 7.1 | Initial character filter | — | Type "ab-c 12345" | Field shows "ABC123" (6 max) | P2 |
| TC-FIN-006 | BR-FIN-004 | PAN format | — | "ABCD1234F" | "PAN looks like ABCDE1234F" | P1 |
| TC-FIN-007 | BR-FIN-005 | CIN / LLPIN format | — | Company "U123"; LLP "AAB1234" | "CIN is 21 characters"; "LLPIN looks like AAB-1234" | P1 |
| TC-FIN-008 | 7.2 | Toggle clears number | CIN typed | Click **LLP** | Number empty; certificate kept; label "LLPIN" | P2 |
| TC-FIN-009 | AC-FIN-005 | GSTIN/PAN mismatch | PAN "AABCB1234K" | GSTIN "07AAHFB5678M1Z2" | "GSTIN should contain the PAN" | P1 |
| TC-FIN-010 | BR-FIN-008 | Document upload limits | Registration step | 6 MB PDF; a .docx | "File must be under 5 MB."; "Use a PDF, JPG or PNG file." | P1 |
| TC-FIN-011 | BR-FIN-008 | Logo/signature limits | — | 3 MB PNG; a PDF | "Logo must be under 2 MB."; "Please choose an image file." | P2 |
| TC-FIN-012 | BR-FIN-009 | Pin and phone | Country India | Pin "1100"; phone "98765" | "Pin code is 6 digits"; "Phone number is 10 digits" | P2 |
| TC-FIN-013 | 7.3 | Country change clears state/city | State and city chosen | Change Country to Singapore | State and City cleared; pin accepts letters up to 10 | P3 |
| TC-FIN-014 | AC-FIN-006 | Save from edit jumps to bad step | Edit an entity | Clear PAN, go to step 3, **Save changes** | Opens Registration; toast "1 field needs a fix in Registration." | P2 |
| TC-FIN-015 | AC-FIN-004 | Initial locked; Save appears on change | Edit "Crucial Learning India Pvt Ltd" | Toggle Status | Initial locked; **Save changes** appears; "Entity updated" | P2 |
| TC-FIN-016 | AC-FIN-007 | Delete blocked by children | — | Delete "BYLD Group Learning Pvt Ltd" | Toast "5 entities sit under it — change their parent first." | P1 |
| TC-FIN-017 | AC-FIN-008 | Delete blocked by sub-entities | — | Delete "Leadership Consulting India LLP" → **Delete** | "Couldn’t delete the entity"; dialog stays open | P1 |
| TC-FIN-018 | BR-FIN-013 | Delete entity used by a program | Entity with no sub-entities used by a program (requires setup) | Delete it | Deleted; program shows "Removed entity" | P2 |
| TC-FIN-019 | 5.3 | Entity filters | — | Registration type "LLPIN (LLP)" | "Show 2 entities"; chip "LLPIN" | P3 |
| TC-FIN-020 | 5.5 | Sub-entity pill counts | Fresh reload | — | All 12, Active 11, Inactive 1 (LOVEINSTORE Services), New this month 0 | P2 |
| TC-FIN-021 | AC-FIN-009 | Sub-entity duplicate within entity | — | " byld learning " under BYLD Group Learning Pvt Ltd; then under BYLD Consulting India Pvt Ltd | Error first time; saved second time | P1 |
| TC-FIN-022 | AC-FIN-010 | Sub-entity delete blocked | — | Delete "LCPL" | "2 expense heads use it — move or delete them first." | P1 |
| TC-FIN-023 | 7.4 | Inactive entity marked in sub-entity form | — | Open Entity list in Add sub-entity | DOOR entity described "DOOR · Inactive" | P3 |
| TC-FIN-024 | 5.8 | SAP BP counts | Fresh reload | — | All 15, Fully mapped 7, Missing codes 8 | P2 |
| TC-FIN-025 | AC-FIN-014 | SAP BP entity filter | — | Entity "Blanchard" | Only Blanchard column; pills recount | P2 |
| TC-FIN-026 | 5.9 | Missing a code for | — | "LCPL" | Chip "No LCPL code"; only trainers without an LCPL code | P3 |
| TC-FIN-027 | 5.10 | Expense head counts and default sort | Fresh reload | — | All 25, Active 23, Inactive 2; newest first | P2 |
| TC-FIN-028 | AC-FIN-011 | Duplicate pair | — | Revenue Invoice + Blanchard | "This sub-entity already has this expense head" | P1 |
| TC-FIN-029 | AC-FIN-012 | Entity change clears sub-entity | Entity + sub chosen | Change Entity | Sub-entity cleared; list narrowed | P2 |
| TC-FIN-030 | 7.5 | GL code input | — | "4113 0015 abc" | Shows "41130015ABC"; max 20 characters | P3 |
| TC-FIN-031 | 7.5 | Comment limit | — | 260 characters | Stops at 250; counter shown | P3 |
| TC-FIN-032 | 5.10 | Expense head filter cascade | Drawer | Pick entity, then sub-entity, then remove entity | Sub-entity removed from draft | P3 |
| TC-FIN-033 | AC-FIN-015 | Discard guard | Any modal with changes | Esc; backdrop click | Discard dialog; backdrop does nothing | P2 |
| TC-FIN-034 | AC-FIN-016 | Inactive entity hidden from program form | Deactivate an entity | Open Manage Content › Add program | Entity not offered | P1 |
| TC-FIN-035 | OQ-FIN-015 | Facilitator shows "—" for inactive entity | Deactivate an entity a facilitator is onboarded for | Open Facilitators | Entity shown as "—" | P2 |
| TC-FIN-036 | 5.1 | Pagination and phone cards | 375 px width | Expense head list | Cards; pager "‹ 1 / 3 ›" | P3 |

## 15. Open Questions and Gaps

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

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and key actions: Complete
- [x] User roles and access: Complete (no role enforcement, SH-002)
- [x] Fields, including document uploads, search and filters: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (text lengths and LUT format not defined, see OQ-FIN-003, OQ-FIN-004)
- [x] Validation and business rules: Complete
- [x] Success, error and empty messages: Complete
- [x] Search, filters, tables and listings: Complete
- [ ] Delete and dependency rules: Incomplete (delete not checked against programs/facilitators, see OQ-FIN-006, OQ-FIN-007)
- [ ] Cross-module data links: Incomplete (Dashboard, clients, SAP BP and expense heads not linked, see OQ-FIN-009, OQ-FIN-011)
- [ ] Status (Active/Inactive) behaviour: Incomplete (see OQ-FIN-010, OQ-FIN-015)
- [ ] Non-Indian entity rules: Incomplete (see OQ-FIN-005)
- [x] Acceptance criteria and QA scenarios: Complete
