-- User Management Queries
-- Purpose: Common queries for user operations and analytics

-- Get user with subscription details
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.profile_image_url,
    u.created_at,
    s.plan,
    s.status as subscription_status,
    s.current_period_end
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.id = $1;

-- Get user's daily usage
SELECT 
    COALESCE(SUM(count), 0) as total_usage
FROM usage_logs 
WHERE user_id = $1 
    AND date = CURRENT_DATE 
    AND action = 'conversion';

-- Check if user has reached daily limit
WITH user_subscription AS (
    SELECT COALESCE(s.plan, 'free') as plan
    FROM users u
    LEFT JOIN subscriptions s ON u.id = s.user_id
    WHERE u.id = $1
),
daily_usage AS (
    SELECT COALESCE(SUM(count), 0) as usage
    FROM usage_logs 
    WHERE user_id = $1 
        AND date = CURRENT_DATE 
        AND action = 'conversion'
),
limits AS (
    SELECT 
        CASE 
            WHEN plan = 'premium' THEN 50 
            ELSE 10 
        END as daily_limit
    FROM user_subscription
)
SELECT 
    usage,
    daily_limit,
    (usage >= daily_limit) as limit_reached
FROM daily_usage, limits;

-- Get user conversion history
SELECT 
    id,
    original_prompt,
    json_output,
    detected_category,
    is_reverse,
    processing_time_ms,
    created_at
FROM conversions 
WHERE user_id = $1 
ORDER BY created_at DESC 
LIMIT $2 OFFSET $3;

-- Get user analytics summary
SELECT 
    COUNT(*) as total_conversions,
    COUNT(CASE WHEN is_reverse = true THEN 1 END) as reverse_conversions,
    AVG(processing_time_ms) as avg_processing_time,
    COUNT(DISTINCT detected_category) as categories_used,
    DATE_TRUNC('day', created_at) as conversion_date,
    COUNT(*) as daily_count
FROM conversions 
WHERE user_id = $1 
    AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY conversion_date DESC;