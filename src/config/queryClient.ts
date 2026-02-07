import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient configuration for React Query
 * 
 * Optimized settings for:
 * - Automatic request deduplication
 * - Smart caching with 5-minute stale time
 * - Background refetching disabled by default
 * - Single retry on failure
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cached data is garbage collected after 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests once
            retry: 1,
            // Don't refetch on window focus (can be enabled per-query if needed)
            refetchOnWindowFocus: false,
            // Don't refetch on reconnect (can be enabled per-query if needed)
            refetchOnReconnect: false,
        },
        mutations: {
            // Retry failed mutations once
            retry: 1,
        },
    },
});
