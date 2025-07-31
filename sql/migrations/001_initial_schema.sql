-- Initial database schema for PromptStruct
-- Created: 2024-01-31
-- Purpose: Set up core tables for user management, sessions, and conversion tracking

-- Session storage table (required for Replit Auth)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions (expire);

-- User storage table (required for Replit Auth)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
    status VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    current_period_start TIMESTAMP DEFAULT NOW(),
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Conversion history table
CREATE TABLE IF NOT EXISTS conversions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_prompt TEXT NOT NULL,
    json_output JSONB NOT NULL,
    detected_category VARCHAR NOT NULL,
    is_reverse BOOLEAN DEFAULT FALSE,
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS usage_logs (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR NOT NULL CHECK (action IN ('conversion', 'reverse_conversion')),
    date DATE DEFAULT CURRENT_DATE,
    count INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, action, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversions_user_id ON conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions(created_at);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_date ON usage_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Comments for documentation
COMMENT ON TABLE sessions IS 'Session storage for Replit Auth authentication';
COMMENT ON TABLE users IS 'User profiles and authentication data';
COMMENT ON TABLE subscriptions IS 'User subscription plans and status';
COMMENT ON TABLE conversions IS 'History of all prompt-to-JSON conversions';
COMMENT ON TABLE usage_logs IS 'Daily usage tracking for rate limiting';