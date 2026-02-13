import { ThemeProvider } from "@components/providers/theme-provider"
import { queryClient } from "@config/queryClient"
import { router } from "@config/router"
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'

import { Toaster } from "sonner"
import { AuthInitializer } from "@/modules/Auth/components/AuthInitializer"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
