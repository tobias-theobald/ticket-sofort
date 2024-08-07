import { ThemeProvider } from '@react-navigation/native';
import { Link, Stack } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { AppState, useColorScheme } from 'react-native';
import { IconButton, PaperProvider } from 'react-native-paper';

import { ReactQueryClientProvider } from '../components/providers/ReactQueryClientProvider';
import { SettingsProvider, useSettings } from '../components/providers/SettingsProvider';
import {
    ModifiedReactNativePaperDarkTheme,
    ModifiedReactNativePaperLightTheme,
    ModifiedReactNavigationDarkTheme,
    ModifiedReactNavigationLightTheme,
} from '../constants/themes';

export const NAVBAR_ICON_SIZE = 24;

const IndexHeaderRight = () => {
    const { doRefreshTickets, doLoginLoading, loginStatus } = useSettings();

    const forceRefreshTickets = useCallback(() => {
        doRefreshTickets({ forceRefresh: true });
    }, [doRefreshTickets]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active' && loginStatus === true) {
                doRefreshTickets({ forceRefresh: false });
            }
        });

        return () => subscription.remove();
    }, [doRefreshTickets, loginStatus]);

    return (
        <>
            <IconButton
                icon={'refresh'}
                size={NAVBAR_ICON_SIZE}
                accessibilityLabel="refresh"
                onPress={forceRefreshTickets}
                loading={doLoginLoading}
                disabled={loginStatus !== true}
            />
            <Link asChild href="/settings">
                <IconButton icon="cog" size={NAVBAR_ICON_SIZE} accessibilityLabel="settings" />
            </Link>
        </>
    );
};

export function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Ticket',
                    headerRight: IndexHeaderRight,
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    presentation: 'modal',
                    headerRight: () => (
                        <Link asChild href="/">
                            <IconButton icon="close" size={NAVBAR_ICON_SIZE} accessibilityLabel="close settings" />
                        </Link>
                    ),
                }}
            />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}

export default function App() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? ModifiedReactNavigationDarkTheme : ModifiedReactNavigationLightTheme}
        >
            <PaperProvider
                theme={colorScheme === 'dark' ? ModifiedReactNativePaperDarkTheme : ModifiedReactNativePaperLightTheme}
            >
                <ReactQueryClientProvider>
                    <SettingsProvider>
                        <RootLayout />
                    </SettingsProvider>
                </ReactQueryClientProvider>
            </PaperProvider>
        </ThemeProvider>
    );
}
