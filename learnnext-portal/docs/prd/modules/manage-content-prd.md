# Manage Content: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Manage Content PRD |
| Module name | Manage Content (program list, program details and history, add / edit program, program content page with Upload Content and Content Permissions) |
| Document ID | PRD-CNT |
| Version | 1.2 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented. The program list, add / edit program, history, content upload and permission setting all work, and each program shows its own modules. Gaps: programs cannot be deleted or retired; a program's modules cannot be changed yet (Projects page, later); the permissions are stored but no trainer or participant experience uses them in this application; uploaded files are only held for the browser session (SH-001). |
| Last updated | 2026-11-03 (v1.1: phone layout; v1.2: program cards use the standard list card, 3 per row, on every width) |
| Phone layout (v1.1) | Program content hero actions in a vertical ⋮ menu; Upload Content keeps its coloured lanes (only the outer card is flattened); Content Permissions shows one card per module with each audience on one line; the sticky save bar sits above the bottom tab bar. See SH-013. |
| Related modules/pages | [settings-program-content-masters-prd.md](settings-program-content-masters-prd.md), [settings-finance-masters-prd.md](settings-finance-masters-prd.md), [settings-access-masters-prd.md](settings-access-masters-prd.md), [app-shell-navigation-prd.md](app-shell-navigation-prd.md), [facilitators-prd.md](facilitators-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

**Manage Content** is the catalogue of the learning programs LearnNext sells. Each program has a name, a category, a logo, the entity and sub-entity it is billed under, a fee per person and an executive overview document. Each program also has its own content page, where Admin users upload what participants receive before, during and after the program, and decide what trainers and participants may do with each item.

Objectives:

- Give Admin users one list of all programs, with search, filters and quick summary counts.
- Let Admin users add and edit programs with complete, validated details (every program field is required).
- Keep an audit trail of every change to a program and its content, visible in the program's details drawer.
- Let Admin users organise program content into three journey stages (Pre-program, During, Post-program) as named elements holding documents, videos and links.
- Let Admin users set, per element, whether trainers and participants can view, download, or view and download the content.
- Protect unsaved permission changes from being lost when the user leaves the page.

## 3. Module and Page Overview

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Manage Content list (sidebar → Manage Content) | See and find all programs | Admin user | Filter with summary pills, search, filter by category / entity, switch table / card view, sort, paginate, open details, add program, edit program, Add content | Program content page |
| Filter programs drawer | Narrow the list by category and entity | Admin user | Pick categories and entities, Reset, apply | Manage Content list |
| Program details drawer | See a program's details, executive overview and history of changes | Admin user | Add content, Edit program, View the executive overview, Show older changes | Program content page, Add / Edit program modal |
| Add / Edit program modal (2 steps) | Create or change a program | Admin user | Fill in Program step and Mapping & fees step, Next, Back, Add program / Save changes, Cancel | Manage Content list, Program content page |
| Program content page (breadcrumb "Manage Content › Program content") | Manage one program's content and permissions | Admin user | Switch tabs, Edit program, go back to All programs | Manage Content list |
| Upload Content tab | Organise the program's content in Pre-program / During / Post-program | Admin user | Add element, open element, drag to reorder or move between stages | Add / Edit element modal, Element drawer |
| Add / Edit element modal | Create or change an element (name, description, documents, videos, links) | Admin user | Type name and description, add / name / remove files and links, save, cancel | Upload Content tab |
| Element drawer | See an element in full | Admin user | Move up / down / to another stage, view / play / open files, Edit element, Delete element | Add / Edit element modal |
| Content Permissions tab | Set what trainers and participants can do with each element | Admin user | Set per stage or per element, Customise per element, Discard, Save permissions | Upload Content tab |
| File preview | View an uploaded file full size | Admin user | Open in new tab, Download, close | Program details drawer, Element drawer, program modal |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Admin user | Manage Content list and every program content page (SH-002) | All actions in section 3 | Programs cannot be deleted by anyone (no delete action exists). Role permissions from Roles & Access (which lists View, Add, Edit and Export for Manage Content) are not enforced (SH-002). |
| Trainers and participants | None. They appear only as the audiences of Content Permissions | None in this application | The permissions set here are meant for them; where they take effect is not part of this application (OQ-CNT-011) |
| Signed-out visitor | None | None | Redirected to Sign in (SH-003) |

## 5. Page Functionality and Behavior

### 5.1 Manage Content list: toolbar

The list follows the All Clients pattern (SH-008). The breadcrumb and browser tab title read "Manage Content" (SH-009).

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Count and filter | Click a pill | "All programs", "New this month", "Changed this week", each with a count. Tooltips: "Show all programs", "Added in the last 30 days", "Edited in the last 7 days". Clicking a pill filters the list to it; "All programs" removes the pill filter | New this month = created within the last 30 days (a rolling window, not the calendar month, see OQ-CNT-013). Changed this week = the latest history entry is within the last 7 days; content changes (elements added, edited, moved, removed, permissions saved) count too. Counts are for the whole list and do not change with search or filters | Filtered list |
| Search | Find a program | Type in "Search program, category, entity…" | Filters as the user types (short delay), case-insensitive, ignoring surrounding spaces. Matches program name, category, entity name and sub-entity name | SH-008 | Matching rows |
| View switch | Choose table or cards | Click "Table view" or "Card view" (icon buttons with tooltips) | Switches the list between the table and a card grid. The choice is remembered (SH-001). Cards are the standard list card (as on All Clients / Facilitators): the program logo, name, sub-entity (entity on hover) and the category as a dot pill, **Edit** top-right; under a dashed line the fee "₹… per person" and **Add content**. Clicking the card opens the program's details. Three cards per row from large screens (two on tablets, one on phones); hover shows a firmer edge and soft shadow, without lifting the card | Hidden on phones; phones always show cards | — |
| **Filters** button | Open the filter drawer | Click | Opens "Filter programs" (section 5.3). Shows the number of filters applied | Category and entity chips are counted; the summary pill is not | Drawer opens |
| **Add program** button | Create a program | Click | Opens the Add program modal (section 5.5) | At the right end of the toolbar | Modal opens |
| Result line | Show what is filtered | — | While a pill, search or filter is active: "N of Total programs", a removable chip per category and per entity, and **Clear all** (clears search, pill and filters) | SH-008 | — |

### 5.2 Manage Content list: table and cards

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Program column | Identify | Hover a long name | Logo, program name (one line; full name on hover) and category under it. While the Entity column is hidden, " · \<sub-entity>" follows the category | Sortable; cannot be hidden | — |
| Program logo | Recognise the program | — | The uploaded logo on a white square. A program without a logo shows its initials (up to 4 letters; short words such as "for", "and", "the" and the ® / ™ marks are skipped) | Logo is required for new and edited programs, so initials only appear for records without one | — |
| Entity › Sub-entity column | Show billing mapping | — | Entity name with "› \<sub-entity>" under it | Sortable (by entity name). Hidden below extra-large screens | — |
| Fee / person column | Show price | — | Fee in rupees (SH-012) | Sortable | — |
| Created by / on column | Audit | Hover the date | Avatar, creator name and created date; relative time on hover | Sortable by date. Shown only on very wide screens (from about 1400 px) | — |
| Last modified column | Show the latest change | Hover | Date of the latest history entry and "by \<first name>". Tooltip: "\<change title> · \<full name>" (for example "Fee per person changed · Neha Verma") | Sortable. Hidden below large screens. Default sort: Last modified, newest first | — |
| **Add content** (row action) | Open the program's content | Click | Opens the program content page (section 5.6) on the Upload Content tab | Always visible on every row | Content page opens |
| Edit (pencil, row action) | Edit the program | Click | Opens the Edit program modal. Tooltip / label "Edit \<program name>" | Plain ghost icon | Modal opens |
| Row click | Open details | Click a row (not on its actions) | Opens the Program details drawer (section 5.4) | — | Drawer opens |
| Pagination | Page through programs | — | 10 rows per page; choices 10, 20, 50 or All rows (SH-008) | Table only | — |
| Program card (card view and phones) | Visual browsing | Click the card | Card shows the logo on a soft panel, the category tag, the program name (one line; full name on hover), the sub-entity (tooltip "\<sub-entity> · \<entity>"), the fee "per person" and **Add content**. Clicking anywhere on the card opens the details drawer | Edit (pencil, "Edit \<name>") appears on hover or keyboard focus, and is always visible on touch screens. Cards follow the same order as the table's default (Last modified, newest first); there is no sort control | — |
| Card pagination | Page through cards | — | 12 cards per page with a pager when there are more than 12 | No page-size choice (differs from SH-008) | — |

### 5.3 Filter programs drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer header | Context | — | "Filter programs" / "By category or entity" | SH-006 | — |
| Category | Filter by category | Pick one or more | Multi-select "Any category", searchable ("Search categories…"). A **Clear** link appears in the section when something is picked | Options are the categories used by at least one program, A–Z (not every category in the master) | Draft only |
| Entity | Filter by entity | Pick one or more | Multi-select "Any entity", searchable ("Search entities…"), with its own Clear | Options are the entities used by at least one program, A–Z | Draft only |
| **Reset** | Clear the draft | Click | Clears Category and Entity in the drawer; keeps the summary pill | Not applied until the main button is clicked | — |
| **Show N programs** | Apply | Click | Applies the draft and closes the drawer. The label shows the live count with the current search and pill ("Show 1 program" / "Show N programs") | Disabled and labelled "No matching programs" when the draft matches nothing | Filtered list |
| Close without applying | Abandon | ×, Esc or backdrop | Closes; the draft is discarded and the next opening starts from the applied filters | SH-006 | — |

### 5.4 Program details drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Header | Identify | — | Large logo, program name, "● \<category> · ₹\<fee> per person", on a soft wash in the logo's colour | A **Close** (×) button stays at the top while the drawer scrolls | — |
| **Add content** | Open the content page | Click | Opens the program content page | — | Content page opens |
| **Edit program** | Edit | Click | The drawer closes and the Edit program modal opens. When the modal closes (saved or cancelled), the drawer comes back showing the latest details | — | — |
| Details | Mapping and audit | — | Rows "Entity", "Sub-entity", "Created" (\<creator> · \<date>) | Entity or sub-entity removed from the masters shows "Removed entity" / "Removed sub-entity" | — |
| Executive overview | Open the overview file | Click **View** ("View \<file name>") | Opens the file preview (section 5.12) | — | Preview opens |
| History | Audit trail | — | Heading "History" with the number of entries. Entries newest first, each with a title, an optional detail, a relative time (full date on hover) and "by \<name>". Entry types are listed in section 10.2 | 6 entries shown at first | — |
| **Show older changes** | See more history | Click | Shows 6 more entries | Only when more entries exist | — |

### 5.5 Add / Edit program modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Title and description | Context | — | Add: "Add program" / "A program you can add content to and sell per person." Edit: "Edit program" / \<current program name> | Large modal; bottom sheet on phones (SH-006) | — |
| Step indicator | Show progress | Click a step | Two steps: "Program" (name, category, logo) and "Mapping & fees" (entity, sub-entity, fee, overview). Footer shows "Step 1 of 2" / "Step 2 of 2" (hidden on phones) | Add: step 2 can only be reached once step 1 has no errors (clicking it acts as **Next**). Edit: both steps are open from the start | — |
| Program step | Identity | Fill in | Program name, Program category, Program logo (section 7.1) | — | — |
| Mapping & fees step | Billing | Fill in | Entity, Sub-entity, Fees per person, Executive overview (section 7.1) | Changing the entity clears the sub-entity | — |
| **Cancel** (step 1) / **Back** (step 2) | Leave or go back | Click | Cancel closes the modal (asking first if anything changed). Back returns to step 1 without losing entries | Disabled while saving | — |
| **Next** | Go to step 2 | Click | Shows every error on step 1. Moves on only when step 1 has none | Add: primary button. Edit: secondary button | — |
| **Add program** | Create | Click (step 2 only) | Checks both steps. If any field is wrong: shows all errors, jumps to the first step with a problem and shows the error toast "Check the highlighted fields" with "N fields need a fix in \<step name>." ("1 field needs a fix in Program."). If valid: saves with a spinner (SH-007), toast "Program added" with "\<name> · ₹\<fee> per person", closes; the program appears in the list | — | Program created; history entry "Program created" |
| **Save changes** | Update | Click | Same checks and messages; toast "Program updated" | Edit only. The button is **hidden** (not disabled) until a value differs from the saved one; it shows on both steps | Program updated; one history entry per changed field |
| Close with changes | Prevent loss | Cancel, × or Esc after changing something | Dialog — Add: "Discard this program?" / "The details you’ve entered won’t be saved." Edit: "Discard your changes?" / "Your edits to this program won’t be saved." Buttons **Keep editing** and **Discard** | Clicking the dimmed backdrop does **not** close this modal (differs from SH-006). Closes directly when nothing changed | Discard closes without saving |
| Save failure | Safety net | — | Error toast "Couldn’t add the program" / "Couldn’t save the program" with the reason, for example "Another program already has this name." or "This program no longer exists." | — | Modal stays open |

### 5.6 Program content page

Opened from **Add content** (list row, card or drawer). The breadcrumb is "Manage Content › Program content" and the browser tab title is "Program content" (SH-009).

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Hero | Identify the program | Hover the sub-entity | Logo, program name, and one line "● \<category> · \<sub-entity> · ₹\<fee> per person". Hovering the sub-entity shows the entity name | Soft wash in the logo's colour | — |
| **All programs** | Go back | Click | Returns to the Manage Content list. With unsaved permission changes, asks first (section 5.11) | — | List opens |
| **Edit** | Edit the program | Click | Opens the Edit program modal (section 5.5). After saving, the hero shows the new details | — | — |
| Section tabs | Switch section | Click "Upload Content" or "Content Permissions" | Shows the chosen section. The chosen tab is kept in the page address, so a reload or a shared link opens the same tab | An unknown tab in the address opens Upload Content. While there are unsaved permission changes and Upload Content is shown, the Content Permissions tab shows a dot ("Unsaved changes") | — |
| Program not found | Bad link | Open a program address that does not exist | Page shows "Program not found" / "It may have been removed, or the link is out of date." with **All programs** | — | User returns to the list |

### 5.7 Upload Content tab

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Section header | Context | — | "Upload Content" / "What participants get before, during and after the program." with a count pill "N elements · M files" | — | — |
| Journey ribbon | Show stage order | — | Three joined arrows: Pre-program → During → Post-program, each with its element count | Large screens only | — |
| Stage lanes | Hold the content | Scroll sideways (more than three modules), or use ‹ › in the section header | One lane per module of the program, in the program's order (Pre-program, During, Post-program for most programs). Up to three modules: the lanes share the width on large screens (two columns on tablets, stacked on phones). **More than three modules (large screens):** the board scrolls sideways like a kanban; lanes keep a fixed width with the next lane peeking in, the arrow ribbon scrolls with them, the edges fade where there is more to see, and ‹ "Earlier modules" / › "Later modules" buttons appear next to the element count (each disabled at its end). Dragging a card near either edge scrolls the board. Phones and tablets keep stacking the lanes. Pre / During / Post keep their own icon, colour and hint; other modules show their own hint and take violet, rose and slate in turn | A program's modules are set per program (BR-CNT-018) | — |
| Element card | Summarise an element | Click | Shows the name (one line, full on hover), description (up to 2 lines), one chip per file kind with its count (tooltip such as "2 documents", "1 video", "1 link") and when it was last added or edited (relative time). Clicking opens the Element drawer (section 5.9) | — | Drawer opens |
| Drag and drop | Reorder or move | Drag a card | While dragging, a line shows where it will land and the lane under the pointer is outlined. Dropping reorders within the lane or moves it to another lane. The change shows at once and is then saved | Moving to another lane shows the toast "Moved to \<stage>" with the element name and adds a history entry. Reordering within a lane shows no toast and adds no history entry. Dropping it where it was does nothing. Mouse only; the keyboard and touch alternative is the Move menu in the Element drawer | Order saved |
| Move failure | Safety net | — | Error toast "Couldn’t move the element" with the reason; the lanes reload | — | — |
| **Add element** slot | Add content to a stage | Click | Opens the Add element modal for that stage. Empty lane: a large slot "Add element" / "Nothing for \<stage, lower case> yet — documents, videos or links". Otherwise a slim slot "Add element" / "Documents, videos or links" under the cards | One slot per lane | Modal opens |
| Loading / error | — | — | Two placeholder cards per lane while loading. On failure: "Couldn’t load the content" with a retry (SH-007) | — | — |

### 5.8 Add / Edit element modal

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Title and description | Context | — | "Add element" or "Edit element" / "\<stage> · \<program name>" with the stage's icon | — | — |
| Element name, Description | Describe the element | Type | Section 7.4 | — | — |
| Element uploader | Add the element's files and links | See section 5.10 | Documents, videos (upload or link) and links, each with a name | At least one item, every item named | — |
| **Add element** / **Save changes** | Save | Click | Validates (BR-CNT-012 to BR-CNT-014). If valid, saves with a spinner; toast "Element added" / "Element updated" with "\<name> · N files in \<stage>"; closes; the lane refreshes | Edit: the button is **disabled** until something changes | Element saved; history entry "Content element added" / "Content element edited" |
| **Cancel** / × / Esc | Close | Click / press | Closes directly when nothing changed. Otherwise asks: Add: "Discard this element?" / "The name, description and files you’ve added won’t be saved." Edit: "Discard your changes?" / "Your edits to this element won’t be saved." Buttons **Keep editing** / **Discard** | Backdrop click does not close this modal (differs from SH-006) | — |
| Opened from the drawer | Edit flow | Click **Edit element** in the drawer | The drawer steps aside; when the modal closes, the drawer returns showing the saved version | — | — |
| Save failure | Safety net | — | Error toast "Couldn’t add the element" / "Couldn’t save the element" with the reason (for example "This element no longer exists.") | — | Modal stays open |

### 5.9 Element drawer

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Header | Identify | — | Element name; description line "\<stage> · added by \<name> on \<date>" or, after an edit, "\<stage> · edited by \<name> on \<date>" | — | — |
| Position and **Move** menu | Reorder without dragging | Open **Move** | Shows "N of M in \<stage>". Menu: "Move up", "Move down", then "Move to" with the two other stages, each described "Added at the end" | Move up is disabled for the first element; Move down for the last | Same results as drag and drop (section 5.7) |
| Description | Detail | — | Full description | — | — |
| File groups | List the files | — | Sections "Documents", "Videos", "Links" with counts. Each row: the item's name, then the original file name · size, or the address. Pasted video links carry a small "YouTube", "Vimeo" or "Link" tag | — | — |
| View / Play / Open | Open a file | Click | Documents: **View** ("View \<name>") opens the preview. Videos that can play (uploaded files, YouTube and Vimeo links, and direct links ending in a video file type): **Play** ("Play \<name>") opens the preview player. Links and other video pages: open in a new browser tab ("Open \<name> in a new tab"). An item with nothing to open shows "Demo" (tooltip "Demo file — nothing to play") | — | — |
| File count | Summary | — | "N files in this element" | — | — |
| **Delete element** | Remove | Click | Confirmation "Delete this element?" / "\<name> and its N files will be removed from \<stage>." with **Cancel** and red **Delete** (SH-006). On Delete: toast "Element deleted" with "\<name> · \<stage>", the drawer closes and the lane refreshes | Any unsaved permission change for this element is dropped | History entry "Content element removed" |
| Delete failure | Safety net | — | Error toast "Couldn’t delete the element" with the reason | — | Dialog stays open |
| **Close** / **Edit element** | — | Click | Close closes the drawer; Edit element opens the Edit element modal | — | — |

### 5.10 Element uploader

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Label | Required marker | — | "Element uploader *" | — | — |
| **Document** button | Add documents | Click | Opens the file picker for documents (several at once) | Types and size in section 7.5 | Tiles added |
| **Video** button (menu) | Add videos | Click | Menu "Add a video": "Upload a video" ("MP4, MOV or WebM · max 500 MB") opens the video picker (several at once); "Paste a video link" ("YouTube, Vimeo or a direct link") opens the link field | — | — |
| **Link** button | Add a web link | Click | Opens the link field | — | — |
| Link field | Enter an address | Type, press Enter or click **Add**; Esc or × cancels | Placeholder "Paste a YouTube, Vimeo or video link" (video) or "Paste a web link". "https://" is added when missing | Invalid address: "Enter a full link, e.g. https://example.com/page" (clears when typing) | Item added |
| Drop zone | Add by dragging | Drop files anywhere on the uploader | Files are sorted by type: video files become videos; other files must be supported documents. While dragging over the empty uploader it reads "Release to add" | Each rejected file shows its own error toast (section 7.5); accepted files are still added | Tiles added |
| Empty state | Guide | — | "Drop files here" / "or add a document, video or link", with three shortcut tiles "Add a document", "Upload a video", "Add a link" | Turns red when the uploader has an error | — |
| Item tiles | Show what is added | Hover | Items grouped in panels "Documents", "Videos", "Links" with counts. Each tile shows a picture (a page with the file type for documents; the first frame or YouTube thumbnail for videos; a globe and the site for links) and its name. Tooltip: "\<file name> · \<size>" or the address | Each panel ends with a "+" tile: "Add document", "Add video" (opens the video menu) or "Add link" | — |
| Item name | What participants see | Click the name | A suggested name is filled in when an item is added (the file name without its extension and with underscores / hyphens turned into spaces; for links the last part of the address or the site; "YouTube video" / "Vimeo video" for those links). The first new item's name opens for typing straight away. Click a name to edit it; Enter, Esc or leaving the field closes it | Required (BR-CNT-014). An empty name shows "Name it" and, after a save attempt, is outlined in red | — |
| Remove (×) | Remove an item | Click × on a tile corner ("Remove \<name>") | Removes the item from the form at once (no confirmation) | Shown on hover or focus; always on touch screens. Nothing is deleted until the element is saved | — |

### 5.11 Content Permissions tab

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Section header | Context | — | "Content Permissions" / "Choose what trainers and participants can do with the content." | — | — |
| Column headings | Orientation | — | "Module", "Trainers", "Participants" | Large screens; on smaller screens each dropdown carries its own audience label | — |
| Stage rows | One row per stage | — | Numbered stage name with "N elements" or "No elements yet" | A stage with no elements has no dropdowns | — |
| Stage dropdowns (Trainers, Participants) | Set every element in the stage | Pick a level | Options: "View only", "Download only", "View & download". Picking one sets that audience for every element in the stage. Tooltips: "Can open it in the app, can’t download", "Can download the files", "Can open it and download it" | When the stage's elements differ, the dropdown shows "Mixed" (tooltip "Its elements differ — pick one to set them all"), and "Mixed" itself cannot be picked | Draft change |
| **Customise per element** / **Hide elements** | Per-element control | Click | Shows or hides the stage's elements, each with its kind icon, name, a summary ("2 documents · 1 video", or "No files") and its own two dropdowns | A stage whose elements differ opens by itself | — |
| Changed markers | Show unsaved changes | — | A changed dropdown and its stage name show a dot ("Changed — not saved yet") | Setting a value back to the saved one removes the change | — |
| Save bar | Save or discard | Click | Appears only while there are changes: "N changes not saved yet" (one change = one element for one audience) with **Discard** and **Save permissions** | Discard clears all changes at once, without confirmation. Save shows a spinner (SH-007) | Toast "Permissions saved" with "N elements updated"; history entry "Content permissions updated" |
| Save failure | Safety net | — | Error toast "Couldn’t save the permissions" with the reason | — | Changes kept |
| Changes survive tab switching | Avoid loss | Switch to Upload Content and back | Changes are kept; the tab shows a dot meanwhile | Deleting an element drops its changes | — |
| Leave guard | Avoid loss | With changes, click **All programs**, a breadcrumb, a sidebar item, a search result or a user-menu page | Dialog "Discard permission changes?" / "You have N unsaved permission changes. If you leave now, they won’t be saved." ("1 unsaved permission change") with **Stay** and red **Discard and leave** | Reloading or closing the browser tab shows the browser's own warning. The browser Back button is not intercepted (OQ-CNT-012) | Stay keeps the user on the page; Discard and leave drops the changes and navigates |
| Empty program | No elements yet | — | "No content yet" / "Add elements under Upload Content first — their permissions are set here." with **Go to Upload Content** | When all three stages are empty | Opens Upload Content |
| Loading / error | — | — | Three placeholder rows while loading; "Couldn’t load the content" with a retry on failure (SH-007) | — | — |

### 5.12 File preview

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Preview window | View a file | — | Full-size window titled with the file name; description shows the kind ("PDF document", "Image", "Video", "Video link", "File") and size. Images fit the window, PDFs open in the viewer, videos play with controls, YouTube / Vimeo links play in their own player | — | — |
| **Open in new tab** / **Download** | Use the file | Click | Opens or downloads the file | Download is not offered for YouTube / Vimeo links. Neither button shows when the file has no stored copy | — |
| No stored copy | Demo records | — | "Preview isn’t available" / "This file was attached before previews were supported. Replace it to view it here." | Applies to the demo executive overviews and demo documents | — |
| Unsupported type | For example Word, PowerPoint, Excel | — | "No preview for this file type" / "Download it to open it on your device." | — | — |
| Video that will not play | — | — | "Your browser can’t play this video — download it instead." | — | — |

## 6. User Workflow

### 6.1 Add a program

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Add program** | Add program modal opens on step 1 | — | — |
| 2 | Enter Program name, choose Program category, upload Program logo, click **Next** | Checks step 1 | Name entered and unique; category chosen; logo uploaded | Step 2 opens |
| 3 | Choose Entity and Sub-entity, enter Fees per person, upload Executive overview | Sub-entity list narrows to the entity's active sub-entities; fee helper shows "₹18,500 per participant, before tax" | Fee more than ₹0 and not above ₹1,00,00,000 | — |
| 4 | Click **Add program** | Checks both steps; saves | — | Toast "Program added"; the program appears in the list with history "Program created"; it counts under "New this month" and "Changed this week" |

### 6.2 Edit a program from the details drawer

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click a row | Details drawer opens | — | — |
| 2 | Click **Edit program** | Drawer closes; Edit program modal opens with both steps available | — | — |
| 3 | Change the fee | **Save changes** appears | Fee rules | — |
| 4 | Click **Save changes** | Saves; toast "Program updated" | — | Drawer returns; History shows "Fee per person changed" with "₹old → ₹new" |

### 6.3 Add content to a stage

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Click **Add content** on a program | Program content page opens on Upload Content | — | — |
| 2 | Click **Add element** in a lane | Add element modal opens for that stage | — | — |
| 3 | Enter Element name and Description | — | Both required | — |
| 4 | Add documents, videos or links | Tiles appear with suggested names; the first name opens for editing | Types and sizes per section 7.5 | — |
| 5 | Click **Add element** | Validates; saves | At least one item; every item named | Toast "Element added"; the card appears at the end of the lane; history "Content element added" |

### 6.4 Move an element to another stage

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Drag a card to another lane, or open it and choose **Move** › another stage | Element moves (at the drop point, or at the end when using Move to) | — | — |
| 2 | — | Saves | — | Toast "Moved to \<stage>"; history "Content element moved" with "\<name> · \<from> → \<to>" |

### 6.5 Set permissions and leave

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open **Content Permissions** | Stages listed with their current levels | Program has at least one element | — |
| 2 | Set Participants for "During" to "View & download" | Every During element is changed; dots and the save bar appear | — | "N changes not saved yet" |
| 3 | Click the sidebar's **Dashboard** | "Discard permission changes?" dialog | Unsaved changes exist | — |
| 4a | Click **Stay** | Dialog closes | — | User stays; changes kept |
| 4b | Click **Save permissions** | Saves | — | Toast "Permissions saved"; history "Content permissions updated" |

## 7. Forms and Field-Level Specifications

### 7.1 Add / Edit program

Validation timing (differs from SH-004): Program name and Fees per person show their errors — including the "required" errors — as soon as the user leaves the field, and then update live while typing. All other program fields show their errors only after **Next** (step 1) or **Add program** / **Save changes**. Errors clear as soon as the value becomes valid.

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Program name | Text (placeholder "e.g. Situational Leadership® II") | Program's name | Required | 1 non-space character | Requires Confirmation (no limit in the form) | Any characters; surrounding spaces removed on save | Empty (Add); current name (Edit) | Spaces-only counts as empty. Unique among programs, ignoring case and surrounding spaces; the program's own name is allowed in Edit | — | Empty: "Enter the program name". Duplicate: "Another program already has this name" |
| Program category | Searchable select (placeholder "Select category"; search "Search categories…") | File the program under a category | Required | N/A | N/A | Every category in the Program Category master, A–Z | None (Add); current category (Edit) | Must be chosen | Options refresh each time the modal opens | "Choose a category" |
| Program logo | Image upload (tile + "Upload logo" button; "Change" / "Remove" once set) | Program artwork | Required | 1 image | 1 image; 2 MB | Any image file. The hint says "PNG, JPG or SVG · up to 2 MB", but other image types are accepted (OQ-CNT-002) | None (Add); current logo (Edit) | Must be uploaded | With a logo, the tile opens it full size ("View full size") | Missing: "Upload the program logo" (replaces the hint, in red). Not an image: toast "Please choose an image file." Too large: toast "Logo must be under 2 MB." |
| Entity | Searchable select (placeholder "Select entity"; search "Search entities…") | Billing entity | Required | N/A | N/A | Active entities from the Entity master; each option shows its invoice prefix | None (Add); current (Edit) | Must be chosen | Changing it clears Sub-entity | "Choose an entity" |
| Sub-entity | Searchable select (search "Search sub-entities…") | Billing sub-entity | Required | N/A | N/A | Active sub-entities of the chosen entity | None (Add); current (Edit) | Must be chosen | Disabled with "Pick an entity first" until an entity is chosen; disabled with "No sub-entities under it" when the entity has no active sub-entity (OQ-CNT-007); otherwise "Select sub-entity" | No entity: "Choose an entity first". Entity chosen: "Choose a sub-entity" |
| Fees per person | Number with "₹" prefix (placeholder "18500") | Price per participant | Required | More than ₹0 | ₹1,00,00,000; 8 digits can be typed | Whole rupees; any non-digit typed or pasted is removed | Empty (Add); current fee (Edit) | Spaces-only counts as empty | Helper "₹\<fee> per participant, before tax" while the value is valid and above 0 | Empty: "Enter the fee per person". Zero: "Fee must be more than ₹0". Above the maximum: "That looks too high — check the amount" |
| Executive overview | Document upload (drop zone "Upload executive overview", "PDF, JPG or PNG · max 5 MB", **Browse**; drag and drop supported) | Program overview for clients | Required | 1 file | 1 file; 5 MB | PDF, JPG, PNG | None (Add); current file (Edit) | Must be uploaded | Once uploaded: a file row (name opens the preview; "PDF" or "Image" · size · "Uploaded") with Replace and Remove icons | Missing: "Upload the executive overview". Wrong type: "Use a PDF, JPG or PNG file." Too large: "File must be under 5 MB." (wrong type / size show in the drop zone and as a toast) |

### 7.2 Manage Content list search and pills

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search programs ("Search program, category, entity…") | Search text | Filter the list | Optional | N/A | Requires Confirmation | Contains, case-insensitive, trimmed; program name, category, entity, sub-entity | Empty | None | Narrows to an icon in medium-width layouts (SH-008) | N/A |
| Program summary pill | Single-select pills | Filter by recency | Optional | N/A | N/A | All programs, New this month, Changed this week | All programs | None | — | N/A |
| View | Two-option switch | Table or cards | Optional | N/A | N/A | Table view, Card view | Table view (then the remembered choice) | None | Hidden on phones | N/A |

### 7.3 Filter programs drawer

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Category | Searchable multi-select ("Any category") | Filter by category | Optional | N/A | All options | Categories used by programs, A–Z | None | None | Clear link when something is picked | N/A |
| Entity | Searchable multi-select ("Any entity") | Filter by entity | Optional | N/A | All options | Entities used by programs, A–Z | None | None | Clear link when something is picked | N/A |

### 7.4 Add / Edit element

Validation timing: every error appears only after **Add element** / **Save changes** is clicked, then updates live. There is no on-blur check.

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Element name | Text (placeholder "e.g. Welcome kit") | Element title | Required | 1 non-space character | Requires Confirmation | Any characters; trimmed on save | Empty (Add); current (Edit) | Spaces-only = empty. Duplicates within or across stages are allowed (OQ-CNT-015) | — | "Enter the element name" |
| Description | Multi-line text, 2 rows (placeholder "What it is and when participants use it") | Short explanation | Required | 1 non-space character | Requires Confirmation | Any characters; trimmed on save | Empty / current | Spaces-only = empty | — | "Add a short description" |
| Element uploader | File, video and link collection (section 7.5) | The element's content | Required | 1 item | Requires Confirmation (no count limit) | Documents, videos, links | Empty / current items | At least one item; every item named | — | None added: "Add at least one document, video or link". An item without a name: "Give every file and link a name" |

### 7.5 Element uploader items

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Document file | File upload (several per pick; drag and drop) | Readable material | Optional (one item of any kind is required) | N/A | 25 MB per file; no count limit (Requires Confirmation) | .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt, .csv | — | Type checked by file extension; size per file | Picking a video through Document is refused | Toasts: "\<file>: not a supported document (PDF, Word, PowerPoint, Excel, TXT or CSV)", "\<file>: add videos with Video", "\<file> is over 25.0 MB" |
| Video file | File upload (several per pick; drag and drop) | Session or module video | Optional | N/A | 500 MB per file; no count limit (Requires Confirmation) | Any video file. The menu says "MP4, MOV or WebM" (OQ-CNT-009) | — | Must be a video; size per file | — | Toasts: "\<file>: not a video file", "\<file> is over 500.0 MB" |
| Video link | Text (placeholder "Paste a YouTube, Vimeo or video link") | Hosted video | Optional | A full address | Requires Confirmation | Any web address with a site name containing a dot; "https://" added if missing | Empty | Checked on Add / Enter | YouTube links show a thumbnail; YouTube / Vimeo links get a "YouTube" / "Vimeo" tag; other addresses "Link" | "Enter a full link, e.g. https://example.com/page" |
| Web link | Text (placeholder "Paste a web link") | Form, page or tool | Optional | A full address | Requires Confirmation | As video link | Empty | As video link | — | Same message |
| Item name | Inline text (placeholder "Name it") | What participants see | Required for every item | 1 non-space character | Requires Confirmation | Any characters; trimmed on save | Suggested name (section 5.10) | Spaces-only = empty | — | The tile is outlined in red and the uploader shows "Give every file and link a name" after a save attempt |

### 7.6 Content Permissions

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Trainers (per stage) | Dropdown | Set all elements in the stage for trainers | Optional | N/A | N/A | View only, Download only, View & download (plus a non-selectable "Mixed") | The elements' common level, or Mixed | None | Only when the stage has elements | N/A |
| Participants (per stage) | Dropdown | Same for participants | Optional | N/A | N/A | Same | Same | None | Same | N/A |
| Trainers (per element) | Dropdown | One element for trainers | Always has a value | N/A | N/A | View only, Download only, View & download | View & download for elements never set (BR-CNT-021) | None | Shown under Customise per element | N/A |
| Participants (per element) | Dropdown | One element for participants | Always has a value | N/A | N/A | Same | View only for elements never set | None | Same | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-CNT-001 | All program fields required | Name, category, logo, entity, sub-entity, fee and executive overview are all required | Next / Add program / Save changes | Not saved; first step with a problem is shown | Any field missing | Field messages (section 7.1) and toast "Check the highlighted fields" |
| BR-CNT-002 | Unique program name | No two programs share a name, ignoring case and surrounding spaces | Typing after leaving the field, Next, Save | Not saved | " situational leadership® ii " when it exists | "Another program already has this name" (inline); if it slips through at save, toast with "Another program already has this name." |
| BR-CNT-003 | Fee range | Fee must be a whole number above ₹0 and not above ₹1,00,00,000 | Fee field | Not saved | 0, or 10000001 | "Fee must be more than ₹0" / "That looks too high — check the amount" |
| BR-CNT-004 | Fee digits only | Only digits can be entered, up to 8 | Typing / pasting | Other characters are dropped | "18,500.50" | Field shows "1850050" |
| BR-CNT-005 | Categories from the master | Program category options are exactly the Program Category master, A–Z | Program modal | New categories appear; deleted ones disappear; renamed categories move their programs | — | — (see BR-PRG-003, BR-PRG-005) |
| BR-CNT-006 | Active mapping only | Only active entities and their active sub-entities are offered | Program modal | Inactive ones are not listed | — | — |
| BR-CNT-007 | Sub-entity follows entity | Changing the entity clears the sub-entity | Program modal | Sub-entity must be chosen again | — | "Choose a sub-entity" |
| BR-CNT-008 | Logo and overview file rules | Logo: image, up to 2 MB. Overview: PDF, JPG or PNG, up to 5 MB | Upload | File refused | 3 MB PNG logo; DOCX overview | Toasts / messages in section 7.1 |
| BR-CNT-009 | Change history | Every program save records one history entry per changed field: name, category, logo, entity mapping, fee and executive overview (only when the file name changes). Content changes are recorded too (section 10.2) | Save | Entry added with the user and time | — | History in the details drawer; Last modified updates |
| BR-CNT-010 | No-change edit | Save changes is hidden until something differs from the saved program | Edit program | Button hidden | Value changed back | Button hidden again |
| BR-CNT-011 | No program deletion [Not Implemented] | Programs cannot be deleted, archived or made inactive | — | No action exists | — | — (OQ-CNT-005) |
| BR-CNT-012 | Element name and description required | Both must contain text | Element save | Not saved | Spaces only | "Enter the element name" / "Add a short description" |
| BR-CNT-013 | Element must hold content | At least one document, video or link | Element save | Not saved | Nothing added | "Add at least one document, video or link" |
| BR-CNT-014 | Every item named | Each file and link needs a name | Element save | Not saved | A cleared name | "Give every file and link a name" |
| BR-CNT-015 | Upload limits | Documents: listed types, 25 MB each. Videos: video files, 500 MB each. No limit on the number of items | Pick or drop | Refused files are skipped; others are added | 30 MB PDF | "\<file> is over 25.0 MB" |
| BR-CNT-016 | Links must be full addresses | A link needs a site name with a dot | Add link | Not added | "example" | "Enter a full link, e.g. https://example.com/page" |
| BR-CNT-017 | Moves logged, reorders not | Moving an element to another stage is recorded in history; reordering within a stage is not | Drag and drop, Move menu | Entry "Content element moved" | — | Toast "Moved to \<stage>" only for stage changes |
| BR-CNT-018 | Each program has its own modules [Partially Implemented] | Content is organised in one stage per module of the program, in the program's order. Most programs use Pre-program, During, Post-program; some have more (demo: Situational Leadership® II adds "Booster sessions"; First-Time Manager Program uses Pre-program, "Leading yourself", "Leading others", "Leading the team", Post-program; Women in Leadership Journey adds "Peer circles" and "Mentoring") | Upload Content, Content Permissions, the element Move menu | More than three stages scroll sideways on large screens. The Modules master in Settings does not add modules to programs. There is no screen yet to choose a program's modules — it will be managed from the Projects page | — | — (see OQ-CNT-008) |
| BR-CNT-019 | Delete element | Deleting an element removes it and its files after confirmation | Element drawer | Removed; history "Content element removed"; its unsaved permission changes are dropped | — | "Delete this element?" dialog; toast "Element deleted" |
| BR-CNT-020 | Permission levels | Each element has one level per audience: View only, Download only, View & download | Content Permissions | Saved per element | — | — |
| BR-CNT-021 | Default permissions | Elements never set: Trainers "View & download", Participants "View only" | New elements | Shown as defaults | — | — |
| BR-CNT-022 | Permission enforcement [Requires Confirmation] | The levels are meant to control what trainers and participants can do | Outside this application | Not used anywhere in this application | — | — (OQ-CNT-011) |
| BR-CNT-023 | Unsaved permissions guard | Leaving the program content page with unsaved permission changes asks first | All programs, breadcrumbs, sidebar, search, user menu; browser reload / close | Dialog or browser warning | Browser Back button (not guarded) | "Discard permission changes?" |
| BR-CNT-024 | Permissions save logged | A permission save adds one history entry naming how many elements changed | Save permissions | Entry "Content permissions updated" with "N elements" | — | Toast "Permissions saved" |
| BR-CNT-025 | Creator recorded | New programs and elements record the signed-in user's name and the time | Add | Shown in Created / drawer header | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Add program | Saved | Success toast | "Program added" — "\<name> · ₹\<fee> per person" | After save | Add content |
| Edit program | Saved | Success toast | "Program updated" — "\<name> · ₹\<fee> per person" | After save | — |
| Program save blocked | Errors on a step | Error toast | "Check the highlighted fields" — "N fields need a fix in \<Program / Mapping & fees>." ("1 field needs a fix in …") | On Add program / Save changes | Fix the fields |
| Program save fails | Error | Error toast | "Couldn’t add the program" / "Couldn’t save the program" — reason | After save attempt | Retry |
| Logo refused | Wrong type / too large | Error toast | "Please choose an image file." / "Logo must be under 2 MB." | On pick | Pick another file |
| Overview refused | Wrong type / too large | Error toast and inline | "Use a PDF, JPG or PNG file." / "File must be under 5 MB." | On pick or drop | Pick another file |
| Add element | Saved | Success toast | "Element added" — "\<name> · N files in \<stage>" | After save | — |
| Edit element | Saved | Success toast | "Element updated" — "\<name> · N files in \<stage>" | After save | — |
| Element save fails | Error | Error toast | "Couldn’t add the element" / "Couldn’t save the element" — reason | After save attempt | Retry |
| File refused | Type or size | Error toast (one per file) | Section 7.5 messages | On pick or drop | Pick another file |
| Move element | Moved to another stage | Success toast | "Moved to \<stage>" — \<element name> | After the move | — |
| Move fails | Error | Error toast | "Couldn’t move the element" — reason | After the move | Lanes reload |
| Delete element | Deleted | Success toast | "Element deleted" — "\<name> · \<stage>" | After confirm | — |
| Delete element fails | Error | Error toast | "Couldn’t delete the element" — reason | After confirm | — |
| Save permissions | Saved | Success toast | "Permissions saved" — "N elements updated" | After save | — |
| Save permissions fails | Error | Error toast | "Couldn’t save the permissions" — reason | After save | Retry |
| Unsaved permissions | Changes exist | Save bar | "N changes not saved yet" | While changes exist | Save or Discard |

Toasts follow SH-005.

## 10. Search, Filters, Tables, and Listings

### 10.1 Program list

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Program list | All programs | Sortable: Program, Entity › Sub-entity, Fee / person, Created by / on, Last modified | Default Last modified, newest first. Table: 10 / 20 / 50 / All rows. Cards: 12 per page | No programs: "No programs yet" / "Programs you add will appear here." + **Add program**. No match: "No programs match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| Responsive columns | Fit the screen | Created by / on hides first (below about 1400 px), then Entity › Sub-entity (below extra-large), then Last modified (below large); Add content and Edit always stay | Phones: cards | — |
| Search, pills, filters | Narrow the list | All combine (AND); categories and entities each match any picked value | Section 5.1, 5.3 | Result line "N of Total programs" with chips and **Clear all** |
| Load failure | — | Error state with retry (SH-007) | — | Table: "Couldn’t load data"; cards: "Couldn’t load the list" |

### 10.2 Program history entries

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| "Program created" | Creation | — | Who and when | Always present |
| "Renamed" | Name change | Detail "\<old> → \<new>" | — | — |
| "Category changed" | Category change in the program form | Detail "\<old> → \<new>" | Not recorded when the category is renamed in the master (OQ-PRG-003) | — |
| "Logo updated" | Logo change | No detail | — | — |
| "Entity mapping changed" | Entity or sub-entity change | Detail "\<sub-entity> · \<entity> → \<sub-entity> · \<entity>" | — | — |
| "Fee per person changed" | Fee change | Detail "₹old → ₹new" | — | — |
| "Executive overview replaced" | Overview change | Detail = the new file name | Only when the file name differs | — |
| "Content element added" / "Content element edited" / "Content element removed" | Element changes | Detail "\<element> · \<stage>" | — | — |
| "Content element moved" | Stage change | Detail "\<element> · \<from> → \<to>" | Not for reordering | — |
| "Content permissions updated" | Permission save | Detail "N elements" | One entry per save | — |

### 10.3 Upload Content and Content Permissions listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Lane order | Element order within a stage | New elements are added at the end; order changes by drag and drop or Move | No sorting or search | Empty lane: large Add element slot |
| Permissions rows | Stage and element levels | Stage rows in journey order; element rows in lane order | — | No elements at all: "No content yet" state |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| No programs | List empty | Empty state | "No programs yet" / "Programs you add will appear here." | **Add program** |
| No results | Search / filters match nothing | Empty state | "No programs match" / "Try a different search or loosen the filters." | **Clear search & filters** |
| Draft filter matches nothing | In the Filter drawer | Apply disabled | "No matching programs" | Change the draft or Reset |
| Unknown program address | Wrong or old link | Not-found state | "Program not found" / "It may have been removed, or the link is out of date." | **All programs** |
| Entity has no active sub-entity | Program modal | Sub-entity disabled; program cannot be saved with that entity | "No sub-entities under it"; on save "Choose a sub-entity" | Choose another entity, or add a sub-entity in Settings (OQ-CNT-007) |
| Entity or sub-entity removed in Settings | Used by a program | Program shows "Removed entity" / "Removed sub-entity" | — | Edit the program and choose a new mapping (OQ-CNT-007) |
| Entity made inactive | Used by a program | Not offered in the program form; behaviour of the existing value when editing | Requires Confirmation | OQ-CNT-007 |
| Duplicate name typed | Program modal | Inline error once the field was left | "Another program already has this name" | Change the name |
| Program changed elsewhere | Edit saved for a program that no longer exists | Save fails | Toast "Couldn’t save the program" — "This program no longer exists." | Close and reload |
| Element deleted elsewhere | Edit / move / delete of a missing element | Action fails | Reason "This element no longer exists." | Reload |
| Demo files | Demo overviews and documents | Preview has no stored copy | "Preview isn’t available" … | Replace the file |
| Office documents | View a Word / PowerPoint / Excel file | No in-app preview | "No preview for this file type" / "Download it to open it on your device." | Download |
| Program with no content | Content Permissions | Empty state | "No content yet" … | **Go to Upload Content** |
| Unsaved permissions, leave | Navigation inside the app | Dialog | "Discard permission changes?" | Stay or Discard and leave |
| Unsaved permissions, reload / close tab | Browser | Browser's own warning | Browser text | Stay or leave |
| Unsaved permissions, browser Back [Requires Confirmation] | Browser Back | Not intercepted; changes are lost | — | OQ-CNT-012 |
| Modal backdrop click | Program or element modal open | Nothing happens | — | Use Cancel / × |
| Reload the page | Any time | Demo data restored; added programs, elements and files are lost (SH-001) | — | — |
| Many items in one element | Large uploads | No count limit | — | OQ-CNT-009 |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Program Category master ([settings-program-content-masters-prd.md](settings-program-content-masters-prd.md)) | Source of Program category options; counts programs per category | Add / rename / delete category | Options update; renamed categories move their programs (no history entry); a category used by programs cannot be deleted and its blocked dialog offers **Go to Manage Content** | BR-CNT-005, BR-PRG-003, BR-PRG-004, BR-PRG-005 |
| Modules master ([settings-program-content-masters-prd.md](settings-program-content-masters-prd.md)) | Not linked | Add, enable, disable, rename or delete a module | No effect on programs: each program has its own modules, to be managed from the Projects page later | BR-CNT-018, BR-PRG-009 |
| Entity and Sub-entity masters ([settings-finance-masters-prd.md](settings-finance-masters-prd.md)) | Source of Entity and Sub-entity options (active only); names shown on programs | Rename, deactivate or delete | Renames show on programs at once; deactivated ones are no longer offered; deleted ones show "Removed entity" / "Removed sub-entity". Deleting is not blocked by programs that use them | BR-CNT-006, OQ-CNT-007 |
| Roles & Access ([settings-access-masters-prd.md](settings-access-masters-prd.md)) | Manage Content menu item with View, Add, Edit, Export actions | Edit a role | Not enforced; no Export exists on the page | SH-002, OQ-CNT-018 |
| App shell ([app-shell-navigation-prd.md](app-shell-navigation-prd.md)) | Sidebar item "Manage Content"; breadcrumb "Manage Content › Program content"; leave guard checked by breadcrumbs, sidebar, search and user menu | Navigate | Unsaved permission changes intercept navigation | BR-CNT-023, SH-006, SH-009 |
| Facilitators ([facilitators-prd.md](facilitators-prd.md)) | Demo facilitator certifications name a program from this catalogue | Data load | Read-only reference; later changes here are not reflected in existing facilitator records [Inferred] | — |

## 13. Acceptance Criteria

**AC-CNT-001: Add a program**
- Given the Add program modal is open
- When the user completes both steps with valid values and clicks **Add program**
- Then the toast "Program added" appears with "\<name> · ₹\<fee> per person"
- And the program appears in the list and its history shows "Program created"

**AC-CNT-002: Step 1 must be valid before step 2 (negative)**
- Given step 1 with no category chosen
- When the user clicks **Next**
- Then "Choose a category" appears (and any other step 1 errors) and step 2 does not open

**AC-CNT-003: Save jumps to the problem step (negative)**
- Given an Edit program modal on step 2 where the program name was cleared on step 1
- When the user clicks **Save changes**
- Then step 1 is shown with "Enter the program name" and the toast "Check the highlighted fields" — "1 field needs a fix in Program."

**AC-CNT-004: Duplicate program name (negative)**
- Given a program "Building Trust" exists
- When the user types " building trust " in Program name and leaves the field
- Then "Another program already has this name" appears and the program cannot be saved

**AC-CNT-005: Fee limits (negative)**
- Given the Mapping & fees step
- When the user enters 0, then 10000001
- Then "Fee must be more than ₹0", then "That looks too high — check the amount" appear
- And letters and commas cannot be typed

**AC-CNT-006: Edit is recorded in history**
- Given a program with fee ₹16,000
- When the user changes the fee to ₹18,500 and saves
- Then the toast "Program updated" appears and the drawer history shows "Fee per person changed" — "₹16,000 → ₹18,500"

**AC-CNT-007: Search and filters combine**
- Given the program list
- When the user picks Category "Leadership" in Filters and searches "change"
- Then only Leadership programs matching "change" are listed, the result line shows "N of Total programs" with a "Leadership" chip, and **Clear all** restores the full list

**AC-CNT-008: Summary pills**
- Given the program list
- When the user clicks "Changed this week"
- Then only programs whose latest history entry is within the last 7 days are listed

**AC-CNT-009: Open program content**
- Given a program row
- When the user clicks **Add content**
- Then the program content page opens on Upload Content with the program's hero, and the breadcrumb reads "Manage Content › Program content"

**AC-CNT-010: Add an element**
- Given the Add element modal for Pre-program
- When the user enters a name and description, adds one PDF and clicks **Add element**
- Then the toast "Element added" — "\<name> · 1 file in Pre-program" appears and the card shows in the Pre-program lane

**AC-CNT-011: Element requires content (negative)**
- Given the Add element modal with name and description but no items
- When the user clicks **Add element**
- Then "Add at least one document, video or link" appears and nothing is saved

**AC-CNT-012: Upload limits (negative)**
- Given the element uploader
- When the user drops a 30 MB PDF and a .zip file
- Then the toasts "\<file> is over 25.0 MB" and "\<file>: not a supported document (PDF, Word, PowerPoint, Excel, TXT or CSV)" appear and neither file is added

**AC-CNT-013: Move to another stage**
- Given an element in Pre-program
- When the user opens it and chooses **Move** › During
- Then it appears at the end of During, the toast "Moved to During" appears and history shows "Content element moved"

**AC-CNT-014: Delete an element**
- Given the Element drawer
- When the user clicks **Delete element** and confirms **Delete**
- Then the toast "Element deleted" appears and the card disappears

**AC-CNT-015: Set and save permissions**
- Given a program with elements
- When the user sets Participants for a stage to "Download only" and clicks **Save permissions**
- Then the toast "Permissions saved" — "N elements updated" appears and the save bar disappears

**AC-CNT-016: Leave guard (negative)**
- Given unsaved permission changes
- When the user clicks **All programs** or a sidebar item
- Then "Discard permission changes?" appears; **Stay** keeps the page and changes; **Discard and leave** navigates and drops them

**AC-CNT-017: Unsaved program modal**
- Given an Add program modal with a name typed
- When the user presses Esc
- Then "Discard this program?" appears with **Keep editing** and **Discard**

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-CNT-001 | AC-CNT-001 | Add program | — | "Negotiation Mastery", Sales, PNG logo, any entity / sub-entity, 15000, PDF overview | Added; toast "Program added" — "Negotiation Mastery · ₹15,000 per person" | P1 |
| TC-CNT-002 | AC-CNT-002 | Next with empty step 1 | Add modal | Nothing entered | Three errors: name, category, logo; step 2 not reached | P1 |
| TC-CNT-003 | 7.1 | Required name on blur (differs from SH-004) | Add modal | Focus name, leave empty | "Enter the program name" appears on blur | P2 |
| TC-CNT-004 | AC-CNT-004 | Duplicate name, other case | Demo data | " building trust " | Duplicate error | P1 |
| TC-CNT-005 | AC-CNT-005 | Fee zero / too high / letters | Step 2 | "0", "10000001", "abc" | Two errors; letters ignored | P1 |
| TC-CNT-006 | 7.1 | Fee max digits | Step 2 | 9 digits | Only 8 accepted | P3 |
| TC-CNT-007 | 7.1 | Logo too large / not an image | Step 1 | 3 MB PNG; PDF | Toasts "Logo must be under 2 MB." / "Please choose an image file." | P2 |
| TC-CNT-008 | 7.1 | Overview wrong type / too large | Step 2 | DOCX; 6 MB PDF | "Use a PDF, JPG or PNG file." / "File must be under 5 MB." | P2 |
| TC-CNT-009 | BR-CNT-007 | Entity change clears sub-entity | Step 2 with both chosen | Pick another entity | Sub-entity empty | P2 |
| TC-CNT-010 | AC-CNT-003 | Save jumps to step 1 | Edit modal | Clear name, go to step 2, Save | Step 1 shown; toast "1 field needs a fix in Program." | P2 |
| TC-CNT-011 | BR-CNT-010 | Save hidden until changed | Edit modal | Change fee, change back | Save changes shows, then hides | P2 |
| TC-CNT-012 | AC-CNT-006 | History entries | Edit "Building Trust" | Change name and fee | Two entries "Renamed" and "Fee per person changed" | P1 |
| TC-CNT-013 | AC-CNT-017 | Discard dialog | Add modal with text | Esc; Discard | Modal closes without saving | P2 |
| TC-CNT-014 | 5.5 | Backdrop click | Modal open | Click outside | Modal stays open | P3 |
| TC-CNT-015 | AC-CNT-007 | Search fields | Demo data | Search a sub-entity name | Programs under it listed | P2 |
| TC-CNT-016 | AC-CNT-008 | Pills | Demo data | Click each pill | Counts match listed rows | P2 |
| TC-CNT-017 | 5.3 | Filter drawer live count | — | Pick a category | Button "Show N programs"; Reset keeps pill | P2 |
| TC-CNT-018 | 5.2 | View switch remembered | Desktop | Switch to Card view, reload | Card view kept; 12 cards per page | P3 |
| TC-CNT-019 | 5.4 | Drawer edit round trip | Drawer open | Edit program → Cancel | Drawer returns | P2 |
| TC-CNT-020 | 5.4 | Show older changes | Program with more than 6 entries | Click | 6 more entries | P3 |
| TC-CNT-021 | AC-CNT-009 | Content page and tab in address | — | Open Content Permissions, reload | Same tab shown | P2 |
| TC-CNT-022 | 5.6 | Program not found | — | Unknown program address | "Program not found" | P2 |
| TC-CNT-023 | AC-CNT-010 | Add element | Program without content | Name, description, 1 PDF | Card in lane; toast | P1 |
| TC-CNT-024 | AC-CNT-011 | Element validation | Add element | Empty everything; Save | Three errors only after Save | P1 |
| TC-CNT-025 | BR-CNT-014 | Unnamed item | Item added | Clear its name; Save | "Give every file and link a name"; tile outlined red | P2 |
| TC-CNT-026 | AC-CNT-012 | Upload limits | Uploader | 30 MB PDF; .zip | Both refused with toasts | P1 |
| TC-CNT-027 | BR-CNT-016 | Link check | Link field | "example"; "example.com/page" | First refused; second added as https://example.com/page named "Page" | P2 |
| TC-CNT-028 | 5.10 | Video link | Video menu → Paste a video link | A YouTube watch link | Tile with thumbnail, "YouTube" tag, name "YouTube video" | P3 |
| TC-CNT-029 | AC-CNT-013 | Move between stages | Element in Pre-program | Drag to During | Toast "Moved to During"; history entry | P1 |
| TC-CNT-030 | BR-CNT-017 | Reorder within stage | Two elements | Drag second above first | No toast; no history entry | P3 |
| TC-CNT-031 | AC-CNT-014 | Delete element | Element drawer | Delete → Delete | Toast "Element deleted" | P1 |
| TC-CNT-032 | 5.9 | Edit element Save disabled | Edit element | Open, change nothing | Save changes disabled | P2 |
| TC-CNT-033 | AC-CNT-015 | Save permissions | Program with elements | Stage Participants → Download only | Toast "Permissions saved" | P1 |
| TC-CNT-034 | 5.11 | Mixed and customise | Different element levels in one stage | Open tab | Stage shows "Mixed" and opens its elements | P2 |
| TC-CNT-035 | 5.11 | Revert removes change | One change made | Set it back | Save bar disappears | P3 |
| TC-CNT-036 | AC-CNT-016 | Leave guard | Unsaved permissions | Click breadcrumb "Manage Content" | Dialog; Stay keeps changes | P1 |
| TC-CNT-037 | 5.11 | Tab dot | Unsaved permissions | Switch to Upload Content | Permissions tab shows dot; changes kept on return | P3 |
| TC-CNT-038 | BR-CNT-019 | Delete element with unsaved permission | Permission change on element X | Delete X | Change count drops | P3 |
| TC-CNT-039 | BR-CNT-005 | New category offered | Category added in Settings | Open Add program | Category listed | P2 |
| TC-CNT-040 | 5.2 | Phone layout | 375 px | Open list | Cards only; no view switch; Edit visible on cards | P3 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-CNT-001 | Program modal | No maximum length or character rules for Program name | Data quality, display truncation | Define limits | Open |
| OQ-CNT-002 | Program logo | Hint says "PNG, JPG or SVG", but any image type (for example GIF, WebP) is accepted | Inconsistent rule | Confirm the allowed types | Open |
| OQ-CNT-003 | Executive overview | Overview accepts images (JPG, PNG) as well as PDF | An "executive overview" is usually a document | Confirm allowed types and the 5 MB limit | Open |
| OQ-CNT-004 | Fee | Maximum of ₹1,00,00,000, whole rupees only, "before tax" — limits and tax handling are not specified anywhere else | Pricing accuracy | Confirm the range, decimals and tax treatment | Open |
| OQ-CNT-005 | Programs | No way to delete, archive or deactivate a program | Retired programs stay in the catalogue | Decide the lifecycle (delete / inactive) and its rules | Open |
| OQ-CNT-006 | Program modal validation | Program name and Fees per person show "required" errors on blur, unlike SH-004 | Inconsistent validation timing | Confirm which behaviour is intended | Open |
| OQ-CNT-007 | Entity mapping | An entity with no active sub-entity cannot be used; deleting or deactivating an entity / sub-entity used by programs is not blocked and leaves "Removed entity" / "Removed sub-entity" | Broken billing mapping | Define in-use protection and what editing shows for inactive values | Open |
| OQ-CNT-008 | Stages | Each program has its own modules (BR-CNT-018), but there is no screen to add, rename, reorder or remove a program's modules; it will be managed from the Projects page | Admins cannot change a program's modules yet | Define the module management on the Projects page (names, order, removing a module that holds content) | Open |
| OQ-CNT-009 | Element uploader | Video menu says "MP4, MOV or WebM" but any video is accepted; no limit on items per element, elements per stage or total size | Storage cost and consistency | Confirm types and count / total limits | Open |
| OQ-CNT-010 | Element form | No maximum length for element name, description, item names or links | Display and data quality | Define limits | Open |
| OQ-CNT-011 | Content Permissions | Where and how the levels are enforced for trainers and participants; whether "Download only" means no in-app viewing; confirm defaults (Trainers View & download, Participants View only) | Permissions currently have no effect | Define the consuming experience and rules | Open |
| OQ-CNT-012 | Leave guard | Browser Back is not intercepted; Discard in the save bar has no confirmation | Possible loss of changes | Confirm required coverage | Open |
| OQ-CNT-013 | Summary pill | "New this month" means the last 30 days, not the calendar month | Label may mislead | Confirm label or rule | Open |
| OQ-CNT-014 | History | Reordering within a stage is not recorded; category renames from the master are not recorded (OQ-PRG-003) | Audit completeness | Confirm what must be logged | Open |
| OQ-CNT-015 | Elements | Duplicate element names and the same file added twice are allowed | Confusing content | Decide uniqueness rules | Open |
| OQ-CNT-016 | Search | Maximum search length not defined | Minor | Confirm | Open |
| OQ-CNT-017 | Files | Uploaded files are held only for the browser session (SH-001); storage, retention and virus scanning are not defined | Production readiness | Define file storage requirements | Open |
| OQ-CNT-018 | Roles & Access | An "Export" action is listed for Manage Content, but the page has no export | Dead permission | Confirm whether export is needed | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages, modals, drawers and dialogs: Complete
- [x] User roles and access: Complete (role permissions not enforced, SH-002)
- [x] Field specifications: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (text lengths and item counts undefined, see OQ-CNT-001, OQ-CNT-009, OQ-CNT-010, OQ-CNT-016)
- [x] Validation timing and messages: Complete (difference from SH-004 noted, OQ-CNT-006)
- [x] Success and error messages: Complete
- [x] Search, filters and tables: Complete
- [x] Empty states and edge cases: Complete
- [ ] Program lifecycle (delete / retire): Incomplete (not implemented, see OQ-CNT-005)
- [ ] Permission enforcement for trainers and participants: Incomplete (see OQ-CNT-011)
- [ ] Managing a program's modules: Incomplete (see OQ-CNT-008)
- [x] Cross-module dependencies: Complete
- [x] Acceptance criteria and QA scenarios: Complete
