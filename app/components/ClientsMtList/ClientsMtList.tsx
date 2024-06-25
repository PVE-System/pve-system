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

const ClientMtList = () => {
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

        // Limpar e normalizar os estados antes de filtrar
        const cleanedClients = data.clients.map((client: Client) => ({
          ...client,
          state: client.state.trim().toLowerCase(), // Remove espaços extras e converte para minúsculas
        }));

        const filteredClients = cleanedClients.filter((client: Client) => {
          return client.state === 'mato grosso' || client.state === 'mt';
        });

        setClients(filteredClients);
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
                <TableCell sx={styles.fontSize}>{client.companyName}</TableCell>
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
                            client.clientCondition === 'normal'
                              ? 'success'
                              : client.clientCondition === 'especial'
                                ? 'warning'
                                : client.clientCondition === 'suspenso'
                                  ? 'error'
                                  : 'inherit'
                          }
                        >
                          {client.clientCondition === 'normal'
                            ? 'Normal'
                            : client.clientCondition === 'especial'
                              ? 'Especial'
                              : client.clientCondition === 'suspenso'
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

export default ClientMtList;
