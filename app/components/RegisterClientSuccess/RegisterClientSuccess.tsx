'use client';

import React, { Suspense } from 'react';
import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';

import sharedStyles from '@/app/styles/sharedStyles';
import styles from '@/app/components/RegisterClientSuccess/style';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { InsertPhoto, PhotoCamera } from '@mui/icons-material';

// Componente com Suspense
const RegisterClientSuccessContent = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');

  if (!clientId) {
    return <p>Erro: clientId não fornecido.</p>;
  }

  return (
    <Container fixed>
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Cliente Cadastrado com <span>Sucesso!</span>
        </Typography>
      </Box>
      <Box>
        <Card variant="outlined" sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <Typography variant="h6" sx={sharedStyles.subtitleSize}>
              <span>Página </span>Cliente
            </Typography>
            <Box component={NextLink} href={`/clientPage?id=${clientId}`}>
              <ApartmentIcon sx={styles.icon} />
            </Box>
          </CardContent>
          <CardContent sx={styles.cardContent}>
            <Typography variant="h6" sx={sharedStyles.subtitleSize}>
              <span>Foto do </span>Cliente
            </Typography>
            <Box
              component={NextLink}
              href={`/clientPage/editClient?id=${clientId}`}
            >
              <PhotoCamera sx={styles.icon} />
            </Box>
          </CardContent>
          <CardContent sx={styles.cardContent}>
            <Typography variant="h6" sx={sharedStyles.subtitleSize}>
              <span>Dash</span>board
            </Typography>
            <Box component={NextLink} href="/dashboard">
              <DashboardIcon sx={styles.icon} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

// Componente principal com Suspense
export default function RegisterClientSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterClientSuccessContent />
    </Suspense>
  );
}
