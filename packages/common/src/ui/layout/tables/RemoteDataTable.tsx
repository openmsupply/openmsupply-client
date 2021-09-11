/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';

import {
  SortingRule,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
  Row,
} from 'react-table';

import {
  Box,
  CircularProgress,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Table as MuiTable,
} from '@material-ui/core';

import { SortDesc } from '../../icons';
import { DEFAULT_PAGE_SIZE } from '.';
import { TableProps } from './types';
import { useSetupDataTableApi } from './hooks/useDataTableApi';
import { DataRow } from './components/DataRow/DataRow';

export { SortingRule };

export const RemoteDataTable = <T extends Record<string, unknown>>({
  columns,
  data = [],
  initialSortBy,
  isLoading = false,
  onFetchData,
  onRowClick,
  totalLength = 0,
  tableApi,
}: TableProps<T>): JSX.Element => {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = Math.ceil(totalLength / pageSize);
  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      manualSortBy: true,
      pageCount,
      initialState: {
        pageIndex,
        pageSize,
        sortBy: initialSortBy,
      },
    },
    useSortBy,
    usePagination,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = tableInstance;

  useSetupDataTableApi(tableApi, tableInstance);

  const gotoPage = (page: number) => setPageIndex(page);
  const refetch = () =>
    onFetchData({
      offset: pageIndex * pageSize,
      first: pageSize,
      sortBy,
    });

  useEffect(() => {
    refetch();
  }, [pageSize, pageIndex]);

  useEffect(() => {
    setPageIndex(0);
    refetch();
  }, [sortBy]);

  return isLoading ? (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <CircularProgress
        sx={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      />
    </Box>
  ) : (
    <TableContainer>
      <MuiTable stickyHeader {...getTableProps()}>
        <TableHead>
          {headerGroups.map(({ getHeaderGroupProps, headers }) => (
            <TableRow {...getHeaderGroupProps()}>
              {headers.map(column => {
                return (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    align={column.align}
                    padding={column.id === 'selection' ? 'checkbox' : 'normal'}
                    sx={{
                      backgroundColor: 'transparent',
                    }}
                    aria-label={column.id}
                    sortDirection={
                      column.isSorted
                        ? column.isSortedDesc
                          ? 'desc'
                          : 'asc'
                        : false
                    }
                  >
                    <TableSortLabel
                      hideSortIcon={column.id === 'selection'}
                      active={column.isSorted}
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                      IconComponent={SortDesc}
                    >
                      {column.render('Header')}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row: Row<T>) => {
            prepareRow(row);

            const { cells, values } = row;
            const { key } = row.getRowProps();

            return (
              <DataRow<T>
                cells={cells}
                values={values as T}
                key={key}
                onClick={onRowClick}
              />
            );
          })}

          <TableRow>
            <TablePagination
              page={pageIndex}
              rowsPerPage={pageSize}
              count={pageCount * pageSize}
              onPageChange={(_, i) => gotoPage(i)}
              onRowsPerPageChange={({ target: { value } }) =>
                setPageSize(Number(value))
              }
            />
          </TableRow>
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
