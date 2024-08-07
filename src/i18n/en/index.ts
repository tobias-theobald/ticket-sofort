import type { BaseTranslation } from '../i18n-types';

const en = {
    screenHeaderTicket: 'Tickets',
    screenHeaderSettings: 'Settings',
    screenHeaderButtonA11yClose: 'close',
    screenHeaderButtonA11yRefresh: 'refresh tickets',
    screenHeaderButtonA11ySettings: 'settings',

    ticketScreenGoToSettings: 'Go to settings',
    ticketScreenNotLoggedIn: 'Please log in to show tickets',

    settingsScreenLoggedIn: 'Logged In',
    settingsScreenLoggedOut: 'Logged Out',
    settingsScreenAccountTitle: 'SaarVV Account',
    settingsScreenAccountEmail: 'E-Mail',
    settingsScreenAccountPassword: 'Password',
    settingsScreenAccountStatus: 'Status',
    settingsScreenAccountLogin: 'Log In',
    settingsScreenAccountLogout: 'Log Out',
    settingsScreenAccountA11yLoggingIn: 'logging in or refreshing tickets',
    settingsScreenTicketsTitle: 'Tickets',
    settingsScreenTicketsAvailable: 'Available tickets',
    settingsScreenTicketsAutomaticTitle: 'Automatically select ticket',
    settingsScreenTicketsAutomaticDescription: 'Automatically select the best ticket for the current date',
    settingsScreenTicketsValidity: 'Valid from {validFrom:string} to {validTo:string}',
    settingsScreenTicketsRefreshing: 'Refreshing tickets',
    settingsScreenTicketsRefresh: 'Refresh tickets',
    settingsScreenExpertTitle: 'Expert Settings',
    settingsScreenExpertDeviceId: 'Device ID',
    settingsScreenExpertReset: 'Reset App Settings',
    settingsScreenExpertReallyReset: 'Really reset app settings?',

    requestError: 'Request failed',
    requestResponseSchemaError: 'Response does not match expected schema',

    workflowLoginErrorRequired: 'Email and password are required',
    workflowRefreshErrorNoAccessToken: 'You are not logged in',
    workflowValidTicketNoLongerAvailable: 'The selected ticket is no longer available. Please select a new one.',
    workflowValidTicketExpired: 'The selected ticket has expired. Please select a new one.',
    workflowValidTicketNoTickets:
        'No tickets available. Please make sure you have a ticket in the official app and refresh your tickets in this app.',
} satisfies BaseTranslation;

export default en;
