// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString, RequiredParams } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'de'
	| 'en'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * T​i​c​k​e​t​s
	 */
	screenHeaderTicket: string
	/**
	 * S​e​t​t​i​n​g​s
	 */
	screenHeaderSettings: string
	/**
	 * c​l​o​s​e
	 */
	screenHeaderButtonA11yClose: string
	/**
	 * r​e​f​r​e​s​h​ ​t​i​c​k​e​t​s
	 */
	screenHeaderButtonA11yRefresh: string
	/**
	 * s​e​t​t​i​n​g​s
	 */
	screenHeaderButtonA11ySettings: string
	/**
	 * G​o​ ​t​o​ ​s​e​t​t​i​n​g​s
	 */
	ticketScreenGoToSettings: string
	/**
	 * P​l​e​a​s​e​ ​l​o​g​ ​i​n​ ​t​o​ ​s​h​o​w​ ​t​i​c​k​e​t​s
	 */
	ticketScreenNotLoggedIn: string
	/**
	 * L​o​g​g​e​d​ ​I​n
	 */
	settingsScreenLoggedIn: string
	/**
	 * L​o​g​g​e​d​ ​O​u​t
	 */
	settingsScreenLoggedOut: string
	/**
	 * S​a​a​r​V​V​ ​A​c​c​o​u​n​t
	 */
	settingsScreenAccountTitle: string
	/**
	 * E​-​M​a​i​l
	 */
	settingsScreenAccountUsername: string
	/**
	 * P​a​s​s​w​o​r​d
	 */
	settingsScreenAccountPassword: string
	/**
	 * S​t​a​t​u​s
	 */
	settingsScreenAccountStatus: string
	/**
	 * L​o​g​ ​I​n
	 */
	settingsScreenAccountLogin: string
	/**
	 * L​o​g​ ​O​u​t
	 */
	settingsScreenAccountLogout: string
	/**
	 * l​o​g​g​i​n​g​ ​i​n​ ​o​r​ ​r​e​f​r​e​s​h​i​n​g​ ​t​i​c​k​e​t​s
	 */
	settingsScreenAccountA11yLoggingIn: string
	/**
	 * T​i​c​k​e​t​s
	 */
	settingsScreenTicketsTitle: string
	/**
	 * A​v​a​i​l​a​b​l​e​ ​t​i​c​k​e​t​s
	 */
	settingsScreenTicketsAvailable: string
	/**
	 * A​u​t​o​m​a​t​i​c​a​l​l​y​ ​s​e​l​e​c​t​ ​t​i​c​k​e​t
	 */
	settingsScreenTicketsAutomaticTitle: string
	/**
	 * A​u​t​o​m​a​t​i​c​a​l​l​y​ ​s​e​l​e​c​t​ ​t​h​e​ ​b​e​s​t​ ​t​i​c​k​e​t​ ​f​o​r​ ​t​h​e​ ​c​u​r​r​e​n​t​ ​d​a​t​e
	 */
	settingsScreenTicketsAutomaticDescription: string
	/**
	 * V​a​l​i​d​ ​f​r​o​m​ ​{​v​a​l​i​d​F​r​o​m​}​ ​t​o​ ​{​v​a​l​i​d​T​o​}
	 * @param {string} validFrom
	 * @param {string} validTo
	 */
	settingsScreenTicketsValidity: RequiredParams<'validFrom' | 'validTo'>
	/**
	 * R​e​f​r​e​s​h​i​n​g​ ​t​i​c​k​e​t​s
	 */
	settingsScreenTicketsRefreshing: string
	/**
	 * R​e​f​r​e​s​h​ ​t​i​c​k​e​t​s
	 */
	settingsScreenTicketsRefresh: string
	/**
	 * E​x​p​e​r​t​ ​S​e​t​t​i​n​g​s
	 */
	settingsScreenExpertTitle: string
	/**
	 * D​e​v​i​c​e​ ​I​D
	 */
	settingsScreenExpertDeviceId: string
	/**
	 * R​e​s​e​t​ ​A​p​p​ ​S​e​t​t​i​n​g​s
	 */
	settingsScreenExpertReset: string
	/**
	 * R​e​a​l​l​y​ ​r​e​s​e​t​ ​a​p​p​ ​s​e​t​t​i​n​g​s​?
	 */
	settingsScreenExpertReallyReset: string
	/**
	 * R​e​q​u​e​s​t​ ​f​a​i​l​e​d
	 */
	requestError: string
	/**
	 * R​e​s​p​o​n​s​e​ ​d​o​e​s​ ​n​o​t​ ​m​a​t​c​h​ ​e​x​p​e​c​t​e​d​ ​s​c​h​e​m​a
	 */
	requestResponseSchemaError: string
	/**
	 * E​m​a​i​l​ ​a​n​d​ ​p​a​s​s​w​o​r​d​ ​a​r​e​ ​r​e​q​u​i​r​e​d
	 */
	workflowLoginErrorRequired: string
	/**
	 * Y​o​u​ ​a​r​e​ ​n​o​t​ ​l​o​g​g​e​d​ ​i​n
	 */
	workflowRefreshErrorNoAccessToken: string
	/**
	 * T​h​e​ ​s​e​l​e​c​t​e​d​ ​t​i​c​k​e​t​ ​i​s​ ​n​o​ ​l​o​n​g​e​r​ ​a​v​a​i​l​a​b​l​e​.​ ​P​l​e​a​s​e​ ​s​e​l​e​c​t​ ​a​ ​n​e​w​ ​o​n​e​.
	 */
	workflowValidTicketNoLongerAvailable: string
	/**
	 * T​h​e​ ​s​e​l​e​c​t​e​d​ ​t​i​c​k​e​t​ ​h​a​s​ ​e​x​p​i​r​e​d​.​ ​P​l​e​a​s​e​ ​s​e​l​e​c​t​ ​a​ ​n​e​w​ ​o​n​e​.
	 */
	workflowValidTicketExpired: string
	/**
	 * N​o​ ​t​i​c​k​e​t​s​ ​a​v​a​i​l​a​b​l​e​.​ ​P​l​e​a​s​e​ ​m​a​k​e​ ​s​u​r​e​ ​y​o​u​ ​h​a​v​e​ ​a​ ​t​i​c​k​e​t​ ​i​n​ ​t​h​e​ ​o​f​f​i​c​i​a​l​ ​a​p​p​ ​a​n​d​ ​r​e​f​r​e​s​h​ ​y​o​u​r​ ​t​i​c​k​e​t​s​ ​i​n​ ​t​h​i​s​ ​a​p​p​.
	 */
	workflowValidTicketNoTickets: string
}

export type TranslationFunctions = {
	/**
	 * Tickets
	 */
	screenHeaderTicket: () => LocalizedString
	/**
	 * Settings
	 */
	screenHeaderSettings: () => LocalizedString
	/**
	 * close
	 */
	screenHeaderButtonA11yClose: () => LocalizedString
	/**
	 * refresh tickets
	 */
	screenHeaderButtonA11yRefresh: () => LocalizedString
	/**
	 * settings
	 */
	screenHeaderButtonA11ySettings: () => LocalizedString
	/**
	 * Go to settings
	 */
	ticketScreenGoToSettings: () => LocalizedString
	/**
	 * Please log in to show tickets
	 */
	ticketScreenNotLoggedIn: () => LocalizedString
	/**
	 * Logged In
	 */
	settingsScreenLoggedIn: () => LocalizedString
	/**
	 * Logged Out
	 */
	settingsScreenLoggedOut: () => LocalizedString
	/**
	 * SaarVV Account
	 */
	settingsScreenAccountTitle: () => LocalizedString
	/**
	 * E-Mail
	 */
	settingsScreenAccountUsername: () => LocalizedString
	/**
	 * Password
	 */
	settingsScreenAccountPassword: () => LocalizedString
	/**
	 * Status
	 */
	settingsScreenAccountStatus: () => LocalizedString
	/**
	 * Log In
	 */
	settingsScreenAccountLogin: () => LocalizedString
	/**
	 * Log Out
	 */
	settingsScreenAccountLogout: () => LocalizedString
	/**
	 * logging in or refreshing tickets
	 */
	settingsScreenAccountA11yLoggingIn: () => LocalizedString
	/**
	 * Tickets
	 */
	settingsScreenTicketsTitle: () => LocalizedString
	/**
	 * Available tickets
	 */
	settingsScreenTicketsAvailable: () => LocalizedString
	/**
	 * Automatically select ticket
	 */
	settingsScreenTicketsAutomaticTitle: () => LocalizedString
	/**
	 * Automatically select the best ticket for the current date
	 */
	settingsScreenTicketsAutomaticDescription: () => LocalizedString
	/**
	 * Valid from {validFrom} to {validTo}
	 */
	settingsScreenTicketsValidity: (arg: { validFrom: string, validTo: string }) => LocalizedString
	/**
	 * Refreshing tickets
	 */
	settingsScreenTicketsRefreshing: () => LocalizedString
	/**
	 * Refresh tickets
	 */
	settingsScreenTicketsRefresh: () => LocalizedString
	/**
	 * Expert Settings
	 */
	settingsScreenExpertTitle: () => LocalizedString
	/**
	 * Device ID
	 */
	settingsScreenExpertDeviceId: () => LocalizedString
	/**
	 * Reset App Settings
	 */
	settingsScreenExpertReset: () => LocalizedString
	/**
	 * Really reset app settings?
	 */
	settingsScreenExpertReallyReset: () => LocalizedString
	/**
	 * Request failed
	 */
	requestError: () => LocalizedString
	/**
	 * Response does not match expected schema
	 */
	requestResponseSchemaError: () => LocalizedString
	/**
	 * Email and password are required
	 */
	workflowLoginErrorRequired: () => LocalizedString
	/**
	 * You are not logged in
	 */
	workflowRefreshErrorNoAccessToken: () => LocalizedString
	/**
	 * The selected ticket is no longer available. Please select a new one.
	 */
	workflowValidTicketNoLongerAvailable: () => LocalizedString
	/**
	 * The selected ticket has expired. Please select a new one.
	 */
	workflowValidTicketExpired: () => LocalizedString
	/**
	 * No tickets available. Please make sure you have a ticket in the official app and refresh your tickets in this app.
	 */
	workflowValidTicketNoTickets: () => LocalizedString
}

export type Formatters = {}
