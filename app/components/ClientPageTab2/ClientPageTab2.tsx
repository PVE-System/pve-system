'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTab2/styles';
import { useRouter } from 'next/navigation';

interface ClientPageTab2Props {
  clientId: string;
  readOnly?: boolean;
}

const fieldLabels: { [key: string]: string } = {
  commercial: 'Comercial',
  marketing: 'Marketing',
  invoicing: 'Faturamento',
  cables: 'Cabos',
  financial: 'Financeiro',
  invoice: 'Nota Fiscal',
};

const ClientPageTab2: React.FC<ClientPageTab2Props> = ({
  clientId,
  readOnly = false,
}) => {
  const { handleSubmit, control, setValue } = useForm();
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>(null);
  const [clientData, setClientData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!clientId) return;

    console.log('Fetching client data for ID:', clientId);

    const fetchClientData = async () => {
      try {
        const clientResponse = await fetch(
          `/api/getClient/[id]?id=${clientId}`,
        );
        if (!clientResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const clientData = await clientResponse.json();
        setClientData(clientData);

        const salesResponse = await fetch(
          `/api/getSalesInformation/[id]?id=${clientId}`,
        );
        if (salesResponse.ok) {
          const salesData = await salesResponse.json();
          setSalesData(salesData);

          Object.keys(salesData).forEach((key) => {
            setValue(key, salesData[key]);
          });
        } else if (salesResponse.status === 404) {
          console.warn(
            'Sales information not found, proceeding with empty data.',
          );
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Error fetching client or sales data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const requestData = { ...data, clientId };

      let response;
      if (salesData) {
        // Atualizar se os dados de vendas já existem
        response = await fetch(`/api/updateSalesInformation?id=${clientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
      } else {
        // Criar se os dados de vendas não existem
        response = await fetch(`/api/registerSalesInformation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Sales information processed:', result);

      // Redirecionar o usuário após o sucesso
      router.push(`/clientPage?id=${clientId}`);
    } catch (error) {
      console.error('Error processing sales information:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Box sx={styles.boxContent}>
      <ClientProfile
        rating={clientData?.rating}
        clientCondition={clientData?.clientCondition}
        companyName={clientData?.companyName}
        corfioCode={clientData?.corfioCode}
        onRatingChange={(rating) => setValue('rating', rating)}
        onConditionChange={(condition) =>
          setValue('clientCondition', condition)
        }
        readOnly={readOnly}
      />
      <Box sx={styles.boxCol2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {Object.keys(fieldLabels).map((key) => (
            <Box key={key}>
              <Typography variant="subtitle1">{fieldLabels[key]}</Typography>
              <Controller
                name={key}
                control={control}
                defaultValue={salesData ? salesData[key] || '' : ''}
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    minRows={3}
                    maxRows={6}
                    variant="filled"
                    sx={styles.inputsCol2}
                    InputProps={{ style: { minHeight: '150px' } }}
                    disabled={readOnly}
                  />
                )}
              />
            </Box>
          ))}
          {!readOnly && (
            <Box sx={styles.boxButton}>
              <Button type="submit" variant="contained" sx={styles.editButton}>
                Atualizar Informações
              </Button>
            </Box>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default ClientPageTab2;
