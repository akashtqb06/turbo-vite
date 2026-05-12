# MavenDX Frontend Monorepo

A Turborepo-based React frontend for a metadata-driven desk application.

This workspace currently centers on the `mdx` app, which renders:

- authentication flows
- a dynamic desk sidebar and shell
- metadata-driven list views
- metadata-driven form views
- user preferences such as theme and language
- frontend translations loaded from the backend

The UI is built from shared packages so the desk, auth flows, and app shell can evolve together without duplicating logic.

## Tech Stack

- `Turborepo`
- `React 19`
- `Vite`
- `TypeScript`
- `Tailwind CSS v4`
- shared UI components from `@repo/ui`

## Workspace Layout

```text
apps/
  mdx/                  Main frontend app

packages/
  api-client/           Shared HTTP client, auth API helpers, preference storage
  auth/                 Auth provider, login form, protected route
  desk/                 Metadata-driven desk layout, sidebar, list view, form view
  ui/                   Shared components, theme provider, translation provider
  utils/                Shared utilities
  eslint-config/        Shared ESLint config
  tailwind-config/      Shared Tailwind config
  typescript-config/    Shared TypeScript config
```

## Main Concepts

### Desk Resolver

The desk UI is driven by backend metadata from:

```http
GET /api/desk/resolve?path=<route>
```

Depending on the response, the frontend renders either:

- a `list` view
- a `form` view

The resolver payload can also include:

- sidebar sections and items
- list columns and data
- form meta and fields
- permissions
- pagination data

### CRUD API

The frontend uses resource endpoints for create and update operations:

```http
POST /api/resource/<Rectype>
PUT /api/resource/<Rectype>/<name>
```

For updates, the frontend sends only changed writable fields.

### Auth

Authentication currently uses:

```http
POST /api/auth/login
GET /api/auth/me
POST /api/auth/logout
```

`auth/me` is also used to hydrate:

- current user information
- preferred theme
- preferred language

### Translations

Frontend translations are loaded from:

```http
GET /api/translations/<language-code>
```

Behavior:

- English (`en`) does not trigger a translation fetch
- non-English translations are cached in local storage
- `Accept-Language` and `lang=true` are sent automatically by the shared HTTP client when a stored language exists

## Current Features

- protected routing with shared auth context
- desk sidebar with persisted section collapse state
- section ordering with `Core` pinned last
- dynamic list rendering from backend metadata
- dynamic form rendering from backend metadata
- link fields that resolve their options from linked rectypes
- table child fields that render editable inline tables from child meta
- create and update flows with permission-aware actions
- user menu with profile, theme, and logout actions
- theme preference sync between backend preference and browser-local override
- language preference sync with immediate UI refresh after saving the current user
- global loading indicator for main request activity

## Running The Project

### Requirements

- `Node.js >= 18`
- `npm >= 10`

### Install

```sh
npm install
```

### Start development

```sh
npm run dev
```

This runs the Turborepo development pipeline.

If you only want the main app:

```sh
npm run dev --prefix apps/mdx
```

### Build

```sh
npm run build
```

To build only the main app:

```sh
npm run build --prefix apps/mdx
```

### Other useful commands

```sh
npm run lint
npm run check-types
npm run format
```

## App Entry

The main browser app is:

- [`apps/mdx/src/main.tsx`](apps/mdx/src/main.tsx)

It wires together:

- `ThemeProvider`
- `TranslationProvider`
- `BrowserRouter`
- `AuthProvider`

## Important Packages

### `@repo/ui`

Shared UI primitives and app-level providers, including:

- theme provider
- translation provider
- sidebar primitives
- dropdowns, tabs, tooltips, badges, tables, form controls

### `@repo/auth`

Contains:

- auth context/provider
- login form
- protected route wrapper

### `@repo/desk`

Contains the metadata-driven desk experience:

- desk route resolver integration
- layout and sidebar
- list view
- form view
- field renderers
- form layout helpers

### `@repo/api-client`

Contains:

- shared `request()` helper
- auth API helpers
- local preference helpers
- request activity tracking for the global loading indicator

## Backend Assumptions

This frontend assumes:

- the backend returns desk metadata in a consistent resolver shape
- record-type routes map to resolver paths like `/User` (no extra prefix)
- linked field options can be resolved through desk list endpoints
- user preferences are returned from auth endpoints

If those contracts change, update the corresponding package:

- desk payload/rendering logic: `packages/desk`
- auth payload/preference logic: `packages/auth`
- API and request behavior: `packages/api-client`

## Notes

- Theme priority is: local storage override first, backend user preference second.
- Language is persisted in local storage and applied to subsequent API requests.
- Small field-level link/table metadata requests are excluded from the global loading overlay to avoid flicker during form editing.
