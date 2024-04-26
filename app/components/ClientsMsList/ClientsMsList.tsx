'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import { Rating } from '@mui/material';
import styles from '@/app/components/ClientsMsList/styles';

const ClientMsList = () => {
  // Lista de cliente fixa enquanto nao temos banco de dados.
  const clients = [
    { name: 'Cliente 1', code: '12345', status: 'N', rating: 2 },
    { name: 'Cliente 2', code: '54321', status: 'S', rating: 1 },
    { name: 'Cliente 3', code: '98765', status: 'E', rating: 3 },
    { name: 'Cliente 4', code: '45678', status: 'N', rating: 2 },
    { name: 'Cliente 5', code: '87654', status: 'E', rating: 3 },
  ];

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHighlightedIndex(index);
  };

  const handleMouseLeave = () => {
    setHighlightedIndex(null);
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: { xs: 12, md: 16 } }}>
                Cliente:
              </TableCell>
              <TableCell sx={{ fontSize: { xs: 12, md: 16 } }}>
                Cód. Corfio:
              </TableCell>
              <TableCell sx={{ fontSize: { xs: 12, md: 16 } }}>
                Condição:
              </TableCell>
              <TableCell sx={{ fontSize: { xs: 12, md: 16 } }}>
                Status:
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client, index) => (
              <TableRow
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                sx={
                  highlightedIndex === index ? styles.highlightedRow : undefined
                }
              >
                <TableCell sx={{ fontSize: { xs: 12, md: 16 } }}>
                  {client.name}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: 12, md: 16 } }}>
                  {client.code}
                </TableCell>
                <TableCell sx={{ fontSize: { xs: 12, md: 16 } }}>
                  <Box sx={{ display: 'flex', gap: '8px' }}>
                    <Button
                      sx={{
                        minWidth: '80px', // Define a largura mínima do botão
                        fontSize: '10px', // Define o tamanho da fonte menor
                      }}
                      variant="contained"
                      size="small"
                      color={
                        client.status === 'N'
                          ? 'success'
                          : client.status === 'E'
                            ? 'warning'
                            : client.status === 'S'
                              ? 'error'
                              : ('default' as any)
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
                <TableCell sx={{ fontSize: { xs: 12, md: 16 } }}>
                  <Rating
                    name={`rating-${index}`}
                    value={client.rating}
                    readOnly
                    size="small"
                    max={3}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ClientMsList;
