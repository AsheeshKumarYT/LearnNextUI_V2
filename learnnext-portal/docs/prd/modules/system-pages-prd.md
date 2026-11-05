# System Pages: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | System Pages PRD |
| Module name | System Pages (full-screen error and status pages, and the "System pages" preview gallery) |
| Document ID | PRD-SYS |
| Version | 1.1 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (Not found, Page crash and Offline appear automatically; Server error, Service unavailable and Session expired exist and can be opened by address, but nothing in the application sends the user to them; the gallery and preview mode work) |
| Last updated | 2026-11-05 (v1.1: every system page fits the screen and never scrolls — the illustration shrinks, or steps aside on very short screens; the main button is solid white on the dark background; the "Preview mode" pill and **Back to gallery** link were removed from previews; the account chip shows the avatar in a round chip; logo reads "LearnNext"; behaviour per role (Super Admin) added; "Admin" renamed "Training Partner") |
| Related modules/pages | [Authentication](authentication-prd.md), [App shell and navigation](app-shell-navigation-prd.md), [Dashboard](dashboard-prd.md), [Profile](profile-prd.md), [All Clients](clients-prd.md), [Super Admin portal (PRD-SA)](super-admin-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

System pages are the screens a user of LearnNext Portal sees when something prevents a normal page from showing: the address does not exist, a screen fails while being displayed, the server fails, the service is down for maintenance, the device loses its connection, or the sign-in session has ended.

Their objective is to:

- replace a blank or broken screen with a calm, branded explanation of what happened, always fitting the screen without scrolling;
- reassure the user that their work is safe where that is true;
- always offer at least one clear way forward (reload, try again, go back, return to the Dashboard, sign in again);
- recover automatically where possible (Offline returns to the page once the connection is back; Page crash clears as soon as the user moves to another address).

The module also includes a development aid, the **System pages** gallery in the Training Partner sidebar's "Dev only" section, which shows every system page as a live miniature and opens each one in a safe preview mode, so that designers, developers and QA can review them without causing the real condition.

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Common system-page frame | One consistent full-screen layout for every system page | Signed-in user or visitor | Logo (go home), account chip (My Profile) or **Sign in** | All system pages |
| Not found (404) | Explain that an address does not exist | Signed-in user or visitor | **Back to dashboard** / **Go to sign in**, **Go back**, popular destinations | [Dashboard](dashboard-prd.md), [Authentication](authentication-prd.md) |
| Page crash | Replace a screen that failed while being displayed | Signed-in user or visitor | **Reload page**, **Back to dashboard**, **Technical details**, copy details | Any page |
| Server error (500) | Explain a server failure | Signed-in user | **Try again**, **Back to dashboard**, **Contact support** | [Dashboard](dashboard-prd.md) |
| Service unavailable (503, maintenance) | Explain planned maintenance or a temporary outage | Signed-in user | **Check again** | — |
| Offline | Cover the application while the device has no connection; confirm when it returns | Signed-in user or visitor | **Try again**, **Continue** | Any page |
| Session expired | Ask the user to sign in again after the session ends | Signed-in user | **Sign in again** | [Authentication](authentication-prd.md) |
| System pages gallery (Dev only) | Show all six system pages as live miniatures | Training Partner (developers, designers, QA) | Open a page preview in a new tab | [App shell and navigation](app-shell-navigation-prd.md) |
| Preview mode | Show a real system page without its real consequences | Training Partner (developers, designers, QA) | Safe simulated actions; close the tab to return | System pages gallery |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Training Partner | Every system page, the gallery and every preview | Every action in this PRD | None (SH-002). The gallery is shown to every Training Partner in every build (OQ-SHELL-010) |
| Super Admin | Not found, Page crash, Server error, Service unavailable, Offline and Session expired | Same actions; **Back to dashboard**, the logo and the Dashboard / All Clients / Projects destinations all end at Manage Clients (BR-SYS-020) | The gallery and every preview address redirect to Manage Clients (BR-AUTH-021) |
| Signed in, no role chosen yet | The same six system pages | Links into the application end at the role picker | The gallery and previews redirect to the role picker |
| Visitor (not signed in) | Not found, Page crash, Server error, Service unavailable, Offline and Session expired | Same actions; links that lead into the application end at **Sign in** (SH-003) | The gallery and every preview address redirect to **Sign in** |
| Facilitator, Participant, Client SPOC | The same six system pages | Links into the application end at the coming-soon screen | Their portals are not built (SH-002) |

## 5. Page Functionality and Behavior

### 5.1 Common system-page frame

Every system page in 5.2 to 5.7 uses this frame. It is shown full screen, outside the portal shell: there is no sidebar, header breadcrumb, search or shell footer.

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Fit to the screen (v1.1) | Never make the user scroll an error page | View on any screen size | The page is exactly the height of the screen and never scrolls: top bar at the top, footer at the bottom, the content centred between them. When the room is short (small phones, landscape, the crash page's **Technical details** opened) the illustration shrinks to fit, from its top centre; if even a very small illustration would not fit, it steps aside (hidden) so the text and buttons always fit. The layout re-fits when the window is resized or the content changes; on short screens the spacing also tightens | BR-SYS-018 | Whole page visible without scrolling |
| Background | Calm, branded backdrop | View | Deep navy background with one soft coloured glow and a few still stars. Glow colour per page: Not found and Server error violet, Page crash rose, Service unavailable amber, Offline teal, Session expired indigo | Always dark, whatever theme the user chose (BR-SYS-002) | — |
| Logo | Brand and a way home | Click | White LearnNext logo (wordmark "LearnNext", no subtitle). Opens the role's home when signed in (Dashboard for a Training Partner, Manage Clients for a Super Admin, the role picker if no role is chosen yet) and **Sign in** when signed out | BR-SYS-003, BR-SYS-020 | Home page opens |
| Account chip | Show who is signed in | Click | A round, frosted chip with the user's avatar (photo, or initials) and their name. On phones only the avatar shows, centred in an even ring. Opens **My Profile** | Signed in only. Hidden on Session expired (BR-SYS-004) | My Profile opens |
| **Sign in** button | Let a signed-out visitor sign in | Click | Opens the Sign in page | Signed out only. Hidden on Session expired | Sign in opens |
| Illustration | Visual cue for the problem | View | A large illustration per page (see each page). Decorative: hidden from screen readers; numerals such as "404" are read out as the number | Animations stop for users who prefer reduced motion. Shrinks or hides to fit (see "Fit to the screen") | — |
| Eyebrow | Short category label | View | Small upper-case label above the title (for example "UNEXPECTED ERROR"). Not on Not found | — | — |
| Title and description | Explain what happened | View | Large title and one or two sentences, centred | Quoted per page below | — |
| Actions | Offer a way forward | Click | One or two large buttons per page. The main button is solid white with dark navy text; a second button is a quiet outlined button with white text | Quoted per page below (BR-SYS-019) | — |
| Extra panel | Supporting detail | View | Per page: address, popular destinations, technical details, reference, maintenance progress, tips, or "Last signed in as" | — | — |
| Footer | Ownership | View | "© <current year> LearnNext" | Year follows the device clock | — |
| Browser tab title | Identify the tab | — | "<Page name> · LearnNext" (names per page below) | BR-SYS-005 | — |
| Entrance | Gentle appearance | Open the page | Elements fade and rise in, one after another | — | — |

### 5.2 Not found (404)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| When it appears | Catch every unknown address | Open an address the application does not recognise | Shown for any address that matches no page, whether signed in or out, for example "/notifications" or "/preview/unknown" | BR-SYS-006. Addresses that look like a record (for example a client, program, facilitator or Settings master) open that module's page instead; see the module PRDs. "/" opens the Dashboard (Sign in when signed out) | Not found page |
| Illustration | Show "404" | View | "4", a ringed planet in place of the "0", and "4"; a small astronaut drifts beside the numerals | Astronaut hidden on phones | — |
| Text | Explain | View | Title "Lost in space"; description "The page you’re looking for drifted off the map — it may have moved, or the link is mistyped." | No eyebrow | — |
| **Back to dashboard** | Return to the application | Click | Opens the Dashboard (Super Admin: Manage Clients, BR-SYS-020) | Signed in only | Dashboard |
| **Go to sign in** | Lead a visitor to sign in | Click | Opens Sign in | Signed out only (replaces **Back to dashboard**) | Sign in |
| **Go back** | Return to the previous page | Click | Goes back one step in the browser history | Shown only when the browser tab has a previous page in its history (BR-SYS-007). Hidden in a freshly opened tab | Previous page |
| Requested address | Show what was mistyped | View | The address that was opened (path only) in a small rounded chip; very long addresses are cut off with "…" | Always | — |
| Popular destinations | Quick ways back in | Click a link | Links **Dashboard**, **All Clients**, **Projects** and **My Profile**, each with its icon; an arrow appears on hover | Signed in only. **Projects** opens the "Nothing here yet" placeholder ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)). The same four links show for every role; for a Super Admin, Dashboard, All Clients and Projects all open Manage Clients (OQ-SYS-011) | Chosen page opens |
| Tab title | — | — | "Page not found · LearnNext" | — | — |

### 5.3 Page crash

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| When it appears | Replace a blank or broken screen | Any page fails while it is being displayed (including when part of the page cannot be downloaded) | The whole screen, including the portal shell, is replaced by the crash page | BR-SYS-008. Applies to every page: portal pages, auth pages and other system pages. Failures inside button actions or background loads are handled by each module, not by this page | Crash page |
| Illustration | Show a broken screen | View | A tilted glass browser window with a crack through it, gently floating | — | — |
| Text | Explain and reassure | View | Eyebrow "Unexpected error"; title "This page crashed"; description "Something went wrong while showing this screen. Your data is safe — reloading usually fixes it." | "Your data is safe" is a fixed statement (OQ-SYS-006) | — |
| **Reload page** | Retry | Click | Reloads the current address in the browser | With demo data, a reload restores the original demo records (SH-001) | Page loads again |
| **Back to dashboard** | Leave the broken page | Click | Opens the Dashboard; the crash page clears | Signed out: ends at Sign in (SH-003) | Dashboard |
| Automatic recovery | Recover without reloading | Move to any other address (browser Back, logo, account chip, buttons) | The crash page disappears and the new page is shown | BR-SYS-009 | New page |
| **Technical details** | Help support diagnose the problem | Click | Expands or collapses a panel showing the error's name and message and up to three lines of where it happened. A chevron rotates | Collapsed by default. Long details scroll inside the panel (a shorter panel on short screens); opening it may shrink or hide the illustration so the page still fits (BR-SYS-018) | Details shown / hidden |
| Copy details | Share the details | Click the copy icon (label "Copy error details") | Copies the details to the clipboard; the icon turns into a green tick and the label becomes "Copied" for about 1.5 seconds | If the browser blocks the clipboard, nothing happens and no message is shown (OQ-SYS-007) | Details copied |
| Reporting | Inform the team | — | The error is written to the browser's developer console only. It is not sent to any reporting service | OQ-SYS-006 | — |
| Tab title | — | — | "Something went wrong · LearnNext" | — | — |

### 5.4 Server error (500)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| When it appears [Partially Implemented] | Explain a server failure | Open the "/error" address | The page exists at its own address and works signed in or out. Nothing in the application currently sends the user there: no failed request opens it | BR-SYS-010 (OQ-SYS-001). The gallery's "API returns 500" describes the intended trigger, not current behaviour | Server error page |
| Illustration | Show "500" | View | "5", a ringed planet and a blue cratered moon in place of the two zeros | — | — |
| Text | Explain | View | Eyebrow "Error 500 · Internal server error"; title "Our servers hit turbulence"; description "Something went wrong on our side. We’ve been notified and are already on it — please try again in a moment." | "We’ve been notified" is not backed by any notification (OQ-SYS-006) | — |
| **Try again** | Retry | Click | Reloads the current address. Because the page has its own address, this shows the Server error page again rather than the page that failed | [Partially Implemented] (OQ-SYS-002) | Same page |
| **Back to dashboard** | Leave | Click | Opens the Dashboard | Signed out: ends at Sign in | Dashboard |
| Reference | Identify the incident | View | "Reference REF-XXXXXX": "REF-" followed by six random upper-case letters and digits, new every time the page opens | Not linked to any real request (OQ-SYS-003) | — |
| **Contact support** | Get help | Click | Opens the device's email app with a new message to support@learnnext.io, subject "Server error REF-XXXXXX" (the same reference) | Requires an email app on the device | Draft email |
| Tab title | — | — | "Server error · LearnNext" | — | — |

### 5.5 Service unavailable (503, maintenance)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| When it appears [Partially Implemented] | Explain maintenance or an outage | Open the "/maintenance" address | The page exists at its own address and works signed in or out. Nothing in the application currently sends the user there | BR-SYS-010 (OQ-SYS-001) | Maintenance page |
| Illustration | Show "503" | View | "5", a slowly turning gear in place of the "0", and "3" | — | — |
| Text | Explain and reassure | View | Eyebrow "Error 503 · Service unavailable"; title "We’ll be right back"; description "LearnNext is getting a quick upgrade. Everything will be back shortly — no work is lost." | — | — |
| **Check again** | Retry | Click | Reloads the current address, which shows the maintenance page again | [Partially Implemented] (OQ-SYS-002) | Same page |
| Maintenance panel | Show progress | View | Wrench icon with "Systems updating", "Back in about 15 minutes" and a moving progress bar (labelled "Maintenance in progress" for screen readers) | The time is fixed text and the bar does not reflect real progress (OQ-SYS-004) | — |
| Leaving the page | — | — | There is no **Back to dashboard** button; the logo and account chip in the top bar still lead into the application | OQ-SYS-004 | — |
| Tab title | — | — | "Down for maintenance · LearnNext" | — | — |

### 5.6 Offline

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| When it appears | Explain a lost connection | The device reports that it has gone offline | The Offline page covers the whole screen on top of whatever page is open, signed in or out. The page underneath stays as it was, so nothing typed on it is lost | BR-SYS-011. Relies on the device's own connection status; a connection that is up but has no internet access may not be detected (OQ-SYS-005) | Offline overlay |
| Illustration (offline) | Show no signal | View | Wi-Fi symbol whose bars pulse, crossed by a red slash | — | — |
| Text (offline) | Explain | View | Eyebrow "No internet connection"; title "You’re offline"; description "Check your connection — we’ll reconnect automatically as soon as you’re back online." | Announced to screen readers as an alert | — |
| **Try again** | Retry manually | Click | Reloads the page in the browser | While still offline the browser cannot load the application and shows its own offline message (OQ-SYS-005) | Page reloads |
| Tips | Help the user reconnect | View | Three small chips: "Check your Wi-Fi", "Turn off airplane mode", "Try another network" | Offline state only | — |
| Back online (automatic) | Confirm the connection returned | — | When the connection returns, the overlay switches to: green Wi-Fi symbol, eyebrow "Connection restored", title "You’re back online", description "Your connection is back. Pick up right where you left off." It closes by itself after about 1.8 seconds | BR-SYS-012 | Page underneath shown again |
| **Continue** | Close the back-online message at once | Click | Closes the overlay immediately | Back-online state only | Page underneath shown |
| Tab title | — | — | "You’re offline · LearnNext", then "Back online · LearnNext". When the overlay closes, the page's own title is restored | — | — |
| Top-bar links while offline | — | Click the logo or account chip | The address changes behind the overlay, but the overlay stays until the connection returns | Pages not yet downloaded may fail to open and show the Page crash page (11) | — |

### 5.7 Session expired

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| When it appears [Partially Implemented] | Ask the user to sign in again | Open the "/session-expired" address | The page exists at its own address and works signed in or out. Nothing in the application sends the user there: there is no inactivity timeout or session expiry (SH-003, OQ-AUTH-002) | BR-SYS-010 (OQ-SYS-001) | Session expired page |
| Illustration | Show "asleep" | View | A smiling crescent moon, eyes closed, with floating "z"s | — | — |
| Text | Explain | View | Eyebrow "Session expired"; title "Your session took a nap"; description "For your security, we signed you out after a period of inactivity. Sign in again to pick up where you left off." | The user is in fact still signed in until they click **Sign in again** (BR-SYS-013, OQ-SYS-008) | — |
| Top bar | — | View | Logo only: the account chip and **Sign in** button are hidden | BR-SYS-004. The logo still opens the Dashboard while the session exists (OQ-SYS-008) | — |
| "Last signed in as" | Confirm whose session ended | View | A chip with the user's avatar, "Last signed in as" and the user's name | Shown only while a signed-in user is still remembered | — |
| **Sign in again** | Restart the session | Click | Signs the user out (the remembered session is cleared) and opens Sign in, replacing this page in the browser history. No toast is shown | BR-SYS-013. Unlike **Log out** in the user menu, there is no confirmation and no "You have been signed out" toast ([authentication-prd.md](authentication-prd.md)). After signing in (and choosing a role, for logins with several roles), the user lands on the role's home — Dashboard or Manage Clients — not on the page they were using (OQ-SYS-008) | Sign in page |
| Tab title | — | — | "Session expired · LearnNext" | — | — |

### 5.8 System pages gallery (Dev only)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Opening the gallery | Review all system pages in one place | Click **System pages** under "Dev only" in the sidebar, or choose it in the search palette | Opens inside the Training Partner shell. Breadcrumb "System pages"; tab title "System pages · LearnNext" | Training Partner only (SH-003; a Super Admin is sent to Manage Clients). Shown to every Training Partner (OQ-SHELL-010). Not offered in the phone "More" sheet | Gallery shown |
| Layout | Show every page side by side | View | Six cards: one column on phones, two from small-tablet width, three on extra-wide screens. Cards rise in one after another. No title block, toolbar or other content | — | — |
| Card order and content | Describe each page | View | 1 "Page not found" — "A link is broken or the page doesn’t exist." — "Any unknown address". 2 "Page crash" — "A screen fails while loading — instead of a blank page." — "Automatic (error boundary)". 3 "Server error" — "The server failed to complete a request." — "API returns 500". 4 "Maintenance" — "Planned maintenance or the service is temporarily down." — "API returns 503". 5 "No internet" — "The device loses its connection." — "Automatic overlay". 6 "Session expired" — "The sign-in session ran out after inactivity." — "API returns 401" | The third line (with a lightning icon) states the intended trigger; for Server error, Maintenance and Session expired that trigger is not implemented (OQ-SYS-001) | — |
| Window frame | Make each card read as a browser window | View | Three coloured dots and an address bar showing the preview address (for example "/preview/404") | — | — |
| Live mini-screen | Show the real page | View | The actual page in preview mode, running live and shrunk from a desktop-sized (1280 × 800) screen to the card width | Not clickable or focusable on its own; loads when it scrolls into view. Server error shows a different reference each time it loads | — |
| Card link | Open the page in full | Click anywhere on the card, or Tab to it and press Enter | Opens the page's preview (5.9) in a new browser tab. The card's title, icon and an "open externally" icon highlight on hover; keyboard focus shows a ring around the whole card | Screen readers announce "<title> — opens in a new tab" | Preview opens in a new tab |

### 5.9 Preview mode

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Preview addresses | Open a system page safely | Click a gallery card or open the address | "/preview/404", "/preview/crash", "/preview/500", "/preview/503", "/preview/offline", "/preview/session-expired" show the real page, full screen | Training Partner only; signed out redirects to Sign in, a Super Admin to Manage Clients. Any other "/preview/…" address shows Not found | Page shown in preview mode |
| No preview marker (v1.1) | Show the page exactly as users see it | View | The preview looks identical to the real page: there is no "Preview mode" pill and no **Back to gallery** link any more. Only the safe actions below differ | BR-SYS-014 (OQ-SYS-012) | — |
| Returning to the gallery | Go back | Close the browser tab | The gallery is still open in the original tab (previews always open in a new tab) | — | Gallery |
| Thumbnail view | Miniature in the gallery | — | The gallery's mini-screens load the preview address with "?thumb" added; it shows the same page as the full preview | — | — |
| Not found preview | — | — | Shows the address "/preview/404". Because previews open in a new tab, **Go back** is normally hidden. **Back to dashboard** and the popular destinations really navigate | Actions are real (BR-SYS-015) | — |
| Page crash preview | — | — | Shows a fixed sample error in **Technical details** ("TypeError: Cannot read properties of undefined (reading 'map')" and one location line). **Reload page** reloads the preview | Actions are real | — |
| Server error preview | — | — | **Try again** reloads the preview (new reference); **Contact support** opens a real email draft | Actions are real | — |
| Maintenance preview | — | — | **Check again** reloads the preview | Actions are real | — |
| Offline preview | Show both states without losing the connection | Click **Simulate reconnect**, then **Go offline again** | Always starts in the offline state, whatever the real connection. An extra **Simulate reconnect** button switches to the back-online state; there **Go offline again** (instead of **Continue**) switches back. The back-online state does not close by itself. **Try again** reloads the preview | Safe action (BR-SYS-015). If the device really goes offline, the real offline overlay appears on top | — |
| Session expired preview | Show the page without signing out | Click **Sign in again** | Does not sign out. Shows an info toast "Preview only" with "In real use this signs you out and opens the sign-in page." (SH-005). "Last signed in as <name>" shows the current user | Safe action (BR-SYS-015) | User stays signed in |

## 6. User Workflow

### 6.1 Recover from an unknown address

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Opens a mistyped or outdated address | Shows Not found with the address in a chip | BR-SYS-006 | Not found page |
| 2a | (Signed in) Clicks **Back to dashboard** or a popular destination | Opens the chosen page | — | Back in the application |
| 2b | (Signed out) Clicks **Go to sign in** or **Sign in** | Opens Sign in | — | Sign in page |
| 2c | Clicks **Go back** | Returns to the previous page in the tab | Only when there is history (BR-SYS-007) | Previous page |

### 6.2 Recover from a page crash

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Opens or uses a page that fails while being displayed | Replaces the whole screen with "This page crashed" | BR-SYS-008 | Crash page |
| 2 | (Optional) Clicks **Technical details**, then the copy icon | Shows the details; copies them; the icon shows a tick for about 1.5 s | — | Details on the clipboard |
| 3a | Clicks **Reload page** | Reloads the address | — | Page shown if the problem was temporary |
| 3b | Clicks **Back to dashboard** or uses browser Back | Opens the other page; the crash page clears | BR-SYS-009 | Dashboard / previous page |

### 6.3 Lose and regain the connection

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Device goes offline while the user works | Covers the screen with "You’re offline"; tab title changes | BR-SYS-011 | Offline overlay; page kept underneath |
| 2 | Reconnects the device | Overlay switches to "You’re back online" | BR-SYS-012 | Back-online state |
| 3 | Waits about 1.8 s, or clicks **Continue** | Overlay closes; the page and its title return unchanged | — | User continues where they left off |

### 6.4 Sign in again after a session ends

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Arrives at Session expired (today only by opening "/session-expired") | Shows "Your session took a nap" and "Last signed in as <name>" | BR-SYS-010 | Session expired page |
| 2 | Clicks **Sign in again** | Clears the session and opens Sign in | BR-SYS-013 | Sign in page |
| 3 | Signs in (and chooses a role, if asked) | See [authentication-prd.md](authentication-prd.md) | — | The role's home (Dashboard / Manage Clients) |

### 6.5 Review system pages in the gallery

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Clicks **System pages** under "Dev only" | Opens the gallery with six live mini-screens | Signed in | Gallery |
| 2 | Clicks a card | Opens the page's preview in a new tab, looking exactly like the real page | BR-SYS-014 | Preview |
| 3 | Uses the page's actions | Offline and Session expired simulate safely; other actions are real | BR-SYS-015 | — |
| 4 | Closes the preview tab | The gallery is still open in the first tab | — | Gallery |

## 7. Forms and Field-Level Specifications

Not applicable — system pages and the gallery contain no form fields or data entry. The only interactive controls are buttons and links (described in section 5) and the **Technical details** expand/collapse toggle on Page crash, which has no value to validate.

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-SYS-001 | Full screen, outside the shell | System pages replace the whole screen; the portal shell is not shown | All system pages | No sidebar, header or shell footer | — | — |
| BR-SYS-002 | Always dark | System pages use their own dark navy look in every theme | All system pages | Light, Dark and System themes look the same here (differs from SH-010) | — | — |
| BR-SYS-003 | Home depends on sign-in | The logo, and the Not found main button, lead to the Dashboard when signed in (for other roles see BR-SYS-020) and to Sign in when signed out | All system pages | — | — | **Back to dashboard** / **Go to sign in** |
| BR-SYS-004 | Account in the top bar | Signed in: avatar and name linking to My Profile; signed out: **Sign in**. Session expired shows neither | All system pages | — | — | — |
| BR-SYS-005 | Tab titles | "Page not found", "Something went wrong", "Server error", "Down for maintenance", "You’re offline" / "Back online", "Session expired", each followed by " · LearnNext" | All system pages | — | — | — |
| BR-SYS-006 | Catch-all | Any address that matches no page shows Not found, signed in or out | Unknown addresses | — | — | "Lost in space" |
| BR-SYS-007 | Go back only with history | **Go back** appears only when the browser tab has a previous entry | Not found | — | Freshly opened tab | Button hidden |
| BR-SYS-008 | Crash catch | Any page that fails while being displayed is replaced by the crash page instead of a blank screen | Every page | — | — | "This page crashed" |
| BR-SYS-009 | Crash recovery on navigation | Moving to a different address clears the crash page | After a crash | New page shown | Staying on the same address | Crash page remains until reload |
| BR-SYS-010 | Server error, maintenance and session expired triggers [Not Implemented] | These pages are meant to open when a request fails with a server error, a maintenance response or an expired sign-in. No such handling exists; they open only by typing their address | — | — | — | — |
| BR-SYS-011 | Offline overlay | While the device reports no connection, the Offline page covers the screen; the page underneath is kept | Every page, signed in or out | — | — | "You’re offline" |
| BR-SYS-012 | Back online | When the connection returns, "You’re back online" shows for about 1.8 seconds, then closes by itself; **Continue** closes it at once | After being offline | Page title restored | — | "You’re back online" |
| BR-SYS-013 | Sign in again | **Sign in again** clears the session and opens Sign in, with no confirmation and no toast | Session expired (not in preview) | — | — | — |
| BR-SYS-014 | No preview marker (changed v1.1) | Preview addresses show the page exactly as in real use, with no "Preview mode" pill or **Back to gallery** link (both removed); users return by closing the tab | Preview mode | — | — | — |
| BR-SYS-015 | Safe actions in preview | In preview mode, Offline simulates the reconnect and Session expired does not sign out. Actions on the other pages (reload, go to Dashboard, go back, email support) behave as in real use | Preview mode | — | — | "Preview only" toast (Session expired) |
| BR-SYS-016 | Previews need sign-in | The gallery and every preview address require a signed-in session in the Training Partner role | Signed out; other roles | Redirect to Sign in (SH-003); Super Admin to Manage Clients; no role yet to the role picker | — | — |
| BR-SYS-017 | Reduced motion | Floating, spinning and pulsing illustrations stop for users who prefer reduced motion | All system pages | — | — | — |
| BR-SYS-018 | Fit to the screen | A system page is exactly one screen high and never scrolls. When space is short the illustration shrinks; when it would have to get very small it is hidden, so the text and buttons always fit | All system pages, every screen size | Re-fits on resize and when content changes (e.g. Technical details opened) | — | — |
| BR-SYS-019 | Main button on dark | The main action on each system page is a solid white button with dark navy text; secondary actions are outlined white-text buttons | All system pages | — | — | — |
| BR-SYS-020 | Home per role | Links into the application (logo, **Back to dashboard**, popular destinations) follow the signed-in role's page limits: a Super Admin is taken to Manage Clients for any page it may not open; a session with no role chosen goes to the role picker; a role not yet built goes to the coming-soon screen ([authentication-prd.md](authentication-prd.md)) | Signed in | — | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Unknown address | Any | Full-screen page | "Lost in space" / "The page you’re looking for drifted off the map — it may have moved, or the link is mistyped." | On opening the address | Dashboard / Sign in / Go back |
| Page fails to display | Any | Full-screen page | "Unexpected error" / "This page crashed" / "Something went wrong while showing this screen. Your data is safe — reloading usually fixes it." | Immediately | Reload, Dashboard |
| Copy technical details | Clipboard allowed | Icon change | Copy icon becomes a tick; label "Copied" | About 1.5 s | — |
| Server error | "/error" opened | Full-screen page | "Error 500 · Internal server error" / "Our servers hit turbulence" / "Something went wrong on our side. We’ve been notified and are already on it — please try again in a moment." | On opening | Try again, Dashboard, Contact support |
| Maintenance | "/maintenance" opened | Full-screen page | "Error 503 · Service unavailable" / "We’ll be right back" / "LearnNext is getting a quick upgrade. Everything will be back shortly — no work is lost." / "Systems updating" / "Back in about 15 minutes" | On opening | Check again |
| Connection lost | Device offline | Full-screen overlay (alert) | "No internet connection" / "You’re offline" / "Check your connection — we’ll reconnect automatically as soon as you’re back online." | As soon as the device reports it | Reconnect |
| Connection restored | After offline | Full-screen overlay | "Connection restored" / "You’re back online" / "Your connection is back. Pick up right where you left off." | For about 1.8 s | **Continue** or wait |
| Session expired | "/session-expired" opened | Full-screen page | "Session expired" / "Your session took a nap" / "For your security, we signed you out after a period of inactivity. Sign in again to pick up where you left off." | On opening | **Sign in again** |
| Sign in again in preview | Preview mode | Info toast (SH-005) | "Preview only" / "In real use this signs you out and opens the sign-in page." | On click | — |
| Sign in again (real) | Not preview | None | — (no toast) | — | Sign in |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| System pages gallery cards | List every system page | Six fixed cards in a fixed order (5.8); each card is a link | No search, filters, sorting or pagination | Never empty |
| Not found popular destinations | Quick links | Four fixed links: Dashboard, All Clients, Projects, My Profile | Signed in only | Hidden when signed out |
| Offline tips | Self-help | Three fixed chips | Offline state only | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| Unknown address while signed out | Visitor opens a non-existent address | Not found with **Go to sign in** and a **Sign in** button; no popular destinations | "Lost in space" | Sign in |
| Unknown preview address | "/preview/anything-else" | Not found (when signed in) | "Lost in space" | Back to dashboard |
| Crash on an auth or system page | Sign in or a system page fails while displayed | Crash page replaces it | "This page crashed" | Reload page |
| Crash while signed out | — | **Back to dashboard** leads to Sign in | — | Sign in |
| Page part cannot be downloaded | For example after a new release or on a weak connection | Crash page | "This page crashed" | Reload page |
| Clipboard blocked | Browser refuses copy | Nothing happens; no message | — | Select the text manually (OQ-SYS-007) |
| Offline when opening a page not yet downloaded | User navigates via the overlay's logo or chip while offline | Page cannot load; crash page may replace the overlay | "This page crashed" | Reconnect, then **Reload page** |
| Try again while still offline | Click **Try again** on Offline | Browser shows its own offline message instead of the application | Browser's own wording | Reconnect and reload (OQ-SYS-005) |
| Connected network without internet | Wi-Fi up but no internet | Offline page may not appear; pages may fail to load | — | OQ-SYS-005 |
| Try again on Server error / Check again on Maintenance | Click | The same page reloads, because it has its own address | Same page | **Back to dashboard** / logo (OQ-SYS-002) |
| Session expired opened while signed in | Typing "/session-expired" | Page says the user was signed out, but the session is still active; the logo leads to the Dashboard without signing in | "Your session took a nap" | **Sign in again** (OQ-SYS-008) |
| Session expired opened while signed out | — | No "Last signed in as" chip; **Sign in again** opens Sign in | — | Sign in |
| Server error and Maintenance while signed out | Opening the addresses | Pages show; **Back to dashboard** and the logo lead to Sign in | — | Sign in |
| Gallery thumbnails | Opening the gallery | Each card loads a full copy of the application in miniature, which may take a moment; Server error shows a new reference each time | — | — |
| Reduced motion | Device setting | Illustrations stay still | — | — |
| Phones | Narrow screens | Numerals shrink; the astronaut and the account name are hidden (the account chip shows only the avatar); buttons wrap; the page still fits without scrolling | — | — |
| Short screens | Small phones, landscape, or Technical details opened | The illustration shrinks to fit, or is hidden when it would be tiny; spacing tightens; nothing scrolls | — | — |
| Super Admin on a system page | Signed in as Super Admin | **Back to dashboard**, the logo and the Dashboard / All Clients / Projects links all open Manage Clients; My Profile works | Same texts as for a Training Partner | OQ-SYS-011 |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| [Authentication](authentication-prd.md) | Session expired's **Sign in again** clears the session and opens Sign in; Not found, Server error, Maintenance, Offline and Session expired are available while signed out; the gallery and previews require sign-in | **Sign in again**; signed-out access | Session cleared; Sign in shown | SH-003, BR-SYS-013, BR-SYS-016, OQ-AUTH-002 |
| [App shell and navigation](app-shell-navigation-prd.md) | "Dev only" **System pages** item and the search palette open the gallery (Training Partner shell only); unknown addresses (for example a notifications page) show Not found; page crashes and the offline overlay replace or cover the shell | Menu click; unknown address | Gallery / Not found / Crash / Offline | BR-SHELL-017, BR-SHELL-021, OQ-SHELL-010 |
| [Super Admin portal (PRD-SA)](super-admin-prd.md) | System pages appear for a Super Admin too; their links into the application end at Manage Clients; the gallery is not available | Any system page while in Super Admin | Manage Clients opens | BR-SYS-020, BR-AUTH-021 |
| [Dashboard](dashboard-prd.md) | Default destination of **Back to dashboard** and the logo when signed in | Click | Dashboard opens | BR-SYS-003 |
| [Profile](profile-prd.md) | Account chip and the "My Profile" destination; name and photo shown come from the profile | Click chip | My Profile opens | BR-SYS-004 |
| [All Clients](clients-prd.md) | Popular destination on Not found | Click **All Clients** | All Clients opens | — |
| Projects (placeholder) | Popular destination on Not found leads to a page that is not built | Click **Projects** | "Nothing here yet" | BR-SHELL-002 |
| Every module | Any page can be replaced by Page crash or covered by Offline | Display failure; connection loss | Crash page / overlay | BR-SYS-008, BR-SYS-011 |
| [Shared requirements](../shared-requirements.md) | Toast for the Session expired preview; sign-in rule; theme exception | — | — | SH-003, SH-005, SH-009, SH-010 |

## 13. Acceptance Criteria

**AC-SYS-001: Not found while signed in**
- Given I am signed in
- When I open "/does-not-exist"
- Then I see "Lost in space", the address "/does-not-exist", **Back to dashboard** and the links Dashboard, All Clients, Projects and My Profile
- And the tab title is "Page not found · LearnNext"

**AC-SYS-002: Not found while signed out**
- Given I am signed out
- When I open "/does-not-exist"
- Then I see **Go to sign in** and a **Sign in** button in the top bar, and no popular destinations

**AC-SYS-003: Go back**
- Given I opened the Dashboard and then a mistyped address in the same tab
- When I click **Go back**
- Then the Dashboard opens
- And in a freshly opened tab **Go back** is not shown

**AC-SYS-004: Page crash and recovery**
- Given a page fails while being displayed
- Then the whole screen shows "This page crashed" with **Reload page** and **Back to dashboard**
- When I click **Technical details**
- Then the error details are shown and can be copied, and the copy icon shows a tick briefly
- When I click **Back to dashboard**
- Then the Dashboard opens normally

**AC-SYS-005: Server error page**
- Given I open "/error"
- Then I see "Error 500 · Internal server error", "Our servers hit turbulence", a reference "REF-" with six characters, and **Contact support**
- When I click **Contact support**
- Then an email draft to support@learnnext.io opens with the subject "Server error <reference>"

**AC-SYS-006: Maintenance page**
- Given I open "/maintenance"
- Then I see "We’ll be right back", "Systems updating", "Back in about 15 minutes", a moving progress bar and **Check again**

**AC-SYS-007: Offline and back online**
- Given I am on any page
- When the device goes offline
- Then "You’re offline" covers the screen with **Try again** and three tips, and the tab title is "You’re offline · LearnNext"
- When the connection returns
- Then "You’re back online" shows and closes by itself after about 2 seconds, leaving the page and its title as they were

**AC-SYS-008: Session expired**
- Given I am signed in and open "/session-expired"
- Then I see "Your session took a nap" and "Last signed in as <my name>", and no account chip in the top bar
- When I click **Sign in again**
- Then I am signed out and the Sign in page opens

**AC-SYS-009: Gallery**
- Given I am signed in
- When I click **System pages** under "Dev only"
- Then six cards show live miniatures of Page not found, Page crash, Server error, Maintenance, No internet and Session expired, each with its address, when it appears and its trigger
- When I click a card
- Then its preview opens in a new tab, looking exactly like the real page (no "Preview mode" pill)

**AC-SYS-010: Safe preview actions**
- Given I opened the Session expired preview
- When I click **Sign in again**
- Then the toast "Preview only" appears and I stay signed in
- Given I opened the No internet preview
- When I click **Simulate reconnect** and then **Go offline again**
- Then the page switches to "You’re back online" and back to "You’re offline" without closing

**AC-SYS-011: Fits the screen**
- Given any system page on a 375 × 667 phone, a 1280 × 600 window or a landscape phone
- Then the whole page — top bar, illustration (possibly smaller or hidden), text, buttons and footer — is visible and the page cannot be scrolled
- When I open **Technical details** on Page crash on a short screen
- Then the illustration shrinks or disappears so the details and buttons still fit

**AC-SYS-012: Buttons and account chip**
- Given I am signed in and open "/error"
- Then **Try again** is a solid white button with dark text and **Back to dashboard** an outlined button
- And the top-right chip shows my avatar and name, or only the avatar on a phone

**AC-SYS-013: Super Admin on a system page**
- Given I am signed in as Super Admin and open "/does-not-exist"
- When I click **Back to dashboard**
- Then Manage Clients opens
- And opening "/ui-preview" or "/preview/404" also opens Manage Clients

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-SYS-001 | AC-SYS-001 | Not found signed in | Signed in | /does-not-exist | Title, address chip, **Back to dashboard**, 4 destinations, tab title | P1 |
| TC-SYS-002 | AC-SYS-002 | Not found signed out | Signed out | /does-not-exist | **Go to sign in**, **Sign in**, no destinations | P1 |
| TC-SYS-003 | AC-SYS-003 | Go back visibility | New tab vs tab with history | /x | Hidden in new tab; shown and working with history | P2 |
| TC-SYS-004 | BR-SYS-006 | Root and record-like addresses | Signed in | /, /notifications, /preview/abc | Dashboard; Not found; Not found | P2 |
| TC-SYS-005 | AC-SYS-004 | Crash page and details | Crash simulated (or /preview/crash) | — | Crash page; details expand/collapse; copy shows tick ~1.5 s | P1 |
| TC-SYS-006 | BR-SYS-009 | Crash recovery | Crash page shown | Browser Back or **Back to dashboard** | Crash clears, page shown | P1 |
| TC-SYS-007 | AC-SYS-005 | Server error page | Any | /error | Texts, reference format REF-XXXXXX, email subject | P2 |
| TC-SYS-008 | BR-SYS-010 | No automatic trigger (known gap) | Signed in | Use the application normally | /error, /maintenance, /session-expired never open on their own | P2 |
| TC-SYS-009 | OQ-SYS-002 | Try again / Check again | On /error, /maintenance | Click | Same page reloads | P3 |
| TC-SYS-010 | AC-SYS-006 | Maintenance page | Any | /maintenance | Texts, progress bar, no Dashboard button | P2 |
| TC-SYS-011 | AC-SYS-007 | Offline overlay | Add client with typed data | Turn network off, then on | Overlay; back-online ~1.8 s; typed data still present; title restored | P1 |
| TC-SYS-012 | BR-SYS-012 | Continue | Back-online state shown | Click **Continue** | Overlay closes at once | P3 |
| TC-SYS-013 | BR-SYS-011 | Offline on auth page | Signed out on Sign in | Network off | Overlay covers Sign in | P3 |
| TC-SYS-014 | AC-SYS-008 | Sign in again | Signed in | /session-expired, click | Signed out, Sign in shown, no toast; Back does not return to the page | P1 |
| TC-SYS-015 | BR-SYS-004 | Top bar per state | Signed in / out | /error | Avatar + name (name hidden on phone) / **Sign in**; logo to Dashboard / Sign in | P3 |
| TC-SYS-016 | BR-SYS-002 | Theme independence | Light theme | /error | Dark page | P3 |
| TC-SYS-017 | AC-SYS-009 | Gallery content | Signed in | /ui-preview | Six cards, correct texts, breadcrumb "System pages", tab "System pages · LearnNext" | P2 |
| TC-SYS-018 | AC-SYS-009 | Card opens new tab | Gallery | Click and keyboard Enter | New tab at /preview/<key>, no pill or Back to gallery | P2 |
| TC-SYS-019 | BR-SYS-014 | Thumb same as preview | Signed in | /preview/404?thumb and /preview/404 | Same page, no pill on either | P3 |
| TC-SYS-020 | AC-SYS-010 | Session expired preview | Signed in | /preview/session-expired, click | "Preview only" toast; still signed in | P1 |
| TC-SYS-021 | AC-SYS-010 | Offline preview | Online device | /preview/offline | Offline state; Simulate reconnect / Go offline again toggle; no auto-close | P2 |
| TC-SYS-022 | BR-SYS-016 | Previews need sign-in | Signed out | /ui-preview, /preview/500 | Redirect to Sign in | P2 |
| TC-SYS-023 | BR-SYS-014 | No preview pill | Phone 375 px / desktop | /preview/503 | No "Preview mode" pill at either width | P3 |
| TC-SYS-024 | BR-SYS-017 | Reduced motion | Reduced-motion setting on | All previews | Illustrations still | P3 |
| TC-SYS-025 | 11 | Phone layout | 320–375 px | All system pages | No sideways or vertical scroll; buttons wrap; astronaut hidden; avatar-only account chip | P2 |
| TC-SYS-026 | AC-SYS-011 | Short screens fit | 375 × 560, 1280 × 600, landscape phone | All system pages; Page crash with Technical details open | No vertical scroll; illustration smaller or hidden; text and buttons fully visible | P1 |
| TC-SYS-027 | AC-SYS-011 | Re-fit on resize | Desktop | Shrink the window height step by step on /maintenance | Illustration shrinks smoothly, then hides; page never scrolls | P3 |
| TC-SYS-028 | AC-SYS-012 | Button styles | Any | /error, /maintenance, /session-expired, offline overlay | Main button solid white with navy text on every page; secondary outlined | P3 |
| TC-SYS-029 | AC-SYS-013 | Super Admin links | Signed in as Super Admin | /does-not-exist → **Back to dashboard**, Projects link, logo; /ui-preview | Manage Clients each time | P2 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-SYS-001 | Server error, Maintenance, Session expired | Nothing in the application opens these pages; the gallery says "API returns 500 / 503 / 401" | Real failures would show module error states or nothing, not these pages | Define which failures open each page (all requests or only page loads), and whether 401 always means session expiry | Open |
| OQ-SYS-002 | Server error, Maintenance | **Try again** and **Check again** reload the error page's own address, so they never return to the page that failed | Users cannot retry the original action | Confirm that retry should return to the failed page, and whether Maintenance should check status automatically | Open |
| OQ-SYS-003 | Server error | The reference is random and not linked to any real request or log | Support cannot trace the incident | Confirm the reference should come from the server | Open |
| OQ-SYS-004 | Maintenance | "Back in about 15 minutes" and the progress bar are fixed; no way back to the Dashboard except the logo | May mislead users during real maintenance | Define where the estimate comes from and whether a Dashboard button is needed | Open |
| OQ-SYS-005 | Offline | Detection relies on the device's connection status; **Try again** while offline shows the browser's own error; no automatic retry beyond waiting for the device | Some outages go undetected; retry leaves the application | Confirm detection approach and whether **Try again** should check the connection instead of reloading | Open |
| OQ-SYS-006 | Page crash, Server error | Crashes are only written to the browser console; "We’ve been notified" and "Your data is safe" are fixed statements | Promises not backed by reporting | Decide on error reporting and approve the wording | Open |
| OQ-SYS-007 | Page crash | No feedback when copying fails | Users may think details were copied | *Proposed: "Couldn’t copy — select the text instead"* as an error toast | Open |
| OQ-SYS-008 | Session expired | The page claims the user was signed out but the session stays active until **Sign in again**; the logo still opens the Dashboard; after signing in the user lands on the Dashboard, not the previous page | Inconsistent security message and lost context | Confirm the session should end when the page opens and whether to return the user to their previous page | Open |
| OQ-SYS-009 | Gallery | The gallery and previews are shown to every Training Partner in every build (see OQ-SHELL-010); the back-online state has no card of its own | Development tools visible to business users | Confirm hiding in production and whether more states (for example back online) need cards | Open |
| OQ-SYS-010 | All system pages | Always dark regardless of the chosen theme; footer differs from the portal footer | Consistency with SH-010 | Confirm the dark-only design is intended | Open |
| OQ-SYS-011 | Not found, Page crash, Server error (Super Admin) | For a Super Admin the button still reads **Back to dashboard** and Not found still lists Dashboard, All Clients and Projects, although all of them open Manage Clients | Labels promise pages the role does not have | Confirm per-role wording and destinations (e.g. "Back to Manage Clients") | Open |
| OQ-SYS-012 | Preview mode | Previews no longer carry any "Preview mode" marker or way back to the gallery; the page looks exactly like a real error and its actions (reload, email support, go to Dashboard) are real | Testers may mistake a preview for a real failure, and the Session expired / Offline previews behave differently from real use without saying so | Confirm that no marker is wanted, or define a subtle one | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and features inventory: Complete (frame, Not found, Page crash, Server error, Maintenance, Offline, Session expired, gallery, preview mode)
- [x] User roles and access: Complete
- [x] Page functionality and behaviour: Complete (including fit-to-screen and per-role links, v1.1)
- [x] User workflows: Complete
- [x] Field-level specifications: Not applicable (no form fields on these pages)
- [x] Minimum and maximum constraints, where known: Not applicable (no inputs)
- [x] Validation and business rules: Complete
- [x] Success messages and feedback: Complete
- [x] Search, filters, tables and listings: Not applicable (fixed gallery cards and links only)
- [x] Empty states, errors and edge cases: Complete
- [ ] Triggers for Server error, Maintenance and Session expired: Incomplete (not implemented, see OQ-SYS-001, OQ-SYS-008)
- [ ] Retry behaviour: Incomplete (retry reloads the error page itself, see OQ-SYS-002, OQ-SYS-005)
- [ ] Error reporting and incident reference: Incomplete (see OQ-SYS-003, OQ-SYS-006)
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria: Complete
- [x] QA test scenarios: Complete
- [x] Open questions logged: Complete
