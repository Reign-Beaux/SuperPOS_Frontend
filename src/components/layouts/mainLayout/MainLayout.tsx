import {
    SidebarProvider,
    SidebarTrigger,
} from "@/components/elements/sidebar";
import { Sidebar } from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/elements/dropdown-menu";
import { User2, ChevronDown } from "lucide-react";
import { Button } from "@/components/elements/button";

export const MainLayout = () => {
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
                                    <span>Username</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Sign out</span>
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