'use client';

import { useSearchParams } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';
import dynamic from 'next/dynamic';
import HeadApp from '../components/HeadApp/HeadApp';
import { Suspense } from 'react';

const BasicTabs = dynamic(
  () => import('../components/ClientPageAllTabs/ClientPageAllTabs'),
  {
    ssr: false,
  },
);

export default function ClientPage() {
  return (
    <>
      <HeadApp />
      <Container>
        <Box sx={sharedStyles.container}>
          <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
            <span>Perfil </span>Cliente
          </Typography>
          <Suspense>
            <BasicTabs />
          </Suspense>
        </Box>
      </Container>
    </>
  );
}
