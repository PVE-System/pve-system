'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Button,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { blueGrey, orange } from '@mui/material/colors';
import {
  Route as RouteIcon,
  PersonOff as PersonOffIcon,
  Update as UpdateIcon,
  LocationOn as LocationOnIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HeartBroken as HeartBrokenIcon,
} from '@mui/icons-material';
import { useAuth } from '@/app/contex/authContext';
import { useRouter } from 'next/navigation';
import styles from './styles';
import AlertModalClientsVisitsRoute from '../AlertModalClientsVisitsRoute/AlertModalClientsVisitsRoute';

// Função para renderizar o texto como está no banco
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') return '';
  return str;
};

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

interface ClientsVisitsRegisteredRoutesByIdProps {
  routeId: string;
}

const ClientsVisitsRegisteredRoutesById: React.FC<
  ClientsVisitsRegisteredRoutesByIdProps
> = ({ routeId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [route, setRoute] = useState<VisitRoute | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [alertModal, setAlertModal] = useState({
    open: false,
    title: '',
    message: '',
  });

  const fetchRouteById = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/getVisitRouteById?routeId=${routeId}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar rota');
      }

      const data = await response.json();
      setRoute(data.route);
    } catch (error) {
      console.error('Erro ao buscar rota:', error);
    } finally {
      setLoading(false);
    }
  }, [user, routeId]);

  useEffect(() => {
    fetchRouteById();
  }, [fetchRouteById]);

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

  const handleBack = () => {
    router.back();
  };

  const handleUpdateVisit = (clientId: number, clientName: string) => {
    // Encontrar o ID da visita do cliente
    const clientVisit = route?.clients.find(
      (client) =>
        client.clientId === clientId ||
        client.customerNameUnregistered === clientName,
    );

    if (clientVisit) {
      router.push(`/clientsVisitsById?visitId=${clientVisit.id}`);
    } else {
      alert('Erro: Não foi possível encontrar a visita deste cliente.');
    }
  };

  const handleCheckLocation = (
    clientName: string,
    city: string,
    state: string,
  ) => {
    // Abrir Google Maps com a localização do cliente
    const searchQuery = encodeURIComponent(`${clientName}, ${city}, ${state}`);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleEditRoute = () => {
    if (route?.id) {
      router.push(`/clientsVisitsEditRoute?routeId=${route.id}`);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!user || !route) return;

    setUpdatingStatus(true);
    try {
      // Determinar a nova descrição baseada no status
      let newDescription = '';
      if (newStatus === 'CONCLUIDO') {
        newDescription = `Rota Concluída em: ${new Date().toLocaleDateString('pt-BR')}`;
      } else if (newStatus === 'EM_ABERTO') {
        newDescription = 'Esta rota ainda não foi concluída.';
      }

      const response = await fetch('/api/updateRegisteredRoutes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routeId: route.id,
          userId: parseInt(user.id),
          routeStatus: newStatus,
          description: newDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar status da rota');
      }

      const result = await response.json();

      // Atualizar o estado local
      setRoute((prev) =>
        prev
          ? {
              ...prev,
              routeStatus: newStatus,
              description: newDescription,
            }
          : null,
      );

      console.log('Status da rota atualizado com sucesso:', result);
      setAlertModal({
        open: true,
        title: 'Aviso:',
        message: 'Status da rota foi alterado com sucesso!',
      });

      // Redirecionar para a página de rotas registradas após fechar o modal
      // router.push('/clientsVisitsRegisteredRoutes');
    } catch (error) {
      console.error('Erro ao atualizar status da rota:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar status da rota',
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCloseAlertModal = () => {
    setAlertModal({ open: false, title: '', message: '' });
    // Redirecionar para a página de rotas registradas após fechar o modal
    router.push('/clientsVisitsRegisteredRoutes');
  };

  if (loading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (!route) {
    return (
      <Box sx={styles.noRouteContainer}>
        <RouteIcon sx={{ fontSize: 64, opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary">
          Rota não encontrada
        </Typography>
        <Button variant="contained" onClick={handleBack}>
          Voltar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <AlertModalClientsVisitsRoute
        open={alertModal.open}
        title={alertModal.title}
        message={alertModal.message}
        onClose={handleCloseAlertModal}
      />
      {/* Card da Rota */}
      <Card sx={styles.card}>
        <CardContent sx={styles.cardContent}>
          {/* Cabeçalho da Rota */}
          <Box sx={styles.routeHeader}>
            <Box>
              <Typography sx={styles.routeTitle}>Rota #{route.id}</Typography>

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
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                '@media (max-width: 600px)': {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 0.5,
                },
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={handleEditRoute}
                sx={{
                  fontSize: '12px',
                  height: '32px',
                  minWidth: 105,
                  '@media (max-width: 600px)': {
                    fontSize: '11px',
                    height: '28px',
                    minWidth: 105,
                  },
                }}
              >
                Editar Rota
              </Button>
              <FormControl
                size="small"
                sx={{
                  minWidth: 120,
                  '@media (max-width: 600px)': {
                    minWidth: '90px',
                  },
                }}
              >
                <Select
                  value={route.routeStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updatingStatus}
                  sx={{
                    fontSize: '12px',
                    height: '32px',
                    '& .MuiSelect-select': {
                      fontSize: '12px',
                    },
                    '@media (max-width: 600px)': {
                      fontSize: '11px',
                      height: '28px',
                      '& .MuiSelect-select': {
                        fontSize: '11px',
                      },
                    },
                  }}
                >
                  <MenuItem
                    value="EM_ABERTO"
                    sx={{
                      fontSize: '12px',
                      '@media (max-width: 600px)': {
                        fontSize: '11px',
                      },
                    }}
                  >
                    Em Aberto
                  </MenuItem>
                  <MenuItem
                    value="CONCLUIDO"
                    sx={{
                      fontSize: '12px',
                      '@media (max-width: 600px)': {
                        fontSize: '11px',
                      },
                    }}
                  >
                    Concluído
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          {/* Nome da Rota */}
          <Typography sx={styles.routeName}>{route.routeName}</Typography>
          {/* Descrição */}
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
                size="medium"
                sx={{
                  ...styles.chip,
                  backgroundColor: blueGrey[400],
                  color: '#ffffff',
                }}
              />
              <Chip
                label={`${route.scheduledVisits} agendados`}
                color="info"
                size="medium"
                sx={styles.chip}
              />
            </Box>
            {/* Segunda linha: Pendentes e Concluídos */}
            <Box sx={styles.statsRow}>
              <Chip
                label={`${route.pendingVisits} pendentes`}
                color="warning"
                size="medium"
                sx={styles.chip}
              />
              <Chip
                label={`${route.completedVisits} concluídas`}
                color="success"
                size="medium"
                sx={styles.chip}
              />
            </Box>
            {/* Terceira linha: Desinteressados */}
            {route.disinterestedVisits > 0 && (
              <Box sx={styles.statsRow}>
                <Chip
                  label={`${route.disinterestedVisits} desinteressados`}
                  color="error"
                  size="medium"
                  sx={styles.chip}
                />
              </Box>
            )}
          </Box>

          {/* Lista de Clientes */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '18px',
              '@media (max-width: 600px)': {
                fontSize: '14px',
              },
            }}
          >
            Clientes da Rota
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 2,

              fontSize: '14px',
              '@media (max-width: 600px)': {
                fontSize: '10px',
              },
            }}
          >
            Acesse cada cliente para atualizar informações sobre a visita
          </Typography>
          <Box sx={styles.clientsList}>
            {route.clients.map((client) => (
              <Box
                key={client.id}
                sx={{
                  ...styles.clientItem,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
                onClick={() =>
                  handleUpdateVisit(
                    client.clientId || 0,
                    getClientDisplayName(client),
                  )
                }
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={styles.clientName}>
                    {renderAsIs(getClientDisplayName(client).slice(0, 40))}
                    {getClientDisplayName(client).length > 40 && '...'}
                  </Typography>
                  <Typography sx={styles.clientLocation}>
                    {getClientLocation(client)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {!client.clientDetails && (
                    <Tooltip title="Cliente não cadastrado">
                      <PersonOffIcon fontSize="small" color="warning" />
                    </Tooltip>
                  )}
                  {/* Ícone de checklist confirmado para visitas concluídas */}
                  {client.visitStatus === 'CONCLUIDO' && (
                    <Tooltip title="Visita concluída">
                      <CheckCircleIcon fontSize="small" color="success" />
                    </Tooltip>
                  )}

                  {/* Ícone de pendência para visitas pendentes */}
                  {client.visitStatus === 'PENDENTE' && (
                    <Tooltip title="Visita pendente">
                      <ErrorIcon fontSize="small" color="warning" />
                    </Tooltip>
                  )}

                  {/* Ícone de desinteressado para clientes desinteressados */}
                  {client.visitStatus === 'DESINTERESSADO' && (
                    <Tooltip title="Cliente desinteressado">
                      <HeartBrokenIcon fontSize="small" color="error" />
                    </Tooltip>
                  )}

                  {/* Ícone de localização no Google Maps */}
                  <Tooltip title="Confira a localização no Google">
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckLocation(
                          getClientDisplayName(client),
                          client.clientDetails?.city ||
                            client.customerCityUnregistered ||
                            '',
                          client.clientDetails?.state ||
                            client.customerStateUnregistered ||
                            '',
                        );
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(156, 39, 176, 0.1)',
                        },
                      }}
                    >
                      <LocationOnIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientsVisitsRegisteredRoutesById;
