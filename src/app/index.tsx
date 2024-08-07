import * as Brightness from 'expo-brightness';
import { Link, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { CenterPage, PageNoScroll } from '../components/Page';
import { useSettings } from '../components/providers/SettingsProvider';
import { TicketRenderer } from '../components/TicketRenderer';
import styles from '../constants/styles';
import { useI18nContext } from '../i18n/i18n-react';
import { useValidTicket } from '../services/workflows';

const TicketView = () => {
    const { LL } = useI18nContext();
    const { appSettings, loginStatus } = useSettings();
    const validTicketResult = useValidTicket(appSettings);
    const navigation = useNavigation();

    const [prevBrightness, setPrevBrightness] = useState<number | null>(null);
    const [permissionResponse, requestPermission] = Brightness.usePermissions();
    const toggleBrightness = useCallback(() => {
        if (!permissionResponse) {
            // too early
            return;
        }
        (async () => {
            if (!permissionResponse.granted) {
                if (permissionResponse.canAskAgain) {
                    await requestPermission();
                } else {
                    console.info('no permission to change brightness');
                }
                return;
            }
            if (prevBrightness === null) {
                const currentBrightness = await Brightness.getBrightnessAsync();
                setPrevBrightness(currentBrightness);
                await Brightness.setBrightnessAsync(1);
            } else {
                setPrevBrightness(null);
                await Brightness.setBrightnessAsync(prevBrightness);
            }
        })().catch(console.error);
    }, [permissionResponse, prevBrightness, requestPermission]);

    useEffect(() => {
        if (prevBrightness === null) {
            return;
        }
        const blurCallback = () => {
            Brightness.setBrightnessAsync(prevBrightness).catch(console.error);
        };
        const appStateChangeCallback = (nextAppState: string) => {
            if (nextAppState !== 'active') {
                blurCallback();
            }
        };
        const unregisterBlurListener = navigation.addListener('blur', blurCallback);
        const appStateSubscription = AppState.addEventListener('change', appStateChangeCallback);

        return () => {
            unregisterBlurListener();
            appStateSubscription.remove();
        };
    }, [navigation, prevBrightness]);

    if (loginStatus !== true) {
        return (
            <CenterPage>
                <Text style={styles.mediumMarginBottom}>{LL.ticketScreenNotLoggedIn()}</Text>
                <Link href="/settings" asChild>
                    <Button mode="contained">{LL.ticketScreenGoToSettings()}</Button>
                </Link>
            </CenterPage>
        );
    }
    if (typeof validTicketResult === 'string') {
        return (
            <CenterPage>
                <Text style={styles.mediumMarginBottom}>{validTicketResult}</Text>
                <Link href="/settings" asChild>
                    <Button mode="contained">{LL.ticketScreenGoToSettings()}</Button>
                </Link>
            </CenterPage>
        );
    }

    const [_validTicketId, validTicket] = validTicketResult;

    return (
        <PageNoScroll onPress={toggleBrightness}>
            <TicketRenderer ticket={validTicket} />
        </PageNoScroll>
    );
};

export default TicketView;
