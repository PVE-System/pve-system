import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTabInfos/styles';
import { jsPDF } from 'jspdf';

interface ClientPageTabInfosProps {
  clientId: string;
  readOnly?: boolean; // Propriedade opcional para definir se o formulário é apenas leitura
}

function onSubmitEdit(clientId: string) {
  window.location.href = `/clientPage/editClient?id=${clientId}`; // Redirecionar para edição do cliente
}

const ClientPageTabInfos: React.FC<ClientPageTabInfosProps> = ({
  clientId,
  readOnly = false,
}) => {
  const { handleSubmit, control, getValues, setValue } = useForm(); // Hooks do react-hook-form para gerenciar o formulário
  const [clientData, setClientData] = useState<any>(null); // Estado para armazenar os dados do cliente
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [buttonText, setButtonText] = useState('Excel');

  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      console.error('Invalid client ID:', clientId);
      return;
    }

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://pve-system.vercel.app'
        : 'http://localhost:3000';

    fetch(`${baseUrl}/api/getClient/${clientId}`)
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
    const formData = getValues(); // Obtém os valores atuais do formulário
    console.log('Current form data:', formData);
  };

  // Mapeamento dos nomes dos campos do banco de dados para nomes mais amigáveis
  const fieldLabels: { [key: string]: string } = {
    companyName: 'Nome da Empresa ou Pessoa',
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
    stateRegistration: 'Inscrição Estadual',
    transportationType: 'Transporte entra',
    companyLocation: 'Localização da empresa',
    marketSegmentNature: 'Segmento de Mercado e Natureza Jurídica',
    rating: 'Status de Atividade',
    clientCondition: 'Condição do Cliente',
  };

  const handleChange = (name: string, value: string) => {
    setValue(name, value); // Armazena o valor sem modificações
  };

  //Start Export PDF

  const exportPDF = () => {
    const doc = new jsPDF(); // Cria uma nova instância do jsPDF

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(['PVE Representações - Cadastro de Cliente:'], 10, 10);

    doc.setFont('helvetica', 'normal');

    let yPosition = 20;

    // Adiciona os detalhes do cliente ao PDF
    Object.keys(clientData).forEach((key) => {
      if (
        key === 'id' ||
        key === 'createdAt' ||
        key === 'rating' ||
        key === 'clientCondition' ||
        key === 'imageUrl'
      ) {
        return;
      }

      const label = fieldLabels[key] || key;
      const value = clientData[key];

      doc.text(`${label}: ${value}`, 10, yPosition); // Mantém o valor original
      yPosition += 10;
    });

    doc.save(`PVE Representações-Cadastro de Cliente${clientId}.pdf`); // Salva o PDF
  };

  //End Export PDF

  //Start Export EXCEL

  const copyClientDataToClipboard = (clientData: { [key: string]: any }) => {
    // Exclui os campos irrelevantes para exportação
    const excludedFields = [
      'id',
      'createdAt',
      'rating',
      'clientCondition',
      'imageUrl',
    ];

    // Ordem das colunas no Excel do cliente
    const excelColumnOrder = [
      'cnpj',
      'corfioCode',
      'companyName',
      'cnpj',
      'address',
      'city',
      'cep',
      'state',
      '',
      'emailCommercial',
      'phone',
      'stateRegistration',
    ];

    // Organiza os dados na ordem das colunas do Excel
    const values = excelColumnOrder.map((key) => {
      if (excludedFields.includes(key)) return ''; // Ignora campos excluídos
      return clientData[key] || ''; // Retorna o valor do campo ou vazio se não houver
    });

    // Gera o conteúdo tabulado
    const tabulatedText = values.join('\t'); // Dados em uma linha, separados por tabulações

    // Copia para a área de transferência
    navigator.clipboard
      .writeText(tabulatedText)
      .then(() => {
        console.log('Dados do cliente copiados com sucesso!');
        setButtonText('Copiado'); // Altera o texto do botão para "Copiado"

        setTimeout(() => setButtonText('Excel'), 1500); // Volta para "Excel" após 2 segundos
      })
      .catch((error) => {
        console.error('Erro ao copiar os dados:', error);
        alert('Erro ao copiar os dados. Tente novamente.');
      });
  };

  //End Export EXCEL

  if (loading) {
    return (
      <Box sx={styles.loadComponent}>
        <CircularProgress />
      </Box>
    );
  }

  if (!clientData) {
    return (
      <p>
        Cliente não encontrado. Verifique se o ID do cliente está correto e se a
        API está retornando os dados esperados.
      </p>
    ); // Exibe uma mensagem de erro se os dados do cliente não forem encontrados
  }

  // Definição dos campos do formulário vinculando com o nome das propriedade da tabela no db
  const formFields = [
    { label: 'Nome da Empresa ou Pessoa', name: 'companyName' },
    { label: 'CNPJ', name: 'cnpj' },
    { label: 'CPF', name: 'cpf' },
    { label: 'CEP', name: 'cep' },
    { label: 'Rua', name: 'address' },
    { label: 'Número', name: 'locationNumber' },
    { label: 'Bairro', name: 'district' },
    { label: 'Cidade', name: 'city' },
    { label: 'Estado', name: 'state' },
    { label: 'Código Corfio', name: 'corfioCode' },
    { label: 'Telefone/fax', name: 'phone' },
    { label: 'Email Comercial', name: 'emailCommercial' },
    { label: 'Email Financeiro', name: 'emailFinancial' },
    { label: 'Email Xml', name: 'emailXml' },
    { label: 'Redes Sociais', name: 'socialMedia' },
    { label: 'Contato na Empresa', name: 'contactAtCompany' },
    { label: 'Contato Financeiro', name: 'financialContact' },
    { label: 'Responsável PVE', name: 'responsibleSeller' },
    {
      label: 'Porte da Empresa',
      name: 'companySize',
    },
    {
      label: 'Possui Loja Própria',
      name: 'hasOwnStore',
    },
    {
      label: 'Contribuinte ICMS',
      name: 'icmsContributor',
    },
    {
      label: 'Inscrição Estadual',
      name: 'stateRegistration',
    },
    {
      label: 'Transporte entra',
      name: 'transportationType',
    },
    {
      label: 'Localização da empresa',
      name: 'companyLocation',
    },
    {
      label: 'Segmento de Mercado e Natureza Jurídica',
      name: 'marketSegmentNature',
    },
  ];

  return (
    <Box>
      <Box sx={styles.boxContent}>
        {/* Grupo 1 - Imagem e status do cliente. Col1 */}
        <Box>
          <ClientProfile
            rating={clientData.rating}
            clientCondition={clientData.clientCondition}
            companyName={clientData?.companyName} // Pass companyName
            corfioCode={clientData?.corfioCode} // Pass corfioCode
            phone={clientData?.phone} // Pass phone
            emailCommercial={clientData?.emailCommercial} // Pass email
            onRatingChange={(rating) => setValue('rating', rating)}
            onConditionChange={(condition) =>
              setValue('clientCondition', condition)
            }
            readOnly={false} // Passando a propriedade readOnly
            imageUrl={clientData?.imageUrl}
            showTooltip={false} // Não mostra o Tooltip
            enableImageUpload={false}
          />
          <Box sx={styles.boxButton}>
            <Tooltip title={'Copiar dados para colar na planilha'}>
              <Button
                type="button"
                variant="contained"
                onClick={() => copyClientDataToClipboard(clientData)}
                sx={styles.exportExcelButton}
              >
                {buttonText}
              </Button>
            </Tooltip>
            <Tooltip title={'Exportar dados e gerar arquivo PDF'}>
              <Button
                type="button"
                variant="contained"
                onClick={exportPDF}
                sx={styles.exportButton}
              >
                PDF
              </Button>
            </Tooltip>
            <Tooltip title={'Editar cliente'}>
              <Button
                type="button"
                variant="contained"
                onClick={() => onSubmitEdit(clientId)}
                sx={styles.editButton}
              >
                Editar
              </Button>
            </Tooltip>
          </Box>
        </Box>
        {/* Grupo 2 - formulário de cadastro */}
        <Box sx={styles.boxCol2}>
          {/* map dos inputs sem select*/}
          {formFields.map(({ label, name }) => (
            <Box key={name}>
              <Typography variant="subtitle1">{label}</Typography>
              <Controller
                name={name}
                control={control}
                defaultValue={clientData[name] || ''}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="filled"
                    sx={styles.inputsCol2}
                    value={field.value || ''}
                    onChange={(e) => handleChange(name, e.target.value)}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ClientPageTabInfos;
