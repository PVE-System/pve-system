'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Container,
  Box,
  useMediaQuery,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  Theme,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  PersonOff as PersonOffIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '@/app/contex/authContext';
import { useRouter } from 'next/navigation';

// Interface para o tipo dos dados do cliente
interface Client {
  id: string;
  companyName: string;
  corfioCode: string;
  clientCondition: string;
  rating: number;
  state: string;
  city: string;
  visitStatus?: string;
  currentVisitDescription?: string;
  lastVisitDescription?: string;
  lastVisitConfirmedAt?: string;
}

// Interface para clientes não cadastrados
interface UnregisteredClient {
  id: string;
  companyName: string;
  state: string;
  city: string;
  isUnregistered: boolean;
  visitStatus?: string;
  currentVisitDescription?: string;
  lastVisitDescription?: string;
  lastVisitConfirmedAt?: string;
}

// Interface para clientes da rota existente
interface RouteClient {
  id: number;
  clientId?: number;
  customerNameUnregistered?: string;
  customerStateUnregistered?: string;
  customerCityUnregistered?: string;
  visitStatus: string;
  currentVisitDescription?: string;
  lastVisitDescription?: string;
  lastVisitConfirmedAt?: string;
  clientDetails?: {
    id: number;
    companyName: string;
    state: string;
    city: string;
  } | null;
}

// Interface para a rota existente
interface VisitRoute {
  id: number;
  userId: number;
  routeName: string;
  scheduledDate: string;
  routeStatus: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  clients: RouteClient[];
}

// Função para renderizar o texto como está no banco
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') return '';
  return str;
};

// Estilos inline para manter consistência
const styles = {
  container: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',

    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  fontSize: {
    fontSize: {
      xs: '10px',
      sm: '12px',
      md: '14px',
    },
  },
  fontSizeClientName: {
    fontSize: {
      xs: '10px',
      sm: '12px',
      md: '14px',
    },
    fontWeight: 500,
  },
  rowHover: {
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  },
};

interface ClientsVisitsEditRouteByIdProps {
  routeId: string;
}

const ClientsVisitsEditRouteById: React.FC<ClientsVisitsEditRouteByIdProps> = ({
  routeId,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('MS');
  const [cityFilter, setCityFilter] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<
    (Client | UnregisteredClient)[]
  >([]);
  const [isUpdatingRoute, setIsUpdatingRoute] = useState(false);
  const [unregisteredClientName, setUnregisteredClientName] = useState('');
  const [unregisteredClientState, setUnregisteredClientState] = useState('');
  const [unregisteredClientCity, setUnregisteredClientCity] = useState('');
  const [routeName, setRouteName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [routeData, setRouteData] = useState<VisitRoute | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  // Carregar dados da rota existente
  const fetchRouteById = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/getVisitRouteById?routeId=${routeId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar rota');
      }

      const data = await response.json();
      const route = data.route;
      setRouteData(route);

      // Preencher os campos com os dados existentes
      setRouteName(route.routeName);
      setScheduledDate(formatDateForInput(route.scheduledDate));

      // Converter clientes da rota para o formato esperado
      const existingClients = route.clients.map((routeClient: RouteClient) => {
        if (routeClient.clientDetails) {
          // Cliente cadastrado
          return {
            id: routeClient.clientDetails.id.toString(),
            companyName: routeClient.clientDetails.companyName,
            corfioCode: '', // Não temos essa informação na rota
            clientCondition: '', // Não temos essa informação na rota
            rating: 0, // Não temos essa informação na rota
            state: routeClient.clientDetails.state,
            city: routeClient.clientDetails.city,
            visitStatus: routeClient.visitStatus,
            currentVisitDescription: routeClient.currentVisitDescription,
            lastVisitDescription: routeClient.lastVisitDescription,
            lastVisitConfirmedAt: routeClient.lastVisitConfirmedAt,
          };
        } else {
          // Cliente não cadastrado
          return {
            id: `unregistered-${routeClient.id}`,
            companyName: routeClient.customerNameUnregistered || '',
            state: routeClient.customerStateUnregistered || '',
            city: routeClient.customerCityUnregistered || '',
            isUnregistered: true,
            visitStatus: routeClient.visitStatus,
            currentVisitDescription: routeClient.currentVisitDescription,
            lastVisitDescription: routeClient.lastVisitDescription,
            lastVisitConfirmedAt: routeClient.lastVisitConfirmedAt,
          };
        }
      });

      setSelectedClients(existingClients);
    } catch (error) {
      console.error('Erro ao buscar rota:', error);
    } finally {
      setLoading(false);
    }
  }, [user, routeId]);

  // Formatar data para input (API agora envia data formatada)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';

    // Se a data já vem formatada da API (formato DD/MM/AAAA), retorna diretamente
    if (dateString.includes('/')) {
      return dateString;
    }

    // Fallback para datas em formato ISO
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return '';
    }
  };

  useEffect(() => {
    fetchRouteById();
  }, [fetchRouteById]);

  const fetchClientsByCities = async (state: string) => {
    try {
      let url = `/api/getClientsByCities?state=${state}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao buscar clientes');

      const data = await response.json();
      setAllClients(data.clients);
      setClients(data.clients);

      //ordenar as cidades de A a Z
      const uniqueSortedCities = Array.from(
        new Set(
          data.clients.map((client: Client) => client.city),
        ) as Set<string>,
      )
        .filter(
          (city): city is string =>
            typeof city === 'string' && city.trim() !== '',
        )
        .sort((a, b) => {
          const normalize = (s: string) => s.trim().toLowerCase();
          return normalize(a).localeCompare(normalize(b), 'pt-BR', {
            sensitivity: 'base',
          });
        });

      setAvailableCities(uniqueSortedCities);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  // Buscar clientes sempre que mudar o estado
  useEffect(() => {
    if (stateFilter) {
      fetchClientsByCities(stateFilter);
      setCityFilter('');
    }
  }, [stateFilter]);

  // Filtrar clientes quando mudar cidade
  useEffect(() => {
    let filtered = allClients.filter((client) => {
      let matchesState = true;
      let matchesCity = true;

      if (stateFilter === 'MS') matchesState = client.state === 'MS';
      else if (stateFilter === 'MT') matchesState = client.state === 'MT';
      else if (stateFilter === 'OUTRAS')
        matchesState = client.state !== 'MS' && client.state !== 'MT';

      if (cityFilter) matchesCity = client.city === cityFilter;

      return matchesState && matchesCity;
    });

    setClients(filtered);
  }, [cityFilter, stateFilter, allClients]);

  const filteredClients = clients;

  const handleRowClick = (client: Client) => {
    // Verifica se o cliente já está na lista selecionada
    const isAlreadySelected = selectedClients.some(
      (selected) => selected.id === client.id,
    );

    if (!isAlreadySelected) {
      setSelectedClients((prev) => [...prev, client]);
    }
  };

  const handleRemoveClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.filter((client) => client.id !== clientId),
    );
  };

  const handleClientDetails = (clientId: string) => {
    window.open(`/clientPage?id=${clientId}`, '_blank');
  };

  const handleUpdateRoute = async () => {
    if (selectedClients.length === 0) return;

    setIsUpdatingRoute(true);
    try {
      // Preparar dados dos clientes para a API
      const clientsData = selectedClients.map((client) => {
        if (isUnregisteredClient(client)) {
          return {
            customerNameUnregistered: client.companyName,
            customerStateUnregistered: client.state,
            customerCityUnregistered: client.city,
            // Incluir dados de status se existirem (para clientes que já estavam na rota)
            visitStatus: client.visitStatus,
            currentVisitDescription: client.currentVisitDescription,
            lastVisitDescription: client.lastVisitDescription,
            lastVisitConfirmedAt: client.lastVisitConfirmedAt,
          };
        } else {
          return {
            clientId: parseInt(client.id),
            // Incluir dados de status se existirem (para clientes que já estavam na rota)
            visitStatus: client.visitStatus,
            currentVisitDescription: client.currentVisitDescription,
            lastVisitDescription: client.lastVisitDescription,
            lastVisitConfirmedAt: client.lastVisitConfirmedAt,
          };
        }
      });

      // Verificar se o usuário está autenticado
      if (!user) {
        alert('Usuário não autenticado');
        return;
      }

      const response = await fetch('/api/updateVisitRouteEditById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routeId: parseInt(routeId),
          userId: parseInt(user.id),
          routeName: routeName,
          scheduledDate: scheduledDate,
          description:
            routeData?.description || 'Esta rota ainda não foi concluída.',
          clients: clientsData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar rota');
      }

      const result = await response.json();
      console.log('Rota atualizada com sucesso:', result);

      alert('Rota atualizada com sucesso!');

      // Redirecionar para a página da rota
      router.push(`/clientsVisitsRegisteredRoutes/${routeId}`);
    } catch (error) {
      console.error('Erro ao atualizar rota:', error);
      alert(error instanceof Error ? error.message : 'Erro ao atualizar rota');
    } finally {
      setIsUpdatingRoute(false);
    }
  };

  const handleAddUnregisteredClient = () => {
    if (!unregisteredClientName.trim()) return;

    const newUnregisteredClient: UnregisteredClient = {
      id: `unregistered-${Date.now()}`,
      companyName: unregisteredClientName.trim(),
      state: unregisteredClientState || 'Não informado',
      city: unregisteredClientCity || 'Não informado',
      isUnregistered: true,
    };

    setSelectedClients((prev) => [...prev, newUnregisteredClient]);

    // Limpar os campos
    setUnregisteredClientName('');
    setUnregisteredClientState('');
    setUnregisteredClientCity('');
  };

  const isUnregisteredClient = (
    client: Client | UnregisteredClient,
  ): client is UnregisteredClient => {
    return 'isUnregistered' in client && client.isUnregistered === true;
  };

  // Função para formatar a data automaticamente
  const formatDate = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    // Limita a 8 dígitos (DDMMAAAA)
    const limitedNumbers = numbers.slice(0, 8);

    // Aplica a formatação DD/MM/AAAA
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 4) {
      return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2)}`;
    } else {
      return `${limitedNumbers.slice(0, 2)}/${limitedNumbers.slice(2, 4)}/${limitedNumbers.slice(4)}`;
    }
  };

  // Função para lidar com a mudança da data
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDate(e.target.value);
    setScheduledDate(formattedValue);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!routeData) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="text.secondary">
          Rota não encontrada
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr',
            md: '1fr 1fr',
            lg: '1fr 1fr',
            xl: '1fr 1fr',
          },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* Seção de Clientes Selecionados */}
        <Box
          sx={{
            ...styles.container,
            display: 'flex',
            flexDirection: 'column',
            height: '700px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                fontSize: {
                  xs: '14px',
                  sm: '16px',
                  md: '18px',
                },
              }}
            >
              Editar rota de visitas
            </Typography>
          </Box>

          {/* Inputs para nome da rota e data agendada */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  sm: 'row',
                },
                gap: 2,
              }}
            >
              <TextField
                label="Nome da Rota*"
                value={routeName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRouteName(e.target.value)
                }
                placeholder="Digite o nome ou uma pequena descrição"
                size="small"
                sx={{
                  flex: {
                    xs: 'none',
                    sm: 1,
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                  },
                }}
              />
              <TextField
                label="Data da viagem*"
                value={scheduledDate}
                onChange={handleDateChange}
                placeholder="DD/MM/AAAA"
                size="small"
                sx={{
                  flex: {
                    xs: 'none',
                    sm: 1,
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                  },
                }}
                inputProps={{
                  maxLength: 10,
                  title: 'Formato: DD/MM/AAAA',
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            <TableContainer sx={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
              <Table sx={{ minWidth: 0, tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        ...styles.fontSize,
                        width: '50px',
                        minWidth: '50px',
                      }}
                    >
                      Nº:
                    </TableCell>
                    <TableCell
                      sx={{
                        ...styles.fontSize,
                        width: 'auto',
                        minWidth: '120px',
                      }}
                    >
                      Cliente:
                    </TableCell>
                    {!isSmallScreen && (
                      <>
                        <TableCell
                          sx={{
                            ...styles.fontSize,
                            width: '70px',
                            minWidth: '70px',
                          }}
                        >
                          Estado:
                        </TableCell>
                        <TableCell
                          sx={{
                            ...styles.fontSize,
                            width: '100px',
                            minWidth: '100px',
                          }}
                        >
                          Cidade:
                        </TableCell>
                      </>
                    )}
                    <TableCell
                      sx={{
                        ...styles.fontSize,
                        width: '90px',
                        minWidth: '90px',
                      }}
                    >
                      Ações:
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedClients.length === 0 ? (
                    <>
                      <TableRow>
                        <TableCell
                          sx={{
                            ...styles.fontSize,
                            width: '50px',
                            minWidth: '50px',
                          }}
                        >
                          -
                        </TableCell>
                        <TableCell
                          sx={{
                            ...styles.fontSize,
                            width: 'auto',
                            minWidth: '120px',
                          }}
                        >
                          -
                        </TableCell>
                        {!isSmallScreen && (
                          <>
                            <TableCell
                              sx={{
                                ...styles.fontSize,
                                width: '70px',
                                minWidth: '70px',
                              }}
                            >
                              -
                            </TableCell>
                            <TableCell
                              sx={{
                                ...styles.fontSize,
                                width: '100px',
                                minWidth: '100px',
                              }}
                            >
                              -
                            </TableCell>
                          </>
                        )}
                        <TableCell
                          sx={{
                            ...styles.fontSize,
                            width: '90px',
                            minWidth: '90px',
                          }}
                        >
                          -
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={isSmallScreen ? 3 : 5}
                          align="center"
                          sx={{ py: 4, border: 'none' }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Nenhum cliente selecionado para esta rota.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    selectedClients.map((client, index) => (
                      <TableRow key={client.id} sx={styles.rowHover}>
                        <TableCell
                          sx={{
                            ...styles.fontSize,
                            width: '50px',
                            minWidth: '50px',
                          }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          sx={{
                            ...styles.fontSizeClientName,
                            width: 'auto',
                            minWidth: '120px',
                          }}
                        >
                          {renderAsIs(
                            client.companyName.slice(
                              0,
                              isSmallScreen ? 25 : 35,
                            ),
                          )}
                          {client.companyName.length >
                            (isSmallScreen ? 25 : 35) && '...'}
                        </TableCell>
                        {!isSmallScreen && (
                          <>
                            <TableCell
                              sx={{
                                ...styles.fontSize,
                                width: '70px',
                                minWidth: '70px',
                              }}
                            >
                              {client.state || '-'}
                            </TableCell>
                            <TableCell
                              sx={{
                                ...styles.fontSize,
                                width: '100px',
                                minWidth: '100px',
                              }}
                            >
                              {client.city || '-'}
                            </TableCell>
                          </>
                        )}
                        <TableCell
                          sx={{
                            ...styles.fontSize,
                            width: '90px',
                            minWidth: '90px',
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Box
                              sx={{
                                width: '40px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {isUnregisteredClient(client) ? (
                                <Tooltip title="Cliente não cadastrado" arrow>
                                  <IconButton
                                    size="small"
                                    sx={{
                                      color: 'orange',
                                      '&:hover': {
                                        backgroundColor:
                                          'rgba(255, 165, 0, 0.1)',
                                      },
                                    }}
                                  >
                                    <PersonOffIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Ver detalhes do cliente" arrow>
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      handleClientDetails(client.id)
                                    }
                                    sx={{
                                      '&:hover': {
                                        backgroundColor:
                                          'rgba(25, 118, 210, 0.1)',
                                      },
                                    }}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                            <Box
                              sx={{
                                width: '40px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Tooltip title="Remover da rota" arrow>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveClient(client.id)}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Botão Atualizar Rota */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleUpdateRoute}
              disabled={
                selectedClients.length === 0 ||
                !routeName.trim() ||
                !scheduledDate.trim() ||
                isUpdatingRoute
              }
              sx={{
                backgroundColor: 'green',
                '&:hover': {
                  backgroundColor: 'darkgreen',
                },
                '&:disabled': {
                  backgroundColor: 'green',
                  opacity: 0.6,
                },
                minWidth: '150px',
              }}
            >
              {isUpdatingRoute ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Atualizar Rota'
              )}
            </Button>
          </Box>
        </Box>

        {/* Lista dos clientes cadastrados */}
        <Box
          sx={{
            ...styles.container,
            height: '700px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                fontSize: {
                  xs: '14px',
                  sm: '16px',
                  md: '18px',
                },
              }}
            >
              Adicione mais clientes à sua rota
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {/* Select de Estados */}
            <FormControl sx={{ maxWidth: 250, width: '100%' }}>
              <InputLabel id="state-filter-label">Filtrar por UF</InputLabel>
              <Select
                labelId="state-filter-label"
                value={stateFilter}
                label="Filtrar por UF"
                onChange={(e) => setStateFilter(e.target.value)}
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '14px',
                  },
                }}
              >
                <MenuItem value="MS" sx={styles.fontSize}>
                  MS
                </MenuItem>
                <MenuItem value="MT" sx={styles.fontSize}>
                  MT
                </MenuItem>
                <MenuItem value="OUTRAS" sx={styles.fontSize}>
                  Outras UF
                </MenuItem>
              </Select>
            </FormControl>

            {stateFilter && (
              <FormControl sx={{ maxWidth: 250, width: '100%' }}>
                <InputLabel id="city-filter-label">
                  Filtrar por Cidade
                </InputLabel>
                <Select
                  labelId="city-filter-label"
                  value={cityFilter || 'Todas as cidades'}
                  label="Filtrar por Cidade"
                  onChange={(e) =>
                    setCityFilter(
                      e.target.value === 'Todas as cidades'
                        ? ''
                        : e.target.value,
                    )
                  }
                  disabled={!stateFilter}
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                    },
                    '& .MuiSelect-select': {
                      fontSize: '14px',
                    },
                  }}
                >
                  <MenuItem value="Todas as cidades" sx={styles.fontSize}>
                    Todas as cidades
                  </MenuItem>
                  {availableCities.length > 0 ? (
                    availableCities.map((city) => (
                      <MenuItem key={city} value={city} sx={styles.fontSize}>
                        {city}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" sx={styles.fontSize}>
                      {stateFilter
                        ? 'Nenhuma cidade encontrada'
                        : 'Selecione um Estado'}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            )}
          </Box>

          {/* Seção de Cliente Não Cadastrado */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <TextField
                label="Adicione um cliente não cadastrado"
                value={unregisteredClientName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUnregisteredClientName(e.target.value)
                }
                placeholder="Digite o nome do cliente"
                size="small"
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '14px',
                  },
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <TextField
                  label="Estado"
                  value={unregisteredClientState}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUnregisteredClientState(e.target.value)
                  }
                  placeholder="UF"
                  size="small"
                  sx={{
                    flex: 1,
                    minWidth: '120px',
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                    },
                  }}
                />
                <TextField
                  label="Cidade"
                  value={unregisteredClientCity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUnregisteredClientCity(e.target.value)
                  }
                  placeholder="Cidade"
                  size="small"
                  sx={{
                    flex: 1,
                    minWidth: '120px',
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                    },
                  }}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleAddUnregisteredClient}
                disabled={!unregisteredClientName.trim()}
                sx={{
                  backgroundColor: 'green',
                  '&:hover': {
                    backgroundColor: 'darkgreen',
                  },
                  '&:disabled': {
                    backgroundColor: 'grey',
                    opacity: 0.6,
                  },
                  fontSize: {
                    xs: '10px',
                    sm: '12px',
                    md: '14px',
                  },
                  minWidth: {
                    xs: '120px',
                    sm: '150px',
                    md: '200px',
                  },
                }}
              >
                Adicionar Cliente Não Cadastrado
              </Button>
            </Box>
          </Box>

          {/* Tabela de Clientes */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <TableContainer sx={{ height: '100%', overflow: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={styles.fontSize}>Cliente:</TableCell>
                    {!isSmallScreen && (
                      <>
                        <TableCell sx={styles.fontSize}>Estado:</TableCell>
                        <TableCell sx={styles.fontSize}>Cidade:</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Nenhum cliente encontrado para o filtro selecionado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <TableRow
                        key={client.id}
                        sx={{ ...styles.rowHover, cursor: 'pointer' }}
                        onClick={() => handleRowClick(client)}
                      >
                        <TableCell sx={styles.fontSizeClientName}>
                          {renderAsIs(client.companyName.slice(0, 40))}
                        </TableCell>
                        {!isSmallScreen && (
                          <>
                            <TableCell sx={styles.fontSize}>
                              {client.state || '-'}
                            </TableCell>
                            <TableCell sx={styles.fontSize}>
                              {client.city || '-'}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ClientsVisitsEditRouteById;
