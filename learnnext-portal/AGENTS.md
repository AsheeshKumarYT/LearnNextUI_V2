# AGENTS.md — rules for AI coding agents working on LearnNext Admin

Read this file before changing anything. It describes where things live and how to extend the
project **without** creating parallel implementations.

## 0. Workflow for every change

1. **Inspect first.** Find the page/component that owns the behaviour (see the map below).
2. **Reuse.** Check `src/components/ui/index.js`, `src/components/feedback/index.js` and
   `src/components/charts/index.js` before writing UI. Almost every pattern already exists.
3. **Extend, don't fork.** If a component is missing an option, add a prop to it.
   Never create `Button2.jsx`, `NewModal.jsx`, `TableNew.jsx`, `SidebarV2.jsx`, etc.
4. **Smallest clean change.** Don't refactor or restyle unrelated files.
5. **Preserve** existing behaviour, the design tokens, dark mode and responsive behaviour.
6. **Verify** with `npm run build` (must pass), `npm run lint` (no errors) and `npm test` (signs in as each role and opens\n   its pages), and check the page at ~375px and ~1440px.

## 1. Project map

```
src/
  App.jsx                 Providers + <AppRoutes/> only. Keep it tiny.
  main.jsx                React entry.
  styles/index.css        Design tokens (CSS vars → Tailwind theme), global defaults.
  config/
    app.js                App name, localStorage keys.
    roles.js              Every role: label, ready, home, allow (pages a limited role may open).
  routes/
    AppRoutes.jsx         Route table (lazy pages).
    ProtectedRoute.jsx    Auth guard → /login.
    AuthRoutes.jsx        PublicOnlyRoute (signed-in users skip auth pages).
  layouts/
    AdminLayout.jsx       THE admin shell (sidebar, header, footer, ⌘K search).
    AuthLayout.jsx        Split-screen auth shell.
  context/                AuthContext, ThemeContext, ToastContext, NotificationContext.
  hooks/                  useAuth, useTheme, useToast, useNotifications, useForm, useAsync,
                          useLocalStorage, useDebounce, usePagination, useMediaQuery,
                          useHotkey, useOverlay, usePresence, useFloating, useClickOutside,
                          useRetained.
  services/               ALL data access (mock today), one file per area (clientsApi, facilitatorsApi, contentApi,
                          financeMastersApi, mastersApi, accessApi, authApi, dashboardApi, partnersApi, searchApi…).
                          Pages import from '@/services/api' (it re-exports them all) and never import src/data.
  data/demoData.js        Demo records consumed only by services/api.js.
  utils/                  cn, formatDate, formatNumber, validation, helpers.
  components/
    ui/                   Design-system primitives (buttons, forms, table, overlays…).
    feedback/             Alert, EmptyState, ErrorState, LoadingState, Skeleton*, Toast.
    charts/               Recharts wrappers + ChartContainer.
    navigation/           Sidebar, Header, GlobalSearch, menus, ThemeToggle.
    layout/               ContentContainer, Footer.
    brand/                Logo.
    notifications/        NotificationItem (shared by header menu + page).
  portals/                One folder per login (role) — see "Roles & portals" below.
    index.js              Registry: role → its portal definition (portalFor).
    training-partner/portal.js   What the shell shows for Training Partner: menu (navigation.js), phone tabs,
                                 page names, ⌘K sources (search.js), sidebar footer (Support card), More tiles.
    training-partner/<module>/   Training Partner pages: dashboard, clients, content, facilitators,
                                 support, settings, placeholder, ui-preview.
      <Module>.jsx          Page component (default export).
      components/           Page-specific pieces (columns, modals, drawers, widgets).
    super-admin/            Super Admin pages (Manage Clients, client page, add/edit form) + its portal.js.
  shared/clients/         Client pieces used by more than one portal (ClientLogo, CodeChip, StatPills,
                          client form steps, ClientHero, OverviewTab, TaxBillingTab…). Editing one changes
                          every portal that uses it.
  pages/                  Screens every login uses: auth/ (sign-in, role picker, "on its way"),
                          profile/ (My Profile), errors/ (404, crash, offline…).
```

### Roles & portals
- One sign-in for every role; a login can hold several roles and picks one on `/choose-role`.
- `src/config/roles.js` lists each role: label, icon, `ready`, `home` and, for a limited portal, `allow` (paths it may open).
- `src/portals/<role>/portal.js` is what the shell shows for that role (menu, tabs, page names, search, footer card,
  notifications); `usePortal()` hands the shell the signed-in role's one. The shell (components/navigation, layouts)
  never imports a portal directly.
- Where two roles share an address (e.g. `/clients`), `AppRoutes.jsx` uses `<ByRole byRole={{ 'super-admin': … }}>`
  to give each role its own page.
- A portal never imports from another portal's folder — move the piece to `src/shared/` instead.
- Add a portal: create `src/portals/<role>/` with its pages and `portal.js`, list it in `src/portals/index.js`, add its
  routes, then its entry (with `ready: true`) in `roles.js`. Add its pages to `tests/portals.spec.js`.

## 2. Recipes

### Add a page
1. `src/portals/training-partner/reports/Reports.jsx` with `export default function Reports()` (or the portal it belongs to).
2. Register in `src/routes/AppRoutes.jsx` (lazy import + `<Route>` inside the AdminLayout block).
3. Add a nav item to `NAV_ITEMS` in `src/portals/training-partner/navigation.js` (gives sidebar entry,
   breadcrumbs and document title automatically).
4. **No title block** — the header breadcrumbs already show the page name (don't add `<PageHeader>` to
   admin pages). Put page buttons with the content they act on — e.g. All Clients keeps Export and
   Add client at the right end of its list toolbar — not in the header.
   Do **not** add outer padding/max-width — AdminLayout already provides it.
   On lg+ every page is at least the window's height (AdminLayout's page wrapper is a flex column with
   `min-h-[calc(100dvh-6.75rem)]`), so the footer sits just below the fold. Give the page's root / main card
   `lg:flex-1` to stretch it to that height (see Placeholder, AddClient, ClientDetail).

### Add data / an API
Add functions to the area's file in `src/services/` (e.g. `reportsApi.list()` in a new `reportsApi.js`, re-exported from
`services/api.js`); load with
`const { data, loading, error, reload, setData } = useAsync(() => reportsApi.list(), [])`.
Demo records go in `src/data/demoData.js`. Real backend: replace the function body with
`request('/reports')` — the UI does not change.

### Table with search, filter, pagination, actions
Use `DataTable` + `TableToolbar` (+ `ColumnVisibility`). Reference: `src/pages/courses/Courses.jsx`
and `src/pages/courses/components/courseColumns.jsx`. Column shape is documented at the top of
`src/components/ui/DataTable.jsx`. Use `hideBelow` for responsive columns and `mobileCards`
for phone layouts.

### Modal + form
`Modal` + `useForm` + `FormField` + inputs, submit via `<Button type="submit" form="x-form">` in the
footer. Reference: `src/pages/courses/components/CourseFormModal.jsx`.

### Filters panel / detail panel
`Drawer`. References: `CourseFiltersDrawer.jsx`, `CourseDetailDrawer.jsx` (use `useRetained`
so content stays during the close animation).

### Destructive confirmation
`ConfirmDialog` — never `window.confirm`. Feedback via `useToast()` — never `window.alert`.

### Dashboard widget / chart
`Card` + `CardHeader divided` for lists; `ChartContainer` + a chart from `@/components/charts`
for charts. Colours come from `--ln-chart-1..5` automatically.

### Settings section
Add a component in `src/portals/training-partner/settings/components/` and an entry in `SECTIONS` in `Settings.jsx`.

### Make a module searchable in ⌘K
Add a source object to the portal's `searchSources` (Training Partner: `src/portals/training-partner/search.js`).

## 3. Design system rules

- **Tokens only.** Use semantic classes: `bg-surface`, `bg-surface-secondary`, `bg-elevated`,
  `bg-background`, `text-text`, `text-text-secondary`, `text-text-muted`, `border-border`,
  `bg-primary`, `bg-primary-soft`, `text-primary-text`, `text-success|warning|danger|info`,
  `bg-*-soft`, `rounded-control` (inputs/buttons), `rounded-card`, `rounded-pop`,
  `shadow-xs|card|raised|pop|modal`. Never hardcode `#2a69b2` or raw hex colours in pages.
  New colours → add a CSS variable in `styles/index.css` for both light and `.dark`.
- **Typography scale:** page title = `PageHeader`; section title = `SectionHeader`;
  card title = `CardHeader` (44px gradient `IconTile` + 17px semibold title + 13px line; drawers/modals use the
  same look); custom headers reuse `IconTile` (client-detail tabs: `TabHeader`); body 13–14px; captions `text-xs text-text-muted`.
- **Cards are optional.** Don't wrap every section in a Card.
- **Buttons:** `Button` variants `primary | secondary | outline | ghost | destructive | success | soft | link`.
  Icon-only → `IconButton` with a `label` (used for aria-label + tooltip).
- **Status colours** → `StatusBadge` (extend `STATUS_MAP`, don't style ad hoc).
- **z-index scale:** header 30 · sidebar 40 · overlays 80 · popovers 85 · toasts 90 · tooltips 100.
- **Every interactive element must do something.** No dead buttons.
- **States:** every async view needs loading (skeleton), empty (`EmptyState`) and error (`ErrorState`).

## 4. Responsive rules

- Breakpoints: Tailwind defaults. Sidebar: drawer `<md`, icon rail `md–lg`, full `≥lg`.
- Mobile-first classes; stack on phones, add columns at `sm`/`lg`/`xl`.
- Tables: horizontal scroll container + `hideBelow` columns + optional `mobileCards`.
- Overlays already fit the viewport (Modal becomes a bottom sheet on phones).
- Never introduce horizontal page scroll. Test at 320/375/768/1024/1440.

## 5. Accessibility rules

- Use `FormField` for labels/errors (wires `id`, `aria-describedby`, `aria-invalid`).
- Icon-only buttons need `label`. Keep visible focus (`focus-visible:ring-focus`).
- Use the provided overlay components (focus trap, ESC, scroll lock are built in).

## 6. State

Local state by default. Global state only through the existing contexts
(Auth, Theme, Toast, Notification). No Redux.
