import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Calendar, User } from "lucide-react";
import { useLocation, Link } from "react-router"

export function AdminSidebar() {
  const { pathname } = useLocation();
  return (
    <Sidebar>
      <SidebarHeader className="text-center my-5">Admin Panel</SidebarHeader>
      <SidebarContent className="px-2">
        <Link to="/admin/sessions">
          <SidebarMenuButton isActive={pathname.includes("sessions")} >
            <Calendar />
            Sessions
          </SidebarMenuButton>
        </Link>
        <Link to="/admin/coaches">
          <SidebarMenuButton isActive={pathname.includes("coach")}>
            <User />
            Coaches
          </SidebarMenuButton>
        </Link>
      </SidebarContent>
    </Sidebar>
  )
}

