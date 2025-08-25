import * as React from 'react';

import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';
import ClientsVisitsPending from '../components/ClientsVisitsPending/ClientsVisitsPending';

const ClientsVisitsPendingPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Visitas <span>Pendentes</span> e <span>Desinteressados</span>
        </Typography>
        <Typography component="span" sx={sharedStyles.subtitleSize}>
          Lista de clientes com visita <span>Pendente</span> ou que no momento
          esta <span>desinteressado</span>
        </Typography>
      </Box>
      <ClientsVisitsPending />
    </>
  );
};

export default ClientsVisitsPendingPage;
