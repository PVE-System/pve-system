import * as React from 'react';

import ClientsNormalList from '@/app/components/ClientsNormalList/ClientsNormalList';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const ClientNormalListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes com Condição <span>Normal</span>
        </Typography>
      </Box>
      <ClientsNormalList />
    </>
  );
};

export default ClientNormalListPage;
