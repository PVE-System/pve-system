import * as React from 'react';

import HeadApp from '../components/HeadApp/HeadApp';
import sharedStyles from '../styles/sharedStyles';
import { Box, Typography } from '@mui/material';
import RegisterNewRoute from '../components/ClientsVisitsRegisterNewRoute/RegisterNewRoute';

const RegisterNewRoutePage: React.FC = () => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Registre uma nova rota de <span>Visitas</span>
        </Typography>
        <Typography component="span" sx={sharedStyles.subtitleSize}>
          Filtre os clientes por <span>estado</span> e <span>cidade</span> e
          selecione para inserir em sua rota.
        </Typography>
      </Box>
      <RegisterNewRoute />
    </>
  );
};

export default RegisterNewRoutePage;
