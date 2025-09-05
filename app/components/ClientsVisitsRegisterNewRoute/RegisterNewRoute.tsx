'use client';

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  PersonOff as PersonOffIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import styles from './styles';
import { useAuth } from '@/app/contex/authContext';
import { useRouter } from 'next/navigation';
import AlertModalClientsVisitsRoute from '../AlertModalClientsVisitsRoute/AlertModalClientsVisitsRoute';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Interface para o tipo dos dados do cliente
interface Client {
  id: string;
  companyName: string;
  corfioCode: string;
  clientCondition: string;
  rating: number;
  state: string;
  city: string;
}

// Interface para clientes não cadastrados
interface UnregisteredClient {
  id: string;
  companyName: string;
  state: string;
  city: string;
  isUnregistered: boolean;
}

// Função para renderizar o texto como está no banco
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') return '';
  return str;
};

// Componente SortableTableRow para cada linha da tabela
const SortableTableRow = ({
  client,
  index,
  isSmallScreen,
  handleClientDetails,
  handleRemoveClient,
  isUnregisteredClient,
}: {
  client: any;
  index: number;
  isSmallScreen: boolean;
  handleClientDetails: (id: string) => void;
  handleRemoveClient: (id: string) => void;
  isUnregisteredClient: (client: any) => boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: client.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      sx={{
        ...styles.rowHover,
        cursor: 'grab',
        '&:active': {
          cursor: 'grabbing',
        },
        backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.05)' : 'inherit',
      }}
      {...attributes}
      {...listeners}
    >
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
        {renderAsIs(client.companyName.slice(0, isSmallScreen ? 25 : 35))}
        {client.companyName.length > (isSmallScreen ? 25 : 35) && '...'}
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
          <TableCell
            sx={{
              ...styles.fontSize,
              width: '80px',
              minWidth: '80px',
            }}
          >
            {client.corfioCode || '-'}
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
                      backgroundColor: 'rgba(255, 165, 0, 0.1)',
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
                  onClick={() => handleClientDetails(client.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
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
  );
};

const RegisterNewRoute = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('MS');
  const [cityFilter, setCityFilter] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedClients, setSelectedClients] = useState<
    (Client | UnregisteredClient)[]
  >([]);
  const [isCreatingRoute, setIsCreatingRoute] = useState(false);
  const [unregisteredClientName, setUnregisteredClientName] = useState('');
  const [unregisteredClientState, setUnregisteredClientState] = useState('');
  const [unregisteredClientCity, setUnregisteredClientCity] = useState('');
  const [routeName, setRouteName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [alertModal, setAlertModal] = useState({
    open: false,
    title: '',
    message: '',
  });
  const [pendingRouteId, setPendingRouteId] = useState<number | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const fetchClientsByCities = async (state: string) => {
    try {
      setLoading(true);

      let url = `/api/getClientsByCities?state=${state}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao buscar clientes');

      const data = await response.json();
      setAllClients(data.clients); // Armazena a lista completa de clientes do estado
      setClients(data.clients); // Inicialmente, todos os clientes

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
    } finally {
      setLoading(false);
    }
  };

  // Buscar clientes sempre que mudar o estado
  useEffect(() => {
    if (stateFilter) {
      fetchClientsByCities(stateFilter);
      setCityFilter(''); // Limpa cidade ao mudar estado
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
    const isAlreadySelected = selectedClients.some((selected) => {
      // Compara IDs convertendo ambos para string para garantir consistência
      return String(selected.id) === String(client.id);
    });

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

  const handleCreateRoute = async () => {
    if (selectedClients.length === 0) return;

    setIsCreatingRoute(true);
    try {
      // Preparar dados dos clientes para a API
      const clientsData = selectedClients.map((client) => {
        if (isUnregisteredClient(client)) {
          return {
            customerNameUnregistered: client.companyName,
            customerStateUnregistered: client.state,
            customerCityUnregistered: client.city,
          };
        } else {
          return {
            clientId: parseInt(client.id),
          };
        }
      });

      // Verificar se o usuário está autenticado
      if (!user) {
        alert('Usuário não autenticado');
        return;
      }

      const response = await fetch('/api/registerVisitRoute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(user.id),
          routeName: routeName,
          scheduledDate: scheduledDate,
          description: 'Esta rota ainda não foi concluída.',
          clients: clientsData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar rota');
      }

      const result = await response.json();
      console.log('Rota criada com sucesso:', result);

      // Limpar a lista de clientes selecionados e os campos
      setSelectedClients([]);
      setRouteName('');
      setScheduledDate('');

      setPendingRouteId(result.routeId ?? null);
      setAlertModal({
        open: true,
        title: 'Aviso:',
        message: 'Rota criada com sucesso!',
      });

      // Removido: navegação imediata. Agora só após fechar o modal
    } catch (error) {
      console.error('Erro ao criar rota:', error);
      alert(error instanceof Error ? error.message : 'Erro ao criar rota');
    } finally {
      setIsCreatingRoute(false);
    }
  };

  const handleAddUnregisteredClient = () => {
    if (!unregisteredClientName.trim()) return;

    const newUnregisteredClient: UnregisteredClient = {
      id: `unregistered-${Date.now()}`, // ID único para clientes não cadastrados
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

  // Configuração dos sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Função para lidar com o fim do drag & drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSelectedClients((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  const handleCloseAlertModal = () => {
    const goTo = pendingRouteId;
    setAlertModal({ open: false, title: '', message: '' });
    setPendingRouteId(null);
    if (goTo) {
      router.push(`/clientsVisitsRegisteredRoutes/${goTo}`);
    }
  };

  // Função para voltar à página principal
  const handleBack = () => {
    router.push('/clientsVisits');
  };

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

      <Container maxWidth="xl" sx={{ py: 2 }}>
        <AlertModalClientsVisitsRoute
          open={alertModal.open}
          title={alertModal.title}
          message={alertModal.message}
          onClose={handleCloseAlertModal}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr', // Mobile
              sm: '1fr', // Tablet
              md: '1fr 1fr', // Desktop pequeno
              lg: '1fr 1fr', // Desktop grande
              xl: '1fr 1fr', // Desktop extra grande
            },
            gap: 3,
            alignItems: 'start', // Alinha os containers no topo
          }}
        >
          {/* Seção de Clientes Selecionados */}
          <Box
            sx={{
              ...styles.container,
              display: 'flex',
              flexDirection: 'column',
              height: '700px', // Altura fixa
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  fontSize: {
                    xs: '14px', // Mobile
                    sm: '16px', // Tablet e monitores pequenos
                    md: '18px', // Telas grandes
                  },
                }}
              >
                Organize a sua rota de visitas
              </Typography>
            </Box>

            {/* Inputs para nome da rota e data agendada */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: {
                    xs: 'column', // Mobile: um embaixo do outro
                    sm: 'row', // Tablet e telas maiores: lado a lado
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
                      xs: 'none', // Mobile: ocupa toda a largura
                      sm: 1, // Tablet e telas maiores: ocupa metade do espaço
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
                      xs: 'none', // Mobile: ocupa toda a largura
                      sm: 1, // Tablet e telas maiores: ocupa metade do espaço
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                    },
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                    },
                  }}
                  inputProps={{
                    maxLength: 10, // DD/MM/AAAA = 10 caracteres
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
                overflow: 'hidden', // Previne overflow
                minWidth: 0, // Permite que o container encolha
              }}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <TableContainer
                  sx={{ flex: 1, overflow: 'hidden auto', minWidth: 0 }}
                >
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
                            <TableCell
                              sx={{
                                ...styles.fontSize,
                                width: '80px',
                                minWidth: '80px',
                              }}
                            >
                              Corfio:
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
                                    width: '80px',
                                    minWidth: '80px',
                                  }}
                                >
                                  -
                                </TableCell>
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
                              colSpan={isSmallScreen ? 3 : 6}
                              align="center"
                              sx={{ py: 4, border: 'none' }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Escolha os clientes para adicioná-los aqui em
                                sua nova rota.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <SortableContext
                          items={selectedClients.map((client) => client.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {selectedClients.map((client, index) => (
                            <SortableTableRow
                              key={client.id}
                              client={client}
                              index={index}
                              isSmallScreen={isSmallScreen}
                              handleClientDetails={handleClientDetails}
                              handleRemoveClient={handleRemoveClient}
                              isUnregisteredClient={isUnregisteredClient}
                            />
                          ))}
                        </SortableContext>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DndContext>
            </Box>

            {/* Botão Criar Rota */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleCreateRoute}
                disabled={
                  selectedClients.length === 0 ||
                  !routeName.trim() ||
                  !scheduledDate.trim() ||
                  isCreatingRoute
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
                {isCreatingRoute ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Criar Rota'
                )}
              </Button>
            </Box>
          </Box>

          {/* Lista dos clientes cadastrados */}
          <Box
            sx={{
              ...styles.container,
              height: '700px', // Mesma altura do primeiro container
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
                    xs: '14px', // Mobile
                    sm: '16px', // Tablet e monitores pequenos
                    md: '18px', // Telas grandes
                  },
                }}
              >
                Escolha clientes para a sua rota.
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
                gap: 2, // Espaço entre os selects
                flexWrap: 'wrap', // Responsivo caso fique apertado na tela pequena
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
                      fontSize: '14px', // Tamanho da fonte do label
                    },
                    '& .MuiSelect-select': {
                      fontSize: '14px', // Tamanho da fonte do valor selecionado
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
                        fontSize: '14px', // Tamanho da fonte do label
                      },
                      '& .MuiSelect-select': {
                        fontSize: '14px', // Tamanho da fonte do valor selecionado
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
                      xs: '10px', // Mobile
                      sm: '12px', // Tablet
                      md: '14px', // Desktop
                    },

                    minWidth: {
                      xs: '120px', // Mobile - largura menor
                      sm: '150px', // Tablet
                      md: '200px', // Desktop
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
                          <TableCell sx={styles.fontSize}>Corfio:</TableCell>
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
                      filteredClients.map((client) => {
                        const isAlreadySelected = selectedClients.some(
                          (selected) =>
                            String(selected.id) === String(client.id),
                        );

                        return (
                          <TableRow
                            key={client.id}
                            sx={{
                              ...styles.rowHover,
                              cursor: isAlreadySelected
                                ? 'not-allowed'
                                : 'pointer',
                              opacity: isAlreadySelected ? 0.5 : 1,
                              backgroundColor: isAlreadySelected
                                ? 'rgba(0, 0, 0, 0.05)'
                                : 'inherit',
                            }}
                            onClick={() =>
                              !isAlreadySelected && handleRowClick(client)
                            }
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
                                <TableCell sx={styles.fontSize}>
                                  {client.corfioCode || '-'}
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default RegisterNewRoute;
