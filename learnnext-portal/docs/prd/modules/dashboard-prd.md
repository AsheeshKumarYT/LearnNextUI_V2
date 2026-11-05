# Dashboard: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Dashboard PRD |
| Module name | Dashboard |
| Document ID | PRD-DASH |
| Version | 1.2 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Implemented (all figures are demo data; see SH-001) |
| Last updated | 2026-11-03 (v1.1: phone layout; v1.2: swipeable key-number row, no greeting on phones) |
| Phone layout (v1.2) | Cards 12 px apart on phones; the **Home** tab of the bottom tab bar opens the Dashboard. No date / "Good afternoon, <name>" greeting on phones — the page opens on the period dropdown and refresh. The four key-number cards (Programs, Next 10 days, Billing, To approve) are one **swipeable row**: each card ~80% wide so the next one peeks in, snapping card by card, a soft fade on the right edge until the last card, no drop shadow (the thin card edge stays), and four dots underneath (current = wider blue dot; tap a dot to jump to that card). Desktop keeps the greeting and the 2 / 4-column grid. See SH-013, PRD-SHELL 5.14. |
| Related modules/pages | [app-shell-navigation-prd.md](app-shell-navigation-prd.md), [authentication-prd.md](authentication-prd.md), [profile-prd.md](profile-prd.md), [clients-prd.md](clients-prd.md), [manage-content-prd.md](manage-content-prd.md), [facilitators-prd.md](facilitators-prd.md), [settings-finance-masters-prd.md](settings-finance-masters-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

The Dashboard is the landing page of LearnNext Admin. It is the first page an Admin user sees after signing in and the page the application opens when the address is just the site root.

Its objective is to give an Admin user a calm, one-screen answer to four questions:

1. **How are programs going?** How many programs exist in the chosen period, how many are completed, and how many are waiting for approval.
2. **What is coming up?** Which program sessions run in the next 10 days and whether anything is live today.
3. **How is billing going?** How much has been invoiced in the period, how much of it is collected, and how the invoiced amount splits across the billing entities. Which clients have billed the most over their lifetime.
4. **How is the partner network doing?** How many trainers, coaches and channel partners are onboarded, the state of partner agreements and upcoming expiries, who leads the partner leaderboard, and which brands and programs are used most and least.

The page is read-only. It has no forms and does not change any record. It offers a reporting-period switch, a refresh action, view toggles inside two cards, and one link to the approval queue.

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Dashboard header | Greets the user, shows today's date and holds the reporting-period switch and Refresh. | Admin user | Change reporting period; Refresh | [profile-prd.md](profile-prd.md) (first name shown in the greeting) |
| KPI strip (4 cards) | The four headline numbers: Programs, Next 10 days, Billing, To approve. | Admin user | Read; follow **Review queue** link | Projects (placeholder, see [app-shell-navigation-prd.md](app-shell-navigation-prd.md)) |
| Program schedule card | Timeline of program sessions in the next 10 days plus a "live today" line. | Admin user | Show all / Show less | — |
| Program status card | Completion ring and the split of programs by status, plus the approval queue summary. | Admin user | Read | — |
| Billing by entity card | Donut of invoiced amount per billing entity, plus collection status. | Admin user | Hover for full amounts | [settings-finance-masters-prd.md](settings-finance-masters-prd.md) (entities) |
| Top clients card | The five clients with the highest lifetime billing and how concentrated billing is. | Admin user | Hover for full amounts | [clients-prd.md](clients-prd.md) |
| Partner network card | Count of onboarded partners split into trainers, channel partners and coaches. | Admin user | Read | [facilitators-prd.md](facilitators-prd.md) |
| Partner agreements card | Agreement status split and agreements expiring in the next 90 days. | Admin user | Read | — |
| Leaderboard card | Top 5 trainers, coaches or partners by points. | Admin user | Switch Trainers / Coaches / Partners | [facilitators-prd.md](facilitators-prd.md) |
| Usage ranking card | Top 5 most- or least-used brands or programs in the period. | Admin user | Switch Brands / Programs and Most used / Least used | [manage-content-prd.md](manage-content-prd.md) |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Admin user (any role) | Full access to the Dashboard (SH-002, SH-003). Reached from the sidebar item **Dashboard**, from the site root, and automatically after sign-in. | View all cards; change the reporting period; refresh; switch card views; open the Review queue link. | No role-based hiding of cards or figures is applied, including billing figures (SH-002). Whether finance figures should be restricted by role is open (OQ-DASH-011). |
| Signed-out visitor | No access. Redirected to Sign in (SH-003). | — | — |

## 5. Page Functionality and Behavior

### 5.1 Page frame and header

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Breadcrumb and tab title | Identify the page. | — | The header breadcrumb shows "Dashboard". The browser tab reads "Dashboard · LearnNext". There is no separate page title block (SH-009). | Always. | User knows where they are. |
| Today's date | Orient the user. | — | Shows the full weekday, day and month above the greeting, for example "Thursday, 29 October". | Uses the device's current date. No year is shown. | — |
| Greeting | Personal welcome. | — | Shows "Good morning, ‹first name›" before 12:00, "Good afternoon, ‹first name›" from 12:00 to 16:59, and "Good evening, ‹first name›" from 17:00. The first name is the first word of the signed-in user's name. If no name is available, it shows "there" (for example "Good morning, there"). | Uses the device's local time at the moment the page is drawn. It does not update while the page stays open. | Updates when the user changes their name on My Profile ([profile-prd.md](profile-prd.md)). |
| Reporting period switch | Choose the time window for period-dependent cards. | Click an option (tablet and desktop) or pick from the dropdown (phones). | On screens 640 px and wider it is a segmented toggle with four options. On phones it is a dropdown with a calendar icon. Selecting an option reloads the dashboard for that period (see 5.2). | Options: **This month**, **Last month**, **Quarter**, **Year**. Default: **Last month**. The choice is not remembered; returning to the page resets it to Last month. | Period-dependent cards update; their period chips show the new period. |
| Refresh button | Reload the figures. | Click the circular-arrow icon button (tooltip "Refresh"). | Reloads the dashboard for the current period. While reloading, the button shows a spinner and the cards dim slightly. | With demo data the figures do not change on refresh (SH-001). | Latest figures shown. |
| Period chip on each card | Say which period a card covers. | Hover the chip. | A tinted chip with a calendar icon. Cards that follow the period switch show the period name and the tooltip "Follows the period filter". Cards with a fixed window show a neutral chip with the tooltip "Fixed period — not affected by the period filter". | Follows the switch: Program status, Billing by entity, Usage ranking. Fixed: Program schedule ("Next 10 days"), Top clients ("Lifetime"), Partner network, Partner agreements and Leaderboard ("Current"). | User can tell which numbers change with the period. |
| Period chip labels | Readable period name. | — | **This month** → "This month"; **Last month** → "Last month"; **Quarter** → "This quarter"; **Year** → "This year". | — | — |
| Entrance animation | Visual polish. | — | Rows rise in one after another. Numbers count up from 0 to their value over about 1 second. Progress lines and bars grow in. | Users who have "reduce motion" switched on see the final numbers immediately. | — |
| Layout | Fit every screen width. | — | Below 1024 px the cards stack in one column. From 1024 px to 1439 px the cards sit in pairs of equal width. From 1440 px the rows use these width splits: Program schedule (wide) + Program status (narrow); Billing by entity + Top clients (half each); Partner network (narrow) + Partner agreements (wide); Leaderboard + Usage ranking (half each). The KPI strip is 1 card per row on phones, 2 per row from 640 px, and 4 in a row from 1280 px. | The page never scrolls sideways (SH-010). | — |

### 5.2 Loading, refresh and period change

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| First load | Show progress. | Open the page. | Skeleton placeholders appear: four KPI-sized blocks and two large blocks (SH-007). | Until the figures arrive (a short simulated delay, SH-001). | Cards replace the skeleton. |
| Period change | Keep context while new figures load. | Choose another period. | The existing cards stay on screen at reduced opacity (no skeletons) until the new figures arrive, then update. Numbers count from their previous value to the new value. | Module-specific behaviour: differs from the SH-007 skeleton pattern on purpose. | Cards show the new period. |
| Load failure | Recover from errors. | — | If the first load fails, an error state replaces the cards with the title "Couldn’t load the dashboard", the error's description and a retry button (SH-007). | Only when no figures have been loaded yet. If a refresh or period change fails after figures were shown, the old figures stay and no message appears (OQ-DASH-009). | User can retry. |

### 5.3 KPI strip

Each card shows an icon, a label, a large number and a one-line note. Three cards have a thin progress line along their bottom edge with the percentage at the end of the note line.

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Programs** card | Total programs in the period and how many are done. | — | Number = total programs in the period. Note: "‹completed› of ‹total› completed". Bottom line filled to the completed share; % = completed ÷ total, rounded to a whole number. | Follows the period. Total = Completed + In progress + Upcoming + Pending approval (see 5.5). % is 0 when total is 0. | e.g. Last month: 68, "39 of 68 completed", 57%. |
| **Next 10 days** card | How many sessions are coming up. | — | Number = count of program sessions dated from tomorrow up to 10 days ahead (each session counts once, even when two sessions of the same program fall on the same day). Note: "‹n› live today" when at least one program is live today, otherwise "None live today". | Fixed window; not affected by the period. | e.g. 9, "None live today". |
| Next 10 days dot calendar | Show how sessions spread over the 10 days. | — | Ten narrow columns, tomorrow first, each labelled with the weekday's initial. Each column shows one dot per session that day, up to 3 dots. A day with no sessions shows one faint dot. | More than 3 sessions on a day still show 3 dots. Screen readers hear "‹total› sessions over the next 10 days" and each day's count. | — |
| **Billing** card | Amount invoiced in the period and how much is collected. | — | Number = invoiced amount in compact rupees (SH-012, e.g. "₹1.67 Cr"). Note: "‹collected amount› collected". Bottom line filled to collected ÷ invoiced; % shown. | Follows the period. | e.g. Last month: ₹1.67 Cr, "₹70.1 L collected", 42%. |
| **To approve** card | Programs waiting for approval. | Click **Review queue**. | Number = programs pending approval in the period. When the number is above 0 the note is a link "Review queue →" that opens the Projects page. When it is 0 the note reads "Nothing waiting". Bottom line filled to pending ÷ total programs; % shown. | Follows the period. The Projects page is a placeholder ("Nothing here yet") in the current build. **[Partially Implemented]** — the link works but its destination is not built (OQ-DASH-004). | e.g. Last month: 14, 21%. |

### 5.4 Program schedule card

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Identify the card. | — | Title "Program schedule", chip "Next 10 days", description "‹n› upcoming sessions" (n = number of sessions, same as the KPI). | Fixed window. | — |
| Live today line | Flag live programs. | — | When programs are live today: a pulsing red dot and "‹n› live today". Otherwise: a calendar-off icon and "Nothing live today". | What counts as "live" is not defined (OQ-DASH-010). In the demo data nothing is live today. | — |
| Session rows | List upcoming sessions in date order. | — | Rows are sorted from soonest to latest. Sessions of the same program for the same client on the same day are merged into one row that lists every start time, one per line. Each row shows: a date tile (short weekday and day number) the first time a date appears, or a connector dot for further rows on the same date; the program title (wraps to at most 2 lines; full title on hover); the client name; up to 3 participant avatars plus a "+n" overflow (hidden below 768 px); and on the right a relative day ("Tomorrow", "In 4 days") with the start time(s), e.g. "9:30 AM". | Rows on the soonest date are highlighted in the primary colour. | e.g. "XSEED Phase I (ALR)" for Hindalco Industries Ltd shows "Tomorrow", "9:30 AM" and "2:00 PM". |
| Preview limit | Keep the card short. | Click **Show all ‹n›** / **Show less**. | Only the first 4 rows show at first. When there are more than 4 rows a full-width button "Show all ‹n›" (n = number of merged rows) appears at the bottom; clicking it shows every row and the button changes to "Show less". | Button is shown only when there are more than 4 rows. The expanded state is not remembered. | e.g. 9 sessions → 8 rows → "Show all 8". |
| Empty state | No sessions. | — | Shows "Nothing scheduled" with "No programs in the next 10 days." | When there are no sessions in the window. | — |

### 5.5 Program status card

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Identify the card. | — | Title "Program status", chip with the period label, description "‹total› programs". | Follows the period. | — |
| Completion ring | Share of programs completed. | — | A ring filled to completed ÷ total with the % in the centre and the word "completed" below it. Beside it: the completed count and "of ‹total› delivered". | % rounded to a whole number. | e.g. 57% · 39 of 68 delivered. |
| Status split bar | Where every program stands. | Hover a segment for "‹status›: ‹count›". | A stacked bar with a legend. Each legend row shows the status, count and share of total: **Completed**, **In progress**, **Upcoming**, **Pending approval**. Segments with 0 are left out of the bar but stay in the legend with 0 and 0%. | Shares are rounded independently and may not add up to exactly 100%. In the current build only **Completed** and **Pending approval** change with the period; **In progress** (6) and **Upcoming** (9) stay the same for every period (OQ-DASH-003). | — |
| Approval queue panel | Summarise the queue. | — | When programs are pending: an hourglass icon, "‹n› awaiting approval" and "‹pct›% of all programs". When none are pending: a check icon, "Approval queue is clear" and "Every program has been reviewed". | This panel is not a link. | — |

### 5.6 Billing by entity card

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Identify the card. | — | Title "Billing by entity", chip with the period label, description "Share of invoiced amount". | Follows the period. | — |
| Donut chart | Show each entity's share of invoiced billing. | Hover a slice for the full rupee amount. | Slices per billing entity, largest first. The centre shows the total of all entities in compact rupees and the word "invoiced". | Colours are assigned by rank. | — |
| Entity legend | Readable values. | Hover a row for "‹name› (‹code›): ‹full amount›". | One row per entity, largest first: colour square, entity name with its code in brackets, compact amount, and share of the total (rounded %). | Long names are cut with an ellipsis. Shares may not add up to exactly 100% because of rounding. | e.g. Last month: Blanchard (B) ₹62.9 L 38%; Leadership Consulting (L) ₹59.9 L 36%; DOOR Training (D) ₹43.1 L 26%; BYLD Consulting (BYLDC) ₹83,500 1%. |
| Collection status panel | Show how much of the invoiced amount is collected. | Hover an amount for the full value. | Heading "Collection status" and a status pill "‹pct›% collected". A bar split into collected (green) and outstanding (red). Below: **Collected** = amount received; **Outstanding** = invoiced − received, both in compact rupees. | Pill tone: green when collected is 60% or more; amber from 25% to 59%; red below 25% (OQ-DASH-006). A part with value 0 is not drawn in the bar. | e.g. This month: 24% → red; Last month: 42% → amber; Year: 71% → green. |

### 5.7 Top clients card

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Identify the card. | — | Title "Top clients", chip "Lifetime", description "By total billing". | Fixed; not affected by the period. | — |
| Ranked list | The 5 biggest clients by lifetime billing. | Hover a row for the full rupee amount. | Each row: rank number (rank 1 in a gradient circle), client name (ellipsis when long), compact amount, and a bar whose length is relative to the rank-1 client (rank 1 = full width). | Five clients in the demo data. The list is not clickable (OQ-DASH-008). | — |
| Concentration summary | How much the top 5 represent and how dominant the leader is. | Hover the first line for the full total. | Line 1: "‹total› from top ‹n› clients". Line 2: "‹leader name› alone is ‹pct›% of it", where pct = leader's billing ÷ top-5 total, rounded. A trailing " Ltd", " Limited" or " Pvt Ltd" is removed from the leader's name in this sentence. | Hidden when the list is empty. | e.g. "₹9.07 Cr from top 5 clients" / "Hindalco Industries alone is 39% of it". |

### 5.8 Partner network card

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Identify the card. | — | Title "Partner network", chip "Current", description "Onboarded partners". | Fixed; not affected by the period. | — |
| Total | Number of onboarded partners. | — | Large number = Trainers + Channel partners + Coaches, followed by the text "partners across 3 roles". | "3 roles" is fixed text. | e.g. 154. |
| Role split bar | Split by role. | Hover a segment. | Stacked bar and legend: **Trainers**, **Channel partners**, **Coaches**, each with count and rounded share. | — | e.g. 136 (88%), 12 (8%), 6 (4%). |

### 5.9 Partner agreements card

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Identify the card. | — | Title "Partner agreements", chip "Current", description "‹total› on file", where total = Active + Pending signature + Expired. | Fixed; not affected by the period. | e.g. "13 on file". |
| Status section | Agreement status split. | Hover a segment. | Heading "STATUS". Stacked bar and legend: **Active**, **Pending signature**, **Expired**, with counts and rounded shares. | Expired is 0 in the demo data, so it shows 0 and 0% and has no bar segment. | e.g. 8 (62%), 5 (38%), 0 (0%). |
| Expiring soon section | Renewal runway. | — | Heading "EXPIRING SOON". Three rows: **Within 30 days**, **31–60 days**, **61–90 days**, each with a count and a bar. The bar length is the count relative to the largest of (Active count, the three expiring counts). When a row's count is above 0, a tag shows next to it: "Renew now" (red, within 30 days), "Plan renewal" (amber, 31–60 days), "On the radar" (blue, 61–90 days). | Rows with 0 show no tag. Whether expiring agreements are also counted as Active is not defined (OQ-DASH-012). | e.g. 2 "Renew now"; 3 "Plan renewal"; 3 "On the radar". |
| Layout | Fit the card width. | — | The two sections sit side by side when the card is wide enough, otherwise stacked. | — | — |

### 5.10 Leaderboard card

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Identify the card. | — | Title "Leaderboard", chip "Current", and a toggle on its own row: **Trainers**, **Coaches**, **Partners**. | Fixed; not affected by the period. Default tab: Trainers. On phones the toggle spans the card width. | — |
| Podium (ranks 1–3) | Celebrate the top three. | — | Three columns in the order 2 · 1 · 3. Each shows the person's or partner's avatar (initials), a rank medal (gold for 1 with a crown above, silver for 2, bronze for 3), the name, "‹points› pts", and a pedestal (tallest for 1). | Names wrap to 2 lines on phones; full name on hover. If fewer than 3 entries exist, the empty slots are blank. | — |
| Ranks 4–5 list | Show the rest of the top 5. | — | Rows with rank number, avatar, name, a one-line detail (e.g. "9 programs delivered", "12 sessions coached", "7 programs sourced") and points. | Only ranks 4 and 5 are shown; no "see all". Ties are shown in list order with no tie rule (OQ-DASH-007). | — |
| Tab switch | Change the ranked group. | Click a toggle option. | The podium and list fade to the selected group's top 5. | Selection is not remembered. | — |

### 5.11 Usage ranking card

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Identify the card. | — | Title "Usage ranking", chip with the period label, description "Times used in programs", and two toggles: **Brands** / **Programs** (accessible name "Rank by") and **Most used** / **Least used** (accessible name "Sort order"). On phones the toggles read "Most" / "Least". | Follows the period. Defaults: Brands, Most used. | — |
| Summary line | Total usage. | — | "‹total› uses in total · top 5 shown", where total = the usage count of **all** brands (or programs), not only the five shown. | — | e.g. Last month, Brands: "96 uses in total · top 5 shown". |
| Share bar | How the top 5 split. | Hover a segment for "‹name›: ‹n› uses". | One bar split into the five shown items, in rank order, shaded from strongest (rank 1) to lightest. Blue shades for Most used, amber shades for Least used. | — | — |
| Ranked list | The five items. | — | Five rows: colour dot, name (ellipsis when long; full name on hover), share of the overall total (hidden on phones), and count. Row 1 is highlighted with a crown icon (Most used) or a falling-trend icon (Least used). | Most used = highest counts first. Least used = lowest counts first. In other periods each count is scaled and never shown as less than 1 (demo behaviour). | e.g. Least used, Brands, Last month: Thinkplace Learning Pvt Ltd 2 first. |

## 6. User Workflow

### 6.1 Land on the dashboard after signing in

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Sign in ([authentication-prd.md](authentication-prd.md)) or open the site root. | Opens the Dashboard (unless the user was sent to sign in from another page, in which case that page opens). | Signed-in session required (SH-003). | Dashboard opens. |
| 2 | — | Shows the header with date and greeting, and skeleton placeholders. | — | User sees progress. |
| 3 | — | Loads the figures for **Last month** and animates the cards in. | — | All cards are visible. |

### 6.2 Change the reporting period

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **This month**, **Quarter** or **Year** (or pick it from the dropdown on phones). | The switch highlights the option; the cards dim while the new figures load. | — | — |
| 2 | — | Programs, Billing, To approve, Program status, Billing by entity and Usage ranking update; their chips show the new period. Next 10 days, Program schedule, Top clients, Partner network, Partner agreements and Leaderboard do not change. | — | Figures reflect the selected period. |

### 6.3 Review the approval queue

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Review queue** on the To approve card. | Opens the Projects page. | Shown only when pending > 0. | Projects page opens; in the current build it is the "Nothing here yet" placeholder (OQ-DASH-004). |

### 6.4 Explore the schedule, leaderboard and usage

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Show all ‹n›** on Program schedule. | All rows appear; button becomes **Show less**. | More than 4 rows exist. | Full 10-day schedule visible. |
| 2 | Click **Coaches** or **Partners** on Leaderboard. | Podium and list switch to that group. | — | Top 5 of that group visible. |
| 3 | Click **Programs** and **Least used** on Usage ranking. | List, bar and summary switch. | — | Five least-used programs visible. |

### 6.5 Refresh

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Refresh**. | Spinner on the button; cards dim; figures reload for the current period. | — | Figures are current (unchanged with demo data). |

## 7. Forms and Field-Level Specifications

The Dashboard has no data-entry forms. Its controls are view selectors.

### 7.1 Header controls

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Reporting period | Segmented toggle (≥ 640 px) / dropdown with calendar icon (phones) | Choose the window for period-dependent cards | Required (always one selected) | N/A | N/A | This month; Last month; Quarter; Year | Last month | None; one option is always selected | Changing it reloads period-dependent cards | N/A |

### 7.2 Card view toggles

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Leaderboard type | Segmented toggle | Choose which group is ranked | Required (always one selected) | N/A | N/A | Trainers; Coaches; Partners | Trainers | None | Spans the card width on phones | N/A |
| Usage – Rank by | Segmented toggle | Rank brands or programs | Required (always one selected) | N/A | N/A | Brands; Programs | Brands | None | — | N/A |
| Usage – Sort order | Segmented toggle | Most or least used first | Required (always one selected) | N/A | N/A | Most used; Least used (phones: Most; Least) | Most used | None | Changes the highlight icon and shade colour | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-DASH-001 | Default period | The dashboard opens on **Last month**. | Every visit. | Period switch shows Last month; chips read "Last month". | — | — |
| BR-DASH-002 | Period-dependent cards | Programs, Billing, To approve, Program status, Billing by entity and Usage ranking follow the period. All other cards use a fixed window. | On period change. | Only the listed cards change; chips state which is which. | — | Chip tooltips "Follows the period filter" / "Fixed period — not affected by the period filter". |
| BR-DASH-003 | Total programs | Total = Completed + In progress + Upcoming + Pending approval. | Programs card, Program status card. | — | — | — |
| BR-DASH-004 | Percentages | Every share = part ÷ whole × 100, rounded to the nearest whole number; 0 when the whole is 0. | All % values. | Shares in a legend may add to 99–101%. | Whole is 0. | Shows 0%. |
| BR-DASH-005 | Outstanding amount | Outstanding = invoiced − collected. | Billing by entity card. | — | — | — |
| BR-DASH-006 | Collection tone | Collected ≥ 60% → green; 25%–59% → amber; < 25% → red. | Collection status pill. | Pill colour per band. | — | "‹pct›% collected". |
| BR-DASH-007 | Next 10 days window | Sessions dated tomorrow through 10 days from today. Today's sessions are counted separately as "live today". | KPI, dot calendar, Program schedule. | — | — | — |
| BR-DASH-008 | Merge same-day sessions | Sessions of the same program title for the same client on the same day appear as one schedule row listing every time. The KPI and card description still count each session. | Program schedule. | Row count can be lower than the session count. | — | "Show all ‹rows›" vs "‹sessions› upcoming sessions". |
| BR-DASH-009 | Schedule preview | Show 4 rows; offer Show all when more than 4. | Program schedule. | — | — | "Show all ‹n›" / "Show less". |
| BR-DASH-010 | Review queue link | The link appears only when pending approvals > 0. | To approve card. | Otherwise "Nothing waiting". | — | — |
| BR-DASH-011 | Usage top 5 | Show 5 items; the total and shares use all items. | Usage ranking. | — | — | "‹total› uses in total · top 5 shown". |
| BR-DASH-012 | Top clients basis | Ranked by lifetime billing; bars relative to rank 1; concentration = leader ÷ top-5 total. | Top clients. | — | — | "‹leader› alone is ‹pct›% of it". |
| BR-DASH-013 | Agreement urgency tags | Within 30 days → "Renew now"; 31–60 days → "Plan renewal"; 61–90 days → "On the radar"; no tag when the count is 0. | Partner agreements. | — | — | Tags as listed. |
| BR-DASH-014 [Partially Implemented] | Period scaling of program statuses | Completed and Pending approval change with the period; In progress and Upcoming do not. | Program status, Programs KPI. | The gap: In progress/Upcoming should arguably reflect the period (OQ-DASH-003). | — | — |
| BR-DASH-015 [Requires Confirmation] | Data source | All figures are demo values, not computed from Clients, Manage Content, Facilitators or finance records (SH-001). | Whole page. | Records added elsewhere do not change any dashboard figure. | — | — |
| BR-DASH-016 | Greeting time bands | Before 12:00 morning; 12:00–16:59 afternoon; 17:00 onwards evening. | Header. | — | — | "Good morning/afternoon/evening, ‹first name›". |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Refresh | Reload in progress | Inline (spinner on Refresh, cards dimmed) | — | During reload | Wait |
| Period change | New period loading | Inline (cards dimmed) | — | During reload | Wait |
| First load fails | Error before any data | Error state | Title "Couldn’t load the dashboard" plus the error description and a retry button | Instead of the cards | Retry |
| No pending approvals | Pending = 0 | Inline text | "Nothing waiting" (KPI); "Approval queue is clear" / "Every program has been reviewed" (Program status) | Always while 0 | — |
| Nothing live today | No live programs | Inline text | "None live today" (KPI); "Nothing live today" (Program schedule) | Always while none | — |
| No toast messages | — | — | The Dashboard does not raise toasts (SH-005). | — | — |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Reporting period | Global filter for period-dependent cards | Reloads those cards | This month, Last month (default), Quarter, Year | See section 11 |
| Program schedule list | Upcoming sessions | Sorted by date and time ascending; 4 rows then Show all | Merged same-day rows | "Nothing scheduled" / "No programs in the next 10 days." |
| Top clients list | Ranked clients | Sorted by lifetime billing, highest first; 5 rows | No sorting controls, no links | Concentration summary hidden when empty; no empty message defined (OQ-DASH-013) |
| Leaderboard | Ranked partners | Sorted by points as provided; top 5 | Trainers / Coaches / Partners | Empty podium slots are blank; no empty message defined (OQ-DASH-013) |
| Usage ranking list | Ranked brands/programs | Sorted by count, descending (Most) or ascending (Least); top 5 | Brands / Programs; Most / Least | The card body is hidden when there are no items; no empty message defined (OQ-DASH-013) |
| Search | — | Not applicable — the Dashboard has no search box. The global ⌘K search is part of the app shell ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)). | — | — |
| Pagination | — | Not applicable — lists are capped at 5 items or use Show all. | — | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| First load in progress | Opening the page | Skeleton placeholders | — | Wait |
| First load fails | Data cannot be loaded | Error state replaces cards | "Couldn’t load the dashboard" + description + retry | Retry |
| Refresh or period change fails after data was shown | Data cannot be reloaded | Old figures remain; dimming ends; no message | None (OQ-DASH-009) | Click Refresh again |
| No sessions in next 10 days | Empty schedule | KPI shows 0, all dots faint; schedule shows empty state | "Nothing scheduled" / "No programs in the next 10 days." | — |
| No programs in period | Total = 0 | Numbers 0, percentages 0%, ring empty | "0 of 0 completed" | Pick another period |
| Nothing invoiced | Invoiced = 0 | 0%; collection bar empty | "0% collected" (red pill) | — |
| Pending approval = 0 | Queue empty | Link replaced by text | "Nothing waiting"; "Approval queue is clear" | — |
| More than 3 sessions on one day | Busy day | Dot calendar caps at 3 dots | — | Open Show all in the schedule |
| Long names | Long client/program/partner names | Truncated with ellipsis or wrapped to 2 lines; full text on hover | — | Hover |
| Reduced motion | User setting | No count-up or growth animations; final values shown | — | — |
| Name not available | Signed-in user has no name | Greeting uses "there" | "Good morning, there" | Add name on My Profile |
| Date crosses midnight while open | Page left open | Greeting, date, "Tomorrow"/"In n days" labels and the 10-day window do not update until the page reloads | — | Refresh the browser page |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| [authentication-prd.md](authentication-prd.md) | Dashboard is the default destination after sign-in and for the site root. | Sign in | User lands on the Dashboard. | SH-003 |
| [app-shell-navigation-prd.md](app-shell-navigation-prd.md) | Sidebar item **Dashboard**; breadcrumb; Projects placeholder target of Review queue. | Click sidebar item / Review queue | Opens Dashboard / Projects placeholder. | SH-009, BR-DASH-010 |
| [profile-prd.md](profile-prd.md) | Greeting uses the first word of the profile name. | Save a new name on My Profile | Greeting shows the new first name. | BR-DASH-016 |
| [clients-prd.md](clients-prd.md) | Top clients and schedule show client names that also exist in All Clients. | — | No live link: figures are not computed from client records. | BR-DASH-015 |
| [manage-content-prd.md](manage-content-prd.md) | Usage ranking and schedule show program and brand names. | — | No live link to program records. | BR-DASH-015 |
| [settings-finance-masters-prd.md](settings-finance-masters-prd.md) | Billing by entity lists billing entities (Blanchard, Leadership Consulting, DOOR Training, BYLD Consulting). | — | Entities added in the Entity master do not appear on the Dashboard. | BR-DASH-015 |
| [facilitators-prd.md](facilitators-prd.md) | Partner network counts and Leaderboard relate to trainers/coaches/partners. | — | Not computed from facilitator records. | BR-DASH-015 |

## 13. Acceptance Criteria

**AC-DASH-001: Default view**
- Given a signed-in Admin user
- When they open the Dashboard
- Then the period switch shows **Last month**
- And the Programs card shows 68 with "39 of 68 completed" and 57%
- And the Billing card shows "₹1.67 Cr" with "₹70.1 L collected" and 42%.

**AC-DASH-002: Greeting**
- Given the signed-in user's name is "Atul Kumar" and the local time is 10:15
- When the Dashboard opens
- Then the header shows "Good morning, Atul" under today's date.

**AC-DASH-003: Period change updates only period-dependent cards**
- Given the Dashboard shows Last month
- When the user selects **Year**
- Then Programs shows 576, Program status shows "576 programs" and 72% completed, To approve shows 148, and Billing shows "₹17.68 Cr"
- And their chips read "This year"
- And Program schedule, Top clients, Partner network, Partner agreements and Leaderboard are unchanged.

**AC-DASH-004: Collection status bands**
- Given the Billing by entity card
- When the period is This month (24% collected)
- Then the pill reads "24% collected" in red
- And when the period is Last month (42%) the pill is amber
- And when the period is Year (71%) the pill is green.

**AC-DASH-005: Review queue link**
- Given pending approvals are greater than 0
- When the user clicks **Review queue** on the To approve card
- Then the Projects page opens.
- Given pending approvals are 0
- Then the note reads "Nothing waiting" and there is no link.

**AC-DASH-006: Schedule merge and preview**
- Given two sessions of "XSEED Phase I (ALR)" for Hindalco Industries Ltd tomorrow at 9:30 AM and 2:00 PM, and 9 sessions in total
- When the Dashboard opens
- Then the schedule shows one row for that program with both times and "Tomorrow"
- And the card description reads "9 upcoming sessions"
- And only 4 rows are visible with a **Show all 8** button
- When the user clicks it
- Then 8 rows are visible and the button reads **Show less**.

**AC-DASH-007: Nothing scheduled (negative)**
- Given there are no sessions in the next 10 days
- When the Dashboard opens
- Then the Next 10 days KPI shows 0
- And the schedule shows "Nothing scheduled" and "No programs in the next 10 days."
- And no Show all button appears.

**AC-DASH-008: Leaderboard tabs**
- Given the Leaderboard shows Trainers
- When the user clicks **Partners**
- Then the podium shows the top three channel partners with points, rank 1 in the centre with a crown
- And ranks 4 and 5 show with their "programs sourced" detail.

**AC-DASH-009: Usage ranking**
- Given period Last month, Brands, Most used
- Then the summary reads "96 uses in total · top 5 shown" and the first row is "Blanchard Research And Training India LLP" with 37 and a crown
- When the user selects **Least used**
- Then the first row is "Thinkplace Learning Pvt Ltd" with 2 and a falling-trend icon.

**AC-DASH-010: Load failure (negative)**
- Given the first load of dashboard figures fails
- When the page renders
- Then "Couldn’t load the dashboard" with a retry button appears instead of the cards
- When the user retries and the load succeeds
- Then the cards appear.

**AC-DASH-011: Refresh**
- Given figures are displayed
- When the user clicks **Refresh**
- Then the button shows a spinner and the cards dim until the figures reload.

**AC-DASH-012: Responsive period control**
- Given a screen narrower than 640 px
- Then the period control is a dropdown with the same four options
- And the page does not scroll sideways at 320 px.

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-DASH-001 | AC-DASH-001, BR-DASH-001 | Default period and KPIs | Signed in, fresh tab | — | Last month selected; Programs 68 / 57%; Next 10 days 9 / "None live today"; Billing ₹1.67 Cr / ₹70.1 L / 42%; To approve 14 / 21% | P1 |
| TC-DASH-002 | AC-DASH-003 | This month | Dashboard open | Select This month | Programs 39, "18 of 39 completed", 46%; Billing ₹75.1 L, "₹18 L collected", 24%; To approve 6, 15% | P1 |
| TC-DASH-003 | AC-DASH-003 | Quarter | Dashboard open | Select Quarter | Programs 163, 67%; Billing ₹4.67 Cr, ₹1.77 Cr collected, 38%; To approve 39, 24%; chips "This quarter" | P1 |
| TC-DASH-004 | AC-DASH-003 | Year | Dashboard open | Select Year | Programs 576, 72%; Billing ₹17.68 Cr, ₹12.55 Cr collected, 71%; To approve 148, 26%; chips "This year" | P1 |
| TC-DASH-005 | BR-DASH-002 | Fixed cards do not change | Dashboard open | Switch through all 4 periods | Schedule, Top clients (₹9.07 Cr), Partner network (154), Agreements (13 on file), Leaderboard unchanged | P2 |
| TC-DASH-006 | BR-DASH-006, AC-DASH-004 | Collection band boundaries | Dashboard open | This month 24%, Last month 42%, Year 71% | Red, amber, green pill respectively (boundary just below 25% → red) | P2 |
| TC-DASH-007 | BR-DASH-016 | Greeting bands | Set device clock | 11:59, 12:00, 16:59, 17:00 | Morning, Afternoon, Afternoon, Evening | P3 |
| TC-DASH-008 | AC-DASH-005 | Review queue link | Pending > 0 | Click Review queue | Projects placeholder page opens | P2 |
| TC-DASH-009 | AC-DASH-006, BR-DASH-008/009 | Schedule merge and Show all | Default demo data | — | 8 rows, 4 visible, "Show all 8"; XSEED Phase I row shows 9:30 AM and 2:00 PM; Show less collapses | P2 |
| TC-DASH-010 | 5.3 Dot calendar | Dot calendar | Default demo data | — | 10 columns; tomorrow 2 dots; days 4 and 8 one faint dot each | P3 |
| TC-DASH-011 | 5.6 | Entity legend | Last month | — | B ₹62.9 L 38%, L ₹59.9 L 36%, D ₹43.1 L 26%, BYLDC ₹83,500 1%; hover shows full amounts | P2 |
| TC-DASH-012 | BR-DASH-012 | Top clients summary | — | — | "₹9.07 Cr from top 5 clients"; "Hindalco Industries alone is 39% of it" | P3 |
| TC-DASH-013 | BR-DASH-013 | Agreement tags | — | — | Within 30 days 2 "Renew now"; 31–60 days 3 "Plan renewal"; 61–90 days 3 "On the radar"; Expired 0 with no bar segment | P3 |
| TC-DASH-014 | AC-DASH-008 | Leaderboard tabs | — | Click Trainers, Coaches, Partners | Each shows its top 5; podium order 2·1·3; crown on rank 1 | P3 |
| TC-DASH-015 | AC-DASH-009, BR-DASH-011 | Usage toggles | Last month | Brands/Programs × Most/Least | Brands total 96, Programs total 75; correct order; shares hidden on phones | P3 |
| TC-DASH-016 | BR-DASH-011 | Usage scaling minimum | This month | Brands, Least used | Thinkplace Learning shows 1 (never 0); total 44 | P3 |
| TC-DASH-017 | AC-DASH-010 | First-load failure | Simulate load failure | — | Error state with retry; retry recovers | P2 |
| TC-DASH-018 | AC-DASH-011 | Refresh | Dashboard loaded | Click Refresh | Spinner, dimmed cards, same figures afterwards | P3 |
| TC-DASH-019 | AC-DASH-012, SH-010 | Responsive | — | 320, 375, 768, 1024, 1440 px | No sideways scroll; dropdown period control below 640 px; layouts as in 5.1 | P2 |
| TC-DASH-020 | 5.1 | Reduced motion | OS reduce-motion on | — | Numbers show final values instantly | P3 |
| TC-DASH-021 | 12 | Name change reflected | On My Profile change name to "Priya Shah" and save | Return to Dashboard | Greeting shows "Priya" | P3 |
| TC-DASH-022 | BR-DASH-001 | Period not remembered | Select Year, go to All Clients, return | — | Period is back to Last month | P3 |

## 15. Open Questions and Gaps

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
| OQ-DASH-011 | Access | Billing figures are visible to every admin role. | Finance data may be sensitive. | Confirm role restrictions once Roles & Access is enforced. | Open |
| OQ-DASH-012 | Partner agreements | Whether expiring agreements are included in Active, and whether Pending signature agreements can expire, is not stated. | Totals may double count. | Confirm bucket rules. | Open |
| OQ-DASH-013 | Top clients, Leaderboard, Usage ranking | No empty-state message is defined when these lists have no data. | New installations would show blank cards. | *Proposed:* "No data for this period yet." | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Module and page overview: Complete
- [x] User roles and access: Complete (role restrictions open, OQ-DASH-011)
- [x] Page functionality and behavior for every card and control: Complete
- [x] User workflows: Complete
- [x] Fields and controls documented with all columns: Complete (view controls only; no data entry)
- [ ] Metric definitions and data sources: Incomplete (demo data; see OQ-DASH-001, OQ-DASH-002, OQ-DASH-010)
- [x] Validation and business rules: Complete
- [x] Messages and feedback: Complete
- [x] Search, filters, tables and listings: Complete
- [ ] Empty states and errors: Incomplete (no empty messages for three lists, no refresh-failure message; see OQ-DASH-009, OQ-DASH-013)
- [x] Minimum and maximum constraints, where known: Not applicable (no data-entry fields)
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria incl. negative cases: Complete
- [x] QA test scenarios with real boundaries: Complete
- [x] Open questions logged: Complete
