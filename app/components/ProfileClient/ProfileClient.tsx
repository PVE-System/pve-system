'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Rating, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import styles from '@/app/components/ProfileClient/styles';

interface ClientProfileProps {
  // New props
  rating: number;
  clientCondition: string;
  companyName: string;
  corfioCode: string;
  emailCommercial: string;
  phone: string;
  onRatingChange: (rating: number) => void;
  onConditionChange: (condition: string) => void;
  readOnly?: boolean;
  imageUrl?: any; // Adiciona a propriedade imageUrl como opcional
}

// Função Renderizar o nome do cliente com tamnho menor
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') {
    return '';
  }
  return str;
};

const ClientProfile: React.FC<ClientProfileProps> = ({
  rating,
  clientCondition,
  companyName,
  corfioCode,
  emailCommercial,
  phone,
  onRatingChange,
  onConditionChange,
  readOnly,
  imageUrl,
}) => {
  const { control } = useForm();
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
    <Box sx={styles.boxProfile}>
      <Typography variant="h6" sx={styles.companyName}>
        {renderAsIs(companyName.slice(0, 35))} {/* Limita a 35 caracteres */}
      </Typography>{' '}
      <label htmlFor="profile-picture-input">
        <input
          id="profile-picture-input"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
          disabled={readOnly}
        />
        <Image
          src={imageUrl || previewImage || '/profile-placeholder.png'} // Usa a URL da imagem se disponível
          alt="Profile Picture"
          width={180}
          height={180}
          style={styles.imgProfile}
        />
      </label>
      <Box sx={styles.statusRating}>
        <Typography variant="subtitle2">Status de Atividade:</Typography>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Rating
              sx={styles.rating}
              {...field}
              name="rating"
              value={rating}
              max={3}
              onChange={(event, value) => {
                if (!readOnly) {
                  field.onChange(value);
                  onRatingChange(value || 0);
                }
              }}
              readOnly={readOnly}
            />
          )}
        />
      </Box>
      <Box sx={styles.clientCondition}>
        <Typography variant="subtitle2">Condição do Cliente:</Typography>
        <Box sx={styles.clientConditionButtonBox}>
          <Button
            variant="outlined"
            color="success"
            sx={{
              ...styles.clientConditionButton,
              ...(clientCondition === 'Normal' && {
                backgroundColor: 'green',
                border: 'none',
                color: 'white',
              }),
            }}
            disabled={readOnly}
            onClick={() => {
              if (!readOnly) {
                onConditionChange('Normal');
              }
            }}
          >
            Normal
          </Button>
          <Button
            variant="outlined"
            color="warning"
            sx={{
              ...styles.clientConditionButton,
              ...(clientCondition === 'Especial' && {
                backgroundColor: '#FFD700',
                border: 'none',
                color: 'black',
              }),
            }}
            disabled={readOnly}
            onClick={() => {
              if (!readOnly) {
                onConditionChange('Especial');
              }
            }}
          >
            Especial
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{
              ...styles.clientConditionButton,
              ...(clientCondition === 'Suspenso' && {
                backgroundColor: 'red',
                border: 'none',
                color: 'white',
              }),
            }}
            disabled={readOnly}
            onClick={() => {
              if (!readOnly) {
                onConditionChange('Suspenso');
              }
            }}
          >
            Suspenso
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          alignSelf: 'start',
        }}
      >
        <Typography variant="subtitle2" sx={{ marginBottom: '5px' }}>
          Código Corfio: {corfioCode}
        </Typography>{' '}
        <Typography variant="subtitle2" sx={{ marginBottom: '5px' }}>
          Telefone: {phone}
        </Typography>{' '}
        <Typography variant="subtitle2" sx={{ marginBottom: '5px' }}>
          Email: {emailCommercial}
        </Typography>{' '}
      </Box>
    </Box>
  );
};

export default ClientProfile;
