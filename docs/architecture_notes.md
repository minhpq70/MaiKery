# MaiKery Architecture Notes

## Application Structure

The application is built using **Next.js 14 App Router**.
- **`/src/app`**: Contains all pages, unified by layouts.
  - `(store)`: Group for all public-facing and customer-facing pages matching the same layout (header/footer).
  - `(admin)`: Dashboard layout for administrators (sidebar, admin top nav).
  - `api`: Backend endpoint logic.
  - `auth`: Isolated layout for Sign in / Sign up flows.

## State Management

- **Cart State**: Managed via React Context API (`CartContext`). The cart is persisted using `localStorage` on the client side, synchronizing cart contents across pages.
- **Server State**: Next.js App Router heavily leans into Server Components for data fetching (e.g., getting products, orders from DB directly in the component without additional API layers).

## Authentication & Authorization

- **NextAuth.js**: Handles user authentication via the `CredentialsProvider` utilizing JWT tokens.
- **Role-based Access Control**: 
  - Prisma User schema defines a `Role` enum (`USER`, `ADMIN`).
  - NextAuth JWT strategy incorporates user roles, injecting them into the `Session` object.
  - Server Components (like those in `/admin`) use `getServerSession` to verify `role === "ADMIN"` and block unprivileged requests via `redirect()`.
  - Next.js Middleware (`src/middleware.ts`) provides a global route protection layer, securing specific paths before components ever execute.

## Database Strategy (PrismaORM)

- Built with **PostgreSQL**, queries are fully typed.
- Relational mapping handles complex structures (e.g., An Order has many OrderItems; an Order connects to a single User if registered, a single DiscountCode if applied).
- Prisma's interactive db seeding (`prisma/seed.ts`) spins up initial mock state perfectly.

## Checkout Architecture

1. Client calculates subtotal locally or via API validation against a discount code.
2. Checkout submission hits `POST /api/checkout`.
3. The API runs a **Prisma Database Transaction** to ensure data integrity:
   - Verifies product availability and actual DB prices.
   - Calculates final exact total.
   - Validates Discount rule (dates, limits).
   - Decrements discount usage limit (if applicable).
   - Creates the `Order` record with payment metadata.
   - Creates `OrderItem` records linked to the `Order`.
4. Returns the successful `Order.id`.
5. Frontend redirects to `/checkout/success/[order.id]` to present the final VietQR payload.

## Component Library (TailwindCSS)

- Components strictly follow a high-end luxury bakery branding ethos.
- **Tokens**: Deep browns (`#40332B`), creams (`#FFFBF5`, `#E5D5C5`), and terracotta highlights (`#D96C4E`) are configured as utility arrays directly via tailwind classes for granular control.
- **Lucide Icons**: Provide a consistent icon library with minimal footprint.
