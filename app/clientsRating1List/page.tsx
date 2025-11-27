import * as React from 'react';

import ClientsRating1List from '../components/ClientsRating1List/ClientsRating1List';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const ClientsRating1ListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes com <span>Fluxo Baixo</span>
        </Typography>
      </Box>
      <ClientsRating1List />
    </>
  );
};

export default ClientsRating1ListPage;
