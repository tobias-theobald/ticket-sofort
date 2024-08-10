import { ThemeProvider } from '@react-navigation/native';
import { Link, Stack } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import TypesafeI18n, { useI18nContext } from '../i18n/i18n-react';
import { getAndLoadLocale, getEffectiveLocale } from '../util/getAndLoadLocale';

export const NAVBAR_ICON_SIZE = 24;
const TICKET_REFRESH_INTERVAL = 12 * 60 * 60 * 1000;

const IndexHeaderRight = () => {
    const { LL } = useI18nContext();

    const { doRefreshTickets, doLoginLoading, loginStatus, appSettings } = useSettings();
    const lastTicketSyncDate = useMemo<Date | null>(
        () => (appSettings.lastTicketSync === null ? null : new Date(appSettings.lastTicketSync)),
        [appSettings.lastTicketSync],
    );

    const forceRefreshTickets = useCallback(() => {
        doRefreshTickets({ forceRefresh: true });
    }, [doRefreshTickets]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (
                nextAppState === 'active' &&
                loginStatus === true &&
                (lastTicketSyncDate === null ||
                    lastTicketSyncDate.getTime() + TICKET_REFRESH_INTERVAL < Date.now() ||
                    getEffectiveLocale() !== appSettings.ticketFetchLocale)
            ) {
                // Force refresh when language changed from last fetch
                doRefreshTickets({ forceRefresh: getEffectiveLocale() !== appSettings.ticketFetchLocale });
            }
        });

        return () => subscription.remove();
    }, [appSettings.ticketFetchLocale, doRefreshTickets, lastTicketSyncDate, loginStatus]);

    return (
        <>
            <IconButton
                icon={'refresh'}
                size={NAVBAR_ICON_SIZE}
                accessibilityLabel={LL.screenHeaderButtonA11yClose()}
                onPress={forceRefreshTickets}
                loading={doLoginLoading}
                disabled={loginStatus !== true}
            />
            <Link asChild href="/settings">
                <IconButton
                    icon="cog"
                    size={NAVBAR_ICON_SIZE}
                    accessibilityLabel={LL.screenHeaderButtonA11ySettings()}
                />
            </Link>
        </>
    );
};

export function RootLayout() {
    const { LL } = useI18nContext();
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: LL.screenHeaderTicket(),
                    headerRight: IndexHeaderRight,
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    title: LL.screenHeaderSettings(),
                    presentation: 'modal',
                    headerRight: () => (
                        <Link asChild href="/">
                            <IconButton
                                icon="close"
                                size={NAVBAR_ICON_SIZE}
                                accessibilityLabel={LL.screenHeaderButtonA11yClose()}
                            />
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
    const [locale, setLocale] = useState(getAndLoadLocale());

    // Ensure locale is in sync with system settings
    useEffect(() => {
        const subscription = AppState.addEventListener('change', () => {
            setLocale(getAndLoadLocale());
        });
        return () => {
            subscription.remove();
        };
    }, []);

    const reactNavigationTheme =
        colorScheme === 'dark' ? ModifiedReactNavigationDarkTheme : ModifiedReactNavigationLightTheme;
    const reactNativePaperTheme =
        colorScheme === 'dark' ? ModifiedReactNativePaperDarkTheme : ModifiedReactNativePaperLightTheme;

    return (
        <TypesafeI18n locale={locale}>
            <ThemeProvider value={reactNavigationTheme}>
                <PaperProvider theme={reactNativePaperTheme}>
                    <ReactQueryClientProvider>
                        <SettingsProvider>
                            <RootLayout />
                        </SettingsProvider>
                    </ReactQueryClientProvider>
                </PaperProvider>
            </ThemeProvider>
        </TypesafeI18n>
    );
}
