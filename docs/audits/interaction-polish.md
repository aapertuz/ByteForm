# Public experience polish audit

Implemented November 10, 2026. Scope: shared route behavior, landing navigation primitives, journal index/articles, authentication, and loading/error/not-found states. Existing pricing and creation-preview work was preserved.

| Before | After | Why |
| --- | --- | --- |
| Abrupt route replacement | 200ms opacity feedback; marked editorial/auth content enters within 10px over 420ms | Gives navigation continuity without delaying cached pages |
| Loading placeholders could finish without an entrance | Wait for the destination content when a route streams | Animate the actual content, including slow article requests |
| Blog used earlier serif typography, palette, wordmark, and pill CTAs | Shared Geist, wine/paper tokens, wordmark, modest button corners, and Start now links to `/new` | Keeps the public experience recognizably ByteForm |
| Heavy article cards with generic hover shadows | Editorial rows, light dividers, readable article measure, and restrained arrow feedback | Makes reading and navigation feel intentional |
| Articles ended without further reading | Related articles, a consistent creation CTA, and shared footer | Gives readers clear next steps |
| No designed loading or recovery experience | Route loading feedback, journal skeletons, retry boundaries, and useful missing-page/article screens | Handles interrupted journeys coherently |
| Authentication showed unverified testimonials, completion statistics, and invented workspace activity | Plain product information and the approved brand | Removes misleading trust signals |
| Placeholder-only input labels and limited request feedback | Explicit labels, autocomplete, show/hide password, pending/disabled states, and caught connection errors | Improves accessibility and makes submission state clear |
| Local timezone could shift article dates backward | Format editorial dates in UTC | Keeps publication dates consistent |

Implementation notes:

- Motion enhances visible server-rendered content with the Web Animations API. It does not intercept links, delay navigation, add a router dependency, or remount page state.
- Keyboard actions, browser history, and reduced-motion preferences bypass entrances. A changed motion preference cancels an active animation.
- Only marked page content translates; the root fallback changes opacity, preserving the placement of fixed controls. The wrapper allows long pages to grow naturally.
- Shared public design tokens live in `src/shared/styles/brand-tokens.css`; legacy product tokens were left intact.
- Page composition stays on the server. Authentication behavior and navigation enhancement use focused client components.

Validation:

- Changed-file ESLint, `bunx tsc --noEmit`, and `bun run build` passed.
- A temporary Happy DOM/React harness passed checks for streamed arrival, pointer navigation, keyboard cancellation, reduced motion (including a preference set before late content arrives), history navigation, opacity-only fallback, state preservation, and cleanup. No test dependencies were added to the repository.
- Production HTTP smoke checks passed for the index, article, login, signup, missing article, and missing page, including labels, primary links, titles, and noindex recovery behavior. A streamed missing article can return HTTP 200 with noindex, per Next.js streaming behavior.
- Desktop visual review: Chrome journal and Safari journal/article/authentication. Mobile visual review: iPhone 17 Pro simulator at 402px for journal, signup, and missing-article recovery. Native Safari empty-form validation and password visibility were exercised.

Limits and remaining audit scope:

- Successful email/OAuth authentication and account-only dashboard/builder/response workflows were not exercised with a live account.
- Retry boundaries were compiled and reviewed; a production server failure was not deliberately injected into the running app.
- Reduced-motion/history/state behaviors were checked in the DOM harness, rather than by changing the user's operating-system preferences.
- Existing article bodies still include older product/pricing comparisons and feature claims. They need a separate factual editorial review before being relied on as current product documentation.
