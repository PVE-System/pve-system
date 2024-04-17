'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';

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
      <Box
        sx={{
          backgroundColor: '#2A2E30',
          border: '1px solid white',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: '20px',
            '@media (max-width: 800px)': {
              alignItems: 'center',
            },
          }}
        >
          {/* Grupo 1 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#2A2E30',
              border: '1px solid white',
              borderRadius: '10px',
              padding: '20px',
              width: '30%',
              height: '500px',
              '@media (max-width: 800px)': {
                width: '100%',
                height: '450px',
                border: 'none',
                borderRadius: '0px',
                borderBottom: '3px solid white',
              },
            }}
          >
            {/* Campo para inserir a logomarca */}
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
                style={{
                  borderRadius: '50%',
                  cursor: 'pointer',
                  marginBottom: '50px',
                }}
              />
            </label>
            {/* Inputs */}
            <Box
              sx={{
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'white' }}>
                Status:
              </Typography>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Rating
                    sx={{
                      fontSize: '32px', // Define o tamanho da fonte para o Rating
                      '@media (max-width: 800px)': {
                        fontSize: '24px',
                      },
                    }}
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
            <Box
              sx={{
                width: '100%',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'white' }}>
                Cliente Especial:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Controller
                  name="clienteEspecial"
                  control={control}
                  render={({ field }) => (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '5px',
                        marginBottom: '20px',
                        width: '100%',
                        '@media (max-width: 800px)': {
                          width: '80%',
                        },
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="success"
                        sx={{
                          fontSize: '12px',
                          '@media (max-width: 800px)': {
                            fontSize: '10px',
                          },
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
                          fontSize: '12px',
                          '@media (max-width: 800px)': {
                            fontSize: '10px',
                          },
                          ...(field.value === 'especial' && {
                            backgroundColor: 'yellow',
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
                          fontSize: '12px',
                          '@media (max-width: 800px)': {
                            fontSize: '10px',
                          },
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
          </Box>

          {/* Grupo 2 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '70%',
              '@media (max-width: 800px)': {
                width: '100%',
              },
            }}
          >
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
                <Typography variant="subtitle1" sx={{ color: 'white' }}>
                  {label}
                </Typography>
                <Controller
                  name={label.toLowerCase().replace(/\s+/g, '')}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="filled"
                      sx={{ marginBottom: '10px', width: '100%' }}
                    />
                  )}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Botão Concluir Cadastro */}
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={{
            marginTop: '20px',
            alignSelf: 'flex-end',
            '@media (max-width: 800px)': {
              alignSelf: 'center',
            },
          }}
        >
          Concluir Cadastro
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterClient;
