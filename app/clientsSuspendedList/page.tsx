import * as React from 'react';

import ClientsSuspendedList from '../components/ClientsSuspendedList/ClientsSuspendedList';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const ClientSuspendedListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes com Condição <span>Suspenso</span>
        </Typography>
      </Box>
      <ClientsSuspendedList />
    </>
  );
};

export default ClientSuspendedListPage;
