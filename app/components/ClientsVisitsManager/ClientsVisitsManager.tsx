'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Link } from '@mui/material';
import RouteIcon from '@mui/icons-material/Route';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import styles from './styles';

const ClientsVisitsManager = () => {
  return (
    <Box sx={styles.container}>
      {/* Card 1: Criar Nova Rota */}
      <Link
        href="/clientsVisitsRegisterNewRoute"
        sx={{ textDecoration: 'none' }}
      >
        <Card sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <RouteIcon sx={styles.cardIcon} />
            <Typography variant="h6" sx={styles.cardTitle}>
              Criar Nova Rota
            </Typography>
          </CardContent>
        </Card>
      </Link>

      {/* Card 2: Clientes com visita pendente */}
      <Link
        href="/clientsVisitsRegisteredRoutes"
        sx={{ textDecoration: 'none' }}
      >
        <Card sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <AltRouteIcon sx={styles.cardIcon} />
            <Typography variant="h6" sx={styles.cardTitle}>
              Rotas Registradas
            </Typography>
          </CardContent>
        </Card>
      </Link>

      {/* Card 3: Clientes com visita pendente */}
      <Link href="/clientsVisitsPending" sx={{ textDecoration: 'none' }}>
        <Card sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <PendingActionsIcon sx={styles.cardIcon} />
            <Typography variant="h6" sx={styles.cardTitle}>
              Clientes com visita pendente
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Box>
  );
};

export default ClientsVisitsManager;
