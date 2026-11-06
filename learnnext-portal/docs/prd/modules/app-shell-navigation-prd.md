# App Shell and Navigation: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | App Shell and Navigation PRD |
| Module name | App Shell and Navigation |
| Document ID | PRD-SHELL |
| Version | 1.6 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (sidebar, header, breadcrumbs, theme, user menu, footer, global search, role-based shells (Training Partner, Super Admin) and the unsaved-changes guard work; notifications are demo items with no page of their own, the Help & Support drawer cannot be opened, and ten menu items open a placeholder) |
| Last updated | 2026-11-06 (v1.6: **Settings** moved after **Reports** as the last main menu item — in the sidebar, the phone "More" sheet and the search "Jump to" list). 2026-11-05 (v1.5, 2026-11-05: the shell follows the chosen role — Training Partner shell as before, Super Admin shell with only Manage Clients and My Profile; **Switch role** in the user menu for logins with several roles; **Settings** in the user menu only for roles that may open it; the line under the sidebar logo names the role; toasts sit at the top on phones; "Admin" renamed "Training Partner". Earlier, from 2026-11-03 — v1.1: bottom tab bar on phones, tablet sidebar opens over the page, no header hamburger, theme button hidden on phones, phone layout rules; v1.2: installable app (PWA) — install card, offline start, update-on-Reload; v1.3: notifications as a grouped bottom sheet on phones, every dropdown a bottom sheet on phones, frosted header / tab bar with firmer edges; v1.4 (2026-11-04): calmer menu rows in phone sheets, a tap on a sheet's dimmed area only closes the sheet, pinned search in picker sheets, sheets / dialogs / drawers stay above the on-screen keyboard) |
| Related modules/pages | [Authentication](authentication-prd.md), [Dashboard](dashboard-prd.md), [Profile](profile-prd.md), [All Clients](clients-prd.md), [Client detail](client-detail-prd.md), [Manage Content](manage-content-prd.md), [Facilitators](facilitators-prd.md), [Support desk](support-desk-prd.md), [Settings hub](settings-hub-prd.md), [Settings: Users & Access](settings-access-masters-prd.md), [System pages](system-pages-prd.md), [Super Admin portal (PRD-SA)](super-admin-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

The app shell is the frame that surrounds every signed-in page of LearnNext Portal. Its menu, page names, search sources and extras follow the role the user chose at sign-in ([authentication-prd.md](authentication-prd.md)): this PRD describes the Training Partner shell in full and the Super Admin shell's differences (5.16; the Super Admin pages themselves are in [PRD-SA](super-admin-prd.md)). It gives a Training Partner:

- a single, consistent menu to reach every module, on phones, tablets and desktops;
- a header that names the current page (breadcrumb) and holds search, notifications, theme and the user menu;
- quick ways to move around: a keyboard-driven search palette (Ctrl+K / ⌘K), breadcrumb links and a Support desk shortcut;
- protection against losing unsaved work when leaving certain pages through the shell;
- a clear placeholder for menu items whose pages are not built yet.

The objective is that a user can always tell where they are (and in which role), reach any page in one or two clicks, and never lose half-finished work by accident. Sign-in, sign-out and session rules are owned by [authentication-prd.md](authentication-prd.md) and are only referenced here.

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Sidebar (full, icon rail, mobile drawer) | Main menu to every module | Training Partner | Open a page, expand **Finance**, collapse/expand the sidebar (tablets: open the full sidebar over the page), open **Support desk** | Every portal page |
| Bottom tab bar (phones and small tablets) | App-style quick access to the main pages | Training Partner | **Home**, **Clients**, **Facilitators**, **Content**, **More** (opens the full menu drawer) | Dashboard, All Clients, Facilitators, Manage Content |
| "Dev only" menu section | Keep development aids apart from portal features | Training Partner (developers, QA) | Open **System pages** | [system-pages-prd.md](system-pages-prd.md) |
| Support desk card | Show how many support requests wait for an answer and open the Support desk | Training Partner | Click the card | [support-desk-prd.md](support-desk-prd.md) |
| Header | Page name and global tools | Training Partner | Breadcrumb links, **Search…**, notifications bell, theme menu (not on phones), user menu | Every portal page |
| Breadcrumbs | Show the current page and its parent section | Training Partner | Click the parent crumb | Every portal page |
| Global search palette | Jump to a page by keyboard; search records | Training Partner | Ctrl+K / ⌘K, type, ↑ ↓, Enter, Esc | Every menu page |
| Notifications menu | Show the latest notifications and unread count | Training Partner | Open bell, click an item (mark read), **Mark all read** | — (no Notifications page exists) |
| Theme menu | Choose Light, Dark or System theme | Training Partner | Pick a theme | All pages, auth pages |
| User menu | Signed-in identity and personal actions | Training Partner, Super Admin | **My Profile**, **Settings** (roles that may open it), **Switch role** (logins with several roles), Theme, **Log out** | [profile-prd.md](profile-prd.md), [settings-hub-prd.md](settings-hub-prd.md), [authentication-prd.md](authentication-prd.md) |
| Super Admin shell (added v1.5) | The same frame with only the Super Admin's pages | Super Admin | **Manage Clients**, My Profile (user menu), search, theme, **Switch role**, **Log out** | [PRD-SA](super-admin-prd.md) |
| Footer | Copyright and status line | Training Partner | View only | Every portal page |
| Placeholder page ("Nothing here yet") | Stand-in for menu items not built yet | Training Partner | View only | Projects, Finance (6 pages), Assessments, Polls & Surveys, Reports |
| Unsaved-changes leave guard | Ask before leaving a page with unsaved work | Training Partner | **Discard** / **Keep editing**, **Discard and leave** / **Stay**, **Leave** / **Stay** | Add client, Edit client, Program content, Verify KYC |
| Keyboard shortcuts | Speed up navigation | Training Partner | Ctrl+K / ⌘K, "Skip to content" | Every portal page |
| Help & Support drawer [Not Implemented] | FAQ, contact links and shortcuts | Training Partner | None — nothing in the application opens it | — |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Training Partner (signed in) | The Training Partner shell appears on every Training Partner page (SH-002) | Every action in this PRD | None. The full menu, including the "Dev only" section, is shown to every Training Partner |
| Super Admin (signed in) | The Super Admin shell (5.16) on Manage Clients pages and My Profile | Navigate, search, theme, My Profile, Switch role, Log out | No Training Partner menu items, notifications, Settings, Support desk card or Dev only section; other addresses redirect to Manage Clients (BR-AUTH-021) |
| Signed in, no role chosen / role not ready | None | — | The shell is not shown: the role picker or the coming-soon screen appears instead ([authentication-prd.md](authentication-prd.md)) |
| Visitor (not signed in) | None | None | Every portal page redirects to Sign in (SH-003); the shell is never shown |
| Facilitator, Participant, Client SPOC | None | None | Their portals are not built (coming soon). In the Training Partner portal they appear as records (SH-002) |

Within the Training Partner shell, roles and menu permissions defined in [Settings: Users & Access](settings-access-masters-prd.md) (Roles & Access, Menu Mapping & Access) are **not** applied to the sidebar, search or header (SH-002, OQ-SHELL-012). The portal role chosen at sign-in decides which shell is shown (BR-SHELL-028).

## 5. Page Functionality and Behavior

### 5.1 Overall layout

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Shell frame | Consistent frame for every page | Open any portal page | Sidebar on the left (on phones and small tablets: a bottom tab bar plus a menu drawer), header at the top, page content in the middle, footer at the bottom | BR-SHELL-003, BR-SHELL-022 | Page shown inside the shell |
| "Skip to content" link | Keyboard and screen-reader users skip the menu | Press Tab once after the page loads | A "Skip to content" link appears at the top left; activating it moves focus to the page content | Hidden until focused | Focus in the main content |
| Page change | Fresh start on every page | Open another page | The page fades in, the window scrolls to the top, the mobile drawer closes and the browser tab title updates | BR-SHELL-008, BR-SHELL-019 | New page shown at its top |
| Page loading | Show progress while a page loads | Open a page for the first time | A full-page loading indicator shows until the page is ready (SH-007) | — | Page shown |
| Page height (large screens) | Keep the footer just below the fold | View a short page | Every page is at least the window's height, so the footer sits just below the visible area | Large screens only | — |
| Browser tab title | Identify the tab | — | "<Page name> · LearnNext", for example "All Clients · LearnNext", "Add client · LearnNext", "Client details · LearnNext", "Verify KYC · LearnNext". Settings masters use the master's name, for example "SAP BP · LearnNext" | BR-SHELL-008, SH-009 | — |

### 5.2 Sidebar

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Logo | Brand and current role | View | Full sidebar: LearnNext mark with the wordmark and, under it, the chosen role's name ("Training Partner" or "Super Admin"). Icon rail: the mark only | Not a link | — |
| Menu items (in order) | Reach each module | Click an item | **Dashboard**, **All Clients**, **Projects**, **Finance** (group), **Manage Content**, **Facilitators**, **Assessments**, **Polls & Surveys**, **Reports**, **Settings** (the last main item, set apart from the day-to-day pages), then the Dev only section. Each item has an icon and a label and opens its page | BR-SHELL-001; items whose pages are not built open the placeholder (5.10, BR-SHELL-002) | Page opens |
| Active item | Show where the user is | — | The current item is highlighted (tinted row, solid brand icon tile, bold label). It also stays highlighted on the item's sub-pages, for example **All Clients** on Add client, Client details and Edit client; **Manage Content** on Program content; **Facilitators** on Verify KYC; **Settings** on any Settings master | BR-SHELL-005 | — |
| Hover | Show what will open | Point at an item | A soft blue tint across the whole row and a blue icon; nothing pops up or moves (no tile behind the icon, no sliding label) | Not on the current item | — |
| **Finance** group (full sidebar) | Group the finance pages | Click **Finance** | Expands or collapses a nested list under a guide line: **All Invoices**, **Credit Note**, **Debit Note**, **E-Invoice**, **Trainer Invoice**, **Invoice Approvals**. A chevron rotates to show the state | Opens automatically when one of its pages is open (BR-SHELL-006). When collapsed while one of its pages is open, the **Finance** row itself is highlighted | Child list shown or hidden |
| **Finance** group (icon rail) | Same, in the narrow rail | Click the Finance icon | A small flyout opens beside the rail with the heading "FINANCE" and the six pages. Choosing a page opens it and closes the flyout | Esc or a click outside closes the flyout | Page opens |
| Hover / focus labels (icon rail) | Name icon-only items | Hover or focus an icon | A tooltip with the item's label appears to the right | Rail only (SH-010) | — |
| "Dev only" section | Keep development aids apart | View | At the bottom of the menu, under a small "Dev only" label (full sidebar) or a short divider line (rail), the single item **System pages** | BR-SHELL-017. Shown to everyone in every build (OQ-SHELL-010) | Opens the System pages gallery ([system-pages-prd.md](system-pages-prd.md)) |
| Support desk card (full sidebar) | Show waiting requests; open the Support desk | Click the card | Card titled "Support desk". If requests are waiting: three small "typing" dots, up to three requester avatars (two avatars and "+N" when more than three), "<N> waiting" and an arrow button. If none: a green double tick and "All caught up". Clicking opens the Support desk page | BR-SHELL-018. On the Support desk page the card keeps a highlighted edge and the arrow becomes a pulsing dot. The count updates as tickets are answered on the Support desk | Support desk opens |
| Support desk item (icon rail) | Same, in the rail | Click the headset icon | Opens the Support desk page | Tooltip "Support desk". No waiting count is shown in the rail | Support desk opens |
| Collapse / expand handle | Give the page more room | Click the round handle on the sidebar's right edge | Large screens: switches between the full sidebar and the icon rail; the page shifts. Medium screens (tablet): opens the full sidebar **over** the page with a lightly dimmed backdrop; the page does not move. Tooltip and label: "Collapse sidebar" / "Expand sidebar" | Large screens: the choice is remembered (BR-SHELL-004, SH-001). Tablets: not remembered; closes on a tap outside, the handle again or any page change (BR-SHELL-023) | Sidebar width changes |
| Scrolling | Long menus on short screens | Scroll inside the menu | The menu list scrolls on its own; the logo and the Support desk card stay in place | — | — |
| Unsaved changes | Protect work | Click a menu item while a guarded page has unsaved changes | The page's leave dialog opens instead of navigating (5.11) | Applies to menu items, the Finance flyout and the rail's Support desk item. The full-sidebar Support desk card does **not** ask first [Partially Implemented] (OQ-SHELL-009) | Dialog shown |

### 5.3 Sidebar by screen width

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Large screens (desktop) | Full navigation | — | Full sidebar with labels, or the icon rail if the user collapsed it | Collapse choice remembered | — |
| Medium screens (tablet) | Save width | Click the edge handle to see labels | Icon rail with tooltips by default; the edge handle opens the full sidebar over the page (dimmed backdrop) | BR-SHELL-023. The large-screen collapse choice is ignored at this width | Full sidebar shown / back to the rail |
| Phones and small tablets | Maximise content; app feel | Tap a tab in the bottom tab bar, or **More** | The bottom tab bar (5.14) is always shown. **More** raises a bottom sheet from the bar (grab handle, rounded top, up to 85% of the screen height) laid out like a phone's home screen: at the top the signed-in user (photo, name, role, **View profile** → My Profile) and a **Close menu** (×) button; then a 3-column grid of neutral grey icon tiles with names and no boxes around them (Projects, Assessments, Polls & Surveys, Reports, Settings, **Support** with "<N> waiting" under it); and a "FINANCE" group with its six pages. The Dev only **System pages** item is not offered on phones. Only the current page's tile stands out: a firmer soft-blue tint with a thin blue edge, a blue icon and a blue bold name (calm, not a solid fill). The four tab-bar pages are not repeated | BR-SHELL-022. The sheet closes with ×, Esc, a tap on the backdrop (SH-006), choosing a tile, or any page change | Sheet open / closed |

### 5.4 Header

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Logo mark | Brand on phones | View | Small LearnNext mark before the page name. There is no hamburger: the menu opens from **More** in the bottom tab bar | Phones and small tablets; not a link | — |
| Breadcrumbs | Page name and parent | View / click | See 5.5 | Shown from small-tablet width up | — |
| Page name (phones) | Page name on narrow screens | View | Only the current page name, in bold, instead of breadcrumbs | Narrowest screens | — |
| **Search…** box | Open the search palette | Click | Opens the search palette (5.6). The box shows "Search…" and the shortcut keys "Ctrl" "K" (Windows/Linux) or "⌘" "K" (Mac) | Medium screens and up | Palette open |
| Search icon | Same on phones | Tap | Opens the search palette | Phones only; label "Search" | Palette open |
| Notifications bell | Notifications | Click | See 5.7 | Label "Notifications" or "Notifications (<N> unread)" | Menu open |
| Theme menu | Theme | Click | See 5.8 | Label "Change theme". Hidden on phones; the theme is changed from the user menu there (5.9, BR-SHELL-024) | Menu open |
| User menu | Identity and personal actions | Click | See 5.9 | Label "Open user menu" | Menu open |
| Auto-hide on scroll | More room while reading | Scroll down / up | The header slides up out of view while the user scrolls down (once more than 80 px from the top) and slides back on any scroll up or near the top | BR-SHELL-020. Small movements (under 6 px) are ignored | Header hidden / shown |
| Look on phones | Separate the bar from the page | View | Frosted: what scrolls under it is blurred, with a firmer grey line along its bottom edge. The bottom tab bar matches (blurred, grey top line) | SH-013 "Smooth scrolling" — the two bars are the only blurred elements on phones | — |

### 5.5 Breadcrumbs

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Top-level pages | Page name | View | One crumb with the page name, for example "Dashboard", "Facilitators", "My Profile", "Support desk" | SH-009 | — |
| Pages inside a section | Parent and page | View | "Section › Page", for example "Finance › All Invoices", "All Clients › Add client", "All Clients › Client details", "All Clients › Edit client", "Facilitators › Verify KYC", "Manage Content › Program content", "Settings › SAP BP" | BR-SHELL-007 | — |
| Parent crumb | Go up one level | Click | Opens the parent page. For **Finance** (which has no page of its own) it opens **All Invoices** | A guarded page with unsaved changes asks first (5.11) | Parent page opens |
| Current crumb | Show the current page | View | Plain text, not a link | — | — |

### 5.6 Global search palette

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Open | Start a search or jump | Ctrl+K / ⌘K, **Search…** box or search icon | Opens a centred palette near the top of the screen with focus in the search box. The shortcut toggles: pressing it again closes the palette | BR-SHELL-009 | Palette open |
| Search box | Enter a query | Type | Placeholder "Search clients, programs, facilitators, tickets, settings…". See 7.1 | Search starts after a short pause in typing (about 0.15 s) | — |
| "Jump to" list (empty search box) | Quick page access | View, ↑ ↓, Enter or click | Lists every menu page under the heading "JUMP TO", in menu order: Dashboard, All Clients, Projects, All Invoices, Credit Note, Debit Note, E-Invoice, Trainer Invoice, Invoice Approvals, Manage Content, Facilitators, Assessments, Polls & Surveys, Reports, Settings, System pages | Includes placeholder pages and the Dev only item; excludes My Profile, Support desk and individual Settings masters (OQ-SHELL-002) | Chosen page opens; palette closes |
| Record results (typed search) | Find pages and records across modules | Type a query | While searching, a spinner replaces the clear button. Results are grouped — Pages (menu pages plus My Profile, Support desk, Add client), Clients, Programs, Facilitators, Support tickets, Settings — best matches first, up to 4 per group; a group with more shows "+N more — keep typing to narrow". Each result has a title and a second line and opens its record (a client's details, a program's content, a facilitator — Verify KYC when a KYC is waiting for approval, otherwise the Facilitators list searched to them — a ticket on the Support desk, a Settings master) | BR-SHELL-010. Only results the current role may open are listed (Super Admin: 5.16) | Chosen record opens; palette closes |
| No results view | Explain an empty search | Type text that matches nothing | Icon, "No results for “<query>”" and "Try a client or program name, a person’s name or email, a ticket number or a setting." | Shown once the search has finished | User edits or clears the query |
| **Clear search** (×) | Empty the box | Click | Clears the query and returns to the "Jump to" list | Shown when the box has text and no search is running | — |
| Esc hint | Remind how to close | View | "Esc" key cap at the right of an empty search box | Hidden on phones | — |
| Keyboard | Operate without a mouse | ↑ / ↓, Enter, Esc | ↑ ↓ move the highlight (it stops at the first and last entry), Enter opens the highlighted entry, Esc closes the palette. Moving the mouse over an entry highlights it | The highlighted entry shows an arrow | — |
| Hint bar | Explain keys | View | "↑ ↓ navigate", "↵ open", "Esc close" | Hidden on phones | — |
| Close | Leave the palette | Esc, backdrop click, shortcut, or choosing an entry | Palette closes and the query is cleared | SH-006 | — |
| Unsaved changes | Protect work | Choose an entry on a guarded page with unsaved changes | The palette closes and the page's leave dialog opens (5.11) | — | Dialog shown |

### 5.7 Notifications menu

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Bell with unread badge | Signal unread items | View | A red circle on the bell shows the number of unread notifications. No badge when all are read | BR-SHELL-012. No upper cap on the number shown (OQ-SHELL-014) | — |
| Notifications sheet (phones) | Read notifications comfortably on a phone | Tap the bell | Instead of the dropdown, a bottom sheet rises: grab handle, "Notifications" and × on top; below it an **All / Unread · <N>** switch with **Mark all read** on the right; then the notifications grouped under **NEW** (unread — a thin blue left edge and faint tint, no dots) and **EARLIER** (read). Each row: type icon, title with a short time on the right (e.g. "26m", "2h", "1d") and up to two lines of the message; every notification is listed, not just five. Tapping a row marks it read | Closes with ×, Esc or a tap outside. **Unread** shows only the NEW group, or "You’re all caught up" | Sheet open |
| Menu header | Summary | Open the bell | Title "Notifications" and either "<N> unread" or "You’re all caught up" | — | — |
| **Mark all read** | Clear unread state | Click | All notifications become read; the badge disappears; the header line changes to "You’re all caught up"; the link disappears | Shown only while at least one is unread (BR-SHELL-013) | — |
| Notification rows | Read the latest items | View | The five most recent items in the list, each with a type icon (enrolment, review, message, alert, system), title, one line of text and a relative time ("25m ago", SH-012). Unread items have a bold title and a blue dot labelled "Unread" | Only five are shown; older items cannot be reached (OQ-SHELL-003) | — |
| Click a row | Mark as read | Click | The item becomes read (dot removed, title no longer bold) and the unread count drops by one. The menu stays open; nothing else opens | Rows do not link to any record or page (OQ-SHELL-003). Rows cannot be reached or activated with the keyboard [Partially Implemented] (OQ-SHELL-005) | — |
| Empty state | No notifications | Open the bell with no items | "No notifications" and "We’ll let you know when something needs your attention." | Also shows for a moment while notifications are first loading (11) | — |
| Close | Leave the menu | Esc, click outside, or the bell again | Menu closes | — | — |
| Notifications page [Not Implemented] | Full history | — | No Notifications page exists and there is no "View all" link. Opening a notifications address shows the full-screen not-found page | OQ-SHELL-003 | — |
| Data | Content of the list | — | Six demo notifications, three of them unread (SH-001). Read changes last until the page is reloaded | Content refers to courses, enrolments and instructors, not to the Training Partner portal's clients, programs and facilitators (OQ-SHELL-004) | — |

### 5.8 Theme menu

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Theme button | Open the theme choices | Click | Shows a sun icon in the light theme and a moon icon in the dark theme. Opens a menu: **Light**, **Dark**, **System**, with a tick on the current choice | Label "Change theme" | Menu open |
| Choose a theme | Change the look | Click an option | Applies immediately across the whole application and is remembered (SH-001, SH-010) | **System** follows the device's light/dark setting and is the default (BR-SHELL-016) | Theme applied |

### 5.9 User menu

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Trigger | Show who is signed in | View / click | Avatar (photo, or initials when there is no photo); the first name on extra-wide screens; a chevron from small-tablet width up | Label "Open user menu" | Menu open |
| Identity header | Confirm the account | View | Avatar, full name (for the demo account "Atul Kumar") and email ("admin@learnnext.io") | Reflects changes made in [My Profile](profile-prd.md) | — |
| **My Profile** | Open the profile | Click | Opens My Profile | Guarded pages ask first (5.11) | Profile page |
| **Settings** | Open Settings | Click | Opens the Settings hub | Shown only to roles that may open Settings: Training Partner yes, Super Admin no (BR-SHELL-030). Guarded pages ask first (5.11) | Settings page |
| **Switch role** (added v1.5) | Move to another of the login's roles | Click | Returns to the "Continue as" role picker; after choosing, the chosen role's own home opens (Dashboard or Manage Clients), not the current page. A remembered role choice is forgotten. See [authentication-prd.md](authentication-prd.md) 5.11 | Shown only when the login holds several roles (BR-SHELL-031). Guarded pages ask first (5.11) | Role picker |
| "THEME" section | Change theme here too | Click **Light**, **Dark** or **System** | Same as the header theme menu (5.8); the current choice is ticked | BR-SHELL-016 | Theme applied |
| **Log out** | Sign out | Click | Opens the "Log out of LearnNext?" confirmation; see [authentication-prd.md](authentication-prd.md) §5.8 | The only Log out entry point inside a portal (the role picker and coming-soon screen have their own **Sign out**). It does not check for unsaved changes [Partially Implemented] (OQ-SHELL-008) | Dialog shown |
| Keyboard | Operate without a mouse | Open with Enter/Space | Focus moves to the first item; ↑ ↓ move between items (wrapping), Home/End jump to first/last, Esc closes and returns focus to the trigger | Same for the theme menu | — |

### 5.10 Placeholder page ("Nothing here yet")

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Placeholder card [Not Implemented] | Show that the page is not built | Open one of the items below | A full-height card with the menu item's icon, the title "Nothing here yet" and "The <page name> page hasn’t been built yet." Header breadcrumb and tab title show the page name as for a real page | BR-SHELL-002, SH-009 | No actions available |
| **Projects** [Not Implemented] | Projects module | Click | Placeholder: "The Projects page hasn’t been built yet." | Projects are visible per client in [client-detail-prd.md](client-detail-prd.md) | — |
| **Finance › All Invoices** [Not Implemented] | Invoices | Click | Placeholder: "The All Invoices page hasn’t been built yet." | Breadcrumb "Finance › All Invoices" | — |
| **Finance › Credit Note** [Not Implemented] | Credit notes | Click | Placeholder: "The Credit Note page hasn’t been built yet." | — | — |
| **Finance › Debit Note** [Not Implemented] | Debit notes | Click | Placeholder: "The Debit Note page hasn’t been built yet." | — | — |
| **Finance › E-Invoice** [Not Implemented] | E-invoices | Click | Placeholder: "The E-Invoice page hasn’t been built yet." | — | — |
| **Finance › Trainer Invoice** [Not Implemented] | Facilitator invoices | Click | Placeholder: "The Trainer Invoice page hasn’t been built yet." | — | — |
| **Finance › Invoice Approvals** [Not Implemented] | Approvals | Click | Placeholder: "The Invoice Approvals page hasn’t been built yet." | — | — |
| **Assessments** [Not Implemented] | Assessments | Click | Placeholder: "The Assessments page hasn’t been built yet." | — | — |
| **Polls & Surveys** [Not Implemented] | Polls and surveys | Click | Placeholder: "The Polls & Surveys page hasn’t been built yet." | — | — |
| **Reports** [Not Implemented] | Reports | Click | Placeholder: "The Reports page hasn’t been built yet." | — | — |

### 5.11 Unsaved-changes leave guard

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Guarded pages | Prevent accidental loss of work | Leave the page through the shell with unsaved changes | Four pages ask first: **Add client**, **Edit client**, **Program content** (unsaved permission changes) and **Verify KYC** (at least one section marked). Every other page lets the user leave without asking | BR-SHELL-014, SH-006 | Dialog shown |
| Shell exits that ask | Cover the usual ways out | Click a sidebar item, a Finance flyout item, the rail's Support desk item, a parent breadcrumb, a search palette entry, a bottom tab, an item in the phone "More" sheet, or **My Profile** / **Settings** / **Switch role** in the user menu | The page's dialog opens and navigation waits for the answer | — | — |
| Shell exits that do not ask [Partially Implemented] | — | Click the full-sidebar Support desk card, choose **Log out**, or use the browser's Back/Forward buttons | The user leaves immediately and the changes are lost | OQ-SHELL-008, OQ-SHELL-009 | Changes lost |
| Add client / Edit client dialog | Confirm discarding | — | Add: "Discard this client?" / "The details you’ve entered won’t be saved." Edit: "Discard your changes?" / "Your edits to this client won’t be saved." Buttons **Keep editing** and **Discard** (red) | See [clients-prd.md](clients-prd.md) / [client-detail-prd.md](client-detail-prd.md) | **Discard** opens the chosen page |
| Program content dialog | Confirm discarding permission changes | — | "Discard permission changes?" / "You have <N> unsaved permission change(s). If you leave now, they won’t be saved." Buttons **Stay** and **Discard and leave** (red) | See [manage-content-prd.md](manage-content-prd.md) | **Discard and leave** opens the chosen page |
| Verify KYC dialog | Confirm leaving a half-done verification | — | "Leave without finishing?" / "The sections you’ve marked won’t be saved." Buttons **Stay** and **Leave** (red) | See [facilitators-prd.md](facilitators-prd.md) | **Leave** opens the chosen page |
| Reloading or closing the tab | Browser-level warning | Reload or close the tab with unsaved changes | Program content and Verify KYC show the browser's own "leave site?" warning. Add client and Edit client do not [Partially Implemented] (OQ-SHELL-009) | Wording is the browser's own | — |
| Mobile drawer | Guard while the drawer is open | Choose a page in the drawer on a guarded page | The dialog opens; the drawer stays open behind it | — | After answering, the user closes the drawer or it closes on navigation |

### 5.12 Footer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Copyright | Ownership | View | "© <current year> LearnNext. All rights reserved." | Year follows the device clock | — |
| Status line | Reassure about service health | View | A pulsing green dot and "All systems operational · v0.1.0" | Fixed text: it does not reflect real service status or a real version number (OQ-SHELL-011). Phones: the footer is a single centred line "© <year> LearnNext · v0.1.0" with no status line | — |

### 5.13 Keyboard shortcuts and Help & Support

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Ctrl+K / ⌘K | Open or close the search palette | Press | Toggles the palette on any portal page | Works with either Ctrl or ⌘ on any device, including while typing in a field; it replaces the browser's own Ctrl+K action (OQ-SHELL-013) | Palette open / closed |
| Other shortcuts | — | — | No other application-wide shortcuts exist. Esc closes menus, dialogs and drawers (SH-006) | — | — |
| Help & Support drawer [Not Implemented] | Self-help, contact and shortcuts | — | A "Help & Support" drawer exists ("Answers, shortcuts and ways to reach us.", **Email support**, **Send feedback**, three FAQ items, and the "Open search" shortcut) but no button or menu item opens it | Its FAQ refers to courses and instructors (OQ-SHELL-007) | — |

### 5.14 Bottom tab bar and phone layout (added in v1.1)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Bottom tab bar | App-style navigation on small screens | Tap a tab | A frosted, mostly opaque bar (so content scrolling underneath does not show through) fixed along the bottom edge, full width, 70 px tall, with a hairline and a long faint shadow on top. Five tabs, each a 22 px icon with its 12 px name under it: **Home** (Dashboard), **Clients** (All Clients), **Facilitators**, **Content** (Manage Content), **More** | BR-SHELL-022. Shown below 768 px wide only; hidden from tablets in landscape and up | The tab's page opens |
| Current tab | Show where the user is | — | The current tab's icon sits on a soft blue pill and its name turns blue and bold; no glow. A tab stays current on its sub-pages (e.g. **Clients** on Client details) | **More** is current while the menu drawer is open or on any page that is not one of the four tabs (e.g. Settings, Profile, Support desk) | — |
| **More** | Reach every other page | Tap | Raises the "More" bottom sheet from the bar (5.3) — it opens from where the button is, rather than a side drawer from the opposite edge | Replaces the old header hamburger and left drawer | Sheet open |
| Leave guard | Protect unsaved work | Tap a tab with unsaved changes | Same as the sidebar: the page's leave dialog opens (5.11) | BR-SHELL-014 | Dialog shown |
| Page room | Nothing hidden behind the bar | Scroll to the end of a page | Pages get extra bottom space equal to the bar; sticky action bars (Verify KYC, Content Permissions) sit just above the bar. Toast messages never land on the bar: on phones they drop in at the top just under the header; on small tablets that still show the bar they sit bottom-right, lifted above it (SH-005) | BR-SHELL-022 | Last content and actions fully visible |
| Phone layout rules | Calm, uncongested pages on phones | — | Phone-only presentation rules shared by every page (outer list panels drop their frame, 12 px between cards, status pills not shown, detail-hero ⋮ menu, card views instead of tables, shorter helper texts) are defined in [Shared requirements](../shared-requirements.md) SH-013 | Below 640 px unless stated; desktop unchanged | — |

### 5.15 Installable app (PWA, added in v1.2)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Install | Use LearnNext like a phone app | Android / Chrome: **Install** on the card or browser menu → *Install app*. iPhone / iPad: Safari **Share** → **Add to Home Screen** | Adds a home-screen icon named "LearnNext" (LearnNext mark on brand blue). Launching it opens **Dashboard** full screen with no browser bar (Super Admin: Manage Clients; Sign in or the role picker first when needed); on Android a brand-blue splash shows while it loads. Desktop Chrome / Edge also offer installing | BR-SHELL-025. Requires the live HTTPS site | App installed |
| Home-screen shortcuts | Jump straight in | Long-press the icon (Android) | **All Clients**, **Facilitators**, **Support desk** | Android only | Page opens |
| "Install LearnNext" card | Offer installing on phones | View; **Install** / × | A slim card above the bottom tab bar: LearnNext mark, "Install LearnNext", then "Open it from your home screen like an app." with **Install** (Android), or "Tap ⎙ Share then Add to Home Screen" (iPhone / iPad). × ("Not now") hides it | BR-SHELL-026. Phones only, signed in, never once installed; × or declining hides it for 14 days | Card shown / hidden |
| Fast start and offline | Open instantly, even without signal | Open the app | The app's files are kept on the device, so it opens almost instantly; with no connection the screens still load and the offline screen ([system-pages-prd.md](system-pages-prd.md)) covers anything that needs the network. Fonts and people's photos are kept too | BR-SHELL-025. Data is still demo data (SH-001); working with data offline is not part of this | — |
| Update notice | Move to a new version safely | Tap **Reload** | After a new version is published, a lasting toast: "New version available" — "Reload to get the latest LearnNext." with **Reload**. The new version only takes over when Reload is tapped | BR-SHELL-027. Checked when the app opens and hourly while it stays open; applies to every page including Sign in | New version loaded |

### 5.16 Super Admin shell (added v1.5)

The Super Admin uses the same frame (sidebar / icon rail, header, bottom tab bar on phones, footer, search palette, theme, user menu, leave guard) with only its own content. Its pages (Manage Clients, Add / Edit client, Client details) are described in [PRD-SA](super-admin-prd.md).

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Sidebar | Super Admin menu | Click | One item: **Manage Clients**. The logo line reads "Super Admin". No Finance group, no "Dev only" section and no Support desk card | BR-SHELL-029 | Manage Clients opens |
| Breadcrumbs and tab titles | Page name | View | "Manage Clients"; "Manage Clients › Add client", "Manage Clients › Edit client", "Manage Clients › Client details"; "My Profile". Tab titles follow as "<page> · LearnNext" | BR-SHELL-007, BR-SHELL-008 | — |
| Header | Global tools | View | Search, theme menu and user menu as in 5.4; **no notifications bell** | BR-SHELL-029 | — |
| User menu | Personal actions | Click | **My Profile**, **Switch role**, the Theme options and **Log out**. No **Settings** | BR-SHELL-030, BR-SHELL-031 | — |
| Search palette | Jump and find | Ctrl+K / ⌘K | "Jump to" lists **Manage Clients** only. Typed search covers the Super Admin's pages (Manage Clients, Add client, My Profile) and its clients (by name, code, mobile, city or contact name); a client result opens its Client details | BR-SHELL-010 | Page / record opens |
| Bottom tab bar (phones) | App-style navigation | Tap | Two tabs: **Clients** (Manage Clients) and **More**. **More** opens the sheet with only the user's photo, name, "Super Admin · View profile" and × — no module tiles, no Support tile and no Finance group | BR-SHELL-022, BR-SHELL-029 | — |
| Other addresses | Keep the Super Admin on its pages | Open the Dashboard, Settings, Facilitators, Support desk, System pages or a placeholder page address | Redirects to Manage Clients without a message | BR-AUTH-021 | Manage Clients |

## 6. User Workflow

### 6.1 Navigate to a page from the sidebar

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Clicks a menu item (on phones: taps a bottom tab, or **More** and then a menu item) | Checks whether the current page has unsaved changes | BR-SHELL-014 | — |
| 2a | — | No unsaved changes: opens the page, highlights the item, updates breadcrumb and tab title, scrolls to the top, closes the drawer | BR-SHELL-005, BR-SHELL-007, BR-SHELL-008 | Page shown |
| 2b | — | Unsaved changes: shows the page's leave dialog | — | User chooses to stay or leave |
| 3 | (Finance) Clicks **Finance** | Expands the group (full sidebar) or opens the flyout (rail) | BR-SHELL-006 | Six finance pages listed |
| 4 | Opens a page that is not built | Shows "Nothing here yet" | BR-SHELL-002 | Placeholder shown |

### 6.2 Jump with the search palette

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Presses Ctrl+K / ⌘K (or clicks **Search…**) | Opens the palette with the "Jump to" list and focus in the box | BR-SHELL-009 | Palette open |
| 2 | Uses ↑ ↓ or the mouse to pick a page, presses Enter or clicks | Closes the palette, checks the leave guard, opens the page | BR-SHELL-014 | Page shown |
| 3 | (Alternative) Types text, then picks a result | After a short pause shows a spinner, then grouped results (or "No results for “<query>”"); picking a result closes the palette, checks the leave guard and opens the record | BR-SHELL-010 | Record shown |

### 6.3 Review notifications

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Sees the red count on the bell, clicks it | Opens the menu with the latest five items and "<N> unread" | BR-SHELL-012 | Menu open |
| 2 | Clicks an unread item | Marks it read; count and badge drop by one | BR-SHELL-013 | Item shown as read |
| 3 | Clicks **Mark all read** | Marks all read; badge disappears; "You’re all caught up" | Link only while unread items exist | No badge |

### 6.4 Collapse the sidebar (large screens)

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Clicks the "Collapse sidebar" handle | Narrows the sidebar to the icon rail; content widens | Large screens only | Rail shown |
| 2 | Reloads the page | Restores the rail | Choice remembered (SH-001) | Rail shown |
| 3 | Clicks "Expand sidebar" | Restores the full sidebar | — | Full sidebar |

### 6.5 Leave a page with unsaved changes

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Makes changes on Add client, Edit client, Program content or Verify KYC | — | — | Page has unsaved work |
| 2 | Clicks a sidebar item, parent breadcrumb, search entry, **My Profile**, **Settings** or **Switch role** | Opens the page's leave dialog (5.11) | BR-SHELL-014 | Dialog shown |
| 3a | Chooses **Keep editing** / **Stay** (or Esc, backdrop) | Closes the dialog | — | User stays; changes kept |
| 3b | Chooses **Discard** / **Discard and leave** / **Leave** | Drops the changes and opens the chosen page | — | Chosen page shown |

### 6.6 Change the theme

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Opens the theme menu (or the user menu's Theme section) | Lists Light, Dark, System with the current one ticked | — | — |
| 2 | Picks an option | Applies it everywhere and remembers it | BR-SHELL-016 | New theme shown, also after reload |

## 7. Forms and Field-Level Specifications

### 7.1 Global search palette

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search LearnNext | Text box (placeholder "Search clients, programs, facilitators, tickets, settings…") | Search records or filter the jump list | Optional | 1 non-space character starts a search; empty or spaces-only shows the "Jump to" list | Requires Confirmation | Any text; matching ignores letter case and surrounding spaces | Empty (cleared every time the palette closes) | None | Shows the spinner while searching, the **Clear search** (×) button when it has text, the "Esc" hint when empty | N/A — empty results show "No results for “<query>”" (9) |
| Clear search (×) | Icon button | Empty the search box | Optional | N/A | N/A | N/A | Hidden | None | Visible only when the box has text and no search is running | N/A |

### 7.2 Sidebar controls

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Collapse / expand sidebar | Toggle button (round handle on the sidebar edge) | Switch between full sidebar and icon rail | Optional | N/A | N/A | Expanded / collapsed | Expanded | None | Large screens only; medium screens are always the rail and phones use the drawer. Remembered across reloads | N/A |
| Finance group | Expand/collapse toggle (full sidebar) or flyout button (rail) | Show the six finance pages | Optional | N/A | N/A | Open / closed | Closed, or open when a Finance page is the current page | None | Opens automatically when a Finance page becomes current; not remembered across reloads | N/A |

### 7.3 Theme choice

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Theme (header "Change theme" menu) | Single-choice menu | Choose the colour theme | Optional | N/A | N/A | Light, Dark, System | System | None | System follows the device setting and switches live when the device changes. Remembered across reloads | N/A |
| Theme (user menu "THEME" section) | Single-choice menu items | Same choice from the user menu | Optional | N/A | N/A | Light, Dark, System | System | None | Shares the same setting as the header menu | N/A |

### 7.4 Notifications

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Notification read state | Click on a row (one-way) | Mark a notification as read | Optional | N/A | N/A | Unread → read | As delivered (3 of 6 demo items unread) | None | Cannot be set back to unread from the header menu. Resets on reload (SH-001) | N/A |
| Mark all read | Text button | Mark every notification read | Optional | N/A | N/A | N/A | Shown when unread > 0 | None | Hidden when nothing is unread | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-SHELL-001 | One menu everywhere | Within a role, the same menu defines the sidebar, mobile drawer, icon rail, breadcrumbs, browser tab titles and the search palette's "Jump to" list | Always | A page added to a role's menu appears in all of them | — | — |
| BR-SHELL-002 | Placeholder for unbuilt pages | Menu items without a built page open "Nothing here yet". Today: Projects, the six Finance pages, Assessments, Polls & Surveys, Reports | Opening those items | Placeholder card with the page name | — | "Nothing here yet" / "The <page> page hasn’t been built yet." |
| BR-SHELL-003 | Layout by width | Phones and small tablets: bottom tab bar + drawer; medium screens: icon rail (opens over the page); large screens: full sidebar (collapsible) | Always | — | — | — |
| BR-SHELL-004 | Remembered collapse | The collapse choice is kept across reloads and applies only on large screens | Large screens | — | — | — |
| BR-SHELL-005 | Active item | The menu item for the current page, or for the section a sub-page belongs to, is highlighted. My Profile has no menu item, so nothing is highlighted there | Every page change | — | — | — |
| BR-SHELL-006 | Finance auto-open | The Finance group opens when one of its pages is current (including when reached via search) | Full sidebar | — | — | — |
| BR-SHELL-007 | Breadcrumb content | One crumb for top-level pages; "Section › Page" for sub-pages; the section crumb links to the section (Finance → All Invoices) | Every page | — | — | — |
| BR-SHELL-008 | Tab title | "<Page name> · LearnNext" | Every portal page | — | — | — |
| BR-SHELL-009 | Search shortcut | Ctrl+K or ⌘K opens the palette, or closes it if open | Any portal page | — | — | — |
| BR-SHELL-010 | Record search | Typed text is matched, ignoring case, against each searchable source of the current role (Training Partner: pages, clients, programs, facilitators, support tickets, Settings masters). Matches at the start of a field rank first, then at the start of a word, then anywhere; up to 4 results per group with "+N more" | Typing in the palette | Spinner, then grouped results or "no results" | Text matching nothing | "No results for “<query>”" / "Try a client or program name, a person’s name or email, a ticket number or a setting." |
| BR-SHELL-011 | Search reset | The query is cleared whenever the palette closes | Closing the palette | Next opening shows "Jump to" | — | — |
| BR-SHELL-012 | Unread count | The bell badge shows the number of unread notifications; the menu shows the first five items of the list | Always | Badge hidden at 0 | — | "<N> unread" / "You’re all caught up" |
| BR-SHELL-013 | Marking read | Clicking an item marks it read; **Mark all read** marks every item read | Notifications menu | — | — | Badge and header line update |
| BR-SHELL-014 | Leave guard | Add client, Edit client, Program content and Verify KYC ask before leaving through sidebar items, breadcrumbs, search entries, bottom tabs, the phone "More" sheet and the user menu's My Profile / Settings / Switch role | Unsaved changes present | Navigation waits for the user's answer | Support desk card, Log out and browser Back/Forward bypass the guard [Partially Implemented] | Page-specific dialog (5.11) |
| BR-SHELL-015 | Log out confirmation | Log out always asks for confirmation | User menu | See BR-AUTH-008 in [authentication-prd.md](authentication-prd.md) | — | "Log out of LearnNext?" |
| BR-SHELL-016 | Theme choice | Light, Dark or System; default System; remembered | Theme menus | Applied immediately | — | Tick on the current choice |
| BR-SHELL-017 | Dev only section | Development aids are listed apart, at the bottom of the menu, under "Dev only" | Always | Shown to every user [Requires Confirmation] (OQ-SHELL-010) | — | — |
| BR-SHELL-018 | Support desk waiting count | Counts open support tickets whose latest message is from the requester; shows up to three avatars (newest first), with "+N" as the third when more than three | Full sidebar | "<N> waiting", or "All caught up" when 0 | — | — |
| BR-SHELL-019 | Page change resets | On every page change the window scrolls to the top and the mobile drawer closes | Navigation | — | — | — |
| BR-SHELL-020 | Header auto-hide | The header hides while scrolling down beyond 80 px and returns on scroll up or near the top | All pages | Movements under 6 px ignored | — | — |
| BR-SHELL-022 | Bottom tab bar | Below 768 px a bottom tab bar (Home, Clients, Facilitators, Content, More) replaces the header hamburger; **More** opens the menu drawer; pages and sticky bars keep clear of it | Phones and small tablets | Current tab = soft blue pill behind the icon, blue name | — | — |
| BR-SHELL-023 | Tablet sidebar | Between 768 and 1024 px the sidebar is an icon rail; its edge handle opens the full sidebar over the page with a dimmed backdrop, without moving the page | Tablets | Not remembered; closes on outside tap, the handle or any page change | — | "Expand sidebar" / "Collapse sidebar" |
| BR-SHELL-024 | Theme on phones | The header theme button is hidden below 640 px; the theme is changed from the user menu's THEME section | Phones | — | — | — |
| BR-SHELL-025 | Installable app | The application can be installed as an app (name and short name "LearnNext", opens Dashboard full screen — each role's home after sign-in — portrait, brand blue) and keeps its own files on the device so it opens instantly and loads offline | Live HTTPS site | — | — | — |
| BR-SHELL-026 | Install card | Shown on phones to signed-in users who have not installed the app; Android gets an **Install** button, iPhone / iPad the Share → Add to Home Screen hint; × or declining hides it for 14 days | Phones | Never on desktop or inside the installed app | — | "Install LearnNext" |
| BR-SHELL-027 | Update on request | A newly published version waits until the user taps **Reload** in the update toast; checked at start and hourly | Every page | Never swapped in mid-task | — | "New version available" / "Reload to get the latest LearnNext." |
| BR-SHELL-028 | Shell follows the role | The chosen role decides the shell's menu, logo line, phone tabs, "More" tiles, page names, search sources, notifications bell and sidebar card. Training Partner: everything in this PRD. Super Admin: 5.16. Other roles have no shell yet | Every signed-in page | — | — | — |
| BR-SHELL-029 | Super Admin shell | Menu = **Manage Clients** only (plus My Profile in the user menu); no notifications bell, no Support desk card, no Dev only section, no "More" tiles; phone tabs **Clients** and **More** | Super Admin | Details in [PRD-SA](super-admin-prd.md) | — | — |
| BR-SHELL-030 | Settings in the user menu | **Settings** appears in the user menu only for roles that may open the Settings pages (Training Partner yes, Super Admin no) | User menu | — | — | — |
| BR-SHELL-031 | Switch role entry | **Switch role** appears in the user menu only when the login holds more than one role; it respects the leave guard (BR-SHELL-014) and then follows BR-AUTH-023 | User menu | — | — | — |
| BR-SHELL-021 | Notifications page [Not Implemented] | A full notifications history page is implied but does not exist | — | — | Opening a notifications address | Full-screen not-found page ([system-pages-prd.md](system-pages-prd.md)) |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Open a placeholder page | Item not built | Empty-state card | "Nothing here yet" / "The <page name> page hasn’t been built yet." | On opening | Choose another page |
| Search with no matches | Typed text matches nothing | Inline empty state | "No results for “<query>”" / "Try a client or program name, a person’s name or email, a ticket number or a setting." | After the search finishes | Edit or clear the query, use "Jump to" |
| Notifications with unread items | Unread > 0 | Badge + menu line | Red count on the bell; "<N> unread" | Always / on opening the menu | Open items, **Mark all read** |
| All notifications read | Unread = 0 | Menu line | "You’re all caught up" | On opening the menu | — |
| No notifications | List empty | Empty state | "No notifications" / "We’ll let you know when something needs your attention." | On opening the menu | — |
| Support requests waiting | Waiting > 0 | Sidebar card | "Support desk", "<N> waiting" | Always (full sidebar) | Open Support desk |
| No support requests waiting | Waiting = 0 | Sidebar card | "Support desk", "All caught up" | Always (full sidebar) | — |
| Leave with unsaved changes | Guarded page | Confirmation dialog | See 5.11 for each page's title, text and buttons | On leaving | Stay or discard |
| Log out confirmed | — | Info toast (SH-005) | "You have been signed out" | Immediately | See [authentication-prd.md](authentication-prd.md) |
| Footer status | Always | Static text | "All systems operational · v0.1.0" | Every page | — |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Search palette — "Jump to" list | Fast page access | Shown when the box is empty; 16 menu pages in menu order, each with its menu icon | Keyboard ↑ ↓ Enter, mouse click; list scrolls when taller than the palette | Never empty |
| Search palette — record results | Find pages and records | Grouped by source with a group heading (Pages, Clients, Programs, Facilitators, Support tickets, Settings); best matches first; up to 4 results per group, each with a title and a second line, plus "+N more — keep typing to narrow" | Sources follow the current role (BR-SHELL-010); SPOCs, participants and program content are not searched (OQ-SHELL-001) | "No results for “<query>”" / "Try a client or program name, a person’s name or email, a ticket number or a setting." |
| Notifications menu list | Latest notifications | First five items in list order, each with icon, title, one-line text, relative time and unread dot | Click marks read; **Mark all read** | "No notifications" / "We’ll let you know when something needs your attention." |
| Sidebar menu | Module list | Fixed order (5.2); Finance group expandable | No search or filter within the menu | N/A |

The shell itself has no filters, tables or pagination; list pages follow SH-008.

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| Searching for a page by name | User types "Clients" in the palette | "All Clients" (and "Add client") appear under Pages, with any client records matching the text under Clients | — | Pick the page |
| Enter with no entries | User presses Enter on an empty results view | Nothing happens | — | Edit the query |
| Notifications still loading | Bell opened immediately after sign-in or reload | Briefly shows the empty state until the list arrives (about 0.2 s) | "No notifications" | Reopen the menu |
| More than five notifications | List longer than five | Only the first five are visible; the sixth demo item can never be seen | — | OQ-SHELL-003 |
| Notifications after reload | Page reloaded | Read state returns to the original demo state (SH-001) | — | — |
| Unknown address | User types an address that does not exist (including a notifications page) | Full-screen not-found page outside the shell ([system-pages-prd.md](system-pages-prd.md)) | See that PRD | Go back to the Dashboard |
| Unknown Settings master address | For example "/settings/some-name" | Breadcrumb and tab title use the address turned into words ("Settings › Some name"); the page content is described in [settings-hub-prd.md](settings-hub-prd.md) | — | — |
| Tablet with collapsed preference | User collapsed the sidebar on desktop, then narrows the window | Medium width always shows the rail; large width restores the remembered choice | — | — |
| Guard while mobile drawer is open | Choose a page in the drawer on a guarded page | Dialog opens with the drawer still open behind it | Page's dialog | Answer the dialog; close the drawer |
| Logging out with unsaved work | Log out from Add client with changes | No discard warning; changes are lost after confirming Log out | "Log out of LearnNext?" | OQ-SHELL-008 |
| Support desk card with unsaved work | Click the Support desk card on Add client with changes | Opens Support desk without asking; changes lost | — | OQ-SHELL-009 |
| Browser Back with unsaved work | Press Back on a guarded page | Leaves without asking | — | OQ-SHELL-009 |
| Ctrl+K while typing | Focus in any text field | Palette opens (the browser's own Ctrl+K does not run) | — | OQ-SHELL-013 |
| Very large unread count | Many unread notifications | Number shown in a small fixed-size circle with no cap | — | OQ-SHELL-014 |
| Page fails to load | A page's content cannot be downloaded or crashes | Full-screen crash / offline pages ([system-pages-prd.md](system-pages-prd.md)) | See that PRD | Retry |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| [Authentication](authentication-prd.md) | The shell appears only after sign-in and a role choice; Log out and Switch role live in the user menu and follow the rules defined there | Sign in; **Log out**; **Switch role** | Shell shown / user returned to Sign in / role picker | SH-003, BR-SHELL-015, BR-AUTH-008, BR-AUTH-023 |
| [Super Admin portal (PRD-SA)](super-admin-prd.md) | The Super Admin's pages run inside the Super Admin shell (5.16) | **Continue as Super Admin** | Manage Clients shown in the reduced shell | BR-SHELL-028, BR-SHELL-029 |
| [Dashboard](dashboard-prd.md) | First menu item and default landing page | Click **Dashboard** | Dashboard opens | BR-SHELL-001 |
| [Profile](profile-prd.md) | Opened from the user menu; profile edits update the user menu's name, email and photo | **My Profile**; save profile | Header shows new details | BR-SHELL-014 |
| [All Clients](clients-prd.md), [Client detail](client-detail-prd.md) | Add client and Edit client register the leave guard; their breadcrumbs sit under All Clients | Leave with unsaved changes | "Discard this client?" / "Discard your changes?" | BR-SHELL-014 |
| [Manage Content](manage-content-prd.md) | Program content registers the leave guard for unsaved permission changes | Leave with unsaved permissions | "Discard permission changes?" | BR-SHELL-014 |
| [Facilitators](facilitators-prd.md) | Verify KYC registers the leave guard once a section is marked | Leave mid-verification | "Leave without finishing?" | BR-SHELL-014 |
| [Support desk](support-desk-prd.md) | The sidebar card shows the waiting count from the same tickets and opens the page | Answer tickets; click the card | Count updates; Support desk opens | BR-SHELL-018 |
| [Settings hub](settings-hub-prd.md) | Opened from the menu and the user menu; master names drive breadcrumbs and tab titles | Open a master | "Settings › <master>" | BR-SHELL-007 |
| [Settings: Users & Access](settings-access-masters-prd.md) | Roles & Access and Menu Mapping & Access describe menu permissions that the sidebar does not apply | — | Every Training Partner sees the full Training Partner menu | SH-002, OQ-SHELL-012 |
| [System pages](system-pages-prd.md) | "Dev only" **System pages** item opens the gallery; unknown addresses show the not-found page | Click **System pages** | Gallery opens | BR-SHELL-017 |
| Unbuilt modules (Projects, Finance, Assessments, Polls & Surveys, Reports) | Menu items open the placeholder | Click the item | "Nothing here yet" | BR-SHELL-002, SH-009 |
| [Shared requirements](../shared-requirements.md) | Theme, responsive layout, dialogs, navigation titles | — | — | SH-001, SH-006, SH-009, SH-010 |

## 13. Acceptance Criteria

**AC-SHELL-001: Menu and active item**
- Given I am signed in on a large screen
- When I click **All Clients** and then open Add client
- Then **All Clients** stays highlighted in the sidebar
- And the breadcrumb reads "All Clients › Add client" and the tab title "Add client · LearnNext"

**AC-SHELL-002: Finance group**
- Given the full sidebar is shown
- When I click **Finance**
- Then All Invoices, Credit Note, Debit Note, E-Invoice, Trainer Invoice and Invoice Approvals appear
- When I open **Credit Note**
- Then the breadcrumb reads "Finance › Credit Note" and clicking "Finance" opens All Invoices

**AC-SHELL-003: Placeholder pages**
- Given I am signed in
- When I open Projects, any Finance page, Assessments, Polls & Surveys or Reports
- Then I see "Nothing here yet" and "The <page name> page hasn’t been built yet."

**AC-SHELL-004: Collapse and remember**
- Given I am on a large screen with the full sidebar
- When I click "Collapse sidebar" and reload
- Then the icon rail is shown, and hovering an icon shows its label
- And on a medium-width screen the rail is always shown with no collapse handle

**AC-SHELL-005: Mobile drawer**
- Given I am on a phone
- When I tap **Open menu** and choose **Facilitators**
- Then the drawer closes and Facilitators opens with its name in the header

**AC-SHELL-006: Search palette jump**
- Given I am on any portal page
- When I press Ctrl+K (⌘K on Mac)
- Then the palette opens with focus in the box and the "Jump to" list
- When I press ↓ twice and Enter
- Then Projects opens and the palette closes

**AC-SHELL-007: Search with text (current build)**
- Given the palette is open
- When I type "Acme"
- Then a spinner shows briefly, followed by the matching groups, or "No results for “Acme”" and "Try a client or program name, a person’s name or email, a ticket number or a setting." when nothing matches
- When I click **Clear search**
- Then the "Jump to" list returns

**AC-SHELL-008: Notifications**
- Given there are 3 unread notifications
- When I open the bell
- Then I see "3 unread" and five items
- When I click an unread item
- Then it shows as read, the menu stays open and the badge shows 2
- When I click **Mark all read**
- Then the badge disappears and "You’re all caught up" is shown

**AC-SHELL-009: Theme**
- Given the theme is System
- When I choose **Dark** in the header theme menu and reload
- Then the dark theme is applied and **Dark** is ticked in both the header menu and the user menu

**AC-SHELL-010: User menu**
- Given I am signed in with the demo account as Training Partner
- When I open the user menu
- Then I see "Atul Kumar" and "admin@learnnext.io", **My Profile**, **Settings**, **Switch role**, the Theme options and **Log out**
- When I choose **Log out**
- Then "Log out of LearnNext?" opens (see AC-AUTH-012)
- And for a login with only one role, **Switch role** is not shown

**AC-SHELL-011: Leave guard**
- Given I have typed a client name on Add client
- When I click **Dashboard** in the sidebar
- Then "Discard this client?" opens and I stay on Add client
- When I click **Keep editing**
- Then my entry is still there
- When I click **Dashboard** again and choose **Discard**
- Then the Dashboard opens

**AC-SHELL-012: Leave guard through search and breadcrumbs**
- Given I have unsaved permission changes on Program content
- When I click the "Manage Content" breadcrumb, or choose a page in the search palette
- Then "Discard permission changes?" opens with **Stay** and **Discard and leave**

**AC-SHELL-013: Support desk card**
- Given support tickets are waiting for a reply
- When I look at the full sidebar
- Then the Support desk card shows "<N> waiting" with up to three avatars
- When I click it
- Then the Support desk page opens and the card shows as current

**AC-SHELL-014: Bottom tab bar (phones)**
- Given I am signed in on a phone (375 px wide)
- When any portal page opens
- Then a bottom bar shows **Home**, **Clients**, **Facilitators**, **Content** and **More**, and the header has no hamburger or theme button
- When I tap **Clients**
- Then All Clients opens and **Clients** shows its icon on a soft blue pill with a blue name
- When I tap **More**
- Then the "More" sheet rises from the bottom with my name and **View profile**, coloured module tiles (including **Support** with its waiting count) and the Finance pages
- When I tap **Reports**
- Then the sheet closes and the Reports page opens

**AC-SHELL-015: Tablet sidebar opens over the page**
- Given the window is 1000 px wide (icon rail)
- When I click the sidebar's edge handle
- Then the full sidebar with labels opens over the page, the page is dimmed and does not move
- When I tap the dimmed page or open any page
- Then the sidebar returns to the icon rail

**AC-SHELL-016: Install and update the app**
- Given I open the live site on an Android phone and sign in
- When the "Install LearnNext" card appears and I tap **Install**
- Then LearnNext is added to my home screen and opens the Dashboard full screen
- Given a new version has been published while the app is open
- Then "New version available" appears, and the new version loads only when I tap **Reload**

**AC-SHELL-017: Super Admin shell**
- Given I continued as Super Admin
- Then the sidebar shows only **Manage Clients**, the logo line reads "Super Admin", and there is no notifications bell, Support desk card or "Dev only" section
- When I open the user menu
- Then I see **My Profile**, **Switch role**, Theme and **Log out**, but no **Settings**
- When I press Ctrl+K
- Then "Jump to" lists only Manage Clients
- And on a phone the tab bar shows **Clients** and **More**, and **More** holds only my profile

**AC-SHELL-018: Switch role from the user menu**
- Given I am signed in as Training Partner on Facilitators
- When I choose **Switch role**
- Then the "Continue as" picker opens
- When I continue as Super Admin
- Then Manage Clients opens inside the Super Admin shell

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-SHELL-001 | AC-SHELL-001 | Active item on sub-pages | Signed in | Open /clients/new, a client, /facilitators/<id>/verify, /settings/<master> | Parent item highlighted each time | P1 |
| TC-SHELL-002 | BR-SHELL-008 | Tab titles | Signed in | Dashboard, Add client, a Settings master | "Dashboard · LearnNext", "Add client · LearnNext", "<Master> · LearnNext" | P2 |
| TC-SHELL-003 | AC-SHELL-002 | Finance expand and auto-open | Full sidebar | Open /finance/e-invoice directly | Finance group opens with E-Invoice highlighted | P2 |
| TC-SHELL-004 | AC-SHELL-002 | Finance flyout in rail | Collapsed rail | Click Finance icon | Flyout "FINANCE" with six pages; choosing one opens it | P2 |
| TC-SHELL-005 | AC-SHELL-003 | All ten placeholders | Signed in | Each placeholder item | "Nothing here yet" with the right page name | P1 |
| TC-SHELL-006 | AC-SHELL-004 | Collapse persists | ≥ 1024 px | Collapse, reload | Rail shown | P2 |
| TC-SHELL-007 | BR-SHELL-003 | Widths | — | 375, 900, 1440 px | Bottom tab bar + drawer / rail with handle / full sidebar; no sideways scroll | P1 |
| TC-SHELL-008 | AC-SHELL-005 | Drawer closes on navigation | 375 px | Tap **More**, tap a page | Drawer closes, page opens, scrolled to top | P1 |
| TC-SHELL-009 | AC-SHELL-006 | Shortcut toggles palette | Any page | Ctrl+K twice | Opens then closes | P1 |
| TC-SHELL-010 | AC-SHELL-006 | Jump list keyboard | Palette open | ↑ at first entry; ↓ past last entry | Highlight stops at both ends | P3 |
| TC-SHELL-011 | AC-SHELL-007 | Typed search | Palette open | "Dashboard", "zzqx", "   " | "Dashboard" under Pages; "No results for “zzqx”"; spaces only: "Jump to" list | P2 |
| TC-SHELL-012 | BR-SHELL-011 | Query cleared on close | Palette with text | Esc, reopen | Empty box, "Jump to" list | P3 |
| TC-SHELL-013 | AC-SHELL-008 | Mark one read | 3 unread | Click first unread item | Badge 2, item read, menu open | P2 |
| TC-SHELL-014 | AC-SHELL-008 | Mark all read | Unread > 0 | Click **Mark all read** | No badge, "You’re all caught up", link hidden | P2 |
| TC-SHELL-015 | BR-SHELL-012 | Only five shown | Demo data | Open bell | Five items; sixth not reachable | P3 |
| TC-SHELL-016 | SH-010 | Notification keyboard access | Bell open via keyboard | Tab through | Rows cannot be focused or activated (known gap, OQ-SHELL-005) | P2 |
| TC-SHELL-017 | AC-SHELL-009 | Theme persists and syncs | System theme | Choose Dark in header, reload, open user menu | Dark applied; Dark ticked in both menus | P2 |
| TC-SHELL-018 | BR-SHELL-016 | System follows device | Theme = System | Switch device to dark mode | Application turns dark without reload | P3 |
| TC-SHELL-019 | AC-SHELL-010 | User menu items | Signed in | Open menu, choose My Profile, then Settings | Profile opens; Settings opens | P1 |
| TC-SHELL-020 | AC-SHELL-011 | Guard via sidebar | Add client with a typed value | Click Dashboard | "Discard this client?"; **Keep editing** keeps data; **Discard** leaves | P0 |
| TC-SHELL-021 | AC-SHELL-012 | Guard via breadcrumb, search, user menu | Program content with 2 unsaved changes | Breadcrumb, search entry, **Settings** in user menu | "Discard permission changes?" with "You have 2 unsaved permission changes…" each time | P1 |
| TC-SHELL-022 | BR-SHELL-014 | Guard on Verify KYC | One section marked | Click Facilitators in sidebar | "Leave without finishing?" | P1 |
| TC-SHELL-023 | BR-SHELL-014 | Guard gaps (known) | Add client with changes | Click Support desk card; press browser Back | Leaves without asking (OQ-SHELL-009) | P2 |
| TC-SHELL-024 | BR-SHELL-014 | No guard when unchanged | Add client untouched | Click Dashboard | Dashboard opens immediately | P1 |
| TC-SHELL-025 | AC-SHELL-013 | Support desk card states | Tickets waiting / none waiting | Answer all waiting tickets on Support desk | Card changes from "<N> waiting" to "All caught up" | P2 |
| TC-SHELL-026 | BR-SHELL-018 | "+N" avatar | More than three waiting | — | Two avatars and "+<N−2>" | P3 |
| TC-SHELL-027 | BR-SHELL-020 | Header auto-hide | Long page | Scroll down 300 px, then up | Header hides, then returns | P3 |
| TC-SHELL-028 | 5.1 | Skip to content | Fresh page | Press Tab, Enter | Focus moves to main content | P3 |
| TC-SHELL-029 | BR-SHELL-021 | No notifications page | Signed in | Open /notifications | Full-screen not-found page | P3 |
| TC-SHELL-030 | BR-SHELL-017 | Dev only section | Signed in | View sidebar bottom | "Dev only" label and **System pages**; rail shows a divider | P3 |
| TC-SHELL-031 | AC-SHELL-014 | Bottom tab bar tabs | 375 px | Tap each tab; open Client details | Each page opens; current tab on a soft blue pill; **Clients** stays current on Client details | P1 |
| TC-SHELL-032 | BR-SHELL-022 | **More** is current elsewhere | 375 px | Open Settings, Profile | **More** shown as current | P3 |
| TC-SHELL-033 | BR-SHELL-022 | Nothing behind the bar | 375 px | Scroll to the end of a long list; Verify KYC with a section marked | Last card and the sticky action bar fully visible above the tab bar | P1 |
| TC-SHELL-034 | BR-SHELL-014 | Tab bar respects leave guard | 375 px, Add client with typed data | Tap **Home** | "Discard this client?" | P1 |
| TC-SHELL-035 | AC-SHELL-015 | Tablet sidebar overlay | 1000 px | Click edge handle; tap backdrop | Full sidebar over the page, page not shifted; back to rail | P2 |
| TC-SHELL-036 | BR-SHELL-024 | Theme on phones | 375 px | View header; open user menu | No theme button in header; THEME section in user menu works | P3 |
| TC-SHELL-037 | AC-SHELL-016 | Install on Android | Live site, Android Chrome, signed in | Tap **Install** on the card | Home-screen icon "LearnNext"; opens Dashboard full screen, no browser bar | P1 |
| TC-SHELL-038 | BR-SHELL-026 | Install hint on iPhone | Live site, Safari, signed in | View the card | "Tap Share then Add to Home Screen"; no Install button; × hides it for 14 days | P2 |
| TC-SHELL-039 | BR-SHELL-025 | Opens offline | App installed and opened once | Airplane mode, open the app | Shell and pages load; network-dependent parts show the offline screen | P2 |
| TC-SHELL-040 | BR-SHELL-027 | Update on Reload | App open; publish a new version | Wait (or reopen) | "New version available" toast; new version only after **Reload** | P2 |
| TC-SHELL-041 | 5.7 | Notifications sheet | 375 px, 3 unread | Tap the bell; switch to **Unread**; tap a row | Sheet with NEW (3) / EARLIER; Unread shows only NEW; tapping a row drops "Unread · 3" to "Unread · 2" | P2 |
| TC-SHELL-042 | SH-013 | Dropdowns as sheets | 375 px | Open a client's ⋮ menu, the user menu, and "Created by" in the clients filter drawer | Each opens full width from the bottom; picking in the filter sheet keeps the drawer open | P2 |
| TC-SHELL-043 | SH-013 | Tap on the dimmed area | 375 px; Manage Content filter drawer open with the Category picker open | Tap the dimmed area right over the drawer's × | Only the picker closes; the drawer stays open | P1 |
| TC-SHELL-044 | SH-013 | Picker with keyboard | Phone; Category picker open | Note the keyboard stays down on open; tap the search box, scroll the list | Keyboard appears only on tapping search; the sheet sits above the keyboard; search stays under the grab handle and "0 selected · Clear" at the bottom | P1 |
| TC-SHELL-045 | SH-013 | Dialog with keyboard | Phone; Facilitators → Add facilitator | Tap Address line 1 | The dialog fits above the keyboard, the field scrolls into view above Cancel / Send KYC; sub-text reads "We'll email them a KYC link." | P1 |
| TC-SHELL-046 | AC-SHELL-017 | Super Admin sidebar and header | Signed in as Super Admin, ≥ 1024 px | View shell | One menu item; "Super Admin" under the logo; no bell, no Support desk card, no Dev only | P1 |
| TC-SHELL-047 | BR-SHELL-030 | Settings only for allowed roles | Training Partner, then Super Admin | Open user menu each time | **Settings** shown / not shown | P2 |
| TC-SHELL-048 | AC-SHELL-017 | Super Admin search | Super Admin, palette open | Empty box; type a client's name; type "Facilitators" | Jump to = Manage Clients; client result opens Client details; no Training Partner pages listed | P2 |
| TC-SHELL-049 | BR-SHELL-029 | Super Admin on phone | 375 px, Super Admin | Tap **More** | Tabs **Clients** + **More**; sheet holds only the profile row | P3 |
| TC-SHELL-050 | AC-SHELL-018 | Switch role menu item | Demo account (4 roles) | Open user menu; choose **Switch role** | Item present; picker opens; chosen role's home opens after Continue | P1 |
| TC-SHELL-051 | BR-SHELL-014 | Switch role respects guard | Verify KYC with a section marked | **Switch role** | "Leave without finishing?" | P2 |
| TC-SHELL-052 | 5.14 | Toast position by width | Trigger a toast (e.g. save a client) | 375 px; 700 px; 1280 px | Top, just under the header; bottom-right above the tab bar; bottom-right | P2 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-SHELL-001 | Global search | Resolved 2026-11-02: the search now finds pages, clients, programs, facilitators, support tickets and Settings masters (best matches first, 4 per group with "+N more"), and each result opens its record. Still open: whether SPOCs, participants and program content should also be searchable | Coverage of the search | Confirm any further sources | Open |
| OQ-SHELL-002 | Global search | "Jump to" lists placeholder pages and the Dev only "System pages" item, but not My Profile, Support desk or Settings masters | Users may jump to empty pages and miss real ones | Confirm which pages belong in "Jump to" | Open |
| OQ-SHELL-003 | Notifications | No Notifications page or "View all" link; only five items are visible; items do not open the related record | Older or important notifications cannot be reached or acted on | Decide whether a Notifications page is needed and what each notification type links to | Open |
| OQ-SHELL-004 | Notifications | Notifications are fixed demo items about courses, enrolments and instructor payouts; nothing in the application creates notifications, and read state resets on reload | Content does not match the Training Partner portal's domain | Define notification events (e.g. KYC submitted, ticket received, invoice approval), delivery, retention and read-state persistence | Open |
| OQ-SHELL-005 | Notifications | Notification rows can only be clicked with a mouse; they cannot be focused or activated by keyboard (differs from SH-010) | Accessibility | Confirm rows must be keyboard operable | Open |
| OQ-SHELL-006 | Placeholder pages | Projects, six Finance pages, Assessments, Polls & Surveys and Reports show "Nothing here yet" | Users see menu items that do nothing | Confirm scope and timing, and whether unbuilt items should be hidden until ready | Open |
| OQ-SHELL-007 | Help & Support | A Help & Support drawer (FAQ, Email support, Send feedback, shortcuts) exists but nothing opens it; its FAQ refers to courses and instructors | Users have no in-app help | Decide whether to add a Help entry point and provide correct FAQ copy | Open |
| OQ-SHELL-008 | Log out / leave guard | Log out does not check for unsaved changes on Add client, Edit client, Program content or Verify KYC; work is lost after confirming | Data loss | Confirm whether Log out should show the page's discard dialog first | Open |
| OQ-SHELL-009 | Leave guard | The full-sidebar Support desk card and the browser Back/Forward buttons bypass the guard; Add client / Edit client give no warning on reload or tab close, while Program content and Verify KYC do | Inconsistent protection against data loss | Confirm that every exit, including Back and reload, should ask on all guarded pages, and which other forms need a guard | Open |
| OQ-SHELL-010 | Dev only section | "System pages" is shown to every Training Partner in every build (not to Super Admin) | Development tools visible to business users | Confirm it is hidden in production builds | Open |
| OQ-SHELL-011 | Footer | "All systems operational · v0.1.0" is fixed text | May mislead users during an outage; version never changes | Decide whether to show live status and the real release version, or remove | Open |
| OQ-SHELL-012 | Sidebar / access | The portal role now decides the shell (Training Partner vs Super Admin), but within the Training Partner portal the Menu Mapping & Access and Roles & Access settings are still not applied to the menu, search or header (SH-002) | Every Training Partner sees every module | Define per-role menu visibility inside the Training Partner portal and behaviour for hidden pages opened by address | Open |
| OQ-SHELL-013 | Keyboard shortcuts | Ctrl+K / ⌘K is the only shortcut; it works while typing in fields and overrides the browser's Ctrl+K | Possible conflict with user expectations | Confirm the shortcut set and whether shortcuts should be ignored while typing | Open |
| OQ-SHELL-014 | Notifications badge | No cap on the unread number in the badge (e.g. "9+") | Large numbers overflow the small circle | Define the display rule for large counts | Open |
| OQ-SHELL-015 | Phone layout (SH-013) | To keep phones uncluttered some features are not available there: list summary pills, the Settings group tabs, pin buttons and Quick access (pinned / recently opened masters), and pages without a filter drawer show no counts at all | Phone users cannot pin masters or see list counts | Confirm these are acceptable on phones, or name the ones that must come back (e.g. a "Pinned" card on Settings) | Open |
| OQ-SHELL-016 | Super Admin shell | On phones the Super Admin's **More** tab opens a sheet that holds only the profile row; there are no notifications, no Settings and no support entry for the Super Admin | A near-empty tab; unclear how a Super Admin gets help or alerts | Confirm the Super Admin's phone tabs and whether it needs notifications, settings or support | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and features inventory: Complete (sidebar, rail, drawer, Dev only, Support desk card, header, breadcrumbs, search, notifications, theme, user menu, footer, placeholder, leave guard, shortcuts, Help drawer)
- [x] User roles and access: Complete
- [x] Page functionality and behaviour: Complete
- [x] User workflows: Complete
- [x] Field-level specifications: Complete for all inputs and toggles
- [ ] Minimum and maximum constraints, where known: Incomplete (search box maximum length not defined, see OQ-SHELL-001; badge count display, see OQ-SHELL-014)
- [x] Validation and business rules: Complete
- [x] Success messages and feedback: Complete
- [ ] Search, filters, tables and listings: Incomplete (further search sources such as SPOCs and participants not decided, see OQ-SHELL-001)
- [x] Empty states, errors and edge cases: Complete
- [ ] Notifications behaviour: Incomplete (no page, events or persistence defined, see OQ-SHELL-003, OQ-SHELL-004)
- [ ] Unsaved-changes protection: Incomplete (bypassed by Log out, Support desk card, browser Back and reload on some pages, see OQ-SHELL-008, OQ-SHELL-009)
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria: Complete
- [x] QA test scenarios: Complete
- [x] Open questions logged: Complete
