import { z, type ZodType } from 'zod';

import {
    FullTicket,
    type FullTicketDecoded,
    type LoginCredentials,
    TicketMetaDecoded,
    TicketTemplateDecoded,
} from '../types';
import { getGlobalLL } from '../util/getAndLoadLocale';
import { hmacSha512FromUtf8InputAsHex } from '../util/hashAlgorithms';
import { getRemoteConfig } from './remoteConfig';
import { getAppSettings } from './storage';

const HASH_DELIMITER = '|';

const API_SIGNATURE_KEY = 'X-Api-Signature';
const CONTENT_TYPE_DEFAULT = 'application/json';
// const CONTENT_TYPE_DEFAULT_WITH_CHARSET = 'application/json; charset=utf-8';
const CONTENT_TYPE_KEY = 'Content-Type';
const EOS_DATE_KEY = 'X-Eos-Date';
const USER_AGENT_KEY = 'User-Agent';
const AUTHORIZATION_KEY = 'Authorization';
const DEVICE_IDENTIFIER_KEY = 'Device-Identifier';

const TICKEOS_AUTHORIZATION_TYPE = 'TICKeos';

const compatibleAppVersions: Record<string, string> = {
    'SaarVV Android/2022.03': '3.10.17',
};

const setRequestSignature = async (
    applicationKey: string,
    url: URL,
    headers: Headers,
    body: string | null,
    requestDate: Date = new Date(),
) => {
    headers.set(EOS_DATE_KEY, requestDate.toUTCString());

    // const bodyHmac = createHmac('sha512', applicationKey, { encoding: 'utf-8' });
    // bodyHmac.update(body ?? '', 'utf-8');
    // const bodyHmacStr: string = bodyHmac.digest().toString('hex');
    const bodyHmacStr: string = await hmacSha512FromUtf8InputAsHex(body ?? '', applicationKey);

    let hashContent = bodyHmacStr + HASH_DELIMITER;
    hashContent += url.hostname + HASH_DELIMITER;
    hashContent += '443' + HASH_DELIMITER;
    const fullPath = url.pathname + url.search;
    hashContent += fullPath + HASH_DELIMITER;

    hashContent += headers.get(EOS_DATE_KEY) + HASH_DELIMITER;
    hashContent += (headers.get(CONTENT_TYPE_KEY) ?? '') + HASH_DELIMITER;
    hashContent += (headers.get(AUTHORIZATION_KEY) ?? '') + HASH_DELIMITER;
    hashContent += (headers.get('X-TICKeos-Anonymous') ?? '') + HASH_DELIMITER; // Header unsupported by this app
    hashContent += (headers.get('X-EOS-SSO') ?? '') + HASH_DELIMITER; // Header unsupported by this app
    hashContent += headers.get(USER_AGENT_KEY) ?? '';

    const fullHmacStr: string = await hmacSha512FromUtf8InputAsHex(hashContent, applicationKey);

    headers.set(API_SIGNATURE_KEY, fullHmacStr);
};

export const ticketBackendRequest = async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body: string | null,
    expectedResponseType: ZodType<T>,
): Promise<T> => {
    const appSettings = await getAppSettings();
    const { backendHost, backendRoute, applicationKey, mobileServiceAPIVersion, identifier, clientName } =
        await getRemoteConfig(appSettings.remote);
    const compatibleAppVersion = compatibleAppVersions[`${clientName}/${mobileServiceAPIVersion}`];
    const userAgent = `${clientName}/${compatibleAppVersion}/${mobileServiceAPIVersion}/${identifier} (ticket-sofort)`;

    const headers = new Headers({
        [CONTENT_TYPE_KEY]: CONTENT_TYPE_DEFAULT,
        [USER_AGENT_KEY]: userAgent,
        [DEVICE_IDENTIFIER_KEY]: appSettings.deviceIdentifier,
    });

    if (endpoint !== 'login' && appSettings.accessToken !== null) {
        headers.set(AUTHORIZATION_KEY, `${TICKEOS_AUTHORIZATION_TYPE} ${appSettings.accessToken}`);
    }

    const url = new URL(`https://${backendHost}${backendRoute}${endpoint}`);
    await setRequestSignature(applicationKey, url, headers, body);
    console.debug('Requesting', method, url.href);
    const response = await fetch(url, {
        method,
        headers,
        body,
    });
    console.debug('Received HTTP', response.status, response.statusText);

    const responseText = await response.text();
    let responseJson;
    if (response.headers.get(CONTENT_TYPE_KEY)?.startsWith('application/json')) {
        responseJson = JSON.parse(responseText);
    }
    if (!response.ok || responseJson === undefined) {
        console.error('Request failed:', responseText);
        if (responseJson !== undefined && typeof responseJson.message === 'string') {
            throw new Error(`${getGlobalLL().requestError()}: ${responseJson.message}`);
        } else {
            throw new Error(
                `${getGlobalLL().requestError()}: HTTP ${response.status}\n${JSON.stringify(responseJson ?? responseText, null, 2)}`,
            );
        }
    }
    const parsedResponse = expectedResponseType.safeParse(responseJson);
    if (!parsedResponse.success) {
        throw new Error(
            `${getGlobalLL().requestResponseSchemaError()}: ${JSON.stringify(parsedResponse.error, null, 2)}`,
        );
    }
    // console.debug('Returning', parsedResponse.data);
    return parsedResponse.data;
};

export const LoginResponse = z.object({
    authorization_types: z.tuple([
        z.object({
            name: z.literal('tickeos_access_token'),
            type: z.literal('header'),
            header: z.object({
                name: z.literal('Authorization'),
                type: z.literal(TICKEOS_AUTHORIZATION_TYPE),
                value: z.string().min(1),
            }),
        }),
    ]),
});
export const loginRequest = async ({ username, password }: LoginCredentials): Promise<string> => {
    console.debug('Logging in');
    const response = await ticketBackendRequest(
        'login',
        'POST',
        JSON.stringify({ credentials: { username, password } }),
        LoginResponse,
    );
    return response.authorization_types[0].header.value;
};

export const TicketIdsResponse = z.object({
    // "credits": z.array(), // no idea what these are for and I don't think we care for this app
    tickets: z.string().array(),
});
export const ticketIdsRequest = async (): Promise<string[]> => {
    console.debug('Requesting Ticket IDs');
    const response = await ticketBackendRequest('sync', 'POST', '{}', TicketIdsResponse);
    return response.tickets;
};

export const FullTicketsResponse = z.object({
    tickets: z.record(FullTicket),
});
export const fullTicketsRequest = async (ticketIds: string[]): Promise<Record<string, FullTicketDecoded>> => {
    console.debug('Requesting full tickets');
    const response = await ticketBackendRequest(
        'ticket',
        'POST',
        JSON.stringify({
            details: true,
            parameters: true,
            provide_aztec_content: true,
            tickets: ticketIds,
        }),
        FullTicketsResponse,
    );
    return Object.fromEntries(
        Object.entries(response.tickets).map(([id, ticket]) => [
            id,
            {
                ...ticket,
                metaDecoded: TicketMetaDecoded.parse(JSON.parse(ticket.meta)),
                templateDecoded: TicketTemplateDecoded.parse(JSON.parse(ticket.template)),
            },
        ]),
    );
};
