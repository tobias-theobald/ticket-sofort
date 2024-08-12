import { getRandomBytes } from 'expo-crypto';
import { z } from 'zod';

import type { Locales } from './i18n/i18n-types';
import { locales } from './i18n/i18n-util';
import { encode } from './util/hashAlgorithms';

export const FullTicket = z.object({
    certificate: z.string(),
    meta: z.string(),
    meta_signature: z.string(),
    template: z.string(),
    template_signature: z.string(),
});
export const TicketMetaDecoded = z.object({
    title: z.string(),
    validity_begin: z.string(),
    validity_end: z.string(),
});
export type TicketMetaDecoded = z.infer<typeof TicketMetaDecoded>;
export const TicketHeaderElement = z.union([
    z.object({
        type: z.literal('color'),
        color: z.string(),
    }),
    z.object({
        type: z.literal('image'),
        key: z.string(),
    }),
    z.object({
        type: z.literal('gyroscope_image'),
        key: z.string(),
    }),
    z.object({
        type: z.literal('analog_clock'),
        color: z.string(),
    }),
    z.object({
        type: z.literal('text'),
        text: z.string(),
        color: z.string(),
        size: z.number().positive(),
        bold: z.boolean(),
    }),
]);
export type TicketHeaderElement = z.infer<typeof TicketHeaderElement>;
export const TicketTemplateDecoded = z.object({
    content: z.object({
        header: z.object({
            background_colors: z.string(),
            global: z.object({
                background: TicketHeaderElement,
                bottom: TicketHeaderElement,
                left: TicketHeaderElement,
                right: TicketHeaderElement,
                top: TicketHeaderElement,
            }),
        }),
        images: z.record(z.string()),
        pages: z.string().array(),
        styles: z.object({
            global: z.string(),
        }),
    }),
});
export type TicketTemplateDecoded = z.infer<typeof TicketTemplateDecoded>;

export const FullTicketDecoded = FullTicket.extend({
    metaDecoded: TicketMetaDecoded,
    templateDecoded: TicketTemplateDecoded,
});
export type FullTicketDecoded = z.infer<typeof FullTicketDecoded>;

export const Remote = z.enum(['saarvv']);
export type Remote = z.infer<typeof Remote>;

export const remoteDisplayName: Record<Remote, string> = {
    [Remote.enum.saarvv]: 'SaarVV',
};

export const AppSettings = z.object({
    remote: Remote.default(Remote.enum.saarvv),
    username: z.string().default(''),
    deviceIdentifier: z.string().default(() => encode(getRandomBytes(20), 'hex')),
    accessToken: z.string().nullable().default(null),
    availableTickets: z.record(FullTicketDecoded).default({}),
    lastTicketSync: z.string().nullable().default(null),
    selectedTicketId: z.string().nullable().default(null),
    ticketFetchLocale: z
        .enum(locales as [Locales, ...Locales[]])
        .nullable()
        .default(null),
});
export type AppSettings = z.infer<typeof AppSettings>;

export type RemoteConfig = {
    backendHost: string;
    applicationKey: string;
    backendRoute: string;
    clientName: string;
    mobileServiceAPIVersion: string;
    identifier: string;
};

export type LoginCredentials = {
    username: string;
    password: string;
};
