# React + Supabase Task Manager

A modern, full-stack task management application built with React, TypeScript, Supabase, and Tailwind CSS. Features real-time updates, user authentication, and a clean, responsive interface.

## Features

### 🔐 Authentication
- **Sign Up/Sign In**: Email and password authentication
- **User Profiles**: Automatic profile creation with optional full name
- **Secure Sessions**: JWT-based authentication with Supabase Auth
- **Protected Routes**: Dashboard only accessible to authenticated users

### ✅ Task Management
- **Create Tasks**: Add tasks with title and optional description
- **Edit Tasks**: Inline editing of existing tasks
- **Complete Tasks**: Toggle completion status with visual feedback
- **Delete Tasks**: Remove tasks with confirmation
- **Real-time Updates**: See changes instantly across all sessions

### 🎨 User Interface
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Clean design with Tailwind CSS
- **Loading States**: Smooth loading indicators and disabled states
- **Filter Tasks**: View all, active, or completed tasks
- **Task Statistics**: Overview of total, active, and completed tasks

### 🚀 Performance
- **TypeScript**: Full type safety throughout the application
- **Vite**: Lightning-fast development and build times
- **Optimistic Updates**: Instant UI feedback with error handling
- **Real-time Subscriptions**: Live updates using Supabase's real-time features

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: React Context + Hooks
- **Development**: ESLint, Hot Module Replacement

## Quick Start

### Prerequisites
- Node.js 18+ 
- A Supabase account

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd react-supabase-task-manager
npm install
```

### 2. Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be ready

2. **Set up the Database**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-setup.sql`
   - Run the script to create tables, policies, and triggers

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase project URL and anon key:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### 3. Run the Application
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Database Schema

### Tables

#### `profiles`
- `id` (UUID, Primary Key) - Links to auth.users
- `email` (Text, Not Null)
- `full_name` (Text, Nullable)
- `avatar_url` (Text, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `tasks`
- `id` (UUID, Primary Key)
- `title` (Text, Not Null)
- `description` (Text, Nullable)
- `completed` (Boolean, Default: false)
- `user_id` (UUID, Foreign Key to auth.users)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Security
- **Row Level Security (RLS)** enabled on all tables
- **Policies** ensure users can only access their own data
- **Automatic profile creation** on user signup
- **Secure authentication** with Supabase Auth

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthContainer.tsx     # Auth mode switcher
│   │   ├── LoginForm.tsx         # Login component
│   │   └── SignupForm.tsx        # Signup component
│   ├── tasks/
│   │   ├── AddTaskForm.tsx       # New task form
│   │   └── TaskItem.tsx          # Individual task component
│   └── Dashboard.tsx             # Main app dashboard
├── contexts/
│   └── AuthContext.tsx           # Authentication context
├── hooks/
│   └── useTasks.ts              # Task management hook
├── lib/
│   ├── supabase.ts              # Supabase client
│   └── database.types.ts        # TypeScript types
├── App.tsx                      # Main app component
└── main.tsx                     # App entry point
```

## Key Features Explained

### Real-time Updates
The app uses Supabase's real-time subscriptions to sync task changes across all user sessions instantly. When you add, edit, or delete a task, other tabs/devices will see the changes immediately.

### Type Safety
Full TypeScript integration with auto-generated database types ensures compile-time safety and better developer experience.

### Responsive Design
The interface adapts seamlessly to different screen sizes using Tailwind CSS's responsive utilities.

### Optimistic Updates
UI updates happen immediately for better user experience, with proper error handling if the backend operation fails.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

## Supabase Dashboard Access

You can view and manage your data through the Supabase dashboard:
- **Authentication**: Monitor user signups and sessions
- **Database**: View tables, run queries, and manage data
- **Real-time**: Monitor active subscriptions and connections

## Contributing

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Support

If you encounter any issues:
1. Check your Supabase configuration
2. Verify environment variables are set correctly
3. Check the browser console for errors
4. Review the Supabase dashboard for database issues

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using React, Supabase, and modern web technologies.
# supabase-todo
