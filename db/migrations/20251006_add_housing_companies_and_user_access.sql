-- Migration Script: Add housing companies and user access control for news

-- Step 1: Create housing_companies table
CREATE TABLE IF NOT EXISTS housing_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for housing_companies updated_at
DROP TRIGGER IF EXISTS update_housing_companies_updated_at ON housing_companies;
CREATE TRIGGER update_housing_companies_updated_at 
    BEFORE UPDATE ON housing_companies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 2: Create user_housing_companies junction table
CREATE TABLE IF NOT EXISTS user_housing_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    housing_company_id UUID NOT NULL REFERENCES housing_companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, housing_company_id)
);

CREATE INDEX IF NOT EXISTS idx_user_housing_companies_user_id ON user_housing_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_housing_companies_housing_company_id ON user_housing_companies(housing_company_id);

-- Step 3: Modify news table to add housing_company_id
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS housing_company_id UUID REFERENCES housing_companies(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_news_housing_company_id ON news(housing_company_id);

-- Trigger for news updated_at
DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at 
    BEFORE UPDATE ON news 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();