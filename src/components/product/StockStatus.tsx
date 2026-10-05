import { AlertTriangle, CheckCircle2, PackageX } from "lucide-react";

/** Stok durumu göstergesi: yeşil (stokta), amber (son adetler), kırmızı (tükendi). */
export default function StockStatus({
  stock,
  lowStockAlert = 5,
}: {
  stock: number;
  lowStockAlert?: number;
}) {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-700">
        <PackageX className="size-4" /> Stokta Yok
      </span>
    );
  }

  if (stock <= lowStockAlert) {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg bg-accent-500/15 px-3 py-1.5 text-sm font-semibold text-accent-600">
        <AlertTriangle className="size-4" /> Son {stock} adet
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700">
      <CheckCircle2 className="size-4" /> Stokta ({stock} adet)
    </span>
  );
}
