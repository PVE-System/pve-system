'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Container, useMediaQuery, useTheme } from '@mui/material';
import styles from '@/app/components/ClientPageAllTabs/styles';

import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotesIcon from '@mui/icons-material/Notes';
import AttachmentIcon from '@mui/icons-material/Attachment';

import ClientPageTabInfos from '@/app/components/ClientPageTabInfos/ClientPageTabInfos';
import ClientPageTabSalesInfos from '@/app/components/ClientPageTabSalesInfos/ClientPageTabSalesInfos';
import ClientPageTabAnnotation from '@/app/components/ClientPageTabAnnotation/ClientPageTabAnnotation';
import ClientPageTabFiles from '@/app/components/ClientPageTabFiles/ClientPageTabFiles';
import { useSearchParams } from 'next/navigation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface BasicTabsProps {}

function ClientPageTabPanel(props: TabPanelProps) {
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

export default function BasicTabs({}: BasicTabsProps) {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!clientId) {
    return <div>Client ID not provided</div>;
  }

  return (
    <Container maxWidth="lg" sx={styles.containerTabs}>
      <Box>
        <Box sx={styles.boxTabs}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
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
        <ClientPageTabPanel value={value} index={0}>
          <Box sx={styles.contentTabs}>
            <ClientPageTabInfos clientId={clientId} />
          </Box>
        </ClientPageTabPanel>
        <ClientPageTabPanel value={value} index={1}>
          <Box sx={styles.contentTabs}>
            <ClientPageTabSalesInfos clientId={clientId} />
          </Box>
        </ClientPageTabPanel>
        <ClientPageTabPanel value={value} index={2}>
          <Box sx={styles.contentTabs}>
            <ClientPageTabAnnotation clientId={clientId} />
          </Box>
        </ClientPageTabPanel>
        <ClientPageTabPanel value={value} index={3}>
          <Box sx={styles.contentTabs}>
            <ClientPageTabFiles clientId={clientId} />
          </Box>
        </ClientPageTabPanel>
      </Box>
    </Container>
  );
}
