# Restore order saving, admin Orders tools and password reset

Both findings are confirmed: the features existed in an earlier version and are missing now. The saved-orders list in the database still exists, so no data was lost.

## 1. Cart orders

- "Send order on WhatsApp" saves the order first, then opens WhatsApp with an "Order ref: GH-XXXXXX" line.
- If saving fails, WhatsApp still opens so no customer is lost.
- Prices stay hidden unless the owner confirmed them (unchanged rule).

## 2. Admin panel

- Bring back Dashboard (counts of new orders, enquiries, bookings) and Orders tab (ref, items, status: new / confirmed / ready / completed / cancelled).
- Bring back enquiry status picker and quoted price (OMR) field.
- Keep every current tab (Inbox, Bookings, Shop catalogue, Shop photos, etc.) as they are.

## 3. Password reset

- "Forgot your password?" on the sign-in page sends a reset email (admin email only).
- Restore the reset-password page so emailed links open correctly.
- Add a "Send password reset link" button in an admin Security tab.

## Technical details

- Restore src/lib/orders.ts (priceOrder, newOrderRef, statuses) from commit bb16c2bd, plus its tests.
- Re-add placeOrder server fn in src/lib/shop.functions.ts (validates lines, prices server-side from products, inserts into public.orders via public insert policy check).
- Add optional ref param back to cartWhatsAppText/cartWhatsAppURL.
- Merge Overview/Orders/SecuritySettings/PriceField from old admin.tsx into the current one.
- Restore src/routes/reset-password.tsx; re-add "forgot" mode in auth.tsx.
- Regenerate database types; verify orders RLS policies still match.
