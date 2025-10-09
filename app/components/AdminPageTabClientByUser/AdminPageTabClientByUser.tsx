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

  //Cotações do ultimo ano

  /* useEffect(() => {
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
  }; */
  // Buscar Cotações dos ultimos 3 anos

  async function fetchQuoteTotalsForClient(clientId: number) {
    const response = await fetch(
      `/api/getSalesQuotesByYears?clientId=${clientId}`,
    );

    if (!response.ok) throw new Error('Erro ao buscar cotações');

    const result = await response.json();

    const map: Record<number, number> = {};
    for (const entry of result.data) {
      map[entry.year] = entry.total;
    }

    const currentYear = new Date().getFullYear();

    return {
      totalQuotesCurrent: map[currentYear] || 0,
      totalQuotesLastYear: map[currentYear - 1] || 0,
      totalQuotesTwoYearsAgo: map[currentYear - 2] || 0,
    };
  }

  const handleCopyClick = async () => {
    setIsPreparingData(true);

    try {
      const filteredClients = clients.filter(
        (client) => client.responsibleSeller === selectedOperator,
      );

      if (filteredClients.length === 0) {
        alert('Nenhum cliente encontrado para este vendedor.');
        return;
      }

      // Obtem os dados de totais de cotações
      const quoteTotalsMap: Record<
        number,
        {
          totalQuotesCurrent: number;
          totalQuotesLastYear: number;
          totalQuotesTwoYearsAgo: number;
        }
      > = {};

      await Promise.all(
        filteredClients.map(async (client) => {
          try {
            const clientId = Number(client.id); // <- conversão aqui
            const totals = await fetchQuoteTotalsForClient(clientId);
            quoteTotalsMap[clientId] = totals;
          } catch (err) {
            console.error(
              `Erro ao buscar totais de cotações para o cliente ${client.id}`,
              err,
            );
            quoteTotalsMap[Number(client.id)] = {
              totalQuotesCurrent: 0,
              totalQuotesLastYear: 0,
              totalQuotesTwoYearsAgo: 0,
            };
          }
        }),
      );

      // Buscar a data da última visita confirmada por cliente
      const lastVisitMap: { [clientId: number]: string } = {};
      await Promise.all(
        filteredClients.map(async (client) => {
          const cid = Number(client.id);
          try {
            const res = await fetch(
              `/api/getVisitClientHistory?clientId=${cid}`,
            );
            if (!res.ok) {
              lastVisitMap[cid] = 'Visita Pendente';
              return;
            }
            const data = await res.json();
            const dt = data?.lastVisitConfirmedAt
              ? new Date(data.lastVisitConfirmedAt)
              : null;
            lastVisitMap[cid] = dt
              ? dt.toLocaleDateString('pt-BR')
              : 'Visita Pendente';
          } catch {
            lastVisitMap[cid] = 'Visita Pendente';
          }
        }),
      );

      // Passa os dados extras para o exportador
      await copyClientsByUserToClipboard(
        clients,
        salesDataMap,
        businessGroups,
        users,
        selectedOperator,
        setButtonText,
        quoteTotalsMap, // <--- Novo parâmetro
        lastVisitMap,
      );
    } catch (error) {
      console.error('Erro detalhado:', error);
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
    quoteTotalsMap: {
      [clientId: number]: {
        totalQuotesCurrent: number;
        totalQuotesLastYear: number;
        totalQuotesTwoYearsAgo: number;
      };
    },
    lastVisitMap: { [clientId: number]: string },
  ) => {
    const excludedFields = ['id', 'createdAt', 'clientCondition', 'imageUrl'];

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
      'lastVisitConfirmedAt',
      'totalQuotesCurrent',
      'totalQuotesLastYear',
      'totalQuotesTwoYearsAgo',
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
    /* const { quotesCountByClient } = quotesData; */

    const rows = filteredClients.map((client) => {
      const clientId = Number(client.id);

      // Gera os dados do cliente
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

        if (key === 'lastVisitConfirmedAt') {
          const cid = Number(client.id);
          return lastVisitMap[cid] || 'Visita Pendente';
        }

        if (key === 'rating') {
          const ratingMap: { [key: number]: string } = {
            1: '1 - Pouco ativo',
            2: '2 - Moderado',
            3: '3 - Ativo',
          };
          return ratingMap[client.rating] || 'Sem Status';
        }

        return client[key] || '';
      });

      // Índice onde está a coluna "lastVisitConfirmedAt" para inserir as cotações logo após
      const lastVisitIndex = clientExcelColumnOrder.indexOf(
        'lastVisitConfirmedAt',
      );

      // Dados de cotação a inserir após "rating"
      const quoteTotals = quoteTotalsMap[clientId] || {
        totalQuotesCurrent: 0,
        totalQuotesLastYear: 0,
        totalQuotesTwoYearsAgo: 0,
      };
      const quoteValues = [
        quoteTotals.totalQuotesCurrent,
        quoteTotals.totalQuotesLastYear,
        quoteTotals.totalQuotesTwoYearsAgo,
      ];

      // Insere os dados logo após a coluna "lastVisitConfirmedAt"
      clientValues.splice(lastVisitIndex + 1, 0, ...quoteValues);

      // Dados de vendas
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
            onClick={handleCopyClick}
            disabled={isPreparingData}
            startIcon={isPreparingData ? <CircularProgress size={20} /> : null}
          >
            {isPreparingData ? 'Copiando' : buttonText}
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
                    Nenhum cliente encontrado para o responsável.
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
