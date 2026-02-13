import { Routes } from "@/config/router/Routes"
import { authService } from "@/modules/Auth/services/AuthService"
import { Contact, DollarSign, Home, Package, RotateCcw, Shield, ShoppingCart, Users, Warehouse } from "lucide-react"
import { Link } from "react-router-dom"

import {
    Sidebar as ShadcnSidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@components/elements/sidebar"

const items = [
    {
        title: "Home",
        url: Routes.Home,
        icon: Home,
        // Visible to Manager/Admin
        allowedRoles: ["Administrador", "Gerente"],
    },
    {
        title: "POS",
        url: Routes.POS,
        icon: ShoppingCart,
        // Visible to Vendedor/Admin
        allowedRoles: ["Administrador", "Vendedor"],
    },
    {
        title: "Sales History",
        url: Routes.Sales,
        icon: ShoppingCart,
        allowedRoles: ["Administrador", "Gerente"],
    },
    {
        title: "Products",
        url: Routes.Products,
        icon: Package,
        allowedRoles: ["Administrador", "Gerente"],
    },
    {
        title: "Inventory",
        url: Routes.Inventory,
        icon: Warehouse,
        allowedRoles: ["Administrador", "Gerente"],
    },
    {
        title: "Customers",
        url: Routes.Customers,
        icon: Contact,
        allowedRoles: ["Administrador", "Gerente"],
    },
    // ... Users, Roles, etc. already imply Manager+. 
    // But let's be explicit if we use allowedRoles for everything.
    {
        title: "Users",
        url: Routes.Users,
        icon: Users,
        allowedRoles: ["Administrador", "Gerente"],
    },
    {
        title: "Roles",
        url: Routes.Roles,
        icon: Shield,
        allowedRoles: ["Administrador", "Gerente"],
    },
    {
        title: "Cash Register",
        url: Routes.CashRegister,
        icon: DollarSign,
        allowedRoles: ["Administrador", "Gerente"],
    },
    {
        title: "Returns",
        url: Routes.Returns,
        icon: RotateCcw,
        allowedRoles: ["Administrador", "Gerente"],
    },
]

export function Sidebar() {
    const userRole = authService.getUserRole();

    const filteredItems = items.filter(item => {
        if (!userRole) return false;
        return item.allowedRoles.includes(userRole);
    });

    return (
        <ShadcnSidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </ShadcnSidebar>
    )
}
