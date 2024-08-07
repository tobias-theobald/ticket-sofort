import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'TicketSofort',
    slug: 'ticketsofort',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'svvticket',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    platforms: ['ios', 'android'],
    ios: {
        supportsTablet: true,
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/images/adaptive-icon.png',
            backgroundColor: '#ffffff',
        },
    },
    plugins: [
        'expo-router',
        [
            'expo-sensors',
            {
                motionPermission: 'Allow $(PRODUCT_NAME) to access your device motion.',
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
    },
});
