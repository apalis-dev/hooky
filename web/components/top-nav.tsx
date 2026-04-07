import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function TopNav() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

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

	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 !h-4" />

			<div className="flex-1" />

			<div className="flex items-center gap-4">
				{mounted && (
					<button
						type="button"
						onClick={toggleTheme}
						className="p-1.5 hover:bg-muted rounded-lg transition-colors"
					>
						{theme === "dark" ? (
							<Sun className="w-5 h-5 text-foreground" />
						) : (
							<Moon className="w-5 h-5 text-foreground" />
						)}
					</button>
				)}
				<div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-semibold">
					A
				</div>
			</div>
		</header>
	);
}
