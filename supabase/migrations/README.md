# Supabase Migrations

## Row-Level Security Fix for Orders Table

This directory contains SQL migrations that need to be applied to your Supabase project to fix issues with Row-Level Security (RLS) policies.

### How to Apply Migrations

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project: "xazssvfcifagxbibnxqs"
3. Go to the SQL Editor section
4. Copy the contents of the migration file `20240101000000_create_order_function.sql`
5. Paste it into a new SQL query in the editor
6. Run the query

### What This Migration Does

The migration creates a PostgreSQL function called `create_order` that runs with elevated privileges (SECURITY DEFINER). This function allows the application to create orders while bypassing the Row-Level Security policies that were previously blocking order creation.

The function accepts a JSON object containing order data and inserts it into the orders table with server-side privileges, then returns the newly created order.

### Testing the Fix

After applying the migration, test the order creation functionality in your application. The error message about violating row-level security policy should no longer appear.