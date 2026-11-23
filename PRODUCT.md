# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**In-product user: functional team lead.** Proto-persona Alex Morgan, Engineering team lead at Apex Digital Solution, a software development agency of about 25 people with four functional teams: Design, Engineering, QA and Project/Delivery. Alex leads 8 engineers and also does project work. Today Alex pieces together workload and delivery status from Jira/Linear, spreadsheets and manual check-ins. In Orbit, Alex's job is to answer two questions: "what needs my attention right now?" (Dashboard) and "what patterns should I pay attention to?" (Analytics). Alex then acts on the answers by reassigning tasks or adjusting deadlines.

Secondary in-product user: the founder or managing director, who wants an organisation-wide view of operational health. Individual contributors supply the data but are not the audience.

**Evaluators of the prototype** (confirmed):
- Web3Task UI/UX assignment reviewers.
- Portfolio and case-study viewers, such as hiring managers and design leads.
- Real team leads, the kind of people who would use a tool like this.
- Senior product designers with 20+ years of experience.

This group spots generic dashboard patterns, inconsistent states, weak empty, error and loading handling, and motion added for show. The prototype has to hold up when experts look closely.

## Product Purpose

Orbit is an AI-powered team operations platform for small software agencies. It gives functional team leads one view of their people, workload, capacity, delivery progress and cross-team dependencies. With that view they can allocate work sustainably and spot risks before they escalate. Orbit sits alongside Jira and Linear. It does not replace them and is not a task manager.

Kepler, the AI assistant, raises workload imbalances, capacity conflicts, delivery risks and blockers. It explains the evidence, recommends actions and answers follow-up questions in context.

The prototype succeeds when it looks and behaves like a real, polished product: the Dashboard and Analytics both work, every specified interaction path completes end to end, data updates stay consistent across views, and both themes are at full quality.

## Positioning

Kepler is an advisory layer built into the team lead's own workflow, not a chatbot added on top. Every Kepler statement is tagged **Observed** or **Predicted** (with a confidence level) and shows its evidence. Kepler never changes assignments or deadlines itself; every change goes through the manager's confirmation flow. Utilisation is framed only as a workload-planning measure, never as productivity, which sets Orbit apart from employee-surveillance and ranking tools.

## Operating Context

- Two screens only: **Dashboard** for current state and **Analytics** for historical patterns. The full IA and interactions D-01 to D-08 and A to E are in `docs/PRODUCT_SPEC.md`.
- Approved deviations from the spec: the Dashboard shows project health before team workload. The app shell adds a global search, a notification bell, a reminders card and a profile tab. These can be visual-only.
- Drill-down patterns: inline expanders for quick detail, right-side drawers for investigation (employees, projects, alerts, insights), and modals for decisions (reassign, adjust deadline).
- The Jira/Linear sync is simulated and labelled as simulated. No real integration is implied.
- Desktop app shell at 1280 × 960. Below 760px it becomes a stacked page. Light and dark themes.
- Sharing: local for now. A Vercel config is in the repo, but no deployment is committed.

## Capabilities and Constraints

- Utilisation = assigned remaining effort ÷ available capacity × 100. Bands: Low under 60%, Moderate 60–85%, High above 85%.
- Every data-changing action requires confirmation and then shows processing, success, or error with retry, plus a cancel path. On success the mock data updates everywhere: assignee, utilisation, task counts, KPIs, alert status, deadlines and overdue counts.
- Reassignment recommendations consider role, skills, capacity and availability, never lowest utilisation alone.
- Kepler keeps context when chat is opened from an alert, insight or bottleneck, and answers from the mock data.
- Analytics: no global period selector. Each section has its own (4, 8 or 12 weeks, or a custom range), held independently. The delivery donut counts completed tasks only. Exactly two delivery charts. No weekly completion trend.
- Project progress and project health are always separate measures.
- Out of scope: HRMS functions, full project management, surveillance and productivity rankings.
- Stack in place: React 18 + Vite + TypeScript, CSS Modules, `motion`, Zustand, react-router. Charts are hand-built SVG.
- Work priority (confirmed): **craft beyond the references.** The `.dc.html` reference screens and `design/DESIGN.md` are a strong baseline, not a ceiling. Improvements to interaction quality and detail are welcome as long as every spec rule above holds.

## Brand Commitments

- Names: **Orbit** (product) and **Kepler** (AI assistant). Agency: Apex Digital Solution. User: Alex Morgan.
- Personality: calm, minimal, intelligent, clear, connected, human. Brand promise: "Better visibility. Smarter decisions."
- Voice: sentence case, plain words, verb-first buttons. Supportive, not judgmental ("high utilisation", not "overworked"). No "successfully", no exclamation marks, no filler. Kepler uses short, specific sentences with evidence and a suggestion.
- Assets: `assets/orbit-logo.svg` and `assets/kepler-icon.svg`, rendered inline with `currentColor`.
- Visual system: owned by `design/DESIGN.md` and `design/tokens.css`. It is not restated here.

## Evidence on Hand

- `docs/PRODUCT_SPEC.md`: master product and interaction spec.
- `design/reference/screens/*.dc.html`: 22 finished reference screens and states.
- `design/reference/mock-data.js`, ported in `src/data/`: a fictional but internally consistent dataset (employees, tasks, projects, alerts, Kepler Q&A, analytics history, bottlenecks).
- `screenshots/`: captures of the current build, Dashboard and Analytics in both themes.
- The business context and persona are working assumptions, not research findings. Do not fabricate user research, testimonials, metrics or customer claims.

## Product Principles

1. **Manager in control.** AI advises and the human decides. Every change is explicit, confirmed and reversible in feedback.
2. **Evidence before assertion.** Every signal, health label and recommendation shows why. Observed and Predicted are never blurred.
3. **Humane workload framing.** Show imbalance without judging people. No rankings, scores or alarm language about individuals.
4. **Current vs historical, kept apart.** The Dashboard answers "now"; Analytics answers "over time". Neither borrows the other's job.
5. **Expert-grade craft.** Every state, transition and edge case is designed, because the audience includes senior designers who will notice.

## Accessibility & Inclusion

WCAG 2.1 AA contrast in both themes. Real buttons and links. `aria-expanded` on expanders. `role="dialog"` and `aria-modal` on drawers and modals. Labelled inputs. Esc closes overlays and focus returns to the trigger. Focus rings use `:focus-visible`. Color is never the only signal. Respect `prefers-reduced-motion`.
