import { Outlet } from "react-router";

import { AppSidebar } from "~/pages/dashboard/app-sidebar";
import { HeaderUser } from "~/pages/dashboard/header-user";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-end gap-2 border-b px-4">
          <HeaderUser />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
