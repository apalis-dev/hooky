import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { ArrowUpLeftIcon } from "lucide-react";
import { ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface RouteErrorBoundaryProps {
  backLabel?: string;
  backTo?: string;
  notFoundMessage?: string;
  notFoundTitle?: string;
}

function getErrorStatus(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return error.status;
  }

  if (error instanceof ApiError) {
    return error.status;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return 500;
}

function getErrorMessage(error: unknown) {
  if (isRouteErrorResponse(error)) {
    return typeof error.data === "string" && error.data
      ? error.data
      : error.statusText;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

export function RouteErrorBoundary({
  backLabel = "Go to dashboard",
  backTo = "/",
  notFoundMessage = "The page you are looking for does not exist or may have been moved.",
  notFoundTitle = "Page not found",
}: RouteErrorBoundaryProps) {
  const error = useRouteError();
  const status = getErrorStatus(error);
  const isNotFound = status === 404;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-5xl font-medium tabular-nums text-foreground font-mono text-muted-foreground">
        {isNotFound ? "404" : status}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        {isNotFound ? notFoundTitle : "Something went wrong"}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {isNotFound ? notFoundMessage : getErrorMessage(error)}
      </p>
      <Button asChild className="mt-6" variant={"outline"}>
        <Link to={backTo}>
          <ArrowUpLeftIcon className="h-4 w-4" />
          {backLabel}
        </Link>
      </Button>
    </div>
  );
}
