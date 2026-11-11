# ByteForm design standard

This is the binding design reference for new and modified ByteForm UI. Read it before changing layout, styling, components, imagery, interaction, or user-facing copy. Preserve these decisions unless the user explicitly requests a change; update the relevant rules in the same change when that happens. Generic design skills and external references must adapt to this identity.

## Source of truth and scope

The current landing page is the concrete visual reference:

- Composition, branding, and copy: [GuestHomePage.tsx](src/features/builder/components/GuestHomePage.tsx).
- Colors, typography, spacing, responsive rules, and states: [landing.module.css](src/features/builder/components/landing/landing.module.css).
- Working form demos and keyboard behavior: [FormExperienceDemo.tsx](src/features/builder/components/landing/FormExperienceDemo.tsx).
- Existing brand icon: [logo-icon.svg](public/logo-icon.svg).

Apply the brand, typography direction, copy rules, and interaction standards to future elements across the project. Landing-specific proportions do not require oversized marketing headings or viewport-height panels in the builder, dashboard, or authentication flows. Use appropriate density while preserving the identity.

Older screens, `src/app/globals.css`, and the root layout still contain the earlier wine/ivory palette and Inter/Playfair typography. Those are migration context, not permission to introduce a competing identity. Do not copy old inline styles or silently restyle unrelated screens. For new shared UI, expose the approved values through shared semantic tokens as needed; do not assume the existing global `accent` or `primary` tokens already match this document.

## Brand and visual direction

ByteForm helps people ask questions through classic forms, conversational chat, and eventually voice. The design is sleek, premium, approachable, and product-led: bold sans-serif typography, deep wine surfaces, light paper backgrounds, generous spacing, and useful interaction.

Use the existing four-square icon and the lowercase `byteform.` wordmark treatment from the landing page. Preserve the icon's original artwork and palette. Do not redraw or recolor it as a side effect of styling a page.

Typeform informed the approachable form experience; Arche references informed typography, spacing, and composition. They are inspiration, not templates. The implemented ByteForm design and the user's corrections take priority over future reference searches.

## Color system

| Role | Approved value | Use |
| --- | --- | --- |
| Wine | `#471324` / `--wine` | Hero, final CTA panel, primary buttons, chat answers, brand accents |
| Deep wine | `#330d1a` / `--wine-deep` | Text on cream CTA buttons |
| Wine hover | `#602039` | Filled wine button hover background |
| Paper | `#faf9f6` / `--paper` | Main page background and visible outer margins |
| Ink | `#292426` / `--ink` | Main text on light surfaces |
| Muted | `#70676a` / `--muted` | Supporting text on light surfaces |
| Cream CTA | `#faf1e6` | Primary CTA on wine surfaces; white on hover |
| Inverse text | `#fff8f1` | Main text on wine surfaces |
| Rose emphasis | `#e3b0bf` | Restrained headline emphasis on wine |
| Inverse supporting text | `#ead4da` | Descriptions on wine |
| Demo surface | `#fbfaf7` | Interactive demo card |
| Soft surface / divider | `#eeeae5` / `#e9e4e0` | Demo questions / light separators |
| Focus | `#b65f7b` | Visible focus outline; wine for input focus |

The hero and filled wine buttons must use the same base wine token. Do not return to the earlier `#641c32` or `#6B1A2A` as the new brand accent. Reuse semantic tokens instead of scattering new hex values across components. Rose shades support wine; they are not an independent accent system. Error and success colors may communicate actual state, not decoration. Photography may contain natural colors.

## Typography

- Use Geist for new brand and marketing UI, loaded with `next/font`. The landing uses `--font-landing`; follow its implementation rather than adding a remote font stylesheet.
- Keep display headings in the same sans-serif family. No decorative serif word inserted into a headline, no new font pairing, no return to Playfair for marketing headings.
- Hero desktop baseline: `clamp(64px, 6.7vw, 100px)`, weight `450`, line-height `1.02`, tracking `-0.065em`.
- Section heading baseline: `clamp(34px, 3.5vw, 52px)`, weight `450`, line-height `1.12`, tracking `-0.05em`, balanced wrapping.
- Body: generally 13–17px with relaxed line-height, constrained to a comfortable reading width. Hero description: 17px, line-height `1.7`, maximum width 440px for the centered hero composition.
- Use medium weights to establish hierarchy; do not make every heading bold. At narrow widths, use the existing responsive heading rules and allow natural wrapping.
- Headings begin directly. **Do not add small labels, kickers, eyebrow text, category pills, or decorative slogans above page or section titles.** Necessary form labels and functional status text remain valid.

## Layout and geometry

- Use clear hierarchy and deliberate whitespace. The landing hero centers the existing headline and supporting copy above the primary form-creation prompt; the interactive demo follows below.
- Desktop navigation stays on one line within the existing 96px header and 1440px maximum width. Mobile header is 78px.
- The hero is a **rounded rectangle**, never a literal square or a sharp-cornered panel. Keep its 14px desktop and 10px mobile corners.
- Desktop hero: centered copy and creation prompt (maximum width 720px). The wine rectangle stays `calc(100svh - 120px)` tall, with 24px side gutters and a visible 24px lower paper margin within the initial viewport. A separate light floating demo window (maximum width 1120px) overlaps its lower edge and extends onto the paper below. The demo must never stretch the wine background. At very wide widths, cap the hero at 1552px and center it.
- The prompt drives creation; the demo demonstrates differentiation. On representative desktop viewports, show the top of the floating demo near the viewport bottom. Let the complete demo continue naturally below the fold; never clip its controls to create the partial reveal. Use short-viewport adjustments to preserve this hierarchy.
- Mobile stacks copy and demo, uses 12px side gutters, and retains the 24px bottom margin. Allow natural page height; never compress or clip the whole mobile hero to one screen.
- Keep demo and form surfaces level. **No rotation, tilt, skew, or perspective transforms.** The demo card radius is 12px and maximum width is 460px on desktop.
- Place the Chat / Voice / Classic creation-mode switcher inside the prompt textbox, alongside the submission action on desktop and naturally wrapped on mobile. It selects the requested creation mode independently from the demo. Voice creation remains clearly marked coming soon.
- Use the three existing feature descriptions as selectable demo sections beside the demo in the floating light window. Preserve their copy and icons, show the active section, and support vertical arrow-key/Home/End tab navigation. On mobile, stack the demo and selectable descriptions without clipping.
- Buttons use modest rounding: 7px for primary CTAs; 8px for the switcher container and 4px for its tabs. Do not turn every control into a pill.
- Prefer whitespace and light dividers over nested bordered cards. Keep the existing restrained, wine-tinted demo shadow; do not add glows or heavy shadows everywhere.
- Reuse the current 1100px, 760px, and 390px responsive adjustments where appropriate. Check short desktop heights as well as narrow widths.

## Copy and conversion

- Primary acquisition CTA text is exactly **“Start now”**, linked to **`/new`**. Use the existing `StartLink` pattern for landing links; the hero prompt submits to `/new` with the entered description and requested mode. For guests submitting a prompt, `/new` shows a chat with their description and a brief building animation that pauses at “Awaiting signup…”. Open a non-dismissible email-only modal (no close control, Escape dismissal, or backdrop dismissal), then pricing-tier selection with Next, then a waitlist confirmation after the application is saved. Preserve the requested mode and prompt. The skeleton is a preview, not generated questions; disclose this in the workspace. Guests entering `/new` without a prompt can still explore the manual builder.
- The prompt application flow uses the existing wine/paper identity and Geist, native modal focus behavior, a finite building entrance, and reduced-motion support. Its confirmation reads “Application sent!”, “You’re on the waitlist”, and the user-provided selective-admission/custom-quote paragraph, with a working optional “Improve my chances” action. Do not claim account creation or payment.
- Pricing card “Start now” buttons open the shared application modal directly over the landing page, preserving the selected tier and billing interval. Ask only for email, then save and show the same waitlist confirmation; never ask visitors to select a tier again. Display the chosen tier and billing as context. Keep `/start` as the separate legacy creation preview. Voice remains marked coming soon. Use restrained modal/backdrop enter and exit transitions, step entrances, focus feedback, button press/arrow feedback, and a loading indicator while saving. Disable animation for reduced-motion preferences and keyboard actions.
- Use filled wine buttons on light backgrounds and cream buttons with deep wine text on wine backgrounds. Keep the arrow, hover feedback, and clear focus state.
- Write direct, short, human sentences. Explain what people can do or learn. Avoid hype, unsupported completion-rate claims, invented testimonials, and filler such as “elevate,” “unleash,” or “seamless.”
- Do not restore “Find your way to ask” or “Go on. Give it a try.” Do not replace them with equivalent decorative prompts.
- Keep the customer-company section. Its current companies are explicitly labeled placeholders; never present them as verified customers or add fabricated social proof.
- Describe voice as coming soon until it is implemented. Do not imply that preview animation records audio or conducts a live conversation.

## Demos and interaction

- Chat is a working, scripted sample: accept typed input, reject blank answers, advance through questions, show a completion CTA, and support restart. Keep answers local to the demo; do not persist or submit them.
- Classic mode has labeled required controls, native validation, a local completion state, and a reset action. Preserve the notice that sample answers are not saved.
- Voice mode is a clearly labeled, interactive visual preview. It does not request microphone permission, record, or play fabricated live audio. Keep the “Coming soon” and preview-only disclosures visible.
- Preserve tab semantics, active states, arrow-key/Home/End navigation, and links that open the matching demo. All demo anchors must stay available, regardless of the active mode.
- Use restrained ~200ms hover/press feedback. The voice waveform moves only when the preview is activated. Respect `prefers-reduced-motion`; no ambient looping decoration or scroll hijacking.
- Same-page section links, including How it works, Pricing, and Journal, scroll smoothly to their targets. Journal navigation points to the landing journal section when articles exist; “All articles” opens `/blog`. “Compare all features” expands and collapses with a restrained 200ms transition and scrolls into view when opened. Reduced motion uses immediate scrolling and disclosure changes.
- Use the landing motion tokens for consistent timing: 140ms press feedback, 200ms UI transitions, and 420ms one-time entrances. Keep entrances within 14px, animate only transform and opacity, and leave server-rendered content visible before JavaScript enhances it.
- Keep the demo panel height consistent across modes. Demo feature selection is immediate for keyboard navigation; the prompt creation-mode indicator uses the existing restrained transition. Restore focus after demo completion and restart, and disable movement for reduced motion without hiding content or losing the active indicator.
- Preserve visible focus, semantic headings and landmarks, explicit input labels, accessible icon-button names, and the skip link. Do not rely on color alone for state. Maintain WCAG AA text contrast when extending the palette.

## Implementation rules

- Use CSS Modules or Tailwind utilities. No inline styles. Use the existing Next.js, React, Tailwind v4, and component infrastructure rather than adding a second design system.
- Keep static page composition in Server Components and interactive behavior in focused Client Components. Read the installed Next.js guides before changing framework behavior.
- Reuse existing components before creating variants. Extract shared semantic tokens/components when multiple consumers need them; do not copy the entire landing stylesheet into product screens.
- Use the existing Lucide icon family. Keep stroke treatment consistent; no emoji or custom decorative icon drawings as substitutes.
- Use real local assets and `next/image`, preserve aspect ratios, provide meaningful alt text, and avoid layout shifts. The existing landscape asset is `public/images/landing-landscape.jpg`; do not substitute unrelated stock imagery just to fill space.
- Existing controls must continue to work. Do not ship dead links, decorative fake controls, misleading capability claims, or newly introduced missing states.

## Completion checklist

Before completing a UI change:

- Compare it with the current reference components and this document. Confirm the dark wine token, Geist direction, radii, CTA treatment, and lack of labels above headings.
- For hero changes, check level demo edges, prompt mode controls, selectable demo descriptions, rounded corners, and visible lower paper margin on representative desktop sizes such as 1440×900 and 1366×768. Check 390px and 760px widths for natural stacking and no horizontal overflow.
- Exercise every changed interaction with keyboard and pointer, including empty, invalid, complete, reset, and disabled states where applicable. Check reduced motion when adding movement.
- Run changed-file ESLint and `bunx tsc --noEmit` for code changes; use `bun run build` when framework, routing, or build behavior changes.
- Inspect rendered desktop and mobile views when browser tooling is available. Report a visual-verification limitation honestly; passing code checks does not establish visual correctness.
- Do not edit these rules merely to make a divergent implementation appear compliant. Capture future user-requested design decisions here so they survive across sessions.

## Basis and research

This structure is a project convention, not a vendor-mandated `design.md` schema. The exact ByteForm rules above come from the implemented design and the user's corrections. Vendor guidance informs how the rules are organized and made discoverable:

- [OpenAI: Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md): use repository instructions for persistent project guidance.
- [OpenAI: Iterating Development Workflows with Codex](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex): supporting Markdown files are adaptable conventions; direct the agent to the relevant files.
- [Anthropic: How Claude remembers your project](https://code.claude.com/docs/en/memory): keep instructions specific, concise, and organized; reference supporting files instead of duplicating competing rules.
- [Anthropic: Improving frontend design through Skills](https://claude.com/resources/articles/improving-frontend-design-through-skills): give concrete direction for typography, color, motion, and surfaces to prevent generic defaults.
- [Anthropic: Set up your design system](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design): document palette, typography, components, and layout, grounded in real examples.
- Visual inspiration: [Typeform](https://www.typeform.com/) and [Qatchup on Arche](https://arche.directory/sites/qatchup). They do not override ByteForm's established rules.
