
-- Enable full replica identity for orders and customer tables to ensure complete row data is captured
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE customer REPLICA IDENTITY FULL;

-- Add tables to the realtime publication
BEGIN;
  -- Check if the publication already exists
  SELECT pg_catalog.has_publication_privilege('supabase_realtime', 'CREATE');

  -- Add tables to the publication
  ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  ALTER PUBLICATION supabase_realtime ADD TABLE customer;
COMMIT;
