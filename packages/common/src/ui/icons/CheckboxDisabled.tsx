import React from 'react';
import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

export const CheckboxDisabled = (props: SvgIconProps): JSX.Element => {
  const combinedProps: SvgIconProps = { color: 'primary', ...props };
  return (
    <SvgIcon {...combinedProps} viewBox="3 3 20 20">
      <path d="M17,4H7A3,3,0,0,0,4,7V17a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V7A3,3,0,0,0,17,4Zm-1,9H8a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2Z" />
    </SvgIcon>
  );
};
