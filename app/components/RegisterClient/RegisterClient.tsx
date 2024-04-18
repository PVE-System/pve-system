'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';

import styles from './styles';

const RegisterClient: React.FC = () => {
  const { handleSubmit, control } = useForm();
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

  const onSubmit = (data: any) => {
    console.log(data); // Aqui você pode lidar com os dados do formulário
  };

  return (
    <Container maxWidth="lg">
      <Box sx={styles.container}>
        <Box sx={styles.boxContent}>
          {/* Grupo 1 - Imagem e status */}
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

          {/* Grupo 2 */}
          <Box sx={styles.boxCol2}>
            {/* Labels e Inputs */}
            {[
              'Nome da empresa',
              'CNPJ/CPF',
              'CEP',
              'Endereço',
              'Número do local',
              'Bairro',
              'Cidade',
              'Estado',
              'Código Corfio',
              'Fone',
              'E-mail',
              'Redes Sociais',
              'Contato na empresa',
              'Vendedor Responsável',
            ].map((label) => (
              <Box key={label}>
                <Typography variant="subtitle1">{label}</Typography>
                <Controller
                  name={label.toLowerCase().replace(/\s+/g, '')}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="filled"
                      sx={styles.inputsCol2}
                    />
                  )}
                />
              </Box>
            ))}
          </Box>
        </Box>
        {/* Concluir Cadastro */}
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={styles.registerButton}
        >
          Concluir Cadastro
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterClient;
