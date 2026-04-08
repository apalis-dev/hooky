import { Outlet } from "react-router";
import { TopNav } from "@/components/top-nav";
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayoutRoute() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<TopNav />
				<div className="flex-1 overflow-auto">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
