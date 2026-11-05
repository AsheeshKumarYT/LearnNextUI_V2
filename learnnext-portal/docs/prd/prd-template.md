# PRD Template and Conventions

Every module PRD in [`modules/`](modules/) uses this template exactly: the same 16 sections, the same heading names, the same table columns and the same ID formats. Do not add, rename, reorder or drop sections. If a section does not apply to a module, keep the heading and write one line explaining why (`Not applicable — …`).

---

## Conventions

### Document IDs and requirement IDs

Each module has a short **prefix** (listed in the [module inventory](module-inventory.md)). All IDs in a PRD use it.

| Item | Format | Example |
|---|---|---|
| Document ID | `PRD-<PREFIX>` | `PRD-AUTH` |
| Business rule | `BR-<PREFIX>-NNN` | `BR-AUTH-001` |
| Acceptance criterion | `AC-<PREFIX>-NNN` | `AC-AUTH-001` |
| QA test case | `TC-<PREFIX>-NNN` | `TC-AUTH-001` |
| Open question | `OQ-<PREFIX>-NNN` | `OQ-AUTH-001` |
| Shared requirement | `SH-NNN` | `SH-004` (defined in [shared-requirements.md](shared-requirements.md)) |

### Requirement status labels

Use exactly these labels:

- **Implemented**: the behaviour exists in the current build.
- **Partially Implemented**: some of the behaviour exists; the gap is stated.
- **Not Implemented**: the element is visible or planned, but it does nothing yet (for example a "coming soon" button or a placeholder page).
- **Proposed**: a suggested improvement. It is not current behaviour.
- **Requires Confirmation**: the rule or behaviour cannot be established from the application.

In the section 5 and section 8 tables, every row is **Implemented** unless its first cell ends with a tag: `[Partially Implemented]`, `[Not Implemented]`, `[Proposed]` or `[Requires Confirmation]`. Requirements that are inferred rather than observed are tagged `[Inferred]`.

### Priority levels

- **P0 (Critical):** blocks essential functionality or creates a critical business risk.
- **P1 (High):** essential to a primary user journey.
- **P2 (Medium):** important, but does not block the primary journey.
- **P3 (Low):** lower-priority functionality or an enhancement.

### Values in cells

- `N/A`: the constraint genuinely does not apply (for example a maximum length on a checkbox).
- `Requires Confirmation`: the constraint should exist but is not defined in the application.
- `None defined`: the application deliberately applies no limit, and that is acceptable. Use this sparingly. When in doubt, use `Requires Confirmation`.
- Message text that exists in the application is quoted exactly: `"Enter a valid email address"`.
- A suggested message that does not exist yet is written as *Proposed: "…"*.

### Writing rules

- Describe what happens, not how it is built. No code, APIs, data stores, components or libraries.
- Use the actual on-screen labels.
- Explain purpose before behaviour.
- Reference shared behaviour (toasts, dialogs, validation timing, pagination) by its `SH-` ID instead of repeating it.

---

## Template

```markdown
# <Module name>: Product Requirements Document

## 1. Document Information

| Item | Detail |
|---|---|
| PRD title | <Module name> PRD |
| Module name | <Module name> |
| Document ID | PRD-<PREFIX> |
| Version | 1.0 |
| Documentation status | Draft (derived from the current build) |
| Module implementation status | Implemented / Partially Implemented / Not Implemented |
| Last updated | <YYYY-MM-DD> |
| Related modules/pages | <links to other PRDs> |

## 2. Purpose and Objective
## 3. Module and Page Overview
| Page/Feature Name | Purpose | Primary User | Key Actions | Related Pages |
## 4. User Roles and Access
| User Role | Page Access | Allowed Actions | Restrictions |
## 5. Page Functionality and Behavior
(one sub-heading 5.x per page / major area)
| Feature/Element | Purpose | User Action | Expected Behavior | Conditions/Rules | Result |
## 6. User Workflow
(one sub-heading 6.x per workflow)
| Step | User Action | System Behavior | Validation/Condition | Expected Outcome |
## 7. Forms and Field-Level Specifications
(one sub-heading 7.x per form / field group)
| Field Name | Input Type | Purpose | Required/Optional | Min Length/Value | Max Length/Value | Accepted Format/Values | Default Value | Validation Rules | Conditional Behavior | Error Message |
## 8. Validation and Business Rules
| Rule ID | Rule Name | Business Rule | When It Applies | Expected Behavior | Invalid Scenario | User Feedback |
## 9. Success Messages and User Feedback
| Action/Scenario | Condition | Message Type | Message Text | When It Appears | Next User Action |
## 10. Search, Filters, Tables, and Listings
| Element/Column | Purpose | Behavior | Available Options/Rules | Empty/Error Behavior |
## 11. Empty States, Errors, and Edge Cases
| Scenario | When It Occurs | Expected Page Behavior | User-Facing Message | Recovery/Next Step |
## 12. Cross-Module Dependencies
| Related Module/Page | Relationship | Triggering Action | Expected Impact | Relevant Rules |
## 13. Acceptance Criteria
**AC-<PREFIX>-001: <title>**
- Given …
- When …
- Then …
- And …
## 14. QA Test Scenarios
| Test Case ID | Related Requirement | Scenario | Preconditions | Test Data | Expected Result | Priority |
## 15. Open Questions and Gaps
| Question ID | Related Page/Feature | Missing or Unclear Requirement | Why It Matters | Recommended Clarification | Status |
## 16. PRD Completeness Checklist
- [x] Page purpose and objective: Complete
- [ ] Minimum and maximum constraints, where known: Incomplete (see OQ-…)
- [x] … : Not applicable (reason)
```

The section 15 Status column uses `Open`. The section 16 checklist uses `[x]` with **Complete** or **Not applicable**, and `[ ]` with **Incomplete**, followed by a short reason.
