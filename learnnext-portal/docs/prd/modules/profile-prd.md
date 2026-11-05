# My Profile: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | My Profile PRD |
| Module name | My Profile |
| Document ID | PRD-PROF |
| Version | 1.2 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (personal details, profile picture and cover are saved and remembered in this browser; the password change is a simulation with a fixed demo code that does not change the sign-in password; "My activity" records only profile and password changes made on this page) |
| Last updated | 2026-11-03 (v1.1: phone layout; v1.2: cover picker with Static / Animated covers and a live preview, 12 static covers, slim drag-and-drop photo uploader, avatar tweaks, tabbed layout on phones) |
| Phone layout (v1.1–1.2) | **Tabs like Client details:** the profile banner with section tabs joined to its bottom edge — **Personal details** (the form), **Security** (Security + Account cards), **Activity** (summary + timeline, its own heading hidden) — one section at a time, the open tab kept in the address (/profile?tab=security / activity) and the tab bar pinned under the top bar while scrolling. Desktop keeps the one-page layout. Contact strip, password panel and activity summary lose their inner boxes (rows under dashed lines; the activity summary shows only the period, count and comparison — no "By type" list on phones); password key tile and the one-time-code hint hidden; shorter card sub-texts ("Your details on LearnNext.", "Password and sign-in.", "Set by your organisation.", "Your latest actions."). See SH-013. |
| Related modules/pages | [Authentication](authentication-prd.md), [App shell and navigation](app-shell-navigation-prd.md), [Dashboard](dashboard-prd.md), [Client detail](client-detail-prd.md) (Activity tab), [System pages](system-pages-prd.md), [Settings: access masters](settings-access-masters-prd.md), [Support desk](support-desk-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

My Profile is the signed-in Admin user's own page. It lets the user:

- see how they appear to colleagues (name, role, designation, department, contact details, length of membership);
- edit their personal details (name, email address, mobile number, location, department, designation and a short "About" line);
- choose a profile picture (one of 18 built-in illustrated avatars, an uploaded photo, or plain initials) and a cover banner (a still artwork or an animated scene);
- check password health and change the password after confirming their identity with a one-time code;
- view read-only account facts managed by the organisation (employee ID, access level, last sign-in);
- review their own recent activity in a filterable timeline.

The objective is a single, calm place where an Admin keeps their identity current. Changes made here appear immediately wherever the signed-in user is shown (header user menu, Dashboard greeting, attribution of new records).

In the current build all data is demo data (SH-001). Profile changes are remembered in this browser across reloads; the password change does not affect the actual sign-in password (see [authentication-prd.md](authentication-prd.md)).

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| My Profile page | Own identity, security and activity | Admin user (signed in) | Open from the header user menu (**My Profile**) | Header user menu ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)) |
| Profile banner | Show who the user is | Admin user | View cover, avatar, name, role, designation, department; **Change cover**; **Change avatar**; click the picture; copy email/mobile; email/call links | Cover picker, Avatar picker |
| Cover picker ("Choose a cover") | Choose one of 12 static or 6 animated covers | Admin user | Switch **Static** / **Animated**, select a cover, **Apply cover**, **Cancel** | Profile banner |
| Profile picture view | See the current picture large | Admin user | **Close**, **Change photo** | Avatar picker |
| Avatar picker ("Choose your profile picture") | Choose an illustrated avatar, upload a photo or use initials | Admin user | **Avatars** tab, **Upload photo** tab, **Use initials**, **Save avatar**, **Cancel** | Profile banner, header user menu |
| Personal details | Edit own details | Admin user | Edit fields, **Save changes**, **Discard** | Profile banner, header user menu |
| Security | Password health and entry to the password change | Admin user | **Change password**, **Renew** | Change password dialog |
| Change password dialog | Change the password after one-time-code verification | Admin user | Choose channel, **Send code**, enter code, **Verify code**, **Resend code**, enter new password, **Update password**, **Done** | Security, My activity |
| Account | Read-only account facts | Admin user | Copy employee ID | [settings-access-masters-prd.md](settings-access-masters-prd.md) (roles) |
| My activity | Own recent actions | Admin user | Filter by type and date range, **Clear**, **Show more**, **Secure your account** | Change password dialog |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Admin user (signed in) | My Profile, for their own account only (SH-002) | Edit own details, picture and cover; change own password; view own account facts and activity | Cannot edit Employee ID, Access level or Last sign-in. There is no way to open another user's profile |
| Visitor (not signed in) | None | None | Redirected to Sign in (SH-003) |
| Facilitators, client SPOCs, participants | None | None | They are records, not users of this console (SH-002) |

No role-specific restrictions apply on this page (SH-002).

## 5. Page Functionality and Behavior

### 5.1 Page frame

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Entry point | Reach the page | Header user menu → **My Profile** | Opens My Profile. The page is not in the sidebar | Leaving another page with unsaved changes may be intercepted first (SH-006) | Page shown |
| Breadcrumb and tab title | Orient the user | View | Breadcrumb "My Profile"; browser tab "My Profile · LearnNext" (SH-009) | — | — |
| Layout | Group the content | View | Top to bottom: profile banner; then Personal details (two-thirds width) beside a column with Security and Account; then My activity. On smaller screens the sections stack | Sections fade in one after another | — |
| No signed-in user | Safety | — | Nothing is shown | Normally unreachable because the page requires sign-in (SH-003) | Blank page |

### 5.2 Profile banner

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Cover | Personal touch | View | The chosen cover (a still artwork or an animated scene) fills the top of the banner. While any profile dialog (cover, avatar, password) is open, an animated cover pauses and resumes when it closes. "My profile" appears as a small label top-left | Default cover is "Firefly night". Animations stop when the device asks for reduced motion. Same in light and dark themes | — |
| **Change cover** (bottom-right of the cover) | Change the cover | Click | Opens "Choose a cover" (5.3) | On phones only the palette icon shows (label "Change cover") | Cover picker open |
| Profile picture (in a slowly turning colour ring) | Show and change the picture | Click | If a picture is set: opens the large view (5.4). If no picture: opens the avatar picker directly (5.5) | Accessible label "View profile picture" or "Add profile picture". Without a picture, initials are shown. A picture that fails to load falls back to initials | Dialog open |
| Name | Identity | View | The user's full name as the page heading | Updates as soon as Personal details are saved | — |
| Role pill | Access level | View | Shows the role (demo: "Admin") with a shield icon | Read-only | — |
| Designation · Department line | Job context | View | Shows designation and department. If empty: "Add your designation" / "Add your department" | Both fields are required in Personal details, so the fallback normally appears only for incomplete data | — |
| **Change avatar** | Change the picture | Click | Opens the avatar picker (5.5) | — | Picker open |
| Contact strip: **Email** | Show and use the email | View, click, copy | Shows the email as a link that opens a new email; a copy button copies it | Copy button label "Copy email", then "Copied" with a tick for 1.5 seconds. On larger screens the button appears on hover or keyboard focus | Email copied |
| Contact strip: **Mobile** | Show and use the mobile number | View, click, copy | Shows the number as a link that starts a call; copy button as above ("Copy mobile") | — | Number copied |
| Contact strip: **Location** | Show where the user is based | View | Plain text | Shows "Not added" when empty (Location is optional) | — |
| Contact strip: **Member since** | Length of membership | View | Month and year the user joined (for example "Oct 2023") | Read-only; not editable anywhere | — |
| Copy failure | Robustness | Copy when the browser blocks the clipboard | Nothing happens; no message | — | OQ-PROF-013 |

### 5.3 Cover picker ("Choose a cover")

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Dialog | Choose a cover | Open via **Change cover** | Title "Choose a cover", description "Animated scenes or calm still art — pick the one that feels like you." Opens with the current cover selected, on its style (Static or Animated) | Closes with ×, Esc, backdrop or **Cancel** (SH-006); nothing is saved | — |
| Preview | See the result before applying | View | A large preview of the selected cover with a chip "Preview" (static) or "Live preview" (animated), "✓ Current" when it is the saved cover, and below it the user's photo, name and "<cover name> · <description>" | Only the preview animates; the profile cover behind the dialog pauses while it is open (BR-PROF-014) | — |
| Style switch **Static** / **Animated** | Choose the kind of cover | Click | The same segmented switch used elsewhere (e.g. the Dashboard period). Shows that style's covers below and moves the preview to the cover last picked in that style (or its first cover) | Static is listed first | — |
| Cover swatches | Pick a cover | Click | A row of 4:3 swatches with names (six per row; three per row on phones). Clicking selects one (blue ring and tick) and updates the preview. Hovering an animated swatch plays it; otherwise swatches are still | 12 static and 6 animated covers (BR-PROF-012) | — |
| **Apply cover** | Save | Click | Spinner while saving, then the dialog closes, the banner cross-fades to the new cover and the toast "Cover updated" appears (SH-005). An entry is added to My activity | Disabled while the selected cover equals the current one | Cover changed |
| **Cancel** | Abandon | Click | Closes without saving | — | — |

### 5.4 Profile picture view

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Large view | See the picture | Click the picture in the banner | Dialog titled with the user's name, description "Profile picture", showing the picture large | Only when a picture is set | — |
| **Close** | Dismiss | Click | Closes the dialog | Also ×, Esc, backdrop (SH-006) | — |
| **Change photo** | Change the picture | Click | Closes the view and opens the avatar picker (5.5) | — | Picker open |

### 5.5 Avatar picker ("Choose your profile picture")

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Dialog | Choose a picture | Open via **Change avatar**, **Change photo** or the picture (when none is set) | Title "Choose your profile picture", description "Pick an avatar or upload your own photo." Nothing is saved until **Save avatar** | Closes with ×, Esc, backdrop or **Cancel** without saving (SH-006). Each opening starts from the current picture | — |
| Preview panel | Show the result before saving | View | Shows the selected picture with the user's name and one of: "<avatar name> · Avatar", "Your photo" or "Initials" | Updates on every selection | — |
| Tabs **Avatars** / **Upload photo** | Choose the source | Click | Switch between the avatar grid and the upload area | Opens on **Upload photo** when the current picture is an uploaded photo (the demo user's starting picture is a photo), otherwise on **Avatars** | — |
| Avatar grid | Pick a built-in illustration | Click an avatar | Selects it (gradient ring and tick); preview updates | 18 illustrated people in man/woman pairs on pastel backgrounds: Arjun, Aanya, Kabir, Sara, Rohan, Meera, Harpreet, Ira, Dev, Zoya, Aditya, Kiara, Vikram, Tara, Rahul, Leela, Kunal, Nisha. Each has a tooltip and accessible label "<name> avatar" | — |
| Upload area | Use own photo | Click or drag and drop a file | A slim dashed row: image icon, "Drag & drop a photo, or browse" and the hint "JPG, PNG or WebP · up to 5 MB · cropped to a square". While a file is dragged over it the row turns soft blue and reads "Drop to upload". A valid image is centre-cropped to a square and selected | See 7.2 and BR-PROF-008 | Photo selected |
| "Your photo" card | Re-select the uploaded photo | Click | Shows the uploaded photo with "Selected — save to apply" when selected, or "Click to use this photo" after choosing something else | Appears once a photo is uploaded (or when the current picture is a photo) | Photo selected |
| **Use initials** (red text button) | Remove the picture | Click | Selects "no picture"; preview shows initials | Disabled when no picture is selected | — |
| **Save avatar** | Save the choice | Click | Spinner, then the dialog closes and a toast appears: "Profile picture updated", or "Profile picture removed" when initials were chosen. An entry is added to My activity. The new picture appears in the banner and the header user menu immediately | Disabled until the selection differs from the current picture | Picture changed |
| **Cancel** | Abandon | Click | Closes without saving | — | — |

### 5.6 Personal details

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Explain the section | View | "Personal details" with "How you appear to your team across LearnNext." | — | — |
| Fields | Edit own details | Type, choose | Full name, Email address, Mobile number, Location, Department, Designation, About. Pre-filled with the current values | See 7.1. Validation follows SH-004 | — |
| Save bar status | Show whether there are unsaved edits | View | "All changes saved" (green tick) when nothing has changed; "You have unsaved changes" (highlighted bar, pulsing dot) after any edit | A field counts as changed only when its value differs after removing surrounding spaces | — |
| **Discard** | Undo edits | Click | Restores the saved values and clears errors | Disabled when nothing has changed or while saving | Form reset |
| **Save changes** | Save | Click or press Enter in a field | Validates all fields (SH-004). If valid: spinner (about 0.6 s), values saved with surrounding spaces removed, toast "Profile updated", status returns to "All changes saved". The banner, header user menu and Dashboard greeting show the new values. An entry is added to My activity | Disabled when nothing has changed. With errors, nothing is saved | Details saved |
| Leaving with unsaved edits | Protect edits | Navigate away | No warning is shown; the edits are lost [Partially Implemented] | Differs from full-page forms that intercept leaving (SH-006); see OQ-PROF-009 | — |

### 5.7 Security

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Explain the section | View | "Security" with "Keep your account protected." | — | — |
| Password panel | Password health | View | "Password" and either "Last changed <age>" or "Never changed" | Age wording: "today", "yesterday", "N days ago" (up to 30 days), "N month(s) ago", "N year(s) ago" | — |
| Freshness bar | Show how soon a change is due | View | A thin bar, full right after a change and emptying over 90 days. Green while within 90 days; amber when older than 90 days or never changed | Never shows less than a small sliver once a change date exists | — |
| Due line | Rotation guidance | View | "Change due every 90 days" with either "N days left" (within 90 days) or a **Renew** link (older than 90 days or never changed) | BR-PROF-014. Guidance only; nothing is blocked | — |
| **Renew** | Shortcut | Click | Opens the Change password dialog (5.8) | Only shown when overdue | Dialog open |
| **Change password** | Start the change | Click | Opens the Change password dialog (5.8) | Note below the button: "We’ll verify it’s you with a one-time code" | Dialog open |

### 5.8 Change password dialog

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Dialog | Verified password change | Open | Title "Change password", description "We’ll confirm it’s you with a one-time code first." A three-step progress bar: "Verify", "Code", "Password" | Always starts fresh at step 1 with Email selected. Closes with × or Esc at any step; **clicking the backdrop does not close it** (differs from SH-006, OQ-PROF-012). Closing mid-way discards progress | — |
| Step 1: channel choice | Choose where the code goes | Choose a card | Text "Where should we send your 6-digit verification code?" and two option cards under "Send code by": "Email" and "SMS to mobile", each showing the masked destination (for example "a••••@learnnext.io", "+•• ••••• •1120") | Destinations are the current profile email and mobile number. Email is preselected | — |
| **Send code** | Send the code | Click | Spinner (about 0.8 s), then step 2 | If sending fails, a red message appears on step 1 (BR-PROF-021) | Step 2 |
| **Cancel** (step 1) | Abandon | Click | Closes the dialog | — | — |
| Step 2: sent message | Confirm sending | View | "We sent a code to <masked destination>. It expires in <m:ss>." The countdown starts at 5:00 and turns amber below one minute | BR-PROF-017 | — |
| **Verification code** | Enter the code | Type or paste | Six single-digit boxes; focus starts in the first. Typing moves to the next box; Backspace and arrow keys move back and forth; pasting fills the boxes; non-digits are ignored | When the sixth digit is entered, the code is checked automatically | — |
| **Verify code** | Check the code | Click or Enter | Spinner (about 0.7 s); boxes disabled while checking. Correct: step 3. Wrong: error under the boxes, boxes cleared and focus back in the first box | Disabled until six digits are entered | Step 3 or error |
| Resend line | Get a new code | Wait, then click | "Didn’t get it?" with "Resend in 0:30" counting down; then a **Resend code** link. Resending sends a new code, clears the boxes and restarts both timers | No limit on resends (OQ-PROF-004) | New code |
| Demo mode note | Make the demo usable | View | Info box "Demo mode": "Use code 246810" | Present while verification is simulated (OQ-PROF-004) | — |
| **Back** (step 2) | Change channel | Click | Returns to step 1 | Disabled while checking | Step 1 |
| Step 3: new password | Set the password | Type | Green note "Identity verified. Choose a strong new password." Fields New password and Confirm password with show/hide toggles, and the strength meter and checklist (same as Reset password in [authentication-prd.md](authentication-prd.md)) | See 7.4. No "current password" field: the one-time code replaces it (OQ-PROF-003) | — |
| **Update password** | Save | Click or Enter | Validates (SH-004). If valid: spinner (about 0.8 s), then the success view, toast "Password changed", Security shows "Last changed today" with "90 days left", and My activity gains an entry | The sign-in password is not actually changed in the current build [Partially Implemented] (OQ-PROF-003) | Success view |
| **Cancel** (step 3) | Abandon | Click | Closes without changing anything | Disabled while saving | — |
| Success view | Confirm | View | Title "Password updated", success icon, "You’re all set" and "Your password has been changed. Use the new one the next time you sign in." | Progress bar hidden | — |
| **Done** | Finish | Click | Closes the dialog | — | — |

### 5.9 Account

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Explain the section | View | "Account" with "Managed by your organisation." | Read-only | — |
| **Employee ID** | Staff identifier | View, copy | Shows the ID (demo: "LN-0142") with a copy button ("Copy employee ID", then "Copied" for about 1.6 s) | Not editable | ID copied |
| **Access level** | Role | View | Shows the role (demo: "Admin") | Not editable here; not linked to the Roles & Access master (SH-002, OQ-PROF-011) | — |
| **Last sign-in** | Recent access | View | Relative time (SH-012), for example "42m ago"; older than a week shows a date | In the current build this is a fixed demo value and does not reflect the real sign-in time [Partially Implemented] (OQ-PROF-008) | — |
| Missing value | Robustness | — | "—" (SH-012) | — | — |

### 5.10 My activity

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Card header | Explain the section | View | "My activity" with the total number of entries beside it, and "Everything you’ve done across LearnNext, newest first." | The same timeline (with a different type list) is used on the client Activity tab ([client-detail-prd.md](client-detail-prd.md)) | — |
| Period summary (left on large screens) | Summarise a period | View | Period label ("Last 30 days", or the chosen date range), the number of activities in it, a comparison line ("N more than the previous 30 days", "N fewer than…", "Same as…"; "the previous period" for a custom range) and a "By type" list with a count per type | Comparison is hidden when there is no earlier activity. The summary stays in view while scrolling on large screens | — |
| "By type" rows | Quick filter | Click a type | Filters the timeline to that type; other rows fade; clicking again or **Show all** returns to all | — | Filtered |
| Result count | Show matches | View | "N activities" ("activity" for one), plus " in this period" when a date range is set | — | — |
| **Activity type** filter | Filter by type | Choose | "All activity" plus only the types present: Projects, Finance, Content, Security, Profile | See section 10 | Filtered |
| Date range ("From – To") | Filter by date | Choose dates or a preset | Presets: "Today", "Last 7 days", "Last 30 days", "Last 90 days". The end day is included | — | Filtered |
| **Clear** | Reset filters | Click | Resets type and date range | Shown only while a filter is active | All activity |
| Day groups | Readable timeline | View | Entries grouped under "Today", "Yesterday" or a weekday and date (year added for earlier years), each with a count | — | — |
| Entry | Describe one action | View | Coloured icon by type, a sentence such as "Approved invoice **INV-2025-0418**", the time (for example "9:30 AM"), a detail line and, for money actions, a compact amount (SH-012) | — | — |
| Unfamiliar sign-in entry | Security alert | View, click | Amber warning icon and "Wasn’t you? **Secure your account**" | **Secure your account** opens the Change password dialog | Dialog open |
| **Show more** | Load older entries | Click | Shows 8 more entries | 8 entries at first; shown while more remain | More entries |
| Live updates | Keep the feed current | Save details, picture, cover or password | The timeline reloads and the new entry appears under "Today" | Only actions on this page are recorded (OQ-PROF-007) | — |

## 6. User Workflow

### 6.1 Edit personal details

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Opens **My Profile** from the header user menu | Page loads with current values | — | Status "All changes saved"; **Save changes** disabled |
| 2 | Changes one or more fields | Status changes to "You have unsaved changes" | Format errors on leaving a typed field (SH-004) | **Save changes** and **Discard** enabled |
| 3a | Clicks **Discard** | Restores saved values | — | "All changes saved" |
| 3b | Clicks **Save changes** | Shows required/format errors, or saves | BR-PROF-001 to BR-PROF-007 | — |
| 4 | — | Toast "Profile updated"; banner, header and Dashboard greeting update; My activity gains "Updated your …" | — | Details saved and remembered in this browser |

### 6.2 Change profile picture

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Clicks **Change avatar** (or the picture, then **Change photo**) | Opens "Choose your profile picture" | — | Current picture in the preview |
| 2a | Picks an avatar on **Avatars** | Preview shows it | — | — |
| 2b | Uploads a photo on **Upload photo** | Checks type and size; crops to a square; selects it | BR-PROF-008 | "Selected — save to apply" |
| 2c | Clicks **Use initials** | Preview shows initials | — | — |
| 3 | Clicks **Save avatar** | Saves, closes, toast | Disabled if unchanged | "Profile picture updated" or "Profile picture removed" |

### 6.3 Change cover

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Clicks **Change cover** | Opens "Choose a cover" with the current one ticked | — | — |
| 2 | Selects another cover, clicks **Apply cover** | Saves and closes | Disabled if unchanged | Banner shows the new scene; toast "Cover updated" |

### 6.4 Change password

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Clicks **Change password** (or **Renew**, or **Secure your account** in My activity) | Opens the dialog at "Verify" | — | Email preselected |
| 2 | Chooses Email or SMS to mobile, clicks **Send code** | Sends the code | — | "Code" step with 5:00 expiry countdown |
| 3 | Enters the six digits | Checks automatically on the sixth digit | BR-PROF-016 to BR-PROF-019 | Wrong: "That code isn’t right. Check it and try again." Correct: "Password" step |
| 4 | (Optional) After 30 s clicks **Resend code** | New code sent, timers restart | — | — |
| 5 | Enters and confirms a new password, clicks **Update password** | Validates and saves | BR-PROF-022 to BR-PROF-024 | Success view, toast "Password changed" |
| 6 | Clicks **Done** | Closes | — | Security shows "Last changed today" and "90 days left" |

For a forgotten password (signed out), see the Forgot/Reset password journey in [authentication-prd.md](authentication-prd.md).

### 6.5 Review activity

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Scrolls to My activity | Shows 8 newest entries and the 30-day summary | — | — |
| 2 | Chooses a type and/or a date range | Filters entries and the count; the summary follows the date range | — | Filtered list or "No activity in this view" |
| 3 | Clicks **Show more** | Adds 8 more entries | — | — |
| 4 | Clicks **Clear** or **Show all activity** | Removes filters | — | All entries |

## 7. Forms and Field-Level Specifications

### 7.1 Personal details form

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Full name | Text box (placeholder "e.g. Atul Kumar") | Name shown across LearnNext | Required | 2 characters (spaces counted, see BR-PROF-002) | Requires Confirmation | Any characters | Current name (demo: "Atul Kumar") | Required on save; minimum length on blur and save (SH-004). Trimmed when saved | Updates banner, header user menu, Dashboard greeting and attribution of new records | "Enter your full name"; "Name looks too short" |
| Email address | Email text box (placeholder "you@company.com") | Contact email | Required | Requires Confirmation | Requires Confirmation | Text, "@", domain, ".", at least 2 characters after the dot, no spaces (SH-004) | Current email (demo: "admin@learnnext.io") | Required on save; format on blur and save. Surrounding spaces fail the format check (they are not removed before checking) | Used as the "Email" destination for one-time codes. Does not change the sign-in email (OQ-PROF-001) | "Enter your email address"; "Enter a valid email address" |
| Mobile number | Phone text box (placeholder "+91 98765 43210") | Contact number | Required | 7 characters (a "+" or digit followed by at least 6 more allowed characters) | Requires Confirmation | Starts with "+" or a digit, then digits, spaces, brackets, dots or dashes (SH-004 phone rule) | Current number (demo: "+91 98200 41120") | Required on save; format on blur and save | Used as the "SMS to mobile" destination for one-time codes | "Enter your mobile number"; "Enter a valid mobile number" |
| Location | Text box (placeholder "City, country") | Where the user is based | Optional | N/A | Requires Confirmation | Any text | Current location (demo: "Mumbai, India") | None. Trimmed when saved | Banner shows "Not added" when empty | N/A |
| Department | Drop-down (placeholder "Choose a department") | Organisational unit | Required | N/A | N/A | Learning Operations, Finance & Billing, Content & Curriculum, Facilitator Network, Client Success, Sales & Partnerships, Technology, Human Resources | Current department (demo: "Learning Operations") | Required on save. The placeholder can be re-selected, which empties the field | Shown in the banner | "Choose your department" |
| Designation | Text box (placeholder "e.g. Program Manager") | Job title | Required | Requires Confirmation | Requires Confirmation | Any text | Current designation (demo: "Head of Learning Operations") | Required on save. Trimmed when saved | Shown in the banner | "Enter your designation" |
| About | Multi-line text box with counter (placeholder "A short line about your role, shown to your team") | Short bio | Optional | N/A | 240 characters | Any text | Current bio | Typing and pasting stop at 240 characters; a counter shows "N/240". Trimmed when saved | Where the bio is shown to the team is not defined (OQ-PROF-014) | "Must be 240 characters or fewer" (practically unreachable because input stops at 240) |

### 7.2 Avatar picker

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Picture source | Tabs ("Avatars", "Upload photo") | Choose where the picture comes from | Optional | N/A | N/A | Avatars / Upload photo | Upload photo when the current picture is a photo; otherwise Avatars | None | Switching tabs keeps the current selection | N/A |
| Avatar | Grid of 18 selectable pictures | Built-in illustration | Optional (one picture choice) | N/A | N/A | One of the 18 named avatars (5.5) | Current avatar ticked, if it is one | None | Selecting replaces any other selection | N/A |
| Photo upload | File picker with drag and drop ("Upload image") | Own photo | Optional | N/A | 5 MB (5,242,880 bytes) | Hint says "JPG, PNG or WebP"; the check accepts any image type (OQ-PROF-005). Result is centre-cropped to a square | Current photo, when the current picture is a photo | Type and size checked immediately on choosing a file | A valid photo is selected automatically; the "Your photo" card appears | "Please choose an image file." (not an image); "Image must be under 5.0 MB." (too large) |
| Use initials | Button | Remove the picture | Optional | N/A | N/A | — | — | None | Disabled when no picture is selected | N/A |

### 7.3 Cover picker

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Cover | Style switch + selectable swatches | Banner cover | Required (exactly one) | N/A | N/A | Static: Aurora, Dawn hills, Alpine, Topography, Facets, Paper waves, Dunes, Bloom, Moon lake, Terrazzo, Leaves, Seascape. Animated: Firefly night, Lantern festival, Galaxy, Deep ocean, Synthwave, Midnight city | Current cover; "Firefly night" if none | None | **Apply cover** enabled only when different from the current cover | N/A |

### 7.4 Change password dialog

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Send code by | Two option cards ("Email", "SMS to mobile") | Code delivery channel | Required | N/A | N/A | Email / SMS to mobile, each with the masked profile email or mobile number | Email | None | — | Sending failure: the service's message, or "Couldn’t send the code. Try again." |
| Verification code | Six single-digit boxes | One-time code | Required | 6 digits | 6 digits | Digits only (other characters ignored) | Empty | Checked automatically on the sixth digit or on **Verify code**; must match the code sent and be within 5 minutes | **Verify code** disabled until 6 digits; boxes cleared after a wrong code | "Enter all 6 digits."; "This code has expired. Send a new one."; "That code isn’t right. Check it and try again." |
| New password | Password box with show/hide toggle (placeholder "Create a password") | New secret | Required | 8 characters | Requires Confirmation | At least 3 of 4: 8+ characters; upper and lowercase letters; a number; a symbol (any non-letter, non-digit, including spaces) | Empty | Checked in order, first failure shown: required → minimum length → strength. Required on submit; others on blur and submit (SH-004) | Drives the strength meter and checklist live (BR-PROF-023) | "Enter a new password"; "Must be at least 8 characters"; "Choose a stronger password" |
| Confirm password | Password box with show/hide toggle (placeholder "Repeat the password") | Avoid typos | Required | N/A | N/A | Must equal New password exactly | Empty | Required on submit; match on blur and submit; re-checked when New password changes | — | "Confirm your new password"; "Passwords do not match" |

### 7.5 My activity filters

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Activity type | Drop-down | Filter by type | Optional | N/A | N/A | "All activity" and the types present (Projects, Finance, Content, Security, Profile) | All activity | None | Resets the list to the first 8 entries | N/A |
| From – To | Date range picker with presets | Filter by date | Optional | Requires Confirmation | Requires Confirmation | A start and end day, or Today / Last 7 days / Last 30 days / Last 90 days | Empty (all time) | End day inclusive | Changes the summary period and comparison | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-PROF-001 | Required details | Full name, Email address, Mobile number, Department and Designation must be filled | Save changes | Errors on save only (SH-004) | Empty or spaces only | Field-specific messages in 7.1 |
| BR-PROF-002 | Name length | Full name at least 2 characters. Length counts surrounding spaces, so " A" passes and is saved as "A" | Save changes, blur | Error on blur and save | "A" | "Name looks too short" |
| BR-PROF-003 | Email format | Standard email format (SH-004) | Blur, save | — | "atul@learnnext" | "Enter a valid email address" |
| BR-PROF-004 | Mobile format | Generic phone pattern (SH-004); no country-specific length | Blur, save | — | "98-12" | "Enter a valid mobile number" |
| BR-PROF-005 | About length | At most 240 characters | Typing | Input stops at 240; counter "240/240" | — | Counter |
| BR-PROF-006 | Trimming and change detection | Values are saved without surrounding spaces; adding only spaces does not count as a change | Save changes | **Save changes** stays disabled if only spaces were added | — | Status "All changes saved" |
| BR-PROF-007 | Profile changes are global | Saved name, email and picture replace the signed-in user's details everywhere at once and are remembered in this browser across reloads (SH-001) | After any save | Header user menu, Dashboard greeting, error screens and new-record attribution use the new values | — | — |
| BR-PROF-008 | Photo upload limits | Image files only, up to 5 MB, centre-cropped to a square | Upload photo | Rejected files are not selected | PDF; 6 MB JPG | "Please choose an image file."; "Image must be under 5.0 MB." |
| BR-PROF-009 | Accepted image types [Requires Confirmation] | Hint lists JPG, PNG or WebP, but any image type is accepted | Upload photo | GIF and other image types are accepted | — | OQ-PROF-005 |
| BR-PROF-010 | Saving only on confirmation | Avatar and cover choices are saved only on **Save avatar** / **Apply cover**; those buttons are disabled when nothing changed | Pickers | Closing discards | — | — |
| BR-PROF-011 | Initials fallback | With no picture, or when the picture cannot load, the user's initials are shown | Everywhere the user's picture appears | — | — | — |
| BR-PROF-012 | Cover catalogue | Twelve static covers — Aurora ("Soft northern lights over a starry navy sky"), Dawn hills, Alpine, Topography, Facets, Paper waves, Dunes, Bloom, Moon lake, Terrazzo, Leaves, Seascape — and six animated covers: Firefly night ("Moonlit forest with glowing fireflies"), Lantern festival ("Sky lanterns rising over a dusk lake"), Galaxy ("Nebula, shooting stars & a ringed planet"), Deep ocean ("Light rays, rising bubbles & rolling waves"), Synthwave ("Retro sun, mountains & a neon grid"), Midnight city ("Skyline windows, a blinking tower & a passing plane"). Default Firefly night | Cover picker, banner | An unknown stored cover shows Firefly night | — | — |
| BR-PROF-013 | Reduced motion | Looping cover and ring animations stop when the device requests reduced motion | Banner, pickers | — | — | — |
| BR-PROF-014 | Smooth pickers | In the cover picker only the large preview animates (swatches play only on hover / focus); the animated profile cover pauses while any profile dialog is open | Banner, cover picker | Keeps the dialogs smooth on phones and older computers | — | — |
| BR-PROF-014 | Password rotation guidance | A password older than 90 days (or never changed) is shown as due, with an amber bar and **Renew** | Security card | Advisory only; sign-in is not blocked [Requires Confirmation] | 96 days (demo starting value) | "Renew" |
| BR-PROF-015 | Verified password change | A password can be changed only after a one-time code sent to the profile email or mobile is verified | Change password | — | — | — |
| BR-PROF-016 | Code length | The code has exactly 6 digits | Code step | Verify disabled until 6 digits | Fewer digits submitted with Enter | "Enter all 6 digits." |
| BR-PROF-017 | Code expiry | A code is valid for 5 minutes from sending | Code step | Countdown; amber below 1:00 | Verifying at 0:00 | "This code has expired. Send a new one." |
| BR-PROF-018 | Wrong code | Only the code sent is accepted (demo: always 246810) | Code step | Boxes cleared, focus back to the first box | Any other 6 digits | "That code isn’t right. Check it and try again." |
| BR-PROF-019 | Attempt limit [Requires Confirmation] | No limit on wrong codes | Code step | — | — | OQ-PROF-004 |
| BR-PROF-020 | Resend wait | **Resend code** becomes available 30 seconds after each send; unlimited resends | Code step | "Resend in 0:30" countdown | — | — |
| BR-PROF-021 | Send failure | If the code cannot be sent, the user stays on step 1 | Send code | Red message | Service failure | The service's message or "Couldn’t send the code. Try again." |
| BR-PROF-022 | New password policy | Same as the reset policy: at least 8 characters and at least 3 of the 4 checklist items (BR-AUTH-010, BR-AUTH-011) | Password step | Errors on blur and submit | "abcdefg1" | "Choose a stronger password" |
| BR-PROF-023 | Strength meter | Same scoring and labels as BR-AUTH-012 ("Too weak", "Weak", "Fair", "Good", "Strong"; "—" when empty); checklist "At least 8 characters", "Upper & lowercase letters", "A number", "A symbol" | Password step | Guidance only | — | — |
| BR-PROF-024 | Confirm match | Confirm password must equal New password | Password step | Error on blur and submit | Different values | "Passwords do not match" |
| BR-PROF-025 | Password change takes effect [Not Implemented] | A completed change should replace the sign-in password | Update password | The current build only records the change date and an activity entry; the old password still signs in | — | OQ-PROF-003 |
| BR-PROF-026 | Activity recording | Saving details ("Updated your …", detail "Personal details"), the picture ("Changed your profile picture" / "Removed your profile picture", detail "Visible across LearnNext"), the cover ("Switched your profile cover", detail "New animated cover") and the password ("Changed your password", detail "Verified with a one-time code") add an entry dated now | After each save | For details, up to two changed field names are listed ("name & email"); more show "name, email +N more". No entry if no field actually changed | — | Entry appears under "Today" |
| BR-PROF-027 | Activity scope [Partially Implemented] | My activity should show everything the user did across LearnNext; only actions on this page are recorded; other entries are fixed demo entries | My activity | — | Creating a client elsewhere | Not listed (OQ-PROF-007) |
| BR-PROF-028 | Read-only account facts | Employee ID, Access level, Member since and Last sign-in cannot be edited by the user | Account card, banner | — | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Save personal details | Valid changes | Success toast (SH-005) | "Profile updated" | After about 0.6 s | Continue |
| Save picture | Avatar or photo chosen | Success toast | "Profile picture updated" | After saving | — |
| Save picture | Initials chosen | Success toast | "Profile picture removed" | After saving | — |
| Apply cover | New cover | Success toast | "Cover updated" | After saving | — |
| Any profile save fails | Service error | Error toast | "Couldn’t save your profile" with the error detail | After the failed save; the form or dialog stays open | Retry |
| Change password | Completed | Success toast and success view | Toast "Password changed"; view "Password updated" / "You’re all set" / "Your password has been changed. Use the new one the next time you sign in." | After about 0.8 s | **Done** |
| Identity verified | Correct code | Inline success note | "Identity verified. Choose a strong new password." | On the Password step | Enter new password |
| Code sent | Send code | Inline text | "We sent a code to <masked destination>. It expires in <m:ss>." | Code step | Enter code |
| Demo code hint | Code step | Info box | "Demo mode" — "Use code 246810" | Code step | Enter the code |
| Copy email / mobile / employee ID | Clipboard available | Inline icon change | Button label "Copied" with a tick | About 1.5–1.6 s | — |
| Unsaved edits | Any field changed | Inline status | "You have unsaved changes" | While edits are pending | Save or Discard |
| No unsaved edits | — | Inline status | "All changes saved" | Default and after saving | — |
| Uploaded photo | Valid file | Inline card | "Your photo" / "Selected — save to apply" | After upload | **Save avatar** |

## 10. Search, Filters, Tables, and Listings

My activity is the only listing. It is a timeline, not a table, and does not use the standard list toolbar (SH-008).

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Activity type filter | Narrow by type | Filters entries immediately | "All activity", Projects, Finance, Content, Security, Profile (only types that have entries) | "No activity in this view" |
| Date range | Narrow by date | Filters entries; summary follows the range | Presets Today, Last 7 days, Last 30 days, Last 90 days; or custom from–to; end day inclusive | As above |
| **Clear** | Remove filters | Resets type and range | Visible only while filtered | — |
| "By type" summary rows | Quick type filter | Toggle a type on or off | Counts are for the summary period | Hidden when the period has no activity |
| Result line | Count | "N activities" (+ " in this period") | — | "0 activities" |
| Day groups | Ordering | Newest first, grouped by day | "Today", "Yesterday", weekday and date | — |
| Paging | Length | 8 entries, **Show more** adds 8 | No page-size choice (differs from SH-008 pagination) | Button hidden when all are shown |
| Search | — | Not available | — | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| Activity loading | Page opens | Skeleton in the shape of the summary and entries (SH-007) | — | Wait |
| Activity fails to load | Service error | Error state with retry | "Couldn’t load your activity" with the error detail | Retry |
| No activity for filters | Filters exclude everything | Empty state | "No activity in this view" / "Try a different date range or activity type." with **Show all activity** | Click **Show all activity** |
| Required detail cleared | User empties Full name and saves | Error shown; nothing saved | "Enter your full name" | Fill in |
| Department placeholder chosen | User selects "Choose a department" and saves | Error shown | "Choose your department" | Choose a department |
| Email with a leading space | " atul@learnnext.io" | Format error | "Enter a valid email address" | Remove the space |
| Profile email changed | User saves a new email | Banner, header and code destination use it; sign-in still uses the original demo email | — | OQ-PROF-001 |
| Navigating away with unsaved details | Sidebar, breadcrumb or user menu | Page changes without warning; edits lost | — | OQ-PROF-009 |
| Wrong file type | PDF chosen in Upload photo | Not selected | "Please choose an image file." | Choose an image |
| File too large | 6 MB image | Not selected | "Image must be under 5.0 MB." | Choose a smaller image |
| Very large photo not remembered | Browser storage full | The photo shows for this tab but may be lost after reload; no message | — | OQ-PROF-006 |
| Picture fails to load | Broken or removed image | Initials shown | — | Choose a new picture |
| Code expired | 5 minutes pass on the Code step | Verification refused | "This code has expired. Send a new one." | **Resend code** |
| Wrong code | Any code other than the one sent | Boxes cleared | "That code isn’t right. Check it and try again." | Re-enter |
| Dialog closed mid-change | × or Esc on any step | Dialog closes; nothing changed; next opening starts at step 1 | — | Start again |
| Backdrop click on Change password | Click outside | Dialog stays open | — | Use × or **Cancel** |
| New password used to sign in | After a completed change | Rejected; only the demo password works | "The email or password you entered is incorrect." (Sign in) | OQ-PROF-003 |
| Activity after reload | Reload after saving changes | Profile changes remain; the activity entries added in the session disappear | — | OQ-PROF-007 |
| Clipboard blocked | Copy in a restricted browser | Nothing happens | — | Copy manually |
| Offline | Connection lost | Full-screen offline page ([system-pages-prd.md](system-pages-prd.md)) | See that PRD | Reconnect |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| [App shell and navigation](app-shell-navigation-prd.md) | Header user menu opens My Profile and shows the user's picture, first name (wide screens), full name and email | Save details or picture | Menu shows the new name, email and picture immediately | BR-PROF-007 |
| [Authentication](authentication-prd.md) | Sign-in loads the profile; the "Welcome back, <first name>" toast uses the profile name. Change password (signed in, code-verified) is separate from Forgot/Reset password (signed out, emailed link); both use the same password policy and meter | Sign in; change password | Profile name and picture survive sign-out and sign-in in this browser; the sign-in password does not change | BR-PROF-022, BR-PROF-023, BR-AUTH-011 |
| [Dashboard](dashboard-prd.md) | Greeting uses the first name | Save Full name | Greeting shows the new first name | BR-PROF-007 |
| Client, facilitator, content, settings and support pages ([clients-prd.md](clients-prd.md), [facilitators-prd.md](facilitators-prd.md), [manage-content-prd.md](manage-content-prd.md), [settings-hub-prd.md](settings-hub-prd.md), [support-desk-prd.md](support-desk-prd.md)) | New records, edits and support replies are attributed to the signed-in user's current name | Create or edit a record after a name change | New attribution uses the new name; earlier records keep the name used at the time [Inferred] | OQ-PROF-015 |
| [Client detail](client-detail-prd.md) | The client Activity tab uses the same timeline with client-specific types | — | Same filter, summary and paging behaviour | 5.10 |
| [System pages](system-pages-prd.md) | Not-found and other full-screen pages reuse the animated cover artwork and show the user's picture and name with a link to My Profile; Session expired shows the user's picture and name | Open a system page while signed in | Current picture and name shown | BR-PROF-011 |
| [Settings: access masters](settings-access-masters-prd.md) | Access level shown here is not derived from Roles & Access | — | Shows "Admin" regardless | SH-002, OQ-PROF-011 |

## 13. Acceptance Criteria

**AC-PROF-001: Open My Profile**
- Given I am signed in
- When I choose **My Profile** in the header user menu
- Then the breadcrumb shows "My Profile" and the banner shows my name, role, designation, department, email, mobile, location and member-since month
- And Personal details shows "All changes saved" with **Save changes** disabled

**AC-PROF-002: Save personal details**
- Given I am on My Profile
- When I change Designation to "Program Director" and click **Save changes**
- Then the button shows a spinner, then the toast "Profile updated" appears
- And the banner shows "Program Director", the status returns to "All changes saved"
- And My activity shows "Updated your designation" under "Today"

**AC-PROF-003: Required fields on save only**
- Given I clear Full name and Mobile number
- When I tab through the form
- Then no error appears
- When I click **Save changes**
- Then "Enter your full name" and "Enter your mobile number" appear and nothing is saved

**AC-PROF-004: Format errors on blur**
- Given I type "atul@learnnext" in Email address
- When I leave the field
- Then "Enter a valid email address" appears
- And it disappears as soon as the value becomes valid

**AC-PROF-005: Discard edits**
- Given I have changed Location
- When I click **Discard**
- Then the original location is restored and the status reads "All changes saved"

**AC-PROF-006: Name change appears everywhere**
- Given I save Full name "Priya Sharma"
- Then the header user menu shows "Priya Sharma" and the Dashboard greeting uses "Priya"
- And after reloading the page the new name is still shown

**AC-PROF-007: Choose an illustrated avatar**
- Given I open **Change avatar**
- When I select "Meera" and click **Save avatar**
- Then the dialog closes, the toast "Profile picture updated" appears
- And the banner and header show the Meera avatar

**AC-PROF-008: Upload a photo**
- Given I am on the **Upload photo** tab
- When I choose a 6 MB image
- Then "Image must be under 5.0 MB." appears and nothing is selected
- When I choose a 1 MB JPG
- Then it is cropped to a square, the card shows "Selected — save to apply"
- And **Save avatar** saves it

**AC-PROF-009: Remove the picture**
- Given I have a picture
- When I click **Use initials** and **Save avatar**
- Then the toast "Profile picture removed" appears and my initials are shown everywhere

**AC-PROF-010: Change cover**
- Given my cover is "Firefly night"
- When I open **Change cover**
- Then **Apply cover** is disabled
- When I select "Galaxy" and click **Apply cover**
- Then the banner shows the Galaxy scene and the toast "Cover updated" appears

**AC-PROF-011: Code verification**
- Given I open **Change password**
- When I keep Email and click **Send code**
- Then I see "We sent a code to a••••@learnnext.io. It expires in 5:00." and "Resend in 0:30"
- When I enter "123456"
- Then "That code isn’t right. Check it and try again." appears and the boxes are cleared
- When I enter "246810"
- Then the Password step opens with "Identity verified. Choose a strong new password."

**AC-PROF-012: New password rules**
- Given I am on the Password step
- When I enter "abcdefg1" and leave the field
- Then "Choose a stronger password" appears
- When I enter "Abcdefg1!" in both fields and click **Update password**
- Then the success view "Password updated" appears with the toast "Password changed"
- And Security shows "Last changed today" and "90 days left"

**AC-PROF-013: Overdue password**
- Given the password was last changed 96 days ago
- Then Security shows "Last changed 3 months ago", an amber bar and **Renew**
- When I click **Renew**
- Then the Change password dialog opens

**AC-PROF-014: Activity filters**
- Given My activity shows entries
- When I choose type "Finance"
- Then only finance entries are listed and **Clear** appears
- When I choose a date range with no activity
- Then "No activity in this view" appears with **Show all activity**

**AC-PROF-015: Unfamiliar sign-in alert**
- Given My activity shows "New sign-in on Safari · iPhone" with "Wasn’t you?"
- When I click **Secure your account**
- Then the Change password dialog opens at the Verify step

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-PROF-001 | AC-PROF-001 | Open page from user menu | Signed in | — | My Profile shown; tab "My Profile · LearnNext" | P1 |
| TC-PROF-002 | AC-PROF-002 | Save one field | On My Profile | Designation "Program Director" | Toast "Profile updated"; banner updated; activity entry | P1 |
| TC-PROF-003 | BR-PROF-026 | Save several fields | On My Profile | Change name, email, mobile, location | Activity "Updated your name, email +2 more" | P3 |
| TC-PROF-004 | AC-PROF-003 | Required on save | On My Profile | Clear Full name, Mobile, Designation | Three required messages after **Save changes** only | P1 |
| TC-PROF-005 | BR-PROF-002 | Name minimum | On My Profile | "A" / "Al" | "Name looks too short" / accepted | P2 |
| TC-PROF-006 | BR-PROF-003 | Email format | On My Profile | "a@b.c" / "a@b.co" / " a@b.co" | Error / accepted / error | P2 |
| TC-PROF-007 | BR-PROF-004 | Mobile format | On My Profile | "98-12" / "+91 98765 43210" / "(022) 555-0101" | "Enter a valid mobile number" / accepted / accepted | P2 |
| TC-PROF-008 | BR-PROF-005 | About limit | On My Profile | Paste 300 characters | Stops at 240; counter "240/240" | P3 |
| TC-PROF-009 | BR-PROF-006 | Spaces only change | On My Profile | Add trailing spaces to Location | **Save changes** stays disabled | P3 |
| TC-PROF-010 | AC-PROF-005 | Discard | Edits pending | — | Values restored; "All changes saved" | P2 |
| TC-PROF-011 | AC-PROF-006 | Name propagation and reload | — | Full name "Priya Sharma" | Header and Dashboard updated; persists after reload | P1 |
| TC-PROF-012 | AC-PROF-007 | Choose avatar | Avatar picker open | "Meera" | Toast "Profile picture updated"; header updated | P2 |
| TC-PROF-013 | AC-PROF-008 | Upload size boundary | Upload tab | 5.0 MB and 5.1 MB images | First accepted; second "Image must be under 5.0 MB." | P2 |
| TC-PROF-014 | BR-PROF-008 | Non-image | Upload tab | PDF | "Please choose an image file." | P2 |
| TC-PROF-015 | BR-PROF-009 | GIF accepted | Upload tab | Small GIF | Accepted and cropped (contradicts hint; OQ-PROF-005) | P3 |
| TC-PROF-016 | AC-PROF-009 | Use initials | Picture set | — | Toast "Profile picture removed"; initials everywhere | P2 |
| TC-PROF-017 | BR-PROF-010 | Cancel picker | Avatar picker open, avatar selected | Click **Cancel** | Picture unchanged; no toast | P3 |
| TC-PROF-018 | 5.4 | Large picture view | Picture set | Click picture | "Profile picture" dialog; **Change photo** opens picker | P3 |
| TC-PROF-019 | AC-PROF-010 | Change cover | Default cover | "Galaxy" | Toast "Cover updated"; activity "Switched your profile cover" | P2 |
| TC-PROF-019a | BR-PROF-012 | Static cover | Default cover | Switch to **Static**, pick "Dawn hills", Apply | Preview shows Dawn hills with "Preview" chip; banner shows the still artwork; toast "Cover updated" | P2 |
| TC-PROF-019b | BR-PROF-014 | Picker stays smooth | Animated cover | Open the cover picker | Only the large preview moves; swatches still until hovered; the banner behind is paused, resumes after closing | P3 |
| TC-PROF-020 | AC-PROF-011 | Wrong then right code | Change password, Code step | "123456", then "246810" | Error and cleared boxes; then Password step | P1 |
| TC-PROF-021 | BR-PROF-020 | Resend timer | Code step | Wait 30 s | "Resend in 0:30" counts down; **Resend code** restarts 5:00 expiry | P2 |
| TC-PROF-022 | BR-PROF-017 | Code expiry | Code step | Wait 5 minutes, enter "246810" | "This code has expired. Send a new one." | P2 |
| TC-PROF-023 | 5.8 | SMS channel | Step 1 | Choose "SMS to mobile" | Code step names the masked mobile ("+•• ••••• •1120" for demo data) | P3 |
| TC-PROF-024 | AC-PROF-012 | Password policy | Password step | "Abc1!xy", "abcdefg1", "Abcdefg1!" | "Must be at least 8 characters", "Choose a stronger password", accepted | P1 |
| TC-PROF-025 | BR-PROF-024 | Confirm mismatch | Password step | "Abcdefg1!" / "Abcdefg1" | "Passwords do not match" | P1 |
| TC-PROF-026 | BR-PROF-025 | Password not really changed | Completed a change to "Newpass1!" | Sign out, sign in with "Newpass1!" | Rejected; "learnnext123" still works | P2 |
| TC-PROF-027 | 5.8 | Backdrop and Esc | Dialog open | Click backdrop; press Esc | Backdrop: stays open; Esc: closes | P3 |
| TC-PROF-028 | AC-PROF-013 | Overdue password state | Demo data | — | "Last changed 3 months ago", amber bar, **Renew** | P2 |
| TC-PROF-029 | AC-PROF-014 | Activity filter and empty state | On My Activity | Type "Finance"; range in the future | Filtered list; then "No activity in this view" | P2 |
| TC-PROF-030 | 5.10 | Show more | More than 8 entries | Click **Show more** | 8 more entries; button hides when all shown | P3 |
| TC-PROF-031 | AC-PROF-015 | Secure your account | Alert entry visible | Click link | Change password dialog opens | P2 |
| TC-PROF-032 | 5.2 | Copy email | Clipboard allowed | Click copy on Email | Label "Copied" with tick; email in clipboard | P3 |
| TC-PROF-033 | OQ-PROF-009 | Leave with unsaved edits | Edits pending | Click a sidebar item | Page changes without warning | P3 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-PROF-001 | Personal details: Email address | Changing the profile email does not change the sign-in email and is not verified | Two different "emails" for one account; codes may go to an unverified address | Decide whether email is editable, whether it is the sign-in identity, and whether a change needs verification | Open |
| OQ-PROF-002 | Personal details | No maximum lengths for Full name, Email, Mobile, Location or Designation; mobile has no country or length rule; name minimum counts spaces | Data quality, layout overflow | Define limits and the mobile number format | Open |
| OQ-PROF-003 | Change password | The change does not alter the sign-in password; no current-password field; no check that the new password differs from the current or previous ones | The flow reports a success that did not happen | Confirm the one-time code fully replaces the current password, and the password-history rule | Open |
| OQ-PROF-004 | Change password: code | 5-minute expiry and 30-second resend wait exist, but no limit on wrong attempts or resends; the demo code is shown on screen | Brute-force risk; must not reach production | Define attempt and resend limits, lockout and message; remove the demo note | Open |
| OQ-PROF-005 | Avatar picker: upload | Hint says JPG, PNG or WebP, but any image type is accepted; no minimum dimensions; crop is automatic centre-square with no adjustment | Inconsistent rule; poor crops | Confirm allowed types, minimum size and whether users can adjust the crop | Open |
| OQ-PROF-006 | Avatar picker: upload | If the browser cannot store a large photo, it shows now but is silently lost after reload | Unexpected loss | Define storage of photos and a failure message | Open |
| OQ-PROF-007 | My activity | Only profile, picture, cover and password changes are recorded; actions elsewhere and sign-ins are not; session entries disappear on reload while profile changes persist | Header promises "Everything you’ve done across LearnNext" | Define which actions are logged, retention and the source of sign-in/device entries | Open |
| OQ-PROF-008 | Account: Last sign-in | Fixed demo value, not the actual last sign-in | Misleading security information | Confirm it should show the real previous sign-in (time, device, location) | Open |
| OQ-PROF-009 | Personal details | No unsaved-changes warning when leaving the page | Edits lost silently | Confirm whether the leave guard (SH-006) should apply | Open |
| OQ-PROF-010 | Security | 90-day rotation is advisory only | Policy enforcement | Confirm whether expiry should force a change at sign-in | Open |
| OQ-PROF-011 | Account: Access level, Employee ID | Values are fixed; not linked to Roles & Access; who maintains them is undefined | Role shown may not match permissions | Define the source and owner of these facts | Open |
| OQ-PROF-012 | Change password dialog | Backdrop click does not close it (differs from SH-006) | Consistency | Confirm intended (protects the flow from accidental closing) | Open |
| OQ-PROF-013 | Banner, Account | Copy gives no feedback when the clipboard is blocked | User may think it copied | Define a fallback message | Open |
| OQ-PROF-014 | Personal details: About | "Shown to your team" but the bio is not displayed anywhere, including on this page outside the form | Purpose unclear | Confirm where the bio appears | Open |
| OQ-PROF-015 | Attribution | Records keep the name used when they were created; a later name change is not reflected [Inferred] | Audit trail consistency | Confirm whether attribution should follow the user or stay historical | Open |
| OQ-PROF-016 | My activity: alert | **Secure your account** only opens Change password; no way to sign out other devices or report the sign-in | Incident response | Define the security actions available | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and features inventory: Complete (banner, cover picker, picture view, avatar picker, personal details, security, change password, account, my activity)
- [x] User roles and access: Complete
- [x] Page functionality and behaviour: Complete
- [x] User workflows: Complete
- [x] Field-level specifications: Complete for all fields
- [ ] Minimum and maximum constraints, where known: Incomplete (text field maximums and mobile format not defined, see OQ-PROF-002, OQ-PROF-005)
- [x] Validation and business rules: Complete
- [x] Success messages and feedback: Complete
- [x] Search, filters, tables and listings: Complete (My activity timeline)
- [x] Empty states, errors and edge cases: Complete
- [ ] Security rules (code attempts, password history, real password change): Incomplete (see OQ-PROF-003, OQ-PROF-004, OQ-PROF-010)
- [ ] Activity scope and retention: Incomplete (see OQ-PROF-007, OQ-PROF-008)
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria: Complete
- [x] QA test scenarios: Complete
- [x] Open questions logged: Complete
