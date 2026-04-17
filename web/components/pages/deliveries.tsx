import { useNavigate } from "react-router";
import type { Delivery } from "@/lib/types";
import { DeliveriesTable } from "../deliveries-table";
import { Card } from "@/components/ui/card";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface DeliveriesPageProps {
	deliveries: Delivery[];
	page: number;
	limit: number;
}

export function DeliveriesPage({ deliveries, page, limit }: DeliveriesPageProps) {
	const navigate = useNavigate();
	const hasMore = deliveries.length === limit;

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
				<h1 className="text-3xl font-semibold text-foreground mb-2">
					Deliveries
				</h1>
				<p className="text-muted-foreground">
					View webhook delivery history and attempts
				</p>
			</div>

			<Card className="overflow-hidden">
				<DeliveriesTable deliveries={deliveries} />
			</Card>
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