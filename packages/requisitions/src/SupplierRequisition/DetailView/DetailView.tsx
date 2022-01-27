import React, { FC } from 'react';
import {
  TableProvider,
  createTableStore,
  DetailViewSkeleton,
} from '@openmsupply-client/common';
import { useSupplierRequisition } from '../api';
import { Toolbar } from './Toolbar';
import { Footer } from './Footer';
import { AppBarButtons } from './AppBarButtons';
import { SidePanel } from './SidePanel';
import { isRequisitionEditable } from '../../utils';
import { ContentArea } from './ContentArea';

export const DetailView: FC = () => {
  const { data } = useSupplierRequisition();

  return !!data ? (
    <TableProvider createStore={createTableStore}>
      <AppBarButtons
        isDisabled={!isRequisitionEditable(data)}
        onAddItem={() => {}}
      />
      <Toolbar />
      <ContentArea />
      <Footer />
      <SidePanel />
    </TableProvider>
  ) : (
    <DetailViewSkeleton />
  );
};
