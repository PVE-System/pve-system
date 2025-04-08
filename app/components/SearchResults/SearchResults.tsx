'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';

interface Client {
  id: string;
  companyName: string;
  corfioCode: string;
  clientCondition: string;
  rating: number;
}

const DEBOUNCE_DELAY = 300; // 300ms

const SearchResults = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query') || '';
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  // Função para buscar clientes da API
  const fetchClients = useCallback(async (searchQuery: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/searchClients?query=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
      }

      const data = await response.json();
      setClients(data.clients);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!query) return;

    const debounceTimer = setTimeout(() => {
      fetchClients(query);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceTimer); // limpa o timeout se digitar de novo
  }, [query, fetchClients]);

  // Lida com cliques em linhas para navegação
  const handleRowClick = (clientId: string) => {
    router.push(`/clientPage?id=${clientId}`);
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
                  {client.companyName.slice(0, 50)}
                </TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell sx={styles.fontSize}>
                      {client.corfioCode}
                    </TableCell>
                    <TableCell sx={styles.fontSize}>
                      <Box>
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
                                  ? 'green'
                                  : client.clientCondition === 'Especial'
                                    ? 'orange'
                                    : client.clientCondition === 'Suspenso'
                                      ? 'red'
                                      : 'grey',
                            },
                          }}
                          variant="contained"
                          size="small"
                        >
                          {client.clientCondition}
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

/* 'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';

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

const SearchResults = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query') || '';
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  // Função para buscar os clientes com base na consulta
  const fetchClients = useCallback(
    async (searchQuery: string) => {
      try {
        setLoading(true);

        const response = await fetch('/api/getAllClients');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const normalizedSearchTerm = searchQuery
          .toLowerCase()
          .replace(/[^\w]/g, ''); // Remove tudo que não é alfanumérico

        const filteredClients = data.clients.filter((client: Client) => {
          const normalize = (str: string) =>
            str.replace(/[^\w]/g, '').toLowerCase();

          const normalizedCnpj = normalize(client.cnpj || '');
          const normalizedCpf = normalize(client.cpf || '');

          const isCnpjMatch = normalizedCnpj.includes(normalizedSearchTerm);
          const isCpfMatch = normalizedCpf.includes(normalizedSearchTerm);
          const isCorfioCodeMatch = client.corfioCode
            ?.toLowerCase()
            .includes(normalizedSearchTerm);
          const isNameMatch = client.companyName
            ?.toLowerCase()
            .includes(normalizedSearchTerm);

          return isCnpjMatch || isCpfMatch || isCorfioCodeMatch || isNameMatch;
        });

        setClients(filteredClients);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      } finally {
        setLoading(false);
      }
    },
    [], // Nenhuma dependência externa necessária
  );

  // Atualiza a busca quando `query` muda
  useEffect(() => {
    if (query) {
      fetchClients(query);
    }
  }, [query, fetchClients]);

  // Lida com cliques em linhas para navegação
  const handleRowClick = (clientId: string) => {
    router.push(`/clientPage?id=${clientId}`);
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
                  {client.companyName.slice(0, 50)}
                </TableCell>
                {!isSmallScreen && (
                  <>
                    <TableCell sx={styles.fontSize}>
                      {client.corfioCode}
                    </TableCell>
                    <TableCell sx={styles.fontSize}>
                      <Box>
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
                                  ? ' green'
                                  : client.clientCondition === 'Especial'
                                    ? ' orange'
                                    : client.clientCondition === 'Suspenso'
                                      ? ' red'
                                      : 'grey',
                            },
                          }}
                          variant="contained"
                          size="small"
                        >
                          {client.clientCondition}
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
 */
