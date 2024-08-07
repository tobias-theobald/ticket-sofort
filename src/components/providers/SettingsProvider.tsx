import { useMutation, useQuery } from '@tanstack/react-query';
import { createContext, type PropsWithChildren, useCallback, useContext, useMemo } from 'react';

import { getAppSettings, resetAppSettings, saveAppSettings } from '../../services/storage';
import { loginWorkflow, logoutWorkflow, refreshTicketsWorkflow } from '../../services/workflows';
import type { AppSettings } from '../../types';
import { FullPageSpinner } from '../FullPageSpinner';

export type SettingsContext = {
    appSettings: AppSettings;

    saveAppSettings: (settings: AppSettings) => void;
    saveAppSettingsLoading: boolean;
    saveAppSettingsError: string | null;

    doLogin: () => void;
    doLogout: () => void;
    doRefreshTickets: () => void;
    doLoginLoading: boolean;

    loginStatus: boolean | string;

    doResetAppSettings: () => void;
};

export const SettingsContext = createContext<SettingsContext>({} as SettingsContext);

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const getSettingQuery = useQuery({
        queryKey: ['settings'],
        queryFn: getAppSettings,
    });

    const resetSettingsMutation = useMutation({
        mutationFn: resetAppSettings,
        onSuccess: () => {
            getSettingQuery.refetch().catch(console.error);
        },
    });

    const refetchAppSettings = useCallback(() => {
        getSettingQuery.refetch().catch(console.error);
    }, [getSettingQuery]);

    const saveSettingsMutation = useMutation({
        mutationFn: saveAppSettings,
        onSuccess: refetchAppSettings,
    });

    const doLoginMutation = useMutation({
        mutationFn: loginWorkflow,
        onSuccess: refetchAppSettings,
    });
    const doLogoutMutation = useMutation({
        mutationFn: logoutWorkflow,
        onSuccess: refetchAppSettings,
    });
    const doRefreshTicketsMutation = useMutation({
        mutationFn: refreshTicketsWorkflow,
        onSuccess: refetchAppSettings,
    });

    const contextData = useMemo<SettingsContext>(
        () => ({
            appSettings: getSettingQuery.data ?? ({} as AppSettings),

            saveAppSettings: saveSettingsMutation.mutate,
            saveAppSettingsError: saveSettingsMutation.error?.message ?? null,
            saveAppSettingsLoading: saveSettingsMutation.isPending,

            doLogin: doLoginMutation.mutate,
            doLogout: doLogoutMutation.mutate,
            doRefreshTickets: doRefreshTicketsMutation.mutate,
            doLoginLoading: doLoginMutation.isPending || doRefreshTicketsMutation.isPending,

            loginStatus: doLoginMutation.error?.message ?? getSettingQuery.data?.accessToken !== null,
            doResetAppSettings: resetSettingsMutation.mutate,
        }),
        [
            doLoginMutation.error?.message,
            doLoginMutation.isPending,
            doLoginMutation.mutate,
            doLogoutMutation.mutate,
            doRefreshTicketsMutation.isPending,
            doRefreshTicketsMutation.mutate,
            getSettingQuery.data,
            resetSettingsMutation.mutate,
            saveSettingsMutation.error?.message,
            saveSettingsMutation.isPending,
            saveSettingsMutation.mutate,
        ],
    );

    if (!getSettingQuery.data) {
        return <FullPageSpinner />;
    }

    return <SettingsContext.Provider value={contextData}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
