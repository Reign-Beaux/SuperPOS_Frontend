import { Home, Package, Settings, Users, ShoppingCart, Shield, Contact } from "lucide-react"
import { Link } from "react-router-dom"
import { Routes } from "@/config/router/Routes"

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
        title: "Settings",
        url: "#",
        icon: Settings,
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
