'use client';

import { useSearchParams } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';
import dynamic from 'next/dynamic';
import HeadApp from '../components/HeadApp/HeadApp';

const BasicTabs = dynamic(
  () => import('../components/ClientPageTabs/ClientPageTabs'),
  {
    ssr: false,
  },
);

export default function ClientPage() {
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
            <span>Perfil </span>Cliente
          </Typography>
          <BasicTabs clientId={clientId} />
        </Box>
      </Container>
    </>
  );
}

/* import { useSearchParams } from 'next/navigation';
import { Box, Container, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';
import dynamic from 'next/dynamic';

import { db } from '@/app/db';
import { clients } from '@/app/db/schema';

const BasicTabs = dynamic(
  () => import('../components/ClientPageTabs/ClientPageTabs'),
  {
    ssr: false,
  },
);

export default async function ClientPage() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');
  const result = await db.select().from(clients);
  console.log('Client ID:', clientId);

  if (!clientId) {
    return <div>Client ID not provided</div>;
  }

  return (
    <Container>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" gutterBottom>
          Client Page
        </Typography>
      </Box>
    </Container>
  );
} */

//-------------------------------------------------------------------------------------

/* import { Box, Container, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/router'; // Importar useSearchParams do next/router
import { db } from '@/app/db';
import { clients } from '@/app/db/schema';
import { eq } from 'drizzle-orm'; // Importar a função eq do drizzle-orm

const BasicTabs = dynamic(
  () => import('../components/ClientPageTabs/ClientPageTabs'),
  {
    ssr: false,
  },
);

export default async function ClientPage() {
  let clientId = null;

  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    clientId = searchParams.get('id');
  }

  if (!clientId) {
    return <div>Client ID not provided</div>;
  }

  try {
    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, Number(clientId))) // Filtrar por ID usando eq
      .execute();

    if (!client || client.length === 0) {
      return <div>Client not found</div>;
    }

    return (
      <Container>
        <Box sx={sharedStyles.container}>
          <Typography variant="h4" component="h1" gutterBottom>
            Client Page
          </Typography>
          <BasicTabs clientId={clientId} />
        </Box>
      </Container>
    );
  } catch (error) {
    console.error('Error fetching client data:', error);
    return <div>Error fetching client data</div>;
  }
} */
