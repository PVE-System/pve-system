import * as React from 'react';
import EditProfile from '@/app/components/ProfileEditor/ProfileEditor';
import HeadApp from '../components/HeadApp/HeadApp';
import { Box, Container, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';

const ProfilePage: React.FC = () => {
  // Suponha que você tenha esses dados do usuário
  const userPhotoUrl = 'caminho/para/foto';
  const userName = 'Nome do Usuário';

  return (
    <>
      <HeadApp />
      <Container fixed>
        <Box sx={sharedStyles.container}>
          <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
            <span>Editar</span>Perfil
          </Typography>
        </Box>
        <EditProfile />
      </Container>
    </>
  );
};

export default ProfilePage;
