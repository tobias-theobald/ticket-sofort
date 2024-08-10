import * as remoteConfigSaarvv from '../../assets/remoteConfigs/saarvv.json';
import { Remote, type RemoteConfig } from '../types';

export const getRemoteConfig = async (remote: Remote): Promise<RemoteConfig> => {
    if (remote !== Remote.enum.saarvv) {
        throw new Error('Unknown remote');
    }
    return remoteConfigSaarvv;
};
