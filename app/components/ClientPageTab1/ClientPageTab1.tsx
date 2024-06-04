import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTab1/styles';

interface ClientPageTab1Props {
  clientId: string;
  readOnly?: boolean; // Adicionando a propriedade readOnly
}

const ClientPageTab1: React.FC<ClientPageTab1Props> = ({
  clientId,
  readOnly = false,
}) => {
  const { handleSubmit, control, getValues, setValue } = useForm();
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;

    console.log('Fetching client data for ID:', clientId);

    fetch(`/api/getClient?id=${clientId}`)
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

  const onSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    const formData = getValues();
    console.log('Current form data:', formData);
  };

  if (loading) {
    return <p>Loading...</p>;
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
      options: ['grande', 'medio', 'pequeno'],
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
          setRating={(rating) => setValue('rating', rating)}
          setClientCondition={(condition) =>
            setValue('clientCondition', condition)
          }
          readOnly={readOnly} // Passando a propriedade readOnly
        />
        {/* Grupo 2 - formulário de cadastro */}
        <Box sx={styles.boxCol2}>
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
                          readOnly: readOnly, // Desativa o campo quando readOnly é verdadeiro
                        }}
                        disabled={readOnly} // Desativa o campo quando readOnly é verdadeiro
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
                        readOnly: readOnly, // Desativa o campo quando readOnly é verdadeiro
                      }}
                      disabled={readOnly} // Desativa o campo quando readOnly é verdadeiro
                    />
                  );
                }}
              />
            </Box>
          ))}
          {/*           {!readOnly && (
            <Button onClick={handleSubmit(onSubmit)}>Salvar</Button> // Esconde o botão Salvar quando readOnly é verdadeiro
          )} */}
          <Box sx={styles.boxButton}>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              sx={styles.editButton}
            >
              Deletar
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
      </Box>
    </Box>
  );
};

export default ClientPageTab1;
