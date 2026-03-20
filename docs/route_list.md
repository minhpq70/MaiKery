# MaiKery API & Route List

This document describes all the pages (routes) and API endpoints available in the MaiKery web project.

## Public Storefront Routes (`/src/app/(store)`)

- `/` - Home Page: Hero section, featured products, categories.
- `/about` - About Page: Information about the bakery story.
- `/products` - Product Listing: Browse all products, filter by category/search.
- `/products/[id]` - Product Detail: View product details, add to cart.
- `/cart` - Shopping Cart: Review selected items, adjust quantities.
- `/checkout` - Checkout Flow: Form for delivery information, discount application, order summary.
- `/checkout/success/[id]` - Checkout Success: Confirmation page displaying the order ID and VietQR code for payment transfer.

## Protected Customer Routes

- `/profile` - User Dashboard: View customer account details and entire order history.
- `/orders/[id]` - Order Details: Detailed view of a past or current order, line items, and status.
- `/bill/[id]` - Receipt/Invoice Print View: A minimal, printer-friendly invoice for a specific checkout.

## Protected Admin Routes (`/src/app/(admin)`)

*Requires user role = `ADMIN`*

- `/admin` - Dashboard: Overview metrics (Total revenue, active orders, customer count).
- `/admin/products` - Product Management: List, filter, search products.
- `/admin/products/new` - Add Product: Create a new item.
- `/admin/products/[id]` - Edit Product: Update details.
- `/admin/orders` - Order Management: View incoming orders, dispatch.
- `/admin/orders/[id]` - Order Processing: Update payment and delivery status.
- `/admin/discounts` - Discount Engine: View list of codes, usage count.
- `/admin/discounts/new` - Generate Code: Create new promotional discount strings.
- `/admin/users` - Customer Base: View registered users, roles, and status.
- `/admin/settings` - Site Configuration: Update global store settings, bank info, and contact numbers.

## Authentication Routes

- `/auth/login` - Sign In form
- `/auth/register` - Sign Up form
- `/api/auth/[...nextauth]` - NextAuth Handlers (Login, Logout, Session retrieval)

## Backend API Endpoints (`/src/app/api`)

- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove`
- `POST /api/checkout` - Create Order via Transaction
- `POST /api/discounts/validate` - Check validity of code entered at checkout
