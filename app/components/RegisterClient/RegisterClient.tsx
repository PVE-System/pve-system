'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  MenuItem,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';

import styles from './styles';

const RegisterClient: React.FC = () => {
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

  // Aqui devemos criar a logica para lidar com os dados do formulário
  const onSubmit = (data: any) => {
    console.log(data);
    const formData = getValues();
    console.log(formData);
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
              'Contato na Empresa',
              'Contato Financeiro',
              'Vendedor Responsável',
              'Porte da Empresa', // Novo campo adicionado
              'Cliente Possui loja própria', // Novo campo adicionado
              'Cliente JSM',
              'Incluído pelo JSM',
              'Contribuinte ICMS',
              'Transporte entra',
              'Qual a localização da empresa',
              'Segmento de Mercado e Natureza Jurídica',
            ].map((label) => (
              <Box key={label}>
                <Typography variant="subtitle1">{label}</Typography>
                <Controller
                  name={label.toLowerCase().replace(/\s+/g, '')}
                  control={control}
                  render={({ field }) => {
                    if (label === 'Porte da Empresa') {
                      return (
                        <TextField
                          {...field}
                          select
                          variant="filled"
                          style={styles.inputsCol2}
                        >
                          <MenuItem value="grande">Grande</MenuItem>
                          <MenuItem value="medio">Médio</MenuItem>
                          <MenuItem value="pequeno">Pequeno</MenuItem>
                        </TextField>
                      );
                    } else if (
                      label === 'Cliente Possui loja própria' ||
                      label === 'Cliente JSM' ||
                      label === 'Incluído pelo JSM' ||
                      label === 'Contribuinte ICMS'
                    ) {
                      return (
                        <TextField
                          {...field}
                          select
                          variant="filled"
                          sx={styles.inputsCol2}
                        >
                          <MenuItem value="sim">Sim</MenuItem>
                          <MenuItem value="nao">Não</MenuItem>
                        </TextField>
                      );
                    } else if (label === 'Transporte entra') {
                      return (
                        <TextField
                          {...field}
                          select
                          variant="filled"
                          sx={styles.inputsCol2}
                        >
                          <MenuItem value="carreta">Carreta</MenuItem>
                          <MenuItem value="truck">Truck</MenuItem>
                          <MenuItem value="ambos">Ambos</MenuItem>
                          <MenuItem value="nenhum">Nenhum</MenuItem>
                        </TextField>
                      );
                    } else if (label === 'Localização da empresa') {
                      return (
                        <TextField
                          {...field}
                          select
                          variant="filled"
                          sx={styles.inputsCol2}
                        >
                          <MenuItem value="centro">Centro</MenuItem>
                          <MenuItem value="localidadeRural">
                            Localidade Rural
                          </MenuItem>
                        </TextField>
                      );
                    } else if (
                      label === 'Segmento de Mercado e Natureza Jurídica'
                    ) {
                      return (
                        <TextField
                          {...field}
                          select
                          variant="filled"
                          sx={styles.inputsCol2}
                        >
                          <MenuItem value="1">Atacado</MenuItem>
                          <MenuItem value="2">Varejo</MenuItem>
                          <MenuItem value="3">Industrialização</MenuItem>
                          <MenuItem value="4">Produtor rural</MenuItem>
                          <MenuItem value="5">Instaladora</MenuItem>
                          <MenuItem value="6">Pessoa jurídica cont</MenuItem>
                          <MenuItem value="7">Pessoa física não cont</MenuItem>
                          <MenuItem value="8">Construtora</MenuItem>
                          <MenuItem value="9">PJ Não cont</MenuItem>
                          <MenuItem value="10">Atacarejo</MenuItem>
                        </TextField>
                      );
                    } else {
                      return (
                        <TextField
                          {...field}
                          variant="filled"
                          sx={styles.inputsCol2}
                        />
                      );
                    }
                  }}
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
