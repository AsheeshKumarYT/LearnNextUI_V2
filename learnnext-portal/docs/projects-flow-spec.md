# Projects flow: rebuild spec

Source: the deployed site `https://learnnext-portal-tp.netlify.app` (Training Partner portal), surveyed 19 Nov 2026.
Method: I walked the UI live and read the deployed JS chunks (`Projects-*.js`, `AddProject-*.js`,
`ProgramWorkspace-*.js`, `FormWizard-*.js`, `api-*.js`). Every string in quotes below is copied
exactly from the site (curly apostrophes `’` and en dashes `–` included).

The site uses the same design system as this repo: `Card`, `Button`, `IconButton`, `DataTable`,
`ListToolbar`, `ClientStats` (stat pills), `FilterSection`, `Drawer`, `Modal`, `ConfirmDialog`,
`StatusBadge`, `Avatar`, `ClientLogo`, `ClientHero` tab strip, `Field`, `Input`, `Select`,
`Combobox`/`MultiCombobox`, `DatePicker`, `DateRangePicker`, `TimePicker`, `SegmentedTabs`,
`Switch`, `Checkbox`, `Badge`, `EmptyState`, `Skeleton`, `toast`. Reuse them and don't hand-roll
anything (see AGENTS.md and the "List page consistency" memory).

---

## 0. Routes and breadcrumbs

| Route | Screen | Header breadcrumb | Chunk |
|---|---|---|---|
| `/projects` | Project list + project drawer + filter drawer | `Projects` | `Projects` |
| `/projects?q=<PRJ-code>` | List, pre-searched; opens the drawer for that project | `Projects` | same |
| `/projects/new` | Add project wizard (4 steps) | `Projects › Add project` | `AddProject` |
| `/projects/:projectId/programs/:programId` | Program workspace, Overview tab | `Projects › Program` | `ProgramWorkspace` |
| `…/programs/:programId?tab=<chapterKey>` | Workspace, chapter tab (opens its first open step) | `Projects › Program` | same |
| `…/programs/:programId?tab=<chapterKey>&step=<stepKey>` | Workspace, given step | `Projects › Program` | same |

There's no separate project detail page. A project opens in a right-hand **drawer** on the list,
and each program opens a full **Program workspace** page.

ID formats: project `cl-4-pr3` (`<clientId>-pr<n>`), program `cl-4-pr3-g1` (`<projectId>-g<n>`),
project code `PRJ-3494`, opportunity `OPP-3664`.

`?q=` handling: on load, if `q` is present, the list resets the pill to `all`, clears filters,
puts `q` in the search box, opens the drawer for the project whose `code` matches `q`
(case-insensitive), then removes `q` from the URL (`replace: true`). "Copy link", "Back to
project" and the post-create redirect all use this.

Page title (`document.title`): `Projects · LearnNext`, `Add project · LearnNext`, `Program · LearnNext`.

---

## 1. Statuses, colours and computed values

### 1.1 Project stage (column "Status", filter "Status")
Derived from the dates of the project's programs: `upcoming → in-setup`, `in-progress → live`, `completed → completed`.

| stage | Label | StatusBadge tone | Dot classes (halo-dot pill) |
|---|---|---|---|
| `in-setup` | In setup | info | `bg-info ring-info/20` |
| `live` | Live | primary | `bg-chart-1 ring-chart-1/20` |
| `completed` | Completed | success | `bg-success-main ring-success-main/20` |

StatusBadge markup is the standard halo-dot pill: `inline-flex h-6 items-center gap-2 rounded-full border border-border-strong bg-surface pl-2 pr-2.5 text-xs font-medium text-text`, dot `size-[7px] rounded-full ring-[3px]`.
Add `"in-setup": {tone:'info', label:'In setup'}` and `live: {tone:'primary', label:'Live'}` to the StatusBadge map if they're missing.

### 1.2 Program status
`upcoming` (start in the future), `in-progress` (start ≤ today ≤ end), `completed` (end before today).
Labels differ by place:

| status | Workspace header | Project drawer pill | Programs-dot hover text |
|---|---|---|---|
| upcoming | `In setup` (dot `bg-info`, text `text-info`) | `N/4 ready` (grey) | `Starts 25 Dec · 0% set up` |
| upcoming + needsAction | `In setup` | `Starts in 14 days · 3/4 ready` (amber) | `Starts in 14 days · only 75% set up` |
| in-progress | `Running` (dot `bg-chart-1`, text `text-primary-text`) | `Running` | `Running · ends 22 Nov` |
| completed | `Delivered` (dot `bg-success-main`, text `text-success`) | `Delivered` | `Delivered · 22 Nov` |

### 1.3 "Need action" rule (the only reason)
A **program** needs action when `status === 'upcoming'`, its start is **≤ 14 days** from today, **and**
its setup isn't complete (`done < 4`).
A **project** needs action when `needsAction` (count of such programs) is > 0.
The pill's tooltip text says exactly this: "A program starts within 14 days and isn’t set up yet".

### 1.4 Program readiness (the "75% set up" number)
Each program has 4 list-level setup items (`setup[]`):
1. `facilitator`: "Facilitator assigned"
2. `content`: "Content mapped"
3. `participants`: "Participants enrolled"
4. `logistics`: "Venue / joining link"

`readiness = round(done / 4 × 100)` → only 0, 25, 50, 75 or 100.
Project `readiness` = rounded mean of its programs' readiness.

### 1.5 Project "Progress" column (function `q(project)`)
| stage | pct | text (title tooltip) | sub | bar colour (not rendered in table) |
|---|---|---|---|---|
| in-setup | `project.readiness` | `Starts {in N days / today / tomorrow}` (project start) | `{readiness}% set up` | `bg-warning-main` if needsAction, else `bg-info` |
| live | `round(day / total × 100)` with day = days since project start + 1 (clamped), total = days start→end inclusive | `Day {day} of {total}` | `ends {d MMM}` | `bg-chart-1` |
| completed | 100 | `Completed` | `{end d MMM}` | `bg-success-main` |

The cell shows only `{pct}%` (`text-sm font-semibold tabular-nums text-text`) and the native `title` is `"{text} · {sub}"`.
The same `text` appears at the top right of the drawer's Programs header (e.g. "Starts in 14 days", "Day 10 of 13").

### 1.6 Relative day words
`V(n)`: `n<=0 → "today"`, `1 → "tomorrow"`, else `"in {n} days"`.
In the workspace (`ut`): also `-1 → "yesterday"` and `"{n} days ago"`.
Dates are `en-GB` short, without the year when it's implicit: `3 Dec`, `3 Dec – 23 Jan`, `3 Dec 2026`.

---

## 2. Screen: Project list (`/projects`)

### 2.1 Layout
- Page wrapper: `flex flex-col gap-6 lg:flex-1`.
- One glass card holds everything: `ln-flat-mobile overflow-clip rounded-card border border-glass-border shadow-card glass lg:flex lg:flex-1 lg:flex-col`.
  - Toolbar strip: `border-b border-border-strong p-3 max-sm:border-b-0 max-sm:pb-0 max-sm:pt-1 sm:px-5 sm:py-3.5`, containing a `ListToolbar`.
  - `DataTable` embedded, with `stickyHeader`, `mobileCards`, caption "Projects".
- There's no page title block (the breadcrumb is the title).

### 2.2 ListToolbar config
| prop | value |
|---|---|
| summary (left) | `ClientStats` pills, `ariaLabel="Project summary"`, shown on phones too (`summaryOnPhones`) |
| search placeholder | `Search project, client, program or OPP…` |
| search label | `Search projects` (150 ms debounce, trimmed, lower-cased) |
| Filters button | "Filters" with count badge = number of active filter chips |
| Add button | `+ Add project` (primary) → navigate `/projects/new` |
| result line (when filtered) | `{shown} of {total} projects` + `Clear all` link (e.g. "24 of 182 projects · Clear all") |
| chips | one per active filter (see 2.5); × removes that filter |
| Clear all | resets pill to All, empties the search, resets filters |

The search icon collapses to an icon button at narrower widths (the first screenshot at ~1150 px showed only a magnifier icon next to Filters).

### 2.3 Stat pills (filterable, single-select)
| key | label | tone | dot | title tooltip | filter |
|---|---|---|---|---|---|
| `all` | All projects | blue | blue | Show all projects | everything |
| `live` | Live | violet | violet | Running now | `stage === 'live'` |
| `attention` | Need action | amber, `attention` style (amber tinted pill) | amber | A program starts within 14 days and isn’t set up yet | `needsAction > 0` |

Each pill shows `{count} {label}`. Counts are over all projects, ignoring search and filters (sample: 182 / 24 / 27).
The pills show a loading state while data loads. (The code also defines `in-setup` and `completed` predicates, but they aren't shown as pills.)

Filtering order: `projects → pill predicate → search → drawer filters`.

### 2.4 Search matches (case-insensitive, contains)
Project name, project code (`PRJ-…`), client name, client code, owner, and for every program: program
name, `OPP-{oppId}`, delivered-by sub-entity, facilitator name.

### 2.5 Filters drawer ("Filter projects")
`Drawer`: title **Filter projects**, description **By status, client, owner, programs or dates**, icon `SlidersHorizontal` in a tinted tile, body `bg-surface-sunken/60`.
The body is a column (`flex flex-col gap-4`) of `FilterSection` cards (white card, coloured icon tile, title, and a "Clear" link once the section has a value):

| Section | Icon / tone | Control | Options |
|---|---|---|---|
| **Status** | CircleCheck / green | toggle chips (multi) | In setup · Live · Completed |
| **Runs** | Calendar / blue | toggle chips (single) | Any time (default, selected) · Next 30 days · This month · Last 90 days · Custom. Custom shows a `DateRangePicker` (placeholder `From – To`, no presets) and fades in |
| **Client** | Building / amber | MultiCombobox | clients that have projects, A→Z; placeholder `Any client`, search `Search clients…` |
| **Owner** | User / violet | MultiCombobox | distinct owners; placeholder `Anyone`, search `Search people…` |
| **Program type** | (icon) / green | toggle chips (multi) | Standard Program · Coaching · ICF Program · Assessment Center |
| **Delivered by** | (icon) / blue | toggle chips (multi) | distinct sub-entities: Blanchard · BYLD Learning · Crucial Learning |

Chip style: `inline-flex h-8 items-center rounded-full border px-3 text-[13px] font-medium`. On: `border-primary/40 bg-primary-soft text-primary-text`. Off: `border-border-strong text-text-secondary hover:border-text-muted/40 hover:text-text`.

Footer: ghost **Reset** (clears the draft) and primary **Show {n} project(s)**. n counts live as you change
filters, over the list after pill + search. When n = 0 the button reads **No matching projects** and is disabled.
Filters apply only when you click the primary button (the drawer edits a draft copy).

Range presets: Next 30 days = today…today+29. This month = 1st…last day. Last 90 days = today−89…today.
Matching is by overlap: a project matches if `start < to+1day` and `end >= from`.
Program type and Delivered by match if **any** of the project's programs match.

Active-filter chip labels: `Status: In setup +1`, `Client: Wipro Ltd`, `Owner: Rohan Kapoor`,
`Type: Coaching`, `Delivered by: Blanchard`, `Runs: Next 30 days` or `Runs: 3 Dec – 15 Jan 2027` (`…` if there's no end).

### 2.6 Table columns
Default sort: **Last updated, descending** (header shows a ↓ arrow). Every column except Actions is sortable (⇅ icon when unsorted).

| # | Header | Hidden below | Cell |
|---|---|---|---|
| 1 | **Project** (primary, not hideable) | — | `ClientLogo` (size md, rounded tile; initials on a tint when there's no logo, e.g. "ML", "GC") + two lines: name `max-w-[16rem] truncate text-sm font-semibold text-text`, which turns `text-primary-text` on row hover; client name `text-xs text-text-muted`. Row hover also shows a 3 px primary bar at the far left (`absolute -inset-y-4 -left-5 w-[3px] bg-primary rounded-r-full scale-y-0 → row-hover:scale-y-75`, 300 ms). |
| 2 | **Programs** (sort by count) | — | Dot timeline + text block (see 2.7) |
| 3 | **Progress** | `lg` | `75%` (see 1.5) |
| 4 | **Status** | — | `StatusBadge status={stage}` |
| 5 | **Owner** | `xl` | `Avatar size xs` (initials on a soft tint, e.g. "RK") + name `text-[13px] truncate`; the signed-in user shows as **You** |
| 6 | **Last updated** | `xl` | relative time `text-[13px] tabular-nums text-text-secondary` ("1h ago", "13h ago", "1d ago", "3d ago"); `title` = full `en-GB` date and time, e.g. "18 Nov 2026, 14:05" |
| 7 | (sr-only "Actions"), width 56, right-aligned | — | `…` IconButton (`MoreHorizontal`, size sm, label `Actions for {name}`) opening a dropdown |

At ~1150 px wide the Owner and Last updated columns are cut off, and the table header gets ‹ › scroll arrows (the DataTable's horizontal scroll affordance).

### 2.7 Programs cell (dot timeline)
- Wrapper: `flex min-w-0 items-center gap-3`.
- `ol` (aria-label "Programs, in date order") `flex w-[5.75rem] shrink-0 items-center`, with programs sorted by start date.
- If there are **more than 4** programs, show 3 dots: a window starting one before the first not-completed program (clamped), and the rest collapse into a `+N` chip (`h-[18px] rounded-full bg-surface-sunken px-1.5 text-[10px] font-semibold text-text-secondary ring-1 ring-inset ring-border-strong`) whose tooltip is `"{N} more: A, B"`.
- Dot: `block size-3 rounded-full border-2` plus:
  - **completed** → solid green: `border-success-main bg-success-main`
  - **in-progress** → solid violet/blue with soft halo: `border-chart-1 bg-chart-1 ring-[3px] ring-chart-1/15`
  - **upcoming (fine)** → hollow ring: `border-info bg-surface` (teal/blue outline)
  - **needs action** → solid amber, pulsing halo: `border-warning-main bg-warning-main ring-[3px] ring-warning-main/20 motion-safe:animate-pulse`
- Connector between dots: `h-px w-3`, `bg-success-main/60` if the previous program is completed, else `bg-border-strong`.
- Each dot has a `Tooltip` with `"{program} · {status text}"`, e.g. "Situational Leadership® II · Starts in 14 days · only 75% set up", "Leading Through Change · Starts 11 Dec · 25% set up", "Running · ends 22 Nov", "Delivered · 22 Nov".
- Text block: line 1 `"{n} program(s)"` (`text-[13px] font-medium text-text`). Line 2 (`text-xs text-text-muted max-w-[12rem] truncate`): `Running now` if the first not-completed program is in progress, `Next · 3 Dec` if it's upcoming, `All delivered` if none is left.

### 2.8 Row "…" menu
1. **Add a program** (`Plus` icon) → info toast "Adding a program is coming soon", description "This part of Projects isn’t built yet."
2. **Open client** (`Building` icon) → navigate `/clients/{clientId}`
3. **Copy link** (`Link2`) → copies `{origin}/projects?q={PRJ-code}`, then success toast "Link copied" with description "{name} · {code}". On failure: error toast "Couldn’t copy the link" with the URL as description.
4. separator
5. **Archive** (`Archive`, danger red) → `ConfirmDialog`: title **Archive this project?**, description **"{name} ({code}) and its {n} program(s) will leave the list."**, confirm **Archive** (danger, shows loading). On success the row is removed and a success toast shows "Project archived" with the name. On error: "Couldn’t archive it" with the message. (I didn't run this.)

The click on the menu cell doesn't propagate to the row.

### 2.9 Row click → Project drawer (see §3)

### 2.10 Pagination, loading, empty, error
- Pagination: page size **10** by default, with a "rows" select offering `10 rows / 20 rows / 50 rows / All rows`. Range text `1–10 of 182` and page buttons `1 2 … 19`.
- Loading: skeleton rows; header columns render immediately; pills show a loading state.
- Error: the DataTable's error state with Retry (`onRetry = reload`).
- Empty, no projects at all: `EmptyState compact`, icon `FolderKanban`-style, title **No projects yet**, text **Projects you set up for your clients will appear here.**
- Empty, no matches: icon `SearchX`, title **No projects match**, text **Try a different search or another status.**, secondary button **Clear search & filters**.

### 2.11 Phone layout (from code; the window couldn't be resized)
- The outer card frame drops on phones (`ln-flat-mobile`) and the toolbar loses its bottom border and padding (`max-sm:` classes).
- The pills stay visible on phones in a horizontally scrolling row (`overflow-x-auto scrollbar-none`, right fade mask).
- The DataTable switches to **mobile cards** (`mobileCards`): the primary column (logo + name + client) is the card title, and the other visible columns become label/value rows.
- Progress is hidden below `lg`. Owner and Last updated are hidden below `xl`.

---

## 3. Project drawer (row click)

`Drawer size="lg"`, no default header (`header:false`), `labelledBy="project-drawer-title"`. It fills the full height and closes via a sticky round × button (`mt-4 rounded-full bg-surface/80 shadow-xs ring-1 ring-border/70 backdrop-blur`, top right).

1. **Header** `bg-gradient-to-b to-transparent px-5 pb-6 pt-7 sm:px-7`, tinted by stage: `from-info-main/[0.10]` (in setup), `from-chart-1/[0.10]` (live), `from-success-main/[0.10]` (completed).
   - `ClientLogo size lg` + `h2` project name (`text-lg font-semibold`) + client name (`text-[13px] text-text-secondary`).
   - Two buttons in `mt-6 grid grid-cols-2 gap-3`: primary **+ Add program** (coming-soon toast, as in 2.8) and secondary **Open client** (Building icon, `border-text-muted/40`) → `/clients/:id`.
2. **Facts row** `dl mx-5 grid grid-cols-3 divide-x border-y py-4`. Each label is uppercase `text-[11px] font-medium tracking-wide text-text-muted`:
   - **STATUS**: StatusBadge
   - **RUNS** (or **RAN** when completed): `3 Dec – 23 Jan` (title has the full range)
   - **OWNER**: avatar xs + name / "You"
3. **Programs section**: header `Programs {count}` (count `text-text-muted`), and on the right the project progress text ("Starts in 14 days" / "Day 10 of 13" / "Completed").
   A vertical timeline `ol`, sorted by start date. Each item:
   - Node (20 px SVG) on the left with a connector line `w-0.5` to the next item (coloured when done: delivered `bg-success-main/50`, running `bg-chart-1/40`; otherwise `bg-border-strong`):
     - **done**: green filled circle with white check
     - **live**: violet dot inside a soft ring, plus an `animate-ping` halo
     - **upcoming**: hollow teal/blue ring (`--ln-info-main`)
     - **attention**: hollow amber ring (`--ln-warning-main`)
   - A full-width button card (`rounded-xl px-3.5 py-3`; on hover `border-border-strong bg-surface shadow-xs`; the title turns primary):
     - Line 1: start date `3 Dec` (`text-xs font-semibold text-text-secondary`) + pill (`rounded-full px-2 py-px text-[11px] font-semibold`):
       - Delivered: `bg-success-soft text-success`
       - Running: `bg-primary-soft text-primary-text`
       - Needs action: `Starts in 14 days · 3/4 ready`, `bg-warning-soft text-warning`
       - Upcoming: `1/4 ready`, `bg-surface-sunken text-text-secondary`
     - Line 2: program name `text-sm font-semibold`
     - Line 3: `Cohort A · Standard Program · Ishita Sen`, or italic *No facilitator yet*
     - A chevron on the right that nudges right on hover
     - Click → `/projects/{projectId}/programs/{programId}`
4. **Footer** `border-t px-5 py-4 text-xs text-text-muted`: `PRJ-3494` (font-mono) + ` · Created 18 Nov 2026 by Priya Sharma` (or "You").

---

## 4. Add project wizard (`/projects/new`)

### 4.1 Shell (`FormWizard`)
- Grid `grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)]`.
- **Left rail** (xl and up; sticky; a faint-tint primary card, `px-5 py-6`):
  - Icon tile (`ListChecks`, `size-11 rounded-xl bg-gradient-to-br from-chart-1/15 to-chart-1/5 text-chart-1 ring-1 ring-chart-1/15`)
  - Title **New project**
  - Subtitle **Four quick steps.**, or after a CRM fetch **Pre-filled from OPP-3664 — just review.**
  - The step list: an 8 px round icon per step; done = filled primary with check, current = `bg-primary-soft ring-2 ring-primary` with a white card highlight, upcoming = white with ring. Connector lines are primary when the next step isn't upcoming. Each step shows its label (semibold) and description (muted, truncated). You can click done steps (`canOpen: index <= furthest reached`).
  - CRM marker: when pre-filled from CRM, the **Project** and **Dates and name** steps show a small `DatabaseZap` chip (`size-5 rounded-full bg-chart-1/10 text-chart-1`, title "Pre-filled from CRM portal").
  - Bottom note (Info icon): **Fields marked \* are required. You can go back to any finished step.**
- **Below xl**: a compact card with `{step label}`, `Step 2 of 4` and a 4-segment progress bar instead of the rail.
- **Right column**: the step content card (`Card faint`, with icon tile + title + description header) and a footer bar joined underneath (`-mt-5 rounded-t-none border-t border-dashed px-5 py-3.5`):
  - left: ghost **← Back** (from step 2) and ghost **Cancel**
  - right: primary **Continue →**, or on the last step **✓ Create project** (loading while saving). Continue is disabled while an opportunity lookup is running.
- Changing step scrolls smoothly to the top.

Steps:

| # | key | label | description | icon |
|---|---|---|---|---|
| 1 | start | Opportunity | Opportunity ID or from scratch | Sparkles |
| 2 | project | Project | Name and type | FolderKanban |
| 3 | program | How to start | Copy a batch or start empty | Library |
| 4 | schedule | Dates and name | First day and batch name | Calendar |

**Validation timing:** errors show only after you press Continue on that step once. After that the step is "touched" and errors update live as you change values.

### 4.2 Step 1: Opportunity
Section header: icon Sparkles (primary tone), title **Do you have an opportunity ID?**, description **With a won opportunity from the CRM portal, the details fill themselves in.**

Two radio tiles (`role=radio`, grid `sm:grid-cols-2 max-w-2xl gap-3`). Tile style: `rounded-xl border px-4 py-3.5`, a 40 px icon tile, title + muted text, and a round check on the right (filled primary with check when on). On = `border-primary/50 bg-primary-soft/60`.
- **Yes, I have one** with a tag pill **Fastest** (`bg-chart-1/10 text-chart-1 text-[10px]`), text **Fetch it from the CRM portal**, icon DatabaseZap on `bg-chart-1/12`.
- **No, start from scratch**, text **Enter the details yourself**, icon PenLine on `bg-chart-4/12`.

Error if neither is chosen: **Choose one to continue**.

**If "Yes":** a fade-in form (`max-w-md`) appears. Field **Opportunity ID** has an input with a Hash icon, placeholder `e.g. OPP-3664` and numeric input mode, followed by a primary **Fetch** button (Enter also submits).
- Helper: **Demo: any 4 digits — ones ending in 0 aren’t found.**
- Lookup takes about 900 ms, and Fetch shows a spinner meanwhile.
- Errors (shown in the field):
  - not 4 digits → **An opportunity ID has 4 digits, e.g. OPP-3664.**
  - ends in 0 → **OPP-{id} isn’t in the CRM portal. Check the number, or start from scratch.**
  - Continue without fetching → **Fetch the opportunity first — or start from scratch**
- On success, the form is replaced by a result card (`rounded-xl border bg-surface/70 p-4`): `ClientLogo md`, client name + green pill `✓ OPP-3664`, program name, then muted `Standard Program · Crucial Learning · from 13 Dec · 36 people`, and a ghost **Change** button that clears everything and goes back to an empty OPP input.
- A successful fetch pre-fills: client, project name, project type (= program type), program, program type, entity, sub-entity, start date, participants. It also clears any copy choice.

**If "No":** a fade-in grid (`sm:grid-cols-2 max-w-2xl gap-4`):
- **Client \***: Combobox, options = active clients (label = name, description = code), placeholder `Choose a client`, search `Search clients…`. Error: **Choose the client**
- **Program \***: Combobox, options = program catalogue (description = type), placeholder `Choose a program`, search `Search programs…`. Picking one also sets programType. Error: **Choose the program**
- **Delivered by \*** (full width): pill chips `h-9 rounded-full px-3.5`, one per sub-entity (**Blanchard**, **Crucial Learning**, **BYLD Learning**; title = legal entity name). Error: **Choose who delivers it**

Invalid controls get a red border, and the error text has a red alert-circle icon.

### 4.3 Step 2: Project
When pre-filled from the CRM, a banner sits above the card (gradient `from-chart-1/[0.08]`, border `chart-1/20`): DatabaseZap tile + **"Project pre-filled from CRM portal"** + ` · OPP-3664 · Maruti Suzuki India Ltd · review and edit anything that’s changed.` + a green pill **✓ Synced**.

Card: icon FolderKanban (info tone), title **Name the project**, description **It groups the programs you run for {client name}.** ("this client" if none).
Grid `max-w-md gap-5`:
- **Project name \***: Input, placeholder `e.g. 2027 Manager Development`, maxLength 80. Error (trimmed length < 3): **Give the project a name (3+ characters)**. The CRM fills names like "Executive Coaching Program".
- **Project type \***: Select with Standard Program (default), Coaching, ICF Program, Assessment Center. Helper: **Coaching, ICF and Assessment Center setups are coming soon.**

### 4.4 Step 3: How to start
Card: icon FilePlus (violet tone), title **How do you want to start?**, description **Copy a batch you already ran for {client}, or start from scratch.**
Radio tiles:
- **Copy an earlier program**, text **Reuse a batch — fastest** (icon Copy on `bg-success-main/12`). It's disabled at 55% opacity with the text **No earlier batches yet** when the client has none.
- **Start empty**, text **Add each session yourself** (icon FilePlus on `bg-chart-4/12`).

Error if neither is chosen: **Choose how you want to start**.
When Copy is chosen, a fade-in sub-list appears with the label **Copy which program?**. It holds up to 6 earlier programs of this client, newest first, as radio rows (`rounded-lg border px-3.5 py-2.5`, small radio dot). Each row shows `{program} · {cohort}` (13 px medium), the project name below (muted), and the start date on the right (e.g. "10 Dec", "5 Sept").
Error: **Choose the batch to copy**. Helper below: **Sessions, content, assessments, facilitator and venue come across — participants and the agreement don’t.**

### 4.5 Step 4: Dates and name
Optional CRM banner ("Dates and name pre-filled from CRM portal …").
Card: icon Calendar (success tone), title **When does it start?**, description **And what do you call this batch?**
Grid `sm:grid-cols-2 max-w-2xl gap-4`:
- **First day \***: DatePicker, minDate today, placeholder `Pick a date`, clearable (×). Helper **When pre-work opens**. Error **Pick the first day**
- **Batch name \***: Input, placeholder `e.g. Cohort B`, maxLength 40. Helper **Shown next to the program name**. Error **Name the batch**

Note line (Info icon, muted xs): **After you create it, the program opens with every setup step listed — nothing is locked.**
Primary button: **✓ Create project**.

### 4.6 Create (I didn't run this)
`api.projects.create` makes a project with one program (end = start + 13 days, status upcoming, readiness 0, all 4 setup items not done, no facilitator, 0 participants, `needsAction` if start ≤ 14 days), sets the owner to the current user and puts it at the top of the list.
- Success: toast **Project created**, description `{name} · {code}` (shown after navigation), then navigate to `/projects?q={code}`, which opens that project's drawer.
- Error: toast **Couldn’t create the project** with the message (e.g. "That client isn’t on file any more.").

### 4.7 Leaving with unsaved data
Cancel, or any in-app navigation while the form differs from its initial state, opens a ConfirmDialog (warning triangle icon): title **Discard this project?**, text **The details you’ve entered won’t be saved.**, buttons **Keep editing** (secondary) and **Discard** (danger) → go to the target (default `/projects`).
With no changes, Cancel goes straight back.

---

## 5. Program workspace (`/projects/:projectId/programs/:programId`)

Not found → a Card with EmptyState: title **Program not found**, text **It may have been removed, or the link is out of date.**, secondary button **← All projects**.

### 5.1 Hero (same pattern as ClientHero)
- `Card tint="primary"` tinted with the client logo's colour (or the colour derived from the client code), `rounded-b-none border-b-0`, padding `px-5 py-6 sm:px-7 sm:py-7`, `lg:flex-row lg:justify-between`.
- `ClientLogo size lg` (`size-14 rounded-2xl sm:size-16`).
- `h1` program name: `text-lg font-bold sm:text-2xl sm:leading-8`.
- Meta line (`text-[13px] text-text-secondary`, items separated by `·`):
  - Cohort chip `h-6 rounded-md bg-surface-sunken px-2 text-xs font-semibold ring-1 ring-inset ring-border-strong` ("Cohort A")
  - program type (hidden on phones)
  - client name
  - project name
  - status dot + label (`In setup` / `Running` / `Delivered`, coloured as in 1.2)
- Buttons on the right (sm and up): secondary **← Back to project** (→ `/projects?q={PRJ-code}`, which reopens the drawer) and primary **Continue setup →** (only when there's a next step; it opens that step's tab and step).
- Phones: the buttons are replaced by a ⋮ menu at the top right with the same actions.

### 5.2 Tab strip (ClientHero tab bar, `ariaLabel "Program sections"`, idBase `program`)
Sticky underline-bar tabs below the hero:
- **Overview** (LayoutDashboard)
- **Foundation** (Flag)
- **Learning journey** (CalendarRange)
- **People** (Users)
- **Logistics** (MapPin)
- **Communication** (Mail)
- **Go live** (Rocket)
- **After delivery** (ClipboardCheck)

A tab shows a small primary dot (tooltip "Something here is due") when any of its steps is due or overdue.
The URL holds the tab: `?tab=foundation` (Overview has no param). The panel has `mt-5 animate-fade-in`.

### 5.3 Overview tab
1. **KPI strip**: Card with no padding, `grid grid-cols-2 lg:grid-cols-4`, cells divided by borders. Each cell is a button with an icon tile (hidden on phones), a big value (`text-xl font-bold`) and a label (`text-xs text-text-secondary`). Clicking a cell opens the related tab.
   - **77%**, "Setup done" (CircleCheck, primary) → the first chapter with open work
   - **31**, "Participants" (Users, success) → People
   - **7**, "Journey steps" (LayoutList, violet) → Learning journey
   - Fourth cell (Hourglass, warning) → Go live; it depends on status:
     - upcoming: **14**, "Days to go"
     - running: **Day 6**, "Running now"
     - delivered: **✓**, "Delivered"
2. **Main card** (`tint primary subtleTint`, divided by dashed lines), with sections titled in uppercase `text-[11px] tracking-[0.08em] text-text-secondary`:
   - **UP NEXT**: status icon (20 px) + step label (semibold) + `{chapter label}` (and ` · {note}` in amber/red when due or overdue) + small primary **Open step →**. When everything is done: green check + **Every setup step is done — this program is ready.**
   - **PROGRAM DETAILS**: `dl grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5` with Program type · Delivered by (title = legal entity) · Facilitator · Opportunity (`OPP-3664`, mono, with a copy button) · Starts (`3 Dec 2026`, title "in 14 days") · Ends · Cohort · Project. Labels are `text-xs font-medium text-text-secondary` and values `text-sm font-medium`; empty values show "—".
   - Two columns (`lg:grid-cols-2`, dashed divider):
     - **KEY DATES**: a vertical list (h-10 rows, line `left-[7px]`). Rows: Welcome emails go out (start −5), Pre-work opens (start −3), **Day 1** (start; key row = 11 px primary dot with a `ring-4 ring-primary-soft`, bold), Practice lab (start + 40% of the duration), Reflection and action plan (start + 75%), Certificates and debrief (end + 1).
       Each row: `w-12` date `28 Nov`, label, and on the right a relative word ("in 9 days", primary for the key row) or **Done**.
       Past rows are at 55% opacity and have a grey check bubble.
       A **TODAY** marker line (primary dot + `h-px bg-primary/30` + uppercase `text-[9px] font-bold` "TODAY") sits above the first future row when some rows are already past.
     - **SETUP BY CHAPTER**: one row per chapter except After delivery. Each row is a button (h-10, hover tint) with: chapter icon, label, step dots (`size-2.5`; done `bg-primary/70`, overdue `bg-danger-main`, due `bg-warning-main`, locked `bg-text-muted/15`, todo = hollow `border-[1.5px] border-text-muted/40`), and a count `3/3` (green and semibold when complete). Row title = the first due item's "{label} · {note}", or "Unlocks later". Clicking a row opens that chapter.

`Setup done %` = done steps ÷ all steps in chapters other than Go live and After delivery (13 steps in total).

### 5.4 Chapter tabs (Foundation … After delivery)
Card with no padding, `grid md:grid-cols-[240px_minmax(0,1fr)]`.
- **Left aside** (`bg-surface-sunken/70`, border-right; sticky below the tab bar. When stuck it floats as a rounded glass card with `md:m-2 md:rounded-xl md:shadow-raised`):
  - Header: a 48 px progress ring (SVG r = 21, primary stroke, offset = share done, 700 ms transition) around a chapter icon on `bg-primary-soft`, plus the chapter name (`text-[15px] font-semibold`) and `2 of 3 done`.
  - Step list: number bubbles (`size-7`) joined by vertical lines (green-ish when done).
    - Bubble by state: done = green with white check; locked = grey with a lock; overdue = red border and number; due = amber border; active = primary border with a `0 0 0 5px primary-soft` glow; otherwise grey border.
    - Each row shows the label plus a sub-line: `Done` / `Not started` / the note, coloured amber or red for due/overdue.
    - The active row is `bg-primary-soft/70` with primary semibold text.
- **Right section**:
  - Header (`min-h-[3.75rem] border-b px-6`): step title `text-base font-semibold` + state pill (`rounded-full px-2.5 py-0.5 text-xs font-semibold`):
    - Done: `bg-success-soft text-success`
    - due: `bg-warning-soft`
    - overdue: `bg-danger-soft`
    - Not started: `bg-surface-sunken text-text-secondary`
    - locked: muted
  - A right-hand action slot (portal), used by Contacts, Agreement and Content.
  - The step's body.
  - Footer (`border-t border-dashed px-6 py-3.5`): ghost **← {previous step label}** ("Back" on phones) and secondary **{next step label} →**, or **Next: {chapter}** when the next step is in another chapter. These move across chapters.

Chapters and steps (the step key goes in `?step=`):

| Chapter (key) | Steps (key, label, "About N min") | Built? |
|---|---|---|
| Foundation (`foundation`) | basics "Program basics" 3 · contacts "Client contacts" 2 · agreement "Agreement and approval" 5 | all 3 built |
| Learning journey (`journey`) | sessions "Sessions and schedule" 6 · content "Content and kits" 4 · assessments "Assessments and check-ins" 4 | sessions + content built |
| People (`people`) | facilitators "Facilitators" 3 · participants "Participants" 5 | placeholder |
| Logistics (`logistics`) | venue "Venue and room" 4 · travel "Trainer travel and stay" 5 · workbooks "Workbooks" 3 (all need agreement approval) | placeholder |
| Communication (`communication`) | invites "Invites and reminders" 3 · feedback "Feedback and certificate" 3 | placeholder |
| Go live (`golive`) | readiness "Readiness check" 2 | placeholder |
| After delivery (`after`) | debrief "Attendance and debrief" 5 | placeholder |

Placeholder body: centred EmptyState with the chapter icon, **"{Step label} is on its way"**, **This step’s setup screen hasn’t been built yet.**

Step states and notes:
- `done`
- `todo` ("About N min"; shows as **Not started**)
- `due` ("Due today" / "Due tomorrow" / "Due 28 Nov")
- `overdue` ("3 days overdue")
- `locked`: "Unlocks after agreement approval" for logistics steps, or "Opens after launch" for After delivery
- Go live todo → "{10–15} items left"
- Agreement-specific notes: todo **PO not uploaded**, due **Waiting for approval**, overdue **Sent back by Audit**

#### 5.4.1 Foundation › Program basics
Two bordered sub-panels (`rounded-xl border bg-surface/70`, header row `min-h-11 border-b px-4` with icon + 13 px semibold title):
1. **From the CRM** + mono `OPP-3664` + green pill **✓ Verified**. Action: ghost xs **↻ Check for changes** spins for about 900 ms, then shows success toast "Up to date with the CRM" with "Nothing has changed on OPP-3664."
   Body: "**BYLD Consulting India Pvt Ltd** bought **31 seats** of **Building Trust**, delivered by **Blanchard** and sold by **Sneha Gupta**." followed by a muted line "Part of Sales Leadership Academy · Standard Program".
2. **Yours to set** (SlidersHorizontal icon): rows with the label on the left and a control on the right (`w-full sm:w-60`), divided:
   - **Batch name**: Input, maxLength 40; red when empty
   - **Program dates**: read-only grey box "3 Dec – 24 Dec 2026"
   - **Client signs off the learning journey**, with help "Sent to {SPOC} before launch; we track the reply" (or "Sent to the client’s contact before launch"): a Yes/No segmented control
   - **Learner access after the program**: Select (3 months / 6 months / 12 months)
   - When anything changes, a sticky bottom bar appears: "You have unsaved changes" + ghost **Discard** + primary **Save** (disabled when the batch name is empty). Save shows toast "Program basics saved" with "{program} · {cohort}". (Local state only.)

#### 5.4.2 Foundation › Client contacts
Header action: small primary **+ Add contact** (UserPlus).
Table (embedded DataTable, no pagination, mobile cards, caption "Client contacts"):
- **Contact**: avatar md + name + a **Main contact** badge (primary) if main; email below
- **Mobile** (hidden below lg): "+91 98765 43210" in the clients' mobile cell style, or "—"
- **Role** (hidden below md): "Designation · Department" or "—"
- Edit pencil icon button

Empty: icon Users, title **No contacts yet**, text **Add who you’ll work with at the client.**, button **+ Add contact**.

**Add/Edit contact** modal (lg, doesn't close on backdrop click, icon UserPlus). Title **Add contact** / **Edit contact**; description "Someone at the client you’ll work with on this program." / the contact's name.
Fields (grid 2 columns):
- **Name\*** (full width): User icon, placeholder `Full name`, letters/space/.'- only. Error **Enter their name**
- **Email\***: Mail icon, `name@company.com`. Errors **Enter their email** / an invalid-email message
- **Mobile number\***: +91 prefix, digits only, max 10, placeholder `98765 43210`. Errors **Enter their mobile number** / **A mobile number has 10 digits**
- **Department** (optional): Combobox `Select department` / `Search departments…`, clearable
- **Designation** (optional): `Select designation` / `Search designations…`
- Checkbox **Main contact** (disabled when editing the current main contact)

Footer: **Cancel** · **Add contact** / **Save changes**. Errors appear after the first submit.
Toasts: "Contact added" / "Contact updated" with the name. The first contact, or one ticked as main, becomes the only main contact.

#### 5.4.3 Foundation › Agreement and approval
Panels:
1. **Purchase order** (FileText icon) + mono `PO-BYL004-3664 · v1`.
   - With a file: file tile + name `BYL004_PO_3664.pdf` + "312 KB · Valid 2 Nov – 3 Jan 2027" + ghost **View** (Eye) → FilePreview modal.
   - Without a file: "No PO uploaded yet" + secondary **Upload PDF** (hidden input `accept=application/pdf`). A non-PDF gives error toast "Upload a PDF" with the file name.
   - Uploading a PDF sets version+1, resets both approvals to Waiting, and shows success toast "Sent for approval" with "Finance and Audit will review it."
   - Header action **Upload new version** shows when a file exists and it isn't fully approved.
2. **Approvals** (ShieldCheck): rows with avatar + name + "Role · 18 Nov" + Badge. Approvers are Neeraj Gupta (Finance) and Kavita Rao (Audit).
   - Badges: Approved (success), Waiting (warning), Sent back (danger).
   - When sent back, the comment shows under the row with a left border, e.g. "The PO is valid till 28 Dec, but the last session is on 3 Jan. Upload an extended PO or a validity extension letter."
3. **What it locks** (Lock): `dl` 3 columns with Client · Program · Seats · Journey steps · Dates · Business developer.

#### 5.4.4 Learning journey › Sessions and schedule
One panel per **Module** (enabled modules from Settings › Modules: **Pre**, **During**, **Post**).
- Panel header: module icon (Pre = CalendarClock, During = CalendarRange, Post = calendar-check style) + name + muted count. Right: **⊕ Add step** button (AddContentButton style: blue plus circle, pill) opening a menu with Self-learning module · Virtual session · In-person session · Assessment · 360 feedback.
- Empty module: "No steps yet".
- Each step is a full-width row button:
  - left `w-12` date `27 Nov` + weekday `Fri`
  - name (`text-sm font-medium`, primary on hover)
  - meta with type icon: `Self-learning · 1h` / `In-person session · 9:30 am · 6h` / `Virtual session · 10:00 am · 2h · Google Meet` / `Assessment · 30 min` / `360 feedback · Open 7 days`
  - on the right, an amber first issue ("Venue pending", "Needs a start time", "Needs a link"), plus `+N` more
  - a chevron
  - Click → Edit step.
- Steps are sorted by date, then time.

**Add/Edit step modal** (lg, no backdrop close, icon by type). Title `Add virtual session` (type label lower-cased) / **Edit step**, with the type as description.
Fields:
- **Name\***: for an assessment it's a Select instead (Behavioural assessment / Pre-program knowledge check / Leadership style survey / Post-program knowledge check). Default "New {type}". maxLength 60. Error **Give the step a name**
- **Module**: Select of modules. Changing it re-clamps the date.
- **Date\*** (or **Opens on** for feedback/assessment): DatePicker, not clearable, limited by module:
  - Pre: up to the day before start (default start −3)
  - During: start…end (default start)
  - Post: from the day after end (default end +1)
  - Error **Pick a date**
- Virtual / in-person: **Start time** (TimePicker, 15-min steps, 07:00–21:00, placeholder "Select time") + **Length** (15m … 8h)
- Self / assessment: **Length** or **Time limit** (15 min, 30 min, 45 min, 1h, 1h 30m, 2h, 3h, 4h, 6h, 8h)
- Feedback: **Stays open for** (3 / 5 / 7 / 10 / 14 days)
- Virtual: **Platform** (Zoom / Microsoft Teams / Google Meet) + **Meeting link** (Link icon, placeholder `Paste a link or create one`, plus a secondary **Create link** button that generates `https://meet.learnnext.in/xxxxxxxx`)
- In-person: **Where**, a ghost link button "Set on the Venue step" / "Venue is set" → opens Logistics › Venue
- Assessment: **Pass score (%)** (0–100), **Attempts allowed** (1–5), and three switches in a bordered list: "Participants can download their report", "Shuffle questions and answers", "Show the score when finished"

Defaults by type: self 60 min · virtual 120 · in-person 360 · assessment 30 · 360 feedback 20.
Footer: on edit, a red ghost **Remove** (Trash) on the left. On the right: **Cancel** · **Add step** / **Save changes**.
Toasts: "Step added", "Step updated", "Step removed" (with the step name).

#### 5.4.5 Learning journey › Content and kits
Header action: secondary **Manage Content** (FolderOpen) → `/content/{programId}`.
A list of journey steps of type self / virtual / in-person, sorted by date. Each row has:
- a type icon tile
- the name and "Module · 3 Dec"
- a material count with a FileText icon ("2 materials", or amber "No material")
- for live sessions only, an e-kit count with a Briefcase icon ("1 e-kit", or amber "No e-kit")
- a chevron

**Content and kits** modal. Title "Content and kits", description "{step} · {type} · {module}".
- Top line: "From **{content program}** in Manage Content" + a link "Open in Manage Content".
- Element cards for that module's stage (pre / during / post) from Manage Content. Each card has: name, description, file-type count chips (documents violet, videos red, links blue) and a "Files" toggle that expands the file list (preview, or open the link in a new tab). Toggles: **Give to participants** and, for live sessions, **Add to trainer e-kit**. Selected cards are `border-primary/40 bg-primary-soft/40`.
- Empty: "Nothing in {module} yet", "Add elements to the program in Manage Content, then pick them here."
- Footer: "{n} element(s) for participants · {n} in the trainer e-kit" + **Cancel** / **Save** → toast "Content saved".

---

## 6. Toast catalogue (Projects area)
| Trigger | Type | Title | Description |
|---|---|---|---|
| Add a program (menu / drawer) | info | Adding a program is coming soon | This part of Projects isn’t built yet. |
| Copy link ok / fail | success / error | Link copied / Couldn’t copy the link | `{name} · {code}` / URL |
| Archive ok / fail | success / error | Project archived / Couldn’t archive it | name / message |
| Create ok / fail | success / error | Project created / Couldn’t create the project | `{name} · {code}` / message |
| Check for changes | success | Up to date with the CRM | Nothing has changed on OPP-3664. |
| Basics save | success | Program basics saved | `{program} · {cohort}` |
| Contacts | success | Contact added / Contact updated | name |
| PO upload | success / error | Sent for approval / Upload a PDF | Finance and Audit will review it. / file name |
| Steps | success | Step added / Step updated / Step removed | step name |
| Content | success | Content saved | step name |

---

## 7. Data model (mock API `api.projects`, `api.programWorkspace`)

### 7.1 Project
```js
{
  id: 'cl-4-pr3', code: 'PRJ-3494', name: 'Sales Leadership Academy',
  projectType: 'Standard Program',          // = first program's type
  stage: 'in-setup' | 'live' | 'completed',  // from status
  status: 'upcoming' | 'in-progress' | 'completed',
  client: { id: 'cl-4', name: 'BYLD Consulting India Pvt Ltd', code: 'BYL004', logo: '/logos/…svg' | null },
  owner: 'Rohan Kapoor',                     // shows "You" for the current user
  start: '2026-12-03T00:00:00', end: '2027-01-23T00:00:00',  // min/max of programs
  createdAt: ISO, createdBy: 'Priya Sharma',
  modifiedAt: ISO, modifiedBy: 'Atul Kumar',
  programs: Program[],
  participants: 62,          // sum
  needsAction: 1,            // count of programs needing action
  readiness: 33,             // mean of program readiness
}
```
API: `list()` (sorted by modifiedAt desc), `all()`, `archive(id)`,
`formLookups() → {clients[{id,name,code,logo}], programs[{name,type}], deliveredBy[{entity,subEntity}]}`,
`earlierPrograms(clientId)` (≤ 6, newest first, with `projectName`), `lookupOpportunity(id)`, `create(form, userName)`.

### 7.2 Program (batch) inside a project
```js
{
  id: 'cl-4-pr3-g1', oppId: 3664, program: 'Building Trust', type: 'Standard Program',
  entity: 'Blanchard Research and Training India LLP', subEntity: 'Blanchard',
  start: '2026-12-03T00:00:00', end: '2026-12-24T00:00:00',
  status: 'upcoming' | 'in-progress' | 'completed',
  cohort: 'Cohort A',                        // A, B, C… by order
  participants: 31,                          // 0 until enrolled
  expected: 36 | null,                       // from the CRM at create time
  facilitator: { id, name: 'Ishita Sen', photo } | null,
  setup: [ {key:'facilitator',label:'Facilitator assigned',done}, {key:'content',label:'Content mapped',done},
           {key:'participants',label:'Participants enrolled',done}, {key:'logistics',label:'Venue / joining link',done} ],
  readiness: 75,                             // done/4*100
  needsAction: true,                         // upcoming && starts ≤14 days && readiness<100
}
```

### 7.3 Opportunity (CRM lookup result)
`{ oppId: 3664, client:{id,name,code,logo}, projectName, projectType, program, programType, entity, subEntity, start, participants: 36, dealValue: 750000, bdOwner: 'Karan Mehta' }`
Sample: OPP-3664 → Maruti Suzuki India Ltd · Customer Service Excellence · Standard Program · Crucial Learning · from 13 Dec · 36 people.

### 7.4 Program workspace (`programWorkspace.get(projectId, programId)`)
```js
{
  project: { id, name, code, client, projectType },
  program: Program,
  chapters: [{ key, label, steps: [{ key, label, minutes, state:'done'|'todo'|'due'|'overdue'|'locked', note, due }] }],
  progress: { done, total: 13, pct },
  next: step & { chapter } | null,           // first overdue, else due, else todo
  timeline: [{ label, date, past, key?, today? }],
  library: { programId, programName, stages: { pre:[Element], during:[…], post:[…] } },  // Manage Content
  journey: JourneyStep[],
  basics: { seats: 31, bdOwner: 'Sneha Gupta', spoc: 'Karan Sethi'|null, signOff: bool, accessMonths: 3|6|12 },
  contacts: [{ id, name, email, mobile, department, designation, main, source:'crm'|'you' }],
  agreement: { po:'PO-BYL004-3664', version:1, file:{name,type,size}|null, validFrom, validTo,
               approvals:[{name:'Neeraj Gupta',role:'Finance',status:'approved'|'waiting'|'sent-back',at}], comment|null },
}
```

### 7.5 Journey step
```js
{ id, type:'self'|'virtual'|'inperson'|'assessment'|'feedback', name:'Day 1: Foundations',
  module:'mod-1'|'mod-2'|'mod-3', date: ISO, time:'09:30'|null, minutes:360, items:[elementId], ekit:[elementId],
  platform:'Zoom'|'Microsoft Teams'|'Google Meet', link:'https://meet.learnnext.in/3664-412'|null,   // virtual
  venueSet: bool,                                                                                     // in-person
  assessment:{ name, timeLimit:30, passScore:70, attempts:2, reports:true, shuffle:true, showScore:true },
  closesAfter: 7 }                                                                                     // feedback
```
Step type labels: `self` Self-learning module / short "Self-learning"; `virtual` Virtual session; `inperson` In-person session; `assessment` Assessment; `feedback` 360 feedback.
Default journey generated: "Pre-work: {program} basics" (start −6) · "Behavioural assessment" (start −3) · "Day 1: Foundations" (in person, on start) · "Practice lab" (virtual) · optional "Day 2: Putting it to work" · "Reflection and action plan" (end +1) · optional "360 feedback" (end +14).

### 7.6 Lookups and samples
- Program catalogue (name → type):
  - Authentic Executive Presence – Speaker Series → Coaching
  - Coaching Essentials for Managers → ICF Program
  - Situational Leadership® II → Standard
  - Crucial Conversations® for Mastering Dialogue → Standard
  - First-Time Manager Program → Standard
  - Women in Leadership Journey → Coaching
  - Building Trust → Standard
  - Leading Through Change → Standard
  - Leadership Assessment Center → Assessment Center
  - Customer Service Excellence → Standard
- Program types: Standard Program, Coaching, ICF Program, Assessment Center.
- Delivered by (entity → sub-entity):
  - Blanchard Research and Training India LLP → Blanchard
  - Crucial Learning India Pvt Ltd → Crucial Learning
  - BYLD Group Learning Pvt Ltd → BYLD Learning
- Project names: Executive Coaching Program, Leadership Pipeline 2026, New Manager Bootcamp, Sales Leadership Academy, Women Leaders Cohort, Customer First Initiative, Plant Supervisors Upskilling, Change Champions Network.
- Owners: Atul Kumar, Neha Verma, Rohan Kapoor, Priya Sharma, Vikram Rao.
- BD owners: Karan Mehta, Rahul Bansal, Imran Shaikh, Sneha Gupta.
- Each client has 0–8 projects with 1–3 programs each, each program running 3–30 days. Sample totals: 182 projects, 24 live, 27 need action.
- Sample rows:
  - "Sales Leadership Academy · Mindsprint Learning Solutions · 1 program · Next · 3 Dec · 75% · In setup · Rohan Kapoor · 1h ago"
  - "Plant Supervisors Upskilling · Asian Paints Ltd · 2 programs · Running now · 77% · Live · You · 1d ago"

---

## 8. Not reached / caveats
- **Archive** and **Create project** weren't run (as instructed). Their results above come from the code.
- Phone layout comes from the CSS and code only: the browser window is maximised and wouldn't resize.
- People, Logistics, Communication, Go live and After delivery steps (and Assessments and check-ins) are placeholders on the site ("… is on its way").
- "Add a program" (row menu and drawer) is a coming-soon toast on the site.
- The data is mock data generated client-side from seeded random numbers, so counts depend on today's date.
