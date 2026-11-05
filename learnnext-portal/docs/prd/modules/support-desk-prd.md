# Support desk: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Support desk PRD |
| Module name | Support desk |
| Document ID | PRD-SUP |
| Version | 1.1 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (the admin side — viewing, searching, filtering, replying with attachments, closing and reopening tickets — is implemented; raising tickets, the requester's own replies and any notification to the requester happen outside this application or are not defined; there are no priorities, assignment or service-level targets) |
| Last updated | 2026-11-03 (v1.1: phone ticket cards match the other list cards; chat drawer full width on phones) |
| Related modules/pages | [App shell & navigation](app-shell-navigation-prd.md), [Facilitators](facilitators-prd.md), [All Clients](clients-prd.md), [Client detail](client-detail-prd.md), [Manage Content](manage-content-prd.md), [Settings – Access masters (Roles & Access, Menu Mapping)](settings-access-masters-prd.md), [Profile](profile-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

Participants (people attending client programs) and facilitators (trainers) raise support tickets when they need help — a broken link, a missing file, a payment query, a batch change. The Support desk is where LearnNext Admin users **give** that support.

The Support desk lets an Admin user:

- see every ticket from participants and facilitators in one list, and how many are open, waiting for an answer, or closed;
- find tickets quickly by searching and by filtering on who raised them, category, client company, who replied and how recently they were raised;
- read what the requester wrote and view the files they attached;
- reply in a chat conversation, with text and file attachments;
- close a ticket when it is resolved, and reopen it if needed;
- work either from a table or from a board whose lanes show what is waiting on the admin team, what is waiting on the requester, and what is done.

The objective is that no requester waits unnoticed: tickets where the requester spoke last are highlighted on the page and counted on the sidebar Support desk card (see [app-shell-navigation-prd.md](app-shell-navigation-prd.md), BR-SHELL-018).

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Support desk page (`/support`) | One list of all participant and facilitator tickets, with summary pills, search, filters and a Table / Board switch | Admin user | Filter by status pill, search, filter, switch view, open details, open chat, close, reopen | Sidebar Support desk card (App shell) |
| Ticket table / phone cards | List tickets with their latest activity | Admin user | Sort, page, open details, open chat, close, reopen | Ticket details, Ticket chat |
| Ticket board | Show tickets in three lanes: Awaiting reply, Waiting on them, Closed | Admin user | Open details, open chat, drag to close or reopen | Ticket details, Ticket chat |
| Filter tickets (drawer) | Narrow the list by who raised it, category, company, who replied and date | Admin user | Choose filters, Reset, Show N tickets | Support desk page |
| Ticket details (modal) | Show the ticket: requester, status, description, attached files, category, date and reply state | Admin user | View files, Close ticket / Reopen ticket, Open chat | Ticket chat, File preview |
| Ticket chat (drawer) | The full conversation, and the place to reply | Admin user | Read, reply with text and files, view files, Close ticket, Reopen ticket | File preview |
| File preview (modal) | View an attached file full size | Admin user | Open in new tab, Download | Ticket details, Ticket chat |
| Sidebar Support desk card | Shows how many tickets wait for an answer and opens this page | Admin user | Click the card | Documented in [app-shell-navigation-prd.md](app-shell-navigation-prd.md) |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Admin user (any signed-in LearnNext staff member) | Support desk page, ticket details, ticket chat (SH-002, SH-003) | All actions in this PRD | None enforced in the current build. The Roles & Access master stores Support desk permissions (view, edit, export) and includes a "Support Executive" role ("Answers support tickets") with view and edit, but these are not applied (SH-002). |
| Participant | No access to this application (SH-002) | Raises tickets and replies from outside this application | Appears here only as a ticket requester ("Participant", with their client company) |
| Facilitator | No access to this application (SH-002) | Raises tickets and replies from outside this application | Appears here only as a ticket requester ("Facilitator") |

## 5. Page Functionality and Behavior

### 5.1 Support desk page: layout, summary pills and toolbar

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Page title | Identify the page | Open from the sidebar Support desk card or the icon-rail Support desk item | Breadcrumb and browser tab show "Support desk" (SH-009). No title block. | The page appears at once with no loading skeletons (differs from SH-007, see 11) | — |
| Summary pills | Count tickets by status and filter in one click (SH-008) | Click a pill | Four pills, each with its count: **All** (tooltip "Show all tickets"), **Open** ("Show open tickets"), **Awaiting reply** ("Open tickets where the last word is theirs"), **Closed** ("Show closed tickets"). The selected pill is shown pressed. The Awaiting reply dot pulses softly while its count is above 0 and it is not selected. | Counts are calculated **after** the current search and filters are applied (BR-SUP-014). Clicking the already-selected pill keeps it selected; to return to everything, click **All** or **Clear all**. | List (or board) filtered |
| Table view / Board view switch | Choose how tickets are shown | Click the list icon (tooltip "Table view") or the columns icon ("Board view") | Switches between the table (5.2) and the board (5.3). | Shown from tablet width up. Hidden on phones, which always show cards. The choice is not remembered when the user leaves the page. | View changes; pills, search and filters are kept |
| Search | Find a ticket | Type | Filters as the user types (SH-008). Fields searched in 7.1. | — | Result line "N of Total tickets" |
| Filters button | Open the filter drawer | Click | Opens **Filter tickets** (5.4). Shows the number of applied filter chips. | — | — |
| Result line and chips | Show what is applied | Remove a chip / **Clear all** | Shown while a pill other than All, a search, or any filter is applied: "**N** of **Total** tickets", where Total is every ticket. One removable chip per filter (labels in 10). **Clear all** resets the pill to All, clears the search and all filters. | The selected pill and search have no chip of their own | List restored |
| Add / new ticket [Not Implemented] | — | — | There is no way to raise a ticket from this application. | Tickets come from participants and facilitators (OQ-SUP-001) | — |

### 5.2 Ticket table and phone cards

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Table | List tickets | View, sort, page | Columns: Ticket, Raised by, Category, Last reply, Created, Status, and the row actions (details in 10). The column headings stay pinned under the app header while scrolling on large screens. | Default sort: **Last reply**, newest first. Pagination: 10 rows by default; 10, 20, 50 or All (SH-008). | — |
| Row hover | Show the row is clickable | Hover a row | A slim accent bar appears on the left edge and the subject turns blue. | — | — |
| Row click | Open the ticket | Click a row (not its buttons) | Opens **Ticket details** (5.5). | — | Details modal |
| Open chat (chat icon) | Go straight to the conversation | Click | Opens **Ticket chat** (5.6). Accessible label "Open chat — <ticket number>". | Every row | Chat drawer |
| Close ticket (tick icon) | Mark a ticket resolved | Click on an Open row | Closes the ticket immediately (no confirmation). Success toast "Ticket closed" with "<ticket number> · <requester name>". Label "Close ticket — <ticket number>". | Open tickets only (BR-SUP-004, BR-SUP-013) | Status → Closed; the icon becomes Reopen |
| Reopen ticket (circular-arrow icon) | Undo a close | Click on a Closed row | Reopens immediately. Success toast "Ticket reopened" with "<ticket number> · <requester name>". Label "Reopen ticket — <ticket number>". | Closed tickets only (BR-SUP-005) | Status → Open |
| Phone cards | Mobile layout | Tap a card | Below tablet width, each ticket is a card built like the other list cards: photo or initials, subject, "<ticket number> · <requester name>" and the status badge, with an **Open chat** icon top-right; then, under a dashed line, "Participant · <company>" or "Facilitator", and the reply state ("Awaiting reply · <time>" in soft amber, or "<last replier> · <time>") with the date raised on the right. Tapping the card opens Ticket details. | The chat icon opens Ticket chat directly. Close / reopen are reached from details or chat | Details modal / chat drawer |

### 5.3 Ticket board

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Lanes | Show where each ticket is in its life | View | Three lanes, left to right: **Awaiting reply** (hint "The last word is theirs"), **Waiting on them** (hint "We’ve replied"), **Closed** (hint "Sorted"). Each lane heading shows its count. Within a lane, tickets with the most recent message come first. | Only tickets left by the current pill, search and filters are shown. No pagination. Lane headings stay pinned under the app header while scrolling. | — |
| Empty lane | Show a lane has nothing | View | A dashed box "Nothing here". | — | — |
| Ticket card | Summarise a ticket | View | Photo or initials, requester name, "Participant · <company>" or "Facilitator", time since the last message (for example "2h ago"), subject, "<category> › <sub-category>", a paperclip with the number of files the requester attached (if any) and the ticket number. Closed cards appear slightly faded. | Tooltip on the card: "Drag to another lane" | — |
| Card click | Open the ticket | Click the card | Opens **Ticket details** (5.5). | — | Details modal |
| Open chat (on card) | Go to the conversation | Hover or focus the card, click the chat button (tooltip "Open chat") | Opens **Ticket chat** (5.6). | Appears in the card's top-right corner on hover / keyboard focus | Chat drawer |
| Drag to close | Close a ticket by moving it | Drag an open card onto the **Closed** lane | While dragging, the lanes that accept the card are outlined and show a dashed hint: "Drop to close" on Closed. Dropping closes the ticket with toast "Ticket closed" (as 5.2). | Open tickets only. Moving an open card between Awaiting reply and Waiting on them does nothing — those lanes follow who spoke last (BR-SUP-016). | Card moves to Closed |
| Drag to reopen | Reopen by moving it | Drag a closed card onto **Awaiting reply** or **Waiting on them** | Both open lanes show "Drop to reopen". Dropping reopens the ticket with toast "Ticket reopened". | The ticket lands in the lane its last message decides, whichever open lane it was dropped on (BR-SUP-005) | Card moves to an open lane |
| Keyboard use | — | — | Drag and drop is mouse only. Keyboard users close and reopen from the details or chat. | OQ-SUP-013 | — |

### 5.4 Filter tickets drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Narrow the list | Open from **Filters** | Title "Filter tickets", description "By who raised it, category, company, reply or date". Works on a draft; nothing applies until the apply button. Opens with the currently applied filters. | SH-006 closing rules; closing without applying discards the draft | — |
| Raised by | Filter by requester type | Choose | Everyone / Participants / Facilitators (7.2). | Choosing **Facilitators** clears any chosen client companies and hides the Client company section | — |
| Category | Filter by category | Pick one or more | Shows tickets in **any** of the chosen categories. | — | — |
| Client company | Filter by participant's company | Pick one or more | Shows tickets from any of the chosen companies. | Hidden while Raised by = Facilitators. Facilitator tickets have no company, so choosing a company leaves only participant tickets. | — |
| Replied by | Filter by who answered | Pick one or more | Shows tickets where **any** chosen admin has replied at least once; "No reply yet" shows tickets with no admin reply. | — | — |
| Raised within | Filter by age | Choose | Any time / 24 hours / 7 days / 30 days, counted back from now to the ticket's creation. | — | — |
| Section clear links | Clear one section | Click the section's clear control | Clears that section in the draft. | Shown only while that section is set | — |
| Reset | Clear the draft | Click | Clears all five sections in the draft. Keeps the selected summary pill and the search. | — | — |
| Show N tickets | Apply | Click | Applies the draft and closes. Label shows a live count including the current search and pill: "Show 1 ticket", "Show 7 tickets". | Disabled with label "No matching tickets" when the count is 0 | List filtered; chips shown |

### 5.5 Ticket details modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Header | Identify the ticket | Open from a row, phone card or board card | Title = the ticket subject; description = the ticket number. | Closes per SH-006 | — |
| Requester line | Who raised it | View | Photo or initials, name, "Participant · <company>" or "Facilitator" (the requester's email appears on hover), and the status badge (Open / Closed). | — | — |
| Description | What they reported | View | The description the requester wrote when raising the ticket, shown as a quoted block with line breaks kept. | — | — |
| Attached files | What they sent | Click a file | Every file the requester has attached in any of their messages, as chips (image thumbnail or document icon, name, size). Clicking opens File preview (5.7). | Shown only when the requester attached files. Files sent by admins are not listed here (they are in the chat). | File preview |
| Facts line | Category, date and reply state | View | "<category> › <sub-category>", "Raised <date>, <time>" (for example "Raised 12 Mar 2026, 9:30 AM"), then one of: "Awaiting our reply" (amber) when open and the requester spoke last; "Closed by <name> · <time ago>" when closed; otherwise "Replied by <admin names, comma-separated>". | — | — |
| Close ticket | Resolve | Click (open tickets) | Closes immediately; toast "Ticket closed" with "<number> · <name>". The modal stays open and switches to Closed. | No confirmation (BR-SUP-013) | Status → Closed |
| Reopen ticket | Undo a close | Click (closed tickets) | Reopens immediately. **No toast** (differs from the row and board, OQ-SUP-007). The modal stays open and switches to Open. | — | Status → Open |
| Open chat · N | Reply | Click | Closes the details and opens Ticket chat for the same ticket. N = the number of messages in the conversation. | — | Chat drawer |

### 5.6 Ticket chat drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Header | Who the conversation is with | View | Photo or initials, requester name, "Participant · <company>" or "Facilitator". On the right: **Close ticket** (open tickets only) and × ("Close chat"). | Drawer closes with ×, Esc or the backdrop (SH-006). Closing the drawer discards any unsent text and files. | — |
| Ticket strip | Which ticket | View | "<subject> · <ticket number>" and the status badge. | — | — |
| Conversation | Read the thread | View, scroll | Messages oldest to newest. A date separator (for example "12 Mar 2026") appears before the first message of each day. Requester messages are on the left with their photo; admin replies on the right in brand-blue bubbles. Under each message: the time (for example "9:30 AM"); admin messages also show the replying admin's name ("Atul Kumar · 9:30 AM"). Line breaks are kept. | Opens scrolled to the newest message and follows new ones | — |
| Files in messages | See attachments | Click a file chip | Opens File preview (5.7). | Image files show a thumbnail; other files a document icon, with name and size | File preview |
| Reply box | Write a reply | Type | Placeholder "Reply to <first name>…". **Enter** sends; **Shift + Enter** adds a new line (no hint is shown). The box grows with the text up to a limit, then scrolls. | Shown only while the ticket is Open. Fields in 7.4. | — |
| Attach files | Add files to the reply | Click the paperclip (tooltip "Attach files (up to 5, 10 MB each)") | Opens the device file picker (multiple files allowed). Chosen files appear above the box as chips with a remove (×) button ("Remove <file name>"); clicking a chip previews it. | Limits in 7.4 and BR-SUP-008..010 | Files wait to be sent |
| Send reply | Send | Click the send button ("Send reply") or press Enter | Adds the reply to the conversation at once with the signed-in admin's name and the current time, clears the box and files, and keeps focus in the box. **No toast.** | Disabled while there is no text (spaces only count as none) and no file. Text is trimmed. | Ticket moves from Awaiting reply to Waiting on them; sidebar waiting count drops by 1 if it was waiting (BR-SUP-012) |
| Close ticket | Resolve from the chat | Click | Closes immediately; toast "Ticket closed" with "<number> · <name>". The reply box is replaced by the closed footer. | No confirmation. Unsent text and files are hidden, not sent (OQ-SUP-008). | Status → Closed |
| Closed footer | Show who closed it | View | "Closed by <name> · <time ago>" and **Reopen ticket**. | Closed tickets only; no reply box | — |
| Reopen ticket | Undo a close | Click | Reopens immediately. **No toast.** The reply box returns. | — | Status → Open |

### 5.7 File preview

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Preview window | View a file full size | Open from a file chip | Title = file name; description = kind and size (for example "PDF document · 118.0 KB", "Image · 236.0 KB"). Images fit the window; PDFs open in a viewer; videos play. | Kinds: PDF document, Image, Video, File | — |
| Other file types | — | Open a Word, Excel, PowerPoint, TXT or CSV file | "No preview for this file type" / "Download it to open it on your device." | — | — |
| Open in new tab / Download | Use the file | Click | Opens the file in a new browser tab / downloads it with its name. | — | — |

## 6. User Workflow

### 6.1 Answer a waiting ticket

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click the sidebar **Support desk** card ("<N> waiting") | Support desk opens, table view, sorted by Last reply (newest first) | — | Awaiting reply pill shows N |
| 2 | Click the **Awaiting reply** pill | List shows only open tickets where the requester spoke last | — | Result line "N of Total tickets" |
| 3 | Click a row | Ticket details open | — | Description, files, "Awaiting our reply" |
| 4 | Open an attached file | File preview opens | — | — |
| 5 | Click **Open chat · N** | Details close; chat opens at the newest message | — | Reply box "Reply to <first name>…" |
| 6 | Type a reply, optionally attach files, press Enter | Reply added under the admin's name | Text or at least one file; ≤ 5 files; ≤ 10 MB each | Ticket leaves the Awaiting reply count; sidebar count drops by 1 |

### 6.2 Close and reopen a ticket

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Close ticket** (row icon, details, chat, or drag a card to Closed) | Closes immediately | Ticket is Open | Toast "Ticket closed"; Closed count +1; "Closed by <admin name>" recorded |
| 2 | Later, click **Reopen ticket** (row icon, details, chat, or drag to an open lane) | Reopens immediately | Ticket is Closed | Status Open; "Closed by" cleared; toast "Ticket reopened" only from the row or board |

### 6.3 Find a ticket

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Type in **Search ticket, name, subject…** | Rows filter a short moment after typing stops | Fields in 7.1 | Pill counts and result line update |
| 2 | Click **Filters**, choose e.g. Raised by = Participants, Client company = Infosys | Button shows "Show N tickets" | Count 0 disables apply | — |
| 3 | Click **Show N tickets** | Drawer closes | — | Chips "Participants", "Infosys"; Filters button shows 2 |
| 4 | Remove a chip or click **Clear all** | Filter removed / everything reset | — | Full list |

### 6.4 Work from the board

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Board view** | Three lanes with counts | Tablet width and up | — |
| 2 | Hover a card in **Awaiting reply**, click its chat button | Chat opens | — | Reply; the card moves to **Waiting on them** |
| 3 | Drag a card from Waiting on them to **Closed** | "Drop to close" hint; drop closes | Open ticket | Toast "Ticket closed" |
| 4 | Drag a Closed card to either open lane | "Drop to reopen"; drop reopens | Closed ticket | Toast "Ticket reopened"; card lands in the lane its last message decides |

### 6.5 Ticket lifecycle

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Participant or facilitator raises a ticket (outside this application) | Ticket created with number, category, sub-category, subject, description, optional files; creation time = first message | Requires Confirmation (OQ-SUP-001) | **Open · Awaiting reply** |
| 2 | Admin replies in the chat | Reply added | Ticket Open | **Open · Waiting on them** |
| 3 | Requester replies (outside this application) | Message added | Requires Confirmation (OQ-SUP-001) | **Open · Awaiting reply** |
| 4 | Admin closes the ticket | Closed by = admin's name, closed time = now | Ticket Open (from either sub-state) | **Closed** |
| 5 | Admin reopens the ticket | Closed by and closed time cleared | Ticket Closed | **Open**, sub-state from the last message (Awaiting reply if the requester spoke last, otherwise Waiting on them) |
| 6 | Requester writes on a closed ticket (outside this application) | Not defined | Requires Confirmation (OQ-SUP-009) | — |

There are only two stored statuses, **Open** and **Closed**. "Awaiting reply" and "Waiting on them" are not statuses an admin sets; they follow automatically from who sent the last message. Allowed transitions: Open → Closed (Close ticket), Closed → Open (Reopen ticket). There is no other status, no priority and no assignment (OQ-SUP-003).

## 7. Forms and Field-Level Specifications

### 7.1 Support desk: search, pills and view

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search tickets | Search text (placeholder "Search ticket, name, subject…") | Find tickets | Optional | N/A | Requires Confirmation | Free text. Case-insensitive "contains" match on ticket number, requester name, subject, category, sub-category and client company. Leading/trailing spaces ignored. Email, description and message text are **not** searched. | Empty | None | Applies a short moment after typing stops; combines with the pill and filters | N/A (no results → empty state, 11) |
| Summary pill | Single-choice pills | Filter by status | Optional (always one selected) | N/A | N/A | All, Open, Awaiting reply, Closed | All | None | Counts follow search and filters (BR-SUP-014) | N/A |
| View | Two-icon toggle | Table or board | Optional | N/A | N/A | Table view, Board view | Table view | None | Hidden on phones (cards always); resets to Table when the page is reopened | N/A |

### 7.2 Filter tickets drawer

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Raised by | Segmented choice | Filter by requester type | Optional | N/A | N/A | Everyone, Participants, Facilitators | Everyone | None | Facilitators clears and hides Client company | N/A |
| Category | Searchable multi-select (placeholder "Any category", search "Search categories…") | Filter by category | Optional | N/A | All options | Categories found on tickets, A–Z, each with "N tickets" | None | None | Match on any chosen category | N/A |
| Client company | Searchable multi-select (placeholder "Any company", search "Search companies…") | Filter by participant's company | Optional | N/A | All options | Companies found on participant tickets, A–Z, each with "N tickets" | None | None | Hidden while Raised by = Facilitators | N/A |
| Replied by | Searchable multi-select (placeholder "Anyone", search "Search admins…") | Filter by replying admin | Optional | N/A | All options | "No reply yet" first, then the names of admins who have replied, A–Z, each with "N tickets" | None | None | Match on any chosen option. A newly replying admin appears as an option. | N/A |
| Raised within | Segmented choice | Filter by ticket age | Optional | N/A | N/A | Any time, 24 hours, 7 days, 30 days | Any time | None | Counted from now back to the ticket's creation time | N/A |

Option counts ("N tickets") are counted across all tickets, not the current list, and always use the plural (OQ-SUP-010).

### 7.3 Ticket details: read-only content

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Subject | Read-only (modal title) | What the ticket is about | N/A | N/A | N/A | Text set by the requester | — | None | — | N/A |
| Ticket number | Read-only | Reference | N/A | N/A | N/A | For example "C/189/613613" — a letter, a number and a 6-digit number separated by "/". Meaning Requires Confirmation (OQ-SUP-004). | — | None | — | N/A |
| Requester | Read-only | Who raised it | N/A | N/A | N/A | Photo or initials, name, "Participant · <company>" or "Facilitator"; email on hover | — | None | — | N/A |
| Status | Read-only badge | Current status | N/A | N/A | N/A | Open, Closed | — | None | — | N/A |
| Description | Read-only text | What was reported | N/A | N/A | N/A | Free text, line breaks kept | — | None | — | N/A |
| Attached files | Read-only file chips | Requester's files | N/A | N/A | N/A | Name and size; image thumbnail or document icon | — | None | Shown only when there are files | N/A |
| Category › Sub-category | Read-only | Classification | N/A | N/A | N/A | For example "Career development › Skill assessment" | — | None | — | N/A |
| Raised | Read-only | Creation date and time | N/A | N/A | N/A | "Raised 12 Mar 2026, 9:30 AM" (SH-012) | — | None | — | N/A |
| Reply state | Read-only | Who acts next | N/A | N/A | N/A | "Awaiting our reply" / "Closed by <name> · <time ago>" / "Replied by <names>" | — | None | Follows BR-SUP-002..005 | N/A |

### 7.4 Ticket chat: reply

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Reply message | Multi-line text (placeholder "Reply to <first name>…") | The admin's answer | Required unless at least one file is attached | 1 non-space character (when no file) | Requires Confirmation (OQ-SUP-006) | Free text; line breaks with Shift + Enter; leading and trailing spaces removed when sent | Empty | Not blank, or at least one file | Shown only while the ticket is Open. Cleared after sending, when switching ticket, or when the drawer closes. | No message: the send button stays disabled |
| Attachments | File picker (multiple), paperclip button | Send files with the reply | Optional | 0 files | **5 files per reply**; **10 MB per file** | Picker offers images, PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT and CSV. The type is not re-checked after picking (BR-SUP-010, OQ-SUP-005). | None | Each file ≤ 10 MB; total waiting files ≤ 5 | Too-large files are left out, the rest are added. If the total would exceed 5, only the first 5 are kept. Each waiting file can be previewed or removed. | Error toast "File too large" — "<file names> — up to 10 MB each."; error toast "Up to 5 files per reply" |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-SUP-001 | Two statuses | A ticket is either Open or Closed. | Always | Status badge "Open" or "Closed" | — | — |
| BR-SUP-002 | Awaiting reply | An Open ticket whose last message is from the requester is "Awaiting reply". | Pills, Last reply column, board, details, sidebar card | Counted in the Awaiting reply pill and the sidebar card; amber "Awaiting reply · <time>" | — | — |
| BR-SUP-003 | Waiting on them | An Open ticket whose last message is from an admin is "Waiting on them". | Board | Shown in the middle lane | — | — |
| BR-SUP-004 | Close records who and when | Closing sets status Closed, Closed by = signed-in admin's name ("Admin" if the account has no name), and the closed time = now. | Close from row, details, chat or board | — | Closing an already closed ticket is not offered | "Ticket closed" |
| BR-SUP-005 | Reopen clears closure | Reopening sets status Open and clears Closed by and the closed time. The ticket's sub-state follows its last message. | Reopen from row, details, chat or board | — | Reopening an open ticket is not offered | "Ticket reopened" (row and board only) |
| BR-SUP-006 | Replies only on open tickets | Closed tickets show "Closed by …" and Reopen ticket instead of the reply box. | Chat | — | — | — |
| BR-SUP-007 | Reply needs content | A reply needs non-blank text or at least one file. Text is trimmed. | Chat | Send disabled otherwise; Enter does nothing | Spaces only, no file | Send button disabled |
| BR-SUP-008 | File count limit | At most 5 files can wait in one reply. | Attach files | Extra files dropped | 6 files picked | "Up to 5 files per reply" |
| BR-SUP-009 | File size limit | Each file must be 10 MB or smaller. | Attach files | Oversized files left out, others kept | 12 MB file | "File too large" — "<names> — up to 10 MB each." |
| BR-SUP-010 | Accepted file types [Partially Implemented] | Images, PDF, Word, Excel, PowerPoint, TXT and CSV are offered by the file picker; other types chosen via the picker's "all files" option are not rejected. | Attach files | — | .zip chosen | None (OQ-SUP-005) |
| BR-SUP-011 | Reply author | A reply is recorded under the signed-in admin's name and the current time. | Send | Name shown under the bubble; added to Replied by options | — | — |
| BR-SUP-012 | Reply does not change status | Replying keeps the ticket Open and moves it from Awaiting reply to Waiting on them. | Send | Pill counts, board lanes and the sidebar count update at once | — | No toast |
| BR-SUP-013 | No confirmation for close or reopen | Close and reopen happen on one click with no confirmation dialog. | All entry points | — | Accidental close | Toast only; reopen to undo |
| BR-SUP-014 | Pill counts follow search and filters | Summary pill counts are counted within the current search and filters; the result line total is every ticket. | Support desk | — | — | — |
| BR-SUP-015 | Shared waiting count | The sidebar Support desk card counts every Awaiting reply ticket, regardless of the page's search, filters or pill (BR-SHELL-018). | Any page | Card updates as soon as a ticket is replied to, closed or reopened | — | "<N> waiting" / "All caught up" |
| BR-SUP-016 | Board drag rules | Open → Closed lane closes; Closed → either open lane reopens. Dragging between the two open lanes is not accepted. | Board | Accepting lanes outlined with "Drop to close" / "Drop to reopen" | Drop open card on the other open lane | Nothing happens |
| BR-SUP-017 | Raised by and company | Facilitator tickets have no client company. Choosing Raised by = Facilitators clears the company filter. | Filter drawer | — | — | — |
| BR-SUP-018 | Ticket creation [Not Implemented] | Admins cannot raise, edit, re-categorise or delete tickets. | — | — | — | — (OQ-SUP-001, OQ-SUP-016) |
| BR-SUP-019 | Priority, assignment and targets [Requires Confirmation] | Tickets have no priority, owner/assignee or response-time target. | — | — | — | — (OQ-SUP-003) |
| BR-SUP-020 | Requester notification [Requires Confirmation] | Whether the requester is told about replies, closing or reopening is not defined. | Reply, close, reopen | — | — | — (OQ-SUP-002) |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Close ticket | From row, details, chat or board | Success toast | "Ticket closed" — "<ticket number> · <requester name>" | Immediately | Reopen if needed |
| Reopen ticket | From row icon or board drag | Success toast | "Ticket reopened" — "<ticket number> · <requester name>" | Immediately | — |
| Reopen ticket | From details or chat | None | — (status badge changes; OQ-SUP-007) | — | — |
| Send reply | Text and/or files | None (inline) | The reply appears in the conversation with "<admin name> · <time>" | Immediately | — |
| Attach oversized file | Any file > 10 MB | Error toast | "File too large" — "<file names> — up to 10 MB each." | After picking | Pick a smaller file |
| Attach too many files | More than 5 waiting | Error toast | "Up to 5 files per reply" | After picking | Remove files or send in another reply |
| Waiting indicator | Awaiting reply count > 0 | Pulsing pill dot; amber "Awaiting reply · <time>" in Last reply; "Awaiting our reply" in details | — | Always | Answer the ticket |
| Closed footer | Ticket closed | Inline text | "Closed by <name> · <time ago>" | In the chat | Reopen ticket |
| Drag hint | While dragging a card | Inline hint | "Drop to close" / "Drop to reopen" | On accepting lanes | Drop or cancel |
| Filter apply | Draft matches nothing | Disabled button | "No matching tickets" | In the drawer | Change filters or Reset |

Toast behaviour per SH-005. No confirmation dialogs are used in this module.

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Ticket | Identify | Subject (truncated, full text on hover) over the ticket number and, if the requester attached files, a paperclip with their count (tooltip "Files attached"). Sortable by subject. | — | — |
| Raised by | Who | Photo or initials, name, "Participant · <company>" or "Facilitator". Sortable by name. | — | — |
| Category | Classification | Category only; "<category> › <sub-category>" on hover. Sortable. | — | — |
| Last reply | Latest activity | Awaiting reply: amber "Awaiting reply · <age>" (for example "· 2h"). Otherwise "<who spoke last> · <age>" (admin name or requester name). Age: "just now", "5m", "3h", "2d", or the date after 7 days. Sortable; **default sort, newest first**. | Shows the last message by anyone, not only replies | — |
| Created | When raised | Date (for example "12 Mar 2026"); date and time on hover. Sortable. | — | — |
| Status | State | Status badge: Open or Closed. Sortable. | — | — |
| Actions | Quick actions | Open chat; Close ticket (Open) or Reopen ticket (Closed). Clicking them does not open the row. | — | — |
| Phone cards | Mobile layout | Photo, subject, "<number> · <name>", status, chat icon; who raised it; reply state and date raised | Tap opens details; chat icon opens chat | — |
| Pagination | — | 10 rows by default; 10 / 20 / 50 / All (SH-008). Board view has no pagination. | — | — |
| Filter chips | Show applied filters | "Participants" / "Facilitators"; each category; each company; "Replied by <name>" or "No reply yet"; "Last 24 hours" / "Last 7 days" / "Last 30 days". Each removable. | **Clear all** also resets the pill and search | — |
| Board lanes | Alternative view | See 5.3 | Sorted by latest message, newest first | "Nothing here" per empty lane; whole-page empty state when no tickets match |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| No tickets at all | No tickets exist | Empty state, no action | "No tickets yet" / "Tickets raised by participants and facilitators will appear here." | Wait for tickets |
| No matches | Pill, search or filters leave nothing (table or board) | Empty state | "No tickets match" / "Try a different search or loosen the filters." | **Clear search & filters** (also resets the pill) |
| Filter draft matches nothing | In the drawer | Apply disabled | "No matching tickets" | Change filters or Reset |
| Loading | Page opens | Tickets show at once; no skeletons, spinners or simulated delay (differs from SH-001 / SH-007) | — | — |
| Load or save failure | — | Not handled: there is no error or retry state and actions cannot fail in the current build (differs from SH-007) | — | OQ-SUP-015 |
| Empty lane on board | No tickets in a lane | Dashed box | "Nothing here" | — |
| Selected pill hides lanes | e.g. Closed pill on the board | Open lanes show "Nothing here" | "Nothing here" | Select All |
| Closing with a half-written reply | Close ticket in chat with text typed | Reply box hidden; text is not sent. Reopening while the drawer is still open shows the text again; closing the drawer discards it. | — | OQ-SUP-008 |
| File type with no preview | Word, Excel, PowerPoint, TXT, CSV | Preview window without content | "No preview for this file type" / "Download it to open it on your device." | Download |
| Empty file (0 bytes) | Picked file has no content | Chip shows "File" instead of a size | — | — |
| Ticket older than 7 days | Last reply / board times | Shows the date instead of "Nd" | — | — |
| Ticket in the sidebar count | Search or filters hide an Awaiting reply ticket | Sidebar still counts it; page pill does not | — | BR-SUP-014, BR-SUP-015 |
| Data reset | Page reload | Demo tickets restored; replies, closes and reopens lost (SH-001) | — | — |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| [App shell & navigation](app-shell-navigation-prd.md) | The sidebar Support desk card shows the Awaiting reply count (up to three avatars, newest first) and opens this page; the icon rail shows a "Support desk" item. Breadcrumb "Support desk". | Reply, close or reopen a ticket; click the card | Card switches between "<N> waiting" and "All caught up" immediately | BR-SUP-015, BR-SHELL-018 |
| [Facilitators](facilitators-prd.md) | Facilitators raise tickets, shown as "Facilitator" | — | Tickets are not linked to the facilitator record; no navigation between them | OQ-SUP-011 |
| [All Clients](clients-prd.md) / [Client detail](client-detail-prd.md) | Participants of client programs raise tickets; their client company is shown and filterable | — | Company is shown as text only; no link to the client or participant | OQ-SUP-011 |
| [Profile](profile-prd.md) | The signed-in admin's name is used as reply author and "Closed by" | Reply / Close | Name shown in chat, details and Replied by filter | BR-SUP-004, BR-SUP-011 |
| [Settings – Access masters](settings-access-masters-prd.md) | Roles & Access stores Support desk permissions (view, edit, export) and a "Support Executive" role; Menu Mapping lists "Support desk" | — | Not enforced (SH-002); there is no export on this page | OQ-SUP-012 |
| Participant / facilitator portals (outside this application) | Where tickets are raised and requesters reply | Raise ticket, requester reply | Requires Confirmation | OQ-SUP-001, OQ-SUP-002, OQ-SUP-009 |

## 13. Acceptance Criteria

**AC-SUP-001: Summary pills**
- Given the Support desk with no search or filters
- When I click **Awaiting reply**
- Then only Open tickets whose last message is from the requester are listed
- And the result line shows "N of Total tickets" where Total is every ticket

**AC-SUP-002: Pill counts follow filters**
- Given Raised by = Facilitators is applied
- Then All, Open, Awaiting reply and Closed count only facilitator tickets
- And the sidebar card still counts all waiting tickets

**AC-SUP-003: Search**
- Given the ticket "Certificate name is misspelt" (company Infosys)
- When I type "infosys" in search
- Then that ticket is listed; typing the requester's email lists nothing

**AC-SUP-004: Filters drawer**
- Given the Filter tickets drawer
- When I choose Raised by = Facilitators
- Then the Client company section disappears and any chosen companies are cleared
- And the button reads "Show N tickets", or is disabled as "No matching tickets" when N = 0

**AC-SUP-005: Open details**
- Given the ticket table
- When I click a row
- Then Ticket details opens with the subject as title, the number, requester, status, description, attached files and the facts line

**AC-SUP-006: Open chat from details**
- Given Ticket details is open
- When I click **Open chat · N**
- Then the details close and the chat opens at the newest message, N matching the number of messages

**AC-SUP-007: Reply**
- Given an Awaiting reply ticket open in the chat
- When I type "Done" and press Enter
- Then the reply appears on the right with "<my name> · <time>", the box clears
- And the Awaiting reply count and the sidebar waiting count drop by 1, and the Last reply column shows my name

**AC-SUP-008: Reply needs content**
- Given the chat reply box contains only spaces and no files
- Then the send button is disabled and Enter sends nothing
- And Shift + Enter adds a new line

**AC-SUP-009: Attachment limits**
- Given the chat of an open ticket
- When I pick 6 files under 10 MB
- Then "Up to 5 files per reply" appears and 5 file chips are kept
- And picking a 12 MB file shows "File too large" — "<name> — up to 10 MB each." and it is not added

**AC-SUP-010: Send files only**
- Given one attached file and no text
- When I click **Send reply**
- Then a reply bubble with only the file is added

**AC-SUP-011: Close ticket**
- Given an open ticket
- When I click **Close ticket** (row, details or chat)
- Then toast "Ticket closed" with "<number> · <name>" appears without a confirmation
- And the status is Closed, and the chat shows "Closed by <my name> · just now" with **Reopen ticket** and no reply box

**AC-SUP-012: Reopen ticket**
- Given a closed ticket
- When I click the Reopen icon on its row
- Then toast "Ticket reopened" appears and the status is Open
- And reopening from the details or chat shows no toast

**AC-SUP-013: Board lanes**
- Given Board view
- Then lanes Awaiting reply, Waiting on them and Closed show their counts and cards sorted by latest message

**AC-SUP-014: Board drag**
- Given an open card on the board
- When I drag it onto Closed
- Then "Drop to close" shows while hovering, and dropping closes it with "Ticket closed"
- And dropping it on the other open lane does nothing

**AC-SUP-015: Reopen by drag**
- Given a closed ticket whose last message is from the requester
- When I drag it onto Waiting on them
- Then it reopens with "Ticket reopened" and appears in Awaiting reply

**AC-SUP-016: Empty and no-match states**
- Given a search "zzzz"
- Then "No tickets match" is shown with **Clear search & filters**, which resets the pill, search and filters

**AC-SUP-017: Phones**
- Given a phone-width screen
- Then tickets show as cards with no view switch, and tapping a card opens the details

## 14. QA Test Scenarios

Demo data on a fresh load: 12 tickets — 9 Open (7 Awaiting reply, 2 Waiting on them) and 3 Closed (SH-001).

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-SUP-001 | AC-SUP-001 | Pill counts on load | Fresh load | — | All 12, Open 9, Awaiting reply 7, Closed 3; sidebar "7 waiting" | P1 |
| TC-SUP-002 | AC-SUP-001 | Each pill filters | Fresh load | Click each pill | Rows match the pill; result line "N of 12 tickets" | P2 |
| TC-SUP-003 | BR-SUP-014, AC-SUP-002 | Counts follow filters | Fresh load | Raised by = Facilitators | Pills count facilitator tickets only; sidebar unchanged | P2 |
| TC-SUP-004 | 7.1, AC-SUP-003 | Search fields | — | Ticket number "P/14/531402"; "Infosys"; "Skill assessment"; an email | First three match; email matches nothing | P2 |
| TC-SUP-005 | 7.1 | Search trimming and case | — | "  KARAN  " | Karan Malhotra's ticket | P3 |
| TC-SUP-006 | AC-SUP-004, BR-SUP-017 | Facilitators clears company | Company Infosys chosen in draft | Choose Facilitators | Company section hidden and cleared; count "No matching tickets" if 0 | P2 |
| TC-SUP-007 | 5.4 | Replied by "No reply yet" | — | Choose "No reply yet" | Only tickets with no admin reply; chip "No reply yet" | P2 |
| TC-SUP-008 | 5.4 | Raised within | — | 24 hours | Only tickets created in the last 24 h; chip "Last 24 hours" | P3 |
| TC-SUP-009 | 5.4 | Reset keeps pill and search | Closed pill + search | Reset in drawer | Draft cleared; pill and search unchanged | P3 |
| TC-SUP-010 | 5.1 | Clear all | Pill, search, 2 chips | Clear all | Everything reset; full list | P2 |
| TC-SUP-011 | 5.2 | Default sort and sorting | Fresh load | Click Created, Status | Default newest Last reply first; headers toggle sort | P3 |
| TC-SUP-012 | 5.2 | Pagination | Fresh load | Page size 10 / All | 10 rows + pager / 12 rows | P3 |
| TC-SUP-013 | AC-SUP-005 | Details content | — | Open "Payment for May sessions" | Description; 2 files; "Leadership coaching › Decision making"; "Awaiting our reply" | P1 |
| TC-SUP-014 | 5.5 | Details facts for closed / replied | — | Closed ticket; Waiting on them ticket | "Closed by <name> · <age>"; "Replied by <names>" | P2 |
| TC-SUP-015 | AC-SUP-006 | Open chat · N | Details open | — | Chat opens; N = message count | P2 |
| TC-SUP-016 | AC-SUP-007, BR-SUP-012 | Reply moves ticket | Awaiting reply ticket | "We’re on it" + Enter | Bubble with my name; Awaiting reply −1; sidebar −1; status still Open | P0 |
| TC-SUP-017 | AC-SUP-008, BR-SUP-007 | Blank reply | Chat open | "   " | Send disabled; Enter does nothing | P1 |
| TC-SUP-018 | 5.6 | Multi-line reply | Chat open | Line 1, Shift+Enter, Line 2, Enter | One bubble with two lines | P3 |
| TC-SUP-019 | AC-SUP-009, BR-SUP-008 | Six files | Chat open | 6 small PDFs | "Up to 5 files per reply"; 5 chips | P1 |
| TC-SUP-020 | AC-SUP-009, BR-SUP-009 | Size boundary | Chat open | Exactly 10 MB; 10 MB + 1 byte | First added; second rejected with "File too large" | P1 |
| TC-SUP-021 | BR-SUP-009 | Mixed pick | Chat open | 1 file of 12 MB + 2 small files | Toast names the large file; 2 chips added | P2 |
| TC-SUP-022 | BR-SUP-010 | Unlisted type | Chat open | .zip via "All files" | Accepted (documents current gap, OQ-SUP-005) | P3 |
| TC-SUP-023 | AC-SUP-010 | Files without text | 1 chip, no text | Send | Bubble with the file only | P2 |
| TC-SUP-024 | 5.6 | Remove and preview waiting file | 2 chips | Click × on one; click the other | One removed; preview opens | P3 |
| TC-SUP-025 | 5.7 | File preview kinds | — | Open PDF, image, DOCX | Viewer / image / "No preview for this file type"; Open in new tab and Download present | P2 |
| TC-SUP-026 | AC-SUP-011, BR-SUP-004 | Close from each place | Open tickets | Row icon, details, chat | "Ticket closed"; Closed by = my name; no confirmation | P0 |
| TC-SUP-027 | AC-SUP-012, BR-SUP-005 | Reopen from each place | Closed tickets | Row icon, details, chat | Status Open everywhere; toast only from row | P1 |
| TC-SUP-028 | BR-SUP-006 | No reply on closed | Closed ticket chat | — | "Closed by …" + Reopen ticket; no reply box | P1 |
| TC-SUP-029 | AC-SUP-013 | Board lanes on load | Board view | — | Awaiting reply 7, Waiting on them 2, Closed 3 | P2 |
| TC-SUP-030 | AC-SUP-014, BR-SUP-016 | Drag rules | Board view | Open→Closed; Awaiting→Waiting on them | Closes; second does nothing | P1 |
| TC-SUP-031 | AC-SUP-015 | Reopen by drag lands by last message | Closed ticket last spoken by admin | Drop on Awaiting reply | Reopens into Waiting on them | P2 |
| TC-SUP-032 | 5.3 | Board with Closed pill | Board view | Closed pill | Open lanes "Nothing here" | P3 |
| TC-SUP-033 | AC-SUP-016 | No match | — | "zzzz" | "No tickets match"; Clear search & filters resets | P3 |
| TC-SUP-034 | AC-SUP-017 | Phone layout | 375 px width | — | Cards with who raised it, reply state and date; no view switch; tap opens details; chat icon opens the chat full-width | P2 |
| TC-SUP-035 | BR-SUP-015 | Sidebar card to zero | — | Reply to all 7 waiting tickets | Card "All caught up" | P2 |
| TC-SUP-036 | 11 | Close with draft | Chat with typed text | Close ticket, then Reopen ticket | Draft not sent; reappears after reopen | P3 |
| TC-SUP-037 | SH-001 | Reload resets | After replies and closes | Reload | Demo tickets restored | P3 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-SUP-001 | Ticket creation and requester replies | Tickets and requester replies come from outside this application; the channel, required fields, categories and attachment rules on the requester side are not defined here | The admin view depends on them | Define the participant / facilitator ticket forms and how replies arrive | Open |
| OQ-SUP-002 | Reply / close / reopen | Whether the requester is notified (email, in-app) of a reply, close or reopen | Requesters may never see answers | Define notifications and their content | Open |
| OQ-SUP-003 | Lifecycle | No priority, assignee/owner, internal notes or response-time targets exist | Workload sharing and escalation | Confirm whether priorities, assignment and SLAs are required | Open |
| OQ-SUP-004 | Ticket number | Format "C/189/613613" is not explained (the letter appears to follow the category; the middle number is unknown) | Users quote it when following up | Define the number format | Open |
| OQ-SUP-005 | Attachments | File types are limited only by the picker filter; other types are accepted. Limits for requester attachments are unknown. | Security and consistency | Confirm allowed types and enforce them on pick | Open |
| OQ-SUP-006 | Reply message | No maximum length for a reply | Data quality | Define a limit | Open |
| OQ-SUP-007 | Reopen feedback | Reopen shows "Ticket reopened" from the row and board but no toast from details or chat | Inconsistent feedback | Show the same toast everywhere | Open |
| OQ-SUP-008 | Close ticket | Closing has no confirmation and silently hides an unsent reply | Accidental closes; lost replies | Confirm whether to ask first or warn about unsent text | Open |
| OQ-SUP-009 | Lifecycle | What happens when a requester writes on a Closed ticket (auto-reopen, new ticket, blocked) | Requests could be missed | Define the rule | Open |
| OQ-SUP-010 | Filter options | Option counts say "1 tickets" for a single ticket, and count all tickets rather than the current list | Wording / clarity | *Proposed: "1 ticket"* | Open |
| OQ-SUP-011 | Cross-module | Tickets are not linked to the facilitator, participant, client or program record | Admins cannot see context or navigate | Confirm whether links are needed | Open |
| OQ-SUP-012 | Roles | Roles & Access stores view / edit / export for Support desk and a Support Executive role, but nothing is enforced and there is no export | Segregation of duties; missing export | Confirm enforcement and whether export is needed | Open |
| OQ-SUP-013 | Board | Drag and drop has no keyboard alternative on the board; the board has no pagination | Accessibility; scale with many tickets | Confirm keyboard support and paging/limits | Open |
| OQ-SUP-014 | Summary pills | Pill counts follow search and filters (Facilitators' counts do not); clicking a selected pill does not return to All | Consistency across list pages | Confirm intended behaviour | Open |
| OQ-SUP-015 | Loading and errors | No loading, saving or failure states; actions are instant | Real back end will need them (SH-007) | Define loading and failure behaviour | Open |
| OQ-SUP-016 | Data management | No delete, archive, merge or re-categorise; search excludes email, description and messages | Housekeeping; findability | Confirm whether needed | Open |
| OQ-SUP-017 | Times | Relative times ("2h") and date separators use the device's clock; no timezone rule | Teams across timezones | Confirm timezone handling (SH-012) | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and features identified: Complete (page, table, board, filters, details, chat, file preview; sidebar card in the App shell PRD)
- [x] User roles and access: Complete (no enforcement, SH-002)
- [x] Page behaviour, actions and row actions: Complete
- [x] Workflows: Complete
- [x] Field-level specifications: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (reply length and search length undefined, file types not enforced, see OQ-SUP-005, OQ-SUP-006)
- [x] Validation and business rules: Complete
- [x] Success, error and confirmation messages: Complete (no confirmation dialogs exist)
- [x] Search, filters, tables: Complete
- [x] Empty states and edge cases: Complete
- [ ] Status lifecycle: Incomplete (ticket creation, requester replies and replies on closed tickets happen outside the application or are undefined; no priorities or assignment, see OQ-SUP-001, OQ-SUP-003, OQ-SUP-009)
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria: Complete
- [x] QA scenarios: Complete
- [ ] External communications (notifications to requesters): Incomplete (see OQ-SUP-002)
