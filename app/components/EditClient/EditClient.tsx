'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation'; // Usar o roteador de navegação do cliente
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTab1/styles';

interface ClientEditPageProps {}

const ClientEditPage: React.FC<ClientEditPageProps> = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');

  const router = useRouter();
  const { handleSubmit, control, getValues, setValue } = useForm();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    console.log('Fetching client data for ID:', clientId);

    fetch(`/api/getClient/[id]?id=${clientId}`)
      .then((response) => {
        if (!response.ok) {
          console.error('Network response was not ok');
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Client data received:', data);
        setClientData(data);
        setLoading(false);

        // Preencher os valores do formulário com os dados do cliente
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
    console.log('Submitting data:', data); // Log the data before submission
    try {
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

      const result = await response.json();
      console.log('Client data updated successfully:', result);
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

      const result = await response.json();
      console.log('Client deleted successfully:', result);
      router.push(`/dashboard`); // Redirecionar para a página de lista de clientes após a exclusão
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

  // Definição dos campos do formulário
  const formFields = [
    { label: 'Nome da empresa', name: 'companyName' },
    { label: 'CNPJ/CPF', name: 'cnpj' },
    { label: 'CEP', name: 'cep' },
    { label: 'Endereço', name: 'address' },
    { label: 'Número do local', name: 'locationNumber' },
    { label: 'Bairro', name: 'district' },
    { label: 'Cidade', name: 'city' },
    { label: 'Estado', name: 'state' },
    { label: 'Código Corfio', name: 'corfioCode' },
    { label: 'Fone', name: 'phone' },
    { label: 'E-mail', name: 'email' },
    { label: 'Redes Sociais', name: 'socialMedia' },
    { label: 'Contato na Empresa', name: 'contactAtCompany' },
    { label: 'Contato Financeiro', name: 'financialContact' },
    { label: 'Vendedor Responsável', name: 'responsibleSeller' },
    {
      label: 'Porte da Empresa',
      name: 'companySize',
      type: 'select',
      options: ['pequeno', 'médio', 'grande'],
    },
    {
      label: 'Possui Loja Própria',
      name: 'hasOwnStore',
      type: 'select',
      options: ['sim', 'não'],
    },
    {
      label: 'Cliente JSM',
      name: 'isJSMClient',
      type: 'select',
      options: ['sim', 'não'],
    },
    {
      label: 'Incluído pelo JSM',
      name: 'includedByJSM',
      type: 'select',
      options: ['sim', 'não'],
    },
    {
      label: 'Contribuinte ICMS',
      name: 'icmsContributor',
      type: 'select',
      options: ['sim', 'não'],
    },
    {
      label: 'Transporte entra',
      name: 'transportationType',
      type: 'select',
      options: ['carreta', 'truck', 'ambos', 'nenhum'],
    },
    {
      label: 'Localização da empresa',
      name: 'companyLocation',
      type: 'select',
      options: ['área rural', 'centro'],
    },
    {
      label: 'Segmento de Mercado e Natureza Jurídica',
      name: 'marketSegmentNature',
      type: 'select',
      options: [
        'atacado',
        'varejo',
        'industrialização',
        'produtor rural',
        'instaladora',
        'pessoa jurídica cont',
        'pessoa física não cont',
        'construtora',
        'pj não cont',
        'atacarejo',
      ],
    },
  ];

  return (
    <Box>
      <Box sx={styles.boxContent}>
        {/* Grupo 1 - Imagem e status do cliente. Col1 */}
        <ClientProfile
          rating={clientData.rating}
          clientCondition={clientData.clientCondition}
          onRatingChange={(rating) => setValue('rating', rating)}
          onConditionChange={(condition) =>
            setValue('clientCondition', condition)
          }
          readOnly={false} // Permitir edição
        />
        {/* Grupo 2 - formulário de cadastro */}
        <Box sx={styles.boxCol2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {formFields.map(({ label, name, type, options }) => (
              <Box key={name}>
                <Typography variant="subtitle1">{label}</Typography>
                <Controller
                  name={name}
                  control={control}
                  defaultValue={clientData[name] || ''} // Certifique-se de que o valor padrão seja uma string vazia
                  render={({ field }) => {
                    if (type === 'select' && options) {
                      return (
                        <TextField
                          {...field}
                          select
                          variant="filled"
                          sx={styles.inputsCol2}
                          value={field.value || ''} // Defina o valor atual ou uma string vazia
                          InputProps={{
                            readOnly: false, // Permitir edição
                          }}
                        >
                          {options.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </MenuItem>
                          ))}
                        </TextField>
                      );
                    }
                    return (
                      <TextField
                        {...field}
                        variant="filled"
                        sx={styles.inputsCol2}
                        InputProps={{
                          readOnly: false, // Permitir edição
                        }}
                      />
                    );
                  }}
                />
              </Box>
            ))}
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
