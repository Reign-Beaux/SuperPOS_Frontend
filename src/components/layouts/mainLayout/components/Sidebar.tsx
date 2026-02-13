import { Routes } from "@/config/router/Routes"
import { Contact, DollarSign, Home, Package, RotateCcw, Shield, ShoppingCart, Users, Warehouse } from "lucide-react"
import { Link } from "react-router-dom"
import { authService } from "@/modules/Auth/services/AuthService"

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
        minRole: "Vendedor", // Visible to all
    },
    {
        title: "POS",
        url: Routes.POS,
        icon: ShoppingCart,
        minRole: "Vendedor",
    },
    {
        title: "Sales History",
        url: Routes.Sales,
        icon: ShoppingCart,
        minRole: "Gerente", // Manager or Admin
    },
    {
        title: "Products",
        url: Routes.Products,
        icon: Package,
        minRole: "Vendedor",
    },
    {
        title: "Inventory",
        url: Routes.Inventory,
        icon: Warehouse,
        minRole: "Vendedor",
    },
    {
        title: "Customers",
        url: Routes.Customers,
        icon: Contact,
        minRole: "Vendedor",
    },
    {
        title: "Users",
        url: Routes.Users,
        icon: Users,
        minRole: "Gerente",
    },
    {
        title: "Roles",
        url: Routes.Roles,
        icon: Shield,
        minRole: "Gerente",
    },
    {
        title: "Cash Register",
        url: Routes.CashRegister,
        icon: DollarSign,
        minRole: "Gerente",
    },
    {
        title: "Returns",
        url: Routes.Returns,
        icon: RotateCcw,
        minRole: "Gerente",
    },
    // Add separate item for Create Return if needed for Seller?
    // For now, let's stick to this.
]

export function Sidebar() {
    const isManagerOrAbove = authService.isManagerOrAbove();

    const filteredItems = items.filter(item => {
        if (item.minRole === "Gerente") {
            return isManagerOrAbove;
        }
        return true; // Vendedor items are visible to everyone (since Admin/Manager > Vendedor)
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
