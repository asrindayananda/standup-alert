# Standup Alert - Backend API

RESTful API server for the Standup Alert application.

## Features

- User authentication (register/login with JWT)
- Points and gamification system
- Leaderboard tracking
- Alert settings management
- Admin panel APIs
- MySQL database integration

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a MySQL database:
```bash
mysql -u root -p < src/config/schema.sql
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials and JWT secret.

4. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Points
- `POST /api/points/record` - Record a standup completion (requires auth)
- `GET /api/points/me` - Get user points and stats (requires auth)
- `GET /api/points/leaderboard` - Get leaderboard (requires auth)
- `GET /api/points/history` - Get standup history (requires auth)

### Alerts
- `GET /api/alerts/settings` - Get alert settings (requires auth)
- `PUT /api/alerts/settings` - Update alert settings (requires auth)

### Admin (requires admin privileges)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId` - Update user
- `DELETE /api/admin/users/:userId` - Delete user
- `PUT /api/admin/users/:userId/points` - Update user points
- `GET /api/admin/statistics` - Get system statistics

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Database Schema

- **users**: User accounts and authentication
- **points**: User points, streaks, and statistics
- **standup_history**: Record of completed standups
- **alert_settings**: Customizable alert configurations

## Environment Variables

- `PORT` - Server port (default: 3000)
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL user
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
