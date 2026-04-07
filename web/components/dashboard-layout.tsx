import { useState } from "react";
import { TopNav } from "./top-nav";
import { Sidebar } from "./sidebar";
import { OverviewPage } from "./pages/overview";
import { WebhooksPage } from "./pages/webhooks";
import { DeliveriesPage } from "./pages/deliveries";
import { LogsPage } from "./pages/logs";
import { SettingsPage } from "./pages/settings";

export function DashboardLayout() {
	const [currentPage, setCurrentPage] = useState("overview");
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const renderPage = () => {
		switch (currentPage) {
			case "overview":
				return <OverviewPage />;
			case "webhooks":
				return <WebhooksPage />;
			case "deliveries":
				return <DeliveriesPage />;
			case "logs":
				return <LogsPage />;
			case "settings":
				return <SettingsPage />;
			default:
				return <OverviewPage />;
		}
	};

	return (
		<div className="flex h-screen bg-background">
			<Sidebar
				currentPage={currentPage}
				onPageChange={setCurrentPage}
				isOpen={sidebarOpen}
				onToggle={setSidebarOpen}
			/>
			<div className="flex flex-1 flex-col">
				<TopNav onToggleSidebar={setSidebarOpen} />
				<main className="flex-1 overflow-auto">{renderPage()}</main>
			</div>
		</div>
	);
}
