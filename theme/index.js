export const colors = {
  // Primary colors
  primary: '#6366F1',
  primaryLight: '#8B8FFF',
  primaryDark: '#4F46E5',

  // Secondary colors
  secondary: '#EC4899',
  secondaryLight: '#F472B6',
  secondaryDark: '#DB2777',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // App specific colors
  background: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  shadow: '#00000029',

  // Text colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    light: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Workout specific colors
  workout: {
    cardio: '#EF4444',
    strength: '#6366F1',
    flexibility: '#10B981',
    sports: '#F59E0B',
    other: '#6B7280',
  },

  // Difficulty colors
  difficulty: {
    beginner: '#10B981',
    intermediate: '#F59E0B',
    advanced: '#EF4444',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  overline: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const layout = {
  window: {
    width: 375, // Default iPhone width
    height: 812, // Default iPhone height
  },
  isSmallDevice: false, // Will be set based on actual screen dimensions
  header: {
    height: 56,
  },
  tabBar: {
    height: 60,
  },
};

export const animations = {
  timing: {
    quick: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Theme variants
export const lightTheme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  layout,
  animations,
  isDark: false,
};

export const darkTheme = {
  colors: {
    ...colors,
    background: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      light: '#64748B',
      inverse: '#111827',
    },
  },
  spacing,
  typography,
  borderRadius,
  shadows: {
    ...shadows,
    small: {
      ...shadows.small,
      shadowColor: '#00000050',
    },
    medium: {
      ...shadows.medium,
      shadowColor: '#00000050',
    },
    large: {
      ...shadows.large,
      shadowColor: '#00000050',
    },
  },
  layout,
  animations,
  isDark: true,
};

export default lightTheme;