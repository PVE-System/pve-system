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
  Button,
} from '@mui/material';
import { blueGrey, orange } from '@mui/material/colors';
import {
  Route as RouteIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  PersonOff as PersonOffIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useAuth } from '@/app/contex/authContext';
import { useRouter } from 'next/navigation';
import styles from './styles';
import AlertModalClientsVisitsRoute from '../AlertModalClientsVisitsRoute/AlertModalClientsVisitsRoute';

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
    corfioCode: string;
  } | null;
}

interface VisitRoute {
  id: number;
  userId: number;
  routeName: string;
  scheduledDate: string; // Vem formatada como "DD/MM/AAAA" da API
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
  disinterestedVisits: number;
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
  const [alertModal, setAlertModal] = useState({
    open: false,
    title: '',
    message: '',
    isConfirmation: false,
    onConfirm: null as (() => void) | null,
  });

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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não informada';

    // Se a data já vem formatada da API (DD/MM/AAAA), retorna diretamente
    if (dateString.includes('/')) {
      return dateString;
    }

    // Fallback para datas em formato ISO
    try {
      const date = new Date(dateString);
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

  const getClientCorfio = (client: RouteClient) => {
    if (client.clientDetails) {
      return client.clientDetails.corfioCode || 'N/D';
    }
    return 'N/D';
  };

  const handleViewDetails = (routeId: number) => {
    router.push(`/clientsVisitsRegisteredRoutes/${routeId}`);
  };

  // Função para voltar à página principal
  const handleBack = () => {
    router.push('/clientsVisits');
  };

  const handleDeleteRoute = async (routeId: number) => {
    if (!user) return;

    // Confirmação antes de deletar
    setAlertModal({
      open: true,
      title: 'Confirmar Exclusão:',
      message: 'Tem certeza que deseja excluir esta rota?',
      isConfirmation: true,
      onConfirm: () => executeDeleteRoute(routeId),
    });
  };

  const executeDeleteRoute = async (routeId: number) => {
    if (!user) return;

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

      setAlertModal({
        open: true,
        title: 'Aviso:',
        message: 'Rota deletada com sucesso!',
        isConfirmation: false,
        onConfirm: null,
      });
    } catch (error) {
      console.error('Erro ao deletar rota:', error);
      alert(error instanceof Error ? error.message : 'Erro ao deletar rota');
    }
  };

  const handleCloseAlertModal = () => {
    setAlertModal({
      open: false,
      title: '',
      message: '',
      isConfirmation: false,
      onConfirm: null,
    });
  };

  if (loading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Botão Voltar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            fontSize: { xs: '11px', sm: '12px' },
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            minWidth: { xs: '80px', sm: 'auto' },
            height: { xs: '26px', sm: 'auto' },
            px: { xs: 1, sm: 2 },
          }}
        >
          Voltar
        </Button>
      </Box>

      <Box sx={styles.container}>
        <AlertModalClientsVisitsRoute
          open={alertModal.open}
          title={alertModal.title}
          message={alertModal.message}
          onClose={handleCloseAlertModal}
          onConfirm={alertModal.onConfirm || undefined}
          isConfirmation={alertModal.isConfirmation}
          confirmText={alertModal.isConfirmation ? 'Confirmar' : 'OK'}
        />
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
                        {/* Terceira linha: Desinteressados */}
                        {route.disinterestedVisits > 0 && (
                          <Box sx={styles.statsRow}>
                            <Chip
                              label={`${route.disinterestedVisits} desinteressados`}
                              color="error"
                              size="small"
                              sx={styles.chip}
                            />
                          </Box>
                        )}
                      </Box>

                      {/* Lista de Rotas */}
                      <Box sx={styles.clientsList}>
                        {route.clients.slice(0, 3).map((client) => (
                          <Box key={client.id} sx={styles.clientItem}>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={styles.clientName}>
                                {getClientDisplayName(client)}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: { xs: 'column', sm: 'row' },
                                  gap: { sm: 1 },
                                  alignItems: {
                                    xs: 'flex-start',
                                    sm: 'center',
                                  },
                                }}
                              >
                                <Typography sx={styles.clientLocation}>
                                  {getClientLocation(client)}
                                </Typography>
                                <Typography sx={styles.clientLocation}>
                                  Corfio: {getClientCorfio(client)}
                                </Typography>
                              </Box>
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
    </>
  );
};

export default ClientsVisitsRegisteredRoutes;
