import * as productionInstance from '../../assets/productionInstance.json';
import type { RemoteSettings } from '../types';

export const getRemoteSettings = async (): Promise<RemoteSettings> => {
    return productionInstance;
};
