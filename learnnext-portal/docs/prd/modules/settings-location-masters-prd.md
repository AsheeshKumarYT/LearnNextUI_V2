# Settings – Location Masters: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | Settings – Location Masters PRD |
| Module name | Settings – Location Masters (Country, State, City) |
| Document ID | PRD-LOC |
| Version | 1.1 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Partially Implemented (the three lists are built and read-only; the values they hold are not yet used by any address form in the application) |
| Last updated | 2026-11-03 (v1.1: phone layout) |
| Phone layout (v1.1) | The CRM sync note becomes one short line on phones: "Read-only · synced from CRM · <date>". See SH-013. |
| Related modules/pages | [settings-hub-prd.md](settings-hub-prd.md), [clients-prd.md](clients-prd.md), [client-detail-prd.md](client-detail-prd.md), [facilitators-prd.md](facilitators-prd.md), [settings-finance-masters-prd.md](settings-finance-masters-prd.md), [settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md), [Shared requirements](../shared-requirements.md) |

## 2. Purpose and Objective

The Location group in Settings holds the geography reference lists — "Countries, states and cities used in addresses." — as three masters: **Country**, **State** and **City**. They form a hierarchy: every state belongs to a country, and every city belongs to a state within a country. The lists are owned by the company's CRM portal. LearnNext Admin shows them so that Admin users can see which places exist, their codes (country code, mobile/dialling code, GST state code) and how many states and cities sit under each. Nothing can be added, edited, deactivated or deleted here.

Objectives:

- Give Admin users one place to look up countries, states and cities and the codes attached to them.
- Show the hierarchy: states per country, cities per state and per country.
- Show which states carry a GST state code (Indian states) and which do not.
- Make it clear that the data comes from the CRM and is read-only, and when it was last synced.

## 3. Module and Page Overview

All three pages open from **Settings › Location** (see [settings-hub-prd.md](settings-hub-prd.md)). The header breadcrumb reads "Settings › \<master name>" and the "Settings" crumb leads back to the hub (SH-009).

| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
|---|---|---|---|---|
| Country | Lists countries synced from the CRM with country code, mobile code and the number of states and cities in each | Admin user | Search, sort, paginate | State, City, Settings hub |
| State | Lists states synced from the CRM with their country, GST state code and number of cities | Admin user | Filter by GST pill, search, open Filters (country, GST code), sort, paginate | Country, City, Settings hub |
| City | Lists cities synced from the CRM with their state and country | Admin user | Search, open Filters (country, state), sort, paginate | Country, State, Settings hub |

## 4. User Roles and Access

| User Role | Page Access | Allowed Actions | Restrictions |
|---|---|---|---|
| Admin user (any signed-in staff member) | All three pages (SH-002, SH-003) | View, search, filter, sort and paginate | Cannot add, edit, deactivate or delete any country, state or city; changes are made in the CRM portal. Role-based limits defined in Roles & Access are not enforced (SH-002). |
| Signed-out visitor | None | None | Redirected to Sign in (SH-003). |

## 5. Page Functionality and Behavior

### 5.1 Shared frame (all three pages)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| List card | Holds the toolbar, the sync note and the list | Open the page | One card fills the page height on large screens, following the All Clients list pattern (SH-008) | — | Consistent list layout |
| Summary pills | Show totals (and, where marked, filter) | Click a filterable pill | Each pill shows a count. Only some pills are clickable filters (listed per page below); the others are plain counts and do nothing when clicked | Counts are of all records, not of the filtered list. The "All …" pill is the resting state and is never highlighted | Counts visible at a glance |
| Search box | Find a place by text | Type | Rows filter as the user types (short delay of about 0.15 s). Matching ignores case and surrounding spaces and is a "contains" match | Fields searched differ per page (section 10) | Matching rows only |
| Result line | Explain the current filter | Search or filter | Shows "**N** of **Total** \<noun>" with removable chips for applied drawer filters and a **Clear all** link (SH-008) | Shown only while a search, a filter pill or a drawer filter is active | Clear view of what is shown |
| CRM sync note | Explain the data source | — | A strip under the toolbar reads "**Synced from the CRM portal.** Read-only here — \<noun> are added and edited in the CRM." (noun = countries / states / cities) and, at the right, "Last synced \<relative time>" | Relative time follows SH-012. All three pages show the same sync time | User knows why there is no Add/Edit |
| No Add, Edit, Deactivate or Delete | The data belongs to the CRM | — | There is no Add button, no row actions, no active/inactive status, and rows do not open anything | — | Read-only list |
| Table / cards | Show records | Scroll, sort, page | Table from tablet width upward with a header that stays pinned while scrolling on large screens; cards on phones (SH-008) | 10 rows per page; choices 10, 20, 50 rows or "All rows". Default sort per page (section 10) | — |
| Loading | Show progress | Open the page | Skeleton rows and pill placeholders (SH-007) | — | — |
| Load failure | Recover | Click **Try again** | Table: "Couldn’t load data" with the error text; phone cards: "Couldn’t load the list" with the error text | Failures do not normally occur with demo data (SH-001) | List reloads |

### 5.2 Country

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Show totals | Click **Countries** | Pills: "Countries" (tooltip "Show all countries"), "States", "Cities", each with its count. Clicking **Countries** clears the search. "States" and "Cities" are plain counts (not clickable) | States and Cities = totals across all countries | Full list |
| Country name column | Identify the country | — | Globe icon, country name, and below it "N state(s) · N city/cities" (for example "10 states · 22 cities", "1 state · 1 city") | Always shown; cannot be hidden | — |
| Country code column | Show the country's short code | — | Code shown as a code chip (for example "IN", "KW", "TUR") | Sortable | — |
| Mobile code column | Show the dialling prefix | — | Phone icon and "+\<code>" (for example "+91", "+965") | Sorted by numeric value | — |
| States column | Number of states in the country | — | Number | Shown from tablet width; sortable | — |
| Cities column | Number of cities in the country | — | Number | Shown from large width; sortable | — |
| No Filters button | — | — | The Country page has no Filters drawer; search is the only way to narrow the list | — | — |
| Phone card | Phone layout | — | Title = country name; subtitle "N states · N cities"; code chip as badge; footer = phone icon and "+\<mobile code>" | — | — |

### 5.3 State

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Filter by GST code | Click | "All states" (tooltip "Show all states"), "With GST code" (tooltip "States with a GST state code"), "No GST code" (tooltip "States without a GST code (outside India)"), each with its count. All three are filters | The pill and the drawer's GST code control set the same filter | Filtered list |
| State name column | Identify the state | — | Map icon, state name, and below it "N city" / "N cities" | Always shown | — |
| Country name column | Owning country | — | Globe icon and country name | Sortable | — |
| GST code column | GST state code | — | Code chip (for example "07", "27"), or a quiet "NA" when the state has no GST code | Sortable | — |
| Cities column | Number of cities in the state | — | Number | Shown from tablet width; sortable | — |
| Filters button | Open the filter drawer | Click **Filters** | Opens "Filter states" (section 5.5) | The button shows the number of selected countries (the GST choice is not counted) | — |
| Phone card | Phone layout | — | Title = state; subtitle = country; badge = GST code chip or "NA"; footer "GST state code \<code> · N cities" or "No GST code · N cities" | — | — |

### 5.4 City

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Summary pills | Show totals | Click **All cities** | Pills: "All cities" (tooltip "Show all cities"), "Countries", "States", each with its count. Clicking **All cities** clears the search and all drawer filters. "Countries" and "States" are plain counts | Countries = countries that have at least one city; States = all states | Full list |
| City name column | Identify the city | — | Pin icon and city name | Always shown | — |
| State name column | Owning state | — | Map icon and state name | Shown from tablet width; sortable | — |
| Country name column | Owning country | — | Globe icon and country name | Shown from tablet width; sortable | — |
| Filters button | Open the filter drawer | Click **Filters** | Opens "Filter cities" (section 5.5) | The button shows the number of selected countries plus selected states | — |
| Phone card | Phone layout | — | Title = city; subtitle = state; footer = globe icon and country | — | — |

### 5.5 Filter drawers (State and City)

| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
|---|---|---|---|---|---|
| Drawer | Combine filters | Open via **Filters** | Title "Filter states" / "Filter cities"; description "By country or GST code" / "By country or state". Opens with the currently applied filters | Changes are a draft until applied | — |
| Country section | Limit to countries | Pick one or more countries | Searchable multi-select, placeholder "Any country", search "Search countries…". Each option shows the number of states (State drawer: "N state(s)") or cities (City drawer: "N city/cities") | Only countries that have at least one state (State drawer) or city (City drawer) are offered | — |
| GST code section (State only) | Limit by GST code | Choose | Segmented control: "All", "With code", "NA", each with its count | Counts are of all states | — |
| State section (City only) | Limit to states | Pick one or more states | Searchable multi-select, placeholder "Any state", search "Search states…". Each option shows the state name with its country underneath | When countries are selected, only their states are offered. Removing a country also removes its selected states | — |
| Section clear | Clear one section | Click the section's clear control | Resets that section only. In the City drawer, clearing Country also clears the selected states | Shown only when the section has a non-default value | — |
| Reset | Clear all drafts | Click **Reset** | All drawer controls return to defaults | Does not apply until the apply button is clicked | — |
| Apply button | Apply the draft | Click | Label shows the live count, including the current search: "Show N states" / "Show 1 state" or "Show N cities" / "Show 1 city"; the drawer closes and filters apply | When the draft matches nothing, the button reads "No matching states" / "No matching cities" and is disabled | Filtered list |
| Closing without applying | Abandon | ×, Esc or backdrop (SH-006) | Draft discarded | — | Filters unchanged |

## 6. User Workflow

### 6.1 Look up a country's codes

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Settings › Location › Country | Page loads with skeletons, then the list sorted by country name A–Z | Signed in | All countries listed |
| 2 | Type a name, code or mobile code in "Search country, code or mobile code…" (for example "965" or "+965") | Rows filter | Case-insensitive contains | Matching country (Kuwait) |
| 3 | Read Country code and Mobile code | — | — | User has the codes |

### 6.2 Find an Indian state's GST state code

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Settings › Location › State | List sorted by country name A–Z | — | All states listed |
| 2 | Click **With GST code** | List limited to states with a code; result line "N of Total states" | — | GST states only |
| 3 | Search "maha" | Maharashtra shown with GST code "27" | — | Code found |
| 4 | Click **Clear all** | Pill returns to All, search cleared | — | Full list |

### 6.3 List the cities of a state

| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
|---|---|---|---|---|
| 1 | Open Settings › Location › City, click **Filters** | "Filter cities" drawer opens | — | — |
| 2 | Select country "India" | State options narrow to Indian states; apply button shows the live count | — | — |
| 3 | Select state "Gujarat", click "Show 4 cities" | Drawer closes; list shows Ahmedabad, Surat, Vadodara, Dahej; chips "India" and "Gujarat" | Count > 0 | Cities of the state shown |
| 4 | Remove the "Gujarat" chip | List widens to all Indian cities | — | — |

## 7. Forms and Field-Level Specifications

The masters have no data-entry forms (there is no add, edit, deactivate or delete). The only inputs are search boxes, summary pills and filters.

### 7.1 Country – search and pills

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search country, code or mobile code… | Search text | Filter by country name, country code or mobile code (with or without "+") | Optional | N/A | Requires Confirmation | Any text; case-insensitive "contains" | Empty | None | Narrows to an icon in medium layouts (SH-008) | N/A |
| Countries pill | Single pill (button) | Return to the full list | Optional | N/A | N/A | Click only | Resting state | None | Clicking clears the search | N/A |

### 7.2 State – search, pills and filters

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search state, country or GST code… | Search text | Filter by state name, country name or GST code | Optional | N/A | Requires Confirmation | Any text; case-insensitive "contains" | Empty | None | Narrows to an icon in medium layouts (SH-008) | N/A |
| Summary pill | Single-select pills | Filter by GST code | Optional | N/A | N/A | All states, With GST code, No GST code | All states | None | Same value as the drawer's GST code control | N/A |
| Country (drawer) | Searchable multi-select | Limit to countries | Optional | N/A | N/A | Countries that have at least one state, each described "N state(s)"; search "Search countries…" | None ("Any country") | None | Each selected country becomes a removable chip | N/A |
| GST code (drawer) | Segmented control | Filter by GST code | Optional | N/A | N/A | All, With code, NA (each with its count) | Current pill value | None | No chip is shown for this choice; the pill is highlighted instead | N/A |

### 7.3 City – search, pills and filters

| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
|---|---|---|---|---|---|---|---|---|---|---|
| Search city, state or country… | Search text | Filter by city, state or country name | Optional | N/A | Requires Confirmation | Any text; case-insensitive "contains" | Empty | None | Narrows to an icon in medium layouts (SH-008) | N/A |
| All cities pill | Single pill (button) | Return to the full list | Optional | N/A | N/A | Click only | Resting state | None | Clicking clears the search and all drawer filters | N/A |
| Country (drawer) | Searchable multi-select | Limit to countries | Optional | N/A | N/A | Countries that have at least one city, each described "N city/cities"; search "Search countries…" | None ("Any country") | None | Removing a country also removes its selected states; clearing the section clears states too | N/A |
| State (drawer) | Searchable multi-select | Limit to states | Optional | N/A | N/A | State names, each described by its country; search "Search states…" | None ("Any state") | None | Only states of the selected countries are offered when countries are selected; a state is identified together with its country, so states with the same name in different countries are kept apart | N/A |

## 8. Validation and Business Rules

| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
|---|---|---|---|---|---|---|
| BR-LOC-001 | CRM-owned data | Countries, states and cities are created, edited and removed only in the CRM portal | Always | No add, edit, deactivate or delete controls; rows do not open | User looks for an Add button | CRM sync note: "Synced from the CRM portal. Read-only here — … are added and edited in the CRM." |
| BR-LOC-002 | Last synced time | The pages show when the location data was last synced | When the sync time is known | "Last synced \<relative time>" | No sync time | The "Last synced" text is hidden |
| BR-LOC-003 | Hierarchy | Each state belongs to exactly one country; each city belongs to exactly one state of one country | Always | State list shows its country; City list shows its state and country | — | — |
| BR-LOC-004 | Counts follow the hierarchy | A country's state and city counts and a state's city count are worked out from the State and City lists | Country and State lists, drawer options | "N state(s) · N city/cities"; "N city/cities" | — | — |
| BR-LOC-005 | GST state code | A state may carry a GST state code; a state without one shows "NA" | State list | "With GST code" / "No GST code" pills and drawer choice | — | "NA" in the GST code column |
| BR-LOC-006 | Same state name in different countries | A state is identified by its name together with its country | City state filter | States with the same name in different countries are separate options | — | — |
| BR-LOC-007 | Filter draft | Drawer changes apply only when the apply button is clicked; the live count includes the current search | State and City drawers | Live count on the apply button | Draft matches nothing | Button disabled: "No matching states" / "No matching cities" |
| BR-LOC-008 | Duplicates [Requires Confirmation] | Whether two countries, two states in one country, or two cities in one state may share a name is not defined; the application does not check, as it never creates records | CRM sync | — | Duplicate synced from the CRM | Shown as separate rows (OQ-LOC-002) |
| BR-LOC-009 | Removing a place that has children [Requires Confirmation] | What happens to states and cities when a country or state is removed or deactivated in the CRM is not defined; there is no active/inactive state in these lists | CRM sync | — | — | — (OQ-LOC-003) |
| BR-LOC-010 | Values used elsewhere [Not Implemented] | These masters should supply the country, state and city choices in address forms | Add client, client SPOC form, Entity, Facilitators | Current build: every address form uses its own fixed built-in country → state → city list (section 12) | Place added in the CRM | Does not appear in any address form (OQ-LOC-001) |
| BR-LOC-011 | Session data | Data follows SH-001 | Always | — | — | — |

## 9. Success Messages and User Feedback

| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
|---|---|---|---|---|---|
| Viewing any of the three lists | Always | Inline note | "Synced from the CRM portal. Read-only here — \<countries / states / cities> are added and edited in the CRM." + "Last synced \<time>" | Under the toolbar | Make changes in the CRM |
| Search/filter active | At least one filter | Result line | "N of Total \<countries / states / cities>" with chips and **Clear all** | Above the list | Remove chips or clear |
| No toasts | — | — | The pages perform no saves, so no toasts are shown | — | — |

## 10. Search, Filters, Tables, and Listings

| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
|---|---|---|---|---|
| Country search | Find | Contains, case-insensitive | Country name, country code, mobile code (with or without "+") | "No countries match" / "Try a different search." + **Clear search** |
| State search | Find | Contains | State name, country name, GST code | "No states match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| City search | Find | Contains | City name, state name, country name | "No cities match" / "Try a different search or loosen the filters." + **Clear search & filters** |
| Country columns | — | Country name, Country code, Mobile code (numeric order), States, Cities — all sortable | Default: Country name A–Z | Empty master: "No countries yet" / "Countries appear here once they're synced from the CRM portal." |
| State columns | — | State name, Country name, GST code, Cities — all sortable | Default: Country name A–Z (states of one country stay in the CRM's order) | "No states yet" / "States appear here once they're synced from the CRM portal." |
| City columns | — | City name, State name, Country name — all sortable | Default: Country name A–Z (cities of one country stay in the CRM's order) | "No cities yet" / "Cities appear here once they're synced from the CRM portal." |
| Pagination | — | SH-008 | 10 / 20 / 50 rows / All rows; default 10 | — |
| Filter chips (State) | Show applied drawer filters | Removable | \<country name> per selected country | — |
| Filter chips (City) | Show applied drawer filters | Removable | \<country name> per selected country; \<state name> per selected state | — |

## 11. Empty States, Errors, and Edge Cases

| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
|---|---|---|---|---|
| Master empty | CRM has synced nothing | Empty state, no action | e.g. "No countries yet" / "Countries appear here once they're synced from the CRM portal." | Sync from the CRM |
| No matches | Search/filter excludes all rows | Empty state with button | Country: "No countries match" … **Clear search**; State/City: "No states match" / "No cities match" … **Clear search & filters** | Click the button |
| Load failure | Data cannot be loaded | Error state | "Couldn’t load data" (table) / "Couldn’t load the list" (phone) + error text + **Try again** | Retry |
| Drawer draft matches nothing | Combination excludes all (including the current search) | Apply disabled | "No matching states" / "No matching cities" | Change the draft or Reset |
| Country with no states | A country is synced without states | Country shows "0 states · 0 cities"; it is not offered in the State and City country filters | — | Add states in the CRM |
| Non-Indian state with a GST code | The CRM sends a GST code for a state outside India (demo data: North Holland, Netherlands, "97") | The state is counted under "With GST code", although the "No GST code" tooltip reads "(outside India)" | — | Correct in the CRM (OQ-LOC-004) |
| Inconsistent country codes | Codes are shown exactly as synced: mostly two letters, some three (for example "TUR", "ITA"), and "UK" rather than "GB" | Shown as-is | — | Confirm the code standard (OQ-LOC-005) |
| State and city with the same name | e.g. state "Singapore" / city "Singapore", state "Dubai" / city "Dubai" | Shown as separate rows in each list | — | — |
| Long names | Long country/state/city names | Truncated on one line | — | — |

## 12. Cross-Module Dependencies

| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
|---|---|---|---|---|
| Settings hub ([settings-hub-prd.md](settings-hub-prd.md)) | Entry point; group "Location" — "Countries, states and cities used in addresses." Items: Country ("Countries you work in"), State ("States within each country"), City ("Cities within each state"). Hub search also finds them by "nation", "region", "province", "town" or "place" | Open a master | Page opens and is added to "Recently opened" | — |
| Add client – Address and Billing steps ([clients-prd.md](clients-prd.md)) [Not Implemented] | Should use these masters for Country → State → City | Choosing an address | Current build uses a separate fixed list of 5 countries (India, United Arab Emirates, Singapore, United Kingdom, "United States") with their own states and cities, not these masters. Changes here do not reach the form | BR-LOC-010, OQ-CLI-003, OQ-LOC-001 |
| Client detail – SPOC form ([client-detail-prd.md](client-detail-prd.md)) [Not Implemented] | Should use these masters for the SPOC address | Adding/editing a SPOC | Uses the same fixed built-in list as Add client, not these masters | BR-LOC-010, OQ-CLD-003, OQ-LOC-001 |
| Entity master – address ([settings-finance-masters-prd.md](settings-finance-masters-prd.md)) [Not Implemented] | Should use these masters for the entity address | Adding/editing an entity | Uses the same fixed built-in list as Add client, not these masters | BR-LOC-010, OQ-FIN-005, OQ-LOC-001 |
| Facilitators – Add/Edit address and mobile prefix ([facilitators-prd.md](facilitators-prd.md)) [Not Implemented] | Should use these masters for the address and the Mobile code for the phone prefix | Adding/editing a facilitator | Uses the same fixed built-in list as Add client, and its own fixed dialling codes for those 5 countries, not the Country master's Mobile code | BR-LOC-010, OQ-LOC-001 |
| Industry & job masters ([settings-industry-job-masters-prd.md](settings-industry-job-masters-prd.md)) | Sibling CRM-synced read-only masters with the same frame and sync note | — | None | — |

Differences between the masters and the built-in form list (current demo data), for QA: the masters hold 14 countries and name the US "United States of America"; the forms hold 5 countries and name it "United States". The forms include places not in the masters (for example state "Sharjah", cities "Gandhinagar", "Al Ain"), and the masters include places not in the forms (for example country "Kuwait", city "Dahej").

## 13. Acceptance Criteria

**AC-LOC-001: Read-only masters**
- Given an Admin user opens Country, State or City
- When the page loads
- Then there is no Add button, no edit/delete/deactivate row actions and rows do not open anything
- And the note "Synced from the CRM portal. Read-only here — \<noun> are added and edited in the CRM." is shown with "Last synced \<relative time>"

**AC-LOC-002: Country hierarchy counts**
- Given the Country page is loaded
- When the user reads the India row
- Then it shows "10 states · 22 cities", Country code "IN" and Mobile code "+91"
- And the pills read Countries 14, States 27, Cities 41 (demo data)

**AC-LOC-003: Country search by mobile code**
- Given the Country page
- When the user searches "+965"
- Then only Kuwait is listed and the result line reads "1 of 14 countries"

**AC-LOC-004: GST pills on State**
- Given the State page
- When the user clicks **With GST code**
- Then only states with a GST state code are listed (11 in demo data)
- And **With GST code** + **No GST code** counts add up to **All states**

**AC-LOC-005: City filter narrows states by country**
- Given the City filter drawer is open
- When the user selects country "India"
- Then the State picker offers only Indian states
- And removing "India" also removes any Indian states already selected

**AC-LOC-006: Draft that matches nothing (negative)**
- Given the State drawer is open and the search box contains "Delhi"
- When the user chooses GST code "NA"
- Then the apply button reads "No matching states" and is disabled

**AC-LOC-007: Search with no results (negative)**
- Given any of the three pages
- When the user searches for text that matches nothing
- Then the empty state "No … match" appears with **Clear search** (Country) or **Clear search & filters** (State, City)
- And clicking it restores the full list

**AC-LOC-008: Masters do not feed address forms (gap)**
- Given the Country master lists "Kuwait"
- When the user opens the Add client address Country choice
- Then "Kuwait" is not offered (forms use their own fixed list, BR-LOC-010)

## 14. QA Test Scenarios

| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-LOC-001 | AC-LOC-001 | No edit controls on any of the three masters | Signed in | — | No Add, no row actions, row click does nothing; sync note shown | P1 |
| TC-LOC-002 | AC-LOC-002 | Country pill counts | Fresh reload | Demo data | Countries 14, States 27, Cities 41 | P2 |
| TC-LOC-003 | AC-LOC-002 | Non-filter pills | Country page | Click "States" pill | Nothing happens | P3 |
| TC-LOC-004 | AC-LOC-003 | Search by code | Country page | "tur", "+965", "965" | Turkiye; Kuwait; Kuwait | P2 |
| TC-LOC-005 | 5.2 | Mobile code sorts numerically | Country page | Sort Mobile code ascending | "+1" (USA) first, "+971" last | P3 |
| TC-LOC-006 | AC-LOC-004 | State pill counts | Fresh reload | Demo data | All 27, With GST code 11, No GST code 16 | P2 |
| TC-LOC-007 | 7.2 | State search by GST code | State page | "27" | Maharashtra | P2 |
| TC-LOC-008 | 5.5 | State country filter | State drawer | Country "United Kingdom" | "Show 2 states" (England, Scotland); chip "United Kingdom"; Filters count 1 | P2 |
| TC-LOC-009 | AC-LOC-006 | Empty draft disables apply | State drawer, search "Delhi" | GST code "NA" | "No matching states", disabled | P2 |
| TC-LOC-010 | AC-LOC-005 | City state options narrow | City drawer | Country "India" | State picker lists only the 10 Indian states | P2 |
| TC-LOC-011 | 6.3 | City filter by state | City drawer | India + Gujarat | "Show 4 cities"; chips "India", "Gujarat"; Filters count 2 | P2 |
| TC-LOC-012 | AC-LOC-005 | Removing a country drops its states | City drawer with India + Gujarat selected | Remove India | Gujarat no longer selected | P2 |
| TC-LOC-013 | 5.4 | All cities pill clears everything | City page with search and filters applied | Click "All cities" | Search and filters cleared, 41 cities | P3 |
| TC-LOC-014 | AC-LOC-007 | Search no results | Country page | "zzzz" | "No countries match" + **Clear search** | P2 |
| TC-LOC-015 | 5.1 | Pagination | City list | Choose "All rows" | All 41 on one page | P3 |
| TC-LOC-016 | 5.1 | Phone cards | 375 px width | State page | Cards with "GST state code 27 · 3 cities" / "No GST code · 1 city" footers | P3 |
| TC-LOC-017 | 5.2 | Responsive columns | Widths 768 / 1024 | Country page | States column from tablet, Cities column from large | P3 |
| TC-LOC-018 | AC-LOC-008 | Address forms not linked (gap) | — | Open Add client, Entity, Facilitator and SPOC address Country lists | 5 countries incl. "United States"; no "Kuwait" | P2 |
| TC-LOC-019 | 11 | Non-Indian state with GST code | State page | Click "With GST code" | North Holland (Netherlands, "97") is listed | P3 |

## 15. Open Questions and Gaps

| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
|---|---|---|---|---|---|
| OQ-LOC-001 | Add client, SPOC form, Entity, Facilitators | Every address form uses its own fixed 5-country list (and facilitators their own dialling codes) instead of these masters | Places added in the CRM never reach the forms; names differ ("United States" vs "United States of America") | Confirm that address forms should read Country → State → City (and mobile codes) from these masters | Open |
| OQ-LOC-002 | All three | Duplicate rule is not defined (country name; state name within a country; city name within a state) | Duplicates synced from the CRM would appear twice and confuse filters | Define uniqueness within the parent and how duplicates are handled on sync | Open |
| OQ-LOC-003 | Country, State | Behaviour when a country or state with children is removed or deactivated in the CRM is not defined; the lists have no active/inactive state | Orphan states/cities and addresses that point to removed places | Define the deactivate/delete rule and whether inactive places are shown | Open |
| OQ-LOC-004 | State – GST code | A non-Indian state (North Holland) carries a GST code "97", while the "No GST code" tooltip says "(outside India)" | GST code may be used for tax on invoices | Confirm GST codes apply only to Indian states | Open |
| OQ-LOC-005 | Country – codes | Country codes mix two- and three-letter forms ("IN", "TUR", "ITA") and use "UK"; no format is defined for country, mobile or GST codes | Codes may be used in integrations | Confirm the standard (for example ISO two-letter) and formats | Open |
| OQ-LOC-006 | All | Sync frequency, manual "Sync now", and behaviour when sync fails are not defined | Users cannot tell whether data is stale | Define the sync schedule and failure message | Open |
| OQ-LOC-007 | Search boxes | Maximum search length is not defined | Minor | Confirm or mark None defined | Open |

## 16. PRD Completeness Checklist

- [x] Page purpose and objective: Complete
- [x] Pages and key actions: Complete
- [x] User roles and access: Complete (no role enforcement, SH-002)
- [x] Fields (search, pills and filters): Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (search length not defined, see OQ-LOC-007)
- [ ] Validation and business rules: Incomplete (duplicate and delete/deactivate rules not defined, see OQ-LOC-002, OQ-LOC-003)
- [x] Success, error and empty messages: Complete
- [x] Search, filters, tables and listings: Complete
- [ ] Cross-module data links: Incomplete (no address form uses these masters, see OQ-LOC-001)
- [ ] Data sync behaviour: Incomplete (see OQ-LOC-006)
- [x] Acceptance criteria and QA scenarios: Complete
- [x] Add/edit/delete forms: Not applicable (read-only CRM masters)
