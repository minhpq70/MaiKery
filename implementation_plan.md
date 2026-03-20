# MaiKery — Implementation Plan

## Overview

A production-ready Next.js web app for a small bakery brand. Fully Vietnamese UI. Two sections: a polished customer storefront and a functional admin back office.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase (or Neon Postgres) |
| ORM | Prisma |
| Auth | NextAuth.js v4 (credentials provider) |
| Validation | Zod |
| Image Upload | Supabase Storage (signed URLs) |
| QR Code | `qrcode.react` or `react-qr-code` |
| Deployment | Vercel |

---

## Proposed Changes

### Project Structure

#### [NEW] Next.js Project at `/Users/admin/Documents/maikery`

```
maikery/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (customer)/          # Customer-facing layout group
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # /  (Home)
│   │   │   ├── about/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── account/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   └── bill/[orderId]/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx     # dashboard
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   ├── discount-codes/
│   │   │   │   ├── users/
│   │   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── discount-codes/
│   │   │   └── upload/
│   │   └── layout.tsx           # Root layout
│   ├── components/
│   │   ├── ui/                  # Reusable UI primitives
│   │   ├── admin/               # Admin-specific components
│   │   └── store/               # Storefront components
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── validations.ts
│   │   ├── order-id.ts
│   │   └── qr.ts
│   ├── hooks/
│   │   └── use-cart.ts
│   ├── context/
│   │   └── cart-context.tsx
│   └── types/
│       └── index.ts
├── public/
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

### Database Schema (Prisma)

**Models:**
- `User` — customers + admins, role field
- `Product` — productCode, name, description, image, price, active
- `Order` — orderId (MKddmmyynnn), customer info, totals, statuses
- `OrderItem` — product ref, qty, unit price, line total
- `DiscountCode` — code, dates, percent, status
- `SiteSettings` — bank BIN, account number, account name
- `DailyOrderSequence` — date string + counter for orderId generation

---

### Authentication

- NextAuth.js credentials provider
- Roles: `ADMIN`, `CUSTOMER`
- Middleware protects `/admin/*` (requires ADMIN role)
- Middleware protects `/account`, `/cart`, `/checkout` (requires login)
- Admin has separate login at `/admin/login`

---

### Admin Features

#### Product Management
- `/admin/products` — list with search, active filter
- `/admin/products/new` — add form with image upload
- `/admin/products/[id]/edit` — edit form

#### Orders
- `/admin/orders` — list with search, date/payment/delivery filters
- `/admin/orders/[id]` — detail view + status update

#### Discount Codes
- `/admin/discount-codes` — list + generate form
- Auto-generate code on button click, save, display

#### Users
- `/admin/users` — list, disable/enable, promote

#### Settings
- `/admin/settings` — bank account config for QR

#### Dashboard
- `/admin` — cards: total orders, today revenue, unpaid, pending deliveries

---

### Customer Storefront

- Home: hero banner, featured products, brand intro
- About: brand story
- Products: grid layout, product cards
- Cart: add/update/remove, summary
- Checkout: prefill for logged-in users, discount validation
- Bill: receipt-style invoice + VietQR payment QR

---

### Order ID Generation

Database-backed approach using `DailyOrderSequence`:
1. Begin transaction
2. Upsert row for today's date, increment counter
3. Format: `MK${dd}${mm}${yy}${nnn.padStart(3,'0')}`
4. Safe under concurrent requests

---

### QR Code

- Use VietQR standard format
- Store bank settings in `SiteSettings`
- Generate QR URL: `https://img.vietqr.io/image/{BIN}-{ACCOUNT}-compact.png?amount={total}&addInfo={orderId}&accountName={name}`

---

## Verification Plan

### Manual Testing (Local)
1. Run `npm run dev` at `localhost:3000`
2. Visit `/` — verify home page loads with Vietnamese text
3. Register a customer account at `/register`
4. Add products to cart, go to `/cart`, then `/checkout`
5. Complete checkout → verify bill at `/bill/[orderId]`
6. Login as admin at `/admin/login` (seed credentials in README)
7. Check dashboard, product CRUD, order management, discount codes

### Database
- Run `npx prisma migrate dev` — verify schema applies
- Run `npx prisma db seed` — verify seed data appears

### API
- POST `/api/orders` — verify orderId format MKddmmyynnn
- POST `/api/discount-codes/validate` — verify expired codes rejected
