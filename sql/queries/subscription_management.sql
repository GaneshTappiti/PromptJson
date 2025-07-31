-- Subscription Management Queries
-- Purpose: Handle subscription operations and billing

-- Create or update user subscription
INSERT INTO subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end
) VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (user_id)
DO UPDATE SET 
    plan = EXCLUDED.plan,
    status = EXCLUDED.status,
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    updated_at = NOW()
RETURNING id, plan, status;

-- Get subscription details
SELECT 
    id,
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end,
    created_at,
    updated_at
FROM subscriptions 
WHERE user_id = $1;

-- Cancel subscription
UPDATE subscriptions 
SET 
    status = 'cancelled',
    updated_at = NOW()
WHERE user_id = $1 
RETURNING id, plan, status;

-- Get expired subscriptions
SELECT 
    s.id,
    s.user_id,
    s.plan,
    s.current_period_end,
    u.email
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE s.status = 'active' 
    AND s.current_period_end < NOW();

-- Update expired subscriptions to free plan
UPDATE subscriptions 
SET 
    plan = 'free',
    status = 'expired',
    updated_at = NOW()
WHERE status = 'active' 
    AND current_period_end < NOW();

-- Get subscription analytics
SELECT 
    plan,
    COUNT(*) as subscriber_count,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_count
FROM subscriptions
GROUP BY plan;

-- Get user's subscription status with usage
SELECT 
    u.id,
    u.email,
    COALESCE(s.plan, 'free') as plan,
    COALESCE(s.status, 'active') as status,
    s.current_period_end,
    CASE 
        WHEN COALESCE(s.plan, 'free') = 'premium' THEN 50 
        ELSE 10 
    END as daily_limit,
    COALESCE(ul.count, 0) as today_usage
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
LEFT JOIN usage_logs ul ON u.id = ul.user_id 
    AND ul.date = CURRENT_DATE 
    AND ul.action = 'conversion'
WHERE u.id = $1;