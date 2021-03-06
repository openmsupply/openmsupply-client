import React from 'react';
import {
  Box,
  HomeIcon,
  styled,
  Typography,
  useAuthContext,
  UserIcon,
} from '@openmsupply-client/common';
import { StoreSelector } from './StoreSelector';

export const Footer: React.FC = () => {
  const { user, store } = useAuthContext();
  const PaddedCell = styled(Box)({ display: 'flex' });
  const iconStyles = { color: 'gray.main', height: '16px', width: '16px' };
  const textStyles = {
    color: 'gray.main',
    fontSize: '12px',
    marginInlineStart: '8px',
  };

  return (
    <Box gap={2} display="flex" flex={1} alignItems="center">
      <StoreSelector>
        <PaddedCell>
          <HomeIcon sx={iconStyles} />
          <Typography sx={textStyles}>{store?.code}</Typography>
        </PaddedCell>
      </StoreSelector>
      {user ? (
        <PaddedCell>
          <UserIcon sx={iconStyles} />
          <Typography sx={textStyles}>{user.name}</Typography>
        </PaddedCell>
      ) : null}
    </Box>
  );
};
