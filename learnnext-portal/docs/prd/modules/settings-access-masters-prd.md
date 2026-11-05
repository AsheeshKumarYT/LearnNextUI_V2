# Settings – Access Masters: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Settings – Access Masters PRD |
| Module name | Settings – Access Masters (Menu Mapping & Access, Roles & Access) |
| Document ID | PRD-ACC |
| Version | 1.0 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (both masters can be maintained, but menu changes are not applied to the real sidebar and role permissions are not enforced anywhere) |
| Last updated | 2026-10-29 |
| Related modules/pages | [settings-hub-prd.md](settings-hub-prd.md), [app-shell-navigation-prd.md](app-shell-navigation-prd.md), [authentication-prd.md](authentication-prd.md), [profile-prd.md](profile-prd.md), [dashboard-prd.md](dashboard-prd.md), [clients-prd.md](clients-prd.md), [manage-content-prd.md](manage-content-prd.md), [facilitators-prd.md](facilitators-prd.md), [support-desk-prd.md](support-desk-prd.md), [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

The **Others** group in Settings ("Roles, menus and access.") holds two masters that together describe the admin portal's navigation and who may use it:

- **Menu Mapping & Access** ("Pages in the admin menu and their order"): the list of pages in the admin menu, which parent each sits under, the page address it opens, its icon and its position (priority).
- **Roles & Access** ("What each admin role can see and do"): for each admin role, which menu pages it may open and which actions (View, Add, Edit, Delete, Export, Approve) it may perform on each page.

Objectives:

- Let Admin users maintain the admin menu as a two-level tree (top-level menus and sub-menus) with a clear, visual way to set the order.
- Prevent broken menus: unique names among siblings, unique page addresses, no deleting a menu that still has sub-menus, no nesting deeper than one level.
- Let Admin users set each role's permissions page by page in one grid, with shortcuts to grant a whole page or a whole action at once, and protect unsaved edits.
- Keep Super Admin permanently at full access.

**Current limitation (applies to the whole module):** neither master changes how the application behaves. The sidebar is fixed and does not read the Menu Mapping master, and the permissions saved in Roles & Access are not applied to any page, menu or action (SH-002, OQ-SHELL-012, OQ-ACC-001, OQ-ACC-002).

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Menu Mapping & Access list (Settings › Menu Mapping & Access) | View and maintain the admin menu as a tree table | Admin user | Filter by level pill, search, fold/unfold parents, paginate, add, edit, delete | Roles & Access, App shell sidebar (not linked) |
| Add / Edit menu modal | Enter a menu's details and place it in the menu | Admin user | Choose module, type names and address, pick parent and icon, move the item in the priority preview, save, cancel | Menu Mapping list |
| Icon picker | Choose the menu's icon from a searchable grid | Admin user | Search icons, pick one | Add / Edit menu modal |
| Delete menu dialogs | Confirm deletion, or explain why it is blocked | Admin user | Delete, cancel, close | Menu Mapping list |
| Roles & Access page (Settings › Roles & Access) | Set what each admin role can open and do | Admin user | Search roles, pick a role, search pages, tick permissions (single, whole page, whole action), discard, save | Menu Mapping & Access |
| Switch-role discard dialog | Protect unsaved permission changes | Admin user | Keep editing, Discard | Roles & Access |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Admin user (any signed-in LearnNext staff member) | Both pages (SH-002, SH-003) | All actions in section 3 | A menu with sub-menus cannot be deleted or moved under another menu. Super Admin's permissions cannot be changed. Roles cannot be added, renamed or deleted. The permissions defined on the Roles & Access page are not enforced, so they do not restrict this or any other page (SH-002). |
| Admin roles defined in the master (Super Admin, Admin, Finance Manager, Program Manager, Support Executive) | Not applied | — | These roles are records only; signing in does not assign a role and no page reads the role's permissions [Partially Implemented] (OQ-ACC-002) |
| Signed-out visitor | None | None | Redirected to Sign in (SH-003) |

## 5. Page Functionality and Behavior

### 5.1 Menu Mapping & Access list

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Entry and breadcrumb | Reach the master | Open from Settings (Others group) | Header breadcrumb "Settings › Menu Mapping & Access" (SH-009). Opening it adds it to Settings "Recently opened" | See [settings-hub-prd.md](settings-hub-prd.md) | Page shown |
| Summary pills | Count and filter by level | Click | "All menus", "Top-level", "Sub-menus" with counts. Tooltips: "Show the whole menu", "Show top-level menus only", "Show sub-menus only" | Demo data: 17 menus, 11 top-level, 6 sub-menus (SH-001) | Filtered list |
| Search | Find a menu | Type in "Search menu, page or URL…" | Filters as the user types (short pause) on menu name, page name, page URL, parent menu name and module, case-insensitive. Typing "Finance" also lists Finance's sub-menus because their parent name matches | SH-008. Because every menu's module is "Admin", typing "admin" matches every menu | Matching rows |
| **Add menu** button | Create a menu | Click | Opens the Add menu modal (section 5.2) | At the right end of the toolbar | Modal opens |
| Tree table | Show the menu as it is ordered | View | Each top-level menu, in priority order, followed by its sub-menus in priority order. Sub-menus are indented under their parent with a connector line | No column sorting; order always follows the menu. Caption for assistive technology: "Admin menu" | — |
| Fold / unfold toggle | Hide or show a parent's sub-menus | Click the chevron before a parent | Hides or shows that parent's sub-menus. Labels: "Hide \<name>’s sub-menus" / "Show \<name>’s sub-menus" | Only on top-level menus that have sub-menus, and only when no search or pill filter is active. All parents start unfolded; the folded state is forgotten when the page is left | Rows hidden / shown |
| Menu column | Identify | — | Icon tile and menu name. A parent shows "N sub-menus" ("1 sub-menu") under its name. While a search or pill filter is active, rows are listed flat (no indent, no chevron) and each sub-menu shows "under \<Parent>" | Menus with no icon show a generic page icon | — |
| Module column | Which portal the menu belongs to | — | Shield icon and "Admin" | Only "Admin" exists (OQ-ACC-006) | — |
| Page name column | Page title | — | Page name, truncated when long | — | — |
| Page URL column | Address the menu opens | Hover | Address in a code-style chip; the full address shows on hover | — | — |
| Priority column | Position among siblings | Hover | Number in a small circle. Tooltip "Position N in the menu" (top-level) or "Position N under \<Parent>" (sub-menu) | Numbers run 1…n within each sibling group with no gaps or ties (BR-ACC-009) | — |
| Row actions | Edit / delete | Click pencil or bin | Pencil opens Edit menu; bin opens a delete dialog (section 5.4). Labels "Edit \<name>", "Delete \<name>" | Plain ghost icons | — |
| Row click | Quick edit | Click a row | Opens the Edit menu modal | Not when clicking the chevron or the row actions | Modal opens |
| Phone card | Phone layout | Tap | Icon, title = menu name; subtitle "Under \<Parent> · #N" (sub-menu), "N sub-menus · #N" or "Top-level · #N" (top-level); footer = page URL; edit/delete actions. Tapping the card opens Edit | SH-008 phones | — |
| Table settings | Paging | Choose page size | 50 rows per page by default; options 20, 50 or All rows | Differs from SH-008 (default 10, options 10/20/50). Paging counts visible rows, so a parent and its sub-menus can fall on different pages in a long menu | — |
| Result line | Filter summary | — | While searching or filtering: "N of Total menus" with **Clear all** (SH-008) | — | — |
| Sidebar link [Partially Implemented] | The master is meant to drive the admin menu | Add, edit, reorder or delete a menu | The change is saved in this master only. The application sidebar, the "Jump to" list in search and the routing are **not** affected | OQ-ACC-001, OQ-SHELL-012 | Sidebar unchanged |

### 5.2 Add / Edit menu modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Title and description | Context | — | Add: "Add menu" / "A page in the admin menu, and where it sits." Edit: "Edit menu" / "\<name> · \<URL>" | Large modal: fields on the left, Priority preview on the right (stacked on narrow screens); bottom sheet on phones (SH-006) | — |
| Fields | Menu details | Type / choose | Module, Menu name, Parent menu, Page name, Page URL, Icon (section 7.1). Focus starts in Menu name | — | — |
| Page name follows Menu name | Save typing | Type a menu name | Page name copies the menu name as it is typed, until the user types in Page name themselves | In Edit, Page name keeps following only if it was the same as the menu name when the modal opened | Page name filled |
| Parent menu lock | Keep one level of nesting | — | When editing a menu that has sub-menus, Parent menu is disabled with helper "Has sub-menus, so it stays top-level." | BR-ACC-004 | — |
| Priority preview | Set the position visually | See 5.3 | Live preview of the sibling list the menu will sit in | — | — |
| **Save menu** / **Save changes** | Save | Click | Validates (section 7.1). If valid: saves with a spinner (SH-007), shows a success toast, closes and refreshes the list. Siblings are renumbered so the order has no gaps | In Edit, the button is disabled until something differs from the opened values (any field or the priority). Adding or removing spaces counts as a change | Saved |
| Enter key [Requires Confirmation] | Keyboard save | Press Enter in a text field | No dedicated Enter-to-save behaviour is defined for this form | OQ-ACC-016 | — |
| **Cancel** / × / Esc | Close | Click / press | Closes directly when nothing changed; asks first when anything changed (section 5.5) | Clicking the dimmed backdrop does **not** close this modal (differs from SH-006). Cancel is disabled while saving | — |

### 5.3 Priority preview (inside the menu modal)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Heading and position | Show the current position | — | "Priority" with "N of M" on the right (M = number of siblings + 1) | — | — |
| Preview list | Show where the menu will appear | View | When a parent is chosen, the parent appears at the top with an open chevron and its sub-menus are listed indented below; otherwise the top-level menus are listed. The menu being edited is highlighted with its chosen icon (generic icon until one is picked) and its name, or "New menu" while the name is empty | The list scrolls when long and keeps the highlighted item in view | — |
| **Move up** / **Move down** buttons | Change position by one | Click ↑ / ↓ on the highlighted item | Moves the item one place up or down | ↑ disabled at position 1; ↓ disabled at the last position | Position changes |
| Arrow keys | Keyboard reordering | Focus the preview box, press ↑ / ↓ | Same as the buttons. Accessible name: "Priority — position N of M. Use the up and down arrow keys to move it." | Focus ring shown on the box | Position changes |
| Click a spot | Jump to a position | Click any other menu in the preview | The item takes that menu's place (the others shift by one). Tooltip "Move here (position N)" | Other menus are not reachable by Tab; the keyboard uses the arrow keys | Position changes |
| Helper text | Explain controls | — | "Click a spot, or use the ↑ ↓ keys / buttons." | — | — |
| Default position | Sensible start | Open Add; change Parent | A new menu starts at the end of the top-level list. Choosing or clearing a parent moves the item to the end of the new sibling list | In Edit, the saved position is shown | — |

### 5.4 Delete menu dialogs

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Delete (no sub-menus) | Confirm removal | Click bin | Dialog "Delete this menu?" / "\<name> (\<URL>) will be removed from the admin menu." with **Cancel** and red **Delete** (SH-006) | No check of whether roles have access to it (OQ-ACC-011) | On Delete: toast "Menu deleted" (description = name); the remaining siblings are renumbered; list refreshes |
| Delete blocked (has sub-menus) | Explain and redirect | Click bin on a parent | Information dialog "\<name> can’t be deleted yet" / "It has N sub-menus. Move them under another menu or delete them first." ("It has 1 sub-menu. …"). Buttons **Close** and **OK**, both of which only close the dialog | No Delete button is offered | Dialog closes |
| Delete failure | Safety net | — | If the menu gained sub-menus in the meantime: toast "Couldn’t delete the menu" with "It has N sub-menus — move or delete them first." ("It has 1 sub-menu — move or delete it first.") | — | Dialog stays open |

### 5.5 Discard-changes dialog (menu modal)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Discard dialog | Prevent accidental loss | Close a changed modal with Cancel, × or Esc | Add: "Discard this menu?" / "The details you’ve entered won’t be saved." Edit: "Discard your changes?" / "Your edits to this menu won’t be saved." Buttons **Keep editing** and **Discard** | Any field or priority change counts. Not shown while saving | Discard closes without saving; Keep editing returns to the form |

### 5.6 Icon picker

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Icon field | Show and open the choice | Click | Looks like a select: placeholder "Choose an icon", or the chosen icon with its name (for example "Mail check"). Opens a panel below | Red outline when the field shows an error | Panel opens |
| Icon search | Find an icon by meaning | Type in "Search icons — e.g. money, people, report" | Narrows the grid as the user types. Each icon has a name and everyday keywords (for example Wallet: "wallet payouts money"; Headset: "support help desk"). Several words narrow further: every word must appear in the icon's name or keywords | Case-insensitive; partial words match ("peo" finds people icons). Focus starts in the search box | Matching icons |
| Icon grid | Pick an icon | Click an icon | 156 icons in 8 columns, roughly grouped (navigation, people, communication, documents, learning, time, business and money, data, support and security, settings, places and misc). Hover shows the icon's name. The current choice is highlighted | Picking closes the panel and clears the search | Icon chosen |
| Count line | Feedback | — | "N icons" under the grid (for example "156 icons") | Updates with the search | — |
| No match | Feedback | — | "No icons match “\<text>”" | — | Change the search |
| Close panel | Dismiss | Click outside / Esc | Panel closes; the search is cleared; the choice is unchanged | — | — |

### 5.7 Roles & Access page

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Entry and breadcrumb | Reach the master | Open from Settings (Others group) | Breadcrumb "Settings › Roles & Access" (SH-009). Two panes in one card: roles on the left, the selected role's permissions on the right | On phones and tablets the roles become a horizontal strip above the grid | — |
| Roles list | Choose a role | Click a role | Heading "Roles" with the number of roles (large screens). Each role shows a role icon in the role's colour and its name; Super Admin also shows a lock ("Locked"). The selected role sits on a white pill | Five demo roles: Super Admin, Admin, Finance Manager, Program Manager, Support Executive (SH-001) | Role selected |
| Default role | Start where editing is possible | Open the page | The first role that can be edited (**Admin**) is selected, not Super Admin | — | Admin shown |
| Role search | Find a role | Type in "Search roles…" | Filters roles by name, case-insensitive. A clear (×) button "Clear role search" appears while text is entered. No match: "No roles match “\<text>”" | The selected role stays selected and shown on the right even if the search hides it | Filtered roles |
| Role header | Summarise the role | View | Initials tile in the role's colour, role name, description (hidden on phones), "N people" ("1 person") and "Opens X of Y pages" | Y counts pages only (a parent that only groups sub-pages, such as Finance, is not counted). X = pages with View ticked in the current, unsaved state | — |
| Locked note | Explain Super Admin | Select Super Admin | Note: "Super Admin always has every permission on every page — it can’t be changed." Every checkbox is ticked and disabled; no save bar appears | Super Admin automatically has every available action on every page, including menus added later (BR-ACC-013) | Read-only |
| Page search | Find pages in the grid | Type in "Search pages…" | Filters rows by page (menu) name, case-insensitive. A parent stays when it or any of its sub-pages matches; when the parent matches, all its sub-pages stay; a sub-page that matches is shown with its parent | Does not match page addresses. No clear button | Filtered rows |
| Permission grid | Show and edit the role's permissions | View | Rows = the menu from Menu Mapping & Access, in menu order, with sub-pages indented under their parent (connector line). Columns: Page, View, Add, Edit, Delete, Export, Approve. Each row shows the menu icon (highlighted when the page can be opened), the name, and either the page address or "N sub-pages" for a parent | Header row stays visible while scrolling. The grid scrolls sideways on narrow screens | — |
| Unavailable action | Show what does not apply | Hover | A short dash instead of a checkbox. Tooltip "\<Action> isn’t available on this page" | Which actions each page offers: see BR-ACC-012 | — |
| Single checkbox | Grant or remove one action | Click | Ticks or clears that action for that page. Accessible name "\<Action> — \<page>" | Ticking any action also ticks View. Clearing View clears every action on that row (BR-ACC-011) | Draft updated |
| Row checkbox (before the icon) | Full access to a page | Click | Ticks every available action on the page, or clears them all. Accessible name "Full access to \<page>" | Shows ticked when all are on, a dash (mixed) when some are on | Draft updated |
| Parent row checkboxes | Set a group at once | Click a checkbox on a parent row (for example Finance) | Row checkbox: full access on, or all off, for every sub-page. Action checkbox: sets that action on every sub-page that offers it | Shows mixed when sub-pages differ. A dash appears where no sub-page offers the action | Draft updated |
| Column header checkbox | Grant or remove an action everywhere | Click the checkbox beside an action name | Sets that action on every page that offers it. Tooltip and accessible name "\<Action> on every page" | Applies to **all** pages, even when a page search is hiding some rows (OQ-ACC-009). Ticking any column also ticks View on those pages; clearing View clears all actions on every page | Draft updated |
| Save bar | Show and commit unsaved changes | — | When the draft differs from the saved permissions, a bar slides up: "N unsaved changes to \<role>" ("1 unsaved change …") with **Discard** and **Save changes** | N counts each page-and-action pair that differs from the saved state; changing a box back removes it from the count | — |
| **Save changes** | Commit | Click | Saves with a spinner (SH-007); toast "Access saved" with "\<role> · N changes" ("· 1 change"); the bar disappears | Discard is disabled while saving | Saved |
| **Discard** | Undo the draft | Click | Restores the saved permissions immediately, without a confirmation dialog | — | Bar disappears |
| Switch role with unsaved changes | Protect the draft | Click another role | Dialog "Discard your changes?" / "Your N unsaved changes to \<role> won’t be saved." ("Your 1 unsaved change …") with **Keep editing** and **Discard** | Without unsaved changes the role switches at once | Discard switches role and drops the draft |
| Leaving the page [Partially Implemented] | — | Click a sidebar item, breadcrumb, or browser Back with unsaved changes | The page closes without asking and the draft is lost | Roles & Access is not one of the guarded pages (see [app-shell-navigation-prd.md](app-shell-navigation-prd.md), OQ-ACC-008) | Changes lost |
| Add / edit / delete role [Not Implemented] | Manage the role list | — | No control exists to add, rename, describe, recolour or delete a role, or to assign people to a role | OQ-ACC-003 | — |
| Enforcement [Partially Implemented] | Restrict what each role can do | Save permissions | Saved permissions are kept for the session (SH-001) but nothing in the application reads them: every Admin user still sees every page and action | SH-002, OQ-ACC-002 | No effect |

## 6. User Workflow

### 6.1 Add a sub-menu

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Add menu** | Modal opens; Module = "Admin"; focus in Menu name; preview shows the top-level menus with "New menu" at the end | — | — |
| 2 | Type "Payment Runs" | Page name fills with "Payment Runs"; preview shows the name | — | — |
| 3 | Choose Parent menu "Finance" | Preview shows Finance with its six sub-menus; the item moves to position 7 of 7 | Only top-level menus are offered | — |
| 4 | Type Page URL "/finance/payment-runs", choose an icon | — | URL has no spaces and is not used by another menu | — |
| 5 | Move the item up with ↑ to position 2 | Preview shows "2 of 7" | — | — |
| 6 | Click **Save menu** | Checks fields; saves; toast "Menu added" / "Payment Runs · /finance/payment-runs"; modal closes | All required fields filled; name unique under Finance | Payment Runs appears under Finance at position 2; the later sub-menus shift down by one |
| 7 | Open Roles & Access | The new page appears under Finance in the grid with View, Add, Edit, Delete, Export available | — | Not ticked for Admin, Finance Manager, Program Manager or Support Executive; ticked for Super Admin. The real sidebar does **not** show it (OQ-ACC-001) |

### 6.2 Reorder a top-level menu

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the Reports row | Edit menu opens; preview highlights Reports at "10 of 11"; **Save changes** disabled | — | — |
| 2 | Click "Dashboard" in the preview | Reports takes position 1 | — | **Save changes** enabled |
| 3 | Click **Save changes** | Toast "Menu updated" / "Reports · /reports" | — | Reports is first in the tree; the others shift down by one |

### 6.3 Try to delete a parent menu

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the bin on Finance | Dialog "Finance can’t be deleted yet" / "It has 6 sub-menus. Move them under another menu or delete them first." | Menu has sub-menus | — |
| 2 | Click **OK** or **Close** | Dialog closes | — | User moves or deletes the sub-menus, then deletes the parent |

### 6.4 Change a role's permissions

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Roles & Access | Admin is selected; grid shows Admin's permissions | — | — |
| 2 | Select "Support Executive" | Grid shows its permissions; header "Opens 4 of 16 pages" | No unsaved changes | — |
| 3 | Tick Export on "Support desk" | View stays ticked; save bar "1 unsaved change to Support Executive" | — | — |
| 4 | Click the Finance row checkbox | Every available action on all six Finance sub-pages is ticked | — | Count increases |
| 5 | Click **Save changes** | Toast "Access saved" / "Support Executive · N changes" | Role is not locked | Saved for the session; not enforced (OQ-ACC-002) |

### 6.5 Switch role with unsaved changes

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | With unsaved changes, click another role | Dialog "Discard your changes?" | Draft differs from saved | — |
| 2a | Click **Keep editing** | Dialog closes; the same role and draft remain | — | Continue editing |
| 2b | Click **Discard** | The other role opens with its saved permissions | — | Draft lost |

## 7. Forms and Field-Level Specifications

Validation timing in the menu modal follows SH-004: "Enter the …" and "Choose …" errors appear only after **Save menu** / **Save changes** is pressed; problems with typed text (duplicate name, spaces in the URL, URL already used) appear when the user leaves a field that has text in it, and again on save. Errors update as the user types and clear as soon as the value becomes valid. Module and Icon are checked as soon as a value is chosen.

### 7.1 Add / Edit menu

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Module | Searchable select (placeholder "Select module") | Which portal the menu belongs to | Required | N/A | N/A | "Admin" (the only option) | "Admin" (Add); saved value (Edit) | Must have a value. The field cannot be cleared, so the error cannot occur in the current build | — | "Choose the module" |
| Module search | Search box inside the Module list (placeholder "Search modules…") | Find a module | Optional | N/A | Requires Confirmation | Contains, case-insensitive, on the module name | Empty | None | No match: "No matches" | N/A |
| Menu name | Text (placeholder "e.g. Facilitators") | Label shown in the menu | Required | 1 non-space character | 40 characters (typing stops at 40) | Any characters; surrounding spaces removed on save | Empty (Add); saved name (Edit) | Spaces-only counts as empty. Must be unique among its siblings (same parent, or among top-level menus), ignoring case and surrounding spaces; the menu's own name is allowed in Edit. The same name may be used under different parents | Copied into Page name while typing, until Page name is edited. Re-checked when Parent menu changes | Empty: "Enter the menu name". Duplicate under a parent: "This parent already has a menu with this name". Duplicate at top level: "There is already a top-level menu with this name" |
| Parent menu | Searchable select, clearable (placeholder "None — top-level menu") | Place the menu under a top-level menu | Optional | N/A | N/A | Any top-level menu except the menu itself, in menu order; each option shows its icon and page URL | None (top-level) for Add; saved parent (Edit) | Sub-menus cannot be chosen as parents (one level of nesting only) | Disabled with helper "Has sub-menus, so it stays top-level." when the edited menu has sub-menus. Choosing or clearing a parent moves the item to the end of the new sibling list | N/A |
| Parent menu search | Search box inside the Parent list (placeholder "Search menus…") | Find a parent | Optional | N/A | Requires Confirmation | Contains, case-insensitive, on the menu name | Empty | None | No match: "No matches" | N/A |
| Page name | Text (placeholder "e.g. Facilitators") | Title of the page the menu opens | Required | 1 non-space character | 60 characters (typing stops at 60) | Any characters; surrounding spaces removed on save | Follows Menu name (Add); saved value (Edit) | Spaces-only counts as empty. No uniqueness rule | Stops following Menu name once typed in | "Enter the page name" |
| Page URL | Text with link icon (placeholder "/facilitators") | Address the menu opens | Required | 1 non-space character | 120 characters (typing stops at 120) | No spaces inside the address. On save, surrounding spaces are removed, a leading "/" is added if missing, and several leading "/" become one. No other format rule (OQ-ACC-004) | Empty (Add); saved value (Edit) | Spaces-only counts as empty. Must not contain spaces. Must be unique across all menus, ignoring case and the leading "/" (for example "clients" clashes with "/clients"); the menu's own URL is allowed in Edit. Not checked against the application's real pages | — | Empty: "Enter the page URL". Spaces: "A URL can’t contain spaces". Duplicate: "Another menu already opens this URL" |
| Icon | Icon picker (placeholder "Choose an icon") | Icon shown beside the menu | Required | N/A | N/A | One of the 156 icons in the picker | None (Add); saved icon (Edit) | Must be chosen | Chosen icon appears in the field and in the Priority preview | "Choose an icon" |
| Icon search | Search box inside the picker (placeholder "Search icons — e.g. money, people, report") | Find an icon | Optional | N/A | Requires Confirmation | Words separated by spaces; each word must appear (partial match, case-insensitive) in the icon's name or keywords | Empty; cleared each time the panel closes | None | No match: "No icons match “\<text>”" | N/A |
| Priority | Live preview list with ↑/↓ buttons, arrow keys and click-to-place | Position among siblings | Required (always has a value) | 1 | Number of siblings + 1 | Whole positions only | Add: last top-level position. Edit: saved position | Kept within 1…M; saving renumbers all siblings 1…n with no gaps | Changes range when Parent menu changes | N/A |

### 7.2 Menu Mapping list controls

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search menu, page or URL… | Search text | Filter menus | Optional | N/A | Requires Confirmation | Contains, case-insensitive, on menu name, page name, page URL, parent name and module | Empty | None | While active, the tree is shown flat and fold toggles are hidden | N/A |
| Level pill | Single-select pills | Filter by level | Optional | N/A | N/A | All menus, Top-level, Sub-menus | All menus | None | Same flat display as search | N/A |
| Page size | Select | Rows per page | Optional | N/A | N/A | 20, 50, All rows | 50 | None | — | N/A |

### 7.3 Roles & Access controls

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search roles… | Search text with clear button | Filter the roles list | Optional | N/A | Requires Confirmation | Contains, case-insensitive, on role name | Empty | None | Clear button "Clear role search" while text is present | N/A ("No roles match “\<text>”" when nothing matches) |
| Search pages… | Search text | Filter grid rows | Optional | N/A | Requires Confirmation | Contains, case-insensitive, on page (menu) name | Empty | None | Parents kept with matching sub-pages and vice versa | N/A |
| Permission checkboxes (page × action) | Checkbox group, one per available page-and-action pair | Grant an action on a page | Optional | N/A | N/A | View, Add, Edit, Delete, Export, Approve — only those the page offers (BR-ACC-012) | The role's saved permissions | Any action implies View; clearing View clears the row | Disabled (all ticked) for Super Admin | N/A |
| Row checkbox ("Full access to \<page>") | Tri-state checkbox | All actions on a page (or on all sub-pages of a parent) | Optional | N/A | N/A | All on / all off; shows mixed when partial | Derived from the row | None | Disabled for Super Admin | N/A |
| Column checkbox ("\<Action> on every page") | Tri-state checkbox in the column header | One action on every page that offers it | Optional | N/A | N/A | All on / all off; shows mixed when partial | Derived from the column | Ignores the page search (applies to every page) | Disabled for Super Admin | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-ACC-001 | Required menu fields | Module, Menu name, Page name, Page URL and Icon are required | Save | Not saved | Any left empty or spaces only | "Choose the module", "Enter the menu name", "Enter the page name", "Enter the page URL", "Choose an icon" |
| BR-ACC-002 | Unique name among siblings | No two menus under the same parent (or at top level) share a name, ignoring case and surrounding spaces | Blur (with text), parent change and Save | Not saved | "reports" when "Reports" is top-level | "There is already a top-level menu with this name" / "This parent already has a menu with this name". If it slips through at save: toast "Couldn’t add the menu" / "Couldn’t save the menu" with "There is already a menu with this name here." |
| BR-ACC-003 | Unique, space-free page URL | Every menu opens a different address; addresses contain no spaces | Blur (with text) and Save | Not saved | "/clients" already used; "/my page" | "Another menu already opens this URL" / "A URL can’t contain spaces" |
| BR-ACC-004 | One level of nesting | Only top-level menus can be parents; a menu with sub-menus cannot be moved under another menu | Parent menu choice | Sub-menus are not offered as parents; Parent is disabled for a menu with sub-menus | — | "Has sub-menus, so it stays top-level." |
| BR-ACC-005 | URL clean-up | Saved addresses always start with a single "/" and have no surrounding spaces | Save | "clients-new" saves as "/clients-new" | — | Shown in the toast and list |
| BR-ACC-006 | No deleting parents | A menu with sub-menus cannot be deleted | Delete | Information dialog instead of Delete | Bin on Finance | "\<name> can’t be deleted yet" |
| BR-ACC-007 | Default position | A new menu goes to the end of its sibling list unless moved | Add; parent change | Position = siblings + 1 | — | "N of M" in the preview |
| BR-ACC-008 | No change, no save | Edit Save is disabled until something changes | Edit modal | Button disabled | — | — |
| BR-ACC-009 | Continuous priorities | Within each sibling group positions run 1…n with no gaps or ties | Save, move to another parent, delete | Siblings renumbered; leaving a parent closes the gap it left | — | Priority column |
| BR-ACC-010 | Menu master drives the sidebar [Partially Implemented] | The admin menu should follow this master | Any menu change | The real sidebar, search "Jump to" list and routes are fixed and ignore this master | Adding "Payment Runs" | No sidebar change (OQ-ACC-001) |
| BR-ACC-011 | View is the base permission | Any action on a page requires View; removing View removes everything on that page | Any checkbox change | Ticking Add/Edit/Delete/Export/Approve ticks View; clearing View clears the row | — | Checkbox states |
| BR-ACC-012 | Actions offered per page | Each page offers only the actions that fit it, decided by its page address: Dashboard and Reports: View, Export. Settings: View, Add, Edit, Delete. Support desk: View, Edit, Export. Invoice Approvals: View, Approve, Export. Trainer Invoice and Facilitators: View, Add, Edit, Delete, Export, Approve. Any other page (including new menus): View, Add, Edit, Delete, Export. A parent with sub-pages has no actions of its own | Grid display | Other actions show a dash | — | "\<Action> isn’t available on this page". Changing a menu's address changes its actions (OQ-ACC-007) |
| BR-ACC-013 | Super Admin locked | Super Admin always has every available action on every page and cannot be edited | Super Admin selected; save | Checkboxes disabled; new menus are included automatically | Attempt to save Super Admin (not possible from the page) | Locked note. Safety-net message "Super Admin always has full access." |
| BR-ACC-014 | New menus start without access | A menu added in Menu Mapping appears in the grid for every role; for every role except Super Admin it starts with nothing ticked | After adding a menu | Admin must grant access explicitly | — | — (OQ-ACC-010) |
| BR-ACC-015 | Draft and explicit save | Permission changes are held as a draft until **Save changes** | Roles & Access | Save bar shows the count; Discard restores; switching role asks first | — | "N unsaved changes to \<role>" |
| BR-ACC-016 | Permissions enforced [Partially Implemented] | Each role's permissions should limit what its users see and do | Everywhere | Not enforced; no user is linked to a role | — | None (SH-002, OQ-ACC-002) |
| BR-ACC-017 | Fixed role list [Not Implemented] | Roles are maintained elsewhere or are fixed | Roles & Access | No add, rename or delete; the people count per role is fixed demo data | — | — (OQ-ACC-003) |
| BR-ACC-018 | Creator recorded [Inferred] | New menus record the signed-in user's name and the date | Add menu | Recorded, but not shown anywhere on the page | — | — (OQ-ACC-013) |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Add menu | Saved | Success toast | "Menu added" — "\<name> · \<URL>" | After save | — |
| Edit menu | Saved | Success toast | "Menu updated" — "\<name> · \<URL>" | After save | — |
| Add / edit menu fails | Error | Error toast | "Couldn’t add the menu" / "Couldn’t save the menu" — reason (for example "There is already a menu with this name here." or "This menu no longer exists.") | After save attempt | Fix and retry |
| Delete menu | Deleted | Success toast | "Menu deleted" — \<name> | After confirm | — |
| Delete menu fails | Error | Error toast | "Couldn’t delete the menu" — reason ("It has N sub-menus — move or delete them first.") | After confirm | Move or delete sub-menus |
| Save permissions | Saved | Success toast | "Access saved" — "\<role> · N changes" ("· 1 change") | After **Save changes** | — |
| Save permissions fails | Error | Error toast | "Couldn’t save access" — reason (for example "This role no longer exists." or "Super Admin always has full access.") | After save attempt | Retry |
| Unsaved permissions | Draft differs | Save bar | "N unsaved changes to \<role>" | While changes exist | Save or Discard |
| Super Admin selected | Locked | Inline note | "Super Admin always has every permission on every page — it can’t be changed." | Super Admin selected | — |

Toasts follow SH-005.

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Menu tree table | The admin menu | Menu order (parents by priority, each followed by its sub-menus by priority); fold/unfold per parent; no column sorting | Columns: Menu, Module, Page name, Page URL, Priority, actions. 50 rows per page; 20/50/All | Empty master: "No menus yet" / "Add the pages the admin menu shows." + **Add menu**. No match: "No menus match" / "Try a different search." + **Clear search & filters** |
| Menu search and pills | Narrow the list | Section 7.2; results are shown flat, sub-menus labelled "under \<Parent>" | Result line "N of Total menus" + **Clear all** (SH-008) | As above |
| Menu list loading / failure | — | Skeletons while loading; error state with **Try again** (SH-007) | — | "Couldn’t load data" (table) / "Couldn’t load the list" (cards) |
| Roles list | Choose a role | Seed order: Super Admin, Admin, Finance Manager, Program Manager, Support Executive | Search by name | "No roles match “\<text>”" |
| Permission grid | Pages × actions | Menu order with sub-pages indented; sticky header row | Six action columns; dashes where an action does not apply | No match: "No pages match" / "Try a different search." (no clear button; differs from SH-007). Loading: "Loading access…". Load failure: "Couldn’t load roles" with the reason and **Try again** |
| Header counts | Summary | "N people" and "Opens X of Y pages" | People counts in the demo: Super Admin 2, Admin 4, Finance Manager 3, Program Manager 5, Support Executive 6 | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| No menus | Every menu deleted | Empty state with Add; Roles & Access grid then has no rows | "No menus yet" | **Add menu** |
| Delete a parent | Menu has sub-menus | Blocked dialog | "\<name> can’t be deleted yet" … | Move or delete sub-menus first |
| Same name under different parents | "Reports" under Finance while a top-level "Reports" exists | Allowed | — | — |
| Case-only rename | "reports" → "Reports" | Allowed (own name excluded) | Toast "Menu updated" | — |
| URL without leading "/" | "projects-new" | Saved as "/projects-new"; duplicate check already treats "projects" and "/projects" as the same | — | — |
| URL with trailing "/" | "/clients/" when "/clients" exists | Accepted as a different address (no trailing-slash rule) | — | OQ-ACC-004 |
| URL for a page that does not exist | "/abc" | Accepted; nothing checks that the page exists | — | OQ-ACC-004 |
| Field at limit | 40 / 60 / 120 characters | Further typing is ignored | — | — |
| Edit with only spaces added | Trailing space on Menu name | Counts as a change; Save enabled; saved name is trimmed | Toast "Menu updated" | Differs from other masters (OQ-ACC-016) |
| Backdrop click | Click outside the menu modal | Nothing happens | — | Use Cancel / × |
| Menu edited elsewhere while open | Same session, deleted in another view | Save fails | Toast "Couldn’t save the menu" — "This menu no longer exists." | Close and reopen |
| Top-level page becomes a parent | A sub-menu is added under e.g. Dashboard | In Roles & Access, Dashboard becomes a group row with no actions of its own; any access granted on it is no longer shown or counted | — | OQ-ACC-010 |
| Menu address changed | A menu's URL is edited | Its available actions in Roles & Access may change (BR-ACC-012) | — | OQ-ACC-007 |
| Menu deleted | A menu with role access is deleted | It disappears from the grid; no warning about roles that had access | "Delete this menu?" only | OQ-ACC-011 |
| Selected role hidden by role search | Search text excludes the selected role | Grid still shows the selected role | — | Clear the search |
| Column checkbox while searching | Page search active | The action is set on all pages, including hidden ones | — | OQ-ACC-009 |
| Parent with one sub-page | A parent has exactly one sub-page | Subtitle reads "1 sub-pages" [Partially Implemented] | "1 sub-pages" | OQ-ACC-014 |
| Leave Roles & Access with unsaved changes | Click a sidebar item | Leaves without asking; draft lost | — | OQ-ACC-008 |
| Reload | Any time | Menus and permissions return to the demo data (SH-001) | — | — |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Roles & Access ← Menu Mapping & Access | The permission grid's rows are the Menu Mapping master | Add, rename, re-icon, reorder, re-parent or delete a menu | Reflected in the grid the next time Roles & Access is opened: new menus appear as rows (unticked except for Super Admin), order and names follow the master | BR-ACC-012, BR-ACC-014 |
| App shell sidebar ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)) | The demo menu mirrors the sidebar (Dashboard … Reports, Finance with six sub-menus, plus Support desk); "System pages" (Dev only) is not in the master | Any menu change | None: the sidebar is fixed | BR-ACC-010, OQ-ACC-001, OQ-SHELL-012 |
| All pages (SH-002) | Role permissions should restrict pages and actions | Save permissions | None: not enforced | BR-ACC-016, OQ-ACC-002 |
| Authentication ([authentication-prd.md](authentication-prd.md)) | Sign-in should determine the user's role | Sign in | No role is assigned | SH-002 |
| Profile ([profile-prd.md](profile-prd.md)) | "Access level" shows "Admin" | — | Not linked to these roles | OQ-PROF-011 |
| Manage Content ([manage-content-prd.md](manage-content-prd.md)) | Manage Content offers View, Add, Edit, Delete, Export | — | The page has no export or delete; not enforced | OQ-CNT-018 |
| Facilitators ([facilitators-prd.md](facilitators-prd.md)) | Facilitators offers Approve (KYC) | — | Not enforced | OQ-FAC-014 |
| Support desk ([support-desk-prd.md](support-desk-prd.md)) | Support desk offers View, Edit, Export; the Support Executive role has View and Edit | — | Not enforced | OQ-SUP-012 |
| Dashboard ([dashboard-prd.md](dashboard-prd.md)) | Dashboard offers View and Export | — | Not enforced | OQ-DASH-011 |
| Settings hub ([settings-hub-prd.md](settings-hub-prd.md)) | Entry points in the "Others" group: "Menu Mapping & Access" ("Pages in the admin menu and their order") and "Roles & Access" ("What each admin role can see and do") | Open | Added to Recently opened | — |
| Settings – Industry & job masters ([settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md)) | The CRM "Role" master is a different concept (job roles, not admin roles) | — | None | — |

## 13. Acceptance Criteria

**AC-ACC-001: Add a top-level menu**
- Given the Add menu modal is open
- When the user enters Menu name "Calendar", Page URL "calendar", chooses the Calendar icon and clicks **Save menu**
- Then the toast "Menu added" / "Calendar · /calendar" appears and the modal closes
- And "Calendar" is listed as the last top-level menu with Page name "Calendar"

**AC-ACC-002: Required errors only after Save (negative)**
- Given the Add menu modal is open with nothing entered
- When the user tabs through the fields
- Then no error is shown
- And when the user clicks **Save menu**, "Enter the menu name", "Enter the page name", "Enter the page URL" and "Choose an icon" appear and nothing is saved

**AC-ACC-003: Duplicate name among siblings (negative)**
- Given a top-level menu "Reports" exists
- When the user types " reports " as a new top-level menu name and leaves the field
- Then "There is already a top-level menu with this name" appears
- And when Parent menu is set to "Finance", the error disappears

**AC-ACC-004: Duplicate or spaced URL (negative)**
- Given "/clients" is used
- When the user types "Clients" in Page URL and leaves the field
- Then "Another menu already opens this URL" appears
- And typing "/my page" shows "A URL can’t contain spaces"

**AC-ACC-005: Set priority in the preview**
- Given the Edit menu modal for Reports
- When the user clicks "Dashboard" in the preview (or presses ↑ in the focused preview until "1 of 11") and saves
- Then Reports is first in the tree and every other top-level menu moves down one position

**AC-ACC-006: Parent locked for a menu with sub-menus**
- Given the Edit menu modal for Finance
- Then Parent menu is disabled with "Has sub-menus, so it stays top-level."
- And the Parent menu list of any menu never offers sub-menus or the menu itself

**AC-ACC-007: Delete blocked for a parent (negative)**
- Given Finance has 6 sub-menus
- When the user clicks its bin
- Then "Finance can’t be deleted yet" / "It has 6 sub-menus. Move them under another menu or delete them first." appears with **Close** and **OK** and no Delete button

**AC-ACC-008: Delete a sub-menu**
- Given Finance's sub-menus are at positions 1–6
- When the user deletes "Credit Note" (position 2)
- Then the toast "Menu deleted" appears and the remaining sub-menus are numbered 1–5

**AC-ACC-009: Icon search**
- Given the icon picker is open
- When the user types "money"
- Then only icons with "money" in their keywords are shown with the count "N icons"
- And typing "zzz" shows "No icons match “zzz”"

**AC-ACC-010: Admin selected by default; Super Admin locked**
- Given the user opens Roles & Access
- Then Admin is selected
- And when the user selects Super Admin, the note "Super Admin always has every permission on every page — it can’t be changed." appears and every checkbox is ticked and disabled

**AC-ACC-011: View is implied and required**
- Given a role where a page has nothing ticked
- When the user ticks Edit on that page
- Then View is also ticked
- And when the user clears View, every action on that row is cleared

**AC-ACC-012: Whole row and whole column**
- Given the Program Manager role
- When the user clicks the Approve column checkbox
- Then Approve (and View) is ticked on every page that offers Approve and on no other page
- And clicking a page's row checkbox ticks all its available actions

**AC-ACC-013: Save and discard**
- Given unsaved changes on Finance Manager
- Then the bar shows "N unsaved changes to Finance Manager"
- And **Save changes** shows "Access saved" / "Finance Manager · N changes"; **Discard** restores the saved state without a dialog

**AC-ACC-014: Switch role with unsaved changes**
- Given 2 unsaved changes on Admin
- When the user clicks Support Executive
- Then "Discard your changes?" / "Your 2 unsaved changes to Admin won’t be saved." appears; **Keep editing** keeps Admin; **Discard** opens Support Executive

**AC-ACC-015: New menu appears in Roles & Access**
- Given a menu "Payment Runs" was added under Finance
- When the user opens Roles & Access
- Then "Payment Runs" is a row under Finance offering View, Add, Edit, Delete and Export, unticked for Admin and ticked for Super Admin

**AC-ACC-016: Not applied to the sidebar or pages (known gap)**
- Given a menu was added, reordered or deleted, and a role's permissions were changed
- Then the application sidebar is unchanged and every page and action remains available to the signed-in user

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-ACC-001 | AC-ACC-001 | Add top-level menu | — | "Calendar", "calendar", Calendar icon | Added at the end; URL saved as "/calendar" | P1 |
| TC-ACC-002 | AC-ACC-002 | Required errors timing | Add modal | Tab through, then Save | Errors only after Save | P1 |
| TC-ACC-003 | AC-ACC-003 | Duplicate top-level name | — | " reports " | Top-level duplicate message on blur | P1 |
| TC-ACC-004 | AC-ACC-003 | Duplicate under parent | Parent Finance | "credit note" | "This parent already has a menu with this name" | P1 |
| TC-ACC-005 | 7.1 | Same name, different parent | — | "Reports" under Finance | Saved | P2 |
| TC-ACC-006 | AC-ACC-004 | URL duplicate ignoring "/" and case | — | "CLIENTS" | "Another menu already opens this URL" | P1 |
| TC-ACC-007 | AC-ACC-004 | URL with space | — | "/my page" | "A URL can’t contain spaces" | P1 |
| TC-ACC-008 | BR-ACC-005 | URL clean-up | — | "  //reports-new  " | Saved as "/reports-new" | P2 |
| TC-ACC-009 | 7.1 | Max lengths | — | 41 / 61 / 121 characters | Only 40 / 60 / 120 accepted | P3 |
| TC-ACC-010 | 5.2 | Page name follows name | Add modal | Type "Leads", then edit Page name, then change name | Page name follows until edited, then stops | P2 |
| TC-ACC-011 | 5.3 | Preview controls | Add modal | ↑ button, ↑/↓ keys, click a spot | Position and "N of M" update; ↑ disabled at 1, ↓ at M | P2 |
| TC-ACC-012 | BR-ACC-007 | Parent change resets position | Add modal | Choose Finance | "7 of 7" | P2 |
| TC-ACC-013 | AC-ACC-006 | Parent lock | Edit Finance | — | Parent disabled with helper | P2 |
| TC-ACC-014 | BR-ACC-009 | Move between parents | Edit "E-Invoice" | Clear parent, save | E-Invoice becomes top-level at the end; Finance sub-menus renumbered 1–5 | P2 |
| TC-ACC-015 | AC-ACC-007 | Delete parent blocked | — | Bin on Finance | Info dialog, Close / OK | P1 |
| TC-ACC-016 | AC-ACC-008 | Delete sub-menu | — | Credit Note | Toast; siblings renumbered | P1 |
| TC-ACC-017 | 5.5 | Discard dialog | Edit with change | Esc | "Discard your changes?"; backdrop click does nothing | P2 |
| TC-ACC-018 | BR-ACC-008 | Save disabled until change | Edit Reports | — | Disabled; enabled after a move in the preview | P3 |
| TC-ACC-019 | AC-ACC-009 | Icon search | Picker open | "money", "people team", "zzz" | Filtered grid; multi-word narrows; no-match text | P2 |
| TC-ACC-020 | 5.1 | Search and pills | Demo data | "finance"; Sub-menus pill | Flat rows with "under Finance"; counts 17/11/6 | P2 |
| TC-ACC-021 | 5.1 | Fold / unfold | — | Click Finance chevron | Sub-menus hidden / shown | P3 |
| TC-ACC-022 | 5.1 | Phone cards | 375 px | — | Cards with "Under Finance · #N"; tap opens Edit | P3 |
| TC-ACC-023 | AC-ACC-010 | Default role and lock | — | Open page; select Super Admin | Admin selected; Super Admin read-only with note | P1 |
| TC-ACC-024 | AC-ACC-011 | View implied | Support Executive | Tick Export on Dashboard; clear View | View ticked; then row cleared | P1 |
| TC-ACC-025 | AC-ACC-012 | Column and row checkboxes | Program Manager | Approve column; Finance row | Approve only on Facilitators, Trainer Invoice, Invoice Approvals; Finance sub-pages full | P1 |
| TC-ACC-026 | BR-ACC-012 | Unavailable actions | Any role | Hover dash on Dashboard × Edit | "Edit isn’t available on this page" | P3 |
| TC-ACC-027 | AC-ACC-013 | Save, discard, count | Finance Manager | Two changes, toggle one back | Count 1; Save toast "Finance Manager · 1 change"; Discard restores | P1 |
| TC-ACC-028 | AC-ACC-014 | Switch role guard | Unsaved changes | Click another role | Dialog; Keep editing / Discard work | P1 |
| TC-ACC-029 | 5.7 | Page search | Admin | "invoice" | Finance with matching sub-pages; "zzz" → "No pages match" | P2 |
| TC-ACC-030 | AC-ACC-015 | New menu in grid | TC-ACC-001 done, same tab | Open Roles & Access | "Calendar" row, unticked for Admin, ticked for Super Admin | P1 |
| TC-ACC-031 | AC-ACC-016 | Not applied (gap) | Changes made | Look at sidebar, open pages | No change | P2 |
| TC-ACC-032 | 11 | Leave with unsaved permissions (gap) | Unsaved changes | Click Dashboard in sidebar | Leaves without asking | P2 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-ACC-001 | Menu Mapping & Access | Menu changes are not applied to the sidebar, search "Jump to" list or routes (see OQ-SHELL-012) | The master has no effect; users may think they changed the menu | Confirm the master should drive the sidebar, and what happens to a menu whose address has no built page | Open |
| OQ-ACC-002 | Roles & Access | Permissions are saved but not enforced; no user is linked to a role (SH-002) | No access control exists | Define how users get roles, and how each action is enforced (hidden vs disabled, pages opened by address) | Open |
| OQ-ACC-003 | Roles & Access | Roles cannot be added, renamed, described or deleted, and people cannot be assigned; counts are fixed demo data | Role list cannot evolve | Confirm where roles and memberships are maintained | Open |
| OQ-ACC-004 | Menu – Page URL | Only spaces and duplicates are checked; trailing "/", allowed characters, external links and whether the page exists are not defined | Broken or duplicate links | Define the URL format rules | Open |
| OQ-ACC-005 | Menu fields | Limits of 40 (Menu name), 60 (Page name) and 120 (Page URL) exist in the form only | Data quality | Confirm the limits | Open |
| OQ-ACC-006 | Menu – Module | Only "Admin" exists; "Choose the module" can never appear | Purpose of the field unclear | Confirm which other portals will be added | Open |
| OQ-ACC-007 | Roles – actions per page | Available actions are fixed by page address; new menus always get View, Add, Edit, Delete, Export (never Approve); changing an address changes the actions | Admins cannot configure actions per page | Decide whether actions should be set per menu in Menu Mapping | Open |
| OQ-ACC-008 | Roles & Access | Leaving the page (sidebar, breadcrumb, Back) with unsaved changes does not ask | Data loss | Confirm the page should use the shell's leave guard | Open |
| OQ-ACC-009 | Roles – column checkbox | The column checkbox changes hidden pages while a page search is active | Unexpected bulk changes | Confirm whether it should apply only to visible rows | Open |
| OQ-ACC-010 | Roles – new / changed menus | New menus start with no access for every editable role; a page that becomes a parent loses its own permissions from view | Admins may forget to grant access | Confirm default access for new menus and handling when a page becomes a group | Open |
| OQ-ACC-011 | Menu – delete | Any menu without sub-menus can be deleted with no warning about roles that have access to it, including built pages such as Dashboard | Accidental removal | Define usage checks and warnings | Open |
| OQ-ACC-012 | Menu – nesting | Only one level of sub-menus is allowed | Future menu structures | Confirm one level is the rule | Open |
| OQ-ACC-013 | Both | Creator and creation date are recorded for menus but not shown; no history of permission changes | Audit trail | Define audit needs for menu and permission changes | Open |
| OQ-ACC-014 | Roles – grid | A parent with one sub-page reads "1 sub-pages" | Copy error | Confirm wording "1 sub-page" | Open |
| OQ-ACC-015 | Searches | Maximum lengths of the menu, module, parent, icon, role and page searches are not defined | Minor | Confirm | Open |
| OQ-ACC-016 | Menu modal | Edit Save is enabled by spaces-only changes (other masters ignore them); Enter-to-save is not defined | Consistency with other masters | Confirm both behaviours | Open |
| OQ-ACC-017 | Menu list | Default 50 rows per page with options 20/50/All, and no column sorting, differ from SH-008; a parent and its sub-menus can split across pages | Consistency | Confirm the paging rule for the tree | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages, modals and dialogs: Complete
- [ ] User roles and access: Incomplete (roles are not assigned or enforced, see OQ-ACC-002, OQ-ACC-003)
- [x] Field specifications: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (form limits and search lengths need confirmation, see OQ-ACC-005, OQ-ACC-015)
- [ ] Accepted formats: Incomplete (Page URL rules, see OQ-ACC-004)
- [x] Validation timing and messages: Complete
- [x] Success and error messages: Complete
- [x] Search, filters and tables: Complete
- [ ] Cross-module behaviour: Incomplete (menu not applied to the sidebar and permissions not enforced, see OQ-ACC-001, OQ-ACC-002)
- [ ] Unsaved-changes protection: Incomplete (Roles & Access has no leave guard, see OQ-ACC-008)
- [x] Acceptance criteria and QA scenarios: Complete
