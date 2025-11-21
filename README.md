# Hospital Management System

A web application for hospitals to manage users, patients, and clinical history.

## Features

- User authentication and authorization
- Dashboard with statistics
- Patient management (CRUD operations)
- Medical records management
- Appointment scheduling
- Role-based access control

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, API)
- **Deployment**: Netlify

## Setup

1. **Supabase Setup**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL from `supabase-schema.sql` in the SQL editor
   - Copy the project URL and keys

2. **Environment Variables** (CRITICAL - Required for the app to work):
   - Open `.env.local` and replace the placeholder values with your actual Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
     SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
     ```
   - **Important**: Do NOT use the placeholder text. The app will not work with placeholder values.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

## Deployment to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

## Usage

- Register/Login as admin, doctor, or nurse
- View dashboard with statistics
- Manage patients, medical records, and appointments
- Role-based permissions apply

## Security

- Row Level Security (RLS) in Supabase
- JWT authentication
- HTTPS required for production
