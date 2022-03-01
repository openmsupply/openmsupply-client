import React, { FC, useCallback, useState, useEffect } from 'react';
import {
  Divider,
  TableContainer,
  TabContext,
  TabList,
  Tab,
  useTranslation,
  useIsMediumScreen,
  ButtonWithIcon,
  PlusCircleIcon,
  Box,
  BasicSpinner,
  DialogButton,
  useDialog,
  generateUUID,
  Item,
  useNotification,
  ModalMode,
  useDirtyCheck,
  useConfirmOnLeaving,
} from '@openmsupply-client/common';
import { InvoiceLine } from '../../../../types';
import { QuantityTable, PricingTable, LocationTable } from './TabTables';
import { InboundLineEditForm } from './InboundLineEditForm';
import {
  useInboundLines,
  useInboundFields,
  useSaveInboundLines,
  useNextItem,
} from '../../../api';
import { InboundLineEditPanel } from './InboundLineEditPanel';

interface InboundLineEditProps {
  item: Item | null;
  mode: ModalMode | null;
  isOpen: boolean;
  onClose: () => void;
}

enum Tabs {
  Batch = 'Batch',
  Pricing = 'Pricing',
  Location = 'Location',
}

export type DraftInboundLine = Pick<
  InvoiceLine,
  | 'id'
  | 'batch'
  | 'costPricePerPack'
  | 'sellPricePerPack'
  | 'expiryDate'
  | 'location'
  | 'numberOfPacks'
  | 'packSize'
  | 'itemId'
  | 'invoiceId'
> & {
  isCreated?: boolean;
  isUpdated?: boolean;
};

const createDraftInvoiceLine = (
  itemId: string,
  invoiceId: string,
  seed?: InvoiceLine
): DraftInboundLine => {
  const draftLine: DraftInboundLine = {
    id: generateUUID(),
    itemId,
    invoiceId,
    sellPricePerPack: 0,
    costPricePerPack: 0,
    numberOfPacks: 0,
    packSize: 0,
    isCreated: seed ? false : true,
    location: undefined,
    expiryDate: null,
    ...seed,
  };

  return draftLine;
};
const useDraftInboundLines = (itemId: string) => {
  const lines = useInboundLines(itemId);
  const { id } = useInboundFields('id');
  const { mutateAsync, isLoading } = useSaveInboundLines();
  const [draftLines, setDraftLines] = useState<DraftInboundLine[]>([]);
  const { isDirty, setIsDirty } = useDirtyCheck();
  useConfirmOnLeaving(isDirty);

  useEffect(() => {
    if (lines && itemId) {
      const drafts = lines.map(line =>
        createDraftInvoiceLine(line.itemId, line.invoiceId, line)
      );
      if (drafts.length === 0) drafts.push(createDraftInvoiceLine(itemId, id));
      setDraftLines(drafts);
    } else {
      setDraftLines([]);
    }
  }, [lines, itemId]);

  const addDraftLine = () => {
    const newLine = createDraftInvoiceLine(itemId, id);
    setIsDirty(true);
    setDraftLines([...draftLines, newLine]);
  };

  const updateDraftLine = useCallback(
    (patch: Partial<DraftInboundLine> & { id: string }) => {
      const batch = draftLines.find(line => line.id === patch.id);

      if (batch) {
        const newBatch = { ...batch, ...patch, isUpdated: true };
        const index = draftLines.indexOf(batch);
        draftLines[index] = newBatch;
        setIsDirty(true);
        setDraftLines([...draftLines]);
      }
    },
    [draftLines, setDraftLines]
  );

  const saveLines = async () => {
    setIsDirty(false);
    await mutateAsync(draftLines);
  };

  return {
    draftLines,
    addDraftLine,
    updateDraftLine,
    isLoading,
    saveLines,
  };
};

export const InboundLineEdit: FC<InboundLineEditProps> = ({
  item,
  mode,
  isOpen,
  onClose,
}) => {
  const t = useTranslation('replenishment');
  const { error } = useNotification();
  const [currentItem, setCurrentItem] = useState<Item | null>(item);
  const nextItem = useNextItem(currentItem?.id ?? '');
  const isMediumScreen = useIsMediumScreen();
  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.Batch);
  const { Modal } = useDialog({ isOpen, onClose });

  useEffect(() => {
    setCurrentItem(item);
  }, [item]);

  const { draftLines, addDraftLine, updateDraftLine, isLoading, saveLines } =
    useDraftInboundLines(currentItem?.id ?? '');

  useEffect(() => {
    const keybindings = (e: KeyboardEvent) => {
      if (e.code === 'Digit1' && e.shiftKey) {
        e.preventDefault();
        setCurrentTab(Tabs.Batch);
      }
      if (e.code === 'Digit2' && e.shiftKey) {
        e.preventDefault();
        setCurrentTab(Tabs.Pricing);
      }
      if (e.code === 'Digit3' && e.shiftKey) {
        e.preventDefault();
        setCurrentTab(Tabs.Location);
      }
    };

    if (currentItem) {
      window.addEventListener('keydown', keybindings);
    }

    return () => window.removeEventListener('keydown', keybindings);
  }, [currentItem]);

  return (
    <Modal
      title={
        mode === ModalMode.Create
          ? t('heading.add-item')
          : t('heading.edit-item')
      }
      cancelButton={<DialogButton variant="cancel" onClick={onClose} />}
      nextButton={
        <DialogButton
          variant="next"
          onClick={async () => {
            try {
              await saveLines();
              setCurrentItem(mode === ModalMode.Update ? nextItem : null);
              return true;
            } catch (e) {
              return false;
            }
          }}
        />
      }
      okButton={
        <DialogButton
          variant="ok"
          onClick={async () => {
            try {
              await saveLines();
              onClose();
            } catch (e) {
              error((error as unknown as Error).message);
            }
          }}
        />
      }
      height={600}
      width={1024}
    >
      {isLoading ? (
        <BasicSpinner messageKey="saving" />
      ) : (
        <>
          <InboundLineEditForm
            disabled={mode === ModalMode.Update}
            item={currentItem}
            onChangeItem={setCurrentItem}
          />
          <Divider margin={5} />
          {draftLines.length > 0 ? (
            <TabContext value={currentTab}>
              <Box flex={1} display="flex" justifyContent="space-between">
                <Box flex={1} />
                <Box flex={1}>
                  <TabList
                    value={currentTab}
                    centered
                    onChange={(_, v) => setCurrentTab(v)}
                  >
                    <Tab
                      value={Tabs.Batch}
                      label={`${t('label.quantities')} (⇧+1)`}
                      tabIndex={-1}
                    />
                    <Tab
                      value={Tabs.Pricing}
                      label={`${t('label.pricing')} (⇧+2)`}
                      tabIndex={-1}
                    />
                    <Tab
                      value={Tabs.Location}
                      label={`${t('label.location')} (⇧+3)`}
                      tabIndex={-1}
                    />
                  </TabList>
                </Box>
                <Box flex={1} justifyContent="flex-end" display="flex">
                  <ButtonWithIcon
                    color="primary"
                    variant="outlined"
                    onClick={addDraftLine}
                    label={t('label.add-batch')}
                    Icon={<PlusCircleIcon />}
                  />
                </Box>
              </Box>

              <TableContainer
                sx={{
                  height: isMediumScreen ? 300 : 400,
                  marginTop: 2,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: 'divider',
                  borderRadius: '20px',
                }}
              >
                <InboundLineEditPanel
                  value={Tabs.Batch}
                  lines={draftLines}
                  updateDraftLine={updateDraftLine}
                >
                  <QuantityTable
                    lines={draftLines}
                    updateDraftLine={updateDraftLine}
                  />
                </InboundLineEditPanel>

                <InboundLineEditPanel
                  value={Tabs.Pricing}
                  lines={draftLines}
                  updateDraftLine={updateDraftLine}
                >
                  <PricingTable
                    lines={draftLines}
                    updateDraftLine={updateDraftLine}
                  />
                </InboundLineEditPanel>

                <InboundLineEditPanel
                  value={Tabs.Location}
                  lines={draftLines}
                  updateDraftLine={updateDraftLine}
                >
                  <LocationTable
                    lines={draftLines}
                    updateDraftLine={updateDraftLine}
                  />
                </InboundLineEditPanel>
              </TableContainer>
            </TabContext>
          ) : (
            <Box sx={{ height: isMediumScreen ? 400 : 500 }} />
          )}
        </>
      )}
    </Modal>
  );
};
