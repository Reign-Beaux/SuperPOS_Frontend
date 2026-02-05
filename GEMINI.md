# SuperPOS Frontend

## Project Overview

This is the frontend for **SuperPOS**, a modern, web-based Point of Sale system. It is built with **React 19**, **TypeScript**, and **Vite**, ensuring a fast and type-safe development experience. The UI is designed with **Tailwind CSS 4** and built using **shadcn/ui**, which leverages **Radix UI** primitives for accessibility and flexibility.

## Tech Stack

*   **Core**: React (`^19.2.0`), TypeScript (`~5.9.3`)
*   **Build Tool**: Vite (`^7.2.4`)
*   **Styling**: Tailwind CSS (`^4.1.18`), `clsx`, `tailwind-merge`
*   **UI Framework**: **shadcn/ui**
*   **UI Components**: Radix UI Primitives, Lucide React (Icons), Recharts (Charts)
*   **State Management**: Zustand (`5.0.10`)
*   **Routing**: React Router DOM (`7.12.0`)
*   **Forms**: React Hook Form (`7.71.0`), Zod (`^4.3.5`)
*   **HTTP Client**: Axios (`1.13.2`)

## Architecture

The project follows a **Feature-First / Modular** architecture. The core logic is distributed across domain-specific modules rather than generic technical layers.

### Directory Structure

*   **`src/modules`**: The heart of the application. Contains all business logic, pages, and components specific to a domain (e.g., `products`, `users`, `inventories`).
*   **`src/config`**: Global configuration, including:
    *   `httpClient`: Centralized Axios instance.
    *   `router`: App-wide routing definitions.
    *   `stores`: Global Zustand stores.
*   **`src/components`**: Shared, reusable UI components built with `shadcn/ui`:
    *   `elements`: Atomic UI building blocks (buttons, inputs), often directly from `shadcn/ui`.
    *   `widgets`: Complex, business-agnostic components (dialogs, tables).
    *   `layouts`: Application layouts (e.g., `MainLayout`).
    *   `providers`: Context providers (e.g., ThemeProvider).
*   **`src/shared`**: Shared utilities, hooks, and constants that are not specific to any single domain.

## Development Conventions

*   **Linting**: ESLint with `typescript-eslint` and `react-hooks` plugins.
*   **Formatting**: Prettier (implied usage with standard config).
*   **Path Aliases** (defined in `tsconfig.json`):
    *   `@/*`: `./src/*`
    *   `@components/*`: `./src/components/*`
    *   `@config/*`: `./src/config/*`
    *   `@features/*`: `./src/features/*`
    *   `@shared/*`: `./src/shared/*`
    *   `@styles/*`: `./src/styles/*`
    *   `@modules/*`: `./src/modules/*`

## Getting Started

1.  **Install Dependencies**: `pnpm install`
2.  **Start Dev Server**: `pnpm dev` (Runs on `http://localhost:5173`)
3.  **Build**: `pnpm build`
4.  **Preview**: `pnpm preview`
