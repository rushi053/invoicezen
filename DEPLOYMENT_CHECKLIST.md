# InvoiceZen - Deployment Checklist

## ✅ Completed

- [x] Updated `/api/payment/verify/route.ts` to store purchases in Supabase
- [x] Created `/api/license/verify/route.ts` for license lookup
- [x] Updated `useRazorpay.ts` hook with email support and `restorePurchase()` function
- [x] Added email input field to Pro pricing card
- [x] Added "Restore Purchase" UI section with email/license key lookup
- [x] Updated `.env.local` with Supabase credentials
- [x] Documented setup in `SUPABASE_SETUP.md`
- [x] Committed and pushed to GitHub (triggers Vercel deploy)

## 🔲 Manual Steps Required

### 1. Create Supabase Table

Go to your Supabase SQL Editor and run:

```sql
CREATE TABLE IF NOT EXISTS invoicezen_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  license_key text NOT NULL UNIQUE,
  payment_id text NOT NULL,
  order_id text NOT NULL,
  amount integer DEFAULT 0,
  currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoicezen_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read by license_key or email" ON invoicezen_purchases FOR SELECT USING (true);
CREATE POLICY "Public insert" ON invoicezen_purchases FOR INSERT WITH CHECK (true);
```

**Supabase Project:** https://rrnzuefbxnfsrfuictpd.supabase.co

### 2. Set Vercel Environment Variables

Go to your Vercel project settings → Environment Variables and add:

```
RAZORPAY_KEY_ID=rzp_live_SEOCVw0s7UAciN
RAZORPAY_KEY_SECRET=9BP4tgPoX3xyt4UfS2nESfst
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SEOCVw0s7UAciN
SUPABASE_URL=https://rrnzuefbxnfsrfuictpd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybnp1ZWZieG5mc3JmdWljdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDA5OTMsImV4cCI6MjA4NTI3Njk5M30.0ZrQkSd2slGWbtoiXcWUbiEJ4qch_dbHhcUlh5fEpao
```

**Set for:** Production, Preview, Development

### 3. Redeploy on Vercel (if auto-deploy didn't pick up env vars)

After adding the environment variables, trigger a new deployment or redeploy the latest commit.

## Features Implemented

### Payment Flow
- Email is now collected during checkout
- Email is prefilled in Razorpay modal
- Purchase details stored in Supabase immediately after successful payment
- License key format: `IZ-PRO-XXXXXXXX`

### Restore Purchase
- Users can restore Pro access by entering email or license key
- API endpoint `/api/license/verify` looks up purchases
- localStorage is updated on successful restore
- Clean, minimal UI matching the dark + emerald theme

### API Endpoints
- `POST /api/payment/verify` - Verify payment and store in Supabase
- `POST /api/license/verify` - Look up purchase by email or license key

## Testing

1. **Purchase Flow:**
   - Go to homepage
   - Enter email in Pro pricing card
   - Click "Upgrade to Pro"
   - Complete payment
   - Verify license key is displayed and stored in localStorage

2. **Restore Flow:**
   - Clear localStorage
   - Click "Already purchased? Restore your license"
   - Enter email or license key
   - Verify Pro access is restored

## Live URL

https://invoice.rushiraj.me
