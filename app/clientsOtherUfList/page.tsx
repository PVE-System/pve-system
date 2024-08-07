import * as React from 'react';

import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';
import ClientsOtherUfList from '../components/ClientsOtherUfList/ClientsOtherUfList';

const ClientOtherUfListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes de outras <span>UF</span>
        </Typography>
      </Box>
      <ClientsOtherUfList />
    </>
  );
};

export default ClientOtherUfListPage;
