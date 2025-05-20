# Civic Diary Admin Dashboard

A Next.js admin dashboard with Ant Design UI components and Supabase database integration. This admin panel is designed to be simple and flexible, without built-in authentication.

## Features

- **Modern UI**: Sleek interface built with Next.js and Ant Design
- **Responsive Layout**: Works on desktop and mobile devices
- **Data Management**: Full CRUD operations for managing data
- **Supabase Integration**: Ready to connect to your Supabase backend
- **No Authentication**: Simple setup without authentication requirements

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd civic-diary-admin
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── data/          # Data management page
│   └── settings/      # Settings page
├── components/        # Reusable components
│   ├── AdminLayout.tsx  # Main layout for admin dashboard
│   └── AntdProvider.tsx # Ant Design theme provider
└── lib/               # Utility functions and shared code
    └── supabase.ts    # Supabase client configuration
```

## Customization

### Connecting to Your Supabase Database

1. Create a table in your Supabase project
2. Update the table name in the data management page
3. Uncomment and modify the Supabase query functions in the data management page

### Customizing the UI

- Update the theme colors in `src/components/AntdProvider.tsx`
- Modify the layout in `src/components/AdminLayout.tsx`
- Add additional menu items to match your requirements

## Deployment

This project can be deployed on any hosting platform that supports Next.js applications, such as Vercel, Netlify, or a standard Node.js server.

## License

MIT
