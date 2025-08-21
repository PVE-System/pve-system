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
import { User } from '@/app/db';
import { SalesQuote, salesQuotes } from '@/app/db/schema';

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
  const [salesData, setSalesData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [buttonText, setButtonText] = useState('Excel');
  const [localButtonText, setLocalButtonText] = useState('Local');
  const [businessGroups, setBusinessGroups] = useState<
    { id: number; name: string }[]
  >([]);
  const [users, setUsers] = useState<
    { operatorNumber: string; name: string }[]
  >([]);
  const [salesQuotes, setSalesQuotes] = useState<SalesQuote[]>([]);
  const [lastVisitData, setLastVisitData] = useState<{
    hasHistory: boolean;
    lastVisitConfirmedAt: string | null;
  } | null>(null);

  //Get Client Start

  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      console.error('Invalid client ID:', clientId);
      return;
    }

    fetch(`/api/getClient/${clientId}`)
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

  //Get Client End

  // Buscar os grupos empresariais
  useEffect(() => {
    const fetchBusinessGroups = async () => {
      try {
        const response = await fetch('/api/getAllBusinessGroups');
        if (!response.ok) throw new Error('Erro ao buscar grupos empresariais');
        const data = await response.json();
        setBusinessGroups(data.businessGroups);
      } catch (error) {
        console.error('Erro ao buscar grupos empresariais:', error);
        setBusinessGroups([]);
      }
    };

    fetchBusinessGroups();
  }, []);

  // Função para obter o nome do grupo empresarial
  const getBusinessGroupName = (businessGroupId: number) => {
    const group = businessGroups.find((group) => group.id === businessGroupId);
    return group ? group.name : 'Grupo não encontrado';
  };

  // Função para obter as cotações

  useEffect(() => {
    const fetchSalesQuotes = async () => {
      const clientId = clientData.id;
      const currentYear = new Date().getFullYear();

      try {
        const response = await fetch(
          `/api/getSalesQuotes?clientId=${clientId}&year=${currentYear}`,
        );
        if (!response.ok) throw new Error('Erro ao buscar cotações');

        const data = await response.json();
        setSalesQuotes(data.quotes); // ou outro estado conforme seu uso
      } catch (error) {
        console.error('Erro ao buscar cotações:', error);
      }
    };

    if (clientData?.id) fetchSalesQuotes(); // Evita fetch prematuro sem clientId
  }, [clientData]);

  //// Função para obter as cotações referente aos 3 ultimos anos
  async function fetchQuotesByClientLastThreeYears(clientId: number) {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;

    const response = await fetch(
      `/api/getSalesQuotesByYears?clientId=${clientId}&startYear=${startYear}`,
    );

    if (!response.ok) throw new Error('Erro ao buscar cotações');
    const data = await response.json();

    return data;
  }

  //Get salesInformation Start

  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      console.error('Invalid client ID:', clientId);
      return;
    }

    fetch(`/api/getSalesInformation/${clientId}`)
      .then((response) => {
        if (!response.ok) {
          console.error('Network response was not ok');
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Sales data received from API:', data); // Verifique os dados recebidos
        setSalesData(data); // Atualiza os dados de vendas
      })
      .catch((error) => {
        console.error('Error fetching sales data:', error);
      });
  }, [clientId]);

  //Get salesInformation END

  // Buscar histórico de visitas do cliente
  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      return;
    }

    const fetchVisitHistory = async () => {
      try {
        const response = await fetch(
          `/api/getVisitClientHistory?clientId=${clientId}`,
        );
        if (!response.ok) {
          console.error('Erro ao buscar histórico de visitas');
          return;
        }
        const data = await response.json();
        setLastVisitData(data);
      } catch (error) {
        console.error('Erro ao buscar histórico de visitas:', error);
      }
    };

    fetchVisitHistory();
  }, [clientId]);

  // Mapeamento dos nomes dos campos do banco de dados para nomes mais amigáveis
  const fieldLabels: { [key: string]: string } = {
    companyName: 'Nome da Empresa ou Pessoa',
    businessGroupId: 'Grupo Empresarial',
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
    whatsapp: 'WhatsApp',
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

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await fetch('/api/getAllUsers'); // Endpoint original
        if (!response.ok) throw new Error('Erro ao buscar usuários');
        const data = await response.json();

        // Filtrar usuários ativos no frontend
        const activeUsers = data.users.filter((user: User) => user.is_active);
        setUsers(activeUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários ativos:', error);
      }
    };

    fetchActiveUsers();
  }, []);

  //Start Export PDF. Esta Função teve seu uso adiado ou descontinuado, mas ficará comentado de backup.

  /* const exportPDF = () => {
    const doc = new jsPDF(); // Cria uma nova instância do jsPDF

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PVE Representações - Cadastro do Cliente:', 10, 10);

    doc.setFont('helvetica', 'normal');

    let yPosition = 20;

    // Função para obter o nome do responsável
    const getResponsibleName = (operatorNumber: string) => {
      const user = users.find((user) => user.operatorNumber === operatorNumber);
      return user ? `${user.operatorNumber} - ${user.name}` : operatorNumber;
    };

    // Função para obter o nome do grupo empresarial
    const getBusinessGroupName = (businessGroupId: number) => {
      const group = businessGroups.find(
        (group) => group.id === businessGroupId,
      );
      return group ? group.name : 'Grupo não encontrado';
    };

    // Renderiza o campo "Nome da Empresa ou Pessoa" (companyName)
    const companyNameLabel =
      fieldLabels['companyName'] || 'Nome da Empresa ou Pessoa';
    const companyNameValue = clientData['companyName'];
    doc.text(`${companyNameLabel}: ${companyNameValue}`, 10, yPosition);
    yPosition += 10;

    // Renderiza o campo "Grupo Empresarial" (businessGroupId)
    const businessGroupLabel =
      fieldLabels['businessGroupId'] || 'Grupo Empresarial';
    const businessGroupValue = getBusinessGroupName(
      clientData['businessGroupId'],
    );
    doc.text(`${businessGroupLabel}: ${businessGroupValue}`, 10, yPosition);
    yPosition += 10;

    // Adiciona os outros detalhes do cliente ao PDF
    Object.keys(clientData).forEach((key) => {
      if (
        key === 'id' ||
        key === 'createdAt' ||
        key === 'rating' ||
        key === 'clientCondition' ||
        key === 'imageUrl' ||
        key === 'companyName' || // Ignora companyName, pois já foi renderizado
        key === 'businessGroupId' // Ignora businessGroupId, pois já foi renderizado
      ) {
        return;
      }

      const label = fieldLabels[key] || key;
      let value = clientData[key];

      // Tratamento especial para o campo responsibleSeller
      if (key === 'responsibleSeller') {
        value = getResponsibleName(clientData['responsibleSeller']);
      }

      doc.text(`${label}: ${value}`, 10, yPosition); // Adiciona o valor ao PDF
      yPosition += 10;
    });

    doc.save(
      `PVE Representações - Cadastro do Cliente ${clientData.companyName}.pdf`,
    ); // Salva o PDF
  }; */

  //End Export PDF

  // Start Export EXCEL
  const copyClientAndSalesDataToClipboard = async (
    clientData: { [key: string]: any },
    salesData: { [key: string]: any },
    businessGroups: { id: string | number; name: string }[],
    salesQuotes: {
      createdAt: string | number | Date;
      clientId: number;
    }[],
  ) => {
    console.log('SalesQuotes recebidas:', salesQuotes);
    console.log('ID do cliente atual:', clientData.id);

    // ✅ Anos dinâmicos
    const apiResponse = await fetchQuotesByClientLastThreeYears(clientData.id);

    // Transforma o array em um objeto indexado por ano
    const totalQuotesByYear = apiResponse.data.reduce(
      (
        acc: { [year: number]: number },
        item: { year: number; total: number },
      ) => {
        acc[item.year] = item.total;
        return acc;
      },
      {},
    );

    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];

    // Preenche os valores na ordem correta
    const totalQuotesCurrent = totalQuotesByYear[currentYear] || 0;
    const totalQuotesLastYear = totalQuotesByYear[currentYear - 1] || 0;
    const totalQuotesTwoYearsAgo = totalQuotesByYear[currentYear - 2] || 0;

    // Exclui os campos irrelevantes para exportação
    const excludedFields = ['id', 'createdAt', 'clientCondition', 'imageUrl'];

    // Ordem das colunas no Excel para clientes
    const clientExcelColumnOrder = [
      'cnpj',
      'cpf',
      'corfioCode',

      'companyName',
      'cep',
      'address',
      'locationNumber',
      'district',
      'city',
      'state',

      'phone',
      'whatsapp',
      'emailCommercial',
      'emailFinancial',
      'emailXml',
      'socialMedia',

      'contactAtCompany',
      'financialContact',
      'responsibleSeller',

      'companySize',
      'hasOwnStore',
      'icmsContributor',
      'stateRegistration',
      'transportationType',
      'companyLocation',
      'marketSegmentNature',
      'businessGroupId',
      'rating',
      /* 'totalQuotes', */
      'totalQuotesCurrent',
      'totalQuotesLastYear',
      'totalQuotesTwoYearsAgo',
    ];

    // Ordem das colunas no Excel para sales_information
    const salesExcelColumnOrder = [
      'commercial',
      'marketing',
      'invoicing',
      'cables',
      'financial',
      'invoice',
    ];
    // calc total de cotações
    /*     const totalQuotes = salesQuotes.filter(
      (quote) => Number(quote.clientId) === Number(clientData.id),
    ).length; */

    // ✅ Cria um mapa com a contagem por ano
    const quotesByYear: { [year: number]: number } = {};
    years.forEach((year) => {
      quotesByYear[year] = salesQuotes.filter((quote) => {
        const quoteYear = new Date(quote.createdAt).getFullYear();
        return (
          Number(quote.clientId) === Number(clientData.id) && quoteYear === year
        );
      }).length;
    });

    // Organiza os dados dos clientes na ordem das colunas do Excel
    const clientValues = clientExcelColumnOrder.map((key) => {
      if (excludedFields.includes(key)) return ''; // Ignora campos excluídos

      // Substituir businessGroupId pelo nome correspondente
      if (key === 'businessGroupId') {
        const businessGroup = businessGroups.find(
          (b) => b.id === clientData.businessGroupId,
        );
        return businessGroup
          ? businessGroup.name
          : 'Não pertence a nenhum grupo';
      }

      // Combinar operador e nome para o campo responsibleSeller
      if (key === 'responsibleSeller') {
        const operatorNumber = clientData[key];
        const user = users.find((u) => u.operatorNumber === operatorNumber);
        return user ? `${user.operatorNumber} - ${user.name}` : operatorNumber;
      }

      if (key === 'rating') {
        const ratingMap: { [key: number]: string } = {
          1: '1 - Pouco ativo',
          2: '2 - Moderado',
          3: '3 - Ativo',
        };
        return ratingMap[clientData.rating] || 'Sem Status';
      }
      /* if (key === 'totalQuotes') {
        return totalQuotes.toString();
      } */
      if (key === 'totalQuotesCurrent') return totalQuotesCurrent.toString();
      if (key === 'totalQuotesLastYear') return totalQuotesLastYear.toString();
      if (key === 'totalQuotesTwoYearsAgo')
        return totalQuotesTwoYearsAgo.toString();

      // ✅ Preenche os campos totalQuotesYYYY
      const match = key.match(/^totalQuotes(\d{4})$/);
      if (match) {
        const year = Number(match[1]);
        return quotesByYear[year]?.toString() || '0';
      }

      return clientData[key] || ''; // Retorna o valor do campo ou vazio se não houver
    });

    // Organiza os dados de sales_information na ordem das colunas do Excel
    const salesValues = salesExcelColumnOrder.map((key) => {
      return salesData[key] || ''; // Retorna o valor do campo ou vazio se não houver
    });

    // Combina os valores dos clientes e de sales_information
    const combinedValues = [...clientValues, ...salesValues];
    // Gera o conteúdo tabulado
    const tabulatedText = combinedValues.join('\t'); // Dados em uma linha, separados por tabulações

    // Copia para a área de transferência
    navigator.clipboard
      .writeText(tabulatedText)
      .then(() => {
        console.log('Dados do cliente e de vendas copiados com sucesso!');
        setButtonText('Copiado'); // Altera o texto do botão para "Copiado"

        setTimeout(() => setButtonText('Excel'), 1500); // Volta para "Excel" após 2 segundos
      })
      .catch((error) => {
        console.error('Erro ao copiar os dados:', error);
        alert('Erro ao copiar os dados. Tente novamente.');
      });
  };
  // End Export EXCEL

  // Função para copiar endereço do cliente para GPS/Google Maps
  const exportLocalGpsButton = () => {
    if (!clientData) {
      console.error('Dados do cliente não disponíveis');
      return;
    }

    // Extrair dados do endereço
    const { address, locationNumber, district, city, state, cep } = clientData;

    // Formatar o endereço no padrão ideal para GPS/Google Maps
    let formattedAddress = '';

    // Primeira linha: Rua, Número - Bairro
    if (address) {
      formattedAddress += address;
      if (locationNumber) {
        formattedAddress += `, ${locationNumber}`;
      }
      if (district) {
        formattedAddress += ` - ${district}`;
      }
    }

    // Segunda linha: Cidade - Estado, CEP
    if (city || state || cep) {
      if (formattedAddress) {
        formattedAddress += '\n';
      }

      if (city && state) {
        formattedAddress += `${city} - ${state}`;
      } else if (city) {
        formattedAddress += city;
      } else if (state) {
        formattedAddress += state;
      }

      if (cep) {
        if (formattedAddress && !formattedAddress.endsWith('\n')) {
          formattedAddress += ', ';
        }
        formattedAddress += cep;
      }
    }

    // Se não houver dados suficientes, usar apenas o que estiver disponível
    if (!formattedAddress.trim()) {
      formattedAddress = 'Endereço não disponível';
    }

    // Copiar para a área de transferência
    navigator.clipboard
      .writeText(formattedAddress)
      .then(() => {
        console.log('Endereço copiado com sucesso!');
        setLocalButtonText('Copiado'); // Altera o texto do botão para "Copiado"
        setTimeout(() => setLocalButtonText('Local'), 1500); // Volta para "Local" após 1.5 segundos
      })
      .catch((error) => {
        console.error('Erro ao copiar endereço:', error);
        alert('Erro ao copiar endereço. Tente novamente.');
      });
  };

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
    { label: 'Grupo Empresarial', name: 'businessGroupId' },
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
    { label: 'WhatsApp', name: 'whatsapp' },
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
            whatsapp={clientData?.whatsapp} // Pass whatsapp
            emailCommercial={clientData?.emailCommercial} // Pass email
            onRatingChange={(rating) => setValue('rating', rating)}
            onConditionChange={(condition) =>
              setValue('clientCondition', condition)
            }
            readOnly={false} // Passando a propriedade readOnly
            imageUrl={clientData?.imageUrl}
            showTooltip={false} // Não mostra o Tooltip
            enableImageUpload={false}
            lastVisitData={lastVisitData} // Passando dados da última visita
          />
          <Box sx={styles.boxButton}>
            <Tooltip title={'Copiar dados para colar na planilha'}>
              <Button
                type="button"
                variant="contained"
                onClick={() => {
                  console.log('clientData:', clientData);
                  console.log('salesData:', salesData);
                  copyClientAndSalesDataToClipboard(
                    clientData,
                    salesData,
                    businessGroups,
                    salesQuotes,
                  );
                }}
                sx={styles.exportExcelButton}
              >
                {buttonText}
              </Button>
            </Tooltip>
            <Tooltip title={'Copia endereço para colar no GPS'}>
              <Button
                type="button"
                variant="contained"
                onClick={exportLocalGpsButton}
                sx={styles.exportButton}
              >
                {localButtonText}
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
          {formFields.map(({ label, name }) => {
            let value = clientData[name];

            // Tratamento especial para o campo businessGroupId
            if (name === 'businessGroupId') {
              value = getBusinessGroupName(clientData.businessGroupId);
            }

            // Tratamento especial para o campo responsibleSeller
            if (name === 'responsibleSeller') {
              const seller = users.find(
                (user) => user.operatorNumber === clientData.responsibleSeller,
              );
              value = seller
                ? `${seller.operatorNumber} - ${seller.name}`
                : clientData.responsibleSeller;
            }

            return (
              <Box key={name}>
                <Typography variant="subtitle1" component="div">
                  {label}
                </Typography>
                <Controller
                  name={name}
                  control={control}
                  defaultValue={clientData[name] || ''}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="filled"
                      sx={styles.inputsCol2}
                      value={value || ''}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  )}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ClientPageTabInfos;
