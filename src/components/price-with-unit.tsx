import { formatCurrency, formatUnitLabel } from "@/lib/utils";

export function PriceWithUnit({
  price,
  unit,
  unitDetail,
  className = "",
}: {
  price: number;
  unit?: string | null;
  unitDetail?: string | null;
  className?: string;
}) {
  // Price and unit label each stay on one line; on narrow cards the label wraps below as a whole
  return (
    <span className={className}>
      <span className="whitespace-nowrap">{formatCurrency(price)}</span>{" "}
      <span className="whitespace-nowrap text-[0.75em] font-normal text-[#5C4D43]">
        / {formatUnitLabel(unit, unitDetail)}
      </span>
    </span>
  );
}
