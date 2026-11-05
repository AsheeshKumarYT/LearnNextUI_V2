# LearnNext Admin

A production-ready frontend foundation for the LearnNext admin console — React 19, Vite,
Tailwind CSS v4, React Router, Lucide icons and Recharts.

It is intentionally a **starter kit**, not a finished LMS: a premium admin shell, a complete
reusable component system, mock auth, and lightweight demo pages that show how to build real
features on top.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build
```

**Demo login:** `admin@learnnext.io` / `learnnext123` (or click “Use demo” on the sign-in page).

Optional: copy `.env.example` to `.env` and set `VITE_API_BASE_URL` when a backend exists.

## What's included

| Area | Highlights |
| --- | --- |
| Design system | CSS-variable tokens mapped into Tailwind (`bg-surface`, `text-text-muted`, `bg-primary-soft`…), light/dark/system themes, consistent radius, elevation and motion |
| Layout | One `AdminLayout`: collapsible sidebar (drawer on phones, icon rail on tablets), header with breadcrumbs, ⌘K/Ctrl+K global search, notifications, theme and user menus |
| Forms | Input (+password toggle), Textarea, Select, SearchableSelect, MultiSelect, Checkbox, Radio cards, Switch, DatePicker, DateRangePicker, TimePicker, FileUpload, ImageUpload, FormField/FormSection, `useForm` validation |
| Data | DataTable (sorting, pagination, selection, bulk + row actions, column visibility, loading/empty/error, mobile cards), StatCard, MetricCard, badges, avatars, timeline, activity feed, progress |
| Overlays | Modal, ConfirmDialog, Drawer, Sheet, Popover, Dropdown, Tooltip — focus trap, ESC, scroll lock, animated |
| Feedback | Toasts, alerts, skeletons, empty/error/loading states |
| Charts | Line, Area, Bar, Horizontal bar, Donut wrappers with themed tooltip/legend |
| Pages | Auth (login, forgot, reset, success), Dashboard, Courses, Students, Instructors, Schedule, Analytics, Messages, Notifications, Profile, Settings |

## Architecture

See **[AGENTS.md](./AGENTS.md)** for the project map, extension recipes and the rules AI
coding agents (and humans) should follow when adding features.
