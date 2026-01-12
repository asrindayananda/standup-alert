# Standup Alert Mobile App

React Native mobile application for standup reminders and health tracking during the work day.

## Features

- 🔐 User authentication (sign up/login)
- ⏰ Customizable alert settings for work hours
- 📊 Points and gamification system
- 🏆 Leaderboard to compete with colleagues
- 🔥 Streak tracking for consistency
- 🎯 Achievement system
- 👤 User profile with statistics

## Prerequisites

- Node.js (v20 or higher)
- React Native development environment
  - For iOS: Xcode
  - For Android: Android Studio
- Backend API server running (see `../backend/README.md`)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the API URL in `src/services/api.ts`:
```typescript
const API_URL = 'http://your-backend-url:3000/api';
// For iOS simulator: http://localhost:3000/api
// For Android emulator: http://10.0.2.2:3000/api
```

3. For iOS (macOS only):
```bash
cd ios && pod install && cd ..
npm run ios
```

4. For Android:
```bash
npm run android
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React Context (AuthContext)
├── navigation/       # Navigation configuration
├── screens/          # App screens
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── HomeScreen
│   ├── LeaderboardScreen
│   ├── ProfileScreen
│   └── SettingsScreen
├── services/         # API service layer
└── utils/           # Utility functions
```

## Features Detail

### Authentication
- Secure JWT-based authentication
- Persistent login sessions using AsyncStorage

### Points System
- Earn 10 points per standup
- Streak bonuses (5 points per week)
- Leaderboard rankings

### Alert Settings
- Customize work hours (start/end time)
- Set alert intervals (in minutes)
- Choose active work days
- Enable/disable alerts

### Gamification
- Points tracking similar to rewards programs (Qantas, Medibank)
- Daily streak system
- Achievement badges
- Social leaderboard for competition

## Tech Stack

- React Native 0.83
- TypeScript
- React Navigation 7
- Axios for API calls
- AsyncStorage for local storage
- React Native Vector Icons

---

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
