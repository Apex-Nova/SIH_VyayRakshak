"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { AlertOctagon } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this would report to an error-tracking service.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-critical/10 ring-1 ring-critical/30">
        <AlertOctagon className="h-7 w-7 text-critical" />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-fg">
        Unable to load project intelligence.
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Something went wrong while rendering this view. You can retry, or return
        to the dashboard.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Retry</Button>
        <ButtonLink href="/dashboard" variant="secondary">
          Return to Dashboard
        </ButtonLink>
      </div>
    </div>
  );
}
