'use client';

import React from 'react';
import { useState } from 'react';

import { Box, Button, Rating, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

import Image from 'next/image';
import styles from '@/app/components/ProfileClient/styles';

/* Grupo 1 - Imagem e status */

const ClientProfile: React.FC = () => {
  const { handleSubmit, control, getValues } = useForm();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={styles.boxCol1}>
      <label htmlFor="profile-picture-input">
        <input
          id="profile-picture-input"
          type="file"
          accept="image/*"
          style={{ display: 'none', width: '100%' }}
          onChange={handleImageChange}
        />
        <Image
          src={previewImage || '/profile-placeholder.png'}
          alt="Placeholder"
          width={180}
          height={180}
          style={styles.imgProfile}
        />
      </label>
      <Box sx={styles.statusRating}>
        <Typography variant="subtitle1">Status de Atividade</Typography>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Rating
              sx={styles.rating}
              {...field}
              name="rating"
              defaultValue={0}
              max={3}
              onChange={(event, value) => {
                field.onChange(value);
              }}
            />
          )}
        />
      </Box>
      <Box sx={styles.clientCondition}>
        <Typography variant="subtitle1">Condição do Cliente</Typography>
        <Controller
          name="clienteEspecial"
          control={control}
          render={({ field }) => (
            <Box sx={styles.clientConditionButtonBox}>
              <Button
                variant="outlined"
                color="success"
                sx={{
                  ...styles.clientConditionButton,
                  ...(field.value === 'normal' && {
                    backgroundColor: 'green',
                    color: 'white',
                  }),
                }}
                onClick={() => field.onChange('normal')}
              >
                Normal
              </Button>
              <Button
                variant="outlined"
                color="warning"
                sx={{
                  ...styles.clientConditionButton,
                  ...(field.value === 'especial' && {
                    backgroundColor: '#FFD700',
                    color: 'black',
                  }),
                }}
                onClick={() => field.onChange('especial')}
              >
                Especial
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{
                  ...styles.clientConditionButton,
                  ...(field.value === 'suspenso' && {
                    backgroundColor: 'red',
                    color: 'white',
                  }),
                }}
                onClick={() => field.onChange('suspenso')}
              >
                Suspenso
              </Button>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};

export default ClientProfile;
