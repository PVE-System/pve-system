'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ClientsVisitsEditRouteById from '@/app/components/ClientsVisitsEditRouteById/ClientsVisitsEditRouteById';
import HeadApp from '../components/HeadApp/HeadApp';
import { Box, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';

const ClientsVisitsEditRoutePage = () => {
  const searchParams = useSearchParams();
  const routeId = searchParams.get('routeId');

  if (!routeId) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h2>Erro</h2>
        <p>ID da rota não fornecido</p>
      </div>
    );
  }

  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Edite esta rota de <span>Visitas</span>
        </Typography>
        <Typography component="span" sx={sharedStyles.subtitleSize}>
          Filtre os clientes por <span>estado</span> e <span>cidade</span> e
          selecione para inserir em sua rota.
        </Typography>
      </Box>
      <ClientsVisitsEditRouteById routeId={routeId} />
    </>
  );
};

export default ClientsVisitsEditRoutePage;
