# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 4 application with TypeScript. The project uses:
- **Nuxt UI** (@nuxt/ui v4.0.1) for UI components
- **Tailwind CSS v4** with Vite plugin for styling
- **Bun** as the package manager
- **ESLint** with Nuxt integration for linting

## Development Commands

```bash
# Install dependencies
bun install

# Start development server on http://localhost:3000
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview

# Generate static site
bun run generate
```

## Architecture

### Directory Structure

- `app/` - Main application directory (Nuxt 4 convention)
  - `app.vue` - Root component
  - `pages/` - File-based routing
  - `layouts/` - Layout components
  - `components/` - Vue components (auto-imported)
  - `assets/css/` - Global styles

### Component Patterns

- Uses Nuxt UI components (prefixed with `U`): `UTabs`, `ULink`, `UApp`, `UContainer`, `UMain`
- Nuxt UI icons use the `i-lucide-*` convention (e.g., `i-lucide-user`, `i-lucide-lock`)
- Custom components in `app/components/` are auto-imported

### Configuration

- **nuxt.config.ts**: Enables devtools, registers @nuxt/eslint and @nuxt/ui modules, includes Tailwind CSS via Vite plugin
- **eslint.config.mjs**: Extends Nuxt's generated ESLint config
- **tailwind.config.js**: Tailwind v4 configuration
- **tsconfig.json**: References generated Nuxt TypeScript configs in `.nuxt/` directory
