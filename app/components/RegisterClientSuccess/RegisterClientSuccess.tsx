'use client';

import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import NextLink from 'next/link';

import styles from '@/app/components/ExcelDownload/style';
import sharedStyles from '@/app/styles/sharedStyles';

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';

export default function RegisterClientSuccess() {
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
            <Box component={NextLink} href="/dashboard">
              <ApartmentIcon sx={styles.icon} />
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
}
