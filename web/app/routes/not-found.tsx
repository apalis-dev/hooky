import { Link, data } from "react-router";
import { ArrowUpLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function loader() {
  return data(null, { status: 404 });
}

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="font-mono text-5xl text-muted-foreground">404</span>

        <h1 className="text-3xl font-semibold tracking-tight">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page you’re looking for doesn’t exist, may have been moved, or is
          no longer available.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to={-1 as unknown as string}>
              <ArrowUpLeft className="h-4 w-4" />
              Go back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
