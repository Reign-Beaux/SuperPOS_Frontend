# SuperPOS Frontend

## Project Overview

This is the frontend for **SuperPOS**, a modern, web-based Point of Sale system. It is built with **React 19**, **TypeScript**, and **Vite 7**, ensuring a fast and type-safe development experience. The UI is designed with **Tailwind CSS 4** and extensively uses **Radix UI** primitives for accessibility and flexibility.

## Tech Stack

*   **Core**: React 19, TypeScript
*   **Build Tool**: Vite 7
*   **Styling**: Tailwind CSS 4, `clsx`, `tailwind-merge`
*   **State Management**: Zustand
*   **Routing**: React Router DOM 7
*   **Forms**: React Hook Form, Zod
*   **HTTP Client**: Axios
*   **UI Components**: Radix UI (Primitives), Lucide React (Icons), Recharts (Charts)

## Architecture

The project follows a **Feature-First / Modular** architecture. The core logic is distributed across domain-specific modules rather than generic technical layers.

### Directory Structure

*   **`src/modules`**: The heart of the application. Contains all business logic, pages, and components specific to a domain (e.g., `products`, `users`, `inventories`).
*   **`src/config`**: Global configuration, including:
    *   `httpClient`: Centralized Axios instance.
    *   `router`: App-wide routing definitions.
    *   `stores`: Global Zustand stores.
*   **`src/components`**: Shared, reusable UI components:
    *   `elements`: Atomic UI building blocks (buttons, inputs).
    *   `widgets`: Complex, business-agnostic components (dialogs, tables).
    *   `layouts`: Application layouts (e.g., `MainLayout`).
    *   `providers`: Context providers (e.g., ThemeProvider).

## Development Conventions

*   **Linting**: ESLint with `typescript-eslint` and `react-hooks` plugins.
*   **Formatting**: Prettier (implied usage with standard config).
*   **Path Aliases**:
    *   `@`: `src`
    *   `@modules`: `src/modules` (Core domain logic)
    *   `@components`: `src/components` (Shared UI)
    *   `@config`: `src/config` (Global settings)
    *   `@shared`: `src/shared` (Utilities)
    *   `@styles`: `src/styles` (Global CSS)
    *   `@features`: `src/features` (Currently reserved/unused)

## Getting Started

1.  **Install Dependencies**: `pnpm install`
2.  **Start Dev Server**: `pnpm dev` (Runs on `http://localhost:5173`)
3.  **Build**: `pnpm build`
4.  **Preview**: `pnpm preview`
