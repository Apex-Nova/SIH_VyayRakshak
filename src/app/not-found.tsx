import { ButtonLink } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 ring-1 ring-accent/30">
        <Compass className="h-7 w-7 text-accent" />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-fg">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The intelligence you’re looking for doesn’t exist or may have moved.
      </p>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/dashboard">Return to Dashboard</ButtonLink>
        <ButtonLink href="/projects" variant="secondary">
          Browse Projects
        </ButtonLink>
      </div>
    </div>
  );
}
