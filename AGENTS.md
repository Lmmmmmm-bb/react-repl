# Repository Guidelines

## Project Structure & Module Organization

This repository is a browser-based React REPL built with React 19, TypeScript, and Vite. Application code lives in `src/`:

- `src/app/` contains the main navigation and playground UI.
- `src/compiler/` and `src/app/Playground/Sandbox/` handle ESBuild WASM compilation and isolated iframe execution.
- `src/monaco/` configures the editor, language services, and highlighting.
- `src/stores/` holds Zustand state for packages, themes, and virtual files.
- `src/components/`, `src/hooks/`, `src/utils/`, and `src/icons/` contain reusable building blocks.
- `src/templates/` provides the starter files shown inside the REPL.
- `public/` stores static assets; global styles are under `src/styles/`.

Build output is written to `dist/` and must not be committed.

## Build, Test, and Development Commands

Use pnpm 10 (the version is pinned in `package.json`).

- `pnpm install` installs dependencies from `pnpm-lock.yaml`.
- `pnpm dev` starts the Vite development server with hot reload.
- `pnpm build` runs strict TypeScript checks, then creates a production bundle.
- `pnpm preview` serves the production bundle locally for final verification.
- `pnpm lint` runs ESLint across the repository and applies safe fixes.

## Coding Style & Naming Conventions

Follow the existing ESLint configuration: two-space indentation, single quotes, semicolons, 1TBS braces, and self-closing JSX where possible. Keep TypeScript strict and remove unused variables and parameters. Use PascalCase for React components and component directories (`DeviceSelect.tsx`, `PackagePreview/`), `useCamelCase` for hooks, and camelCase for utilities and state. Prefer the `~/` alias for imports from `src/`. Keep feature-specific code beside its feature rather than growing generic shared folders prematurely.

## Testing Guidelines

There is currently no automated test framework or coverage threshold. Before submitting changes, run `pnpm build` and `pnpm lint`, then exercise the affected flow with `pnpm dev`. For compiler or sandbox changes, verify TypeScript/JSX, CSS, JSON imports, console output, and package loading as applicable. If tests are introduced, colocate them as `*.test.ts` or `*.test.tsx` and add a documented `pnpm test` script.

## Commit & Pull Request Guidelines

History follows Conventional Commits, including optional scopes and breaking markers: `fix(compiler): avoid init esbuild twice`, `docs: add features`, and `feat!: tailwind v4`. Keep commits focused and use imperative, lowercase summaries. Pull requests should explain the problem and solution, link relevant issues, list verification performed, and include screenshots or recordings for visible UI changes. Call out changes to dependencies, browser behavior, or the sandbox security boundary.
