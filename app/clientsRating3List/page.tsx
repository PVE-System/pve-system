import * as React from 'react';

import ClientsRating3List from '../components/ClientsRating3List/ClientsRating3List';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const ClientsRating3ListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes com <span>Fluxo Grande</span>
        </Typography>
      </Box>
      <ClientsRating3List />
    </>
  );
};

export default ClientsRating3ListPage;
