# ByteForm pricing and creation preview

Status: approved for implementation. Pricing buttons only enter the new preview flow.

## Objective and agreed scope

Add a pricing section to the guest landing page and a dedicated prototype journey:

**Choose a plan → Describe the form and choose its format → Animated preparation → Success placeholder**

Keep the prompt and format selection on one screen. No account or payment step is needed for this prototype.

The new journey applies **only to pricing-plan buttons**. Preserve the current hero prompt, existing “Start now” links, `/new`, and the working builder flow. The existing `/new` route can create a database record for signed-in users; do not route the prototype through it. Once real generation is implemented, unifying entry points can be considered in a separate change.

This task implements the UI and a local simulation. It does not implement AI generation, voice recording, subscriptions, payments, actual collaboration, or backend plan enforcement. Collaboration and plan capabilities below are the agreed proposed product packaging, not a claim that these services are operational today. Make the preview status visible.

## Repository and design requirements

- Read `AGENTS.md` and `design.md` before implementation. Follow the installed guides in `node_modules/next/dist/docs/` for relevant Next.js behavior.
- The landing composition currently lives in `src/features/builder/components/GuestHomePage.tsx`; its styling and interactive leaves are in the adjacent `landing/` directory.
- Preserve the implemented hero, demonstrations, customer placeholders, journal, existing interactions, and unrelated product screens.
- Use ByteForm’s Geist typography, paper background, dark wine palette, existing logo, level surfaces, rounded geometry, and existing Lucide icons.
- Do not add small labels above section/page headings. Functional step indicators and status text are allowed.
- Use CSS Modules or Tailwind; no inline styles and no additional design system. Use existing dependencies before considering new ones.
- Keep server-rendered composition separate from focused client-side interaction and state modules. Use a dedicated feature module for the new journey instead of expanding the builder shell.
- Update `design.md` narrowly to record the pricing CTA destination and the explicitly disclosed generation/voice simulation. Keep voice marked coming soon and preserve all unrelated design rules.

## Reference research and design direction

Borrow structural patterns, adapted to ByteForm’s identity:

- [Typeform pricing](https://www.typeform.com/pricing): billing toggle, prominent monthly-equivalent pricing, concise tier comparisons, clear actions.
- [Fillout pricing](https://www.fillout.com/pricing): straightforward feature comparison and a clear distinction between monthly payment and annual commitment.
- [Typeform’s documented AI creation flow](https://help.typeform.com/hc/en-us/articles/42053773420948-Use-Typeform-AI): begin with a prompt explaining the form’s goal.
- [Nielsen Norman Group on progress indicators](https://www.nngroup.com/articles/progress-indicators/): acknowledge submission immediately and communicate process state.

Research used public pricing content and product documentation. Live browser inspection was unavailable during planning; inspect the implementation visually when browser tooling is available.

## Landing-page pricing section

### Placement and layout

- Insert the section after “How it works,” before the journal.
- Add a “Pricing” navigation anchor pointing to `#pricing`.
- Heading: **“Choose your plan.”** No label above it.
- Three aligned columns on desktop; stack Classic, Pro, and Team on mobile.
- Give Pro a restrained wine outline and “Recommended” text. Do not claim “Most popular.”
- Use a keyboard-accessible **Monthly / Annually** selector, defaulting to **Monthly**. Annual option includes **“Save up to 21%.”**
- Keep the per-month figure prominent in both states. When annually selected, show the total charged yearly immediately underneath.
- Avoid layout shifts when changing billing intervals. Keep card actions aligned on desktop.

### Prices in USD

| Plan | Monthly selected | Annually selected | Annual billing detail |
| --- | --- | --- | --- |
| Classic | $12/month | $9.99/month | $119.88 billed annually |
| Pro | $24/month | $19/month | $228 billed annually |
| Team | $59/month | $49/month | $588 billed annually |

These annual prices replace the earlier “two months free” proposal. Do not use the superseded $8.33/$15.83/$40.83 annual equivalents or “two months free” copy. Prices are per subscription, not per seat.

### Copy and proposed packaging

- **Classic:** “Classic forms with custom branding.”
- **Pro:** “More ways to ask, with chat and voice.”
- **Team:** “Separate workspaces and more control for your team.”

Use **“Custom branding”**, never “Remove ByteForm branding,” in the pricing copy.

| Capability | Classic | Pro | Team |
| --- | --- | --- | --- |
| Formats | Classic | Classic, chat, voice | Classic, chat, voice |
| Monthly standard responses | 5,000 | 25,000 | 100,000 |
| Members, including owner | 3 | Unlimited | Unlimited |
| Workspaces | 1 | 1 | 5 |
| Custom domains | Not included | 1 | 5 |
| Team access | Shared editing and results | Shared editing and results | Workspace/form permissions; admin/editor/viewer roles; activity history |
| Forms and questions | Unlimited | Unlimited | Unlimited |
| Custom branding | Included | Included | Included |
| Analytics, drop-off reporting, CSV/XLSX exports | Included | Included | Included |
| Support | Standard email | Standard email | Priority email |

Keep cards concise, approximately six feature lines each. Place remaining details in an accessible “Compare all features” disclosure with a semantic comparison table. On narrow screens, allow the table to scroll inside its own labeled container rather than overflowing the page.

A workspace is a separate area for forms, responses, and collaborators; explain this briefly in comparison help text. Seats count people. Do not add a workspace-management feature in this task.

Each card uses **“Start now”**, with a distinct accessible name identifying its plan. Clicking it carries the selected plan and billing interval into the preview journey.

Below the cards, explain that plan selection is a preview and creates no subscription or payment. Voice remains visibly **“Coming soon.”** Indicate that advanced/proposed features are part of the plan preview rather than currently provisioned entitlements. Do not invent voice-minute allowances; provider economics have not been validated. Standard-response limits do not imply unlimited AI/voice processing.

## Creation journey

### Entry and shell

Pricing buttons navigate to:

`/start?plan=classic|pro|team&billing=monthly|annual`

- Use a focused paper canvas, existing wordmark, back-to-pricing link, and compact selected-plan summary.
- Avoid the landing page’s full navigation. Keep the selected plan, interval, monthly price, and annual total where applicable visible without overwhelming the prompt.
- Show **Describe → Preview → Done** as a functional step indicator, with the current step exposed accessibly.
- The route is public and works for both guests and signed-in users, without account creation or subscription activation.

### Describe screen

- Heading: **“What is your form about?”**
- Provide a labeled textarea with a 1,000-character maximum.
- Supporting text: **“Tell us who it’s for and what you want to learn.”**
- Example placeholder: **“Collect feedback from customers after their first purchase.”**
- Beneath it, center a **Classic / Chat / Voice** radio group. Explain these describe how respondents answer, not how the creator enters their prompt.
- Classic plan defaults to Classic. Pro and Team default to Chat.
- On Classic, show Chat and Voice as unavailable, with visible **“Included in Pro and Team”** explanations and a working **“Change plan”** control. Do not hide the alternatives or make the restriction color-only.
- On Pro and Team, Voice is selectable for this simulation, labeled **“Coming soon · preview only.”** Do not request microphone permission or record audio.
- “Change plan” opens a compact selector built from the same plan and billing data. Preserve the prompt. Switching to Classic resets the format to Classic and announces the change. Preserve an allowed current format when switching to Pro or Team.
- Primary action: **“Preview creation.”** Reject empty or whitespace-only input with an inline error and focus on the textarea. Allow normal multiline text input; do not hijack Enter to submit.
- Before submission, show: **“This preview simulates form creation. It won’t generate or save a form.”**

### Animated preparation

Immediately replace the input area with a stable progress panel after valid submission. Run these three stages, approximately 1.5 seconds each:

1. **“Understanding your brief”**
2. **“Creating your questions”**
3. **“Tailoring your classic/chat/voice form”** — substitute the chosen format.

- Keep **“Simulated preview”** visible throughout; these labels describe a simulation, not completed backend work.
- Show completed-stage checks and a restrained progress track without invented percentages.
- Use opacity and small translations following ByteForm’s motion tokens. Keep surfaces level; no spinning logo, confetti, heavy glow, or unnecessary decorative loops.
- Provide **“Edit brief”** to cancel and return to the preserved input and **“Skip preview”** to proceed immediately.
- Respect reduced motion by removing movement while retaining readable stage feedback and the skip action.
- Announce stage changes politely, prevent duplicate submissions, and clean up timers when canceled or unmounted. Drive completion from the state machine, not an animation-end event.

### Completion placeholder

After the final stage or “Skip preview,” navigate to `/start/success`.

- Heading: **“Preview complete.”**
- Supporting text: **“Success. You’ve reached the end of the creation preview.”**
- Clarification: **“No form has been generated or saved.”**
- Show the selected plan and format, without pretending there is an actual generated form.
- Provide working **“Edit brief”** and **“Back to pricing”** links.
- Keep this intentionally simple for later customization. Do not add a fake editor, generated questions, checkout, or dead controls.

## State, interfaces, and implementation boundaries

- Add one shared plan catalog for prices, feature comparisons, and permitted preview formats. Derive displayed prices and savings rather than duplicating strings or calculations across screens.
- Introduce typed plan, billing interval, format, and preview-stage values.
- Keep prompt text out of URLs and analytics. Store draft state in session storage with an in-memory fallback in a shared journey provider, so navigation still works when storage is unavailable.
- Carry plan and interval in entry URLs; keep the draft scoped to the preview instead of using the existing builder’s local-storage key.
- Missing or invalid plan/billing parameters default to Classic/monthly. Reject array-valued/unsupported query values as invalid. An incompatible Classic-format combination resolves to Classic.
- Explicit entry parameters win over a restored draft’s plan/interval; retain the draft prompt and any compatible format.
- Refresh during preparation returns to the populated description screen without restarting the timed sequence. Refresh on success stays complete when a completed session draft exists. Opening success without completed draft state returns to setup.
- “Edit brief” clears completion/progress state and restores the prompt. Browser Back must not silently rerun a completed simulation.
- If draft storage fails or contains invalid data, recover to a usable description screen rather than crashing. Do not add server persistence to solve this.
- No new form-creation, billing, AI, or entitlement API is needed. Do not change database schemas, create forms, start subscriptions, or implement team management.
- Client-side format restrictions are prototype behavior, not security or subscription enforcement.
- Do not emit existing `form_created` or purchase events for preview completion. Ensure the prompt is not captured by newly added analytics; do not expand analytics scope unnecessarily.
- Mark prototype journey routes noindex; leave landing-page indexing and existing metadata behavior intact.
- Do not change the existing authenticated homepage redirect, `/new` behavior, or builder save/publish gates.

## Acceptance and verification

- Verify all six plan/billing combinations preserve the correct selection, monthly price, annual total, and permitted formats.
- Exercise Classic restrictions, plan changes, preserved prompts, whitespace-only input, maximum-length input, double submission, cancellation, skipping, refresh, invalid parameters, unavailable storage, direct success entry, and browser Back.
- Confirm the simulation reliably ends once, timers stop after cancellation, and no forms/subscriptions or misleading creation events are produced.
- Verify existing hero prompt and “Start now” builder entry points still work unchanged. Check the new pricing navigation anchor.
- Check keyboard navigation, radio/selector semantics, focus after screen changes, polite status announcements, accessible comparison disclosure, contrast, touch targets, and reduced motion.
- Inspect desktop at 1440×900 and 1366×768 and mobile at 760px and 390px. Prices, controls, and annual details must remain readable without page-level horizontal scrolling.
- Preserve the existing hero’s rounded wine panel, level demonstrations, working mode tabs, keyboard behavior, and visible lower paper margin.
- Run changed-file ESLint, `bunx tsc --noEmit`, and `bun run build`. Report any pre-existing failures separately.
- Use existing testing infrastructure where available; do not install a new test framework solely for this reversible UI prototype. Perform meaningful interaction checks and report any browser/visual verification limitation honestly.
- Before completion, audit visible copy against this plan and `design.md`, particularly “Custom branding,” annual billing totals, voice availability, and simulation disclosures.

## Delivery expectations

Implement this plan end to end without asking for routine design or implementation decisions already settled here. Choose maintainable details within the specified design system. Avoid unrelated cleanup and leave existing user changes intact.

In the final report, summarize what changed, validation performed, and any remaining limitations. Do not commit, publish, or deploy unless separately requested.
