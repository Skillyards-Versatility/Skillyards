# Skillyards Frontend — Interview Questions (350+)

> Organized for a **3-4 YOE Frontend Developer** interviewing at a **Product Company**.
> Every question is grounded in real decisions made in the Skillyards `apps/admin` and `apps/website` codebases.

---

## Section 1: React & Component Architecture (55 Questions)

### Component Model

1. What is the difference between a React Server Component and a Client Component?
2. What does the `"use client"` directive do? Where exactly in the file must it appear?
3. If a Server Component imports a Client Component, is that valid? What about the reverse?
4. Can a Server Component use `useState` or `useEffect`? Why or why not?
5. Can a Client Component import a Server Component? What workaround exists?
6. What is the "server/client boundary"? How does it affect your component tree design?
7. Why is `"use client"` on the outermost layout component a bad pattern?
8. What is the difference between `children` as a prop vs co-locating JSX?
9. What is a "shared component" that can work in both server and client environments?
10. How do you decide whether a component should be a Server Component or Client Component?

### Hooks

11. What is `useState`? What triggers a re-render?
12. What is `useEffect`? What is the dependency array? What happens with an empty array?
13. What is a "stale closure" in `useEffect`? Give an example from a carousel or timer component.
14. What does `useRef` return? How is it different from `useState`?
15. In `HeroCarousel`, the `autoplay` plugin is stored in `useRef`. Why not `useState`?
16. What is `useCallback`? When does it actually help performance?
17. What is `useMemo`? When should you not use it?
18. What is `useContext`? How does it trigger re-renders?
19. What is `useReducer`? When would you prefer it over `useState`?
20. What is a custom hook? Why extract logic into one?
21. What is the rule "hooks must be called at the top level"? Why does React enforce it?
22. What is `useId`? What problem does it solve with SSR?
23. What is `useTransition`? How does it differ from `startTransition`?
24. What is `useDeferredValue`? When would you use it over `useTransition`?
25. What is `useLayoutEffect`? How does it differ from `useEffect` in timing?

### Re-renders & Performance

26. What causes a React component to re-render?
27. What is `React.memo`? How does it work and when does it fail to prevent re-renders?
28. What is referential equality? Why does `{}` !== `{}` in JS cause unnecessary re-renders?
29. What is the "prop drilling" problem? How do you avoid it?
30. What is context performance? Why can adding a value to context cause widespread re-renders?
31. How does splitting a context into two (e.g., ThemeContext value + setter) reduce re-renders?
32. In `ThemeContext`, the `theme` and `setTheme` are in the same context. What's the performance implication?
33. What is reconciliation? How does React decide what to update in the DOM?
34. What is the virtual DOM? Is it still relevant in React 18+?
35. What is concurrent rendering in React 18? How does it differ from React 17?

### Component Patterns

36. What is the compound component pattern? Give an example (hint: `Carousel`/`CarouselContent`/`CarouselItem`).
37. What is the render prop pattern? Where is it still useful?
38. What is the HOC pattern? What replaced it in modern React?
39. What is the controlled vs uncontrolled component pattern? (hint: `Carousel setApi={setApi}`)
40. What is the "lifting state up" pattern? When does it become a problem?
41. What is the container/presentational pattern? Is it still relevant with hooks?
42. What is composition over inheritance in React?
43. What is `forwardRef`? Why is it needed for `CarouselNext`/`CarouselPrevious`?
44. What is `useImperativeHandle`? When would you use it with `forwardRef`?
45. What is the "slot" pattern in React? How does `children` implement it?

### Events & Forms

46. What is synthetic event pooling in React? Is it still relevant in React 17+?
47. What is the difference between `onChange` and `onInput` in React?
48. How does React handle form submission without a library?
49. What is an uncontrolled form? When would you use `ref` instead of `state` for form values?
50. What is React 19 `useActionState`? How does it replace `useState` for form state?
51. What is the difference between `onClick` on a div vs a `button`? (accessibility)
52. What is `e.preventDefault()`? When do you need it in forms?
53. What is `e.stopPropagation()`? When do you need it?
54. How does `aria-label`, `aria-current`, and `role` affect screen readers? (hint: `CarouselItem` bullet buttons)
55. What is keyboard trapping in modals? How do you implement accessible focus management?

---

## Section 2: Next.js App Router (45 Questions)

### Routing

56. What is the difference between the Pages Router and the App Router?
57. What is a "layout" in the App Router? How does nesting work?
58. What is a "template" vs a "layout"? When would you use template?
59. What is a "loading" file? How does it implement Suspense?
60. What is an "error" boundary file? How does it work in the App Router?
61. What is a "not-found" file? How is it triggered?
62. What is a route group `(folder)`? How does it affect the URL?
63. What is a dynamic segment `[id]`? How do you access it in a Server Component?
64. What is a catch-all segment `[...slug]`? What about `[[...slug]]`?
65. What is parallel routing (`@slot`)? Give a use case.
66. What is intercepting routing? When would you use it for modals?
67. What is `useRouter` in the App Router? How does it differ from Pages Router?
68. What is `usePathname`? Why can't it be used in a Server Component?
69. What is `useSearchParams`? Why does Next.js require it to be wrapped in Suspense?
70. What is `redirect()` in a Server Component? How does it differ from `router.push()`?

### Data Fetching

71. How do you fetch data in a Server Component? Why is `async/await` directly in the component valid?
72. What is Next.js's extended `fetch`? What caching options does it add?
73. What is `cache: "force-cache"`? When does it apply?
74. What is `cache: "no-store"`? When do you need it?
75. What is `revalidate`? What's the difference between time-based and on-demand revalidation?
76. What is `revalidatePath`? What is `revalidateTag`?
77. What is the difference between static generation, ISR, and dynamic rendering in the App Router?
78. Why does the admin app hit the API server-side instead of client-side for initial data?
79. What is `cookies()` from `next/headers`? Why is it only available in Server Components?
80. What is `headers()` from `next/headers`?

### Performance Features

81. What is `next/dynamic`? What does it do to the JavaScript bundle?
82. What is the difference between `dynamic(() => import(...))` and a lazy `import()`?
83. What is `{ ssr: false }` in `dynamic`? When do you need it?
84. In `apps/website/src/app/about/page.jsx`, most components are dynamically imported. Why is `AboutHero` static?
85. What is `next/image`? What optimizations does it apply automatically?
86. What is `sizes` prop in `next/image`? Why does it matter for responsive images?
87. What is `priority` in `next/image`? Why should only the above-fold hero image have it?
88. What is `fetchPriority="high"` on an image? How does it differ from `priority`?
89. What is automatic code splitting in Next.js? How does it work per route?
90. What is the `_next/static` directory? What gets bundled there?

### Build & Config

91. What is `next.config.js`? What is the most important option you've configured?
92. What are `remotePatterns` in `next.config.js`? Why do you need them for external images?
93. What is Turbopack? How does it differ from Webpack in Next.js?
94. What is `output: "standalone"`? When would you use it?
95. What is middleware in Next.js App Router? How is it different from server-side middleware?
96. Where does `middleware.ts` run? (Edge runtime)
97. What is the `matcher` config in middleware? What pattern does it use?
98. How does the middleware in the admin app protect routes? What does it check?
99. What is ISR fallback behavior? (`blocking` vs `true` vs `false`)
100.  What is `generateStaticParams`? When would you use it?

---

## Section 3: Performance & Core Web Vitals (45 Questions)

### LCP (Largest Contentful Paint)

101. What is LCP? What elements can be the LCP element?
102. What causes LCP to be slow? List at least 5 root causes.
103. Why does `initial={{ opacity: 0 }}` on a wrapper containing the LCP `h1` report LCP as 0?
104. In `AboutHero.jsx`, you changed `initial={{ opacity: 0, x: -30 }}` to `initial={{ x: -30 }}`. What did that fix and why?
105. What is `fetchPriority="high"` on the hero image? How does it help LCP?
106. What is `priority` on `next/image`? What does it inject into the HTML?
107. What is font loading strategy? How does `font-display: swap` affect LCP?
108. What is render-blocking CSS? How does Next.js handle critical CSS?
109. What is an image format comparison: JPEG vs WebP vs AVIF? Why do you use WebP for hero images?
110. What is lazy loading? Why should the LCP image never be lazy-loaded?

### TBT & FID (Total Blocking Time / First Input Delay)

111. What is TBT? What causes it?
112. What is a "long task"? What is the 50ms threshold?
113. How does a large JavaScript bundle increase TBT?
114. What is the difference between `framer-motion` full bundle vs `LazyMotion + domAnimation`?
115. `LazyMotion` with `domAnimation` is ~16KB vs the full bundle at ~85KB. Why does this matter for TBT?
116. What is `m` vs `motion` in Framer Motion with `LazyMotion`? Why use `m`?
117. What is tree-shaking? Why does `motion` from framer-motion resist tree-shaking?
118. How does code splitting via `next/dynamic` reduce TBT on initial load?
119. What is a JavaScript execution budget? How do you measure it?
120. What is the `scheduler` API? How does React 18 use it to break up long tasks?

### CLS (Cumulative Layout Shift)

121. What is CLS? What causes layout shifts?
122. Why does an image without explicit width/height cause CLS?
123. How does `next/image` prevent CLS? (aspect ratio placeholder)
124. What is the `sizes` attribute on images? How does it prevent layout shifts?
125. What is a font swap causing CLS? How do you mitigate it?
126. What is `skeleton` loading? How does it prevent CLS vs showing content abruptly?
127. What is the `aspect-ratio` CSS property? How does it reserve space before content loads?
128. In `AboutSection`, the image container has `aspect-square`. What does that do for CLS?

### Particles & WebGL

129. What is WebGL? Why do particles use it instead of CSS animations?
130. Why does creating a WebGL context fail silently in some environments? (browser restrictions, privacy modes)
131. How does the WebGL probe (`testCanvas.getContext('webgl')`) prevent the crash?
132. Why are particles skipped on mobile entirely? What is the performance reason?
133. How does `window.matchMedia("(min-width: 768px)")` detect device type safely in SSR?
134. Why is `isDesktop` initialized as `false` instead of checking `window` directly during render?
135. What is the hydration error? How can checking `window` on first render cause one?
136. What is `requestAnimationFrame`? How do particle systems use it?
137. What is `pixelRatio` in the Particles component? Why set it to `1` for performance?
138. What is GPU memory? Why do 200 particles feel heavier than 80 at the same framerate?

### General Optimization

139. What is the difference between `preload`, `prefetch`, and `preconnect` in `<head>`?
140. What is the `rel="preload"` link tag? How does Next.js use it for fonts?
141. What is TTFB (Time to First Byte)? How does server location affect it?
142. What is HTTP/2? How does it improve performance over HTTP/1.1?
143. What is a CDN? How does Vercel's edge network help TTFB?
144. What is bundle analyzer? How would you find what's bloating your JS bundle?
145. What is dead code elimination? How does ESM + tree-shaking enable it?

---

## Section 4: Animation & Motion (35 Questions)

### Framer Motion

146. What is Framer Motion? How does it differ from pure CSS animations?
147. What is `motion.div`? How does it extend a regular `div`?
148. What is the `initial` prop? What is `animate`? What is `exit`?
149. What is `whileHover`? What is `whileTap`? What is `whileInView`?
150. What is `viewport={{ once: true }}`? Why do you use it for scroll animations?
151. What is `transition`? What are `duration`, `delay`, `ease`?
152. What is a spring animation in Framer Motion? How does it differ from a tween?
153. What is `AnimatePresence`? Why is it needed for exit animations?
154. What is `layoutId`? How does it enable shared element transitions?
155. What is the `useMotionValueEvent` hook? Where did you use it (sticky scroll)?
156. What is `useScroll`? What is the difference between `target` and `container`?
157. What is `scrollYProgress`? What are its min and max values?
158. What is `useTransform`? Give an example of mapping scroll to opacity.
159. What is `motionValue`? How is it different from React state?
160. What is `LazyMotion`? What does `domAnimation` provide vs `domMax`?

### CSS Animations & Transitions

161. What is `transition` in CSS? What properties can be transitioned?
162. What is `animation` in CSS? What is `@keyframes`?
163. What is `will-change`? When should you use it and what are the risks?
164. What is `transform` vs `top/left` for animation performance? Why is transform GPU-accelerated?
165. What is `opacity` animation performance? Why is it the cheapest property to animate?
166. What is `backface-visibility`? When does it help with transform flicker?
167. What is the FLIP technique? (First, Last, Invert, Play)
168. What is a CSS custom property animation limitation? (Can't animate var() directly — except with @property)
169. What is `@property` in CSS? How does it enable custom property animations?
170. What is `prefers-reduced-motion`? How should you respect it in Framer Motion?

### Scroll Behavior

171. What is `IntersectionObserver`? How does it differ from listening to the scroll event?
172. What is `rootMargin`? What does `"-50% 0px -50% 0px"` do in the StickyScroll component?
173. What is `threshold` in IntersectionObserver? When would you use it vs `rootMargin`?
174. What is `position: sticky`? What CSS properties on an ancestor break it?
175. Why does `overflow: hidden` on a parent break `position: sticky` on a child?
176. What is `overflow: clip`? How is it different from `overflow: hidden` re: sticky?
177. What is `scroll-snap`? How does Embla Carousel differ from CSS scroll snap?
178. What is passive event listener? Why does the scroll event need it for performance?
179. What is `getBoundingClientRect()`? What layout thrashing does calling it in a loop cause?
180. What is the 100vh problem on mobile? How does `dvh` (dynamic viewport height) fix it?

---

## Section 5: State Management & Context (30 Questions)

### Local State

181. When is `useState` enough? When do you need something more?
182. What is derived state? Why should you not duplicate it in `useState`?
183. What is the "single source of truth" principle?
184. In `HeroCarousel`, `current` and `progressKey` are separate state. Why not combine them?
185. What is batched state updates in React 18? How does it differ from React 17?

### Context API

186. What is React Context? When does it become a performance problem?
187. What is the `ThemeContext`? What does it expose? (`theme`, `setTheme`)
188. How does `useTheme()` work? What happens if used outside the provider?
189. Why is theme stored in Context instead of a URL param or cookie?
190. What is context selector? Why doesn't React have it built-in (yet)?
191. How would you optimize ThemeContext to prevent re-renders on components that only read `theme` but not `setTheme`?
192. What is `Zustand`? How does it compare to Context for global state?
193. What is `Jotai`? What is the "atom" model?
194. What is `Redux`? Why is it considered over-engineering for a project like Skillyards?
195. What is the `useContext` + `useReducer` combo pattern?

### Data Fetching State

196. What is `SWR`? What caching strategy does it use? (stale-while-revalidate)
197. What is `React Query`? What problems does it solve over plain `fetch` + `useState`?
198. What is optimistic UI? How would you implement it for a payment creation form?
199. What is "loading state"? What is "error state"? How do you handle both?
200. What is a skeleton screen? When is it better than a spinner?
201. In the admin app, data is fetched server-side via Server Components. What state management does that eliminate?
202. What is `useFormStatus`? What is `useOptimistic` in React 19?
203. What is cache invalidation on the frontend? How does `router.refresh()` trigger it?
204. What is the `stale-while-revalidate` caching strategy? How does it differ from cache-first?
205. What is a race condition in data fetching? How do you cancel a stale fetch?
206. What is `AbortController`? How do you use it in `useEffect` cleanup?
207. What is the difference between client-side navigation and a full page reload? What does `router.push` do?
208. What is the React Query `queryKey`? How does it control cache invalidation?
209. What is `keepPreviousData` in React Query? How does it help pagination UX?
210. What is `useInfiniteQuery`? How does it differ from regular pagination?

---

## Section 6: Styling & Design System (30 Questions)

### Tailwind CSS

211. What is Tailwind CSS? How is it different from writing CSS by hand?
212. What is the JIT (Just-in-Time) compiler in Tailwind? How does it generate CSS?
213. What is `cn()` (clsx + tailwind-merge)? Why do you need it instead of template literals?
214. What problem does `tailwind-merge` solve that `clsx` alone does not?
215. What is `@apply` in Tailwind? Why is it generally discouraged?
216. What is a Tailwind plugin? Give an example of where you'd write one.
217. What is arbitrary value syntax in Tailwind? (`w-[32rem]`, `top-[52%]`)
218. What is the `dark:` variant? How does Tailwind know to apply it?
219. What is the `sm:`, `md:`, `lg:` breakpoint system? Are they mobile-first?
220. What is `container` in Tailwind? Why do you use `max-w-6xl mx-auto` instead?

### CSS Custom Properties & Theming

221. What is a CSS custom property (`--primary`, `--background`)? How does it differ from Sass variables?
222. How does `var(--primary)` in inline styles enable dynamic theming?
223. What is `color-mix(in srgb, var(--primary) 40%, transparent)`? What does it produce?
224. Why do you use `var(--primary)` in card blob styles instead of Tailwind color classes?
225. What is `hsl()` vs hex vs rgb for CSS color values? Which is easiest to manipulate?
226. How does `shadcn/ui` define its color system? (CSS variables per semantic token)
227. What is a semantic color token (`--foreground`, `--muted-foreground`) vs a raw color (`--blue-500`)?
228. What is the `bg-primary/10` Tailwind syntax? What does `/10` mean?
229. How does dark mode work with CSS custom properties? (`:root` vs `.dark` selector)
230. What is `prefers-color-scheme`? How does your ThemeContext override it?

### shadcn/ui & Component Libraries

231. What is `shadcn/ui`? How is it different from installing a component library like MUI?
232. Why does `shadcn/ui` give you the source instead of a package?
233. What is Radix UI? What does it provide that shadcn wraps?
234. What is an "unstyled component library"? Why is accessibility important in primitive libs?
235. What is `cva` (class-variance-authority)? How does it manage component variants?
236. What is the `Button` component's `asChild` prop? How does it implement polymorphism?
237. What is Radix `Slot`? How does `asChild` use it?
238. What is a headless UI component? Why is it preferred over styled components in design systems?
239. What is `lucide-react`? Why did you uninstall `@tabler/icons-react`?
240. What is icon tree-shaking? Why does `import { Laptop } from "lucide-react"` not import all icons?

---

## Section 7: SEO & Metadata (25 Questions)

241. What is the Metadata API in Next.js App Router? How is it different from `<Head>` in Pages Router?
242. What is `export const metadata` in a `page.jsx`? What properties does it accept?
243. What is `generateMetadata`? When would you use it over static `metadata`?
244. What is an Open Graph tag? How does it affect link previews on social media?
245. What is `og:image`? What are the recommended dimensions?
246. What is a Twitter Card tag? How does it differ from Open Graph?
247. What is `robots` metadata? What does `index, follow` mean?
248. What is a canonical URL? Why is it important for avoiding duplicate content?
249. What is JSON-LD? How does `<script type="application/ld+json">` help Google understand your content?
250. What is schema.org? What is `WebPage`, `Organization`, `Course` structured data?
251. What is a sitemap? How does Next.js generate it via `sitemap.ts`?
252. What is `robots.txt`? What does `Disallow: /admin` do?
253. What is Core Web Vitals and its connection to Google ranking?
254. What is `hreflang`? When would you add it to Skillyards?
255. What is the difference between `noindex` and `nofollow`?
256. What is dynamic OG image generation in Next.js? (via `opengraph-image.tsx`)
257. What is `buildSEO` in your codebase? What fields does it populate?
258. What is semantic HTML? Why does using `<h1>`, `<nav>`, `<article>` help SEO?
259. What is `alt` text on images? Why is it important for both SEO and accessibility?
260. Why is there only one `<h1>` per page? How does it affect SEO?
261. What is page title length limit? Why keep titles under 60 characters?
262. What is meta description? Does it affect ranking or only CTR?
263. What is breadcrumb structured data? How does it appear in search results?
264. What is `next-sitemap`? How does it auto-generate sitemap from your routes?
265. What is a "rich result" in Google Search? How does JSON-LD enable it?

---

## Section 8: Authentication on the Frontend (25 Questions)

266. How does the admin app know if the user is logged in on the server side?
267. What is `cookies()` from `next/headers` used for in the admin layout?
268. What does the admin middleware check to protect routes? What happens if the cookie is missing?
269. What is the difference between client-side route protection (redirect in `useEffect`) vs middleware? Why is middleware better?
270. Can JavaScript read an `httpOnly` cookie? What does that mean for XSS attacks?
271. How does the login form in the admin app POST credentials to the API? Is it a fetch or a form action?
272. What happens when the API sets `Set-Cookie` on the response? Does the browser automatically store it?
273. What is the `sameSite: "lax"` attribute? How does it protect against CSRF for GET-triggered navigations?
274. What is CSRF? Is the admin app vulnerable? How does the `sameSite` cookie attribute help?
275. Why does `domain: ".skillyards.in"` allow both `admin.skillyards.in` and `api.skillyards.in` to share a cookie?
276. What is the difference between `session` and `persistent` cookies? Which does your admin app use?
277. What happens when a user's JWT expires mid-session? How does the UI reflect it?
278. What is `router.refresh()` after login? Why is it needed?
279. What is optimistic auth state? Why is it risky?
280. What is a "protected layout" in the App Router? How does `apps/admin` use it?
281. What is `redirect()` from `next/navigation`? How does it differ from `Response.redirect()`?
282. How does the logout flow work? What needs to happen on both client and server?
283. What is a session token vs an access token vs a refresh token on the frontend?
284. What is `next-auth`? Why might you not need it if you have a custom API with JWT cookies?
285. What is token refresh on the frontend? How would you implement silent refresh?
286. What is the security risk of storing tokens in `localStorage`? (XSS)
287. What is the risk of storing tokens in cookies without `httpOnly`? (XSS readable)
288. What is a PKCE flow? When is it relevant for a Next.js app?
289. What is OAuth? What is the difference between authorization code flow and implicit flow?
290. What is multi-factor authentication (MFA)? How would you add TOTP to the admin login?

---

## Section 9: Admin App Specifics (30 Questions)

### Data Tables & UI

291. How do you render a large list of students efficiently? What is virtualization?
292. What is `react-window` or `react-virtual`? When would you add it to the student list?
293. What is a data table with server-side pagination? How does it differ from client-side?
294. What is the `useRouter` + `searchParams` pattern for persisting filters in the URL?
295. Why store filter state in the URL rather than React state?
296. What is a controlled `Select` / `Combobox`? How does it differ from native `<select>`?
297. What is `react-hook-form`? How does it reduce re-renders compared to controlled inputs?
298. What is `zod` schema validation used for on the frontend? How does it share schemas with the API?
299. What is a toast notification? How does `sonner` or `react-hot-toast` work?
300. What is an optimistic update for a payment form? What do you revert if the API call fails?

### Server Components in Admin

301. Why is the student detail page a Server Component? What data does it fetch at request time?
302. What is "waterfall fetching" in Server Components? How does `Promise.all` fix it?
303. What is `Suspense` boundary in the Admin app? How does streaming work?
304. What is the difference between `loading.tsx` (file convention) and a manual `<Suspense>` boundary?
305. What is partial prerendering (PPR)? How does it combine static shell + dynamic streaming?
306. What is a React cache? How does `cache()` from React work in Server Components?
307. When would you use `unstable_cache` from Next.js? How does it differ from React `cache()`?
308. How does the admin app pass data from a Server Component down to a Client Component?
309. What is serialization of props? Why can't you pass a `Date` object directly from Server to Client?
310. What is the `"use server"` directive? What are Server Actions?

### Forms & Mutations

311. What is a Server Action? How do you call one from a form?
312. What is `useFormState` (React 18) / `useActionState` (React 19) for Server Actions?
313. What is the progressive enhancement pattern? How do Server Actions support it?
314. What is the `action` attribute on a `<form>`? How does a Server Action attach to it?
315. What is optimistic UI with Server Actions? (`useOptimistic`)
316. How do you handle file uploads in a Next.js Server Action?
317. What is revalidation after a mutation? How does `revalidatePath` fit in?
318. What is the difference between calling `router.push()` vs `redirect()` after a mutation?
319. What is form validation at the Server Action level? How do you return errors to the client?
320. What is CSRF protection for Server Actions? How does Next.js handle it?

---

## Section 10: Testing & Debugging Frontend (25 Questions)

### Testing

321. What is the difference between unit, integration, and E2E tests for a frontend?
322. What is React Testing Library? What is its testing philosophy?
323. Why does RTL prefer queries like `getByRole` over `getByTestId`?
324. What is `@testing-library/user-event`? How does it differ from `fireEvent`?
325. How would you test the `HeroCarousel`? What would you mock?
326. How would you test the `ThemeContext` toggle behavior?
327. What is Playwright? What is Cypress? How do they differ?
328. What is a snapshot test in Jest? When is it useful and when is it harmful?
329. What is `vi.mock()` in Vitest? How do you mock `next/navigation`?
330. What is the `act()` wrapper in React tests? When do you need it?
331. What is visual regression testing? What tool would you use? (Chromatic, Percy)
332. How would you test that `StickyScroll` switches cards when a card enters the viewport center?
333. What is `IntersectionObserver` mocking in Jest? Why does it need to be mocked?
334. How would you test that the `Particles` component skips rendering on mobile?
335. What is Storybook? How does it help with component development and testing?

### Debugging

336. What is the React DevTools? What tab shows you why a component re-rendered?
337. What is the Profiler in React DevTools? How do you find slow renders?
338. What is "Highlight updates" in React DevTools? What does a red flash mean?
339. How do you debug a hydration mismatch error? What causes it?
340. What is a hydration mismatch? Give an example from the `isDesktop` state in `HeroCarousel`.
341. What is `console.trace()`? How does it differ from `console.log()`?
342. What is the Network tab? How do you find LCP resource loading delays?
343. What is Lighthouse? What does the Performance score measure?
344. What is the Chrome Coverage tab? How do you find unused JavaScript?
345. What is a memory leak in a React component? How does a missing cleanup in `useEffect` cause one?

---

## Section 11: Behavioral & System Thinking (20 Questions)

346. Walk me through a performance problem you found in the Skillyards website and how you fixed it.
347. What was the most complex animation or UI interaction you built? What were the trade-offs?
348. Why did you switch from `useScroll` breakpoints to `IntersectionObserver` for the sticky scroll section?
349. What broke when you added `overflow-hidden` to the FeaturesSection? How did you diagnose it?
350. How did you approach the decision to skip Particles on mobile?
351. Why did you use `LazyMotion + domAnimation + m` instead of importing `motion` directly?
352. What is the hardest hydration error you encountered? How did you fix it?
353. How do you balance visual richness (animations, blurs, particles) with performance budgets?
354. If Google PageSpeed gives you 60 on mobile, what is your systematic approach to diagnose it?
355. How would you explain to a designer why a proposed animation might hurt Lighthouse score?
356. What would you change about the homepage if you had an extra sprint?
357. How do you decide when a component is "too large" and should be split?
358. What is the bus factor of the frontend codebase? How would you improve documentation?
359. If a user reports "the website feels laggy on their phone," what is your debugging process?
360. How do you keep up with React and Next.js changes? How did you learn about `LazyMotion`?
361. What is the most over-engineered thing you've built on the frontend? Would you do it differently?
362. What is a design system? Should Skillyards invest in one? At what scale does it pay off?
363. What is the difference between a frontend developer and a full-stack developer in 2025?
364. How do you prioritize accessibility vs delivery speed?
365. If you had to onboard a new frontend developer to the Skillyards codebase, what would you show them first?

---

_Total: **365 questions** across 11 sections._
_Every question maps to a real implementation decision in `apps/website` or `apps/admin`._
