import {
    SidebarProvider,
    SidebarTrigger,
} from "@/components/elements/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="flex h-16 items-center border-b px-4">
                    <SidebarTrigger />
                    <div className="ml-4 font-semibold">SuperPOS</div>
                </div>
                <div className="p-4">
                    <Outlet />
                </div>
            </main>
        </SidebarProvider>
    );
};