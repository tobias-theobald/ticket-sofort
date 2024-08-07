import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, useState } from 'react';

export const ReactQueryClientProvider = ({ children }: PropsWithChildren) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    mutations: {
                        onError: (error, _variables, context) => {
                            console.error('Mutation error:', context, error);
                        },
                    },
                },
            }),
    );
    useReactQueryDevTools(queryClient);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
