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
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Biblioteca para manipulação de cookies no frontend
import { mt } from 'date-fns/locale';

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
  const { handleSubmit, control, setValue } = useForm();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [salesData, setSalesData] = useState<any>(null);
  const [clientData, setClientData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!clientId) return;

    const fetchClientData = async () => {
      try {
        const clientResponse = await fetch(`/api/getClient/${clientId}`);
        if (!clientResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const clientData = await clientResponse.json();
        setClientData(clientData);

        const salesResponse = await fetch(
          `/api/getSalesInformation/${clientId}`,
        );
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

    fetchClientData();
  }, [clientId, setValue]);

  const onSubmit = async (data: any) => {
    setIsUpdating(true); // Inicia o carregamento
    try {
      const userId = Cookies.get('userId');
      if (!userId) {
        throw new Error('User ID is missing');
      }

      const requestData = { ...data, clientId, userId: Number(userId) };

      let response;
      if (salesData) {
        response = await fetch(`/api/updateSalesInformation?id=${clientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
      } else {
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

      // Atualiza o estado salesData com os dados mais recentes, incluindo updatedAt e userName
      setSalesData((prevData: any) => ({
        ...prevData,
        ...requestData,
        updatedAt: new Date(), // Atualiza o estado com a data e hora atual
        userName: result.userName, // Nome do usuário retornado da API
      }));

      setIsUpdating(false); // Finaliza o carregamento
      // Você pode decidir não redirecionar, ou apenas fornecer um feedback visual ao usuário
    } catch (error) {
      console.error('Error processing sales information:', error);
      setIsUpdating(false); // Finaliza o carregamento mesmo em caso de erro
      // Adicionar uma mensagem de erro aqui, se desejar
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
        {!readOnly && (
          <Box sx={styles.boxButton}>
            <Button
              type="button"
              variant="contained"
              sx={styles.editButton}
              onClick={handleSubmit(onSubmit)}
              disabled={isUpdating} // Desabilitar o botão enquanto está carregando
            >
              {isUpdating ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Atualizar Informações'
              )}
            </Button>
          </Box>
        )}
        <Box sx={{ marginTop: '30px' }}>
          <Typography variant="caption">
            {
              salesData && salesData.updatedAt && salesData.userName
                ? `Última atualização: ${formatDate(salesData.updatedAt)} por ${salesData.userName}`
                : '' /* ' Informações sobre pedidos ainda não foram atualizadas' */
            }
          </Typography>
        </Box>
      </Box>
      <Box sx={styles.boxCol2}>
        <form>
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
        </form>
      </Box>
    </Box>
  );
};

export default ClientPageTabSalesInfos;
