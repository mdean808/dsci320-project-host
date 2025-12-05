# AGENTS.md

## Build Commands
- `pnpm dev` - Start development server
- `pnpm build` - Production build (outputs to docs/)
- `pnpm preview` - Preview production build
- `pnpm check` - Type check (svelte-check + tsc)

## Tech Stack
Svelte 5, TypeScript, Vite 7, Tailwind CSS 4, Vega/Vega-Lite for charts

## Code Style
- Use `lang="ts"` in Svelte script blocks
- Use Svelte 5 runes: `$state()`, `$derived()`, `$props()`
- Prefer `const` over `let`, use arrow functions
- Use `interface` for props types, explicit return types on complex functions
- Imports: svelte packages first, then local components, then utilities
- Tailwind for styling; scoped `<style>` blocks for complex/animation CSS
- Error handling: use `$state<string | null>(null)` pattern, display user-friendly messages

## Naming Conventions
- Components: PascalCase (e.g., `Chart.svelte`)
- Variables/functions: camelCase
- CSS classes: kebab-case for custom classes

## File Structure
- `src/components/` - Svelte components
- `src/App.svelte` - Main app with tab navigation
- `public/` - Static assets (data JSON files, specs)
