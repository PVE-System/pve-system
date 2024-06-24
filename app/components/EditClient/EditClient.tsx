import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
/* import styles from '@/app/components/ClientPageTab1/styles'; */
import styles from '@/app/components/EditClient/styles';

const fieldLabels: { [key: string]: string } = {
  companyName: 'Nome da Empresa ou Pessoa',
  cnpj: 'CNPJ',
  cpf: 'CPF',
  cep: 'CEP',
  address: 'Rua',
  locationNumber: 'Número',
  district: 'Bairro',
  city: 'Cidade',
  state: 'Estado',
  corfioCode: 'Código Corfio',
  phone: 'Telefone/fax',
  email: 'Email',
  socialMedia: 'Redes Sociais',
  contactAtCompany: 'Contato na Empresa',
  financialContact: 'Contato Financeiro',
  responsibleSeller: 'Vendedor Responsável',
  companySize: 'Porte da Empresa',
  hasOwnStore: 'Possui Loja Própria',
  isJSMClient: 'Cliente JSM',
  includedByJSM: 'Incluído pelo JSM',
  icmsContributor: 'Contribuinte ICMS',
  transportationType: 'Transporte entra',
  companyLocation: 'Localização da Empresa',
  marketSegmentNature: 'Segmento de Mercado e Natureza Jurídica',
  rating: 'Status',
  clientCondition: 'Condição do Cliente',
};

const selectOptions: { [key: string]: string[] } = {
  companySize: ['pequeno', 'médio', 'grande'],
  hasOwnStore: ['sim', 'não'],
  isJSMClient: ['sim', 'não'],
  includedByJSM: ['sim', 'não'],
  icmsContributor: ['sim', 'não'],
  transportationType: ['carreta', 'truck', 'ambos', 'nenhum'],
  companyLocation: ['área rural', 'centro'],
  marketSegmentNature: [
    'atacado',
    'varejo',
    'industrialização',
    'produtor rural',
    'instaladora',
    'pessoa jurídica cont',
    'pessoa física não cont',
    'construtora',
    'pJ Não cont',
    'atacarejo',
  ],
};

const ClientEditPage: React.FC = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');

  const router = useRouter();
  const { handleSubmit, control, setValue, watch } = useForm();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    fetch(`/api/getClient/[id]?id=${clientId}`)
      .then((response) => response.json())
      .then((data) => {
        setClientData(data);
        setLoading(false);

        Object.keys(data).forEach((key) => {
          setValue(key, data[key]);
        });
      })
      .catch((error) => {
        console.error('Error fetching client data:', error);
        setLoading(false);
      });
  }, [clientId, setValue]);

  const onSubmit = async (data: any) => {
    try {
      delete data.id;
      delete data.createdAt;

      const response = await fetch(`/api/updateClient?id=${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to update client data');
      }

      router.push(`/clientPage?id=${clientId}`);
    } catch (error) {
      console.error('Error updating client data:', error);
    }
  };

  const onDelete = async () => {
    try {
      const response = await fetch(`/api/deleteClient?id=${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to delete client');
      }

      router.push(`/dashboard`);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!clientId) {
    return <div>Client ID not provided</div>;
  }

  if (!clientData) {
    return (
      <p>
        Client not found. Please check if the client ID is correct and the API
        is returning the expected data.
      </p>
    );
  }

  return (
    <Box sx={styles.contentTabs}>
      <Box sx={styles.boxContent}>
        <ClientProfile
          rating={watch('rating')}
          clientCondition={watch('clientCondition')}
          companyName={clientData?.companyName}
          corfioCode={clientData?.corfioCode}
          onRatingChange={(rating) => setValue('rating', rating)}
          onConditionChange={(condition) =>
            setValue('clientCondition', condition)
          }
          readOnly={false}
        />
        <Box sx={styles.boxCol2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {Object.keys(clientData).map((key) => {
              if (key !== 'id' && key !== 'createdAt') {
                // Ajuste aqui
                return (
                  <Box key={key}>
                    <Typography variant="subtitle1">
                      {fieldLabels[key] || key}
                    </Typography>
                    <Controller
                      name={key}
                      control={control}
                      defaultValue={clientData[key] || ''}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          variant="filled"
                          sx={styles.inputsCol2}
                          InputProps={{
                            readOnly: false,
                          }}
                          select={key in selectOptions}
                        >
                          {key in selectOptions &&
                            selectOptions[key].map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                        </TextField>
                      )}
                    />
                  </Box>
                );
              }
              return null;
            })}
            <Box sx={styles.boxButton}>
              <Button
                type="button"
                variant="contained"
                sx={styles.deleteButton}
                onClick={onDelete}
              >
                Deletar
              </Button>
              <Button type="submit" variant="contained" sx={styles.editButton}>
                Salvar
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientEditPage;
