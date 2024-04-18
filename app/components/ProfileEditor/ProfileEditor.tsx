'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Container } from '@mui/material';
import sharedStyles from '@/app/styles/sharedStyles';

import Image from 'next/image';
import styles from './styles';

interface MyFormValues {
  name: string;
  profilePicture: File | null;
}

const EditProfile: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<MyFormValues>();

  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const onSubmit = (data: MyFormValues) => {
    // Lidar com a logica de submit aqui
    console.log(data);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={sharedStyles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={styles.formBox}>
            <Button component="label" sx={styles.formButtonImg}>
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={180}
                  height={180}
                  style={{
                    borderRadius: '50%',
                  }}
                />
              ) : (
                <Image
                  src="/profile-placeholder.png"
                  alt="Placeholder"
                  width={180}
                  height={180}
                  style={{
                    borderRadius: '50%',
                  }}
                />
              )}

              <input
                id="profile-picture-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </Button>
          </Box>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Nome"
                style={{ width: '100%', marginTop: '10px', padding: '8px' }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            sx={styles.formButtonSubmit}
          >
            Salvar Alterações
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default EditProfile;
