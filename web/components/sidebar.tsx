import { NavLink, useLocation } from "react-router";
import { Activity, Bolt, Clock, FileText, Settings } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";

const navItems = [
	{ to: "/", label: "Overview", icon: Activity },
	{ to: "/webhooks", label: "Webhooks", icon: Bolt },
	{ to: "/deliveries", label: "Deliveries", icon: Clock },
	{ to: "/logs", label: "Logs", icon: FileText },
	{ to: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const { pathname } = useLocation();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<NavLink to="/" end className="flex items-center gap-2">
								<div className="flex size-8 items-center justify-center rounded-md border">
									<Bolt className="size-4 text-foreground" />
								</div>

								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">Hooky</span>
									<span className="truncate text-xs text-muted-foreground">
										Dashboard
									</span>
								</div>
							</NavLink>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => {
								const isActive =
									item.to === "/"
										? pathname === "/"
										: pathname.startsWith(item.to);

								return (
									<SidebarMenuItem key={item.to}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.label}
											className="gap-2 data-[active=true]:bg-muted data-[active=true]:text-foreground"
										>
											<NavLink
												to={item.to}
												end={item.to === "/"}
												className="flex items-center gap-2"
											>
												<item.icon
													className={`size-4 ${
														isActive
															? "text-foreground"
															: "text-muted-foreground"
													}`}
												/>
												<span className="text-sm">{item.label}</span>
											</NavLink>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarRail />
		</Sidebar>
	);
}
