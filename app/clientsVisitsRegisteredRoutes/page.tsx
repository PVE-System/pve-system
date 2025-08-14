import * as React from 'react';

import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';
import ClientsVisitsRegisteredRoutes from '../components/ClientsVisitsRegisteredRoutes/ClientsVisitsRegisteredRoutes';

const ClientsVisitsRegisteredRoutesPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Rotas <span>Registradas</span>
        </Typography>
        <Typography component="span" sx={sharedStyles.subtitleSize}>
          Gerencie todas as <span>rotas</span> registradas e agendadas no
          sistema
        </Typography>
      </Box>
      <ClientsVisitsRegisteredRoutes />
    </>
  );
};

export default ClientsVisitsRegisteredRoutesPage;
