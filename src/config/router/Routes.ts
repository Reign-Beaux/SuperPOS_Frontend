export const Routes = {
    Home: "/",
    Products: "/products",
    Users: "/users",
    Customers: "/customers",
    Roles: "/roles",
    Sales: "/sales",
    POS: "/pos",
    Inventory: "/inventory",
} as const;

export type Routes = typeof Routes[keyof typeof Routes];