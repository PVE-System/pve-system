import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import styles from './styles';

interface User {
  id?: string;
  name: string;
  operatorNumber: string;
  is_active: boolean;
}

interface Client {
  [x: string]: any;
  id: string;
  name: string;
  responsibleSeller: string;
}

const AdminPageTabClientByUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingClients, setLoadingClients] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  // Buscar usuários da API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/getAllUsers');
        if (!response.ok) throw new Error('Erro ao buscar usuários');

        const data = await response.json();
        console.log('Usuários da API:', data);

        if (!data.users)
          throw new Error('A chave "users" não existe na resposta da API');

        const activeUsers = data.users.filter((user: User) => user.is_active);

        const sortedUsers = activeUsers.sort((a: User, b: User) => {
          return (
            parseInt(a.operatorNumber, 10) - parseInt(b.operatorNumber, 10)
          );
        });

        setUsers(sortedUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedOperator) {
      setClients([]); // Reseta os clientes se nenhum operador for selecionado
      return;
    }

    console.log('Operador selecionado:', selectedOperator); // 🛠 Verificar o valor

    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const response = await fetch('/api/getAllClients');
        if (!response.ok) throw new Error('Erro ao buscar clientes');

        const data = await response.json();
        console.log('Clientes da API:', data);

        if (!data.clients)
          throw new Error('A chave "clients" não existe na resposta da API');

        // 🛠 Log dos dados para checar valores de responsibleSeller
        console.log(
          'Clientes mapeados:',
          data.clients.map((c: Client) => ({
            nome: c.companyName,
            responsavel: c.responsibleSeller,
          })),
        );

        // Filtrar clientes pelo operador selecionado
        const filteredClients = data.clients.filter(
          (client: Client) =>
            String(client.responsibleSeller) === String(selectedOperator),
        );

        console.log('Clientes filtrados:', filteredClients);
        // Ordenar clientes pelo nome da empresa (A a Z)
        const sortedClients = filteredClients.sort((a: Client, b: Client) =>
          a.companyName
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .localeCompare(
              b.companyName
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, ''),
              'pt-BR',
              { sensitivity: 'base' },
            ),
        );

        setClients(sortedClients); // Atualiza o estado com a lista ordenada
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, [selectedOperator]);

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
      {/* Dropdown para selecionar o operador */}
      <TextField
        select
        label="Selecione o Responsável PVE"
        value={selectedOperator}
        onChange={(e) => setSelectedOperator(e.target.value)}
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        {users.length > 0 ? (
          users.map((user) => (
            <MenuItem
              key={user.id || user.operatorNumber}
              value={user.operatorNumber}
            >
              {user.operatorNumber} - {user.name}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>Nenhum usuário encontrado</MenuItem>
        )}
      </TextField>

      {/* Exibir total de clientes encontrados */}
      <Typography variant="subtitle2" sx={{ marginBottom: 2 }}>
        Total de clientes: <strong>{clients.length}</strong>
      </Typography>

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
            {loadingClients ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : clients.length > 0 ? (
              clients.map((client) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography>
                    Nenhum cliente encontrado para este responsável.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminPageTabClientByUser;
