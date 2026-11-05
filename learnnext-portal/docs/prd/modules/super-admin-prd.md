# Super Admin Portal: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Super Admin Portal PRD |
| Module name | Super Admin portal (Manage Clients list, Client details with Overview · Sub clients · Tax & Billing · Settings & Configuration · Activity History, Add client, Edit client) |
| Document ID | PRD-SA |
| Version | 1.0 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (screens and data entry work on demo data — SH-001. The CRM fetching, portal access, email update and inactive-status settings are only stored; they have no effect yet) |
| Last updated | 2026-11-05 |
| Related modules/pages | [authentication-prd.md](authentication-prd.md) (PRD-AUTH: sign-in and the "Continue as" role picker), [app-shell-navigation-prd.md](app-shell-navigation-prd.md) (PRD-SHELL), [clients-prd.md](clients-prd.md) (PRD-CLI: the Training Partner's All Clients and Add client, whose address and billing steps are reused here), [client-detail-prd.md](client-detail-prd.md) (PRD-CLD: the Training Partner's Client details, whose hero, tabs, Tax & Billing and Activity timeline are reused here), [profile-prd.md](profile-prd.md) (PRD-PROF), [../shared-requirements.md](../shared-requirements.md) |

## 2. Purpose and Objective

LearnNext Portal is one application with several portal roles. **Super Admin** is the role that runs LearnNext's own customer base. For a Super Admin, a "client" is a **training-partner company**: an organisation that uses LearnNext through the **Training Partner** portal. Each training partner's own clients (the companies and individuals it trains, as listed in its All Clients page) are that partner's **Sub clients**.

Objectives:

- Give the Super Admin one searchable list of every training partner, with its code, number of sub clients, contact person, date added and status.
- Let the Super Admin add a training partner by hand through a short page wizard (Details → Addresses → Billing). The wizard captures the company, its contact person, its addresses, its GST billing addresses and any Lower TDS certificate. There is no CRM look-up.
- Prevent the same training partner from being added twice.
- Show everything about one training partner on a single details page: profile and contact person, its sub clients, tax and billing details, its configuration (status, CRM fetching, portal access, email updates) and an activity history.
- Keep the Super Admin portal deliberately small. It has only **Manage Clients** and **My Profile**, and every other address returns the user to Manage Clients.

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Entering the Super Admin portal | Start a Super Admin visit | Super Admin user | Choose **Super Admin** in "Continue as" after sign-in (PRD-AUTH) | Manage Clients |
| Super Admin app shell | The portal's menu, header, phone tab bar and search | Super Admin user | Open Manage Clients or My Profile, search (⌘K), switch role, log out | All Super Admin pages |
| Manage Clients list (`/clients`) | See and find every training partner | Super Admin user | Filter by status pill, search, sort, page, open a client, edit a client, add a client | Client details, Add client, Edit client |
| Client details (`/clients/:id`) | Everything about one training partner | Super Admin user | Switch tabs, Edit, go back to Manage clients | Manage Clients, Edit client |
| Overview tab | Profile, contact person and address at a glance | Super Admin user | Open Sub clients from the stats strip, copy the client code, open website / email / phone links | Sub clients tab |
| Sub clients tab | The training partner's own clients | Super Admin user | Filter by status pill, search, sort, page (view only) | Training Partner portal's All Clients (data source) |
| Tax & Billing tab | Billing addresses, GSTINs and Lower TDS | Super Admin user | View certificates (view only) | Edit client (Billing step) |
| Settings & Configuration tab | Status, CRM fetching, portal access and email updates | Super Admin user | Toggle settings, Reset, Save changes | Activity History, Manage Clients (status) |
| Activity History tab | Timeline of everything that happened with the training partner | Super Admin user | Filter by type and date, show more | — |
| Add client (`/clients/new`) | Add a training partner in three steps | Super Admin user | Fill Details, Addresses and Billing, Save client, Cancel | Manage Clients |
| Edit client (`/clients/:id/edit`) | Change a training partner's details and status | Super Admin user | Open any step, edit, Save changes, Cancel | Client details |
| Client not found | Explain a bad details or edit link | Super Admin user | Return to Manage clients | Manage Clients |
| My Profile (`/profile`) | The user's own profile | Super Admin user | As PRD-PROF | — |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Super Admin (a signed-in user whose login carries the Super Admin role and who chose it in "Continue as") | Manage Clients (list, details, add, edit) and My Profile only | View, search, add and edit training partners; change their status and configuration; view their sub clients, tax and billing details and activity | Any other address (for example Dashboard, Settings, Support, Facilitators, Manage Content) sends the user to Manage Clients (BR-SA-002). No Settings, notifications, Support card or Dev-only pages. Sub clients are view only. Training partners cannot be deleted |
| Training Partner (the same login in the other portal) | The Training Partner portal (PRD-CLI and others) | Not covered here | Cannot open Super Admin pages while signed in as Training Partner. The same addresses (for example `/clients`) show the Training Partner's own pages instead (BR-SA-003) |
| Multi-role user | Either portal, one at a time | **Switch role** in the user menu returns to "Continue as" (PRD-AUTH) | One role per visit |
| Signed-out visitor | Redirected to Sign in (SH-003) | None | — |

In the demo build, the demo login carries the Training Partner, Super Admin, Facilitator and Participant roles. Only the first two have a portal, so the others show "Coming soon" in the role picker (PRD-AUTH).

## 5. Page Functionality and Behavior

### 5.1 Entering the portal and the app shell

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Role tile **Super Admin** | Choose the portal | Pick the tile "Super Admin" / "Manage clients" in "Continue as", then **Continue as Super Admin** | Toast "Welcome back, <first name>" appears once the page has loaded; the user lands on **Manage Clients** | The Super Admin portal always starts on Manage Clients, even if the user originally asked for another page (BR-SA-004). See PRD-AUTH for the picker and "Remember my choice on this device" | Manage Clients |
| Sidebar menu | Navigate | Click | A single item: **Manage Clients** | No sidebar footer card (no Support desk card), no "Dev only" section | Manage Clients |
| Header | Page name, search, user | View | Breadcrumb names (SH-009): "Manage Clients"; "Manage Clients › Add client"; "Manage Clients › Edit client"; "Manage Clients › Client details"; "My Profile". No notification bell | — | — |
| User menu | Account actions | Open | **My Profile**, **Switch role** (only when the login has more than one role), the Theme choices, **Log out** | **Settings** is not offered (BR-SA-005) | — |
| Phone tab bar (below 768 px) | Navigate on phones | Tap | Two tabs: **Clients** and **More**. **More** opens the sheet with just the user's name, the role name and **View profile**: there are no module tiles | SH-010, SH-013 | — |
| Global search (⌘K) | Jump to pages and training partners | Type | Two groups. **Pages**: Manage Clients, Add client (section "Manage Clients"), My Profile (section "Account"). **Clients**: training partners matched on name, code, mobile, city or contact person, shown as name with "code · city · contact person"; choosing one opens its Client details | Only Super Admin's own pages and training partners are searched | Page opens |
| Blocked addresses | Keep the portal limited | Open any address outside `/clients…` and `/profile` (typed, bookmarked or from history) | The user is sent to Manage Clients, and the blocked address is replaced in browser history | BR-SA-002 | Manage Clients |
| Unknown address under `/clients` | — | For example `/clients/cl-1` (a Training Partner client) | Shows "Client not found" (5.10) | Training Partner client addresses are not Super Admin clients | Not-found card |

### 5.2 Manage Clients list: page and toolbar

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Page and breadcrumb | Identify the page | Click **Manage Clients** | Breadcrumb "Manage Clients"; no title block (SH-009) | — | List page |
| List card | Hold toolbar and list | View | One card: toolbar on top, then the table (768 px and wider) or cards (phones). Stretches to the window height on large screens | On phones the outer card frame is dropped (SH-013) | — |
| Summary pills | Counts and one-click status filter | Click a pill | **All clients** (tooltip "Show all clients"), **Active** ("Show active clients"), **Inactive** ("Show inactive clients") filter the list. **Sub clients** (tooltip "Their clients, in total") is a count only and cannot be clicked | Counts cover the whole list and ignore the search. **All clients** is never highlighted. The pressed pill gets a soft coloured ring. Skeleton bar while loading | List filtered |
| Pills on phones | Filter on phones | Tap | The pills stay visible on phones as one sideways-scrolling line above the search box | Differs from SH-008 / SH-013, because this list has no filter drawer (OQ-SA-014) | — |
| Search box | Find a training partner | Type | Filters as the user types (short delay). Placeholder "Search name, code, city, contact…", accessible name "Search clients" | Matches name, code, city, contact person or mobile (7.1). On medium-width toolbars the box becomes a search icon (SH-008) | List narrows |
| **Add client** | Add a training partner | Click | Opens Add client (5.8) | Phones: "+" icon button labelled "Add client" | Add client page |
| Result line | Show narrowing | Search or pick a pill | "**N** of **T** clients" and **Clear all** | No filter chips are shown (the pressed pill shows the status). **Clear all** resets the status and the search | — |
| Filters drawer, export, bulk actions, delete [Not Implemented] | — | — | There is no Filters button, no export, no row selection and no delete | OQ-SA-005 | — |

### 5.3 Manage Clients list: table and cards

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Table | List training partners | Sort, page, click | Columns in section 10. Header stays visible while scrolling. Default order: **Added on**, newest first | Lower-priority columns hide as the screen narrows | — |
| Row click | Open a training partner | Click a row | Opens Client details on Overview | Hover: slim blue bar on the left edge, name turns blue, arrow cue slides in | Client details |
| Edit (pencil) | Edit | Click "Edit <name>" | Opens Edit client without opening the row | Every row and card | Edit client |
| Logo | Identify the partner | View | The partner's logo on a white tile, or a coloured two-letter monogram when there is none (as PRD-CLI 5.3) | Demo partners each have their own logo artwork | — |
| Cards (phones) | Readable list | Tap | Card: logo, name, "industry · city", code chip and status, edit pencil; under a dashed line "<N> sub client(s) · <contact person>" and the date added. Tapping the card opens the partner | Cards follow the table's default order; 12 per page, pager only when more than 12 (SH-008, SH-013) | Client details |
| Pagination | Page | Arrows, rows per page | 10 rows per page; "10 rows", "20 rows", "50 rows", "All rows" | Returns to page 1 when the result count changes | — |
| Loading | — | Open | Skeleton rows / cards and a skeleton pill bar (SH-007) | — | — |

### 5.4 Client details: hero and tabs

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Hero card | Identify the training partner | View | Logo, name, then one line: code chip · industry · city · status dot "Active" / "Inactive". A soft wash follows the logo's colour | Phones hide the industry | — |
| **Manage clients** button | Go back | Click | Opens Manage Clients | Phones: inside the ⋮ menu ("Manage clients", "Edit client") — SH-013 | Manage Clients |
| **Edit** | Edit the partner | Click | Opens Edit client | — | Edit client |
| Section tabs | Switch sections | Click | **Overview**, **Sub clients**, **Tax & Billing**, **Settings & Configuration**, **Activity History**. Blue underline glides to the open tab; the bar pins under the header while scrolling; arrows and edge fades when the row is wider than the screen | The open tab is kept in the address (`?tab=sub-clients`, `billing`, `settings`, `activity`; Overview has none) and replaces the history entry. An unknown tab value opens Overview | Tab opens |
| Switching tabs | — | Click another tab | The tab's content is rebuilt; an unsaved Settings draft is discarded without warning (BR-SA-030) | OQ-SA-008 | — |

### 5.5 Overview tab

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Stats strip | Sub-client counts | View / click | Two halves: **Sub clients** (total) and **Active sub clients**. Clicking either opens the Sub clients tab | Shows "–" while loading. The tab opens unfiltered (it does not preselect Active) | Sub clients tab |
| **Company profile** | Company facts | View | Company type, Industry, Client code (monospace, copy button), Website (opens in a new tab; "https://" added when missing), Client since (date; relative time on hover), Added by (avatar and name) | Missing values show "—" (SH-012). Copy shows a tick and "Copied" briefly | — |
| **Contact person** | Who to talk to | View / click | Name, Email (opens the mail app), Mobile "+91 98765 43210" (opens the dialler), Landline "(STD) number" | "—" when empty | — |
| **Address** | Where to write | View | **Communication**: line 1, line 2 / city, state, pin / country | "Not added yet" when there is no address. The office address is not shown (OQ-SA-007) | — |

### 5.6 Sub clients tab

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Purpose | Show the partner's own clients | View | One card: toolbar, then the table (cards on phones) | Data comes from the Training Partner portal's All Clients (BR-SA-020) | — |
| Summary pills | Counts and status filter | Click | **All sub clients** ("Show all sub clients"), **Active** ("Show active sub clients"), **Inactive** ("Show inactive sub clients") | Shown on phones too (as 5.2). Counts ignore the search | List filtered |
| Search | Find a sub client | Type | Placeholder "Search name, code, city…", accessible name "Search sub clients". Matches name, code, city, industry or mobile | Result line "**N** of **T** sub clients" with **Clear all** | — |
| Table | List sub clients | Sort, page | Columns in section 10. Default order: name A–Z | Rows cannot be clicked and have no actions (view only — OQ-SA-011) | — |
| Cards (phones) | — | View | Logo, name, "industry · city", code chip and status; footer the mobile number (or "No mobile") and the date added | Cards cannot be tapped open | — |
| No Add action | — | — | Sub clients are added only by the training partner in its own portal | — | — |

### 5.7 Tax & Billing, Settings & Configuration and Activity History tabs

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Tax & Billing: **Billing addresses** | GST registrations | View | Description "One for each GST registration the company is billed under." One card per address: "Billing address N", lines 1–2, "city, state, pin", the GSTIN and the certificate name (click opens the preview) | Same as PRD-CLD Tax & Billing. "No billing addresses added." when none. Phones: heading hidden, outer frame dropped | Preview |
| Tax & Billing: **Lower TDS** | Lower TDS certificate | View | Description "The client has a lower TDS certificate." or "No lower TDS certificate — the standard rate applies." When present: Lower TDS rate (%), Amount (₹, SH-012), Section, Valid from, Valid to, Certificate | Valid to adds "Expired" (past) or "Ends in N days" (30 days or fewer). View only | — |
| Settings: **Client status** card | Activate or deactivate | Toggle | Description "Inactive clients stay on file but can’t sign in". Switch "Active client" / "Inactive client", help "Turn off to mark this client inactive." / "Turn on to make this client active again." | Draft until saved. Sign-in is not actually blocked (BR-SA-026, OQ-SA-002) | — |
| Settings: **CRM fetching** card | How the partner adds its own clients | Toggle | Description "How this training partner adds its own clients". On: "CRM fetching on" / "Adding a client looks the company up in their CRM portal and fills in every step." Off: "CRM fetching off" / "Every client is filled in by hand — no CRM look-up." | **Known gap:** the setting is stored only; the Training Partner's Add client still offers the CRM look-up whatever it is set to (BR-SA-025, OQ-SA-001) [Partially Implemented] | — |
| Settings: **Access & communication** card | Sign-in and emails | Toggle | Description "Who can sign in and who hears from us". **Training Partner portal access** ("Their team can sign in and manage their clients.") and **Email updates to the contact person** ("Account notices and monthly summaries.") | Stored only; not enforced, no emails sent (OQ-SA-002) [Partially Implemented] | — |
| Settings: save bar | Save or discard | View / click | "You have unsaved changes." or "All changes saved." **Reset** restores the last saved values. **Save changes** saves (spinner) | Both disabled when nothing changed; Reset also disabled while saving | Toast "Settings saved" — "<partner name>" |
| Activity History | Audit trail | View / filter | Header "Activity history" with the entry count and "Everything that happened with this client, newest first". Same timeline, period summary, type and date filters, day grouping and **Show more** (8 at a time) as PRD-CLD 5.10, without the heat map | Types: **Client**, **Sub clients**, **Settings & CRM** (7.5). On phones the header is hidden | — |
| Activity entries | — | — | Client: "Added client", "Updated details of", "Marked active" / "Marked inactive". Settings & CRM: "Turned on CRM fetching for", "Turned off CRM fetching for", "Changed settings & configuration of". Sub clients: "Added sub client <name>" with "by <creator> · <city>". Own entries carry "by <user>" | BR-SA-027, BR-SA-028 | — |

### 5.8 Add client / Edit client: page frame

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Steps panel (1280 px and wider) | Progress and step jumps | View / click | Heading "New client" / "Edit client"; line "3 steps — fill in each by hand." / "Open any step to make changes." Steps: **Details** "Company & contact person", **Addresses** "Communication & office", **Billing** "Addresses, GST & TDS". Done steps show a tick. Note: "Fields marked * are required. You can go back to any finished step." (add) / "… Save changes checks every step." (edit) | Add: only the current and earlier steps can be clicked (no validation going back). Edit: every step can be clicked. The panel stays in place while scrolling | Step opens, page scrolls to top |
| Compact progress (below 1280 px) | Progress | View | Step name, "Step X of 3", three bars | Not clickable | — |
| Action bar | Move through the form | Click | Left: **Back** (from step 2) and **Cancel**. Right, add: **Continue** (steps 1–2) / **Save client** (step 3). Edit: **Next** (not on the last step) and **Save changes** | Back, Cancel and Next disabled while saving; save buttons show a spinner (SH-007) | — |
| **Continue** / **Next** | Next step | Click, or Enter in a field on Details / Addresses | Checks the step; if valid opens the next step, otherwise shows all of the step's errors and focuses the first invalid field | Enter does nothing on Billing | — |
| **Cancel** | Leave | Click | Add: back to Manage Clients. Edit: back to the partner's Client details. Asks first when there are unsaved changes (5.9) | — | — |
| No CRM look-up | — | — | Company name is a plain text box; nothing is fetched or suggested | BR-SA-010 | — |
| Not found (edit) | Bad edit link | Open an edit address for an unknown partner | "Client not found" / "It may have been removed, or the link is out of date." with **Manage clients** | No form shown | Manage Clients |

### 5.9 Add / Edit client: steps and saving

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Company details** card | The partner's identity | Fill | Description "The training partner, as it appears across LearnNext." Company name, Client code (read only), Company type, Industry, Website (7.2) | No Special Economic Zone question (unlike PRD-CLI — OQ-SA-012) | — |
| **Contact person** card | Who LearnNext talks to | Fill | Description "Who we talk to at this training partner." Name, Email, Mobile number, Phone number (STD + number) | — | — |
| **Status** card (edit only) | Activate / deactivate | Toggle | Description "Inactive clients stay on file but can’t sign in." Same switch wording as 5.7 | Saved with **Save changes**; same status as the Settings tab | — |
| **Company logo** card | Visual identity | Upload / view / change / remove | Description "Shown next to the client across LearnNext." Same picker as PRD-CLI (hint "Optional · PNG, JPG or SVG, up to 2 MB") | 7.2 | — |
| Addresses step | Communication and office address | Fill | Same as PRD-CLI 5.8 / 7.7: **Communication address** "Where we send letters and certificates." and the checkbox "Office address is the same as the communication address" (ticked); unticking shows **Office address** "Where the client’s team works." | 7.3 | — |
| Billing step | GST billing addresses and Lower TDS | Fill | Same as PRD-CLI 5.8.1 / 7.8 / 7.10: **Billing addresses** card with the add/edit panel (**Use communication address**, **Save address** / **Update address**, Cancel, edit, delete with "Delete this billing address?"), and the **Lower TDS** card | 7.4. The panel opens automatically when no address is saved | — |
| **Save client** (add) | Create | Click | Checks the Billing step (Lower TDS), then that at least one billing address is saved, then saves. Success: toast "Client added" — "<name> (<code>)" and Manage Clients opens with the new partner first | New partners: Active, 0 sub clients, default settings (BR-SA-016) | Manage Clients |
| **Save changes** (edit) | Save edits | Click on any step | Checks every step; opens the first failing step with toast "Check the highlighted fields" — "<Step> needs a few fixes before saving." Then checks for a billing address. Success: toast "Changes saved" — "<name> (<code>)" and the partner's Client details opens | Always enabled, even without changes (OQ-SA-009) | Client details |

### 5.10 Unsaved-changes guard and not-found pages

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Leave confirmation | Protect typed work | **Cancel**, the sidebar, the breadcrumb, a ⌘K result, the phone tab bar or More sheet, **My Profile** or **Switch role** in the user menu | With unsaved changes: "Discard this client?" / "The details you’ve entered won’t be saved." (add) or "Discard your changes?" / "Your edits to this client won’t be saved." (edit); **Keep editing** and red **Discard** | Add: any value differs from the opening form. Edit: any field or the status differs. Browser Back, reload and Log out are not intercepted (SH-006) | BR-SA-031 |
| Settings tab draft | — | Leave the tab or the page with unsaved settings | No warning; the draft is lost | OQ-SA-008 | — |
| Client not found (details) | Bad details link | Open `/clients/<unknown>` | Card "Client not found" / "It may have been removed, or the link is out of date." with **Manage clients**; no hero or tabs | — | Manage Clients |

## 6. User Workflow

### 6.1 Enter the Super Admin portal

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Sign in (PRD-AUTH) | "Continue as" shows the login's roles | Login has more than one role | Role picker |
| 2 | Choose **Super Admin**, click **Continue as Super Admin** | Role set; toast "Welcome back, <first name>" | — | Manage Clients |
| 3 | Type `/dashboard` in the address bar | Redirected | Address not allowed | Manage Clients |
| 4 | Open the user menu | My Profile, Switch role, Theme, Log out | No Settings | — |

### 6.2 Find a training partner

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open **Manage Clients** | List newest added first, 10 per page | — | Pills and table |
| 2 | Click **Inactive** | Only inactive partners | — | "1 of 5 clients" (demo) |
| 3 | Type "Pune" | Narrows by city as well | — | Result line updates |
| 4 | Click **Clear all** | Status and search reset | — | Full list |
| 5 | Click a row | Client details, Overview | — | 5.4 |

### 6.3 Add a training partner

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Add client** | Details step; Client code shows the next code (e.g. TPR006); Industry preset to "Education & Training" | — | — |
| 2 | Fill Company name, Company type, contact Name, Email, Mobile (optional Website, Phone, logo); **Continue** | Validates Details | 7.2; name not already a training partner | Addresses step |
| 3 | Fill the communication address (and office if different); **Continue** | Validates | 7.3 | Billing step with an open billing-address panel |
| 4 | Fill the billing address, GST No. and certificate; **Save address** | Card "Billing address 1" | 7.4 | — |
| 5 | Optionally turn on Lower TDS and fill it | — | 7.4 | — |
| 6 | Click **Save client** | Saves (spinner) | ≥ 1 billing address | Toast "Client added"; Manage Clients with the new partner first, Active, 0 sub clients |

### 6.4 Edit a training partner

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the pencil on Manage Clients or **Edit** on Client details | Edit client on Details, pre-filled; all steps clickable | Partner exists | — |
| 2 | Change fields or the Status switch | — | — | Form "changed" |
| 3 | Click **Save changes** | Checks every step | First failing step opens with toast "Check the highlighted fields" | Toast "Changes saved"; Client details opens |
| 4 | Open Activity History | "Updated details of" (and "Marked active/inactive" if the status changed) | — | — |

### 6.5 Configure a training partner

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open the **Settings & Configuration** tab | Current values; "All changes saved." | — | — |
| 2 | Turn CRM fetching on | Label "CRM fetching on"; "You have unsaved changes." | — | Reset and Save enabled |
| 3 | Click **Save changes** | Saves (spinner) | — | Toast "Settings saved" — "<name>" |
| 4 | Open Activity History | "Turned on CRM fetching for <name>" | — | — |

### 6.6 Review sub clients

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | On Overview, click **Sub clients** in the stats strip | Sub clients tab opens | — | Table A–Z by name |
| 2 | Click **Active** and search | Narrowed list | — | "N of T sub clients" |
| 3 | Click a row | Nothing happens (view only) | — | OQ-SA-011 |

## 7. Forms and Field-Level Specifications

Validation timing in the Add/Edit client form differs from SH-004. A field's error, **including** "required", shows as soon as the user leaves a field that has a blur check, even if it was left empty. This applies to Company name, Company type, Website, Name, Email, Mobile number, STD code, phone number, address lines and the pin code. Fields without a blur check (Industry, Country, State, City, Lower TDS dates and every upload) show their errors only on **Continue**, **Next**, **Save client** or **Save changes**. Once shown, errors update live as the user types. The billing-address panel shows its errors only on **Save address** / **Update address**. This matches the Training Partner client form (PRD-CLI 7) and is open as OQ-SA-004. Required fields show a red "*"; optional ones show "(optional)".

### 7.1 Manage Clients and Sub clients toolbars

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Status pills (Manage Clients) | One-click pills | Filter by status | Optional | N/A | N/A | All clients, Active, Inactive (Sub clients pill is a count only) | All clients | None | Shown on phones too | N/A |
| Search clients | Search box, placeholder "Search name, code, city, contact…" | Quick find | Optional | N/A | Requires Confirmation | Case-insensitive "contains" on name, code, city, contact person name and mobile (stored as 10 digits, so digits must be typed without spaces or "+91") [Inferred]. Surrounding spaces ignored | Empty | None | Short delay before filtering | N/A |
| Status pills (Sub clients) | One-click pills | Filter by status | Optional | N/A | N/A | All sub clients, Active, Inactive | All sub clients | None | — | N/A |
| Search sub clients | Search box, placeholder "Search name, code, city…" | Quick find | Optional | N/A | Requires Confirmation | Case-insensitive "contains" on name, code, city, industry and mobile as stored (sub-client mobiles may be stored formatted, e.g. "+91 98199 47703", so a digits-only search may miss them) [Inferred] | Empty | None | — | N/A |
| Rows per page | Select | Table page size | Optional | N/A | N/A | 10 rows, 20 rows, 50 rows, All rows | 10 rows | None | Phones: 12 cards per page, no choice | N/A |

### 7.2 Step 1: Details

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Company name | Text, placeholder "e.g. BrightPath Training Academy LLP" | Partner's name | Required | 2 characters (after trimming) | Requires Confirmation | Any text; trimmed when saved | Empty (edit: saved name) | Required → at least 2 characters → not already a training partner (case-insensitive, trimmed; the partner itself excluded when editing). Shown on blur | — | "Enter the company name"; "Name looks too short"; "This company is already a client" |
| Client code | Read-only text, helper "Generated automatically" | Partner code | N/A (system) | N/A | N/A | "TPR" + 3 digits: one more than the highest existing code (e.g. TPR006) | Next code (edit: existing code) | None | Never changes on edit | N/A |
| Company type | Select, placeholder "Select" | Legal form | Required | N/A | N/A | Same fixed list as PRD-CLI 7.4 (Private Limited, Public Limited, Limited Liability Partnership (LLP), Partnership Firm, Sole Proprietorship, Government / PSU, Non-profit / NGO, Multinational (MNC)) | None | Required | — | "Choose a company type" |
| Industry | Searchable select, placeholder "Select", search "Search…" | Industry | Required | N/A | N/A | Same fixed list as PRD-CLI 7.4 | "Education & Training" | Required (shown on Continue) | — | "Choose an industry" |
| Website | Text, placeholder "company.com" | Website | Optional | N/A | Requires Confirmation | Optional http(s)://, a domain with at least one dot, optional path, no spaces | Empty | Format, only when filled | — | "Enter a valid website, e.g. brightpath.in" |
| Name (contact person) | Text, placeholder "Full name" | Contact person | Required | 1 character (after trimming) | Requires Confirmation | Any text | Empty | Required | — | "Enter the contact person’s name" |
| Email (contact person) | Email, placeholder "name@company.com" | Contact email | Required | Requires Confirmation | Requires Confirmation | SH-004 email format, checked after trimming | Empty | Required → format. No duplicate check (OQ-SA-006) | — | "Enter an email address"; "Enter a valid email address" |
| Mobile number | Phone text with fixed "+91", placeholder "98765 43210" | Contact mobile | Required | 10 digits | 10 digits (further typing blocked) | Digits only (others removed as typed); starts with 6–9 | Empty | Required → 10 digits starting 6–9 | Shown as "+91 98765 43210" | "Enter a mobile number"; "Enter a valid 10-digit mobile number" |
| Phone number: STD code | Numeric text, placeholder "STD" | Landline area code | Optional (required if a number is entered) | 2 digits | 5 digits (further typing blocked) | Digits only; 2–4 digits, optionally preceded by 0 | Empty | Checked when either part has a value | Error shows under Phone number | "Enter the STD code too" |
| Phone number: number | Numeric text, placeholder "Number" | Landline | Optional (required if an STD code is entered) | 6 digits | 8 digits (further typing blocked) | Digits only | Empty | Checked when either part has a value | Shown once the STD code is valid | "Enter a 6–8 digit number" |
| Status (edit only) | Switch | Active / inactive | Always set | N/A | N/A | Active client / Inactive client | Current status | None | Edit only | N/A |
| Company logo | Image upload (**Upload logo** / **Change** / **Remove**) | Logo | Optional | N/A | 2 MB | Any image file | None (edit: saved logo) | Image type; size | Click opens a full-size preview | Toast: "Please choose an image file."; "Logo must be under 2 MB." |

### 7.3 Step 2: Addresses

Identical to PRD-CLI 7.7: Address line 1 ("Enter address line 1"), Address line 2 ("Enter address line 2"), Country (default India; "Choose a country"), State ("Choose a state"), City ("Choose a city"), Pin code (6 digits, not starting with 0: "Enter the pin code", "Pin code is 6 digits") or Postal code outside India (3–10 letters, digits, spaces or hyphens: "Enter a valid postal code"), and the checkbox "Office address is the same as the communication address" (ticked). Unticking it requires the same six office fields. The communication city becomes the city shown on Manage Clients.

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Communication address (six fields) | As PRD-CLI 7.7 | Where letters go | Required | As PRD-CLI 7.7 | As PRD-CLI 7.7 (line lengths Requires Confirmation) | As PRD-CLI 7.7 | Country India | As PRD-CLI 7.7 | Country → State → City cascade | As above |
| Office address same | Checkbox | Skip the office address | Optional | N/A | N/A | Ticked / unticked | Ticked | None | Unticked shows **Office address** | N/A |
| Office address (six fields) | As above | Office | Required when unticked | As above | As above | As above | Country India | As above | — | As above |

### 7.4 Step 3: Billing

Identical to PRD-CLI 7.8 and 7.10. The form always behaves as a **company** (there is no individual type).

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Billing address fields | As 7.3 | Billing address | Required | As 7.3 | As 7.3 | As 7.3 | Empty, India (or copied with **Use communication address**) | Checked on **Save address** / **Update address** | — | As 7.3 |
| Company GST No. | Text, placeholder "15-character GSTIN" | GST registration | Required | 15 characters | 15 (further typing blocked) | GSTIN pattern, capitals as typed (PRD-CLI 7.8) | Empty | Required → pattern. No duplicate or state check | — | "Enter the company GST No."; "GST No. is 15 characters, e.g. 27AAPFU0939F1ZV" |
| GST certificate | File upload "Upload GST certificate *" | Proof | Required | N/A | 5 MB | PDF, JPG or PNG | None | Required; type; size | — | "Attach the GST certificate"; "Use a PDF, JPG or PNG file."; "File must be under 5 MB." |
| Billing addresses (list) | Saved cards | All registrations | Required | 1 | None defined | — | None | At least one when saving | An open, unsaved panel is ignored | Toast "Add a billing address" — "Save at least one billing address with its GST No." |
| Do you have Lower TDS details? | Switch, help "Turn on if the client has a lower TDS certificate." | Lower TDS applies | Optional | N/A | N/A | On / off | Off | None | On reveals the six fields below | N/A |
| Lower TDS rate | Decimal with "%" | Rate | Required when on | 0 | Less than 100 | Digits and "." | Empty | Required → 0 to under 100 | — | "Enter the lower TDS rate"; "Enter a rate between 0 and 100" |
| Amount | Decimal with "₹" | Amount covered | Required when on | More than 0 | Requires Confirmation | Digits and "." | Empty | Required → > 0 | — | "Enter the amount"; "Enter an amount above 0" |
| Section | Text, placeholder "e.g. 194J" | Tax section | Required when on | 1 | 10 (further typing blocked) | Capitals as typed | Empty | Required | — | "Enter the section, e.g. 194J" |
| Valid from | Date picker | Start | Required when on | Requires Confirmation | Requires Confirmation | Date | None | Required | — | "Choose a start date" |
| Valid to | Date picker | End | Required when on | Valid from | Requires Confirmation | Date ≥ Valid from | None | Required → not before Valid from | — | "Choose an end date"; "Must be on or after the start date" |
| Lower TDS certificate | File upload | Certificate | Required when on | N/A | 5 MB | PDF, JPG or PNG | None | Required; type; size | — | "Upload the certificate"; "Use a PDF, JPG or PNG file."; "File must be under 5 MB." |

### 7.5 Settings & Configuration and Activity History filters

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Client status | Switch | Active / inactive | Always set | N/A | N/A | Active client / Inactive client | Current status | None | Saved with **Save changes** | N/A |
| CRM fetching | Switch | CRM look-up for the partner's Add client | Always set | N/A | N/A | On / off | New partners: off. Demo: on for TPR001–TPR003, off for TPR004–TPR005 | None | Stored only (OQ-SA-001) | N/A |
| Training Partner portal access | Switch | Partner team may sign in | Always set | N/A | N/A | On / off | On | None | Stored only (OQ-SA-002) | N/A |
| Email updates to the contact person | Switch | Notices and summaries | Always set | N/A | N/A | On / off | On (demo TPR005: off) | None | Stored only (OQ-SA-002) | N/A |
| Activity type | Select | Filter timeline | Optional | N/A | N/A | All activity, plus Client, Sub clients and Settings & CRM where they have entries | All activity | None | As PRD-CLD 7.5 | N/A |
| Activity date range | Date range picker | Filter timeline | Optional | Requires Confirmation | Requires Confirmation | Presets and custom range, as PRD-CLD 7.5 | All time | **Apply** disabled until both dates are picked | — | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-SA-001 | Super Admin clients are training partners | In the Super Admin portal, a "client" is a training-partner company; its own clients are its sub clients | Everywhere in the portal | Lists, details and forms deal with training partners only | — | — |
| BR-SA-002 | Limited portal | Super Admin may open only `/clients…` and `/profile`; any other address goes to Manage Clients | Every navigation | Redirect, history entry replaced | `/settings`, `/dashboard` | None (silent redirect) |
| BR-SA-003 | Same address, different page | `/clients`, `/clients/new`, `/clients/:id` and `/clients/:id/edit` show Super Admin pages for Super Admin and Training Partner pages for Training Partner | Per chosen role | — | A Training Partner client address opened as Super Admin | "Client not found" |
| BR-SA-004 | Start page | Choosing Super Admin always starts on Manage Clients, never on a previously requested page | Continue as | — | — | Toast "Welcome back, <first name>" |
| BR-SA-005 | Reduced shell | No Settings in the user menu, no notifications, no sidebar footer card, no Dev-only pages; phone tab bar = Clients + More | Super Admin shell | — | — | — |
| BR-SA-006 | Default list order | Training partners are listed by date added, newest first | Manage Clients | — | — | — |
| BR-SA-007 | Sort cycle | A sortable header sorts ascending, then descending, then clears the sort | Both tables | As PRD-CLI BR-CLI-002 | — | Header arrow |
| BR-SA-008 | Summary counts | All clients / Active / Inactive count the whole list; Sub clients is the total of every partner's sub clients | Manage Clients | Ignore the search | — | — |
| BR-SA-009 | Quick search | Contains match on name, code, city, contact person and mobile (Manage Clients); name, code, city, industry and mobile (Sub clients) | Search | Rows narrow | No match | "No clients match" / "No sub clients match" |
| BR-SA-010 | Manual entry | Training partners are entered by hand; no CRM look-up, suggestions or auto-fill | Add / Edit client | Plain text Company name | — | Steps panel "3 steps — fill in each by hand." |
| BR-SA-011 | Unique training partner | A company name already used by another training partner (case-insensitive, trimmed) cannot be saved; the partner's own name is allowed when editing. Training Partner clients are not compared | Details | Blocks Continue / Save changes | Name of an existing partner | "This company is already a client" (on blur) |
| BR-SA-012 | Name length | Company name needs at least 2 characters after trimming | Details | — | "A" | "Name looks too short" |
| BR-SA-013 | Contact person required | Name, email and mobile of the contact person are required | Details | — | Missing | 7.2 messages |
| BR-SA-014 | Indian mobile | 10 digits starting 6–9, "+91" fixed | Details | Non-digits removed; 11th digit blocked | "5123456789" | "Enter a valid 10-digit mobile number" |
| BR-SA-015 | Partner code | New partners get "TPR" + 3 digits (highest existing + 1); read only; never changes | Add client | Shown when the form opens | — | Helper "Generated automatically" |
| BR-SA-016 | New partner defaults | A new partner is Active, has 0 sub clients, CRM fetching off, portal access on, contact emails on, created by the signed-in user ("You" if no name) now | Save client | Activity "Added client" | — | Toast "Client added" — "<name> (<code>)" |
| BR-SA-017 | Landline pair | STD code and number go together | Details | — | Only one filled | "Enter the STD code too" / "Enter a 6–8 digit number" |
| BR-SA-018 | Billing required | At least one saved billing address with GST No. and certificate | Save client / Save changes | Add: Billing step stays; Edit: Billing step opens | None saved | Toast "Add a billing address" — "Save at least one billing address with its GST No." |
| BR-SA-019 | Shared address, billing and TDS rules | Address cascade, pin/postal code, GSTIN, file and Lower TDS rules are those of PRD-CLI (BR-CLI-017 to BR-CLI-023, BR-CLI-028, BR-CLI-029) | Addresses, Billing | — | — | PRD-CLI messages |
| BR-SA-020 | Sub clients source | A partner's sub clients are the clients in the Training Partner portal's All Clients that belong to that partner. In the demo build the existing clients are shared out among the five demo partners in turn [Requires Confirmation] | Sub clients, counts, Activity | — | — | — (OQ-SA-003) |
| BR-SA-021 | Sub clients view only | Sub clients cannot be opened, added, edited or removed by Super Admin | Sub clients tab | No row or card action | — | — (OQ-SA-011) |
| BR-SA-022 | Step gate | A step cannot be left forward while it has errors; Add: only finished steps can be reopened | Continue / Next | First invalid field focused | — | Inline errors |
| BR-SA-023 | Edit validates everything | Save changes checks every step and opens the first failing one | Edit client | — | — | Toast "Check the highlighted fields" — "<Step> needs a few fixes before saving." |
| BR-SA-024 | After saving | Add returns to Manage Clients; Edit returns to the partner's Client details | Save | — | — | Success toast after the page loads |
| BR-SA-025 | CRM fetching setting [Partially Implemented] | The switch records whether the partner's Add client should look companies up in its CRM. It does not yet change the Training Partner's Add client | Settings tab | Stored and logged | — | Toast "Settings saved" (OQ-SA-001) |
| BR-SA-026 | Status and access settings [Partially Implemented] | Inactive status ("can’t sign in"), portal access and contact emails are stored and shown, but sign-in and email sending are not affected | Settings tab, Edit client | Status shows on the list and hero | — | — (OQ-SA-002) |
| BR-SA-027 | Settings logging | Saving records one entry per kind of change: "Marked active/inactive" (status), "Turned on/off CRM fetching for" (CRM), "Changed settings & configuration of" (portal access or contact emails) | Settings save | Entries by the signed-in user's name | — | — |
| BR-SA-028 | Edit logging | Every successful Save changes records "Updated details of" (even without changes) plus "Marked active/inactive" if the status changed | Edit client | — | — | — (OQ-SA-009) |
| BR-SA-029 | Settings save enabled only when changed | Reset and Save changes are disabled while the draft equals the saved values | Settings tab | — | — | "All changes saved." |
| BR-SA-030 | Settings draft not guarded | Unsaved settings are lost on switching tabs or leaving the page, without warning | Settings tab | — | — | — (OQ-SA-008) |
| BR-SA-031 | Form leave guard | Leaving Add/Edit client with unsaved changes through Cancel, the sidebar, breadcrumb, ⌘K, phone tab bar, More sheet, My Profile or Switch role asks first | Add / Edit client | **Keep editing** / **Discard** | — | 5.10 texts |
| BR-SA-032 | Unknown partner | A details or edit address for a partner that does not exist shows a not-found card | Details, Edit | — | Bad link | "Client not found" / "It may have been removed, or the link is out of date." |
| BR-SA-033 | Save rejected | Saving edits or settings for a partner that no longer exists saves nothing | Edit, Settings | Form stays | — | "Couldn’t save the changes" / "Couldn’t save the settings" — "This client no longer exists." |
| BR-SA-034 | No deletion [Not Implemented] | Training partners cannot be deleted; only made inactive | Everywhere | — | — | — (OQ-SA-005) |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Enter portal | Super Admin chosen | Success toast (SH-005) | "Welcome back, <first name>" | Once Manage Clients has loaded | Work in the list |
| Save client | Saved | Success toast | "Client added" — "<name> (<code>)" | After Manage Clients loads | Open the partner |
| Save client fails | Rejected | Error toast | "Couldn’t add the client" — reason | Form stays | Retry |
| Save changes | Saved | Success toast | "Changes saved" — "<name> (<code>)" | After Client details loads | — |
| Save changes fails | Partner gone | Error toast | "Couldn’t save the changes" — "This client no longer exists." | Form stays | Return to Manage clients |
| Save changes with errors | A step invalid | Error toast | "Check the highlighted fields" — "<Step> needs a few fixes before saving." | That step opens | Fix fields |
| No billing address | None saved | Error toast | "Add a billing address" — "Save at least one billing address with its GST No." | On Save | Add an address |
| Settings saved | Saved | Success toast | "Settings saved" — "<partner name>" | After save | — |
| Settings save fails | Rejected | Error toast | "Couldn’t save the settings" — reason | Draft kept | Retry |
| Settings state | Draft vs saved | Inline text | "You have unsaved changes." / "All changes saved." | Save bar | Save or Reset |
| Duplicate partner | Name taken | Inline error | "This company is already a client" | On leaving the field and on Continue / Save | Use another name |
| File / logo rejected | Wrong type or too large | Inline + error toast / toast | "Use a PDF, JPG or PNG file." / "File must be under 5 MB." / "Please choose an image file." / "Logo must be under 2 MB." | On choosing a file | Choose another |
| Leave with changes | Unsaved | Confirmation dialog | "Discard this client?" / "The details you’ve entered won’t be saved." or "Discard your changes?" / "Your edits to this client won’t be saved."; **Keep editing**, **Discard** | On leaving | Choose |
| Delete billing address | Bin clicked | Confirmation dialog | "Delete this billing address?" — "<line 1, line 2> · <GSTIN>"; **Cancel**, **Delete** | On delete | Confirm |
| Copy client code | Copy clicked | Inline | Tick and tooltip "Copied" for about 1.5 seconds | Overview | — |
| Searching | Search or pill active | Inline result line | "N of T clients" / "N of T sub clients" + **Clear all** | While narrowed | Clear all |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Manage Clients: **Company** | Identify | Sortable A–Z; cannot be hidden | Logo, name (truncated, full on hover), "industry · city" | — |
| Manage Clients: **Code** | Partner code | Sortable | Code chip (e.g. TPR001) | — |
| Manage Clients: **Sub clients** | How many clients the partner has | Sortable | Network icon + count | — |
| Manage Clients: **Contact person** | Who to call | Sortable (by name); hidden below 1024 px | Name and "+91 98765 43210" | "—" when no name |
| Manage Clients: **Added on** | When added | Sortable; **default sort, newest first**; hidden below 1536 px | Date (SH-012); hover "<relative> · by <creator>" | — |
| Manage Clients: **Status** | Active / inactive | Sortable | Dot + "Active" / "Inactive" | — |
| Manage Clients: actions | Edit / open | Always visible | Pencil "Edit <name>"; arrow cue on hover | — |
| Sub clients: **Company** | Identify | Sortable; **default sort A–Z** | Logo, name, "industry · city" | — |
| Sub clients: **Code** | Code | Sortable | Code chip | — |
| Sub clients: **Mobile** | Contact | Not sortable; hidden below 1024 px | "+91 98199 47703" | "—" |
| Sub clients: **Added on** | When added | Sortable; hidden below 1280 px | Date; hover relative time | — |
| Sub clients: **Status** | Status | Sortable | Dot + word | — |
| Pagination | Paging | SH-008 | 10 per page; 10, 20, 50, All rows. Phones: 12 cards per page | — |
| Summary pills | Counts / status filter | 5.2, 5.6 | See 7.1 | Skeleton while loading |
| Search | Quick find | 7.1 | See 7.1 | "No clients match" / "No sub clients match" with **Clear search & filters** |
| Global search (⌘K) | Jump | 5.1 | Pages + Clients (training partners) | As PRD-SHELL |
| Activity timeline | History | Newest first, 8 at a time | Type and date filters (7.5) | As PRD-CLD: "No activity in this view" with **Show all activity** |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| No training partners | Empty list | Empty state with button | "No clients yet" / "Add the training partners that use LearnNext." + **Add client** | Add client |
| No matches | Search / pill match nothing | Empty state | "No clients match" / "Try a different search or status." + **Clear search & filters** | Clear |
| No sub clients | Partner has none (e.g. a newly added partner) | Empty state, no action | "No sub clients yet" / "This training partner’s own clients will show here." | — |
| No sub-client matches | Search / pill | Empty state | "No sub clients match" / "Try a different search or status." + **Clear search & filters** | Clear |
| Load failure | List fails to load | Error state with retry (SH-007) | Table "Couldn’t load data"; phones "Couldn’t load the list" — reason | Retry |
| Unknown partner | Bad details / edit address | Not-found card | "Client not found" / "It may have been removed, or the link is out of date." | **Manage clients** |
| Training Partner address opened as Super Admin | e.g. `/clients/cl-1`, `/dashboard` | Not-found card or redirect to Manage Clients | — | BR-SA-002, BR-SA-003 |
| No communication address | Partner without address | Overview Address shows placeholder | "Not added yet" | Edit client |
| No billing addresses (view) | Tax & Billing | Placeholder | "No billing addresses added." | Edit client |
| Lower TDS expiring / expired | Valid to within 30 days / past | Note under the date | "Ends in N days" / "Expired" | Update via Edit client |
| Unsaved billing panel | Panel filled, not saved, then Save client | Panel ignored | "Add a billing address" if none saved | **Save address** first |
| Settings changed then tab switched | Draft unsaved | Draft lost | — | OQ-SA-008 |
| Save changes without edits | Edit opened and saved | Saves, logs "Updated details of" | "Changes saved" | OQ-SA-009 |
| Status changed in both places | Edit form and Settings tab | The last save wins | — | OQ-SA-009 |
| Inactive partner | Status inactive | Listed and searchable; status shown as Inactive. Nothing else changes (its team can still sign in) | — | OQ-SA-002 |
| Clients added in the Training Partner portal | Same browser tab | They appear as sub clients of one of the demo partners and raise the counts [Inferred] | — | SH-001, OQ-SA-003 |
| Profile "Access level" | My Profile while in Super Admin | Shows "Super Admin" (the role chosen at "Continue as") in the banner badge and Access level | — | OQ-SA-015 (Resolved) |
| Reload | Any reload | Added / edited partners and settings revert to demo data (SH-001) | — | Re-enter |
| Browser Back / reload / Log out with unsaved form | — | No warning; changes lost (SH-006) | — | — |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Authentication (PRD-AUTH) | Sign-in and the "Continue as" role picker lead into this portal; **Switch role** returns there | Choose Super Admin | Manage Clients opens | BR-SA-004 |
| App shell (PRD-SHELL) | Same shell with a reduced menu, header without notifications, tab bar Clients + More, its own ⌘K sources | Navigation | — | BR-SA-002, BR-SA-005 |
| Training Partner All Clients (PRD-CLI) | Source of every partner's sub clients; its Add client is where CRM fetching would apply | Clients added there | Sub clients and counts change | BR-SA-020, BR-SA-025 |
| Training Partner Add client (PRD-CLI) | The Addresses and Billing steps, field rules, messages and logo / document uploads are shared | Add / Edit client | Same validation and wording | BR-SA-019 |
| Training Partner Client details (PRD-CLD) | Hero, section tabs, Tax & Billing view and the Activity timeline are shared | Client details | Same look and behaviour | — |
| My Profile (PRD-PROF) | The only other Super Admin page | User menu / More sheet | As PRD-PROF | OQ-SA-015 |
| Settings, Support desk, Dashboard and other Training Partner modules | Not available to Super Admin | Opening their addresses | Redirect to Manage Clients | BR-SA-002 |
| Training Partner portal sign-in [Requires Confirmation] | Should follow the partner's status and portal access | Settings save | No effect yet | OQ-SA-002 |

## 13. Acceptance Criteria

**AC-SA-001: Enter the Super Admin portal**
- Given a signed-in user whose login has the Super Admin role
- When they choose **Super Admin** in "Continue as" and continue
- Then Manage Clients opens with the toast "Welcome back, <first name>"
- And the sidebar shows only **Manage Clients**

**AC-SA-002: Limited addresses**
- Given the Super Admin portal
- When the user opens `/dashboard`, `/settings` or `/support`
- Then they are sent to Manage Clients
- And Back does not return to the blocked address

**AC-SA-003: Reduced shell**
- Given the Super Admin portal
- Then the header has no notification bell, the sidebar has no Support card and no Dev-only section
- And the user menu offers My Profile, Switch role (multi-role logins), Theme and Log out, but not Settings
- And on phones the tab bar shows **Clients** and **More**, and More holds only the profile row

**AC-SA-004: Global search**
- Given the Super Admin portal
- When the user opens ⌘K and types "Rohit"
- Then the training partner "Aarav Learning Solutions Pvt Ltd" is offered under Clients
- And choosing it opens its Client details

**AC-SA-005: View the list**
- Given Manage Clients
- Then pills All clients, Active, Inactive and Sub clients show the counts, and the table lists partners newest added first, 10 per page
- And the columns are Company, Code, Sub clients, Contact person, Added on and Status, with an edit pencil

**AC-SA-006: Status pills**
- Given Manage Clients
- When the user clicks **Inactive**
- Then only inactive partners show with "N of T clients" and **Clear all**
- And the **Sub clients** pill cannot be clicked

**AC-SA-007: Search**
- Given Manage Clients
- When the user types a city, code, contact person name or mobile digits
- Then matching partners are listed
- And a search that matches nothing shows "No clients match" with **Clear search & filters**

**AC-SA-008: Open and edit from the list**
- Given Manage Clients
- When the user clicks a row, Client details opens on Overview
- And clicking the pencil opens Edit client without opening the row

**AC-SA-009: Phone cards**
- Given a phone-width screen
- Then each partner is a card with logo, name, "industry · city", code, status, pencil and "<N> sub clients · <contact>" and the date
- And the status pills stay visible above the search box
- And tapping a card opens the partner

**AC-SA-010: Details hero and tabs**
- Given a partner's Client details
- Then the hero shows logo, name, code, industry, city and status, with **Manage clients** and **Edit**
- And the tabs are Overview, Sub clients, Tax & Billing, Settings & Configuration, Activity History
- And reloading on a tab reopens that tab

**AC-SA-011: Overview**
- Given the Overview tab
- Then Company profile, Contact person and Address are shown, with "—" for missing values
- And clicking **Sub clients** or **Active sub clients** in the stats strip opens the Sub clients tab

**AC-SA-012: Sub clients**
- Given the Sub clients tab of a partner that has sub clients
- Then its clients are listed A–Z with pills and search
- And rows and cards cannot be opened

**AC-SA-013: No sub clients**
- Given a newly added partner
- When the Sub clients tab opens
- Then "No sub clients yet" / "This training partner’s own clients will show here." shows

**AC-SA-014: Tax & Billing**
- Given the Tax & Billing tab
- Then each billing address shows its number, address, GSTIN and certificate, and clicking the certificate opens the preview
- And the Lower TDS card states whether a certificate applies

**AC-SA-015: Save settings**
- Given the Settings & Configuration tab
- When the user turns CRM fetching on and clicks **Save changes**
- Then the toast "Settings saved" — "<name>" appears, the bar reads "All changes saved."
- And Activity History gains "Turned on CRM fetching for <name>"

**AC-SA-016: Reset settings**
- Given a changed but unsaved settings draft
- When the user clicks **Reset**
- Then the saved values return and both buttons become disabled

**AC-SA-017: Status from settings**
- Given an Active partner
- When the user turns the Client status switch off and saves
- Then the hero and Manage Clients show "Inactive" and Activity History gains "Marked inactive"

**AC-SA-018: CRM fetching is stored only**
- Given CRM fetching turned off for a partner
- When the user signs in as Training Partner and opens Add client
- Then the CRM look-up is still offered (known gap, OQ-SA-001)

**AC-SA-019: Activity History**
- Given Activity History
- Then entries are newest first, grouped by day, 8 at a time with **Show more**
- And the type filter offers Client, Sub clients and Settings & CRM where they have entries

**AC-SA-020: Add a training partner**
- Given Add client
- When the user fills Details, Addresses and one billing address and clicks **Save client**
- Then the toast "Client added" — "<name> (<code>)" appears and Manage Clients lists the new partner first, Active, with 0 sub clients
- And its Activity History shows "Added client"

**AC-SA-021: Client code**
- Given the demo data (TPR001–TPR005)
- When Add client opens
- Then Client code reads "TPR006", read only, helper "Generated automatically"

**AC-SA-022: Duplicate training partner**
- Given Add client
- When the user types "brightpath training academy llp " and leaves the field
- Then "This company is already a client" shows and Continue does not move on

**AC-SA-023: Details validation**
- Given the Details step
- When the user clicks **Continue** with everything empty
- Then the errors for company name, company type, contact name, email and mobile show and the first invalid field is focused
- And an invalid email shows "Enter a valid email address" once the field is left

**AC-SA-024: Billing required**
- Given the Billing step with no saved billing address
- When the user clicks **Save client**
- Then the toast "Add a billing address" — "Save at least one billing address with its GST No." appears and nothing is saved

**AC-SA-025: Edit a training partner**
- Given Edit client for a partner
- When the user changes the contact person and clicks **Save changes**
- Then the toast "Changes saved" appears and the partner's Client details opens with the new contact person
- And Activity History gains "Updated details of"

**AC-SA-026: Edit validates every step**
- Given Edit client with an invalid pin code on Addresses
- When the user clicks **Save changes** on Details
- Then Addresses opens with its errors and the toast "Check the highlighted fields" — "Addresses needs a few fixes before saving."

**AC-SA-027: Leave guard**
- Given Add client with typed data
- When the user clicks **My Profile** in the user menu
- Then "Discard this client?" appears; **Keep editing** stays and **Discard** opens My Profile

**AC-SA-028: Cancel destinations**
- Given an unchanged form
- When the user clicks **Cancel**, Add returns to Manage Clients and Edit returns to the partner's Client details, without a dialog

**AC-SA-029: Not found**
- Given an address `/clients/unknown` or `/clients/unknown/edit`
- Then "Client not found" with **Manage clients** shows

**AC-SA-030: Demo persistence**
- Given a partner added in this tab
- When the page is reloaded
- Then it is gone and the five demo partners remain (SH-001)

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-SA-001 | AC-SA-001 | Choose Super Admin | Demo login signed in | Super Admin tile | Manage Clients; welcome toast | P0 |
| TC-SA-002 | AC-SA-001 | Requested page ignored | Signed out, open `/clients/tp-2`, sign in, pick Super Admin | — | Lands on Manage Clients | P2 |
| TC-SA-003 | AC-SA-002 | Blocked address | Super Admin | `/dashboard` | Manage Clients | P0 |
| TC-SA-004 | AC-SA-002 | Blocked Settings | Super Admin | `/settings/roles` | Manage Clients; Back does not return | P1 |
| TC-SA-005 | AC-SA-003 | User menu | Super Admin | — | No Settings item | P1 |
| TC-SA-006 | AC-SA-003 | Header | Super Admin | — | No bell; breadcrumb "Manage Clients" | P2 |
| TC-SA-007 | AC-SA-003 | Phone tab bar | 375 px | — | Clients + More; More shows only the profile row | P2 |
| TC-SA-008 | AC-SA-004 | ⌘K partner | Super Admin | "TPR003" | Catalyst Skills offered; opens details | P2 |
| TC-SA-009 | AC-SA-004 | ⌘K pages | Super Admin | "Add" | "Add client" page result | P3 |
| TC-SA-010 | AC-SA-005 | List columns and order | — | — | 6 columns; TPR005 (newest) first | P1 |
| TC-SA-011 | AC-SA-005 | Pill counts | Demo | — | All 5, Active 4, Inactive 1, Sub clients = total | P1 |
| TC-SA-012 | AC-SA-006 | Inactive pill | — | — | Only Elevate People Development LLP; "1 of 5 clients" | P1 |
| TC-SA-013 | AC-SA-006 | Sub clients pill | — | Click it | Nothing happens | P3 |
| TC-SA-014 | AC-SA-007 | Search city | — | "Pune" | Catalyst Skills | P2 |
| TC-SA-015 | AC-SA-007 | Search contact | — | "ananya" | BrightPath | P2 |
| TC-SA-016 | AC-SA-007 | Search mobile | — | "98490" | Elevate People | P2 |
| TC-SA-017 | AC-SA-007 | No match and clear | — | "zzz" | "No clients match"; Clear restores | P2 |
| TC-SA-018 | BR-SA-007 | Sort cycle | — | Click Code ×3 | Asc, desc, unsorted | P3 |
| TC-SA-019 | AC-SA-005 | Page size | — | "All rows" | All partners on one page | P3 |
| TC-SA-020 | AC-SA-008 | Row opens | — | Click row | Overview of that partner | P1 |
| TC-SA-021 | AC-SA-008 | Pencil | — | Click pencil | Edit client, details not opened | P1 |
| TC-SA-022 | AC-SA-009 | Phone cards | 375 px | — | Cards, pills visible, tap opens | P2 |
| TC-SA-023 | AC-SA-010 | Tabs in address | Details | Open Settings, reload | Settings tab still open | P2 |
| TC-SA-024 | AC-SA-010 | Unknown tab | — | `?tab=xyz` | Overview | P3 |
| TC-SA-025 | AC-SA-010 | Phone hero menu | 375 px | ⋮ | "Manage clients", "Edit client" | P3 |
| TC-SA-026 | AC-SA-011 | Overview facts | TPR001 | — | Type, industry, code, website, since, added by, contact, address | P1 |
| TC-SA-027 | AC-SA-011 | Copy code | Overview | Copy | Tick, "Copied" | P3 |
| TC-SA-028 | AC-SA-011 | Landline empty | Demo partner | — | Landline "—" | P3 |
| TC-SA-029 | AC-SA-011 | Stats strip | Overview | Click "Active sub clients" | Sub clients tab, unfiltered | P2 |
| TC-SA-030 | AC-SA-012 | Sub clients list | TPR001 | — | A–Z, pills, search | P1 |
| TC-SA-031 | AC-SA-012 | Sub clients view only | — | Click a row | Nothing opens | P2 |
| TC-SA-032 | AC-SA-012 | Sub clients search | — | Part of a sub-client name | Matches; "N of T sub clients" | P2 |
| TC-SA-033 | AC-SA-013 | New partner sub clients | Partner just added | — | "No sub clients yet" | P2 |
| TC-SA-034 | BR-SA-020 | Clients added in Training Partner portal | Same tab | Add a client as Training Partner, switch role | It appears under some partner; counts rise | P3 |
| TC-SA-035 | AC-SA-014 | Tax & Billing | TPR002 | — | Billing address 1 with GSTIN 29AAKFB7730M1Z2, certificate opens | P1 |
| TC-SA-036 | AC-SA-014 | Lower TDS none | Demo partner | — | "No lower TDS certificate — the standard rate applies." | P3 |
| TC-SA-037 | AC-SA-015 | Save CRM fetching | TPR004 (off) | Turn on, Save | Toast; Activity entry | P1 |
| TC-SA-038 | BR-SA-029 | Buttons disabled | Settings untouched | — | Reset and Save disabled; "All changes saved." | P2 |
| TC-SA-039 | AC-SA-016 | Reset | Draft changed | Reset | Saved values back | P2 |
| TC-SA-040 | AC-SA-017 | Inactive via settings | TPR001 | Status off, Save | Hero/list Inactive; "Marked inactive" | P1 |
| TC-SA-041 | BR-SA-027 | Access change logged | — | Portal access off, Save | "Changed settings & configuration of" | P2 |
| TC-SA-042 | BR-SA-030 | Draft lost on tab switch | Draft changed | Open Overview, back | Draft gone, no warning | P3 |
| TC-SA-043 | AC-SA-018 | CRM gap | CRM off for a partner | Training Partner Add client | CRM look-up still offered | P2 |
| TC-SA-044 | AC-SA-019 | Activity types | TPR001 | Type filter | Client, Sub clients, Settings & CRM | P2 |
| TC-SA-045 | AC-SA-019 | Show more | Partner with > 8 entries | Show more | 8 more | P3 |
| TC-SA-046 | AC-SA-020 | Add partner end to end | — | Valid data | "Client added"; first in list; Active; 0 sub clients | P0 |
| TC-SA-047 | AC-SA-021 | Next code | Demo | — | TPR006 | P2 |
| TC-SA-048 | AC-SA-022 | Duplicate name | — | " Aarav learning solutions pvt ltd" | "This company is already a client" | P1 |
| TC-SA-049 | BR-SA-012 | Short name | — | "A" | "Name looks too short" | P2 |
| TC-SA-050 | AC-SA-023 | Empty Continue | Details | — | All required errors; focus on first | P1 |
| TC-SA-051 | AC-SA-023 | Required on blur | Details | Tab out of empty Name | "Enter the contact person’s name" shows (deviation, OQ-SA-004) | P2 |
| TC-SA-052 | BR-SA-014 | Mobile rules | — | "5123456789"; letters | Error; letters removed | P2 |
| TC-SA-053 | BR-SA-017 | Landline pair | — | Number only "2345678" | "Enter the STD code too" | P3 |
| TC-SA-054 | 7.2 | Website format | — | "brightpath" | "Enter a valid website, e.g. brightpath.in" | P3 |
| TC-SA-055 | 7.2 | Logo too big | — | 3 MB PNG | Toast "Logo must be under 2 MB." | P3 |
| TC-SA-056 | 7.3 | Pin code | Addresses | "012345" | "Pin code is 6 digits" | P2 |
| TC-SA-057 | 7.3 | Office address | Addresses | Untick, Continue empty | Office errors | P2 |
| TC-SA-058 | AC-SA-024 | No billing address | Billing | Save client | "Add a billing address" toast | P1 |
| TC-SA-059 | 7.4 | GSTIN format | Billing panel | "27AAPFU0939F1Z" | "GST No. is 15 characters, e.g. 27AAPFU0939F1ZV" | P2 |
| TC-SA-060 | 7.4 | Lower TDS required | Billing | Switch on, Save client | Six Lower TDS errors | P2 |
| TC-SA-061 | AC-SA-025 | Edit partner | TPR003 | New contact name | "Changes saved"; details page; "Updated details of" | P1 |
| TC-SA-062 | AC-SA-026 | Edit cross-step errors | Edit | Clear pin, Save on Details | Addresses opens; toast | P1 |
| TC-SA-063 | BR-SA-011 | Own name allowed on edit | Edit TPR002 | Keep name | No duplicate error | P2 |
| TC-SA-064 | BR-SA-028 | Edit status | Edit TPR005 | Status on, Save | Active; "Marked active" + "Updated details of" | P2 |
| TC-SA-065 | AC-SA-027 | Leave guard | Add client with text | Sidebar Manage Clients | Dialog; Keep editing / Discard work | P1 |
| TC-SA-066 | AC-SA-028 | Cancel unchanged | Edit, no changes | Cancel | Client details, no dialog | P2 |
| TC-SA-067 | AC-SA-029 | Not found | — | `/clients/xyz/edit` | "Client not found" + Manage clients | P2 |
| TC-SA-068 | BR-SA-003 | Training Partner address | Super Admin | `/clients/cl-1` | "Client not found" | P2 |
| TC-SA-069 | AC-SA-030 | Reload | Partner added | Reload | Demo data restored | P3 |

## 15. Open Questions and Gaps

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
| OQ-SA-015 | My Profile | The profile shows the account's role text ("Training Partner" for the demo login) while in the Super Admin portal | Confusing identity | Resolved 2026-11-05: My Profile now shows the chosen portal role ("Super Admin" here) | Resolved |
| OQ-SA-016 | Terminology and contact person | Screens call training partners "clients" ("Add client", "Client details"); the contact person's relationship to the partner's portal logins is undefined | Users may confuse partners with sub clients; account set-up unclear | Confirm the wording and whether the contact person becomes the partner's first portal user | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Module and page overview: Complete
- [x] User roles and access: Complete
- [x] Page functionality and behaviour: Complete
- [x] User workflows: Complete
- [x] Field-level specifications: Complete (shared address, billing and TDS rules referenced to PRD-CLI)
- [ ] Minimum and maximum constraints, where known: Incomplete (see OQ-SA-010, OQ-SA-013)
- [x] Validation and business rules: Complete
- [ ] Validation timing: Incomplete (deviation from SH-004, see OQ-SA-004)
- [x] Success, error and confirmation messages: Complete
- [x] Search, filters, tables and listings: Complete
- [x] Empty states, errors and edge cases: Complete
- [x] Cross-module dependencies: Complete
- [ ] Effect of configuration settings: Incomplete (stored only, see OQ-SA-001, OQ-SA-002)
- [ ] Sub-client ownership rule: Incomplete (see OQ-SA-003)
- [x] Acceptance criteria: Complete
- [x] QA test scenarios: Complete
- [x] Open questions recorded: Complete
