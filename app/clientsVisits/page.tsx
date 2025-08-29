import * as React from 'react';

import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';
import ClientsVisitsManager from '../components/ClientsVisitsManager/ClientsVisitsManager';

const ClientsVisitsPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Rotas e <span>Visitas</span>
        </Typography>
        <Typography component="span" sx={sharedStyles.subtitleSize}>
          Gerencie <span>rotas</span> e <span> visitas </span> aos clientes
        </Typography>
      </Box>
      <ClientsVisitsManager />
    </>
  );
};

export default ClientsVisitsPage;
