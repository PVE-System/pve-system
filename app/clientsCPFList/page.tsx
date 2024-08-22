import * as React from 'react';

import ClientsCPFList from '../components/ClientsCPFList/ClientsCPFList';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const ClientsCPFListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes Cadastrados com <span>CPF</span>
        </Typography>
      </Box>
      <ClientsCPFList />
    </>
  );
};

export default ClientsCPFListPage;
