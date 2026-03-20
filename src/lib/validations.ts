import { z } from "zod";

// Auth
export const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

// Product
export const productSchema = z.object({
  productCode: z.string().min(1, "Mã sản phẩm không được để trống"),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  salePrice: z.number().positive("Giá bán phải lớn hơn 0"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  imageUrl: z.string().optional().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Checkout
export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Tên khách hàng phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(11, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ không được để trống"),
  discountCode: z.string().optional(),
  note: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Discount Code
export const discountCodeSchema = z.object({
  code: z.string().min(1, "Mã không được để trống"),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().min(0, "Giá trị giảm phải từ 0"),
  minimumOrderValue: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

// Site Settings
export const siteSettingsSchema = z.object({
  bankBin: z.string(),
  bankAccount: z.string(),
  bankName: z.string(),
  bankShortName: z.string(),
  storeName: z.string(),
  storePhone: z.string(),
  storeEmail: z.string(),
  storeAddress: z.string(),
});
