import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.azannoor.app',
  appName: 'Azan Noor',
  webDir: 'out',
  backgroundColor: '#030712',
  android: {
    backgroundColor: '#030712',
  },
  plugins: {
    // App is always dark — light status/navigation bar icons
    SystemBars: {
      style: 'DARK',
    },
  },
};

export default config;
