import { Box, Container, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';
import dynamic from 'next/dynamic';
import HeadApp from '../components/HeadApp/HeadApp';
import { Suspense } from 'react';
import ProtectedRouteAdminPage from '../components/ProtectedRouteAdminPage/ProtectedRouteAdminPage';

const AdminPageAllTabs = dynamic(
  () => import('../components/AdminPageAllTabs/AdminPageAllTabs'),
  {
    ssr: false,
  },
);

export default function AdminPage() {
  return (
    <ProtectedRouteAdminPage>
      <HeadApp />
      <Container>
        <Box sx={sharedStyles.container}>
          <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
            Página do <span>Administrador</span>
          </Typography>
          <Typography component="div" sx={sharedStyles.subtitleSize}>
            Gerencie as informações do setor administrativo
          </Typography>
          <Suspense>
            <AdminPageAllTabs />
          </Suspense>
        </Box>
      </Container>
    </ProtectedRouteAdminPage>
  );
}
