'use client';

import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import styles from './styles';

// Interface para os dados das visitas pendentes
interface PendingVisit {
  id: number;
  clientName: string; // companyName ou customerNameUnregistered
  visitStatus: string;
  routeName: string;
  scheduledDate: string;
  isRegisteredClient: boolean; // Para diferenciar clientes cadastrados de não cadastrados
}

const ClientsVisitsPending: React.FC = () => {
  const [pendingVisits, setPendingVisits] = useState<PendingVisit[]>([]);
  const [loading, setLoading] = useState(true);
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

      // Formatar para DD/MM/AAAA
      return date.toLocaleDateString('pt-BR', {
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

  // Buscar visitas pendentes
  useEffect(() => {
    const fetchPendingVisits = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/getPendingVisitsByClient');

        if (!response.ok) {
          throw new Error('Erro ao buscar visitas pendentes');
        }

        const data = await response.json();
        setPendingVisits(data.pendingVisits);
      } catch (error) {
        console.error('Erro ao buscar visitas pendentes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingVisits();
  }, []);

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
    <Container maxWidth="lg" sx={styles.container}>
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
                    Nenhuma visita pendente encontrada.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pendingVisits.map((visit, index) => (
                <TableRow
                  key={visit.id}
                  sx={{ ...styles.rowHover, cursor: 'pointer' }}
                >
                  <TableCell sx={styles.fontSize}>{index + 1}</TableCell>
                  <TableCell sx={styles.fontSize}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {renderAsIs(
                          visit.clientName.slice(0, isSmallScreen ? 25 : 40),
                        )}
                        {visit.clientName.length > (isSmallScreen ? 25 : 40) &&
                          '...'}
                      </Typography>
                      {!isSmallScreen && (
                        <Typography variant="caption" color="text.secondary">
                          {visit.isRegisteredClient
                            ? 'Cliente Cadastrado'
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
                            backgroundColor: 'orange.100',
                            color: 'orange.800',
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
            Total de {pendingVisits.length} visita(s) pendente(s)
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ClientsVisitsPending;
