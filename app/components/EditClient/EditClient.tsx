import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import {
  formatCPF,
  formatCNPJ,
  formatPhone,
  formatCEP,
} from '@/app/components/FormFormatter/FormFormatter';
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
  emailCommercial: 'Email Comercial',
  emailFinancial: 'Email Financeiro',
  emailXml: 'Email Xml',
  socialMedia: 'Redes Sociais',
  contactAtCompany: 'Contato na Empresa',
  financialContact: 'Contato Financeiro',
  responsibleSeller: 'Responsável PVE',
  companySize: 'Porte da Empresa',
  hasOwnStore: 'Possui Loja Própria',
  icmsContributor: 'Contribuinte ICMS',
  transportationType: 'Transporte entra',
  companyLocation: 'Localização da Empresa',
  marketSegmentNature: 'Segmento de Mercado e Natureza Jurídica',
  rating: 'Status de Atividade',
  clientCondition: 'Condição do Cliente',
};

const selectOptions: { [key: string]: string[] } = {
  companySize: ['Pequeno', 'Médio', 'Grande'],
  hasOwnStore: ['Sim', 'Não'],
  isJSMClient: ['Sim', 'Não'],
  includedByJSM: ['Sim', 'Não'],
  icmsContributor: ['Sim', 'Não'],
  transportationType: ['Carreta', 'Truck', 'Ambos', 'Nenhum'],
  companyLocation: ['Área Rural', 'Centro'],
  marketSegmentNature: [
    'Atacado',
    'Varejo',
    'Industrialização',
    'Produtor rural',
    'Instaladora',
    'Pessoa jurídica cont',
    'Pessoa física não cont',
    'Construtora',
    'PJ Não cont',
    'Atacarejo',
  ],
  state: [
    'Acre',
    'Alagoas',
    'Amapá',
    'Amazonas',
    'Bahia',
    'Ceará',
    'Distrito Federal',
    'Espírito Santo',
    'Goiás',
    'Maranhão',
    'Mato Grosso',
    'Mato Grosso do Sul',
    'Minas Gerais',
    'Pará',
    'Paraíba',
    'Paraná',
    'Pernambuco',
    'Piauí',
    'Rio de Janeiro',
    'Rio Grande do Norte',
    'Rio Grande do Sul',
    'Rondônia',
    'Roraima',
    'Santa Catarina',
    'São Paulo',
    'Sergipe',
    'Tocantins',
  ],
};

interface FormDataState {
  [key: string]: string;
}

interface EditClientProps {
  setFormData: React.Dispatch<React.SetStateAction<FormDataState>>;
}

const ClientEditPage: React.FC<EditClientProps> = ({ setFormData }) => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');

  const router = useRouter();
  const { handleSubmit, control, setValue, watch } = useForm();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    fetch(`/api/getClient/${clientId}`)
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
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
        <Box>
          <ClientProfile
            rating={watch('rating')}
            clientCondition={watch('clientCondition')}
            companyName={clientData?.companyName}
            corfioCode={clientData?.corfioCode}
            phone={clientData?.phone}
            emailCommercial={clientData?.emailCommercial}
            onRatingChange={(rating) => setValue('rating', rating)}
            onConditionChange={(condition) =>
              setValue('clientCondition', condition)
            }
            readOnly={false}
          />
          <Box sx={styles.boxButton}>
            <Button
              type="button"
              variant="contained"
              sx={styles.deleteButton}
              onClick={onDelete}
            >
              Deletar
            </Button>
            <Button
              type="button"
              variant="contained"
              sx={styles.editButton}
              onClick={handleSubmit(onSubmit)} // Use handleSubmit directly
            >
              Salvar
            </Button>
          </Box>
        </Box>
        <Box sx={styles.boxCol2}>
          <form>
            {Object.keys(clientData).map((key) => {
              if (key !== 'id' && key !== 'createdAt') {
                return (
                  <Box key={key}>
                    <Typography variant="subtitle1">
                      {fieldLabels[key] || key}
                    </Typography>
                    <Controller
                      name={key}
                      control={control}
                      defaultValue={clientData[key] || ''}
                      render={({ field }) => {
                        const handleFormattedChange = (
                          event: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >,
                        ) => {
                          const { name, value } = event.target;

                          let formattedValue = value;

                          if (name === 'cpf') {
                            formattedValue = formatCPF(value);
                          } else if (name === 'cnpj') {
                            formattedValue = formatCNPJ(value);
                          } else if (name === 'phone') {
                            formattedValue = formatPhone(value);
                          } else if (name === 'cep') {
                            formattedValue = formatCEP(value);
                          }

                          // Atualiza o valor formatado no estado
                          field.onChange(formattedValue);
                        };

                        return (
                          <TextField
                            {...field}
                            variant="filled"
                            sx={styles.inputsCol2}
                            InputProps={{
                              readOnly: false,
                            }}
                            onChange={handleFormattedChange} // Use a função que formata e atualiza o valor
                            select={key in selectOptions}
                          >
                            {key in selectOptions &&
                              selectOptions[key].map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                          </TextField>
                        );
                      }}
                    />
                  </Box>
                );
              }
              return null;
            })}
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientEditPage;
