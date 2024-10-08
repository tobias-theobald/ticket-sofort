import type { AppSettings, FullTicketDecoded, LoginCredentials } from '../types';
import { getEffectiveLocale, getGlobalLL } from '../util/getAndLoadLocale';
import { fullTicketsRequest, loginRequest, ticketIdsRequest } from './requests';
import { getAppSettings, saveAppSettings } from './storage';

export async function loginWorkflow({ username, password }: LoginCredentials): Promise<void> {
    const appSettings: AppSettings = await getAppSettings();
    if (!username || !password) {
        throw new Error(getGlobalLL().workflowLoginErrorRequired());
    }
    const newAccessToken = await loginRequest({
        username,
        password,
    });
    await saveAppSettings({ ...appSettings, username, accessToken: newAccessToken });
    return refreshTicketsWorkflow({ forceRefresh: true });
}

export async function logoutWorkflow(): Promise<void> {
    const appSettings: AppSettings = await getAppSettings();
    await saveAppSettings({
        ...appSettings,
        accessToken: null,
        selectedTicketId: null,
        availableTickets: {},
        lastTicketSync: null,
    });
}

export async function refreshTicketsWorkflow({ forceRefresh }: { forceRefresh: boolean }): Promise<void> {
    const appSettings: AppSettings = await getAppSettings();
    if (!appSettings.accessToken) {
        throw new Error(getGlobalLL().workflowRefreshErrorNoAccessToken());
    }
    const ticketIds = await ticketIdsRequest();
    const existingTicketIds = Object.keys(appSettings.availableTickets);
    let fullTickets: Record<string, FullTicketDecoded>;
    if (
        forceRefresh ||
        ticketIds.length !== existingTicketIds.length ||
        !existingTicketIds.every((ticketId) => ticketIds.includes(ticketId))
    ) {
        fullTickets = await fullTicketsRequest(ticketIds);
    } else {
        // No need to refresh tickets
        fullTickets = appSettings.availableTickets;
    }
    let selectedTicketId = appSettings.selectedTicketId;
    if (selectedTicketId && !Object.keys(fullTickets).includes(selectedTicketId)) {
        selectedTicketId = null;
    }
    await saveAppSettings({
        ...appSettings,
        selectedTicketId,
        availableTickets: fullTickets,
        lastTicketSync: new Date().toUTCString(),
        ticketFetchLocale: getEffectiveLocale(),
    });
}

export const useValidTicket = (appSettings: AppSettings): [string, FullTicketDecoded] | string => {
    let selectedTicketKey: string | undefined;
    let selectedTicket: FullTicketDecoded | undefined;
    const now = new Date();
    if (appSettings.selectedTicketId !== null) {
        selectedTicketKey = appSettings.selectedTicketId;
        selectedTicket = appSettings.availableTickets[appSettings.selectedTicketId];
        if (selectedTicket === undefined) {
            return getGlobalLL().workflowValidTicketNoLongerAvailable();
        }
        const validityEnd = new Date(selectedTicket.metaDecoded.validity_end);
        if (validityEnd < now) {
            return getGlobalLL().workflowValidTicketExpired();
        }
    } else if (Object.keys(appSettings.availableTickets).length === 0) {
        return getGlobalLL().workflowValidTicketNoTickets();
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
