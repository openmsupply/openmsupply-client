import React, { FC, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Story } from '@storybook/react';
import { FlatButton } from './FlatButton';
import { BookIcon, TruckIcon } from '@common/icons';
import { BaseButton, ButtonWithIcon } from '.';
import { DialogButton, IconButton } from '../buttons';
import { Color } from '../menus';
import { ToggleButton } from './ToggleButton';
import { ColorSelectButton } from './ColorSelectButton';
import { useTranslation } from '@common/intl';
import { StoryProvider } from '../../../utils/testing';

const getOnClick = (someText: string) => () => {
  alert(someText);
};

const Wrapper: FC<{ text: string }> = ({ children, text }) => {
  return (
    <Grid item>
      <Paper
        sx={{
          width: 300,
          height: 180,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography sx={{ marginBottom: 2 }} variant="subtitle1">
          {text}
        </Typography>
        {children}
      </Paper>
    </Grid>
  );
};

const Template: Story = () => {
  const t = useTranslation(['app', 'common']);
  const [selected, setSelected] = useState(false);
  const [color, setColor] = useState<Color>({
    hex: '#8f90a6',
    name: 'grey',
  });

  return (
    <StoryProvider locale="en">
      <Grid container gap={2}>
        <Wrapper text="Base Button: Outlined variant, primary color">
          <BaseButton
            variant="outlined"
            color="primary"
            onClick={getOnClick('Base button')}
          >
            Base Button
          </BaseButton>
        </Wrapper>

        <Wrapper text="Base Button: Outlined variant, secondary color">
          <BaseButton
            variant="outlined"
            color="secondary"
            onClick={getOnClick('Base button')}
          >
            Base Button
          </BaseButton>
        </Wrapper>

        <Wrapper text="Base Button: Contained variant, primary color">
          <BaseButton
            variant="contained"
            color="primary"
            onClick={getOnClick('Base button')}
          >
            Base Button
          </BaseButton>
        </Wrapper>

        <Wrapper text="Base Button: Contained variant, secondary color">
          <BaseButton
            variant="contained"
            color="secondary"
            onClick={getOnClick('Base button')}
          >
            Base Button
          </BaseButton>
        </Wrapper>

        <Wrapper text="Button with Icon, contained & primary">
          <ButtonWithIcon
            variant="contained"
            color="primary"
            Icon={<TruckIcon />}
            label={t('distribution')}
            onClick={getOnClick('With Icon!')}
          />
        </Wrapper>

        <Wrapper text="Button with Icon, contained & secondary">
          <ButtonWithIcon
            variant="contained"
            color="secondary"
            Icon={<TruckIcon />}
            label={t('distribution')}
            onClick={getOnClick('With Icon!')}
          />
        </Wrapper>

        <Wrapper text="Button with Icon, outlined & primary">
          <ButtonWithIcon
            variant="outlined"
            color="primary"
            Icon={<TruckIcon />}
            label={t('distribution')}
            onClick={getOnClick('With Icon!')}
          />
        </Wrapper>

        <Wrapper text="Button with Icon, outlined & secondary">
          <ButtonWithIcon
            variant="outlined"
            color="secondary"
            Icon={<TruckIcon />}
            label={t('distribution')}
            onClick={getOnClick('With Icon!')}
          />
        </Wrapper>

        <Wrapper text="Dialog OK button">
          <DialogButton variant="ok" onClick={getOnClick('OK!')} />
        </Wrapper>

        <Wrapper text="Dialog OK & Next button">
          <DialogButton variant="next" onClick={getOnClick('OK & Next!')} />
        </Wrapper>

        <Wrapper text="Dialog cancel button">
          <DialogButton variant="cancel" onClick={getOnClick('Cancel!')} />
        </Wrapper>

        <Wrapper text="Flat button">
          <FlatButton
            icon={<BookIcon />}
            label="Docs"
            onClick={() => console.info('clicked')}
          />
        </Wrapper>

        <Wrapper text="Icon button">
          <IconButton
            icon={<BookIcon />}
            label="Docs"
            onClick={() => console.info('clicked')}
          />
        </Wrapper>

        <Wrapper text="Toggle button">
          <ToggleButton
            value={selected}
            selected={selected}
            onClick={() => setSelected(state => !state)}
            label="Admin"
          />
        </Wrapper>

        <Wrapper text="Color select">
          <Typography>Selected color: {JSON.stringify(color)}</Typography>
          <ColorSelectButton
            color={color.hex}
            onChange={newColor => setColor(newColor)}
          />
        </Wrapper>
      </Grid>
    </StoryProvider>
  );
};

export const Primary = Template.bind({});
export const Secondary = Template.bind({});

export default {
  title: 'Buttons/ButtonShowcase',
};
