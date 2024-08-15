'use client';

import * as React from 'react';
import EditProfileUser from '@/app/components/EditProfileUser/EditProfileUser';
import HeadApp from '../components/HeadApp/HeadApp';
import { Box, Container, Typography } from '@mui/material';
import sharedStyles from '../styles/sharedStyles';
import { Suspense } from 'react'; // Importação necessária

interface FormDataState {
  [key: string]: string;
}

const ProfilePage: React.FC = () => {
  const [formData, setFormData] = React.useState<FormDataState>({});

  return (
    <>
      <HeadApp />
      <Container fixed>
        <Box sx={sharedStyles.container}>
          <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
            <span>Editar </span>Perfil
          </Typography>
        </Box>
        <Suspense>
          <EditProfileUser setFormData={setFormData} />
        </Suspense>
      </Container>
    </>
  );
};

export default ProfilePage;
