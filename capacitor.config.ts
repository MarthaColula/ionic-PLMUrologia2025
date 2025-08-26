import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.PLMSaludMujer',
  appName: 'App_Urologia',
  webDir: 'www',
   server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
    hostname: 'localhost',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,
      androidScaleType: 'CENTER_CROP',
      backgroundColor: "#B872AA",
      androidSplashResourceName: 'splash',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
    }
  }
};

export default config;
