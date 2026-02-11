# Supabase Setup for InvoiceZen

## Database Table

Run this SQL in your Supabase SQL Editor:

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

## Supabase Configuration

- **Project URL:** https://rrnzuefbxnfsrfuictpd.supabase.co
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybnp1ZWZieG5mc3JmdWljdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDA5OTMsImV4cCI6MjA4NTI3Njk5M30.0ZrQkSd2slGWbtoiXcWUbiEJ4qch_dbHhcUlh5fEpao`

## Vercel Environment Variables

Set these environment variables in your Vercel project settings:

```env
RAZORPAY_KEY_ID=rzp_live_SEOCVw0s7UAciN
RAZORPAY_KEY_SECRET=(get from PrivacyPage or Razorpay dashboard)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SEOCVw0s7UAciN
SUPABASE_URL=https://rrnzuefbxnfsrfuictpd.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybnp1ZWZieG5mc3JmdWljdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDA5OTMsImV4cCI6MjA4NTI3Njk5M30.0ZrQkSd2slGWbtoiXcWUbiEJ4qch_dbHhcUlh5fEpao
```

## Features

- **License Storage:** All purchases are stored in Supabase with email, license key, payment details, and timestamp
- **Restore Purchase:** Users can restore their Pro access by entering their email or license key
- **License Format:** `IZ-PRO-XXXXXXXX` (8 random hex characters)

## API Endpoints

- `POST /api/payment/verify` - Verify Razorpay payment and store purchase
- `POST /api/license/verify` - Look up purchase by email or license key
