# Settings: Users & Access: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Settings: Users & Access PRD |
| Module name | Settings: Users & Access (Manage Users, Roles & Access, Menu Mapping & Access) |
| Document ID | PRD-ACC |
| Version | 1.2 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (all three masters can be maintained, but user accounts are not used for sign-in, menu changes are not applied to the real sidebar and role permissions are not enforced anywhere) |
| Last updated | 2026-11-06 (v1.2: retitled "Settings: Users & Access" after the Settings group that replaced "Others"; new **Manage Users** master documented throughout; Settings now follows Reports in the demo menu (Reports priority 9, Settings 10)) · 2026-11-05 (v1.1: naming: the "Admin" role and menu module are now "Training Partner"; portal roles vs permission roles clarified) |
| Related modules/pages | [settings-hub-prd.md](settings-hub-prd.md), [app-shell-navigation-prd.md](app-shell-navigation-prd.md), [authentication-prd.md](authentication-prd.md), [profile-prd.md](profile-prd.md), [dashboard-prd.md](dashboard-prd.md), [clients-prd.md](clients-prd.md), [client-detail-prd.md](client-detail-prd.md), [manage-content-prd.md](manage-content-prd.md), [facilitators-prd.md](facilitators-prd.md), [support-desk-prd.md](support-desk-prd.md), [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

The **Users & Access** group in Settings ("Logins, roles and what they can open.") holds three masters that together describe who can sign in, the Training Partner portal's navigation and what each role may use. It replaced the former "Others" group on 2026-11-06 and is the first group on the Settings page:

- **Manage Users** ("Logins, passwords and who reports to whom"): everyone who can sign in, with their personal details, address, role, designation, application, the user they report to, their username and their status. Passwords are set when a user is added and changed with **Change password**.
- **Roles & Access** ("What each role can see and do"): for each role, which menu pages it may open and which actions (View, Add, Edit, Delete, Export, Approve) it may perform on each page.
- **Menu Mapping & Access** ("Pages in the Training Partner menu and their order"): the list of pages in the Training Partner menu, which parent each sits under, the page address it opens, its icon and its position (priority).

Objectives:

- Let Training Partner users keep one list of user accounts, laid out like All Clients, and add, edit, deactivate and delete accounts with clear, step-by-step forms.
- Keep account data clean: unique usernames and emails, valid mobile numbers and pincodes, a minimum age, a password strength rule, and no reporting loops.
- Let Training Partner users maintain the Training Partner menu as a two-level tree (top-level menus and sub-menus) with a clear, visual way to set the order.
- Prevent broken menus: unique names among siblings, unique page addresses, no deleting a menu that still has sub-menus, no nesting deeper than one level.
- Let Training Partner users set each role's permissions page by page in one grid, with shortcuts to grant a whole page or a whole action at once, and protect unsaved edits.
- Keep Super Admin permanently at full access.

**Current limitation (applies to the whole module):** none of the three masters changes how the application behaves. The accounts in Manage Users cannot sign in (sign-in uses the demo login), their passwords are not kept, and Inactive does not block anything; the sidebar is fixed and does not read the Menu Mapping master; and the permissions saved in Roles & Access are not applied to any page, menu or action (SH-002, OQ-SHELL-012, OQ-ACC-001, OQ-ACC-002, OQ-ACC-022, OQ-ACC-023).

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Menu Mapping & Access list (Settings › Menu Mapping & Access) | View and maintain the Training Partner menu as a tree table | Training Partner user | Filter by level pill, search, fold/unfold parents, paginate, add, edit, delete | Roles & Access, App shell sidebar (not linked) |
| Add / Edit menu modal | Enter a menu's details and place it in the menu | Training Partner user | Choose module, type names and address, pick parent and icon, move the item in the priority preview, save, cancel | Menu Mapping list |
| Icon picker | Choose the menu's icon from a searchable grid | Training Partner user | Search icons, pick one | Add / Edit menu modal |
| Delete menu dialogs | Confirm deletion, or explain why it is blocked | Training Partner user | Delete, cancel, close | Menu Mapping list |
| Roles & Access page (Settings › Roles & Access) | Set what each role can open and do | Training Partner user | Search roles, pick a role, search pages, tick permissions (single, whole page, whole action), discard, save | Menu Mapping & Access |
| Switch-role discard dialog | Protect unsaved permission changes | Training Partner user | Keep editing, Discard | Roles & Access |
| Manage Users list (Settings › Manage Users, `/settings/manage-users`) | View and maintain the user accounts | Training Partner user | Filter by status pill, search, filter, sort, paginate, add, edit, change password, delete | Roles & Access, Settings › Role and Designation |
| Filter users drawer | Narrow the list by role, application, admin rights, gender (and status on phones) | Training Partner user | Choose filters, Reset, Show N users | Manage Users list |
| Add / Edit user modal (3 steps: Personal → Address → Login & role) | Enter or change a user's details | Training Partner user | Fill fields, Next, Back, jump between steps, Use email, Save user / Save changes, Cancel | Manage Users list |
| Change password modal | Set a new password for a user | Training Partner user | Type the new password twice, Change password, Cancel | Manage Users list |
| Delete user dialog | Confirm removing a user | Training Partner user | Delete, Cancel | Manage Users list |
| Discard-changes dialog (user modal) | Protect unsaved user details | Training Partner user | Keep editing, Discard | Add / Edit user modal |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Training Partner user (signed in and continuing as Training Partner) | All three pages (SH-002, SH-003) | All actions in section 3 | A menu with sub-menus cannot be deleted or moved under another menu. Super Admin's permissions cannot be changed. Roles cannot be added, renamed or deleted. A user's password is never shown and is changed only with **Change password**. The permissions defined on the Roles & Access page and the users' "Admin rights" are not enforced, so they do not restrict this or any other page (SH-002, OQ-ACC-020). |
| Users listed in Manage Users | None from this master [Partially Implemented] | — | They are records only: they cannot sign in with the username and password entered here, and their Role, Admin rights and Status have no effect yet (OQ-ACC-020, OQ-ACC-022, OQ-ACC-023, OQ-ACC-024) |
| Roles defined in the master (Super Admin, Training Partner, Finance Manager, Program Manager, Support Executive) | Not applied | — | These roles are records only; no page reads a role's permissions [Partially Implemented] (OQ-ACC-002). They are separate from the portal roles a person picks at "Continue as" after signing in: continuing as Super Admin opens the Super Admin portal, which has no Settings, and does not use the "Super Admin" row of this master |
| Super Admin portal | None. Its menu has no Settings, and opening a Settings address takes the user to Manage Clients ([super-admin-prd.md](super-admin-prd.md)) | — | — |
| Signed-out visitor | None | None | Redirected to Sign in (SH-003) |

## 5. Page Functionality and Behavior

### 5.1 Menu Mapping & Access list

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Entry and breadcrumb | Reach the master | Open from Settings (Users & Access group, third master) | Header breadcrumb "Settings › Menu Mapping & Access" (SH-009). Opening it adds it to Settings "Recently opened" | See [settings-hub-prd.md](settings-hub-prd.md) | Page shown |
| Summary pills | Count and filter by level | Click | "All menus", "Top-level", "Sub-menus" with counts. Tooltips: "Show the whole menu", "Show top-level menus only", "Show sub-menus only" | Demo data: 17 menus, 11 top-level, 6 sub-menus (SH-001) | Filtered list |
| Search | Find a menu | Type in "Search menu, page or URL…" | Filters as the user types (short pause) on menu name, page name, page URL, parent menu name and module, case-insensitive. Typing "Finance" also lists Finance's sub-menus because their parent name matches | SH-008. Because every menu's module is "Training Partner", typing "Training Partner" matches every menu | Matching rows |
| **Add menu** button | Create a menu | Click | Opens the Add menu modal (section 5.2) | At the right end of the toolbar | Modal opens |
| Tree table | Show the menu as it is ordered | View | Each top-level menu, in priority order, followed by its sub-menus in priority order. Sub-menus are indented under their parent with a connector line | No column sorting; order always follows the menu. Caption for assistive technology: "Training Partner menu" | — |
| Fold / unfold toggle | Hide or show a parent's sub-menus | Click the chevron before a parent | Hides or shows that parent's sub-menus. Labels: "Hide \<name>’s sub-menus" / "Show \<name>’s sub-menus" | Only on top-level menus that have sub-menus, and only when no search or pill filter is active. All parents start unfolded; the folded state is forgotten when the page is left | Rows hidden / shown |
| Menu column | Identify | — | Icon tile and menu name. A parent shows "N sub-menus" ("1 sub-menu") under its name. While a search or pill filter is active, rows are listed flat (no indent, no chevron) and each sub-menu shows "under \<Parent>" | Menus with no icon show a generic page icon | — |
| Module column | Which portal the menu belongs to | — | Shield icon and "Training Partner" | Only "Training Partner" exists (OQ-ACC-006) | — |
| Page name column | Page title | — | Page name, truncated when long | — | — |
| Page URL column | Address the menu opens | Hover | Address in a code-style chip; the full address shows on hover | — | — |
| Priority column | Position among siblings | Hover | Number in a small circle. Tooltip "Position N in the menu" (top-level) or "Position N under \<Parent>" (sub-menu) | Numbers run 1…n within each sibling group with no gaps or ties (BR-ACC-009) | — |
| Row actions | Edit / delete | Click pencil or bin | Pencil opens Edit menu; bin opens a delete dialog (section 5.4). Labels "Edit \<name>", "Delete \<name>" | Plain ghost icons | — |
| Row click | Quick edit | Click a row | Opens the Edit menu modal | Not when clicking the chevron or the row actions | Modal opens |
| Phone card | Phone layout | Tap | Icon, title = menu name; subtitle "Under \<Parent> · #N" (sub-menu), "N sub-menus · #N" or "Top-level · #N" (top-level); footer = page URL; edit/delete actions. Tapping the card opens Edit | SH-008 phones | — |
| Table settings | Paging | Choose page size | 50 rows per page by default; options 20, 50 or All rows | Differs from SH-008 (default 10, options 10/20/50). Paging counts visible rows, so a parent and its sub-menus can fall on different pages in a long menu | — |
| Result line | Filter summary | — | While searching or filtering: "N of Total menus" with **Clear all** (SH-008) | — | — |
| Sidebar link [Partially Implemented] | The master is meant to drive the Training Partner menu | Add, edit, reorder or delete a menu | The change is saved in this master only. The application sidebar, the "Jump to" list in search and the routing are **not** affected | OQ-ACC-001, OQ-SHELL-012 | Sidebar unchanged |

### 5.2 Add / Edit menu modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Title and description | Context | — | Add: "Add menu" / "A page in the Training Partner menu, and where it sits." Edit: "Edit menu" / "\<name> · \<URL>" | Large modal: fields on the left, Priority preview on the right (stacked on narrow screens); bottom sheet on phones (SH-006) | — |
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
| Delete (no sub-menus) | Confirm removal | Click bin | Dialog "Delete this menu?" / "\<name> (\<URL>) will be removed from the Training Partner menu." with **Cancel** and red **Delete** (SH-006) | No check of whether roles have access to it (OQ-ACC-011) | On Delete: toast "Menu deleted" (description = name); the remaining siblings are renumbered; list refreshes |
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
| Entry and breadcrumb | Reach the master | Open from Settings (Users & Access group, second master) | Breadcrumb "Settings › Roles & Access" (SH-009). Two panes in one card: roles on the left, the selected role's permissions on the right | On phones and tablets the roles become a horizontal strip above the grid | — |
| Roles list | Choose a role | Click a role | Heading "Roles" with the number of roles (large screens). Each role shows a role icon in the role's colour and its name; Super Admin also shows a lock ("Locked"). The selected role sits on a white pill | Five demo roles: Super Admin, Training Partner, Finance Manager, Program Manager, Support Executive (SH-001) | Role selected |
| Default role | Start where editing is possible | Open the page | The first role that can be edited (**Training Partner**) is selected, not Super Admin | — | Training Partner shown |
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
| Enforcement [Partially Implemented] | Restrict what each role can do | Save permissions | Saved permissions are kept for the session (SH-001) but nothing in the application reads them: every Training Partner user still sees every page and action | SH-002, OQ-ACC-002 | No effect |

### 5.8 Manage Users list

The list follows the All Clients pattern (SH-008): summary pills, search, **Filters** and **Add user** in one toolbar above a sortable, paginated table (cards on phones), all in one card.

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Entry and breadcrumb | Reach the master | Open from Settings (Users & Access group, first master) or `/settings/manage-users` | Header breadcrumb "Settings › Manage Users" (SH-009). Opening it adds it to Settings "Recently opened" | See [settings-hub-prd.md](settings-hub-prd.md) | Page shown |
| Summary pills | Count and filter by status | Click a pill | "All users", "Active" and "Inactive" filter the list (tooltips "Show all users", "Show users who can sign in", "Show users who can’t sign in"). "Admin rights" shows how many users have admin rights (tooltip "Users who can manage other users") and is a count only, not a filter | Counts are totals and do not follow the search. Demo data: 18 users, 16 Active, 2 Inactive, 4 with admin rights (SH-001). Pills are not shown on phones; the drawer's Status filter replaces them (SH-013) | Filtered list |
| Search | Find a user | Type in "Search name, username, email, mobile…" (accessible name "Search users") | Filters as the user types (short pause) on full name, username, email, mobile number, role and designation; contains, case-insensitive | SH-008. Does not search the alternate email or mobile, the address or the application | Matching rows |
| **Filters** button | Open the filter drawer | Click | Opens "Filter users" (section 5.9). The button shows the number of filters applied | On phones the count also includes a Status choice other than All | Drawer opens |
| **Add user** button | Create a user | Click | Opens the Add user modal (section 5.10) | At the right end of the toolbar | Modal opens |
| Result line | Filter summary | — | While searching, filtering or using the Active / Inactive pill: "N of Total users" with one removable chip per filter (each role name, the application, "Admin rights" / "No admin rights", the gender) and **Clear all** | The status pill has no chip. **Clear all** clears the search, the pill and every filter | — |
| Table (768 px and wider) | List users | Sort, page, click | Columns in section 10. Header stays visible while scrolling. Default order: Full name A–Z. Caption for assistive technology: "Users" | Lower-priority columns hide as the screen narrows: Gender below 1536 px, Email below 1280 px, Mobile number below 1024 px; Full name, Username, Role, Status and the actions always stay | — |
| Full name cell | Identify the user | View | Photo (or coloured initials when there is none), the full name, a small shield ("Admin rights") when the user has admin rights, and under it the designation, or the application when there is no designation | The name is truncated with the full name on hover. Hovering a row shows a slim blue bar on its left edge, turns the name blue and slides in an arrow cue | — |
| Row actions | Act on one user | Click a key, pencil or bin | Key ("Change password for \<name>") opens Change password (5.11); pencil ("Edit \<name>") opens Edit user; bin ("Delete \<name>") opens the delete dialog (5.12) | Plain ghost icons; the bin turns red on hover. Clicking an action does not open the row | — |
| Row click | Quick edit | Click a row | Opens the Edit user modal with the user's saved details | Not when clicking a row action | Modal opens |
| Cards (phones, below 768 px) | Readable list on phones | Tap a card or an action | Each card: photo or initials, full name, "\<Role> · \<username>", status, the three actions; then a phone icon with the mobile number ("No mobile number" when there is none) and the date the user was added. Tapping the card opens Edit | 12 cards per page in Full name A–Z order; the pager shows only when there are more than 12. No sorting and no page-size choice on phones | Edit opens |
| Pagination (table) | Page through users | Click arrows, choose rows per page | 10 rows per page by default; choices "10 rows", "20 rows", "50 rows", "All rows" (SH-008) | Returns to page 1 when the number of results changes | — |
| Loading and failure | — | Open the page | Skeleton rows (table) or skeleton cards (phones); the pills show a skeleton bar. A load failure shows an error state with **Try again** (SH-007) | — | — |

### 5.9 Filter users drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Choose filters | Open from **Filters** | Title "Filter users", description "By role, application, admin rights or gender". Sections as small cards: **Status** (phones only), **Role**, **Application**, **Admin rights**, **Gender** (section 7.8) | Starts from the filters currently applied. Changes are a draft until applied; closing (×, Esc, backdrop — SH-006) discards the draft | — |
| Section **Clear** links | Clear one section | Click **Clear** | Resets that section in the draft | Shown only when the section has a value | — |
| **Reset** | Clear the draft | Click | Clears Role, Application, Admin rights and Gender in the draft; on phones it also sets Status back to All | Does not apply until the main button is clicked; does not clear the toolbar search; on larger screens the status pill is kept | — |
| **Show N users** | Apply | Click | Applies the draft and closes the drawer. Label "Show 1 user" / "Show N users" | Live count of matching users, including the current toolbar search. When nothing matches, the button reads "No matching users" and is disabled | Filters applied; chips appear |

### 5.10 Add / Edit user modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Title and description | Context | — | Add: "Add user" / "Someone who can sign in to LearnNext." Edit: "Edit user" / \<full name> | Extra-large modal with two columns of fields (one column on narrow screens); bottom sheet on phones (SH-006) | — |
| Step bar | Show progress and move between steps | View / click a step | Three steps under the title: **Personal**, **Address**, **Login & role** (section 7.4–7.6). The current step is highlighted; finished steps are marked | Add: only the current step and steps already reached can be clicked, and clicking does not validate. Edit: every step can be clicked from the start (the bar works as tabs) | Step opens; the form scrolls to the top |
| Personal step layout | Keep the first step short | View | Top row: a round photo picker beside **Full name**. Next row: **Gender** and **Date of birth**. Then **Email** and **Mobile number** side by side; under them the links "+ Alternate email" and "+ Alternate number" | The alternate fields stay hidden until their link is clicked (section 7.4) | — |
| Photo picker | Add a profile photo | Click the circle; hover; click × | Empty: a dashed circle with a camera icon (tooltip "Add a photo (PNG or JPG, up to 2 MB)"); clicking opens the file chooser. With a photo: the circle shows it; hovering shows a camera to change it ("Change photo"); a small × ("Remove photo") removes it | PNG or JPG only, up to 2 MB. Wrong type: error toast "Use a PNG or JPG photo."; too large: "Photo must be under 2 MB." The photo is optional | Photo shown in the circle |
| "+ Alternate email" / "+ Alternate number" links | Offer optional contacts only when needed | Click a link | The link is replaced by the Alternate email / Alternate mobile number field, with the cursor in it | Edit: a field whose user already has a value is shown from the start. Once shown, a field stays for as long as the modal is open, even if emptied | Field shown |
| Footer | Move through the form | Click | Left: "Step N of 3" (hidden on phones). Right: **Cancel** on step 1, **Back** on steps 2–3; **Next** on steps 1–2; Add: **Save user** on step 3 only; Edit: **Save changes** on any step, shown only once something differs from the opened values | In Edit, **Next** is a secondary button. **Cancel**, **Back** and **Next** are disabled while saving; the save button shows a spinner (SH-007) | — |
| **Next** | Finish a step | Click | Checks the current step only. If anything is missing or wrong, the step's messages appear and the step stays; otherwise the next step opens | BR-ACC-021 | Next step |
| **Save user** / **Save changes** | Save | Click | Checks every step. If any step has problems, every step's messages are switched on, the first step with problems opens, and an error toast says "Check the highlighted fields" — "N fields need a fix in \<step>." ("1 field needs a fix in …"). If all is valid: saves (SH-007), shows "User added" / "User updated" — "\<full name> · \<username>", closes and refreshes the list | New users are always saved as Active. Edit: the button disappears again if every change is undone | Saved |
| Password vs Status (step 3) | Keep passwords out of Edit | — | Add shows a **Password** field (with the quiet strength hint under it). Edit hides the password and shows a **Status** switch instead | The password of an existing user is changed only with **Change password** (5.11) | — |
| **Use email** button | Use the email as the username | Click | Copies the Email into Username | Shown beside Username only when an email is entered and the username differs from it | Username filled |
| Enter key | — | Press Enter in a field | Does not move to the next step or save | — | — |
| **Cancel** / × / Esc | Close | Click / press | Closes directly when nothing changed; asks first when anything changed (section 5.13) | Clicking the dimmed backdrop does **not** close this modal (differs from SH-006). From steps 2–3 there is no Cancel button; use × or Esc | — |

### 5.11 Change password modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Title and description | Context | Click the key on a row or card | "Change password" / "\<full name> · \<username>". Focus starts in New password | Medium modal; bottom sheet on phones (SH-006) | — |
| Fields | New password | Type | **New password** with the strength hint under it, then **Confirm password** with "✓ Passwords match" once both agree (section 7.7) | The current password is not asked for | — |
| Strength hint | Guide the user without clutter | Type | A thin four-part bar (fills red → amber → green as rules are met) and one muted line: "8+ characters · upper & lower case · a number · a symbol (optional)"; each part turns green once met. Nothing shows red before typing. Under Confirm password, "✓ Passwords match" appears when both agree | Only the first three items are required (BR-ACC-027); a symbol only makes the password stronger | — |
| **Change password** button / Enter | Save | Click, or press Enter in a field | Checks both fields. If valid: saves (spinner, SH-007), toast "Password changed" — "\<full name> can sign in with the new password.", closes | Cancel is disabled while saving | Saved |
| **Cancel** / × / Esc / backdrop | Close | Click / press | Closes at once without asking, even when something was typed | Follows SH-006 (backdrop closes) | — |

### 5.12 Delete user dialog

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Delete confirmation | Confirm removal | Click the bin on a row or card | Dialog "Delete this user?" / "\<full name> (\<username>) will no longer be able to sign in." When people report to the user, the text continues "N people report to them and will have no parent user." ("1 person reports to them …"). **Cancel** and red **Delete** (SH-006) | No other check: any user can be deleted, including one with admin rights (OQ-ACC-027) | On Delete: toast "User deleted" — "\<full name> can no longer sign in."; everyone who reported to the user has Parent user cleared; list refreshes |
| Delete failure | Safety net | — | Toast "Couldn’t delete the user" with the reason | — | Dialog stays open |

### 5.13 Discard-changes dialog (user modal)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Discard dialog | Prevent accidental loss | Close a changed modal with Cancel, × or Esc | Add: "Discard this user?" / "The details you’ve entered won’t be saved." Edit: "Discard your changes?" / "Your edits to this user won’t be saved." Buttons **Keep editing** and **Discard** | Any field change counts, on any step. Not shown while saving | Discard closes without saving; Keep editing returns to the form |

## 6. User Workflow

### 6.1 Add a sub-menu

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Add menu** | Modal opens; Module = "Training Partner"; focus in Menu name; preview shows the top-level menus with "New menu" at the end | — | — |
| 2 | Type "Payment Runs" | Page name fills with "Payment Runs"; preview shows the name | — | — |
| 3 | Choose Parent menu "Finance" | Preview shows Finance with its six sub-menus; the item moves to position 7 of 7 | Only top-level menus are offered | — |
| 4 | Type Page URL "/finance/payment-runs", choose an icon | — | URL has no spaces and is not used by another menu | — |
| 5 | Move the item up with ↑ to position 2 | Preview shows "2 of 7" | — | — |
| 6 | Click **Save menu** | Checks fields; saves; toast "Menu added" / "Payment Runs · /finance/payment-runs"; modal closes | All required fields filled; name unique under Finance | Payment Runs appears under Finance at position 2; the later sub-menus shift down by one |
| 7 | Open Roles & Access | The new page appears under Finance in the grid with View, Add, Edit, Delete, Export available | — | Not ticked for Training Partner, Finance Manager, Program Manager or Support Executive; ticked for Super Admin. The real sidebar does **not** show it (OQ-ACC-001) |

### 6.2 Reorder a top-level menu

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the Reports row | Edit menu opens; preview highlights Reports at "9 of 11" (demo menu: Reports 9, Settings 10, Support desk 11); **Save changes** disabled | — | — |
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
| 1 | Open Roles & Access | Training Partner is selected; grid shows Training Partner's permissions | — | — |
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

### 6.6 Add a user

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Settings › Manage Users and click **Add user** | Modal "Add user" opens on **Personal**; footer shows "Step 1 of 3", **Cancel** and **Next** | — | — |
| 2 | Click **Next** without typing | Missing-value messages appear on Full name, Gender, Date of birth, Email and Mobile number; the step stays | BR-ACC-020, BR-ACC-021 | — |
| 3 | Fill Full name, Gender, Date of birth, Email and Mobile number (optionally a photo, or an alternate email / number through the "+" links) and click **Next** | **Address** opens; Country is already "India" | Format and duplicate checks pass | — |
| 4 | Fill Address line 1, State, City and a 6-digit Pincode; click **Next** | **Login & role** opens | — | — |
| 5 | Choose Role, Designation and Application; optionally a Parent user; click **Use email as username**; type a password | Username takes the email; the strength hint under the password fills in as rules are met | Username unique and 4–60 allowed characters; password 8+ characters with upper and lowercase letters and a number | — |
| 6 | Click **Save user** | Saves; toast "User added" — "\<full name> · \<username>"; modal closes | Every step valid | The user appears in the list (A–Z by name) as Active |

### 6.7 Edit or deactivate a user

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click a row (or its pencil) | "Edit user" opens on **Personal** with the saved details; every step can be clicked; no save button yet | — | — |
| 2 | Click **Login & role** in the step bar | Step opens: no Password field; a **Status** switch "Active — can sign in" | — | — |
| 3 | Turn Status off | Switch reads "Inactive — can’t sign in"; **Save changes** appears | — | — |
| 4 | Click **Save changes** | Toast "User updated" — "\<full name> · \<username>" | All steps valid; otherwise the first step with problems opens with "Check the highlighted fields" | Status shows Inactive; the Active / Inactive pill counts change. The user can still not be prevented from signing in (OQ-ACC-022) |

### 6.8 Change a user's password

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the key on a row | "Change password" opens for that user; cursor in New password | — | — |
| 2 | Type a new password | The checklist ticks the rules that are met; the bar and label show the strength | — | — |
| 3 | Type it again in Confirm password and press Enter (or click **Change password**) | Toast "Password changed" — "\<full name> can sign in with the new password."; modal closes | Password meets BR-ACC-027 and both fields match | Only the date of the change is recorded in the demo (OQ-ACC-023) |

### 6.9 Delete a user who has reports

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the bin on Arvind Chauhan | "Delete this user?" — "Arvind Chauhan (arvind.chauhan@hero.example) will no longer be able to sign in. 2 people report to them and will have no parent user." | Demo data: Pooja Nair and Farah Siddiqui report to Arvind | — |
| 2 | Click **Delete** | Toast "User deleted" — "Arvind Chauhan can no longer sign in." | — | Arvind is removed; Pooja's and Farah's Parent user is now empty |

## 7. Forms and Field-Level Specifications

Validation timing in the menu modal follows SH-004: "Enter the …" and "Choose …" errors appear only after **Save menu** / **Save changes** is pressed; problems with typed text (duplicate name, spaces in the URL, URL already used) appear when the user leaves a field that has text in it, and again on save. Errors update as the user types and clear as soon as the value becomes valid. Module and Icon are checked as soon as a value is chosen.

### 7.1 Add / Edit menu

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Module | Searchable select (placeholder "Select module") | Which portal the menu belongs to | Required | N/A | N/A | "Training Partner" (the only option) | "Training Partner" (Add); saved value (Edit) | Must have a value. The field cannot be cleared, so the error cannot occur in the current build | — | "Choose the module" |
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

**Validation timing in the user modal (sections 7.4–7.6)** matches SH-004: missing-value messages ("Enter …", "Choose …") appear only after **Next** is pressed on that step, or after **Save user** / **Save changes** (which switches them on for every step). Format, range and duplicate messages appear when the user leaves a field that has a value in it, and again on Next / Save. Once shown, messages update as the user types and clear as soon as the value is valid. Fields that are chosen from a list (Gender, Country, State, City, Role, Designation, Application) only have a missing-value message.

### 7.4 Add / Edit user: Personal

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Photo | Round photo picker beside Full name (accessible name "Add a photo" / "Change photo"; × "Remove photo") | Picture shown in the list, cards and Parent user lists | Optional | N/A | 2 MB | PNG or JPG files only | None (Add); saved photo (Edit) | Checked as soon as a file is chosen; the file is not accepted if it fails | Hover shows a camera to change it; × removes it. No initials preview inside the picker | Error toasts: "Use a PNG or JPG photo." / "Photo must be under 2 MB." |
| Full name | Text (placeholder "e.g. Meera Iyer") | The user's name | Required | 1 non-space character | 80 characters (typing stops at 80) | Any characters | Empty (Add); saved name (Edit) | Spaces-only counts as empty. Surrounding spaces are not removed on save [Requires Confirmation] (OQ-ACC-026). No uniqueness rule | — | "Enter the full name" |
| Gender | Select (placeholder "Select gender") | Personal detail; list filter | Required | N/A | N/A | Female, Male, Other | Empty (Add); saved value (Edit) | Must be chosen | — | "Choose a gender" |
| Date of birth | Date picker | Personal detail | Required | Today minus 100 years | Today minus 16 years | A valid date | Empty (Add); saved date (Edit) | The user must be at least 16 and at most 100 years old. Uses the app's standard date picker (same as every other date field), with **month and year dropdowns** in the calendar header so a birth year can be reached in one step. It opens on the latest allowed date (16 years ago) when empty, dates outside the range can't be picked, and there is no "Today" button (today isn't allowed). The date can't be typed | — | Empty: "Enter the date of birth". "The user must be at least 16" / "Check the year" remain as safeguards but can't be reached through the picker |
| Email | Email with @ icon (placeholder "name@company.com") | Main contact; usually also the username | Required | 1 character | Requires Confirmation | text@domain.tld with at least 2 characters after the last dot and no spaces. Spaces at the start or end are dropped as the user types | Empty (Add); saved email (Edit) | Valid format. Unique among all users, ignoring case; the user's own email is allowed in Edit (BR-ACC-023) | — | Empty: "Enter an email address". Format: "Enter a valid email, e.g. name@company.com". Duplicate: "Another user already uses this email" |
| Alternate email | Email with @ icon (placeholder "Another email") | Second contact email | Optional | N/A | Requires Confirmation | Same format as Email | Hidden behind "+ Alternate email" (Add, or Edit with no saved value); shown with the saved value otherwise | When filled: valid format, and different from Email (ignoring case). Not checked against other users | Appears with the cursor in it when the link is clicked | Format: "Enter a valid email, e.g. name@company.com". Same as Email: "Use a different email from the main one" |
| Mobile number | Number with fixed "+91" prefix (placeholder "98765 43210") | Main phone | Required | 10 digits | 10 digits (typing stops at 10) | Digits only (anything else is dropped as typed); 10 digits starting with 6, 7, 8 or 9 | Empty (Add); saved number (Edit) | Valid Indian mobile number. Not checked for uniqueness | Same "+91" prefix whatever the country of the address (OQ-ACC-026) | Empty: "Enter a mobile number". Format: "Mobile number is 10 digits starting 6–9" |
| Alternate mobile number | Number with "+91" prefix (placeholder "Another number") | Second phone | Optional | 10 digits | 10 digits | As Mobile number | Hidden behind "+ Alternate number" (Add, or Edit with no saved value); shown with the saved value otherwise | When filled: valid format, and different from Mobile number | Appears with the cursor in it when the link is clicked | Format: "Mobile number is 10 digits starting 6–9". Same as Mobile number: "Use a different number from the main one" |

### 7.5 Add / Edit user: Address

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Address line 1 | Text (placeholder "House / building, street") | Postal address | Required | 1 non-space character | Requires Confirmation | Any characters | Empty (Add); saved value (Edit) | Spaces-only counts as empty | — | "Enter address line 1" |
| Address line 2 | Text (placeholder "Area, landmark") | Postal address | Optional | N/A | Requires Confirmation | Any characters | Empty | None | — | N/A |
| Country | Searchable select (placeholder "Select country"; search "Search countries…") | Postal address | Required | N/A | N/A | India, United Arab Emirates, Singapore, United Kingdom, United States (the same fixed list as the client forms, not the Country master; OQ-GEN-003) | "India" | Must be chosen. The field cannot be cleared, so the message cannot occur today | Changing the country clears State and City | "Choose a country" |
| State | Searchable select (placeholder "Select state"; search "Search states…") | Postal address | Required | N/A | N/A | The chosen country's states, A–Z | Empty (Add); saved value (Edit) | Must be chosen | Disabled until a country is chosen. Changing the state clears City | "Choose a state" |
| City | Searchable select (placeholder "Select city", or "Pick a state first" while no state is chosen; search "Search cities…") | Postal address | Required | N/A | N/A | The chosen state's cities | Empty (Add); saved value (Edit) | Must be chosen | Disabled until a state is chosen | "Choose a city" |
| Pincode | Text (placeholder "400001") | Postal address | Required | India: 6 digits; other countries: 1 character | India: 6 (typing stops at 6); other countries: 10 | India: digits only (anything else is dropped as typed), exactly 6 digits. Other countries: any characters, no format rule (OQ-ACC-026) | Empty (Add); saved value (Edit) | India: exactly 6 digits | Limit and format follow the chosen country | Empty: "Enter the pincode". India, not 6 digits: "Pincode is 6 digits" |

### 7.6 Add / Edit user: Login & role

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Role | Searchable select (placeholder "Select role"; search "Search roles…") | What the user does | Required | N/A | N/A | The enabled roles of the Role master (Settings › Industry & job › Role), in master order. Demo: HR Manager, SE Tester, Program Manager, Participant, Channel Partner, Manager, BD, Finance, Audit, Trainer [Requires Confirmation] (OQ-ACC-021) | Empty (Add); saved value (Edit) | Must be chosen | Not the Roles & Access roles | "Choose a role" |
| Designation | Searchable select (placeholder "Select designation"; search "Search designations…") | Job title | Required | N/A | N/A | The enabled designations of the Designation master (Settings › Industry & job › Designation), each name once, A–Z | Empty (Add); saved value (Edit) | Must be chosen | A saved designation that is no longer enabled is kept but shows as empty in the field (OQ-ACC-021) | "Choose a designation" |
| Application | Select (placeholder "Select application") | Which application the login is for | Required | N/A | N/A | LearnNext, Prism [Requires Confirmation] (OQ-ACC-018) | Empty (Add); saved value (Edit) | Must be chosen | — | "Choose an application" |
| Parent user | Searchable select, clearable (placeholder "Select user"; search "Search users…") | Who the user reports to [Requires Confirmation] (OQ-ACC-019) | Optional | N/A | N/A | Any other user (name, with the role under it). In Edit, the user and everyone who reports to them, directly or through others, are left out (BR-ACC-030) | None (Add); saved value (Edit) | None | Cleared automatically when that parent user is deleted | N/A |
| Username | Text (placeholder "e.g. name@company.com") with a **Use email** button | Name used to sign in | Required | 4 characters | 60 characters (typing stops at 60) | Letters, digits and . _ @ - only. Spaces at the start or end are dropped as the user types | Empty (Add); saved value (Edit) | Allowed characters and length. Unique among all users, ignoring case; the user's own username is allowed in Edit (BR-ACC-022) | **Use email** (shown while an email is entered and differs from the username) copies the email | Empty: "Enter a username". Format: "4–60 letters, digits or . _ @ -". Duplicate: "Another user already has this username" |
| Password | Password (placeholder "Set a password") | First password | Required (Add only) | 8 characters | Requires Confirmation | At least 8 characters, with upper and lowercase letters and at least one number; a symbol is optional (BR-ACC-027) | Empty | Checked in this order: length, letter cases, number | Not shown in Edit (BR-ACC-028). The strength hint (thin bar + one rule line) sits under it and fills in while typing (5.11) | Empty: "Enter a password". "Use at least 8 characters". "Use upper and lowercase letters". "Add at least one number" |
| Status | Switch | Whether the user may sign in | Edit only | N/A | N/A | On "Active — can sign in" / off "Inactive — can’t sign in" | Saved status. New users are always Active | None | Takes the Password field's place in Edit. Not enforced at sign-in (OQ-ACC-022) | N/A |
| Admin rights | Switch | Whether the user can manage other users [Requires Confirmation] (OQ-ACC-020) | Optional | N/A | N/A | On "Yes — can manage other users" / off "No" | Off (Add); saved value (Edit) | None | Shown as a shield beside the name in the list and counted in the "Admin rights" pill | N/A |

### 7.7 Change password

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| New password | Password (placeholder "Set a new password") | The new password | Required | 8 characters | Requires Confirmation | As the Add user Password (BR-ACC-027) | Empty each time the modal opens | Messages appear after **Change password** is clicked, or when the field is left with text in it | Strength meter and checklist below it, always shown | Empty: "Enter a password". "Use at least 8 characters". "Use upper and lowercase letters". "Add at least one number" |
| Confirm password | Password (placeholder "Type it again") | Guard against typos | Required | N/A | N/A | Exactly the same as New password (case-sensitive) | Empty | Same timing as New password | Re-checked as either field changes once its message is showing | Empty: "Type the password again". Different: "The passwords don’t match" |

### 7.8 Manage Users list controls

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search name, username, email, mobile… | Search text | Filter users | Optional | N/A | Requires Confirmation | Contains, case-insensitive, on full name, username, email, mobile number, role and designation | Empty | None | Result line shown while text is present | N/A |
| Status pill | Single-select pills | Filter by status | Optional | N/A | N/A | All users, Active, Inactive ("Admin rights" is a count only) | All users | None | Hidden on phones; replaced by the drawer's Status | N/A |
| Status (drawer, phones only) | Segmented control | Filter by status | Optional | N/A | N/A | All, Active, Inactive, each with its count | The current pill value | None | Counts in the Filters button badge | N/A |
| Role (drawer) | Multi-select with search (placeholder "Any role"; search "Search roles…") | Filter by role | Optional | N/A | N/A | Every role that at least one user has, A–Z; several can be chosen (a user matches any of them) | None | None | One chip per chosen role | N/A |
| Application (drawer) | Segmented control | Filter by application | Optional | N/A | N/A | All, LearnNext, Prism | All | None | Chip with the application name | N/A |
| Admin rights (drawer) | Segmented control | Filter by admin rights | Optional | N/A | N/A | All, Yes, No | All | None | Chip "Admin rights" / "No admin rights" | N/A |
| Gender (drawer) | Segmented control | Filter by gender | Optional | N/A | N/A | All, Female, Male, Other | All | None | Chip with the gender | N/A |
| Page size | Select | Rows per page | Optional | N/A | N/A | 10, 20, 50, All rows | 10 | None | Table only; cards are 12 per page | N/A |

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
| BR-ACC-010 | Menu master drives the sidebar [Partially Implemented] | The Training Partner menu should follow this master | Any menu change | The real sidebar, search "Jump to" list and routes are fixed and ignore this master | Adding "Payment Runs" | No sidebar change (OQ-ACC-001) |
| BR-ACC-011 | View is the base permission | Any action on a page requires View; removing View removes everything on that page | Any checkbox change | Ticking Add/Edit/Delete/Export/Approve ticks View; clearing View clears the row | — | Checkbox states |
| BR-ACC-012 | Actions offered per page | Each page offers only the actions that fit it, decided by its page address: Dashboard and Reports: View, Export. Settings: View, Add, Edit, Delete. Support desk: View, Edit, Export. Invoice Approvals: View, Approve, Export. Trainer Invoice and Facilitators: View, Add, Edit, Delete, Export, Approve. Any other page (including new menus): View, Add, Edit, Delete, Export. A parent with sub-pages has no actions of its own | Grid display | Other actions show a dash | — | "\<Action> isn’t available on this page". Changing a menu's address changes its actions (OQ-ACC-007) |
| BR-ACC-013 | Super Admin locked | Super Admin always has every available action on every page and cannot be edited | Super Admin selected; save | Checkboxes disabled; new menus are included automatically | Attempt to save Super Admin (not possible from the page) | Locked note. Safety-net message "Super Admin always has full access." |
| BR-ACC-014 | New menus start without access | A menu added in Menu Mapping appears in the grid for every role; for every role except Super Admin it starts with nothing ticked | After adding a menu | Access must be granted explicitly | — | — (OQ-ACC-010) |
| BR-ACC-015 | Draft and explicit save | Permission changes are held as a draft until **Save changes** | Roles & Access | Save bar shows the count; Discard restores; switching role asks first | — | "N unsaved changes to \<role>" |
| BR-ACC-016 | Permissions enforced [Partially Implemented] | Each role's permissions should limit what its users see and do | Everywhere | Not enforced; no user is linked to a role | — | None (SH-002, OQ-ACC-002) |
| BR-ACC-017 | Fixed role list [Not Implemented] | Roles are maintained elsewhere or are fixed | Roles & Access | No add, rename or delete; the people count per role is fixed demo data | — | — (OQ-ACC-003) |
| BR-ACC-018 | Creator recorded [Inferred] | New menus record the signed-in user's name and the date | Add menu | Recorded, but not shown anywhere on the page | — | — (OQ-ACC-013) |
| BR-ACC-019 | Required user fields | Full name, Gender, Date of birth, Email, Mobile number, Address line 1, Country, State, City, Pincode, Role, Designation, Application and Username are required; Password is required when adding | Next (current step) and Save (every step) | Not saved; the step does not advance | Any left empty or spaces only | "Enter the full name", "Choose a gender", "Enter the date of birth", "Enter an email address", "Enter a mobile number", "Enter address line 1", "Choose a country", "Choose a state", "Choose a city", "Enter the pincode", "Choose a role", "Choose a designation", "Choose an application", "Enter a username", "Enter a password" |
| BR-ACC-020 | User form validation timing | Missing-value messages appear only after Next / Save; format, range and duplicate messages appear on leaving a field that has a value. Matches SH-004 | User modal; Change password | — | Tabbing through empty fields | No message until Next / Save |
| BR-ACC-021 | Step by step | **Next** checks only the current step and stays on it while anything is wrong. When adding, later steps can be opened only by **Next**; earlier ones can be revisited without checks. **Save** checks every step and opens the first step with problems | User modal | Error toast on a failed Save | Save with a problem on Personal while on Login & role | "Check the highlighted fields" — "N fields need a fix in \<step>." |
| BR-ACC-022 | Unique, well-formed username | 4–60 characters, only letters, digits and . _ @ -; no two users share a username, ignoring case | Blur (with text), Next, Save; checked again when saving | Not saved | "ab"; "meera iyer"; "MEERA.IYER@titan.example" | "4–60 letters, digits or . _ @ -" / "Another user already has this username". Safety net at save: toast "Couldn’t add the user" / "Couldn’t save the user" — "Another user already has this username." |
| BR-ACC-023 | Unique email; distinct alternate email | Every user has a different email, ignoring case. The alternate email, when given, is valid and differs from the user's own email; it is not compared with other users | Blur (with text), Next, Save | Not saved | Email used by another user; alternate = main | "Another user already uses this email" / "Use a different email from the main one". Safety net at save: toast with "Another user already uses this email." |
| BR-ACC-024 | Indian mobile numbers | Mobile numbers are 10 digits starting 6–9, shown after a fixed "+91". The alternate number differs from the main one. Numbers need not be unique | Blur (with text), Next, Save | Not saved | "12345"; "5123456789"; alternate = main | "Mobile number is 10 digits starting 6–9" / "Use a different number from the main one" |
| BR-ACC-025 | Age range | Users are at least 16 and at most 100 years old on the day the form is used | Blur, Next, Save | Not saved | Born less than 16 years ago; more than 100 years ago | "The user must be at least 16" / "Check the year" |
| BR-ACC-026 | Indian pincode | For an address in India the pincode is exactly 6 digits; other countries have no format rule | Blur (with text), Next, Save | Not saved | "40001" with India | "Pincode is 6 digits" |
| BR-ACC-027 | Password rule | A password has at least 8 characters, upper and lowercase letters and at least one number; a symbol is optional. The confirmation must match exactly | Add user; Change password | Not saved | "password1"; "Password"; "Pass1" | "Use upper and lowercase letters" / "Add at least one number" / "Use at least 8 characters"; "The passwords don’t match" |
| BR-ACC-028 | Password kept out of Edit | Editing a user never shows or changes the password; it is changed only with **Change password** | Edit user | No Password field in Edit | — | — |
| BR-ACC-029 | Status | New users are Active. Edit offers a Status switch; Inactive is meant to stop the user signing in [Partially Implemented] | Add; Edit | Status shown in the list and pills | — | "Active — can sign in" / "Inactive — can’t sign in". Not enforced at sign-in (OQ-ACC-022) |
| BR-ACC-030 | No reporting loops | A user cannot be their own parent user, nor report to anyone who reports to them (directly or through others) | Parent user list in Edit | Those users are not offered | Editing Vikram Sethi | Ananya Kulkarni, Rahul Menon, Neelam Arora and Vikram himself are not offered |
| BR-ACC-031 | Delete with reports | Deleting a user asks for confirmation, says how many people report to them, and clears those people's Parent user. There is no undo | Delete | User removed; reports keep everything else | — | "N people report to them and will have no parent user." / toast "User deleted" |
| BR-ACC-032 | Lists from other masters [Requires Confirmation] | Role offers the enabled roles of the Role master and Designation the enabled designations of the Designation master (Settings › Industry & job). They are not the Roles & Access roles | Login & role step | Disabled entries are not offered | The old system's "Client" role | Not available (OQ-ACC-021) |
| BR-ACC-033 | Application [Requires Confirmation] | Each user is for one application: LearnNext or Prism | Login & role step; list filter | Shown under the name when there is no designation; filterable | — | — (OQ-ACC-018) |
| BR-ACC-034 | Admin rights [Requires Confirmation] | "Admin rights" marks a user who can manage other users | Add / Edit; list | Stored, shown as a shield and counted; grants nothing | — | — (OQ-ACC-020) |
| BR-ACC-035 | No change, no save (users) | In Edit, **Save changes** is offered only while something differs from the opened values | Edit user | Button hidden when nothing changed, or when every change is undone | — | — |
| BR-ACC-036 | Passwords and notices [Partially Implemented] | Passwords set in Add user or Change password should be stored securely and used at sign-in; the user should learn about the new account or password | Add user; Change password | Neither happens in the demo: only the date of the last change is kept, and no email or notification is sent | — | Toasts only (OQ-ACC-023, OQ-ACC-025) |
| BR-ACC-037 | Accounts not linked [Partially Implemented] | A user account should be the login of a person known elsewhere (SPOC, facilitator, participant, Training Partner staff) | Any | Accounts are separate records; no SPOC, facilitator or participant is linked to one, and sign-in does not use them | — | — (OQ-ACC-024) |

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
| Add user | Saved | Success toast | "User added" — "\<full name> · \<username>" | After **Save user** | — |
| Edit user | Saved | Success toast | "User updated" — "\<full name> · \<username>" | After **Save changes** | — |
| Save user with problems | Any step invalid | Error toast | "Check the highlighted fields" — "N fields need a fix in \<step>." ("1 field needs a fix in \<step>.") | After **Save user** / **Save changes**; the first step with problems opens | Fix the fields |
| Add / edit user fails | Error | Error toast | "Couldn’t add the user" / "Couldn’t save the user" — reason ("Another user already has this username.", "Another user already uses this email." or "This user no longer exists.") | After the save attempt | Fix and retry |
| Photo rejected | Wrong type or too large | Error toast | "Use a PNG or JPG photo." / "Photo must be under 2 MB." | When the file is chosen | Choose another file |
| Change password | Saved | Success toast | "Password changed" — "\<full name> can sign in with the new password." | After **Change password** | — |
| Change password fails | Error | Error toast | "Couldn’t change the password" — reason (for example "This user no longer exists.") | After the attempt | Close and retry |
| Delete user | Deleted | Success toast | "User deleted" — "\<full name> can no longer sign in." | After **Delete** | — |
| Delete user fails | Error | Error toast | "Couldn’t delete the user" — reason | After **Delete** | Retry |
| Password strength | Typing a password | Inline strength hint | Thin bar + "8+ characters · upper & lower case · a number · a symbol (optional)" (met parts green); "✓ Passwords match" under Confirm | Always under the password field (Add user step 3, Change password); parts turn green while typing | — |

Toasts follow SH-005.

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Menu tree table | The Training Partner menu | Menu order (parents by priority, each followed by its sub-menus by priority); fold/unfold per parent; no column sorting | Columns: Menu, Module, Page name, Page URL, Priority, actions. 50 rows per page; 20/50/All | Empty master: "No menus yet" / "Add the pages the Training Partner menu shows." + **Add menu**. No match: "No menus match" / "Try a different search." + **Clear search & filters** |
| Menu search and pills | Narrow the list | Section 7.2; results are shown flat, sub-menus labelled "under \<Parent>" | Result line "N of Total menus" + **Clear all** (SH-008) | As above |
| Menu list loading / failure | — | Skeletons while loading; error state with **Try again** (SH-007) | — | "Couldn’t load data" (table) / "Couldn’t load the list" (cards) |
| Roles list | Choose a role | Seed order: Super Admin, Training Partner, Finance Manager, Program Manager, Support Executive | Search by name | "No roles match “\<text>”" |
| Permission grid | Pages × actions | Menu order with sub-pages indented; sticky header row | Six action columns; dashes where an action does not apply | No match: "No pages match" / "Try a different search." (no clear button; differs from SH-007). Loading: "Loading access…". Load failure: "Couldn’t load roles" with the reason and **Try again** |
| Header counts | Summary | "N people" and "Opens X of Y pages" | People counts in the demo: Super Admin 2, Training Partner 4, Finance Manager 3, Program Manager 5, Support Executive 6 | — |
| Manage Users table | The user accounts | Sortable by every column except the actions (ascending, then descending; SH-008). Default: Full name A–Z. Row click opens Edit | Columns: **Full name** (photo, name, admin shield, designation or application), **Username**, **Role**, **Gender** ("—" when empty), **Email**, **Mobile number** ("—" when empty), **Status** (dot and "Active" / "Inactive", SH-008 status style), actions (Change password, Edit, Delete). 10 rows per page; 10/20/50/All rows | Empty master: "No users yet" / "Add the people who can sign in." + **Add user**. No match: "No users match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| Manage Users pills, search and filters | Narrow the list | Sections 5.8, 5.9 and 7.8. Pills, search and drawer filters combine (a user must match all of them) | Result line "N of Total users" with chips and **Clear all** | As above |
| Manage Users cards (phones) | The user accounts on phones | Name A–Z; 12 per page | Card content in 5.8 | Same empty states |
| Manage Users loading / failure | — | Skeletons while loading; error state with **Try again** (SH-007) | — | "Couldn’t load data" (table) / "Couldn’t load the list" (cards) |

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
| Reload | Any time | Menus, permissions and users return to the demo data (SH-001) | — | — |
| No users | Every user deleted | Empty state with **Add user**; pills show 0 | "No users yet" | **Add user** |
| Edit a demo user with missing details | Some demo users have no mobile number (for example Rahul Menon) or no designation (for example Ananya Kulkarni) | The list shows "—" (or the application under the name); saving an edit asks for the missing value | "Enter a mobile number" / "Choose a designation" after **Save changes** | Fill the field |
| Saved designation no longer enabled | Farah Siddiqui's designation "BDE" is disabled in the Designation master | The Designation field looks empty but keeps "BDE"; saving keeps it; choosing another value replaces it | — | OQ-ACC-021 |
| Change country | Country changed after State, City and Pincode were filled | State and City are cleared; Pincode is kept and re-checked against the new country's rule | "Choose a state", "Choose a city" after Next / Save; "Pincode is 6 digits" when switching to India with a non-6-digit pincode | Choose again |
| Case-only username or email change | "Meera.Iyer@titan.example" for Meera Iyer | Allowed (own value excluded) | Toast "User updated" | — |
| Username equals another user's email | Typing a username that is someone else's email but not their username | Allowed: usernames are only compared with usernames | — | OQ-ACC-026 |
| Alternate email used by another user | Alternate email equals another user's main email | Allowed (not checked) | — | OQ-ACC-026 |
| Phone filter count | Status chosen in the drawer on a phone | The Filters badge counts it; no chip is added for Status | — | — |
| Parent user deleted | The user's parent is deleted | Parent user becomes empty; the person stays in the list unchanged otherwise | Mentioned in the delete dialog ("N people report to them …") | Choose a new parent user |
| Close Change password after typing | Text in either field | Closes without asking; nothing is saved | — | Open again |
| User deleted elsewhere while open | Same session | Save or Change password fails | "Couldn’t save the user" / "Couldn’t change the password" — "This user no longer exists." | Close the modal |
| Deactivated user signs in | A user is set to Inactive | Nothing changes at sign-in in the demo; the accounts in this master are not used for sign-in | — | OQ-ACC-022 |
## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Roles & Access ← Menu Mapping & Access | The permission grid's rows are the Menu Mapping master | Add, rename, re-icon, reorder, re-parent or delete a menu | Reflected in the grid the next time Roles & Access is opened: new menus appear as rows (unticked except for Super Admin), order and names follow the master | BR-ACC-012, BR-ACC-014 |
| App shell sidebar ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)) | The demo menu mirrors the sidebar order: Dashboard, All Clients, Projects, Finance (with six sub-menus), Manage Content, Facilitators, Assessments, Polls & Surveys, Reports (priority 9), Settings (priority 10, the last main item since 2026-11-06), plus Support desk (11); "System pages" (Dev only) is not in the master | Any menu change | None: the sidebar is fixed | BR-ACC-010, OQ-ACC-001, OQ-SHELL-012 |
| All pages (SH-002) | Role permissions should restrict pages and actions | Save permissions | None: not enforced | BR-ACC-016, OQ-ACC-002 |
| Authentication ([authentication-prd.md](authentication-prd.md)) | Sign-in should determine the user's role | Sign in | No role is assigned | SH-002 |
| Profile ([profile-prd.md](profile-prd.md)) | "Access level" shows the portal role in use (Training Partner / Super Admin) | — | Not linked to these roles | OQ-PROF-011 |
| Manage Content ([manage-content-prd.md](manage-content-prd.md)) | Manage Content offers View, Add, Edit, Delete, Export | — | The page has no export or delete; not enforced | OQ-CNT-018 |
| Facilitators ([facilitators-prd.md](facilitators-prd.md)) | Facilitators offers Approve (KYC) | — | Not enforced | OQ-FAC-014 |
| Support desk ([support-desk-prd.md](support-desk-prd.md)) | Support desk offers View, Edit, Export; the Support Executive role has View and Edit | — | Not enforced | OQ-SUP-012 |
| Dashboard ([dashboard-prd.md](dashboard-prd.md)) | Dashboard offers View and Export | — | Not enforced | OQ-DASH-011 |
| Settings hub ([settings-hub-prd.md](settings-hub-prd.md)) | Entry points in the "Users & Access" group (first group; "Logins, roles and what they can open."): "Manage Users" ("Logins, passwords and who reports to whom"), "Roles & Access" ("What each role can see and do") and "Menu Mapping & Access" ("Pages in the Training Partner menu and their order"). Manage Users is also found by the words user, users, login, account, password, reset, username, staff, people, member and admin | Open | Added to Recently opened | BR-SET-002 |
| Settings – Industry & job masters ([settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md)) | The CRM "Role" master is a different concept from Roles & Access (job roles, not access roles). Manage Users takes its Role list from the enabled entries of that Role master and its Designation list from the enabled entries of the Designation master | A role or designation is enabled or disabled in the CRM (those masters are read-only) | Only enabled entries are offered in the user form; users keep a saved value that is no longer enabled | BR-ACC-032, OQ-ACC-021 |
| Manage Users ↔ Roles & Access | Users have a Role from the Role master, not one of the Roles & Access roles, so no user is linked to a permission role | — | None | OQ-ACC-002, OQ-ACC-021 |
| Authentication ([authentication-prd.md](authentication-prd.md)) | User accounts, passwords and Inactive status should drive sign-in | Add user, Change password, Status off | None: sign-in uses the demo login only | OQ-ACC-022, OQ-ACC-023 |
| All Clients, Client Details (SPOCs, Participants), Facilitators ([clients-prd.md](clients-prd.md), [client-detail-prd.md](client-detail-prd.md), [facilitators-prd.md](facilitators-prd.md)) | SPOCs, participants and facilitators are separate records; adding one does not create a user account, and a user account is not linked to them | — | None | OQ-ACC-024 |
| Address fields | Country, State and City use the same fixed list as the client forms, not the Location masters | — | — | OQ-GEN-003 |

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

**AC-ACC-010: Training Partner selected by default; Super Admin locked**
- Given the user opens Roles & Access
- Then Training Partner is selected
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
- Given 2 unsaved changes on Training Partner
- When the user clicks Support Executive
- Then "Discard your changes?" / "Your 2 unsaved changes to Training Partner won’t be saved." appears; **Keep editing** keeps Training Partner; **Discard** opens Support Executive

**AC-ACC-015: New menu appears in Roles & Access**
- Given a menu "Payment Runs" was added under Finance
- When the user opens Roles & Access
- Then "Payment Runs" is a row under Finance offering View, Add, Edit, Delete and Export, unticked for Training Partner and ticked for Super Admin

**AC-ACC-016: Not applied to the sidebar or pages (known gap)**
- Given a menu was added, reordered or deleted, and a role's permissions were changed
- Then the application sidebar is unchanged and every page and action remains available to the signed-in user

**AC-ACC-017: Manage Users list**
- Given the demo data and a screen at least 1536 px wide
- When the user opens Settings › Manage Users
- Then the pills read All users 18, Active 16, Inactive 2 and Admin rights 4
- And the table shows Full name, Username, Role, Gender, Email, Mobile number and Status, sorted by Full name A–Z, 10 rows per page
- And users with admin rights show a shield beside their name

**AC-ACC-018: Search, pills and filters**
- Given the Manage Users list
- When the user types "titan" in the search
- Then only the four users with a titan.example username or email are listed, with "4 of 18 users"
- And clicking the Inactive pill instead lists Farah Siddiqui and Sanjay Verma
- And choosing Application "Prism" in the drawer shows "Show 4 users", and applying it adds a "Prism" chip

**AC-ACC-019: Add a user**
- Given the Add user modal
- When the user completes Personal, Address and Login & role with valid, unused values and clicks **Save user**
- Then the toast "User added" — "\<full name> · \<username>" appears, the modal closes and the user is listed as Active

**AC-ACC-020: Missing values only after Next (negative)**
- Given the Add user modal on Personal with nothing entered
- When the user tabs through every field
- Then no message is shown
- And when the user clicks **Next**, "Enter the full name", "Choose a gender", "Enter the date of birth", "Enter an email address" and "Enter a mobile number" appear and Personal stays open

**AC-ACC-021: Typed-value messages on leaving the field (negative)**
- Given the Add user modal on Personal
- When the user types "abc" in Email and leaves the field
- Then "Enter a valid email, e.g. name@company.com" appears at once, without pressing Next
- And "12345" in Mobile number shows "Mobile number is 10 digits starting 6–9" on leaving the field

**AC-ACC-022: Unique username and email (negative)**
- Given the Add user modal
- When the user enters the email "Deepak.Joshi@learnnext.example" and leaves the field
- Then "Another user already uses this email" appears
- And the username "MEERA.IYER@titan.example" shows "Another user already has this username"

**AC-ACC-023: Save opens the step that needs fixing**
- Given the Edit user modal for any user
- When the user clears Full name, opens **Login & role** in the step bar and clicks **Save changes**
- Then Personal opens with "Enter the full name"
- And the toast "Check the highlighted fields" — "1 field needs a fix in Personal." appears and nothing is saved

**AC-ACC-024: Edit hides the password and shows Status**
- Given the Edit user modal for an Active user
- Then no save button is shown until something changes, and step 3 has no Password field but a Status switch "Active — can sign in"
- And when Status is turned off and **Save changes** is clicked, the toast "User updated" appears and the list shows the user as Inactive

**AC-ACC-025: Parent user cannot create a loop**
- Given the Edit user modal for Vikram Sethi
- When the user opens Parent user
- Then Vikram Sethi, Ananya Kulkarni, Rahul Menon and Neelam Arora are not offered
- And every other user is offered with their role

**AC-ACC-026: Change password**
- Given the Change password modal for Meera Iyer
- When the user types "Welcome1" twice and clicks **Change password**
- Then the toast "Password changed" — "Meera Iyer can sign in with the new password." appears
- And "welcome1" shows "Use upper and lowercase letters" on leaving the field, and a different confirmation shows "The passwords don’t match"

**AC-ACC-027: Delete a user with reports**
- Given Pooja Nair and Farah Siddiqui report to Arvind Chauhan
- When the user deletes Arvind Chauhan
- Then the dialog says "2 people report to them and will have no parent user."
- And after **Delete** the toast "User deleted" appears and both have an empty Parent user

**AC-ACC-028: Discard protection**
- Given the Add user modal with a full name typed
- When the user presses Esc
- Then "Discard this user?" / "The details you’ve entered won’t be saved." appears with **Keep editing** and **Discard**
- And clicking the dimmed backdrop does not close the modal

**AC-ACC-029: Phones**
- Given a 375 px screen
- When the user opens Manage Users
- Then users appear as cards (name A–Z, 12 per page) with "\<Role> · \<username>" and the mobile number, and no summary pills
- And the Filter users drawer offers Status (All, Active, Inactive with counts), which is counted in the Filters badge

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
| TC-ACC-023 | AC-ACC-010 | Default role and lock | — | Open page; select Super Admin | Training Partner selected; Super Admin read-only with note | P1 |
| TC-ACC-024 | AC-ACC-011 | View implied | Support Executive | Tick Export on Dashboard; clear View | View ticked; then row cleared | P1 |
| TC-ACC-025 | AC-ACC-012 | Column and row checkboxes | Program Manager | Approve column; Finance row | Approve only on Facilitators, Trainer Invoice, Invoice Approvals; Finance sub-pages full | P1 |
| TC-ACC-026 | BR-ACC-012 | Unavailable actions | Any role | Hover dash on Dashboard × Edit | "Edit isn’t available on this page" | P3 |
| TC-ACC-027 | AC-ACC-013 | Save, discard, count | Finance Manager | Two changes, toggle one back | Count 1; Save toast "Finance Manager · 1 change"; Discard restores | P1 |
| TC-ACC-028 | AC-ACC-014 | Switch role guard | Unsaved changes | Click another role | Dialog; Keep editing / Discard work | P1 |
| TC-ACC-029 | 5.7 | Page search | Training Partner | "invoice" | Finance with matching sub-pages; "zzz" → "No pages match" | P2 |
| TC-ACC-030 | AC-ACC-015 | New menu in grid | TC-ACC-001 done, same tab | Open Roles & Access | "Calendar" row, unticked for Training Partner, ticked for Super Admin | P1 |
| TC-ACC-031 | AC-ACC-016 | Not applied (gap) | Changes made | Look at sidebar, open pages | No change | P2 |
| TC-ACC-032 | 11 | Leave with unsaved permissions (gap) | Unsaved changes | Click Dashboard in sidebar | Leaves without asking | P2 |
| TC-ACC-033 | AC-ACC-017 | Users list defaults | Demo data, ≥1536 px | Open Manage Users | Pills 18 / 16 / 2 / 4; seven columns; A–Z by name; 10 rows; breadcrumb "Settings › Manage Users" | P1 |
| TC-ACC-034 | 5.8 | Columns hide by width | — | 1440, 1200, 900 px | Gender hidden below 1536; Email below 1280; Mobile number below 1024; name, username, role, status and actions remain | P3 |
| TC-ACC-035 | 10 | Sorting | — | Click each column header twice | Ascending then descending; actions column not sortable | P3 |
| TC-ACC-036 | AC-ACC-018 | Search fields | — | "titan", "9810011226", "trainer", "Head L&D", "zzz" | Matches on email/username, mobile, role, designation; "zzz" → "No users match" + **Clear search & filters** | P2 |
| TC-ACC-037 | AC-ACC-018 | Status pills | — | Click Active, Inactive, All users; click Admin rights | 16 / 2 / 18 rows; Admin rights does not filter | P2 |
| TC-ACC-038 | 5.9 | Filters drawer | — | Role "Trainer" + "Participant", Application LearnNext, Admin rights No, Gender Female | Live "Show N users"; chips per role, "LearnNext", "No admin rights", "Female"; removing a chip widens the list; **Clear all** resets everything | P2 |
| TC-ACC-039 | 5.9 | No matching filter | — | Application Prism + Role Trainer | Button "No matching users", disabled | P3 |
| TC-ACC-040 | 5.9 | Reset and close | Filters applied | Change the draft, close with Esc; reopen and click Reset | Esc discards the draft; Reset clears the draft only until applied | P3 |
| TC-ACC-041 | AC-ACC-019 | Add user, happy path | — | Valid new values on all steps; **Use email** | Toast "User added"; listed as Active; username = email | P1 |
| TC-ACC-042 | AC-ACC-020 | Missing values timing | Add modal | Tab through Personal, then Next | No messages until Next; five missing-value messages; step stays | P1 |
| TC-ACC-043 | AC-ACC-021 | Format messages on blur | Add modal | Email "abc", Mobile "12345", Mobile "5123456789" | Messages on leaving each field, before Next | P1 |
| TC-ACC-044 | BR-ACC-023 | Alternate email | Add modal | Click "+ Alternate email"; enter the same email in upper case; then "x@y" | Field appears with the cursor in it; "Use a different email from the main one"; "Enter a valid email, e.g. name@company.com" | P2 |
| TC-ACC-045 | BR-ACC-024 | Alternate number | Add modal | Click "+ Alternate number"; same number as Mobile | "Use a different number from the main one" | P2 |
| TC-ACC-046 | 5.10 | Alternate fields in Edit | — | Edit a user with no alternate values; then a user saved with an alternate email | Links shown for the first; the alternate email field shown from the start for the second | P3 |
| TC-ACC-047 | BR-ACC-025 | Date of birth range | Add modal | Open the Date of birth picker; check the Year dropdown and the days around 16 years ago; pick 15 Jun 1990 using the month / year dropdowns | Opens on the month 16 years ago; years run from 16 to 100 years ago; later days are disabled; no "Today" button; the field shows "15 Jun 1990" | P2 |
| TC-ACC-048 | 5.10 | Photo picker | Add modal | PNG 1 MB; GIF; JPG 3 MB; then × | Photo shown in the circle; "Use a PNG or JPG photo."; "Photo must be under 2 MB."; × removes it | P2 |
| TC-ACC-049 | BR-ACC-026 | Pincode | Address step | India "40001", "4000a1"; then country United Kingdom "SW1A 1AA" | "Pincode is 6 digits"; letters cannot be typed for India; UK value accepted | P2 |
| TC-ACC-050 | 7.5 | Country / state / city chain | Address step | Choose a state and city, then change Country | State and City cleared; City disabled with "Pick a state first" until a state is chosen | P2 |
| TC-ACC-051 | AC-ACC-022 | Duplicate username / email | Add modal | Email "Deepak.Joshi@learnnext.example"; username "MEERA.IYER@titan.example" | Duplicate messages on leaving each field | P1 |
| TC-ACC-052 | BR-ACC-022 | Username format | Login & role | "ab", "meera iyer" (pasted), "a/b.c", a 61st character | "4–60 letters, digits or . _ @ -"; typing stops at 60 | P2 |
| TC-ACC-053 | BR-ACC-027 | Password rule | Login & role (Add) | "Pass1", "password1", "Password", "Password1" | "Use at least 8 characters", "Use upper and lowercase letters", "Add at least one number", accepted; checklist and label update while typing | P1 |
| TC-ACC-054 | BR-ACC-021 | Step gating (Add) | Add modal on Personal | Click "Login & role" in the step bar before reaching it; reach Address, click Personal | Not reachable ahead; going back works without checks | P2 |
| TC-ACC-055 | AC-ACC-023 | Save jumps to failing step | Edit modal | Clear Full name; go to Login & role; Save changes | Personal opens; toast "Check the highlighted fields" — "1 field needs a fix in Personal." | P1 |
| TC-ACC-056 | AC-ACC-024 | Edit: Status and no password | Edit an Active user | Open step 3; turn Status off; save | No Password field; switch text changes; toast "User updated"; Inactive in list; pills 15 / 3 | P1 |
| TC-ACC-057 | BR-ACC-035 | Save changes only when changed | Edit modal | Open; change a field; change it back | No button; button appears; button disappears | P3 |
| TC-ACC-058 | 11 | Edit a user with missing details | Edit Rahul Menon | Save changes after another change | "Enter a mobile number" and "Choose a designation"; nothing saved until filled | P2 |
| TC-ACC-059 | AC-ACC-025 | Parent user exclusions | Edit Vikram Sethi; Add user | Open Parent user in each | Vikram and his three reports missing in Edit; every user offered in Add | P2 |
| TC-ACC-060 | AC-ACC-026 | Change password | Key on Meera Iyer | Weak, mismatched, then "Welcome1" twice + Enter | Messages on leaving the fields / on Change password; toast "Password changed"; Esc or backdrop closes without asking | P1 |
| TC-ACC-061 | AC-ACC-027 | Delete with reports | Demo data | Delete Arvind Chauhan; then a user with no reports | Dialog names "2 people report to them …"; toast "User deleted"; reports' Parent user empty; the second dialog has no reports sentence | P1 |
| TC-ACC-062 | AC-ACC-028 | Discard dialogs | Add and Edit modals with a change | Esc; × ; backdrop | "Discard this user?" (Add) / "Discard your changes?" (Edit); backdrop does nothing; unchanged modal closes at once | P2 |
| TC-ACC-063 | AC-ACC-029 | Phone layout | 375 px | Open Manage Users and Filters | Cards A–Z, 12 per page; no pills; Status in the drawer counted in the badge; tapping a card opens Edit | P2 |
| TC-ACC-064 | 11 | Not used for sign-in (gap) | A user added or set Inactive | Try to sign in with that username and password | Not possible / not blocked; sign-in uses the demo login only (OQ-ACC-022, OQ-ACC-023) | P2 |
| TC-ACC-065 | 12 | Role and Designation lists follow their masters | Demo data | Open Add user › Login & role; open Role and Designation | Role lists the 10 enabled roles of Settings › Role ("Guest Reviewer", disabled, is missing); Designation lists enabled designations A–Z ("BDE" and "Front Desk Coordinator", disabled, are missing) | P2 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-ACC-001 | Menu Mapping & Access | Menu changes are not applied to the sidebar, search "Jump to" list or routes (see OQ-SHELL-012) | The master has no effect; users may think they changed the menu | Confirm the master should drive the sidebar, and what happens to a menu whose address has no built page | Open |
| OQ-ACC-002 | Roles & Access | Permissions are saved but not enforced; no user is linked to a role (SH-002) | No access control exists | Define how users get roles, and how each action is enforced (hidden vs disabled, pages opened by address) | Open |
| OQ-ACC-003 | Roles & Access | Roles cannot be added, renamed, described or deleted, and people cannot be assigned; counts are fixed demo data | Role list cannot evolve | Confirm where roles and memberships are maintained | Open |
| OQ-ACC-004 | Menu – Page URL | Only spaces and duplicates are checked; trailing "/", allowed characters, external links and whether the page exists are not defined | Broken or duplicate links | Define the URL format rules | Open |
| OQ-ACC-005 | Menu fields | Limits of 40 (Menu name), 60 (Page name) and 120 (Page URL) exist in the form only | Data quality | Confirm the limits | Open |
| OQ-ACC-006 | Menu – Module | Only "Training Partner" exists; "Choose the module" can never appear | Purpose of the field unclear | Confirm which other portals will be added | Open |
| OQ-ACC-007 | Roles – actions per page | Available actions are fixed by page address; new menus always get View, Add, Edit, Delete, Export (never Approve); changing an address changes the actions | Training Partner users cannot configure actions per page | Decide whether actions should be set per menu in Menu Mapping | Open |
| OQ-ACC-008 | Roles & Access | Leaving the page (sidebar, breadcrumb, Back) with unsaved changes does not ask | Data loss | Confirm the page should use the shell's leave guard | Open |
| OQ-ACC-009 | Roles – column checkbox | The column checkbox changes hidden pages while a page search is active | Unexpected bulk changes | Confirm whether it should apply only to visible rows | Open |
| OQ-ACC-010 | Roles – new / changed menus | New menus start with no access for every editable role; a page that becomes a parent loses its own permissions from view | Training Partner users may forget to grant access | Confirm default access for new menus and handling when a page becomes a group | Open |
| OQ-ACC-011 | Menu – delete | Any menu without sub-menus can be deleted with no warning about roles that have access to it, including built pages such as Dashboard | Accidental removal | Define usage checks and warnings | Open |
| OQ-ACC-012 | Menu – nesting | Only one level of sub-menus is allowed | Future menu structures | Confirm one level is the rule | Open |
| OQ-ACC-013 | Both | Creator and creation date are recorded for menus but not shown; no history of permission changes | Audit trail | Define audit needs for menu and permission changes | Open |
| OQ-ACC-014 | Roles – grid | A parent with one sub-page reads "1 sub-pages" | Copy error | Confirm wording "1 sub-page" | Open |
| OQ-ACC-015 | Searches | Maximum lengths of the menu, module, parent, icon, role and page searches are not defined | Minor | Confirm | Open |
| OQ-ACC-016 | Menu modal | Edit Save is enabled by spaces-only changes (other masters ignore them); Enter-to-save is not defined | Consistency with other masters | Confirm both behaviours | Open |
| OQ-ACC-017 | Menu list | Default 50 rows per page with options 20/50/All, and no column sorting, differ from SH-008; a parent and its sub-menus can split across pages | Consistency | Confirm the paging rule for the tree | Open |
| OQ-ACC-018 | Manage Users – Application | The meaning of "Application" and its options are assumed: LearnNext and Prism (taken from the old system's field) | The field is required for every user and is a list filter | Confirm what Application means, the full list of options, and whether a user can have more than one | Open |
| OQ-ACC-019 | Manage Users – Parent user | "Parent user" is assumed to mean the person the user reports to; it is optional and only prevents loops | Reporting lines may drive approvals, visibility or notifications | Confirm the meaning, whether it is required for some roles, and what it controls | Open |
| OQ-ACC-020 | Manage Users – Admin rights | "Admin rights" ("can manage other users") is stored, shown and counted only; it grants nothing and nothing restricts Manage Users to admins | Anyone can manage every account | Define what Admin rights allow and who may grant them | Open |
| OQ-ACC-021 | Manage Users – Role and Designation | Role comes from the Role master (Settings › Industry & job, enabled entries only), not from Roles & Access, so no user is linked to a permission role. The old system's "Client" role is not in that master. Designation likewise uses only enabled designations; a saved value that is no longer enabled shows as empty but is kept | Users cannot be given access through Roles & Access; client users cannot be created with a matching role | Confirm which role list users take, whether "Client" must be added, and how disabled roles and designations on existing users are handled | Open |
| OQ-ACC-022 | Manage Users – Status | Inactive ("can’t sign in") is not enforced at sign-in in the demo; the accounts are not used for sign-in at all | The promise on the switch is not kept | Confirm that Inactive blocks sign-in (and ends open sessions), and whether a reason or date is recorded | Open |
| OQ-ACC-023 | Manage Users – Passwords | Passwords entered in Add user and Change password are not stored in the demo (only the date of the last change is kept) and the user cannot sign in with them | Password management cannot be tested end to end | Confirm storage, sign-in with these credentials, password expiry and reuse rules, and whether the user must change a password set by an admin | Open |
| OQ-ACC-024 | Manage Users – Links to other records | User accounts are not linked to SPOC, facilitator or participant records, nor to Training Partner staff; adding a SPOC, facilitator or participant creates no account | Duplicate data entry; people cannot sign in to their portals | Define which records get an account, when it is created, and which details are shared | Open |
| OQ-ACC-025 | Manage Users – Notifications | No email or notification is sent to the user when an account is created or a password is changed | Users do not learn their username or new password | Define the welcome and password-change messages, and whether a set-your-own-password link replaces typing a password | Open |
| OQ-ACC-026 | Manage Users – Field limits and formats | Full name 80, Username 4–60 and Pincode 10 (non-India) exist in the form only; address lines, emails and passwords have no maximum; Full name keeps surrounding spaces; mobile numbers always use "+91" and must be Indian even for non-Indian addresses; non-Indian pincodes have no format; usernames are compared only with usernames (another user's email is allowed), alternate emails are not checked against other users, and mobile numbers need not be unique | Data quality and sign-in clashes | Confirm limits, international phone and pincode formats, and the uniqueness scope | Open |
| OQ-ACC-027 | Manage Users – Delete | Any user can be deleted, including the last user with admin rights, with no soft delete or undo; reports silently lose their parent user; Change password closes without asking even when text was typed | Accidental loss of access or reporting lines | Confirm delete rules (block, deactivate instead, reassign reports) and whether Change password should ask before discarding | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages, modals and dialogs: Complete
- [ ] User roles and access: Incomplete (roles are not assigned or enforced, and user accounts, Admin rights and Status have no effect, see OQ-ACC-002, OQ-ACC-003, OQ-ACC-020, OQ-ACC-022)
- [x] Field specifications: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (form limits and search lengths need confirmation, see OQ-ACC-005, OQ-ACC-015, OQ-ACC-026)
- [ ] Accepted formats: Incomplete (Page URL rules, international mobile numbers and pincodes, see OQ-ACC-004, OQ-ACC-026)
- [x] Validation timing and messages: Complete
- [x] Success and error messages: Complete
- [x] Search, filters and tables: Complete
- [ ] Cross-module behaviour: Incomplete (menu not applied to the sidebar, permissions not enforced, user accounts not used for sign-in or linked to other records, see OQ-ACC-001, OQ-ACC-002, OQ-ACC-023, OQ-ACC-024)
- [ ] Business meaning of user fields: Incomplete (Application, Parent user and Admin rights are assumed, see OQ-ACC-018, OQ-ACC-019, OQ-ACC-020)
- [ ] Unsaved-changes protection: Incomplete (Roles & Access has no leave guard, see OQ-ACC-008)
- [x] Acceptance criteria and QA scenarios: Complete
