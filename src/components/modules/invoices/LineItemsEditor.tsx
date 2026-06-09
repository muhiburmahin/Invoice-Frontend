"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvoiceFormInput } from "@/lib/validations";
import { formatCurrency } from "@/lib/utils";

type LineItemsEditorProps = {
  control: Control<InvoiceFormInput>;
  register: UseFormRegister<InvoiceFormInput>;
  errors: FieldErrors<InvoiceFormInput>;
  currency: string;
};

export function LineItemsEditor({
  control,
  register,
  errors,
  currency,
}: LineItemsEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const items = useWatch({ control, name: "items" }) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Line items</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              description: "",
              quantity: 1,
              rate: 0,
              unit: "",
              taxable: true,
            })
          }
        >
          <Plus className="size-4" />
          Add item
        </Button>
      </div>

      <div className="rounded-xl border border-brand-secondary/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="w-24">Qty</TableHead>
              <TableHead className="w-28">Rate</TableHead>
              <TableHead className="w-20">Unit</TableHead>
              <TableHead className="w-16 text-center">Tax</TableHead>
              <TableHead className="w-28 text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => {
              const itemErrors = errors.items?.[index];
              const qty = items[index]?.quantity ?? 0;
              const rate = items[index]?.rate ?? 0;
              const amount = Math.round(qty * rate * 100) / 100;

              return (
                <TableRow key={field.id}>
                  <TableCell>
                    <Input
                      {...register(`items.${index}.description`)}
                      placeholder="Service or product"
                    />
                    {itemErrors?.description ? (
                      <p className="mt-1 text-xs text-destructive">
                        {itemErrors.description.message}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min={0.01}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      {...register(`items.${index}.rate`, { valueAsNumber: true })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input {...register(`items.${index}.unit`)} placeholder="hrs" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Controller
                      control={control}
                      name={`items.${index}.taxable`}
                      render={({ field: taxableField }) => (
                        <Checkbox
                          checked={taxableField.value ?? true}
                          onCheckedChange={(checked) =>
                            taxableField.onChange(checked === true)
                          }
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(amount, currency)}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={fields.length <= 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {errors.items?.message ? (
        <p className="text-sm text-destructive">{errors.items.message}</p>
      ) : null}
    </div>
  );
}
