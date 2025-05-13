import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import styles from './styles';

interface User {
  id?: string;
  name: string;
  operatorNumber: string;
  is_active: boolean;
}

interface Client {
  [x: string]: any;
  id: string;
  name: string;
  responsibleSeller: string;
}

interface Quote {
  id: number;
  clientId: number;
  quoteNumber: number;
}

interface SalesQuotesResponse {
  quotesCountByClient: Record<string, number>;
  rawQuotes: Quote[];
}

const AdminPageTabClientByUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [buttonText, setButtonText] = useState('Excel');

  const [salesDataMap, setSalesDataMap] = useState<{ [key: string]: any }>({});
  const [businessGroups, setBusinessGroups] = useState<
    { id: string | number; name: string }[]
  >([]);
  const [quotesData, setQuotesData] = useState<SalesQuotesResponse>({
    quotesCountByClient: {},
    rawQuotes: [],
  });
  const [isPreparingData, setIsPreparingData] = useState(false);

  // Buscar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/getAllUsers');
        if (!response.ok) throw new Error('Erro ao buscar usuários');

        const data = await response.json();
        /* console.log('Usuários da API:', data); */

        if (!data.users)
          throw new Error('A chave "users" não existe na resposta da API');

        const activeUsers = data.users.filter((user: User) => user.is_active);

        const sortedUsers = activeUsers.sort((a: User, b: User) => {
          return (
            parseInt(a.operatorNumber, 10) - parseInt(b.operatorNumber, 10)
          );
        });

        setUsers(sortedUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedOperator) {
      setClients([]); // Reseta os clientes se nenhum operador for selecionado
      return;
    }

    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const response = await fetch('/api/getClientsByUser');
        if (!response.ok) throw new Error('Erro ao buscar clientes');

        const data = await response.json();
        console.log('Clientes da API:', data);

        if (!data.clients)
          throw new Error('A chave "clients" não existe na resposta da API');

        console.log(
          'Clientes mapeados:',
          data.clients.map((c: Client) => ({
            nome: c.companyName,
            responsavel: c.responsibleSeller,
          })),
        );

        // Apenas filtra os clientes (ordem já vem do backend)
        const filteredClients = data.clients.filter(
          (client: Client) =>
            String(client.responsibleSeller) === String(selectedOperator),
        );

        console.log('Clientes filtrados:', filteredClients);

        setClients(filteredClients); // Atualiza o estado
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, [selectedOperator]);

  // Buscar grupos para ter no copia cola excel
  useEffect(() => {
    const fetchBusinessGroups = async () => {
      try {
        const response = await fetch('/api/getAllBusinessGroups');
        if (!response.ok) throw new Error('Erro ao buscar grupos de negócio');

        const data = await response.json();

        if (!data.businessGroups)
          throw new Error(
            'A chave "businessGroups" não existe na resposta da API',
          );

        setBusinessGroups(data.businessGroups); // Atualiza o estado
      } catch (error) {
        console.error('Erro ao buscar grupos de negócio:', error);
      }
    };

    fetchBusinessGroups();
  }, []);

  //Cotações

  useEffect(() => {
    if (selectedOperator) {
      const loadQuotesData = async () => {
        const data = await fetchSalesQuotesByUser(selectedOperator);
        console.log('🚀 Dados carregados em useEffect:', data);
        setQuotesData(data);
      };
      loadQuotesData();
    }
  }, [selectedOperator]);

  const fetchSalesQuotesByUser = async (
    userId: string,
  ): Promise<SalesQuotesResponse> => {
    try {
      const response = await fetch(
        `/api/getSalesQuotesByUser?userId=${userId}`,
      );
      if (!response.ok) throw new Error('Erro ao buscar cotações');

      const data = await response.json();
      const quotes: Quote[] = data.quotes || [];

      // DEBUG: Verifique os dados recebidos
      console.log('🔹 Dados recebidos da API:', data);
      console.log('🔹 Primeira cotação recebida:', quotes[0]);

      // ✅ Contar quantas cotações existem para cada cliente
      const quotesCountByClient = quotes.reduce(
        (acc, quote) => {
          const clientId = String(quote.clientId);
          acc[clientId] = (acc[clientId] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const result = {
        quotesCountByClient, // ✅ Mantemos apenas esta contagem
        rawQuotes: quotes, // 🔹 Dados brutos para debug
      };

      console.log('🛠️ Resultado processado corretamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Erro ao buscar cotações:', error);
      return {
        quotesCountByClient: {},
        rawQuotes: [],
      };
    }
  };

  const handleCopyClick = async () => {
    setIsPreparingData(true);

    try {
      console.log('Iniciando cópia...'); // DEBUG

      // Atualize esta verificação para usar a nova estrutura
      if (Object.keys(quotesData.quotesCountByClient).length > 0) {
        console.log('Usando dados existentes'); // DEBUG
        await copyClientsByUserToClipboard(
          clients,
          salesDataMap,
          businessGroups,
          users,
          selectedOperator,
          setButtonText,
        );
        return;
      }

      await copyClientsByUserToClipboard(
        clients,
        salesDataMap,
        businessGroups,
        users,
        selectedOperator,
        setButtonText,
      );
    } catch (error) {
      console.error('Erro detalhado:', error); // DEBUG melhorado
      alert(`Erro ao copiar:`);
    } finally {
      setIsPreparingData(false);
    }
  };

  //Start export excel

  const copyClientsByUserToClipboard = async (
    clients: { [key: string]: any }[],
    salesDataMap: { [clientId: string]: { [key: string]: any } },
    businessGroups: { id: string | number; name: string }[],
    users: { operatorNumber: string; name: string }[],
    selectedOperator: string,
    setButtonText: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const excludedFields = [
      'id',
      'createdAt',
      'rating',
      'clientCondition',
      'imageUrl',
    ];

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
      'quoteNumber',
    ];

    const salesExcelColumnOrder = [
      'commercial',
      'marketing',
      'invoicing',
      'cables',
      'financial',
      'invoice',
    ];

    const filteredClients = clients.filter(
      (client) => client.responsibleSeller === selectedOperator,
    );

    if (filteredClients.length === 0) {
      alert('Nenhum cliente encontrado para este vendedor.');
      return;
    }

    // 🚀 Usar os dados do estado em vez de buscar novamente
    const { quotesCountByClient } = quotesData;

    const rows = filteredClients.map((client) => {
      const clientValues = clientExcelColumnOrder.map((key) => {
        if (excludedFields.includes(key)) return '';

        if (key === 'businessGroupId') {
          if (!client.businessGroupId) {
            return 'Não pertence a nenhum grupo';
          }

          const businessGroup = businessGroups.find(
            (b) => String(b.id) === String(client.businessGroupId),
          );

          return businessGroup
            ? businessGroup.name
            : 'Não pertence a nenhum grupo';
        }

        if (key === 'responsibleSeller') {
          const operatorNumber = client[key];
          const user = users.find((u) => u.operatorNumber === operatorNumber);
          return user
            ? `${user.operatorNumber} - ${user.name}`
            : operatorNumber;
        }

        if (key === 'quoteNumber') {
          // Correção principal: Acesse o clientId como string para consistência
          const clientId = String(client.id);
          const quoteValue = quotesCountByClient[clientId];

          console.log(`Cliente ${clientId} - Valor da cotação:`, quoteValue); // DEBUG

          // Verificação mais robusta
          if (
            quoteValue !== undefined &&
            quoteValue !== null &&
            !isNaN(quoteValue)
          ) {
            // Use Intl.NumberFormat para formatar o número com separador de milhar
            const formatter = new Intl.NumberFormat('pt-BR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            });

            return formatter.format(quoteValue); // Retorna o número formatado
          }
          return '0';
        }

        return client[key] || '';
      });

      const salesValues = salesExcelColumnOrder.map((key) => {
        return salesDataMap[client.id]?.[key] || '';
      });

      return [...clientValues, ...salesValues].join('\t');
    });

    const tabulatedText = rows.join('\n');

    navigator.clipboard
      .writeText(tabulatedText)
      .then(() => {
        console.log('Dados copiados com sucesso!');
        setButtonText('Copiado');

        setTimeout(() => setButtonText('Excel'), 1500);
      })
      .catch((error) => {
        console.error('Erro ao copiar os dados:', error);
        alert('Erro ao copiar os dados. Tente novamente.');
      });
  };

  //End Export Excel

  const handleRowClick = (clientId: string) => {
    window.location.href = `/clientPage?id=${clientId}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={styles.container}>
      {/* Dropdown para selecionar o operador */}
      <TextField
        select
        label="Responsável PVE"
        value={selectedOperator}
        onChange={(e) => setSelectedOperator(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{
          marginBottom: 2,
          '& .MuiInputLabel-root': {
            fontSize: '14px', // Tamanho da fonte do label
          },
          '& .MuiSelect-select': {
            fontSize: '14px', // Tamanho da fonte do valor selecionado
          },
        }}
      >
        {users.length > 0 ? (
          users.map((user) => (
            <MenuItem
              key={user.id || user.operatorNumber}
              value={user.operatorNumber}
              sx={styles.fontSize}
            >
              {user.operatorNumber} - {user.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled sx={styles.fontSize}>
            Nenhum usuário encontrado
          </MenuItem>
        )}
      </TextField>

      {/* Exibir total de clientes encontrados */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',

          marginBottom: 2,
          flexWrap: 'wrap',
          gap: 2,
          '@media (max-width: 600px)': {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          },
        }}
      >
        <Typography variant="subtitle2" sx={styles.fontSize}>
          Total de clientes: <strong>{clients.length}</strong>
        </Typography>
        <Tooltip title={'Copiar dados para colar na planilha'}>
          <Button
            variant="contained"
            color="primary"
            sx={{ ...styles.exportExcelButton }}
            onClick={handleCopyClick} // Use a nova função aqui
            disabled={isPreparingData}
            startIcon={isPreparingData ? <CircularProgress size={20} /> : null}
          >
            {isPreparingData ? 'Preparando dados...' : buttonText}
          </Button>
        </Tooltip>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  ...styles.fontSize,
                  textAlign: {
                    xs: 'center',
                    sm: 'left',
                  },
                }}
              >
                Cliente:
              </TableCell>
              {!isSmallScreen && (
                <>
                  <TableCell sx={styles.fontSize}>Cód. Corfio:</TableCell>
                  <TableCell sx={styles.fontSize}>Condição:</TableCell>
                  <TableCell sx={styles.fontSize}>Status:</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingClients ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : clients.length > 0 ? (
              clients.map((client) => (
                <TableRow
                  key={client.id}
                  sx={{ ...styles.rowHover, cursor: 'pointer' }}
                  onClick={() => handleRowClick(client.id)}
                >
                  <TableCell sx={styles.fontSize}>
                    {client.companyName.slice(0, 50)}
                  </TableCell>
                  {!isSmallScreen && (
                    <>
                      <TableCell sx={styles.fontSize}>
                        {client.corfioCode}
                      </TableCell>
                      <TableCell sx={styles.fontSize}>
                        <Box>
                          <Button
                            sx={{
                              ...styles.buttonTagCondition,
                              backgroundColor:
                                client.clientCondition === 'Normal'
                                  ? 'green'
                                  : client.clientCondition === 'Especial'
                                    ? 'orange'
                                    : client.clientCondition === 'Suspenso'
                                      ? 'red'
                                      : 'grey',
                              color:
                                client.clientCondition === 'Especial'
                                  ? 'black'
                                  : 'white',
                              '&:hover': {
                                backgroundColor:
                                  client.clientCondition === 'Normal'
                                    ? 'green'
                                    : client.clientCondition === 'Especial'
                                      ? 'orange'
                                      : client.clientCondition === 'Suspenso'
                                        ? 'red'
                                        : 'grey',
                              },
                            }}
                            variant="contained"
                            size="small"
                          >
                            {client.clientCondition}
                          </Button>
                        </Box>
                      </TableCell>
                      <TableCell sx={styles.fontSize}>
                        <Rating
                          name={`rating-${client.id}`}
                          value={client.rating}
                          readOnly
                          size="medium"
                          max={3}
                        />
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography sx={styles.fontSize}>
                    Nenhum cliente encontrado para este responsável.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminPageTabClientByUser;
