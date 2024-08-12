import type { Translation } from '../i18n-types';

const de = {
    screenHeaderTicket: 'Tickets',
    screenHeaderSettings: 'Einstellungen',
    screenHeaderButtonA11yClose: 'schließen',
    screenHeaderButtonA11yRefresh: 'Tickets aktualisieren',
    screenHeaderButtonA11ySettings: 'Einstellungen',

    ticketScreenGoToSettings: 'Zu den Einstellungen',
    ticketScreenNotLoggedIn: 'Bitte logge dich ein, um Tickets anzuzeigen',

    settingsScreenLoggedInMessage: 'Eingeloggt bei {remote} als {username}',
    settingsScreenLoggedIn: 'Eingeloggt',
    settingsScreenLoggedOut: 'Ausgeloggt',
    settingsScreenAccountTitle: 'Konto',
    settingsScreenAccountUsername: 'E-Mail',
    settingsScreenAccountPassword: 'Passwort',
    settingsScreenAccountStatus: 'Status',
    settingsScreenAccountLogin: 'Bei {remote} einloggen',
    settingsScreenAccountLogout: 'Ausloggen',
    settingsScreenAccountA11yLoggingIn: 'melde dich gerade an oder aktualisiere Tickets',
    settingsScreenTicketsTitle: 'Tickets',
    settingsScreenTicketsAvailable: 'Verfügbare Tickets',
    settingsScreenTicketsAutomaticTitle: 'Ticket automatisch auswählen',
    settingsScreenTicketsAutomaticDescription: 'Wähle automatisch das beste Ticket für das aktuelle Datum aus',
    settingsScreenTicketsValidity: 'Gültig von {validFrom} bis {validTo}',
    settingsScreenTicketsRefreshing: 'Aktualisiere Tickets',
    settingsScreenTicketsRefresh: 'Tickets aktualisieren',
    settingsScreenExpertTitle: 'Experteneinstellungen',
    settingsScreenExpertDeviceId: 'Device ID',
    settingsScreenExpertReset: 'App-Einstellungen zurücksetzen',
    settingsScreenExpertReallyReset: 'App-Einstellungen wirklich zurücksetzen?',
    settingsScreenExpertShow: 'Anzeigen',

    requestError: 'Server-Anfrage fehlgeschlagen',
    requestResponseSchemaError: 'Server-Antwort entspricht nicht dem erwarteten Schema',

    workflowLoginErrorRequired: 'E-Mail und Passwort sind erforderlich',
    workflowRefreshErrorNoAccessToken: 'Du bist nicht eingeloggt',
    workflowValidTicketNoLongerAvailable: 'Das ausgewählte Ticket ist nicht mehr verfügbar. Bitte wähle ein neues aus.',
    workflowValidTicketExpired: 'Das ausgewählte Ticket ist abgelaufen. Bitte wähle ein neues aus.',
    workflowValidTicketNoTickets:
        'Keine Tickets verfügbar. Bitte stelle sicher, dass du ein Ticket in der offiziellen App hast und aktualisiere deine Tickets in dieser App.',
} satisfies Translation;

export default de;
