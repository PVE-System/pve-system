import * as React from 'react';
import HeadApp from '../components/HeadApp/HeadApp';
import { Box, Container, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';
import RegisterClient from '../components/RegisterClient/RegisterClient';

const ProfilePage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Container fixed>
        <Box sx={sharedStyles.container}>
          <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
            <span>Cadastrar </span>Cliente
          </Typography>
        </Box>
        <RegisterClient />
      </Container>
    </>
  );
};

export default ProfilePage;
