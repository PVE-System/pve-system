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
} from '@mui/material';
import { Rating } from '@mui/material';
import styles from '@/app/components/ClientsMsList/styles';

interface Client {
  id: string;
  companyName: string;
  corfioCode: string;
  clientCondition: string;
  rating: number;
  state: string;
}

// Função Renderizar o nome do cliente com tamanho menor
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') {
    return '';
  }
  return str;
};

const ClientsOtherUfList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/getAllClients');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Remover a conversão para minúsculas e apenas limpar os estados
        const cleanedClients = data.clients.map((client: Client) => ({
          ...client,
          state: client.state.trim(), // Remove apenas espaços extras
        }));

        const filteredClients = cleanedClients.filter((client: Client) => {
          return !(
            client.state.toLowerCase() === 'mato grosso' ||
            client.state.toLowerCase() === 'mt' ||
            client.state.toLowerCase() === 'mato grosso do sul' ||
            client.state.toLowerCase() === 'ms'
          );
        });

        // Ordenar os clientes pelo nome da empresa em ordem alfabética
        const sortedClients = filteredClients.sort(
          (a: { companyName: string }, b: { companyName: any }) =>
            a.companyName.localeCompare(b.companyName),
        );

        setClients(sortedClients);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

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
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.fontSize}>Cliente:</TableCell>
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
            {clients.map((client) => (
              <TableRow
                key={client.id}
                sx={{ ...styles.rowHover, cursor: 'pointer' }}
                onClick={() => handleRowClick(client.id)}
              >
                <TableCell sx={styles.fontSize}>
                  {renderAsIs(client.companyName.slice(0, 50))}
                </TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell sx={styles.fontSize}>
                      {client.corfioCode}
                    </TableCell>
                    <TableCell sx={styles.fontSize}>
                      <Box>
                        <Button
                          sx={styles.buttonTagCondition}
                          variant="contained"
                          size="small"
                          color={
                            client.clientCondition === 'Normal'
                              ? 'success'
                              : client.clientCondition === 'Especial'
                                ? 'warning'
                                : client.clientCondition === 'Suspenso'
                                  ? 'error'
                                  : 'inherit'
                          }
                        >
                          {client.clientCondition === 'Normal'
                            ? 'Normal'
                            : client.clientCondition === 'Especial'
                              ? 'Especial'
                              : client.clientCondition === 'Suspenso'
                                ? 'Suspenso'
                                : 'Unknown'}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ClientsOtherUfList;
