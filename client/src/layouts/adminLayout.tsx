import { AdminSidebar } from "@/components/admin/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";

export function AdminLayout() {
  return <div className="flex min-h-screen">
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full">
        <div className="flex flex-col gap-2 p-10">
          <h1 className="text-3xl">{getHeading()}</h1>
          <div className="bg-slate-800 h-[1px] mb-10"></div>
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  </div>
}

function getHeading(): string {
  const { pathname } = useLocation();
  if (pathname.includes("sessions")) return "Sessions"
  if (pathname.includes("coaches")) return "Coaches"
  return ""
}
