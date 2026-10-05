"use client";

import { useActionState, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";
import { updateOrderStatus, type OrderActionState } from "@/server/actions/orders";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

const SELECTABLE: OrderStatus[] = [
  "PENDING",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const action = updateOrderStatus.bind(null, orderId);
  const [state, formAction, pending] = useActionState<OrderActionState, FormData>(action, {});
  const [status, setStatus] = useState<OrderStatus>(currentStatus);

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label className="text-sm font-medium text-ink-700">Sipariş Durumu</label>
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="mt-1.5 h-11 w-full rounded-xl border border-ink-200 px-3 text-sm focus:border-brand-500 focus:outline-none"
        >
          {SELECTABLE.map((value) => (
            <option key={value} value={value}>
              {ORDER_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-ink-700">Not / Kargo Takip No</label>
        <textarea
          name="note"
          rows={2}
          placeholder="Örn. Kargo takip no: 1234567890"
          className="mt-1.5 w-full rounded-xl border border-ink-200 p-3 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      {state.error && (
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
          <AlertCircle className="size-4" /> {state.error}
        </p>
      )}
      {state.success && (
        <p className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
          <CheckCircle2 className="size-4" /> Sipariş durumu güncellendi.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Durumu Güncelle
      </button>
    </form>
  );
}
