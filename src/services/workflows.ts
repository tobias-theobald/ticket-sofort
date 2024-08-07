import type { AppSettings, FullTicketDecoded } from '../types';
import { fullTicketsRequest, loginRequest, ticketIdsRequest } from './requests';
import { getAppSettings, saveAppSettings } from './storage';

export async function loginWorkflow(): Promise<void> {
    const appSettings: AppSettings = await getAppSettings();
    if (!appSettings.email || !appSettings.password) {
        throw new Error('Email and password are required');
    }
    const newAccessToken = await loginRequest({
        email: appSettings.email,
        password: appSettings.password,
    });
    await saveAppSettings({ ...appSettings, accessToken: newAccessToken });
    return refreshTicketsWorkflow();
}

export async function logoutWorkflow(): Promise<void> {
    const appSettings: AppSettings = await getAppSettings();
    await saveAppSettings({ ...appSettings, accessToken: null, selectedTicketId: null, availableTickets: {} });
}

export async function refreshTicketsWorkflow(): Promise<void> {
    const appSettings: AppSettings = await getAppSettings();
    if (!appSettings.accessToken) {
        throw new Error('Access token is required');
    }
    const ticketIds = await ticketIdsRequest();
    const fullTickets = await fullTicketsRequest(ticketIds);
    let selectedTicketId = appSettings.selectedTicketId;
    if (selectedTicketId && !Object.keys(fullTickets).includes(selectedTicketId)) {
        selectedTicketId = null;
    }
    await saveAppSettings({ ...appSettings, selectedTicketId, availableTickets: fullTickets });
}

export const useValidTicket = (appSettings: AppSettings): [string, FullTicketDecoded] | string => {
    let selectedTicketKey: string | undefined;
    let selectedTicket: FullTicketDecoded | undefined;
    const now = new Date();
    if (appSettings.selectedTicketId !== null) {
        selectedTicketKey = appSettings.selectedTicketId;
        selectedTicket = appSettings.availableTickets[appSettings.selectedTicketId];
        if (selectedTicket === undefined) {
            return 'Gewähltes Ticket nicht (mehr) verfügbar. Bitte ein neues Ticket auswählen.';
        }
        const validityEnd = new Date(selectedTicket.metaDecoded.validity_end);
        if (validityEnd < now) {
            return 'Gewähltes Ticket ist abgelaufen. Bitte ein neues Ticket auswählen.';
        }
    } else if (Object.keys(appSettings.availableTickets).length === 0) {
        return 'Keine Tickets verfügbar. Bitte ein aktualisieren Sie Ihre Tickets.';
    } else {
        const ticketsSorted = Object.entries(appSettings.availableTickets)
            .filter(([_id, ticket]) => {
                const validityStart = new Date(ticket.metaDecoded.validity_begin);
                const validityEnd = new Date(ticket.metaDecoded.validity_end);
                return validityStart <= now && validityEnd >= now;
            })
            .sort(([_id0, ticket0], [_id1, ticket1]): number => {
                const validityEnd0 = new Date(ticket0.metaDecoded.validity_end);
                const validityEnd1 = new Date(ticket1.metaDecoded.validity_end);
                return validityEnd0.getTime() - validityEnd1.getTime();
            });
        [selectedTicketKey, selectedTicket] = ticketsSorted[0];
    }

    return [selectedTicketKey, selectedTicket];
};
