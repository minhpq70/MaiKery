export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export const PRODUCT_UNITS = [
  "chiếc",
  "cái",
  "ổ",
  "bánh",
  "hộp",
  "phần",
  "miếng",
  "set",
  "hũ",
  "túi",
  "khay",
];

export const DEFAULT_PRODUCT_UNIT = "chiếc";

// "2 hộp", falling back to the default unit for orders/cart items saved before units existed
export function formatQuantity(quantity: number, unit?: string | null) {
  return `${quantity} ${unit || DEFAULT_PRODUCT_UNIT}`;
}

// "hộp 4 chiếc": the selling unit followed by its pack size, if any
export function formatUnitLabel(unit?: string | null, unitDetail?: string | null) {
  return [unit || DEFAULT_PRODUCT_UNIT, unitDetail?.trim()].filter(Boolean).join(" ");
}
