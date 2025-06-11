# Supabase Relationship Troubleshooting Guide

## Issue
The error "Could not find a relationship between 'users' and 'user_housing_companies' in the schema cache" indicates that Supabase's PostgREST API is not recognizing the foreign key relationship.

## Solution Applied
Modified the authentication service to use separate queries instead of a joined query:
1. First query: Fetch user data from `users` table
2. Second query: Fetch housing company IDs from `user_housing_companies` table using the user ID

## Additional Supabase Configuration Steps

If the issue persists, you may need to configure Supabase:

### 1. Check Foreign Key Relationships
Ensure the foreign keys are properly created in your Supabase database:
```sql
-- Verify foreign key exists
SELECT
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='user_housing_companies';
```

### 2. Enable RLS (Row Level Security)
If RLS is enabled, ensure proper policies exist:
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'user_housing_companies', 'housing_companies', 'news');

-- If needed, create policies for user_housing_companies
CREATE POLICY "Users can view their own housing companies" 
ON user_housing_companies FOR SELECT 
USING (true);  -- Adjust based on your security requirements
```

### 3. Refresh Supabase Schema Cache
Sometimes Supabase needs to refresh its schema cache:
1. Go to your Supabase dashboard
2. Navigate to Settings > API
3. Click "Reload schema cache" or restart the project

### 4. Alternative Query Approaches

If relationships still don't work, you can use these alternatives:

#### Option A: Manual Join Query
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*, user_housing_companies!inner(housing_company_id)')
  .eq('access_code', accessCode)
  .single();
```

#### Option B: RPC Function
Create a database function:
```sql
CREATE OR REPLACE FUNCTION get_user_with_housing_companies(p_access_code TEXT)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user', row_to_json(u.*),
    'housing_companies', array_agg(uhc.housing_company_id)
  ) INTO result
  FROM users u
  LEFT JOIN user_housing_companies uhc ON u.id = uhc.user_id
  WHERE u.access_code = p_access_code
  GROUP BY u.id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

Then call it:
```typescript
const { data, error } = await supabase
  .rpc('get_user_with_housing_companies', { p_access_code: accessCode });
```

## Current Implementation
The code has been updated to use separate queries which should work regardless of relationship configuration:
1. Query users table for user data
2. Query user_housing_companies table for housing company IDs
3. Combine the results in the application layer

This approach is more resilient to Supabase configuration issues while maintaining the same functionality.