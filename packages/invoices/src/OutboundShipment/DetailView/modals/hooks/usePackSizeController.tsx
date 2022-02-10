import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  useTranslation,
  ifTheSameElseDefault,
} from '@openmsupply-client/common';
import { DraftOutboundLine } from '../../../../types';

export type PackSizeController = ReturnType<typeof usePackSizeController>;

const distinctSortedPackSizes = (lines: DraftOutboundLine[]): number[] =>
  Array.from(
    new Set(
      lines
        .filter(
          ({ onHold, availableNumberOfPacks }) =>
            availableNumberOfPacks > 0 && !onHold
        )
        .reduce((sizes, { packSize }) => [...sizes, packSize], [] as number[])
        .sort((a: number, b: number) => a - b)
    )
  );

const usePackSizes = (
  lines: DraftOutboundLine[]
): { options: { label: string; value: number }[]; packSizes: number[] } => {
  const t = useTranslation('distribution');
  const packSizes = useMemo(() => distinctSortedPackSizes(lines), [lines]);

  const options = useMemo(() => {
    const anySize: { label: string; value: number }[] = [];
    if (packSizes.length > 1) {
      anySize.push({ label: t('label.any'), value: -1 });
    }
    return anySize.concat(
      packSizes.map(packSize => ({
        label: String(packSize),
        value: packSize,
      }))
    );
  }, [packSizes]);

  return { options, packSizes };
};

export const usePackSizeController = (lines: DraftOutboundLine[]) => {
  const { options, packSizes } = usePackSizes(lines);

  const [selected, setSelected] = useState<
    | {
        label: string;
        value: number;
      }
    | undefined
  >();

  const setPackSize = useCallback(
    (newValue: number) => {
      const packSizeOption = options.find(({ value }) => value === newValue);
      if (!packSizeOption) return;
      setSelected(packSizeOption);
    },
    [options, setSelected]
  );

  useEffect(() => {
    // When selected is null, set a default value - either
    // 'any' when there are multiple unique pack sizes
    // in the set of options, or the only option if there is only
    // one.
    if (selected) return;
    const selectedPackSize = ifTheSameElseDefault(options, 'value', -1);
    setPackSize(selectedPackSize);
  }, [options, setPackSize, selected]);

  return { selected, setPackSize, options, packSizes };
};
