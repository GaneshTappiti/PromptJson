# PromptStruct - AI Prompt to JSON Converter

## Overview

PromptStruct is a full-stack web application that converts natural language prompts into structured JSON format and vice versa. The application serves AI developers, prompt engineers, and builders who need to transform free-form prompts into machine-readable structured data for AI tools, APIs, and workflows. The platform includes intelligent category detection, bidirectional conversion capabilities, usage tracking, and subscription management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional UI
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling for accessibility and consistency
- **Code Editor**: Monaco Editor integration for JSON syntax highlighting and editing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Authentication**: Replit Auth integration with session-based authentication
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **API Design**: RESTful endpoints with structured error handling and logging middleware
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod for runtime type validation and API contract enforcement

### Data Storage Solutions
- **Primary Database**: PostgreSQL with connection pooling
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Tables**: Users, subscriptions, prompts, usage logs, and sessions
- **Indexing**: Optimized queries with proper indexes for user data and session management

### Authentication and Authorization
- **Provider**: Replit OAuth integration for seamless authentication
- **Session Management**: Secure HTTP-only cookies with PostgreSQL session store
- **User Management**: Automatic user creation and profile management
- **Rate Limiting**: Usage-based limits with subscription tier enforcement
- **Authorization**: Route-level protection with middleware-based user verification

### Conversion Engine
- **Category Detection**: AI-powered prompt classification into predefined categories (text, image, video, code, email, research, agent, design)
- **Schema Mapping**: Dynamic JSON schema generation based on detected categories
- **Bidirectional Processing**: Both prompt-to-JSON and JSON-to-prompt conversion capabilities
- **Validation**: Input sanitization and output validation for reliable conversions

### Subscription and Usage Tracking
- **Tiers**: Free (10 daily conversions) and Premium (50 daily conversions)
- **Usage Monitoring**: Real-time tracking with daily reset cycles
- **Rate Limiting**: Automatic enforcement based on subscription status
- **Upgrade Flow**: Integrated subscription management with usage visibility

## External Dependencies

### Database and Infrastructure
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations and migrations
- **Session Store**: PostgreSQL-backed session management

### Authentication Services
- **Replit Auth**: OAuth-based authentication provider
- **OpenID Connect**: Standards-compliant authentication flow

### Frontend Libraries
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **UI Framework**: Radix UI primitives with shadcn/ui styling system
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date formatting and manipulation

### Development and Build Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Development**: Hot module replacement and development server
- **Deployment**: Production-ready builds with asset optimization

### Replit Integration
- **Development Tools**: Replit-specific plugins for cartographer and error handling
- **Environment**: Configured for Replit hosting with proper domain handling
- **Debugging**: Runtime error modal for development workflow