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
  Typography,
} from '@mui/material';
import { Rating } from '@mui/material';
import styles from './styles';
// import styles from './styles';

// Interface para o tipo dos dados do cliente
interface Client {
  id: number;
  companyName: string;
  corfioCode: string;
  clientCondition: string;
  rating: number;
  state: string;
  city: string;
  businessGroupId: number | null;
}

interface BusinessGroup {
  id: number;
  name: string;
  createdAt: string;
}

// Função para renderizar o texto como está no banco
const renderAsIs = (str: any) => {
  if (typeof str !== 'string') return '';
  return str;
};

const BusinessGroupListPageComponent = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [businessGroup, setBusinessGroup] = useState<BusinessGroup | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [groupId, setGroupId] = useState<string | null>(null);

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const fetchClientsByBusinessGroup = async (groupId: string) => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/getClientsByBusinessGroup?groupId=${groupId}`,
      );
      if (!response.ok) throw new Error('Erro ao buscar clientes');

      const data = await response.json();
      setBusinessGroup(data.businessGroup);
      setClients(data.clients);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar clientes quando o componente carregar
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const groupIdParam = urlParams.get('groupId');

    if (groupIdParam) {
      setGroupId(groupIdParam);
      fetchClientsByBusinessGroup(groupIdParam);
    }
  }, []);

  const handleRowClick = (clientId: number) => {
    window.open(`/clientPage?id=${clientId}`, '_blank');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={styles.container}>
      {businessGroup && (
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            {businessGroup.name}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Total de clientes: {clients.length}
          </Typography>
        </Box>
      )}

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
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum cliente encontrado neste grupo empresarial.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
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
                            fontSize: '12px',
                            padding: '4px 8px',
                            minWidth: 'auto',
                            textTransform: 'none',
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
                          {client.clientCondition === 'Normal'
                            ? 'Normal'
                            : client.clientCondition === 'Especial'
                              ? 'Especial'
                              : client.clientCondition === 'Suspenso'
                                ? 'Suspenso'
                                : 'Unknown'}
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

export default BusinessGroupListPageComponent;
