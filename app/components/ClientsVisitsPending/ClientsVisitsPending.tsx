'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Box,
  useMediaQuery,
  CircularProgress,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import styles from './styles';

// Interface para os dados das visitas pendentes
interface PendingVisit {
  id: number;
  visitRouteId: number;
  clientName: string; // companyName ou customerNameUnregistered
  visitStatus: string;
  routeName: string;
  scheduledDate: string;
  isRegisteredClient: boolean; // Para diferenciar clientes cadastrados de não cadastrados
}

const ClientsVisitsPending: React.FC = () => {
  const router = useRouter();
  const [pendingVisits, setPendingVisits] = useState<PendingVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<
    'PENDENTE' | 'DESINTERESSADO'
  >('PENDENTE');
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  // Função para formatar a data escolhida pelo usuário
  const formatUserSelectedDate = (utcDate: Date | string | null) => {
    if (!utcDate) return 'Data não informada';

    try {
      const date = new Date(utcDate);

      // Verificar se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }

      // Como a data foi salva em UTC, precisamos ajustar para o fuso horário local
      // A data foi salva como UTC mas representa uma data escolhida pelo usuário
      const localDate = new Date(
        date.getTime() + date.getTimezoneOffset() * 60000,
      );

      // Formatar para DD/MM/AAAA
      return localDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  // Função para renderizar o texto como está no banco
  const renderAsIs = (str: any) => {
    if (typeof str !== 'string') return '';
    return str;
  };

  // Função para navegar para a página da rota em nova aba
  const handleRowClick = (visitRouteId: number) => {
    window.open(`/clientsVisitsRegisteredRoutes/${visitRouteId}`, '_blank');
  };

  // Função para voltar para a página anterior
  const handleBack = () => {
    router.push('/clientsVisits');
  };

  // Buscar visitas com filtro de status
  useEffect(() => {
    const fetchFilteredVisits = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/getPendingVisitsByClient?status=${statusFilter}`,
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar visitas');
        }

        const data = await response.json();
        setPendingVisits(data.pendingVisits);
      } catch (error) {
        console.error('Erro ao buscar visitas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredVisits();
  }, [statusFilter]);

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

      <Container maxWidth="lg" sx={styles.container}>
        {/* Filtro de Status */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label">Filtrar por Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Filtrar por Status"
              onChange={(e) =>
                setStatusFilter(e.target.value as 'PENDENTE' | 'DESINTERESSADO')
              }
            >
              <MenuItem value="PENDENTE">Pendentes</MenuItem>
              <MenuItem value="DESINTERESSADO">Desinteressados</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.fontSize}>Nº</TableCell>
                <TableCell sx={styles.fontSize}>Cliente</TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell sx={styles.fontSize}>Status da Visita</TableCell>
                    <TableCell sx={styles.fontSize}>Nome da Rota</TableCell>
                    <TableCell sx={styles.fontSize}>Data da Viagem</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingVisits.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isSmallScreen ? 2 : 5}
                    align="center"
                    sx={{ py: 4, border: 'none' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Nenhuma visita{' '}
                      {statusFilter === 'PENDENTE'
                        ? 'pendente'
                        : 'desinteressada'}{' '}
                      encontrada.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pendingVisits.map((visit, index) => (
                  <TableRow
                    key={visit.id}
                    sx={{ ...styles.rowHover, cursor: 'pointer' }}
                    onClick={() => handleRowClick(visit.visitRouteId)}
                  >
                    <TableCell sx={styles.fontSize}>{index + 1}</TableCell>
                    <TableCell sx={styles.fontSize}>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 'medium' }}
                        >
                          {renderAsIs(
                            visit.clientName.slice(0, isSmallScreen ? 25 : 40),
                          )}
                          {visit.clientName.length >
                            (isSmallScreen ? 25 : 40) && '...'}
                        </Typography>
                        {!isSmallScreen && (
                          <Typography variant="caption" color="text.secondary">
                            {visit.isRegisteredClient
                              ? ''
                              : 'Cliente Não Cadastrado'}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    {!isSmallScreen && (
                      <>
                        <TableCell sx={styles.fontSize}>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              backgroundColor:
                                visit.visitStatus === 'PENDENTE'
                                  ? 'orange.100'
                                  : 'red.100',
                              color:
                                visit.visitStatus === 'PENDENTE'
                                  ? 'orange.800'
                                  : 'red.800',
                              fontSize: '0.75rem',
                              fontWeight: 'medium',
                            }}
                          >
                            {visit.visitStatus}
                          </Box>
                        </TableCell>
                        <TableCell sx={styles.fontSize}>
                          {renderAsIs(
                            visit.routeName.slice(0, isSmallScreen ? 20 : 30),
                          )}
                          {visit.routeName.length > (isSmallScreen ? 20 : 30) &&
                            '...'}
                        </TableCell>
                        <TableCell sx={styles.fontSize}>
                          {formatUserSelectedDate(visit.scheduledDate)}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {pendingVisits.length > 0 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Total de {pendingVisits.length} visita(s){' '}
              {statusFilter === 'PENDENTE'
                ? 'pendente(s)'
                : 'desinteressada(s)'}
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default ClientsVisitsPending;
