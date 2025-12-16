# Fitness Tracking App - React Native (Expo)

A comprehensive fitness tracking application built with React Native and Expo, featuring workout management, progress tracking, goal setting, and social features.

## 🏗️ Project Structure

```
MyFitnessApp/
├── api/                          # API integration layerm
│   ├── authApi.js               # Authentication API calls
│   ├── workoutApi.js            # Workout-related API calls
│   ├── userApi.js               # User profile and stats API calls
│   └── index.js                 # API exports
├── assets/                       # Static assets
│   └── images/                  # App images and icons
├── components/                   # Reusable UI components
│   ├── ui/                      # Basic UI components (existing)
│   ├── workout/                 # Workout-specific components
│   │   ├── WorkoutCard.js       # Workout display card
│   │   ├── ExerciseItem.js      # Individual exercise component
│   │   └── WorkoutTimer.js      # Workout timer component
│   ├── profile/                 # Profile-related components
│   │   ├── ProfileCard.js       # User profile display
│   │   └── GoalCard.js          # Goal tracking component
│   ├── stats/                   # Statistics components
│   │   └── StatsCard.js         # Statistics display
│   └── index.js                 # Component exports
├── constants/                    # App constants
│   ├── theme.ts                 # Theme constants (existing)
│   └── api.js                   # API configuration
├── context/                      # React Context providers
│   ├── AuthContext.js           # Authentication context
│   ├── WorkoutContext.js        # Workout state management
│   └── index.js                 # Context exports
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts      # Color scheme hook (existing)
│   ├── use-theme-color.ts       # Theme color hook (existing)
│   ├── useWorkout.js            # Workout-related hooks
│   ├── useUser.js               # User-related hooks
│   └── index.js                 # Hook exports
├── navigation/                   # Navigation setup
│   └── AppNavigator.js          # Main navigation configuration
├── screens/                      # Application screens
│   ├── auth/                    # Authentication screens
│   │   ├── LoginScreen.js       # User login
│   │   └── RegisterScreen.js    # User registration
│   ├── main/                    # Main app screens
│   │   └── HomeScreen.js        # Dashboard/home screen
│   ├── workouts/                # Workout screens
│   │   ├── WorkoutsScreen.js    # Workout list
│   │   ├── WorkoutDetailScreen.js # Workout details
│   │   ├── WorkoutSessionScreen.js # Active workout
│   │   └── CreateWorkoutScreen.js # Workout creation
│   ├── profile/                 # Profile screens
│   │   └── ProfileScreen.js     # User profile
│   └── stats/                   # Statistics screens
│       └── StatsScreen.js       # Progress tracking
├── services/                     # Business logic services
│   ├── notificationService.js   # Push notifications
│   ├── offlineService.js        # Offline data sync
│   └── index.js                 # Service exports
├── storage/                      # Local storage management
│   ├── storageService.js        # AsyncStorage wrapper
│   └── index.js                 # Storage exports
├── theme/                        # Theme and styling
│   └── index.js                 # Theme configuration
├── utils/                        # Utility functions
│   ├── helpers.js               # Helper functions
│   └── index.js                 # Utility exports
├── app/                          # App entry points (existing)
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🚀 Features

### Authentication
- User registration and login
- JWT token management
- Password recovery
- Social authentication (Google, Apple)

### Workout Management
- Create custom workouts
- Exercise library with descriptions
- Set tracking (reps, weight, time)
- Workout templates
- Progress photos

### Progress Tracking
- Workout history
- Performance analytics
- Body measurements
- Weight tracking
- Progress photos

### Goal Setting
- Custom fitness goals
- Progress monitoring
- Achievement system
- Milestone notifications

### Social Features
- Share workouts
- Community challenges
- Progress sharing
- Leaderboards

### Offline Support
- Offline workout recording
- Data synchronization
- Cached exercise library

## 📦 Dependencies

### Core Dependencies
```json
{
  "expo": "~51.0.0",
  "react": "18.2.0",
  "react-native": "0.74.0",
  "@react-navigation/native": "^6.0.0",
  "@react-navigation/stack": "^6.0.0",
  "@react-navigation/bottom-tabs": "^6.0.0",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "@expo/vector-icons": "^14.0.0"
}
```

### Additional Dependencies Needed
```json
{
  "expo-notifications": "~0.28.0",
  "@react-native-netinfo/netinfo": "^11.0.0",
  "react-native-safe-area-context": "^4.10.0",
  "react-native-screens": "~3.31.0",
  "expo-linear-gradient": "~13.0.0",
  "react-native-chart-kit": "^6.12.0",
  "react-native-image-picker": "^7.0.0",
  "expo-camera": "~15.0.0",
  "expo-media-library": "~16.0.0"
}
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MyFitnessApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install additional required packages**
   ```bash
   npx expo install expo-notifications @react-native-netinfo/netinfo react-native-safe-area-context react-native-screens expo-linear-gradient
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=https://your-api-url.com/v1
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### API Configuration
Update `constants/api.js` with your backend API URL:
```javascript
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.fitnessapp.com/v1';
```

### Notification Setup
For notifications to work properly:
1. Configure push notification credentials in Expo
2. Set up notification channels for Android
3. Request proper permissions on iOS

## 📱 Usage

### Authentication Flow
1. Users start at the login screen
2. Can register new accounts or login with existing credentials
3. JWT tokens are stored securely
4. Auto-login on app restart

### Workout Flow
1. Browse or create workouts
2. Start a workout session
3. Track exercises with timer
4. Complete and save session
5. View progress and statistics

### Data Management
- All data is cached locally for offline use
- Automatic sync when network is available
- Conflict resolution for offline changes

## 🎨 Theming

The app uses a comprehensive theming system with:
- Light and dark mode support
- Consistent color palette
- Responsive typography
- Standardized spacing
- Reusable component styles

### Color Scheme
```javascript
colors: {
  primary: '#6366F1',    // Indigo
  success: '#10B981',    // Emerald
  warning: '#F59E0B',    // Amber
  error: '#EF4444',      // Red
  // ... more colors
}
```

## 📊 State Management

### Context Providers
- **AuthContext**: User authentication state
- **WorkoutContext**: Workout data and session management

### Custom Hooks
- **useWorkout**: Workout-related operations
- **useUser**: User profile and statistics
- **useWorkoutTimer**: Timer functionality
- **useRestTimer**: Rest period tracking

## 💾 Data Storage

### Local Storage
- User preferences
- Offline workout data
- Cached API responses
- Session recovery data

### AsyncStorage Structure
```javascript
{
  "@fitness_app:token": "jwt_token",
  "@fitness_app:user": "{user_object}",
  "@fitness_app:offline_data": "{cached_workouts}",
  // ... more storage keys
}
```

## 🔔 Notifications

### Notification Types
- Workout reminders
- Rest timer alerts
- Goal achievements
- Streak milestones
- Daily motivation

### Notification Channels (Android)
- Workout Reminders
- Rest Timer
- Achievements
- System Updates

## 🌐 Offline Support

### Offline Capabilities
- Record workouts without internet
- Cache exercise library
- Store user progress
- Queue API requests

### Sync Strategy
- Auto-sync on network reconnection
- Conflict resolution for data changes
- Progress indicators for sync status

## 🧪 Testing

### Unit Tests
```bash
npm test
# or
yarn test
```

### E2E Tests
```bash
npm run test:e2e
# or
yarn test:e2e
```

## 📦 Building

### Development Build
```bash
npx expo run:ios
npx expo run:android
```

### Production Build
```bash
npx expo build:ios
npx expo build:android
```

### EAS Build (Recommended)
```bash
npx eas build --platform all
```

## 🚀 Deployment

### Expo Application Services (EAS)
```bash
npx eas submit --platform ios
npx eas submit --platform android
```

### App Store Deployment
1. Build production version
2. Test thoroughly
3. Submit to app stores
4. Monitor crash reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Submit a pull request

### Code Style
- Use ESLint configuration
- Follow React Native best practices
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📝 API Integration

### Backend Requirements
Your backend API should provide the following endpoints:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Token refresh

#### Workouts
- `GET /workouts` - List user workouts
- `POST /workouts` - Create workout
- `PUT /workouts/:id` - Update workout
- `DELETE /workouts/:id` - Delete workout

#### User Data
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update profile
- `GET /user/stats` - Get statistics
- `GET /user/goals` - Get goals
- `PUT /user/goals` - Update goals

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler cache issues**
   ```bash
   npx expo start --clear
   ```

2. **iOS build issues**
   ```bash
   cd ios && pod install
   ```

3. **Android build issues**
   ```bash
   npx expo run:android --clear-cache
   ```

4. **Notification not working**
   - Check device notification permissions
   - Verify notification credentials in Expo
   - Test on physical device (not simulator)

## 🏃‍♀️ Health Connect Integration

This app integrates with **Google Health Connect** for advanced fitness tracking features like step counting.

### Requirements:
- **Android 8.0 (API 26)** or higher
- **Health Connect App**:
  - Android 14+: Built into the system (no additional download needed)
  - Android 13 and below: Download from [Google Play Store](https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata)

### Features Available with Health Connect:
- ✅ Real-time step counting
- ✅ Daily activity tracking
- ✅ Integration with other fitness apps
- ✅ Secure health data management

### Without Health Connect:
- ⚠️ Basic app functionality still works
- ⚠️ Manual workout logging available
- ⚠️ Step counting not available
- ℹ️ App will guide users to install Health Connect when needed

### Privacy & Security:
- Health Connect manages all permissions centrally
- Users control which apps can access their health data
- Data stays on-device and under user control
- No health data is sent to our servers

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For support and questions:
- Create an issue in this repository
- Check the Expo documentation
- Visit React Native community forums

---

**Happy Coding! 💪🏃‍♀️🏋️‍♂️**