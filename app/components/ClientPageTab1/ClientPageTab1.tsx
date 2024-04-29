'use client';

import React from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTab1/styles';

const ClientPageTab1: React.FC = () => {
  const { handleSubmit, control, getValues } = useForm();

  // Aqui devemos criar a logica para lidar editar e deletar clientes
  const onSubmit = (data: any) => {
    console.log(data);
    const formData = getValues();
    console.log(formData);
  };

  return (
    <Box>
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
            'Porte da Empresa',
            'Cliente Possui loja própria',
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
                        <MenuItem value="localidadeRural">Área Rural</MenuItem>
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
      <Box sx={styles.boxButton}>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={styles.exportButton}
        >
          Exportar PDF
        </Button>

        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={styles.editButton}
        >
          Editar
        </Button>
      </Box>
    </Box>
  );
};

export default ClientPageTab1;
