import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LogsFilterProps {
	logLevel: string;
	onLogLevelChange: (level: string) => void;
}

export function LogsFilter({ logLevel, onLogLevelChange }: LogsFilterProps) {
	return (
		<Tabs value={logLevel} onValueChange={onLogLevelChange}>
			<TabsList className=" justify-start p-1">
				{["all", "info", "warn", "error"].map((level) => (
					<TabsTrigger
						key={level}
						value={level}
						className="flex-1 capitalize data-[state=active]:shadow-sm data-[state=active]:bg-background"
					>
						{level}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
