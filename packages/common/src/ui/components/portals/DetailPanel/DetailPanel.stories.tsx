import React, { ReactNode } from 'react';
import { Story, ComponentMeta } from '@storybook/react';
import { Grid, Typography } from '@mui/material';
import { DetailPanel, DetailPanelPortal } from './DetailPanel';
import {
  ClockIcon,
  CopyIcon,
  DetailPanelAction,
  DetailPanelSection,
  RewindIcon,
  TestingProvider,
  useDetailPanel,
} from '@openmsupply-client/common';

export default {
  title: 'Components/DetailPanel',
  component: DetailPanel,
} as ComponentMeta<typeof DetailPanel>;

interface DetailPanelArgs {
  Actions: ReactNode;
  Sections: ReactNode;
}

const Template: Story<DetailPanelArgs> = args => {
  const { OpenButton } = useDetailPanel();
  const { Actions, Sections } = args;

  return (
    <TestingProvider locale="en">
      <Grid container>
        <Grid item flex={1}>
          {OpenButton}
        </Grid>
        <Grid item>
          <DetailPanel />
          <DetailPanelPortal Actions={Actions}>{Sections}</DetailPanelPortal>
        </Grid>
      </Grid>
    </TestingProvider>
  );
};

export const Demo = Template.bind({});
export const Empty = Template.bind({});
export const SectionsOnly = Template.bind({});
export const AcionsOnly = Template.bind({});

Demo.args = {
  Actions: (
    <DetailPanelAction
      title="Backorders"
      onClick={() => {
        alert('back orders');
      }}
      icon={<RewindIcon />}
    />
  ),
  Sections: (
    <>
      <DetailPanelSection title="Comment">
        <Typography key="0">comments to be shown in here...</Typography>
      </DetailPanelSection>
      <DetailPanelSection title="Additional Info">
        <Typography key="0">additional info...</Typography>
      </DetailPanelSection>
    </>
  ),
};

AcionsOnly.args = {
  Actions: (
    <>
      <DetailPanelAction
        title="History"
        onClick={() => {
          alert('history');
        }}
        icon={<ClockIcon />}
      />{' '}
      <DetailPanelAction
        title="Copy to clipboard"
        onClick={() => {
          alert('copy to clipboard');
        }}
        icon={<CopyIcon />}
      />
    </>
  ),
};

SectionsOnly.args = {
  Sections: (
    <>
      <DetailPanelSection title="Comment">
        <Typography key="0">comments to be shown in here...</Typography>
      </DetailPanelSection>
      <DetailPanelSection title="Additional info">
        <Typography key="0">additional info...</Typography>
      </DetailPanelSection>
    </>
  ),
};
