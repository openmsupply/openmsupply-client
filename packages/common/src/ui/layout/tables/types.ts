import { ReactNode } from 'react';
import { LocaleKey } from '@openmsupply-client/common/src/intl/intlHelpers';
import { ObjectWithStringKeys, DomainObject } from './../../../types';
import { Pagination } from '../../../hooks/usePagination';
import { SortBy, SortRule } from '../../../hooks/useSortBy';
import { Column } from './columns/types';

export interface QueryProps<D extends ObjectWithStringKeys> {
  first: number;
  offset: number;
  sortBy?: SortRule<D>[];
}

export interface QueryResponse<T> {
  data: T[];
  totalLength: number;
}

export interface TableProps<T extends DomainObject> {
  columns: Column<T>[];
  data?: T[];
  sortBy: SortBy<T>;
  isLoading?: boolean;
  pagination: Pagination & { total?: number };
  onChangePage: (page: number) => void;
  onRowClick?: (row: T) => void;
  children?: ReactNode;
  noDataMessageKey?: LocaleKey;
}
