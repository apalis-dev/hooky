import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import type { Log } from "@/lib/types";
import { LogsFilter } from "../logs-filter";
import { LogsList } from "../logs-list";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface LogsPageProps {
	logs: Log[];
	page: number;
	limit: number;
}

export function LogsPage({ logs, page, limit }: LogsPageProps) {
	const [logLevel, setLogLevel] = useState("all");
	const navigate = useNavigate();
	const hasMore = logs.length === limit;

	const filtered = useMemo(() => {
		if (logLevel === "all") return logs;
		return logs.filter((log) => log.level === logLevel);
	}, [logs, logLevel]);

	const handlePrev = () => {
		if (page > 0) {
			navigate(`?page=${page - 1}&limit=${limit}`);
		}
	};

	const handleNext = () => {
		if (hasMore) {
			navigate(`?page=${page + 1}&limit=${limit}`);
		}
	};

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
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href={`?page=${page - 1}&limit=${limit}`}
							onClick={(e) => {
								e.preventDefault();
								handlePrev();
							}}
							aria-disabled={page === 0}
							className={page === 0 ? "pointer-events-none opacity-50" : undefined}
						/>
					</PaginationItem>
					<PaginationItem>
						<PaginationNext
							href={`?page=${page + 1}&limit=${limit}`}
							onClick={(e) => {
								e.preventDefault();
								handleNext();
							}}
							aria-disabled={!hasMore}
							className={!hasMore ? "pointer-events-none opacity-50" : undefined}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
