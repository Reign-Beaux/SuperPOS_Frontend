export const Routes = {
    Home: "/",
    Inventory: "/inventory",
    Products: "/products",
    Users: "/users",
    Customers: "/customers",
    Roles: "/roles",
    Sales: "/sales",
    POS: "/sales/pos",
} as const;

export type Routes = typeof Routes[keyof typeof Routes];