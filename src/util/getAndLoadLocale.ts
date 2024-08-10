import 'intl-pluralrules';

import { getLocales } from 'expo-localization';

import type { Locales, TranslationFunctions } from '../i18n/i18n-types';
import { baseLocale, i18nObject, isLocale } from '../i18n/i18n-util';
import { loadLocale } from '../i18n/i18n-util.sync';

let globalLL: TranslationFunctions | null = null;

export const getEffectiveLocale = (): Locales => {
    const loadedLocale: string = getLocales()[0].languageCode ?? baseLocale;
    let locale: Locales;
    if (isLocale(loadedLocale)) {
        locale = loadedLocale;
    } else {
        locale = baseLocale;
    }
    return locale;
};

export const getAndLoadLocale = (): Locales => {
    const locale = getEffectiveLocale();
    loadLocale(locale);
    globalLL = i18nObject(locale);
    return locale;
};

export const getGlobalLL = (): TranslationFunctions => {
    if (globalLL === null) {
        globalLL = i18nObject(baseLocale);
    }
    return globalLL;
};
