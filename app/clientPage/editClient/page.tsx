'use client';

import BasicTabs from '@/app/components/ClientPageAllTabs/ClientPageAllTabs';
import EditClient from '@/app/components/EditClient/EditClient';
import HeadApp from '@/app/components/HeadApp/HeadApp';
import sharedStyles from '@/app/styles/sharedStyles';
import { Box, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

/* const BasicTabs = dynamic(
  () => import('@/app/components/ClientPageAllTabs/ClientPageAllTabs'),
  {
    ssr: false,
  },
); */

export default function EditClientPage() {
  return (
    <>
      <HeadApp />
      <Container>
        <Box sx={sharedStyles.container}>
          <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
            <span>Editar </span>Cliente
          </Typography>
        </Box>
        <Suspense>
          <EditClient />
        </Suspense>
        {/*  <BasicTabs clientId={clientId} /> */}
      </Container>
    </>
  );
}
