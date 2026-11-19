# Projects: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Projects PRD |
| Module name | Projects (project list, project drawer, Add project, Program workspace) |
| Document ID | PRD-PRJ |
| Version | 1.0 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (the list, drawer, Archive, Add project and the Program workspace's Overview and five setup steps work; "Add a program" is coming soon, and the People, Logistics, Communication, Go live and After delivery steps and Assessments and check-ins are placeholders; several workspace values are demo assumptions, see section 15) |
| Last updated | 2026-11-19 (v1.0: first version — the Projects page replaces the "Nothing here yet" placeholder described in PRD-SHELL) |
| Related modules/pages | [client-detail-prd.md](client-detail-prd.md), [clients-prd.md](clients-prd.md), [manage-content-prd.md](manage-content-prd.md), [facilitators-prd.md](facilitators-prd.md), [settings-program-content-masters-prd.md](settings-program-content-masters-prd.md), [settings-finance-masters-prd.md](settings-finance-masters-prd.md), [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md), [app-shell-navigation-prd.md](app-shell-navigation-prd.md), [dashboard-prd.md](dashboard-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

A **project** groups the training **programs** (batches) that the Training Partner runs for one client, for example "Sales Leadership Academy" for BYLD Consulting India Pvt Ltd with a "Building Trust · Cohort A" program. Each program has its own dates, delivery organisation ("Delivered by"), CRM opportunity number (OPP-…), facilitator and setup work.

The Projects module lets Training Partner users:

- See every project across all clients, how far each is set up or delivered, and which ones need attention now ("Need action": a program starts within 14 days and is not set up).
- Open a project to see its programs on a timeline and jump to a program.
- Create a project, either from a won CRM opportunity (details fill themselves in) or from scratch.
- Work through a program's setup in its **Program workspace**: an overview of what is next and when, then chapters of setup steps (Foundation, Learning journey, People, Logistics, Communication, Go live, After delivery).
- Archive a project that should leave the list.

## 3. Module and Page Overview

The sidebar item **Projects** opens the list. The header breadcrumb is the page name (SH-009): "Projects", "Projects › Add project" and "Projects › Program". The search palette (⌘K / Ctrl+K) also finds projects by name, code, client or program name and offers "Add project" ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)).

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Projects list (`/projects`) | All projects with programs, progress, status, owner and last update | Training Partner user | Pills, search, Filters, sort, paginate, open a project, row menu (Add a program, Open client, Copy link, Archive), Add project | Project drawer, Add project |
| Project link (`/projects?q=<PRJ code>`) | Open the list on one project | Training Partner user | Follow a copied link, search result, "Back to project", or arrive after Create | Projects list, project drawer |
| Filter projects (drawer) | Narrow the list by status, run dates, client, owner, program type, delivered by | Training Partner user | Choose, Reset, Show N projects | Projects list |
| Project drawer | One project: status, dates, owner and its programs on a timeline | Training Partner user | Add program (coming soon), Open client, open a program | Program workspace, Client details |
| Archive confirmation | Take a project off the list | Training Partner user | Archive, Cancel | Projects list |
| Add project (`/projects/new`) | 4-step wizard: Opportunity → Project → How to start → Dates and name | Training Partner user | Fetch from CRM or enter details, Continue, Back, Cancel, Create project | Projects list |
| Program workspace (`/projects/<project>/programs/<program>`) | One program's hero, Overview and setup chapters; `?tab=<chapter>&step=<step>` opens a chapter and step | Training Partner user | Back to project, Continue setup, switch tabs, open steps | Projects list, Manage Content |
| Workspace › Overview | Setup %, participants, journey steps, days to go, what's next, program details, key dates, setup by chapter | Training Partner user | Open a section, Open step, copy the opportunity ID | Chapter tabs |
| Workspace › chapter tabs | The steps of one chapter and the open step's screen | Training Partner user | Open a step, Back / Next across chapters, step actions | — |
| Built steps | Program basics, Client contacts, Agreement and approval, Sessions and schedule, Content and kits | Training Partner user | See 5.10–5.14 | Manage Content, Settings › Modules |
| Placeholder steps [Not Implemented] | Assessments and check-ins, Facilitators, Participants, Venue and room, Trainer travel and stay, Workbooks, Invites and reminders, Feedback and certificate, Readiness check, Attendance and debrief | — | None ("<Step> is on its way") | — |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Training Partner user (signed in and continuing as Training Partner) | All Projects pages (SH-002, SH-003) | Every action in this PRD | Roles & Access lists view, add, edit and export rights for Projects, but they are not enforced (SH-002, OQ-GEN-002). There is no export. |
| Super Admin | None | None | Any Projects address opens Manage Clients (BR-SA-002). |
| Signed-out visitor | None | None | Redirected to Sign in (SH-003). |

The signed-in user's own name is shown as **You** wherever an owner or creator is shown.

## 5. Page Functionality and Behavior

### 5.1 Statuses and computed values (used across the module)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Program status | Say where a program is | — | **Upcoming** before its start date, **running** from its start to its end date, **delivered** after its end date (BR-PRJ-001). Shown as "In setup" / "Running" / "Delivered" in the workspace and drawer | Worked out from today's date every time a page loads | — |
| Project status (Status column, filter) | Say where a project is | — | **In setup**, **Live** or **Completed**, worked out from the project's first start and last end date across its programs (BR-PRJ-002). Shown with a status dot and word | — | — |
| Program set-up % | How ready a program is | — | Four list-level setup items — "Facilitator assigned", "Content mapped", "Participants enrolled", "Venue / joining link"; set-up % = items done ÷ 4 (0, 25, 50, 75 or 100) (BR-PRJ-004) | Not the same measure as the workspace's "Setup done" (BR-PRJ-020, OQ-PRJ-010) | — |
| Need action | Flag programs at risk | — | A program needs action when it is upcoming, starts within 14 days and fewer than 4 setup items are done. A project needs action when at least one of its programs does (BR-PRJ-003) | — | Amber marks on the list and drawer |
| Project progress | One number per project | — | In setup: the average set-up % of its programs. Live: day of the project ÷ its total days. Completed: 100% (BR-PRJ-005) | — | Progress column, drawer header |
| Relative days | Friendly dates | — | "today", "tomorrow", "in N days"; in the workspace also "yesterday" and "N days ago". Dates are short ("3 Dec", "3 Dec – 23 Jan", "3 Dec 2026") (SH-012) | A start date already past reads "today" in "Starts …" texts | — |

### 5.2 Projects list

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| List card | Hold the toolbar and the table | Open Projects | One card in the All Clients list pattern (SH-008); no page title block; on phones the outer frame is dropped (SH-013) | — | — |
| Summary pills | Quick filters with totals | Click | "All projects" (tooltip "Show all projects"), "Live" (tooltip "Running now"), "Need action" (amber; tooltip "A program starts within 14 days and isn’t set up yet"), each with its count. Single choice | Counts are of all projects, ignoring search and filters. The pills stay visible on phones (scrolling sideways) | Filtered list |
| Search | Find a project | Type in "Search project, client, program or OPP…" | Contains match, ignoring case, after a short pause (about 0.15 s). Matches project name, project code (PRJ-…), client name, client code, owner, and any program's name, "OPP-<number>", delivered-by name or facilitator name | — | Matching projects |
| **Filters** | Open "Filter projects" | Click | Opens the drawer (5.3). The button shows the number of applied filter chips | — | — |
| **Add project** | Create a project | Click | Opens Add project (5.6) | — | Wizard opens |
| Result line and chips | Show what is applied | Search / filter | "N of Total projects" with one removable chip per filter section and **Clear all** (resets pill, search and filters) | Shown when a pill other than All, a search or a filter is active | — |
| Order of filtering | — | — | Pill first, then search, then drawer filters | — | — |
| **Project** column | Identify | — | Client logo (or initials tile), project name, client name below | Always shown; sortable | — |
| **Programs** column | Programs at a glance | Hover a dot | A dot per program in date order joined by short lines (green after a delivered program): delivered = solid green, running = solid blue with a halo, upcoming = hollow ring, needs action = solid amber with a slow pulse. Hover / focus: "<program> · <status text>" — "Starts in 14 days · only 75% set up", "Starts 11 Dec · 25% set up", "Running · ends 22 Nov", "Delivered · 22 Nov". Beside the dots: "N program(s)" and "Running now", "Next · 3 Dec" or "All delivered" | Sortable by number of programs. With more than 4 programs only 3 dots are shown (starting one before the first program not yet delivered) plus a "+N" chip whose hover lists the others. Demo projects have 1–3 programs | — |
| **Progress** column | How far along | Hover | "N%" (5.1); hover shows "<text> · <sub>": "Starts in 14 days · 75% set up", "Day 10 of 13 · ends 22 Nov", "Completed · 22 Nov" | From large width; sortable | — |
| **Status** column | Project status | — | Dot and word: "In setup", "Live", "Completed" | Sortable in that order | — |
| **Owner** column | Who owns it | — | Avatar and name, or "You" | From extra-large width; sortable | — |
| **Last updated** column | Recency | Hover | Relative time ("1h ago", "3d ago"; older than a week shows the date); hover shows date and time, for example "18 Nov 2026, 14:05" | From extra-large width; sortable; **default sort: newest first** | — |
| Row "…" menu | Row actions | Click "…" ("Actions for <project>") | **Add a program**, **Open client**, **Copy link**, then (separated, in red) **Archive** (5.5). Opening the menu does not open the row | — | — |
| Row click | Open the project | Click a row / card | Opens the project drawer (5.4) | — | Drawer opens |
| Phone layout | Small screens | — | Cards: the Project column as title; other visible columns as rows (SH-013) | Progress hidden below large; Owner and Last updated below extra-large | — |
| Pagination, loading, error | — | — | 10 rows per page; 10, 20, 50 rows or All rows. Skeleton rows while loading; error state with **Try again** (SH-007, SH-008) | — | — |

### 5.3 Filter projects drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Combine filters | Click **Filters** | Title "Filter projects", description "By status, client, owner, programs or dates". Opens with the applied filters | Changes are a draft until applied | — |
| Status | By project status | Toggle chips | "In setup", "Live", "Completed"; several can be on | — | — |
| Runs | By dates | Choose one chip | "Any time" (default), "Next 30 days" (today to today + 29), "This month" (1st to last day), "Last 90 days" (today − 89 to today), "Custom". Custom shows a date range picker (placeholder "From – To", no presets) | A project matches when its dates overlap the range (BR-PRJ-007). Custom with no dates chosen applies nothing | — |
| Client | By client | Multi-select | Placeholder "Any client", search "Search clients…"; clients that have projects, A–Z | — | — |
| Owner | By owner | Multi-select | Placeholder "Anyone", search "Search people…"; the owners in the list, A–Z | — | — |
| Program type | By program type | Toggle chips | "Standard Program", "Coaching", "ICF Program", "Assessment Center" | A project matches if any of its programs has a chosen type | — |
| Delivered by | By delivery organisation | Toggle chips | The delivery organisations in the list (Blanchard, BYLD Learning, Crucial Learning) | A project matches if any of its programs is delivered by a chosen one | — |
| Section clear | Clear one section | Click the section's clear control | Resets that section only | Shown when the section has a value | — |
| **Reset** | Clear the draft | Click | All sections return to defaults | Not applied until the apply button | — |
| Apply button | Apply | Click | "Show N projects" / "Show 1 project"; N counts live over the list as the pill and search already narrow it; the drawer closes | No match: "No matching projects", disabled | Filtered list |
| Chips | Show applied filters | Click × on a chip | One chip per section: "Status: In setup +1", "Runs: Next 30 days" or "Runs: <from> – <to>" ("…" when there is no end), "Client: <name> +N", "Owner: <name> +N", "Type: <type> +N", "Delivered by: <name> +N". Removing a chip clears that whole section | — | — |
| Closing without applying | Abandon | ×, Esc, backdrop (SH-006) | Draft discarded | — | — |

### 5.4 Project drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Header | Identify the project | — | Client logo, project name, client name, softly tinted by status. A round × button stays at the top right while the drawer scrolls | Large drawer; closes with ×, Esc or the backdrop (SH-006) | — |
| **Add program** | Add a batch | Click | Info toast "Adding a program is coming soon" / "This part of Projects isn’t built yet." **[Not Implemented]** | OQ-PRJ-006 | Nothing is added |
| **Open client** | Go to the client | Click | Opens the client's details page ([client-detail-prd.md](client-detail-prd.md)) | — | Client details |
| Facts row | Key facts | — | **STATUS** (dot and word), **RUNS** (**RAN** when completed) with "3 Dec – 23 Jan" (hover shows full dates with years), **OWNER** (avatar and name / "You") | — | — |
| Programs section | The project's programs | — | Heading "Programs N" and, on the right, the project's progress text ("Starts in 14 days", "Day 10 of 13", "Completed"). A vertical timeline in date order. Node: delivered = green check, running = blue dot with a pulse, upcoming = hollow ring, needs action = hollow amber ring | — | — |
| Program card | One program | Click | Start date and a pill — "Delivered", "Running", "N/4 ready" (grey), or "Starts in 14 days · 3/4 ready" (amber, needs action); program name; "<Cohort> · <program type> · <facilitator>" or *No facilitator yet* | — | Opens the Program workspace |
| Footer | Identity and origin | — | "PRJ-3494 · Created 18 Nov 2026 by <name / You>" | — | — |

### 5.5 Row menu actions and Archive

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Add a program** [Not Implemented] | Add a batch | Choose | Info toast "Adding a program is coming soon" / "This part of Projects isn’t built yet." | OQ-PRJ-006 | — |
| **Open client** | Go to the client | Choose | Opens the client's details page | — | — |
| **Copy link** | Share the project | Choose | Copies "<site address>/projects?q=<PRJ code>". Success toast "Link copied" / "<project> · <code>". If copying fails: error toast "Couldn’t copy the link" with the link as its text | — | Link on the clipboard |
| **Archive** | Take the project off the list | Choose | Confirmation (SH-006): title "Archive this project?", text "<project> (<code>) and its N program(s) will leave the list.", buttons **Cancel** and **Archive** (danger, shows loading) | BR-PRJ-008 | On **Archive**: the row disappears (and the drawer closes if it showed this project), success toast "Project archived" / "<project>". On failure: error toast "Couldn’t archive it" with the reason |
| Project link (`?q=`) | Open one project from a link | Open the address | The list shows all projects (pill All, filters cleared), puts the code in the search box and opens the drawer of the project whose code matches (ignoring case); the `q` part is then removed from the address | Used by Copy link, the search palette, "Back to project" and after Create | Drawer open |

### 5.6 Add project wizard: frame

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Steps rail (extra-large screens) | Show progress | Click a reached step | Title "New project", subtitle "Four quick steps." (after a CRM fetch: "Pre-filled from OPP-<id> — just review."). Steps: **Opportunity** ("Opportunity ID or from scratch"), **Project** ("Name and type"), **How to start** ("Copy a batch or start empty"), **Dates and name** ("First day and batch name"). Reached steps show a check and can be opened again. After a CRM fetch, Project and Dates and name carry a small CRM mark ("Pre-filled from CRM portal"). Note at the bottom: "Fields marked * are required. You can go back to any finished step." | Steps not yet reached cannot be opened | — |
| Compact progress (below extra-large) | Same on smaller screens | — | A card with the step name, "Step N of 4" and a 4-part bar | — | — |
| Footer | Move through the wizard | Click | **Back** (from step 2), **Cancel**, and **Continue** — on the last step **Create project** | **Continue** is disabled while an opportunity look-up runs; **Create project** shows loading while saving | — |
| Validation timing | Calm forms | Click **Continue** | A step's errors appear only after **Continue** has been pressed on it once; from then on they follow the values live, and focus moves to the first invalid control (BR-PRJ-010) | — | — |
| Leaving with changes | Protect typed work | Click **Cancel**, or a breadcrumb, sidebar or search link | When anything has been entered: confirmation "Discard this project?" / "The details you’ve entered won’t be saved." with **Keep editing** and **Discard** (danger). With nothing entered, Cancel goes straight back to Projects | Browser Back and reload are not covered (OQ-GEN-006) | — |

### 5.7 Add project wizard: steps

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Step 1 header | Explain | — | "Do you have an opportunity ID?" / "With a won opportunity from the CRM portal, the details fill themselves in." | — | — |
| Step 1 choice | Pick the route | Choose a tile | **Yes, I have one** (tag "Fastest", "Fetch it from the CRM portal") or **No, start from scratch** ("Enter the details yourself") | Required: "Choose one to continue" | — |
| Opportunity ID + **Fetch** | Look up the CRM | Type and click **Fetch** (or press Enter) | Field "Opportunity ID" (placeholder "e.g. OPP-3664", helper "Demo: any 4 digits — ones ending in 0 aren’t found."). The look-up takes about a second; **Fetch** shows a spinner | BR-PRJ-011, BR-PRJ-012 | — |
| Fetched opportunity card | Confirm the result | Read; click **Change** | Client logo and name, a green "✓ OPP-<id>" tag, the program, and "<program type> · <delivered by> · from <date> · <N> people". **Change** forgets the opportunity and everything it filled in and returns to an empty ID box | — | Later steps pre-filled (BR-PRJ-012) |
| From scratch fields | Enter the basics | Choose | **Client** (active clients A–Z, each with its code; "Choose a client" / "Search clients…"), **Program** (the program catalogue, each with its type; "Choose a program" / "Search programs…"; choosing one also sets the program type), **Delivered by** (chips Blanchard, Crucial Learning, BYLD Learning; hover shows the legal entity) | 7.2 | — |
| CRM banner (steps 2 and 4) | Show where values came from | — | After a fetch: "Project pre-filled from CRM portal · OPP-<id> · <client> · review and edit anything that’s changed." (step 4: "Dates and name pre-filled …") with a green "Synced" tag | — | — |
| Step 2 Project | Name the project | Type / choose | Header "Name the project" / "It groups the programs you run for <client>." Fields **Project name** and **Project type** (helper "Coaching, ICF and Assessment Center setups are coming soon.") | 7.3; OQ-PRJ-008 | — |
| Step 3 How to start | Copy or start empty | Choose | Header "How do you want to start?" / "Copy a batch you already ran for <client>, or start from scratch." Tiles **Copy an earlier program** ("Reuse a batch — fastest"; disabled with "No earlier batches yet" when the client has none) and **Start empty** ("Add each session yourself") | BR-PRJ-013; 7.4 | — |
| Copy which program? | Pick the batch | Choose a row | Up to 6 programs this client has already started, newest first: "<program> · <cohort>", the project name and the start date. Helper: "Sessions, content, assessments, facilitator and venue come across — participants and the agreement don’t." | **[Requires Confirmation]** nothing is actually copied (BR-PRJ-014, OQ-PRJ-003) | — |
| Step 4 Dates and name | Schedule the batch | Choose / type | Header "When does it start?" / "And what do you call this batch?" Fields **First day** (helper "When pre-work opens") and **Batch name** (helper "Shown next to the program name"). Note: "After you create it, the program opens with every setup step listed — nothing is locked." | 7.5; OQ-PRJ-013 | — |
| **Create project** | Save | Click | Re-checks every step; if an earlier step has a gap (for example the client was changed and the batch to copy cleared), that step opens with its errors. Otherwise the project is created (BR-PRJ-015), the list opens on it with its drawer open, and the toast "Project created" / "<project> · <code>" shows. On failure: error toast "Couldn’t create the project" with the reason (for example "That client isn’t on file any more.") | — | New project at the top of the list |

### 5.8 Program workspace: hero and tabs

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Hero | Identify the program | — | Client logo, program name, and one line: cohort chip ("Cohort A"), program type (hidden on phones), client name, project name and status ("In setup", "Running", "Delivered" with a coloured dot). Tinted with the client logo's colour | — | — |
| **Back to project** | Return | Click | Opens the Projects list with this project's drawer open (project link, 5.5) | — | — |
| **Continue setup** | Go to the next job | Click | Opens the tab and step of the next open step: the first overdue step, else the first due, else the first not started (After delivery is not counted) | Shown only when such a step exists. On phones both buttons sit in a ⋮ menu ("Actions") | Step opens |
| Section tabs | Move between areas | Click | **Overview**, **Foundation**, **Learning journey**, **People**, **Logistics**, **Communication**, **Go live**, **After delivery**. A tab with a due or overdue step shows a small dot ("Something here is due"). Tabs stay pinned under the header while scrolling | The address keeps the tab and step (`?tab=journey&step=sessions`), so reloads and links reopen them. An unknown tab opens Overview; an unknown step opens the chapter's first open step (BR-PRJ-019) | — |
| Loading / errors | — | — | Skeleton while loading. Failure: "Couldn’t load this program" with the error and **Try again**. Unknown or archived program: "Program not found" / "It may have been removed, or the link is out of date." with **All projects** | — | — |

### 5.9 Program workspace: Overview tab

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Key numbers | Four headline figures | Click a figure | "<N>% Setup done" → the first chapter with open work; "<N> Participants" → People; "<N> Journey steps" → Learning journey; fourth → Go live: "<N> Days to go" (upcoming), "Day <N> Running now" (running) or "✓ Delivered" | Setup done = done steps ÷ the 13 steps of Foundation, Learning journey, People, Logistics and Communication (BR-PRJ-020) | Tab opens |
| **UP NEXT** | What to do now | Click **Open step** | The next open step (as Continue setup) with its state icon, label and chapter; for a due or overdue step, its note in amber or red ("Due tomorrow", "3 days overdue"). When nothing is open: "Every setup step is done — this program is ready." | — | Step opens |
| **PROGRAM DETAILS** | Reference facts | Hover; copy | Program type · Delivered by (hover: legal entity) · Facilitator · Opportunity ("OPP-3664" with a copy button: "Copy" / "Copied") · Starts (hover: relative day) · Ends · Cohort · Project. Empty values show "—" | — | — |
| **KEY DATES** | The program's calendar | — | Rows: "Welcome emails go out" (start − 5 days), "Pre-work opens" (start − 3), **Day 1** (start; highlighted), "Practice lab" (start + 40% of the program's length), "Reflection and action plan" (start + 75%), "Certificates and debrief" (end + 1). Each shows the date and "in N days" / "today" / "N days ago", or "Done" (faded, grey check) once past. A **TODAY** marker sits above the first future row when some rows are past | **[Requires Confirmation]** the offsets are demo assumptions (OQ-PRJ-001) | — |
| **SETUP BY CHAPTER** | Progress per chapter | Click a row | One row per chapter except After delivery: icon, name, a dot per step (done = blue, overdue = red, due = amber, locked = faint, not started = hollow) and "done/total" (green when complete). Hover: the first due item's "<step> · <note>", or "Unlocks later" | — | Chapter opens on its first open step |

### 5.10 Program workspace: chapter tabs

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Steps panel | The chapter's steps | Click a step | Progress ring around the chapter icon, chapter name, "N of M done", then numbered steps: done = green check, locked = lock, overdue = red, due = amber, open step highlighted. Each step shows "Done", "Not started" or its note (amber / red when due / overdue). Locked steps can still be opened | On medium screens and up the panel stays in view while scrolling | Step opens |
| Step header | Step and state | — | Step name and a state pill: "Done", "Not started", or the note ("Due 28 Nov", "3 days overdue", "Waiting for approval", "Unlocks after agreement approval"…). Some steps add a button at the right (Add contact, Upload new version, Manage Content) | — | — |
| Step screen | Do the work | — | Built steps: 5.11–5.15. Other steps: "<Step> is on its way" / "This step’s setup screen hasn’t been built yet." **[Not Implemented]** | OQ-PRJ-005 | — |
| Back / Next | Move along | Click | Left: "← <previous step>" ("Back" on phones). Right: "<next step> →", or "Next: <chapter>" when the next step is in another chapter. Moves across chapters | — | — |
| Chapters and steps | The setup plan | — | **Foundation**: Program basics, Client contacts, Agreement and approval. **Learning journey**: Sessions and schedule, Content and kits, Assessments and check-ins. **People**: Facilitators, Participants. **Logistics**: Venue and room, Trainer travel and stay, Workbooks. **Communication**: Invites and reminders, Feedback and certificate. **Go live**: Readiness check. **After delivery**: Attendance and debrief | Step states: BR-PRJ-016 to BR-PRJ-018 | — |

### 5.11 Foundation › Program basics

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **From the CRM** panel | What was sold | Read | "OPP-<id>" and a green "Verified" tag. "<Client> bought <N seats> of <program>, delivered by <sub-entity> and sold by <business developer>." and "Part of <project> · <program type>" | Read only | — |
| **Check for changes** | Refresh from the CRM | Click | Spins for about a second, then success toast "Up to date with the CRM" / "Nothing has changed on OPP-<id>." | **[Requires Confirmation]** simulated; nothing is fetched (OQ-PRJ-009) | — |
| **Yours to set** panel | Local choices | Edit | **Batch name** (text, 40 max; red edge when empty); **Program dates** (read only, "3 Dec – 24 Dec 2026"); **Client signs off the learning journey** (Yes / No; help "Sent to <main contact> before launch; we track the reply", or "Sent to the client’s contact before launch" when there is no contact); **Learner access after the program** (3 months, 6 months, 12 months) | — | — |
| Save bar | Save or undo | Click | Appears when anything changed: "You have unsaved changes" with **Discard** and **Save** (disabled while Batch name is empty). Save shows toast "Program basics saved" / "<program> · <batch name>" | **[Requires Confirmation]** saved on this screen only: the hero, drawer and list keep the old batch name and the values reset when the step is reopened (BR-PRJ-021, OQ-PRJ-004) | — |

### 5.12 Foundation › Client contacts

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Contacts table | People at the client for this program | Read | **Contact** (avatar, name, a "Main contact" tag, email), **Mobile** ("+91 98765 43210", from large width), **Role** ("<designation> · <department>" or "—", from medium width), edit pencil. No paging; cards on phones | The step is done once there is at least one contact | — |
| **Add contact** | Add a person | Click (header button) | Opens "Add contact" / "Someone at the client you’ll work with on this program." | — | — |
| Edit (pencil) | Change a person | Click | Opens "Edit contact" with the contact's name as description | — | — |
| Contact form | Capture | Fill in, **Add contact** / **Save changes**, **Cancel** | Fields in 7.6. Errors appear after the first save attempt. A click on the backdrop does not close it; Cancel closes without asking | BR-PRJ-022 | Toast "Contact added" / "Contact updated" with the name. Failure: "Couldn’t save the contact" |
| Empty | No contacts | — | "No contacts yet" / "Add who you’ll work with at the client." with **Add contact** | — | — |

### 5.13 Foundation › Agreement and approval

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Purchase order** panel | The client's PO | View / upload | PO number and version ("PO-BYL004-3664 · v1"). With a file: file name, "<size> KB · Valid 2 Nov – 3 Jan 2027" and **View** (file preview). Without: "No PO uploaded yet" and **Upload PDF** | Only PDF files are accepted (BR-PRJ-023) | — |
| **Upload new version** | Replace the PO | Click (header button) | Shown when a file exists and the agreement is not fully approved | — | — |
| Upload | Send for approval | Choose a PDF | Version goes up by one, both approvals return to Waiting and any sent-back comment is cleared; toast "Sent for approval" / "Finance and Audit will review it." A non-PDF gives error toast "Upload a PDF" with the file name; a failed upload "Couldn’t upload it" | BR-PRJ-023 | Step shows "Waiting for approval" |
| **Approvals** panel | Who approves | Read | Two rows: Neeraj Gupta (Finance) and Kavita Rao (Audit), each with "<role> · <date>" and a tag "Approved", "Waiting" or "Sent back". A sent-back row shows the comment underneath (for example "The PO is valid till 28 Dec, but the last session is on 3 Jan. Upload an extended PO or a validity extension letter.") | No approve or send-back action exists in the application (OQ-PRJ-011) | — |
| **What it locks** panel | What approval fixes | Read | Client · Program · Seats · Journey steps · Dates · Business developer | — | — |

### 5.14 Learning journey › Sessions and schedule

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Module panels | The journey by phase | Read | One panel per **enabled module of Settings › Modules** (demo: Pre, During, Post) with its step count, or "No steps yet" | OQ-PRJ-015 | — |
| **Add step** | Add to a module | Click, choose a type | Menu: Self-learning module, Virtual session, In-person session, Assessment, 360 feedback. Opens the step form for that module | — | — |
| Step rows | The journey's steps | Click | Sorted by date, then time: date and weekday; name; type line ("Self-learning · 1h", "In-person session · 9:30 am · 6h", "Virtual session · 10:00 am · 2h · Google Meet", "Assessment · 30 min", "360 feedback · Open 7 days"); the first open issue in amber — "Venue pending", "Needs a start time", "Needs a link" — with "+N" for more (from small screens up) | — | Opens Edit step |
| Step form | Add / edit a step | Fill in | Title "Add <type>" (for example "Add virtual session") or "Edit step", type as description. Fields in 7.7. Footer: **Remove** (red, Edit only, no confirmation), **Cancel**, **Add step** / **Save changes**. A click on the backdrop does not close it | BR-PRJ-024, BR-PRJ-025 | Toasts "Step added", "Step updated", "Step removed" with the name; failures "Couldn’t save the step" / "Couldn’t remove the step" |
| **Where** (in-person) | Venue | Click | Link "Set on the Venue step" (or "Venue is set") closes the form and opens Logistics › Venue and room, which is a placeholder | OQ-PRJ-005 | — |

### 5.15 Learning journey › Content and kits

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Manage Content** | Go to the content library | Click (header button) | Opens the program's page in Manage Content, or the Manage Content list when the program has no content entry | — | — |
| Learning steps list | Steps that carry material | Click a row | Self-learning, virtual and in-person steps in date order: type tile, name, "<module> · <date>", "N material(s)" or amber "No material", and for live sessions "N e-kit" or amber "No e-kit" (from small screens up) | Empty: "No learning steps yet" / "Add self-learning modules or sessions in Sessions and schedule first." | Opens the content form |
| Content form | Pick materials | Toggle, **Save** | Title "Content and kits", description "<step> · <type> · <module>". Line "From <content program> in Manage Content" with **Open in Manage Content**. One card per element of the matching Manage Content stage (Pre → pre, During → during, Post → post): name, description, file counts ("2 docs", "1 video", "1 link"), a **Files** toggle that lists the files (documents and videos preview; links open in a new tab), and switches **Give to participants** and, for live sessions, **Add to trainer e-kit**. Chosen cards are tinted. Footer "N element(s) for participants · N in the trainer e-kit", **Cancel**, **Save** | BR-PRJ-026 | Toast "Content saved" / "<step>"; failure "Couldn’t save the content" |
| Nothing to pick | Empty stage | — | "Nothing in <module> yet" / "Add elements to the program in Manage Content, then pick them here." | Also shown when the program has no Manage Content entry or the module is not Pre, During or Post | — |

## 6. User Workflow

### 6.1 Find the projects that need action

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open **Projects** | List loads, newest update first | Signed in | All projects |
| 2 | Click **Need action** | Only projects with a program starting within 14 days and not fully set up | BR-PRJ-003 | Amber dots visible |
| 3 | Click a row | Drawer opens; the program shows "Starts in N days · N/4 ready" | — | — |
| 4 | Click the program | Program workspace opens on Overview | — | UP NEXT shows the next step |

### 6.2 Create a project from a CRM opportunity

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Add project** | Wizard opens on Opportunity | — | — |
| 2 | Choose **Yes, I have one**, type "3664", click **Fetch** | About a second later the opportunity card shows Maruti Suzuki India Ltd · Customer Service Excellence · Standard Program · Crucial Learning · 36 people | 4 digits, not ending in 0 | Steps 2 and 4 pre-filled |
| 3 | **Continue** | Project step with the CRM banner and the pre-filled name and type | Name 3+ characters | — |
| 4 | **Continue**, choose **Start empty**, **Continue** | Dates and name with the first day pre-filled | — | — |
| 5 | Type "Cohort A", click **Create project** | Project saved; the list opens with its drawer; toast "Project created" / "<name> · PRJ-…" | All steps valid | New project at the top, In setup |

### 6.3 Create a project from scratch

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Choose **No, start from scratch** | Client, Program and Delivered by appear | — | — |
| 2 | Click **Continue** with nothing chosen | "Choose the client", "Choose the program", "Choose who delivers it" | BR-PRJ-010 | Focus on the first invalid control |
| 3 | Choose all three, **Continue** | Project step: "It groups the programs you run for <client>." | — | — |
| 4 | Type "AB", **Continue** | "Give the project a name (3+ characters)" | — | — |
| 5 | Fix the name, choose a start option, pick the first day, name the batch, **Create project** | As 6.2 step 5 | — | — |

### 6.4 Set up a program

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | In the workspace click **Continue setup** | Opens the next open step | — | — |
| 2 | Foundation › Client contacts: **Add contact**, fill in, save | Toast "Contact added"; step Done | 7.6 | Contact listed; first contact is the main contact |
| 3 | Agreement and approval: upload a PDF | Toast "Sent for approval"; approvals Waiting; step "Waiting for approval" | PDF only | — |
| 4 | Learning journey › Sessions and schedule: **Add step › Virtual session**, set time and **Create link**, **Add step** | Toast "Step added"; row without issues | 7.7 | — |
| 5 | Content and kits: open the session, switch on elements, **Save** | Toast "Content saved"; row shows materials and e-kit | — | — |

### 6.5 Archive a project

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Row "…" › **Archive** | "Archive this project?" with the name, code and program count | — | — |
| 2 | Click **Archive** | Row removed; toast "Project archived" | — | The project and its programs leave the list and search (OQ-PRJ-007) |

## 7. Forms and Field-Level Specifications

### 7.1 Projects list search and filters

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search project, client, program or OPP… | Search text | Filter the list | Optional | N/A | Requires Confirmation | Any text; case-insensitive contains | Empty (or the code from a project link) | None | — | N/A |
| Summary pill | Single-choice pills | Quick filter | Optional | N/A | N/A | All projects, Live, Need action | All projects | None | Reset to All by a project link | N/A |
| Status (drawer) | Toggle chips | Project status | Optional | N/A | N/A | In setup, Live, Completed | None | None | — | N/A |
| Runs (drawer) | Single-choice chips + date range | Run dates | Optional | N/A | N/A | Any time, Next 30 days, This month, Last 90 days, Custom (From – To) | Any time | None | Custom shows the range picker | N/A |
| Client / Owner (drawer) | Searchable multi-select | Client / owner | Optional | N/A | N/A | Clients with projects; owners | None | None | — | N/A |
| Program type / Delivered by (drawer) | Toggle chips | Program filters | Optional | N/A | N/A | 4 program types; delivery organisations | None | None | Any program matching counts | N/A |

### 7.2 Add project › Opportunity

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Do you have an opportunity ID? | Radio tiles | Choose the route | Required | N/A | N/A | Yes, I have one / No, start from scratch | None | One must be chosen | Shows the ID box or the from-scratch fields | "Choose one to continue" |
| Opportunity ID | Text (numeric keypad) + **Fetch** | CRM look-up | Required when "Yes" | 4 digits | 4 digits | Digits are taken from what is typed ("OPP-3664" and "3664" both work) | Empty | Exactly 4 digits; must exist in the CRM; must be fetched before Continue | Typing clears the look-up error | "An opportunity ID has 4 digits, e.g. OPP-3664." / "OPP-<id> isn’t in the CRM portal. Check the number, or start from scratch." / "Fetch the opportunity first — or start from scratch" |
| Client | Searchable select | The client | Required when "No" | N/A | N/A | Active clients, A–Z, with codes | None | Must be chosen | Changing it clears the batch to copy | "Choose the client" |
| Program | Searchable select | The program | Required when "No" | N/A | N/A | Program catalogue (10 programs, each with its type) | None | Must be chosen | Sets the program type | "Choose the program" |
| Delivered by | Single-choice chips | Delivery organisation | Required when "No" | N/A | N/A | Blanchard, Crucial Learning, BYLD Learning | None | One must be chosen | Sets the legal entity | "Choose who delivers it" |

### 7.3 Add project › Project

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Project name | Text | Name of the project | Required | 3 characters (after trimming) | 80 characters (typing stops) | Any text; trimmed on save | Empty; CRM: the opportunity's project name | At least 3 characters | Placeholder "e.g. 2027 Manager Development" | "Give the project a name (3+ characters)" |
| Project type | Select | Type of project | Required | N/A | N/A | Standard Program, Coaching, ICF Program, Assessment Center | Standard Program; CRM: the program's type | Always has a value | Helper "Coaching, ICF and Assessment Center setups are coming soon." | N/A |

### 7.4 Add project › How to start

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| How do you want to start? | Radio tiles | Copy or start empty | Required | N/A | N/A | Copy an earlier program / Start empty | None (cleared by a new CRM fetch) | One must be chosen | Copy disabled when the client has no earlier batches | "Choose how you want to start" |
| Copy which program? | Radio rows | Batch to copy | Required when copying | N/A | 6 options | Programs of this client that have started, newest first | None | One must be chosen | — | "Choose the batch to copy" |

### 7.5 Add project › Dates and name

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| First day | Date picker | Program start | Required | Today | Requires Confirmation | A date | None; CRM: the opportunity's start | Must be picked; past dates cannot be chosen | Placeholder "Pick a date"; clearable | "Pick the first day" |
| Batch name | Text | Cohort name | Required | 1 non-space character | 40 characters (typing stops) | Any text; trimmed on save | Empty | Must not be empty | Placeholder "e.g. Cohort B" | "Name the batch" |

### 7.6 Add / Edit contact

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Name | Text | Contact's name | Required | 1 non-space character | 60 characters | Letters, spaces, full stop, apostrophe and hyphen; other characters are removed as typed; trimmed on save | Empty | Must not be empty | Placeholder "Full name" | "Enter their name" |
| Email | Email | Contact's email | Required | N/A | Requires Confirmation | name@domain.tld | Empty | Valid email; not checked for duplicates | Placeholder "name@company.com" | "Enter their email" / "Enter a valid email address" |
| Mobile number | Phone, "+91" prefix | Contact's mobile | Required | 10 digits | 10 digits (typing stops) | Digits only | Empty | Exactly 10 digits | Placeholder "98765 43210" | "Enter their mobile number" / "A mobile number has 10 digits" |
| Department | Searchable select, clearable | Team | Optional | N/A | N/A | Department list used by client SPOCs | None | None | "Select department" / "Search departments…" | N/A |
| Designation | Searchable select, clearable | Job title | Optional | N/A | N/A | Designation list used by client SPOCs | None | None | "Select designation" / "Search designations…" | N/A |
| Main contact | Checkbox | Make this the main contact | Optional | N/A | N/A | On / off | Off | One main contact per program (BR-PRJ-022) | Disabled when editing the current main contact | N/A |

### 7.7 Add / Edit journey step

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Name | Text (Assessment: select) | Step name | Required | 1 non-space character | 60 characters | Any text; Assessment: Behavioural assessment, Pre-program knowledge check, Leadership style survey, Post-program knowledge check | "New <type>" (for example "New virtual session"); Assessment: Behavioural assessment | Must not be empty | — | "Give the step a name" |
| Module | Select | Phase | Optional (always set) | N/A | N/A | Enabled modules from Settings › Modules | The panel's module | None | Changing it moves the date into the module's range | N/A |
| Date / Opens on | Date picker (not clearable) | When it happens or opens | Required | Pre: none; During: program start; Post: day after the end | Pre: day before the start; During: program end; Post: none | A date in the module's range (BR-PRJ-024) | Pre: start − 3; During: start; Post: end + 1 | Must be set | Label "Opens on" for Assessment and 360 feedback | "Pick a date" |
| Start time | Time picker | Session start | Optional | 07:00 | 21:00 | 15-minute steps | Empty ("Select time") | None | Virtual and in-person only; empty shows "Needs a start time" | N/A |
| Length / Time limit | Select | Duration | Optional | 15 min | 8h | 15 min, 30 min, 45 min, 1h, 1h 30m, 2h, 3h, 4h, 6h, 8h | Self-learning 1h, Virtual 2h, In-person 6h, Assessment 30 min | None | "Time limit" for Assessment; not shown for 360 feedback | N/A |
| Stays open for | Select | Feedback window | Optional | 3 days | 14 days | 3, 5, 7, 10, 14 days | 7 days | None | 360 feedback only | N/A |
| Platform | Select | Meeting tool | Optional | N/A | N/A | Zoom, Microsoft Teams, Google Meet | Zoom | None | Virtual only | N/A |
| Meeting link | Text + **Create link** | Joining link | Optional | N/A | Requires Confirmation | Any text; **Create link** fills a "https://meet.learnnext.in/…" link | Empty | No format check (OQ-PRJ-012) | Virtual only; empty shows "Needs a link" | N/A |
| Pass score (%) | Number | Assessment pass mark | Optional | 0 | 100 | Whole numbers; values outside 0–100 are pulled back into range | 70 | None | Assessment only | N/A |
| Attempts allowed | Select | Assessment attempts | Optional | 1 | 5 | 1–5 | 2 | None | Assessment only | N/A |
| Assessment switches | Switches | Assessment options | Optional | N/A | N/A | "Participants can download their report", "Shuffle questions and answers", "Show the score when finished" | All on | None | Assessment only | N/A |

### 7.8 Program basics (Yours to set)

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Batch name | Text | Cohort name | Required | 1 non-space character | 40 characters | Any text | The program's cohort | Save disabled while empty | Red edge while empty | None (no text) |
| Client signs off the learning journey | Yes / No | Sign-off needed | Optional | N/A | N/A | Yes, No | Demo value | None | — | N/A |
| Learner access after the program | Select | Access period | Optional | N/A | N/A | 3 months, 6 months, 12 months | Demo value | None | — | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-PRJ-001 | Program status from dates | A program is upcoming before its start date, running from its start to its end date, and delivered after its end date (by calendar day) | Everywhere | Recomputed on each load | — | "In setup" / "Running" / "Delivered" |
| BR-PRJ-002 | Project status from dates | A project is In setup before its earliest program start, Live from then until its latest program end, and Completed after it | List, drawer, filters | — | — | "In setup" / "Live" / "Completed" |
| BR-PRJ-003 | Need action | A program needs action when it is upcoming, starts within 14 days (inclusive) and fewer than 4 of its setup items are done; a project needs action when any of its programs does | List pill, dots, drawer | Amber pill count, pulsing amber dot, amber drawer pill | — | "A program starts within 14 days and isn’t set up yet" |
| BR-PRJ-004 | Program set-up % | Done setup items ÷ 4, rounded (Facilitator assigned, Content mapped, Participants enrolled, Venue / joining link) | List, drawer | "N/4 ready", "N% set up" | — | — |
| BR-PRJ-005 | Project progress | In setup: rounded average of its programs' set-up %. Live: day ÷ total days × 100, where total = days from first start to last end inclusive and day = days since the start + 1 (kept between 1 and total). Completed: 100 | Progress column, drawer | — | — | "Starts in N days · N% set up" / "Day D of T · ends <date>" / "Completed · <date>" |
| BR-PRJ-006 | Pill counts are totals | Pill counts ignore search and filters; the drawer's live count follows the pill and search | List | — | — | — |
| BR-PRJ-007 | Runs overlap | A project matches a date range when it starts on or before the range's last day and ends on or after its first day | Filters | — | — | — |
| BR-PRJ-008 | Archive | Archiving removes the project and its programs from the list, the drawer and the search palette; there is no undo or archived view | Archive | Confirmation first | — | "Project archived" (OQ-PRJ-007) |
| BR-PRJ-009 | Project codes | Each project has a unique code "PRJ-" + 4 digits, assigned on creation; programs carry the CRM opportunity as "OPP-" + number | Create | — | — | — |
| BR-PRJ-010 | Wizard validation timing | A step's errors show only after **Continue** is pressed on it, then update live; **Create project** re-checks every step | Add project | Focus on the first invalid control | — | Field errors (7.2–7.5) |
| BR-PRJ-011 | Opportunity ID | An opportunity ID is 4 digits; the look-up must succeed before continuing. Demo: IDs ending in 0 are not found | Add project step 1 | — | 3 or 5 digits; ending in 0 | "An opportunity ID has 4 digits, e.g. OPP-3664." / "OPP-<id> isn’t in the CRM portal. …" |
| BR-PRJ-012 | CRM pre-fill | A fetched opportunity fills client, project name, project type, program, program type, delivered by (and its entity), first day and expected participants, and clears any copy choice. All filled values can still be edited | Add project | CRM marks and banners | — | — |
| BR-PRJ-013 | Earlier batches | "Copy an earlier program" offers up to 6 programs of the same client that have already started, newest first; it is disabled when there are none | Add project step 3 | — | — | "No earlier batches yet" |
| BR-PRJ-014 | Copying a batch [Requires Confirmation] | The helper promises that sessions, content, assessments, facilitator and venue are copied; the created program records the choice but starts with nothing set up | Create | — | — | OQ-PRJ-003 |
| BR-PRJ-015 | New project | Creating makes a project owned and created by the signed-in user with one program: the chosen program, type and delivery, the first day as start, an end 13 days later, the batch name, 0 participants, no facilitator and no setup items done. It goes to the top of the list | Create | Opens the list on the new project | Client no longer on file | "Couldn’t create the project" / "That client isn’t on file any more." |
| BR-PRJ-016 | Step states | A setup step is Done, Not started, Due (its due date is within 3 days: "Due today", "Due tomorrow", "Due <date>"), Overdue (past its due date: "N day(s) overdue") or Locked | Workspace | — | — | Step notes |
| BR-PRJ-017 | Due dates [Requires Confirmation] | Each step's due date is a fixed number of days before the program start (Program basics −30, Client contacts −28, Agreement and approval −21, Sessions and schedule −21, Facilitators −21, Content and kits −14, Venue and room −14, Assessments and check-ins −10, Participants −10, Trainer travel and stay −10, Workbooks −7, Invites and reminders −7, Feedback and certificate −3, Readiness check −1) or, for Attendance and debrief, 3 days after the end | Workspace | — | — | OQ-PRJ-001 |
| BR-PRJ-018 | Special step states | Once a program is running or delivered, every setup step counts as Done. Agreement: Done when both approvals are Approved; "Sent back by <role>" (overdue) when sent back; "Waiting for approval" (due) when a PO is uploaded; otherwise "PO not uploaded". Logistics steps are Locked ("Unlocks after agreement approval") until the agreement is approved. Attendance and debrief is Locked ("Opens after launch") until the program starts and Done more than 7 days after its due date. Readiness check is never Done before launch ("<N> items left"). Client contacts is Done when there is at least one contact | Workspace | — | — | — |
| BR-PRJ-019 | Workspace address | The tab and step are kept in the address; an unknown tab opens Overview, an unknown or missing step opens the chapter's first step that is not Done or Locked (else its first step) | Workspace | — | Unknown program | "Program not found" |
| BR-PRJ-020 | Setup done % | Done steps ÷ the 13 steps of Foundation, Learning journey, People, Logistics and Communication, rounded. It is separate from the list's set-up % (BR-PRJ-004) | Overview | — | — | "<N>% Setup done" (OQ-PRJ-010) |
| BR-PRJ-021 | Program basics are local [Requires Confirmation] | Saving Program basics shows a toast but does not change the program anywhere else | Program basics | — | — | OQ-PRJ-004 |
| BR-PRJ-022 | One main contact | The first contact, or one saved with **Main contact** ticked, becomes the program's only main contact; the current main contact cannot be unticked | Client contacts | — | — | "Main contact" tag |
| BR-PRJ-023 | PO upload | Only PDF files are accepted; each upload is a new version and restarts both approvals | Agreement and approval | — | Non-PDF | "Upload a PDF" |
| BR-PRJ-024 | Step dates follow the module | Pre steps happen before the start; During steps between the start and end; Post steps after the end (other module names: no limit). Changing the module moves the date into range | Step form | Dates outside the range cannot be picked | — | — |
| BR-PRJ-025 | Journey step issues | In-person steps without a venue show "Venue pending"; live sessions without a start time "Needs a start time"; virtual sessions without a link "Needs a link" | Sessions and schedule | First issue + "+N" | — | — |
| BR-PRJ-026 | Content per step | A step's materials come from the matching Manage Content stage of the same-named program; the trainer e-kit applies to live sessions only | Content and kits | — | — | — |
| BR-PRJ-027 | Placeholders [Not Implemented] | "Add a program" shows a coming-soon toast; ten steps show "<Step> is on its way" | Drawer, row menu, chapters | — | — | "Adding a program is coming soon" / "This step’s setup screen hasn’t been built yet." |
| BR-PRJ-028 | Session data | Data follows SH-001; workspace data is generated the first time a program is opened, relative to today | Always | — | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Add a program (menu / drawer) | Always | Info toast | "Adding a program is coming soon" / "This part of Projects isn’t built yet." | On click | — |
| Copy link | Copied / failed | Success / error toast | "Link copied" / "<project> · <code>"; "Couldn’t copy the link" / <link> | On click | Paste the link |
| Archive | Done / failed | Success / error toast | "Project archived" / "<project>"; "Couldn’t archive it" / <reason> | After confirming | — |
| Create project | Done / failed | Success / error toast | "Project created" / "<project> · <code>" (shown after the list opens); "Couldn’t create the project" / <reason> | After Create | Review the drawer |
| Check for changes | Always | Success toast | "Up to date with the CRM" / "Nothing has changed on OPP-<id>." | After about a second | — |
| Program basics | Saved | Success toast | "Program basics saved" / "<program> · <batch name>" | On Save | — |
| Contacts | Added / updated / failed | Success / error toast | "Contact added" / "Contact updated" with the name; "Couldn’t save the contact" | On save | — |
| PO upload | Uploaded / wrong type / failed | Success / error toast | "Sent for approval" / "Finance and Audit will review it."; "Upload a PDF" / <file name>; "Couldn’t upload it" | On choosing a file | Wait for approval |
| Journey steps | Added / updated / removed / failed | Success / error toast | "Step added", "Step updated", "Step removed" with the name; "Couldn’t save the step", "Couldn’t remove the step" | On save / remove | — |
| Content | Saved / failed | Success / error toast | "Content saved" / "<step>"; "Couldn’t save the content" | On Save | — |
| Unsaved Program basics | Something changed | Inline bar | "You have unsaved changes" | While changed | Save or Discard |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Projects search | Find | Contains, case-insensitive | Project name and code, client name and code, owner, program names, OPP numbers, delivered by, facilitator | "No projects match" / "Try a different search or another status." + **Clear search & filters** |
| Summary pills | Quick filter | Single choice | All projects, Live, Need action | — |
| Filter drawer | Combine | Draft; "Show N projects" | Status, Runs, Client, Owner, Program type, Delivered by | "No matching projects" (disabled) |
| Columns | — | Project, Programs (by count), Progress (by %), Status, Owner, Last updated — all sortable; actions column | Default: Last updated, newest first | No projects at all: "No projects yet" / "Projects you set up for your clients will appear here." |
| Pagination | — | SH-008 | 10 / 20 / 50 rows / All rows; default 10 | — |
| Drawer programs | Timeline | Date order | — | — |
| Copy which program? | Choose a batch | Newest start first | Up to 6 | Tile disabled: "No earlier batches yet" |
| Contacts table | — | Not sortable, not paged | — | "No contacts yet" |
| Journey steps | — | Per module, by date then time | — | "No steps yet" |
| Content and kits steps | — | By date | Self-learning, virtual, in-person | "No learning steps yet" |
| Search palette | Find projects anywhere | Result "<project>" with "<code> · <client> · <status>"; opens the project link | Name, code, client, program names | See PRD-SHELL |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| No projects | List empty | Empty state | "No projects yet" / "Projects you set up for your clients will appear here." | **Add project** in the toolbar |
| No matches | Search / pill / filters exclude all | Empty state | "No projects match" / "Try a different search or another status." | **Clear search & filters** |
| Load failure | List cannot load | Error state with **Try again** (SH-007) | Error text | Retry |
| Project link with an unknown code | Archived or mistyped code | The list shows the search with no matches and no drawer | "No projects match" | Clear the search |
| Program not found | Archived project, wrong address | Card with button | "Program not found" / "It may have been removed, or the link is out of date." | **All projects** |
| Workspace load failure | — | Error card | "Couldn’t load this program" + error + **Try again** | Retry |
| First day = today | Created with today's date | The new program is immediately "Running" and the project "Live", not In setup | — | — (OQ-PRJ-013) |
| New project starting within 14 days | Created with a near first day | It counts under **Need action** straight away (0/4 ready) | — | Set it up |
| Gap between programs | Project's first program delivered, next not started | Project status stays **Live** although nothing is running | — | — |
| Wizard note vs result | After **Create project** | The list and drawer open, not the program; Logistics steps are locked until the agreement is approved, although the note says "nothing is locked" | "After you create it, the program opens with every setup step listed — nothing is locked." | OQ-PRJ-013 |
| Key dates vs journey | Reflection and action plan | The key-date row is at start + 75%, while the journey step of the same name is the day after the end | — | OQ-PRJ-001 |
| Program basics after save | Step reopened or another page | The saved batch name and choices are not kept; the hero, drawer and list show the original batch name | — | OQ-PRJ-004 |
| Workspace actions and the list | Contacts, PO, steps or content changed | The list's set-up %, Need action and Last updated do not change | — | OQ-PRJ-010 |
| Steps without a screen | Opening a placeholder step (also via "Set on the Venue step") | Placeholder message | "<Step> is on its way" / "This step’s setup screen hasn’t been built yet." | — |
| Program with no Manage Content entry | Program name not in Manage Content | Content form has no "From …" line; nothing to pick; Manage Content button opens the list | "Nothing in <module> yet" | Add the program in Manage Content |
| Modules switched off | A module disabled in Settings › Modules | Its panel disappears from Sessions and schedule; steps already in it no longer show | — | OQ-PRJ-015 |
| Copy fails | Clipboard blocked | Error toast with the link | "Couldn’t copy the link" | Copy the link from the toast |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Client details ([client-detail-prd.md](client-detail-prd.md)) | The client's Projects section shows the same starting projects; **Open client** opens the client | Create / archive a project | Not reflected on the client page, its counts or the SPOC access matrix | OQ-PRJ-002, OQ-CLD-004 |
| All Clients ([clients-prd.md](clients-prd.md)) | Add project offers active clients only | Add project | Inactive clients are not offered | BR-PRJ-015 |
| Manage Content ([manage-content-prd.md](manage-content-prd.md)) | Content and kits picks elements from the program of the same name; **Manage Content** / **Open in Manage Content** open it | Pick content | Choices are stored on the journey step | BR-PRJ-026 |
| Settings › Modules ([settings-program-content-masters-prd.md](settings-program-content-masters-prd.md)) | The journey's module panels are the enabled Modules master entries (Pre, During, Post) | Enable / disable a module | Panels follow the master. PRD-PRG and PRD-CNT describe the Modules master as not used by any page | OQ-PRJ-015, OQ-PRG-001, OQ-CNT-008 |
| Sub-entity / Entity masters ([settings-finance-masters-prd.md](settings-finance-masters-prd.md)) | "Delivered by" offers three sub-entities (Blanchard, Crucial Learning, BYLD Learning) with their legal entities | Add project | The list of three is fixed; other sub-entities are not offered | OQ-PRJ-012 |
| Industry & job masters ([settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md)) | Contact Department and Designation use the client SPOC lists | Contact form | — | — |
| Facilitators ([facilitators-prd.md](facilitators-prd.md)) | Program facilitators are active facilitators; searchable by name | — | Assigning a facilitator is not built (People › Facilitators) | OQ-PRJ-005 |
| Dashboard ([dashboard-prd.md](dashboard-prd.md)) | **Review queue** on To approve opens the Projects list | Click | Opens unfiltered | OQ-DASH-004 |
| App shell ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)) | Sidebar item, breadcrumbs, leave guard, search palette (projects and "Add project") | — | — | SH-009 |
| CRM portal [Requires Confirmation] | Opportunity look-up and Check for changes | Fetch / check | Simulated in the demo | OQ-PRJ-009 |

## 13. Acceptance Criteria

**AC-PRJ-001: Projects list**
- Given a signed-in Training Partner user
- When they open Projects
- Then the pills All projects, Live and Need action show totals
- And the table lists Project, Programs, Progress, Status, Owner and Last updated, newest update first

**AC-PRJ-002: Need action pill**
- Given at least one project has a program starting within 14 days with fewer than 4 setup items done
- When the user clicks **Need action**
- Then only such projects are listed and each shows a pulsing amber dot with "Starts in N days · only N% set up" on hover

**AC-PRJ-003: Search by opportunity**
- Given a project has a program with OPP-3664
- When the user types "opp-3664"
- Then that project is listed and the result line reads "N of Total projects"

**AC-PRJ-004: Filter drawer draft (negative)**
- Given the Filter projects drawer is open
- When the user picks a combination matching nothing
- Then the button reads "No matching projects" and is disabled
- And closing the drawer leaves the list unchanged

**AC-PRJ-005: Project drawer**
- Given the list
- When the user clicks a row
- Then the drawer shows status, RUNS / RAN, owner, "Programs N" with a timeline, and "PRJ-… · Created <date> by <name>"
- And clicking a program opens its workspace

**AC-PRJ-006: Add a program is coming soon**
- Given the drawer or row menu
- When the user clicks **Add program** / **Add a program**
- Then the info toast "Adding a program is coming soon" appears and nothing changes

**AC-PRJ-007: Copy link**
- Given the row menu
- When the user chooses **Copy link** and later opens the copied address
- Then the list opens with the code in the search box and that project's drawer open

**AC-PRJ-008: Archive**
- Given the row menu
- When the user chooses **Archive** and confirms
- Then the project leaves the list and the toast "Project archived" appears

**AC-PRJ-009: Fetch an opportunity**
- Given Add project step 1 with **Yes, I have one**
- When the user enters "3664" and clicks **Fetch**
- Then after about a second the card shows Maruti Suzuki India Ltd, Customer Service Excellence, Crucial Learning and 36 people
- And steps 2 and 4 are pre-filled and marked "Pre-filled from CRM portal"

**AC-PRJ-010: Opportunity errors (negative)**
- Given **Yes, I have one**
- When the user fetches "123", then "3660", then empties the box and clicks **Continue** without a fetched opportunity
- Then "An opportunity ID has 4 digits, e.g. OPP-3664.", "OPP-3660 isn’t in the CRM portal. Check the number, or start from scratch." and "Fetch the opportunity first — or start from scratch" appear in turn
- And typing in the box clears a look-up error

**AC-PRJ-011: Wizard validation timing**
- Given step 1 with **No, start from scratch** and nothing chosen
- When the step opens, no errors are shown
- When the user clicks **Continue**
- Then "Choose the client", "Choose the program" and "Choose who delivers it" appear and update as values are chosen

**AC-PRJ-012: Project name (negative)**
- Given step 2
- When the name is "AB" and the user clicks **Continue**
- Then "Give the project a name (3+ characters)" appears

**AC-PRJ-013: Create project**
- Given all four steps are valid
- When the user clicks **Create project**
- Then the list opens with the new project at the top and its drawer open
- And the toast "Project created" / "<name> · PRJ-…" appears, with one program "Cohort …" of 14 days, 0/4 ready, owner "You"

**AC-PRJ-014: Leave guard**
- Given the user has entered data in Add project
- When they click **Cancel** or the "Projects" breadcrumb
- Then "Discard this project?" asks with **Keep editing** and **Discard**

**AC-PRJ-015: Workspace address**
- Given a program workspace
- When the user opens Learning journey › Sessions and schedule and reloads
- Then the same tab and step reopen

**AC-PRJ-016: Continue setup**
- Given a program with an overdue step
- When the user clicks **Continue setup**
- Then the overdue step opens (before any due or not-started step)

**AC-PRJ-017: Overview figures**
- Given an upcoming program
- Then Overview shows "<N>% Setup done", "Participants", "Journey steps" and "<N> Days to go"
- And clicking "Journey steps" opens Learning journey

**AC-PRJ-018: Locked logistics**
- Given an upcoming program whose agreement is not fully approved
- When the user opens Logistics
- Then each step shows a lock and "Unlocks after agreement approval"

**AC-PRJ-019: Add a contact**
- Given Foundation › Client contacts
- When the user adds a contact with a 9-digit mobile
- Then "A mobile number has 10 digits" appears after the save attempt
- And after fixing it, "Contact added" appears; the first contact of a program becomes the main contact

**AC-PRJ-020: Upload a PO**
- Given Agreement and approval
- When the user uploads a PDF
- Then the version goes up by one, both approvals read Waiting and the toast "Sent for approval" appears
- And uploading a .docx shows "Upload a PDF"

**AC-PRJ-021: Journey step dates**
- Given Add step in the Pre module
- When the user opens the date picker
- Then dates on or after the program start cannot be picked

**AC-PRJ-022: Content and kits**
- Given a virtual session with no material
- When the user switches on **Give to participants** and **Add to trainer e-kit** for one element and saves
- Then "Content saved" appears and the row shows "1 material" and "1 e-kit"

**AC-PRJ-023: Placeholder steps**
- Given any of People, Logistics, Communication, Go live, After delivery or Assessments and check-ins
- When the user opens a step
- Then "<Step> is on its way" / "This step’s setup screen hasn’t been built yet." is shown

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-PRJ-001 | AC-PRJ-001 | List loads | Signed in | — | Pills with counts; default sort Last updated newest first; 10 rows per page | P1 |
| TC-PRJ-002 | BR-PRJ-006 | Pill counts ignore search | — | Search "zzz" | Pill counts unchanged | P3 |
| TC-PRJ-003 | AC-PRJ-002 | Need action pill | — | Click Need action | Every row has an amber dot; hover text "Starts … · only N% set up" | P1 |
| TC-PRJ-004 | BR-PRJ-003 | Need action boundary | A program starting in exactly 14 days with 3/4 done | — | Counted as Need action; 15 days is not | P2 |
| TC-PRJ-005 | AC-PRJ-003 | Search fields | — | A client code, a facilitator name, "opp-" + a number | Matching projects | P2 |
| TC-PRJ-006 | 5.2 | Programs cell text | — | Projects in each status | "Next · <date>", "Running now", "All delivered" | P3 |
| TC-PRJ-007 | BR-PRJ-005 | Progress values | — | A Live project | Hover "Day D of T · ends <date>"; % = D ÷ T | P2 |
| TC-PRJ-008 | 5.2 | Owner shows You | Project owned by the signed-in user | — | "You" in Owner and drawer | P3 |
| TC-PRJ-009 | 5.3 | Status and Runs filters | — | Status Live; Runs Next 30 days | Chips "Status: Live", "Runs: Next 30 days"; overlap rule | P2 |
| TC-PRJ-010 | BR-PRJ-007 | Custom range | — | Custom with a range | Chip "Runs: <from> – <to>"; overlapping projects only | P3 |
| TC-PRJ-011 | 5.3 | Chip removal clears the section | Two clients chosen | Remove the "Client: … +1" chip | Both clients cleared | P3 |
| TC-PRJ-012 | AC-PRJ-004 | No matching projects | — | Impossible combination | Disabled "No matching projects" | P2 |
| TC-PRJ-013 | 5.3 | Drawer count follows pill and search | Pill Live, search text | Open Filters | "Show N projects" counts within Live + search | P3 |
| TC-PRJ-014 | 11 | No matches empty state | — | Search "zzzz" | "No projects match" + **Clear search & filters** restores the list | P2 |
| TC-PRJ-015 | AC-PRJ-005 | Drawer content | — | Click a completed project | Label "RAN"; programs "Delivered"; footer with code and creator | P2 |
| TC-PRJ-016 | 5.4 | Drawer pills | Projects with upcoming programs | — | "N/4 ready" grey; needs action "Starts in N days · N/4 ready" amber | P2 |
| TC-PRJ-017 | AC-PRJ-006 | Add program toast | — | Drawer and row menu | Info toast, nothing added | P3 |
| TC-PRJ-018 | 5.4 | Open client | — | Drawer **Open client** | Client details page | P3 |
| TC-PRJ-019 | AC-PRJ-007 | Copy link and open | — | Copy, paste in the address bar | Drawer opens; `q` removed from the address | P2 |
| TC-PRJ-020 | 11 | Unknown project link | — | /projects?q=PRJ-0000 | Search shows "PRJ-0000", no drawer | P3 |
| TC-PRJ-021 | AC-PRJ-008 | Archive | — | Archive a project with 2 programs | Dialog text "… and its 2 programs will leave the list."; row gone; toast | P1 |
| TC-PRJ-022 | BR-PRJ-008 | Archived project elsewhere | Archived project | ⌘K search its name; open an old workspace link | Not found in search; "Program not found" | P2 |
| TC-PRJ-023 | AC-PRJ-009 | Fetch 3664 | — | "OPP-3664" | Card as AC-PRJ-009; rail subtitle "Pre-filled from OPP-3664 — just review." | P1 |
| TC-PRJ-024 | AC-PRJ-010 | Opportunity errors | — | "123", "3660", then empty the box and Continue | Three messages | P1 |
| TC-PRJ-025 | 5.7 | Change opportunity | Fetched | Click **Change** | Empty ID box; pre-filled values cleared | P3 |
| TC-PRJ-026 | AC-PRJ-011 | Errors only after Continue | Step 1, "No" | Open, then Continue | No errors first; three errors after | P1 |
| TC-PRJ-027 | 7.2 | Program sets its type | "No" route | Program "Coaching Essentials for Managers" | Project type later defaults to Standard Program; program type ICF Program used for the program | P3 |
| TC-PRJ-028 | AC-PRJ-012 | Short name | Step 2 | "AB" | Error; "ABC" accepted | P2 |
| TC-PRJ-029 | BR-PRJ-013 | No earlier batches | Client with no started programs | Step 3 | Copy tile disabled, "No earlier batches yet" | P2 |
| TC-PRJ-030 | 7.4 | Copy requires a batch | Client with earlier batches | Choose Copy, Continue | "Choose the batch to copy" | P2 |
| TC-PRJ-031 | 5.7 | Changing client clears copy | Copy batch chosen, step 4 reached | Back to step 1, pick another client, open step 4 from the steps rail, Create project | Step 3 opens with "Choose the batch to copy" | P3 |
| TC-PRJ-032 | 7.5 | First day in the past | Step 4 | Try yesterday | Not selectable | P2 |
| TC-PRJ-033 | AC-PRJ-013 | Create | All valid | Create project | Toast after the list opens; drawer of the new project; end = start + 13 days | P1 |
| TC-PRJ-034 | 11 | First day today | — | Create with today | Program Running, project Live immediately | P3 |
| TC-PRJ-035 | AC-PRJ-014 | Leave guard | Data entered | Cancel → Keep editing; sidebar link → Discard | Stays; then leaves | P2 |
| TC-PRJ-036 | 5.6 | Cancel with no changes | Fresh wizard | Cancel | Back to Projects, no dialog | P3 |
| TC-PRJ-037 | 5.8 | Hero | Workspace | — | Cohort chip, type, client, project, status; Back to project reopens the drawer | P2 |
| TC-PRJ-038 | AC-PRJ-015 | Address keeps tab and step | — | Open a step, reload | Same step | P2 |
| TC-PRJ-039 | BR-PRJ-019 | Unknown tab / step | — | ?tab=xyz; ?tab=foundation&step=xyz | Overview; first open Foundation step | P3 |
| TC-PRJ-040 | AC-PRJ-016 | Continue setup order | Program with overdue and due steps | Continue setup | Overdue step opens | P2 |
| TC-PRJ-041 | 5.8 | Tab due dot | A chapter with a due step | Hover the dot | "Something here is due" | P3 |
| TC-PRJ-042 | AC-PRJ-017 | KPI links | Upcoming program | Click each figure | First chapter with open work, People, Learning journey, Go live | P2 |
| TC-PRJ-043 | BR-PRJ-020 | Setup done % | Program with known states | — | Done steps ÷ 13 | P2 |
| TC-PRJ-044 | 5.9 | Key dates and TODAY | Running program | — | Past rows faded with "Done"; TODAY marker above the first future row | P3 |
| TC-PRJ-045 | BR-PRJ-018 | Running program steps | Running program | Open chapters | All setup steps Done; Attendance and debrief by date | P2 |
| TC-PRJ-046 | AC-PRJ-018 | Locked logistics | Upcoming, agreement not approved | Open Logistics | Lock icons and "Unlocks after agreement approval" | P2 |
| TC-PRJ-047 | 5.11 | Program basics save bar | — | Change Learner access, Save | "Program basics saved"; reopening the step shows the original value (OQ-PRJ-004) | P2 |
| TC-PRJ-048 | 5.11 | Empty batch name | — | Clear Batch name | Red edge; Save disabled | P3 |
| TC-PRJ-049 | 5.11 | Check for changes | — | Click | Spinner, then "Up to date with the CRM" | P3 |
| TC-PRJ-050 | AC-PRJ-019 | Contact validation | — | Name "Ravi 2", email "x@y", mobile "98765" | Name keeps "Ravi "; email and mobile errors after Save | P2 |
| TC-PRJ-051 | BR-PRJ-022 | Main contact switch | Two contacts | Add a third with Main contact ticked | Only the new one shows "Main contact"; its checkbox is disabled when edited | P2 |
| TC-PRJ-052 | 5.12 | Contacts step state | Program with no contacts | Add one | Step becomes Done | P3 |
| TC-PRJ-053 | AC-PRJ-020 | PO upload | — | Upload a PDF; then a .docx | Version +1, approvals Waiting, "Sent for approval"; then "Upload a PDF" | P1 |
| TC-PRJ-054 | 5.13 | Sent back comment | Program with a sent-back agreement | Open the step | "Sent back" tag with the comment; step "Sent back by Audit" | P3 |
| TC-PRJ-055 | 5.14 | Add a virtual session | — | Add step › Virtual session; Create link | Link filled; row "Virtual session · <time> · 2h · Zoom" | P2 |
| TC-PRJ-056 | BR-PRJ-025 | Step issues | — | In-person without venue and time | "Venue pending +1" | P3 |
| TC-PRJ-057 | AC-PRJ-021 | Module date ranges | — | Pre, During, Post date pickers | Ranges per BR-PRJ-024; switching module moves the date | P2 |
| TC-PRJ-058 | 5.14 | Remove a step | Edit a step | Remove | "Step removed"; no confirmation | P3 |
| TC-PRJ-059 | 7.7 | Pass score bounds | Assessment form | 150; -5 | 100; 0 | P3 |
| TC-PRJ-060 | AC-PRJ-022 | Content and kits | — | As AC-PRJ-022 | "1 material", "1 e-kit" | P2 |
| TC-PRJ-061 | 5.15 | Self-learning has no e-kit | Self-learning step | Open content | Only "Give to participants" switches | P3 |
| TC-PRJ-062 | AC-PRJ-023 | Placeholder steps | — | Each of the 10 placeholder steps | "<Step> is on its way" | P2 |
| TC-PRJ-063 | 5.8 | Program not found | — | /projects/x/programs/y | "Program not found" + **All projects** | P3 |
| TC-PRJ-064 | 5.2 | Phone layout | 375 px | Projects | Pills visible (scrolling); cards; Progress, Owner, Last updated hidden | P3 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-PRJ-001 | Workspace – due dates and key dates | Step due dates (BR-PRJ-017), the "due within 3 days" window and the Overview key dates (welcome emails −5, pre-work −3, practice lab at 40%, reflection at 75%, certificates +1) are assumed offsets in the demo; the "Reflection and action plan" key date (start + 75%) differs from the journey step of the same name (day after the end) | Due and overdue flags, the tab dots and Continue setup all depend on them | Confirm the real offsets per step (and whether they vary by program type), and derive key dates from the journey | Open |
| OQ-PRJ-002 | Projects vs Client details | Projects created in Projects do not appear on the client's Projects tab, its Overview count or the SPOC access matrix; archived projects stay there | Two views of the same projects disagree | Confirm that both pages show one set of projects and how archive affects the client page | Open |
| OQ-PRJ-003 | Add project – Copy an earlier program | The helper says sessions, content, assessments, facilitator and venue come across, but the created program starts empty: nothing is copied | The promise is not kept | Confirm exactly what is copied (and from which program) and implement it, or change the wording | Open |
| OQ-PRJ-004 | Program basics | **Save** is local only: the batch name and choices are not stored, the hero / drawer / list keep the old batch name, and the values reset when the step is reopened; program dates cannot be changed anywhere | Users believe their changes are saved | Confirm what Program basics saves, where it shows, and who may change program dates | Open |
| OQ-PRJ-005 | Placeholder steps | People (Facilitators, Participants), Logistics (Venue and room, Trainer travel and stay, Workbooks), Communication (Invites and reminders, Feedback and certificate), Go live (Readiness check), After delivery (Attendance and debrief) and Learning journey › Assessments and check-ins show "<Step> is on its way" | Most of the setup cannot be done; Readiness check never completes | Provide requirements and priority for each step, including what marks each one done | Open |
| OQ-PRJ-006 | Add a program | "Add a program" (row menu) and "Add program" (drawer) show a coming-soon toast; a project can only ever have the program it was created with | Multi-batch projects cannot be built | Define adding, editing and removing programs within a project (cohort naming, dates, delivery) | Open |
| OQ-PRJ-007 | Archive | Archived projects disappear completely: no archived view, no restore, no rule on archiving live projects or projects with participants | Mistakes cannot be undone; history is lost | Define who may archive what, whether an archived list and restore exist, and what happens to the programs | Open |
| OQ-PRJ-008 | Project type | Coaching, ICF Program and Assessment Center can be chosen, but the helper says their setups are "coming soon"; the workspace is the same for every type; project type and program type can differ | Users may set up the wrong flow | Confirm how each type's setup differs and whether project type must match the program type | Open |
| OQ-PRJ-009 | CRM portal | The opportunity look-up and **Check for changes** are simulated (any 4 digits; IDs ending in 0 not found; the helper text "Demo: …" is shown to users); the opportunity format and what "won" means are not defined | A real CRM connection needs these rules | Define the opportunity ID format, which opportunities can be used (won, not already used), the fields brought in and how changes are synced | Open |
| OQ-PRJ-010 | Set-up measures | The list's set-up % (4 items) and Need action do not follow the workspace's 13 steps; work done in the workspace (contacts, PO, steps, content) does not change the list's figures or Last updated | The list can show "0/4 ready" for a program set up in the workspace | Define one readiness measure and which actions update Last updated | Open |
| OQ-PRJ-011 | Agreement approvals | Approvers are fixed (Neeraj Gupta, Finance; Kavita Rao, Audit); there is no approve / send back action in the application; PO file size, number and validity checks (for example validity against program dates) are not defined | The approval flow cannot complete in the application | Define approvers per entity, the approval actions and where they happen, and PO file rules | Open |
| OQ-PRJ-012 | Field rules | Contact mobile numbers are Indian only (+91); contact emails and names are not checked for duplicates; meeting links have no format check; "Delivered by" offers a fixed three sub-entities; the Remove step action and the contact / step forms close without confirmation | Data quality and accidental loss | Confirm international numbers, duplicate rules, link format, the source of delivery organisations, and confirmation rules | Open |
| OQ-PRJ-013 | Add project – wording and start date | The note "the program opens with every setup step listed — nothing is locked" does not match: the list opens (not the program) and Logistics steps are locked; "First day" says "When pre-work opens" but pre-work steps are scheduled before it; a first day of today makes the program Running at once | Misleading guidance | Confirm the wording, where Create should land, and whether the first day must be in the future | Open |
| OQ-PRJ-014 | Owner and access | The owner is always the creator and cannot be changed; the owner has no special rights; Roles & Access lists Export for Projects but there is no export | Accountability and permissions | Define ownership changes, owner rights and the export | Open |
| OQ-PRJ-015 | Modules source | Sessions and schedule uses the enabled entries of the Settings › Modules master, while Manage Content gives each program its own modules (BR-CNT-018) and PRD-PRG / PRD-CNT describe the master as unused; disabling a module hides its steps | The two module sources can disagree and content may not match | Decide which source the learning journey uses and what happens to steps in a disabled module | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and key actions: Complete
- [x] User roles and access: Complete (no role enforcement, SH-002)
- [x] Fields and forms: Complete for built steps
- [ ] Minimum and maximum constraints, where known: Incomplete (several limits exist in the forms only, see OQ-PRJ-012)
- [ ] Validation and business rules: Incomplete (due-date offsets and copy behaviour unconfirmed, see OQ-PRJ-001, OQ-PRJ-003)
- [x] Success, error and empty messages: Complete
- [x] Search, filters, tables and listings: Complete
- [ ] Cross-module data links: Incomplete (client page not updated, module source unclear, see OQ-PRJ-002, OQ-PRJ-015)
- [ ] Requirements for placeholder steps and Add a program: Incomplete (see OQ-PRJ-005, OQ-PRJ-006)
- [x] Acceptance criteria and QA scenarios: Complete
