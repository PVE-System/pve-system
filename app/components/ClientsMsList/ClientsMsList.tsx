/* 'use client';

import React from 'react';
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
} from '@mui/material';
import { Rating } from '@mui/material';
import styles from '@/app/components/ClientsMsList/styles';

const ClientMsList = () => {
  const clients = [
    {
      name: 'Cliente 1 Comércio de Mat e Const Ltda',
      code: '12345',
      status: 'N',
      rating: 2,
    },
    {
      name: 'Cliente 2  Comércio de Mat e Const Ltda',
      code: '54321',
      status: 'S',
      rating: 1,
    },
    {
      name: 'Cliente 3  Comércio de Mat e Const Ltda',
      code: '98765',
      status: 'E',
      rating: 3,
    },
    {
      name: 'Cliente 4  Comércio de Mat e Const Ltda',
      code: '45678',
      status: 'N',
      rating: 2,
    },
    {
      name: 'Cliente 5  Comércio de Mat e Const Ltda',
      code: '87654',
      status: 'E',
      rating: 3,
    },
  ];

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const handleRowClick = () => {
    // Redirecionar para a página do cliente
    window.location.href = '/clientPage';
  };

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
            {clients.map((client, index) => (
              <TableRow
                key={index}
                sx={{ ...styles.rowHover, cursor: 'pointer' }}
                onClick={handleRowClick} // Adicionar evento de clique na linha
              >
                <TableCell sx={styles.fontSize}>{client.name}</TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell sx={styles.fontSize}>{client.code}</TableCell>
                    <TableCell sx={styles.fontSize}>
                      <Box>
                        <Button
                          sx={styles.buttonTagCondition}
                          variant="contained"
                          size="small"
                          color={
                            client.status === 'N'
                              ? 'success'
                              : client.status === 'E'
                                ? 'warning'
                                : client.status === 'S'
                                  ? 'error'
                                  : 'inherit' // Substituído 'default' por 'inherit'
                          }
                        >
                          {client.status === 'N'
                            ? 'Normal'
                            : client.status === 'E'
                              ? 'Especial'
                              : client.status === 'S'
                                ? 'Suspenso'
                                : 'Unknown'}
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell sx={styles.fontSize}>
                      <Rating
                        name={`rating-${index}`}
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

export default ClientMsList;
 */

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
  id: string; // Adicionado id
  companyName: string;
  corfioCode: string;
  clientCondition: string;
  rating: number;
}

const ClientMsList = () => {
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
        setClients(data.clients);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleRowClick = (clientId: string) => {
    // Redirecionar para a página do cliente com o ID do cliente
    window.location.href = `/clientPage?id=${clientId}`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        /* height="100vh" */
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
                key={client.id} // Usar id como chave
                sx={{ ...styles.rowHover, cursor: 'pointer' }}
                onClick={() => handleRowClick(client.id)} // Usar id para redirecionamento
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
                        name={`rating-${client.id}`} // Usar id para o rating
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

export default ClientMsList;
