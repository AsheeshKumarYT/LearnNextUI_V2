# Authentication: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Authentication PRD |
| Module name | Authentication |
| Document ID | PRD-AUTH |
| Version | 1.2 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (sign-in, role choice, session and sign-out work against one demo account; the password-reset journey is a simulation that does not change the password; the Facilitator and Participant portals are "coming soon") |
| Last updated | 2026-11-05 (v1.1, 2026-11-04: current brand panel; phones and tablets get a navy hero with the form as a white sheet, fitting the screen without scrolling. v1.2, 2026-11-05: one login can hold several roles — "Continue as" role picker, remembered role choice, "coming soon" role screen, role-based landing and page limits, Switch role; "Welcome back" and "You have been signed out" toasts wait until the next page has loaded; "Admin" renamed "Training Partner") |
| Related modules/pages | [App shell and navigation](app-shell-navigation-prd.md), [System pages](system-pages-prd.md) (Session expired), [Profile](profile-prd.md), [Dashboard](dashboard-prd.md), [Super Admin portal (PRD-SA)](super-admin-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

Authentication controls who can enter LearnNext Portal and in which role. It lets a user:

- sign in with an email address and password, and choose whether to stay signed in;
- when the login holds several roles (for example Training Partner and Super Admin), choose the role to continue as, and optionally have that choice remembered on the device;
- switch to another of their roles later without signing out;
- recover access when the password is forgotten (request a reset link, set a new password);
- sign out deliberately, with a confirmation step.

It also guards the application: every portal page requires a signed-in session and a chosen role (SH-003), each role can only open its own pages, and signed-in users are kept away from the sign-in pages. The objective is a short, low-friction entry that never exposes portal pages to a signed-out visitor or to a role that may not see them.

In the current build, sign-in is checked against a single built-in demo account (SH-001) that holds four roles: Training Partner, Super Admin, Facilitator and Participant (the last two are "coming soon"). The reset journey shows every screen but does not send email or change the stored password.

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Sign in | Enter LearnNext Portal | Any user (signed out) | Enter email and password, show/hide password, tick "Keep me signed in", **Sign in**, **Forgot password?**, **Use demo** | Forgot password, Continue as, Dashboard |
| Forgot password ("Forgot your password?") | Request a password reset link | Any user (signed out) | Enter email, **Send reset link**, **Back to sign in** | Sign in, Check your inbox |
| Check your inbox (Forgot password, after sending) | Confirm that a reset link was sent | Any user (signed out) | **Open reset link (demo)**, **Resend email**, **Back to sign in** | Reset password |
| Reset password ("Set a new password") | Choose a new password | Any user (signed out) | Enter and confirm new password, view strength meter, **Reset password** | Reset success |
| Reset success ("Password updated") | Confirm the reset and return to sign in | Any user (signed out) | **Continue to sign in** | Sign in |
| Role picker ("Continue as", added v1.2) | Choose which role to use for this visit | Signed-in user whose login holds several roles | Pick a role tile, tick "Remember my choice on this device", **Continue as <role>**, **Not you? Sign out** | Dashboard (Training Partner), Manage Clients (Super Admin), Coming soon |
| Role coming soon ("The <role> space is on its way", added v1.2) | Tell a role whose portal is not built yet that it is on its way | Signed-in user in a role that is not ready | **Switch role**, **Sign out** | Continue as, Sign in |
| Auth page frame | Common frame around the auth pages, the role picker and the coming-soon screen | Any user | Logo (returns to Sign in), theme menu, **Terms**, **Privacy**, **Support** | All auth pages |
| Route protection | Keep portal pages behind sign-in and a chosen role; keep each role on its own pages; keep signed-in users out of auth pages | System | Automatic redirects | All portal pages |
| Session | Remember the signed-in user and the chosen role for the tab or across browser restarts | System | Automatic | All portal pages |
| Switch role (user menu, added v1.2) | Move to another of the login's roles | Signed-in user whose login holds several roles | **Switch role** | User menu ([app shell](app-shell-navigation-prd.md)), Continue as |
| Log out confirmation | Confirm sign-out | Signed-in user | **Log out**, **Cancel** | User menu ([app shell](app-shell-navigation-prd.md)), Sign in |
| Session expired | Full-screen page asking the user to sign in again | Signed-in user | **Sign in again** | See [system-pages-prd.md](system-pages-prd.md) |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Visitor (not signed in) | Sign in, Forgot password, Reset password, Reset success, the full-screen system pages ([system-pages-prd.md](system-pages-prd.md)) | Sign in, request a reset link, set a new password, read Terms and Privacy | Any portal page, the role picker and the coming-soon screen redirect to Sign in (SH-003) |
| Signed in, no role chosen yet (login with several roles) | Role picker; the full-screen system pages | Choose a role, sign out | Any portal page redirects to the role picker; the requested page is remembered (BR-AUTH-019) |
| Training Partner | All Training Partner pages (SH-002) | Use the portal, switch role (if the login has several), log out | Opening Sign in, Forgot password, Reset password or Reset success redirects into the portal (SH-003) |
| Super Admin | Manage Clients pages and My Profile only (see [PRD-SA](super-admin-prd.md)) | Use the Super Admin portal, switch role, log out | Any other address (Dashboard, Settings, Facilitators, the System pages gallery…) redirects to Manage Clients (BR-AUTH-021) |
| Facilitator, Participant, Client SPOC [Not Implemented] | The coming-soon screen only | Switch role (if the login has several), sign out | Their portals are not built; every portal page redirects to the coming-soon screen (BR-AUTH-022). In the role picker these roles are shown but cannot be chosen |

Only one account can sign in in the current build: the demo account shown on the Sign in page. It holds the roles Training Partner, Super Admin, Facilitator and Participant (in that order). A Client SPOC role is also defined but is not on the demo account. A login without a role list counts as Training Partner only. Within the Training Partner portal no further role-specific restrictions are applied (SH-002).

## 5. Page Functionality and Behavior

### 5.1 Auth page frame (auth pages, role picker and coming-soon screen)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Layout | Consistent sign-in experience | View | On large screens (1024 px and up): a dark navy brand panel on the left and the form on the right in a frosted-glass card; the page fits the window. Below 1024 px (phones, tablets — v1.1): a navy hero on top (white logo, theme button, the brand line and a small glass-tier stack) and the form rising over it as a white sheet with rounded top corners, holding the form and the footer links. The page fits the screen without scrolling; on screens under 760 px tall the hero drops its sub-line and the spacing tightens so it still fits. Moving from Sign in to the role picker only swaps the card's content; the rest of the page stays in place | The form comes first in reading and tab order | Form is always the focus of the page |
| Logo "LearnNext" | Brand and a way back | Click | Opens Sign in (signed-in users are sent on as in 5.6) | No role or "Admin console" line under the wordmark: every role signs in on this page | Sign in page shown |
| Theme menu (icon button "Change theme") | Choose a theme before signing in | Click, choose Light / Dark / System | Applies and remembers the theme | Same menu as in the portal header ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)) | Theme applied |
| Brand panel | Brand message | View only | Shows the headline "Your learning, organised.", the line "Every client, program and facilitator, at a glance.", an isometric glass-tier stack with the LearnNext mark, and three rows of slowly gliding pills naming what the product offers in plain words (for example "Guided learning journeys", "Facilitator KYC in minutes", "Built-in support chat", "Role-based access", "Install as an app"). No figures or portal data and no "LearnNext Admin" label. Pointing at the pills slows the glide and softly lights the pill edges nearest the pointer | Large screens; below 1024 px the headline, line and a small stack appear in the navy hero instead (no pills). Hidden from screen readers. Motion stops for reduced-motion users | Decorative |
| Copyright line | Ownership | View | "© <current year> LearnNext" | Year follows the device clock | — |
| **Terms** | Show terms | Click | Opens a dialog titled "Terms of Service" with placeholder text and a **Got it** button | Placeholder copy (see OQ-AUTH-012) | Dialog closes on **Got it**, ×, Esc or backdrop (SH-006) |
| **Privacy** | Show privacy policy | Click | Opens a dialog titled "Privacy Policy" with placeholder text and **Got it** | Placeholder copy | As above |
| **Support** | Contact support | Click | Opens the device's email app addressed to support@learnnext.io | Requires an email app | New email draft |
| Browser tab title | Identify the tab | — | Auth pages, the role picker and the coming-soon screen do not set their own title. The tab shows "LearnNext" on first load, or the title of the last portal page after signing out [Partially Implemented] | Differs from SH-009 (see OQ-AUTH-009) | — |

### 5.2 Sign in

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Heading | Orient the user | View | "Sign in to LearnNext" and "Welcome back. Sign in to continue." On phones the sub-line reads "Welcome back — enter your details." (SH-013) | — | — |
| **Email** | Identify the account | Type | Focus starts in this field | See 7.1 | — |
| **Password** | Authenticate | Type | Characters are masked | See 7.1 | — |
| Show/Hide password (eye icon in the Password field) | Check what was typed | Click | Reveals or masks the password. Its label switches between "Show password" and "Hide password" | — | Password visible or masked |
| **Forgot password?** link (beside the Password label) | Recover access | Click | Opens Forgot password | Typed values are not carried over | Forgot password page |
| **Keep me signed in** | Choose session length | Tick / untick | Ticked by default. Ticked: the session survives closing the browser. Unticked: the session lasts only for this browser tab | BR-AUTH-005 | — |
| **Sign in** button | Submit | Click or press Enter | Validates the fields (SH-004). If valid, the button shows a spinner, reads "Signing in…" and is disabled while the check runs (about 0.7 s) | BR-AUTH-001 to BR-AUTH-004 | Success: toast and redirect. Failure: error banner |
| Error banner "Sign in failed" | Explain a rejected sign-in | — | Appears above the fields with the text "The email or password you entered is incorrect." | Stays until the next sign-in attempt or **Use demo**. Typing does not clear it. Entered values are kept | User corrects and retries |
| Success | Enter the portal | — | Login with one role, or with a role remembered on this device: the user is taken into that role's portal (BR-AUTH-007) and the toast "Welcome back, <first name>" (SH-005) appears once the landing page has finished loading — not over the loading screen. Login with several roles and no remembered choice: the "Continue as" role picker replaces the form in the same card (5.9) and no toast is shown yet | BR-AUTH-007, BR-AUTH-018 | Portal shown, or role picker |
| Demo account panel | Make the demo easy to try | View | Panel titled "Demo account" showing "admin@learnnext.io · learnnext123" | Present while sign-in is simulated (OQ-AUTH-005) | — |
| **Use demo** button | Fill in the demo credentials | Click | Fills Email and Password with the demo values and clears the error banner. Does not sign in | — | User clicks **Sign in** |

### 5.3 Forgot password

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Heading | Orient the user | View | Key icon, "Forgot your password?" and "Enter the email linked to your account and we’ll send you a reset link." | — | — |
| **Email** | Address to send the link to | Type | Focus starts here | See 7.2 | — |
| **Send reset link** | Request the link | Click or Enter | Validates the email (SH-004). If valid, shows a spinner (about 0.7 s), then switches to the "Check your inbox" view | Any well-formed email is accepted; the application does not reveal whether an account exists (BR-AUTH-009) | Check your inbox view |
| **Back to sign in** | Return | Click | Opens Sign in | — | Sign in page |
| Check your inbox view | Confirm sending | View | Success icon, "Check your inbox" and "We sent a password reset link to <email>. The link expires in 30 minutes." | The email is shown exactly as typed. No email is actually sent in the current build [Partially Implemented]. The 30-minute expiry is not enforced (OQ-AUTH-003) | — |
| **Open reset link (demo)** | Stand in for the emailed link | Click | Opens Reset password | Demo-only shortcut | Reset password page |
| **Resend email** | Send the link again | Click | Button shows a spinner (about 0.7 s), then a success toast "Reset link sent again" with the line "Check <email>" | No limit on the number of resends (OQ-AUTH-003) | Stays on Check your inbox |
| **Back to sign in** (on the inbox view) | Return | Click | Opens Sign in | — | Sign in page |

### 5.4 Reset password

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Heading | Orient the user | View | Shield icon, "Set a new password" and "Your new password must be different from previously used passwords." | The "different from previous passwords" rule is not checked [Not Implemented] (OQ-AUTH-004) | — |
| Access | Open from the reset link | Open the page | The page opens for any signed-out visitor, with or without a reset link [Partially Implemented] | No link or token is checked (OQ-AUTH-003) | — |
| **New password** | New secret | Type | Masked, with show/hide toggle. Focus starts here | See 7.3 | — |
| Strength meter | Guide a strong choice | Type in New password | Four bars and a label update as the user types; "—" when empty. A checklist shows four items, each ticked when met: "At least 8 characters", "Upper & lowercase letters", "A number", "A symbol" | BR-AUTH-011, BR-AUTH-012 | — |
| **Confirm password** | Avoid typos | Type | Masked, with show/hide toggle | Must equal New password | — |
| **Reset password** | Save the new password | Click or Enter | Validates both fields (SH-004). If valid, shows a spinner (about 0.7 s) and opens Reset success. Going Back in the browser does not return to this form | The stored password is not changed in the current build [Partially Implemented] (OQ-AUTH-004) | Reset success page |

### 5.5 Reset success

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Confirmation | Close the journey | View | Success icon, "Password updated" and "Your password has been reset successfully. You can now sign in with your new password." | The page can be opened directly by any signed-out visitor | — |
| **Continue to sign in** | Return to sign in | Click | Opens Sign in | — | Sign in page |

### 5.6 Route protection

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Protected portal pages | Keep data private | Open any portal page while signed out | Redirects to Sign in. The requested page (including any query) is remembered | SH-003, BR-AUTH-006 | After sign-in (and choosing a role, where needed) the user lands on the requested page when the role may open it |
| No role chosen yet | Make the user pick a role first | Open any portal page while signed in without a chosen role | Redirects to the role picker; the requested page is remembered | BR-AUTH-019 | Role picker |
| Role not ready | Keep unbuilt portals closed | Open any portal page in a role whose portal is not built (Facilitator, Participant, Client SPOC) | Redirects to the coming-soon screen (5.10) | BR-AUTH-022 | Coming-soon screen |
| Pages outside the role | Keep each role on its own pages | Open a page the chosen role may not open (for example Super Admin opening the Dashboard, Settings or Facilitators) | Redirects to the role's home: Super Admin → Manage Clients | BR-AUTH-021 | Role's home page |
| Auth pages while signed in | Avoid signing in twice | Open Sign in, Forgot password, Reset password or Reset success while signed in | No role chosen yet: opens the role picker. Otherwise: the remembered page if one is pending, else the Dashboard — which a Super Admin is sent on from to Manage Clients | SH-003 | Portal shown |
| Role picker and coming-soon screen while signed out | Need a session | Open either address while signed out | Redirects to Sign in | — | Sign in |
| Root address | Default entry | Open the site root | Goes to the Dashboard (Training Partner) or Manage Clients (Super Admin); the role picker if no role is chosen yet; Sign in if signed out | — | — |
| Unknown address | Not found | Open an address that doesn't exist | Shows the full-screen "not found" page, signed in or out ([system-pages-prd.md](system-pages-prd.md)) | — | — |

### 5.7 Session

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Remembered session | Avoid repeated sign-in | Close and reopen the browser | With "Keep me signed in" ticked, the user is still signed in. Unticked, the session survives a reload of the same tab but ends when the tab is closed; a newly opened tab asks for sign-in. The chosen role is part of the session: a reload keeps the user in the same role | BR-AUTH-005 | — |
| Remembered role choice | Skip the role picker on this device | Sign in again after ticking "Remember my choice on this device" | The remembered role is used straight away and the picker is skipped. The choice is kept per login on this device, independently of "Keep me signed in", and survives signing out. **Switch role** forgets it | BR-AUTH-020 | — |
| Profile refresh | Keep name and photo current | Load the app while signed in | The signed-in user's details (name, email, photo) are refreshed once per load, so changes made in [My Profile](profile-prd.md) appear in the header | — | Current details shown |
| Session expiry | Sign out inactive users | — | No automatic expiry or inactivity timeout exists [Not Implemented]. The Session expired page exists but nothing sends the user to it automatically (SH-003, OQ-AUTH-002) | See [system-pages-prd.md](system-pages-prd.md) | — |

### 5.8 Log out

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Log out** (header user menu) | End the session | Click | Opens a confirmation dialog | Inside a portal, the only place Log out appears is the header user menu ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)). The role picker and the coming-soon screen have their own **Sign out** (5.9, 5.10) | Dialog shown |
| Confirmation dialog | Prevent accidental sign-out | View | Title "Log out of LearnNext?", text "You’ll need to sign in again to continue.", buttons **Cancel** and **Log out** (primary blue, not red) | Focus starts on **Cancel** (SH-006). Esc, backdrop and **Cancel** close it without signing out | — |
| **Log out** (in dialog) | Confirm | Click | Ends the session immediately and opens Sign in. The info toast "You have been signed out" appears once the Sign in page is showing | The page the user was on is remembered: signing in again returns there when the chosen role may open it (BR-AUTH-008). A remembered role choice is kept | Sign in page |
| Unsaved work | Protect edits | Log out from a page with unsaved changes | No "discard changes" warning is shown; the changes are lost [Partially Implemented] | See OQ-SHELL-008 in [app-shell-navigation-prd.md](app-shell-navigation-prd.md) | — |

### 5.9 Role picker ("Continue as", added v1.2)

Shown after signing in when the login holds more than one role and no choice is remembered on this device, and again after **Switch role**. It appears in the same card as the sign-in form (5.1).

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Who is signed in | Make a shared device obvious | View | The user's avatar, "Hi <first name>" and their email above the heading | — | — |
| Heading | Orient the user | View | "Continue as" and "Your login is linked to <N> roles. Choose the one you want to use for this visit." | <N> counts every role on the login, including coming-soon ones | — |
| Role tiles | Choose a role | Click a tile (or use the arrow keys, as radio buttons) | Two tiles per row, in the login's role order. Each tile: the role's icon, its name and a one-line description — Training Partner "Clients and content", Super Admin "Manage clients", Facilitator "Run your sessions", Participant "Your learning journey", Client SPOC "Your company’s programs". The chosen tile is tinted in soft blue with a blue name, and its icon tile fills in blue with a small pop; no separate tick. Hovering a tile shows its description as a tooltip | Exactly one role is chosen. On phones the icon sits above the name so nothing is cut off. Keyboard focus shows a ring round the tile | Role chosen |
| Coming-soon tiles | Show roles that cannot be used yet | View | Roles whose portal is not built are faded with a dashed border, their line reads "Coming soon" and their tooltip "<Role> — coming soon". They cannot be chosen | BR-AUTH-022 | — |
| Default choice | Save a click | — | The first role that can be used (for the demo account: Training Partner) is chosen when the picker opens | If no role can be used, nothing is chosen and the button is disabled | — |
| **Remember my choice on this device** | Skip the picker next time | Tick / untick | Unticked by default. Ticked: the chosen role is used straight away at the next sign-in on this device | BR-AUTH-020 | — |
| **Continue as <role>** button | Enter the chosen role | Click or Enter | The label names the chosen role, for example "Continue as Training Partner". Opens the role's landing page (BR-AUTH-007) and shows the toast "Welcome back, <first name>" once that page has finished loading | Disabled (label "Continue") when nothing is chosen | Portal shown |
| **Not you? Sign out** | Leave a login that is not yours | Click **Sign out** | Ends the session at once and opens Sign in. No confirmation and no toast [Requires Confirmation] (OQ-AUTH-017) | — | Sign in page |
| Single-role login | Nothing to choose | Opens the picker address with a one-role login | The picker is skipped: the user goes straight into that role (or to the coming-soon screen if it is not ready) | — | — |

### 5.10 Role coming soon (added v1.2)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| When it appears | Hold a role whose portal is not built | Be signed in in Facilitator, Participant or Client SPOC and open any portal page | The screen appears in the sign-in card (5.1) | A role that is ready is sent to its portal instead; with no role chosen the role picker opens | Coming-soon screen |
| Content | Explain | View | The role's icon in its soft colour tile, the title "The <role> space is on its way" and the role's line followed by "We’re still building it — check back soon." (Facilitator: "Your sessions, attendance and session content — all in one place."; Participant: "Your programs, modules, assessments and progress — step by step."; Client SPOC: "Your company’s projects, participants and reports at a glance.") | — | — |
| Progress track | Show where the portal stands | View | Three steps joined by lines: "Designed" (ticked), "Building" (current, a softly pulsing dot), "Launch" (not yet) | Fixed text, not live progress | — |
| **Switch role** | Use another role | Click | Opens the role picker (5.9) | Only for logins with several roles | Role picker |
| **Sign out** | Leave | Click | Ends the session at once and opens Sign in; no confirmation and no toast | Main button when the login has one role; a quiet button under **Switch role** otherwise | Sign in page |

### 5.11 Switch role (added v1.2)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **Switch role** (header user menu) | Move to another role without signing out | Click | Returns to the role picker (5.9). A remembered role choice on this device is forgotten, so the picker always shows | Shown only when the login holds several roles ([app-shell-navigation-prd.md](app-shell-navigation-prd.md) 5.9) | Role picker |
| Landing after a switch | Avoid opening the wrong record | Choose a role and **Continue as <role>** | Always opens the chosen role's own home — Dashboard (Training Partner) or Manage Clients (Super Admin) — never the page the user was on, because the same address can mean a different record in another portal. The toast "Welcome back, <first name>" appears once that page has loaded | BR-AUTH-023 | Chosen role's home |
| Unsaved work | Protect edits | Choose **Switch role** on a page with unsaved changes (Add client, Edit client, Program content, Verify KYC) | The page's own leave dialog opens first; the picker opens only if the user chooses to discard | Same guard as the shell's other exits (BR-SHELL-014) | Dialog shown |

## 6. User Workflow

### 6.1 Sign in

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Opens any portal page or the site root while signed out | Redirects to Sign in and remembers the requested page | SH-003 | Sign in shown, focus in Email |
| 2 | (Optional) Clicks **Use demo** | Fills in the demo email and password | — | Fields filled |
| 3 | Enters Email and Password | Format errors appear when leaving a typed field | SH-004 | — |
| 4 | Leaves or changes "Keep me signed in" | — | Ticked by default | — |
| 5 | Clicks **Sign in** | Shows required/format errors, or checks the credentials | BR-AUTH-001 to BR-AUTH-004 | — |
| 6a | — | Credentials correct, one role or a remembered role: redirect into that role; toast "Welcome back, <first name>" once the page has loaded | BR-AUTH-007, BR-AUTH-020 | Requested page (if the role may open it) or the role's home |
| 6b | — | Credentials correct, several roles and nothing remembered: the role picker replaces the form (6.4) | BR-AUTH-018 | Role picker |
| 6c | — | Credentials wrong: banner "Sign in failed" / "The email or password you entered is incorrect." | — | User corrects and retries |

### 6.2 Forgot and reset password

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Clicks **Forgot password?** on Sign in | Opens Forgot password | — | — |
| 2 | Enters email, clicks **Send reset link** | Validates, then shows "Check your inbox" with the email | BR-AUTH-009 | Inbox view |
| 3 | (Optional) Clicks **Resend email** | Toast "Reset link sent again" / "Check <email>" | — | Stays on inbox view |
| 4 | Clicks **Open reset link (demo)** (stands in for the emailed link) | Opens Set a new password | — | — |
| 5 | Types a new password | Strength meter and checklist update live | BR-AUTH-010 to BR-AUTH-012 | — |
| 6 | Types it again in Confirm password, clicks **Reset password** | Validates, then opens Password updated | BR-AUTH-013 | Reset success |
| 7 | Clicks **Continue to sign in** | Opens Sign in | The demo password is unchanged (OQ-AUTH-004) | Sign in |

### 6.3 Log out

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Opens the user menu in the header, clicks **Log out** | Opens "Log out of LearnNext?" | — | Dialog shown |
| 2a | Clicks **Cancel** (or Esc / backdrop) | Closes the dialog | — | Still signed in |
| 2b | Clicks **Log out** | Ends the session and opens Sign in; toast "You have been signed out" once Sign in is showing | — | Sign in shown; the last page is remembered |

### 6.4 Choose a role (added v1.2)

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Signs in with a login that holds several roles and has no remembered choice | Shows "Continue as" with one tile per role; the first usable role is chosen | BR-AUTH-018 | Role picker |
| 2 | Clicks another role tile | Tints that tile and fills its icon; the button reads "Continue as <role>" | Coming-soon tiles cannot be chosen (BR-AUTH-022) | — |
| 3 | (Optional) Ticks "Remember my choice on this device" | — | BR-AUTH-020 | — |
| 4a | Clicks **Continue as Training Partner** | Opens the page requested before sign-in if there was one, otherwise the Dashboard; toast "Welcome back, <first name>" once loaded | BR-AUTH-007 | Training Partner portal |
| 4b | Clicks **Continue as Super Admin** | Always opens Manage Clients; toast once loaded | BR-AUTH-007, BR-AUTH-021 | Super Admin portal ([PRD-SA](super-admin-prd.md)) |
| 4c | Clicks **Not you? Sign out** | Ends the session | — | Sign in |

### 6.5 Switch role (added v1.2)

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Opens the user menu and clicks **Switch role** | If the page has unsaved changes, its leave dialog opens first (BR-SHELL-014); otherwise the remembered role choice is forgotten and the role picker opens | Login holds several roles | Role picker |
| 2 | Chooses a role and clicks **Continue as <role>** | Opens that role's home, not the previous page; toast "Welcome back, <first name>" once loaded | BR-AUTH-023 | Chosen role's home |

## 7. Forms and Field-Level Specifications

### 7.1 Sign in form

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Email | Email text box (placeholder "you@company.com") | Account identifier | Required | Requires Confirmation | Requires Confirmation | Text, "@", domain, ".", at least 2 characters after the dot, no spaces (SH-004) | Empty | Required on submit; format on blur and submit. Compared with the account without regard to case or surrounding spaces | Filled by **Use demo** | "Enter your email address" (empty); "Enter a valid email address" (format) |
| Password | Password box with show/hide toggle (placeholder "Enter your password") | Account secret | Required | Requires Confirmation | Requires Confirmation | Any characters; case-sensitive | Empty | Required on submit. Spaces only counts as empty | Filled by **Use demo** | "Enter your password" |
| Keep me signed in | Checkbox | Session length | Optional | N/A | N/A | Ticked / unticked | Ticked | None | Controls whether the session survives closing the browser | N/A |
| Show/Hide password | Toggle button | Reveal the typed password | Optional | N/A | N/A | On / off | Off (masked) | None | Label "Show password" / "Hide password" | N/A |

### 7.2 Forgot password form

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Email | Email text box (placeholder "you@company.com") | Where to send the reset link | Required | Requires Confirmation | Requires Confirmation | As in 7.1 | Empty (not carried over from Sign in) | Required on submit; format on blur and submit. No check that an account exists | Shown back on the "Check your inbox" view | "Enter your email address" (empty); "Enter a valid email address" (format) |

### 7.3 Reset password form

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| New password | Password box with show/hide toggle (placeholder "Create a password") | The new secret | Required | 8 characters | Requires Confirmation | Must meet at least 3 of the 4 checklist items (BR-AUTH-011). Spaces count as symbols | Empty | Checked in order, first failure shown: required → minimum length → strength. Required on submit; others on blur and submit | Drives the strength meter and checklist live | "Enter a new password"; "Must be at least 8 characters"; "Choose a stronger password" |
| Confirm password | Password box with show/hide toggle (placeholder "Repeat the password") | Confirm the new secret | Required | N/A | N/A | Must equal New password exactly | Empty | Required on submit; match on blur and submit. Re-checked when New password changes | — | "Confirm your new password"; "Passwords do not match" |

### 7.4 Role picker form (added v1.2)

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Role | Single-choice radio tiles (two per row) | The role to continue as | Required | 1 choice | 1 choice | The login's roles whose portal is ready (today Training Partner, Super Admin) | The first ready role in the login's order | A role must be chosen; coming-soon roles cannot be chosen | **Continue as <role>** is disabled while nothing is chosen | N/A (no message; the button stays disabled) |
| Remember my choice on this device | Checkbox | Skip the picker at the next sign-in on this device | Optional | N/A | N/A | Ticked / unticked | Unticked | None | Saved only when **Continue as <role>** is clicked; unticked clears an earlier remembered choice | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-AUTH-001 | Required sign-in fields | Email and Password must be entered | Sign in | Errors appear on **Sign in** only (SH-004) | Either field empty or spaces only | "Enter your email address" / "Enter your password" |
| BR-AUTH-002 | Email format | Email must be a valid address | Sign in, Forgot password | Error on blur and on submit | "admin@learnnext", "admin learnnext.io" | "Enter a valid email address" |
| BR-AUTH-003 | Credential check | Sign-in succeeds only when the email matches the account (any letter case) and the password matches exactly (case-sensitive) | Sign in | Rejects with one generic message that does not reveal which part was wrong | Wrong email or wrong password | Banner "Sign in failed": "The email or password you entered is incorrect." |
| BR-AUTH-004 | Single demo account [Partially Implemented] | Only the demo account (admin@learnnext.io) can sign in | Current build | — | Any other account | As BR-AUTH-003 |
| BR-AUTH-005 | Session length | "Keep me signed in" ticked: session survives browser restarts. Unticked: session lasts for the current tab only | After successful sign-in | — | — | — |
| BR-AUTH-006 | Protected pages | Portal pages need a session (SH-003) | Any portal page | Redirect to Sign in, remembering the page | Signed out | Sign in page |
| BR-AUTH-007 | Landing after sign-in | Training Partner: goes to the page that triggered the redirect (when the role may open it), otherwise to the Dashboard. Super Admin chosen in the role picker: always Manage Clients, because the same address can mean a different record in its portal (with a remembered Super Admin choice, see OQ-AUTH-016) | Successful sign-in / **Continue as <role>** | The welcome toast waits until the landing page has finished loading (SH-005) | — | Toast "Welcome back, <first name>" |
| BR-AUTH-008 | Sign-out confirmation | Logging out from the user menu always asks for confirmation; after logging out, the last page is remembered for the next sign-in in the same tab | Log out | The toast appears once the Sign in page is showing | — | Toast "You have been signed out" |
| BR-AUTH-009 | No account disclosure on reset | Forgot password accepts any well-formed email and always shows "Check your inbox" | Forgot password | — | Unknown email | Same confirmation as a known email |
| BR-AUTH-010 | Minimum password length | New password at least 8 characters | Reset password | Error on blur and submit | 7 characters | "Must be at least 8 characters" |
| BR-AUTH-011 | Password strength | New password must meet at least 3 of: at least 8 characters; upper and lowercase letters; a number; a symbol (any character that is not a letter or digit) | Reset password | Error on blur and submit | "abcdefg1" (2 of 4) | "Choose a stronger password" |
| BR-AUTH-012 | Strength meter scoring | One point each for: 8+ characters; 12+ characters; both upper and lowercase letters; both a number and a symbol. 0 = "Too weak", 1 = "Weak", 2 = "Fair", 3 = "Good", 4 = "Strong" | While typing a new password | Bars fill in red (Too weak/Weak), amber (Fair) or green (Good/Strong) | — | Label beside the bars. The meter is guidance only; acceptance follows BR-AUTH-011, so a "Fair" password can be accepted or rejected |
| BR-AUTH-013 | Confirm password match | Confirm password must equal New password | Reset password | Error on blur and submit | Different values | "Passwords do not match" |
| BR-AUTH-014 | Reset changes the password [Not Implemented] | A completed reset should replace the account password | Reset password | The current build shows success but the old password still works | — | — |
| BR-AUTH-015 | Reset link validity [Requires Confirmation] | The inbox view states the link expires in 30 minutes; no link, expiry or single-use check exists | Reset password | — | Expired or reused link | *Proposed: "This reset link has expired. Request a new one."* |
| BR-AUTH-016 | Password history [Not Implemented] | The page says the new password must differ from previous passwords; not checked | Reset password | — | Reusing an old password | *Proposed: "Choose a password you haven’t used before."* |
| BR-AUTH-017 | Failed-attempt limit [Requires Confirmation] | No limit on failed sign-in attempts or reset requests exists | Sign in, Forgot password | — | — | — |
| BR-AUTH-018 | Several roles per login | One email and password can hold several roles. One role: straight in. Several roles: the remembered choice is used if there is one, otherwise the "Continue as" picker is shown | After successful sign-in | — | — | "Continue as" |
| BR-AUTH-019 | Role required | A signed-in user without a chosen role cannot open portal pages; they are sent to the role picker and the requested page is remembered | Any portal page | — | No role chosen | Role picker |
| BR-AUTH-020 | Remembered role choice | "Remember my choice on this device" stores the chosen role for that login on this device; the next sign-in uses it and skips the picker. It survives sign-out and is independent of "Keep me signed in"; **Switch role** forgets it | Role picker, sign-in | — | Remembered role no longer on the login | Picker shown again |
| BR-AUTH-021 | Role page limits | Each role may open only its own pages. Training Partner: every Training Partner page. Super Admin: Manage Clients pages and My Profile. Any other address redirects to the role's home | Every page change | Redirect, no message | Super Admin opens /dashboard or /settings | Manage Clients shown |
| BR-AUTH-022 | Roles not ready [Not Implemented] | Facilitator, Participant and Client SPOC portals are not built. Their tiles in the picker are disabled ("Coming soon"); a login in one of these roles sees only the coming-soon screen | Picker, any portal page | — | — | "The <role> space is on its way" |
| BR-AUTH-023 | Switch role | **Switch role** (only for logins with several roles) asks the page's leave guard first, forgets the remembered choice, shows the picker, and then opens the chosen role's own home rather than the previous page | User menu | — | — | Toast "Welcome back, <first name>" |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Sign in | Correct credentials, one role or a remembered role | Success toast (SH-005) | "Welcome back, <first name>" (for the demo account: "Welcome back, Atul") | Once the landing page has finished loading (at most about 6 s after sign-in) | Continue working |
| Sign in | Correct credentials, several roles, nothing remembered | Page view | "Continue as" / "Your login is linked to <N> roles. Choose the one you want to use for this visit." | Immediately, in place of the form | Choose a role |
| Continue as <role> | Role chosen (after sign-in or Switch role) | Success toast (SH-005) | "Welcome back, <first name>" | Once the role's landing page has finished loading | Continue working |
| Role not ready | Signed in as Facilitator, Participant or Client SPOC | Page view | "The <role> space is on its way" / "<role line> We’re still building it — check back soon." | On opening any portal page | Switch role or Sign out |
| Sign in | Wrong credentials | Inline error banner | Title "Sign in failed", text "The email or password you entered is incorrect." | After the check (about 0.7 s) | Correct and retry, or **Forgot password?** |
| Sign in in progress | Valid fields submitted | Button state | "Signing in…" with spinner | During the check | Wait |
| Send reset link | Valid email | Page view | "Check your inbox" / "We sent a password reset link to <email>. The link expires in 30 minutes." | After about 0.7 s | Open the link |
| Resend email | On the inbox view | Success toast | "Reset link sent again" with "Check <email>" | After about 0.7 s | Open the link |
| Reset password | Valid passwords | Page view | "Password updated" / "Your password has been reset successfully. You can now sign in with your new password." | After about 0.7 s | **Continue to sign in** |
| Log out | Confirmed | Info toast | "You have been signed out" | Once the Sign in page is showing | Sign in again |
| Sign out from the role picker or coming-soon screen | Clicked | None | — (no confirmation, no toast) | — | Sign in again |
| Terms / Privacy | Link clicked | Dialog | "Terms of Service" / "Privacy Policy" placeholder text | Immediately | **Got it** |

## 10. Search, Filters, Tables, and Listings

Not applicable — the authentication pages have no search, filters, tables or lists.

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| Empty sign-in submit | **Sign in** with blank fields | Both errors shown; nothing sent | "Enter your email address", "Enter your password" | Fill in the fields |
| Email with surrounding spaces | User types " admin@learnnext.io" | Format check fails because spaces are not allowed | "Enter a valid email address" | Remove the spaces |
| Email in different case | "ADMIN@LearnNext.io" | Accepted; sign-in succeeds with the right password | — | — |
| Password wrong case | "Learnnext123" | Rejected | "The email or password you entered is incorrect." | Retry |
| Error banner after editing | User fixes a typo after a failed attempt | Banner stays until the next attempt or **Use demo** | Previous banner text | Click **Sign in** |
| Double submission | User clicks **Sign in** repeatedly | Button disabled while checking (SH-007) | "Signing in…" | Wait |
| Signed-in user opens /login | Bookmark or typed address | Redirect into the portal (the role picker if no role is chosen yet) | — | — |
| Super Admin opens a Training Partner page | Typed address or old bookmark, e.g. /dashboard, /facilitators, /settings | Redirect to Manage Clients, no message | — | — |
| Deep link, then Super Admin chosen | Signed out, opens /facilitators, signs in and picks Super Admin | Lands on Manage Clients, not Facilitators | Toast "Welcome back, <first name>" | — |
| Remembered role removed from the login | The saved role is no longer one of the login's roles | The role picker is shown as if nothing was remembered | "Continue as" | Choose a role |
| Only coming-soon roles | A login whose roles are all not ready, with several roles | Picker shows every tile disabled; **Continue** stays disabled | "Coming soon" on each tile | **Not you? Sign out** |
| Opening the picker address directly while in a role | Typed /choose-role | The picker is shown and can be used to change role | "Continue as" | Choose a role |
| Shared device | Someone else's role choice is remembered on the device | Only applies to that same login; another login sees its own picker | — | OQ-AUTH-015 |
| Reset password opened without a link | Typed address or bookmark | Form works normally | — | See OQ-AUTH-003 |
| New password reverts | User signs in with the new password after a reset | Rejected; only the demo password works | "The email or password you entered is incorrect." | Use the demo password (OQ-AUTH-004) |
| Logged out in another tab | Two tabs open, log out in one | The other tab stays usable until it is reloaded; after reload it shows Sign in (when "Keep me signed in" was ticked) | — | OQ-AUTH-010 |
| Session not remembered | "Keep me signed in" unticked, tab closed | Next visit asks for sign-in | — | Sign in |
| Browser storage unavailable | Private mode or blocked storage | Sign-in still works for the open tab; the session is not kept | — | Sign in again after reload |
| Offline | Connection lost on any page | Full-screen offline page over the app ([system-pages-prd.md](system-pages-prd.md)) | See that PRD | Reconnect |
| Session expired | Not triggered automatically today | — | See [system-pages-prd.md](system-pages-prd.md) | **Sign in again** |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| [App shell and navigation](app-shell-navigation-prd.md) | The header user menu holds **Log out** and, for logins with several roles, **Switch role**; the header shows the signed-in user's name, email and photo; the shell's menu and pages follow the chosen role | Log out; Switch role; sign in | Log out opens the confirmation dialog; Switch role opens the picker; user details appear in the header | BR-AUTH-008, BR-AUTH-023 |
| [Dashboard](dashboard-prd.md) | Default Training Partner landing page after sign-in | Sign in as Training Partner without a remembered page | Dashboard opens | BR-AUTH-007 |
| [Super Admin portal (PRD-SA)](super-admin-prd.md) | Chosen in the role picker; opens on Manage Clients and may only open its own pages and My Profile | **Continue as Super Admin** | Manage Clients opens | BR-AUTH-021 |
| [Profile](profile-prd.md) | Profile edits (name, email, photo) update the signed-in user's details; the Change password flow there uses the same strength meter and checklist (and the one-time-code entry), which do not appear on the auth pages | Save profile; change password | Header and user menu show the new details | BR-AUTH-011, BR-AUTH-012 |
| [System pages](system-pages-prd.md) | Session expired page signs the user out and opens Sign in; not-found page links to Sign in when signed out | **Sign in again** | Session cleared | SH-003 |
| [Settings: access masters](settings-access-masters-prd.md) | The Roles & Access permissions defined there are not applied at sign-in; the portal roles (Training Partner, Super Admin…) are a separate, fixed list on the login | — | Every Training Partner sees every Training Partner page | SH-002 |
| All portal pages | Protected by sign-in and a chosen role | Open while signed out / without a role / in a role that may not open them | Redirect to Sign in / role picker / the role's home | SH-003 |

## 13. Acceptance Criteria

**AC-AUTH-001: Successful sign-in**
- Given I am signed out on Sign in
- And no role choice is remembered on this device
- When I enter "admin@learnnext.io" and "learnnext123" and click **Sign in**
- Then the button shows "Signing in…" and is disabled while checking
- And the "Continue as" role picker replaces the form, with Training Partner chosen
- When I click **Continue as Training Partner**
- Then I land on the Dashboard and, once it has loaded, the toast "Welcome back, Atul" appears

**AC-AUTH-002: Wrong credentials**
- Given I am on Sign in
- When I enter a valid email with a wrong password and click **Sign in**
- Then I stay on Sign in with the banner "Sign in failed" and the text "The email or password you entered is incorrect."
- And my typed email and password are kept

**AC-AUTH-003: Required fields**
- Given the Sign in fields are empty
- When I tab through them
- Then no error appears
- When I click **Sign in**
- Then "Enter your email address" and "Enter your password" appear and nothing is submitted

**AC-AUTH-004: Email format**
- Given I typed "admin@learnnext" in Email
- When I leave the field
- Then "Enter a valid email address" appears
- And it disappears as soon as the value becomes valid

**AC-AUTH-005: Demo helper**
- Given I am on Sign in with an error banner shown
- When I click **Use demo**
- Then Email and Password contain the demo credentials and the banner disappears
- And I am not signed in until I click **Sign in**

**AC-AUTH-006: Return to requested page**
- Given I am signed out
- When I open the All Clients page address directly
- Then I see Sign in
- And after signing in and choosing Training Partner I land on All Clients, not the Dashboard

**AC-AUTH-007: Keep me signed in**
- Given I signed in with "Keep me signed in" ticked
- When I close and reopen the browser and open the portal
- Then I am still signed in, in the same role
- Given instead I signed in with it unticked
- When I close the tab and open the portal in a new tab
- Then I see Sign in

**AC-AUTH-008: Signed-in user on auth pages**
- Given I am signed in as Training Partner
- When I open the Sign in, Forgot password, Reset password or Reset success address
- Then I am taken to the Dashboard
- And as Super Admin I am taken to Manage Clients

**AC-AUTH-009: Forgot password**
- Given I am on Forgot password
- When I click **Send reset link** with an empty email
- Then "Enter your email address" appears
- When I enter "someone@company.com" and click **Send reset link**
- Then "Check your inbox" shows "someone@company.com" and the 30-minute note
- And **Resend email** shows the toast "Reset link sent again" with "Check someone@company.com"

**AC-AUTH-010: New password rules**
- Given I am on Set a new password
- When I enter "Abc1!xy" (7 characters) and leave the field
- Then "Must be at least 8 characters" appears
- When I enter "abcdefg1"
- Then "Choose a stronger password" appears
- When I enter "Abcdefg1"
- Then no error appears and the meter shows "Fair"

**AC-AUTH-011: Confirm password**
- Given New password is "Abcdefg1!"
- When I enter "Abcdefg1" in Confirm password and click **Reset password**
- Then "Passwords do not match" appears and I stay on the page
- When I correct it and click **Reset password**
- Then I see "Password updated"

**AC-AUTH-012: Log out with confirmation**
- Given I am signed in on Facilitators
- When I choose **Log out** in the user menu
- Then "Log out of LearnNext?" opens with focus on **Cancel**
- When I click **Cancel**
- Then I remain signed in
- When I choose **Log out** again and confirm
- Then I see Sign in and, once it is showing, the toast "You have been signed out"
- And signing in again (choosing Training Partner) returns me to Facilitators

**AC-AUTH-013: Protected page while signed out**
- Given I am signed out
- When I open any portal page address
- Then I am redirected to Sign in and no portal content is shown

**AC-AUTH-014: Role picker**
- Given I signed in with the demo account and nothing is remembered
- Then I see my avatar, "Hi Atul", my email, "Continue as" and "Your login is linked to 4 roles…"
- And four tiles in two columns: Training Partner and Super Admin can be chosen; Facilitator and Participant are faded, dashed and read "Coming soon"
- When I click the Super Admin tile
- Then it is tinted with its icon filled in and the button reads "Continue as Super Admin"
- And clicking a Facilitator tile changes nothing

**AC-AUTH-015: Super Admin lands on Manage Clients**
- Given I am signed out and open the Facilitators address
- When I sign in and click **Continue as Super Admin**
- Then Manage Clients opens (not Facilitators) and the welcome toast appears once it has loaded
- When I type the Dashboard or Settings address
- Then I am sent back to Manage Clients

**AC-AUTH-016: Remember my choice**
- Given I tick "Remember my choice on this device" and continue as Training Partner
- When I log out and sign in again
- Then the picker is skipped and I land in the Training Partner portal with the welcome toast
- When I choose **Switch role** in the user menu
- Then the picker shows again, and after the next sign-in it shows again unless I tick the box once more

**AC-AUTH-017: Switch role**
- Given I am signed in as Training Partner on Facilitators
- When I choose **Switch role** and continue as Super Admin
- Then Manage Clients opens
- When I switch back and continue as Training Partner
- Then the Dashboard opens, not the page I was on before

**AC-AUTH-018: Switch role with unsaved changes**
- Given I have typed a client name on Add client
- When I choose **Switch role**
- Then "Discard this client?" opens and I stay on Add client until I choose **Discard**

**AC-AUTH-019: Coming-soon role**
- Given my login holds only a role that is not ready (for example Facilitator)
- When I sign in
- Then I see "The Facilitator space is on its way", the Designed / Building / Launch track and **Sign out**
- And opening any portal address keeps me on this screen

**AC-AUTH-020: Sign out from the picker**
- Given the role picker is showing
- When I click **Sign out** after "Not you?"
- Then Sign in opens immediately, with no confirmation and no toast

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-AUTH-001 | AC-AUTH-001 | Valid sign-in | Signed out, no remembered role | admin@learnnext.io / learnnext123, then **Continue as Training Partner** | Role picker, then Dashboard; toast "Welcome back, Atul" only after the Dashboard has loaded | P0 |
| TC-AUTH-002 | BR-AUTH-003 | Email case-insensitive | Signed out | ADMIN@LearnNext.IO / learnnext123 | Signed in | P1 |
| TC-AUTH-003 | BR-AUTH-003 | Password case-sensitive | Signed out | admin@learnnext.io / Learnnext123 | Banner with "The email or password you entered is incorrect." | P0 |
| TC-AUTH-004 | AC-AUTH-002 | Unknown email | Signed out | nobody@learnnext.io / learnnext123 | Same generic banner | P0 |
| TC-AUTH-005 | AC-AUTH-003 | Empty submit | Signed out | Blank fields | Two required errors, no request | P1 |
| TC-AUTH-006 | BR-AUTH-001 | Spaces-only password | Signed out | Password "   " | "Enter your password" | P2 |
| TC-AUTH-007 | AC-AUTH-004 | Email format boundary | Signed out | "a@b.c" (1 char after dot) / "a@b.co" | First shows "Enter a valid email address"; second accepted | P2 |
| TC-AUTH-008 | AC-AUTH-005 | Use demo | Error banner visible | — | Fields filled, banner cleared, still signed out | P2 |
| TC-AUTH-009 | AC-AUTH-006 | Deep link then sign in | Signed out | Open /clients, sign in, continue as Training Partner | Lands on All Clients | P1 |
| TC-AUTH-010 | AC-AUTH-007 | Remembered session | Signed in with box ticked | Restart browser | Still signed in | P1 |
| TC-AUTH-011 | AC-AUTH-007 | Tab-only session | Signed in with box unticked | Reload tab, then open a new tab | Reload: still signed in; new tab: Sign in | P1 |
| TC-AUTH-012 | AC-AUTH-008 | Auth page while signed in | Signed in as Training Partner / as Super Admin / with no role chosen | Open /login, /reset-password | Dashboard / Manage Clients / role picker | P1 |
| TC-AUTH-013 | AC-AUTH-013 | Protected page signed out | Signed out | Open /settings | Sign in shown | P0 |
| TC-AUTH-014 | AC-AUTH-009 | Forgot password happy path | Signed out | someone@company.com | Inbox view with the email and 30-minute note | P1 |
| TC-AUTH-015 | AC-AUTH-009 | Resend | On inbox view | — | Spinner, toast "Reset link sent again" / "Check someone@company.com" | P2 |
| TC-AUTH-016 | AC-AUTH-010 | Length boundary | On reset page | "Abc1!xy" (7) / "Abc1!xyz" (8) | 7: "Must be at least 8 characters"; 8: accepted | P1 |
| TC-AUTH-017 | BR-AUTH-011 | Strength boundary | On reset page | "abcdefgh" (1 of 4), "abcdefg1" (2 of 4), "abcdefg1!" (3 of 4) | First two: "Choose a stronger password"; third accepted | P1 |
| TC-AUTH-018 | BR-AUTH-012 | Meter labels | On reset page | "abc", "abcdefgh", "Abcdefg1", "Abcdefg1!", "Abcdefghij1!" | "Too weak", "Weak", "Fair", "Good", "Strong" | P2 |
| TC-AUTH-019 | AC-AUTH-011 | Confirm mismatch | On reset page | "Abcdefg1!" / "Abcdefg1" | "Passwords do not match" | P1 |
| TC-AUTH-020 | BR-AUTH-014 | Reset does not change password (current build) | Completed a reset with "Newpass1!" | Sign in with "Newpass1!" | Rejected; "learnnext123" still works | P2 |
| TC-AUTH-021 | AC-AUTH-012 | Log out cancel and confirm | Signed in as Training Partner on Facilitators | — | Cancel keeps session; confirm shows Sign in, then the toast once Sign in is showing; re-sign-in (Training Partner) returns to Facilitators | P0 |
| TC-AUTH-022 | 5.1 | Terms and Privacy | On any auth page | — | Dialogs "Terms of Service" / "Privacy Policy" close with **Got it** | P3 |
| TC-AUTH-023 | 5.2 | Show/hide password | On Sign in with a typed password | — | Toggle reveals and masks; label changes | P3 |
| TC-AUTH-024 | SH-007 | Double-click Sign in | Valid credentials | Double-click | One sign-in, one toast | P2 |
| TC-AUTH-025 | 5.1 | Phone layout fits | Signed out | 375 × 812 and 375 × 667 | Navy hero on top, form + footer in one white sheet (no line between them), no page scroll at either height; the short screen hides the hero sub-line | P2 |
| TC-AUTH-026 | 5.1 | Desktop unchanged | Signed out | 1280 × 800 | Brand panel left with stack and gliding pills, glass form card right, no scroll | P3 |
| TC-AUTH-027 | AC-AUTH-014 | Picker content | Signed in, no role chosen | Demo account | 4 tiles in 2 columns; Training Partner chosen; Facilitator / Participant disabled "Coming soon"; button "Continue as Training Partner" | P1 |
| TC-AUTH-028 | AC-AUTH-015 | Super Admin landing | Signed out | Open /facilitators, sign in, continue as Super Admin | Manage Clients, toast after load | P0 |
| TC-AUTH-029 | BR-AUTH-021 | Super Admin page limits | Signed in as Super Admin | /dashboard, /settings, /facilitators, /ui-preview, /profile | First four → Manage Clients; /profile opens My Profile | P0 |
| TC-AUTH-030 | AC-AUTH-016 | Remember choice | Picker shown | Tick remember, continue; log out; sign in | Picker skipped; welcome toast shown | P1 |
| TC-AUTH-031 | BR-AUTH-020 | Switch role forgets choice | Remembered choice set | **Switch role**, continue without ticking; log out; sign in | Picker shown again | P2 |
| TC-AUTH-032 | AC-AUTH-017 | Switch role lands on home | Training Partner on /facilitators | **Switch role** → Super Admin → **Switch role** → Training Partner | Manage Clients, then Dashboard | P1 |
| TC-AUTH-033 | AC-AUTH-018 | Switch role respects guard | Add client with a typed name | **Switch role** | "Discard this client?"; **Keep editing** stays | P1 |
| TC-AUTH-034 | AC-AUTH-020 | Sign out from picker | Picker shown | **Sign out** | Sign in, no dialog, no toast | P2 |
| TC-AUTH-035 | BR-AUTH-019 | Portal page without a role | Signed in, picker not answered | Open /clients | Role picker; after **Continue as Training Partner** lands on All Clients | P2 |
| TC-AUTH-036 | 5.9 | Picker on phone | 375 × 812, picker shown | — | Two tiles per row with the icon above the name; names and lines not cut off | P3 |
| TC-AUTH-037 | AC-AUTH-019 | Coming-soon screen | Session in a not-ready role (e.g. via a one-role test login) | Open /dashboard | "The <role> space is on its way"; **Sign out** only (plus **Switch role** for several roles) | P2 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-AUTH-001 | Sign in | No limit on failed attempts, no lockout, no CAPTCHA policy | Brute-force risk | Define attempt limit, lockout duration and message | Open |
| OQ-AUTH-002 | Session | No inactivity timeout or session expiry; the Session expired page is never reached automatically | Unattended portals stay signed in indefinitely | Define timeout length and whether "Keep me signed in" has a maximum age | Open |
| OQ-AUTH-003 | Forgot / Reset password | Reset link is not validated; the stated 30-minute expiry, single use and resend limits are not enforced; Reset password and Reset success open without a link | Anyone can reach the reset form | Define link validity, expiry, reuse and resend throttling, and the expired-link message | Open |
| OQ-AUTH-004 | Reset password | Completing a reset does not change the password; "different from previously used passwords" is not checked | The journey reports success that did not happen | Confirm behaviour once a real back end exists, and how many previous passwords are blocked | Open |
| OQ-AUTH-005 | Sign in | The "Demo account" panel shows real credentials on the sign-in page | Must not reach production | Confirm removal for production builds | Open |
| OQ-AUTH-006 | All auth forms | No maximum length for email or password | Data quality and security | Define maximum lengths | Open |
| OQ-AUTH-007 | Reset password | Policy is minimum 8 characters and 3 of 4 character types; maximum length, spaces and banned/common passwords are not defined | Consistent password policy | Confirm the policy | Open |
| OQ-AUTH-008 | Sign in | Is there a second sign-in factor (one-time code)? Code entry exists only in Profile → Change password | Training Partner and Super Admin accounts hold client and finance data | Confirm whether two-step sign-in is required | Open |
| OQ-AUTH-009 | Auth page frame | Auth pages do not set a browser tab title (differs from SH-009) | After logging out the tab still shows the last portal page's name | Define titles, e.g. "Sign in · LearnNext" | Open |
| OQ-AUTH-010 | Session | Logging out in one tab does not sign out other open tabs until they reload | Shared computers | Confirm whether sign-out should apply to all tabs immediately | Open |
| OQ-AUTH-011 | Sign in | Only one demo account (holding four roles); no user management, and no way to grant or remove a login's roles | Multiple staff need accounts with the right roles | Confirm account provisioning, who assigns portal roles, and per-role access (SH-002) | Open |
| OQ-AUTH-012 | Auth page frame | Terms of Service and Privacy Policy are placeholder text | Legal compliance | Provide final legal copy | Open |
| OQ-AUTH-013 | Auth page frame | Resolved 2026-11-05: the brand panel no longer shows figures or course/instructor wording; it shows only the headline, the brand line and feature names | — | — | Resolved |
| OQ-AUTH-014 | Log out | Logging out returns the user to the same page on the next sign-in in that tab | Could be unexpected on a shared computer | Confirm intended | Open |
| OQ-AUTH-015 | Role picker | "Remember my choice on this device" never expires, survives sign-out and can only be cleared through **Switch role** (there is no setting for it in My Profile) | A shared device keeps skipping the picker; users may not find how to undo it | Confirm expiry, whether sign-out should clear it, and whether My Profile needs a "Default role" setting | Open |
| OQ-AUTH-016 | Role picker / landing | Chosen in the picker, Super Admin always opens Manage Clients; with a remembered Super Admin choice, a requested Manage Clients address (for example a client's address from a Training Partner bookmark) is opened as is, and may point to a different record or none | Inconsistent landing; possible "not found" or wrong record | Confirm that Super Admin should always land on Manage Clients, also with a remembered choice | Open |
| OQ-AUTH-017 | Role picker, coming-soon screen | **Sign out** there ends the session at once, with no confirmation and no "You have been signed out" toast, unlike **Log out** in the user menu | Inconsistent sign-out feedback | Confirm whether these should confirm and/or show the toast | Open |
| OQ-AUTH-018 | Coming-soon roles | Facilitator, Participant and Client SPOC portals are not built; their launch scope and timing, and whether coming-soon roles should be listed in the picker at all, are not defined | Users see roles they cannot use | Confirm scope, timing and picker visibility | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and features inventory: Complete (Sign in, Forgot password, Check your inbox, Reset password, Reset success, role picker, coming-soon screen, Switch role, frame, guards, session, log out)
- [x] User roles and access: Complete (Training Partner, Super Admin, coming-soon roles; role provisioning open, see OQ-AUTH-011)
- [x] Page functionality and behaviour: Complete
- [x] User workflows: Complete
- [x] Field-level specifications: Complete for all fields
- [ ] Minimum and maximum constraints, where known: Incomplete (maximum lengths not defined, see OQ-AUTH-006, OQ-AUTH-007)
- [x] Validation and business rules: Complete
- [x] Success messages and feedback: Complete
- [x] Search, filters, tables and listings: Not applicable (no lists in this module)
- [x] Empty states, errors and edge cases: Complete
- [ ] Security rules (lockout, expiry, reset link validity): Incomplete (see OQ-AUTH-001, OQ-AUTH-002, OQ-AUTH-003)
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria: Complete
- [x] QA test scenarios: Complete
- [x] Open questions logged: Complete
