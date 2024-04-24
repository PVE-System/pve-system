'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import ClientPageTab1 from '@/app/components/ClientPageTab1/ClientPageTab1';
import ClientPageTab2 from '@/app/components/ClientPageTab2/ClientPageTab2';
import { Container, useMediaQuery, useTheme } from '@mui/material';
import styles from '@/app/components/ClientPageTabs/styles';

import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotesIcon from '@mui/icons-material/Notes';
import AttachmentIcon from '@mui/icons-material/Attachment';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function ClientPageTabs(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={styles.containerTabs}>
      <Box>
        <Box sx={styles.boxTabs}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            /* sx={styles.sizeTabs} */
          >
            <Tab
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              label={isSmallScreen ? null : 'Informações do cliente'}
              icon={<InfoIcon />}
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              label={isSmallScreen ? null : 'Informações de pedidos'}
              icon={<ShoppingCartIcon />}
              {...a11yProps(1)}
            />
            <Tab
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              label={isSmallScreen ? null : 'Histórico de anotações'}
              icon={<NotesIcon />}
              {...a11yProps(2)}
            />
            <Tab
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              label={isSmallScreen ? null : 'Arquivos e anexos'}
              icon={<AttachmentIcon />}
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>
        <ClientPageTabs value={value} index={0}>
          <Box sx={styles.contentTabs}>
            <ClientPageTab1 />
          </Box>
        </ClientPageTabs>
        <ClientPageTabs value={value} index={1}>
          <Box sx={styles.contentTabs}>
            <ClientPageTab2 />
          </Box>
        </ClientPageTabs>
        <ClientPageTabs value={value} index={2}>
          Item Three
        </ClientPageTabs>
        <ClientPageTabs value={value} index={3}>
          Item Four
        </ClientPageTabs>
      </Box>
    </Container>
  );
}
