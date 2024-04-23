import * as React from 'react';
import HeadApp from '../components/HeadApp/HeadApp';
import { Box, Container, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';
import ClientPageTabs from '../components/ClientPageTabs/ClientPageTabs';

const ClientPage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Container fixed>
        <Box sx={sharedStyles.container}>
          <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
            <span>Perfil do </span>Cliente
          </Typography>
        </Box>
        <ClientPageTabs />
      </Container>
    </>
  );
};

export default ClientPage;
