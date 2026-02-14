# GEMINI.md

## Project Overview

This is the frontend for SuperPOS, a Point of Sale (POS) system. It's a single-page application built with **React** and **TypeScript**, using **Vite** for the build tooling.

The application is structured feature-wise, with different modules for managing `Products`, `Users`, `Customers`, `Roles`, `Sales`, `Inventory`, `Cash Registers`, and `Returns`.

### Key Technologies & Libraries

*   **UI Framework:** React 19
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Routing:** React Router DOM (`react-router-dom`)
*   **Data Fetching & State Management:** TanStack Query (`@tanstack/react-query`) for server state and `zustand` for client state.
*   **HTTP Client:** Axios
*   **Styling:** Tailwind CSS with a custom theme provider. UI components seem to be based on `shadcn/ui` conventions (visible in `src/components/elements`).
*   **Forms:** React Hook Form (`react-hook-form`)
*   **Schema Validation:** Zod

### Architecture

*   The application entry point is `src/main.tsx`.
*   Routing is centralized in `src/config/router/Router.tsx`.
*   The application uses a `MainLayout` component for the main interface, which is protected by a `ProtectedRoute` component for authentication and authorization.
*   The code is organized by features into modules (e.g., `src/modules/products`, `src/modules/sales`), each containing its own components, pages, and API logic.
*   Shared components and hooks are located in `src/components` and `src/hooks` respectively.

## Building and Running

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

2.  **Run Development Server:**
    This will start the Vite development server with hot module reloading.
    ```bash
    pnpm dev
    ```

3.  **Build for Production:**
    This will lint the code, compile the TypeScript, and create a production-ready build in the `dist/` directory.
    ```bash
    pnpm build
    ```

4.  **Linting:**
    To run the ESLint checks separately:
    ```bash
    pnpm lint
    ```

## Development Conventions

*   **Styling:** Use Tailwind CSS for styling. Follow the existing style conventions.
*   **Components:** Create reusable components and place them in the appropriate `components` directory. Feature-specific components should reside within their respective module directories.
*   **State Management:** Use TanStack Query for managing server state (fetching, caching, etc.). For global client state, use `zustand`.
*   **API:** API interactions are handled via Axios, with a base client configuration likely in `src/config/httpClient`.
*   **Routing:** When adding new pages, define the routes in `src/config/router/Router.tsx` and use the `ProtectedRoute` component to enforce access control.
