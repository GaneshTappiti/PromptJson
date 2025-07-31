-- Admin Analytics Queries
-- Purpose: Administrative queries for monitoring and analytics

-- Daily active users
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(DISTINCT user_id) as daily_active_users
FROM conversions 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Total platform statistics
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM conversions) as total_conversions,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND plan = 'premium') as premium_subscribers,
    (SELECT COUNT(DISTINCT user_id) FROM conversions WHERE created_at >= CURRENT_DATE) as today_active_users,
    (SELECT AVG(processing_time_ms) FROM conversions WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as avg_processing_time;

-- Revenue analytics (if billing is implemented)
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(CASE WHEN plan = 'premium' THEN 1 END) * 10 as estimated_monthly_revenue
FROM subscriptions 
WHERE status = 'active'
    AND created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Category popularity over time
SELECT 
    detected_category,
    DATE_TRUNC('week', created_at) as week,
    COUNT(*) as conversions
FROM conversions 
WHERE created_at >= CURRENT_DATE - INTERVAL '8 weeks'
GROUP BY detected_category, DATE_TRUNC('week', created_at)
ORDER BY week DESC, conversions DESC;

-- User engagement metrics
SELECT 
    u.id,
    u.email,
    u.created_at as signup_date,
    COUNT(c.id) as total_conversions,
    MAX(c.created_at) as last_conversion,
    COALESCE(s.plan, 'free') as subscription_plan,
    EXTRACT(DAYS FROM NOW() - MAX(c.created_at)) as days_since_last_use
FROM users u
LEFT JOIN conversions c ON u.id = c.user_id
LEFT JOIN subscriptions s ON u.id = s.user_id
GROUP BY u.id, u.email, u.created_at, s.plan
ORDER BY total_conversions DESC;

-- System performance metrics
SELECT 
    detected_category,
    COUNT(*) as total_conversions,
    AVG(processing_time_ms) as avg_processing_time,
    MIN(processing_time_ms) as min_processing_time,
    MAX(processing_time_ms) as max_processing_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY processing_time_ms) as p95_processing_time
FROM conversions 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY detected_category
ORDER BY total_conversions DESC;