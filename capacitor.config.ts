import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jafeth.miapp',
  appName: 'MiApp',
  webDir: 'dist',
  bundleWebRuntime: false,
  server: {
    cleartext: true,
    androidScheme: 'http',
  },
  plugins:{
    FirebaseAuthentication:{
      skipNativeAuth: false,
      providers:[
        "google.com"
      ]
    },
    PushNotifications:{
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
