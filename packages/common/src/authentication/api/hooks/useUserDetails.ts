import { UserNode } from '@common/types';
import { useMutation, useQuery } from 'react-query';
import { useAuthApi } from './useAuthApi';

export const useUserDetails = () => {
  const api = useAuthApi();
  return useMutation<
    UserNode | undefined,
    unknown,
    string | undefined,
    unknown
  >(api.get.me);
};

export const useUserStores = (token: string) => {
  const api = useAuthApi();
  return useQuery(api.keys.me(token), api.get.stores(), {
    cacheTime: 0,
    enabled: !!token,
  });
};
