import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTab1/styles';
import { jsPDF } from 'jspdf';

interface ClientPageTab1Props {
  clientId: string;
  readOnly?: boolean; // Propriedade opcional para definir se o formulário é apenas leitura
}

function onSubmitEdit(clientId: string) {
  window.location.href = `/clientPage/editClient?id=${clientId}`; // Redirecionar para edição do cliente
}

const ClientPageTab1: React.FC<ClientPageTab1Props> = ({
  clientId,
  readOnly = false,
}) => {
  const { handleSubmit, control, getValues, setValue } = useForm(); // Hooks do react-hook-form para gerenciar o formulário
  const [clientData, setClientData] = useState<any>(null); // Estado para armazenar os dados do cliente
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    if (!clientId) return;

    console.log('Fetching client data for ID:', clientId);

    fetch(`/api/getClient/[id]?id=${clientId}`) // Busca os dados do cliente da API
      .then((response) => {
        if (!response.ok) {
          console.error('Network response was not ok');
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Client data received:', data);
        setClientData(data); // Armazena os dados do cliente no estado
        setLoading(false);

        // Preenche os valores do formulário com os dados do cliente
        Object.keys(data).forEach((key) => {
          setValue(key, data[key]);
        });
      })
      .catch((error) => {
        console.error('Error fetching client data:', error);
        setLoading(false); // Define loading como falso em caso de erro
      });
  }, [clientId, setValue]);

  const onSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    const formData = getValues(); // Obtém os valores atuais do formulário
    console.log('Current form data:', formData);
  };

  // Mapeamento dos nomes dos campos do banco de dados para nomes mais amigáveis
  const fieldLabels: { [key: string]: string } = {
    companyName: 'Nome da empresa',
    cnpj: 'CNPJ',
    cpf: 'CPF',
    cep: 'CEP',
    address: 'Endereço',
    locationNumber: 'Número do local',
    district: 'Bairro',
    city: 'Cidade',
    state: 'Estado',
    corfioCode: 'Código Corfio',
    phone: 'Fone',
    email: 'E-mail',
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
    companyLocation: 'Localização da empresa',
    marketSegmentNature: 'Segmento de Mercado e Natureza Jurídica',
    rating: 'Status de Atividade',
    clientCondition: 'Condição do Cliente',
  };

  //Start Export

  const exportPDF = () => {
    const doc = new jsPDF(); // Cria uma nova instância do jsPDF

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhes sobre o cadastro do cliente:', 10, 10);
    doc.setFont('helvetica', 'normal'); // Volta para o estilo de fonte normal

    let yPosition = 20;

    // Adiciona os detalhes do cliente ao PDF
    Object.keys(clientData).forEach((key) => {
      if (key === 'id' || key === 'createdAt') {
        return; // Ignora os campos 'id' e 'createdAt'
      }

      const label = fieldLabels[key] || key;
      const value = clientData[key];

      doc.text(`${label}: ${value}`, 10, yPosition);
      yPosition += 10;
    });

    doc.save(`Cadastro cliente_${clientId}.pdf`); // Salva o PDF
  };

  //End Export

  if (loading) {
    return <p>Loading...</p>; // Exibe uma mensagem de carregamento
  }

  if (!clientData) {
    return (
      <p>
        Client not found. Please check if the client ID is correct and the API
        is returning the expected data.
      </p>
    ); // Exibe uma mensagem de erro se os dados do cliente não forem encontrados
  }

  // Definição dos campos do formulário vinculando com o nome das propriedade da tabela no db
  const formFields = [
    { label: 'Nome da empresa', name: 'companyName' },
    { label: 'CNPJ/CPF', name: 'cnpj' },
    { label: 'CPF', name: 'cpf' },
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
          companyName={clientData?.companyName} // Pass companyName
          corfioCode={clientData?.corfioCode} // Pass corfioCode
          onRatingChange={(rating) => setValue('rating', rating)}
          onConditionChange={(condition) =>
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
          <Box sx={styles.boxButton}>
            <Button
              type="button"
              variant="contained"
              onClick={exportPDF}
              sx={styles.exportButton}
            >
              Exportar PDF
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={() => onSubmitEdit(clientId)}
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
