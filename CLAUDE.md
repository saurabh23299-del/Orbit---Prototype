# Orbit prototype

Build a working, interactive prototype of **Orbit**, an AI-powered team operations platform for small software development agencies, and **Kepler**, its AI assistant. It's a UI/UX assignment: the result must look and behave like a real, polished product, with smooth micro-interactions, in light and dark mode.

## Sources of truth (read before building anything)

| File | What it decides |
|---|---|
| `docs/PRODUCT_SPEC.md` | **Product truth**: users, scope, information architecture, and every interaction (Dashboard D-01 to D-08, Analytics A–E). If anything conflicts, the spec wins. |
| `design/DESIGN.md` | **Visual truth**: color, type, spacing, layout, components, states, motion, voice. |
| `design/tokens.css` | Every value as CSS variables. Import once at the app root. |
| `design/reference/screens/*.dc.html` | The finished designs (one file per screen or state). Read them for exact markup, spacing, copy and behaviour. They use a canvas runtime (`support.js`, `{{holes}}`, `<sc-for>`, `<sc-if>`), so **port them, don't run them**. The `<style>` block and the logic class at the bottom of each file are the useful parts. |
| `design/reference/mock-data.js` | The mock dataset used by the designs: employees, tasks, projects, alerts, Kepler Q&A, analytics history and bottlenecks. Port it to typed data. Numbers are consistent across both screens. |
| `assets/orbit-logo.svg`, `assets/kepler-icon.svg` | Brand assets. Render them inline with `stroke="currentColor"` so they follow the theme. |

Reference screens:
- `Main.dc.html` / `Dark.dc.html`: Dashboard. `Analytics.dc.html` / `AnalyticsDark.dc.html`: Analytics. **The light versions (`Main`, `Analytics`) have the designer's final hand-tuning**, e.g. 24px KPI numbers. Where light and dark differ in anything other than color, follow the light version.
- `Dash*.dc.html`: Dashboard states (alerts expanded, alert drawer, Kepler chat, employee expanded, employee drawer, reassign select, confirm, processing, success, error, deadline modal, project drawer).
- `Ana*.dc.html`: Analytics states (period menu, custom range, chart tooltip, insight drawer, Ask AI, bottleneck expanded).

## Non-negotiable rules

**Product**
- Two screens only: Dashboard (current state: "what needs my attention?") and Analytics (historical patterns). Don't add features outside the spec.
- **Approved deviations from the spec:** the Dashboard shows Project health and deadlines *before* Team workload. The app shell adds a global search bar (center of the header), a notification bell, a Reminders card (frosted glass) and a profile tab in the side panel. Search, bell, reminders and profile can be visual-only with full hover and focus states, unless there's time to add simple dropdowns.
- The user is **Alex Morgan**, Engineering team lead. The team is 8 engineers. Agency: Apex Digital Solution (about 25 people; functional teams Design, Engineering, QA, Project/Delivery).
- **Kepler is advisory.** It never changes assignments or deadlines itself. AI buttons open the manager's confirmation flow. Every Kepler statement is tagged **Observed** or **Predicted** (with a confidence level).
- Kepler keeps context: chat opened from an alert, insight or bottleneck shows that context and answers from the mock data.
- Every data-changing action (reassign, adjust deadline) needs confirmation and shows processing → success or error (with retry) → cancel. On success, update the mock data so the UI reflects it: assignee, utilisation, task counts, KPIs, alert status, deadlines and overdue counts.
- Jira/Linear sync is **simulated**. Show sync feedback, but label it as simulated. Never imply a real integration.
- Utilisation = assigned remaining effort ÷ available capacity. Bands: **Low under 60%, Moderate 60–85%, High above 85%**. It's a workload measure, never a productivity score. No rankings or performance judgements.
- Analytics has **no global period selector**. Each historical section has its own (4 / 8 / 12 weeks / custom), and each keeps its own selection independently.
- Delivery: the donut counts completed tasks only. Exactly two delivery charts. No weekly completion trend.
- Project progress and project health are always separate measures.

**Design**
- Never hardcode hex values or off-scale spacing. Use `tokens.css` variables only.
- 1280 × 960 app shell: fixed 216px side panel at full height, sticky header, only the main area scrolls. Under 760px it becomes a normal stacked page.
- Light and dark mode via `data-theme="dark"` on `<html>`. Check both after every change.
- Indigo = user actions and selection. Violet = Kepler only. Status = tint background + dark text chips.
- Every interactive element has hover, pressed, focus-visible and disabled states (DESIGN.md §5).
- Motion per DESIGN.md §6. The Kepler moon spins (3D) only on the nav item and the main Kepler panel icon on each screen. Respect `prefers-reduced-motion`.
- Accessibility: real buttons and links, `aria-expanded` on expanders, `role="dialog"` + `aria-modal` on drawers and modals, labelled inputs, Esc closes drawers and modals, return focus to the trigger on close, WCAG AA contrast.
- Copy: sentence case, plain and supportive ("high utilisation", not "overworked").

## Tech stack (default)

- React + Vite + TypeScript
- CSS Modules (or Tailwind mapped to the CSS variables, never Tailwind's default palette)
- `motion` (Framer Motion) for drawers, modals, expanders and chart transitions
- Hand-built SVG charts (as in the references) or Recharts styled with the tokens
- Local state with a single store (Zustand or `useReducer` context) holding the mock data, so actions update every view

## Suggested structure

```
src/
  data/          mockData.ts (ported), selectors (utilisation, bands, eligibility, KPIs)
  store/         app store + actions (reassign, adjustDeadline, chat)
  components/    Button, IconButton, Chip, Tag (Observed/Predicted), Card, Drawer, Modal, Toast,
                 PeriodSelector, KeplerIcon (static + 3D), Logo, Sidebar, Header
  features/
    dashboard/   KpiRow, AlertCard, AlertDrawer, EmployeeCard, EmployeeDrawer, ProjectCard,
                 ProjectDrawer, ReassignModal, DeadlineModal, KeplerChat
    analytics/   OverviewKpis, KeplerAnalysis, InsightDrawer, UtilisationTrend,
                 WorkloadDistribution, DeliveryDonut, MilestoneBar, BottleneckList
  pages/         Dashboard.tsx, Analytics.tsx
```

## Build order (follow the spec's priorities)

1. **Foundation:** Vite app, tokens, fonts (Open Sans), app shell (sidebar, header, routing between Dashboard and Analytics), theme toggle, ported mock data and selectors, base components with all states. Make a `/components` preview route showing every component state in both themes.
2. **Dashboard:** layout, then D-01 expand, D-02 and D-08 drawers, D-06 alert drawer, D-03/D-04 reassignment with all states and data updates, D-05 deadline, D-07 contextual Kepler chat.
3. **Analytics:** layout, per-section period selectors (A) with loading state, charts with inspection (B), Explore insight (C), Ask AI (D), bottleneck inspection (E).
4. **Refinement:** theme parity, loading, success and error states, transitions, keyboard and focus, responsiveness, and testing every interaction path and data update.

Work in small steps. After each step, run the app and compare it against the matching reference screen in both themes.
