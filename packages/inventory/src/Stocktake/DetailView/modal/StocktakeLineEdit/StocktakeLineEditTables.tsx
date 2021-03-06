import React, { FC } from 'react';
import {
  TextInputCell,
  alpha,
  RecordPatch,
  DataTable,
  useColumns,
  CurrencyInputCell,
  useTranslation,
  getExpiryDateInputColumn,
  NonNegativeIntegerCell,
  PositiveNumberInputCell,
  CheckboxCell,
  ColumnDescription,
  Theme,
  useTheme,
} from '@openmsupply-client/common';
import { getLocationInputColumn } from '@openmsupply-client/system';
import { DraftStocktakeLine } from './utils';

interface StocktakeLineEditTableProps {
  isDisabled?: boolean;
  batches: DraftStocktakeLine[];
  update: (patch: RecordPatch<DraftStocktakeLine>) => void;
}

const expiryDateColumn = getExpiryDateInputColumn<DraftStocktakeLine>();

type DraftLineSetter = (
  patch: Partial<DraftStocktakeLine> & { id: string }
) => void;

const getBatchColumn = (
  setter: DraftLineSetter,
  theme: Theme
): ColumnDescription<DraftStocktakeLine> =>
  [
    'batch',
    {
      accessor: ({ rowData }) =>
        rowData.countThisLine ? rowData.batch ?? '' : '',
      width: 150,
      maxWidth: 150,
      maxLength: 50,
      Cell: TextInputCell,
      setter: patch => setter({ ...patch, countThisLine: true }),
      backgroundColor: alpha(theme.palette.background.menu, 0.4),
    },
  ] as ColumnDescription<DraftStocktakeLine>;

const getCountThisLineColumn = (
  setter: DraftLineSetter,
  theme: Theme
): ColumnDescription<DraftStocktakeLine> => {
  return {
    key: 'countThisLine',
    label: 'label.count-this-line',
    width: 100,
    Cell: CheckboxCell,
    setter: patch => setter({ ...patch }),
    backgroundColor: alpha(theme.palette.background.menu, 0.4),
  };
};

export const BatchTable: FC<StocktakeLineEditTableProps> = ({
  batches,
  update,
  isDisabled = false,
}) => {
  const t = useTranslation('inventory');
  const theme = useTheme();

  const columns = useColumns<DraftStocktakeLine>([
    getCountThisLineColumn(update, theme),
    getBatchColumn(update, theme),
    {
      key: 'snapshotNumberOfPacks',
      label: 'label.num-packs',
      width: 100,
      accessor: ({ rowData }) =>
        rowData.countThisLine ? rowData.snapshotNumberOfPacks : '',
      setter: patch => update({ ...patch, countThisLine: true }),
    },
    {
      key: 'packSize',
      label: 'label.pack-size',
      width: 125,
      accessor: ({ rowData }) =>
        rowData.countThisLine ? rowData.packSize : '',
      Cell: PositiveNumberInputCell,
      setter: patch => update({ ...patch, countThisLine: true }),
    },
    {
      key: 'countedNumberOfPacks',
      label: 'label.counted-num-of-packs',
      width: 100,
      accessor: ({ rowData }) =>
        rowData.countThisLine ? rowData.countedNumberOfPacks : '',
      Cell: NonNegativeIntegerCell,
      setter: patch => update({ ...patch, countThisLine: true }),
    },
    [
      expiryDateColumn,
      {
        width: 100,
        accessor: ({ rowData }) =>
          rowData.countThisLine ? rowData.expiryDate : null,
        setter: patch => update({ ...patch, countThisLine: true }),
      },
    ],
  ]);

  return (
    <DataTable
      isDisabled={isDisabled}
      columns={columns}
      data={batches}
      noDataMessage={t('label.add-new-line')}
      dense
    />
  );
};

export const PricingTable: FC<StocktakeLineEditTableProps> = ({
  batches,
  update,
  isDisabled,
}) => {
  const theme = useTheme();
  const t = useTranslation('inventory');
  const columns = useColumns<DraftStocktakeLine>([
    getCountThisLineColumn(update, theme),
    getBatchColumn(update, theme),
    [
      'sellPricePerPack',
      {
        Cell: CurrencyInputCell,
        width: 200,
        accessor: ({ rowData }) =>
          rowData.countThisLine ? rowData.sellPricePerPack : '',
        setter: patch => update({ ...patch, countThisLine: true }),
      },
    ],
    [
      'costPricePerPack',
      {
        Cell: CurrencyInputCell,
        width: 200,
        accessor: ({ rowData }) =>
          rowData.countThisLine ? rowData.costPricePerPack : '',
        setter: patch => update({ ...patch, countThisLine: true }),
      },
    ],
  ]);

  return (
    <DataTable
      isDisabled={isDisabled}
      columns={columns}
      data={batches}
      noDataMessage={t('label.add-new-line')}
      dense
    />
  );
};

export const LocationTable: FC<StocktakeLineEditTableProps> = ({
  batches,
  update,
  isDisabled,
}) => {
  const theme = useTheme();
  const t = useTranslation('inventory');
  const columns = useColumns<DraftStocktakeLine>([
    getCountThisLineColumn(update, theme),
    getBatchColumn(update, theme),
    [
      getLocationInputColumn(),
      {
        width: 400,
        setter: patch => update({ ...patch, countThisLine: true }),
        accessor: ({ rowData }) =>
          rowData.countThisLine ? rowData.location : null,
      },
    ],
  ]);

  return (
    <DataTable
      isDisabled={isDisabled}
      columns={columns}
      data={batches}
      noDataMessage={t('label.add-new-line')}
      dense
    />
  );
};
