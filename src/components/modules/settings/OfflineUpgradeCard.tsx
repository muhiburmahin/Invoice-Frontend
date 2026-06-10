"use client";

import { useState } from "react";
import { Banknote, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOfflineUpgradeRequest } from "@/hooks/useBilling";
import { getApiErrorMessage } from "@/lib/api";
import type { OfflineBillingInfo } from "@/types/billing";

type OfflineUpgradeCardProps = {
  offline: OfflineBillingInfo;
  pending: boolean;
  currentPlan: string;
};

export function OfflineUpgradeCard({
  offline,
  pending,
  currentPlan,
}: OfflineUpgradeCardProps) {
  const requestUpgrade = useOfflineUpgradeRequest();
  const [paymentReference, setPaymentReference] = useState("");
  const [note, setNote] = useState("");

  if (!offline.enabled || currentPlan !== "FREE") {
    return null;
  }

  const { pro, paymentMethods } = offline;

  async function handleSubmit() {
    if (!paymentReference.trim()) {
      toast.error("Enter your bKash / bank transaction ID");
      return;
    }

    try {
      const result = await requestUpgrade.mutateAsync({
        plan: "PRO",
        paymentReference: paymentReference.trim(),
        note: note.trim() || undefined,
      });
      toast.success(result.message);
      setPaymentReference("");
      setNote("");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="border-brand/30 bg-brand-secondary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Banknote className="size-5 text-brand" />
          Upgrade to Pro — offline payment
        </CardTitle>
        <CardDescription>
          Pay with bKash or bank transfer, then submit your transaction ID. Admin
          will activate Pro after verification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-brand-secondary/50 bg-background/80 p-4 text-sm">
          <p className="font-semibold text-brand">
            {pro.label}: {pro.price} {pro.currency} / month
          </p>
          <ul className="mt-3 space-y-1.5 text-muted-foreground">
            {paymentMethods.bkash ? (
              <li className="flex items-center gap-2">
                <Smartphone className="size-4 shrink-0 text-brand" />
                bKash: <span className="font-medium text-foreground">{paymentMethods.bkash}</span>
              </li>
            ) : null}
            {paymentMethods.nagad ? (
              <li>Nagad: <span className="font-medium text-foreground">{paymentMethods.nagad}</span></li>
            ) : null}
            {paymentMethods.bankName && paymentMethods.bankAccount ? (
              <li>
                Bank ({paymentMethods.bankName}):{" "}
                <span className="font-medium text-foreground">{paymentMethods.bankAccount}</span>
              </li>
            ) : null}
          </ul>
          <p className="mt-3 text-xs">{offline.instructions}</p>
        </div>

        {pending ? (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
            Your Pro upgrade request is pending. An admin will activate your plan
            after verifying payment — usually within 24 hours.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="payment-reference">Transaction ID *</Label>
              <Input
                id="payment-reference"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="e.g. bKash TrxID or bank reference"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="upgrade-note">Note (optional)</Label>
              <Input
                id="upgrade-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Sender number or extra details"
              />
            </div>
            <Button
              className="w-full bg-brand text-brand-foreground"
              onClick={() => void handleSubmit()}
              disabled={requestUpgrade.isPending}
            >
              {requestUpgrade.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Banknote className="size-4" />
              )}
              I&apos;ve paid — request Pro activation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
