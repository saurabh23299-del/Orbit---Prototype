# Start here

This folder is a ready-to-use starter for building the Orbit prototype with Claude Code.

## What's inside

| Path | What it is |
|---|---|
| `CLAUDE.md` | Instructions Claude Code reads automatically every session |
| `docs/PRODUCT_SPEC.md` | The master product and interaction spec |
| `design/DESIGN.md` | The style guide (colors, type, spacing, components, states, motion) |
| `design/tokens.css` | All design values as CSS variables, light and dark |
| `design/reference/screens/` | The 22 finished screens and states from the design canvas (reference only, not runnable) |
| `design/reference/mock-data.js` | The consistent mock dataset to port |
| `assets/` | Orbit logo and Kepler icon |

## Steps

1. Install Node.js (LTS) and Claude Code if you haven't (see docs.claude.com).
2. Open a terminal in this folder and run `claude`.
3. Send these prompts **one at a time**, and check the app after each:
   1. Read CLAUDE.md, docs/PRODUCT_SPEC.md and design/DESIGN.md. Then do Priority 1: set up the app, tokens, fonts, app shell (side panel with logo, nav, reminders and profile tab; header with team selector, search, bell, profile), theme toggle, ported mock data, and base components with a /components preview page.
   2. Build the Dashboard layout to match design/reference/screens/Main.dc.html (light) and Dark.dc.html (dark).
   3. Add D-01 (employee card expand), D-02 (employee drawer) and D-08 (project drawer).
   4. Add the alert card, D-06 (alert drawer) and D-07 (contextual Kepler chat).
   5. Add D-03 and D-04 (reassignment with every state and data update), then D-05 (deadline).
   6. Build Analytics to match Analytics.dc.html, with interactions A–E.
   7. Priority 4: theme parity, loading, success and error states, keyboard and focus, responsiveness. Test every path.
4. When something looks off, drag a screenshot from the design canvas into the terminal and say "match this".
5. To share it, ask Claude Code to deploy to Vercel, then record a short walkthrough of the interactions.
