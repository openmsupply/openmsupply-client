import React, { FC, useEffect, useRef } from 'react';

import {
  useNotification,
  InvoiceRow,
  DropdownMenu,
  DropdownMenuItem,
  useTranslation,
  DeleteIcon,
  useTableStore,
  AppBarContentPortal,
} from '@openmsupply-client/common';

export const Toolbar: FC<{
  onDelete: (toDelete: InvoiceRow[]) => void;
  data?: InvoiceRow[];
}> = ({ onDelete, data }) => {
  const t = useTranslation();

  const { success, info } = useNotification();

  const { selectedRows } = useTableStore(state => ({
    selectedRows: Object.keys(state.rowState)
      .filter(id => state.rowState[id]?.isSelected)
      .map(selectedId => data?.find(({ id }) => selectedId === id))
      .filter(Boolean) as InvoiceRow[],
  }));

  const deleteAction = () => {
    if (selectedRows && selectedRows?.length > 0) {
      onDelete(selectedRows);
      success(`Deleted ${selectedRows?.length} invoices`)();
    } else {
      info('Select rows to delete them')();
    }
  };

  const ref = useRef(deleteAction);

  useEffect(() => {
    ref.current = deleteAction;
  }, [selectedRows]);

  return (
    <AppBarContentPortal sx={{ paddingBottom: '16px' }}>
      <DropdownMenu label="Select">
        <DropdownMenuItem IconComponent={DeleteIcon} onClick={deleteAction}>
          {t('button.delete-lines')}
        </DropdownMenuItem>
      </DropdownMenu>
    </AppBarContentPortal>
  );
};