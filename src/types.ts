import { z } from 'zod';

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
export type FullTicketDecoded = z.infer<typeof FullTicket> & {
    metaDecoded: TicketMetaDecoded;
    templateDecoded: TicketTemplateDecoded;
};

export type AppSettings = {
    email: string;
    password: string;
    deviceIdentifier: string;
    accessToken: string | null;
    availableTickets: Record<string, FullTicketDecoded>;
    lastTicketSync: string | null;
    selectedTicketId: string | null;
};

export type RemoteSettings = {
    backendHost: string;
    applicationKey: string;
    backendRoute: string;
    clientName: string;
    mobileServiceAPIVersion: string;
    identifier: string;
};
