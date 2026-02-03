export const Routes = {
    Home: "/",
    Inventory: "/inventory",
    Products: "/products",
    Users: "/users",
} as const;

export type Routes = typeof Routes[keyof typeof Routes];