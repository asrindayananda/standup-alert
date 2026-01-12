# Development Setup Guide

Complete guide to setting up the Standup Alert application for local development.

## Prerequisites

Install the following on your development machine:

- **Node.js** v20 or higher ([Download](https://nodejs.org/))
- **MySQL** 8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** ([Download](https://git-scm.com/downloads))

For mobile development:
- **Xcode** (for iOS, macOS only)
- **Android Studio** (for Android)
- **React Native CLI**: `npm install -g react-native-cli`

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/asrindayananda/standup-alert.git
cd standup-alert
```

### 2. Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MySQL credentials
# PORT=3000
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=standup_alert
# JWT_SECRET=your_dev_secret_key

# Create database and tables
mysql -u root -p < src/config/schema.sql

# Start development server
npm run dev
```

The API will be running at `http://localhost:3000`

### 3. Setup Mobile App

```bash
# Navigate to mobile app
cd ../StandupAlertApp

# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# In another terminal, run iOS simulator
npm run ios

# OR run Android emulator
npm run android
```

### 4. Setup Admin Dashboard

```bash
# Navigate to admin web
cd ../admin-web

# Install dependencies
npm install

# Start development server
npm start
```

The admin dashboard will open at `http://localhost:3000` (or 3001 if backend is using 3000)

## Detailed Setup

### Database Setup

#### Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE standup_alert;

# Use the database
USE standup_alert;

# Exit MySQL
exit;
```

#### Import Schema

```bash
cd backend
mysql -u root -p standup_alert < src/config/schema.sql
```

#### Create Test Admin User

```bash
# Start Node REPL
node

# Hash a password
const bcrypt = require('bcryptjs');
const password = 'admin123';
bcrypt.hash(password, 10).then(hash => console.log(hash));
// Copy the hash

# Exit Node
.exit
```

```sql
-- Insert admin user
INSERT INTO users (email, password, name, is_admin) VALUES 
('admin@test.com', 'PASTE_HASH_HERE', 'Admin User', TRUE);
```

### Backend Development

#### Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth middleware
│   └── routes/          # API routes
├── .env.example         # Environment template
├── package.json
└── README.md
```

#### Available Scripts

```bash
npm start       # Production mode
npm run dev     # Development mode with auto-reload
```

#### Testing API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "test123"
  }'
```

### Mobile App Development

#### Update API URL

Edit `StandupAlertApp/src/services/api.ts`:

```typescript
// For iOS simulator
const API_URL = 'http://localhost:3000/api';

// For Android emulator
const API_URL = 'http://10.0.2.2:3000/api';

// For physical device (use your computer's IP)
const API_URL = 'http://192.168.1.100:3000/api';
```

#### iOS Development

```bash
# Install CocoaPods dependencies
cd ios
pod install
cd ..

# Run on simulator
npm run ios

# Run on specific simulator
npm run ios -- --simulator="iPhone 15 Pro"

# Run on device
npm run ios -- --device
```

#### Android Development

```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_6_API_34

# Run on emulator
npm run android

# Run on device
npm run android -- --deviceId=<device-id>
```

#### Common Issues

**Metro bundler issues:**
```bash
# Clear cache
npm start -- --reset-cache
```

**iOS build issues:**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

**Android build issues:**
```bash
cd android
./gradlew clean
cd ..
```

### Admin Web Development

#### Update API URL

Edit `admin-web/src/services/api.ts`:

```typescript
const API_URL = 'http://localhost:3000/api';
```

#### Development

```bash
npm start        # Start dev server
npm run build    # Build for production
npm test         # Run tests
```

## Development Workflow

### Making Changes

1. **Backend Changes**
   - Modify controllers/routes
   - Restart server (auto-reload with nodemon)
   - Test with curl or Postman

2. **Mobile App Changes**
   - Modify screens/components
   - Changes auto-reload (Fast Refresh)
   - Test on simulator/emulator

3. **Admin Web Changes**
   - Modify pages/components
   - Changes auto-reload (Hot reload)
   - Test in browser

### Database Changes

```bash
# After modifying schema.sql
mysql -u root -p standup_alert < backend/src/config/schema.sql

# Or make changes directly in MySQL
mysql -u root -p standup_alert
```

## Testing

### Backend API

```bash
# Manual testing with curl
curl http://localhost:3000/api/points/leaderboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# Or use Postman/Insomnia
```

### Mobile App

```bash
# Run tests
cd StandupAlertApp
npm test

# Run specific test
npm test -- HomeScreen
```

### Admin Web

```bash
cd admin-web
npm test
```

## Debugging

### Backend Debugging

Add to VS Code `launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/backend/src/server.js",
  "envFile": "${workspaceFolder}/backend/.env"
}
```

### Mobile App Debugging

```bash
# iOS
# Open Safari > Develop > Simulator > JSContext

# Android  
# Open Chrome > chrome://inspect
```

### Logs

```bash
# Backend logs
cd backend
npm run dev  # Logs to console

# Mobile app logs
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

## Code Style

### Linting

```bash
# Mobile app
cd StandupAlertApp
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Formatting

```bash
# Use Prettier
npx prettier --write "src/**/*.{js,jsx,ts,tsx}"
```

## Troubleshooting

### Port Already in Use

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues

```bash
# Check MySQL is running
mysql.server status  # macOS
sudo service mysql status  # Linux

# Test connection
mysql -u root -p -h localhost
```

### React Native Issues

```bash
# Reset Metro cache
npm start -- --reset-cache

# Clean build
cd android && ./gradlew clean && cd ..
cd ios && rm -rf build && cd ..
```

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Express.js Docs](https://expressjs.com/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [React Docs](https://react.dev/)

## Getting Help

- Check the main [README.md](README.md)
- Review [API Documentation](backend/README.md)
- Check individual component READMEs
