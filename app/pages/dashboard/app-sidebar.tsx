import * as React from "react"
import {
  ClipboardListIcon,
  LayoutDashboardIcon,
  SquarePenIcon,
} from "lucide-react"
import { Link } from "react-router"

import Logo from "~/assists/logo"
import { NavMain } from "~/pages/dashboard/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Test Creation",
      url: "/dashboard/test-creation",
      icon: <SquarePenIcon />,
    },
    {
      title: "Test Tracking",
      url: "#",
      icon: <ClipboardListIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <Logo className="h-7 w-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
