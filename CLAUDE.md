# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `pnpm dev`
- **Build for production**: `pnpm build` (runs TypeScript compilation and Vite build)
- **Lint and fix**: `pnpm lint` (runs ESLint with auto-fix)
- **Preview production build**: `pnpm preview`

The project uses pnpm as the package manager. Git hooks run linting on pre-commit.

## Architecture Overview

This is a React-based online playground/REPL that allows users to write, edit, and execute React code in the browser. The architecture consists of several key systems:

### Core Systems

1. **Virtual File System** (`src/stores/virtual-file/`, `src/virtual-file/`)
   - Manages in-memory files that users can create, edit, and delete
   - State persisted in URL hash using compression
   - Key files: `App.tsx`, `main.tsx` (entry points)

2. **Monaco Editor Integration** (`src/monaco/`)
   - Uses Monaco Editor for code editing with TypeScript support
   - Automatic type definitions loading for installed packages
   - Syntax highlighting via Shiki

3. **Sandbox Execution** (`src/app/Playground/Sandbox/`)
   - Compiles and executes user code in isolated iframe
   - Uses ESBuild WASM for code transformation (migrated from Babel)
   - Web Worker for compilation to prevent UI blocking
   - Console output capture and display

4. **Package Management** (`src/stores/package/`, `src/apis/`)
   - Dynamic NPM package installation and management
   - Core packages (React, React-DOM) vs extra packages
   - Version compatibility checking
   - Package metadata fetching from unpkg.com

### Compiler System (`src/compiler/`)

The compiler system handles runtime code transformation:

- **ESBuild Integration** (`esbuild.ts`): WASM initialization and singleton management
- **Transform Pipeline** (`index.ts`): Main transformation orchestrator that configures ESBuild with external packages, JSX settings, and virtual file plugin
- **Virtual File Plugin** (`plugins.ts`): ESBuild plugin that resolves and loads virtual files, handling CSS injection, JSON imports, and script compilation
- **File Transformers** (`transforms.ts`): Specialized transformers for different file types (CSS → style injection, JSON → default export, React imports auto-injection)

The compiler worker (`compiler.worker.ts`) runs transformations in a separate thread with the full virtual file system and package context.

### Key Components

- **Navigation** (`src/app/Navigation/`): Settings, theme, package management, sharing
- **Playground** (`src/app/Playground/`): Main editor interface with file tabs, console, and sandbox
- **Store Management**: Uses Zustand for state management across virtual files, packages, and theme

### Technology Stack

- **Frontend**: React 19 with TypeScript, Tailwind CSS
- **Editor**: Monaco Editor with custom TypeScript/React configuration
- **Build**: Vite with React plugin and React Compiler
- **Code Processing**: ESBuild WASM for runtime compilation
- **State**: Zustand with URL persistence via compression

### Development Notes

- Uses React Compiler (experimental) for optimizations
- Code is compiled client-side using ESBuild WASM in a Web Worker
- File system is entirely virtual - no actual file I/O
- Supports both legacy and modern React render APIs
- Console output includes custom formatting and log level filtering

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
