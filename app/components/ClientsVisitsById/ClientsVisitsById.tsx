'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PersonOff as PersonOffIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
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

interface VisitRouteClient {
  id: number;
  visitRouteId: number;
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
    corfioCode: string;
  } | null;
}

interface ClientsVisitsByIdProps {
  visitId: string;
}

const ClientsVisitsById: React.FC<ClientsVisitsByIdProps> = ({ visitId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [visit, setVisit] = useState<VisitRouteClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    visitStatus: '',
    currentVisitDescription: '',
    lastVisitDescription: '',
  });
  const [alertModal, setAlertModal] = useState({
    open: false,
    title: '',
    message: '',
  });

  const fetchVisitById = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/getVisitRouteClientById?visitId=${visitId}&userId=${user.id}`,
      );
      if (!response.ok) {
        throw new Error('Erro ao buscar visita');
      }

      const data = await response.json();
      setVisit(data.visit);
      setFormData({
        visitStatus: data.visit.visitStatus,
        currentVisitDescription: data.visit.currentVisitDescription || '',
        lastVisitDescription: data.visit.lastVisitDescription || '',
      });
    } catch (error) {
      console.error('Erro ao buscar visita:', error);
    } finally {
      setLoading(false);
    }
  }, [user, visitId]);

  useEffect(() => {
    fetchVisitById();
  }, [fetchVisitById]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    if (!user || !visit) return;

    setSaving(true);
    try {
      const response = await fetch('/api/updateVisitRouteClient', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitId: visit.id,
          userId: parseInt(user.id),
          visitStatus: formData.visitStatus,
          currentVisitDescription: formData.currentVisitDescription,
          lastVisitDescription: formData.lastVisitDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar visita');
      }

      const result = await response.json();
      console.log('Visita atualizada com sucesso:', result);
      setAlertModal({
        open: true,
        title: 'Aviso:',
        message: 'Informações da visita atualizadas com sucesso!',
      });

      // Redirecionar para a página da rota após fechar o modal
      // if (result.routeId) {
      //   router.push(`/clientsVisitsRegisteredRoutes/${result.routeId}`);
      // }
    } catch (error) {
      console.error('Erro ao atualizar visita:', error);
      alert(
        error instanceof Error ? error.message : 'Erro ao atualizar visita',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCloseAlertModal = () => {
    setAlertModal({ open: false, title: '', message: '' });
    // Redirecionar para a página da rota após fechar o modal
    if (visit) {
      router.push(`/clientsVisitsRegisteredRoutes/${visit.visitRouteId}`);
    }
  };

  const handleViewClient = (clientId: number) => {
    window.open(`/clientPage?id=${clientId}`, '_blank');
  };

  const getClientDisplayName = (visit: VisitRouteClient) => {
    if (visit.clientDetails) {
      return visit.clientDetails.companyName;
    }
    return visit.customerNameUnregistered || 'Cliente não cadastrado';
  };

  const getClientLocation = (visit: VisitRouteClient) => {
    if (visit.clientDetails) {
      return `${visit.clientDetails.city} - ${visit.clientDetails.state}`;
    }
    return `${visit.customerCityUnregistered || 'N/A'} - ${visit.customerStateUnregistered || 'N/A'}`;
  };

  const getClientCorfio = (visit: VisitRouteClient) => {
    if (visit.clientDetails) {
      return visit.clientDetails.corfioCode || 'N/D';
    }
    return 'N/D';
  };

  if (loading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (!visit) {
    return (
      <Box sx={styles.noVisitContainer}>
        <Typography variant="h6" color="text.secondary">
          Visita não encontrada
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
      {/* Card da Visita */}
      <Card sx={styles.card}>
        <CardContent sx={styles.cardContent}>
          {/* Informações do Cliente */}
          <Box sx={styles.formSection}>
            <Typography sx={styles.sectionTitle}>Cliente</Typography>
            <Box sx={styles.clientInfoContainer}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    mb: 1,
                    '@media (max-width: 600px)': {
                      fontSize: '12px',
                    },
                  }}
                >
                  {renderAsIs(getClientDisplayName(visit).slice(0, 40))}
                  {getClientDisplayName(visit).length > 40 && '...'}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 0.5, sm: 1 },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: 'text.secondary',
                      '@media (max-width: 600px)': {
                        fontSize: '12px',
                      },
                    }}
                  >
                    {getClientLocation(visit)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: 'text.secondary',
                      '@media (max-width: 600px)': {
                        fontSize: '12px',
                      },
                    }}
                  >
                    Corfio: {getClientCorfio(visit)}
                  </Typography>
                </Box>
              </Box>
              <Box>
                {visit.clientDetails ? (
                  <Tooltip title="Ver detalhes do cliente">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewClient(visit.clientDetails!.id)}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        },
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Cliente não cadastrado">
                    <IconButton size="small" color="warning">
                      <PersonOffIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>

          {/* Status da Visita */}
          <Box sx={styles.formSection}>
            <Typography sx={styles.sectionTitle}>Status da Visita</Typography>
            <FormControl fullWidth>
              <Select
                value={formData.visitStatus}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    visitStatus: e.target.value,
                  }))
                }
                size="small"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                    '@media (max-width: 600px)': {
                      fontSize: '12px',
                    },
                  },
                  '& .MuiSelect-select': {
                    fontSize: '14px',
                    '@media (max-width: 600px)': {
                      fontSize: '12px',
                    },
                  },
                }}
              >
                <MenuItem
                  value="AGENDADO"
                  sx={{
                    fontSize: '14px',
                    '@media (max-width: 600px)': { fontSize: '12px' },
                  }}
                >
                  Agendado
                </MenuItem>
                <MenuItem
                  value="PENDENTE"
                  sx={{
                    fontSize: '14px',
                    '@media (max-width: 600px)': { fontSize: '12px' },
                  }}
                >
                  Pendente
                </MenuItem>
                <MenuItem
                  value="CONCLUIDO"
                  sx={{
                    fontSize: '14px',
                    '@media (max-width: 600px)': { fontSize: '12px' },
                  }}
                >
                  Concluído
                </MenuItem>
                <MenuItem
                  value="DESINTERESSADO"
                  sx={{
                    fontSize: '14px',
                    '@media (max-width: 600px)': { fontSize: '12px' },
                  }}
                >
                  Desinteressado
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Descrição da Visita Atual */}
          <Box sx={styles.formSection}>
            <Typography sx={styles.sectionTitle}>
              Descrição da Visita Atual
            </Typography>
            <TextField
              label="Observações da visita atual"
              value={formData.currentVisitDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  currentVisitDescription: e.target.value,
                }))
              }
              fullWidth
              multiline
              rows={4}
              size="small"
              placeholder="Descreva as observações da visita atual..."
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  '@media (max-width: 600px)': {
                    fontSize: '12px',
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: '14px',
                  '@media (max-width: 600px)': {
                    fontSize: '12px',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  fontSize: '14px',
                  '@media (max-width: 600px)': {
                    fontSize: '12px',
                  },
                },
              }}
            />
          </Box>

          {/* Descrição da Última Visita */}
          <Box sx={styles.formSection}>
            <Typography sx={styles.sectionTitle}>
              Descrição da Última Visita
            </Typography>
            <TextField
              label="Observações da última visita"
              value={formData.lastVisitDescription}
              fullWidth
              multiline
              rows={4}
              size="small"
              disabled
              placeholder="Observações da última visita..."
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  '@media (max-width: 600px)': {
                    fontSize: '12px',
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: '14px',
                  '@media (max-width: 600px)': {
                    fontSize: '12px',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  fontSize: '14px',
                  '@media (max-width: 600px)': {
                    fontSize: '12px',
                  },
                },
              }}
            />
          </Box>

          {/* Ações */}
          <Box
            sx={{
              ...styles.actionsContainer,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              sx={{
                fontSize: '12px',
                backgroundColor: 'green',
                '&:hover': {
                  backgroundColor: 'darkgreen',
                },
                mr: { xs: 0, sm: 2 }, // Margem apenas em telas maiores
                width: { xs: '100%', sm: 'auto' }, // Largura total em mobile
              }}
            >
              {saving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                'Salvar Alterações'
              )}
            </Button>
            <Button
              variant="contained"
              startIcon={<CancelIcon />}
              onClick={handleBack}
              disabled={saving}
              sx={{
                fontSize: '12px',
                width: { xs: '100%', sm: 'auto' }, // Largura total em mobile
              }}
            >
              Cancelar
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClientsVisitsById;
