# FitooZone App Structure

## 📁 Folder Organization

### `/app` - Expo Router Pages
```
app/
├── _layout.tsx          # Root layout with context providers
├── welcome.tsx          # Onboarding screens (3 swipeable pages)
├── auth/               # Authentication screens
│   ├── _layout.tsx     # Auth stack navigation
│   ├── signin.tsx      # Sign in form
│   └── signup.tsx      # Sign up form
├── (tabs)/             # Main app navigation
│   ├── _layout.tsx     # Tab navigation
│   ├── index.tsx       # Home tab (renders HomeScreen)
│   └── explore.tsx     # Explore tab
└── modal.tsx           # Sample modal
```

### `/screens` - Screen Components
```
screens/
├── onboarding/         # Onboarding related screens
├── auth/              # Authentication screens (legacy)
├── main/              # Main app screens
│   └── HomeScreen.js  # Main dashboard
├── profile/           # User profile screens
├── stats/             # Statistics screens
└── workouts/          # Workout management screens
```

### `/components` - Reusable Components
```
components/
├── ui/                # Basic UI components
├── workout/           # Workout-related components
├── stats/             # Statistics components
└── profile/           # Profile components
```

### `/context` - State Management
```
context/
├── AuthContext.js     # User authentication state
├── WorkoutContext.js  # Workout management state
└── index.js           # Context exports
```

### `/hooks` - Custom Hooks
```
hooks/
├── useUser.js         # User-related hooks
├── useWorkout.js      # Workout hooks
└── index.js           # Hook exports
```

### Other Important Folders
- `/api` - API service functions
- `/storage` - Local storage utilities
- `/theme` - Design system (colors, typography, spacing)
- `/utils` - Helper functions
- `/constants` - App constants

## 🔄 App Flow

1. **Welcome Screen** → 3 swipeable onboarding pages
2. **Authentication** → Sign In / Sign Up screens
3. **Main App** → Tab navigation with HomeScreen as default

## 🎯 Navigation Structure

- **Root**: Welcome Screen (always first)
- **Auth Stack**: Sign In ↔ Sign Up
- **Main Stack**: Tab Navigation (Home, Explore, etc.)

## 📱 Screen Hierarchy

```
Welcome (3 pages)
├── Sign In
│   └── Sign Up
└── Main App (Tabs)
    ├── Home (HomeScreen.js)
    ├── Explore
    └── Other tabs...
```

## 🛠 Maintenance Tips

1. **Adding new auth screens**: Create in `/app/auth/`
2. **Adding new main screens**: Create in `/screens/` and reference in tabs
3. **Shared components**: Place in `/components/` with proper categorization
4. **State management**: Use existing contexts or create new ones in `/context/`
5. **API calls**: Add to `/api/` folder
6. **Styling**: Follow theme system in `/theme/`

This structure ensures:
- ✅ Clean separation of concerns
- ✅ Easy navigation between screens  
- ✅ Maintainable code organization
- ✅ Scalable architecture