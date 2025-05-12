import * as React from 'react';

import ClientsByCities from '../components/ClientsByCities/ClientsByCities';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const ClientNormalListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes por <span>Cidades</span>
        </Typography>
      </Box>
      <ClientsByCities />
    </>
  );
};

export default ClientNormalListPage;
