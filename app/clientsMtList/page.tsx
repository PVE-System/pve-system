import * as React from 'react';

import ClientsMtList from '@/app/components/ClientsMtList/ClientsMtList';
import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const ClientMtListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes <span>MT</span>
        </Typography>
      </Box>
      <ClientsMtList />
    </>
  );
};

export default ClientMtListPage;
