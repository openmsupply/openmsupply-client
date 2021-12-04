import React, { FC } from 'react';
import {
  DataTable,
  useColumns,
  TextInputCell,
  getLineLabelColumn,
  NumberInputCell,
  CurrencyInputCell,
} from '@openmsupply-client/common';
import { StocktakeLine } from '../../../../types';

export const BatchTable: FC<{ batches: StocktakeLine[] }> = ({ batches }) => {
  const columns = useColumns<StocktakeLine>([
    getLineLabelColumn(),
    ['batch', { Cell: TextInputCell, width: 200 }],
    {
      key: 'snapshotNumPacks',
      label: 'label.num-packs',
      width: 100,
    },
    {
      key: 'snapshotPackSize',
      label: 'label.pack-size',
      width: 100,
    },
    {
      key: 'countedNumPacks',
      label: 'label.counted-num-of-packs',
      width: 100,
      Cell: NumberInputCell,
    },
    'expiryDate',
  ]);

  return (
    <DataTable
      columns={columns}
      data={batches}
      noDataMessage="Add a new line"
      dense
    />
  );
};

export const PricingTable: FC<{ batches: StocktakeLine[] }> = ({ batches }) => {
  const columns = useColumns<StocktakeLine>([
    getLineLabelColumn(),
    ['batch', { Cell: TextInputCell, width: 200 }],
    ['sellPricePerPack', { Cell: CurrencyInputCell, width: 100 }],
    ['costPricePerPack', { Cell: CurrencyInputCell, width: 100 }],
  ]);

  return (
    <DataTable
      columns={columns}
      data={batches}
      noDataMessage="Add a new line"
      dense
    />
  );
};
