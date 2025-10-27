'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';

// Ícones
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';

import AdminPageTabClientByUser from '../AdminPageTabClientByUser/AdminPageTabClientByUser';
import styles from './styles';
import AdminPageTabUsersManager from '../AdminPageTabUsersManager/AdminPageTabUsersManager';
import AdminPageTabQuotationManager from '../AdminPageTabQuotationManager/AdminPageTabQuotationManager';
import useMediaQuery from '@mui/material/useMediaQuery';
import AdminPageTabClientsStatusUpdate from '../AdminPageTabClientsStatusUpdate/AdminPageTabClientsStatusUpdate';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function AdminTabPanel(props: TabPanelProps) {
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
          <Typography component="div">{children}</Typography>
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

export default function AdminPageComponent() {
  const [value, setValue] = React.useState(0);

  const isSmallScreen = useMediaQuery('(max-width:800px)');

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={styles.containerTabs}>
      <Box>
        {/* Abas */}
        <Box sx={styles.boxTabs}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="abas do administrador"
          >
            <Tab
              label={isSmallScreen ? null : 'Clientes por vendedor'}
              icon={<AccountCircleIcon />}
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              {...a11yProps(0)}
            />
            <Tab
              label={isSmallScreen ? null : 'Gerenciar equipe'}
              icon={<GroupsIcon />}
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              {...a11yProps(1)}
            />
            <Tab
              label={isSmallScreen ? null : 'Gerenciar cotações'}
              icon={<RequestQuoteIcon />}
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              {...a11yProps(2)}
            />
            <Tab
              label={isSmallScreen ? null : 'Status dos clientes'}
              icon={<StarIcon />}
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>

        {/* Conteúdo das Abas */}

        <AdminTabPanel value={value} index={0}>
          <Box sx={styles.contentTabs}>
            <AdminPageTabClientByUser />
          </Box>
        </AdminTabPanel>
        <AdminTabPanel value={value} index={1}>
          <Box sx={styles.contentTabs}>
            <AdminPageTabUsersManager />
          </Box>
        </AdminTabPanel>
        <AdminTabPanel value={value} index={2}>
          <AdminPageTabQuotationManager />
        </AdminTabPanel>
        <AdminTabPanel value={value} index={3}>
          <AdminPageTabClientsStatusUpdate />
        </AdminTabPanel>
      </Box>
    </Container>
  );
}
