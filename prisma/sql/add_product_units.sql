-- Đơn vị tính (unit) và quy cách (unitDetail) cho sản phẩm; OrderItem lưu lại đơn vị lúc đặt hàng.
-- Chạy: npx prisma db execute --file prisma/sql/add_product_units.sql

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "unit" TEXT NOT NULL DEFAULT 'chiếc';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "unitDetail" TEXT;

ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "unit" TEXT NOT NULL DEFAULT 'chiếc';
