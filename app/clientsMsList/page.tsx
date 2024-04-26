import * as React from 'react';

import ClientsMsList from '@/app/components/ClientsMsList/ClientsMsList';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const ClientMsListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes <span>MS</span>
        </Typography>
      </Box>
      <ClientsMsList />
    </>
  );
};

export default ClientMsListPage;
