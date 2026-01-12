# Standup Alert

A comprehensive React Native mobile application and admin system for standing up reminders during the work day. Stay active, earn points, and compete with colleagues!

## 🎯 Project Overview

This project consists of three main components:

1. **Mobile App** (`StandupAlertApp/`) - React Native app for iOS and Android
2. **Backend API** (`backend/`) - Node.js/Express REST API with MySQL database
3. **Admin Dashboard** (`admin-web/`) - React web app for user and points management

## ✨ Features

### Mobile App
- 🔐 User authentication (sign up/sign in)
- ⏰ Customizable alert scheduling (work hours, intervals, days)
- 📊 Points system with gamification (similar to Qantas, Medibank rewards)
- 🏆 Leaderboard for competition with colleagues
- 🔥 Daily streak tracking with bonus points
- 🎯 Achievement badges
- 👤 User profile and statistics
- 📱 Push notifications for standup reminders

### Backend API
- RESTful API with JWT authentication
- MySQL database for data persistence
- User management
- Points and standup tracking
- Leaderboard calculations
- Alert settings management
- Admin endpoints for system management

### Admin Dashboard
- 📊 Statistics dashboard (users, standups, points)
- 👥 User management (view, edit, delete)
- ⭐ Points adjustment system
- 🔒 Admin-only access control
- 📈 Real-time metrics

## 🚀 Quick Start

### Prerequisites
- Node.js v20 or higher
- MySQL 8.0 or higher
- React Native development environment (for mobile app)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
mysql -u root -p < src/config/schema.sql
npm run dev
```

The API will run on `http://localhost:3000`

### 2. Mobile App Setup

```bash
cd StandupAlertApp
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..
npm run ios

# For Android
npm run android
```

### 3. Admin Dashboard Setup

```bash
cd admin-web
npm install
npm start
```

The admin dashboard will open at `http://localhost:3000`

## 📁 Project Structure

```
standup-alert/
├── StandupAlertApp/      # React Native mobile app
│   ├── src/
│   │   ├── screens/      # App screens
│   │   ├── components/   # Reusable components
│   │   ├── navigation/   # Navigation setup
│   │   ├── context/      # Auth context
│   │   └── services/     # API services
│   └── package.json
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # (Future) Data models
│   │   └── config/       # Database config
│   └── package.json
└── admin-web/            # React admin dashboard
    ├── src/
    │   ├── pages/        # Dashboard pages
    │   ├── components/   # UI components
    │   ├── services/     # API services
    │   └── styles/       # CSS styles
    └── package.json
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=standup_alert
JWT_SECRET=your_jwt_secret
```

### Mobile App API URL
Edit `StandupAlertApp/src/services/api.ts`:
```typescript
const API_URL = 'http://localhost:3000/api'; // iOS simulator
// const API_URL = 'http://10.0.2.2:3000/api'; // Android emulator
```

## 📊 Database Schema

- **users** - User accounts with authentication
- **points** - User points, streaks, and statistics
- **standup_history** - Record of completed standups
- **alert_settings** - Customizable alert configurations per user

## 🎮 Gamification System

- **Base Points**: 10 points per standup
- **Streak Bonus**: 5 additional points for every 7-day streak
- **Leaderboard**: Rankings based on total points
- **Achievements**: Badges for milestones

## 🔐 Admin Access

To create an admin user, update the database:
```sql
UPDATE users SET is_admin = TRUE WHERE email = 'admin@example.com';
```

## 📱 Monitoring

The application includes basic monitoring through:
- API health check endpoint (`/health`)
- Request logging middleware
- Error tracking in console

For production, consider integrating:
- Sentry for error tracking
- New Relic or DataDog for APM
- CloudWatch or similar for logs

## 🛠 Tech Stack

### Mobile App
- React Native 0.83
- TypeScript
- React Navigation 7
- Axios
- AsyncStorage

### Backend
- Node.js
- Express.js
- MySQL with mysql2
- JWT authentication
- bcryptjs

### Admin Dashboard
- React 18
- TypeScript
- React Router 6
- Axios

## 📖 Documentation

- [Mobile App Documentation](StandupAlertApp/README.md)
- [Backend API Documentation](backend/README.md)
- [Admin Dashboard Documentation](admin-web/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 🎉 Getting Started

1. Set up the backend and database
2. Create an admin user in the database
3. Start the mobile app or admin dashboard
4. Register new users or login
5. Start recording standups and earning points!

