import React, { FC } from 'react';
import { BaseDatePickerInput } from '../BaseDatePickerInput';

interface DatePickerInputProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  disabled?: boolean;
}

export const DatePickerInput: FC<DatePickerInputProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <BaseDatePickerInput
      disabled={disabled}
      onChange={onChange}
      value={value}
    />
  );
};
