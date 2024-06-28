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
  cnpj: string;
  cpf: string;
  cep: string;
  address: string;
  locationNumber: string;
  district: string;
  city: string;
  phone: string;
  email: string;
  socialMedia: string;
  contactAtCompany: string;
  financialContact: string;
  responsibleSeller: string;
  companySize: string;
  hasOwnStore: string;
  isJSMClient: string;
  includedByJSM: string;
  icmsContributor: string;
  transportationType: string;
  companyLocation: string;
  marketSegmentNature: string;
}

// Função para capitalizar a primeira letra de cada palavra em uma string
const capitalize = (str: any) => {
  if (typeof str !== 'string') {
    return '';
  }
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const SearchResults = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const query = new URLSearchParams(window.location.search).get('query') || '';

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/getAllClients');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const searchTerm = query.toLowerCase();

        const filteredClients = data.clients.filter((client: Client) => {
          // Filtra clientes com CNPJ preenchido ou sem CNPJ preenchido
          if (searchTerm === 'cnpj') {
            return !!client.cnpj;
          } else if (searchTerm === 'cpf') {
            return !client.cnpj;
          } else {
            // Verifica se a palavra-chave está em qualquer campo relevante
            return Object.values(client).some((value) =>
              value.toString().toLowerCase().includes(searchTerm),
            );
          }
        });

        setClients(filteredClients);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setLoading(false);
      }
    };

    if (query) {
      fetchClients();
    }
  }, [query]);

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
                  {capitalize(client.companyName)}
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

export default SearchResults;
