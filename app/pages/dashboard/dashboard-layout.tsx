import { Outlet } from "react-router";

import { AppSidebar } from "~/pages/dashboard/app-sidebar";
import { HeaderUser } from "~/pages/dashboard/header-user";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <HeaderUser />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
