import { DEFAULT_PRODUCT_UNIT, formatCurrency } from "@/lib/utils";

export function PriceWithUnit({
  price,
  unit,
  className = "",
}: {
  price: number;
  unit?: string | null;
  className?: string;
}) {
  return (
    <span className={`whitespace-nowrap ${className}`}>
      {formatCurrency(price)}
      <span className="ml-1 text-[0.75em] font-normal text-[#5C4D43]">/ {unit || DEFAULT_PRODUCT_UNIT}</span>
    </span>
  );
}
