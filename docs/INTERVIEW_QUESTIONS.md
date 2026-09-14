# Skillyards Backend — Interview Questions (400+)

> Organized for a **4 YOE Backend Developer** interviewing at a **Product Company**.
> Every question is grounded in real decisions made in the Skillyards codebase.

---

## Section 1: Architecture & System Design (50 Questions)

### High-Level Architecture

1. Draw the complete system architecture of Skillyards. What are all the services and how do they communicate?
2. Why did you choose a monorepo structure? What are the trade-offs vs polyrepo?
3. You have `apps/api`, `apps/admin`, `apps/website`, `apps/pdf-service`. Why not a single Next.js app?
4. Why is the API a separate Next.js app instead of API routes inside the admin app?
5. What does "headless API" mean? Why does `api.skillyards.in` have no UI?
6. How do the Admin app and API communicate? Is it client-side fetch or server-side?
7. The Admin app uses Server Components. How do those make authenticated requests to a separate API server?
8. What is the `@repo/db` package? Why is the database schema in a shared package instead of inside the API?
9. If tomorrow you add a mobile app, what changes to the API?
10. Your API is deployed on Vercel. What constraints does that impose?

### Scalability

11. Can your current architecture handle 10,000 concurrent users? Where would it break first?
12. How would you horizontally scale the payment processing?
13. Your rate limiter is in-memory. What happens when Vercel spins up multiple serverless instances?
14. If you had to add a message queue, where would you put it and why?
15. What's the difference between vertical and horizontal scaling? Which applies to your PDF service?
16. Your database is Neon (serverless Postgres). How does connection pooling work differently from a traditional Postgres setup?
17. What would you change if you needed to support 1 million students?
18. How would you implement database sharding for this system?
19. Why is the PDF service on Railway instead of Vercel? What resource constraint drove that decision?
20. If the PDF service goes down, does the main API go down? Why or why not?

### Microservices vs Monolith

21. Is Skillyards a monolith or microservice? Justify your answer.
22. What's the difference between a monolith, SOA, and microservices?
23. If you split the payment module into its own service, what new problems arise?
24. How do you handle shared database access in a monorepo without it becoming a distributed monolith?
25. What is the "distributed monolith" anti-pattern? Does Skillyards suffer from it?

### API Design

26. Why Next.js Route Handlers instead of Express.js?
27. What naming convention do your API routes follow? Is it RESTful?
28. What's the difference between `/api/students/{id}/payments` and `/api/payments?studentId={id}`? Which did you pick and why?
29. Why are receipts under `/api/payments/{id}/receipt` instead of `/api/receipts/{id}`?
30. How do you handle API versioning? What happens when you need breaking changes?
31. What HTTP status codes do you use and when? Walk me through 200, 201, 202, 400, 401, 403, 404, 429, 500.
32. Why does the receipt endpoint return `202 Accepted` instead of `200 OK`?
33. What is idempotency? Which of your endpoints are idempotent?
34. How do you handle pagination? What are the trade-offs of offset-based vs cursor-based?
35. What is HATEOAS? Does your API implement it? Should it?

### Design Patterns

36. Explain the Service → Repository → Schema pattern. Why not just query the DB directly in route handlers?
37. What is the Repository pattern? How does it help with testing?
38. What is the difference between a Service and a Repository in your codebase?
39. What is the Middleware pattern? How does `createProtectedRoute` implement it?
40. What is the Strategy pattern? Does `canAccessReceipt` / `canAccessStudent` use it?
41. What is the Factory pattern? Is `createProtectedRoute` a factory?
42. What is the Observer pattern? Where could you use it in this system?
43. What is the Singleton pattern? Where do you use it (hint: `global.rateTracker`)?
44. What is Dependency Injection? Your services take `db` as a parameter — is that DI?
45. What is the difference between composition and inheritance? Which does your codebase prefer?

### Trade-offs & Decision Making

46. What's the most complex technical decision you made on this project?
47. If you could rebuild one part of the system from scratch, what would it be and why?
48. What technical debt exists in the current system?
49. What was a decision you made early that turned out to be wrong? How did you fix it?
50. You use `Promise.all` extensively. What's the failure mode? Does one failure cancel the others?

---

## Section 2: Authentication & Authorization (45 Questions)

### Authentication (AuthN)

51. What is the difference between authentication and authorization?
52. Walk me through the complete login flow from the admin browser to the API.
53. Why JWT over session-based auth? What are the trade-offs?
54. What algorithm does your JWT use? Why HS256 and not RS256?
55. What is the difference between HS256 and RS256? When would you choose each?
56. What is stored inside your JWT payload? What should never be stored in a JWT?
57. Your JWT expires in 7 days. How did you decide on that duration?
58. What happens when a JWT expires mid-session? How does the user experience it?
59. How does `updateSession()` work? Is it a sliding window or fixed expiry?
60. What is a refresh token? Do you use one? Should you?
61. Why `httpOnly` cookies instead of `localStorage`?
62. What is XSS? How does `httpOnly` protect against it?
63. What is CSRF? Are you vulnerable to it? How does `sameSite: "lax"` help?
64. What does the `secure` flag on cookies do? Why is it only set in production?
65. What does `domain: ".skillyards.in"` do? How does subdomain cookie sharing work?
66. How does the Admin app (port 3002) send cookies to the API (port 3000) in local development?
67. What is the `jose` library? Why not `jsonwebtoken`?
68. What happens if two users have the same JWT secret? Can User A impersonate User B?
69. Your fallback secret is `"skillyards_secret_key_change_me_in_prod"`. What's the risk?
70. How would you implement JWT revocation without a database lookup on every request?

### Authorization (AuthZ)

71. Explain your RBAC model. What are the 5 roles and their permissions?
72. What is the difference between RBAC, ABAC, and ACL?
73. Walk through what happens when a SALES user hits `GET /api/students/{id}`. Every step.
74. What is the "default deny" principle? Where do you implement it?
75. Why is SALES access set to `SALES_UNASSIGNED_DENY`? What's the V2 plan?
76. How does `canAccessStudent` differ from `canAccessReceipt`? Why two separate policies?
77. What is the `INTERNAL` role? How is it different from ADMIN?
78. How does `internalServiceOnly` authentication work? Why not use JWT for service-to-service?
79. What is the Principle of Least Privilege? How does your system implement it?
80. If a user's role changes from ADMIN to STAFF, what happens to their existing JWT?
81. Can a STUDENT access another student's data? Trace the exact code path that prevents it.
82. What is "Broken Object Level Authorization" (BOLA)? Is your system vulnerable?
83. Why does `createProtectedRoute` load the resource BEFORE checking authorization?
84. What is "Insecure Direct Object Reference" (IDOR)? How does your receipt endpoint prevent it?
85. If you remove the `policy` parameter from `createProtectedRoute`, what breaks?
86. How would you implement "SALES can only see students assigned to them"?
87. What database changes are needed for the assignment-based SALES access?
88. How would you add a new role (e.g., ACCOUNTANT who can only see payments)?
89. What is privilege escalation? How could it happen in your system?
90. Should authorization logic live in the middleware or the service layer? What did you choose and why?

### Cross-Cutting Security

91. What is the `x-request-id` header? Why do you generate one for every request?
92. How does request correlation help in debugging production issues?
93. What information do you log on every auth decision? Is that a privacy concern?
94. What is the OWASP Top 10? Which items does your system address?
95. How would you implement an audit log for all admin actions?

---

## Section 3: Database Design & Drizzle ORM (55 Questions)

### Schema Design

96. Why PostgreSQL over MongoDB for this project?
97. What is database normalization? Is your schema normalized? To what normal form?
98. Why is `totalFee` and `finalFee` stored on the `students` table instead of computed?
99. What's the difference between `totalFee` and `finalFee`? What does the gap represent?
100.  Why does `payments.installmentId` exist if you also have `payment_allocations`?
101.  Why is `payments.installmentId` nullable with `onDelete: "set null"` but `payment_allocations.installmentId` uses `onDelete: "cascade"`?
102.  What is a self-referencing foreign key? Where do you use one (hint: `plans.previousPlanId`)?
103.  Why does `plans.previousPlanId` exist? What flow does it support?
104.  What is the purpose of the `payment_allocations` table? Why not just link payments directly to installments?
105.  What happens to payments if a student is deleted? (Trace `onDelete: "cascade"`)
106.  Why is `receipt_number` a text field instead of an auto-incrementing integer?
107.  What is the format of `receipt_number`? Why `SY-YYYY-NNNN` instead of a raw number?
108.  How do you generate sequential receipt numbers? Is it thread-safe?
109.  What is a race condition in receipt number generation? How could two payments get the same number?
110.  How would you fix the receipt number race condition? (Database sequence vs atomic counter)
111.  Why store `questionsSnapshot` as JSONB instead of a separate table with foreign keys?
112.  What are the trade-offs of JSONB vs relational tables for test snapshots?
113.  Why is `testQuestions.id` a `text` field instead of UUID?
114.  What is the `pdfFailures` table for? Why is it separate from the `payments` table?
115.  Why does the `payments` table have `receiptJobId`, `receiptRequestedAt`, and `receiptStatus`? What problem do they solve together?

### Indexes

116. What indexes exist on the `payments` table? Why each one?
117. When would you add a composite index? Give an example.
118. What is the difference between a B-tree index and a hash index?
119. Does adding an index slow down writes? Why?
120. How do you decide which columns to index?
121. What is a covering index? Do you use any?
122. What is index bloat? How do you handle it in PostgreSQL?

### Drizzle ORM

123. Why Drizzle over Prisma? What are the specific advantages?
124. What is the difference between Drizzle's query builder and Prisma's client API?
125. How does `drizzle-orm/neon-http` differ from `drizzle-orm/pg`? Why does it matter for Vercel?
126. What is a connection pool? Why does Neon use an HTTP driver instead of a TCP pool?
127. Show me how you write a LEFT JOIN in Drizzle. (Example: `getStudentsWithPayments`)
128. How do you do raw SQL in Drizzle? (Example: `sql` template literals)
129. How do you handle transactions in Drizzle with Neon's HTTP driver?
130. What is the N+1 problem? Does `getPaymentsWithAllocations` have it? How did you solve it?
131. How does `inArray` work in Drizzle? Where do you use it?
132. What is `COALESCE` in SQL? Where do you use it in your repository layer?
133. Explain the `GROUP BY` query in `getStudentsWithPayments`. What does it aggregate?
134. What is the `.returning()` clause? Why do you use it after every `INSERT`?
135. How do you handle database migrations with Drizzle?
136. What happens if you change a schema but don't run a migration?
137. How do you seed initial data (e.g., test questions)?

### Data Integrity

138. What is referential integrity? How do foreign keys enforce it?
139. What is `onDelete: "cascade"` vs `onDelete: "set null"` vs `onDelete: "restrict"`?
140. If you delete a plan, what happens to its installments? What happens to the payment allocations?
141. Can you have a payment allocation without a valid payment? Why or why not?
142. What is an orphaned record? How does your schema prevent them?
143. What is eventual consistency? Where does it apply in your system?
144. Is your payment + allocation creation wrapped in a transaction? What happens if the allocation insert fails after the payment insert succeeds?
145. How would you add a transaction to the `addPayment` flow?
146. What is a deadlock? Could it happen in your payment allocation logic?
147. What is optimistic locking? Does `claimPaymentForGeneration` use it?
148. What is pessimistic locking? When would you use `SELECT FOR UPDATE`?
149. What is a write-ahead log (WAL)? How does PostgreSQL use it?
150. What is ACID? How does each property apply to your payment system?

---

## Section 4: Payment & Financial Logic (50 Questions)

### Payment Flow

151. Walk me through the complete flow of recording a ₹5,000 payment for a student with 3 unpaid installments of ₹2,000 each.
152. What is the auto-allocation algorithm? Describe it step by step.
153. Why does auto-allocation process installments sorted by `dueDate` ascending?
154. What happens if a payment amount exceeds all outstanding installments?
155. What is the `touchedInstallments` Set? Why not just update all installments?
156. What is an "unallocated amount"? When does it occur?
157. Can a single payment be split across multiple installments? Show the data model.
158. Can multiple payments contribute to a single installment? Show the data model.
159. What is the relationship between `payments`, `payment_allocations`, and `installments`? Draw it.
160. Why is this a many-to-many relationship (payments ↔ installments) mediated by `payment_allocations`?
161. What validation does `createPaymentSchema` enforce? Why Zod over manual validation?
162. What payment methods are supported? How do you validate them?
163. What happens if someone sends `method: "bitcoin"` in the request body?
164. How is `receiptNumber` generated? Is it globally unique or per-year?
165. What is the race condition risk in `getNextReceiptNumber`? How would you fix it with a DB sequence?

### Installment Status Machine

166. What are the possible statuses for an installment? (`scheduled`, `partial`, `paid`)
167. How does `updateInstallmentStatus` determine the correct status?
168. Can an installment go from `paid` back to `partial`? Under what circumstances?
169. What happens to installment statuses when a refund is processed? (Trick question — there is no refund logic yet)
170. If `totalPaid` for an installment equals `amountDue`, what status is set?
171. If `totalPaid` is 0, what status is set? What if it was previously `partial`?

### Plan Types

172. Explain the 4 plan types: `full`, `emi`, `custom`, `flexible`.
173. How does EMI calculation handle remainders? (e.g., ₹10,000 ÷ 3 installments)
174. What validation is performed for `custom` plans? Why must the sum equal `totalAmount`?
175. How does `flexible` differ from `custom`? What is the key constraint difference?
176. Can you add installments to a `custom` plan after creation? Why or why not?
177. What is `addFlexibleInstallment`? What validation does it perform?
178. What happens if you try to add a ₹5,000 installment to a flexible plan that only has ₹2,000 remaining?
179. Can a student have multiple plans? How does `getPlanByStudentId` handle this?
180. What is `previousPlanId`? When would a student need a new plan?

### Ledger

181. What is the "ledger" in your system? What data does it contain?
182. How is `totalDue` calculated? Which table does it come from?
183. How is `totalPaid` calculated? Which table does it come from?
184. What is `pending`? How is it computed?
185. What is `credit`? When does a student have a credit balance?
186. Why does `getStudentLedger` accept an optional `preStudent` parameter?
187. Is the ledger a materialized view or computed on-the-fly? What are the trade-offs?
188. If you had 10,000 payments for a single student, would the ledger query be slow? How would you optimize?
189. What is a materialized view? How would you implement one for the ledger?
190. How does the ledger snapshot end up on the receipt? Trace the full data flow.

### Financial Edge Cases

191. A student pays ₹10,000 but has no installments yet. What happens?
192. A student pays ₹0. What does the validation catch?
193. A student pays ₹1 for an installment of ₹50,000. What status does the installment get?
194. Two admins simultaneously record a payment for the same student. What happens?
195. A payment is recorded but the database crashes before allocations are created. What's the inconsistency?
196. How would you implement an "undo payment" feature?
197. How would you support partial refunds?
198. How would you handle currency conversion if you expand internationally?
199. What is double-entry bookkeeping? How does your system compare?
200. Why are amounts stored as integers (paise equivalent) instead of floats?

---

## Section 5: Distributed PDF Generation (55 Questions)

### Architecture

201. Why can't you generate PDFs directly on Vercel?
202. What is the execution time limit on Vercel serverless functions?
203. Why Puppeteer? What alternatives did you consider?
204. What is the "fire-and-forget" pattern? Where do you use it?
205. Draw the complete sequence diagram for PDF generation from trigger to delivery.
206. What happens when the admin first requests a receipt PDF? Walk through every service call.
207. What does "202 Accepted" mean in the context of your receipt endpoint?
208. What is the `Retry-After` header? How does the client use it?
209. Why is PDF generation asynchronous instead of synchronous?
210. What would happen if you made the PDF generation synchronous? What user experience issues arise?

### State Machine

211. What are the possible `receiptStatus` values? Draw the state machine.
212. What triggers the transition from `pending` to `generating`?
213. What triggers the transition from `generating` to `ready`?
214. What triggers the transition from `generating` to `failed`?
215. Can a receipt go from `ready` back to `generating`? When?
216. What is a "stale lock"? How do you detect one?
217. What is the 60-second threshold for stale detection? How did you choose that number?
218. What does `resetStaleLock` do? What status does it set?

### Concurrency & Ownership

219. What is `receiptJobId`? Why does it exist?
220. Explain the ownership validation pattern in `completePaymentGeneration`.
221. What happens if two PDF generation requests fire simultaneously for the same payment?
222. What is `claimPaymentForGeneration`? What SQL condition prevents double claims?
223. What is an "atomic claim"? How does `WHERE receipt_status != 'generating'` make it atomic?
224. What happens if a stale callback arrives after a new generation has started? How does `jobId` prevent corruption?
225. What is the ABA problem? Does your system have it?
226. Scenario: Job A starts, times out, Job B starts, Job A's callback arrives. What happens?
227. Why is `eq(payments.receiptJobId, jobId)` in the WHERE clause of `completePaymentGeneration`?

### PDF Worker (In-Process Queue)

228. What is the `pdf.worker.js` file? Is it a separate process or in-process?
229. Why use `global[GLOBAL_KEY]` for worker state? What problem does it solve in dev mode?
230. What is `MAX_CONCURRENT = 5`? Why limit concurrency?
231. What is `MAX_RETRIES = 2`? What's the retry backoff strategy?
232. What is `JOB_TIMEOUT = 25000`? Why 25 seconds?
233. How does `Promise.race` implement the timeout? What happens to the actual PDF generation if the timeout fires first?
234. What is the "starvation guard" interval? Why does it call `processQueue()` every 5 seconds?
235. What is the "cache cleanup" interval? Why expire entries after 10 minutes?
236. What is `readyCache`? What data does it store?
237. How does `enqueuePdfGeneration` prevent duplicate jobs? (Two checks: `inProgress` Set and queue scan)
238. What is the queue processor's flow? How does `processQueue()` work?
239. What happens when a job fails after all retries? What gets logged to `pdf_failures`?
240. Is the in-process queue durable? What happens on server restart?
241. If you needed a durable queue, what technology would you use? (Redis, RabbitMQ, SQS?)

### PDF Service (Railway)

242. What does the PDF service receive? (HTML, key, jobId)
243. What does the PDF service do with the HTML? (Puppeteer → render → screenshot → PDF)
244. Where does the generated PDF get stored? (Cloudflare R2)
245. How does the PDF service notify the API that it's done? (Callback POST)
246. What is the callback endpoint? What data does it send?
247. How is the callback authenticated? (x-internal-key header)
248. What happens if the callback fails? Is there a retry?
249. What is the R2 key format? (`receipts/v{version}/{paymentId}.pdf`)
250. What is `receiptVersion`? When would you increment it?
251. What is the `getReceiptStream` function? How does it stream a PDF from R2?
252. Why stream the PDF instead of downloading it to memory first?
253. What is `Content-Disposition`? What's the difference between `inline` and `attachment`?
254. How does the `download=true` query parameter affect the response?
255. What happens when R2 has the file but `receiptStatus` is not `ready`? (Data inconsistency)

---

## Section 6: Security Deep Dive (40 Questions)

### Rate Limiting

256. What is rate limiting? Why do you need it?
257. What algorithm does your rate limiter use? (Sliding window)
258. What is the difference between fixed window, sliding window, token bucket, and leaky bucket?
259. What is your window size? (15 seconds) Why?
260. What is your burst limit? (3 requests) Why?
261. How is the rate limit key constructed? What does `{userId}:{resourceId}` protect against?
262. What is the fallback key for unauthenticated requests? (`anon:{url}`)
263. What is `MAX_RATE_KEYS = 5000`? What happens when the map exceeds it?
264. How does the auto-cleanup work? What is the `cutoff` timestamp?
265. Is in-memory rate limiting effective on Vercel? (No — each instance has its own Map)
266. How would you implement distributed rate limiting? (Redis with INCR + EXPIRE)
267. What is DDoS? Does your rate limiter protect against it?
268. What is the difference between rate limiting and throttling?
269. Should rate limiting be per-user, per-IP, or per-endpoint?
270. What is API abuse? Give an example specific to your system.

### CORS

271. What is CORS? Why does it exist?
272. What is a preflight request? When is it triggered?
273. What is the `OPTIONS` method? Why do some of your routes export an `OPTIONS` handler?
274. What is `Access-Control-Allow-Origin`? Why can't you just set it to `*`?
275. What is `Access-Control-Allow-Credentials`? Why is it `true` in your system?
276. What is the `Vary: Origin` header? Why do you set it?
277. What happens if a request comes from an origin not in your allowlist?
278. Your CORS origins are hardcoded. How would you make them configurable?
279. What is the difference between simple requests and preflighted requests?
280. Can CORS prevent server-side attacks? (No — it's a browser-only mechanism)

### Input Validation

281. Why validate input on the server even if the frontend also validates?
282. What is Zod? How does `safeParse` differ from `parse`?
283. What does `result.error.flatten()` return? Why flatten?
284. What is schema-first validation? How does it prevent injection attacks?
285. What is SQL injection? Is Drizzle ORM vulnerable to it?
286. How does Drizzle's parameterized query builder prevent SQL injection?
287. What is NoSQL injection? Is it relevant to your system? (No — you use PostgreSQL)
288. What is mass assignment? How does Zod prevent it?
289. What happens if someone sends `{ "role": "ADMIN" }` in a student creation request?
290. What is prototype pollution? Is it a risk with `JSON.parse`?

### Infrastructure Security

291. Your `.env.local` has your database URL, API keys, and secrets. What happens if it's leaked?
292. How do you prevent `.env.local` from being committed to Git?
293. What is secret rotation? How would you rotate the JWT secret without logging out all users?
294. What is the principle of defense in depth? How does your system implement it? (Cookie + AuthN + AuthZ + Rate Limit + Validation)
295. What is a man-in-the-middle attack? How does HTTPS prevent it?

---

## Section 7: Node.js & JavaScript (45 Questions)

### Event Loop & Async

296. What is the Node.js event loop? Explain its phases.
297. What is the difference between `process.nextTick`, `setImmediate`, and `setTimeout(fn, 0)`?
298. Your PDF worker uses `setInterval` for heartbeat and cache cleanup. Do these block the event loop?
299. What is the difference between `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`?
300. You use `Promise.all` in `getStudentDetail`. What happens if one of the 4 queries fails?
301. Would `Promise.allSettled` be better for `getStudentDetail`? Why or why not?
302. You use `Promise.race` for PDF timeout. Is the losing promise cancelled? (No — it keeps running)
303. What is a memory leak? How could `setTimeout` in your retry logic cause one?
304. What is backpressure in Node.js streams? Is it relevant to `getReceiptStream`?
305. What is the `Readable` stream from `@aws-sdk/client-s3`? How do you pipe it to an HTTP response?

### Module System

306. What is the difference between CommonJS (`require`) and ESM (`import`)?
307. Your project uses ESM. How do you know? (hint: `import/export` syntax, `type: "module"`)
308. What is `import.meta.url`? Where do you use it? (receipt.service.js for `__dirname`)
309. Why do you need `fileURLToPath` and `path.dirname` to get `__dirname` in ESM?
310. What is tree-shaking? Does ESM enable it?

### Error Handling

311. What is the difference between operational errors and programmer errors?
312. How does `createProtectedRoute` handle uncaught exceptions? (try/catch → 500)
313. What is the difference between `throw new Error` and `return Response.json({ error })`?
314. Should you ever `catch` an error and swallow it silently? Where do you do this? (Email sending)
315. What is an unhandled promise rejection? How does Node.js handle it?
316. What is `process.on('uncaughtException')`? Should you use it?

### Performance

317. What is `performance.now()`? Where do you use it? (Student detail timing)
318. What is memoization? Where could you apply it in your system?
319. What is lazy initialization? Where do you use it? (`ensureWorkerBooted`)
320. How does `fs.readFileSync` for receipt assets affect cold start time?
321. Why do you base64-encode the stamp, logo, and font at module load instead of per-request?
322. What is the cost of `JSON.stringify` and `JSON.parse`? Where might it be a bottleneck?

### Closures & Scope

323. How does `getRequestContext` create a closure for logging functions?
324. What is the closure in `checkRateLimit`? How does `rateTracker` persist across calls?
325. Why is `global.rateTracker` used in development? What is the hot-reload problem?
326. What is `global[GLOBAL_KEY]` in the PDF worker? Why not just a module-level variable?

### Language Features

327. What is the `??` (nullish coalescing) operator? Where do you use it?
328. What is optional chaining (`?.`)? Where do you use it? (`req.cookies?.get?.("session")?.value`)
329. What is destructuring? Give 3 examples from your codebase.
330. What is the spread operator? How do you use it for merging headers? (`{ ...headers, ...corsHeaders }`)
331. What is `Array.prototype.reduce`? Where do you use it? (Sum of payments, allocation totals)
332. What is a `Set`? Where do you use it? (`touchedInstallments`, `inProgress`)
333. What is a `Map`? Where do you use it? (`rateTracker`, `readyCache`, `installmentMap`)
334. What is the difference between `Map` and a plain object? Why use `Map` for caches?
335. What is `Symbol`? Do you use it anywhere?
336. What is `WeakMap`/`WeakRef`? When would they be useful?
337. What is `structuredClone`? When would you use it instead of `JSON.parse(JSON.stringify())`?
338. What is `crypto.randomUUID()`? Where do you use it?
339. What is `TextEncoder`? Where do you use it? (Encoding JWT secret)
340. What does `padStart(4, "0")` do? Where do you use it? (Receipt number formatting)

---

## Section 8: Testing & Debugging (30 Questions)

### Testing Strategy

341. How would you unit test `addPayment`? What would you mock?
342. How would you test the auto-allocation algorithm with edge cases?
343. How would you integration test the receipt generation flow?
344. What is the difference between unit, integration, and end-to-end tests?
345. How would you test `createProtectedRoute` in isolation?
346. How would you test that a SALES user cannot access another student's receipt?
347. How would you mock the database in tests? (Mock the `db` parameter)
348. How would you test the rate limiter? What time-dependent behavior needs mocking?
349. How would you test the PDF worker queue? What about the retry logic?
350. What is test coverage? What percentage would you target for this system?
351. What is a test fixture? How would you create one for a student with a plan, installments, and payments?
352. What is property-based testing? How could you apply it to the payment allocation algorithm?
353. What is snapshot testing? Is it useful for your HTML receipt template?
354. How would you test the concurrent `claimPaymentForGeneration` behavior?
355. What is a test double? What's the difference between mocks, stubs, spies, and fakes?

### Debugging

356. How would you debug a 401 error in production? What logs would you look for?
357. How does `requestId` help you trace a request across logs?
358. What is the purpose of the `[TRACE]`, `[JOB]`, `[WORKER]` log prefixes?
359. How would you debug a receipt stuck in `generating` status?
360. How would you debug a payment that was created but has no allocations?
361. How would you monitor the health of the PDF service from the API side?
362. What is structured logging? How do your `ctx.log`, `ctx.warn`, `ctx.error` implement it?
363. What is log aggregation? What tool would you use? (Datadog, Grafana, CloudWatch)
364. How would you set up alerting for repeated `PDF_SERVICE_TRIGGER_FAILURE` errors?
365. What is a flame graph? When would you use one to debug performance?

### Monitoring

366. What metrics would you track for this system? (Latency, error rate, queue depth, cache hit rate)
367. How would you implement a health check endpoint? What should it verify?
368. What is the difference between liveness and readiness probes?
369. How would you measure the P99 latency of the `getStudentDetail` endpoint?
370. What is observability? What are its three pillars? (Logs, Metrics, Traces)

---

## Section 9: Infrastructure & DevOps (30 Questions)

### Vercel

371. How does Vercel deploy Next.js API routes? Are they individual Lambda functions?
372. What is a cold start? How does it affect your API's first request?
373. What is the maximum execution time on Vercel? Can you increase it?
374. How does Vercel handle environment variables? Are they encrypted at rest?
375. What is edge runtime vs Node.js runtime? Which does your API use?

### Railway

376. Why Railway for the PDF service? What alternatives did you consider?
377. How does Railway differ from Vercel for long-running processes?
378. What happens when Railway restarts your PDF service? What state is lost?
379. How do you deploy the PDF service? Is it a Docker container?
380. How do you monitor the PDF service's memory usage? (Puppeteer is memory-hungry)

### Cloudflare R2

381. What is R2? How does it differ from S3?
382. Why R2 over S3? (No egress fees)
383. How is R2 authenticated? (Access Key + Secret Key)
384. What is `forcePathStyle: true`? Why is it needed for R2?
385. What is the durability guarantee of R2? (11 nines)
386. How would you add a CDN in front of R2 for faster receipt downloads?

### Neon

387. What is Neon? How does it differ from RDS or self-hosted PostgreSQL?
388. What is the "serverless" aspect of Neon? (Auto-scaling, auto-suspend)
389. What happens when Neon auto-suspends your database? How does the first query behave?
390. What is Neon's connection pooler? Why does it matter for serverless?
391. What is the HTTP driver? Why use it instead of a TCP connection?

### CI/CD & Git

392. How is the monorepo managed? What tool? (npm workspaces / Turborepo)
393. How do you deploy changes to the API without affecting the admin app?
394. What is a Vercel preview deployment? How does it work with Git branches?
395. What Git branching strategy do you use?
396. How do you run database migrations in production?

---

## Section 10: Behavioral & System Thinking (20 Questions)

397. Walk me through how you designed the payment allocation algorithm. What was your thought process?
398. What was the hardest bug you encountered on this project? How did you debug it?
399. How did you decide between building the PDF service in-house vs using a third-party API?
400. If you had to explain this system to a non-technical stakeholder, how would you describe it?
401. What trade-off did you make between security and developer experience?
402. How do you handle feature requests that conflict with the current architecture?
403. If the system goes down at 3 AM, what's your incident response process?
404. How do you prioritize technical debt vs new features?
405. What was the most impactful code review feedback you received on this project?
406. How do you ensure code quality in a solo/small-team project?
407. If you had 2 more engineers joining, how would you onboard them to this codebase?
408. What monitoring would you add before this system handles real money?
409. How would you explain "eventual consistency" to a business stakeholder worried about receipt delays?
410. What would you do if you discovered a security vulnerability in production?
411. How do you decide when to refactor vs when to ship?
412. What is the bus factor of this project? How would you improve it?
413. How did you handle the transition from an unsecured API to the secure-by-default architecture?
414. What is your approach to logging? How much is too much?
415. If a client reports "receipts are slow," how do you diagnose the root cause?
416. What would you build differently if you were starting this project today?

---

_Total: **416 questions** across 10 sections._
_Every question maps directly to a real implementation decision in the Skillyards codebase._
