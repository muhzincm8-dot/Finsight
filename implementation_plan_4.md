# Finsight Feature Addition Plan

## Overview
Adding 4 major features to the Finsight finance app:
1. **Admin Panel** — Dashboard to manage users (active/inactive toggle, suspend accounts)
2. **Payment Gateway** — One-time payment for lifetime premium access
3. **Profile Fix** — Show currently logged-in user's data; sync state after update
4. **Auth Fix** — Block inactive/suspended users from logging in

## Open Questions

> [!IMPORTANT]
> **Payment Gateway**: No real payment gateway credentials (Razorpay/Stripe) are available. I will integrate **Razorpay** (popular in India, easy test mode). Please provide your Razorpay Key ID and Secret, or I can use test/dummy keys for now and leave placeholders.

> [!IMPORTANT]
> **Admin User**: How should the first admin be created? Options:
> - A) Hardcode a specific email as admin (e.g., set `role: 'admin'` in DB manually)
> - B) Add an `isFirstUser` logic (first registered user becomes admin)
> - C) Add a separate seed script to promote a user to admin

> [!NOTE]
> **Payment**: Since this is a student project, I'll integrate Razorpay in test mode. You'll need a Razorpay account to get live keys. For now I'll use placeholder test keys.

---

## Proposed Changes

### Backend

---

#### [MODIFY] [User.js](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/backend/src/models/User.js)
Add new fields to User schema:
- `role` — `'user'` or `'admin'` (default: `'user'`)
- `isActive` — boolean (default: `true`)
- `hasPaid` — boolean (default: `false`)
- `paymentDate` — Date

---

#### [NEW] [adminMiddleware.js](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/backend/src/middleware/adminMiddleware.js)
Middleware to verify the requesting user has `role: 'admin'`.

---

#### [MODIFY] [auth.js (middleware)](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/backend/src/middleware/auth.js)
After verifying JWT, also check if user's `isActive` flag is true. If not, respond with `403 Account suspended`.

---

#### [MODIFY] [authRoutes.js](file:///c:/Users/ACER/OneDrive/Desktop\Finsight/Mini-Project/backend/src/routes/authRoutes.js)
- In `/login`: Check `isActive` status before issuing token. Return `403` if inactive.
- In `/register`: Return `role` and `hasPaid` in response.
- In `GET /profile`: Return `role`, `isActive`, `hasPaid`.
- In `PUT /profile`: Allow updating `name` as well (fixes profile bug).

---

#### [NEW] [adminRoutes.js](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/backend/src/routes/adminRoutes.js)
Admin-only routes (protected by `auth` + `adminMiddleware`):
- `GET /api/admin/users` — List all users
- `PATCH /api/admin/users/:id/toggle-status` — Toggle active/inactive

---

#### [NEW] [paymentRoutes.js](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/backend/src/routes/paymentRoutes.js)
- `POST /api/payment/create-order` — Create Razorpay order
- `POST /api/payment/verify` — Verify payment signature, update `hasPaid: true`

---

#### [MODIFY] [server.js](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/backend/src/server.js)
Register `adminRoutes` and `paymentRoutes`.

---

### Frontend

---

#### [MODIFY] [AuthContext.jsx](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/frontend/src/context/AuthContext.jsx)
- Fix: always re-fetch user on mount to ensure latest data
- Add `refreshUser()` function to force-refresh current user state
- `updateProfile` should call `refreshUser()` after update
- Expose `role`, `isActive`, `hasPaid` from `currentUser`

---

#### [MODIFY] [Profile.jsx](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/frontend/src/pages/Profile.jsx)
- Fix: `phoneNumber` state initializes from `currentUser.mobileNumber` but doesn't update when `currentUser` changes. Use `useEffect` to sync.
- Show `hasPaid` status (Premium badge vs. upgrade prompt)
- Show payment CTA if `!currentUser.hasPaid`

---

#### [MODIFY] [PrivateRoute.jsx](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/frontend/src/components/navigations/PrivateRoute.jsx)
- Redirect to `/login` if not authenticated
- If `currentUser.isActive === false`, logout and redirect with a suspended message

---

#### [NEW] [AdminRoute.jsx](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/frontend/src/components/navigations/AdminRoute.jsx)
Route guard that only allows `role === 'admin'` users through; others get redirected.

---

#### [NEW] [AdminDashboard.jsx](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/frontend/src/pages/AdminDashboard.jsx)
Full admin panel page with:
- User list table (name, email, status, role, payment status, joined date)
- Toggle active/inactive switch per user
- Glassy dark theme consistent with the app

---

#### [NEW] [PaymentPage.jsx](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/frontend/src/pages/PaymentPage.jsx)
Premium upgrade page:
- Shows features unlocked after payment
- Razorpay checkout integration
- On success, calls verify endpoint and updates user state

---

#### [MODIFY] [App.jsx](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/frontend/src/App.jsx)
Add routes:
- `/admin` → `<AdminRoute><AdminDashboard /></AdminRoute>`
- `/upgrade` → `<PaymentPage />`

---

#### [MODIFY] [Login.jsx](file:///c:/Users/ACER/OneDrive/Desktop/Finsight/Mini-Project/frontend/src/pages/Login.jsx)
Better error handling: if API returns 403, show "Account suspended" message specifically.

---

## Verification Plan

### Automated Tests
- None currently in project — manual testing only.

### Manual Verification
1. Register a new user → confirm `role: 'user'`, `isActive: true`, `hasPaid: false`
2. Mark a user inactive via Admin Panel → attempt login → should be blocked with 403
3. Mark user active again → login succeeds
4. Test profile update → page shows new phone number without refresh
5. Click Upgrade/Pay → complete Razorpay test flow → `hasPaid` becomes `true`
6. Navigate to `/admin` as non-admin → should redirect to dashboard
