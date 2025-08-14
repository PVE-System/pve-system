'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Link } from '@mui/material';
import { Theme } from '@mui/material';
import RouteIcon from '@mui/icons-material/Route';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AltRouteIcon from '@mui/icons-material/AltRoute';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    padding: '20px',
    '@media (max-width: 800px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  card: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.alternative,
    height: '150px',
    width: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',

    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    },
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    /* justifyContent: 'center', */
  },

  cardTitle: {
    fontWeight: 500,
    fontSize: '16px',
    /* marginBottom: 2, */
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.primary
        : theme.palette.text.primary,
  },

  cardIcon: {
    fontSize: '32px',
    marginBottom: 2,
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.primary.main,
  },
};

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
      <Link href="/clientsVisitsPendingVisits" sx={{ textDecoration: 'none' }}>
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
