export const Routes = {
    Home: "/",
    Inventory: "/inventory",
    Articles: "/articles",
} as const;

export type Routes = typeof Routes[keyof typeof Routes];