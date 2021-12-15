import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface DividerProps extends BoxProps {
  margin?: number;
}

export const Divider: React.FC<DividerProps> = ({ margin = 0, sx }) => (
  <>
    <Box sx={{ height: `${margin}px` }} />
    <Box
      sx={{
        backgroundColor: 'divider',
        height: '1px',
        width: '100%',
        ...sx,
      }}
    />
    <Box sx={{ height: `${margin}px` }} />
  </>
);
