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
import styles from '../ClientsMsList/styles';

interface Client {
  id: string;
  companyName: string;
  corfioCode: string;
  clientCondition: string;
  rating: number;
  state: string;
}

// Função Renderizar o nome do cliente como está no banco de dados
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') {
    return '';
  }
  return str;
};

const ClientEspecialList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('MS');
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          '/api/getListAllClients?page=clientsEspecialList',
        );
        if (!response.ok) throw new Error('Erro ao buscar clientes');
        const data = await response.json();
        setClients(data.clients);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleRowClick = (clientId: string) => {
    window.location.href = `/clientPage?id=${clientId}`;
  };

  const filteredClients = clients.filter((client) => {
    if (filter === 'MS') return client.state === 'MS';
    if (filter === 'MT') return client.state === 'MT';
    if (filter === 'OUTRAS')
      return client.state !== 'MS' && client.state !== 'MT';
    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="filter-label">Filtrar por UF</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="Filtrar por UF"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="MS">MS</MenuItem>
            <MenuItem value="MT">MT</MenuItem>
            <MenuItem value="OUTRAS">Outras UF</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.fontSize}>Cliente:</TableCell>
              {!isSmallScreen && (
                <>
                  <TableCell sx={styles.fontSize}>Estado:</TableCell>
                  <TableCell sx={styles.fontSize}>Cód. Corfio:</TableCell>
                  <TableCell sx={styles.fontSize}>Condição:</TableCell>
                  <TableCell sx={styles.fontSize}>Status:</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nenhum cliente encontrado para a UF selecionada.
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
                        {client.corfioCode}
                      </TableCell>
                      <TableCell sx={styles.fontSize}>
                        <Button
                          sx={{
                            ...styles.buttonTagCondition,
                            backgroundColor: 'orange',
                            color: 'black',
                            '&:hover': {
                              backgroundColor: 'orange',
                            },
                          }}
                          variant="contained"
                          size="small"
                        >
                          Especial
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

export default ClientEspecialList;
