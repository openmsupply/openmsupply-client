import {
  Box,
  ArrowRightIcon,
  ButtonWithIcon,
  SaveIcon,
  StatusCrumbs,
  ToggleButton,
  XCircleIcon,
  useTranslation,
  useNotification,
  AppFooterPortal,
} from '@openmsupply-client/common';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getNextOutboundStatusButtonTranslation,
  getStatusTranslation,
  isInvoiceEditable,
  outboundStatuses,
} from '../utils';
import { OutboundShipment } from './types';

interface OutboundDetailFooterProps {
  draft: OutboundShipment;
  save: (draft: OutboundShipment) => void;
}

export const OutboundDetailFooter: FC<OutboundDetailFooterProps> = ({
  draft,
  save,
}) => {
  const navigate = useNavigate();
  const t = useTranslation();
  const { success } = useNotification();

  return (
    <AppFooterPortal
      Content={
        <Box
          gap={2}
          display="flex"
          flexDirection="row"
          alignItems="center"
          height={64}
        >
          <ToggleButton
            disabled={!isInvoiceEditable(draft)}
            value={!!draft.hold}
            selected={!!draft.hold}
            onClick={(_, value) => {
              draft.update?.('hold', !value);
            }}
            labelKey="label.hold"
          />
          <StatusCrumbs
            statuses={outboundStatuses}
            currentStatus={draft.status}
            statusFormatter={getStatusTranslation}
          />
          <Box flex={1} display="flex" justifyContent="flex-end" gap={2}>
            <ButtonWithIcon
              Icon={<XCircleIcon />}
              labelKey="button.cancel"
              color="secondary"
              sx={{ fontSize: '12px' }}
              onClick={() => navigate(-1)}
            />
            {isInvoiceEditable(draft) && (
              <>
                <ButtonWithIcon
                  Icon={<SaveIcon />}
                  labelKey="button.save"
                  variant="contained"
                  color="secondary"
                  sx={{ fontSize: '12px' }}
                  onClick={() => {
                    success('Saved invoice! 🥳 ')();
                    save(draft);
                  }}
                />
                <ButtonWithIcon
                  disabled={draft.hold}
                  Icon={<ArrowRightIcon />}
                  labelKey="button.save-and-confirm-status"
                  sx={{ fontSize: '12px' }}
                  labelProps={{
                    status: t(
                      getNextOutboundStatusButtonTranslation(draft.status)
                    ),
                  }}
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    success('Saved invoice! 🥳 ')();
                    draft.update?.('status', 'finalised');
                    save(draft);
                  }}
                />
              </>
            )}
          </Box>
        </Box>
      }
    />
  );
};
