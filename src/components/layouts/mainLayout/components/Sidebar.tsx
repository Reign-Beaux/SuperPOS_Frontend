import { Routes } from "@/config/router/Routes"
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
        url: "#",
        icon: Home,
    },
    {
        title: "POS",
        url: Routes.POS,
        icon: ShoppingCart,
    },
    {
        title: "Sales History",
        url: Routes.Sales,
        icon: ShoppingCart,
    },
    {
        title: "Products",
        url: Routes.Products,
        icon: Package,
    },
    {
        title: "Inventory",
        url: Routes.Inventory,
        icon: Warehouse,
    },
    {
        title: "Customers",
        url: Routes.Customers,
        icon: Contact,
    },
    {
        title: "Users",
        url: Routes.Users,
        icon: Users,
    },
    {
        title: "Roles",
        url: Routes.Roles,
        icon: Shield,
    },
    {
        title: "Cash Register",
        url: Routes.CashRegister,
        icon: DollarSign,
    },
    {
        title: "Returns",
        url: Routes.Returns,
        icon: RotateCcw,
    },
]

export function Sidebar() {
    return (
        <ShadcnSidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
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
