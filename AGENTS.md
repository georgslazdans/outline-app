# AGENTS.md

Next.js 14 (App Router) static-export PWA that detects contours in images with OpenCV and builds Gridfinity boxes with a CAD editor. Single package, npm, `@/*` path alias maps to repo root.

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` — `next build && next-image-export-optimizer`; emits static site in `out/` (`output: "export"` in `next.config.mjs`, no server runtime). `npm run start` only works if you change `output` to `"standalone"`.
- `npm run lint` — `next lint`. No typecheck script; run `npx tsc --noEmit`.
- `npm test` — vitest (jsdom). Unit tests are colocated as `lib/**/*.test.ts`; run one with `npx vitest run lib/data/Point.test.ts`.
- `npm run ui-test` — Playwright (`tests/`). The config auto-starts `npm run dev` with `reuseExistingServer: false`, so port 3000 must be free. Run one spec with `npx playwright test tests/basic-box-from-image.spec.ts`. Chromium launches with `--enable-unsafe-swiftshader` (needed for headless WASM/WebGL) — don't remove it.
- `postinstall` copies `replicad-opencascadejs`'s WASM into `public/`. Never install with `--ignore-scripts`; `public/replicad_single.wasm`, `public/sw*.js`, and `public/nextImageExportOptimizer/` are gitignored build outputs.

## Architecture

- User flow: `/` (image upload) → `/calibration` → `/details` → `/contours` → `/editor` → `/models`. `app/*/page.tsx` files are thin; real UI lives in `components/<area>/`.
- Heavy compute runs in Web Workers over Comlink, not on the main thread:
  - `lib/opencv/Worker.ts` (OpenCV contour detection; client wrapper `components/calibration/worker/OpenCvWorker.tsx`, processing steps in `lib/opencv/processor/steps/`)
  - `lib/replicad/Worker.ts` (replicad CAD geometry, STL/STEP export; wrapper `components/editor/ReplicadWorker.tsx`)
  - Worker APIs are exposed via `Comlink.expose` — update both sides when changing worker calls.
- Persistence is IndexedDB (`react-indexed-db-hook`): stores `details`, `models`, `preferences`, `files` in `db/DbConfig.ts`. Schema changes require bumping `version` there **and** adding an entry to `MIGRATION_LIST` in `db/migration/Migrations.ts`.
- i18n is custom, not next-intl: `getDictionary()` in `app/dictionaries/` is called (hardcoded `"en"`) in `app/layout.tsx` and the dictionary is passed down as a `dictionary` prop. Add keys to both `en.json` and `lv.json`.
- Static content pages are MDX: `app/about/page.mdx`, `app/changelog/page.mdx`, `app/instructions/page.mdx`.
- PWA via Serwist: service worker source is `app/sw.ts`, built to `public/sw.js`. `next.config.mjs` has hand-tuned webpack config for WASM (`asset/resource`, `asyncWebAssembly`) and browserified node-module fallbacks — treat changes there carefully.

## Code style

- Keep comments to a minimum — code should read on its own. A comment explains *why* something is done (a non-obvious constraint, a workaround, an assumption), never restating *what* the code already says.

## Workflow

- PRs target `develop`, not `master`. Merging to `master` redeploys the live app (see `CONTRIBUTING.md`).
- Releases: bump `version` in `package.json` and add a matching entry at the top of `app/changelog/page.mdx` (the in-app version badge reads `package.json`).
