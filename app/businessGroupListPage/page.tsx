import * as React from 'react';

import HeadApp from '../components/HeadApp/HeadApp';
import BusinessGroupListPageComponent from '../components/BusinessGroupListPageComponent/BusinessGroupListPageComponent';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';

const BusinessGroupListPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Clientes do Grupo <span>Empresarial</span>
        </Typography>
      </Box>
      <BusinessGroupListPageComponent />
    </>
  );
};

export default BusinessGroupListPage;
