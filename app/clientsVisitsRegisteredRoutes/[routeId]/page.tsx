import * as React from 'react';
import HeadApp from '../../components/HeadApp/HeadApp';
import sharedStyles from '../../styles/sharedStyles';
import { Box, Typography } from '@mui/material';
import ClientsVisitsRegisteredRoutesById from '../../components/ClientsVisitsRegisteredRoutesById/ClientsVisitsRegisteredRoutesById';

interface PageProps {
  params: {
    routeId: string;
  };
}

const ClientsVisitsRegisteredRoutesByIdPage: React.FC<PageProps> = ({
  params,
}) => {
  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Detalhes da <span>Rota</span>
        </Typography>
        <Typography component="span" sx={sharedStyles.subtitleSize}>
          Atualize <span>informações </span> de cada visita e visualize a{' '}
          <span>localização</span> dos clientes.
        </Typography>
      </Box>
      <ClientsVisitsRegisteredRoutesById routeId={params.routeId} />
    </>
  );
};

export default ClientsVisitsRegisteredRoutesByIdPage;
