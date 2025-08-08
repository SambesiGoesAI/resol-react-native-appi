-- Migration: Create Expo Push Tokens Foundation
-- Phase 1: Basic table structure for testing
-- Created: 2025-08-08

-- Create expo_push_tokens table
CREATE TABLE IF NOT EXISTS expo_push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    housing_company_id UUID NOT NULL,
    expo_push_token TEXT NOT NULL,
    device_id TEXT NOT NULL,
    device_name TEXT,
    platform VARCHAR(10) NOT NULL CHECK (platform IN ('ios', 'android')),
    app_version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    
    -- Ensure one token per device per housing company
    UNIQUE(user_id, device_id, housing_company_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_expo_tokens_housing_company_active 
    ON expo_push_tokens(housing_company_id, is_active) 
    WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_expo_tokens_user_device 
    ON expo_push_tokens(user_id, device_id);

CREATE INDEX IF NOT EXISTS idx_expo_tokens_last_used 
    ON expo_push_tokens(last_used_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_expo_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_expo_tokens_updated_at_trigger
    BEFORE UPDATE ON expo_push_tokens
    FOR EACH ROW EXECUTE FUNCTION update_expo_tokens_updated_at();

-- Test function for Phase 1
CREATE OR REPLACE FUNCTION test_expo_token_insert(
    p_user_id UUID,
    p_housing_company_id UUID,
    p_expo_push_token TEXT,
    p_device_id TEXT,
    p_platform TEXT
)
RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO expo_push_tokens (
        user_id, 
        housing_company_id, 
        expo_push_token, 
        device_id, 
        platform,
        device_name,
        app_version
    ) VALUES (
        p_user_id, 
        p_housing_company_id, 
        p_expo_push_token, 
        p_device_id, 
        p_platform,
        p_platform || ' Test Device',
        '1.0.0-test'
    ) 
    ON CONFLICT (user_id, device_id, housing_company_id) 
    DO UPDATE SET
        expo_push_token = EXCLUDED.expo_push_token,
        updated_at = NOW(),
        last_used_at = NOW(),
        is_active = true
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get token count by housing company (for testing)
CREATE OR REPLACE FUNCTION get_token_count_by_housing_company(p_housing_company_id UUID)
RETURNS INTEGER AS $$
DECLARE
    token_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO token_count
    FROM expo_push_tokens
    WHERE housing_company_id = p_housing_company_id
      AND is_active = true;
    
    RETURN token_count;
END;
$$ LANGUAGE plpgsql;