# Client Details: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Client Details PRD |
| Module name | Client Details |
| Document ID | PRD-CLD |
| Version | 1.2 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (the Invoices section and the invoice figures on Overview are placeholders) |
| Last updated | 2026-11-05 (v1.2: naming: "Training Partner" replaces "Admin"; Super Admin access row; SPOC card edit pencil top-right on phones) · 2026-11-03 (v1.1: phone layout) |
| Phone layout (v1.1) | Hero actions (All clients, Edit client) in a vertical ⋮ menu top-right; Overview stats as a 2×2 grid without icon tiles, labels in full; Projects / Participants / SPOCs tabs are list-like (outer frame removed, one card per item, search on Projects and SPOCs, views fixed to list/cards); repeated tab headings hidden; Tax & Billing: Billing addresses card flattened with its heading hidden, Lower TDS card kept; Activity summary unboxed, showing only the period, count and comparison (no "By type" list on phones). See SH-013. |
| Related modules/pages | [clients-prd.md](clients-prd.md) (All Clients list, Add/Edit client form), [app-shell-navigation-prd.md](app-shell-navigation-prd.md), [profile-prd.md](profile-prd.md) (shares the activity timeline), [settings-location-masters-prd.md](settings-location-masters-prd.md), [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md), [settings-finance-masters-prd.md](settings-finance-masters-prd.md), [../shared-requirements.md](../shared-requirements.md) |

## 2. Purpose and Objective

The Client Details page is the single place where a Training Partner user sees everything about one client (a company, or an individual who is trained directly). It brings together the client's profile, its training projects, the participants trained under it, its points of contact (SPOCs) and what each of them may see, its tax and billing details, its configuration, and a history of everything that happened with it.

Objectives:

- Let a Training Partner user understand a client at a glance (identity, status, counts) and move to any part of its record in one click.
- Show projects and participants in a readable, filterable way without changing them (view only).
- Let the Training Partner user maintain the client's SPOCs and the projects each SPOC can see.
- Let the Training Partner user change the client's status, product access and communication settings.
- Provide an auditable activity history for the client.

Most of the page is view only. The only places that change data are the **SPOCs & Project Access** section (add and edit SPOCs) and the **Settings & Configuration** section. Editing the client's own details happens on the Edit client form ([clients-prd.md](clients-prd.md)).

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Client details page (header card + section tabs) | Identify the client and switch between its sections | Training Partner user | Go back to All clients, Edit, switch section | [clients-prd.md](clients-prd.md) |
| Overview section | Key counts plus the client's profile, contact details and addresses | Training Partner user | Open a section from a count, copy code or address, call, email, open website | Projects, Participants, Invoices sections |
| Projects section | The client's training projects on a yearly timeline or in a list | Training Partner user | Switch view, step through years, filter, open project details | — |
| Invoices section | Placeholder for the client's invoices | Training Partner user | None (not built) | — |
| Participants section | People from the client and their learning journeys | Training Partner user | Search, filter, sort, page, open a learning journey | — |
| SPOCs & Project Access section | The client's points of contact and which projects each can see | Training Partner user | Switch view, add SPOC, edit SPOC, open SPOC details | Projects section |
| Tax & Billing section | GST registrations, billing addresses and Lower TDS details | Training Partner user | Preview certificates | [clients-prd.md](clients-prd.md) (Billing step) |
| Settings & Configuration section | Client status, product access, portal and communication settings | Training Partner user | Toggle settings, Reset, Save changes | All Clients (status), Activity History |
| Activity History section | Timeline of everything that happened with the client | Training Partner user | Filter by type and date range, show more | [profile-prd.md](profile-prd.md) (same timeline) |
| Client not found state | Explains that the client cannot be found | Training Partner user | Go back to All clients | [clients-prd.md](clients-prd.md) |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Training Partner user (signed in and continuing as Training Partner) | Full access to every section (SH-002, SH-003) | View every section, add and edit SPOCs, change settings, open Edit client | No role-based restriction is enforced in the current build (SH-002). There is no way to delete a client, a SPOC, a project or a participant on this page. |
| Super Admin | Not this page. In the Super Admin portal a client address opens Super Admin's own client page for a training-partner company ([super-admin-prd.md](super-admin-prd.md)) | — | — |
| Client SPOC, participant | No access. They are records on this page; their own portals are not built yet ("Coming soon", SH-002) | N/A | N/A |
| Signed-out visitor | Redirected to Sign in (SH-003) | None | N/A |

## 5. Page Functionality and Behavior

### 5.1 Page header card and section tabs

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Page address and breadcrumb | Identify the page | Open a client from All Clients, or open a link | Breadcrumb shows **All Clients › Client details**; the browser tab title is "Client details · <app name>" (SH-009) | The page opens for any client in the list | Client details page shows |
| Client logo | Identify the client visually | View | Shows the client's logo; without a logo, a coloured monogram tile built from the client code. The header card carries a soft colour wash taken from the logo (or the monogram colour) | — | — |
| Client name | Identify the client | View | Shown as the page heading | — | — |
| Identity line | Summarise the client | View | One line: client code chip · industry · city · status dot with **Active** (green) or **Inactive** (grey) | Industry is hidden on phones. Empty industry or city is left out | — |
| **All clients** button | Go back to the list | Click | Opens All Clients | Always available | All Clients page |
| **Edit** button | Edit the client's details | Click | Opens the Edit client form for this client ([clients-prd.md](clients-prd.md)) | Always available | Edit client form |
| Status change in header [Not Implemented] | — | — | The header has no status-change, CRM or copy actions. Status is changed in Settings & Configuration (5.9) or on the Edit client form | — | — |
| Section tabs | Move between sections | Click a tab | Eight tabs in this order: **Overview**, **Projects**, **Invoices**, **Participants**, **SPOCs & Project Access**, **Tax & Billing**, **Settings & Configuration**, **Activity History**. The open tab is bold with a blue underline that slides to it | The open section is kept in the page address, so reloading or sharing the link reopens the same section. Overview has no section in the address. An unknown section in the address opens Overview. Switching tabs does not add browser history entries | Chosen section shows below |
| Sticky tab bar | Keep sections reachable while scrolling | Scroll down | The tab bar pins under the top bar and floats with a shadow | — | — |
| Tab scroll arrows | Reach tabs that do not fit | Click left/right arrow | Arrows ("Scroll sections left" / "Scroll sections right") and edge fades appear only when the tabs overflow; the open tab is scrolled into view | Narrow screens | — |
| Unsaved section state | — | Switch tab | Each section starts fresh when reopened (filters, search, open drawers and unsaved Settings changes are discarded without warning) | See BR-CLD-030 | — |

### 5.2 Overview section

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Stats strip: **Projects** | Show how many projects the client has | Click | Opens the Projects section | Count of all the client's projects | Projects section |
| Stats strip: **Participants** | Show how many participants | Click | Opens the Participants section | Count of all participants | Participants section |
| Stats strip: **Invoices** [Not Implemented] | Number of invoices | Click | Always shows **0**; opens the Invoices placeholder | Invoices are not connected yet | Invoices section |
| Stats strip: **Outstanding** [Not Implemented] | Amount outstanding | Click | Always shows **₹0**; opens the Invoices placeholder | Invoices are not connected yet | Invoices section |
| **Company profile** (company clients) | Key company facts | View | Shows **Company type**, **Industry**, **Client code**, **Special Economic Zone**, **Client since**, **Added by** | Special Economic Zone shows "Yes · <SEZ number>", "Yes" (no number), "No", or "—" | — |
| **Participant profile** (individual clients) | Key facts for an individual | View | Shows **Department**, **Designation**, **Participant ID**, **Email**, **Client since**, **Added by** | — | — |
| Client since | When the client was added | Hover | Date (SH-012); hovering shows the relative time (for example "3 months ago") | — | — |
| Added by | Who added the client | View | Avatar initials and name | — | — |
| Copy client code / participant ID | Copy the code | Hover the value, click the copy icon | Copies the code; the icon turns into a green tick for about 1.5 seconds, tooltip "Copied" | Copy icon is hidden until hover/focus (always visible on touch screens). If the browser blocks the clipboard, nothing happens and no message shows | Code on clipboard |
| **Contact**: Mobile | Call the client | Click | Shown as "+91 98765 43210"; opens the phone dialler | "—" when empty | — |
| **Contact**: Landline | Call the landline | Click | Shown as "(STD code) number"; opens the phone dialler | "—" when empty | — |
| **Contact**: Website (company) | Visit the website | Click | Opens the website in a new tab; "https://" is added if missing | "—" when empty | — |
| **Contact**: Email (individual) | Email the person | Click | Opens the mail app | "—" when empty | — |
| **Addresses**: Communication | Show the communication address | View / copy | Up to three lines: line 1, line 2 · city, state, PIN · country. A copy icon copies the whole address on one line | "Not added yet" when no address | — |
| **Addresses**: Office | Show the office address | View / copy | Same as Communication, or "Same as the communication address" when the client marked it the same | — | — |
| Empty values | — | — | Any empty value shows "—" (SH-012) | — | — |

### 5.3 Projects section

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Section header | Name the section | View | **Projects** with the total count and "Training projects run for this client" | Count hidden when there are no projects | — |
| View switch (Timeline view / List view) | Choose how to see projects | Click an icon | Switches between the yearly timeline and the list. The choice is remembered in the browser for every client (SH-001) | Default: Timeline. Hidden when the client has no projects | View changes |
| Year stepper | Move through years on the timeline | Click ‹ or › | Shows the previous/next year ("Show 2025", "Show 2027") | Timeline only. The range runs from the earliest project start year to the latest project end year, always including the current year; arrows are disabled at the ends. Opens on the current year, or on the latest earlier year that has projects if the current year has none | Timeline redraws for that year |
| **Filters** button | Narrow projects | Click | Opens the **Filter projects** drawer (5.3.1). Shows a count badge with the number of active filter chips | Hidden when the client has no projects | Drawer opens |
| Result line and chips | Show active filters | View / click × / **Clear all** | While filters are active: "N in <year>" (timeline) or "N of T projects" (list), one removable chip per filter and **Clear all** | Chips: project status ("In progress", "Upcoming", "Completed"), each project type, "Programs in progress/upcoming/completed", each delivering entity | Filter removed / all cleared |
| Timeline (tablet and desktop) | See projects over the year | View | Months Jan–Dec across the top, the current month highlighted with a "Today" line and tag. One row per project that touches the year, earliest start first: name, date range, project type, and a soft bar over its dates labelled "N program(s)", coloured by status (blue in progress, cyan upcoming, green completed). In-progress bars show the elapsed part slightly deeper. Bars that continue into another year fade at that edge. A key below lists only the statuses on screen | The project-name column stays fixed while the months scroll sideways on narrower screens | — |
| Compact list (phones, timeline view) | Readable on small screens | Tap a project | Shows name, dates, project type, status and program count per project for the selected year | Below tablet width | Project details drawer opens |
| List view | See all projects across all years | Click a row | Table (5.3.3 / section 10). Opens the project details drawer on click | Cards on phones | Project details drawer opens |
| Project details drawer | See a project in full | Click a project | Shows status, project name, "<project type> · Created by <name>" (hover shows created date and time), the date range, time left ("N days left", "Last day", "Starts tomorrow", "Starts in N days", "Completed"), a progress line, and **Programs N**: each program's name and "dates · type · delivered by", with a status dot (hover: "<status> · <entity> · Opportunity #<number>"). Programs are listed earliest first | View only. Close with **Close** (×), Esc or the backdrop (SH-006) | — |
| Editing projects [Not Implemented] | — | — | Projects cannot be created, edited, archived or deleted here | Project management is outside this page (OQ-CLD-004) | — |

#### 5.3.1 Filter projects drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Choose filters | Open from **Filters** | Title "Filter projects", description "By status, type or who delivers them". Starts from the filters currently applied | Changes are a draft until applied; closing without applying discards them | — |
| Section clear links | Clear one filter group | Click the group's clear control | Resets that group in the draft | Shown only when the group has a value | — |
| **Reset** | Clear the draft | Click | Clears all filter groups in the draft (does not apply until the main button is clicked) | — | — |
| **Show N project(s)** | Apply | Click | Applies the draft and closes the drawer | Live count of matching projects across all years. When nothing matches, the button reads "No matching projects" and is disabled | Filters applied |

### 5.4 Invoices section [Not Implemented]

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Placeholder card | Show where invoices will live | View | Title "Invoices", description "Invoices raised to this client." Column headings **Invoice no.**, **Project**, **Date**, **Amount**, **Status** over faded ghost rows, with the message "No invoices yet" and "Invoices will appear here with their amount, due date and payment status." | Shown for every client; no data, no actions | — |

### 5.5 Participants section

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Section header | Name the section | View | **Participants** with total count and "People from this client and their learning journeys" | — | — |
| Search box | Find people | Type | Filters the table as the user types (short delay) | 7.1. Hidden when there are no participants | Table narrows |
| **Filters** button | Narrow by journey, department, designation | Click | Opens **Filter participants** drawer (5.5.1); count badge shows active filter chips | Hidden when there are no participants | Drawer opens |
| Result line and chips | Show active search/filters | View / click × / **Clear all** | While searching or filtering: "N of T participants", a removable chip per filter and **Clear all** (clears filters **and** the search) | — | — |
| Participants table | List people | Sort, page, click a row | See section 10. Click opens the learning-journey drawer | Cards on phones | Drawer opens |
| Learning-journey drawer | See one person's details and journey | Click a row | Status badge; avatar and name; "<designation> · <department>" or "Role not set"; summary "X of N projects completed" plus " · n in progress" / " · n pending" when any. Contact list: **Email** (opens mail app), **Mobile** (opens dialler), **Employee code**; empty ones read "Not provided". **Learning journey N**: one step per project (oldest first) with project name, "<status> · Enrolled <date>", and "Completed <date>" or "Not completed yet". Markers: green tick (completed), pulsing blue dot (in progress), hollow ring (pending) | View only. Close with **Close** (×), Esc or backdrop | — |
| Editing participants [Not Implemented] | — | — | Participants cannot be added, edited or removed here | — | — |

#### 5.5.1 Filter participants drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Choose filters | Open from **Filters** | Title "Filter participants", description "By learning journey, department or role". Starts from applied filters | Draft until applied | — |
| **Reset** | Clear the draft | Click | Clears all filter groups in the draft | Does not clear the search box | — |
| **Show N participant(s)** | Apply | Click | Applies and closes | Live count includes the current search. When nothing matches: "No matching participants", disabled | Filters applied |

### 5.6 SPOCs & Project Access section

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Section header | Name the section | View | **SPOCs & Project Access** with SPOC count and "Single points of contact and which projects they can see" | — | — |
| Summary chips | Quick facts | View | "N project(s)" and "N full access" (SPOCs who can see every project) | Shown only when the client has SPOCs and at least one project | — |
| View switch (Access matrix / List view) | Choose the view | Click an icon | Switches view; remembered in the browser for every client (SH-001) | Default: Access matrix. Hidden when there are no SPOCs | — |
| **Add SPOC** button | Add a point of contact | Click | Opens the **Add SPOC** modal (7.2) | In the header when SPOCs exist; inside the empty state when none | Modal opens |
| Access matrix | See who can see what | View / hover | One row per SPOC (avatar, name, "department · email"; hover shows email, mobile, location and "active <time> ago"). One column per project (name with status dot; hover shows "<name> · <status> · <start> – <end>"). A green tick where the SPOC can see the project (tooltip "<SPOC> can see <project>"), a small grey dot where not ("<SPOC> can't see <project>"). Neighbouring ticks join into a soft green lane. The **Access** column shows a small bar of filled seats and "All" (green) or the number | The SPOC column (and the Access column from tablet up) stays fixed while project columns scroll. Projects appear newest-created first. With no projects the Access column reads "No projects yet" | — |
| Matrix legend | Explain symbols | View | "Can see the project", "No access", and the three project statuses | With no projects: "This client has no projects yet — access shows here once projects are set up." | — |
| Edit pencil (matrix) | Edit a SPOC | Click "Edit <name>" | Opens the **Edit SPOC** modal | Appears on row hover/focus (always on touch screens) | Modal opens |
| List view table | List SPOCs | Sort, page, click a row | See section 10. Row click opens the SPOC details drawer; the pencil opens Edit SPOC without opening the drawer | Cards on phones: the pencil sits at the top-right of each card, beside the SPOC's name | — |
| SPOC details drawer | See one SPOC | Click a list row | **Edit** and **Close** buttons; name; "<department> · <location>" or "SPOC"; "Can see all projects" or "Can see n of T projects"; contact list **Email**, **Mobile**, **Department**, **Location**, **Last active** ("Not yet" when never); **Can see N** list (project name, dates, status; "No projects yet" when none) and **No access N** list (only when some are hidden) | **Edit** closes the drawer and opens Edit SPOC | — |
| Remove SPOC [Not Implemented] | Remove a point of contact | — | There is no way to remove or deactivate a SPOC in the current build | OQ-CLD-001 | — |
| Primary SPOC | — | — | All SPOCs are equal; there is no primary SPOC | — | — |
| SPOC designation and address display [Partially Implemented] | — | — | Designation and address lines are saved but not shown anywhere on the page; only the city appears (as "Location") | OQ-CLD-002 | — |

### 5.7 Add SPOC / Edit SPOC modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Modal title and description | Name the task | Open | Add: "Add SPOC" / "A point of contact at this client and the projects they can see." Edit: "Edit SPOC" / the SPOC's name | — | — |
| Stepper | Show the two steps | Click a step | Steps **Details** and **Project access**. "Step X of 2" in the footer (hidden on phones) | Add: Project access can be reached only through **Next** or after it has been visited. Edit: both steps open from the start. Clicking Project access while Details has errors shows the errors instead | — |
| **Cancel** (step 1) | Leave | Click | Closes; asks first if anything changed (BR-CLD-012) | Disabled while saving | — |
| **Back** (step 2) | Return to Details | Click | Goes to step 1 | Disabled while saving | — |
| **Next** (step 1) | Continue | Click | Checks Details; if valid goes to Project access, otherwise shows all Details errors | Disabled while saving. Secondary style when editing | — |
| **Add SPOC** (add, step 2) | Save the new SPOC | Click | Saves; spinner while saving (SH-007) | Shown only on step 2 when adding | Toast, modal closes, section refreshes |
| **Save changes** (edit) | Save edits | Click | Saves; spinner while saving | Shown on either step, only once something has changed | Toast, modal closes, section refreshes |
| Closing | Leave the modal | × or Esc | Same as Cancel | Clicking the backdrop does **not** close this modal (differs from SH-006) | — |
| Project access step | Choose projects | Tick / untick | **Select all** checkbox (ticked when all, partly ticked when some) and "n of T selected"; one row per project with name, dates and status badge | A new SPOC starts with **every** project ticked. With no projects: "This client has no projects yet — you can give access once projects are set up." | — |

### 5.8 Tax & Billing section

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Billing addresses** card (company) | Show GST registrations | View | "One for each GST registration the company is billed under." One card per billing address that has a GST number: "Billing address N", address line(s), city/state/PIN, the GSTIN, and the GST certificate file name | Billing addresses without a GST number are not shown. Empty: "No billing addresses added." | — |
| **GST** card (individual) | Show the individual's GST | View | "The participant’s GST registration, if any." GSTIN and certificate | Empty: "No GST number added." | — |
| **Lower TDS** card | Show Lower TDS facts | View | Description "The client has a lower TDS certificate." or "No lower TDS certificate — the standard rate applies." When yes: **Lower TDS rate** (N%), **Amount** (₹, SH-012), **Section**, **Valid from**, **Valid to**, **Certificate** | **Valid to** adds "Expired" (red) when past, or "Ends in N days" (amber) when 30 days or fewer remain. Missing values show "—" | — |
| Certificate link | View a certificate | Click the file name | Opens the file preview (5.8.1) | — | Preview opens |
| Editing [Not Implemented] | — | — | View only; changes are made on the Edit client form ([clients-prd.md](clients-prd.md)) | — | — |

#### 5.8.1 File preview

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Preview window | View a certificate | Open | Title = file name; description = kind and size (for example "PDF document · 240 KB"). Images fit the window; PDFs show in a viewer | — | — |
| **Open in new tab** / **Download** | Open or save the file | Click | Opens the file in a new tab / downloads it | Only when the file has content | — |
| No content | — | — | "Preview isn’t available" / "This file was attached before previews were supported. Replace it to view it here." | Demo certificates without content | — |
| Unsupported type | — | — | "No preview for this file type" / "Download it to open it on your device." | — | — |

### 5.9 Settings & Configuration section

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Client status** card | Activate or deactivate the client | Toggle | Label "Active client" / "Inactive client", help "Turn off to mark this client inactive." / "Turn on to make this client active again." Card description "Inactive clients stay on file but don’t appear in new schedules" | Change is a draft until saved | — |
| **Product access** card | Give products to the client | Toggle **Prism** / **Praxn** | Off: "Turn on to give this client access to <product>." Praxn on: "<client name> has access to Praxn." Prism on: "n of 6 assessments on." | — | — |
| Prism **Assessments** | Choose Prism assessments | Toggle each; **All** / **None** | Six switches with hints (7.4). **All** disabled when all are on; **None** disabled when none are on. Warning "No assessments on — the client won’t see anything in Prism." when none | Shown only while Prism is on. Turning Prism on when no assessments are chosen turns all of them on | — |
| **Access & communication** card | Portal and email settings | Toggle | **Client portal access** ("SPOCs can sign in to see projects and reports."), **Email updates to SPOCs** ("Schedules, changes and completion reports."), **Session reminders** ("Remind participants a day before each session.") | Stored only; the effects are not enforced in this application (OQ-CLD-006) | — |
| Save bar | Save or discard | View | "You have unsaved changes." or "All changes saved." | — | — |
| **Reset** | Undo unsaved changes | Click | Restores the last saved values | Disabled when nothing changed or while saving | — |
| **Save changes** | Save | Click | Saves all settings; spinner while saving | Disabled when nothing changed | Toast; header status and Activity History update |

### 5.10 Activity History section

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Section header | Name the section | View | "Activity history" with total entry count and "Everything that happened with this client, newest first" | — | — |
| Period summary panel | Summarise a period | View | Period label ("Last 30 days", or the chosen date range), number of activities, a comparison ("Same as the previous 30 days", "N more than the previous 30 days", "N fewer than the previous period"…), and **By type** counts | No comparison when the client has no activity before the period. Pins while scrolling on large screens | — |
| By type rows | Filter by type | Click a type | Shows only that type (click again or **Show all** to clear) | Only types with activity in the period are listed | Timeline filtered |
| Result count | Show the number shown | View | "N activity/activities", plus " in this period" when a date range is set | — | — |
| **Activity type** select | Filter by type | Choose | 7.5 | — | Timeline filtered |
| Date range picker | Filter by dates | Choose a preset or two dates | 7.5 | — | Timeline filtered |
| **Clear** | Remove filters | Click | Resets type and date range | Shown only while filtering | — |
| Timeline | See entries | View | Grouped by day ("Today", "Yesterday", or weekday + date, with the year when not this year) with a count per day. Each entry: type icon, "<verb> **<subject>**", time, a detail line and, for invoices, a compact amount (full amount on hover) | — | — |
| **Show more** | See older entries | Click | Shows 8 more entries | Shown when more than the visible entries match | — |
| Entry types | — | — | **Client** (Added client, Updated details of, Marked active/inactive, Changed settings & configuration of), **Projects**, **Participants**, **Invoices**, **SPOCs & access** | In the demo build, entries other than the client's own history are generated sample events (SH-001). Adding or editing a SPOC does **not** create an entry (OQ-CLD-007) | — |

### 5.11 Client not found

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Not-found card | Explain a bad link | Open an unknown client address | "Client not found" / "It may have been removed, or the link is out of date." with an **All clients** button | No header card or tabs are shown | All Clients on click |

## 6. User Workflow

### 6.1 Review a client

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click a client on All Clients | Opens Client details on Overview | Client exists | Header card, tabs and Overview show |
| 2 | Click the **Projects** count | Opens Projects | — | Timeline (or the remembered view) shows |
| 3 | Click another tab | Opens that section; the address records it | — | Reload keeps the section |
| 4 | Click **All clients** | Returns to the list | — | All Clients shows |

### 6.2 Explore projects

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Projects | Timeline opens on the current year (or latest year with projects) | Client has projects | Bars per project |
| 2 | Click ‹ / › | Shows the previous/next year | Within the project year range | Projects touching that year |
| 3 | Click **Filters**, choose options, click **Show N projects** | Applies filters; chips and result line appear | Button disabled when nothing matches | Narrowed list |
| 4 | Switch to List view | Table of all years, newest first | View remembered | Table |
| 5 | Click a project | Details drawer opens | — | Programs listed |

### 6.3 Look up a participant's learning journey

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Participants | Table sorted by name | Participants exist | Table |
| 2 | Type in search | Rows narrow; result line "N of T participants" | Matches name, email, mobile, employee code, department, designation | Matching rows |
| 3 | Click a row | Journey drawer opens | — | Contact and journey steps |
| 4 | Click **Clear all** | Search and filters cleared | — | All rows |

### 6.4 Add a SPOC

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open SPOCs & Project Access, click **Add SPOC** | Add SPOC modal opens on Details | — | Empty form; country preset to India |
| 2 | Fill SPOC name, Email, Mobile number (and optional fields) | Letters-only name, digits-only mobile enforced as typed | Errors show on leaving a typed field (7.2) | — |
| 3 | Click **Next** | Validates Details | Name, email, 10-digit mobile, email not used by another SPOC of this client | Project access step; all projects ticked |
| 4 | Untick projects the SPOC should not see | Count updates | No minimum | — |
| 5 | Click **Add SPOC** | Saves (spinner) | Duplicate email re-checked on save | Toast "SPOC added"; modal closes; SPOC appears in matrix/list |

### 6.5 Edit a SPOC

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the pencil (matrix or list) or **Edit** in the details drawer | Edit SPOC modal opens with saved values | — | Both steps reachable |
| 2 | Change any field or project access | **Save changes** appears | Only after a change | — |
| 3 | Click **Save changes** | Validates; if Details has errors, returns to Details with toast "Check the highlighted fields" | — | Toast "SPOC updated"; matrix/list refresh |
| 4 (alt) | Click Cancel / × / Esc after changing something | "Discard your changes?" dialog | — | **Discard** closes without saving; **Keep editing** returns |

### 6.6 Change client settings

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Settings & Configuration | Shows saved settings | — | "All changes saved." |
| 2 | Toggle switches | Save bar reads "You have unsaved changes." | — | Reset and Save enabled |
| 3 | Click **Save changes** | Saves (spinner) | — | Toast "Settings saved"; header status updates; Activity History gains "Changed settings & configuration of <client>" (and "Marked active/inactive" if status changed) |
| 3 (alt) | Click **Reset** | Restores saved values | — | "All changes saved." |

### 6.7 Review activity

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Activity History | First 8 entries, newest first; summary for last 30 days | — | Timeline |
| 2 | Pick a type or date range | Timeline and summary update | Date range needs a start and end date to apply | Filtered entries |
| 3 | Click **Show more** | 8 more entries | — | Longer timeline |
| 4 | Click **Clear** | All entries again | — | Unfiltered |

## 7. Forms and Field-Level Specifications

### 7.1 Participants search and filters

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search participants | Search text box, placeholder "Search name, email, code…" | Find people | Optional | N/A | Requires Confirmation | Any text; case-insensitive "contains" match on name, email, mobile (as displayed, with spaces), employee code, department, designation; surrounding spaces ignored | Empty | None | Hidden when the client has no participants | N/A |
| Learning journey | Segmented choice | Filter by overall journey status | Optional | N/A | N/A | All, In progress, Pending, Completed | All | None | — | N/A |
| Department | Multi-select with search ("Any department", "Search departments…") | Filter by department | Optional | N/A | N/A | Departments present among this client's participants, A–Z | None selected | None | Matches any selected | N/A |
| Designation | Multi-select with search ("Any designation", "Search designations…") | Filter by designation | Optional | N/A | N/A | Designations present among this client's participants, A–Z | None selected | None | Matches any selected | N/A |

### 7.2 Add SPOC / Edit SPOC — Details step

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| SPOC name | Text, placeholder "Full name" | Contact's full name | Required | 1 character (after trimming) | Requires Confirmation | Letters (any alphabet), spaces, dots, apostrophes and hyphens. Digits and other symbols are removed as typed; repeated spaces collapse to one. Trimmed on save | Empty (edit: saved name) | Required; spaces-only counts as empty | — | "Enter the SPOC’s name" |
| Email | Email text, placeholder "name@company.com" | Contact's email | Required | Requires Confirmation | Requires Confirmation | Text, "@", domain, ".", at least 2 characters after the dot, no spaces (SH-004 format). Trimmed on save | Empty (edit: saved email) | Required → format → not used by another SPOC of the same client (case-insensitive, surrounding spaces ignored; the SPOC being edited is excluded) | Duplicate check covers this client only; the same email may be used by a SPOC of another client | "Enter an email address"; "Enter a valid email address"; "Another SPOC of this client already uses this email" |
| Mobile number | Phone text with fixed "+91" prefix, placeholder "98765 43210" | Contact's mobile | Required | 10 digits | 10 digits (further typing blocked) | Digits only; anything else is removed as typed | Empty (edit: saved number) | Required → exactly 10 digits. No check on the first digit | Shown elsewhere as "+91 98765 43210" | "Enter a mobile number"; "Enter all 10 digits" |
| Department | Searchable single select, placeholder "Select department", search "Search departments…", clearable | Contact's department | Optional | N/A | N/A | Administration, Customer Service, Engineering, Finance, Human Resources, Information Technology, Legal, Marketing, Operations, Procurement, Sales, Other | Empty | None | — | N/A |
| Designation | Searchable single select, placeholder "Select designation", search "Search designations…", clearable | Contact's designation | Optional | N/A | N/A | Intern, Executive, Senior Executive, Assistant Manager, Manager, Senior Manager, Associate General Manager, General Manager, Director, Vice President, CXO, Consultant | Empty | None | Saved but not displayed on the page (OQ-CLD-002) | N/A |
| Address line 1 | Text, placeholder "Building, street" | Address | Optional (whole address marked "(optional)") | N/A | 120 characters (further typing blocked) | Any text; trimmed on save | Empty | None | — | N/A |
| Address line 2 | Text, placeholder "Area, landmark" | Address | Optional | N/A | 120 characters (further typing blocked) | Any text; trimmed on save | Empty | None | — | N/A |
| Country | Searchable single select, placeholder "Select country", search "Search countries…" (not clearable) | Address country | Optional | N/A | N/A | India, United Arab Emirates, Singapore, United Kingdom, United States | India | None | Changing country clears State and City | N/A |
| State | Searchable single select, placeholder "Select state" ("Country first" when no country), search "Search states…", clearable | Address state | Optional | N/A | N/A | States of the chosen country, A–Z (for example India: Delhi, Gujarat, Haryana, Jharkhand, Karnataka, Maharashtra, Tamil Nadu, Telangana, Uttar Pradesh, West Bengal) | Empty (edit: saved state; for older SPOCs with only a city, the Indian state containing that city) | None | Disabled until a country is chosen. Changing state clears City | N/A |
| City | Searchable single select, placeholder "Select city" ("State first" when no state), search "Search cities…", clearable | Address city; shown as the SPOC's "Location" | Optional | N/A | N/A | Cities of the chosen state | Empty (edit: saved city) | None | Disabled until a state is chosen | N/A |

Validation timing for this form differs from SH-004: every error, including "required" errors, appears as soon as the user leaves a field, and for all Details fields when **Next** or a save is clicked. Errors update live while typing once shown.

### 7.3 Add SPOC / Edit SPOC — Project access step

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Select all | Checkbox (ticked / partly ticked / clear) | Tick or clear every project | Optional | N/A | N/A | On/off | Add: ticked; Edit: reflects saved access | None | Partly ticked when some but not all projects are selected | N/A |
| Project (one per project) | Checkbox row with name, dates and status | Give access to that project | Optional | 0 projects | All of the client's projects | On/off | Add: all ticked; Edit: saved access | None (a SPOC may be saved with no projects) | Not shown when the client has no projects | N/A |

### 7.4 Settings & Configuration

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Client status | Switch | Active / inactive | Required (always has a value) | N/A | N/A | Active client / Inactive client | The client's current status | None | — | N/A |
| Prism | Switch | Product access | Optional | N/A | N/A | On/off | Off | None | Turning on with no assessments chosen turns all six on; shows Assessments | N/A |
| Praxn | Switch | Product access | Optional | N/A | N/A | On/off | Off | None | — | N/A |
| Assessments (Leadership 360° "Multi-rater feedback", DISC profile "Behavioural style", Emotional intelligence "EQ self-assessment", Team effectiveness "Team health check", Learning agility "Readiness to grow", Sales competency "Skills benchmark") | Switch each, plus **All** / **None** links | Which Prism assessments the client gets | Optional | 0 | 6 | On/off | Off (all on when Prism is first turned on) | None; saving with Prism on and no assessments is allowed (warning only) | Shown only while Prism is on. Choices are kept when Prism is turned off | Warning: "No assessments on — the client won’t see anything in Prism." |
| Client portal access | Switch | Let SPOCs sign in | Optional | N/A | N/A | On/off | On | None | — | N/A |
| Email updates to SPOCs | Switch | Send schedules and reports to SPOCs | Optional | N/A | N/A | On/off | On | None | — | N/A |
| Session reminders | Switch | Remind participants | Optional | N/A | N/A | On/off | On | None | — | N/A |

### 7.5 Projects filters and Activity History filters

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Projects: View | Icon switch (Timeline view / List view) | Choose view | Optional | N/A | N/A | Timeline, List | Timeline (then the remembered choice) | None | Hidden with no projects | N/A |
| Projects: Year | Stepper ‹ year › | Year shown on timeline | Optional | Earliest project start year (or current year) | Latest project end year (or current year) | Whole years | Current year, or latest earlier year with projects | Arrows disabled at the limits | Timeline view only | N/A |
| Projects: Project status | Segmented choice | Filter by project status | Optional | N/A | N/A | All, In progress, Upcoming, Completed | All | None | — | N/A |
| Projects: Project type | Multi-select ("Any type", "Search types…") | Filter by type | Optional | N/A | N/A | Types present among this client's projects (Standard Program, Coaching) | None | None | Matches any selected | N/A |
| Projects: Program status | Segmented choice, note "Projects with at least one program in this status." | Filter by program status | Optional | N/A | N/A | All, In progress, Upcoming, Completed | All | None | — | N/A |
| Projects: Delivered by | Multi-select ("Anyone", "Search…") | Filter by delivering organisation | Optional | N/A | N/A | Delivering organisations present among this client's programs (Blanchard, Crucial Learning, BYLD Learning) | None | None | Matches projects with any program delivered by a selected one | N/A |
| Activity type | Select | Filter timeline | Optional | N/A | N/A | All activity, plus only those of Client, Projects, Participants, Invoices, SPOCs & access that have entries | All activity | None | — | N/A |
| Activity date range | Date range picker, placeholder "From – To" | Filter timeline | Optional | Requires Confirmation | Requires Confirmation (future dates are not blocked) | Presets Today, Last 7 days, Last 30 days, Last 90 days (apply at once); or pick start and end dates and click **Apply** (**Cancel** discards) | None (all time) | **Apply** disabled until both dates are picked | Both dates inclusive | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-CLD-001 | Unknown client | A client address that does not match a client shows a not-found state | Opening the page | Not-found card | Removed client or bad link | "Client not found" / "It may have been removed, or the link is out of date." |
| BR-CLD-002 | Section in address | The open section is stored in the page address; unknown values open Overview | Opening/switching tabs | Reload and shared links keep the section | Unknown section | Overview opens (no message) |
| BR-CLD-003 | View only sections | Overview, Projects, Participants, Tax & Billing, Invoices and Activity History cannot change data | Always | No edit controls | — | — |
| BR-CLD-004 | Project status from dates | A project or program is Upcoming before it starts, In progress while running, Completed after its end date | Projects, SPOCs, Participants | Status badges and colours follow dates | — | — |
| BR-CLD-005 | Participant journey status | A journey step is Pending before its project starts, In progress while it runs, Completed after it ends (a few ended steps may stay Pending). Overall: In progress if any step runs, else Pending if any step pending, else Completed | Participants | Badge and drawer summary | — | — |
| BR-CLD-006 | No participants without projects | A client with no projects has no participants | Participants | Empty state | — | "No participants yet" |
| BR-CLD-007 | SPOC name letters only | Only letters, spaces, dots, apostrophes and hyphens are kept; repeated spaces collapse | Typing in SPOC name | Disallowed characters vanish as typed | Typing "Ravi2 K@" | No message; field shows "Ravi K" |
| BR-CLD-008 | SPOC mobile 10 digits | Exactly 10 digits, digits only, "+91" fixed | SPOC form | Non-digits removed; 11th digit blocked | 9 digits | "Enter all 10 digits" |
| BR-CLD-009 | Unique SPOC email per client | No two SPOCs of the same client may share an email (case and surrounding spaces ignored) | SPOC form (live after leaving the field, on Next, and again when saving) | Inline error; save blocked | Email used by another SPOC of the client | "Another SPOC of this client already uses this email"; if it slips through to the save: toast "Couldn’t add the SPOC" / "Couldn’t save the SPOC" with "Another SPOC already uses this email." |
| BR-CLD-010 | New SPOC sees all projects | A new SPOC starts with every project ticked | Add SPOC | All ticked on step 2 | — | — |
| BR-CLD-011 | No minimum project access | A SPOC can be saved with access to no projects | SPOC form | Saves | — | Toast description "… · 0 of N projects" |
| BR-CLD-012 | Discard confirmation | Closing the SPOC modal after changing anything asks first | Cancel, ×, Esc | Confirmation dialog with red **Discard** and **Keep editing** | — | Add: "Discard this SPOC?" / "The details you’ve entered won’t be saved." Edit: "Discard your changes?" / "Your edits to this SPOC won’t be saved." |
| BR-CLD-013 | Save changes only when changed | In edit mode the save button appears only after a change | Edit SPOC | Button hidden until a change | — | — |
| BR-CLD-014 | Save blocked by Details errors | Saving from step 2 with Details errors returns to Details | Edit SPOC | Errors shown on step 1 | Invalid details | Toast "Check the highlighted fields" / "Some details need a fix before saving." |
| BR-CLD-015 | Address cascade | Country → State → City; changing a higher level clears the lower ones | SPOC form | Lower selects reset and disable | — | Placeholders "Country first", "State first" |
| BR-CLD-016 | SPOC location | The SPOC's location is the chosen city | SPOC save | City shown as "Location" in the list, drawer and matrix tooltip | No city | Location "—" / "Not provided" |
| BR-CLD-017 | SPOC client gone | A SPOC cannot be saved for a client that no longer exists, or edited if it no longer exists | SPOC save | Error toast | Record removed meanwhile | "Couldn’t add the SPOC" / "Couldn’t save the SPOC" with "This client no longer exists." or "This SPOC no longer exists." |
| BR-CLD-018 | Settings are a draft | Settings change only when **Save changes** is clicked | Settings | Save bar shows unsaved state | — | "You have unsaved changes." |
| BR-CLD-019 | Prism default assessments | Turning Prism on when no assessments are chosen turns all on | Settings | All six on | — | "6 of 6 assessments on." |
| BR-CLD-020 | Prism with no assessments | Allowed, but warned | Settings | Saves | No assessments on | "No assessments on — the client won’t see anything in Prism." |
| BR-CLD-021 | Status change logged | Saving a different status records "Marked active"/"Marked inactive" and every settings save records "Changed settings & configuration of" | Settings save | Entries in Activity History (by the signed-in user's name) | — | — |
| BR-CLD-022 | Status visible elsewhere | The saved status shows in the page header and on All Clients | Settings save | Header dot and label update | — | — |
| BR-CLD-023 | Inactive client consequence [Requires Confirmation] | "Inactive clients stay on file but don’t appear in new schedules" | Inactive status | Not enforced anywhere in the current build | — | OQ-CLD-005 |
| BR-CLD-024 | Lower TDS expiry note | Valid-to shows "Expired" after the date, "Ends in N days" within 30 days | Tax & Billing | Coloured note | — | "Expired" / "Ends in N days" |
| BR-CLD-025 | Billing addresses shown | Only billing addresses with a GST number are listed | Tax & Billing | Others hidden | — | "No billing addresses added." when none |
| BR-CLD-026 | Remembered views | Projects view and SPOCs view are remembered in the browser across clients and reloads | View switch | Same view on next visit | — | — |
| BR-CLD-027 | Filter drawer draft | Filter drawers edit a draft applied only with the main button | Projects, Participants | Closing discards the draft | No matches | Button disabled: "No matching projects" / "No matching participants" |
| BR-CLD-028 | Activity paging | The timeline shows 8 entries at a time | Activity History | **Show more** adds 8 | — | — |
| BR-CLD-029 | Activity comparison | The period summary compares with the same-length period before, only if the client has earlier activity | Activity History | Comparison line or none | — | "Same as …", "N more than …", "N fewer than …" |
| BR-CLD-030 | Unsaved settings on tab switch [Inferred] | Switching to another tab discards unsaved Settings changes without warning | Settings | Draft lost | — | None (OQ-CLD-008) |
| BR-CLD-031 | Copy failure | If the clipboard is blocked, copying does nothing | Copy buttons | No tick | Clipboard blocked | None |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Add SPOC | Saved | Success toast (SH-005) | "SPOC added" — description "<name> · <n> of <T> projects" | After save | Review the SPOC in the matrix/list |
| Edit SPOC | Saved | Success toast | "SPOC updated" — description "<name> · <n> of <T> projects" | After save | — |
| Add SPOC fails | Save rejected | Error toast | "Couldn’t add the SPOC" — description is the reason (for example "Another SPOC already uses this email.", "This client no longer exists.") | After save attempt | Fix and retry |
| Edit SPOC fails | Save rejected | Error toast | "Couldn’t save the SPOC" — description is the reason (for example "This SPOC no longer exists.") | After save attempt | Fix and retry |
| Save SPOC with invalid details | Details errors | Error toast | "Check the highlighted fields" — "Some details need a fix before saving." | On save | Fix fields on Details |
| Save settings | Saved | Success toast | "Settings saved" — description = client name | After save | — |
| Save settings fails | Rejected | Error toast | "Couldn’t save the settings" — description is the reason (for example "This client no longer exists.") | After save attempt | Retry |
| Settings state | Unsaved / saved | Inline text | "You have unsaved changes." / "All changes saved." | Always on Settings | Save or Reset |
| Prism warning | No assessments on | Inline warning | "No assessments on — the client won’t see anything in Prism." | While Prism is on with none chosen | Turn assessments on |
| Copy | Copied | Inline icon + tooltip | Tick icon, tooltip "Copied" (screen readers: "<item> copied") | About 1.5 seconds | — |
| Lower TDS expiry | Near or past expiry | Inline note | "Ends in N days" / "Expired" | Tax & Billing | Ask client for a new certificate |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Projects list: **Project** | Name and type | Sortable | Name with status-tinted folder tile and project-type chip | — |
| Projects list: **Dates** | When it runs | Sortable; **default sort, newest start first** | "14 Oct – 31 Oct 2026" (year once when shared) and "N days" | — |
| Projects list: **Progress** | Where it stands | Sortable; hidden below large screens | Bar plus "Done", "Starts tomorrow", "Starts in N days" or "Day X of Y" | — |
| Projects list: **Programs** | Delivery | Sortable by count; hidden below medium screens | Up to 3 stacked initials of delivering organisations, plus count; hover lists them | — |
| Projects list: **Status** | Status | Sortable (In progress, Upcoming, Completed order) | Status badge (dot + word) | — |
| Projects list: pagination | Paging | SH-008 | 10 per page; 10, 20, 50, All | "No projects match" / "Try loosening the filters." with **Clear filters** |
| Projects timeline | Yearly schedule | Not sortable; earliest start first | See 5.3 | "No projects in <year>" / "Use the arrows to see other years."; with filters "No matching projects in <year>" / "Try another year or loosen the filters." |
| Participants: **Participant** | Person | Sortable; **default sort A–Z** | Avatar, name, email | — |
| Participants: **Mobile** | Phone | Not sortable; hidden below large screens | Number or "—" | — |
| Participants: **Department & role** | Role | Sortable by department (blanks last) | Department over designation | "—" |
| Participants: **Employee code** | Code | Sortable; hidden below medium screens | Code chip | "—" |
| Participants: **Learning journey** | Progress | Sortable (In progress, Pending, Completed order) | Status badge and "X of N project(s) done" | — |
| Participants: search, filters, pagination | Narrowing | SH-008 pattern (no summary pills) | 10 per page; 10, 20, 50, All | "No participants match" / "Try a different search or filter." with **Clear search & filters** |
| SPOC list: **SPOC** | Person | Sortable; **default sort A–Z** | Avatar, name, email | — |
| SPOC list: **Mobile** | Phone | Hidden below large screens | "+91 98765 43210" | "—" |
| SPOC list: **Department & location** | Role and city | Sortable by department (blanks last) | Department over city | "—" |
| SPOC list: **Project access** | Access | Sortable by number of projects | "All projects" badge, or "n of T projects" | — |
| SPOC list: **Last active** | Recency | Sortable; hidden below medium screens | Relative time (SH-012) | "—" |
| SPOC list: actions | Edit / open | Pencil "Edit <name>"; arrow cue on hover. On phones the pencil sits at the top-right of each SPOC card, beside the name | — | — |
| SPOC list: pagination | Paging | 10 per page (SH-008 default choices) | — | — |
| Access matrix | Who sees what | Not sortable; no search or filters | See 5.6 | No SPOCs: "No SPOCs yet" |
| Activity timeline | History | Newest first; 8 at a time | Type and date filters (7.5) | "No activity in this view" / "Try a different date range or activity type." with **Show all activity** |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| Client not found | Unknown or removed client address | Not-found card only | "Client not found" / "It may have been removed, or the link is out of date." | **All clients** |
| No projects | Client has no projects | Projects empty state; view switch, year stepper and Filters hidden | "No projects yet" / "Projects run for this client will appear here on a schedule with their programs." | — |
| No projects in the year | Timeline year has none | Compact empty state | "No projects in <year>" / "Use the arrows to see other years." | Step years |
| No participants | Client has no participants | Empty state; search and Filters hidden | "No participants yet" / "People from this client will be listed here once they’re added to a project." | — |
| No SPOCs | Client has no SPOCs | Empty state with **Add SPOC** | "No SPOCs yet" / "Add the client’s points of contact and choose which projects each can see." | Add SPOC |
| SPOCs but no projects | Client has SPOCs and no projects | Matrix shows only SPOC and Access columns; Access "No projects yet"; summary chips hidden; drawer "Can see 0 of 0 projects" and "No projects yet" | "This client has no projects yet — access shows here once projects are set up." | — |
| Add SPOC with no projects | No projects | Step 2 shows a note instead of checkboxes | "This client has no projects yet — you can give access once projects are set up." | Save without access |
| Missing participant / SPOC contact | Field empty | Drawer row reads "Not provided" | "Not provided" | — |
| Participant without role | No designation or department | Drawer subtitle | "Role not set" | — |
| Empty addresses | No address on file | Overview address | "Not added yet" | Edit client |
| Certificate without content | Demo file | Preview shows message | "Preview isn’t available" / "This file was attached before previews were supported. Replace it to view it here." | — |
| Lower TDS ends today | Valid-to is today | Note reads "Ends in 0 days" [Inferred] | "Ends in 0 days" | OQ-CLD-009 |
| Closing the SPOC modal while saving | × or Esc during save | The modal closes immediately (no confirmation); the save still completes and its toast appears [Inferred] | Success or error toast | — |
| Email with surrounding spaces | User types " a@b.co " | Format check fails because spaces are not allowed | "Enter a valid email address" | Remove spaces |
| Unsaved settings and tab switch | User switches tabs | Changes lost without warning | None | OQ-CLD-008 |
| Reload | Any reload | SPOC additions/edits and settings revert to demo data (SH-001); open tab and remembered views stay | — | — |
| Clipboard blocked | Browser denies copy | Nothing happens | None | Copy manually |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| All Clients ([clients-prd.md](clients-prd.md)) | Entry point and back navigation | Click a client / **All clients** | Opens / returns | BR-CLD-001 |
| Edit client ([clients-prd.md](clients-prd.md)) | Edits the client's details shown in the header, Overview and Tax & Billing | **Edit** | Opens the Edit client form; saved edits show here and log "Updated details of" (and status changes) in Activity History | BR-CLD-021 |
| All Clients status | Status shown in list | Save Settings with a new status | The client's status changes on All Clients and in the header | BR-CLD-022 |
| App shell ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)) | Breadcrumb "All Clients › Client details", sticky tab bar under the top bar | Page open/scroll | — | SH-009 |
| Profile ([profile-prd.md](profile-prd.md)) | Same activity timeline design ("My activity"); the client version has a period summary instead of a heatmap | — | — | — |
| Settings location masters ([settings-location-masters-prd.md](settings-location-masters-prd.md)) | SPOC address country/state/city choices [Requires Confirmation] | SPOC form | The SPOC form uses its own fixed country → state → city list, not the masters | OQ-CLD-003 |
| Settings industry & job masters ([settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md)) | SPOC Department and Designation choices [Requires Confirmation] | SPOC form | Uses a fixed list, not the masters | OQ-CLD-003 |
| Settings finance masters ([settings-finance-masters-prd.md](settings-finance-masters-prd.md)) | Delivering organisations on programs ("Delivered by") | Projects | Names shown come from demo project data, not the Entity master | — |
| Signed-in user ([authentication-prd.md](authentication-prd.md)) | Name recorded on settings activity | Save Settings | Entry detail "by <user name>" ("You" when no name) | BR-CLD-021 |

## 13. Acceptance Criteria

**AC-CLD-001: Open a client**
- Given a signed-in Training Partner user on All Clients
- When they click a client
- Then Client details opens on Overview with the client's logo, name, code, industry, city and status
- And the breadcrumb shows "Client details"

**AC-CLD-002: Unknown client**
- Given an address for a client that does not exist
- When the page opens
- Then "Client not found" shows with "It may have been removed, or the link is out of date."
- And **All clients** returns to the list

**AC-CLD-003: Section kept in the address**
- Given the user opens the Settings & Configuration tab
- When they reload the page
- Then Settings & Configuration is still open
- And an unknown section value opens Overview instead

**AC-CLD-004: Stats open sections**
- Given Overview is open
- When the user clicks the Projects, Participants, Invoices or Outstanding figure
- Then the matching section opens (Invoices and Outstanding both open Invoices)

**AC-CLD-005: Copy client code**
- Given Overview is open
- When the user hovers the Client code and clicks the copy icon
- Then the code is copied and the icon shows a tick for about 1.5 seconds

**AC-CLD-006: Projects timeline year navigation**
- Given a client with projects in several years
- When the user clicks ›
- Then the next year's projects show
- And the › arrow is disabled at the latest project year

**AC-CLD-007: Project filters**
- Given the Projects section
- When the user opens Filters, selects "Completed" project status and clicks "Show N projects"
- Then only completed projects show with a "Completed" chip and the Filters badge shows 1
- And when no project matches a draft, the button reads "No matching projects" and cannot be clicked

**AC-CLD-008: Remembered project view**
- Given the user switches Projects to List view
- When they open another client's Projects section or reload
- Then List view is shown

**AC-CLD-009: Participant search**
- Given a client with participants
- When the user types part of an employee code
- Then only matching participants show with "N of T participants"
- And **Clear all** empties the search and filters

**AC-CLD-010: No participant matches**
- Given a search that matches no one
- Then "No participants match" shows with **Clear search & filters**

**AC-CLD-011: Learning journey**
- Given the participants table
- When the user clicks a participant
- Then a drawer shows their contact details and one journey step per project with enrolment and completion dates

**AC-CLD-012: Add a SPOC**
- Given the SPOCs section
- When the user clicks **Add SPOC**, enters a valid name, unique email and 10-digit mobile, clicks **Next** and **Add SPOC**
- Then the toast "SPOC added" shows "<name> · <n> of <T> projects"
- And the SPOC appears in the matrix with access to every project left ticked

**AC-CLD-013: SPOC required fields**
- Given the Add SPOC modal on Details
- When the user clicks **Next** with all fields empty
- Then "Enter the SPOC’s name", "Enter an email address" and "Enter a mobile number" show
- And the modal stays on Details

**AC-CLD-014: SPOC name letters only**
- Given the SPOC name field
- When the user types "Asha 3 Rao!"
- Then the field shows "Asha Rao"

**AC-CLD-015: SPOC mobile length**
- Given the Mobile number field
- When the user types 9 digits and leaves the field
- Then "Enter all 10 digits" shows
- And an 11th digit cannot be typed and letters are ignored

**AC-CLD-016: Duplicate SPOC email**
- Given a SPOC "kavita.menon@acme.com" exists for this client
- When the user enters "Kavita.Menon@ACME.com" for another SPOC and leaves the field
- Then "Another SPOC of this client already uses this email" shows and the SPOC cannot be saved

**AC-CLD-017: Edit a SPOC**
- Given an existing SPOC
- When the user clicks its pencil, changes the department and clicks **Save changes**
- Then the toast "SPOC updated" shows and the new department appears
- And **Save changes** is not shown before any change

**AC-CLD-018: Discard SPOC changes**
- Given the Edit SPOC modal with a change
- When the user presses Esc
- Then "Discard your changes?" asks to confirm
- And **Keep editing** returns to the form, **Discard** closes without saving
- And clicking the backdrop does not close the modal

**AC-CLD-019: Address cascade**
- Given the SPOC form with Country "India", State "Maharashtra", City "Pune"
- When the user changes State to "Karnataka"
- Then City is cleared and offers only Karnataka's cities

**AC-CLD-020: Save settings**
- Given Settings & Configuration
- When the user turns Client status off and clicks **Save changes**
- Then "Settings saved" shows, the header shows "Inactive"
- And Activity History gains "Marked inactive" and "Changed settings & configuration of" entries

**AC-CLD-021: Prism assessments**
- Given Prism is off with no assessments chosen
- When the user turns Prism on
- Then all six assessments are on and "6 of 6 assessments on." shows
- And clicking **None** shows "No assessments on — the client won’t see anything in Prism."

**AC-CLD-022: Reset settings**
- Given unsaved settings changes
- When the user clicks **Reset**
- Then the saved values return and "All changes saved." shows

**AC-CLD-023: Tax & Billing**
- Given a company client with Lower TDS whose certificate ends in 20 days
- When the user opens Tax & Billing
- Then Valid to shows "Ends in 20 days"
- And clicking a certificate name opens its preview

**AC-CLD-024: Activity filtering**
- Given Activity History
- When the user selects "Last 7 days"
- Then only entries from the last 7 days show with " in this period" and **Clear** appears
- And when nothing matches, "No activity in this view" shows with **Show all activity**

**AC-CLD-025: Invoices placeholder**
- Given any client
- When the user opens Invoices
- Then "No invoices yet" shows over the planned columns and no actions are available

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-CLD-001 | AC-CLD-001 | Open client from list | Signed in | Any demo client | Header and Overview show; tab title "Client details · …" | P1 |
| TC-CLD-002 | AC-CLD-002 | Unknown client | — | /clients/unknown-id | "Client not found" card | P1 |
| TC-CLD-003 | AC-CLD-003 | Reload keeps tab | — | Open Activity History, reload | Activity History open | P2 |
| TC-CLD-004 | BR-CLD-002 | Invalid tab value | — | ?tab=abc | Overview opens | P3 |
| TC-CLD-005 | 5.1 | Edit button | — | Click **Edit** | Edit client form for this client | P1 |
| TC-CLD-006 | AC-CLD-004 | Stats navigation | — | Click Outstanding | Invoices placeholder opens | P3 |
| TC-CLD-007 | AC-CLD-005 | Copy code | Clipboard allowed | Click copy | Code copied; tick ~1.5 s | P3 |
| TC-CLD-008 | 5.2 | Website link without protocol | Company with website "acme.com" | Click | Opens https://acme.com in a new tab | P3 |
| TC-CLD-009 | 5.2 | Individual client overview | Individual client | — | "Participant profile" with Department, Designation, Participant ID, Email | P2 |
| TC-CLD-010 | AC-CLD-006 | Year stepper limits | Client with projects | Click › to the last year | › disabled | P2 |
| TC-CLD-011 | AC-CLD-007 | Filter by type | Projects exist | Project type "Coaching" | Only Coaching projects; chip "Coaching" | P2 |
| TC-CLD-012 | BR-CLD-027 | Filter with no results | Projects exist | Combination with zero matches | Button "No matching projects", disabled | P2 |
| TC-CLD-013 | BR-CLD-027 | Close filter drawer without applying | — | Change draft, press Esc | Filters unchanged | P3 |
| TC-CLD-014 | AC-CLD-008 | View remembered | — | Choose List, open another client | List view shown | P3 |
| TC-CLD-015 | 5.3 | Project details | — | Click a project bar | Drawer with programs sorted by start | P2 |
| TC-CLD-016 | 11 | No projects | Client with 0 projects | — | "No projects yet"; no Filters/view switch | P2 |
| TC-CLD-017 | 10 | Projects list default sort and paging | ≥1 project | List view | Newest start first; page sizes 10/20/50/All | P3 |
| TC-CLD-018 | AC-CLD-009 | Participant search | Participants exist | Partial email | Matching rows; "N of T participants" | P2 |
| TC-CLD-019 | AC-CLD-010 | Search no results | — | "zzzz" | "No participants match" + **Clear search & filters** | P2 |
| TC-CLD-020 | 5.5.1 | Participant filter count includes search | Search active | Open Filters | "Show N participants" counts only searched rows | P3 |
| TC-CLD-021 | AC-CLD-011 | Journey drawer | — | Click participant | Steps with "Enrolled …" and "Completed …"/"Not completed yet" | P2 |
| TC-CLD-022 | AC-CLD-012 | Add SPOC happy path | SPOCs tab | Name "Anita Desai", email "anita.desai@acme.com", mobile "9876543210" | Toast "SPOC added"; row visible | P1 |
| TC-CLD-023 | AC-CLD-013 | Required errors | Add modal | All empty, **Next** | Three required messages | P1 |
| TC-CLD-024 | 7.2 | Required error on blur | Add modal | Focus name, leave empty | "Enter the SPOC’s name" shows immediately (differs from SH-004) | P2 |
| TC-CLD-025 | AC-CLD-014 | Name filtering | — | "Asha 3 Rao!", "O'Neil-Smith Jr." | "Asha Rao"; "O'Neil-Smith Jr." accepted | P2 |
| TC-CLD-026 | 7.2 | Name single letter | — | "A" | Accepted | P3 |
| TC-CLD-027 | AC-CLD-015 | Mobile boundaries | — | 9 digits / 10 digits / 11th digit / "98a76" | Error / valid / blocked / "9876" | P1 |
| TC-CLD-028 | 7.2 | Email boundaries | — | "a@b.c", "a@b.co", "a b@c.co", " a@b.co" | Invalid / valid / invalid / invalid | P2 |
| TC-CLD-029 | AC-CLD-016 | Duplicate email case-insensitive | Existing SPOC email | Same email in caps | Duplicate error | P1 |
| TC-CLD-030 | BR-CLD-009 | Same email allowed on another client | SPOC on client A | Use its email on client B | Accepted | P3 |
| TC-CLD-031 | BR-CLD-009 | Edit keeps own email | Existing SPOC | Edit without changing email | No duplicate error | P2 |
| TC-CLD-032 | 7.2 | Address line max | — | 121 characters | Only 120 accepted | P3 |
| TC-CLD-033 | AC-CLD-019 | Cascade reset | — | Change Country to "Singapore" | State and City cleared; states = Singapore | P2 |
| TC-CLD-034 | BR-CLD-016 | City becomes location | — | Save with City "Pune" | List shows "Pune" under department | P3 |
| TC-CLD-035 | BR-CLD-011 | Save with no project access | Projects exist | Untick **Select all** | Saves; toast "… · 0 of N projects" | P3 |
| TC-CLD-036 | AC-CLD-017 | Edit SPOC | Existing SPOC | Change department | "SPOC updated"; **Save changes** hidden before change | P1 |
| TC-CLD-037 | BR-CLD-014 | Save with invalid details from step 2 | Edit modal | Clear email, go to step 2, save | Returns to Details; toast "Check the highlighted fields" | P2 |
| TC-CLD-038 | AC-CLD-018 | Discard confirmation | Changed form | Esc / Cancel / × / backdrop | Dialog for first three; backdrop does nothing | P2 |
| TC-CLD-039 | AC-CLD-018 | Close untouched add form | Add modal | Cancel without typing | Closes without dialog | P3 |
| TC-CLD-040 | 5.6 | List view drawer edit | List view | Row click → **Edit** | Drawer closes, Edit SPOC opens | P3 |
| TC-CLD-041 | 11 | SPOCs with no projects | Client with SPOCs, no projects | — | Legend "This client has no projects yet — …" | P3 |
| TC-CLD-042 | SH-001 | Reload reverts SPOC | SPOC added | Reload | SPOC gone | P3 |
| TC-CLD-043 | AC-CLD-020 | Save status inactive | Active client | Turn off, save | Header "Inactive"; Activity entries | P1 |
| TC-CLD-044 | AC-CLD-021 | Prism default all | Prism off | Turn on | 6 of 6 on | P2 |
| TC-CLD-045 | BR-CLD-020 | Prism none | Prism on | **None**, save | Warning shown; saves | P3 |
| TC-CLD-046 | AC-CLD-022 | Reset settings | Changes made | **Reset** | Restored; buttons disabled | P2 |
| TC-CLD-047 | BR-CLD-030 | Tab switch loses settings | Unsaved changes | Switch tab and back | Changes gone, no warning | P3 |
| TC-CLD-048 | AC-CLD-023 | TDS expiry notes | Valid-to in past / in 30 days / in 31 days | — | "Expired" / "Ends in 30 days" / no note | P3 |
| TC-CLD-049 | BR-CLD-025 | Billing address without GST | Company with such address | — | That address not listed | P3 |
| TC-CLD-050 | 5.8.1 | Certificate preview | Certificate present | Click name | Preview opens with file name | P3 |
| TC-CLD-051 | AC-CLD-024 | Activity date preset | — | "Last 7 days" | Filtered; **Clear** shown | P2 |
| TC-CLD-052 | 7.5 | Custom date range apply | — | Pick only start date | **Apply** disabled | P3 |
| TC-CLD-053 | BR-CLD-028 | Show more | > 8 entries | Click **Show more** | 8 more entries | P3 |
| TC-CLD-054 | 5.10 | By type toggle | — | Click "Invoices" twice | Filters, then shows all | P3 |
| TC-CLD-055 | AC-CLD-025 | Invoices placeholder | — | Open Invoices | "No invoices yet" | P3 |

## 15. Open Questions and Gaps

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

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages, sections and their features: Complete
- [x] User roles and access: Complete (no role enforcement, SH-002)
- [x] Workflows: Complete
- [x] Field-level specifications for every input, search and filter: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (SPOC name/email lengths and date-range limits not defined — see OQ-CLD-010)
- [x] Validation and business rules: Complete
- [x] Success, error and feedback messages quoted exactly: Complete
- [x] Tables, sorting, pagination and filters: Complete
- [x] Empty states, errors and edge cases: Complete
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria incl. negative cases: Complete
- [x] QA test scenarios with boundaries: Complete
- [ ] Not-implemented features defined: Incomplete (Invoices, SPOC removal, project/participant management — see OQ-CLD-001, OQ-CLD-004, OQ-CLD-012)
- [ ] Downstream effect of settings: Incomplete (see OQ-CLD-005, OQ-CLD-006)
