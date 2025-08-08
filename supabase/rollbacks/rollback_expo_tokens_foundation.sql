-- Rollback script for expo_push_tokens foundation
-- Run this to completely undo Phase 1 changes
-- WARNING: This will delete all expo push token data!

-- Drop triggers first (to avoid constraint errors)
DROP TRIGGER IF EXISTS update_expo_tokens_updated_at_trigger ON expo_push_tokens;

-- Drop functions
DROP FUNCTION IF EXISTS update_expo_tokens_updated_at();
DROP FUNCTION IF EXISTS test_expo_token_insert(UUID, UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS get_token_count_by_housing_company(UUID);

-- Drop indexes
DROP INDEX IF EXISTS idx_expo_tokens_housing_company_active;
DROP INDEX IF EXISTS idx_expo_tokens_user_device;
DROP INDEX IF EXISTS idx_expo_tokens_last_used;

-- Drop table (THIS WILL DELETE ALL DATA!)
DROP TABLE IF EXISTS expo_push_tokens;

-- Confirm rollback
DO $$
BEGIN
    RAISE NOTICE 'Expo push tokens foundation has been rolled back completely.';
    RAISE NOTICE 'All related data has been deleted.';
END $$;