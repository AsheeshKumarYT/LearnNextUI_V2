# Settings Hub: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Settings Hub PRD |
| Module name | Settings Hub (Settings page and master pages) |
| Document ID | PRD-SET |
| Version | 1.2 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (15 of 18 masters have a page; 3 show a placeholder) |
| Last updated | 2026-11-05 (v1.2: naming: LearnNext Portal; "Training Partner" replaces "Admin") · 2026-11-03 (v1.1: phone layout) |
| Phone layout (v1.1) | Settings on phones: the outer two-pane card is flattened, the group tabs, the "All masters" title and the pin buttons are hidden; the filter box comes first and each group is its own card, 12 px apart, with master descriptions shown in full. Quick access (pinned / recent) is therefore not reachable on phones. See SH-013. |
| Related modules/pages | [app-shell-navigation-prd.md](app-shell-navigation-prd.md), [settings-finance-masters-prd.md](settings-finance-masters-prd.md), [settings-location-masters-prd.md](settings-location-masters-prd.md), [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md), [settings-program-content-masters-prd.md](settings-program-content-masters-prd.md), [settings-access-masters-prd.md](settings-access-masters-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

Settings is the single place where Training Partner users find and open the **masters**: the reference lists (entities, locations, job titles, program categories, roles and so on) that the rest of LearnNext Portal relies on.

The Settings page aims to:

- Show every master on one page, organised into 7 groups, so a Training Partner user can scan everything without clicking through tabs.
- Let a Training Partner user jump straight to a group from a list on the left, and always show which group is currently in view.
- Let a Training Partner user find a master by typing, including common synonyms (for example "town" finds City), and open it from the keyboard.
- Keep the masters a Training Partner user uses most within reach (pinned masters and recently opened masters).
- Give every master its own page address so it can be bookmarked and linked; masters that are not built yet show a clear "on the way" message instead of a broken page.

This PRD covers the Settings page and the master page frame (address, breadcrumb, placeholder and "not found" handling). The contents of each built master are covered by the group PRDs listed in section 3.

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Settings (`/settings`) | Lists all 18 masters in 7 groups on one page, with a group jump list, a filter, pins and recent history | Training Partner user | Jump to a group, filter masters, open a master, pin/unpin, clear history | Sidebar "Settings" item and user menu "Settings" ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)) |
| Group jump list (left pane) | Jumps to a group's section and highlights the group in view | Training Partner user | Click a group or Quick access | Settings |
| Masters pane (right pane) | Shows all groups (default), Quick access, or filter results | Training Partner user | Open, pin, keyboard-navigate | Every master page |
| Quick access | Pinned masters plus recently opened masters | Training Partner user | Open, unpin, Clear history | Settings |
| Master page (`/settings/<master>`) | Opens one master's own page | Training Partner user | Work with the master (see group PRDs) | Group PRDs below |
| Placeholder master page | Shown for masters that are not built yet | Training Partner user | Return to the master's group | Settings |
| "Master doesn't exist" page | Shown for an unknown master address | Training Partner user | Return to Settings | Settings |

**Master inventory (all 18 masters)**

| # | Group | Master | Description shown | Page status | Covered in |
|---|---|---|---|---|---|
| 1 | Finance | Entity | Legal entities that bill programs | Implemented | [settings-finance-masters-prd.md](settings-finance-masters-prd.md) |
| 2 | Finance | Sub-entity | Units under each entity | Implemented | [settings-finance-masters-prd.md](settings-finance-masters-prd.md) |
| 3 | Finance | SAP BP | SAP business partner codes | Implemented (read-only) | [settings-finance-masters-prd.md](settings-finance-masters-prd.md) |
| 4 | Finance | Expense head | Cost categories for programs | Implemented | [settings-finance-masters-prd.md](settings-finance-masters-prd.md) |
| 5 | Location | Country | Countries you work in | Implemented (read-only) | [settings-location-masters-prd.md](settings-location-masters-prd.md) |
| 6 | Location | State | States within each country | Implemented (read-only) | [settings-location-masters-prd.md](settings-location-masters-prd.md) |
| 7 | Location | City | Cities within each state | Implemented (read-only) | [settings-location-masters-prd.md](settings-location-masters-prd.md) |
| 8 | Industry & job | Department | Teams a participant belongs to | Implemented | [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md) |
| 9 | Industry & job | Designation | Job titles and levels | Implemented | [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md) |
| 10 | Industry & job | Role | Roles people play in programs | Implemented | [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md) |
| 11 | Industry & job | Industry type | Industries clients operate in | Implemented | [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md) |
| 12 | Banks | Bank master | Banks and branches | Not Implemented (placeholder) | This PRD (section 5.5) |
| 13 | Banks | House bank master | Your own receiving accounts | Not Implemented (placeholder) | This PRD (section 5.5) |
| 14 | Alert messages | Alert message templates | Emails and alerts sent automatically | Not Implemented (placeholder) | This PRD (section 5.5) |
| 15 | Program & Content | Program Category | Categories programs are grouped in | Implemented | [settings-program-content-masters-prd.md](settings-program-content-masters-prd.md) |
| 16 | Program & Content | Modules | Program phases — Pre, During, Post | Implemented | [settings-program-content-masters-prd.md](settings-program-content-masters-prd.md) |
| 17 | Others | Menu Mapping & Access | Pages in the Training Partner menu and their order | Implemented | [settings-access-masters-prd.md](settings-access-masters-prd.md) |
| 18 | Others | Roles & Access | What each role can see and do | Implemented | [settings-access-masters-prd.md](settings-access-masters-prd.md) |

Group order and counts on the page: Finance (4), Location (3), Industry & job (4), Banks (2), Alert messages (1), Program & Content (2), Others (2).

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Training Partner user (signed in and continuing as Training Partner) | Settings page and every master page | All actions in this PRD | Must be signed in (SH-003). No role-based restriction is applied (SH-002). |
| Signed-out visitor | None | None | Redirected to Sign in (SH-003). |

Pins, recent history and the dismissed pin tip are stored in the browser, so they belong to the browser rather than to the Training Partner user's account (SH-001).

## 5. Page Functionality and Behavior

### 5.1 Settings page layout

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Page frame | Hold the whole Settings experience in one card | Open Settings from the sidebar or user menu | One card with the group list on the left and the masters pane on the right. The header breadcrumb reads "Settings"; there is no title block (SH-009). | On large screens the card fills the window height and each pane scrolls on its own, so the page itself does not scroll. On smaller screens the group list becomes a sideways-scrolling row above the masters. | The user sees all groups and masters |
| Group jump list | Move quickly to a group | Click a group (e.g. "Location") | The masters pane scrolls (smoothly) to that group's section, the section is outlined briefly (about one second) so it is obvious where the user landed, the filter is cleared, and the page address gains `#<group>` (e.g. `#location`) without a page reload. | Each entry shows the group icon, name and number of masters. | The chosen group is highlighted and in view |
| Scroll-spy highlight | Show which group is in view | Scroll the masters pane | The highlighted group in the left list follows the section currently in view. Near the bottom, short final groups still light up one at a time. | After the user clicks a group, that group stays highlighted until the user scrolls themselves (wheel, touch, keys or scrollbar). | Left list always reflects the visible group |
| Selected-group row on small screens | Keep the chosen group visible in the sideways row | Pick a group on a phone or tablet | The sideways row scrolls so the chosen group is visible. | Only when the row is wider than the screen | Chosen group visible |
| Quick access entry | Open the user's pinned and recent masters | Click "Quick access" | The masters pane shows Quick access (section 5.3); address becomes `#mine`. | Shown at the top of the list only when there is at least one pinned or recently opened master. Its count = pinned + recent shown. | Quick access view |
| Pin tip | Teach pinning | Read / dismiss | A one-line tip "Pin masters you use often" with a dismiss (×, "Dismiss tip") control at the bottom of the group list. | Large screens only. Shown until it is dismissed or until any master is pinned; then never shown again in this browser. | Tip disappears permanently |
| Top bar title | Say what the pane shows | — | "All masters" (default), "Quick access", "N match" / "N matches" while filtering, or "No matches". | — | — |
| Master row | Open a master | Click the row (icon, name, description, chevron) | Opens the master page (`/settings/<master>`). | Hover and keyboard focus lift the row onto a white tile and turn the name blue. | Master page opens |
| Pin / Unpin button | Keep a master in Quick access | Click the pin icon at the right of a row | Toggles pinned state. Pinned rows show the pin permanently in amber; unpinned rows show it on hover or keyboard focus (always on touch screens). | Accessible name "Pin <master>" / "Unpin <master>", tooltip "Pin" / "Unpin". Pins are remembered in the browser (SH-001). | Master added to / removed from Pinned |
| Footer hint bar | Show keyboard shortcuts and pinned count | Read; click "Manage" | Shows "/ Filter", "↑ ↓ ← → Move", "Enter Open". When at least one master is pinned, the left side reads "N pinned · Manage"; "Manage" opens Quick access. | Hidden on phones and on windows shorter than 700 px. The Move/Open hints are hidden below medium width. | — |

### 5.2 Masters filter (search)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Filter box | Find a master by typing | Type in "Filter 18 masters…" | Results replace the group sections immediately (no debounce). Each result shows the group name above the master name. | See BR-SET-001 to BR-SET-004 for matching and ranking. Leading/trailing spaces are ignored. | Matching masters listed, best first |
| "/" shortcut | Reach the filter quickly | Press "/" anywhere on the page | Focus moves to the filter box. | Ignored while the user is typing in another input, text area, select or editable area. A "/" key hint shows inside the empty box (from small screens up). | Filter focused |
| Clear filter (×) | Empty the filter | Click × inside the box ("Clear filter") | Filter is emptied and focus returns to the box; the previous view (all groups or Quick access) returns. | × replaces the "/" hint while text is present. | Filter cleared |
| Esc in the filter | Empty the filter | Press Esc | Filter is emptied. | — | Filter cleared |
| Arrow keys | Move the highlight through results | Press ↑ ↓ ← → | Moves the highlighted result. One column: ↓ on the last result wraps to the first, ↑ on the first wraps to the last. Two columns: ↓/↑ move a whole row and stop at the ends; ← → move within a row. The highlighted result scrolls into view. | Results are shown in two columns when there are more than 6 results and the screen is at least 640 px wide. Hovering a result also highlights it. The highlight resets to the first result whenever the filter text changes. | Highlighted result changes |
| Enter | Open the highlighted master | Press Enter | Opens the highlighted master's page. | Only when there is at least one result | Master page opens |
| No results | Explain an empty result | Type text that matches nothing | Empty state (section 11) with a "Clear filter" button. | — | User can clear and retry |

### 5.3 Quick access (pinned and recently opened)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Pinned section | List pinned masters | Open Quick access | "Pinned" heading followed by pinned masters in the order they were pinned. Each row's description reads "<Group> · <description>". | Shown only when something is pinned | — |
| Recently opened section | List masters the user opened lately | Open Quick access | "Recently opened" heading followed by up to 6 masters, newest first. | Masters that are pinned are left out of this section. The browser remembers up to 12 recent masters; only the first 6 not-pinned ones are shown. A master counts as opened when its page (including a placeholder page) is visited. | — |
| Clear history | Forget recent masters | Click "Clear history" | The recent list is emptied immediately (no confirmation). | Pins are not affected. | Recently opened section disappears |
| Empty Quick access | Avoid an empty view | Unpin the last master and clear history while in Quick access | The pane falls back to the all-groups view and the Quick access entry disappears from the left list. | — | All masters shown |

### 5.4 Page address (hash links)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Group link | Link straight to a group | Open `/settings#<group>` (finance, location, industry-job, banks, alerts, programs, others) | The page opens with that group scrolled into view (instantly on first load) and highlighted. | — | Group in view |
| Quick access link | Link to Quick access | Open `/settings#mine` (older links `#quick`, `#pinned`, `#suggested` also work) | Opens Quick access if it has anything; otherwise all groups with the first group (Finance) in view. | — | Quick access or all groups |
| Unknown hash | Fail safely | Open `/settings#anything-else` | Treated as no hash: all groups, Finance in view. | — | All groups |
| Return from a master | Come back to where the user was | Use the back button on a placeholder / not-found page | Returns to `/settings#<that master's group>`. | — | Group in view |

### 5.5 Master page frame (`/settings/<master>`)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Breadcrumb and tab title | Show where the user is | Open any master | Header breadcrumb "Settings › <Master name>" (Settings links back to `/settings`); browser tab uses the master's name. | For an unknown address the name is built from the address (first letter capitalised, dashes become spaces). | — |
| Built master | Show the master's own page | Open one of the 15 built masters | The master's list page appears (see group PRDs). | — | Master page |
| Placeholder (not built) | Explain that a master is coming | Open Bank master, House bank master or Alert message templates | Centred message "<Master> is on the way" with "<Group> · <description>. Its list and form will be built here." and a back button labelled with the group name (e.g. "Banks"). **[Not Implemented]** for the master itself. | The visit is still added to Recently opened. | Back button returns to `/settings#<group>` |
| Unknown master | Handle a wrong or renamed address | Open `/settings/<unknown>` | Message "This master doesn’t exist" / "It may have been renamed. Pick one from Settings." with a "Settings" button. | Not added to Recently opened. | Button returns to `/settings` |

## 6. User Workflow

### 6.1 Open a master by browsing

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click Settings in the sidebar | Settings opens with all groups; Finance in view and highlighted | No hash in address | All masters visible |
| 2 | Click "Program & Content" in the left list | Pane scrolls to the group, section is outlined briefly, address becomes `#programs` | — | Group in view |
| 3 | Click "Modules" | Modules page opens; breadcrumb "Settings › Modules" | — | Master opened and added to Recently opened |
| 4 | Click "Settings" in the breadcrumb | Settings opens | — | Quick access entry now appears in the left list |

### 6.2 Find and open a master with the keyboard

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Press "/" | Filter box is focused | Not typing in another field | Ready to type |
| 2 | Type "town" | Results show City (matched via synonym); title "1 match" | BR-SET-001, BR-SET-002 | City highlighted |
| 3 | Press Enter | City page opens | At least one result | City master shown |

### 6.3 Pin a master and use Quick access

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Hover a master row and click the pin | Pin turns amber and stays visible; pin tip disappears for good; footer shows "1 pinned · Manage" | — | Master pinned |
| 2 | Click "Quick access" (or "Manage") | Quick access shows Pinned (and Recently opened if any) | — | Quick access view |
| 3 | Click the pin again on the pinned row | Master is unpinned | — | Removed from Pinned |
| 4 | Click "Clear history" | Recently opened is emptied | — | If nothing is left, the view returns to all groups |

## 7. Forms and Field-Level Specifications

### 7.1 Settings filter

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Filter masters ("Filter 18 masters…") | Search box | Find masters across all groups | Optional | N/A (one character starts filtering) | None defined | Any text; split into words on spaces; case-insensitive | Empty | None (no error state). Spaces-only input counts as empty. | While it has text, results replace the group sections / Quick access; Esc or × clears it; picking a group clears it | N/A (no-match empty state, section 11) |

### 7.2 Pin toggle

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Pin / Unpin (per master) | Toggle button | Add/remove the master from Pinned | Optional | N/A | None defined (all 18 can be pinned) | Pinned / not pinned | Not pinned | None | Visible on hover/focus when not pinned; always visible when pinned or on touch screens | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-SET-001 | All words must match | A master matches only if every word typed appears somewhere in its name, description, group name or its synonym list. | Filtering | Masters missing any word are left out | "bank city" | "No matches" |
| BR-SET-002 | Synonyms | Each master has extra search words: Country "location nation place"; State "location region province place"; City "location town place"; Department "team function"; Designation "title job position level"; Role "job position"; Industry type "sector domain"; SAP BP "sap business partner bp vendor customer code finance"; Entity "company legal billing gst finance"; Sub-entity "branch unit division"; Expense head "cost expense budget finance"; Bank master "bank ifsc branch account"; House bank master "bank account receiving gst"; Alert message templates "email sms notification message reminder template"; Modules "module feature product platform"; Menu Mapping & Access "menu navigation sidebar mapping access module"; Roles & Access "role permission rights access admin user privilege"; Program Category "program category course type group". | Filtering | Synonym matches are listed | — | — |
| BR-SET-003 | Ranking | Results are ordered: name starts with the full query; then name contains the full query; then name contains every word; then everything else. Ties keep the page order (group order, then master order). | Filtering | Best matches first; first result highlighted | — | — |
| BR-SET-004 | Matching is partial and case-insensitive | Words match anywhere inside the text ("ent" matches Entity, Sub-entity, Department…). | Filtering | — | — | — |
| BR-SET-005 | Recent history | Opening a valid master page puts it first in the recent list (no duplicates), keeping up to 12. Quick access shows the first 6 that are not pinned. | Visiting `/settings/<master>` | — | Unknown master address | Not recorded |
| BR-SET-006 | Pins and history are per browser | Pins, recent history and the dismissed pin tip are remembered in this browser and survive reload (SH-001). | Always | — | Different browser / cleared storage | Pins and history are empty |
| BR-SET-007 | Not-built masters | Bank master, House bank master and Alert message templates show a placeholder page. **[Not Implemented]** | Opening these masters | Placeholder with a way back | — | "<Master> is on the way" |
| BR-SET-008 | Unknown master | An address that does not match any master shows a not-found message. | `/settings/<unknown>` | Not-found message | — | "This master doesn’t exist" |
| BR-SET-009 | Settings is not in global search | Masters are found through the Settings filter only; the header's global search (⌘K) does not list them. **[Requires Confirmation]** whether they should be. | Global search | — | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Filtering | At least one result | Inline title | "1 match" / "N matches" | While text is in the filter | Arrow keys / Enter or click |
| Filtering | No result | Inline title + empty state | "No matches"; "No masters match “<query>”" | While text is in the filter | Clear filter |
| Picked a group | From the left list | Visual cue | Section outlined briefly (no text) | About one second after the jump | Pick a master |
| Pin tip | Nothing pinned, tip not dismissed | Inline tip | "Pin masters you use often" | Large screens | Pin a master or dismiss |
| Pinned count | At least one pin | Inline footer | "N pinned · Manage" | Footer bar | Click Manage |
| Pin / Clear history | — | None | No toast is shown | — | — |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Group jump list | Navigate to groups | One entry per group with count; Quick access entry when it has items | 7 groups + Quick access | Quick access hidden when empty |
| All-groups listing | Show every master | Each group is a light card headed by its name; masters listed in two columns when the pane is wide enough (about 640 px of pane width), otherwise one | Page order fixed (section 3 inventory) | N/A (fixed list) |
| Filter results listing | Show matches across groups | Group label above each name; one or two columns (more than 6 results and ≥640 px screen = two) | BR-SET-001 to BR-SET-004 | "No masters match “…”" empty state |
| Quick access listing | Pinned + recent | Pinned in pin order; recent newest first (max 6) | Row description "<Group> · <description>" | Falls back to all groups when empty |
| Pagination / sorting | — | Not applicable — the list is fixed at 18 masters | — | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| No filter matches | Filter text matches no master | Empty state replaces results | Title: "No masters match “<query>”". Description: "Try a simpler word — e.g. “city”, “fee”, “trainer”, “assessment” or “bank”." Button: "Clear filter" | Clear filter. Note: "fee", "trainer" and "assessment" currently return no matches themselves (OQ-SET-001). |
| Master not built | Bank master, House bank master, Alert message templates | Placeholder card | "<Master> is on the way" / "<Group> · <description>. Its list and form will be built here." | Back button named after the group |
| Unknown master | Mistyped / old address | Not-found card | "This master doesn’t exist" / "It may have been renamed. Pick one from Settings." | "Settings" button |
| Quick access emptied | Last pin removed and history cleared | All-groups view returns | None | — |
| Stale pinned/recent entry | A stored master no longer exists | It is silently left out | None | — |
| Short window | Window height below 700 px | Footer hint bar hidden | None | — |
| Pin tip on small screens | Below large width | Tip not shown | None | — |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| [App shell & navigation](app-shell-navigation-prd.md) | Sidebar "Settings" and user menu "Settings" open this page; breadcrumb/tab title come from the master name | Navigation | "Settings › <Master>" breadcrumb | SH-009 |
| [Finance masters](settings-finance-masters-prd.md) | Entity, Sub-entity, SAP BP, Expense head pages | Open master | Master list page | — |
| [Location masters](settings-location-masters-prd.md) | Country, State, City pages | Open master | Read-only lists | — |
| [Industry & job masters](settings-industry-job-masters-prd.md) | Department, Designation, Role, Industry type pages | Open master | Master list page | — |
| [Program & content masters](settings-program-content-masters-prd.md) | Program Category, Modules pages | Open master | Master list page | — |
| [Access masters](settings-access-masters-prd.md) | Menu Mapping & Access, Roles & Access pages; Settings is itself a menu entry ("Settings", `/settings`) in Menu Mapping | Open master | Master list page | SH-002 |
| [System pages](system-pages-prd.md) | Not-built *menu pages* use the app-wide "Nothing here yet" placeholder; not-built *masters* use this module's own "is on the way" placeholder | — | Two different placeholder styles | SH-009 |

## 13. Acceptance Criteria

**AC-SET-001: All masters on one page**
- Given a signed-in Training Partner user
- When they open `/settings`
- Then 7 groups are shown in the order Finance, Location, Industry & job, Banks, Alert messages, Program & Content, Others
- And the left list shows counts 4, 3, 4, 2, 1, 2, 2
- And the filter placeholder reads "Filter 18 masters…"

**AC-SET-002: Jump to a group**
- Given the Settings page is open
- When the user clicks "Others" in the left list
- Then the pane scrolls to the Others section, which is outlined briefly
- And "Others" is highlighted in the left list
- And the address ends with `#others`

**AC-SET-003: Scroll-spy**
- Given all groups are shown
- When the user scrolls the masters pane down to the Banks section
- Then "Banks" becomes the highlighted group in the left list

**AC-SET-004: Synonym filtering**
- Given the Settings page is open
- When the user types "ifsc"
- Then only "Bank master" is listed, with the group label "Banks"
- And the title reads "1 match"

**AC-SET-005: Keyboard open**
- Given the filter shows results
- When the user presses ↓ and then Enter
- Then the second result's master page opens (or the first, if there is only one column and one result)

**AC-SET-006: No matches (negative)**
- Given the Settings page is open
- When the user types "xyz"
- Then the title reads "No matches"
- And the empty state "No masters match “xyz”" with a "Clear filter" button appears
- And pressing Enter does nothing

**AC-SET-007: Slash shortcut ignored while typing (negative)**
- Given focus is in the filter box
- When the user types "/"
- Then "/" is entered as text and focus does not move

**AC-SET-008: Pinning**
- Given no master is pinned and the pin tip is showing
- When the user pins "City"
- Then the pin tip disappears and does not return after reload
- And Quick access appears in the left list with City under "Pinned"
- And the footer reads "1 pinned · Manage"

**AC-SET-009: Recently opened**
- Given the user has opened Entity, then City, then Entity again
- When they open Quick access
- Then "Recently opened" lists Entity then City (no duplicates)
- And clicking "Clear history" removes the section

**AC-SET-010: Placeholder master**
- Given the user opens "House bank master"
- Then the page shows "House bank master is on the way"
- And a "Banks" button returns to `/settings#banks`

**AC-SET-011: Unknown master (negative)**
- Given the user opens `/settings/foo`
- Then the page shows "This master doesn’t exist" and a "Settings" button
- And "foo" is not added to Recently opened

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-SET-001 | AC-SET-001 | Group order and counts | Signed in, clean browser storage | — | 7 groups, counts 4/3/4/2/1/2/2, 18 masters | P1 |
| TC-SET-002 | AC-SET-002 | Jump via left list | Settings open | Click "Location" | Scrolled to Location; outline flash; `#location` | P2 |
| TC-SET-003 | 5.4 | Deep link to group | — | Open `/settings#others` | Others in view and highlighted on load | P2 |
| TC-SET-004 | 5.4 | Legacy and unknown hash | Nothing pinned/recent | `#pinned`, then `#zzz` | Both show all groups with Finance highlighted | P3 |
| TC-SET-005 | AC-SET-003 | Scroll-spy at bottom | Large screen | Scroll to the very bottom | "Others" highlighted; groups light up one by one on the way | P3 |
| TC-SET-006 | BR-SET-002 | Synonym match | — | "town" | City only | P2 |
| TC-SET-007 | BR-SET-001 | Multi-word all-match | — | "bank account" | Bank master and House bank master | P2 |
| TC-SET-008 | BR-SET-003 | Ranking | — | "role" | "Role" first, "Roles & Access" next, then masters matching only through other text | P3 |
| TC-SET-009 | BR-SET-004 | Case/space handling | — | "  CITY  " | Same results as "city" | P3 |
| TC-SET-010 | 5.2 | Arrow keys, one column | ≤6 results | "location" (3 results), press ↑ on first | Highlight wraps to last | P3 |
| TC-SET-011 | 5.2 | Arrow keys, two columns | >6 results, width ≥640 px | "a" | ↓ moves by row and stops at the end; ← → move within a row | P3 |
| TC-SET-012 | AC-SET-006 | No matches | — | "xyz" | Empty state; Enter does nothing; "Clear filter" empties box and refocuses it | P2 |
| TC-SET-013 | AC-SET-007 | "/" focus | Focus on page body | Press "/" | Filter focused; "/" not typed | P3 |
| TC-SET-014 | 5.2 | Esc clears | Filter has text | Esc | Filter empty, previous view restored | P3 |
| TC-SET-015 | AC-SET-008 | Pin persists | — | Pin City, reload | City still pinned; pin tip gone | P2 |
| TC-SET-016 | BR-SET-005 | Recent limit | Open 8 different masters | — | Quick access shows 6 newest (pinned excluded) | P3 |
| TC-SET-017 | 5.3 | Pinned excluded from recent | City pinned and recently opened | — | City appears only under Pinned | P3 |
| TC-SET-018 | 5.3 | Empty Quick access fallback | Viewing Quick access with one pin, no history | Unpin it | View returns to all groups; Quick access entry disappears | P3 |
| TC-SET-019 | AC-SET-010 | Each placeholder | — | bank-master, house-bank-master, alert-message-templates | "<Master> is on the way" + group-named back button | P2 |
| TC-SET-020 | AC-SET-011 | Unknown slug | — | `/settings/foo-bar` | Not-found card; breadcrumb "Settings › Foo bar" | P3 |
| TC-SET-021 | 5.5 | Built master opens | — | Each of the 15 built masters | Correct page and breadcrumb "Settings › <Master>" | P1 |
| TC-SET-022 | 5.1 | Phone layout | 375 px width | — | Groups in a sideways row; chosen group scrolled into view; no sideways page scroll | P2 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-SET-001 | No-match empty state | The suggestion text names "fee", "trainer" and "assessment", but none of these words match any master today. | Users following the hint get another "No matches". | Update the suggested words or add matching synonyms/masters. | Open |
| OQ-SET-002 | Banks / Alert messages | Bank master, House bank master and Alert message templates are placeholders; their fields and rules are undefined. | Billing and automatic messages depend on them. | Provide requirements for these three masters. | Open |
| OQ-SET-003 | Pins and history | Pins and recent history are stored per browser, not per user account. | Training Partner users switching devices lose them; shared computers mix users. | Confirm whether they should follow the user account. | Open |
| OQ-SET-004 | Global search | Resolved 2026-11-02: masters are searchable (name, description, group and search keywords) and open the master | — | — | Resolved |
| OQ-SET-005 | Access control | Roles & Access permissions (including for "/settings") are not enforced (SH-002). | Any Training Partner user can change finance masters. | Confirm who may view/edit each master. | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Page/feature inventory incl. all 18 masters and their status: Complete
- [x] User roles and access: Complete (no role enforcement, SH-002)
- [x] Page behaviour (layout, scroll-spy, filter, keyboard, pins, recent, hash links, placeholders): Complete
- [x] Workflows: Complete
- [x] Field specifications: Complete (filter and pin toggle are the only inputs)
- [x] Minimum and maximum constraints, where known: Complete (recent: 12 stored / 6 shown; two columns above 6 results)
- [x] Validation and business rules: Complete
- [x] Messages and feedback: Complete
- [x] Empty states and edge cases: Complete
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria and QA scenarios: Complete
- [ ] Requirements for not-built masters (Bank master, House bank master, Alert message templates): Incomplete (see OQ-SET-002)
