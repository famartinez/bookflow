# BookFlow

A multi-tenant scheduling SaaS. Each user signs up, gets a public booking page at
`/book/their-slug`, and visitors book time slots (default 15 min, 9am–5pm, weekdays).
Built with React + Vite on the frontend and Supabase (Postgres + auth) on the backend.

## What's included

- Passwordless sign-in (magic link) for hosts
- Per-host profile with configurable hours, slot length, and available days
- Public booking page per host
- Real database with double-booking prevention enforced at the DB level
- Host dashboard listing upcoming bookings, with cancel
- Row-level security so hosts only see their own data, and guest emails stay private from other visitors

## Setup — about 15 minutes

### 1. Create a Supabase project
1. Go to https://supabase.com and create a free account + new project.
2. Wait for it to provision (~2 min).

### 2. Create the database
1. In your Supabase project, open the **SQL Editor**.
2. Paste the entire contents of `supabase/schema.sql` and click **Run**.
   This creates the tables, security policies, and the public `taken_slots` function.

### 3. Configure auth
1. Go to **Authentication > Providers > Email** and make sure Email is enabled.
2. For local testing, under **Authentication > URL Configuration**, add
   `http://localhost:5173` to the redirect allow-list. After deploying, add your
   production URL too (e.g. `https://yourapp.vercel.app`).

### 4. Get your keys
1. Go to **Project Settings > API**.
2. Copy the **Project URL** and the **anon public** key.
3. In this project, copy `.env.example` to `.env` and paste them in:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
   The anon key is safe to expose in the browser — row-level security protects your data.

### 5. Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173, sign in with your email, click the magic link, and set up
your page on the dashboard. Then visit `/book/your-slug` to test booking.

## Deploy to production (Vercel)

1. Push this folder to a GitHub repo.
2. At https://vercel.com, import the repo.
3. Add the two env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel
   project settings.
4. Deploy. `vercel.json` is already set up so `/book/:slug` works on direct load/refresh.
5. Add your Vercel URL to the Supabase redirect allow-list (step 3 above).

## What to add next (the SaaS roadmap)

This is a working product, but to charge money you'll want:

1. **Email confirmations + calendar invites.** Add a Supabase Edge Function triggered on
   new bookings that sends an email (via Resend or SendGrid) with an `.ics` calendar
   attachment to both guest and host. This is the highest-value next feature.
2. **Google Calendar sync.** Use the host's connected Google Calendar to hide times when
   they're already busy. Requires Google OAuth + the Calendar API.
3. **Billing.** Add Stripe Checkout + a subscription. Gate features (e.g. custom branding,
   more slot types) behind a paid tier. Store `stripe_customer_id` and `plan` on `profiles`.
4. **Timezone handling for guests.** Currently slots render in the guest's local browser
   time. For cross-timezone booking, show the host's timezone explicitly and let guests
   switch.
5. **Reschedule/cancel links for guests.** Email guests a signed link to manage their own
   booking.

## File map

```
supabase/schema.sql      database schema + security (run this first)
src/lib/supabase.js      Supabase client
src/lib/auth.jsx         auth context
src/lib/scheduling.js    pure slot-generation logic (no network)
src/pages/Landing.jsx    marketing homepage
src/pages/Login.jsx      magic-link sign in
src/pages/Dashboard.jsx  host settings + bookings
src/pages/BookingPage.jsx public per-host booking flow
```
