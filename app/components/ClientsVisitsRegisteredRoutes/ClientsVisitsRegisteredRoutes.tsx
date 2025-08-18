'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { blueGrey, orange } from '@mui/material/colors';
import {
  Route as RouteIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  PersonOff as PersonOffIcon,
} from '@mui/icons-material';
import { Theme } from '@mui/material';
import { useAuth } from '@/app/contex/authContext';
import { useRouter } from 'next/navigation';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  filtersContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    mb: 3,
    flexWrap: 'wrap',
  },

  inputContainer: {
    minWidth: 150,
  },

  card: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.alternative,
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',

    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    },
  },

  cardContent: {
    padding: '16px',
  },

  routeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2,
  },

  routeTitle: {
    fontWeight: 600,
    fontSize: '18px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.primary
        : theme.palette.text.primary,
  },

  routeName: {
    fontSize: '16px',
    fontWeight: 500,
    color: orange[800],
    mb: 1,
    '@media (max-width: 600px)': {
      fontSize: '14px',
    },
  },

  routeDate: {
    fontSize: '14px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },

  routeUserName: {
    fontSize: '14px',
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },

  routeDescription: {
    fontSize: '14px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
    mb: 1,
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },

  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    mb: 2,
  },

  statsRow: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
  },

  chip: {
    fontSize: '12px',
    minWidth: '100px',
    height: '24px',
  },

  clientsList: {
    maxHeight: '200px',
    overflow: 'auto',
  },

  clientItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.divider
        : theme.palette.divider,
  },

  clientName: {
    fontSize: '14px',
    fontWeight: 500,
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },

  clientLocation: {
    fontSize: '12px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
  },

  statusChip: {
    fontSize: '10px',
    height: '20px',
  },

  actionsContainer: {
    display: 'flex',
    gap: 1,
    justifyContent: 'flex-end',
    mt: 2,
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },

  noRoutesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    flexDirection: 'column',
    gap: 2,
  },
};

interface RouteClient {
  id: number;
  clientId?: number;
  customerNameUnregistered?: string;
  customerStateUnregistered?: string;
  customerCityUnregistered?: string;
  visitStatus: string;
  clientDetails?: {
    id: number;
    companyName: string;
    state: string;
    city: string;
  } | null;
}

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
  totalClients: number;
  completedVisits: number;
  pendingVisits: number;
  scheduledVisits: number;
}

const ClientsVisitsRegisteredRoutes = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [routes, setRoutes] = useState<VisitRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString(),
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  const months = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
  ];

  const fetchRoutes = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('userId', user.id);
      if (selectedYear !== 'all') params.set('year', selectedYear);
      if (selectedMonth !== 'all') params.set('month', selectedMonth);

      const response = await fetch(`/api/getVisitRoutes?${params}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar rotas');
      }

      const data = await response.json();
      setRoutes(data.routes);
      setAvailableYears(data.availableYears || [2025]);
    } catch (error) {
      console.error('Erro ao buscar rotas:', error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedYear, selectedMonth]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONCLUIDO':
        return 'success';
      case 'PENDENTE':
        return 'warning';
      case 'AGENDADO':
        return 'info';
      case 'CANCELADO':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONCLUIDO':
        return 'Concluído';
      case 'PENDENTE':
        return 'Pendente';
      case 'AGENDADO':
        return 'Agendado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não informada';

    try {
      const date = new Date(dateString);

      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }

      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const getClientDisplayName = (client: RouteClient) => {
    if (client.clientDetails) {
      return client.clientDetails.companyName;
    }
    return client.customerNameUnregistered || 'Cliente não cadastrado';
  };

  const getClientLocation = (client: RouteClient) => {
    if (client.clientDetails) {
      return `${client.clientDetails.city} - ${client.clientDetails.state}`;
    }
    return `${client.customerCityUnregistered || 'N/A'} - ${client.customerStateUnregistered || 'N/A'}`;
  };

  const handleViewDetails = (routeId: number) => {
    router.push(`/clientsVisitsRegisteredRoutes/${routeId}`);
  };

  const handleDeleteRoute = async (routeId: number) => {
    if (!user) return;

    // Confirmação antes de deletar
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esta rota? Esta ação não pode ser desfeita.',
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/deleteVisitRoute?routeId=${routeId}&userId=${user.id}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao deletar rota');
      }

      // Remover a rota da lista local
      setRoutes((prevRoutes) =>
        prevRoutes.filter((route) => route.id !== routeId),
      );

      alert('Rota deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar rota:', error);
      alert(error instanceof Error ? error.message : 'Erro ao deletar rota');
    }
  };

  if (loading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      {/* Filtros */}
      <Box sx={{ ...styles.filtersContainer, width: '100%' }}>
        <FormControl sx={styles.inputContainer}>
          <InputLabel>Ano</InputLabel>
          <Select
            value={selectedYear}
            label="Ano"
            onChange={(e) => setSelectedYear(e.target.value)}
            size="small"
          >
            {availableYears.map((year) => (
              <MenuItem key={year} value={year.toString()}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={styles.inputContainer}>
          <InputLabel>Mês</InputLabel>
          <Select
            value={selectedMonth}
            label="Mês"
            onChange={(e) => setSelectedMonth(e.target.value)}
            size="small"
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Lista de Rotas */}
      {routes.length === 0 ? (
        <Box sx={styles.noRoutesContainer}>
          <RouteIcon sx={{ fontSize: 64, opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary">
            Nenhuma rota encontrada para o período selecionado
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={3} justifyContent="center">
            {routes.map((route) => (
              <Grid item xs={12} sm={6} md={6} lg={5} key={route.id}>
                <Card
                  sx={styles.card}
                  onClick={() => handleViewDetails(route.id)}
                >
                  <CardContent sx={styles.cardContent}>
                    {/* Cabeçalho da Rota */}
                    <Box sx={styles.routeHeader}>
                      <Box>
                        <Typography sx={styles.routeTitle}>
                          Rota #{route.id}
                        </Typography>

                        {route.userName && (
                          <Typography sx={styles.routeUserName}>
                            <Box
                              component="span"
                              sx={{
                                display: 'inline',
                                '@media (max-width: 600px)': {
                                  display: 'block',
                                },
                              }}
                            >
                              Criado por{' '}
                            </Box>
                            <Box
                              component="span"
                              sx={{
                                display: 'inline',
                                '@media (max-width: 600px)': {
                                  display: 'block',
                                  marginTop: '2px',
                                },
                              }}
                            >
                              {route.userName}
                            </Box>
                          </Typography>
                        )}
                        <Typography sx={styles.routeDate}>
                          Agendado para {formatDate(route.scheduledDate)}
                        </Typography>
                      </Box>
                      <Chip
                        label={
                          route.routeStatus === 'EM_ABERTO'
                            ? 'Em Aberto'
                            : 'Concluído'
                        }
                        color={
                          route.routeStatus === 'EM_ABERTO'
                            ? 'primary'
                            : 'success'
                        }
                        size="small"
                        sx={styles.chip}
                      />
                    </Box>
                    {/* Nome da Rota */}
                    <Typography sx={styles.routeName}>
                      {route.routeName}
                    </Typography>

                    {route.description && (
                      <Typography sx={styles.routeDescription}>
                        {route.description}
                      </Typography>
                    )}

                    {/* Estatísticas */}
                    <Box sx={styles.statsContainer}>
                      {/* Primeira linha: Clientes e Agendados */}
                      <Box sx={styles.statsRow}>
                        <Chip
                          label={`${route.totalClients} clientes`}
                          size="small"
                          sx={{
                            ...styles.chip,
                            backgroundColor: blueGrey[400],
                            color: '#ffffff',
                          }}
                        />
                        <Chip
                          label={`${route.scheduledVisits} agendados`}
                          color="info"
                          size="small"
                          sx={styles.chip}
                        />
                      </Box>
                      {/* Segunda linha: Pendentes e Concluídos */}
                      <Box sx={styles.statsRow}>
                        <Chip
                          label={`${route.pendingVisits} pendentes`}
                          color="warning"
                          size="small"
                          sx={styles.chip}
                        />
                        <Chip
                          label={`${route.completedVisits} concluídas`}
                          color="success"
                          size="small"
                          sx={styles.chip}
                        />
                      </Box>
                    </Box>

                    {/* Lista de Rotas */}
                    <Box sx={styles.clientsList}>
                      {route.clients.slice(0, 3).map((client) => (
                        <Box key={client.id} sx={styles.clientItem}>
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={styles.clientName}>
                              {getClientDisplayName(client)}
                            </Typography>
                            <Typography sx={styles.clientLocation}>
                              {getClientLocation(client)}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            {!client.clientDetails && (
                              <Tooltip title="Cliente não cadastrado">
                                <PersonOffIcon
                                  fontSize="small"
                                  color="warning"
                                />
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      ))}
                      {route.clients.length > 3 && (
                        <Typography variant="caption" color="text.secondary">
                          +{route.clients.length - 3} mais clientes...
                        </Typography>
                      )}
                    </Box>

                    {/* Ações */}
                    <Box sx={styles.actionsContainer}>
                      <Tooltip title="Ver detalhes da rota">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(route.id);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir rota">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRoute(route.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ClientsVisitsRegisteredRoutes;
