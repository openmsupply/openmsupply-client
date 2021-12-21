import {
  getRowExpandColumn,
  GenericColumnKey,
  getSumOfKeyReducer,
  getUnitQuantity,
  getNotePopoverColumn,
  ifTheSameElseDefault,
  useColumns,
  Column,
} from '@openmsupply-client/common';
import { InvoiceLine, InboundShipmentItem } from './../../types';

export const useInboundShipmentColumns = (): Column<
  InvoiceLine | InboundShipmentItem
>[] =>
  useColumns<InvoiceLine | InboundShipmentItem>(
    [
      {
        ...getNotePopoverColumn(),
        accessor: ({ rowData }) => {
          if ('lines' in rowData) {
            return rowData.lines[0].note;
          } else {
            return rowData.note;
          }
        },
      },
      [
        'itemCode',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'itemCode', '');
            } else {
              return rowData.itemCode;
            }
          },
        },
      ],
      [
        'itemName',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'itemName', '');
            } else {
              return rowData.itemName;
            }
          },
        },
      ],
      [
        'batch',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'batch', '[multiple]');
            } else {
              return rowData.batch;
            }
          },
        },
      ],
      [
        'expiryDate',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'expiryDate', '');
            } else {
              return rowData.expiryDate;
            }
          },
        },
      ],
      [
        'locationName',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'locationName', '');
            } else {
              return rowData?.locationName;
            }
          },
        },
      ],
      [
        'sellPricePerPack',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'sellPricePerPack', '');
            } else {
              return rowData.sellPricePerPack;
            }
          },
        },
      ],
      [
        'packSize',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return ifTheSameElseDefault(lines, 'packSize', '');
            } else {
              return rowData.packSize;
            }
          },
        },
      ],
      [
        'unitQuantity',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return lines.reduce(getUnitQuantity, 0);
            } else {
              return rowData.packSize * rowData.numberOfPacks;
            }
          },
        },
      ],
      [
        'numberOfPacks',
        {
          accessor: ({ rowData }) => {
            if ('lines' in rowData) {
              const { lines } = rowData;
              return lines.reduce(getSumOfKeyReducer('numberOfPacks'), 0);
            } else {
              return rowData.numberOfPacks;
            }
          },
        },
      ],
      getRowExpandColumn(),
      GenericColumnKey.Selection,
    ],
    {},
    []
  );