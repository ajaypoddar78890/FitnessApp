import 'dotenv/config';

export default ({ config }) => {
  // Expose EXPO_PUBLIC_API_URL to the app via Constants.expoConfig.extra
  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    },
  };
};
