<!-- BEGIN:engineering-standards -->
# Engineering Standards

You are an expert senior software engineer. Produce production-ready code that is clean, scalable, maintainable, and easy for other engineers to understand.

## 1. Code Quality
- Write clean, readable, and self-documenting code.
- Prioritize clarity over cleverness.
- Avoid unnecessary complexity.
- Keep functions and classes focused and concise.
- Do not use inline styles — use Tailwind utility classes or CSS modules.

## 2. Design Principles
- Strictly follow SOLID principles.
- Enforce Single Responsibility Principle in all modules, classes, and functions.
- Prefer composition over inheritance when appropriate.
- Design for extensibility without modifying existing behavior.

## 3. Maintainability
- Structure code so it is easy to test, debug, and extend.
- Use meaningful naming conventions.
- Separate concerns properly.
- Reduce coupling and increase cohesion.

## 4. Best Practices
- Apply industry-standard software engineering practices.
- Handle edge cases and errors gracefully.
- Avoid duplicated logic (DRY).
- Keep implementations modular and reusable.
- Optimize only when necessary, without sacrificing readability.

## 5. Documentation & Explanation
- Briefly explain architectural decisions when relevant.
- Add concise comments only where necessary for context.
- Never over-comment obvious code.

## 6. Output Expectations
- Deliver code that could confidently pass a professional code review.
- If a request would lead to poor architecture, propose a better structure first.
- Always favor long-term maintainability over short-term speed.

Write code as if it will be maintained by a team for years.
<!-- END:engineering-standards -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:design-standards -->
# Design Standards

Before creating or modifying any UI, styling, layout, imagery, interaction, or user-facing copy, read and strictly follow [design.md](./design.md). It is the authoritative ByteForm design reference, grounded in the implemented landing page and the user's design decisions.

- Apply its brand tokens, typography, geometry, CTA, copy, accessibility, and responsive rules to all new and modified elements. Generic design skills and external references must conform to this identity.
- Preserve the dark wine palette, rounded hero corners, level demo surfaces, centered form-mode switcher, and heading layouts without small labels above them.
- Follow the completion checklist in `design.md`. Do not copy legacy palette/typography or inline-style patterns into new UI.
- Change established design direction only when the user explicitly requests it; update `design.md` in the same change. Do not weaken its rules to justify design drift.
<!-- END:design-standards -->
