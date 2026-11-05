# Facilitators: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Facilitators PRD |
| Module name | Facilitators |
| Document ID | PRD-FAC |
| Version | 1.5 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (onboarding up to KYC approval and the payment setup sent to the facilitator for approval are implemented; the facilitator's approval or rejection, activation, agreement expiry and renewal outcomes happen outside this application or are not defined) |
| Last updated | 2026-11-05 (v1.5: naming: "Training Partner" replaces "Admin"; KYC approved / Sent back toasts appear once the list has loaded) · 2026-11-03 (v1.4: phone layout) |
| Phone layout (v1.4) | Facilitator details hero actions (All facilitators, View portfolio, Edit) in a vertical ⋮ menu; Overview stats without icon tiles; Entities / Industries / Certifications one per line; qualification, experience and partner-program tables become one card per row (title = course / industry / program); portfolio hero drops the board, bulb and plant drawings on phones; onboarding shown as a 3-circle "Progress journey" (no outline by default, 2 px ring on the picked step) with a compact waiting strip. See SH-013. |
| Related modules/pages | [App shell & navigation](app-shell-navigation-prd.md), [Settings – Finance masters (Entity)](settings-finance-masters-prd.md), [Settings – Access masters (Roles & Access, Menu Mapping)](settings-access-masters-prd.md), [Support desk](support-desk-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

Facilitators are the trainers who deliver LearnNext programs; channel partners are people or firms who bring business. Both go through the same onboarding journey before they can work with LearnNext.

The Facilitators module lets a Training Partner user:

- see every facilitator and channel partner, and where each one is in the onboarding journey;
- add a new facilitator, which sends them a KYC (Know Your Customer) link by email so they can complete their profile, documents and bank details;
- chase people who are stuck (resend the KYC link one at a time or in bulk, send an agreement renewal);
- verify a submitted KYC section by section, and either approve it or send it back with notes on what needs fixing;
- once a KYC is approved, set up the person's payment terms (agreement, fees, travel & stay) and send them to the person for approval, then revise and resend if they reject it;
- correct a facilitator's contact, location, entities and type;
- open an Active facilitator's full profile (Facilitator details) and share a professional portfolio page with clients, downloadable as PDF.

The objective is to make onboarding visible and quick: who is waiting, for how long, and what the next action is.

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Facilitators list (`/facilitators`) | One list of all facilitators and channel partners, with the onboarding journey above it. The table columns change with the selected status. | Training Partner user | Filter by onboarding step or status, search, filter, add, edit, resend KYC, set up / view / revise payment setup, send agreement renewal, open Verify KYC | Verify KYC, Payment setup |
| Onboarding steps (on the list) | Shows how many people are at each onboarding step (KYC pending, Approval pending, Payment setup) and filters the list to a step. | Training Partner user | Select or clear a step | Facilitators list |
| Add facilitator / Edit facilitator (modal) | Captures contact, location and onboarding details. Adding sends the KYC link. | Training Partner user | Send KYC, Save changes, Cancel | Facilitators list |
| Filter facilitators (drawer) | Narrows the list by entity, type and state. | Training Partner user | Choose filters, Reset, Show N facilitators | Facilitators list |
| Verify KYC (`/facilitators/:id/verify`) | Review a submitted KYC section by section and decide on it. | Training Partner user | Mark each section Valid / Not valid, add notes, view documents, Approve KYC, Send back for changes, Cancel | Facilitators list |
| Payment setup (modal) | Set a Payment setup pending person's agreement, fees and travel & stay in three steps and send it to them for approval; view a sent setup with its revision history; revise a rejected one. | Training Partner user | Continue, Back, Send for approval / Send again, Edit & resend, Show history, Close, Cancel | Facilitators list |
| Facilitator details (`/facilitators/:id`) | An Active facilitator's profile, laid out like Client details: hero + tabs (Overview, Personal & address, Tax & bank, Qualifications, Experience, Partner firm), all from the approved KYC. | Training Partner user | Switch tabs, view documents, Edit, View portfolio, back to All facilitators | Facilitators list, Portfolio |
| Portfolio (`/facilitators/:id/portfolio`) | A one-page portfolio website for the facilitator, opened in a new tab outside the app shell, to share with clients. | Training Partner user | Jump to sections, Get in touch, Download PDF | Facilitator details |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Training Partner user (signed in and continuing as Training Partner) | Facilitators list and Verify KYC (SH-002, SH-003) | All actions in this PRD | None enforced in the current build. The Roles & Access master stores Facilitators permissions (view, add, edit, delete, export, approve) but they are not applied (SH-002). |
| Facilitator / channel partner | No access to these pages. A Facilitator role exists at sign-in, but its portal is not built yet ("Coming soon", SH-002) | Completes the KYC form from the emailed link, and approves or rejects (with a reason) the payment setup sent to them, outside this application | Appears here only as a record |

## 5. Page Functionality and Behavior

### 5.1 Facilitators list: layout and onboarding steps

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Page title | Identify the page | Open Facilitators from the sidebar | Breadcrumb and browser tab show "Facilitators" (SH-009). No title block. | — | Page loads with skeletons first (SH-007) |
| Onboarding panel heading | Summarise the onboarding pipeline | View | Heading "Onboarding" followed by "N facilitators on their way in" (singular "facilitator" when N = 1). N = KYC pending + Approval pending + Payment setup. | Blank while loading | — |
| Onboarding step: KYC pending | Show people who have the link but have not finished the KYC form | Click | Hint "Link sent, not finished" and the count. Clicking filters the list to this step and outlines the step; clicking it again shows everyone. Tooltip "Show kyc pending", or "Show everyone" when selected. | Count covers all facilitators (not reduced by search or filters). "–" while loading. | List shows the KYC pending columns (section 10) |
| Onboarding step: Approval pending | Show people who submitted KYC and are waiting for a Training Partner user | Click | Hint "Submitted, waiting for you" and count. Same toggle behaviour. | As above | List shows the Approval pending columns |
| Onboarding step: Payment setup | Show people whose KYC was approved and whose payment setup (agreement, fees, travel & stay) is still to be set up, is with them for approval, or was rejected by them | Click | Label "Payment setup", hint "Agreement & fees to set up" and count. Same toggle behaviour. | As above. Elsewhere (status badge, All view) the status is still called "Payment setup pending". | List shows the Payment setup columns |
| Status pills | One-click status filters (SH-008) | Click a pill | Pills: **All** (all facilitators), **Active**, **Expired**. Each shows its count. Tooltips: "Show all facilitators", "Show active", "Show agreement expired". | Counts cover all facilitators. The three onboarding stages are not pills; they live in the onboarding steps. | List filtered; columns change (section 10) |
| Search | Find a facilitator | Type | Filters as the user types (SH-008). | See 7.1 | Result line "N of Total facilitators" |
| Filters button | Open the filter drawer | Click | Opens **Filter facilitators**. Button shows the number of applied filter chips. | — | See 5.3 |
| Add facilitator | Start onboarding a new person | Click | Opens the Add facilitator modal (5.4). | — | — |
| Result line and chips | Show what is applied | Remove a chip / Clear all | Appears while a step/pill other than All, a search or a filter is applied (SH-008). One chip per entity, type and state. **Clear all** clears search, filters and the selected step/pill. | — | — |
| Waiting line | Show how many wait at the selected onboarding step and offer the bulk action | View / click | Shown only when KYC pending, Approval pending or Payment setup is selected and at least one person is at that step. Text: KYC pending "N haven’t finished KYC · oldest link sent X ago"; Approval pending "N have submitted KYC and are waiting for approval · oldest submitted X ago"; Payment setup "N need a payment setup or  waiting on it · oldest KYC done X ago" (as shown, with a double space; OQ-FAC-009) (singular wording for 1: "hasn’t", "has … is", "needs"). X is "today" or "N days" / "1 day". | Bulk button only on KYC pending: "Resend KYC to all". No bulk action and no button for Approval pending or Payment setup. | See 5.2 |
| Table / cards | List facilitators | View, sort, page | Table from tablet width up; cards on phones (SH-008). Pagination 10 rows by default; choices 10, 20, 50, All. | Default sort: by name A–Z; on an onboarding step, by the waiting date with the longest wait first. On Payment setup the date used is the date the setup was sent, or the KYC done date if none has been sent. | — |
| Row click | Open the next step for rows that have one | Click a row | **Approval pending** rows open Verify KYC. **Payment setup pending** rows open the payment setup (5.6), in any view. Other rows do nothing when clicked (Edit is only via the pencil). | — | Verify KYC or Payment setup opens |

### 5.2 Row actions and bulk actions

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Resend KYC (send icon) | Send the KYC link again | Click on a KYC pending row | Sends immediately (no confirmation). Icon disabled while sending. Success toast "KYC link sent again" with "Name · email". | Only for KYC pending people who have not submitted. | Link sent date becomes today; Reminders count goes up by 1 |
| Verify (labelled button) | Review the submitted KYC | Click on an Approval pending row | Opens Verify KYC for that facilitator. | Approval pending only | Verify KYC page |
| Payment setup (labelled button) | Set up, view or revise the person's payment setup | Click on a Payment setup pending row | Label follows the payment setup state: **Set up payment** (none sent yet), **View** (sent, waiting for the person), **Revise** (rejected by the person, shown in red). Each opens the payment setup (5.6). | Payment setup pending only. There is no payment reminder action, single or bulk. | Payment setup opens |
| Send agreement renewal (signature icon) | Send the agreement for renewal | Click on an Agreement expired row | Sends immediately. Success toast "Agreement renewal sent" with "Name · email". | Agreement expired only | Status stays Agreement expired; nothing visible changes |
| Active rows | — | — | Active rows have no status action, only Edit. | — | — |
| Edit (pencil) | Correct the record | Click on any row | Opens the Edit facilitator modal (5.4). | All statuses | — |
| Resend KYC to all | Chase everyone stuck at KYC | Click on the waiting line | Confirmation "Resend KYC to everyone pending?" / "N facilitators will get their KYC link again by email." Buttons Cancel and **Resend KYC**. On confirm: toast "KYC links sent again" with "N facilitators" ("1 facilitator"). | Applies to **every** KYC pending facilitator, even if search or filters hide some of them. Row action icons are disabled while it runs. | Link sent dates reset; reminders +1 each |
| Send failure | Report a failed send | — | Error toast "Couldn’t send it" with the reason. | Not expected with demo data (SH-001) | — |

### 5.3 Filter facilitators drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Narrow the list | Open from Filters | Title "Filter facilitators", description "By entity, type or state". Edits a draft; nothing applies until the apply button. Opens with the currently applied filters. | SH-006 closing rules | — |
| Onboarded for | Filter by entity | Pick one or more | Shows facilitators onboarded for **any** of the chosen entities. Each section has a clear link while set. | See 7.2 | — |
| Type | Filter by type | Pick one | All / Facilitator / Partner / Both. | See 7.2 | — |
| State | Filter by state | Pick one or more | Shows facilitators whose address state is one of those chosen. | See 7.2 | — |
| Reset | Clear the draft | Click | Clears entity, type and state in the draft. Keeps the selected step/pill. | — | — |
| Show N facilitators | Apply | Click | Applies the draft and closes. Label shows the live count ("Show 1 facilitator", "Show 12 facilitators"); the count includes the current search and step/pill. | Disabled with label "No matching facilitators" when the count is 0 | List filtered; chips shown |

### 5.4 Add facilitator / Edit facilitator modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Modal header | Explain the action | Open | Add: title "Add facilitator", description "They’ll get a KYC link by email to finish their profile, documents and bank details." Edit: title "Edit facilitator", description = the facilitator's name. | Opens with a fresh form each time | — |
| Parts | Group the fields | — | Three parts: **Contact**, **Location**, **Onboarding** (fields in 7.3). | — | — |
| Send KYC (add) | Create the facilitator and send the link | Click | Validates (7.3). If valid, saves with a spinner, shows toast "KYC link sent" with "Name · email", closes and reloads the list. | — | New facilitator is **KYC pending**, link sent today, no reminders |
| Save changes (edit) | Save edits | Click | Disabled until something has changed. Validates; if valid saves, toast "Facilitator updated" with the name, closes and reloads. | — | Contact, location, entities and type updated. Status and onboarding dates are unchanged; no new KYC link is sent. |
| Cancel / × / Esc | Leave without saving | Click / press | If nothing changed, closes. If something changed, asks first (see below). Clicking the backdrop does **not** close this modal. Cancel is disabled while saving. | Module-specific: differs from SH-006 (backdrop) | — |
| Discard confirmation | Protect unsaved input | — | Add: "Discard this facilitator?" / "The details you’ve entered won’t be saved and no KYC link will be sent." Edit: "Discard your changes?" / "Your edits won’t be saved." Buttons **Keep editing** and **Discard**. | — | Discard closes the modal |
| Save failure | Report a failed save | — | Error toast "Couldn’t send the KYC link" (add) or "Couldn’t save the facilitator" (edit) with the reason, e.g. "Another facilitator already uses this email." or "This facilitator no longer exists." | Modal stays open | — |

### 5.5 Verify KYC page

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Page title | Identify the page | Open from an Approval pending row | Breadcrumb "Facilitators › Verify KYC"; tab title "Verify KYC" (SH-009). Skeletons while loading. | — | — |
| Not found | Handle a bad link | Open with an unknown id | Message "Facilitator not found" / "They may have been removed, or the link is out of date." Button **All facilitators**. | — | Returns to the list |
| Nothing to verify | Handle a facilitator not at Approval pending | Open for anyone not waiting for approval | Message "Nothing to verify here" / "<Name> doesn’t have a submitted KYC waiting for verification." Button **All facilitators**. | Applies to every status except Approval pending | Returns to the list |
| Header | Show who is being verified | View | Photo (if any), name, then "<Type> · <facilitator code> · submitted X ago (date)". Contact facts: email, "+91" mobile, "City, State", first entity with "+N" (all on hover). Progress ring "done/total" with "sections checked"; it fills green, or red while any section is Not valid. | Type: "Facilitator", "Channel partner" or "Facilitator & channel partner" | — |
| View photo | See the photo large | Click the photo | Opens a dialog titled with the name and "Profile photo". | Only when a photo exists | — |
| KYC sections list (large screens) | Navigate and see verdicts | Click a section name | Scrolls to that section. Each name shows an empty ring (not checked), green tick (Valid) or red cross (Not valid). | Large screens only; stays in view while scrolling | — |
| Section cards | Show what the facilitator submitted | View | Sections in order: Personal details, Address, Tax details, Bank details, Qualifications & certifications, Experience, BYLD program certifications, Partner firm (only for channel partners and "Both"), Social profiles. Contents in 7.5. Empty values show "—". | — | — |
| Valid | Accept a section | Click **Valid** | The section turns green, folds to one line "Marked valid · show details" (click to unfold), and the page scrolls to the next section not yet checked. Any note for that section is cleared. | — | Progress updates |
| Not valid | Reject a section | Click **Not valid** | The section turns red and shows "What needs fixing? — the facilitator sees this" with a note box. | A note is required before sending back (BR-FAC-013) | Progress updates |
| Change verdict | Correct a decision | Click the other button | Verdicts can be switched at any time before finishing. They cannot be cleared back to "not checked". | — | — |
| View a document | Check an uploaded document | Click a document chip | Opens the file viewer with the file name, type and size, **Open in new tab** and **Download**. | — | — |
| Bottom bar status | Show progress | View | "N of M checked" until all are checked; then "N section(s) need(s) changes" (+ " · add a note to each" while a note is missing), or "Everything checks out". | Stays at the bottom while scrolling | — |
| Approve KYC | Approve | Click | Enabled only when every section is Valid. Confirmation "Approve <Name>’s KYC?" / "They move on to payment setup." Buttons Cancel / **Approve KYC**. On confirm: return to the list, where the toast "KYC approved" / "<Name> moves on to payment setup." appears once the list has loaded (SH-005). | — | Status → Payment setup pending (BR-FAC-015) |
| Send back for changes | Return the KYC to the facilitator | Click | Replaces Approve KYC once every section is checked and at least one is Not valid. Disabled while any Not valid section has no note. Confirmation "Send <Name>’s KYC back?" / "They’ll get the KYC link again with your notes on: <section names>." Buttons Cancel / **Send back**. On confirm: return to the list, where the toast "Sent back for changes" / "<Name> will get the KYC link again with your notes." appears once the list has loaded (SH-005). | — | Back to KYC pending (BR-FAC-016) |
| Cancel | Leave | Click | Returns to the list **without** the leave confirmation, even if verdicts are half done. | Hidden on phones | Verdicts lost |
| Leave guard | Prevent losing work | Use the sidebar, breadcrumb, search or user menu after marking any section | Confirmation "Leave without finishing?" / "The sections you’ve marked won’t be saved." Buttons **Stay** / **Leave** (red). Closing or reloading the browser tab shows the browser's own warning. | Only once at least one section is marked. The sidebar **Support desk card** does not trigger it (OQ-FAC-010). | — |
| Finish failure | Report an error | — | Error toast "Couldn’t finish the verification" with the reason ("This facilitator no longer exists." or "There’s no submitted KYC waiting for verification."). The page stays. | — | — |

### 5.6 Payment setup modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Modal header | Explain the action | Open from a Payment setup pending row (button or row click) | Title "Set up payment" (none sent yet), "Payment setup" (sent, read-only view) or "Revise payment setup" (rejected). Description "<Name> · <email>". | Clicking the backdrop does not close it | — |
| Steps | Split the setup into three parts | Continue / Back, or click a step | Three steps: **Agreement**, **Fees**, **Travel & stay** (fields in 7.6). Footer shows "Step N of 3". A step can be clicked once it has been reached; a setup that was sent before opens with all three steps reachable. | Continue checks only the current step (BR-FAC-025) | — |
| Agreement step | Set the agreement terms | Fill | Payment setup category, Contract start date, Agreement validity (helper "Runs till <date>"), Financial year, Agreement type, Agreement on behalf of. | Picking a start date sets the financial year (BR-FAC-029) | — |
| Fees step | Set the fees | Fill | Day-wise fee, Feedback incentive bonus, and a **Coaching sessions** switch ("Also pays for one-to-one coaching") that reveals Face-to-face fee and Virtual fee. | Fees are digits only (BR-FAC-026) | — |
| Travel & stay step | Set travel entitlements and check the whole setup | Tap chips | Flight classes allowed and Hotel categories allowed as tap chips (tap to add or remove), then a **Summary** with rows Agreement, Runs, Fees, Coaching, Travel & stay. | At least one of each (BR-FAC-028) | — |
| Cancel / Back | Leave or go back | Click | Step 1 shows **Cancel**; later steps show **Back** (keeps entries). | Disabled while sending | — |
| Continue | Next step | Click | Shows the current step's errors, or moves to the next step. | — | — |
| Send for approval / Send again | Send the setup to the person | Click on the last step | Label "Send for approval"; "Send again" when the setup was sent or rejected before. Checks all steps; if any step has errors, all errors are shown and the modal goes to the first step with errors. If valid, sends with a spinner, toast "Sent for approval" / "<Name> will review the payment setup", closes and reloads the list. | Payment setup pending only (BR-FAC-023) | Row shows "Waiting for <first name>" (BR-FAC-031) |
| Sent setup (read-only) | See what is with the person | Open a row whose setup was sent | Line "Waiting for <first name> to approve · sent <date> by <sender name>", then the Summary. Buttons **Close** and **Edit & resend** (opens the steps with the sent values; then sends with "Send again"). | Nothing in this app approves it (BR-FAC-021) | — |
| Rejected setup | Revise what the person rejected | Open a row whose setup was rejected | Title "Revise payment setup". Above the steps on the first step: "<first name> rejected it on <date>" and their reason in quotes. Fields hold the rejected values. | — | Send again |
| Cancel / × / Esc with changes | Protect unsaved input | Close after changing anything | Confirmation "Discard this payment setup?" / "What you’ve filled in won’t be saved." Buttons **Keep editing** and **Discard**. Without changes, or in the read-only view, it closes straight away. | — | Discard closes without saving |
| Send failure | Report a failed send | — | Error toast "Couldn’t send the payment setup" with the reason ("This facilitator no longer exists." or "This facilitator isn’t waiting for a payment setup."). Modal stays open. | — | — |

## 6. User Workflow

### 6.1 Add a facilitator and send the KYC link

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Add facilitator** | Opens the Add facilitator modal with Country = India and Type = Facilitator | — | Empty form |
| 2 | Enter Name, Email, Mobile | Mobile accepts digits only | Errors show once a field is left (BR-FAC-001) | — |
| 3 | Enter Address line 1 (and optional line 2), choose Country, State, City | State list follows the country; city list follows the state | Changing country clears state and city | — |
| 4 | Choose one or more entities in **Onboarding for**, choose Type | — | At least one entity | — |
| 5 | Click **Send KYC** | Validates every field; shows all errors if any | BR-FAC-001..008 | If valid: saved, toast "KYC link sent", modal closes |
| 6 | — | List reloads | — | New person counted under KYC pending with "Link sent: today", "Reminders: Not yet" |

### 6.2 Chase a facilitator who has not finished KYC

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the **KYC pending** step | List shows KYC pending columns, sorted by longest wait; waiting line appears | — | — |
| 2a | Click **Resend KYC** on a row | Sends immediately | Not yet submitted | Toast "KYC link sent again"; Link sent = today; Reminders "Resent Nx" |
| 2b | Or click **Resend KYC to all** and confirm | Sends to every KYC pending person | — | Toast "KYC links sent again" |

### 6.3 Verify a submitted KYC

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Approval pending**, then **Verify** (or the row) | Opens Verify KYC | Person must be Approval pending | Header, sections, "0 of N checked" |
| 2 | Review each section, open documents | File viewer opens | — | — |
| 3 | Mark each section **Valid** or **Not valid**; add a note for each Not valid one | Progress ring and bar update | Notes required for Not valid sections | — |
| 4a | All Valid → click **Approve KYC** → confirm | Saves; returns to the list | — | Toast "KYC approved"; person moves to Payment setup |
| 4b | Some Not valid → click **Send back for changes** → confirm | Saves; returns to the list | All notes filled | Toast "Sent back for changes"; person moves back to KYC pending with a fresh link |

### 6.4 Set up payment / send renewal

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Select the **Payment setup** step | List shows the Payment setup columns, longest wait first | — | Rows show "Ready to set up", "Waiting for <first name>" or "Rejected by <first name>" |
| 2 | Click **Set up payment** (or the row) | Opens "Set up payment" on the Agreement step with defaults (BR-FAC-029) | — | — |
| 3 | Fill Agreement, click **Continue**; fill Fees, click **Continue** | Moves step by step | Step errors shown on Continue (BR-FAC-025..027) | — |
| 4 | Choose flight classes and hotel categories, check the Summary, click **Send for approval** | Sends the setup to the person | All steps valid (BR-FAC-028) | Toast "Sent for approval"; row shows "Waiting for <first name>" and a **View** button; status stays Payment setup pending |
| 5 | The person approves or rejects it (outside this application) | Not implemented here | Requires Confirmation (OQ-FAC-002) | Approved: **Active**. Rejected: row shows "Rejected by <first name>" with their reason and a **Revise** button |
| 6 | Click **Revise**, change the setup, click **Send again** | Sends the revised setup | Same validation | Toast "Sent for approval"; row back to "Waiting for <first name>" |
| 7 | For an Agreement expired person (**Expired** pill), click **Send agreement renewal** | Sends immediately | Agreement expired only | Toast "Agreement renewal sent"; status does not change |

### 6.5 Edit a facilitator

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the pencil on any row | Opens "Edit facilitator" with current values | — | **Save changes** disabled |
| 2 | Change fields | Save changes becomes enabled | Same validation as add (email unique excluding this person) | — |
| 3 | Click **Save changes** | Saves | — | Toast "Facilitator updated"; list reloads |

### 6.6 Facilitator status lifecycle

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Training Partner user clicks **Send KYC** | Record created | — | **KYC pending** |
| 2 | Facilitator submits the KYC form (outside this application) | Submission date recorded | Requires Confirmation (external) | **Approval pending** |
| 3a | Training Partner user approves on Verify KYC | KYC done date recorded | All sections Valid | **Payment setup pending** |
| 3b | Training Partner user sends back on Verify KYC | Submission cleared, link re-sent, reminder count +1, notes stored | At least one Not valid, all with notes | **KYC pending** |
| 4a | Training Partner user sends the payment setup | Setup stored as sent, with date and sender | All steps valid | Stays **Payment setup pending** ("Waiting for <first name>") |
| 4b | Facilitator rejects the payment setup with a reason (outside this application) | Not implemented here | Requires Confirmation (OQ-FAC-002) | Stays **Payment setup pending** ("Rejected by <first name>"); Training Partner user revises and sends again (4a) |
| 4c | Facilitator approves the payment setup (outside this application) | Not implemented here | Requires Confirmation (OQ-FAC-002, OQ-FAC-017) | **Active**, with the agreement running from the contract start date for the chosen validity |
| 5 | Agreement end date passes | Not implemented here | Requires Confirmation (OQ-FAC-003) | **Agreement expired** |
| 6 | Training Partner user sends agreement renewal | Renewal date recorded | — | Stays **Agreement expired**; what follows Requires Confirmation (OQ-FAC-004) |

## 7. Forms and Field-Level Specifications

### 7.1 Facilitators list: search

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search facilitators | Search text | Find people | Optional | N/A | Requires Confirmation | Free text, placeholder "Search name, email, mobile or city…". Case-insensitive "contains" match on name, email, mobile, city and state. Leading/trailing spaces ignored. | Empty | None | Applies a short moment after typing stops; combines with the selected step/pill and filters | N/A (no results → empty state, section 11) |

### 7.2 Filter facilitators drawer

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Onboarded for | Searchable multi-select (search "Search entities…") | Filter by entity | Optional | N/A | All options | Active entities that at least one facilitator is onboarded for, A–Z, each with "N facilitators". Placeholder "Any entity". | None | None | Match on any chosen entity | N/A |
| Type | Segmented choice | Filter by type | Optional | N/A | N/A | All, Facilitator, Partner (= channel partner), Both | All | None | Chip label: "Facilitator", "Channel partner" or "Facilitator & channel partner" | N/A |
| State | Searchable multi-select (search "Search states…") | Filter by address state | Optional | N/A | All options | States found on facilitator addresses, A–Z, each with "N facilitators". Placeholder "Any state". | None | None | — | N/A |

### 7.3 Add facilitator / Edit facilitator

Validation timing (module-specific, differs from SH-004): an error, including a "required" error, appears as soon as the user leaves a field (or, for State, City and Onboarding for, as soon as a value is picked or cleared), and for every field when **Send KYC** / **Save changes** is clicked. Errors update live while typing once shown.

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Name | Text (placeholder "e.g. A George Christopher") | Facilitator's full name | Required | 1 non-space character | Requires Confirmation | Any text; trimmed when saved | Empty (edit: current) | Not blank | — | "Enter the facilitator’s name" |
| Email | Email (placeholder "name@example.com") | Where the KYC link is sent; must be unique | Required | N/A | Requires Confirmation | text@domain.tld with at least 2 characters after the last dot, no spaces; trimmed when saved | Empty (edit: current) | 1) Not blank 2) format 3) not used by another facilitator (case-insensitive, ignoring surrounding spaces) | Edit: own email allowed | "Enter their email — the KYC link goes here" / "Enter a valid email address" / "Another facilitator already uses this email" |
| Mobile | Numeric text with a dial-code prefix | Contact number | Required | India: exactly 10 digits. Other countries: 6 digits | India: 10 digits. Other countries: 14 digits | Digits only (anything else is removed as typed). Prefix shows the country's dial code: India +91, United Arab Emirates +971, Singapore +65, United Kingdom +44, United States +1. Placeholder "98765 43210" (India) or "Mobile number". | Empty (edit: current) | Not blank; length rule per country | Changing to a non-India country cuts the number to 14 digits. Switching to India keeps a longer number, which then fails validation. | "Enter their mobile number" / "Enter a 10-digit mobile number" (India) / "Enter a valid mobile number" (other countries) |
| Address line 1 | Text (placeholder "House / flat, street") | Street address | Required | 1 non-space character | Requires Confirmation | Any text | Empty | Not blank | — | "Enter the address" |
| Address line 2 | Text (placeholder "Area, landmark"), marked optional | Area / landmark | Optional | N/A | Requires Confirmation | Any text | Empty | None | — | N/A |
| Country | Searchable select ("Search countries…") | Country of address | Required | N/A | N/A | India, United Arab Emirates, Singapore, United Kingdom, United States | India | Must be selected | Changing it clears State and City and changes the mobile prefix and length rule | "Select the country" |
| State | Searchable select ("Search states…") | State of address | Required | N/A | N/A | States of the selected country, A–Z | Empty | Must be selected | Disabled with placeholder "Pick a country first" until a country is chosen. Changing it clears City. | "Select the state" |
| City | Searchable select ("Search cities…") | City of address | Required | N/A | N/A | Cities of the selected state | Empty | Must be selected | Disabled with placeholder "Pick a state first" until a state is chosen | "Select the city" |
| Onboarding for | Searchable multi-select ("Search entities…"), helper "One or more entities" | Entities the person is onboarded for | Required | 1 entity | All active entities | Active entities from the Entity master, A–Z, each with its invoice prefix | None | At least one | — | "Choose at least one entity" |
| Type | Segmented choice | Facilitator, channel partner or both | Required (always set) | N/A | N/A | Facilitator, Channel partner, Both | Facilitator | None | "Channel partner" and "Both" add a "Partner" / "Partner too" tag in the list and a Partner firm section on Verify KYC | N/A |

### 7.4 Verify KYC: decision inputs

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Section verdict (one per section) | Two-option toggle: Valid / Not valid | Decide on each section | Required for every shown section before finishing | N/A | N/A | Valid, Not valid | Not checked | All sections must have a verdict before Approve or Send back is enabled | Valid folds the section and clears its note | N/A (buttons stay disabled; bar shows "N of M checked") |
| What needs fixing? | Multi-line text (2 rows, placeholder "e.g. The PAN number doesn’t match the uploaded card") | Note sent to the facilitator | Required for each Not valid section | 1 non-space character | Requires Confirmation | Free text | Empty (kept if the verdict flips back to Not valid before Valid is chosen) | Not blank | Shown only while the section is Not valid | No inline error. Bar shows " · add a note to each" and Send back for changes stays disabled. |

### 7.5 Verify KYC: read-only section contents

All values are read-only; empty values show "—".

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Personal details | Read-only | Identity and contact | N/A | N/A | N/A | Facilitator code, Name, Date of birth, Mobile (+91), Alternate mobile, Email, Alternate email, Signature (shown in a handwriting style) | — | None | — | N/A |
| Address | Read-only | Current and permanent address | N/A | N/A | N/A | Address line 1, Address line 2, City ("City, State"), Country · PIN | — | None | If permanent equals current: "Permanent address: same as current" | N/A |
| Tax details | Read-only + documents | Tax identity | N/A | N/A | N/A | PAN number, PAN card, GST number, GST certificate; CIN number and Incorporation certificate when a CIN exists | — | None | GST and CIN typically present for channel partners | N/A |
| Bank details | Read-only cards + documents | Payout accounts | N/A | N/A | N/A | One card per account: bank name, "Primary account" / "Secondary account" (numbered if several); Account no., IFSC, Account holder, Branch (name · code); cancelled cheque and passbook documents | — | None | Missing documents show "No cancelled cheque" / "No passbook" | N/A |
| Qualifications & certifications | Read-only table | Education | N/A | N/A | N/A | Type, Course, Years (start – end), Institute, Document | — | None | — | N/A |
| Experience | Read-only table | Industry experience | N/A | N/A | N/A | Industry, Experience type, Years ("N yrs") | — | None | — | N/A |
| BYLD program certifications | Read-only table | Program certifications per entity | N/A | N/A | N/A | Entity, Sub-entity, Program, Certificate | — | None | — | N/A |
| Partner firm | Read-only | Channel partner's firm | N/A | N/A | N/A | Firm name, Email, Mobile, Website, Firm address | — | None | Only for Channel partner / Both | N/A |
| Social profiles | Links | Online profiles | N/A | N/A | N/A | LinkedIn, X / Twitter, Facebook (open in a new tab) | — | None | Missing: "<Name> — not added" | N/A |

### 7.6 Payment setup

Validation timing (BR-FAC-025): a step's errors appear when **Continue** is clicked on it, and every step's errors appear when **Send for approval** / **Send again** is clicked. A fee field with something typed in is also checked as soon as it is left (for example 0 → "Enter an amount above ₹0"); an empty one waits for **Continue** / **Send** (SH-004). Errors update live once shown. When a setup was sent or rejected before, the fields open with its values.

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Payment setup category | Select | New agreement or renewal | Required | N/A | N/A | New, Renewal | New | Must be chosen | — | "Choose a category" |
| Contract start date | Date picker (placeholder "Pick a date") | When the agreement starts | Required | Requires Confirmation (past dates accepted) | Requires Confirmation | A date | 7 days from today | Must be picked | Picking a date sets Financial year to the April–March year containing it | "Pick the start date" |
| Agreement validity | Select, helper "Runs till <date>" | How long the agreement runs | Required | 3 months | 36 months | 3 months, 6 months, 12 months, 24 months, 36 months | 12 months | Must be chosen | Helper end date = start date + validity − 1 day (BR-FAC-030) | "Choose how long the agreement runs" |
| Financial year | Select | Financial year of the agreement | Required | N/A | N/A | Three years: previous, current and next financial year (April–March), shown as e.g. "2026-27" | Financial year of the start date | Must be chosen | Set automatically when the start date changes; can be changed by hand | "Choose the financial year" |
| Agreement type | Segmented toggle; a line below explains the current choice | What the agreement covers | Required (always set) | N/A | N/A | "Facilitator" (pays them for delivering sessions), "Sales" (pays them for bringing in business), "Both" (pays them for sessions and for sales) | From the person's type: Facilitator → Facilitator agreement, Channel partner → Sales agreement, Both → Both | None | Summary shows "Facilitator", "Sales" or "Facilitator & sales" agreement | N/A |
| Agreement on behalf of | Segmented toggle; a line below explains the current choice | Whose name the agreement is made out in | Required (always set) | N/A | N/A | "<Person's name>" (made out to the person), "Their firm" (made out to their firm) | Facilitator / channel partner name | None | Summary shows the choice on its own line | N/A |
| Day-wise fee | Numeric text with ₹ icon (placeholder "0"), helper "Paid for each training day" | Fee per training day | Required | ₹1 (above ₹0) | ₹10,00,000; 7 digits | Digits only (anything else removed as typed) | Empty | Not blank; above 0; at most 10,00,000 | — | "Enter the day fee" / "Enter an amount above ₹0" / "Enter an amount up to ₹10,00,000" |
| Feedback slab | Select, placeholder "Select feedback range", helper "The feedback range and the bonus it earns, on top of the day fee" | The feedback range and its bonus | Optional | N/A | N/A | As on the old screen: "1.00 to 1.50 \| 0.00%", "1.50 to 2.00 \| 0.00%", "2.00 to 2.50 \| 0.00%", "2.50 to 3.00 \| 0.00%", "3.00 to 3.50 \| 0.00%", "3.50 to 4.00 \| 0.00%", "4.00 to 4.50 \| 0.00%", "4.50 to 5.00 \| 0.00%", "5.10 to 5.30 \| 0.00%", "5.30 to 5.40 \| 0.00%", "5.40 to 6.00 \| 10.00%" (BR-FAC-032) | None selected | None | Summary shows "feedback slab <range> (<bonus> bonus)" or "no feedback slab" | N/A |
| Coaching sessions | Switch, description "Also pays for one-to-one coaching" | Whether coaching is paid | Optional | N/A | N/A | On / Off | Off | None | On reveals Face-to-face fee and Virtual fee | N/A |
| Face-to-face fee | Numeric text with ₹ icon (placeholder "0") | Coaching fee, in person | Required when Coaching sessions is on | ₹1 | ₹10,00,000; 7 digits | Digits only | Empty | As Day-wise fee | Shown only when coaching is on; ignored when off | "Enter the face-to-face fee" / "Enter an amount above ₹0" / "Enter an amount up to ₹10,00,000" |
| Virtual fee | Numeric text with ₹ icon (placeholder "0") | Coaching fee, online | Required when Coaching sessions is on | ₹1 | ₹10,00,000; 7 digits | Digits only | Empty | As Day-wise fee | Shown only when coaching is on; ignored when off | "Enter the virtual fee" / "Enter an amount above ₹0" / "Enter an amount up to ₹10,00,000" |
| Flight classes allowed | Tap chips (multi-choice) | Flight entitlement | Required | 1 | 4 | Economy, Premium economy, Business, First class | Economy | At least one | — | "Pick at least one flight class" |
| Hotel categories allowed | Tap chips (multi-choice) | Hotel entitlement | Required | 1 | 5 | 3 star, 4 star, 5 star, 6 star, 7 star | 3 star and 4 star | At least one | — | "Pick at least one hotel category" |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-FAC-001 | Facilitator form validation timing | Errors show on leaving a field and on submit; required errors also show on blur. | Add / Edit facilitator | Errors appear per field | Leaving Name empty and tabbing on | "Enter the facilitator’s name" appears immediately (differs from SH-004) |
| BR-FAC-002 | Name required | Name must not be blank; saved trimmed. | Add / Edit | — | Spaces only | "Enter the facilitator’s name" |
| BR-FAC-003 | Email required and valid | Email required, valid format. | Add / Edit | — | "abc@x" | "Enter a valid email address" |
| BR-FAC-004 | Email unique | No two facilitators share an email (case-insensitive, trimmed). | Add / Edit (own email excluded) | Blocked inline; also re-checked on save | Existing email in other case | "Another facilitator already uses this email" (inline); on save "Another facilitator already uses this email." in the error toast |
| BR-FAC-005 | Mobile length by country | India: exactly 10 digits. Other countries: 6–14 digits. Digits only. | Add / Edit | — | 9 digits for India | "Enter a 10-digit mobile number" |
| BR-FAC-006 | Address required | Address line 1, Country, State and City required. Address line 2 optional. | Add / Edit | — | No city | "Select the city" |
| BR-FAC-007 | Cascading location | State depends on country; city on state. Changing a parent clears children. | Add / Edit | — | — | Placeholders "Pick a country first" / "Pick a state first" |
| BR-FAC-008 | At least one entity | Onboarding for needs one or more active entities. | Add / Edit | — | None chosen | "Choose at least one entity" |
| BR-FAC-009 | New facilitators start at KYC pending | Send KYC creates the record as KYC pending and sends the link. | Add | — | — | "KYC link sent" |
| BR-FAC-010 | Edit does not change status | Edit saves contact, location, entities and type only. | Edit | Status, dates and reminders unchanged | — | "Facilitator updated" |
| BR-FAC-011 | Status-specific row action | KYC pending → Resend KYC; Approval pending → Verify; Payment setup pending → Set up payment / View / Revise (by payment setup state, BR-FAC-024); Agreement expired → Send agreement renewal; Active → none. Edit on every row. | List | — | — | — |
| BR-FAC-012 | Resend only to unsubmitted KYC | Resend KYC applies only to KYC pending people who have not submitted. Each send sets Link sent to now and adds 1 reminder. | Resend KYC / Resend KYC to all | — | — | "KYC link sent again" / "KYC links sent again" |
| BR-FAC-013 | Notes required when sending back | Each Not valid section needs a note before Send back for changes is enabled. | Verify KYC | — | Not valid with empty note | Bar: " · add a note to each"; button disabled |
| BR-FAC-014 | All sections must be checked | Approve or Send back is possible only after every shown section has a verdict. | Verify KYC | — | Some unchecked | Bar "N of M checked"; Approve KYC disabled |
| BR-FAC-015 | Approve outcome | All sections Valid → status Payment setup pending; KYC done date = now; approver recorded. | Verify KYC | Return to list | — | "KYC approved" |
| BR-FAC-016 | Send-back outcome | Any section Not valid → status stays KYC pending, submission cleared (moves from Approval pending to KYC pending), link re-sent (Link sent = now), reminders +1, notes and sections recorded. | Verify KYC | Return to list | — | "Sent back for changes" |
| BR-FAC-017 | Only Approval pending can be verified | Verify KYC works only for a submitted, unapproved KYC. | Verify KYC | Others see "Nothing to verify here" | Approved / not submitted | "Nothing to verify here" / on finish "There’s no submitted KYC waiting for verification." |
| BR-FAC-018 | Bulk action covers the whole stage | Resend KYC to all acts on every KYC pending person, ignoring search and filters. It is the only bulk action; there are no payment setup reminders. | Waiting line | — | — | Confirmation states the full stage count |
| BR-FAC-019 | Agreement warning | Active agreements ending within 30 days are highlighted with "Ends in N days". | Active / All list | — | — | Amber text |
| BR-FAC-020 | Long-wait highlight | On KYC pending (Link sent), and on Payment setup rows still "Ready to set up" (since KYC done), waits of 7 days or more are highlighted. | List | — | — | Amber text |
| BR-FAC-021 | Payment setup approval and activation [Not Implemented] | Nothing in this application approves or rejects a payment setup, moves a facilitator from Payment setup pending to Active, sets an agreement end date, or marks an agreement expired. The person approves (→ Active) or rejects with a reason on their side. | — | — | — | — (OQ-FAC-002, OQ-FAC-003, OQ-FAC-017) |
| BR-FAC-022 | Delete / deactivate [Requires Confirmation] | There is no way to delete, deactivate or reject a facilitator outright. | — | — | — | — (OQ-FAC-005) |
| BR-FAC-023 | Payment setup only for Payment setup pending | A payment setup can be sent only for a person whose KYC was approved and who is not yet Active. | Payment setup | Send refused otherwise | Status changed meanwhile | "Couldn’t send the payment setup" — "This facilitator isn’t waiting for a payment setup." |
| BR-FAC-024 | Payment setup state | Each Payment setup pending person is in one state: none sent ("Ready to set up", button **Set up payment**), sent ("Waiting for <first name>", button **View**), or rejected ("Rejected by <first name>" with their reason, button **Revise**). | List, Payment setup | — | — | — |
| BR-FAC-025 | Payment setup validation timing | Required errors appear only after Continue on that step or Send; fee fields also show their error once left. Send checks every step and opens the first step with errors. | Payment setup | — | Continue with an empty day fee | "Enter the day fee" |
| BR-FAC-026 | Fee amounts | Day-wise, face-to-face and virtual fees are whole rupees, digits only, at most 7 digits, above ₹0 and at most ₹10,00,000. | Payment setup | Non-digits removed as typed; an 8th digit cannot be typed | 0 / 1000001 | "Enter an amount above ₹0" / "Enter an amount up to ₹10,00,000" |
| BR-FAC-027 | Coaching fees | When Coaching sessions is on, both Face-to-face fee and Virtual fee are required; when off, they are not checked. | Payment setup | — | Coaching on, Virtual fee empty | "Enter the virtual fee" |
| BR-FAC-028 | Travel entitlements | At least one flight class and at least one hotel category must be chosen. | Payment setup | — | All flight classes removed | "Pick at least one flight class" / "Pick at least one hotel category" |
| BR-FAC-029 | Payment setup defaults | A new setup starts with: category New; start date 7 days from today; validity 12 months; financial year of the start date (April–March); agreement type from the person's type (Facilitator → Facilitator, Channel partner → Sales, Both → Both); on behalf of the person; no feedback bonus; coaching off; Economy; 3 star and 4 star. Changing the start date resets the financial year to the year containing it. | Payment setup | — | — | — |
| BR-FAC-030 | Agreement end date | The agreement runs till the start date plus the validity in months, minus one day. | Payment setup | Shown as "Runs till <date>" and in the Summary | — | — |
| BR-FAC-031 | Send outcome | Sending stores the setup as sent with the date and the sending user's name and clears any earlier rejection. Status stays Payment setup pending. Sending again replaces the current terms but every send and every rejection is kept in a revision log (BR-FAC-033). | Payment setup | Row shows "Waiting for <first name>"; from round 2 the line below reads "Round <n> · resent <time ago>" | — | "Sent for approval" — "<Name> will review the payment setup" |
| BR-FAC-032 | Feedback slabs | The slab list matches the old system: eleven feedback ranges from 1.00 to 6.00; only 5.40 to 6.00 earns a bonus (10.00%). The ranges skip 5.00–5.10 exactly as on the old screen. | Payment setup | — | — | — (OQ-FAC-006) |
| BR-FAC-033 | Revision log | Each send (round number, date, sender, the terms) and each rejection (date, facilitator, reason) is logged. The log shows newest first in the payment setup view under the summary ("History"), and in the revise view behind "Show history" in the rejection banner. A resend lists only what changed since the previous round (old value struck through → new value), or "Sent again with no changes"; the first send shows the day fee and agreement period. | Payment setup | — | — | — |
| BR-FAC-034 | Facilitator details | Clicking an Active facilitator opens their details page (/facilitators/<id>), laid out like Client details: a hero (photo, name, facilitator code, type, city, Active; All facilitators and Edit buttons) with section tabs. Tabs: Overview (trainings delivered, rating, experience, agreement end with a 'renew soon' note within 30 days; contact; entities, type, industries, certifications; social profiles), Personal & address, Tax & bank, Qualifications (with BYLD program certifications), Experience, and Partner firm (channel partners only). All content comes from the approved KYC, read-only; documents open in the viewer; Edit opens the facilitator form. "View portfolio" (at the right end of the tab bar while it fits beside the tabs, otherwise beside the header buttons) opens the facilitator's portfolio page in a new browser tab — a full page without the app header or sidebar, showing a modern one-page portfolio website with illustrations, built from their record and KYC. Top bar: logo, "Portfolio · <name>", section links (About, Expertise, Programs, Journey, Voices, Contact; the section in view is highlighted), a light / dark toggle (shares the portal's theme setting) and "Download PDF"; at the top of the page the bar has no background, once scrolled a blurred glass pill appears behind it. Hero: "Verified LearnNext facilitator", "Hi, I'm <first name>", role, a one-line pitch (years and industries), "Work with <first name>" (email) and "See programs", rating stars and city, and the photo with an illustrated presentation board and floating trainings / rating facts. Then: four number tiles (years of experience, trainings delivered, rating with review count, certifications & programs); About (written from their data) with role, base, entities and start date; Expertise (years per industry with bars, certifications); Certified programs; an Education & certifications timeline; Voices (rating and three participant comments — sample comments until real feedback is connected, Requires Confirmation); a contact band (email, phone, city, social profiles) and a footer (code, type, generation date). Each section has its own illustration. The page works on phones (stacked layout, facts kept inside the photo, "PDF" short label) and in dark mode. "Download PDF" prints a separate two-page A4 document (not the website): page 1 header (photo, name, role, location, rating, verified), numbers, About, industry experience, certified in, works with, programs; page 2 education timeline, participant comments and a contact panel; each page has its own inner margin, and the document is always light. The tab title "<Name> · Portfolio" is the suggested file name. The open tab is kept in the URL. Other statuses do not open this page; a non-active or unknown id shows an empty state with a way back. | Facilitator details | — | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Add facilitator | Saved | Success toast | "KYC link sent" — "<Name> · <email>" | After Send KYC | None |
| Add facilitator | Failed | Error toast | "Couldn’t send the KYC link" — reason | After Send KYC | Fix and retry |
| Edit facilitator | Saved | Success toast | "Facilitator updated" — "<Name>" | After Save changes | None |
| Edit facilitator | Failed | Error toast | "Couldn’t save the facilitator" — reason | After Save changes | Retry |
| Resend KYC | Sent | Success toast | "KYC link sent again" — "<Name> · <email>" | After click | None |
| Send agreement renewal | Sent | Success toast | "Agreement renewal sent" — "<Name> · <email>" | After click | None |
| Resend KYC to all | Confirmed | Success toast | "KYC links sent again" — "N facilitators" / "1 facilitator" | After confirm | None |
| Resend KYC / renewal | Failed | Error toast | "Couldn’t send it" — reason | After click | Retry |
| Send payment setup | Sent | Success toast | "Sent for approval" — "<Name> will review the payment setup" | After Send for approval / Send again; modal closes | None |
| Send payment setup | Failed | Error toast | "Couldn’t send the payment setup" — reason | After Send for approval / Send again; modal stays | Retry or close |
| Payment setup sent | Opened while with the person | Information line | "Waiting for <first name> to approve · sent <date> by <sender name>" | In the read-only view | Close / Edit & resend |
| Payment setup rejected | Opened after rejection | Information panel | "<first name> rejected it on <date>" and "“<reason>”" | Above the steps (first step) | Revise, Send again |
| Discard payment setup | Close with changes | Confirmation dialog | "Discard this payment setup?" / "What you’ve filled in won’t be saved." | — | Keep editing / Discard |
| Approve KYC | Confirmed | Success toast | "KYC approved" — "<Name> moves on to payment setup." | After confirm, once the Facilitators list has loaded (SH-005) | — |
| Send back | Confirmed | Success toast | "Sent back for changes" — "<Name> will get the KYC link again with your notes." | After confirm, once the Facilitators list has loaded (SH-005) | — |
| Verify finish | Failed | Error toast | "Couldn’t finish the verification" — reason | After confirm | Return to list |
| Bulk confirmation (KYC) | Click Resend KYC to all | Confirmation dialog | "Resend KYC to everyone pending?" / "N facilitators will get their KYC link again by email." | — | Cancel / Resend KYC |
| Discard add | Close with changes | Confirmation dialog | "Discard this facilitator?" / "The details you’ve entered won’t be saved and no KYC link will be sent." | — | Keep editing / Discard |
| Discard edit | Close with changes | Confirmation dialog | "Discard your changes?" / "Your edits won’t be saved." | — | Keep editing / Discard |
| Approve confirmation | Click Approve KYC | Confirmation dialog | "Approve <Name>’s KYC?" / "They move on to payment setup." | — | Cancel / Approve KYC |
| Send back confirmation | Click Send back for changes | Confirmation dialog | "Send <Name>’s KYC back?" / "They’ll get the KYC link again with your notes on: <sections>." | — | Cancel / Send back |
| Leave Verify KYC | Leave with marked sections | Confirmation dialog | "Leave without finishing?" / "The sections you’ve marked won’t be saved." | — | Stay / Leave |

Toast behaviour per SH-005.

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Columns shown per selection | Show only what fits the status | Columns change with the selected step/pill | **All**: Facilitator, Location, Experience, Programs / certifications, Rating, Status, actions. **Active**: same with Agreement instead of Status. **Expired**: same with "Agreement ended". **KYC pending**: Facilitator, Mobile, Location, Onboarding for, Link sent, Reminders, actions. **Approval pending**: Facilitator, Mobile, Location, Onboarding for, Submitted, actions. **Payment setup**: Facilitator, Mobile, Location, Payment setup, actions (Onboarding for is not shown). | Lower-priority columns hide on narrower screens (SH-008) |
| Facilitator | Identify | Photo or initials, name, email. "Partner" tag for channel partners, "Partner too" for Both. Sortable. | Long values truncated with full text on hover | — |
| Location | Where they are | City over state. Sortable. | — | — |
| Experience | Seniority | "N yrs" over "N trainings" or "No trainings yet". Sortable. | — | "—" with tooltip "Not known until they finish KYC" |
| Programs / certifications | What they can deliver | First certification plus "+N"; all on hover | — | "—" |
| Rating | Quality | Star, score to one decimal, "(count)"; tooltip "X out of 5 from N ratings". Sortable. | — | "—" when no rating |
| Status | Where they are | Status badge: KYC pending, Approval pending, Payment setup pending, Active, Agreement expired. Sortable. | — | — |
| Agreement / Agreement ended | Agreement period | Active: "Till <date>" over "N months left", or amber "Ends in N days" within 30 days. Expired: red "Ended N days ago" over the date. Sortable. | — | — |
| Mobile | Contact | Shown as "98765 43210" | — | — |
| Onboarding for | Entities | First entity plus "+N"; all on hover | — | — |
| Link sent | How long they have waited | "today" or "N days ago" over the date; amber at 7+ days. Sortable; default sort (longest wait first). | — | — |
| Payment setup | Where the payment setup stands | "Ready to set up" over "KYC done X ago · <date>" (amber after 7 days); "Waiting for <first name>" over "Sent X ago · <date>"; "Rejected by <first name>" (red) over their reason in quotes, cut short with the full reason on hover. Sortable by the sent date, or the KYC done date if none sent; default sort (longest wait first). | BR-FAC-024 | — |
| Submitted | Approval wait | "Waiting for approval" over "Submitted X ago · <date>". Sortable; default sort. | — | — |
| Reminders | How often chased | "Resent Nx" or "Not yet". Sortable. | — | — |
| Phone cards | Mobile layout | Photo, name, email, status badge, type tag, row actions, city/state and created date | — | — |
| Pagination | — | 10 rows by default; 10 / 20 / 50 / All (SH-008) | — | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| No facilitators at all | Empty data | Empty state with Add facilitator button | "No facilitators yet" / "Add a facilitator and we’ll send them a KYC link." | Add facilitator |
| No matches | Search / filters / step return nothing | Empty state | "No facilitators match" / "Try a different search or loosen the filters." | **Clear search & filters** (also resets the step/pill) |
| Filter draft matches nothing | In the drawer | Apply button disabled | "No matching facilitators" | Change filters or Reset |
| Load failure | List cannot load | Error state with retry (SH-007) | Shared error state | Retry |
| Stage with nobody waiting | Selected step has 0 people | No waiting line; empty state | "No facilitators match" | Choose another step |
| Verify: unknown id | Bad or old link | Not-found state | "Facilitator not found" / "They may have been removed, or the link is out of date." | All facilitators |
| Verify: not awaiting approval | Already decided or not submitted | Nothing-to-verify state | "Nothing to verify here" / "<Name> doesn’t have a submitted KYC waiting for verification." | All facilitators |
| Verify: decided elsewhere meanwhile | Another session decided first | Finish fails | "Couldn’t finish the verification" — "There’s no submitted KYC waiting for verification." | Return to list |
| Duplicate email race | Email taken between check and save | Save fails | "Couldn’t send the KYC link" — "Another facilitator already uses this email." | Change email |
| Non-India mobile shown on Verify KYC | Facilitator outside India | Mobile always prefixed "+91" on Verify KYC | — | OQ-FAC-008 |
| Bulk confirmation for one person | Stage has 1 person | Dialog says "1 facilitators will get…" | As shown | OQ-FAC-009 (wording) |
| Payment setup: no longer pending | Status changed or record removed before sending | Send fails; modal stays open | "Couldn’t send the payment setup" — "This facilitator isn’t waiting for a payment setup." / "This facilitator no longer exists." | Close and reload the list |
| Payment setup: start date outside the year list | Start date picked in a financial year that is not one of the three offered | Financial year is set to that year, which is not in the list | — | OQ-FAC-017 |
| Payment setup: long rejection reason | Reason longer than the cell | Reason cut short in the list; full text on hover and in the Revise view | — | — |
| Waiting line wording (Payment setup) | Payment setup step selected | Text reads "need a payment setup or  waiting on it" | As shown | OQ-FAC-009 (wording) |
| Data reset | Page reload | Demo data restored (SH-001). In the demo, one Payment setup pending person has a sent setup and one has a rejected setup. | — | — |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| [Settings – Finance masters (Entity)](settings-finance-masters-prd.md) | Source of **Onboarding for** options and the Onboarded for filter | Entity made active / inactive | Only active entities can be chosen; entity names shown on rows | BR-FAC-008 |
| Client location lookups ([Clients](clients-prd.md)) | Country / state / city choices are the same list used by the Add client form, not the Settings location masters | — | Five countries available | BR-FAC-007 |
| [Settings – Access masters](settings-access-masters-prd.md) | Roles & Access stores Facilitators permissions incl. "approve"; Menu Mapping lists Facilitators | — | Not enforced (SH-002) | — |
| [App shell & navigation](app-shell-navigation-prd.md) | Sidebar item "Facilitators"; breadcrumb "Facilitators › Verify KYC"; leave guard on sidebar, breadcrumb, search and user menu | Navigate away from Verify KYC | Leave confirmation | SH-006, SH-009 |
| [Support desk](support-desk-prd.md) | Facilitators also raise support tickets (shown as "Facilitator") | — | Tickets are separate records; not linked to the facilitator record | — |
| Facilitator-facing KYC / payment portal (outside this application) | Receives links, renewals, send-back notes and payment setups; supplies KYC submissions and the approval or rejection (with reason) of payment setups | Send KYC, resend, renewal, send back, send payment setup | Requires Confirmation | OQ-FAC-001..004, OQ-FAC-017 |

## 13. Acceptance Criteria

**AC-FAC-001: Add a facilitator**
- Given the Add facilitator modal is open
- When I enter a valid name, unique email, 10-digit mobile, address line 1, country India, a state, a city, at least one entity, and click **Send KYC**
- Then the toast "KYC link sent" with "Name · email" appears and the modal closes
- And the person is counted under KYC pending with Link sent "today" and Reminders "Not yet"

**AC-FAC-002: Required fields on add**
- Given the Add facilitator modal is empty
- When I click **Send KYC**
- Then errors show: "Enter the facilitator’s name", "Enter their email — the KYC link goes here", "Enter their mobile number", "Enter the address", "Select the state", "Select the city", "Choose at least one entity"
- And nothing is saved

**AC-FAC-003: Duplicate email**
- Given a facilitator with email a@b.com exists
- When I type "A@B.com " in Email of a new facilitator and leave the field
- Then "Another facilitator already uses this email" appears

**AC-FAC-004: Mobile length**
- Given country is India
- When I enter 9 digits and leave the field
- Then "Enter a 10-digit mobile number" appears; letters typed are removed; more than 10 digits cannot be typed
- And for another country, fewer than 6 digits shows "Enter a valid mobile number" and more than 14 cannot be typed

**AC-FAC-005: Cascading location**
- Given a state and city are chosen
- When I change the country
- Then State and City are cleared and the mobile prefix changes

**AC-FAC-006: Discard confirmation**
- Given I typed in the Add facilitator modal
- When I press Esc or click Cancel
- Then "Discard this facilitator?" appears; **Keep editing** returns to the form; **Discard** closes without saving
- And clicking the backdrop does not close the modal

**AC-FAC-007: Edit**
- Given I open Edit on a facilitator
- Then **Save changes** is disabled until I change a field
- When I change the city and save
- Then "Facilitator updated" appears and the status is unchanged

**AC-FAC-008: Columns follow the selection**
- Given the list is on All
- When I click the KYC pending step
- Then the columns are Facilitator, Mobile, Location, Onboarding for, Link sent, Reminders, sorted by the longest wait first
- And clicking the step again returns to All columns

**AC-FAC-009: Resend KYC**
- Given a KYC pending person with "Resent 1x"
- When I click Resend KYC
- Then "KYC link sent again" appears, Link sent shows "today" and Reminders shows "Resent 2x"

**AC-FAC-010: Bulk resend**
- Given 5 people are KYC pending and a search hides 3 of them
- When I click **Resend KYC to all** and confirm **Resend KYC**
- Then all 5 are sent the link and "KYC links sent again" / "5 facilitators" appears
- And clicking Cancel instead sends nothing

**AC-FAC-011: Approval pending rows open Verify KYC**
- Given the Approval pending step is selected
- When I click a row or its **Verify** button
- Then Verify KYC opens for that person
- And clicking a Payment setup pending row opens its payment setup; rows in other statuses do nothing on click

**AC-FAC-012: Approve KYC**
- Given I am on Verify KYC
- When I mark every section Valid and confirm **Approve KYC**
- Then "KYC approved" appears, I return to the list, and the person is under Payment setup

**AC-FAC-013: Send back requires notes**
- Given every section is checked and one is Not valid with no note
- Then **Send back for changes** is disabled and the bar shows "1 section needs changes · add a note to each"
- When I type a note and confirm **Send back**
- Then "Sent back for changes" appears and the person is under KYC pending with Reminders increased by 1

**AC-FAC-014: Approve blocked until all checked**
- Given 3 of 9 sections are checked
- Then **Approve KYC** is disabled and the bar shows "3 of 9 checked"

**AC-FAC-015: Leave guard**
- Given at least one section is marked
- When I click a sidebar menu item
- Then "Leave without finishing?" appears; **Stay** keeps me on the page; **Leave** navigates

**AC-FAC-016: Not verifiable**
- Given an Active facilitator's id
- When I open its Verify KYC address
- Then "Nothing to verify here" is shown with **All facilitators**

**AC-FAC-017: Filters**
- Given the Filter facilitators drawer
- When I choose a state with 4 facilitators
- Then the button reads "Show 4 facilitators"; applying shows 4 rows and a state chip; removing the chip restores the list

**AC-FAC-018: Payment setup view of the list**
- Given the Payment setup step is selected
- Then the columns are Facilitator, Mobile, Location, Payment setup, sorted by the longest wait first
- And each row shows "Ready to set up" with **Set up payment**, "Waiting for <first name>" with **View**, or "Rejected by <first name>" with their reason and **Revise**
- And there is no reminder action on the rows or the waiting line

**AC-FAC-019: Set up payment and send for approval**
- Given a Payment setup pending person with no setup
- When I click **Set up payment**
- Then "Set up payment" opens on the Agreement step with start date 7 days from today, validity 12 months, "Runs till <date>" and the matching financial year
- When I click **Continue**, enter a day fee of 18000, click **Continue** and then **Send for approval**
- Then "Sent for approval" / "<Name> will review the payment setup" appears, the modal closes and the row shows "Waiting for <first name>" with **View**
- And the status is still Payment setup pending

**AC-FAC-020: Fee validation**
- Given I am on the Fees step
- When I click **Continue** with Day-wise fee empty
- Then "Enter the day fee" appears and I stay on the step
- And typing letters has no effect, an 8th digit cannot be typed, and 0 shows "Enter an amount above ₹0" when I leave the field

**AC-FAC-021: Coaching fees**
- Given Coaching sessions is switched on
- When I click **Continue** with Face-to-face fee and Virtual fee empty
- Then "Enter the face-to-face fee" and "Enter the virtual fee" appear
- And switching coaching off lets me continue

**AC-FAC-022: View a sent setup**
- Given a person whose setup was sent
- When I click **View**
- Then "Payment setup" opens read-only with "Waiting for <first name> to approve · sent <date> by <sender name>" and the summary
- When I click **Edit & resend**
- Then the steps open with the sent values and the last button reads **Send again**

**AC-FAC-023: Revise a rejected setup**
- Given a person who rejected their setup
- When I click **Revise**
- Then "Revise payment setup" opens with "<first name> rejected it on <date>" and their reason in quotes above the steps
- When I change the day fee and click **Send again**
- Then "Sent for approval" appears and the row shows "Waiting for <first name>"

**AC-FAC-024: Discard payment setup**
- Given I changed a field in the payment setup
- When I press Esc or click Cancel
- Then "Discard this payment setup?" appears; **Keep editing** returns; **Discard** closes without sending
- And closing the read-only view never asks

**AC-FAC-025: Payment setup revision log**
- Given a setup that was sent, rejected and sent again
- When I click **View**
- Then a "History" timeline under the summary lists, newest first, "Round 2 · sent by <sender name>" with only the changed terms (old value struck through → new value), "Round 1 · rejected by <first name>" with the reason, and "Round 1 · sent by <sender name>" with the day fee and agreement period
- And the row reads "Round 2 · resent <time ago>"
- When I click **Revise** on a rejected setup that has history, **Show history** in the rejection banner opens the same timeline

**AC-FAC-026: Open an active facilitator**
- Given an Active facilitator in the list
- When I click their row
- Then Facilitator details opens (breadcrumb "Facilitators › Facilitator details") with their photo, name, code chip, type, city and "● Active", **All facilitators** and **Edit**
- And the tabs read Overview, Personal & address, Tax & bank, Qualifications, Experience (and Partner firm for channel partners); the open tab is kept in the link
- And rows in other statuses keep their own action (Verify KYC, payment setup) and never open this page

**AC-FAC-027: View portfolio**
- Given Facilitator details is open
- When there is room beside the tabs, **View portfolio** sits at the right end of the tab bar; otherwise it sits beside **All facilitators** and **Edit**
- When I click it
- Then the portfolio opens in a new browser tab without the app header or sidebar, titled "<Name> · Portfolio"
- When I click **Download PDF**
- Then the print dialog opens with a two-page A4 document (not the website), with inner margins, always light
- When I use the sun / moon button
- Then the page switches between light and dark, and the portal keeps the same choice

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-FAC-001 | AC-FAC-001, BR-FAC-009 | Add valid facilitator | List open | Name "Test One", email test.one@example.com, mobile 9876543210, India/Delhi/New Delhi, 1 entity | "KYC link sent"; KYC pending count +1 | P1 |
| TC-FAC-002 | AC-FAC-002 | Submit empty form | Add modal | — | 7 required errors; nothing saved | P1 |
| TC-FAC-003 | BR-FAC-001 | Required error on blur | Add modal | Tab out of empty Name | "Enter the facilitator’s name" appears at once | P2 |
| TC-FAC-004 | BR-FAC-003 | Email format boundary | Add modal | "a@b.c" (1 char TLD) / "a@b.co" | Invalid / valid | P2 |
| TC-FAC-005 | BR-FAC-004 | Duplicate email, case and spaces | Existing facilitator email | Same email upper-case with trailing space | Duplicate error | P1 |
| TC-FAC-006 | BR-FAC-004 | Edit keeps own email | Edit modal | Unchanged email, change city | Saves | P2 |
| TC-FAC-007 | BR-FAC-005 | India mobile boundaries | Country India | 9 digits / 10 digits / typing 11th digit | Error / valid / blocked | P1 |
| TC-FAC-008 | BR-FAC-005 | Other country boundaries | Country Singapore | 5 / 6 / 14 / 15th digit | Error / valid / valid / blocked; prefix +65 | P2 |
| TC-FAC-009 | BR-FAC-005 | Non-digits stripped | Add modal | "98-765 abc" | Field shows "98765" | P3 |
| TC-FAC-010 | BR-FAC-007 | Country change clears state/city | State and city set | Change to United Kingdom | State and City empty; State shows options England, Scotland | P2 |
| TC-FAC-011 | BR-FAC-005 | Switch to India with 12-digit number | Country UAE, 12 digits | Change to India | "Enter a 10-digit mobile number" once shown | P3 |
| TC-FAC-012 | AC-FAC-006 | Discard flows | Typed in add modal | Esc / Cancel / backdrop | Dialog / dialog / no effect | P2 |
| TC-FAC-013 | AC-FAC-007, BR-FAC-010 | Edit disabled until change; status unchanged | Edit a Payment setup person | Change name | "Facilitator updated"; still Payment setup | P2 |
| TC-FAC-014 | AC-FAC-008 | Columns per selection | List | Click each step and pill | Columns as section 10 | P2 |
| TC-FAC-015 | AC-FAC-009, BR-FAC-012 | Resend KYC | KYC pending row | — | Toast; "today"; reminders +1 | P1 |
| TC-FAC-016 | AC-FAC-010, BR-FAC-018 | Bulk resend ignores search | KYC pending + search | — | All in stage sent | P2 |
| TC-FAC-017 | BR-FAC-011 | Agreement renewal | Expired row | — | "Agreement renewal sent"; status unchanged | P2 |
| TC-FAC-018 | BR-FAC-011 | Active rows | Active filter | — | Only pencil shown | P3 |
| TC-FAC-019 | AC-FAC-011 | Row click | Approval pending, Payment setup pending and Active rows | Click row | Verify KYC / payment setup / nothing | P2 |
| TC-FAC-020 | AC-FAC-012, BR-FAC-015 | Approve | Approval pending person | All Valid | "KYC approved"; under Payment setup; KYC done "today" | P0 |
| TC-FAC-021 | AC-FAC-013, BR-FAC-013, BR-FAC-016 | Send back | Approval pending person | 1 Not valid, note "PAN mismatch" | "Sent back for changes"; KYC pending; Resent +1 | P0 |
| TC-FAC-022 | BR-FAC-013 | Note of spaces only | Not valid section | "   " | Send back stays disabled | P2 |
| TC-FAC-023 | BR-FAC-014 | Partially checked | Verify page | 8 of 9 | Approve disabled; "8 of 9 checked" | P1 |
| TC-FAC-024 | 5.5 | Partner firm section | Channel partner in Approval pending | — | Partner firm section shown (9 sections); not for Facilitator type (8) | P2 |
| TC-FAC-025 | 5.5 | Valid folds and advances | Verify page | Click Valid on first section | Folded "Marked valid · show details"; scrolls to next unchecked | P3 |
| TC-FAC-026 | 5.5 | Document viewer | Verify page | Click "PAN-card.pdf" | Viewer with Open in new tab, Download | P2 |
| TC-FAC-027 | AC-FAC-015 | Leave guard | 1 section marked | Click breadcrumb "Facilitators" | "Leave without finishing?" | P2 |
| TC-FAC-028 | 5.5 | Cancel bypasses guard | 1 section marked | Click Cancel | Returns to list without dialog | P3 |
| TC-FAC-029 | AC-FAC-016, BR-FAC-017 | Invalid verify targets | — | Unknown id; Active id | "Facilitator not found"; "Nothing to verify here" | P2 |
| TC-FAC-030 | AC-FAC-017 | Filter drawer apply / reset | List | Type = Both; Reset | Count label updates; Reset keeps step | P3 |
| TC-FAC-031 | 7.1 | Search fields | List | Part of a mobile number; a state name | Matching rows | P3 |
| TC-FAC-032 | 11 | No match | List | "zzzz" | "No facilitators match"; Clear search & filters works | P3 |
| TC-FAC-033 | AC-FAC-018, BR-FAC-024 | Payment setup columns and states | Payment setup step (demo data) | — | Columns Facilitator, Mobile, Location, Payment setup; one "Waiting for", one "Rejected by" with reason, others "Ready to set up" (amber at 7+ days); buttons Set up payment / View / Revise; no reminder actions or bulk button | P1 |
| TC-FAC-034 | AC-FAC-019, BR-FAC-029, BR-FAC-031 | Set up and send | Person with no setup | Defaults, day fee 18000 | "Sent for approval"; row "Waiting for <first name>" "Sent today"; status unchanged | P0 |
| TC-FAC-035 | BR-FAC-029 | Defaults by type | Channel partner / Both / Facilitator person | Open Set up payment | Agreement type Sales / Both / Facilitator; on behalf of the person; Economy; 3 star and 4 star | P3 |
| TC-FAC-036 | BR-FAC-029 | Financial year follows start date | Agreement step | Start date 31 Mar 2027 / 1 Apr 2027 | Financial year 2026-27 / 2027-28 | P2 |
| TC-FAC-037 | BR-FAC-030 | Runs till | Agreement step | Start 10 Nov 2026; validity 3 / 12 months | Runs till 9 Feb 2027 / 9 Nov 2027 | P2 |
| TC-FAC-038 | AC-FAC-020, BR-FAC-025, BR-FAC-026 | Day fee boundaries | Fees step | Empty + Continue / 0 / 1 / 1000000 / 1000001 / "12a3" / 8th digit | Required error / above ₹0 error / valid / valid / up to ₹10,00,000 error / "123" / blocked | P1 |
| TC-FAC-039 | BR-FAC-025 | No required errors before Continue | Fees step just opened | — | No errors until Continue (or leaving a fee field) | P3 |
| TC-FAC-040 | AC-FAC-021, BR-FAC-027 | Coaching fees | Fees step | Coaching on, fees empty; then off | Both errors; continues once off | P2 |
| TC-FAC-041 | BR-FAC-028 | Travel minimums | Travel & stay step | Remove Economy; remove 3 and 4 star; Send | "Pick at least one flight class", "Pick at least one hotel category"; not sent | P2 |
| TC-FAC-042 | BR-FAC-025 | Send jumps to the first step with errors | Reached Travel & stay; Back to Fees, clear the day fee, click the Travel & stay step | Send for approval | Modal opens the Fees step with "Enter the day fee" | P2 |
| TC-FAC-043 | AC-FAC-022 | View and Edit & resend | Sent setup (demo) | View, then Edit & resend, Send again | Read-only line and summary; steps hold sent values; "Sent for approval"; sent date today | P1 |
| TC-FAC-044 | AC-FAC-023 | Revise rejected | Rejected setup (demo) | Revise, day fee 18000, Send again | Reason shown; row becomes "Waiting for <first name>" | P1 |
| TC-FAC-045 | AC-FAC-024 | Discard payment setup | Changed a field | Esc / Cancel / backdrop / Close in read-only view | Dialog / dialog / no effect / closes without dialog | P2 |
| TC-FAC-046 | AC-FAC-025, BR-FAC-033 | Revision log after a resend | Rejected setup (demo) | Revise, day fee 18000, Send again; then View | History: Round 2 sent with "Day fee ₹15,000 → ₹18,000", Round 1 rejected with reason, Round 1 sent; row "Round 2 · resent today" | P1 |
| TC-FAC-047 | AC-FAC-025 | Resend with no changes | Rejected setup (demo) | Revise, Send again without changes; View | Round 2 entry reads "Sent again with no changes" | P3 |
| TC-FAC-048 | AC-FAC-026, BR-FAC-034 | Open an active facilitator | Active facilitator in the list | Click the row; switch tabs; reload | Details page opens; each tab shows its KYC content; the tab survives reload | P1 |
| TC-FAC-049 | AC-FAC-026 | Non-active id in the link | KYC or Payment setup pending person | Open /facilitators/<id> directly | Empty state "No profile to show yet" with **All facilitators** | P2 |
| TC-FAC-050 | AC-FAC-027 | Portfolio placement | Facilitator details | Wide screen; then narrow until the tabs would overflow | Button at the tab bar's end; then beside the hero buttons (never both) | P2 |
| TC-FAC-051 | AC-FAC-027 | Portfolio page and PDF | Facilitator details | View portfolio; Download PDF; save as PDF with margins set to None | New tab, no app shell, tab title "<Name> · Portfolio"; PDF has two A4 pages with inner margins, nothing cut at the edges, no third page | P1 |
| TC-FAC-052 | AC-FAC-027 | Portfolio on a phone | Portfolio open | Width 375px; scroll the page | No sideways scrolling; number tiles show icon above number; trainings / rating facts stay within the photo; top bar shows "PDF" | P2 |
| TC-FAC-053 | AC-FAC-027 | Portfolio dark mode | Portfolio open in light mode | Click the moon; reload; open the portal | Page turns dark and stays dark after reload; the portal is dark too; Download PDF still prints a light document | P3 |
| TC-FAC-054 | AC-FAC-027 | Portfolio top bar | Portfolio open at the top | Scroll down; scroll back up | No bar background at the top; blurred pill appears once scrolled and goes at the top; the section in view is highlighted | P3 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-FAC-001 | KYC link / emails | What the KYC, KYC resend, payment setup, renewal and send-back emails contain; link validity; how notes reach the facilitator | Facilitator experience and support load | Define email templates and link expiry | Open |
| OQ-FAC-002 | Payment setup approval | How the facilitator approves or rejects the payment setup on their side (outside this app), and how the user is notified of either answer | Nothing in this app approves or rejects; the user only sees the state change in the list | Define the facilitator-side approval/rejection flow and its notifications | Open |
| OQ-FAC-003 | Lifecycle | How and when Active becomes Agreement expired (automatic on end date?) | Status accuracy | Confirm automatic expiry rule and timezone | Open |
| OQ-FAC-004 | Send agreement renewal | What happens after renewal is sent; how the person returns to Active; no record of renewal is visible | Expired people may stay expired forever | Define renewal flow and show "renewal sent" in the list | Open |
| OQ-FAC-005 | Facilitators list | No delete, deactivate, or outright reject; Facilitator details opens for Active people only (not Agreement expired) | Data hygiene; offboarding | Confirm whether these are needed | Open |
| OQ-FAC-006 | Payment setup: feedback slabs | The slabs copy the old screen: the scale runs to 6.00, the range 5.00–5.10 is missing, and only 5.40–6.00 pays a bonus (10%) | A gap or wrong scale would misstate what the facilitator is paid | Confirm the rating scale (5 or 6), the missing 5.00–5.10 range, and what the bonus % is applied to | Open |
| OQ-FAC-007 | Verify KYC | Send-back notes and history are stored but not shown anywhere in the portal (e.g. on the KYC pending row) | Training Partner users can't see why someone was sent back | Show last send-back reason / history | Open |
| OQ-FAC-008 | Verify KYC | Mobile numbers always show "+91", even for facilitators outside India | Incorrect display | Use the country's dial code | Open |
| OQ-FAC-009 | Bulk confirmation / waiting line | Description says "1 facilitators" when one person is waiting; the Payment setup waiting line reads "need a payment setup or  waiting on it" | Wording | *Proposed: "1 facilitator will get…"* and *Proposed: "N need a payment setup or are waiting on one"* | Open |
| OQ-FAC-010 | Verify KYC leave guard | Cancel and the sidebar Support desk card leave without the "Leave without finishing?" check | Lost verdicts | Confirm whether all exits should be guarded | Open |
| OQ-FAC-011 | Add / Edit | Maximum lengths for name, email and address lines | Data quality | Define limits | Open |
| OQ-FAC-012 | Add / Edit | Editing the email of a KYC pending person does not resend the link | Link may go to the wrong address | Decide whether email change should resend | Open |
| OQ-FAC-013 | Validation timing | Required errors show on blur, unlike SH-004 | Consistency | Confirm intended timing | Open |
| OQ-FAC-014 | Roles | "approve" permission exists in Roles & Access but is not enforced on Verify KYC | Segregation of duties | Confirm enforcement | Open |
| OQ-FAC-015 | Verify KYC | Facilitator code format and the "profile note" from the KYC form (not displayed) | Completeness | Confirm code format and whether the note should show | Open |
| OQ-FAC-016 | Payment setup: sales agreements | Agreement type Sales or Both uses the same fee fields as a facilitator agreement; there are no commission fields | Channel partners may be paid on commission, not day fees | Confirm whether sales agreements need commission fields | Open |
| OQ-FAC-017 | Payment setup: approval outcome | What happens on approval: does the person become Active at once or from the contract start date; is the agreement end date the start date + validity − 1 day as shown; what if the start date is in the past or its financial year is not one of the three offered | Status and agreement dates in the list depend on it | Define the Active and agreement-date rules on approval and limits on the start date | Open |
| OQ-FAC-018 | Payment setup: editing while sent | Edit & resend replaces a setup that is still with the facilitator, with no withdrawal step or notice to them; every send and rejection is now kept in the revision log (BR-FAC-033) | The person may act on an outdated setup | Decide whether editing while sent is allowed and how the earlier version is withdrawn | Open |
| OQ-FAC-019 | Portfolio: participant feedback | "What participants say" shows sample comments; the "how I work" points and the About text are generated, not written by the facilitator | A client-facing page must not show invented quotes | Connect real session feedback (with consent) and decide whether facilitators can write their own bio and approach | Open |
| OQ-FAC-020 | Portfolio: sharing | The portfolio opens only for signed-in Training Partner users; it contains personal contact details | Clients can't open the link; privacy of contact details | Decide whether a public share link is needed, what it hides, and whether it expires | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and features identified: Complete
- [x] User roles and access: Complete (no enforcement, SH-002)
- [x] Page behaviour, actions and row actions: Complete
- [x] Workflows: Complete
- [x] Field-level specifications: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (text maximum lengths undefined, see OQ-FAC-011)
- [x] Validation and business rules: Complete
- [x] Success, error and confirmation messages: Complete
- [x] Search, filters, tables: Complete
- [x] Empty states and edge cases: Complete
- [ ] Status lifecycle: Incomplete (payment setup approval / rejection → Active, expiry and renewal outcomes undefined, see OQ-FAC-002..004, OQ-FAC-017)
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria: Complete
- [x] QA scenarios: Complete
- [ ] External communications (emails, links): Incomplete (see OQ-FAC-001)
