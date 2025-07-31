-- Conversion Operations Queries
-- Purpose: Queries for handling prompt conversions and tracking

-- Insert new conversion
INSERT INTO conversions (
    user_id,
    original_prompt,
    json_output,
    detected_category,
    is_reverse,
    processing_time_ms
) VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, created_at;

-- Update usage log (upsert pattern)
INSERT INTO usage_logs (user_id, action, date, count)
VALUES ($1, $2, CURRENT_DATE, 1)
ON CONFLICT (user_id, action, date)
DO UPDATE SET 
    count = usage_logs.count + 1,
    created_at = NOW();

-- Get conversion by ID
SELECT 
    c.id,
    c.original_prompt,
    c.json_output,
    c.detected_category,
    c.is_reverse,
    c.processing_time_ms,
    c.created_at,
    u.email as user_email
FROM conversions c
JOIN users u ON c.user_id = u.id
WHERE c.id = $1;

-- Get popular categories
SELECT 
    detected_category,
    COUNT(*) as usage_count,
    AVG(processing_time_ms) as avg_processing_time
FROM conversions 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY detected_category
ORDER BY usage_count DESC;

-- Get conversion statistics for admin dashboard
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(*) as total_conversions,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(processing_time_ms) as avg_processing_time,
    COUNT(CASE WHEN is_reverse = true THEN 1 END) as reverse_conversions
FROM conversions 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Clear user conversion history
DELETE FROM conversions 
WHERE user_id = $1;

-- Get recent conversions across all users (for admin)
SELECT 
    c.id,
    c.original_prompt,
    c.detected_category,
    c.is_reverse,
    c.created_at,
    u.email,
    u.first_name,
    u.last_name
FROM conversions c
JOIN users u ON c.user_id = u.id
ORDER BY c.created_at DESC
LIMIT $1 OFFSET $2;