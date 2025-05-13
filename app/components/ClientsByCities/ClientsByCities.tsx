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
} from '@mui/material';
import { Rating } from '@mui/material';
import styles from './styles';

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

// Função para renderizar o texto como está no banco
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') return '';
  return str;
};

const ClientsByCities = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('MS');
  const [cityFilter, setCityFilter] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);

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

  const filteredClients = clients; // Agora é simples assim

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
            <InputLabel id="city-filter-label">Filtrar por Cidade</InputLabel>
            <Select
              labelId="city-filter-label"
              value={cityFilter || 'Todas as cidades'}
              label="Filtrar por Cidade"
              onChange={(e) =>
                setCityFilter(
                  e.target.value === 'Todas as cidades' ? '' : e.target.value,
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

      {/* Tabela de Clientes */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.fontSize}>Cliente:</TableCell>
              {!isSmallScreen && (
                <>
                  <TableCell sx={styles.fontSize}>Estado:</TableCell>
                  <TableCell sx={styles.fontSize}>Cidade:</TableCell>
                  <TableCell sx={styles.fontSize}>Cód.Corfio:</TableCell>
                  <TableCell sx={styles.fontSize}>Condição:</TableCell>
                  <TableCell sx={styles.fontSize}>Status:</TableCell>
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
              filteredClients.map((client) => (
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
                        {client.state || '-'}
                      </TableCell>
                      <TableCell sx={styles.fontSize}>
                        {client.city || '-'}
                      </TableCell>
                      <TableCell sx={styles.fontSize}>
                        {client.corfioCode}
                      </TableCell>
                      <TableCell sx={styles.fontSize}>
                        <Button
                          sx={{
                            ...styles.buttonTagCondition,
                            backgroundColor: 'green',
                            '&:hover': {
                              backgroundColor: 'green',
                            },
                          }}
                          variant="contained"
                          size="small"
                        >
                          Normal
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ClientsByCities;
