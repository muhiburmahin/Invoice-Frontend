"use client";

import { useEffect, useState } from "react";

import { ModalCancelButton, SimpleModal } from "@/components/shared/SimpleModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type InvoiceEmailDialogProps = {
  open: boolean;
  mode: "send" | "remind";
  defaultEmail: string;
  emailConfigured: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: { to?: string; message?: string }) => Promise<void>;
};

export function InvoiceEmailDialog({
  open,
  mode,
  defaultEmail,
  emailConfigured,
  isSubmitting,
  onClose,
  onSubmit,
}: InvoiceEmailDialogProps) {
  const [to, setTo] = useState(defaultEmail);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) {
      setTo(defaultEmail);
      setMessage("");
    }
  }, [defaultEmail, open]);

  const title = mode === "send" ? "Send invoice" : "Send payment reminder";
  const description =
    mode === "send"
      ? "Email the invoice PDF to your client. Draft invoices move to Sent after delivery."
      : "Send a friendly reminder for the outstanding balance.";

  return (
    <SimpleModal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
        <>
          <ModalCancelButton onClick={onClose} disabled={isSubmitting} />
          <Button
            type="button"
            disabled={isSubmitting || !emailConfigured || !to.trim()}
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() => void onSubmit({ to: to.trim(), message: message.trim() || undefined })}
          >
            {isSubmitting ? "Sending…" : mode === "send" ? "Send invoice" : "Send reminder"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {!emailConfigured ? (
          <p className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-warning">
            SMTP is not configured on the server. Configure email in the backend to send invoices.
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="invoice-email-to">Recipient email</Label>
          <Input
            id="invoice-email-to"
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="client@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoice-email-message">Personal message (optional)</Label>
          <textarea
            id="invoice-email-message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a short note to include in the email…"
            className={cn(
              "w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none",
              "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            )}
          />
        </div>
      </div>
    </SimpleModal>
  );
}
