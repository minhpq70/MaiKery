# MaiKery – Giải pháp quản lý giá vốn và tính giá thành sản phẩm

## 1. Mục tiêu

Xây dựng một module quản lý giá vốn cho dự án **MaiKery** để:

- quản lý **nguyên vật liệu mua vào** theo từng bill;
- tự tính **đơn giá chuẩn** của từng nguyên vật liệu;
- nhập **định mức cho từng mẻ bánh**;
- tính **giá thành một mẻ** và **giá thành trên từng sản phẩm**;
- làm nền tảng để sau này tính:
  - lãi gộp theo sản phẩm,
  - lãi theo đơn hàng,
  - biến động giá vốn theo thời gian.

Mục tiêu vận hành thực tế là:

1. Có bill mua hàng → nhập dữ liệu.
2. Hệ thống tự tính ra giá của từng nguyên vật liệu.
3. Khi nhập một mẻ bánh, hệ thống tự tính tổng chi phí nguyên liệu của mẻ.
4. Chia theo số lượng thành phẩm thực tế để ra **giá thành/chiếc**.
5. Khi bán hàng, hệ thống ghi nhận **giá vốn** của sản phẩm.

---

## 2. Tư duy nghiệp vụ cốt lõi

Bài toán được tách thành 4 lớp dữ liệu:

### 2.1. Mua hàng (Purchase)
Mỗi bill mua nguyên vật liệu tạo ra các dòng nhập hàng:

- mua gì,
- số lượng bao nhiêu,
- đơn vị gì,
- tổng tiền bao nhiêu.

Từ đó tính ra:

- **đơn giá chuẩn** của nguyên vật liệu.

Ví dụ:

- Đường xay 2 gói 500g, tổng 34.000
- Quy đổi thành 1.000g
- Đơn giá chuẩn = 34.000 / 1.000 = 34 VND/g

### 2.2. Giá nguyên vật liệu hiện hành (Material Cost)
Từ lịch sử mua hàng, hệ thống xác định giá đang dùng để tính giá thành.

Có thể chọn một trong 3 cách:

1. **Latest Cost**: lấy giá nhập gần nhất.
2. **Weighted Average Cost**: bình quân gia quyền theo các lần nhập.
3. **Manual Override**: kế toán/owner nhập giá thủ công để chốt.

Khuyến nghị cho MaiKery giai đoạn đầu:

- dùng **Latest Cost** làm mặc định;
- cho phép **Manual Override** để can thiệp khi cần.

### 2.3. Công thức chuẩn (Recipe Template)
Mỗi sản phẩm có một công thức chuẩn, gồm nhiều dòng nguyên vật liệu:

- sản phẩm Bánh dứa
- gồm:
  - 2 quả dứa
  - 200g bơ
  - 400g bột mì
  - 50g bột ngô
  - 5 quả trứng
  - 200g đường
  - 80g sữa đặc

Đây là **định mức lý thuyết**.

### 2.4. Mẻ sản xuất thực tế (Production Batch)
Khi thực sự làm bánh, phải nhập:

- sản phẩm gì,
- ngày làm,
- số lượng mẻ,
- định mức thực dùng,
- số thành phẩm thực tế.

Từ đó tính được:

- tổng chi phí nguyên vật liệu của mẻ,
- chi phí bao bì,
- chi phí phụ trợ,
- giá thành thực tế/chiếc.

---

## 3. Điểm quan trọng về đơn vị tính

Hệ thống không bắt buộc quy toàn bộ về gram.

MaiKery đang có 2 kiểu đơn vị:

- **gram**: đường, bơ, bột mì, bột ngô, sữa đặc...
- **quả**: trứng, dứa...

Do đó thiết kế nên hỗ trợ **đơn vị chuẩn theo từng nguyên vật liệu**:

- đường: g
- bơ: g
- trứng: quả
- dứa: quả

Nguyên tắc:

- đơn giá nguyên vật liệu được tính theo **đơn vị chuẩn** của chính nó;
- khi nhập công thức hoặc mẻ sản xuất, số lượng cũng nhập theo **đúng đơn vị chuẩn** đó.

Ví dụ:

- Trứng: 3.500 VND/quả
- Dứa: 20.000 VND/quả
- Đường xay: 34 VND/g
- Bơ lạt: 128 VND/g

Khi đó:

- chi phí trứng = số quả × đơn giá/quả
- chi phí đường = số gram × đơn giá/g

---

## 4. Quy tắc gộp mã nguyên vật liệu

Dựa trên file Google Sheet hiện tại, nên áp dụng quy tắc:

### 4.1. Gộp mã theo bản chất nguyên vật liệu
Không nên giữ mỗi bill là một mã riêng.

Ví dụ:

- `DUONG_XAY_500G`
- `DUONG_XAY_1KG`

nên gộp thành:

- `DUONG_XAY`

Tương tự:

- `BO_PILOT_1KG`
- `BO_LAT_ALLOWRIE_1KG`

nên gộp thành:

- `BO_LAT`

### 4.2. Giữ thêm thông tin biến thể / thương hiệu
Dù gộp mã để tính giá, vẫn nên lưu thêm:

- brand,
- quy cách,
- ghi chú bill gốc.

Ví dụ:

- mã nguyên vật liệu: `BO_LAT`
- brand: `Pilot`
- pack size: `1000g`

Mục đích:
- giá vốn gọn;
- vẫn truy vết được lịch sử mua.

---

## 5. Luồng vận hành đề xuất

### Bước 1 – nhập bill mua hàng
Nhân sự nhập từng dòng bill vào hệ thống:

- ngày mua,
- nhà cung cấp,
- nguyên vật liệu,
- số lượng mua,
- đơn vị mua,
- tổng tiền.

Hệ thống tự tính:

- số lượng chuẩn,
- đơn giá chuẩn.

### Bước 2 – cập nhật giá vật tư hiện hành
Sau khi lưu bill:

- hệ thống cập nhật giá hiện hành của vật tư theo phương pháp đã chọn.

### Bước 3 – tạo công thức sản phẩm
Owner nhập công thức chuẩn cho từng sản phẩm.

Ví dụ:
- Bánh dứa
- yield chuẩn: 35 bánh/mẻ
- danh sách nguyên liệu như trên.

### Bước 4 – ghi nhận mẻ sản xuất
Khi làm bánh thực tế:

- chọn sản phẩm,
- nhập ngày sản xuất,
- nhập số thành phẩm thực tế,
- hệ thống tự nạp công thức chuẩn,
- cho phép chỉnh lại số lượng nguyên liệu thực dùng nếu khác chuẩn.

### Bước 5 – tính giá thành
Hệ thống tính:

- tổng chi phí nguyên liệu,
- tổng chi phí bao bì,
- tổng chi phí phụ trợ,
- tổng chi phí mẻ,
- giá thành 1 bánh.

### Bước 6 – dùng giá thành cho bán hàng
Khi phát sinh đơn hàng, hệ thống có thể:

- lấy giá thành mới nhất của sản phẩm,
- hoặc lấy giá thành từ mẻ đã xuất hàng.

Giai đoạn đầu khuyến nghị:
- mỗi sản phẩm dùng **giá thành gần nhất từ mẻ sản xuất gần nhất**.

---

## 6. Phạm vi MVP nên làm trước

### Phase 1 – đủ dùng thật
Bao gồm:

1. Quản lý danh mục nguyên vật liệu
2. Nhập bill mua hàng
3. Tính giá nguyên vật liệu hiện hành
4. Quản lý công thức sản phẩm
5. Nhập mẻ sản xuất
6. Tính giá thành sản phẩm
7. Xem báo cáo giá thành hiện hành

### Phase 2 – nâng cao
Bao gồm:

1. Quản lý tồn kho nguyên vật liệu
2. Trừ kho theo mẻ sản xuất
3. Giá vốn theo lô
4. Gắn giá vốn vào từng đơn hàng
5. Báo cáo lãi gộp theo sản phẩm / theo ngày / theo tháng
6. Import bill bằng OCR / AI
7. Dashboard biến động giá vốn

---

## 7. Thiết kế dữ liệu cho hệ thống

Dưới đây là thiết kế hướng Prisma + Supabase.

### 7.1. materials

```prisma
model Material {
  id               String   @id @default(cuid())
  code             String   @unique
  name             String
  category         String?
  baseUnit         String   // g, qua, cai, hop...
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  purchaseItems    PurchaseItem[]
  costSnapshots    MaterialCostSnapshot[]
  recipeItems      RecipeItem[]
  batchItems       ProductionBatchItem[]
}
```

### 7.2. suppliers

```prisma
model Supplier {
  id          String   @id @default(cuid())
  name        String
  phone       String?
  address     String?
  note        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  purchases   Purchase[]
}
```

### 7.3. purchases

```prisma
model Purchase {
  id            String         @id @default(cuid())
  supplierId    String?
  supplier      Supplier?      @relation(fields: [supplierId], references: [id])
  purchaseDate  DateTime
  source        String?        // manual, imported_bill, etc
  invoiceNo     String?
  note          String?
  totalAmount   Decimal?       @db.Decimal(12, 2)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  items         PurchaseItem[]
}
```

### 7.4. purchase_items

```prisma
model PurchaseItem {
  id              String   @id @default(cuid())
  purchaseId      String
  purchase        Purchase @relation(fields: [purchaseId], references: [id], onDelete: Cascade)

  materialId      String
  material        Material @relation(fields: [materialId], references: [id])

  itemNameRaw     String?
  brand           String?
  packSizeText    String?  // ví dụ: 500g, 1kg
  quantity        Decimal  @db.Decimal(12, 3) // số lượng mua
  unit            String   // g, kg, qua, goi...
  conversionRate  Decimal? @db.Decimal(12, 4) // đổi về base unit nếu cần
  quantityBase    Decimal  @db.Decimal(12, 3) // số lượng theo đơn vị chuẩn
  amount          Decimal  @db.Decimal(12, 2)
  unitCostBase    Decimal  @db.Decimal(12, 4) // giá theo base unit

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### 7.5. material_cost_snapshots

```prisma
model MaterialCostSnapshot {
  id             String   @id @default(cuid())
  materialId     String
  material       Material @relation(fields: [materialId], references: [id])

  costMethod     String   // latest, weighted_average, manual
  unitCost       Decimal  @db.Decimal(12, 4)
  effectiveAt    DateTime
  note           String?

  createdAt      DateTime @default(now())
}
```

### 7.6. products

```prisma
model Product {
  id                    String   @id @default(cuid())
  code                  String   @unique
  name                  String
  category              String?
  targetMarginPercent   Decimal? @db.Decimal(5, 2)
  defaultYield          Int?
  packagingCostDefault  Decimal? @db.Decimal(12, 2)
  overheadCostDefault   Decimal? @db.Decimal(12, 2)
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  recipeVersions        RecipeVersion[]
  productionBatches     ProductionBatch[]
}
```

### 7.7. recipe_versions

```prisma
model RecipeVersion {
  id             String      @id @default(cuid())
  productId      String
  product        Product     @relation(fields: [productId], references: [id], onDelete: Cascade)

  versionNo      Int
  name           String?
  yieldQuantity  Int
  isDefault      Boolean     @default(false)
  note           String?
  createdAt      DateTime    @default(now())

  items          RecipeItem[]

  @@unique([productId, versionNo])
}
```

### 7.8. recipe_items

```prisma
model RecipeItem {
  id               String        @id @default(cuid())
  recipeVersionId  String
  recipeVersion    RecipeVersion @relation(fields: [recipeVersionId], references: [id], onDelete: Cascade)

  materialId       String
  material         Material      @relation(fields: [materialId], references: [id])

  quantity         Decimal       @db.Decimal(12, 3)
  unit             String
  wastePercent     Decimal?      @db.Decimal(5, 2)
  note             String?

  createdAt        DateTime      @default(now())
}
```

### 7.9. production_batches

```prisma
model ProductionBatch {
  id                  String   @id @default(cuid())
  productId           String
  product             Product  @relation(fields: [productId], references: [id])

  recipeVersionId     String?
  recipeVersion       RecipeVersion? @relation(fields: [recipeVersionId], references: [id])

  batchDate           DateTime
  batchCode           String?  @unique
  plannedYield        Int?
  actualYield         Int
  packagingCost       Decimal? @db.Decimal(12, 2)
  overheadCost        Decimal? @db.Decimal(12, 2)

  totalMaterialCost   Decimal? @db.Decimal(12, 2)
  totalBatchCost      Decimal? @db.Decimal(12, 2)
  unitCost            Decimal? @db.Decimal(12, 2)

  note                String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  items               ProductionBatchItem[]
}
```

### 7.10. production_batch_items

```prisma
model ProductionBatchItem {
  id                String          @id @default(cuid())
  productionBatchId String
  productionBatch   ProductionBatch @relation(fields: [productionBatchId], references: [id], onDelete: Cascade)

  materialId        String
  material          Material        @relation(fields: [materialId], references: [id])

  quantity          Decimal         @db.Decimal(12, 3)
  unit              String
  unitCostUsed      Decimal         @db.Decimal(12, 4)
  lineCost          Decimal         @db.Decimal(12, 2)
  sourceMethod      String?         // latest, weighted_average, manual

  createdAt         DateTime        @default(now())
}
```

---

## 8. Công thức tính toán nghiệp vụ

### 8.1. Đơn giá chuẩn của một dòng mua hàng

```text
unitCostBase = amount / quantityBase
```

### 8.2. Giá hiện hành của nguyên vật liệu – bình quân gia quyền

```text
weightedAverageCost = tổng amount / tổng quantityBase
```

### 8.3. Chi phí một dòng nguyên liệu trong mẻ

```text
lineCost = quantity × unitCostUsed × (1 + wastePercent)
```

### 8.4. Tổng chi phí nguyên liệu của mẻ

```text
totalMaterialCost = sum(lineCost của tất cả dòng nguyên liệu)
```

### 8.5. Tổng giá thành mẻ

```text
totalBatchCost = totalMaterialCost + packagingCost + overheadCost
```

### 8.6. Giá thành một sản phẩm

```text
unitCost = totalBatchCost / actualYield
```

---

## 9. Ví dụ thực tế với Bánh dứa

Công thức chuẩn:

- 2 quả dứa
- 200g bơ
- 400g bột mì
- 50g bột ngô
- 5 quả trứng
- 200g đường
- 80g sữa đặc

Yield:
- 35 bánh

Giả sử giá hiện hành:
- dứa: 20.000 / quả
- bơ lạt: 128 / g
- bột mì: 30 / g
- bột ngô: 57.5 / g
- trứng: 3.500 / quả
- đường xay: 34 / g
- sữa đặc: 55 / g

Thì chi phí nguyên liệu:

- dứa = 2 × 20.000 = 40.000
- bơ = 200 × 128 = 25.600
- bột mì = 400 × 30 = 12.000
- bột ngô = 50 × 57.5 = 2.875
- trứng = 5 × 3.500 = 17.500
- đường = 200 × 34 = 6.800
- sữa đặc = 80 × 55 = 4.400

Tổng chi phí nguyên liệu:

```text
109.175
```

Nếu:
- packagingCost = 10.000
- overheadCost = 5.000

Thì:

```text
totalBatchCost = 124.175
unitCost = 124.175 / 35 = 3.548 VND / bánh
```

Nếu muốn margin 35%:

```text
sellingPrice = unitCost / (1 - 0.35) = 5.458 VND / bánh
```

---

## 10. Gợi ý API routes cho Next.js

- `GET /api/materials`
- `POST /api/materials`
- `PATCH /api/materials/:id`

- `GET /api/purchases`
- `POST /api/purchases`
- `GET /api/purchases/:id`

- `POST /api/material-costs/recompute`

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id/recipe`
- `POST /api/products/:id/recipe-versions`

- `POST /api/production-batches`
- `GET /api/production-batches`
- `GET /api/production-batches/:id`

- `GET /api/costing/products/current`
- `GET /api/costing/batches/:id`

---

## 11. Kiến trúc service layer nên tách riêng

```text
src/
  lib/
    costing/
      recomputeMaterialCosts.ts
      calculateBatchCost.ts
      createBatchFromRecipe.ts
      getCurrentMaterialCost.ts
    db/
      prisma.ts
  app/
    api/
      purchases/
      products/
      production-batches/
      costing/
```

---

## 12. Luồng UI đề xuất

### 12.1. Màn hình nguyên vật liệu
- danh sách vật tư
- đơn vị chuẩn
- giá hiện hành
- lịch sử mua gần nhất

### 12.2. Màn hình nhập bill
- nhập đầu bill
- thêm nhiều dòng vật tư
- chọn vật tư từ danh mục
- nếu vật tư mới chưa có thì cho tạo nhanh

### 12.3. Màn hình sản phẩm
- danh sách sản phẩm
- giá thành hiện tại
- giá bán gợi ý

### 12.4. Màn hình công thức
- chọn sản phẩm
- thêm nhiều dòng nguyên vật liệu
- nhập yield chuẩn

### 12.5. Màn hình mẻ sản xuất
- tạo mẻ mới từ công thức
- cho phép sửa định mức thực tế
- nhập yield thực tế
- xem giá thành tính ngay

---

## 13. Quy tắc kỹ thuật cần lưu ý

### 13.1. Dùng Decimal, không dùng Float
Tất cả tiền và định lượng nên dùng `Decimal` trong Prisma để tránh sai số.

### 13.2. Snapshot giá tại thời điểm sản xuất
Khi tạo mẻ sản xuất phải lưu `unitCostUsed` ngay trên `ProductionBatchItem`.

### 13.3. Không sửa ngược lịch sử
Bill cũ, mẻ cũ không nên bị overwrite.

### 13.4. Hỗ trợ manual cost
Một số nguyên liệu chưa có bill vẫn phải cho nhập tay:
- trứng
- dứa
- sữa đặc
- bột mì

---

## 14. Mapping từ Google Sheet hiện tại sang hệ thống mới

- `DM_NVL` → `materials`
- `NHAP_HANG` → `purchases` + `purchase_items`
- `GIA_NVL` → `material_cost_snapshots`
- `DINH_MUC` → `recipe_versions` + `recipe_items`
- `GIA_THANH` → dữ liệu tính toán từ batch / recipe / material cost

---

## 15. Prompt triển khai cho Antigravity

Xây dựng module quản lý giá vốn cho dự án MaiKery bằng Next.js App Router, TypeScript, Prisma, Supabase và API Routes. Hệ thống phải quản lý nguyên vật liệu, bill mua hàng, công thức sản phẩm và mẻ sản xuất. Mỗi nguyên vật liệu có đơn vị chuẩn riêng như g hoặc quả. Từ các bill mua hàng, hệ thống tính ra đơn giá chuẩn của từng nguyên vật liệu theo đơn vị chuẩn. Hỗ trợ gộp nhiều biến thể mua hàng vào cùng một mã nguyên vật liệu, ví dụ Đường xay 500g và Đường xay 1kg cùng map vào DUONG_XAY; Bơ lạt Pilot 1kg và Bơ lạt Allowrie 1kg cùng map vào BO_LAT. Từ công thức sản phẩm và giá nguyên vật liệu hiện hành, hệ thống tính chi phí nguyên vật liệu cho một mẻ. Khi tạo mẻ sản xuất, hệ thống clone công thức chuẩn thành các dòng nguyên vật liệu thực tế, lưu snapshot đơn giá đã dùng cho từng dòng, tính tổng chi phí nguyên vật liệu, cộng bao bì và overhead, sau đó chia cho số thành phẩm thực tế để ra giá thành 1 sản phẩm. Cần có CRUD cho materials, suppliers, purchases, products, recipe versions, production batches; có API recompute material costs theo weighted average; có trang quản trị để nhập bill, tạo công thức, tạo mẻ sản xuất và xem báo cáo giá thành hiện hành.

---

## 16. Thứ tự nên yêu cầu Antigravity code

1. Prisma schema
2. Migration
3. Seed dữ liệu mẫu
4. CRUD materials
5. CRUD purchases + purchase_items
6. Service recompute material costs
7. CRUD products + recipe versions
8. Tạo production batch từ recipe
9. Tính giá thành batch
10. UI dashboard

---

## 17. Kết luận

Thiết kế tốt nhất cho MaiKery không phải là tính giá thành trực tiếp trên đơn hàng bán, mà là:

1. **bill mua hàng** → ra **giá nguyên vật liệu**
2. **công thức + mẻ sản xuất** → ra **giá thành sản phẩm**
3. **bán hàng** → dùng giá thành đã tính để xác định giá vốn

Cách này bám đúng thực tế làm bánh:
- giá nguyên liệu biến động theo bill,
- mỗi mẻ có thể hơi khác định mức,
- giá thành phải dựa trên sản xuất thực tế.
