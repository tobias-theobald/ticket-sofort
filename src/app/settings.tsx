import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, HelperText, IconButton, List, Text, TextInput } from 'react-native-paper';

import { Page } from '../components/Page';
import { useSettings } from '../components/providers/SettingsProvider';
import styles from '../constants/styles';
import type { AppSettings } from '../types';

const CONFIGURABLE_KEYS = ['email', 'password', 'deviceIdentifier', 'userAgent', 'selectedTicketId'] as const;
type ConfigurableAppSettings = Pick<AppSettings, (typeof CONFIGURABLE_KEYS)[number]>;

const Settings = () => {
    const {
        appSettings: initialAppSettings,

        saveAppSettings,
        saveAppSettingsLoading,
        saveAppSettingsError,

        doLogin,
        doLogout,
        doRefreshTickets,
        doLoginLoading,
        loginStatus,

        doResetAppSettings,
    } = useSettings();
    const [appSettings, setAppSettings] = useState<ConfigurableAppSettings>(
        () =>
            Object.fromEntries(
                Object.entries(initialAppSettings).filter(([key]) =>
                    (CONFIGURABLE_KEYS as readonly string[]).includes(key),
                ),
            ) as ConfigurableAppSettings,
    );

    const [reallyResetAppSettings, setReallyResetAppSettings] = useState(false);

    const handleEmailChange = useCallback((newValue: string) => {
        console.info(`email changed to ${newValue}`);
        setAppSettings((currentAppSettings) => ({ ...currentAppSettings, email: newValue }));
    }, []);

    const handlePasswordChange = useCallback((newValue: string) => {
        console.info(`password changed to ${newValue}`);
        setAppSettings((currentAppSettings) => ({ ...currentAppSettings, password: newValue }));
    }, []);

    const handleDeviceIdentifierChange = useCallback((newValue: string) => {
        console.info(`deviceIdentifier changed to ${newValue}`);
        setAppSettings((currentAppSettings) => ({ ...currentAppSettings, deviceIdentifier: newValue }));
    }, []);

    const handleUserAgentChange = useCallback((newValue: string) => {
        console.info(`userAgent changed to ${newValue}`);
        setAppSettings((currentAppSettings) => ({ ...currentAppSettings, userAgent: newValue }));
    }, []);

    const handleBlur = useCallback(() => {
        console.debug('blur');
        if (saveAppSettingsLoading || doLoginLoading) {
            return;
        }
        saveAppSettings({ ...initialAppSettings, ...appSettings });
    }, [appSettings, doLoginLoading, initialAppSettings, saveAppSettings, saveAppSettingsLoading]);

    const handleSelectedTicketChanged = useCallback(
        (newValue: string | null) => {
            console.info(`selectedTicketId changed to ${newValue}`);
            const newAppSettings = { ...appSettings, selectedTicketId: newValue };
            setAppSettings(newAppSettings);
            saveAppSettings({ ...initialAppSettings, ...newAppSettings });
        },
        [appSettings, initialAppSettings, saveAppSettings],
    );

    const loginButtonPressed = useCallback(() => {
        console.info('login/logout button pressed');
        if (loginStatus === true) {
            doLogout();
        } else {
            doLogin();
        }
    }, [doLogin, doLogout, loginStatus]);

    const refreshTicketsButtonPressed = useCallback(() => {
        console.info('refresh tickets button pressed');
        doRefreshTickets();
    }, [doRefreshTickets]);

    const handleResetAppSettings = useCallback(() => {
        if (!reallyResetAppSettings) {
            setReallyResetAppSettings(true);
            return;
        }
        console.info('resetting app settings');
        doResetAppSettings();
        setReallyResetAppSettings(false);
    }, [doResetAppSettings, reallyResetAppSettings]);

    let loginStatusString;
    if (typeof loginStatus === 'string') {
        loginStatusString = loginStatus;
    } else if (loginStatus) {
        loginStatusString = 'Logged In';
    } else {
        loginStatusString = 'Logged Out';
    }

    return (
        <Page>
            <Card style={styles.mediumMarginBottom}>
                <Card.Title title="SaarVV Konto" />
                <Card.Content>
                    <View style={styles.mediumMarginBottom}>
                        <TextInput
                            label="E-Mail"
                            textContentType={'emailAddress'}
                            autoCapitalize={'none'}
                            value={appSettings.email}
                            onChangeText={handleEmailChange}
                            onBlur={handleBlur}
                        />
                        <TextInput
                            label="Passwort"
                            textContentType={'password'}
                            autoCapitalize={'none'}
                            value={appSettings.password}
                            onChangeText={handlePasswordChange}
                            onBlur={handleBlur}
                            secureTextEntry
                        />
                    </View>
                    {saveAppSettingsError && <HelperText type="error">{saveAppSettingsError}</HelperText>}
                    <Text>Status: {loginStatusString}</Text>
                </Card.Content>
                <Card.Actions>
                    {doLoginLoading ? (
                        <IconButton
                            icon="login"
                            loading
                            disabled
                            accessibilityLabel="logging in or refreshing tickets"
                        />
                    ) : (
                        <Button onPress={loginButtonPressed}>Log {loginStatus === true ? 'Out' : 'In'}</Button>
                    )}
                </Card.Actions>
            </Card>
            <Card style={styles.mediumMarginBottom}>
                <Card.Title title="Tickets" />
                <Card.Content>
                    <Text>Verfügbare Tickets: {Object.keys(initialAppSettings.availableTickets).length}</Text>
                    <List.Item
                        title={`Ticket automatisch auswählen`}
                        description={`Wählt das beste Ticket für das aktuelle Datum aus`}
                        right={
                            appSettings.selectedTicketId === null
                                ? (props) => <List.Icon {...props} icon="check" />
                                : undefined
                        }
                        onPress={() => handleSelectedTicketChanged(null)}
                    />
                    {Object.entries(initialAppSettings.availableTickets).map(([id, ticket]) => (
                        <List.Item
                            key={id}
                            title={`${ticket.metaDecoded.title} (${id})`}
                            description={`Gültig von ${ticket.metaDecoded.validity_begin} bis ${ticket.metaDecoded.validity_end}`}
                            right={
                                appSettings.selectedTicketId === id
                                    ? (props) => <List.Icon {...props} icon="check" />
                                    : undefined
                            }
                            onPress={() => handleSelectedTicketChanged(id)}
                        />
                    ))}
                    <Card.Actions>
                        {doLoginLoading ? (
                            <IconButton icon="login" loading disabled accessibilityLabel="refreshing tickets" />
                        ) : (
                            <Button onPress={refreshTicketsButtonPressed}>Refresh Tickets</Button>
                        )}
                    </Card.Actions>
                </Card.Content>
            </Card>
            <Card>
                <Card.Title title="Experteneinstellungen" />
                <Card.Content>
                    <TextInput
                        label="Device ID"
                        value={appSettings.deviceIdentifier}
                        onChangeText={handleDeviceIdentifierChange}
                        onBlur={handleBlur}
                    />
                    <TextInput
                        label="User Agent"
                        value={appSettings.userAgent}
                        onChangeText={handleUserAgentChange}
                        onBlur={handleBlur}
                    />
                    <Card.Actions>
                        <Button onPress={handleResetAppSettings}>
                            {reallyResetAppSettings ? 'Wirklich?' : 'Einstellungen Zurücksetzen'}
                        </Button>
                    </Card.Actions>
                </Card.Content>
            </Card>
        </Page>
    );
};

export default Settings;
