'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ClientPageTab1 from '@/app/components/ClientPageTab1/ClientPageTab1';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function ClientPageTabs(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
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
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Informações do cliente" {...a11yProps(0)} />
          <Tab label="Informações sobre pedidos" {...a11yProps(1)} />
          <Tab label="Histórico de anotações" {...a11yProps(2)} />
          <Tab label="Arquivos e anexos" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <ClientPageTabs value={value} index={0}>
        <ClientPageTab1 />
      </ClientPageTabs>
      <ClientPageTabs value={value} index={1}>
        Item Two
      </ClientPageTabs>
      <ClientPageTabs value={value} index={2}>
        Item Three
      </ClientPageTabs>
      <ClientPageTabs value={value} index={3}>
        Item Four
      </ClientPageTabs>
    </Box>
  );
}
