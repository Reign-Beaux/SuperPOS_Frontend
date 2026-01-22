export const Routes = {
    Home: "/",
    Inventory: "/inventory",
    Products: "/products",
} as const;

export type Routes = typeof Routes[keyof typeof Routes];