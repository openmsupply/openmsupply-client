import { InvoiceLineNodeType, FnUtils } from '@openmsupply-client/common';
import { ItemRowFragment } from '@openmsupply-client/system';
import { DraftInboundLine } from './../../../types';
import { InboundLineFragment } from './../../api/operations.generated';

export interface CreateDraftInboundLineParams {
  item: ItemRowFragment;
  invoiceId: string;
  seed?: InboundLineFragment;
  type?: InvoiceLineNodeType;
}

const createDraftInboundLine = ({
  item,
  invoiceId,
  seed,
  type = InvoiceLineNodeType.StockIn,
}: CreateDraftInboundLineParams): DraftInboundLine => {
  const draftLine: DraftInboundLine = {
    __typename: 'InvoiceLineNode',
    totalAfterTax: 0,
    totalBeforeTax: 0,
    id: FnUtils.generateUUID(),
    invoiceId,
    sellPricePerPack: 0,
    costPricePerPack: 0,
    numberOfPacks: 0,
    packSize: 1,
    isCreated: seed ? false : true,
    expiryDate: undefined,
    location: undefined,
    type,
    item,
    ...seed,
  };

  return draftLine;
};

export const CreateDraft = {
  stockInLine: createDraftInboundLine,
  serviceLine: (params: Omit<CreateDraftInboundLineParams, 'type'>) =>
    createDraftInboundLine({ ...params, type: InvoiceLineNodeType.Service }),
};
