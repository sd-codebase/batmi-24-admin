<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Civic Diary Admin Dashboard

This project is a Next.js admin dashboard with Ant Design UI components and Supabase database integration, without built-in authentication.

## Project Structure and Technologies

- **Frontend**: Next.js with TypeScript and App Router
- **UI Components**: Ant Design (antd)
- **Database**: Supabase
- **State Management**: React Hooks

## Development Guidelines

### Next.js and React

- Use the App Router pattern and follow Next.js 13+ conventions
- Implement 'use client' directives for client components
- Create server components where appropriate

### UI Components

- Use Ant Design components consistently throughout the application
- Follow Ant Design patterns for forms, tables, and layouts
- Use Ant Design icons when possible

### Supabase Integration

- Use the Supabase client from src/lib/supabase.ts
- Follow the Supabase query patterns found in the data management page
- Implement proper error handling for all database operations

### TypeScript

- Use proper TypeScript types for all components and functions
- Create interfaces for data models in a separate types directory
- Use strict typing wherever possible

### Code Style

- Follow the existing project structure and patterns
- Use functional components with hooks instead of class components
- Implement proper error handling and loading states

### Features to Implement

When adding new features, consider the following areas:

1. Additional data views and management screens
2. Enhanced filtering and sorting for data tables
3. Dashboard widgets and visualizations
4. Export/import functionality
5. Integration with other Supabase services
