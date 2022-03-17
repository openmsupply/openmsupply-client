import {
  Box,
  ButtonWithIcon,
  StatusCrumbs,
  useTranslation,
  AppFooterPortal,
  InvoiceNodeStatus,
  XCircleIcon,
  useBreadcrumbs,
} from '@openmsupply-client/common';

import React, { FC } from 'react';
import { getStatusTranslator, inboundStatuses } from '../../../utils';
import { InboundFragment, useInbound } from '../../api';
import { StatusChangeButton } from './StatusChangeButton';
import { OnHoldButton } from './OnHoldButton';

const createStatusLog = (invoice: InboundFragment) => {
  const statusIdx = inboundStatuses.findIndex(s => invoice.status === s);
  const statusLog: Record<InvoiceNodeStatus, null | string | undefined> = {
    [InvoiceNodeStatus.New]: null,
    [InvoiceNodeStatus.Picked]: null,
    [InvoiceNodeStatus.Shipped]: null,
    [InvoiceNodeStatus.Delivered]: null,
    [InvoiceNodeStatus.Verified]: null,
    // Placeholder for typescript, not used in inbounds
    [InvoiceNodeStatus.Allocated]: null,
  };

  statusLog;

  if (statusIdx >= 0) {
    statusLog[InvoiceNodeStatus.New] = invoice.createdDatetime;
  }
  if (statusIdx >= 1) {
    statusLog[InvoiceNodeStatus.Picked] = invoice.pickedDatetime;
  }
  if (statusIdx >= 2) {
    statusLog[InvoiceNodeStatus.Shipped] = invoice.shippedDatetime;
  }
  if (statusIdx >= 3) {
    statusLog[InvoiceNodeStatus.Delivered] = invoice.deliveredDatetime;
  }
  if (statusIdx >= 4) {
    statusLog[InvoiceNodeStatus.Verified] = invoice.verifiedDatetime;
  }

  return statusLog;
};

export const FooterComponent: FC = () => {
  const t = useTranslation('replenishment');
  const { navigateUpOne } = useBreadcrumbs();
  const { data } = useInbound();

  return (
    <AppFooterPortal
      Content={
        data ? (
          <Box
            gap={2}
            display="flex"
            flexDirection="row"
            alignItems="center"
            height={64}
          >
            <OnHoldButton />

            <StatusCrumbs
              statuses={inboundStatuses}
              statusLog={createStatusLog(data)}
              statusFormatter={getStatusTranslator(t)}
            />

            <Box flex={1} display="flex" justifyContent="flex-end" gap={2}>
              <ButtonWithIcon
                shrinkThreshold="lg"
                Icon={<XCircleIcon />}
                label={t('button.cancel')}
                color="secondary"
                sx={{ fontSize: '12px' }}
                onClick={() => navigateUpOne()}
              />

              <StatusChangeButton />
            </Box>
          </Box>
        ) : null
      }
    />
  );
};

export const Footer = React.memo(FooterComponent);
