# Vehicle Parking Management System

## Overview

This is a mobile-first vehicle parking management application built with React and Express.js. The system provides users with the ability to manage their vehicles, track parking sessions, schedule services, and handle parking fines. The application follows a modern full-stack architecture with a TypeScript frontend using React and a RESTful Express.js backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom iOS-inspired design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Optimized for mobile devices with iOS-style interface

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured with Neon serverless)
- **API Design**: RESTful API endpoints with JSON responses
- **Session Management**: PostgreSQL session store with connect-pg-simple

### Development Tools
- **Monorepo Structure**: Shared schema and types between frontend and backend
- **Development Server**: Vite dev server with HMR for frontend, tsx for backend
- **Code Quality**: TypeScript strict mode, ESLint integration
- **Build Process**: Separate builds for client (Vite) and server (esbuild)

## Key Components

### Database Schema
The application uses a comprehensive database schema with the following entities:
- **Users**: User authentication and profile information
- **Vehicles**: Vehicle registration and ownership details
- **Drivers**: Multiple drivers per vehicle with active status tracking
- **Parking Sessions**: Active and historical parking sessions with cost tracking
- **Car Parks**: Location-based parking facilities with space availability
- **Service Records**: Vehicle maintenance history and scheduling
- **Fines**: Parking violations with payment status tracking

### User Interface Components
- **Mobile Layout**: iOS-inspired interface with bottom tab navigation
- **Custom Components**: Reusable iOS-style cards and UI elements
- **Payment Modal**: Integrated payment interface supporting multiple methods
- **Responsive Design**: Optimized for mobile viewport with proper scaling

### API Structure
RESTful endpoints organized by resource:
- `/api/user` - User profile and authentication
- `/api/vehicles` - Vehicle management and details
- `/api/vehicles/:id/drivers` - Driver management per vehicle
- `/api/vehicles/:id/parking-sessions` - Parking session tracking
- `/api/car-parks` - Parking facility discovery
- `/api/services` - Vehicle service scheduling
- `/api/fines` - Fine management and payment processing

## Data Flow

### Client-Server Communication
1. **API Requests**: Frontend uses TanStack Query for data fetching with automatic caching
2. **Type Safety**: Shared schema definitions ensure consistent data types across frontend and backend
3. **Error Handling**: Centralized error handling with user-friendly toast notifications
4. **Real-time Updates**: Query invalidation for immediate UI updates after mutations

### Database Operations
1. **ORM Layer**: Drizzle ORM provides type-safe database queries with PostgreSQL
2. **Schema Migrations**: Database schema managed through Drizzle migrations
3. **Connection Pooling**: Neon serverless PostgreSQL for scalable database connections
4. **Data Validation**: Zod schemas for runtime validation and type inference

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with TypeScript support
- **Component Library**: Radix UI primitives for accessibility
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS with custom design tokens
- **Form Handling**: React Hook Form with validation
- **Date Utilities**: date-fns for date manipulation

### Backend Dependencies
- **Web Framework**: Express.js with TypeScript
- **Database**: Drizzle ORM with PostgreSQL driver
- **Session Store**: connect-pg-simple for PostgreSQL sessions
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution

### Build and Development Tools
- **Build Tool**: Vite for frontend, esbuild for backend
- **Development**: Replit integration with error overlay
- **TypeScript**: Strict mode configuration with path mapping
- **PostCSS**: Tailwind CSS processing with autoprefixer

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR on client directory
- **Backend**: tsx execution with automatic restart on changes
- **Database**: Drizzle migrations with push command for schema updates
- **Environment**: Environment variables for database connection

### Production Build
- **Frontend Build**: Vite builds optimized static assets to dist/public
- **Backend Build**: esbuild bundles server to dist/index.js with external packages
- **Asset Serving**: Express serves static files in production mode
- **Process Management**: Single Node.js process serving both API and static assets

### Database Configuration
- **Connection**: PostgreSQL via environment variable DATABASE_URL
- **Migrations**: Drizzle migrations stored in ./migrations directory
- **Schema**: Centralized schema definition in shared/schema.ts
- **Development**: Database push for rapid iteration, migrations for production

## Changelog

```
Changelog:
- August 06, 2025: Fixed critical Tailwind CSS configuration error preventing app startup
- August 06, 2025: Updated CSS variables to use proper HSL format for shadcn compatibility
- August 06, 2025: Added complete color definitions for all shadcn UI components
- August 06, 2025: Enabled dark mode support in Tailwind configuration
- August 03, 2025: Added multiple vehicle support with vehicle selector and context management
- August 03, 2025: Created "Fix it Felix" AI diagnostics tab with animated character avatar
- August 03, 2025: Enhanced app with 6 tabs including Felix AI for vehicle troubleshooting
- August 03, 2025: Added vehicle management system with Ferrari SF90, Mercedes-AMG GT 63 S, and BMW M3 CSL
- August 03, 2025: Applied blue gradient theme across entire app matching user's design preferences
- August 03, 2025: Enhanced parking page with functional location detection and interactive map
- August 03, 2025: Integrated Apple Pay, Klarna, and card payment options throughout
- August 03, 2025: Applied iOS-native design with glass effects and backdrop blur
- July 03, 2025: Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```