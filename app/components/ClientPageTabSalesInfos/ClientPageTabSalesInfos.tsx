'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTabSalesInfos/styles';
import Cookies from 'js-cookie'; // Biblioteca para manipulação de cookies no frontend

interface ClientPageTabSalesInfosProps {
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

const ClientPageTabSalesInfos: React.FC<ClientPageTabSalesInfosProps> = ({
  clientId,
  readOnly = false,
}) => {
  const { handleSubmit, control, setValue, getValues } = useForm();
  const [updatingFields, setUpdatingFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>(null);
  const [clientData, setClientData] = useState<any>(null);

  const fetchClientData = async () => {
    try {
      const clientResponse = await fetch(`/api/getClient/${clientId}`);
      if (!clientResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const clientData = await clientResponse.json();
      setClientData(clientData);

      const salesResponse = await fetch(`/api/getSalesInformation/${clientId}`);
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setSalesData(salesData);

        Object.keys(salesData).forEach((key) => {
          setValue(key, salesData[key]);
        });
      }
    } catch (error) {
      console.error('Error fetching client or sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!clientId) return;
    fetchClientData();
  }, [clientId, setValue]);

  const handleFieldUpdate = async (fieldName: string) => {
    setUpdatingFields((prev) => ({ ...prev, [fieldName]: true }));

    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        throw new Error('User ID is missing');
      }

      const fieldValue = getValues(fieldName);

      const requestData = {
        [fieldName]: fieldValue || '...',
        clientId,
        userId: Number(userId),
      };

      const method = salesData && salesData[fieldName] ? 'PUT' : 'POST';
      const url =
        method === 'PUT'
          ? `/api/updateSalesInformation?id=${clientId}`
          : `/api/registerSalesInformation?id=${clientId}`;

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

      setSalesData((prevData: any) => ({
        ...prevData,
        [fieldName]: fieldValue || '...', // Atualiza o campo que foi modificado
        [`${fieldName}UpdatedAt`]: result.updatedAt,
        [`${fieldName}UpdatedBy`]: result.userName,
      }));

      // Chama a função para atualizar os dados após o POST ou PUT
      if (method === 'POST') {
        await fetchClientData(); // Atualiza os dados chamando o fetchClientData
      }
    } catch (error) {
      console.error('Error processing sales information:', error);
    } finally {
      setUpdatingFields((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.boxContent}>
      <Box>
        <ClientProfile
          rating={clientData?.rating}
          clientCondition={clientData?.clientCondition}
          companyName={clientData?.companyName}
          corfioCode={clientData?.corfioCode}
          phone={clientData?.phone}
          emailCommercial={clientData?.emailCommercial}
          onRatingChange={(rating) => setValue('rating', rating)}
          onConditionChange={(condition) =>
            setValue('clientCondition', condition)
          }
          readOnly={false}
          imageUrl={clientData?.imageUrl}
          enableImageUpload={false}
        />
      </Box>
      <Box sx={styles.boxCol2}>
        <form>
          {Object.keys(fieldLabels).map((key) => (
            <Box key={key} sx={{ marginBottom: 4 }}>
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
                    disabled={readOnly}
                    sx={{ width: '100%' }}
                  />
                )}
              />
              {!readOnly && (
                <Box
                  mt={1}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleFieldUpdate(key)}
                    disabled={updatingFields[key]}
                  >
                    {updatingFields[key] ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Atualizar'
                    )}
                  </Button>

                  {salesData &&
                    salesData[key] !== '...' &&
                    salesData[`${key}UpdatedBy`] && (
                      <Typography variant="caption">
                        Última atualização:{' '}
                        {formatDate(salesData[`${key}UpdatedAt`])} por{' '}
                        {salesData[`${key}UpdatedBy`] || 'Desconhecido'}
                      </Typography>
                    )}
                </Box>
              )}
            </Box>
          ))}
        </form>
      </Box>
    </Box>
  );
};

export default ClientPageTabSalesInfos;
