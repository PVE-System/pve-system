'use client';

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';

// Ícones
import InfoIcon from '@mui/icons-material/Info';
import GroupIcon from '@mui/icons-material/Group';
import NotesIcon from '@mui/icons-material/Notes';
import AdminPageTabClientByUser from '../AdminPageTabClientByUser/AdminPageTabClientByUser';
import styles from './styles';

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
              label="Clientes por vendedor"
              icon={<InfoIcon />}
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
              label="Gerenciar equipe"
              icon={<GroupIcon />}
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
              label="Aba 3"
              icon={<NotesIcon />}
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              {...a11yProps(2)}
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
          Possibilidade de conteúdo para Aba 2
        </AdminTabPanel>
        <AdminTabPanel value={value} index={2}>
          Possibilidade de conteúdo para Aba 3
        </AdminTabPanel>
      </Box>
    </Container>
  );
}
