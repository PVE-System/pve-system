'use client';

import { useSearchParams } from 'next/navigation';
import ClientsVisitsById from '@/app/components/ClientsVisitsById/ClientsVisitsById';
import HeadApp from '../components/HeadApp/HeadApp';
import { Box, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';

export default function ClientsVisitsByIdPage() {
  const searchParams = useSearchParams();
  const visitId = searchParams.get('visitId');

  if (!visitId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Erro: ID da visita não fornecido</h2>
        <p>Por favor, acesse esta página através de um link válido.</p>
      </div>
    );
  }

  return (
    <>
      <HeadApp />
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Informações sobre esta <span>Visita</span>
        </Typography>
        <Typography component="span" sx={sharedStyles.subtitleSize}>
          Atualize as <span>informações</span> e <span>Status</span> desta
          visita.
        </Typography>
      </Box>
      <ClientsVisitsById visitId={visitId} />
    </>
  );
}
