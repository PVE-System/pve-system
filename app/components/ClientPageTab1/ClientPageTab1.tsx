import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

import { useForm, Controller } from 'react-hook-form';
import NextLink from 'next/link';
import styles from './styles';

import ClientProfile from '@/app/components/ProfileClient/ProfileClient';

const ClientPageTab1: React.FC = () => {
  const { handleSubmit, control, getValues } = useForm();

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
          {/* Grupo 1 - Imagem e status do cliente. Col1 */}
          <ClientProfile />
          {/* Grupo 2 - formulário de cadastro */}
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
              'Localização da empresa',
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
                            Área Rural
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
          component={NextLink}
          href="/registerSuccess"
          /*  onClick={handleSubmit(onSubmit)} */
          sx={styles.registerButton}
        >
          Concluir Cadastro
        </Button>
      </Box>
    </Container>
  );
};

export default ClientPageTab1;
