import * as React from 'react';

import ClientsRating2List from '../components/ClientsRating2List/ClientsRating2List';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const ClientsRating2ListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes com Status <span>Moderado</span>
        </Typography>
      </Box>
      <ClientsRating2List />
    </>
  );
};

export default ClientsRating2ListPage;
