# ORBIT
## Product Foundation & Interaction Specification
**Web3Task UI/UX Assignment | Master Product Document**

---

# 1. Product Overview

### Product definition

Orbit is an AI-powered Team Operations Platform designed for small software development agencies.

It gives functional team leads a consolidated view of their people, workload, available capacity, delivery progress and cross-team dependencies. This helps them allocate work more effectively, identify operational risks early and make informed management decisions.

Projects and tasks provide the operational context and data. Orbit complements existing project-management tools such as Jira and Linear; it is not intended to replace them or become a full task-management suite.

### Brand identity

- **Product name:** Orbit
- **AI assistant:** Kepler
- **Brand personality:** Calm, minimal, intelligent, clear and connected.
- **Product positioning:** An operational intelligence platform that helps teams understand their current situation and make better decisions.

# 2. Business Context

Orbit is designed around a hypothetical software development agency.

| Attribute | Working assumption |
|---|---|
| Business type | Software development agency |
| Team size | Approximately 25 employees |
| Projects | Custom web and mobile applications for external clients |
| Functional teams | Design, Engineering, QA and Project/Delivery |
| Work structure | Employees may contribute to multiple concurrent projects |
| Management structure | Founder/Managing Director overseeing functional team leads |

These are working assumptions for the assignment, not validated research findings.

# 3. Target Users

### Primary user — Functional Team Lead

A functional team lead manages a team while also contributing to project work.

Their responsibilities include:
- Understanding team workload and capacity.
- Allocating resources across concurrent projects.
- Monitoring delivery progress.
- Identifying overloaded or underutilised employees.
- Recognising project risks and cross-team blockers.
- Making decisions about resource allocation and deadlines.

### Secondary user — Founder / Managing Director

Needs an organisation-wide view of operational health, capacity constraints and delivery risks.

### Supporting users — Individual Contributors

Their assignments, task progress, availability and capacity information contribute to operational visibility.

### Proto-persona: Alex Morgan

A fictional functional team lead managing approximately 5–10 people.

Alex currently gathers updates from specialist tools, spreadsheets and manual communication. Alex needs a consolidated understanding of team workload and project progress to allocate work sustainably, meet commitments and identify issues early.

# 4. Problem Definition

### Core problem statement

Functional team leads at small software development agencies need a clearer and more timely understanding of team workload, capacity and delivery progress because operational information is fragmented across multiple sources.

Without that visibility, they may struggle to allocate work effectively and identify risks before they escalate.

### Key problem areas

1. **Operational visibility:** Fragmented information makes it difficult to understand workload, capacity and project progress.
2. **Workload allocation:** Limited visibility into available capacity makes sustainable resource distribution difficult.
3. **Reactive management:** Bottlenecks and delivery risks may only become visible after problems emerge.
4. **Cross-functional coordination:** Dependencies between teams can contribute to delays and coordination overhead.

### Causal hypothesis

Fragmented information → Limited visibility → Delayed decisions → Workload imbalance and/or delayed deliverables.

These are hypotheses to guide the assignment, not validated research conclusions.

# 5. Product Value

### Value for team leads

- Understand current workload, capacity and availability.
- Identify overloaded and underutilised employees.
- Review options for reallocating work.
- Understand project health, deadlines and cross-team blockers.
- Recognise recurring workload and delivery patterns.

### Value for the agency

- Improve resource allocation across concurrent projects.
- Reduce avoidable capacity conflicts and last-minute disruptions.
- Improve coordination between functional teams.
- Support more informed operational planning and predictable delivery.

# 6. Core Product Capabilities

1. **Team visibility:** Current team composition, workload, availability and operational status.
2. **Capacity management:** Compare available work capacity with assigned remaining effort.
3. **Delivery visibility:** Use task status, deadlines, milestones, dependencies and blockers to understand progress and project health.
4. **Historical analytics:** Identify workload, delivery and bottleneck patterns over time.
5. **AI assistance:** Surface meaningful signals, explain evidence, recommend actions and answer contextual questions.
6. **Manager-controlled actions:** Allow authorised managers to reassign tasks and adjust deadlines, subject to confirmation.

### Capacity utilisation

Capacity utilisation is calculated as:

Assigned remaining effort ÷ Available work capacity × 100.

Available capacity accounts for working hours after meetings, leave and other responsibilities.

Capacity utilisation is a workload-planning measure, not a productivity score.

# 7. Kepler — AI Assistant

Kepler is Orbit's AI assistant. It serves two connected purposes:

### Proactive intelligence

Kepler analyses operational information to identify:
- Workload imbalances.
- Capacity conflicts.
- Potential delivery risks.
- Significant cross-team blockers.
- Historical workload and delivery patterns.

### Conversational assistance

Team leads can ask follow-up questions, investigate insights and understand the evidence behind recommendations.

### AI behaviour principles

- Recommendations must be grounded in available operational data.
- Kepler must distinguish observed facts from predictions.
- Relevant evidence should be visible.
- Recommendations remain advisory.
- Managers make the final decisions.
- Kepler must retain context when a user starts a conversation from a specific alert or insight.
- Kepler must not autonomously change task assignments or deadlines.

# 8. Product Scope and Boundaries

Orbit is not:
- A full HRMS: payroll, recruitment, attendance and employee administration are outside scope.
- A full project-management suite: detailed task execution remains in Jira/Linear.
- An employee surveillance platform.
- An individual productivity-ranking system.

The prototype should focus on the two required screens: Dashboard and Analytics.

---

# 9. Dashboard — Information Architecture

**Primary question:** What is happening with my team, and what needs my attention?

### Header

- Dashboard title and description.
- Team selector.
- Last-sync status.
- User profile.
- No reporting-period selector.

### Section 1 — Team Overview

Team-level KPI cards:
- Team size.
- Overall capacity utilisation.
- Active task count.
- Overdue/blocked task count.

### Section 2 — AI Insights & Priority Alerts

One compact, expandable priority-alert card.

**Collapsed state:**
- Section heading.
- Short subheading.
- Alert count.
- Expand/collapse affordance.

**Expanded state:**
- Critical workload conflicts.
- Potential delivery risks.
- Significant cross-team blockers.
- Supporting evidence.
- Recommended action.

The default state should be compact, not a fully expanded list of alerts.

### Section 3 — Team Workload

A vertical stack of employee cards.

Each card displays:
- Avatar and name.
- Role.
- Capacity utilisation.
- Active task count.
- Availability/workload status.

Expanding an employee card reveals:
- Assigned tasks.
- Task status.
- Deadlines.
- Remaining effort.

### Section 4 — Project Health & Deadlines

Display all active projects, not only projects at risk.

Each project should show:
- Project name.
- Progress percentage.
- Separate project health status.
- Next milestone/deadline.
- Evidence-based risk explanation.

Project progress and project health must remain separate measures.

### Cross-team dependencies

Display dependencies contextually within relevant AI alerts and project details. Do not create a separate Dashboard section for them.

---

# 10. Dashboard — Detailed Interaction Specification

## D-01: Expand Employee Card

**Purpose:** Allow team leads to inspect an employee's assigned work without navigating away from the Dashboard.

**Trigger:** User clicks an employee card or its expand control.

**Behaviour:**
1. Employee card expands inline.
2. Additional task information becomes visible.
3. Display assigned tasks, task status, deadlines and remaining effort.
4. User can collapse the card to return to the compact state.

**Interaction pattern:** Inline expansion.

## D-02: View Employee Details

**Purpose:** Provide a deeper view of an employee's current workload and capacity.

**Trigger:** User selects an employee's details or a relevant detail affordance.

**Behaviour:**
1. Open a right-side drawer.
2. Display employee name, role and relevant team information.
3. Show capacity and availability.
4. Show assigned work and workload information.
5. Allow the user to close the drawer and return to the Dashboard.

**Interaction pattern:** Right-side drawer.

## D-03: Reassign Task

**Purpose:** Help a team lead identify a suitable employee for an existing task.

**Trigger:** User selects the reassignment action from a task or employee context.

**Behaviour:**
1. Open a focused reassignment modal.
2. Show the task being reassigned.
3. Display available team members in a selectable list.
4. Group the list into two categories:

**Recommended — Eligible**
- Display suitable employees first.
- Use a subtle green background to distinguish recommendations.
- Show name, role and current utilisation.
- Show projected utilisation after reassignment.
- Show availability.

**Other team members**
- Display remaining team members below.
- Include eligibility and availability labels.
- Allow the manager to inspect alternatives.

5. Provide employee search.
6. Allow the manager to select a proposed assignee.

**Recommendation logic:**

Eligibility should consider:
- Task requirements.
- Employee role.
- Relevant skills.
- Available capacity.
- Current availability.

Do not recommend someone solely because they have the lowest utilisation.

## D-04: Confirm Reassignment

**Purpose:** Ensure that task reassignment is an intentional manager-approved action.

**Trigger:** Manager selects a proposed assignee and proceeds.

**Behaviour:**
1. Display a confirmation view.
2. Show task name.
3. Show current assignee.
4. Show proposed assignee.
5. Provide Confirm and Cancel actions.

**Confirmation flow:**

- Confirm → Show processing state.
- Successful action → Show success feedback.
- Failed action → Show error feedback and allow retry.
- Cancel → Close or return to the selection state without changing the assignment.

**After successful reassignment:**
- Update the task's assignee in prototype data.
- Update relevant employee workload information.
- Update task counts and utilisation where supported by the mock data.
- Simulate a Jira/Linear sync.

Do not imply that a real Jira or Linear integration exists in the prototype.

## D-05: Adjust Deadline

**Purpose:** Allow a team lead to change a task deadline when operational circumstances require it.

**Trigger:** User selects the deadline-adjustment action.

**Behaviour:**
1. Open a focused modal.
2. Display the task and its current deadline.
3. Provide a date picker.
4. Allow the manager to select a new deadline.
5. Provide Confirm and Cancel actions.

**Confirmation flow:**
- Confirm → Show processing state.
- Success → Update the mock deadline and show feedback.
- Error → Show an error state.
- Cancel → Close without changing the deadline.

**After successful change:**
- Update the task deadline in mock data.
- Reflect the change in relevant task/project information.
- Simulate a Jira/Linear sync.

Manager confirmation is mandatory.

## D-06: Investigate AI Alert

**Purpose:** Allow the team lead to understand why Kepler has surfaced an operational alert.

**Trigger:** User expands the priority-alert card or selects an individual alert.

**Behaviour:**
1. Open a right-side drawer.
2. Display alert title and severity.
3. Explain what was detected.
4. Show supporting evidence.
5. Identify impacted employees and/or projects.
6. Explain the potential operational impact.
7. Display Kepler's recommended action.

**Important:** Clearly distinguish observed information from predicted risks.

## D-07: Ask Kepler About an Alert

**Purpose:** Allow the user to investigate an alert through a contextual conversation.

**Trigger:** User selects Ask Kepler or a contextual follow-up action from an alert.

**Behaviour:**
1. Open the contextual conversation interface.
2. Pass the selected alert and its information into the conversation.
3. Display the alert context to the user.
4. Allow the user to enter follow-up questions.
5. Display Kepler's responses.
6. Preserve the context of the selected alert during follow-up questions.

**Prototype behaviour:**

Use mock responses grounded in the prototype's operational data. Kepler should not behave like a disconnected generic chatbot.

## D-08: View Project Details

**Purpose:** Help team leads investigate project progress, health and dependencies.

**Trigger:** User selects a project or its details affordance.

**Behaviour:**
1. Open a right-side drawer.
2. Display project name.
3. Show progress percentage.
4. Show project health status separately.
5. Display next milestone and deadline.
6. Show relevant blockers.
7. Show cross-team dependencies.
8. Include evidence behind any project risk explanation.

**Interaction pattern:** Right-side drawer.

---

# 11. General Dashboard Interaction Rules

### Expanders
Used for quick access to additional information without leaving the current page.

### Right-side drawers
Used for deeper investigation of:
- Employees.
- Projects.
- AI alerts.

### Modals
Used for focused decisions and actions:
- Task reassignment.
- Deadline changes.

### Confirmation
Any action that changes operational information must require manager confirmation.

### Feedback states

The prototype should support relevant states such as:
- Default/closed.
- Expanded/open.
- Loading.
- Content visible.
- Selection.
- Validation.
- Confirmation.
- Processing.
- Success.
- Error.
- Cancelled.

### Data consistency

When an action succeeds, the relevant mock data should update so that the Dashboard reflects the change. For example, reassignment should update the task's assignee and corresponding workload information where supported.

---

# 12. Analytics — Information Architecture

**Primary question:** What patterns in my team's workload and project delivery should I pay attention to?

### Header

- Analytics title and description.
- Team selector.
- Last-sync status.
- User profile.
- No global reporting-period selector.

### Section 1 — Performance Overview

Historical-period KPI summary:
- Average team utilisation.
- Tasks completed.
- On-time delivery.
- Overdue tasks.

Include previous-period comparisons.

### Section 2 — AI Analysis & Recommendations

A compact panel immediately after the overview, approximately one-third of the content width.

Display:
- One prominent insight.
- Why it matters.
- Supporting evidence.
- Suggested action.
- Explore Insight.
- Ask AI.

### Section 3 — Workload & Capacity Trends

Two historical visualisations:

**A. Team Utilisation Trend**
- Line chart.
- Average team capacity utilisation over time.

**B. Workload Distribution**
- 100% stacked bar chart.
- Percentage of employees in low, moderate and high utilisation bands for each period.

Agreed utilisation bands:
- Low: below 60%.
- Moderate: 60–85%.
- High: above 85%.

Workload Distribution represents the share of employees in each band, not the share of tasks or hours.

### Section 4 — Delivery Performance

Exactly two visualisations:

**A. On-time vs Delayed Delivery**
- Donut chart.
- Completed tasks only.
- Compares completed tasks delivered on time against completed tasks delivered late.

**B. Project Milestone Performance**
- Compares on-time and delayed milestones.

Do not add a weekly task-completion trend chart.

Unfinished overdue tasks should not be counted as completed-late tasks.

### Section 5 — Bottlenecks & Dependencies

Historical analysis of:
- Recurring issues.
- Cross-team handoff delays.
- Dependency frequency.
- Affected projects.
- Delivery impact.

# 13. Analytics — Controls and Interpretation

### Reporting-period controls

- Place period selectors within the historical sections that need them.
- Do not use a global reporting-period selector.
- Each section maintains its own selected period.
- Suitable options include 4 weeks, 8 weeks, 12 weeks and custom range.

### Chart interpretation

- Team Utilisation Trend shows average team capacity utilisation over time.
- Workload Distribution shows how utilisation is spread across employees.
- These measures complement each other and are not duplicates.
- Delivery analysis uses agreed deadline periods.
- A reporting week is a grouping interval, not an assumption that tasks have weekly assignments or deadlines.
- Current overdue-work monitoring belongs on the Dashboard.
- Analytics focuses on historical patterns and recurring issues.
- AI analysis should use the relevant section's timeframe or clearly state the period used.

# 14. Analytics — Interaction Requirements

The following interactions are derived from the Analytics information architecture. They are implementation requirements for the prototype, rather than a separately approved detailed Analytics interaction log.

### A. Reporting-period selection

**Trigger:** User selects a period dropdown within a historical section.

**Behaviour:**
1. Open the available period options.
2. Allow selection of 4 weeks, 8 weeks, 12 weeks or custom range where appropriate.
3. Update the selected section's displayed period.
4. Update the relevant charts and supporting insight content.
5. Preserve independent period selections across sections.

### B. Chart inspection

**Trigger:** User hovers over or selects a chart data point or segment.

**Expected behaviour:**
- Display the relevant value and period.
- Provide contextual labels.
- For the Workload Distribution chart, identify the utilisation band.
- For delivery charts, distinguish on-time and delayed outcomes.

Tooltips and chart inspection are prototype usability requirements; the precise visual treatment can be determined during implementation.

### C. Explore Insight

**Trigger:** User selects Explore Insight in the AI Analysis & Recommendations panel.

**Expected behaviour:**
- Open a deeper insight view.
- Explain the detected pattern.
- Display supporting figures and relevant timeframe.
- Explain why the pattern matters.
- Show the suggested action.

The deeper view can use a drawer or an expanded panel, provided it remains consistent with the visual system.

### D. Ask AI

**Trigger:** User selects Ask AI.

**Expected behaviour:**
- Open Kepler's conversation interface.
- Pass the currently displayed insight and its timeframe as context.
- Allow follow-up questions.
- Display responses grounded in the available mock analytics data.

### E. Bottleneck inspection

**Trigger:** User selects a bottleneck or dependency item.

**Expected behaviour:**
- Reveal the relevant issue.
- Show affected projects and teams.
- Explain the dependency or handoff.
- Show the historical timeframe and delivery impact where available.

The exact interaction layout can be determined during implementation.

---

# 15. Prototype Data and Behaviour

The prototype should use a consistent mock dataset across Dashboard and Analytics.

### Data entities

- Teams.
- Employees.
- Projects.
- Tasks.
- Milestones.
- Dependencies.
- Availability.
- Capacity.
- AI alerts and insights.

### Data relationships

- Employees belong to functional teams.
- Employees can work across multiple projects.
- Projects contain tasks and milestones.
- Tasks have assignees, statuses, deadlines and remaining effort.
- Dependencies can connect work across teams.
- Capacity is influenced by working hours, meetings, leave and other responsibilities.

### Prototype interaction expectations

- Actions should produce visible outcomes.
- Reassignment should update the relevant mock data.
- Deadline changes should update the relevant mock data.
- Drawers and modals should open and close correctly.
- Expandable cards should behave consistently.
- Kepler should retain relevant context.
- Analytics controls should update the relevant visualisations or mock states.
- Success, error and loading states should be represented where applicable.

The prototype does not need real Jira/Linear integrations or a production AI backend. Simulated interactions and data are acceptable, provided the behaviour is coherent and believable.

# 16. Design and Product Principles

1. Separate current-state monitoring from historical analysis.
2. Show team-level signals without hiding individual workload imbalance.
3. Allow drill-down when a manager needs more detail.
4. Treat project progress and project health as separate measures.
5. Support health labels with evidence such as schedule, milestones, blockers, dependencies and capacity.
6. Do not infer productivity from activity surveillance.
7. Avoid employee rankings, productivity scores and performance judgements.
8. AI must distinguish observed facts from predictions.
9. AI recommendations must be explainable and advisory.
10. Managers retain control over operational decisions.
11. Respect role-based access and permissions.
12. Prioritise clarity and useful operational decisions over feature breadth.

# 17. Development Priorities

### Priority 1 — Foundation
- Set up the application.
- Establish design tokens and shared components.
- Implement navigation and page structure.
- Establish consistent mock data.

### Priority 2 — Dashboard
- Build the complete Dashboard layout.
- Implement employee-card expansion.
- Implement employee and project drawers.
- Implement AI alert expansion and investigation.
- Implement reassignment and deadline workflows.
- Implement contextual Kepler interaction.

### Priority 3 — Analytics
- Build the Analytics layout.
- Implement historical KPI cards and charts.
- Implement independent period selectors.
- Implement chart inspection.
- Implement Explore Insight and Ask AI.
- Implement bottleneck inspection.

### Priority 4 — Refinement
- Ensure consistent light and dark themes.
- Add meaningful loading, success and error states.
- Refine transitions and micro-interactions.
- Check responsiveness and usability.
- Test all interaction paths and data updates.

---

# 18. Source of Truth and Decision Boundaries

This document consolidates the established Orbit product foundation and the previously agreed Dashboard interaction decisions.

**Established product decisions**
- Product definition, users, problem, value and scope.
- Dashboard and Analytics information architecture.
- Dashboard interaction patterns and D-01 to D-08 workflows.
- Capacity and analytics interpretation rules.
- Kepler's role and AI behaviour principles.

**Prototype implementation requirements**
- Detailed visual states for interactions.
- Consistent mock-data updates.
- Analytics chart tooltips and inspection.
- Analytics insight drawers or expanded views.
- Loading, success, error and cancellation feedback.
- Simulated integrations and contextual AI responses.

Implementation details should support the established product decisions. They should not introduce unrelated features or change the agreed information architecture.

**End of master specification.**