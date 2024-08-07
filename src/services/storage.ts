import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppSettings } from '../types';
import { sha1 } from '../util/hashAlgorithms';

export const APP_SETTINGS_KEY = 'appSettings';

export const getDefaultAppSettings = async (): Promise<AppSettings> => {
    return {
        email: '',
        password: '',
        accessToken: null,
        deviceIdentifier: await sha1(Date.now().toString(), 'utf-8', 'hex'),
        availableTickets: {},
        selectedTicketId: null,
    };
};

export const getAppSettings = async (): Promise<AppSettings> => {
    const storedAppSettings = await AsyncStorage.getItem(APP_SETTINGS_KEY);
    if (storedAppSettings !== null) {
        return JSON.parse(storedAppSettings);
    }
    return getDefaultAppSettings();
};

export const saveAppSettings = async (settings: AppSettings): Promise<void> => {
    await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
    console.info('settings saved');
};

export const resetAppSettings = async (): Promise<void> => {
    await AsyncStorage.removeItem(APP_SETTINGS_KEY);
    console.info('settings reset');
};
