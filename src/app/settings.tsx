import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, HelperText, IconButton, List, Text, TextInput } from 'react-native-paper';

import { Page } from '../components/Page';
import { useSettings } from '../components/providers/SettingsProvider';
import styles from '../constants/styles';
import { useI18nContext } from '../i18n/i18n-react';
import type { AppSettings } from '../types';

const CONFIGURABLE_KEYS = ['username', 'deviceIdentifier', 'selectedTicketId'] as const;
type ConfigurableAppSettings = Pick<AppSettings, (typeof CONFIGURABLE_KEYS)[number]>;

const Settings = () => {
    const { LL } = useI18nContext();

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
    const [password, setPassword] = useState('');

    const handleUsernameChange = useCallback((newValue: string) => {
        console.info(`username changed to ${newValue}`);
        setAppSettings((currentAppSettings) => ({ ...currentAppSettings, username: newValue }));
    }, []);

    const handlePasswordChange = useCallback((newValue: string) => {
        console.info(`password changed to ${newValue}`);
        setPassword(newValue);
    }, []);

    const handleDeviceIdentifierChange = useCallback((newValue: string) => {
        console.info(`deviceIdentifier changed to ${newValue}`);
        setAppSettings((currentAppSettings) => ({ ...currentAppSettings, deviceIdentifier: newValue }));
    }, []);

    const handleBlur = useCallback(() => {
        console.debug('blur settings form');
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
            doLogin({ username: appSettings.username, password });
        }
    }, [appSettings.username, doLogin, doLogout, loginStatus, password]);

    const refreshTicketsButtonPressed = useCallback(() => {
        console.info('refresh tickets button pressed');
        doRefreshTickets({ forceRefresh: true });
    }, [doRefreshTickets]);

    const handleResetAppSettings = useCallback(() => {
        if (!reallyResetAppSettings) {
            setReallyResetAppSettings(true);
            return;
        }
        console.info('resetting app settings');
        doResetAppSettings();
        setReallyResetAppSettings(false);
        router.navigate('/');
    }, [doResetAppSettings, reallyResetAppSettings]);

    let loginStatusString;
    if (typeof loginStatus === 'string') {
        loginStatusString = loginStatus;
    } else if (loginStatus) {
        loginStatusString = LL.settingsScreenLoggedIn();
    } else {
        loginStatusString = LL.settingsScreenLoggedOut();
    }

    return (
        <Page>
            <Card style={styles.mediumMarginBottom}>
                <Card.Title title={LL.settingsScreenAccountTitle()} />
                <Card.Content>
                    <View style={styles.mediumMarginBottom}>
                        <TextInput
                            label={LL.settingsScreenAccountUsername()}
                            textContentType={'emailAddress'}
                            autoCapitalize={'none'}
                            value={appSettings.username}
                            onChangeText={handleUsernameChange}
                            onBlur={handleBlur}
                        />
                        <TextInput
                            label={LL.settingsScreenAccountPassword()}
                            textContentType={'password'}
                            autoCapitalize={'none'}
                            value={password}
                            onChangeText={handlePasswordChange}
                            onBlur={handleBlur}
                            secureTextEntry
                        />
                    </View>
                    {saveAppSettingsError && <HelperText type="error">{saveAppSettingsError}</HelperText>}
                    <Text>
                        {LL.settingsScreenAccountStatus()}: {loginStatusString}
                    </Text>
                </Card.Content>
                <Card.Actions>
                    {doLoginLoading ? (
                        <IconButton
                            icon="login"
                            loading
                            disabled
                            accessibilityLabel={LL.settingsScreenAccountA11yLoggingIn()}
                        />
                    ) : (
                        <Button onPress={loginButtonPressed}>
                            {loginStatus === true ? LL.settingsScreenAccountLogout() : LL.settingsScreenAccountLogin()}
                        </Button>
                    )}
                </Card.Actions>
            </Card>
            <Card style={styles.mediumMarginBottom}>
                <Card.Title title={LL.settingsScreenTicketsTitle()} />
                <Card.Content>
                    <Text>
                        {LL.settingsScreenTicketsAvailable()}: {Object.keys(initialAppSettings.availableTickets).length}
                    </Text>
                    <List.Item
                        title={LL.settingsScreenTicketsAutomaticTitle()}
                        description={LL.settingsScreenTicketsAutomaticDescription()}
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
                            description={LL.settingsScreenTicketsValidity({
                                validFrom: ticket.metaDecoded.validity_begin,
                                validTo: ticket.metaDecoded.validity_end,
                            })}
                            right={
                                appSettings.selectedTicketId === id
                                    ? (props) => <List.Icon {...props} icon="check" />
                                    : undefined
                            }
                            onPress={() => handleSelectedTicketChanged(id)}
                        />
                    ))}
                </Card.Content>
                <Card.Actions>
                    {doLoginLoading ? (
                        <IconButton
                            icon="login"
                            loading
                            disabled
                            accessibilityLabel={LL.settingsScreenTicketsRefreshing()}
                        />
                    ) : (
                        <Button onPress={refreshTicketsButtonPressed}>{LL.settingsScreenTicketsRefresh()}</Button>
                    )}
                </Card.Actions>
            </Card>
            <Card>
                <Card.Title title={LL.settingsScreenExpertTitle()} />
                <Card.Content>
                    <TextInput
                        label={LL.settingsScreenExpertDeviceId()}
                        value={appSettings.deviceIdentifier}
                        onChangeText={handleDeviceIdentifierChange}
                        onBlur={handleBlur}
                    />
                </Card.Content>
                <Card.Actions>
                    <Button onPress={handleResetAppSettings}>
                        {reallyResetAppSettings ? LL.settingsScreenExpertReallyReset() : LL.settingsScreenExpertReset()}
                    </Button>
                </Card.Actions>
            </Card>
        </Page>
    );
};

export default Settings;
