'use client';

import React, { useEffect, useState } from 'react';
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
import { Theme } from '@mui/material';
import { useAuth } from '@/app/contex/authContext';
import { useRouter } from 'next/navigation';

// Função para renderizar o texto como está no banco
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') return '';
  return str;
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  backButton: {
    alignSelf: 'flex-start',
    mb: 2,
  },

  card: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.alternative,
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    width: '100%',
    maxWidth: '600px',
  },

  cardContent: {
    padding: '24px',
  },

  routeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 3,
  },

  routeTitle: {
    fontWeight: 600,
    fontSize: '24px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.primary
        : theme.palette.text.primary,
    '@media (max-width: 600px)': {
      fontSize: '18px',
    },
  },

  routeName: {
    fontSize: '18px',
    fontWeight: 500,
    color: orange[800],
    mb: 1,
    '@media (max-width: 600px)': {
      fontSize: '16px',
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
    mb: 3,
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
    maxHeight: '400px',
    overflow: 'auto',
  },

  clientItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
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
    fontSize: '14px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },

  statusChip: {
    fontSize: '10px',
    height: '20px',
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },

  noRouteContainer: {
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

  const fetchRouteById = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/getVisitRouteById?routeId=${routeId}&userId=${user.id}`,
      );
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
  };

  useEffect(() => {
    fetchRouteById();
  }, [user, routeId]);

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
    // TODO: Implementar funcionalidade de editar rota
    console.log('Editar rota:', route?.id);
    alert('Funcionalidade de editar rota será implementada em breve.');
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
      alert('Status da rota foi alterado com sucesso');

      // Redirecionar para a página de rotas registradas
      router.push('/clientsVisitsRegisteredRoutes');
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
