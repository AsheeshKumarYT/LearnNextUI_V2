# Settings – Bank Masters: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Settings – Bank Masters PRD |
| Module name | Settings – Bank Masters (Bank master, House bank master) |
| Document ID | PRD-BNK |
| Version | 1.0 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Implemented (both masters can be listed, searched, filtered, added, edited and deleted; no other page uses the house bank accounts yet, see OQ-BNK-001) |
| Last updated | 2026-11-19 (v1.0: first version — Bank master and House bank master built, replacing the "is on the way" placeholders described in PRD-SET) |
| Related modules/pages | [settings-hub-prd.md](settings-hub-prd.md), [settings-finance-masters-prd.md](settings-finance-masters-prd.md), [facilitators-prd.md](facilitators-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

The **Banks** group in Settings ("Bank accounts used for billing.") holds two masters:

- **Bank master** ("Banks and branches"): the list of banks that Training Partner users can pick when they record a bank account. A bank can be switched off (**Disabled**) so that it is no longer offered for new accounts, without touching the accounts that already use it.
- **House bank master** ("Your own receiving accounts"): the bank accounts that each of the Training Partner's own legal entities (from the Entity master) receives payments in, with the IFSC, branch, a cancelled cheque or passbook page, and which account is the entity's **primary** (default) account.

Objectives:

- Keep one clean list of banks, with no duplicate names, that the house bank form picks from.
- Record every receiving account per entity with the details an invoice or payment instruction needs (account number, IFSC, holder name, branch) and proof of the account (cancelled cheque or passbook).
- Make it clear which account is each entity's primary account, and keep exactly one primary per entity when a new one is chosen.
- Protect data that is in use: a bank that accounts use cannot be deleted; it is disabled instead.

## 3. Module and Page Overview

Both pages open from **Settings › Banks** (see [settings-hub-prd.md](settings-hub-prd.md)). The header breadcrumb reads "Settings › Bank master" or "Settings › House bank master"; the "Settings" crumb leads back to the hub (SH-009). Both follow the All Clients list pattern (SH-008).

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Bank master | List of banks offered in the house bank form, with how many house accounts use each | Training Partner user | Filter by status pill, search, open Filters (house accounts, added by), Add bank, Edit, Delete, sort, paginate | House bank master, Settings hub |
| Add / Edit bank (modal) | Create or change a bank: name and Enabled switch | Training Partner user | Save bank, Save changes, Cancel | Bank master |
| House bank master | List of the entities' receiving accounts | Training Partner user | Filter by type pill, search, open Filters (entity, bank), Add account, Edit, Delete, View cheque, sort, paginate | Bank master, Entity master, Settings hub |
| Add / Edit house bank account (modal) | Create or change a receiving account | Training Partner user | Save account, Save changes, Cancel / Discard | House bank master |
| Cheque preview | View the uploaded cancelled cheque or passbook page | Training Partner user | View, open in a new tab, download | House bank master |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Training Partner user (signed in and continuing as Training Partner) | Both pages (SH-002, SH-003) | View, search, filter, sort, paginate, add, edit, delete | Role-based limits defined in Roles & Access are not enforced (SH-002, OQ-SET-005). |
| Super Admin | None | None | Settings addresses open Manage Clients (BR-SA-002). |
| Signed-out visitor | None | None | Redirected to Sign in (SH-003). |

## 5. Page Functionality and Behavior

### 5.1 Shared frame (both pages)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| List card | Hold the toolbar and the list | Open the page | One card fills the page height on large screens, following the All Clients list pattern (SH-008); on phones the outer frame is dropped (SH-013) | — | Consistent list layout |
| Summary pills | Show totals and filter | Click a pill | Three pills, each with its count; all three are single-choice filters. The "All …" pill is the resting state | Counts are of all records, not the filtered list. Hidden on phones, where the same choice moves into the Filters drawer (SH-013) | Filtered list |
| Search box | Find a record by text | Type | Rows filter as the user types (short delay of about 0.15 s); matching ignores case and surrounding spaces and is a "contains" match | Fields searched differ per page (section 10) | Matching rows only |
| Filters button | Open the filter drawer | Click **Filters** | Opens the page's drawer (5.4, 5.8). The button shows the number of applied drawer filters (on phones the pill choice is counted too) | — | Drawer opens |
| Add button | Create a record | Click **Add bank** / **Add account** | Opens the add modal | — | Modal opens |
| Result line | Explain the current filter | Search or filter | "**N** of **Total** banks / accounts" with removable chips and **Clear all** (SH-008) | Shown only while a search, a pill or a drawer filter is active. **Clear all** resets the pill, the search and the drawer filters | Clear view of what is shown |
| Table / cards | Show records | Scroll, sort, page | Table from tablet width up with a header that stays pinned while scrolling on large screens; cards on phones (SH-008). Clicking a row or card opens Edit | 10 rows per page; choices 10, 20, 50 rows or "All rows" | — |
| Row actions | Edit or delete | Click the pencil or bin icon | Pencil opens Edit; bin starts Delete (5.3, 5.7). Clicking an action does not also open the row | Accessible names "Edit <name>" / "Delete <name>" | — |
| Loading | Show progress | Open the page | Skeleton rows and pill placeholders (SH-007) | — | — |
| Load failure | Recover | Click **Try again** | Error state with the error text (SH-007) | Failures do not normally occur with demo data (SH-001) | List reloads |

### 5.2 Bank master list

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by status | Click | "All banks" (tooltip "Show all banks"), "Enabled" (tooltip "Banks offered in house bank forms"), "Disabled" (tooltip "Banks not offered for new accounts") | Demo data: 17 / 15 / 2 | Filtered list |
| Search | Find a bank | Type in "Search bank…" | Matches the bank name only | — | — |
| **Bank** column | Identify the bank | — | An initials tile (for example "D" for Deutsche Bank, "IO" for Indian Overseas Bank, "HS" for Hongkong & Shanghai Banking Corporation) and the bank name | Always shown; cannot be hidden; sortable; default sort A–Z | — |
| **House accounts** column | Show use | — | "N house account" / "N house accounts", or a quiet "No accounts" | Sortable | — |
| **Status** column | Show whether the bank is offered | — | Status dot and word: "Enabled" or "Disabled" | Sortable | — |
| **Added by** column | Who added the bank | — | Avatar and name | Shown from large width; sortable | — |
| **Added on** column | When it was added | — | Date (SH-012) | Shown from large width; sortable | — |
| Phone card | Phone layout | — | Tile, bank name, "N house accounts" / "No accounts", status, footer "Added by <name>" with the date, and the Edit / Delete icons | — | Tap opens Edit |

### 5.3 Add / Edit bank modal and Delete bank

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Modal header | Explain the form | Open | Add: title "Add bank", description "Used for house bank accounts." Edit: title "Edit bank", description = the bank's name | Small modal | — |
| Bank name | Name the bank | Type | Text box, placeholder "e.g. State Bank of India", focused on open | See 7.1; BR-BNK-001 | — |
| Enabled switch | Offer the bank or not | Toggle | Label "Enabled", help text "Shown in house bank forms". New banks start enabled | When editing a bank that accounts use and switching it off, a note appears: "N house account(s) keep this bank; it just won’t be offered for new accounts." | — |
| **Save bank** / **Save changes** | Save | Click, or press Enter in the name box | Validates (7.1). On success the modal closes, the list reloads and a success toast shows (section 9). The signed-in user's name is recorded as "Added by" with today's date | The button shows a loading state while saving | Bank saved |
| **Cancel** | Leave without saving | Click | Closes the modal; nothing is saved and no confirmation is asked | — | — |
| Delete (bin icon), bank in use | Protect data | Click | No dialog. Error toast "Can’t delete this bank" with "N house account(s) use(s) it — disable it instead." | BR-BNK-002 | Bank kept |
| Delete (bin icon), bank not in use | Remove a bank | Click | Confirmation (SH-006): title "Delete this bank?", text "<Bank> will be removed from the list.", buttons **Cancel** and **Delete** (danger) | — | On **Delete**: bank removed, toast "Bank deleted" with the bank name |

### 5.4 Bank master filter drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Combine filters | Click **Filters** | Title "Filter banks", description "By house accounts or who added them". Opens with the applied filters | Changes are a draft until applied | — |
| Status section (phones only) | Replace the hidden pills | Choose | Segmented control "All", "Enabled", "Disabled", each with its count | Shown only on phones | — |
| House accounts section | Filter by use | Choose | Segmented control "All", "Has accounts", "None" | — | — |
| Added by section | Filter by who added | Pick one or more | Searchable multi-select, placeholder "Anyone", search "Search people…"; options are the people who added the banks, A–Z | — | — |
| Section clear | Clear one section | Click the section's clear control | Resets that section only | Shown only when the section has a value | — |
| **Reset** | Clear the draft | Click | Drawer controls return to defaults (on larger screens the pill choice is kept) | Not applied until the apply button is clicked | — |
| Apply button | Apply the draft | Click | Label shows the live count, including the current search: "Show N banks" / "Show 1 bank"; the drawer closes | When the draft matches nothing the button reads "No matching banks" and is disabled | Filtered list |
| Closing without applying | Abandon | ×, Esc or backdrop (SH-006) | Draft discarded | — | Filters unchanged |

### 5.5 House bank master list

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by type | Click | "All accounts" (tooltip "Show all accounts"), "Primary" (tooltip "Each entity’s default account"), "Secondary" (tooltip "Other accounts") | Demo data: 8 / 6 / 2 | Filtered list |
| Search | Find an account | Type in "Search bank, account, IFSC" | Matches bank name, account number, IFSC, holder name, entity name, branch name and branch code | — | — |
| **Account** column | Identify the account | — | Bank initials tile, bank name and, below it, the last four digits of the account number ("•••• 8001"; hover shows the full number) and, for a primary account, a star and "Primary" | Always shown; sortable by bank name; default sort A–Z | — |
| **Entity & holder** column | Whose account | — | Entity name (building icon) and account holder name (person icon) | Sortable by entity name | — |
| **IFSC** column | Bank routing code | — | IFSC as a code chip (for example "HSBC0110005") | Sortable | — |
| **Branch** column | Where the account is held | — | Branch name and "Code <branch code>" | Shown from large width; sortable | — |
| **Cheque** column | Proof of account | Click **View** | Opens the cheque preview (5.7) | Shown from large width; not sortable | Preview opens |
| Phone card | Phone layout | — | Tile, bank name, entity name, IFSC chip, "•••• 1234", star "Primary" when primary, footer "<Branch name> · Code <code>", and the Edit / Delete icons | The cheque cannot be viewed from the card; it is reached through Edit (the uploaded file opens a preview) | Tap opens Edit |

### 5.6 Add / Edit house bank account modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Modal header | Explain the form | Open | Add: title "Add house bank account", description "An account an entity receives payments in." Edit: title "Edit house bank account", description "<Bank> •••• 1234" | Large modal; a click on the backdrop does not close it | — |
| Fields | Capture the account | Fill in | Entity, Bank, Account no., IFSC code, Account holder name, Branch code, Branch name, Cancelled cheque / passbook upload, Primary account switch (section 7.2) | Two columns from small screens up | — |
| Entity choice | Link to the Entity master | Pick an entity | Fills **Account holder name** with the entity's name unless the user has typed a different holder name. On **Add**, it also switches **Primary account** on if the entity has no primary account yet, and off if it already has one | BR-BNK-005, BR-BNK-006 | — |
| Bank choice | Pick from the Bank master | Pick a bank | Offers only enabled banks; when editing, the account's current bank is also offered even if it has since been disabled | BR-BNK-003 | — |
| Primary account switch | Set the entity's default account | Toggle | Help text "The account payments go to by default. One per entity." When it is on and the chosen entity already has another primary account, the help text names it: "Replaces <Bank> •••• 1234 as this entity’s primary account." | BR-BNK-004 | — |
| **Save account** / **Save changes** | Save | Click | Validates (7.2). With errors: every error shows and an error toast "Check the highlighted fields" with "N field(s) need(s) a fix." appears. On success: modal closes, list reloads, success toast (section 9); if the account is primary, the entity's previous primary becomes secondary | On Edit, **Save changes** appears only after something has changed | Account saved |
| **Cancel** / close (×, Esc) | Leave | Click | With no changes the modal closes. With changes, a confirmation asks first: Add — "Discard this account?" / "The details you’ve entered won’t be saved."; Edit — "Discard your changes?" / "Your edits to this account won’t be saved."; buttons **Keep editing** and **Discard** | — | Modal closes on **Discard** |
| Delete (bin icon) | Remove an account | Click | Confirmation: title "Delete this account?", text "<Bank> •••• 1234 will be removed from <Entity>." For a primary account the text adds " It’s the entity’s primary account — choose a new primary afterwards." Buttons **Cancel** and **Delete** (danger) | No account is made primary automatically (BR-BNK-010) | On **Delete**: account removed, toast "Account deleted" with "<Bank> •••• 1234" |

### 5.7 Cheque preview

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| **View** (Cheque column) | See the proof of account | Click | Opens a preview of the cancelled cheque or passbook file: a PDF or image is shown in the dialog with **Open in new tab** and **Download** | — | Preview open |
| File without a preview | Explain missing content | Click **View** on a demo account | "Preview isn’t available" / "This file was attached before previews were supported. Replace it to view it here." | The demo accounts carry a file name only (for example "Cancelled cheque – HDFC 5678.pdf"). A file uploaded in this session previews normally | Replace the file through Edit |
| Uploaded file row (in the modal) | Check the file before saving | Click the file name or its tile | Opens the same preview. The row shows the file name, "PDF" or "Image", the size and an "Uploaded" tag, with **Replace** and **Remove** icons | — | — |

## 6. User Workflow

### 6.1 Add a bank

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Settings › Banks › Bank master, click **Add bank** | "Add bank" modal opens with the name box focused and Enabled on | — | — |
| 2 | Type "RBL Bank", click **Save bank** | Toast "Bank added" / "RBL Bank"; modal closes | Name present and not already in the list | RBL Bank listed as Enabled, "No accounts", added by the signed-in user today |

### 6.2 Retire a bank that accounts use

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the bin on "Hongkong & Shanghai Banking Corporation" | Error toast "Can’t delete this bank" / "4 house accounts use it — disable it instead." | Bank in use (BR-BNK-002) | Bank kept |
| 2 | Click the row, switch **Enabled** off | Note "4 house accounts keep this bank; it just won’t be offered for new accounts." | — | — |
| 3 | Click **Save changes** | Toast "Bank updated"; status "Disabled" | — | Existing accounts keep the bank; the house bank form no longer offers it for other accounts |

### 6.3 Add a new primary account for an entity

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open House bank master, click **Add account** | "Add house bank account" opens | — | — |
| 2 | Choose entity "BYLD Group Learning Pvt Ltd" | Holder name fills with the entity name; Primary account stays off because the entity already has a primary | BR-BNK-005, BR-BNK-006 | — |
| 3 | Switch **Primary account** on | Help text: "Replaces HDFC Bank •••• 5678 as this entity’s primary account." | BR-BNK-004 | — |
| 4 | Choose bank, type account number, IFSC, branch code and name, upload a cancelled cheque PDF | Fields accept the values; the upload becomes a file row | 7.2 | — |
| 5 | Click **Save account** | Toast "Account added" / "<Bank> •••• 1234 · BYLD Group Learning Pvt Ltd" | All fields valid | New account is Primary; the HDFC account becomes Secondary |

## 7. Forms and Field-Level Specifications

Validation timing follows SH-004: "required" errors appear only after **Save**; errors about a typed value (format, duplicate) appear when the user leaves the field and then follow the value.

### 7.1 Add / Edit bank

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Bank name | Text | Name of the bank | Required | 1 non-space character | 80 characters (typing stops) | Any text; surrounding spaces are removed on save | Empty (Edit: current name) | Must not be empty; must not match another bank's name, ignoring case and surrounding spaces (BR-BNK-001) | Duplicate error shows when the field is left with text | "Enter the bank’s name" / "This bank is already in the list" |
| Enabled | Switch | Offer the bank in the house bank form | Optional | N/A | N/A | On / off | On (Edit: current status) | None | Switching off a bank with accounts shows the "keep this bank" note | N/A |

### 7.2 Add / Edit house bank account

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Entity | Searchable select ("Select entity", "Search entities…") | The entity that owns the account | Required | N/A | N/A | Every entity in the Entity master | None | Must be chosen | Fills the holder name; on Add sets the Primary default (BR-BNK-005, BR-BNK-006) | "Choose the entity" |
| Bank | Searchable select ("Select bank", "Search banks…") | The account's bank | Required | N/A | N/A | Enabled banks, plus the current bank when editing (BR-BNK-003) | None | Must be chosen | — | "Choose the bank" |
| Account no. | Text (numeric keypad) | Account number | Required | 9 digits | 18 digits (typing stops) | Digits only; anything else is removed as it is typed | Empty | 9–18 digits; must not already exist at the same bank (BR-BNK-007, BR-BNK-008) | Duplicate check needs a bank to be chosen | "Enter the account number" / "Account number is 9–18 digits" / "This account is already added for that bank" |
| IFSC code | Text, upper case | Bank branch code for transfers | Required | 11 characters | 11 characters (typing stops) | Four letters, a zero, then six letters or digits (for example HDFC0000572); letters are turned to capitals and other characters removed as typed | Empty | Must match the format (BR-BNK-009) | Placeholder "e.g. HSBC0110002" | "Enter the IFSC code" / "IFSC is 11 characters, e.g. HDFC0000572" |
| Account holder name | Text | Name on the account | Required | 1 non-space character | 120 characters | Any text; trimmed on save | The entity's name once an entity is chosen | Must not be empty | Placeholder "As printed on the cheque" | "Enter the account holder’s name" |
| Branch code | Text, upper case | Bank's branch code | Required | 1 non-space character | 20 characters | Any text, turned to capitals; trimmed on save | Empty | Must not be empty; no format check (OQ-BNK-003) | Placeholder "e.g. 166" | "Enter the branch code" |
| Branch name | Text | Branch name and place | Required | 1 non-space character | 120 characters | Any text; trimmed on save | Empty | Must not be empty | Placeholder "e.g. Barakhamba Road, New Delhi" | "Enter the branch name" |
| Cancelled cheque / passbook | File upload (drop zone or **Browse**) | Proof of the account | Required | One file | 5 MB | PDF, JPG or PNG; hint "PDF, JPG or PNG · max 5 MB" | None | Must be uploaded (BR-BNK-011) | Becomes a file row with Replace / Remove; the file opens a preview | "Upload a cancelled cheque or passbook page"; wrong type: "Use a PDF, JPG or PNG file."; too large: "File must be under 5 MB." (both also shown as an error toast) |
| Primary account | Switch | Make this the entity's default account | Optional | N/A | N/A | On / off | Add: on when the chosen entity has no primary account yet, otherwise off. Edit: current value | One primary per entity (BR-BNK-004) | Help text names the account it replaces | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-BNK-001 | Unique bank name | No two banks may share a name; the check ignores case and surrounding spaces | Add / Edit bank | Save blocked | "hdfc bank " when "HDFC Bank" exists | "This bank is already in the list" |
| BR-BNK-002 | A bank in use can't be deleted | A bank that at least one house account uses cannot be deleted; it can be disabled instead | Delete bank | No confirmation is shown | Delete on a bank with accounts | Error toast "Can’t delete this bank" / "N house account(s) use(s) it — disable it instead." |
| BR-BNK-003 | Disabled banks are not offered | A disabled bank is hidden from the house bank form's Bank choice, except for the account's current bank when editing; accounts that already use it keep it | House bank form | — | — | — |
| BR-BNK-004 | One primary account per entity | Each entity has at most one primary account. Saving an account as primary makes the entity's other primary account secondary | Add / Edit house bank account | The form names the account being replaced before saving | — | "Replaces <Bank> •••• 1234 as this entity’s primary account." |
| BR-BNK-005 | Holder name defaults to the entity | Choosing an entity fills the holder name with the entity's name, unless the user has typed a different holder name | House bank form | Holder name follows the entity until edited | — | — |
| BR-BNK-006 | First account becomes primary | On Add, choosing an entity that has no primary account switches **Primary account** on; otherwise it is switched off. The user can change it | Add house bank account | — | — | — |
| BR-BNK-007 | Account number format | 9 to 18 digits, digits only | House bank form | Non-digits are removed as typed | Fewer than 9 digits | "Account number is 9–18 digits" |
| BR-BNK-008 | Account unique per bank | The same account number cannot be added twice at the same bank (it may exist at another bank) | House bank form | Save blocked | Same number at the same bank | "This account is already added for that bank" |
| BR-BNK-009 | IFSC format | 11 characters: four letters, the digit 0, then six letters or digits | House bank form | Save blocked | "HDFC1234567" | "IFSC is 11 characters, e.g. HDFC0000572" |
| BR-BNK-010 | Deleting a primary account | A primary account can be deleted; the entity is then left with no primary account until the user picks one | Delete house bank account | Confirmation warns: "It’s the entity’s primary account — choose a new primary afterwards." | — | — (OQ-BNK-002) |
| BR-BNK-011 | Proof of account required | Every house bank account needs a cancelled cheque or passbook page: PDF, JPG or PNG, up to 5 MB | House bank form | Save blocked without a file | Missing / wrong type / too large | "Upload a cancelled cheque or passbook page" / "Use a PDF, JPG or PNG file." / "File must be under 5 MB." |
| BR-BNK-012 | Who and when | "Added by" is the signed-in user's name and "Added on" the save date; editing does not change them | Add bank / Add account | — | — | — |
| BR-BNK-013 | Unsaved changes in the house bank form | Closing the house bank form with changes asks for confirmation; the bank form closes without asking | Cancel, ×, Esc | Confirmation dialog | — | "Discard this account?" / "Discard your changes?" |
| BR-BNK-014 | Matching IFSC to bank [Requires Confirmation] | The IFSC is not checked against the chosen bank (an HDFC IFSC can be saved on an HSBC account) | House bank form | Saved as entered | Mismatched IFSC | None (OQ-BNK-003) |
| BR-BNK-015 | Session data | Data follows SH-001 | Always | — | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Add bank | Saved | Success toast | "Bank added" / "<Bank>" | After save | — |
| Edit bank | Saved | Success toast | "Bank updated" / "<Bank>" | After save | — |
| Add / edit bank fails | Duplicate found at save time | Error toast | "Couldn’t add the bank" / "Couldn’t save the bank" with "This bank is already in the list." | On save | Change the name |
| Delete bank in use | Accounts use it | Error toast | "Can’t delete this bank" / "N house account(s) use(s) it — disable it instead." | On clicking the bin | Disable the bank |
| Delete bank | Confirmed | Success toast | "Bank deleted" / "<Bank>" | After delete | — |
| Delete bank fails | — | Error toast | "Couldn’t delete the bank" with the reason | After delete | — |
| Save house account with errors | Any field invalid | Error toast | "Check the highlighted fields" / "N field needs a fix." or "N fields need a fix." | On save | Fix the fields |
| Add house account | Saved | Success toast | "Account added" / "<Bank> •••• 1234 · <Entity>" | After save | — |
| Edit house account | Saved | Success toast | "Account updated" / "<Bank> •••• 1234 · <Entity>" | After save | — |
| Add / edit house account fails | — | Error toast | "Couldn’t add the account" / "Couldn’t save the account" with the reason (for example "This account is already added for that bank.") | On save | Fix and retry |
| Delete house account | Confirmed | Success toast | "Account deleted" / "<Bank> •••• 1234" | After delete | Choose a new primary if needed |
| Delete house account fails | — | Error toast | "Couldn’t delete the account" with the reason | After delete | Retry |
| Upload rejected | Wrong type or over 5 MB | Error toast + inline | "Use a PDF, JPG or PNG file." / "File must be under 5 MB." | On choosing the file | Choose another file |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Bank search | Find | Contains, case-insensitive | Bank name | "No banks match" / "Try a different search." + **Clear search & filters** |
| Bank pills | Filter by status | Single choice | All banks, Enabled, Disabled | — |
| Bank drawer | Combine filters | Draft, applied with "Show N banks" | Status (phones only), House accounts (All / Has accounts / None), Added by | "No matching banks" (disabled button) |
| Bank chips | Show drawer filters | Removable | "Has house accounts" / "No house accounts"; "Added by <name>" per person | — |
| Bank columns | — | Bank, House accounts, Status, Added by, Added on — all sortable | Default: Bank A–Z | Empty master: "No banks yet" / "Add the banks your entities hold accounts with." + **Add bank** |
| House search | Find | Contains, case-insensitive | Bank name, account number, IFSC, holder, entity, branch name, branch code | "No accounts match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| House pills | Filter by type | Single choice | All accounts, Primary, Secondary | — |
| House drawer | Combine filters | Draft, applied with "Show N accounts" / "Show 1 account"; title "Filter accounts", description "By entity or bank" | Type (phones only: All / Primary / Secondary with counts), Entity ("Any entity", "Search entities…"), Bank ("Any bank", "Search banks…"); only entities and banks that have accounts are offered, A–Z | "No matching accounts" (disabled button) |
| House chips | Show drawer filters | Removable | Entity name per selected entity; bank name per selected bank | — |
| House columns | — | Account, Entity & holder, IFSC, Branch sortable; Cheque not sortable | Default: Account (bank name) A–Z | Empty master: "No house bank accounts yet" / "Add the accounts your entities receive payments in." + **Add account** |
| Pagination | — | SH-008 | 10 / 20 / 50 rows / All rows; default 10 | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| No banks | Bank master empty | Empty state with add button | "No banks yet" / "Add the banks your entities hold accounts with." | **Add bank** |
| No house accounts | House bank master empty | Empty state with add button | "No house bank accounts yet" / "Add the accounts your entities receive payments in." | **Add account** |
| No matches | Search / filters exclude everything | Empty state | "No banks match" / "No accounts match" | **Clear search & filters** |
| Load failure | Data cannot be loaded | Error state | Error text + **Try again** | Retry |
| Disabled bank on an existing account | Bank disabled after accounts were added | The account keeps the bank; editing it still offers that bank | — | — |
| All banks disabled | Every bank switched off | The Bank choice in Add account offers nothing | — | Enable a bank or add one |
| Entity with no primary | Its primary account was deleted or switched off | No account of that entity shows "Primary"; nothing prompts the user | — | Edit an account and switch Primary on (OQ-BNK-002) |
| Holder name differs from entity | Typed by the user (demo: "Leadership Consulting Private Limited" on Leadership Consulting India LLP) | Saved as typed; changing the entity no longer replaces it | — | — |
| Demo cheque preview | Viewing a demo account's cheque | Preview dialog without content | "Preview isn’t available" / "This file was attached before previews were supported. Replace it to view it here." | Replace the file in Edit |
| Cheque on phones and tablets | Below large width | No Cheque column or View button | — | Open Edit and click the file |
| Entity deleted in the Entity master | An entity with house accounts is deleted | The accounts remain with an empty entity name; the Entity master does not check house accounts | — | OQ-BNK-004 |
| Long names | Long bank, entity, holder or branch names | Truncated on one line; full text on hover | — | — |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Settings hub ([settings-hub-prd.md](settings-hub-prd.md)) | Entry point; group "Banks" — "Bank accounts used for billing." Items: Bank master ("Banks and branches"), House bank master ("Your own receiving accounts"). Hub search also finds them by "bank", "ifsc", "branch", "account", "receiving" or "gst" | Open a master | Page opens and is added to "Recently opened" | BR-SET-002 |
| Entity master ([settings-finance-masters-prd.md](settings-finance-masters-prd.md)) | Supplies the Entity choice and the default holder name | Add / Edit house account | Every entity is offered, whatever its status | BR-BNK-005, OQ-BNK-004 |
| Bank master → House bank master | Supplies the Bank choice; the Bank master's "House accounts" count comes from the House bank master | Add / edit / delete an account; enable / disable a bank | Counts and offered banks update after the list reloads | BR-BNK-002, BR-BNK-003 |
| Facilitators ([facilitators-prd.md](facilitators-prd.md)) [Not Implemented] | Facilitator bank details (Tax & bank) are entered by the facilitator with their own bank names; they do not use the Bank master | — | None | OQ-BNK-001 |
| Invoices / Finance pages [Not Implemented] | House bank accounts are meant for billing ("Bank accounts used for billing."), but the Finance pages are placeholders, so no invoice shows a house account yet | — | None | OQ-BNK-001, OQ-GEN-001 |

## 13. Acceptance Criteria

**AC-BNK-001: Bank master list**
- Given a Training Partner user opens Settings › Banks › Bank master
- When the page loads
- Then the pills read All banks 17, Enabled 15, Disabled 2 (demo data)
- And the list is sorted by bank name A–Z with columns Bank, House accounts, Status, Added by, Added on

**AC-BNK-002: Add a bank**
- Given the "Add bank" modal is open
- When the user types "RBL Bank" and clicks **Save bank**
- Then the toast "Bank added" appears and RBL Bank is listed as Enabled with "No accounts"

**AC-BNK-003: Duplicate bank name (negative)**
- Given "HDFC Bank" exists
- When the user types " hdfc bank" in Add bank and leaves the field
- Then "This bank is already in the list" is shown and the bank is not saved

**AC-BNK-004: Bank in use cannot be deleted (negative)**
- Given a bank used by house accounts
- When the user clicks its bin icon
- Then no confirmation opens and the toast "Can’t delete this bank" explains "… disable it instead."

**AC-BNK-005: Disabled banks are not offered**
- Given "Citibank" is disabled
- When the user opens Add account and opens the Bank choice
- Then Citibank is not offered
- And editing an account whose bank was disabled still shows its bank

**AC-BNK-006: Primary account replacement**
- Given BYLD Group Learning Pvt Ltd has HDFC Bank •••• 5678 as primary
- When the user adds an account for that entity with **Primary account** on
- Then the switch text reads "Replaces HDFC Bank •••• 5678 as this entity’s primary account."
- And after saving, the new account is Primary and the HDFC account is Secondary

**AC-BNK-007: Holder name default**
- Given the Add account modal is open with an empty holder name
- When the user chooses entity "Crucial Learning India Pvt Ltd"
- Then Account holder name reads "Crucial Learning India Pvt Ltd"

**AC-BNK-008: Account field validation (negative)**
- Given the Add account modal
- When the user enters account number "12345678" and IFSC "HDFC1234567" and leaves each field
- Then "Account number is 9–18 digits" and "IFSC is 11 characters, e.g. HDFC0000572" are shown

**AC-BNK-009: Cheque required (negative)**
- Given every field is filled except the cheque upload
- When the user clicks **Save account**
- Then "Upload a cancelled cheque or passbook page" shows under the upload and the toast "Check the highlighted fields" / "1 field needs a fix." appears

**AC-BNK-010: Duplicate account at a bank (negative)**
- Given HDFC Bank account 50200011345678 exists
- When the user adds the same number at HDFC Bank
- Then "This account is already added for that bank" is shown

**AC-BNK-011: View cheque**
- Given the House bank master on a large screen
- When the user clicks **View** in the Cheque column
- Then a preview dialog opens for that account's file

**AC-BNK-012: Discard unsaved account**
- Given the user has typed into Add house bank account
- When they click **Cancel**
- Then "Discard this account?" asks with **Keep editing** and **Discard**

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-BNK-001 | AC-BNK-001 | Bank pill counts | Fresh reload | Demo data | 17 / 15 / 2 | P2 |
| TC-BNK-002 | 5.2 | Bank search | Bank master | "bank of" | Bank of Baroda only | P3 |
| TC-BNK-003 | AC-BNK-002 | Add bank | — | "RBL Bank" | Toast "Bank added"; row Enabled, No accounts, Added by = signed-in user | P1 |
| TC-BNK-004 | AC-BNK-003 | Duplicate name, any case | — | "  axis bank " | "This bank is already in the list" on leaving the field; Save blocked | P1 |
| TC-BNK-005 | 7.1 | Required name after Save | Add bank, empty name | Click Save bank | "Enter the bank’s name" appears only after Save | P2 |
| TC-BNK-006 | AC-BNK-004 | Delete bank in use | — | Delete "Hongkong & Shanghai Banking Corporation" | Toast "Can’t delete this bank" / "4 house accounts use it — disable it instead." | P1 |
| TC-BNK-007 | 5.3 | Delete unused bank | — | Delete "Canara Bank", confirm | Dialog "Delete this bank?"; toast "Bank deleted" | P2 |
| TC-BNK-008 | 5.3 | Disable note | Edit "ICICI Bank" | Switch Enabled off | Note "1 house account keep this bank; it just won’t be offered for new accounts." shows (the singular reads "keep", see OQ-BNK-007) | P3 |
| TC-BNK-009 | AC-BNK-005 | Disabled bank hidden | — | Open Add account › Bank | Citibank and Yes Bank absent | P1 |
| TC-BNK-010 | BR-BNK-003 | Current disabled bank kept | Disable ICICI Bank | Edit the ICICI account | Bank shows ICICI Bank and it is offered | P2 |
| TC-BNK-011 | 5.4 | Bank drawer filters | — | House accounts "Has accounts" | "Show 5 banks"; chip "Has house accounts" | P2 |
| TC-BNK-012 | 5.4 | No matching banks | Search "axis" | House accounts "Has accounts" | Button "No matching banks", disabled | P3 |
| TC-BNK-013 | 5.5 | House pill counts | Fresh reload | Demo data | All accounts 8, Primary 6, Secondary 2 | P2 |
| TC-BNK-014 | 5.5 | House search by IFSC | — | "hsbc0110005" | Three HSBC accounts | P2 |
| TC-BNK-015 | 10 | House drawer by entity | — | Entity "BYLD Group Learning Pvt Ltd" | "Show 2 accounts" (HDFC, Indian Overseas Bank) | P2 |
| TC-BNK-016 | AC-BNK-006 | Primary replacement | — | Add account for BYLD Group Learning, Primary on | Replacement text names HDFC Bank •••• 5678; after save HDFC is Secondary | P1 |
| TC-BNK-017 | BR-BNK-006 | Primary default on Add | — | Add account for an entity with no primary | Primary account switches on by itself | P2 |
| TC-BNK-018 | AC-BNK-007 | Holder follows entity until typed | Add account | Choose entity A, type holder "X", choose entity B | Holder stays "X" | P3 |
| TC-BNK-019 | AC-BNK-008 | Account and IFSC formats | Add account | "12345678"; "hdfc0000572x" | Account error; IFSC shown as "HDFC0000572" (letters capitalised, 11 max) and accepted | P1 |
| TC-BNK-020 | 7.2 | Non-digits removed | Add account | Type "1234-5678 90" | Field shows "1234567890" | P3 |
| TC-BNK-021 | AC-BNK-010 | Duplicate account at bank | — | HDFC Bank + 50200011345678 | "This account is already added for that bank" | P1 |
| TC-BNK-022 | BR-BNK-008 | Same number at another bank | — | ICICI Bank + 50200011345678 | Accepted | P3 |
| TC-BNK-023 | AC-BNK-009 | Cheque required | All fields but cheque | Save account | Upload error + toast "Check the highlighted fields" / "1 field needs a fix." | P1 |
| TC-BNK-024 | BR-BNK-011 | Upload type and size | Add account | A .docx file; a 6 MB PDF | "Use a PDF, JPG or PNG file."; "File must be under 5 MB." | P2 |
| TC-BNK-025 | AC-BNK-011 | View cheque | Large screen | View on a demo row | Preview dialog; "Preview isn’t available" message for demo files | P3 |
| TC-BNK-026 | 5.7 | Uploaded cheque previews | Add account | Upload a PDF, click its name | PDF shown in the preview dialog | P3 |
| TC-BNK-027 | AC-BNK-012 | Discard prompt | Add account with text | Cancel → Keep editing, then Cancel → Discard | Form stays; then closes unsaved | P2 |
| TC-BNK-028 | 5.6 | Save changes appears only on change | Edit an account | Open, change nothing | Only Cancel is shown | P3 |
| TC-BNK-029 | BR-BNK-010 | Delete primary account | — | Delete HDFC Bank •••• 5678 | Dialog text adds "It’s the entity’s primary account — choose a new primary afterwards."; entity left with no primary | P2 |
| TC-BNK-030 | 5.1 | Phone layout | 375 px width | Both pages | Pills hidden; Status / Type in the drawer and counted on Filters; cards with Edit / Delete | P3 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-BNK-001 | Both masters | No other page uses the banks or the house accounts yet (no invoice, payment or facilitator form reads them); facilitator bank details use their own bank names | The masters' purpose ("used for billing") is not yet delivered and bank names can drift | Confirm which pages (invoices, payment instructions, facilitator payouts) must read these masters and how | Open |
| OQ-BNK-002 | House bank – primary | An entity can be left with no primary account (by deleting it or switching it off); nothing requires or prompts a replacement | Payments may have no default account | Confirm whether every entity with accounts must have a primary, and what happens on delete | Open |
| OQ-BNK-003 | House bank – IFSC and branch | The IFSC is not checked against the chosen bank or looked up for the branch; branch code has no format; the "Banks and branches" description implies branches are kept in the Bank master, but only bank names are | Wrong routing details can be saved | Confirm IFSC look-up / bank-prefix check, branch code format, and whether branches belong in the Bank master | Open |
| OQ-BNK-004 | Entity link | Every entity is offered, including inactive ones, and deleting an entity in the Entity master does not check its house accounts (they keep an empty entity name) | Accounts can point to entities that should not receive payments or no longer exist | Define the rule for inactive and deleted entities | Open |
| OQ-BNK-005 | Bank master – delete and audit | Only banks in use are protected; there is no record of who last edited a bank or account; account numbers are shown in full in the edit form and on hover | Audit and data protection for financial details | Confirm audit fields, masking rules and who may see full account numbers | Open |
| OQ-BNK-006 | Limits | Bank name 80, holder 120, branch name 120 and branch code 20 exist in the form only; account holder name has no format rule; the search boxes have no maximum | Boundary testing and data quality | Confirm limits and formats (OQ-GEN-004) | Open |
| OQ-BNK-007 | Bank form | The bank form closes without asking even when a name was typed, unlike the house bank form; the disable note reads "1 house account keep this bank" in the singular | Inconsistent unsaved-changes protection; wording | Confirm whether the bank form should ask before discarding (OQ-GEN-006) and correct the singular wording | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and key actions: Complete
- [x] User roles and access: Complete (no role enforcement, SH-002)
- [x] Fields and forms: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (limits exist in the forms only, see OQ-BNK-006)
- [ ] Validation and business rules: Incomplete (IFSC-to-bank check and primary-account rule not defined, see OQ-BNK-002, OQ-BNK-003)
- [x] Success, error and empty messages: Complete
- [x] Search, filters, tables and listings: Complete
- [ ] Cross-module data links: Incomplete (no page uses the masters yet, see OQ-BNK-001, OQ-BNK-004)
- [x] Acceptance criteria and QA scenarios: Complete
