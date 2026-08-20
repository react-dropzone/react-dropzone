# AGENTS.md

Guidance for AI coding agents in this repo. Human contributors: see the
[Contribute](./README.md#contribute) section of the README.

This is `react-dropzone`: a React component (`<Dropzone>`) and hook (`useDropzone`) for building
HTML5 drag-and-drop file upload zones. It is a small, published npm library written in TypeScript.
Its only runtime dependencies are its sister packages `attr-accept` (MIME/extension matching) and
`file-selector` (extracting files from drag, paste, and File System Access API events); think twice
before adding another, and prefer fixing a file-extraction bug upstream in `file-selector`.

The toolchain is the Rust-based oxc stack: [oxlint](https://oxc.rs/) to lint,
[oxfmt](https://oxc.rs/) to format, [tsdown](https://tsdown.dev/) (Rolldown + oxc) to build and emit
declarations, and [Vitest](https://vitest.dev/) to test; TypeScript (`tsc --noEmit`) type-checks.
The docs site is built with [Vocs](https://vocs.dev/) and smoke-tested with
[Playwright](https://playwright.dev/). There is no Babel, ESLint, Prettier, or Rollup; do not
reintroduce them.

## Workflow

- Clarify the design before implementing. For anything non-trivial, agree on the approach first.
- One unit of change per commit. Never mix unrelated changes. Present the change for review before
  committing.
- Every change ships with tests. Run local CI before calling it done, and do not claim it passes
  without running it.
- Verify against the code and the tools: read before you answer, run before you assert.

Local CI (must be green before review):

```shell
npm run type-check      # tsc --noEmit, plus the type-tests project
npm run lint            # oxlint
npm run lint:type-aware # oxlint --type-aware
npm run format:check    # oxfmt --check
npm run build           # tsdown -> dist/
npm run test:cov        # vitest with coverage
```

The prek git hooks (installed via `npm install`) auto-run oxfmt and oxlint on staged code and
validate the commit message, but they do not run type-check, the build, or the tests, and they do
not format Markdown. Run the commands above yourself, and run `npm run format` after editing
docs/Markdown or CI's `format:check` will fail on it.

If you touch the docs or a docs dependency, also run the browser smoke test:

```shell
npm run test:docs:e2e   # builds the docs and checks each key route hydrates (needs Chromium)
```

## Writing: code, comments, docs, commits

- Concise and to the point. No fluff. Explain the non-obvious; do not narrate the obvious.
- ASCII only. No em-dash and no `--`; write `-`. Use `->` not the arrow glyph, `!=` not the
  not-equal glyph, and so on.
- Comments justify _why_, not _what_. Delete any comment that restates the code.
- Formatting is not a matter of taste: oxfmt owns it. Run `npm run format` rather than
  hand-formatting. House style (`.oxfmtrc.json`) is double quotes, two-space indent, semicolons, no
  trailing commas, no bracket spacing (`{a, b}`), arrow parens omitted when possible, and a
  120-column print width.

## Commits

- [Conventional Commits](https://www.conventionalcommits.org/); the type set is enforced by a
  commit-msg hook and consumed by semantic-release (see `.releaserc.json`). Write the subject in the
  present tense, imperative voice: `feat: expose drag file rejections`, not `added` or `adds`.
- `feat:`/`fix:`/`perf:` cut a release; `feat!:` or a `BREAKING CHANGE:` footer cuts a major.
  `chore:`/`ci:`/`docs:`/`test:`/`refactor:`/`style:`/`build:` do not. Pick the type with that in
  mind.
- Keep the body minimal, or omit it. A good subject plus the diff is usually enough; add a body only
  for what the code cannot show (why, a trade-off, a non-obvious consequence). Never restate the
  change or narrate the diff.
- Disclose AI with an `Assisted-by: Claude:claude-opus-4-8` trailer. Never `Co-Authored-By`, and
  never add a human's `Signed-off-by`.

## Tests

- Unit tests live beside the source as `src/**/*.spec.{ts,tsx}` and run under Vitest with the jsdom
  environment (globals on; setup in `test-setup.js`).
- Render with `render`/`renderHook` from `@testing-library/react` and assert with jest-dom matchers.
  Drive real DOM events (`fireEvent`) and build drop payloads with `file-selector`'s `fromEvent`; do
  not reach for a mocking library where a real event will do.
- Type-level tests live in `type-tests/*.tsx` and are checked by `tsc -p tsconfig.type-tests.json`
  (part of `type-check`). Add one whenever you change the public types, to pin what should compile
  and what should be rejected.
- `e2e/*.e2e.ts` are Playwright smoke tests for the docs _site_ (hydration), not the library. See
  "Docs site" below.
- Coverage must not drop. New code ships with tests that hold or raise it. Measure with
  `npm run test:cov`.

## Code conventions

- Source is TypeScript with JSX (`src/index.tsx`); this is a React UI component, so JSX in `src` is
  expected. Shared helpers live in `src/utils`.
- The published API is exactly what `src/index.tsx` re-exports: the default `Dropzone` component,
  the `useDropzone` hook, and their types. Keep the README usage examples in step with any public
  change.
- Follow the rules of hooks; oxlint's `react` plugin enforces them. `react-hooks/exhaustive-deps` is
  intentionally off, so keep effect dependency arrays honest by hand.

## Build and publish

- `npm run build` bundles `src/index.tsx` with tsdown into `dist/` (ESM `.js`, CJS `.cjs`, and the
  `.d.ts` emitted from source via oxc `isolatedDeclarations` using `tsconfig.build.json`). Do not
  hand-edit anything in `dist/` - it is generated.
- What ships to npm is the `files` allowlist in `package.json` (`dist` and `src`, minus specs); keep
  it accurate.
- Releases are automated by semantic-release from the commit history; the repo version stays
  `0.0.0-development` and is set at publish time. Never bump the version by hand.
- Runtime is Node `>= 22` (`engines`); the browser build `target` is `es2020` (`tsdown.config.ts`).

## Docs site

- Docs are MDX under `docs/` with `vocs.config.ts`; `npm run docs:build` emits static HTML to
  `site/` (gitignored) and Netlify deploys it to https://react-dropzone.js.org (`netlify.toml`).
- Vocs runs on waku, whose `unstable_*` router APIs break between beta releases. `waku` is pinned
  (and ignored in Dependabot) to the version Vocs supports; bumping it can white-screen the site
  (see #1512). Do not unpin without re-running the docs smoke test.
- `e2e/docs-smoke.e2e.ts` loads key routes in headless Chromium and fails on a hydration crash or a
  blank page. The `docs-e2e` CI job runs it on every PR; `docs-monitor.yml` runs it on a schedule
  against production. This is the guardrail for the failure class above - keep it working.

## CI workflows

- GitHub Actions live in `.github/workflows`. Write the workflow `name:`, every job name, and every
  named step in Sentence case (match the existing files).
- Dependabot groups patch/minor bumps and auto-merges patches on green CI (`.github/dependabot.yml`,
  `dependabot-auto-merge.yml`). Auto-merge trusts CI, so any check that must gate a dependency bump
  has to run in CI - that is why the docs smoke test exists.
- Keep workflows minimal and scoped to one purpose; prefer the built-in `GITHUB_TOKEN` over a
  personal access token.
