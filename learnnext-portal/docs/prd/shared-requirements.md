# Shared Requirements

These are the behaviours that apply across the whole LearnNext Admin application. Module PRDs refer to them by ID (`SH-NNN`) rather than repeating them. Where a module behaves differently from a shared requirement, its PRD says so explicitly. The module's behaviour takes precedence.

Statuses use the labels defined in the [PRD template](prd-template.md).

---

## SH-001: Demo data and persistence (current build)

| Item | Requirement | Status |
|---|---|---|
| Data source | The current build runs on built-in demo data. Every list, form and dashboard shows demo records. | Implemented |
| Persistence | Records you create, edit or delete stay changed while the browser tab is open. Reloading the page restores the original demo data. | Implemented |
| Preferences that survive a reload | The following are remembered in the browser: the signed-in session (when "Remember me" is ticked), the theme (light/dark), whether the sidebar is collapsed, profile details, the Settings pins and recently opened masters, and some view choices (client Projects view, client SPOCs view, Manage Content view). | Implemented |
| Simulated response time | Saves and loads take a short, realistic moment. During that time, loading indicators and disabled buttons apply (SH-007). | Implemented |
| QA note | Tests that rely on a created record must run in the same tab without reloading. | Implemented |
| Production behaviour | Once a real back end is connected, data should persist across sessions and users. | Requires Confirmation |

## SH-002: Who uses the application

LearnNext Admin is the internal back-office for the LearnNext learning platform. Its users are LearnNext staff, referred to as **Admin users** in the module PRDs.

- Every page is available to any signed-in Admin user. The current build does **not** hide or block pages or actions by role. **Status:** Implemented.
- The **Roles & Access** master ([settings-access-masters-prd.md](modules/settings-access-masters-prd.md)) lets an Admin define what each admin role may see and do. Those permissions are stored but **not yet enforced** anywhere in the application. **Status:** Partially Implemented.
- Facilitators, client SPOCs and participants appear as *records* in this application, not as users of it. **Status:** Implemented.

## SH-003: Sign-in requirement

| Rule | Behaviour | Status |
|---|---|---|
| Protected pages | Every admin page requires a signed-in session. Opening one while signed out redirects to **Sign in** (`/login`). | Implemented |
| Signed-in user on auth pages | A signed-in user who opens Sign in, Forgot password, Reset password or Reset success is sent into the application instead. | Implemented |
| Session expiry | A dedicated "Session expired" page exists. Automatic expiry and the timeout length are not defined. | Requires Confirmation |

See [authentication-prd.md](modules/authentication-prd.md).

## SH-004: Form validation timing

This is the standard behaviour for forms. Module PRDs note any form that differs.

| Situation | Behaviour | Status |
|---|---|---|
| Required field left empty | No error appears while the user tabs through the form. "Required" errors appear for every empty required field when the user clicks the form's primary action (Save, Add, Continue, Sign in). | Implemented |
| Typed value is invalid (format, duplicate, length) | The error appears when the user leaves a field they have typed in (on blur), and again on submit. | Implemented |
| Correcting a field | The error clears as soon as the value becomes valid. | Implemented |
| Submit with errors | Nothing is saved. The form stays open with the errors shown. | Implemented |
| Leading and trailing spaces | Spaces-only input counts as empty. Most text inputs are trimmed when saved. Module PRDs state which fields this was verified for. | Implemented |

**Known deviations.** The client form's text fields, the SPOC form, the program form and the finance masters show "required" errors as soon as a visited field is left empty. Which behaviour is intended is open as OQ-GEN-005 in [open-questions.md](open-questions.md).

**Default messages.** Fields that use the standard validation rules show these messages unless the module PRD lists a custom one:

| Rule | Default message |
|---|---|
| Required | "This field is required" |
| Email format | "Enter a valid email address" (requires text, an `@`, a domain, a dot and at least 2 characters after the dot, with no spaces) |
| Minimum length | "Must be at least N characters" |
| Maximum length | "Must be N characters or fewer" |
| Matching fields | "Values do not match" |
| Phone | "Enter a valid phone number" (starts with `+` or a digit, then at least 6 more digits, spaces, brackets, dots or dashes) |

## SH-005: Toast notifications

| Item | Behaviour | Status |
|---|---|---|
| Purpose | Short confirmation or error messages after an action ("Client saved", "Couldn't save…"). | Implemented |
| Types | Success, error, warning, info and neutral. | Implemented |
| Duration | Each toast closes automatically after **4 seconds** unless the module sets otherwise. The user can also close it. | Implemented |
| Stacking | At most **4** toasts are visible. A new one pushes out the oldest. | Implemented |
| Actions | Some toasts carry an action button (for example "Undo" or "View"). Module PRDs list them. | Implemented |

## SH-006: Dialogs, modals and drawers

| Item | Behaviour | Status |
|---|---|---|
| Closing | Modals and drawers close with the close (×) button, the **Esc** key, or a click on the dimmed backdrop, unless the module PRD says otherwise. | Implemented |
| While saving | A confirmation dialog cannot be dismissed while its action is in progress, and its buttons are disabled. | Implemented |
| Focus | Keyboard focus stays inside the open dialog. In confirmation dialogs, focus starts on **Cancel**. | Implemented |
| Destructive confirmation | Delete-type actions ask for confirmation in a dialog with **Cancel** and a red confirm button that names the action ("Delete", "Remove"). | Implemented |
| Phones | Modals and confirmation dialogs open as bottom sheets on small screens. | Implemented |
| Unsaved changes | Four pages (Add client, Edit client, Program content, Verify KYC) ask whether to discard changes when the user leaves through the sidebar, breadcrumbs, search or user menu. Browser Back, page reload, Log out and the expanded Support desk card are not intercepted (OQ-GEN-006). | Partially Implemented |
| Known deviation: backdrop | Many form modals (SPOC, program, element, menu, finance masters, Change password) do not close on a backdrop click (OQ-GEN-007). Module PRDs state the behaviour of each dialog. | Requires Confirmation |

## SH-007: Loading, empty and error states

| State | Behaviour | Status |
|---|---|---|
| Loading a page or list | Skeleton placeholders appear in the shape of the content. | Implemented |
| Saving | The primary button shows a spinner and is disabled until the save finishes, which prevents double submission. | Implemented |
| Empty list | A message explains that there are no records yet and, where relevant, offers the add action. | Implemented |
| No search or filter results | A "no results" message appears, with a way to clear the search or filters. | Implemented |
| Load failure | An error state with a retry option. With demo data, load failures do not normally occur. | Implemented |
| Module variations | The Support desk loads instantly: it has no skeletons, spinners or error state (OQ-SUP-015). Read-only lists, such as the location masters, have no add action in their empty state. | Implemented |

## SH-008: List pages (toolbar, search, filters, pagination)

All list pages follow the **All Clients** pattern.

| Element | Behaviour | Status |
|---|---|---|
| Summary pills | Counts by status or category. Clicking a pill filters the list to it. Not shown on phones (SH-013); the filter drawer's Status filter covers them. | Implemented |
| Search | Filters rows as the user types. It matches visible text such as names and codes; each module lists the fields searched. The search box narrows to an icon in medium-width layouts. | Implemented |
| Filters | Lists with a **Filters** button open a filter drawer. The button shows the number of filters applied. | Implemented |
| Result line | While searching or filtering, a line shows "**N** of **Total** \<records>" with a removable chip per filter and a **Clear all** link. | Implemented |
| Pagination | 10 rows per page by default. Page-size choices default to 10, 20 or 50 rows (some lists also offer "All rows"). On phones the pager collapses to "‹ 2 / 9 ›". | Implemented |
| Sorting | Clicking a sortable column header sorts ascending, then descending. On some lists a third click clears the sort. Default sort order is set per module. | Implemented |
| Module variations | Some lists differ from this pattern. Card views have a fixed page size, Menu Mapping shows 50 rows by default, some pills are counts only, and Support desk pill counts follow the current search. Each module PRD documents its own list. | Implemented |
| Phones | Tables either scroll sideways, hide lower-priority columns, or switch to cards. | Implemented |
| Cards | Every card view uses one card build: picture or logo, name, one sub-line and a status / category pill, a quiet action top-right, then facts under a dashed line. Hovering a clickable card firms its edge and adds a soft shadow; the card does not lift or move. | Implemented |

## SH-009: Navigation and page titles

- The header breadcrumb shows the page name. Admin pages have no separate title block.
- Each page sets the browser tab title.
- Menu items for pages that are not built yet open a "Nothing here yet" placeholder (see [app-shell-navigation-prd.md](modules/app-shell-navigation-prd.md)).

## SH-010: Theme and responsive layout

| Item | Behaviour | Status |
|---|---|---|
| Theme | Light, Dark and System (follows the device setting; the default). The choice is remembered (SH-001). The full-screen system pages are always dark (OQ-SYS-010). | Implemented |
| Supported widths | 320 px phones up to wide desktops. The page never scrolls sideways. | Implemented |
| Sidebar | Below 768 px: a bottom tab bar (Home, Clients, Facilitators, Content, More) with the full menu in a slide-out drawer opened by **More**. Medium screens show an icon rail whose edge handle opens the full sidebar over the page; large screens show the full sidebar (see [app-shell-navigation-prd.md](modules/app-shell-navigation-prd.md) 5.14). | Implemented |
| Installable app | The application can be installed to a phone's home screen (and on desktop Chrome / Edge), opens full screen, starts instantly and loads offline; new versions apply when the user taps **Reload** (see [app-shell-navigation-prd.md](modules/app-shell-navigation-prd.md) 5.15). | Implemented |
| Keyboard | Every control is reachable by keyboard and shows a visible focus ring. Icon-only buttons have a tooltip and an accessible label. | Implemented |

## SH-011: Names and duplicates in masters

The Settings masters and similar lists share these rules. Each module PRD confirms the exact rule per field.

- Names are compared without regard to case or surrounding spaces. "Delhi" and " delhi " count as the same name.
- A duplicate name is rejected with an inline error on the field.
- Exact maximum lengths are generally **not** defined in the application. Module PRDs mark them `Requires Confirmation`.

## SH-012: Dates, numbers and currency

| Item | Format | Status |
|---|---|---|
| Dates | Day, short month and year (for example "12 Mar 2026"). | Implemented |
| Relative times | Recent activity uses relative times (for example "2h ago"). | Implemented |
| Currency | Indian Rupees (₹) with Indian digit grouping and no decimals (for example ₹1,80,000). Compact figures use lakhs and crores (for example "₹62.9 L", "₹1.67 Cr"). | Implemented |
| Missing values | Shown as "—". | Implemented |
| Timezone | No timezone handling is defined. | Requires Confirmation |

## SH-013: Phone layout (added 2026-11-03)

Phone-only presentation rules (below 640 px unless stated). Desktop and tablet layouts are unchanged. The aim is calm, uncongested pages: no boxes inside boxes, everything aligned to the 12 px page edge.

| Item | Behaviour | Status |
|---|---|---|
| Page padding | 12 px at the sides, about 14 px above the content. | Implemented |
| Outer panels | On **list pages** and the client list tabs (Projects, Participants, SPOCs) the big outer panel drops its frame (border, shadow, tint) so items sit directly on the page; each item stays its own card. **Detail pages keep their cards** (Overview, Tax & Billing, Settings tab, Profile…), and coloured boxes inside them (upload lanes, Lower TDS facts) are never flattened. | Implemented |
| Card spacing | 12 px between stacked cards on every page (instead of 20–24 px). In every card list (All Clients, Facilitators, Manage Content, Support desk, Settings masters, client tabs) the cards sit 12 px apart and line up with the search box at the 12 px page edge. | Implemented |
| Lists | Tables become one card per row, in the table's default sort order, and the whole card opens the record where the row would. View switches (table / cards, timeline / list, matrix / list, table / board) are hidden below 768 px and the card or list view is always used. Repeated-row tables inside detail pages (e.g. facilitator qualifications) also become one card per row. | Implemented |
| Toolbar | Search box, an icon-only **Filters** button (with a count badge) and an icon-only **Add** button on one line. Summary pills are not shown — neither in the toolbar nor in the filter drawer. | Implemented |
| Tab headings | Headings inside a tab that repeat the tab's name are hidden (the tab bar already names it). | Implemented |
| Detail page heroes | Labelled buttons (back, Edit, View portfolio) move into a vertical ⋮ menu in the hero card's top-right corner. | Implemented |
| Inner boxes | Panels nested inside a card (e.g. the profile contact strip, the password panel, the activity summary) lose their own frame and become rows under dashed lines. | Implemented |
| Text | Long helper and sub-texts are shortened or wrap in full instead of being cut with "…" where the full text matters (labels, descriptions). | Implemented |
| Short sub-texts | Header sub-texts that would wrap at phone width (cards, dialogs, drawers, form sections, tab headers, switches, checkboxes, charts) show a shorter wording on phones and the full sentence from tablet width up — e.g. "By who raised it, category, company, reply or date" → "Raised by, category or date". The short wordings are kept in one list for the whole app. Centred empty-state and error messages keep their full text. | Implemented |
| Smooth scrolling | On phones the page background scrolls with the page and cards are near-solid white without live blur. Only the two bars stay frosted: the header and the bottom tab bar blur what scrolls under them, each with a firmer grey edge line facing the page. Desktop keeps the full frosted-glass look. | Implemented |
| Dropdowns as sheets | Every dropdown — action menus (row ⋯, detail-page ⋮, user menu), date / date-range / time pickers, searchable and multi selects, column and icon pickers — opens on phones as a bottom sheet: full width, rising from the bottom over a dimmed page, grab handle, menu rows in the app's normal 14 px text with a little more height for thumbs; the page behind doesn't scroll; Esc or a tap on the dimmed area closes it — that tap only closes the sheet and never reaches anything behind it (e.g. a drawer's × under the dimmed area). In searchable pickers the search box stays pinned under the grab handle and the "N selected · Clear" footer pinned at the bottom while the list scrolls; the search box is not focused on open (the keyboard appears only when the user taps it). Inside a filter drawer the sheet opens above the drawer and picking keeps the drawer open. Native select boxes keep the phone's own picker; the Add client company-name field keeps its list under the field (you type into it). Desktop keeps anchored dropdowns. | Implemented |
| On-screen keyboard (added 2026-11-04) | Phones and tablets: while the keyboard is open, every bottom sheet, dialog and drawer fits itself into the part of the screen above the keyboard (it never sits behind it). Its body scrolls, and the field being typed in is scrolled into view just above the dialog's buttons. Applies across the app; desktop unchanged. | Implemented |
| Footer | One quiet centred line "© <year> LearnNext · v0.1.0" above the bottom tab bar (no status line). | Implemented |
| Steppers | Horizontal at every width, joined by a line, names under the circles. | Implemented |
| Dialog and drawer footers | Buttons side by side at equal width. | Implemented |
| Side drawers | Every side drawer (filters, ticket chat, history, details) fills the full screen width on phones, with no dimmed strip beside it. | Implemented |
| Header | No hamburger and no theme button; navigation is in the bottom tab bar (SH-010). | Implemented |
