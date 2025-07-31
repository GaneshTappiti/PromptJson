# PromptStruct Database Schema and Queries

This directory contains all SQL scripts and queries for the PromptStruct application.

## Directory Structure

```
sql/
├── migrations/           # Database schema migrations
├── queries/             # Application queries
├── admin/               # Administrative and analytics queries
└── README.md           # This file
```

## Database Schema

### Core Tables

1. **sessions** - Session storage for Replit Auth
2. **users** - User profiles and authentication data
3. **subscriptions** - User subscription plans and status
4. **conversions** - History of all prompt-to-JSON conversions
5. **usage_logs** - Daily usage tracking for rate limiting

### Key Features

- **Authentication**: Replit Auth integration with session management
- **Subscriptions**: Free (10/day) and Premium ($10/month, 50/day) plans
- **Usage Tracking**: Daily conversion limits with automatic reset
- **Conversion History**: Full audit trail of all conversions
- **Performance Monitoring**: Processing time tracking

## Usage

### Initial Setup

1. Run the migration script:
```bash
npm run db:push
```

2. Or manually execute:
```sql
-- Execute sql/migrations/001_initial_schema.sql
```

### Application Queries

- **User Management**: `sql/queries/user_management.sql`
- **Conversions**: `sql/queries/conversion_operations.sql`
- **Subscriptions**: `sql/queries/subscription_management.sql`

### Analytics

- **Admin Dashboard**: `sql/admin/analytics.sql`

## Environment Setup

Ensure your `.env` has:
```
DATABASE_URL=postgresql://username:password@host:port/database
```

## Migration Strategy

1. All schema changes go in `migrations/` with sequential numbering
2. Never modify existing migration files
3. Create new migration files for schema changes
4. Use Drizzle Kit for automated migrations: `npm run db:push`

## Query Organization

- **queries/**: Production application queries
- **admin/**: Administrative and reporting queries
- Each file contains related operations with clear documentation

## Security Considerations

- All queries use parameterized statements ($1, $2, etc.)
- Foreign key constraints ensure data integrity
- Indexes optimize performance for common operations
- Row-level security can be added for multi-tenant scenarios

## Performance

Key indexes are created for:
- User lookups
- Conversion history queries
- Usage tracking by date
- Session management

## Backup Strategy

Regular backups should include:
- Full database backup daily
- Point-in-time recovery enabled
- Conversion data retention policy (consider archiving old data)