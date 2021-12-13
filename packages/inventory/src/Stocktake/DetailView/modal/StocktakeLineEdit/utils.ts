import { generateUUID } from '@openmsupply-client/common';
import { createStocktakeItem } from '../../reducer';

import { StocktakeItem, StocktakeLine } from './../../../../types';

export const createStocktakeRow = (
  stocktakeItem: StocktakeItem,
  seed?: StocktakeLine
): StocktakeLine => {
  const id = generateUUID();
  const row = {
    id,
    batch: '',
    costPricePerPack: 0,
    sellPricePerPack: 0,
    expiryDate: undefined,
    itemId: stocktakeItem.id,
    itemCode: stocktakeItem.itemCode(),
    itemName: stocktakeItem.itemName(),
    snapshotNumPacks: undefined,
    snapshotPackSize: undefined,
    countedNumPacks: undefined,
    isCreated: !seed,
    isUpdated: false,
    isDeleted: false,
    countThisLine: true,
    ...seed,
    update: (key: string, value: string) => {
      if (key === 'batch') {
        row.batch = value;
        row.countThisLine = true;
      }
      if (key === 'countedNumPacks') {
        row.countedNumPacks = Number(value);
        row.countThisLine = true;
      }

      if (key === 'costPricePerPack') {
        row.costPricePerPack = Number(value);
        row.countThisLine = true;
      }
      if (key === 'sellPricePerPack') {
        row.sellPricePerPack = Number(value);
        row.countThisLine = true;
      }

      if (key === 'countThisLine') {
        const countThisLine = value === 'true';
        row.countThisLine = countThisLine;
      }

      row.isUpdated = true;

      stocktakeItem.upsertLine?.(row);
    },
  };

  return row;
};

export const wrapStocktakeItem = (
  seed: StocktakeItem,
  updater: (item: StocktakeItem | null) => void
): StocktakeItem => {
  const wrapped = {
    ...seed,
    upsertLine: (line: StocktakeLine) => {
      const updatedLines = [...seed.lines];
      const idx = updatedLines.findIndex(l => l.id === line.id);
      if (idx !== -1) {
        updatedLines[idx] = line;
      } else {
        updatedLines.push(line);
      }

      const updatedItem = createStocktakeItem(seed.id, updatedLines);
      updatedItem.upsertLine = seed.upsertLine;

      updater(updatedItem);
    },
  };

  const lines = seed.lines.map(batch => createStocktakeRow(wrapped, batch));

  return { ...wrapped, lines };
};