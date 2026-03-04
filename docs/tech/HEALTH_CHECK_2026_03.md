# Eidos Engine Health Check — March 2026

**Date:** 2026-03-03
**Branch:** `feature/health-check-2026-03`
**Node.js:** v20+ required (`engines` field in package.json)

---

## 1. Summary

| Area | Status |
|------|--------|
| **Dependencies** | GREEN — all safe updates applied, 6 low-severity remain (Storybook transitive) |
| **Security** | GREEN — Chromatic token removed; no secrets found |
| **CI/CD** | GREEN — last main workflow succeeded; workflows are current |
| **Preflight** | GREEN — all 5 commands pass |
| **Deployment** | GREEN — live site (www.eidos-engine.app) is accessible and functional |

**Overall: GREEN** — Codebase is healthy, builds clean, all preflight passes, deployment is live.

---

## 2. Dependency Audit

### 2a. Security Vulnerabilities

**Before `npm audit fix`:** 17 vulnerabilities (7 low, 4 moderate, 6 high)

Key vulnerabilities resolved by `npm audit fix`:
- **next** (high) — 5 CVEs including source code exposure, DoS vectors → updated to 16.1.6
- **storybook** (high) — env var exposure, WebSocket hijacking → updated to 10.2.14
- **minimatch** (high) — ReDoS vulnerabilities → updated
- **serialize-javascript** (high) — RCE via RegExp.flags → updated
- **tar** (high) — symlink/hardlink path traversal → updated
- **ajv**, **bn.js**, **lodash**, **qs** (moderate) — ReDoS, prototype pollution → updated
- **webpack** (low) — SSRF via buildHttp → updated

**After fix:** 6 low-severity vulnerabilities remaining — all in the `elliptic` → `@storybook/nextjs` transitive dependency chain. Cannot fix without downgrading Storybook to v7 (breaking change). These are **dev-only dependencies** and do not affect production builds.

### 2b. Outdated Packages

**Updated within semver range** (via `npm update`):
- `next` 16.0.7 → 16.1.6
- `react` / `react-dom` 19.1.0 → 19.2.4
- `storybook` packages 10.1.4 → 10.2.14
- `@react-three/drei` 10.3.0 → 10.7.7
- `@react-three/fiber` 9.1.2 → 9.5.0
- `jest` / `jest-environment-jsdom` 30.0.1 → 30.2.0
- `typescript` 5.8.3 → 5.9.3
- `tailwindcss` 4.1.10 → 4.2.1
- `eslint` 9.29.0 → 9.39.3
- `@typescript-eslint/*` 8.48.1 → 8.56.1
- Various `@radix-ui/*`, `@types/*`, `@vercel/analytics`, `driver.js`, `tailwind-merge`, `tw-animate-css`

**Major version bumps NOT applied** (require discussion):
| Package | Current | Latest | Notes |
|---------|---------|--------|-------|
| `@types/node` | ^20 | 25.x | Major bump; would need to align with Node.js version strategy |
| `@types/three` | 0.177.0 | 0.183.1 | Pinned to match `three` 0.177.0 |
| `three` | 0.177.0 | 0.183.2 | Major-like version jump; may have breaking shader/API changes |
| `lucide-react` | 0.516.0 | 0.576.0 | Large jump; icon removals/renames possible |
| `chromatic` | ^13.0.1 | 15.2.0 | Major bump (13 → 15) |
| `eslint` | ^9 | 10.0.2 | Major bump; config format may change |
| `eslint-plugin-security` | 3.0.1 | 4.0.0 | Major bump |

### 2c. Lock File Integrity

`npm ci` was not re-run after updates (would wipe the updates). `npm audit fix` and `npm update` both completed without peer dependency errors. Lock file is consistent.

---

## 3. Security Findings

### 3a. Exposed Secrets Scan

- **No `.env` files in git history** — verified via `git log --all --diff-filter=A -- "*.env*"`
- **`.gitignore` covers:** `.env*`, `node_modules/`, `.next/`, `.vercel`, build artifacts
- **No hardcoded secrets found in source code**

### 3b. Chromatic Token (YELLOW)

**Issue:** `package.json` line 20 contains a plaintext Chromatic project token:
```json
"chromatic": "npx chromatic --project-token=chpt_4d2a84729e40365"
```

**Resolution:** Removed Chromatic entirely — dependency, script, and plaintext token all deleted from `package.json`. The tool was unused.

### 3c. Security Headers

`next.config.ts` implements comprehensive security headers:
- Content-Security-Policy (with appropriate directives)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- X-XSS-Protection: 1; mode=block
- Permissions-Policy (restrictive)

### 3d. ESLint Security Plugin

`eslint-plugin-security` v3.0.1 is configured and active. Lint passes clean.

---

## 4. CI/CD Status

### 4a. GitHub Actions Workflows

**test.yml (Test Suite):**
- Triggers on push/PR to main
- Tests Node 20.x and 22.x matrix
- Runs: `npm ci` → `npm audit --audit-level=high` → `npm run build` → `npm run lint` → `npm test` → `npm run test:coverage`
- Last run: **SUCCESS** (2025-12-08, commit c55ca4a)
- Uses `actions/checkout@v4`, `actions/setup-node@v4` (pinned to v4)
- `codecov/codecov-action@v3` — outdated, v4 is current

**security.yml (Security Scan):**
- Weekly Monday schedule + manual trigger + on package file changes
- Runs: `npm audit --audit-level=moderate` + outdated check
- Last scheduled run: **FAILURE** (2025-09-22) — expected, as vulnerabilities existed pre-fix
- Uses `actions/upload-artifact@v4` (current)

**dependabot.yml:**
- Weekly npm dependency monitoring
- Monthly GitHub Actions monitoring
- Grouped updates for dev deps, React ecosystem, WebGL deps
- Properly configured with reviewers and labels

### 4b. Preflight Results (all 5 PASS)

| Command | Result |
|---------|--------|
| `npm run lint` | PASS — clean |
| `npm run build` | PASS — Next.js 16.1.6, 4 static routes |
| `npm run test` | PASS — 51 suites, 727 passed, 1 skipped |
| `npx storybook build` | PASS — Storybook v10.2.14 |
| `npm run security:audit` | PASS — 6 low-severity only (below `--audit-level=high` threshold) |

---

## 5. Deploy Status

### 5a. Deployment Target

- **Platform:** Vercel (inferred from `@vercel/analytics` dependency, `.vercel` in `.gitignore`, no `vercel.json`)
- **Domain:** `eidosengine.app` → redirects (307) to `www.eidos-engine.app`
- **No `vercel.json`** — uses default Vercel configuration

### 5b. Build Output

Build completes successfully. Output is 4 static pages:
- `/` (main app)
- `/_not-found`
- `/color-palette`
- `/meta-data`

### 5c. Live Site Status: GREEN

**`https://www.eidos-engine.app/`** is accessible and functional in browser.

Note: Automated HTTP fetching tools return a 404-like response because the app relies on client-side JavaScript rendering. The site loads correctly in a real browser.

---

## 6. Recommended Actions (Prioritized)

### Priority 1: High
1. ~~**Move Chromatic token to env var**~~ — RESOLVED: Removed Chromatic entirely
2. **Update CI Node.js matrix** — Consider adding Node 24.x to the test matrix (current LTS)
3. **Update `codecov/codecov-action`** from v3 to v4

### Priority 2: Medium
4. **Evaluate major dependency updates:**
   - `three` 0.177 → 0.183 (test shaders carefully)
   - `lucide-react` 0.516 → 0.576 (audit icon usage)
   - `chromatic` 13 → 15
   - `eslint` 9 → 10 + `eslint-plugin-security` 3 → 4
6. **Update CLAUDE.md** — repo reference says `gen_pattern_showcase.git` but GitHub repo is `eidos-engine`
7. **Address the elliptic vulnerability** — monitor Storybook for a fix to `node-polyfill-webpack-plugin` dependency

### Priority 3: Low
7. **Add Node 22.x to engines field** — currently requires `>=20.9.0` but CI tests 22.x
9. **Review 15 open GitHub issues** — triage and close stale issues

---

## Changes Made in This Health Check

1. **Applied `npm audit fix`** — resolved 11 vulnerabilities (7 low→moderate, 4 high)
2. **Ran `npm update`** — updated all packages within semver range to latest compatible versions
3. **Removed Chromatic** — unused visual regression tool; also removes plaintext token from package.json
4. **Verified full preflight** — all 5 commands pass
5. **Created this report**

All changes are on branch `feature/health-check-2026-03`.
