'use client';

import React from 'react';
import { Box, Button, FormControl, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTab2/styles';

interface ClientPageTab2Props {
  clientId: string;
}

const ClientPageTab2: React.FC<ClientPageTab2Props> = ({ clientId }) => {
  const { handleSubmit, control, getValues } = useForm();

  // Aqui devemos criar a logica para lidar com os dados do formulário
  const onSubmit = (data: any) => {
    console.log(data);
    const formData = getValues();
    console.log(formData);
  };

  return (
    <Box>
      <Box sx={styles.boxContent}>
        {/* Grupo 1 - Imagem e status do cliente. Col1 */}
        <ClientProfile
          readOnly={false}
          rating={0}
          clientCondition={''}
          setRating={function (rating: number): void {
            throw new Error('Function not implemented.');
          }}
          setClientCondition={function (condition: string): void {
            throw new Error('Function not implemented.');
          }}
        />
        {/* Grupo 2 - Infos sobre Pedidos.Col2 */}
        <Box sx={styles.boxCol2}>
          <FormControl onSubmit={handleSubmit(onSubmit)}>
            {[
              'Comercial',
              'Marketing',
              'Faturamento',
              'Cabos',
              'Financeiro',
              'Nota Fiscal',
            ].map((label, index) => (
              <Box key={index}>
                <Typography variant="subtitle1">{label}</Typography>
                <Controller
                  name={label.toLowerCase().replace(/\s+/g, '')}
                  control={control}
                  rules={{ maxLength: 1000 }} // Regra de validação para 1000 caracteres
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      minRows={3}
                      maxRows={6}
                      variant="filled"
                      sx={styles.inputsCol2}
                      InputProps={{
                        style: { minHeight: '150px' }, // Altura mínima do campo
                      }}
                    />
                  )}
                />
              </Box>
            ))}
          </FormControl>
          {/* End Grupo 2 */}
        </Box>
      </Box>
      <Box sx={styles.boxButton}>
        {/*         <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={styles.deleteButton}
        >
          Deletar
        </Button> */}
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

export default ClientPageTab2;
