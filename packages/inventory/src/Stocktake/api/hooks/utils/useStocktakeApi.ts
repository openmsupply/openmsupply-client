import { useGql, useAuthContext, SortBy } from '@openmsupply-client/common';
import { getStocktakeQueries, ListParams } from '../../api';
import { getSdk, StocktakeRowFragment } from '../../operations.generated';

export const useStocktakeApi = () => {
  const keys = {
    base: () => ['stocktake'] as const,
    detail: (id: string) => [...keys.base(), storeId, id] as const,
    list: () => [...keys.base(), storeId, 'list'] as const,
    paramList: (params: ListParams) => [...keys.list(), params] as const,
    sortedList: (sortBy: SortBy<StocktakeRowFragment>) =>
      [...keys.list(), sortBy] as const,
  };

  const { client } = useGql();
  const { storeId } = useAuthContext();
  const queries = getStocktakeQueries(getSdk(client), storeId);
  return { ...queries, storeId, keys };
};
