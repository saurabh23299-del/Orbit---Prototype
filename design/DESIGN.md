# Orbit style guide

Orbit is an AI-powered team operations platform for team leads. Kepler is its AI assistant, which interprets data, flags risks and recommends actions.

**Brand promise:** Better visibility. Smarter decisions.
**Personality:** Intelligent · Clear · Connected · Human
**Feel:** calm, minimal, warm. Beige grounds, muted colors, generous space, quiet motion.

All values live in `tokens.css`. This file explains how to use them.

---

## 1. Design principles

1. **Calm by default.** About 90% of every screen is warm neutrals. Color appears only when it means something.
2. **Color has a job.** Indigo means "you can act here". Violet means "Kepler is speaking". Status colors mean state. Nothing is colored just for decoration.
3. **Human, not judgmental.** Overloaded people are shown in soft coral, never alarm red. Copy supports the manager instead of blaming team members.
4. **Clarity over density.** Every chart or number answers a question. Kepler explains data in plain language and always offers a next action.
5. **Familiar UI, smart layer.** Standard patterns (sidebar, cards, tables) with Kepler woven in, never a chatbot bolted on.

---

## 2. Color

### 2.1 Proportions
- Neutrals: ~90%
- Orbit indigo: ~7%
- Kepler violet: ~3%

### 2.2 Neutrals

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg-canvas` | `#F6F3EE` | `#171512` | Page background, header bar |
| `--bg-surface` | `#FCFBF8` | `#201D19` | Cards, inputs, secondary buttons |
| `--bg-subtle` | `#EFEBE4` | `#2A2621` | Inner boxes, table header, progress tracks |
| `--bg-sidebar` | `#EAE5DC` | `#100E0C` | Side panel, always darker than canvas |
| `--border` | `#E4DED4` | `#36312B` | Default 1px border and dividers |
| `--border-strong` | `#D4CCBF` | `#4A443C` | Secondary button border, card hover |
| `--text-primary` | `#1F1C18` | `#F2EEE7` | Headings, body, values |
| `--text-secondary` | `#514C45` | `#C9C2B6` | Supporting text, nav items, icons |
| `--text-muted` | `#6F6A62` | `#A39C91` | Metadata, captions, timestamps |
| `--text-disabled` | `#A39E94` | `#6B655C` | Disabled labels only |

Rules:
- Never use pure white (`#FFF`) or pure black (`#000`) as a background or text color. The only exception is white text on solid indigo, violet or danger buttons.
- Never put `--text-muted` on `--bg-sidebar`. It falls below 4.5:1 contrast. Use `--text-secondary` there.

### 2.3 Orbit indigo (brand primary)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--primary-tint` | `#EDEEF7` | `#252840` | Selected nav item, avatar, info chip background |
| `--primary-tint-hover` | `#E3E5F3` | `#2D3150` | Selected item on hover |
| `--primary-subtle` | `#CDD0EA` | `#3A4070` | Input focus glow |
| `--primary` | `#5360B5` | `#5F6CC0` | Primary button, focus ring, chart series 1, progress fill |
| `--primary-hover` | `#4A56A8` | `#6570C2` | Primary button hover |
| `--primary-pressed` | `#404B95` | `#5662B3` | Primary button pressed |
| `--primary-text` | `#444F9C` | `#A9B2EC` | Links, selected nav text and icon |
| `--primary-text-hover` | `#363F80` | `#C3CAF2` | Link hover |

Use indigo for user actions: primary buttons (at most one per area), links, selection, focus, the first chart series.

### 2.4 Kepler violet (AI only)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--kepler-tint` | `#F3F0F8` | `#2A2438` | Kepler suggestion boxes, icon tiles, AI chips |
| `--kepler-subtle` | `#DCD3EC` | `#43395E` | AI highlight areas on charts |
| `--kepler` | `#7A64B8` | `#7360BA` | Buttons for AI-recommended actions |
| `--kepler-hover` | `#6E59AA` | `#7A67BF` | Hover |
| `--kepler-pressed` | `#614E99` | `#6654A8` | Pressed |
| `--kepler-text` | `#634E9E` | `#C4B7EE` | "Kepler suggests:" labels, sparkle icons |

Rules:
- **Kepler's icon is the moon** (`assets/kepler-icon.svg`). Use it everywhere Kepler appears (nav, panel headers, chips, AI action buttons, chart highlights, suggestion lines). Draw it inline with `stroke="currentColor"` so it takes the surrounding color. Never use a generic sparkle for Kepler.
- Violet appears **only** where Kepler speaks or acts. Never use it in charts or for decoration.
- **Kepler is advisory.** It never changes assignments or deadlines itself. Every Kepler action button opens the manager's own confirmation flow (reassign modal, deadline modal). There are no "Apply" or "Auto-fix" buttons.
- **Observed vs Predicted.** Every evidence line or answer from Kepler carries a small tag chip: *Observed* (`--bg-subtle` / `--text-secondary`) for facts from data, *Predicted* (`--kepler-tint` / `--kepler-text`) for forecasts, with a confidence level in the text ("Medium confidence").
- Kepler states which timeframe it used (e.g. "Based on workload trends · Last 8 weeks").
- The Kepler panel may use a 1px gradient border from `--kepler` to `--primary`. It's the **only** gradient in the product.
- Kepler content always ends with a suggested next step, and its buttons open the manager's flow ("Review reassignment", "Adjust deadline", "Ask Kepler").

### 2.5 Status

Always use status colors as a **tint background with dark text**, never as solid blocks.

| Status | Background | Text | Example |
|---|---|---|---|
| Success | `--success-bg` `#EAF2EA` / `#1F2B22` | `--success-text` `#3D6B47` / `#9CCBA6` | "On track", "Balanced", synced |
| Warning | `--warning-bg` `#FBF1DE` / `#2E2616` | `--warning-text` `#8A5A12` / `#E3BE78` | "At risk", "Near capacity" |
| Danger | `--danger-bg` `#F8E9E5` / `#33201C` | `--danger-text` `#9A3B2C` / `#EBA597` | "Delayed", "Overloaded", errors |
| Info | `--primary-tint` | `--primary-text` | "Available", neutral info |

Solid danger (`--danger`) is only for destructive buttons like "Remove".

### 2.6 Workload scale

The agreed utilisation bands (from the product spec) are **Low under 60%, Moderate 60–85%, High above 85%**.

| Band | Token | Light | Dark | Text on fill (light / dark) |
|---|---|---|---|---|
| Low, under 60% | `--load-under` | `#DCDFEE` | `#3A3F5C` | `#1F1C18` / `#F2EEE7` |
| Moderate, 60–85% | `--load-healthy` | `#9CC5A1` | `#6E9C76` | `#1F1C18` / `#171512` |
| High, above 85% | `--load-overloaded` | `#E19A8A` | `#B9705F` | `#1F1C18` / `#171512` |

Used for capacity bars on employee cards, the workload distribution chart and utilisation sparklines.

**Capacity utilisation** = assigned remaining effort ÷ available capacity × 100, over the next 2 weeks. Available capacity = working hours − meetings − leave − other responsibilities. It's a workload-planning measure, never a productivity score. Say so wherever it's first shown.

Employee status chips derived from the band: High → "High utilisation" (danger tint), Moderate → "Balanced" (success tint), Low → "Has capacity" (info tint).

### 2.7 Charts

Use series in this order: `--chart-1` (indigo), `--chart-2` (dusty blue), `--chart-3` (sage teal), `--chart-4` (sand). Show the comparison or previous period in `--chart-previous`. Prefer 1–2 series. On hover, fade the other bars or lines to 40% opacity.

---

## 3. Typography

**Font:** Open Sans (Google Fonts), weights 400, 500 and 600. Use 700 only for rare emphasis.

| Style | Class | Size / line height | Weight | Use |
|---|---|---|---|---|
| Display | `.text-display` | 24 / 40 | 600 | KPI numbers (vertically centered with their unit or delta) |
| H1 | `.text-h1` | 28 / 36 | 600 | Page title |
| H2 | `.text-h2` | 18 / 26 | 600 | Major section titles (Kepler insights) |
| H3 | `.text-h3` | 16 / 24 | 600 | Card titles, section headers |
| Body | `.text-body` | 14 / 22 | 400 | Default text, table cells, nav |
| Body medium | `.text-body-md` | 14 / 22 | 500 | Buttons, names, selected nav |
| Small | `.text-small` | 13 / 20 | 400 | Descriptions, evidence lists |
| Caption | `.text-caption` | 12 / 16 | 500 | Labels, chips, metadata |
| Overline | `.text-overline` | 11 / 16 | 600, uppercase, +0.06em | "Evidence", sector labels |

Rules:
- Use tabular numbers (`font-variant-numeric: tabular-nums`) for KPIs, percentages, dates and table figures.
- Large headings use −0.015em letter-spacing. Leave body text at 0.
- Use sentence case everywhere ("Team workload", not "Team Workload"). Uppercase is only for overlines.
- If something feels tight, reduce body text to 13px in that component (for example a dense table). Don't shrink everything.

---

## 4. Spacing

**4px base. Most values are multiples of 8.** Never use values outside the scale (no 10px, no 14px).

| Token | px | Use |
|---|---|---|
| `--space-0-5` | 2 | Focus ring gap |
| `--space-1` | 4 | Label ↔ value, icon ↔ tiny text |
| `--space-2` | 8 | Icon ↔ text, chips in a row, button groups, list items |
| `--space-3` | 12 | Small box padding, nav item padding, icon ↔ nav label |
| `--space-4` | 16 | Card ↔ card, blocks inside a card, section title ↔ content |
| `--space-5` | 20 | Card padding, table row outer sides |
| `--space-6` | 24 | Kepler panel padding, layout grid gutter |
| `--space-8` | 32 | Page side padding, section ↔ section |
| `--space-10` | 40 | Major breaks, empty states |
| `--space-12` | 48 | Page bottom padding |
| `--space-16` | 64 | Rare: hero areas, onboarding |

**Core rule:** space grows as things become less related.
Inside a component 4–8 → between blocks in a card 16 → between cards 16 → between sections 32.

### 4.1 Layout

| Area | Value |
|---|---|
| Design frame | 1280 × 960 app shell: the window never scrolls as a whole |
| Side panel | 216px wide, full height of the window, fixed (does not scroll with content); padding 20 × 10; background `--bg-sidebar`; right border `--border` |
| Main area | Fills the rest; **only this area scrolls vertically** (`overflow-y: auto`) |
| Header bar | 64px tall; padding 16 × 32; background `--bg-canvas`; bottom border `--border`; **sticky** at the top of the main area. Three-column grid `1fr · minmax(220px, 400px) · 1fr`: team selector (left), **global search** (center), then sync chip, refresh, theme toggle, **notification bell**, profile avatar (right). Under 900px the search wraps to its own full-width row. |
| Main content | padding 32 sides, 32 top, 48 bottom; max width 1240px |
| Grid | 12 columns, 24px gutter |
| Responsive | Under 760px the shell becomes a normal scrolling page: side panel stacks above content; card grids use `repeat(auto-fit, minmax(…, 1fr))`; wide tables scroll horizontally inside their card |

### 4.2 Radius

| Token | px | Use |
|---|---|---|
| `--radius-sm` | 8 | Buttons, inputs, nav items, icon tiles |
| `--radius-md` | 12 | Cards, inner boxes, table container |
| `--radius-lg` | 16 | Kepler panel, modals |
| `--radius-full` | 999 | Chips, avatars, progress bars, toggles |

An inner element's radius is always the same as or smaller than its container's.

### 4.3 Elevation
- Separate surfaces with borders and spacing, not shadows.
- Cards: `--shadow-card` (barely visible in light, none in dark).
- Popovers and menus only: `--shadow-popover`.
- In dark mode, depth comes from lightness: canvas → surface → subtle, each one step lighter.

---

## 5. Components

### 5.1 Buttons

| Type | Height | Padding | Default | Hover | Pressed |
|---|---|---|---|---|---|
| Primary | 36 | 0 × 16 | `--primary`, white text | `--primary-hover` | `--primary-pressed` |
| Kepler | 36 | 0 × 16 | `--kepler`, white text, sparkle icon | `--kepler-hover` | `--kepler-pressed` |
| Secondary | 36 | 0 × 16 | `--bg-surface`, 1px `--border-strong`, `--text-primary` | `--secondary-hover` | `--secondary-pressed` |
| Ghost | 36 | 0 × 12 | transparent, `--text-secondary` | `--ghost-hover`, `--text-primary` | `--ghost-pressed` |
| Danger | 36 | 0 × 16 | `--danger`, white text | `--danger-hover` | `--danger-pressed` |
| Small (any type) | 32 | 0 × 12 | 13px text | – | – |
| Icon button | 36 × 36 | – | `--bg-surface`, 1px `--border`, `--text-secondary` | `--secondary-hover` | `--secondary-pressed`, scale 0.96 |

- Text: 14px, weight 500. Icon ↔ text gap 8px, icons 16px.
- **Pressed:** scale 0.98 as well as the color change.
- **Focus (keyboard only):** 2px ring in `--focus-ring` with a 2px `--bg-canvas` gap. Kepler buttons use a `--kepler` ring; danger buttons use a `--danger` ring.
- **Disabled:** `--disabled-bg` fill, `--text-disabled` label, no hover. Always explain why in a tooltip.
- At most one primary button per area. Verb-first labels in 1–3 words ("Assign task", "Export report").

### 5.2 Side panel

Top to bottom:

1. **Logo:** the Orbit mark (28px, `assets/orbit-logo.svg`) + "Orbit" wordmark in Open Sans 20px, weight 400, −0.045em letter-spacing, 8px gap, row height 32, 6px side padding. Color `--brand-ink` (olive `#263321` in light, `#EDE9DF` in dark). Draw the mark inline with `stroke="currentColor"` so it follows the theme.
2. **Organisation switcher** (12px below the logo): full-width button, 32px tall, 8px padding, `--radius-sm`, background `--primary-tint` (hover `--primary-tint-hover`), text 13px weight 500 in `--primary-text`. Content: 8px green status dot (`--success-text`), "Apex Digital Solution" (truncate with ellipsis), 14px chevron.
3. **Navigation** (24px below), indented 16px from the switcher:
   - Label "Workspace": 14px, weight 400, `--text-primary`, 8px below it.
   - Items in order: Dashboard (house icon), Analytics (bar chart icon), My Team, Projects, Kepler AI (Kepler moon icon), Settings.
   - Item: 32px tall, 8px side padding, 8px icon ↔ label gap, 16px icons (1.5 stroke), 14px text, `--radius-sm`, 4px between items.

4. **Reminders** (fixed, not draggable): centered vertically in the space between the last nav item and the profile tab, at least 40px from each (auto top/bottom margins in a flex column, with 40px padding above and a 40px margin above the profile tab).
   - **Frosted glass card:** 14px radius, padding 12 × 8 × 8. Background is `--bg-surface` at about 42% opacity (`color-mix(in srgb, var(--bg-surface) 42%, transparent)`, 45% in dark) with `backdrop-filter: blur(14px) saturate(1.15)`. Border 1px `--bg-surface` at 75% (dark: `rgba(255,255,255,.08)`). Shadow `0 8px 24px rgba(31,28,24,.07)` plus a 1px inner top highlight (`inset 0 1px 0 rgba(255,255,255,.4)`; dark `.06`).
   - Header: "Reminders" (13px semibold) and a count chip (primary tint).
   - Items: a full-width button each, 6px padding, 28px tinted icon tile, title (13px medium, ellipsis) and time (12px muted). Hover is the surface color at 70%. A 1px `--border` divider sits between items, inset 6px from each side.
   - Sample items: "1:1 with Meera Pillai · Today 4:00 PM" (primary tint), "Sprint 14 review · Mon, Nov 24" (subtle), "Capacity plan due to founder · Wed, Nov 26" (warning tint).
5. **Profile tab** (bottom): full-width button, 8px padding, 10px radius, background `--primary-tint` (hover `--primary-tint-hover`). Contents: a 32px avatar in solid `--primary` with white initials "AM", "Alex Morgan" (14px medium, `--text-primary`), "Engineering lead" (12px, `--primary-text`) and an up/down chevron in `--primary-text`.

| State | Background | Text and icon | Weight |
|---|---|---|---|
| Default | none | `--text-secondary` | 400 |
| Hover | `--sidebar-hover` | `--text-primary` | 400 |
| Selected | `--primary-tint` | `--primary-text` | 400 |
| Selected + hover | `--primary-tint-hover` | `--primary-text` | 400 |
| Disabled | none | `--text-disabled` | 400 |

The selected item stays regular weight. Color and background carry the selection.

### 5.3 Inputs
- 36px tall, 12px side padding, `--bg-surface`, 1px `--border-strong`, `--radius-sm`.
- Hover: border `--input-border-hover`.
- Focus: border `--primary` and a 3px `--primary-subtle` glow.
- Error: border and helper text `--danger-text`.
- Disabled: `--disabled-bg`, border `--border`, `--text-disabled`.
- Placeholder: `--text-muted`, a realistic example ("Search people or tasks").

### 5.4 Cards
- `--bg-surface`, 1px `--border`, `--radius-md`, padding 20, inner gap 16.
- Hover (when clickable): border `--border-strong`.
- KPI card: label (13px `--text-secondary`) + 32px icon tile (`--bg-subtle`) → value (`.text-display`) → supporting line → footer (12px `--text-muted`).

### 5.5 Kepler panel
- Padding 24, `--radius-lg`, 1px gradient border (`--kepler` → `--primary`).
- Header: 40px icon tile (`--kepler-tint` background, `--kepler-text` sparkle) + H2 + chip ("2 need your attention").
- Insight card: priority chip + time → H3 title → description → Evidence box (`--bg-subtle`, overline label, 13px list) → "Impacted:" line → suggestion box (`--kepler-tint`, "Kepler suggests:" in `--kepler-text` 600) → Kepler button + secondary button.

### 5.6 Chips
24px tall, 12px side padding, `--radius-full`, 12px weight 500, optional 6px dot in the text color, 8px dot ↔ text gap.

### 5.7 Tables
- Wrapped in a card with `overflow: hidden`.
- Header row: `--bg-subtle`, caption style in `--text-muted`.
- Rows: 16px vertical padding, 20px outer sides, 12px between columns, 1px `--border` between rows, hover `--row-hover`.
- Avatars: 36px circle, `--bg-subtle` with `--text-secondary` initials.
- Capacity cell: percentage (16px, 600) + note (12px muted) above a 6px bar using the workload scale.

### 5.8 Tooltips
- Background `--text-primary`, text `--bg-canvas` (so they invert in dark mode), `--radius-sm`, padding 12 (8 × 12 for one-liners), 12/16 text, `--shadow-popover`. Fade in 350ms.
- **Line chart point:** "Week of Oct 19: 82%" + a one-line note on what happened that week.
- **Workload distribution segment:** title "Week of Sep 28 · High, above 85%", summary ("2 of 8 people (25%) with high utilisation"), each person in that band with their %, highest first, and a context line for the High band. The hovered segment gets a 2px `--text-primary` inset outline and the other weeks fade to 40%.

### 5.9 Interaction patterns

Follow the spec's rule: **expanders** for a quick look, **right-side drawers** for investigation (employee, project, alert, insight, Kepler chat), **modals** for decisions (reassign, adjust deadline). Anything that changes data needs manager confirmation.

**Priority alert card (Dashboard).** One card with the Kepler gradient border, collapsed by default. The header row is a single button: 40px Kepler icon tile (spinning), title "Kepler insights and priority alerts", subheading with the live count ("2 of 3 alerts need your attention"), severity count chips, and a chevron that rotates 180° (200ms). Expanded: one row per alert with severity chip, type and time, title, one-line summary, and the "Ask Kepler" (ghost, violet text) and "Investigate" (secondary) buttons. Handled alerts get an "Action taken" success chip.

**Severity:** Critical = danger tint, High = warning tint, Medium = neutral (`--bg-subtle`).

**Dashboard section order:** Team overview → Kepler insights and priority alerts → **Project health and deadlines → Team workload**. This is a deliberate change from the spec, which lists workload before projects.

**Employee card (Dashboard).** Card, 14px × 20px padding. **Hover:** a 4px `--border-strong` border drawn *inside* the card edge (`outline: 4px solid; outline-offset: -4px`), fading in over 150ms, so nothing shifts. **Row layout:** four fixed-width groups, evenly spaced with `justify-content: space-between` and at least 24px between them: avatar + name (220px), utilisation meter (200px), task count (92px), status + availability (170px). The chevron and Details button follow. The row is a button that toggles the inline expansion: 40px avatar, name and role, utilisation (16px semibold %, band label, "48h of 50h", 6px bar in band color), active task count, status chip and availability, chevron. "Details" (ghost) opens the employee drawer. Expanded area sits on `--bg-canvas` with a 5-column task grid: task and project, status chip, deadline (overdue in `--danger-text`, semibold), effort left, and "Reassign" and "Deadline" extra-small ghost buttons.

**Task status chips (small, 20px):** In progress = primary tint, In review = Kepler tint, To do = subtle, Blocked = danger tint, Done = success tint.

**Drawer.** Right side, 440px wide (full width on mobile), full height, `--bg-surface`, left border, soft left shadow, over a scrim (`rgba(31,28,24,.28)` light, `rgba(0,0,0,.5)` dark). The scrim is a real button that closes the drawer. Header 20 × 24 padding with title and close icon button, scrolling body (24px gaps between sections, overline section labels), optional footer with right-aligned actions. Enter: slide 24px + fade, 300ms `cubic-bezier(.2,0,0,1)`.

**Modal.** Centered, 560px wide, 16px radius, large soft shadow, same scrim. Enter: scale .97 → 1 + 6px rise, 220ms. Header / scrolling body / footer like the drawer. Steps live inside one modal: **select → confirm → processing → success | error**. Processing shows a 28px spinner and status text, and can't be closed. Success shows a 48px success circle, the outcome and a "Synced to Jira just now (simulated)" chip. Error shows a danger-tint box saying what happened and that nothing changed, with Cancel and "Try again".

**Reassign modal.** Task summary box (`--bg-subtle`): title, project, current assignee and utilisation, effort left, due date, required-skill chips. Search field (name, role, skill). **"Recommended · eligible"** group: rows on `--success-bg`. **"Other team members"**: plain rows. Each row is a selectable button with a radio, avatar, name, role · availability, "52% → 72%" projected utilisation (above 85% shown in `--danger-text`), and an eligibility chip ("Skills match", "Partial match: Node", "Missing Payments", "Would reach 108%", "On leave before deadline"). Eligibility = has a required skill AND projected utilisation ≤ 85% AND available before the deadline. Recommendations are sorted by full skill match, then lowest projected utilisation. Never recommend only on lowest utilisation. Continuing with no selection shows the inline validation message "Select a team member to continue." Picking a non-recommended person shows a warning-tint note on the confirm step, but the manager can still go ahead.

**Deadline modal.** Task summary, current deadline, native date input (min = today). Validation: empty, same date, or past date → inline danger message and red border. When a valid date is picked, show a *Predicted* impact note (e.g. effect on the next milestone).

**Kepler chat (drawer).** Header with the Kepler tile and "Answers use Orbit's data for this alert". Context card with a violet border showing what the conversation is about (alert or insight, with severity or period) and a link back to it. Messages: user = right-aligned `--primary-tint` bubble. Kepler = left-aligned `--bg-subtle` bubble with a small "Kepler" label, and each line shows its Observed/Predicted tag. Thinking state = three pulsing violet dots + "Kepler is checking the data…" (about 1s). Below: suggested-question chips (violet outline, removed once asked) and an input with a violet send button (Enter sends). Free-text questions get a grounded fallback that restates the context.

**Toast.** Bottom-right, inverted colors (`--text-primary` background), success icon, title + one line, auto-dismiss after 4.5s.

**Period selector (Analytics).** Each historical section has its own small secondary button with a calendar icon: "Last 8 weeks ▾". The menu has 4 / 8 / 12 weeks (checkmark on the current one) and "Custom range…", which reveals From/To date inputs and "Apply range". Validation: both dates required, end after start, at least 2 weeks, within the available data. There's no global period selector. Changing a period dims that section to 45% opacity for about 450ms (the loading state), then updates the charts and any Kepler text that depends on it.

**Chevrons on expanders** (alert card, employee cards, bottleneck rows): a 28px rounded-square hit area. When the parent row is hovered it fills with `--ghost-hover` and the icon turns `--text-primary`; pressed fills with `--ghost-pressed`. It rotates 180° when open.

**Chart inspection.** Line chart points show a tooltip (week, value, band and a note). Distribution segments show who is in the band. **Donut hover:** no size change and no glow. Instead, a 1px outline in a lighter shade of the same hue appears along the hovered segment's inner and outer edges (a 16px arc drawn behind the 14px arc). On-time: `#A3ABDD` light / `#A9B2EC` dark. Late: `#EDCBA9` light / `#F0D2B4` dark. The center label switches between on-time and late. Milestone bar segments list the delayed milestones.

**Bottleneck rows.** Each row is a full-width button that toggles inline details: what happens, affected teams and projects, delivery impact, occurrence dates in the period, and "Ask AI about this" (opens chat with that bottleneck as context).

### 5.10 Progress bars and toggles
- Progress: 6px tall, `--radius-full`, track `--bg-subtle`.
- Toggle / checkbox on: `--primary` (hover `--primary-hover`). Off: `--toggle-off` (hover `--toggle-off-hover`).

---

## 6. Motion

Quiet and quick. Nothing bounces.

| Interaction | Duration | Easing |
|---|---|---|
| Pressed | 80ms | `--ease-out` |
| Hover in / out | 120ms / 150ms | `--ease-out` |
| Focus ring | 100ms | `--ease-out` |
| Selected state (nav, tabs) | 200ms | `--ease-in-out` |
| Toggle knob | 180ms | `--ease-in-out` |
| Theme switch | 250ms | ease |
| Content entering (cards, toasts) | 350ms, fade + 4px rise | `--ease-out` |
| Charts drawing in | 600ms, staggered 40ms per bar | `--ease-out` |
| KPI numbers counting up | 800ms | `--ease-out` |

Signature moments:
- **Kepler moon spin (3D):** only on the **two main Kepler icons per screen**: the Kepler AI nav item and the main Kepler panel header icon. All other Kepler icons stay still.
  - Build: three stacked copies of the icon inside a `transform-style: preserve-3d` wrapper (perspective = 4 × icon size). Back copies sit at `translateZ(−0.1 × size)` with 25% opacity and `translateZ(−0.05 × size)` with 50% opacity. The front copy has a `currentColor` fill at 14% opacity inside the moon outline.
  - Loop (4.8s, infinite): `rotateX(12deg)` tilt throughout. rotateY 0 → 180° (0–35%), hold to 50%, 180 → 360° (50–85%), hold to 100%. Each turn uses `cubic-bezier(.65, 0, .35, 1)`.
  - No animation under `prefers-reduced-motion`.
- **Kepler "thinking":** a soft shimmer on the suggestion box for about 600ms, then text fades in line by line.
- **Rebalance:** when tasks are reassigned, the affected workload bars animate smoothly to their new values (500ms) and a confirmation replaces the action bar, with Undo.
- Respect `prefers-reduced-motion`. `tokens.css` already disables animation for those users.

---

## 7. Accessibility

- All text pairings meet WCAG AA (4.5:1 or higher) in both modes. Don't introduce new color pairings without checking contrast.
- Never rely on color alone: chips have text, bars have percentages, selected nav is also medium weight.
- Use real `<button>`, `<a>`, `<input>` and `<label>` elements. Icon-only buttons need `aria-label`.
- Touch targets are at least 36px (44px on mobile layouts).
- Focus rings show for keyboard focus only (`:focus-visible`).

---

## 8. Voice and copy

- Sentence case, plain words, verb-first buttons.
- Kepler speaks in short, specific sentences with evidence and a suggestion: "Move 2 backend tasks to Aman Verma. He's at 52% and has worked on the payment API before."
- Supportive, not judgmental: "Arjun is above his safe workload", not "Arjun is underperforming".
- No "successfully", no exclamation marks, no filler like "seamless" or "leverage".

---

## 9. Don'ts

- Don't hardcode hex values in components. Use tokens.
- Don't use violet outside Kepler features.
- Don't use solid red or green status blocks.
- Don't use pure white or black backgrounds.
- Don't add gradients (except the Kepler border), glows, glassmorphism or heavy shadows.
- Don't use spacing values outside the scale.
- Don't use more than one primary button in an area.
