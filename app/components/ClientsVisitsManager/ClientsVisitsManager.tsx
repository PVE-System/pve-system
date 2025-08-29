'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
  Tooltip,
} from '@mui/material';
import RouteIcon from '@mui/icons-material/Route';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import styles from './styles';

const ClientsVisitsManager = () => {
  return (
    <Box sx={styles.container}>
      {/* Card 1: Criar Nova Rota */}
      <Tooltip title="Elabore a sua rota de visita aos clientes" arrow>
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
      </Tooltip>

      {/* Card 2: Clientes com visita pendente */}
      <Tooltip title="Todas as rotas registradas no sistema" arrow>
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
      </Tooltip>

      {/* Card 3: Clientes com visita pendente */}
      <Tooltip title="Confira esta lista antes de criar uma nova rota" arrow>
        <Link href="/clientsVisitsPending" sx={{ textDecoration: 'none' }}>
          <Card sx={styles.card}>
            <CardContent sx={styles.cardContent}>
              <PendingActionsIcon sx={styles.cardIcon} />
              <Typography variant="h6" sx={styles.cardTitle}>
                Clientes com visita pendente e desinteressados
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Tooltip>
    </Box>
  );
};

export default ClientsVisitsManager;
