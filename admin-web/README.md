# Standup Alert Admin Dashboard

Web-based admin dashboard for managing users and points in the Standup Alert application.

## Features

- Admin authentication
- User management (view, edit, delete users)
- Points management (adjust user points)
- Statistics dashboard
- User leaderboard view

## Prerequisites

- Node.js (v14 or higher)
- Backend API running

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Default Admin Credentials

To create an admin user, you need to manually insert into the database or modify an existing user:

```sql
UPDATE users SET is_admin = TRUE WHERE email = 'your@email.com';
```

## Available Routes

- `/login` - Admin login page
- `/dashboard` - Statistics and overview
- `/users` - User management interface

## Tech Stack

- React 18
- React Router 6
- TypeScript
- Axios for API calls
- CSS3 for styling
