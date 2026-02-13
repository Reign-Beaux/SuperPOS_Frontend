import {
    SidebarProvider,
    SidebarTrigger,
} from "@/components/elements/sidebar";
import { Sidebar } from "./components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/elements/dropdown-menu";
import { User2, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/elements/button";
import { useAuthStore } from "@/modules/Auth/hooks/useAuthStore";

export const MainLayout = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <SidebarProvider>
            <Sidebar />
            <main className="w-full">
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <div className="flex items-center">
                        <SidebarTrigger />
                        <div className="ml-4 font-semibold">SuperPOS</div>
                    </div>

                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <User2 className="h-5 w-5" />
                                    <span className="hidden md:inline-block">
                                        {user ? `${user.name} (${user.role.name})` : 'Usuario'}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar Sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    );
};