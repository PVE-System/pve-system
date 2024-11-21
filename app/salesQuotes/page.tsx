'use client';

import BasicTabs from '@/app/components/ClientPageAllTabs/ClientPageAllTabs';
import EditClient from '@/app/components/EditClient/EditClient';
import HeadApp from '@/app/components/HeadApp/HeadApp';
import sharedStyles from '@/app/styles/sharedStyles';
import { Box, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import SalesQuotes from '../components/SalesQuotes/SalesQuotes';

export default function SalesQuotesPage() {
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
          <SalesQuotes />
        </Suspense>
        {/*  <BasicTabs clientId={clientId} /> */}
      </Container>
    </>
  );
}
