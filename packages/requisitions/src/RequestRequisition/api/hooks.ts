import { useMemo } from 'react';
import {
  useConfirmationModal,
  useAuthContext,
  useTranslation,
  useQueryParams,
  useQueryClient,
  useNavigate,
  useMutation,
  useParams,
  useOmSupplyApi,
  UseQueryResult,
  useQuery,
  FieldSelectorControl,
  useFieldsSelector,
  SortController,
  useSortBy,
  getDataSorter,
  useNotification,
  useTableStore,
  RequisitionNodeStatus,
} from '@openmsupply-client/common';
import { MasterListRowFragment } from '@openmsupply-client/system';
import { getRequestQueries, ListParams } from './api';
import {
  getSdk,
  RequestFragment,
  RequestLineFragment,
  RequestRowFragment,
} from './operations.generated';

export const useRequestApi = () => {
  const keys = {
    base: () => ['request'] as const,
    detail: (id: string) => [...keys.base(), storeId, id] as const,
    list: () => [...keys.base(), storeId, 'list'] as const,
    paramList: (params: ListParams) => [...keys.list(), params] as const,
  };

  const { client } = useOmSupplyApi();
  const { storeId } = useAuthContext();
  const queries = getRequestQueries(getSdk(client), storeId);
  return { ...queries, storeId, keys };
};

export const useRequests = () => {
  const queryParams = useQueryParams<RequestRowFragment>({
    initialSortBy: { key: 'otherPartyName' },
  });
  const api = useRequestApi();

  return {
    ...useQuery(api.keys.paramList(queryParams), () =>
      api.get.list({
        first: queryParams.first,
        offset: queryParams.offset,
        sortBy: queryParams.sortBy,
        filterBy: queryParams.filter.filterBy,
      })
    ),
    ...queryParams,
  };
};

const useRequestNumber = () => {
  const { requisitionNumber = '' } = useParams();
  return requisitionNumber;
};

export const useInsertRequest = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const api = useRequestApi();
  return useMutation(api.insert, {
    onSuccess: ({ requisitionNumber }) => {
      navigate(String(requisitionNumber));
      queryClient.invalidateQueries(api.keys.base());
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();
  const api = useRequestApi();
  return useMutation(api.update, {
    onSuccess: () => queryClient.invalidateQueries(api.keys.base()),
  });
};

export const useRequest = (): UseQueryResult<RequestFragment> => {
  const requestNumber = useRequestNumber();
  const api = useRequestApi();
  return useQuery(api.keys.detail(requestNumber), () =>
    api.get.byNumber(requestNumber)
  );
};

export const useRequestFields = <
  KeyOfRequisition extends keyof RequestFragment
>(
  keys: KeyOfRequisition | KeyOfRequisition[]
): FieldSelectorControl<RequestFragment, KeyOfRequisition> => {
  const { data } = useRequest();
  const requestNumber = useRequestNumber();
  const api = useRequestApi();
  return useFieldsSelector(
    api.keys.detail(requestNumber),
    () => api.get.byNumber(requestNumber),

    (patch: Partial<RequestFragment>) =>
      api.update({ ...patch, id: data?.id ?? '' }),
    keys
  );
};

interface UseRequestRequisitionLinesController
  extends SortController<RequestLineFragment> {
  lines: RequestLineFragment[];
}

export const useRequestLines = (): UseRequestRequisitionLinesController => {
  const { sortBy, onChangeSortBy } = useSortBy<RequestLineFragment>({
    key: 'itemName',
    isDesc: false,
  });

  const { lines } = useRequestFields('lines');

  const sorted = useMemo(() => {
    return (
      lines?.nodes.sort(
        getDataSorter(sortBy.key as keyof RequestLineFragment, !!sortBy.isDesc)
      ) ?? []
    );
  }, [sortBy, lines]);

  return { lines: sorted, sortBy, onChangeSortBy };
};

export const useIsRequestDisabled = (): boolean => {
  const { status } = useRequestFields('status');
  return (
    status === RequisitionNodeStatus.Finalised ||
    status === RequisitionNodeStatus.Sent
  );
};

export const useSaveRequestLines = () => {
  const requestNumber = useRequestNumber();
  const queryClient = useQueryClient();
  const api = useRequestApi();

  return useMutation(api.upsertLine, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.detail(requestNumber));
    },
  });
};

export const useDeleteRequests = () => {
  const queryClient = useQueryClient();
  const api = useRequestApi();
  return useMutation(api.deleteRequests, {
    onSuccess: () => queryClient.invalidateQueries(api.keys.base()),
  });
};

export const useDeleteSelectedRequisitions = () => {
  const { data: rows } = useRequests();
  const { mutate } = useDeleteRequests();
  const t = useTranslation('replenishment');

  const { success, info } = useNotification();

  const { selectedRows } = useTableStore(state => ({
    selectedRows: Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => rows?.nodes?.find(({ id }) => selectedId === id))
      .filter(Boolean) as RequestRowFragment[],
  }));

  const deleteAction = () => {
    const numberSelected = selectedRows.length;
    if (selectedRows && numberSelected > 0) {
      const canDeleteRows = selectedRows.every(
        ({ status }) => status === RequisitionNodeStatus.Draft
      );
      if (!canDeleteRows) {
        const cannotDeleteSnack = info(t('messages.cant-delete-requisitions'));
        cannotDeleteSnack();
      } else {
        mutate(selectedRows);
        const deletedMessage = t('messages.deleted-requisitions', {
          number: numberSelected,
        });
        const successSnack = success(deletedMessage);
        successSnack();
      }
    } else {
      const selectRowsSnack = info(t('messages.select-rows-to-delete'));
      selectRowsSnack();
    }
  };

  return deleteAction;
};

export const useAddFromMasterList = () => {
  const { error } = useNotification();
  const queryClient = useQueryClient();
  const { id: requestId, requisitionNumber } = useRequestFields([
    'id',
    'requisitionNumber',
  ]);
  const api = useRequestApi();
  const mutationState = useMutation(api.addFromMasterList, {
    onSettled: () =>
      queryClient.invalidateQueries(api.keys.detail(String(requisitionNumber))),
  });

  const t = useTranslation('distribution');
  const getConfirmation = useConfirmationModal({
    title: t('heading.are-you-sure'),
    message: t('message.confirm-add-from-master-list'),
  });

  const addFromMasterList = async ({
    id: masterListId,
  }: MasterListRowFragment) => {
    getConfirmation({
      onConfirm: () =>
        mutationState.mutate(
          { masterListId, requestId },
          {
            onError: e => {
              const { message } = e as Error;
              switch (message) {
                case 'CannotEditRequisition': {
                  return error('Cannot edit requisition')();
                }
                case 'RecordNotFound': {
                  return error('This master list has been deleted!')();
                }
                case 'MasterListNotFoundForThisStore': {
                  return error(
                    "Uh oh this is not the master list you're looking for"
                  )();
                }
                default:
                  return error('Could not add items to requisition')();
              }
            },
          }
        ),
    });
  };

  return { ...mutationState, addFromMasterList };
};

export const useDeleteRequestLines = () => {
  const { success, info } = useNotification();
  const { lines } = useRequestLines();
  const api = useRequestApi();
  const requestNumber = useRequestNumber();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(api.deleteLines, {
    onSettled: () =>
      queryClient.invalidateQueries(api.keys.detail(requestNumber)),
  });
  const t = useTranslation('distribution');

  const selectedRows = useTableStore(state =>
    lines.filter(({ id }) => state.rowState[id]?.isSelected)
  );

  const onDelete = async () => {
    const number = selectedRows?.length;
    if (selectedRows && number) {
      mutate(selectedRows, {
        onSuccess: success(t('messages.deleted-lines', { number: number })),
      });
    } else {
      info(t('label.select-rows-to-delete-them'))();
    }
  };

  return { onDelete };
};
