import { Moon, Sun, LogOut, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
	"/": "Overview",
	"/webhooks": "Webhooks",
	"/webhooks/new": "Create Webhook",
	"/deliveries": "Deliveries",
	"/logs": "Logs",
	"/settings": "Settings",
};

function getBreadcrumbs(pathname: string) {
	if (pathname === "/") {
		return [{ label: "Overview", to: "/" }];
	}

	const segments = pathname.split("/").filter(Boolean);
	const crumbs: { label: string; to: string }[] = [
		{ label: "Dashboard", to: "/" },
	];

	let currentPath = "";
	for (let i = 0; i < segments.length; i++) {
		currentPath += `/${segments[i]}`;
		const label = routeLabels[currentPath];
		if (label) {
			crumbs.push({ label, to: currentPath });
		} else {
			// Dynamic segment like /deliveries/:id
			const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/"));
			const parentLabel = routeLabels[parentPath];
			if (parentLabel && !crumbs.some((c) => c.to === parentPath)) {
				crumbs.push({ label: parentLabel, to: parentPath });
			}
			crumbs.push({ label: `#${segments[i]}`, to: currentPath });
		}
	}

	return crumbs;
}

export function TopNav() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const location = useLocation();

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		if (newTheme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	};

	const currentLabel = routeLabels[location.pathname] ?? "Dashboard";
	const isRoot = location.pathname === "/";
	const crumbs = getBreadcrumbs(location.pathname);

	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 !h-4" />

			<Breadcrumb>
				<BreadcrumbList>
					{crumbs.map((crumb, index) => {
						const isLast = index === crumbs.length - 1;
						return (
							<BreadcrumbItem key={crumb.to}>
								{index > 0 && <BreadcrumbSeparator />}
								{isLast ? (
									<BreadcrumbPage>{crumb.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link to={crumb.to}>{crumb.label}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="flex-1" />

			<div className="flex items-center gap-4">
				{mounted && (
					<Button variant="ghost" size="icon" onClick={toggleTheme}>
						{theme === "dark" ? (
							<Sun className="h-5 w-5" />
						) : (
							<Moon className="h-5 w-5" />
						)}
						<span className="sr-only">Toggle theme</span>
					</Button>
				)}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="relative h-8 w-8 rounded-full">
							<Avatar className="h-8 w-8">
								<AvatarFallback>A</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<User className="h-4 w-4" />
							Profile
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<LogOut className="h-4 w-4" />
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
