import { useMemo, useState } from "react";
import type { Log } from "@/lib/types";
import { LogsFilter } from "../logs-filter";
import { LogsList } from "../logs-list";

interface LogsPageProps {
	logs: Log[];
}

export function LogsPage({ logs }: LogsPageProps) {
	const [logLevel, setLogLevel] = useState("all");

	const filtered = useMemo(() => {
		if (logLevel === "all") return logs;
		return logs.filter((log) => log.level === logLevel);
	}, [logs, logLevel]);

	return (
		<div className="p-8 space-y-6">
			<div>
				<h1 className="text-3xl font-semibold text-foreground mb-2">Logs</h1>
				<p className="text-muted-foreground">
					View system events and error logs
				</p>
			</div>

			<LogsFilter logLevel={logLevel} onLogLevelChange={setLogLevel} />
			<LogsList logs={filtered} />
		</div>
	);
}
