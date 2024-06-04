import * as React from 'react';
import HeadApp from '../components/HeadApp/HeadApp';
import { Box, Container, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';
import RegisterClient from '../components/RegisterClient/RegisterClient';

import { db } from '@/app/db'; // Ajuste o caminho conforme necessário
import { clients } from '@/app/db/schema';

const RegisterClientPage: React.FC = async () => {
  /* const result = await db.select().from(clients); */

  return (
    <>
      {/* <pre>{JSON.stringify(result, null, 2)}</pre> */}
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

export default RegisterClientPage;
