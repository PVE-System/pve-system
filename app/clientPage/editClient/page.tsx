'use client';

import EditClient from '@/app/components/EditClient/EditClient';
import HeadApp from '@/app/components/HeadApp/HeadApp';
import sharedStyles from '@/app/styles/sharedStyles';
import { Box, Container, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const BasicTabs = dynamic(
  () => import('@/app/components/ClientPageTabs/ClientPageTabs'),
  {
    ssr: false,
  },
);

export default function EditClientPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');
  console.log('Client ID:', clientId);

  if (!clientId) {
    return <div>Client ID not provided</div>;
  }

  return (
    <>
      <HeadApp />
      <Container>
        <Box sx={sharedStyles.container}>
          <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
            <span>Editar </span>Cliente
          </Typography>
        </Box>
        <EditClient clientId={clientId} />
        {/*  <BasicTabs clientId={clientId} /> */}
      </Container>
    </>
  );
}
