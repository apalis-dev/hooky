import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LogsFilterProps {
	logLevel: string;
	onLogLevelChange: (level: string) => void;
}

export function LogsFilter({ logLevel, onLogLevelChange }: LogsFilterProps) {
	return (
		<Tabs value={logLevel} onValueChange={onLogLevelChange}>
			<TabsList>
				{["all", "info", "warn", "error"].map((level) => (
					<TabsTrigger key={level} value={level}>
						{level.charAt(0).toUpperCase() + level.slice(1)}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
