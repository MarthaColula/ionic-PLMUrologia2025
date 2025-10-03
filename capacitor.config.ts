import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.PLMUrologia',
  //appId: 'Urolo',
  appName: 'PLM Urología',
  webDir: 'www',
   server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
    hostname: 'localhost',
    allowNavigation: ['https://www.plmconnection.com'],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 5000,
      androidScaleType: 'CENTER_CROP',
      backgroundColor: "#014c88",
      androidSplashResourceName: 'splash',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
    }
  }
};

export default config;
