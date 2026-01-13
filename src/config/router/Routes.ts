export const Routes = {
    Home: "/",
    Inventory: "/inventory",
} as const;

export type Routes = typeof Routes[keyof typeof Routes];