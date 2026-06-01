import { AlertCircle } from "lucide-react";

export function PortalInvalidLink({ message }: { message?: string }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-7 text-destructive" />
      </div>
      <h1 className="mt-4 text-lg font-semibold text-foreground">Portal link unavailable</h1>
      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
        {message ??
          "This link is invalid, disabled, or has expired. Contact the business that sent you the invoice for a new link."}
      </p>
    </div>
  );
}
