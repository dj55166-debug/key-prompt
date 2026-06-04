import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.awad.keyprompt',
    appName: 'Key Prompt',
    webDir: 'dist',
    server: {
          androidScheme: 'https',
          url: 'https://keyprompt.app',
          cleartext: false
    }
};

export default config;
