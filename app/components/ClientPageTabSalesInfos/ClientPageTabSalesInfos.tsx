'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTabSalesInfos/styles';
import Cookies from 'js-cookie'; // Biblioteca para manipulação de cookies no frontend
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';

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
  const [deletingFields, setDeletingFields] = useState<{
    [key: string]: boolean;
  }>({});

  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>(null);
  const [clientData, setClientData] = useState<any>(null);

  const fetchClientData = useCallback(async () => {
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
  }, [clientId, setValue]);

  useEffect(() => {
    if (!clientId) return;
    fetchClientData();
  }, [clientId, fetchClientData]);

  const handleFieldUpdate = async (fieldName: string) => {
    setUpdatingFields((prev) => ({ ...prev, [fieldName]: true }));

    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        throw new Error('User ID is missing');
      }

      const fieldValue = getValues(fieldName);

      const requestData = {
        [fieldName]: fieldValue || '*',
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
        [fieldName]: fieldValue || '*', // Atualiza o campo que foi modificado
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

  const handleDeleteField = async (fieldName: string) => {
    setDeletingFields((prev) => ({ ...prev, [fieldName]: true })); // Indica que o campo está em processo de deleção

    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        throw new Error('User ID is missing');
      }

      const requestData = {
        clientId,
        userId: Number(userId),
        fieldName, // Nome do campo a ser excluído
      };

      const response = await fetch('/api/deleteSalesInformation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Atualiza os dados após a exclusão
      await fetchClientData();
    } catch (error) {
      console.error('Error deleting field:', error);
    } finally {
      setDeletingFields((prev) => ({ ...prev, [fieldName]: false })); // Remove o estado de carregamento
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
                <Box sx={styles.boxIconsAndName}>
                  <Box sx={styles.boxIcons}>
                    <Tooltip title="Atualizar Campo">
                      <IconButton
                        sx={styles.IconUpdate}
                        onClick={() => handleFieldUpdate(key)}
                        disabled={updatingFields[key]}
                      >
                        {updatingFields[key] ? (
                          <CircularProgress size={24} />
                        ) : (
                          <UpdateIcon />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Limpar Campo">
                      <IconButton
                        sx={styles.iconDelete}
                        onClick={() => handleDeleteField(key)}
                        disabled={deletingFields[key]}
                      >
                        {deletingFields[key] ? (
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {salesData &&
                    salesData[key] !== '*' &&
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
