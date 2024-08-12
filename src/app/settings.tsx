import { router } from 'expo-router';
import { Fragment, useCallback, useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Divider, HelperText, IconButton, List, Text, TextInput } from 'react-native-paper';

import { Page } from '../components/Page';
import { useSettings } from '../components/providers/SettingsProvider';
import styles from '../constants/styles';
import { useI18nContext } from '../i18n/i18n-react';
import { type AppSettings, remoteDisplayName } from '../types';

const CONFIGURABLE_KEYS = ['username', 'deviceIdentifier', 'selectedTicketId'] as const;
type ConfigurableAppSettings = Pick<AppSettings, (typeof CONFIGURABLE_KEYS)[number]>;
const singleCharRegex = /./g;

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

    const [showExpertSettings, setShowExpertSettings] = useState(false);

    const handleUsernameChange = useCallback((newValue: string) => {
        console.info(`username changed to ${newValue}`);
        setAppSettings((currentAppSettings) => ({ ...currentAppSettings, username: newValue }));
    }, []);

    const handlePasswordChange = useCallback((newValue: string) => {
        console.info(`password changed to ${newValue.replaceAll(singleCharRegex, '*')}`);
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

    const handleShowExpertSettings = useCallback(() => {
        setShowExpertSettings(true);
    }, []);

    let loginStatusString;
    if (typeof loginStatus === 'string') {
        loginStatusString = loginStatus;
    } else if (loginStatus) {
        loginStatusString = LL.settingsScreenLoggedIn();
    } else {
        loginStatusString = LL.settingsScreenLoggedOut();
    }

    let loginFormComponent;
    if (loginStatus !== true) {
        loginFormComponent = (
            <>
                <View style={styles.mediumMarginBottom}>
                    <TextInput
                        label={LL.settingsScreenAccountUsername()}
                        textContentType={'emailAddress'}
                        autoCapitalize={'none'}
                        value={appSettings.username}
                        onChangeText={handleUsernameChange}
                        onBlur={handleBlur}
                        disabled={doLoginLoading}
                    />
                    <TextInput
                        label={LL.settingsScreenAccountPassword()}
                        textContentType={'password'}
                        autoCapitalize={'none'}
                        value={password}
                        onChangeText={handlePasswordChange}
                        onBlur={handleBlur}
                        secureTextEntry
                        disabled={doLoginLoading}
                    />
                </View>
                {saveAppSettingsError && <HelperText type="error">{saveAppSettingsError}</HelperText>}
                <Text>
                    {LL.settingsScreenAccountStatus()}: {loginStatusString}
                </Text>
            </>
        );
    } else {
        loginFormComponent = (
            <Text>
                {LL.settingsScreenLoggedInMessage({
                    remote: remoteDisplayName[initialAppSettings.remote],
                    username: initialAppSettings.username,
                })}
            </Text>
        );
    }

    let ticketsComponentContent;
    if (loginStatus === true) {
        ticketsComponentContent = (
            <>
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
                {Object.entries(initialAppSettings.availableTickets).map(([id, ticket], i) => (
                    <Fragment key={id}>
                        {i > 0 && <Divider />}
                        <List.Item
                            title={`${ticket.metaDecoded.title}`}
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
                    </Fragment>
                ))}
            </>
        );
    } else {
        ticketsComponentContent = <Text>{LL.ticketScreenNotLoggedIn()}</Text>;
    }

    return (
        <Page>
            <Card style={styles.mediumMarginBottom}>
                <Card.Title title={LL.settingsScreenAccountTitle()} />
                <Card.Content>{loginFormComponent}</Card.Content>
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
                            {loginStatus === true
                                ? LL.settingsScreenAccountLogout()
                                : LL.settingsScreenAccountLogin({
                                      remote: remoteDisplayName[initialAppSettings.remote],
                                  })}
                        </Button>
                    )}
                </Card.Actions>
            </Card>
            <Card style={styles.mediumMarginBottom}>
                <Card.Title title={LL.settingsScreenTicketsTitle()} />
                <Card.Content>{ticketsComponentContent}</Card.Content>
                <Card.Actions>
                    {doLoginLoading ? (
                        <IconButton
                            icon="login"
                            loading
                            disabled
                            accessibilityLabel={LL.settingsScreenTicketsRefreshing()}
                        />
                    ) : (
                        <Button onPress={refreshTicketsButtonPressed} disabled={loginStatus !== true}>
                            {LL.settingsScreenTicketsRefresh()}
                        </Button>
                    )}
                </Card.Actions>
            </Card>
            <Card>
                <Card.Title title={LL.settingsScreenExpertTitle()} />
                <Card.Content>
                    {showExpertSettings && (
                        <TextInput
                            label={LL.settingsScreenExpertDeviceId()}
                            value={appSettings.deviceIdentifier}
                            onChangeText={handleDeviceIdentifierChange}
                            onBlur={handleBlur}
                        />
                    )}
                </Card.Content>
                <Card.Actions>
                    {showExpertSettings ? (
                        <Button onPress={handleResetAppSettings}>
                            {reallyResetAppSettings
                                ? LL.settingsScreenExpertReallyReset()
                                : LL.settingsScreenExpertReset()}
                        </Button>
                    ) : (
                        <Button onPress={handleShowExpertSettings}>{LL.settingsScreenExpertShow()}</Button>
                    )}
                </Card.Actions>
            </Card>
        </Page>
    );
};

export default Settings;
