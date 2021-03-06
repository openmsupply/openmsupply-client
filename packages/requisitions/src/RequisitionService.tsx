import React, { FC } from 'react';

import {
  ListView as RequestRequisitionListView,
  DetailView as RequestRequisitionDetailView,
} from './RequestRequisition';
import {
  ListView as ResponseRequisitionListView,
  DetailView as ResponseRequisitionDetailView,
} from './ResponseRequisition';
import { RouteBuilder, Routes, Route } from '@openmsupply-client/common';
import { AppRoute } from '@openmsupply-client/config';

const customerRequisitionsRoute = RouteBuilder.create(
  AppRoute.CustomerRequisition
).build();
const customerRequisitionRoute = RouteBuilder.create(
  AppRoute.CustomerRequisition
)
  .addPart(':requisitionNumber')
  .build();

const internalOrdersRoute = RouteBuilder.create(AppRoute.InternalOrder).build();
const internalOrderRoute = RouteBuilder.create(AppRoute.InternalOrder)
  .addPart(':requisitionNumber')
  .build();

export const RequisitionService: FC = () => {
  return (
    <Routes>
      <Route
        path={customerRequisitionsRoute}
        element={<ResponseRequisitionListView />}
      />
      <Route
        path={customerRequisitionRoute}
        element={<ResponseRequisitionDetailView />}
      />
      <Route
        path={internalOrdersRoute}
        element={<RequestRequisitionListView />}
      />
      <Route
        path={internalOrderRoute}
        element={<RequestRequisitionDetailView />}
      />
    </Routes>
  );
};

export default RequisitionService;
