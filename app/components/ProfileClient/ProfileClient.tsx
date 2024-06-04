import React, { useEffect, useState } from 'react';
import { Box, Button, Rating, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Image from 'next/image';
import styles from '@/app/components/ProfileClient/styles';

interface ClientProfileProps {
  rating: number;
  clientCondition: string;
  setRating: (rating: number) => void;
  setClientCondition: (condition: string) => void;
  readOnly: boolean;
}

const ClientProfile: React.FC<ClientProfileProps> = ({
  rating,
  clientCondition,
  setRating,
  setClientCondition,
  readOnly,
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
              value={rating}
              max={3}
              onChange={(event, value) => {
                if (!readOnly) {
                  field.onChange(value);
                  setRating(value || 0);
                }
              }}
              readOnly={readOnly}
            />
          )}
        />
      </Box>
      <Box sx={styles.clientCondition}>
        <Typography variant="subtitle1">Condição do Cliente</Typography>
        <Box sx={styles.clientConditionButtonBox}>
          <Button
            variant="outlined"
            color="success"
            sx={{
              ...styles.clientConditionButton,
              ...(clientCondition === 'normal' && {
                backgroundColor: 'green',
                border: 'none',
                color: 'white',
              }),
            }}
            disabled={readOnly}
            onClick={() => {
              if (!readOnly) {
                setClientCondition('normal');
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
              ...(clientCondition === 'especial' && {
                backgroundColor: '#FFD700',
                border: 'none',
                color: 'black',
              }),
            }}
            disabled={readOnly}
            onClick={() => {
              if (!readOnly) {
                setClientCondition('especial');
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
              ...(clientCondition === 'suspenso' && {
                backgroundColor: 'red',
                border: 'none',
                color: 'white',
              }),
            }}
            disabled={readOnly}
            onClick={() => {
              if (!readOnly) {
                setClientCondition('suspenso');
              }
            }}
          >
            Suspenso
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientProfile;
