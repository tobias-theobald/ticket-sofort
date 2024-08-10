import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppSettings } from '../types';

export const APP_SETTINGS_KEY = 'appSettings';

export const getDefaultAppSettings = async (): Promise<AppSettings> => {
    // let zod defaults handle populating the object
    return AppSettings.parse({});
};

export const getAppSettings = async (): Promise<AppSettings> => {
    const storedAppSettings = await AsyncStorage.getItem(APP_SETTINGS_KEY);
    if (storedAppSettings === null) {
        return getDefaultAppSettings();
    } else {
        const jsonAppSettings = JSON.parse(storedAppSettings);
        const parsedAppSettings = AppSettings.parse(jsonAppSettings);

        // Migration from previous settings version (only used in one alpha version, but still)
        if (parsedAppSettings.username === '' && typeof jsonAppSettings.email === 'string') {
            parsedAppSettings.username = jsonAppSettings.email;
        }
        return parsedAppSettings;
    }
};

export const saveAppSettings = async (settings: AppSettings): Promise<void> => {
    await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
    console.info('settings saved');
};

export const resetAppSettings = async (): Promise<void> => {
    await AsyncStorage.removeItem(APP_SETTINGS_KEY);
    console.info('settings reset');
};
