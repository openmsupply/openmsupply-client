import React, { FC } from 'react';
import { RouteBuilder, Routes, Route } from '@openmsupply-client/common';
import { AppRoute } from '@openmsupply-client/config';
import { NameListView } from '../ListView';

const ComingSoon = () => <div>Coming Soon</div>;

export const Service: FC = () => {
  const customersRoute = RouteBuilder.create(AppRoute.Customer).build();

  const customerRoute = RouteBuilder.create(AppRoute.Customer)
    .addPart(':id')
    .build();

  const suppliersRoute = RouteBuilder.create(AppRoute.Suppliers).build();

  const supplierRoute = RouteBuilder.create(AppRoute.Suppliers)
    .addPart(':id')
    .build();

  return (
    <Routes>
      <Route path={customersRoute} element={<NameListView type="customer" />} />
      <Route path={customerRoute} element={<ComingSoon />} />
      <Route path={suppliersRoute} element={<NameListView type="supplier" />} />
      <Route path={supplierRoute} element={<ComingSoon />} />
    </Routes>
  );
};

export default Service;
