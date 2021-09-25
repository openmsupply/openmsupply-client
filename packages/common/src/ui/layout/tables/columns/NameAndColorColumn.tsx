import React, { useState } from 'react';
import { Color, ColorMenu, UnstyledIconButton } from '../../../components';
import { Circle } from '../../../icons';
import { Box } from '@mui/system';
import { DomainObject } from '../../../..';
import { ColumnDefinition } from '../columns/types';

interface DomainObjectWithRequiredFields extends DomainObject {
  color: string;
  name: string;
}

export const getNameAndColorColumn = <T extends DomainObjectWithRequiredFields>(
  onChange: (row: T, color: Color) => void
): ColumnDefinition<T> => ({
  label: 'label.name',
  width: 250,
  key: 'name',
  Cell: ({ rowData }: { rowData: T }) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <Box
        sx={{
          flexDirection: 'row',
          borderBottom: 'none',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <ColorMenu
          onClose={handleClose}
          anchorEl={anchorEl}
          onClick={color => {
            handleClose();
            onChange(rowData, color);
          }}
        />
        <UnstyledIconButton
          titleKey="button.select-a-color"
          icon={
            <Circle
              htmlColor={rowData.color}
              sx={{
                width: '12px',
                margin: 'margin: 0 9px 0 10px',
                overflow: 'visible',
                cursor: 'pointer',
              }}
            />
          }
          onClick={e => {
            e.stopPropagation();
            handleClick(e);
          }}
        />
        <Box ml={1} />
        {rowData.name}
      </Box>
    );
  },
});
