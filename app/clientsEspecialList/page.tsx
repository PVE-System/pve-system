import * as React from 'react';

import ClientsEspecialList from '../components/ClientsEspecialList/ClientsEspecialList';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const ClientEspecialListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes com Condição <span>Especial</span>
        </Typography>
      </Box>
      <ClientsEspecialList />
    </>
  );
};

export default ClientEspecialListPage;
