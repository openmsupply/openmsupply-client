import { UpdateSyncSettingsInput } from '@common/types';
import { Sdk } from './operations.generated';

export const getHostQueries = (sdk: Sdk) => ({
  get: {
    settings: async () => {
      const result = await sdk.serverSettings();
      return result?.serverSettings;
    },
    version: async () => {
      const result = await sdk.apiVersion();
      return result.apiVersion;
    },
  },
  update: {
    restart: async () => {
      const result = await sdk.serverRestart();
      return result?.serverRestart?.message || '';
    },
    syncSettings: async (settings: UpdateSyncSettingsInput) => {
      const result = await sdk.updateServerSettings({
        syncSettings: settings,
      });
      return result?.updateServerSettings;
    },
  },
});
