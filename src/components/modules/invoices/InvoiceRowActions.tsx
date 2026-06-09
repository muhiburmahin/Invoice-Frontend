"use client";

import { useRouter } from "next/navigation";
import { Copy, Download, ExternalLink, MoreHorizontal, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDuplicateInvoice } from "@/hooks/useInvoices";
import { getApiErrorMessage } from "@/lib/api";
import { invoiceService } from "@/services/invoice.service";
import type { InvoiceListItem } from "@/types/invoice";

type InvoiceRowActionsProps = {
  invoice: InvoiceListItem;
};

export function InvoiceRowActions({ invoice }: InvoiceRowActionsProps) {
  const router = useRouter();
  const duplicateInvoice = useDuplicateInvoice();

  async function handleDownloadPdf() {
    try {
      await invoiceService.downloadPdf(invoice.id, `${invoice.number}.pdf`);
      toast.success("PDF downloaded");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleDuplicate() {
    try {
      const result = await duplicateInvoice.mutateAsync(invoice.id);
      toast.success(result.message ?? "Invoice duplicated");
      router.push(`/invoices/${result.invoice.id}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="size-8" aria-label="Invoice actions">
            <MoreHorizontal className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(`/invoices/${invoice.id}`)}>
            <ExternalLink className="size-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void handleDownloadPdf()}>
            <Download className="size-4" />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void handleDuplicate()}>
            <Copy className="size-4" />
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {invoice.status === "DRAFT" ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/invoices/${invoice.id}/edit`)}>
              <Pencil className="size-4" />
              Edit draft
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
