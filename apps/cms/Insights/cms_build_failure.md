# CMS Build Failure – Root Cause, Fix & Purpose

## Purpose of this Document

This document exists to:

- Explain a critical CMS deployment failure and its resolution
- Help future contributors understand **why this setup exists**
- Prevent reintroducing the same class of bugs
- Clarify how dependencies behave in a **monorepo with multiple build systems**

> This is not just a bug fix — this is a system-level learning reference.

---

## Context

Skillyards is structured as a **monorepo** with multiple apps:

- `apps/website` → Next.js (frontend)
- `apps/api` → backend services
- `apps/cms` → Sanity Studio (content management)

Each app:

- Builds independently
- Has its own dependency graph
- Uses different tooling

---

## Problem Statement

The `skillyards-cms` project was **failing on Vercel preview deployments**, while:

- Other apps deployed successfully
- Local development worked inconsistently

### Error observed:

```
RollupError: Could not resolve entry module
"node_modules/styled-components/dist/styled-components.browser.esm.js"
```

---

## Root Cause

### 1. Hidden Peer Dependency

The plugin:

```
@sanity/code-input
```

requires:

```json
"styled-components": "^6"
```

But:

- Peer dependencies are **not installed automatically**
- They must be explicitly installed in the workspace

---

### 2. Incorrect Assumptions About Dependencies

Initially:

- `styled-components` existed in root
- Assumed it would work for CMS

Reality:

> In a monorepo, each app must explicitly declare its own dependencies

---

### 3. Build System Mismatch

- Website → Next.js
- CMS → Sanity Studio (Vite + Rollup internally)

This caused confusion because:

- Errors looked unfamiliar
- Fixes were attempted assuming Next.js behavior

---

### 4. Version + Resolution Conflict

- Plugin required `styled-components v6`
- Vercel build (Rollup) could not resolve its internal module path

---

## Solution

### Step 1: Install required dependency in CMS

```bash
cd apps/cms
npm install styled-components@^6
```

---

### Step 2: Align Sanity versions with runtime

Upgrade to avoid version drift:

- `sanity` → latest
- `@sanity/vision` → latest

---

### Step 3: Fix module resolution (critical)

Update `sanity.config.js`:

```js
vite: (config) => {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve?.alias,
      'styled-components': 'styled-components/dist/styled-components.browser.esm.js',
    },
  }
  return config
}
```

This ensures:

- Rollup (via Vite) can correctly resolve styled-components
- Build works consistently in Vercel

---

## Result

- CMS builds successfully on Vercel
- Local dev and production are aligned
- All apps deploy independently without conflict

---

## Impact

### Before

- CMS preview deployments failing
- Confusing behavior between local and production
- Time lost debugging environment-specific issues

### After

- Stable deployment pipeline
- Clear dependency ownership per app
- Improved confidence in releases

---

## Key Takeaways

### 1. Peer dependencies are not optional

If a plugin requires something:

> You must install it explicitly

---

### 2. Monorepo ≠ shared dependencies

Each app is its own system:

- Own build
- Own dependencies
- Own runtime

---

### 3. One repo can have multiple build systems

- Next.js ≠ Sanity Studio
- Webpack ≠ Vite

Do not assume fixes transfer across apps

---

### 4. Production is the source of truth

> If it fails on Vercel, it is broken — regardless of local success

---
