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
import styles from '../ClientsMsList/styles';

interface Client {
  id: string;
  companyName: string;
  cnpj: string;
  cpf: string;
  corfioCode: string;
  clientCondition: string;
  rating: number;
}

// Função para renderizar o nome do cliente como está no banco de dados
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') {
    return '';
  }
  return str;
};

const ClientsCPFList = () => {
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

        // Filtrar clientes com rating 3
        const filteredClients = data.clients.filter((client: Client) => {
          return client.cpf !== '' && client.cnpj === '';
        });

        // Ordenar os clientes pelo nome da empresa em ordem alfabética
        const sortedClients = filteredClients.sort(
          (a: { companyName: string }, b: { companyName: string }) =>
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
                      <Button
                        sx={{
                          ...styles.buttonTagCondition,
                          backgroundColor:
                            client.clientCondition === 'Normal'
                              ? 'green'
                              : client.clientCondition === 'Especial'
                                ? 'orange'
                                : client.clientCondition === 'Suspenso'
                                  ? 'red'
                                  : 'grey',
                          color:
                            client.clientCondition === 'Especial'
                              ? 'black'
                              : 'white',
                          '&:hover': {
                            backgroundColor:
                              client.clientCondition === 'Normal'
                                ? ' green' // Cor de fundo do hover para 'Normal'
                                : client.clientCondition === 'Especial'
                                  ? ' orange' // Cor de fundo do hover para 'Especial'
                                  : client.clientCondition === 'Suspenso'
                                    ? ' red' // Cor de fundo do hover para 'Suspenso'
                                    : 'grey',
                          },
                        }}
                        variant="contained"
                        size="small"
                      >
                        {client.clientCondition}
                      </Button>
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

export default ClientsCPFList;
