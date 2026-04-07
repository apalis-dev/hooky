import { Button } from "./ui/button";

interface LogsFilterProps {
	logLevel: string;
	onLogLevelChange: (level: string) => void;
}

export function LogsFilter({ logLevel, onLogLevelChange }: LogsFilterProps) {
	return (
		<div className="flex gap-2">
			{["all", "info", "warn", "error"].map((level) => (
				<Button
					key={level}
					onClick={() => onLogLevelChange(level)}
					className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
						logLevel === level
							? "bg-accent text-accent-foreground"
							: "bg-card border border-border text-foreground hover:bg-muted"
					}`}
				>
					{level.charAt(0).toUpperCase() + level.slice(1)}
				</Button>
			))}
		</div>
	);
}
