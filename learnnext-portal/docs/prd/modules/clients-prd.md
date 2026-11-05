# All Clients: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | All Clients PRD |
| Module name | All Clients (client list, Add client, Edit client) |
| Document ID | PRD-CLI |
| Version | 1.3 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Implemented (the CRM portal connection is simulated with demo data — SH-001) |
| Last updated | 2026-11-05 (v1.3: naming: "Training Partner" replaces "Admin"; Super Admin access row; "Client added" / "Changes saved" toasts appear once All Clients has loaded) · 2026-11-03 (v1.1: phone layout; v1.2: phone card spacing matches the other lists) |
| Phone layout (v1.1–1.2) | All Clients on phones: one card per client in the table's default order, whole card opens the client; cards 12 px apart and aligned with the search box at the page edge, the same as every other card list; summary pills not shown (the filter drawer's Status covers them); icon-only Filters / Add beside the search. See SH-008, SH-013. |
| Related modules/pages | [client-detail-prd.md](client-detail-prd.md) (Client details page), [app-shell-navigation-prd.md](app-shell-navigation-prd.md), [authentication-prd.md](authentication-prd.md), [settings-location-masters-prd.md](settings-location-masters-prd.md), [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md), [settings-finance-masters-prd.md](settings-finance-masters-prd.md), [dashboard-prd.md](dashboard-prd.md), [support-desk-prd.md](support-desk-prd.md), [facilitators-prd.md](facilitators-prd.md), [../shared-requirements.md](../shared-requirements.md) |

## 2. Purpose and Objective

The All Clients module is where a Training Partner user finds, adds and maintains LearnNext's clients. A client is either a **company** (an organisation whose teams are trained) or an **individual** (one person who is trained and billed directly).

Objectives:

- Give a single, searchable and filterable list of every client with its code, contact number, creator, creation date and status, and a one-click way into each client's details page.
- Let a Training Partner user add a client through a short guided form (Training for → Details → Addresses → Billing) that captures everything needed to train and invoice the client, including GST registrations and Lower TDS certificates.
- For companies, avoid re-typing: picking a company from the CRM portal list fills every step of the form, and companies already on file cannot be added twice.
- Let a Training Partner user correct any client's details, and change its status, through the same form (Edit client).
- Protect typed work: leaving the form with unsaved changes asks for confirmation.

Everything else about a single client (projects, participants, SPOCs, settings, activity) lives on the Client details page ([client-detail-prd.md](client-detail-prd.md)).

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| All Clients list (`/clients`) | See and find every client | Training Partner user | Filter by status pill, search, open Filters, sort, page, open a client, edit a client, add a client | Client details, Add client, Edit client |
| Filter clients drawer | Narrow the list by status, creation date, creator and company details | Training Partner user | Choose filters, Reset, Show N clients | All Clients list |
| Client cards (phones) | Readable list on small screens | Training Partner user | Open a client, edit a client, page | Client details, Edit client |
| Add client (`/clients/new`) | Create a company or individual client in four steps | Training Partner user | Choose Company / Individual, pick a CRM company, fill details, addresses and billing, Save client, Cancel | All Clients list |
| Edit client (`/clients/:id/edit`) | Change an existing client's details and status | Training Partner user | Open any step, edit, change status, Save changes, Cancel | All Clients list, Client details |
| CRM portal fetch (Add client, companies) | Fill every step from the CRM portal | Training Partner user | Pick a company from the Company name list | Add client |
| File preview window | View an uploaded document or logo | Training Partner user | Open in new tab, Download | Add / Edit client |
| Client not found (Edit client) | Explain a bad edit link | Training Partner user | Go back to All clients | All Clients list |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Training Partner user (signed in and continuing as Training Partner) | Full access to the list, Add client and Edit client (SH-002, SH-003) | View, search, filter, add and edit any client, change a client's status | No role-based restriction is enforced (SH-002). There is no way to delete a client, export the list or act on several clients at once. |
| Super Admin | Not these pages. In the Super Admin portal the same addresses open Super Admin's own Manage Clients list and client page, which list training-partner companies ([super-admin-prd.md](super-admin-prd.md)) | — | — |
| Client SPOC, participant | No access. They are records on these pages; their own portals are not built yet ("Coming soon", SH-002) | N/A | N/A |
| Signed-out visitor | Redirected to Sign in (SH-003) | None | N/A |

## 5. Page Functionality and Behavior

### 5.1 All Clients list — page and toolbar

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Page address and breadcrumb | Identify the page | Click **All Clients** in the sidebar | Breadcrumb shows **All Clients**; browser tab title "All Clients · <app name>" (SH-009). No title block | — | List page shows |
| List card | Hold the toolbar and the list | View | One card: toolbar on top, then the table (tablet and wider) or cards (phones, below 768 px). The card stretches to the window height on large screens | — | — |
| Summary pills | Show counts and filter by status in one click | Click a pill | **All clients** (total), **Active**, **Inactive** filter the list to that status; the pressed pill gets a soft coloured ring. **New this month** is a count only and cannot be clicked | Counts always reflect the whole list, not the current search or filters. **All clients** is never highlighted (it is the resting state). Tooltips: "Show all clients (+N this year)", "Show active clients", "Show inactive clients". See 7.1 and BR-CLI-003 | List filtered by status |
| Search box | Find clients quickly | Type | Filters the list as the user types (short delay). Matches name, code or mobile number (7.1) | On medium-width toolbars the box becomes a search icon; clicking it slides the field in over the pills, with a close (×) button "Close search"; Esc in that field clears the search and closes it (SH-008) | List narrows |
| **Filters** button | Open the filter drawer | Click | Opens **Filter clients** (5.2). Shows a count badge with the number of active filter chips (the status chip counts too) | On phones it is an icon button with a small corner badge, labelled "Filters" or "Filters (N applied)" | Drawer opens |
| **Add client** button | Add a client | Click | Opens Add client (5.4) | At the right end of the toolbar, after a divider. On phones it is a "+" icon button labelled "Add client" | Add client page |
| Result line and chips | Show what is narrowing the list | View / click × / **Clear all** | While searching or filtering: "**N** of **T** clients", one removable chip per filter ("Remove filter <label>") and **Clear all** | **Clear all** resets every filter **and** the search. Removing the status chip returns to **All clients** | Filter removed / all cleared |
| Export, bulk actions, delete [Not Implemented] | — | — | The list has no Export button, no row selection and no delete action | OQ-CLI-001 | — |

### 5.2 Filter clients drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Choose filters | Open from **Filters** | Title "Filter clients", description "By company, contact, creator or date". Four sections as small cards: **Status**, **Created**, **Created by**, **Company details** (7.2) | Starts from the filters currently applied. Changes are a draft until applied; closing (×, Esc, backdrop — SH-006) discards the draft | — |
| Section **Clear** links | Clear one section | Click **Clear** | Resets that section in the draft (Company details clears name, code and mobile together) | Shown only when the section has a value | — |
| **Created** presets | Pick a creation period | Click a chip | **Any time**, **Last 7 days**, **Last 30 days**, **Last 90 days**, **This year**, **Custom**. **Custom** reveals a date range picker | One chip selected at a time | — |
| Company name suggestions | Find a company by part of its name or code | Type in Company name | A list "Matching companies" shows up to 6 clients whose name or code contains the text: logo, name (typed part highlighted), "code · city". Click or Enter picks one and fills its exact name; ↑/↓ move; Esc closes the list (not the drawer) | The list hides when the only match is already the exact name. Free text still works as a "contains" filter | Name filled |
| **Reset** | Clear the draft | Click | Clears every section in the draft, including Status | Does not apply until the main button is clicked; does not clear the toolbar search | — |
| **Show N client(s)** | Apply | Click | Applies the draft and closes the drawer | Live count of matching clients, including the current toolbar search. When nothing matches, the button reads "No matching clients" and is disabled | Filters applied; chips appear |

### 5.3 Client table and cards

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Table (768 px and wider) | List clients | Sort, page, click | Columns in section 10. Header stays visible while scrolling. Default order: newest created first | Lower-priority columns hide as the screen narrows so the edit button always stays visible | — |
| Row click | Open a client | Click anywhere on a row | Opens Client details ([client-detail-prd.md](client-detail-prd.md)) | Hovering a row shows a slim blue bar on its left edge, turns the name blue and slides in an arrow cue | Client details |
| Client name link | Open a client (keyboard / new tab) | Click or open in a new tab | Opens Client details | The name is truncated with the full name on hover | Client details |
| Edit (pencil) | Edit a client | Click "Edit <client name>" | Opens Edit client for that client without opening the row | Available on every row and card | Edit client page |
| Client logo | Identify the client | View | The uploaded logo on a white tile, or a coloured two-letter monogram when there is no logo | Monogram skips legal words such as "Ltd", "Pvt", "India", "The" (for example "Tata Steel Ltd" → "TS"); the colour stays the same for a client | — |
| Cards (phones, below 768 px) | Readable list on phones | Tap a card / pencil | Each card: logo, name, "industry · city", code chip, status, edit pencil; then mobile number, creator and created date. Tapping anywhere on the card opens the client | 12 cards per page; the pager shows only when there are more than 12. No sorting and no page-size choice on phones | Client details |
| Pagination (table) | Page through clients | Click arrows, choose rows per page | 10 rows per page; choices "10 rows", "20 rows", "50 rows", "All rows" (SH-008) | Returns to page 1 when the result count changes | — |
| Loading | — | Open the page | Skeleton rows (table) or skeleton cards (phones); the summary pills show a skeleton bar (SH-007) | — | — |

### 5.4 Add client / Edit client — page frame

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Page address and breadcrumb | Identify the page | Click **Add client** / an edit pencil | Breadcrumb **All Clients › Add client** or **All Clients › Edit client**; tab title "Add client · <app name>" / "Edit client · <app name>" (SH-009) | The **All Clients** crumb is guarded (5.9) | — |
| Steps panel (1280 px and wider) | Show progress and jump between steps | View / click a step | Heading "New client" or "Edit client". Line under it: "Takes about two minutes." (no type chosen), "4 quick steps for a company." / "4 quick steps for an individual.", "Pre-filled from the CRM portal — just review." (after a CRM fetch) or "Open any step to make changes." (edit). Steps: **Training for** "Company or individual"; **Details** "Company & contact" / "Participant & contact"; **Addresses** "Communication & office"; **Billing** "Addresses, GST & TDS" / "GST & TDS". Finished steps show a tick; the current step is highlighted. Note at the bottom: "Fields marked * are required. You can go back to any finished step." (add) / "… Save changes checks every step." (edit) | Add: only the current and earlier steps can be clicked; clicking an earlier step does not validate. Edit: every step except **Training for** can be clicked (tooltip "The training type can’t be changed"). After a CRM fetch, each step except Training for shows a small CRM marker "Pre-filled from CRM portal". The panel stays in place while long steps scroll | Step opens; page scrolls to top |
| Compact progress (below 1280 px) | Show progress | View | Card with the step name, "Step X of 4" and four bars | Not clickable | — |
| Action bar | Move through the form | Click | Joined to the bottom of the step card. Left: **Back** (from the second step in add mode; from the third step in edit mode) and **Cancel**. Right: add mode — **Continue** (steps 2–3) or **Save client** (last step); edit mode — **Next** (secondary, not on the last step) and **Save changes** (every step) | Step 1 (Training for) has no Continue button — choosing a card moves on. **Back**, **Cancel** and **Next** are disabled while saving; **Continue** is disabled while a CRM fetch runs; the save buttons show a spinner while saving (SH-007) | — |
| **Continue** / **Next** | Go to the next step | Click (or press Enter in a text field on Details or Addresses) | Checks the current step. If valid, opens the next step; otherwise shows all of the step's errors and focuses the first invalid field | Enter does nothing on the Billing step | Next step or errors |
| **Cancel** | Leave the form | Click | Returns to All Clients; asks first when there are unsaved changes (BR-CLI-030) | Edit mode also returns to All Clients, not to Client details (OQ-CLI-009) | All Clients |
| Client not found (edit) | Explain a bad edit link | Open an edit address for an unknown client | Card "Client not found" / "It may have been removed, or the link is out of date." with an **All clients** button | No form is shown | All Clients on click |

### 5.5 Step 1 — Training for

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Step card | Decide which details are asked | View | Title "Who is the training for?", description "This decides which details we ask for next." | Add mode only; in edit mode the type is fixed | — |
| **Company** card | Choose a company client | Click | Text "An organisation and its teams" and the list "Company type, industry & contacts", "Communication & office address", "Billing addresses, GST & TDS". Tag "Auto-filled from CRM" (tooltip "Pick the company — details, addresses, GST, documents & logo are fetched for you.") | Selecting it moves straight to Details | Details step (company) |
| **Individual** card | Choose an individual client | Click | Text "One person, billed directly" and the list "Name, email, mobile & Govt. ID", "Communication address", "GST & TDS (if applicable)" | Selecting it moves straight to Details | Details step (individual) |
| Changing the type | — | Go back and pick the other card | The form switches to the other type's fields; values typed for the first type stay hidden but are kept [Inferred] | OQ-CLI-012 | — |

### 5.6 Step 2 — Details

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Company details** card (company) | Identity of the company | Fill fields | Description "How the company appears across LearnNext." Fields: Company name, Company code (read only), Company type, Industry, Website, Special Economic Zone, and SEZ number + SEZ document when SEZ is Yes (7.4) | — | — |
| Company name list | Pick a known company or add a new one | Click or type in Company name | Opens a list of up to 8 companies (A–Z) from the CRM portal and existing clients that contain the typed text (typed part highlighted). In add mode the list carries the heading "CRM portal · picks auto-fill every step". Existing clients are tagged "Already a client". When the text matches no entry exactly, the last item is "Add “<text>” as a new company" | Helper text in add mode: "Pick from the CRM portal to auto-fill all steps". Keyboard: ↓/↑, Enter, Esc | Name filled |
| Picking a CRM company (add mode) | Fill the whole form | Pick a company that is not already a client | Starts the CRM fetch (5.7) | Picking an existing client or "Add … as a new company" only fills the name. Edit mode never fetches | — |
| Duplicate company | Prevent adding a company twice | Type or pick a name already on file | "This company is already in All Clients" shows under the field immediately (no need to leave the field) and Continue is blocked | Case-insensitive, surrounding spaces ignored. Compared against every client's name, including individual clients. In edit mode the client's own name is excluded | BR-CLI-010 |
| **Contact** card (company) | Numbers to reach the company | Fill fields | Description "Numbers we can reach the company on." Mobile number and Phone number (STD code + number) | — | — |
| **Participant details** card (individual) | Identity of the person | Fill fields | Description "The person who will attend the training." Participant name (focused on open), Participant ID (read only), Email, Mobile number (7.5) | — | — |
| **Identity & role** card (individual) | Optional records | Fill fields | Description "Optional — helps with records and certificates." Govt. ID with ID proof upload, Department, Designation | All optional | — |
| Code field | Show the client's code | View | **Company code** / **Participant ID**, read only, helper "Generated automatically" | New: "CMP" + 3-digit sequence for companies, "PRT" + sequence for individuals (for example CMP031). Edit: the client's existing code | BR-CLI-012 |
| **Status** card (edit only) | Activate or deactivate | Toggle | Description "Inactive clients stay on file but don’t appear in new schedules." Switch label "Active client" / "Inactive client" with help "Turn off to mark this client inactive." / "Turn on to make this client active again." | Same status as the Settings & Configuration section of Client details. Saved with **Save changes** | BR-CLI-025 |
| **Company logo** / **Photo or logo** card | Visual identity | Upload, view, change, remove | Description "Shown next to the client across LearnNext." Empty: a dashed tile and **Upload logo** / **Upload image** with hint "Optional · PNG, JPG or SVG, up to 2 MB". With an image: the tile shows it (click "View full size" opens the preview), buttons **Change** and **Remove** | 7.6 | — |
| Document uploads | Attach supporting files | Click / drag a file | Drop zone "Upload <document>" with "PDF, JPG or PNG · max 5 MB" and **Browse**. Once attached: a file row with the file name (click to preview), "PDF" or "Image" · size · "Uploaded" (or "From CRM"), **Replace** and **Remove** icons | Remove takes effect at once, without confirmation. Errors replace the hint in red and also show as an error toast (BR-CLI-020) | — |

### 5.7 CRM portal fetch (Add client, company)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Fetch card | Show progress | Pick a CRM company | A card "Fetching from CRM portal…" / "Pulling everything we have on <company>" with a percentage, a progress bar and four stages ticked off in turn: **Company profile** "Type, industry, website & contacts", **Addresses** "Communication & office", **Billing & GST** "Billing addresses and GST numbers", **Documents & logo** "GST & TDS certificates, logo" | Lasts at least about 2 seconds. The rest of the Details step is dimmed and cannot be used; **Continue** is disabled. Picking another company restarts the fetch for the new one | — |
| Fetch success | Fill the form | — | Every step is filled: company type, industry, website, SEZ (and SEZ number and document when Yes), mobile, STD code and phone, logo, communication and office addresses, billing addresses with GST numbers and certificates, and Lower TDS details when the company has them. Shown errors are cleared. Toast "Fetched from CRM portal" (BR-CLI-015) | Documents from the CRM show a "From CRM" tag | Form pre-filled |
| CRM banner | Remind the user to review | View steps 2–4 | Strip "<Step> pre-filled from CRM portal · <company> · review and edit anything that’s changed." with a "Synced" tag | Shown only while the Company name still equals the fetched company; changing the name hides the banner but keeps the fetched values | — |
| Fetch failure | — | — | Error toast "Couldn’t reach the CRM portal" with the reason (for example "This company isn’t in the CRM portal."); the form is unlocked and nothing is filled | — | — |
| Real CRM connection [Requires Confirmation] | — | — | The CRM portal is simulated: 25 named companies are available and their details are generated sample data (SH-001) | OQ-CLI-011 | — |

### 5.8 Step 3 — Addresses and Step 4 — Billing

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Communication address** card | Where letters and certificates go | Fill fields | Description "Where we send letters and certificates." Address line 1, Address line 2, Country, State, City, Pin code / Postal code (7.7) | Country → State → City narrow each other | — |
| Office address checkbox | Avoid typing the same address twice | Tick / untick | "Office address is the same as the communication address" — ticked by default. Unticking shows the **Office address** card ("Where the client’s team works.") with the same fields | Office fields are checked only while it is unticked | — |
| **Billing addresses** card (company) | One address per GST registration | Add, edit, delete | Description "Add one for each GST registration the company is billed under." Saved addresses show as cards (5.8.1); an add/edit panel collects a new one | A company must have at least one saved billing address (BR-CLI-021) | — |
| **GST** card (individual) | Individual's GST registration | Fill | Description "Only if the participant is GST registered." GST No. and an optional GST certificate upload (7.9) | — | — |
| **Lower TDS** card (both) | Lower TDS certificate details | Toggle and fill | Description "Only if a lower TDS certificate applies." Switch "Do you have Lower TDS details?" / "Turn on if the client has a lower TDS certificate." Switching on reveals rate, amount, section, validity dates and certificate (7.10) | Switching off hides the fields; they are no longer checked | — |
| **Save client** (add) | Create the client | Click | Checks the Billing step, then that a company has a billing address, then saves (spinner). On success the user returns to All Clients, where the new client is first in the default order, and the toast "Client added" appears once the list has loaded (SH-005) | New clients are always **Active**; the creator is the signed-in user's name ("You" if no name) | BR-CLI-024 |
| **Save changes** (edit) | Save edits | Click on any step | Checks every step; opens the first step with problems and shows toast "Check the highlighted fields". Then checks a company has a billing address. Then saves (spinner) and returns to All Clients; the toast "Changes saved" appears once the list has loaded (SH-005) | Always enabled, even with no changes (OQ-CLI-009) | BR-CLI-026 |

#### 5.8.1 Company billing addresses

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Add/edit panel | Enter one billing address | Fill and save | Heading "Billing address" (first), "Another billing address" or "Edit billing address". Address fields, **Company GST No.** and a required GST certificate upload (7.8) | Opens automatically when the company has no saved billing address | — |
| **Use communication address** | Copy the communication address | Click | Copies line 1, line 2, country, state, city and pin from the communication address into the panel | Overwrites what is in the panel's address fields; the GST fields are untouched | — |
| **Save address** / **Update address** | Keep the address | Click | Checks the panel; if valid, adds (or updates) the address card and closes the panel; otherwise shows the panel's errors and focuses the first | Errors in this panel appear only after this click (differs from the rest of the form) | Card added |
| **Cancel** (panel) | Close the panel | Click | Closes without saving | Shown only when at least one address is saved, or when editing an address | — |
| Saved address card | Review an address | View | "Billing address N", lines 1–2, "city, state, pin" (plus the country when not India), the GSTIN and the certificate name (click opens the preview) | Numbered in the order added | — |
| Edit (pencil) | Change an address | Click "Edit billing address" | Opens the panel with that address | Any unsaved panel content is replaced without warning | — |
| Delete (bin) | Remove an address | Click "Delete billing address" | Dialog "Delete this billing address?" with "<line 1, line 2> · <GSTIN>", **Cancel** and red **Delete** (SH-006) | — | Card removed |
| **Add another billing address** | Add one more | Click | Opens an empty panel | Shown when the panel is closed. No maximum number of addresses | — |
| Unsaved panel | — | Leave the step or save the client | Content of an open, unsaved panel is not kept and not saved (BR-CLI-023) | No warning | — |

### 5.9 Unsaved-changes guard

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Leave confirmation | Protect typed work | Click **Cancel**, a sidebar link, the **All Clients** breadcrumb, a global-search result, or **My Profile** / **Settings** in the user menu | With unsaved changes: dialog "Discard this client?" / "The details you’ve entered won’t be saved." (add) or "Discard your changes?" / "Your edits to this client won’t be saved." (edit), buttons **Keep editing** and red **Discard**. **Discard** goes to the chosen destination; **Keep editing** stays. Without changes the user leaves immediately | Add: "changed" means anything entered beyond the training type (the preset country does not count). Edit: any field or the status differs from when the form opened | BR-CLI-030 |
| Not guarded | — | Browser Back, reload, closing the tab, **Log out** | The page is left without a warning and unsaved work is lost | OQ-CLI-010 | — |

## 6. User Workflow

### 6.1 Find a client

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open **All Clients** | List loads newest first, 10 per page | — | Summary pills and table |
| 2 | Click **Active** | List shows active clients; chip "Status: Active"; Filters badge 1 | — | Active clients only |
| 3 | Type "98200" in search | Rows narrow to clients whose mobile digits contain 98200 (or name/code contains it) | Mobile matching needs at least 3 digits | "N of 30 clients" |
| 4 | Click **Clear all** | Status, filters and search reset | — | Full list |
| 5 | Click a row | Client details opens | — | [client-detail-prd.md](client-detail-prd.md) |

### 6.2 Filter clients

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Filters** | Drawer opens with the applied filters | — | Draft |
| 2 | Choose **Last 90 days** and a creator | Button updates to "Show N clients" | Count includes the toolbar search | Live count |
| 3 | Click **Show N clients** | Drawer closes; chips "Created: Last 90 days", "Created by: <name>" | Disabled with "No matching clients" when N = 0 | Filtered list |
| 4 | Click × on a chip | That filter is removed | — | Wider list |

### 6.3 Add a company from the CRM portal

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Add client** | Training for step | — | Two cards |
| 2 | Click **Company** | Details step; Company code shows the next code | — | Company form |
| 3 | Click Company name and pick a CRM company (for example "Bajaj Auto Ltd") | Fetch card runs (~2 s) | Company must not already be a client | Toast "Fetched from CRM portal"; every step filled; CRM banner |
| 4 | Review and click **Continue** | Validates Details | All required details present and valid | Addresses step |
| 5 | Review and click **Continue** | Validates addresses | — | Billing step with two saved billing addresses |
| 6 | Click **Save client** | Validates Billing; saves | At least one billing address | Toast "Client added"; All Clients with the new client first |

### 6.4 Add a company manually

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | **Add client** → **Company** | Details step | — | — |
| 2 | Type a new name, choose "Add “<name>” as a new company" | Name filled; nothing fetched | Not already a client | — |
| 3 | Fill Company type, Industry, SEZ, Mobile (optional Website, Phone, logo) and click **Continue** | Validates | 7.4 | Addresses step |
| 4 | Fill the communication address (and office address if different), **Continue** | Validates | 7.7 | Billing step with an open billing-address panel |
| 5 | Fill the billing address, GST No. and certificate, click **Save address** | Card added | 7.8 | Billing address 1 |
| 6 | Optionally turn on Lower TDS and fill it | — | 7.10 | — |
| 7 | Click **Save client** | Saves | ≥ 1 billing address | Toast "Client added" |

### 6.5 Add an individual

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | **Add client** → **Individual** | Details step (Participant name focused); Participant ID shows the next code | — | — |
| 2 | Fill Participant name, Email, Mobile (optional Govt. ID, ID proof, Department, Designation, photo), **Continue** | Validates | 7.5 | Addresses step |
| 3 | Fill the communication address, **Continue** | Validates | 7.7 | Billing step |
| 4 | Optionally enter GST No. and certificate; optionally Lower TDS | — | 7.9, 7.10 | — |
| 5 | Click **Save client** | Saves | — | Toast "Client added"; the client appears with industry "Individual" |

### 6.6 Edit a client

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the pencil on All Clients (or **Edit** on Client details) | Edit client opens on Details, pre-filled | Client exists | All steps except Training for are open to click |
| 2 | Change fields on any step, or turn the Status switch off | — | — | — |
| 3 | Click **Save changes** | Checks every step | Errors: first failing step opens with toast "Check the highlighted fields" | Toast "Changes saved"; All Clients |
| 4 | — | Activity History of the client gains "Updated details of" (and "Marked inactive" / "Marked active" when the status changed) | — | [client-detail-prd.md](client-detail-prd.md) |

### 6.7 Leave the form with unsaved changes

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Type in any field | — | — | Form is "changed" |
| 2 | Click **Dashboard** in the sidebar | Dialog "Discard this client?" | — | — |
| 3a | Click **Keep editing** | Dialog closes | — | Form unchanged |
| 3b | Click **Discard** | Goes to Dashboard | — | Typed data lost |

## 7. Forms and Field-Level Specifications

Validation timing for the Add/Edit client form differs from SH-004: an error — including a "required" error — appears as soon as the user leaves a field that has a typing/blur check, even if the field was left empty. Fields without a blur check (Industry, Special Economic Zone, SEZ document, Country, State, City, Valid from, Valid to, certificates) show their errors only when **Continue**, **Next**, **Save client** or **Save changes** is clicked. Once shown, errors update live while the user types (BR-CLI-005, OQ-CLI-005). Every field shows a red "*" when required and "(optional)" when optional.

### 7.1 All Clients toolbar

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Status pills | One-click filter pills | Filter by status | Optional | N/A | N/A | All clients, Active, Inactive (New this month is a count only) | All clients | None | Selecting Active/Inactive adds a "Status: Active" / "Status: Inactive" chip; same value as the Status section of the drawer | N/A |
| Search clients | Search text box, placeholder "Search name, code or mobile…" | Quick find | Optional | N/A | Requires Confirmation | Any text. Case-insensitive "contains" match on client name or code; mobile matches on digits only (spaces, "+" and other characters ignored) and only when the search contains at least 3 digits — for example "98200 41" matches "+91 98200 41120". Surrounding spaces ignored | Empty | None | Short delay before filtering. Medium-width toolbars show it behind a search icon | N/A |
| Rows per page | Select | Page size of the table | Optional | N/A | N/A | 10 rows, 20 rows, 50 rows, All rows | 10 rows | None | Table only (phones use 12 cards per page) | N/A |

### 7.2 Filter clients drawer

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Status | Segmented choice | Filter by status | Optional | N/A | N/A | All, Active, Inactive | All (or the pill currently selected) | None | Chip "Status: Active/Inactive" | N/A |
| Created | Preset chips | Filter by creation date | Optional | N/A | N/A | Any time; Last 7 days (today and the 6 days before); Last 30 days; Last 90 days; This year (1 January to today); Custom | Any time | None | Chip "Created: <preset>" | N/A |
| Created: custom range | Date range picker, placeholder "From – To" | Custom creation period | Optional (shown only for Custom) | Requires Confirmation | Requires Confirmation (future dates are not blocked) | A start and an end date, both inclusive; **Apply** is disabled until both are picked, **Cancel** discards | None | None | Chip "Created: <d Mon> – <d Mon yyyy>" (for example "Created: 1 Oct – 15 Oct 2026"). Choosing Custom without picking dates applies no date filter | N/A |
| Created by | Multi-select with search, placeholder "Anyone", search "Search people…" | Filter by creator | Optional | N/A | N/A | Everyone who has created a client, A–Z | None | None | Matches any selected. Chip "Created by: <first>" plus " +N" for more | N/A |
| Company name | Text with suggestions, placeholder "Company name contains…" | Filter by name | Optional | N/A | Requires Confirmation | Any text; case-insensitive "contains" on the client name. Suggestions match name or code (up to 6) | Empty | None | Chip "Name: <text>" | N/A |
| Company code | Text, placeholder "Company code" | Filter by code | Optional | N/A | Requires Confirmation | Any text; case-insensitive "contains" | Empty | None | Chip "Code: <text>" | N/A |
| Mobile number | Phone text, placeholder "Mobile digits" | Filter by mobile | Optional | N/A | Requires Confirmation | Digits are compared; other characters ignored | Empty | None | Chip "Mobile: <text>". Text with no digits adds a chip but filters nothing (OQ-CLI-017) | N/A |

### 7.3 Add client — Step 1, Training for

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Training for | Two choice cards (single choice) | Company or individual client | Required | N/A | N/A | Company, Individual | None | Must be chosen to continue | Choosing a card moves to Details. Fixed in edit mode | "Choose who the training is for" (not normally reachable: there is no Continue button on this step) |

### 7.4 Step 2 — Details (company)

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Company name | Searchable text with list, placeholder "Search or type a company name" | Company's name | Required | 2 characters (after trimming) | Requires Confirmation | Any text; picked from the CRM/clients list or typed. Trimmed when saved | Empty (edit: saved name) | Required → at least 2 characters → not already a client (case-insensitive, trimmed) | Picking a CRM company (add mode) fills every step (5.7) | "Enter the company name"; "Name looks too short"; "This company is already in All Clients" |
| Company code | Read-only text, helper "Generated automatically" | Client code | N/A (system) | N/A | N/A | "CMP" + 3-digit sequence (add); existing code (edit) | Next code | None | — | N/A |
| Company type | Select, placeholder "Select" | Legal form | Required | N/A | N/A | Private Limited, Public Limited, Limited Liability Partnership (LLP), Partnership Firm, Sole Proprietorship, Government / PSU, Non-profit / NGO, Multinational (MNC) | None | Required | Fixed list, not a Settings master (OQ-CLI-003) | "Choose a company type" |
| Industry | Searchable select, placeholder "Select", search "Search…" (not clearable) | Company's industry | Required | N/A | N/A | Automotive, Banking, Consulting, Education & Training, Engineering, Financial Services, FMCG, Healthcare, IT Services, Manufacturing, Pharma, Retail, Telecom, Other | None | Required (shown on Continue) | Fixed list, not the Industry master (OQ-CLI-003) | "Choose an industry" |
| Website | Text, placeholder "company.com" | Company website | Optional | N/A | Requires Confirmation | Optional "http://" or "https://", a domain with at least one dot (letters, digits, hyphens, underscores), optional path; no spaces. Checked after trimming | Empty | Format, only when filled | — | "Enter a valid website, e.g. tatasteel.com" |
| Special Economic Zone | Yes / No radio buttons | Whether the company is in an SEZ | Required | N/A | N/A | Yes, No | None | Required (shown on Continue) | Yes reveals SEZ number and SEZ document | "Choose Yes or No" |
| SEZ number | Text, placeholder "e.g. SEZ/MUM/2019/0423", helper "As printed on the SEZ approval letter" | SEZ approval number | Required when SEZ = Yes | 1 character | Requires Confirmation | Any text; letters turn to capitals as typed. No format check | Empty | Required | Shown only when SEZ = Yes; kept if SEZ is switched back to No [Inferred] | "Enter the SEZ number" |
| SEZ document | File upload "Upload SEZ approval letter" | SEZ approval letter | Required when SEZ = Yes | N/A | 5 MB | PDF, JPG or PNG | None | Required; type; size | Shown only when SEZ = Yes | "Upload the SEZ document"; "Use a PDF, JPG or PNG file."; "File must be under 5 MB." |
| Mobile number | Phone text with fixed "+91", placeholder "98765 43210" | Main contact number | Required | 10 digits | 10 digits (further typing blocked) | Digits only (other characters removed as typed); must start with 6, 7, 8 or 9 | Empty | Required → 10 digits starting 6–9 | Shown elsewhere as "+91 98765 43210" | "Enter a mobile number"; "Enter a valid 10-digit mobile number" |
| Phone number: STD code | Numeric text, placeholder "STD" | Landline area code | Optional (required if a phone number is entered) | 2 digits | 5 digits (further typing blocked) | Digits only; 2–4 digits, optionally preceded by 0 (for example 11, 011, 0124) | Empty | Checked when either STD code or number has a value | Error shows under Phone number | "Enter the STD code too" (also shown when the STD code is present but invalid) |
| Phone number: number | Numeric text, placeholder "Number" | Landline number | Optional (required if an STD code is entered) | 6 digits | 8 digits (further typing blocked) | Digits only | Empty | Checked when either part has a value | Shown after the STD code error is fixed | "Enter a 6–8 digit number" |
| Status (edit only) | Switch | Active / inactive | Required (always set) | N/A | N/A | Active client / Inactive client | Client's current status | None | Edit mode only | N/A |
| Company logo | Image upload ("Upload logo" / "Change" / "Remove") | Logo shown across LearnNext | Optional | N/A | 2 MB | Any image file (hint says PNG, JPG or SVG — OQ-CLI-014) | None (edit: saved logo) | Image type; size | Clicking the image opens a full-size preview titled "Logo" | Toast only: "Please choose an image file."; "Logo must be under 2 MB." |

### 7.5 Step 2 — Details (individual)

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Participant name | Text, placeholder "Full name" | Person's name (becomes the client name) | Required | 1 character (after trimming) | Requires Confirmation | Any text (no character restriction). Trimmed when saved | Empty | Required; spaces-only counts as empty | Focused when the step opens | "Enter the participant’s name" |
| Participant ID | Read-only text, helper "Generated automatically" | Client code | N/A (system) | N/A | N/A | "PRT" + 3-digit sequence | Next code | None | — | N/A |
| Email | Email text, placeholder "name@example.com" | Person's email | Required | Requires Confirmation | Requires Confirmation | Text, "@", domain, ".", at least 2 characters after the dot, no spaces (checked after trimming — SH-004 format) | Empty | Required → format. No duplicate check (OQ-CLI-006) | — | "Enter an email address"; "Enter a valid email address" |
| Mobile number | Phone text with fixed "+91", placeholder "98765 43210" | Person's mobile | Required | 10 digits | 10 digits | As 7.4 | Empty | As 7.4 | — | "Enter a mobile number"; "Enter a valid 10-digit mobile number" |
| Govt. ID | Text, placeholder "Aadhaar, PAN or passport" | ID number | Optional | N/A | Requires Confirmation | Any text; no format check (OQ-CLI-007) | Empty | None | — | N/A |
| ID proof | File upload "Upload ID proof" | Copy of the ID | Optional | N/A | 5 MB | PDF, JPG or PNG | None | Type; size | Not required even when Govt. ID is filled | "Use a PDF, JPG or PNG file."; "File must be under 5 MB." |
| Department | Searchable select, placeholder "Select", search "Search…", clearable | Person's department | Optional | N/A | N/A | Administration, Customer Service, Engineering, Finance, Human Resources, Information Technology, Legal, Marketing, Operations, Procurement, Sales, Other | None | None | Fixed list (OQ-CLI-003) | N/A |
| Designation | Searchable select, placeholder "Select", search "Search…", clearable | Person's designation | Optional | N/A | N/A | Intern, Executive, Senior Executive, Assistant Manager, Manager, Senior Manager, Associate General Manager, General Manager, Director, Vice President, CXO, Consultant | None | None | Fixed list (OQ-CLI-003) | N/A |
| Status (edit only) | Switch | As 7.4 | As 7.4 | N/A | N/A | As 7.4 | As 7.4 | None | — | N/A |
| Photo or logo | Image upload ("Upload image" / "Change" / "Remove") | Picture shown across LearnNext | Optional | N/A | 2 MB | Any image file | None | As 7.4 | — | Toast only: "Please choose an image file."; "Logo must be under 2 MB." |

### 7.6 Document uploads (all steps)

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Any document upload (SEZ approval letter, ID proof, GST certificate, lower TDS certificate) | Drop zone with **Browse**; drag and drop supported | Attach a supporting document | Per field (see 7.4, 7.5, 7.8–7.10) | N/A | 5 MB per file; one file per field | PDF, JPG, JPEG or PNG | None | Type, then size, checked when the file is chosen | Once attached: file row with preview, **Replace**, **Remove** (no confirmation) | "Use a PDF, JPG or PNG file."; "File must be under 5 MB." (inline in the drop zone and as an error toast) |
| File preview | Full-window preview | View the file | N/A | N/A | N/A | Images fit the window; PDFs show in a viewer | N/A | N/A | Title = file name; description "PDF document · <size>" / "Image · <size>"; **Open in new tab** and **Download**. Other types: "No preview for this file type" / "Download it to open it on your device." | N/A |

### 7.7 Step 3 — Addresses (communication, office, and the billing-address panel)

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Address line 1 | Text, placeholder "Building, street" | Address | Required | 1 character (after trimming) | Requires Confirmation | Any text | Empty | Required | — | "Enter address line 1" |
| Address line 2 | Text, placeholder "Area, landmark" | Address | Required | 1 character (after trimming) | Requires Confirmation | Any text | Empty | Required | — | "Enter address line 2" |
| Country | Searchable select, placeholder "Choose a country", search "Search countries…" (not clearable) | Country | Required | N/A | N/A | India, United Arab Emirates, Singapore, United Kingdom, United States | India | Required | Changing country clears State and City; Pin code label/rules switch | "Choose a country" |
| State | Searchable select, placeholder "Choose a state" ("Choose a country first" when no country), search "Search states…" | State | Required | N/A | N/A | States of the chosen country, A–Z (India: Delhi, Gujarat, Haryana, Jharkhand, Karnataka, Maharashtra, Tamil Nadu, Telangana, Uttar Pradesh, West Bengal) | Empty | Required (shown on Continue) | Disabled until a country is chosen; changing state clears City | "Choose a state" |
| City | Searchable select, placeholder "Choose a city" ("Choose a state first"), search "Search cities…" | City (the communication city is shown on All Clients) | Required | N/A | N/A | Cities of the chosen state | Empty | Required (shown on Continue) | Disabled until a state is chosen | "Choose a city" |
| Pin code (India) | Numeric text, placeholder "6 digits, e.g. 400001" | Postal code | Required | 6 digits | 6 digits (further typing blocked) | Digits only (others removed as typed); first digit 1–9 | Empty | Required → 6 digits not starting with 0 | Label "Pin code" when country is India | "Enter the pin code"; "Pin code is 6 digits" |
| Postal code (other countries) | Text, placeholder "Postal code" | Postal code | Required | 3 characters | 10 characters (further typing blocked) | Letters, digits, spaces and hyphens | Empty | Required → format | Label "Postal code" when country is not India | "Enter the pin code"; "Enter a valid postal code" |
| Office address is the same as the communication address | Checkbox | Skip the office address | Optional | N/A | N/A | Ticked / unticked | Ticked | None | Unticked shows the Office address card with the six fields above (all required) | N/A |

These countries, states and cities are a fixed list inside the form; they are not taken from the Settings location masters (OQ-CLI-003).

### 7.8 Step 4 — Billing address panel (company)

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Address line 1, Address line 2, Country, State, City, Pin/Postal code | As 7.7 | Billing address | Required | As 7.7 | As 7.7 | As 7.7 | Empty, country India (or copied with **Use communication address**) | As 7.7, checked on **Save address** / **Update address** | — | As 7.7 |
| Company GST No. | Text, placeholder "15-character GSTIN" | GST registration for this address | Required | 15 characters | 15 characters (further typing blocked) | Letters turn to capitals as typed. Pattern: 2 digits, 5 letters, 4 digits, 1 letter, 1 digit 1–9 or letter, "Z", 1 digit or letter (for example 27AAPFU0939F1ZV). Checked after trimming | Empty | Required → pattern. No check against the address state or for duplicates (OQ-CLI-006) | — | "Enter the company GST No."; "GST No. is 15 characters, e.g. 27AAPFU0939F1ZV" |
| GST certificate | File upload "Upload GST certificate *" | Proof of registration | Required | N/A | 5 MB | PDF, JPG or PNG | None | Required; type; size | — | "Attach the GST certificate"; "Use a PDF, JPG or PNG file."; "File must be under 5 MB." |
| Billing addresses (list) | Saved cards | All GST registrations | Required (company) | 1 address | None defined | — | None (CRM fetch: two addresses) | At least one saved address when saving the client | — | Toast "Add a billing address" — "Save at least one billing address with its GST No." |

### 7.9 Step 4 — GST (individual)

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| GST No. | Text, placeholder "15-character GSTIN" | Person's GST registration | Optional | 15 characters when filled | 15 characters | As 7.8 | Empty | Pattern, only when filled (checked on leaving the field and on Save) | — | "GST No. is 15 characters, e.g. 27AAPFU0939F1ZV" |
| GST certificate | File upload "Upload GST certificate" | Proof of registration | Optional (even when a GST No. is entered — OQ-CLI-006) | N/A | 5 MB | PDF, JPG or PNG | None | Type; size | — | "Use a PDF, JPG or PNG file."; "File must be under 5 MB." |

### 7.10 Step 4 — Lower TDS (both types)

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Do you have Lower TDS details? | Switch | Whether a lower TDS certificate applies | Optional | N/A | N/A | On / off | Off | None | On reveals the six fields below, all required | N/A |
| Lower TDS rate | Decimal text with "%" suffix, placeholder "e.g. 2" | Reduced TDS rate | Required when on | 0 | Less than 100 | Digits and "." only (other characters removed as typed) | Empty | Required → a number from 0 up to (not including) 100. Several dots make it invalid | — | "Enter the lower TDS rate"; "Enter a rate between 0 and 100" |
| Amount | Decimal text with "₹" prefix, placeholder "e.g. 500000" | Amount covered by the certificate | Required when on | More than 0 | Requires Confirmation | Digits and "." only | Empty | Required → greater than 0 | — | "Enter the amount"; "Enter an amount above 0" |
| Section | Text, placeholder "e.g. 194J" | Income-tax section | Required when on | 1 character | 10 characters (further typing blocked) | Any text; letters turn to capitals. No format check | Empty | Required | — | "Enter the section, e.g. 194J" |
| Valid from | Date picker, placeholder "Choose a date" (clearable) | Certificate start | Required when on | Requires Confirmation (past dates allowed) | Requires Confirmation | A date | None | Required (shown on Save) | — | "Choose a start date" |
| Valid to | Date picker, placeholder "Choose a date" (clearable) | Certificate end | Required when on | The Valid from date (earlier days cannot be picked) | Requires Confirmation | A date on or after Valid from | None | Required → not before Valid from | — | "Choose an end date"; "Must be on or after the start date" |
| Lower TDS certificate | File upload "Upload lower TDS certificate *" | The certificate | Required when on | N/A | 5 MB | PDF, JPG or PNG | None | Required; type; size | — | "Upload the certificate"; "Use a PDF, JPG or PNG file."; "File must be under 5 MB." |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-CLI-001 | Default list order | Clients are listed newest created first | All Clients | Created on, descending | — | — |
| BR-CLI-002 | Sort cycle | Clicking a sortable header sorts ascending, then descending, then returns to the default order | Table | Third click clears the sort (differs from SH-008) | — | Header arrow |
| BR-CLI-003 | Summary counts | All clients, Active and Inactive count the whole list. "New this month" counts clients created in the last 30 days. The "+N this year" tooltip counts clients created in the last 12 months | All Clients | Counts ignore search and filters | — | — (OQ-CLI-002) |
| BR-CLI-004 | Quick search | Matches name or code (contains, any case); mobile by digits when at least 3 digits are typed | Search | Rows narrow | No match | "No clients match" |
| BR-CLI-005 | Form error timing | Errors show on leaving a field (even empty) for fields with a blur check; all of a step's errors show on Continue / Next / Save | Add/Edit client | Inline errors; first invalid field focused | — | Field messages (differs from SH-004; OQ-CLI-005) |
| BR-CLI-006 | Step gate | A step cannot be left forward while it has errors | Continue / Next | Stays on the step | Any invalid field | Inline errors |
| BR-CLI-007 | Step navigation (add) | Only finished steps and the current step can be opened from the steps panel; going back does not validate | Add client | — | — | Later steps disabled |
| BR-CLI-008 | Training type fixed | The training type cannot be changed when editing | Edit client | Training for step disabled | — | Tooltip "The training type can’t be changed" |
| BR-CLI-009 | Company name length | Company name needs at least 2 characters after trimming | Details (company) | — | "A" | "Name looks too short" |
| BR-CLI-010 | Unique company | A company name already on file (any client, case-insensitive, trimmed) cannot be added; in edit, the client's own name is allowed | Details (company), Save changes | Error shows at once while typing; blocks Continue and Save changes | Name of an existing client | "This company is already in All Clients"; list tag "Already a client" |
| BR-CLI-011 | Indian mobile | Mobile number: 10 digits starting 6–9, "+91" fixed | Details | Non-digits removed; 11th digit blocked | "5123456789" | "Enter a valid 10-digit mobile number" |
| BR-CLI-012 | Client code | New companies get "CMP" + a 3-digit sequence, individuals "PRT" + a sequence; the code is read only and never changes on edit | Details | Code shows once the type is chosen | — | Helper "Generated automatically" (OQ-CLI-015) |
| BR-CLI-013 | Landline pair | STD code and phone number go together: if either is filled, both must be valid | Details (company) | — | Only one filled | "Enter the STD code too" / "Enter a 6–8 digit number" |
| BR-CLI-014 | SEZ evidence | If the company is in an SEZ, the SEZ number and SEZ document are required | Details (company) | Fields appear on Yes | Missing | "Enter the SEZ number"; "Upload the SEZ document" |
| BR-CLI-015 | CRM auto-fill | Picking a CRM-portal company that is not already a client (add mode only) fills every step | Details (company) | Fetch card, then filled steps and banner | Company not in the CRM | Toast "Fetched from CRM portal" / "Couldn’t reach the CRM portal" |
| BR-CLI-016 | Latest CRM pick wins | If another company is picked while a fetch runs, only the latest pick fills the form | CRM fetch | Earlier result ignored | — | — |
| BR-CLI-017 | Address cascade | Country → State → City; changing a higher level clears lower ones | Addresses, billing panel | — | — | Placeholders "Choose a country first", "Choose a state first" |
| BR-CLI-018 | Pin code by country | India: 6 digits, not starting with 0. Other countries: 3–10 letters, digits, spaces or hyphens | Addresses | Label switches Pin code / Postal code | "012345" / "AB" | "Pin code is 6 digits" / "Enter a valid postal code" |
| BR-CLI-019 | GSTIN format | GST numbers follow the 15-character GSTIN pattern | Billing | Capitals as typed | "27AAPFU0939F1Z" | "GST No. is 15 characters, e.g. 27AAPFU0939F1ZV" |
| BR-CLI-020 | File rules | Documents: PDF, JPG or PNG up to 5 MB. Logo/photo: any image up to 2 MB | Uploads | Rejected file is not attached | Wrong type / too large | Inline + toast: "Use a PDF, JPG or PNG file." / "File must be under 5 MB."; toast: "Please choose an image file." / "Logo must be under 2 MB." |
| BR-CLI-021 | Company needs billing | A company client must have at least one saved billing address with GST No. and certificate | Save client / Save changes | Edit mode opens the Billing step | No saved address | Toast "Add a billing address" — "Save at least one billing address with its GST No." |
| BR-CLI-022 | Billing panel errors on save | The billing-address panel shows its errors only after **Save address** / **Update address** | Billing (company) | — | — | Field messages (7.8) |
| BR-CLI-023 | Unsaved billing panel dropped | An open, unsaved billing-address panel is not part of the client | Leaving the step, Save client | Its content is lost | — | None (OQ-CLI-010) |
| BR-CLI-024 | New client defaults | A new client is Active, created by the signed-in user ("You" if no name) at the current time; individual clients show industry "Individual"; the list city is the communication city | Save client | Activity History records "Added client" | — | Toast "Client added" — "<name> (<code>)" |
| BR-CLI-025 | Status change on edit | Changing the status switch and saving changes the client's status everywhere | Save changes | Activity History records "Marked active"/"Marked inactive" | — | — |
| BR-CLI-026 | Edit validates everything | Save changes checks every step; the first step with problems opens | Edit client | Errors shown and focused | — | Toast "Check the highlighted fields" — "<Step> needs a few fixes before saving." |
| BR-CLI-027 | Edit logging | Every successful Save changes records "Updated details of" in the client's Activity History, even without changes | Edit client | — | — | — (OQ-CLI-009) |
| BR-CLI-028 | Lower TDS completeness | When Lower TDS is on, rate (0 to under 100), amount (> 0), section, both dates (to ≥ from) and certificate are required | Billing | — | Missing / out of range | 7.10 messages |
| BR-CLI-029 | Lower TDS off | When Lower TDS is off, its fields are hidden and not checked | Billing | Values typed earlier are kept but ignored for validation [Inferred] | — | — |
| BR-CLI-030 | Unsaved-changes guard | Leaving the form with unsaved changes through Cancel, the sidebar, the breadcrumb, global search or the user menu (My Profile, Settings) asks first | Add/Edit client | Dialog with **Keep editing** / **Discard** | — | "Discard this client?" / "The details you’ve entered won’t be saved."; "Discard your changes?" / "Your edits to this client won’t be saved." |
| BR-CLI-031 | Filter drawer draft | Drawer changes apply only with **Show N clients**; the count includes the toolbar search | Filter clients | Closing discards the draft | No matches | Button "No matching clients", disabled |
| BR-CLI-032 | Date filter bounds | Created dates are inclusive of the whole start and end days | Created filter | — | — | — |
| BR-CLI-033 | Edit of unknown client | An edit address for a client that does not exist shows a not-found card | Edit client | — | Removed client / bad link | "Client not found" / "It may have been removed, or the link is out of date." |
| BR-CLI-034 | Save rejected | If the client no longer exists when saving edits, nothing is saved | Save changes | Form stays open | — | Toast "Couldn’t save the changes" — "This client no longer exists." |
| BR-CLI-035 | Client deletion [Not Implemented] | Clients cannot be deleted; they can only be made Inactive | All Clients, Edit client | — | — | — (OQ-CLI-001) |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Save client | Saved | Success toast (SH-005) | "Client added" — description "<name> (<code>)" | After save, once All Clients has loaded (SH-005) | Open the new client |
| Save client fails | Save rejected | Error toast | "Couldn’t add the client" — description is the reason | After save attempt; form stays | Retry |
| Save changes | Saved | Success toast | "Changes saved" — description "<name> (<code>)" | After save, once All Clients has loaded (SH-005) | — |
| Save changes fails | Client no longer exists | Error toast | "Couldn’t save the changes" — "This client no longer exists." | After save attempt | Return to All Clients |
| Save changes with errors | Any step invalid | Error toast | "Check the highlighted fields" — "<Step label> needs a few fixes before saving." | On Save changes; that step opens | Fix the fields |
| No billing address | Company with no saved billing address | Error toast | "Add a billing address" — "Save at least one billing address with its GST No." | On Save client / Save changes | Add a billing address |
| CRM fetch | Success | Success toast | "Fetched from CRM portal" — "<company> — every step is pre-filled. Review and continue." | When the fetch completes | Review steps |
| CRM fetch | Failure | Error toast | "Couldn’t reach the CRM portal" — reason (for example "This company isn’t in the CRM portal.") | When the fetch fails | Fill manually |
| CRM in progress | Fetching | Inline card | "Fetching from CRM portal…" / "Pulling everything we have on <company>" with % | ~2 seconds | Wait |
| CRM filled | After fetch | Inline banner | "<Step> pre-filled from CRM portal · <company> · review and edit anything that’s changed." + "Synced" | Steps 2–4 | Review |
| Document rejected | Wrong type / too big | Inline + error toast | "Use a PDF, JPG or PNG file." / "File must be under 5 MB." | On choosing a file | Choose another file |
| Logo rejected | Not an image / too big | Error toast | "Please choose an image file." / "Logo must be under 2 MB." | On choosing a file | Choose another image |
| Duplicate company | Name already on file | Inline error | "This company is already in All Clients" | While typing / on pick | Open the existing client instead |
| Leave with changes | Unsaved changes | Confirmation dialog | Add: "Discard this client?" / "The details you’ve entered won’t be saved." Edit: "Discard your changes?" / "Your edits to this client won’t be saved." Buttons "Keep editing", "Discard" | On leaving | Keep editing or Discard |
| Delete billing address | Bin clicked | Confirmation dialog | "Delete this billing address?" — "<line 1, line 2> · <GSTIN>"; buttons "Cancel", "Delete" | On delete | Confirm or cancel |
| Filtering | Search or filters active | Inline result line | "N of T clients" with chips | While filtering | Clear all |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| **Company** | Identify the client | Sortable (A–Z by name); cannot be hidden; the name is a link | Logo/monogram, name, "industry · city" | — |
| **Code** | Client code | Sortable | Monospace code chip | — |
| **Mobile** | Contact number | Not sortable; hidden below 1024 px | Phone icon + "+91 98765 43210" | — |
| **Created by** | Who added it | Sortable; hidden below 1280 px | Avatar initials + name | — |
| **Created on** | When added | Sortable; **default sort, newest first**; hidden below 1536 px | Date "12 Mar 2026" (SH-012); hover shows relative time | — |
| **Status** | Active or inactive | Sortable (Active before Inactive ascending) | Status badge: dot + "Active" / "Inactive" | — |
| Actions | Edit / open | Not sortable; always visible | Pencil "Edit <name>"; arrow cue on row hover | — |
| Pagination | Paging | SH-008 | 10 per page; 10, 20, 50, All rows. Phones: 12 cards per page, no size choice | — |
| Summary pills | Counts and status filter | 5.1 | All clients, Active, Inactive, New this month | Skeleton while loading |
| Search | Quick find | 7.1 | Name, code, mobile | "No clients match" / "Try a different search or loosen the filters." with **Clear search & filters** |
| Filter drawer | Narrow list | 5.2, 7.2 | Status, Created, Created by, Company name / code / mobile | Apply disabled with "No matching clients" |
| Result line | Show narrowing | Only while searching/filtering | "N of T clients", chips, **Clear all** | — |
| Global search (⌘K) [Not Implemented] | — | Clients are not offered in the global search | — | OQ-CLI-018 |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| No clients at all | Empty list | Empty state, no action button | "No clients yet" / "Clients you add will appear here." | **Add client** in the toolbar |
| No matches | Search/filters match nothing | Empty state with button | "No clients match" / "Try a different search or loosen the filters." | **Clear search & filters** |
| List load failure | Load fails | Error state with **Try again** (SH-007) | Table: "Couldn’t load data"; phones: "Couldn’t load clients" — description is the reason | **Try again** |
| Client without logo | No logo | Coloured monogram tile | — | Upload a logo on Edit client |
| Mobile filter without digits | Mobile filter "abc" | A chip "Mobile: abc" appears but nothing is filtered | — | Remove the chip (OQ-CLI-017) |
| Search "+91" | Fewer than 3 digits | Mobile is not matched; only name/code | — | Type more digits |
| Edit link for unknown client | Bad or old address | Not-found card | "Client not found" / "It may have been removed, or the link is out of date." | **All clients** |
| Demo client edited | Opening Edit on a built-in demo client | The form opens complete with generated sample details (company type "Public Limited", addresses, two billing addresses with sample certificates, sometimes SEZ and Lower TDS) built from the list row. Industry "Training" (not in the Industry list) appears as "Education & Training" | — | SH-001; OQ-CLI-013 |
| Sample certificates | Opening a demo/CRM document | Preview shows a sample PDF | — | — |
| CRM company already a client | Picking a CRM entry tagged "Already a client" | Name filled, no fetch, duplicate error | "This company is already in All Clients" | Choose another name |
| Name edited after CRM fetch | User changes Company name | CRM banner and markers disappear; fetched values stay | — | Review fields (OQ-CLI-011) |
| Type switched after typing | Back to Training for, pick the other type | Other type's form shows; earlier values kept hidden [Inferred] | — | OQ-CLI-012 |
| Office address unticked then re-ticked | — | Office fields hide and are no longer checked; typed values kept [Inferred] | — | — |
| Unsaved billing panel | Panel filled but not saved, then Save client | Panel ignored; if no saved address, toast | "Add a billing address" | Click **Save address** first |
| Country changed after pin typed | e.g. India → Singapore | Pin keeps its value and is re-checked under the new rule | "Enter a valid postal code" if invalid | Correct the code |
| Lower TDS valid-to before valid-from | Dates out of order | Earlier days cannot be picked once Valid from is set; if Valid from is moved later, error | "Must be on or after the start date" | Fix dates |
| Leaving via browser Back / reload / Log out | Unsaved changes | No warning; changes lost | — | OQ-CLI-010 |
| Steps panel used during CRM fetch or saving | Clicking a finished step | Step changes (the panel is not locked) [Inferred] | — | — |
| Save with no changes (edit) | Save changes without editing | Saves and logs "Updated details of" | "Changes saved" | OQ-CLI-009 |
| Reload after adding/editing | Any reload | New/edited clients revert to demo data (SH-001) | — | Re-enter |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Client details ([client-detail-prd.md](client-detail-prd.md)) | Opened from a row/card; its **Edit** button opens Edit client; shows the data entered here (Overview, Tax & Billing) | Row click / **Edit** | Saved changes appear on the details page; Activity History shows "Added client", "Updated details of", "Marked active/inactive" | BR-CLI-024, BR-CLI-025, BR-CLI-027 |
| Client details — Settings & Configuration | Same client status | Status switch on Edit client or Settings & Configuration | Status shown on All Clients and the details header | BR-CLI-025 |
| App shell ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)) | Sidebar item **All Clients**; breadcrumbs; sidebar, breadcrumb, global search and user menu respect the unsaved-changes guard | Navigation | Guard dialog on Add/Edit client | BR-CLI-030, SH-006, SH-009 |
| Authentication ([authentication-prd.md](authentication-prd.md)) | Signed-in user's name becomes **Created by** and appears on activity entries | Save client / Save changes | "You" when the user has no name | BR-CLI-024 |
| Settings location masters ([settings-location-masters-prd.md](settings-location-masters-prd.md)) | Not used: Add client uses its own fixed country → state → city list [Requires Confirmation] | Addresses | Lists can differ from the masters | OQ-CLI-003 |
| Settings industry & job masters ([settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md)) | Not used: Industry, Department and Designation are fixed lists [Requires Confirmation] | Details | Lists can differ from the masters | OQ-CLI-003 |
| Settings finance masters ([settings-finance-masters-prd.md](settings-finance-masters-prd.md)) | No link: Add client does not ask for a LearnNext entity | — | — | OQ-CLI-003 |
| Support desk ([support-desk-prd.md](support-desk-prd.md)), Facilitators ([facilitators-prd.md](facilitators-prd.md)) and other list pages | Follow the All Clients list pattern (summary pills, toolbar, filter drawer) — SH-008 | — | Visual and behavioural consistency only; no data link | SH-008 |
| CRM portal (external) [Requires Confirmation] | Source of company profiles for Add client | Picking a CRM company | Simulated in the current build | OQ-CLI-011 |

## 13. Acceptance Criteria

**AC-CLI-001: View the client list**
- Given a signed-in Training Partner user
- When they open **All Clients**
- Then the summary pills, toolbar and a table of clients sorted newest created first appear, 10 per page
- And the breadcrumb shows "All Clients"

**AC-CLI-002: Status pill filter**
- Given the client list
- When the user clicks **Inactive**
- Then only inactive clients show, the pill is highlighted, the chip "Status: Inactive" appears and the Filters badge shows 1
- And clicking **All clients** shows every client again

**AC-CLI-003: Search by mobile**
- Given a client with mobile "+91 98200 41120"
- When the user types "98200 41"
- Then that client is listed with "N of T clients"
- And typing only "91" does not match by mobile

**AC-CLI-004: No search results**
- Given a search that matches nothing
- Then "No clients match" shows with **Clear search & filters**
- And clicking it restores the full list

**AC-CLI-005: Filter drawer**
- Given the Filter clients drawer
- When the user selects **Last 30 days** and a creator and clicks "Show N clients"
- Then the list narrows with chips "Created: Last 30 days" and "Created by: <name>"
- And when a draft matches nothing the button reads "No matching clients" and cannot be clicked
- And closing the drawer without applying keeps the previous filters

**AC-CLI-006: Open and edit from the list**
- Given the client list
- When the user clicks a row, Client details opens
- And when the user clicks a row's pencil, Edit client opens without opening Client details

**AC-CLI-007: Cards on phones**
- Given a screen narrower than 768 px
- Then clients show as cards, 12 per page, each opening the client when tapped

**AC-CLI-008: Choose training type**
- Given Add client
- When the user clicks **Company**
- Then the Details step opens with Company code "CMP" + sequence
- And choosing **Individual** instead shows Participant ID "PRT" + sequence

**AC-CLI-009: CRM auto-fill**
- Given Add client for a company
- When the user picks a CRM company that is not a client
- Then "Fetching from CRM portal…" shows, the form is locked and Continue is disabled
- And afterwards every step is filled, the toast "Fetched from CRM portal" shows and each step shows the CRM banner

**AC-CLI-010: Duplicate company**
- Given a client "Infosys Ltd" exists
- When the user types " infosys ltd " as a new company name
- Then "This company is already in All Clients" shows immediately and Continue does not proceed

**AC-CLI-011: Company details required**
- Given the company Details step with nothing filled
- When the user clicks **Continue**
- Then "Enter the company name", "Choose a company type", "Choose an industry", "Choose Yes or No" and "Enter a mobile number" show and the first invalid field is focused

**AC-CLI-012: Mobile number rules**
- Given the Mobile number field
- When the user types "5123456789" and leaves the field
- Then "Enter a valid 10-digit mobile number" shows
- And letters are ignored and an 11th digit cannot be typed

**AC-CLI-013: SEZ evidence**
- Given SEZ = Yes
- When the user clicks Continue without SEZ number and document
- Then "Enter the SEZ number" and "Upload the SEZ document" show

**AC-CLI-014: Landline pair**
- Given Phone number has "24567890" and no STD code
- When the user leaves the field
- Then "Enter the STD code too" shows

**AC-CLI-015: Address rules**
- Given the Addresses step with Country India
- When the user enters pin "012345" and leaves it
- Then "Pin code is 6 digits" shows
- And changing State clears City

**AC-CLI-016: Office address**
- Given the office checkbox is ticked
- When the user unticks it
- Then the Office address card appears and its six fields are required

**AC-CLI-017: Billing address required for companies**
- Given a company on the Billing step with no saved billing address
- When the user clicks **Save client**
- Then the toast "Add a billing address" shows and nothing is saved

**AC-CLI-018: Billing address panel**
- Given the billing panel
- When the user enters GST No. "27AAPFU0939F1Z" and clicks **Save address**
- Then "GST No. is 15 characters, e.g. 27AAPFU0939F1ZV" and "Attach the GST certificate" show
- And with valid values the address appears as "Billing address 1"

**AC-CLI-019: Delete billing address**
- Given a saved billing address
- When the user clicks its bin
- Then "Delete this billing address?" asks to confirm and **Delete** removes it

**AC-CLI-020: Lower TDS**
- Given Lower TDS is on
- When the user enters rate "100" and amount "0" and saves
- Then "Enter a rate between 0 and 100" and "Enter an amount above 0" show
- And Valid to cannot be earlier than Valid from

**AC-CLI-021: Document rules**
- Given any document upload
- When the user chooses a 6 MB PDF or a .docx file
- Then "File must be under 5 MB." or "Use a PDF, JPG or PNG file." shows in the drop zone and as a toast, and the file is not attached

**AC-CLI-022: Save a new client**
- Given a valid company with one billing address
- When the user clicks **Save client**
- Then "Client added" shows with "<name> (<code>)", All Clients opens and the new client is first, Active, created by the user

**AC-CLI-023: Edit a client**
- Given Edit client for an existing client
- When the user changes the website and clicks **Save changes**
- Then "Changes saved" shows and All Clients opens
- And the client's Activity History shows "Updated details of"

**AC-CLI-024: Edit validates every step**
- Given Edit client on the Billing step with an empty Address line 1 on Addresses
- When the user clicks **Save changes**
- Then the Addresses step opens with the error and the toast "Check the highlighted fields" — "Addresses needs a few fixes before saving."

**AC-CLI-025: Change status on edit**
- Given an active client in Edit client
- When the user turns the Status switch off and saves
- Then the client shows "Inactive" on All Clients and Activity History records "Marked inactive"

**AC-CLI-026: Unsaved-changes guard**
- Given Add client with a typed company name
- When the user clicks **Dashboard** in the sidebar
- Then "Discard this client?" asks to confirm
- And **Keep editing** stays; **Discard** opens Dashboard
- And with nothing typed (only the type chosen) the user leaves without a dialog

**AC-CLI-027: Edit unknown client**
- Given an edit address for a client that does not exist
- Then "Client not found" shows with **All clients**

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-CLI-001 | AC-CLI-001 | List loads | Signed in | Demo data | 30 clients; newest first; 10 rows; pills All clients 30, Active 25, Inactive 5 | P1 |
| TC-CLI-002 | BR-CLI-003 | New this month count | — | Client created 20 days ago vs 35 days ago | Only the first counted | P3 |
| TC-CLI-003 | AC-CLI-002 | Status pill | — | Click Inactive, then All clients | Filter + chip + badge; then reset | P2 |
| TC-CLI-004 | BR-CLI-004 | Search by name, any case | — | "tata" | Tata Steel Ltd listed | P2 |
| TC-CLI-005 | BR-CLI-004 | Search by code | — | "inf007" | Infosys Ltd listed | P2 |
| TC-CLI-006 | AC-CLI-003 | Search by mobile digits | — | "98200 41" / "91" | Match / no mobile match | P2 |
| TC-CLI-007 | AC-CLI-004 | No results | — | "zzzz" | "No clients match"; Clear search & filters works | P2 |
| TC-CLI-008 | 5.1 | Compact search | Toolbar medium width | Click search icon, type, press Esc | Field slides in; Esc clears and closes | P3 |
| TC-CLI-009 | AC-CLI-005 | Apply filters | — | Last 30 days + creator | Chips; Filters badge 2 | P2 |
| TC-CLI-010 | BR-CLI-031 | Drawer discard | Filters applied | Change draft, press Esc | Filters unchanged | P3 |
| TC-CLI-011 | BR-CLI-031 | No matching clients | — | Code "XYZ999" | Button "No matching clients", disabled | P2 |
| TC-CLI-012 | 5.2 | Company name suggestions | — | Type "ban" | Up to 6 matches with highlighted text; Enter picks | P3 |
| TC-CLI-013 | 7.2 | Custom date range | — | Pick only a start date | Apply disabled | P3 |
| TC-CLI-014 | BR-CLI-032 | Date bounds inclusive | Client created today | Last 7 days | Client included | P3 |
| TC-CLI-015 | 7.2 | Mobile filter without digits | — | "abc" | Chip shown, list unchanged | P3 |
| TC-CLI-016 | 5.2 | Reset clears status too | Status Active applied | Reset, Show N | Status back to All | P3 |
| TC-CLI-017 | 5.1 | Remove chip / Clear all | Several filters + search | × on chip; Clear all | Chip filter removed; everything cleared | P2 |
| TC-CLI-018 | BR-CLI-002 | Sort cycle | — | Click Company three times | A–Z, Z–A, default order | P3 |
| TC-CLI-019 | 10 | Responsive columns | — | 1500 / 1200 / 1000 px | Created on, then Created by, then Mobile hidden; Edit always visible | P3 |
| TC-CLI-020 | 10 | Page size | — | All rows | All 30 rows on one page | P3 |
| TC-CLI-021 | AC-CLI-006 | Row vs pencil | — | Click row; click pencil | Client details; Edit client | P1 |
| TC-CLI-022 | AC-CLI-007 | Phone cards | 375 px | — | Cards, 12 per page, pager | P2 |
| TC-CLI-023 | 5.3 | Monogram | Client without logo | "Tata Steel Ltd" | "TS" tile | P3 |
| TC-CLI-024 | AC-CLI-008 | Training type | — | Company / Individual | Details with CMP… / PRT… code | P1 |
| TC-CLI-025 | AC-CLI-009 | CRM fetch | Add company | Pick "Bajaj Auto Ltd" | Fetch card ~2 s; all steps filled; toast; banners | P1 |
| TC-CLI-026 | BR-CLI-015 | CRM pick of existing client | — | Pick an entry tagged "Already a client" | No fetch; duplicate error | P2 |
| TC-CLI-027 | 5.7 | Edit name after fetch | CRM-filled | Change Company name | Banner disappears; values stay | P3 |
| TC-CLI-028 | AC-CLI-010 | Duplicate company case/space | — | " infosys ltd " | Duplicate error; Continue blocked | P1 |
| TC-CLI-029 | BR-CLI-010 | Own name on edit | Edit Infosys Ltd | Keep name | No duplicate error | P2 |
| TC-CLI-030 | AC-CLI-011 | Company required fields | — | Empty, Continue | Five required messages | P1 |
| TC-CLI-031 | BR-CLI-005 | Required on blur | — | Focus Company name, leave empty | "Enter the company name" shows at once (differs from SH-004) | P2 |
| TC-CLI-032 | BR-CLI-009 | Name length | — | "A" / "AB" | "Name looks too short" / valid | P2 |
| TC-CLI-033 | 7.4 | Website format | — | "tatasteel", "tatasteel.com", "https://a.co/x", "a b.com" | Invalid / valid / valid / invalid | P2 |
| TC-CLI-034 | AC-CLI-012 | Mobile boundaries | — | 9 digits, "5123456789", "9876543210", typing "98a76" | Error / error / valid / "9876" | P1 |
| TC-CLI-035 | AC-CLI-014 | STD and phone | — | STD "011" + "2456789"; STD only "011"; STD "1" + "245678"; phone "12345" | Valid; "Enter a 6–8 digit number"; "Enter the STD code too"; "Enter a 6–8 digit number" | P2 |
| TC-CLI-036 | AC-CLI-013 | SEZ Yes | — | Yes, no number/doc | Two errors; SEZ number shown in capitals as typed | P2 |
| TC-CLI-037 | 7.5 | Individual required | Individual | Empty, Continue | "Enter the participant’s name", "Enter an email address", "Enter a mobile number" | P1 |
| TC-CLI-038 | 7.5 | Individual email format | — | "a@b.c", "a@b.co", "a b@c.co" | Invalid / valid / invalid | P2 |
| TC-CLI-039 | 7.4 | Logo upload | — | 3 MB PNG; 1 MB GIF | Toast "Logo must be under 2 MB."; GIF accepted | P3 |
| TC-CLI-040 | AC-CLI-021 | Document type and size | — | .docx; 6 MB PDF; 4.9 MB JPG | Rejected; rejected; attached | P2 |
| TC-CLI-041 | 5.6 | Document remove/replace/preview | Doc attached | Click name; Replace; Remove | Preview opens; file replaced; removed without confirmation | P3 |
| TC-CLI-042 | AC-CLI-015 | Pin rules | India / Singapore | "012345", "40000", "400001"; "AB", "238 823" | Error, error, valid; "Enter a valid postal code", valid | P2 |
| TC-CLI-043 | BR-CLI-017 | Cascade | — | Change Country to United States | State and City cleared; US states | P2 |
| TC-CLI-044 | AC-CLI-016 | Office address | — | Untick; Continue empty | Office errors shown | P2 |
| TC-CLI-045 | 7.7 | Addresses required on Continue | — | Leave State empty | "Choose a state" only after Continue | P3 |
| TC-CLI-046 | AC-CLI-018 | Billing panel validation | — | Invalid GST, no certificate | Errors after Save address only | P1 |
| TC-CLI-047 | 5.8.1 | Use communication address | Comm address filled | Click | Panel address filled | P3 |
| TC-CLI-048 | 5.8.1 | Multiple billing addresses | One saved | Add another, save | "Billing address 2" | P3 |
| TC-CLI-049 | AC-CLI-019 | Delete billing address | Saved address | Bin → Delete | Removed | P3 |
| TC-CLI-050 | AC-CLI-017 | No billing address | Company | Save client | Toast "Add a billing address" | P1 |
| TC-CLI-051 | BR-CLI-023 | Unsaved panel ignored | One saved + filled open panel | Save client | Only the saved address kept | P3 |
| TC-CLI-052 | 7.9 | Individual GST optional | Individual | Empty; "27AAPFU0939F1ZV" without certificate | Both save | P3 |
| TC-CLI-053 | AC-CLI-020 | Lower TDS boundaries | TDS on | Rate 0 / 99.99 / 100 / "1.2.3"; amount 0 / 0.5 | Valid / valid / error / error; error / valid | P2 |
| TC-CLI-054 | 7.10 | Lower TDS required | TDS on | All empty, Save client | Six required messages | P2 |
| TC-CLI-055 | BR-CLI-029 | Lower TDS off | Fields filled invalid | Switch off, save | Saves | P3 |
| TC-CLI-056 | AC-CLI-022 | Save new company | Valid form | Save client | "Client added"; first in list; Active; Created by = user | P1 |
| TC-CLI-057 | 6.5 | Save new individual | Valid individual | Save client | Listed with "Individual · <city>" | P1 |
| TC-CLI-058 | AC-CLI-023 | Edit and save | Existing client | Change website | "Changes saved"; activity "Updated details of" | P1 |
| TC-CLI-059 | AC-CLI-024 | Edit opens failing step | Error on Addresses | Save changes from Billing | Addresses opens; toast | P2 |
| TC-CLI-060 | AC-CLI-025 | Edit status | Active client | Switch off, save | Inactive everywhere; "Marked inactive" | P1 |
| TC-CLI-061 | BR-CLI-008 | Type fixed on edit | Edit | Click Training for | Disabled; tooltip | P3 |
| TC-CLI-062 | AC-CLI-026 | Guard: sidebar, breadcrumb, Cancel | Changes typed | Each route | Dialog each time | P1 |
| TC-CLI-063 | AC-CLI-026 | No guard when untouched | Only type chosen | Cancel | Leaves immediately | P3 |
| TC-CLI-064 | 5.9 | Not guarded | Changes typed | Browser Back | Leaves without warning | P3 |
| TC-CLI-065 | AC-CLI-027 | Unknown edit link | — | /clients/unknown/edit | "Client not found" | P2 |
| TC-CLI-066 | 5.4 | Enter key moves on | Details valid | Press Enter in a text field | Addresses step | P3 |
| TC-CLI-067 | 11 | Demo client edit data | Demo client "Crucial Learning India" | Open Edit | Industry "Education & Training"; sample addresses and billing | P3 |
| TC-CLI-068 | SH-001 | Reload reverts | Client added | Reload | Client gone | P3 |

## 15. Open Questions and Gaps

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

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages, sections and their features: Complete
- [x] User roles and access: Complete (no role enforcement, SH-002)
- [x] Workflows: Complete
- [x] Field-level specifications for every input, search and filter: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (text maximum lengths and date limits not defined — see OQ-CLI-004, OQ-CLI-008)
- [x] Validation and business rules: Complete
- [x] Success, error and feedback messages quoted exactly: Complete
- [x] Tables, sorting, pagination and filters: Complete
- [x] Empty states, errors and edge cases: Complete
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria incl. negative cases: Complete
- [x] QA test scenarios with boundaries: Complete
- [ ] Not-implemented features defined: Incomplete (Export, bulk actions, deletion, global search — see OQ-CLI-001, OQ-CLI-018)
- [ ] Source of dropdown lists and CRM integration: Incomplete (see OQ-CLI-003, OQ-CLI-011)
