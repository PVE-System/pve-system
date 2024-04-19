'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Container, TextField } from '@mui/material';

import sharedStyles from '@/app/styles/sharedStyles';
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
      <Box sx={{ ...sharedStyles.container, ...styles.formBox }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={styles.formBox}>
            <Button component="label" sx={styles.formButtonImg}>
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={180}
                  height={180}
                  style={styles.formButtonImg}
                />
              ) : (
                <Image
                  src="/profile-placeholder.png"
                  alt="Placeholder"
                  width={180}
                  height={180}
                />
              )}

              <input /* Parece que a propriedade accept não é suportada pelo TextField, entao mantive input html */
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
              <TextField
                {...field}
                type="text"
                placeholder="Nome"
                sx={styles.inputName}
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
