'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Container,
  Tooltip,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import styles from './style';
import sharedStyles from '@/app/styles/sharedStyles';

export interface User {
  [x: string]: any;
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UsersTeamList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<User | null>(null);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getAllUsers');
      const data = await response.json();

      const activeUsers = data.users.filter(
        (user: User) => user.is_active === true,
      );

      // Ordena os usuários com base no operatorNumber em ordem crescente
      const sortedUsers = activeUsers.sort(
        (a: User, b: User) => (a.operatorNumber || 0) - (b.operatorNumber || 0),
      );

      // Atualiza o estado com os usuários ordenados
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditFormData({
      id: user.id,
      operatorNumber: user.operatorNumber || '', // Incluímos operatorNumber no estado de edição
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleSave = async () => {
    if (!editFormData || !editFormData.id) return;

    setLoading(true);
    try {
      const response = await fetch('/api/updateUserByAdmin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editFormData.id,
          operatorNumber: editFormData.operatorNumber, // Incluído no payload
          name: editFormData.name,
          email: editFormData.email,
          role: editFormData.role,
        }),
      });

      if (response.ok) {
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((user) =>
            user.id === editFormData.id ? { ...editFormData } : user,
          );

          // Ordena a lista novamente após a edição
          return updatedUsers.sort(
            (a, b) => (a.operatorNumber || 0) - (b.operatorNumber || 0),
          );
        });

        // Finaliza o modo de edição
        setEditingUser(null);
        setEditFormData(null);
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteLoading(id);
    try {
      const filesResponse = await fetch(
        `/api/getAllFilesBlobByUser?userId=${id}`,
      );
      const filesData = await filesResponse.json();

      if (filesResponse.ok && filesData.files.length > 0) {
        await fetch(`/api/deleteAllFilesBlobByUser`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileUrls: filesData.files.map((file: { url: any }) => file.url),
          }),
        });
      }

      const response = await fetch('/api/deactivateUserByAdmin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to deactivate user');
      }
    } catch (error) {
      console.error('Error deleting user or files:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.fontSize}>Operador</TableCell>{' '}
              {/* Novo campo */}
              <TableCell sx={styles.fontSize}>Nome</TableCell>
              {!isSmallScreen && (
                <TableCell sx={styles.fontSize}>Email</TableCell>
              )}
              {!isSmallScreen && (
                <TableCell sx={styles.fontSize}>Função</TableCell>
              )}
              <TableCell sx={styles.fontSize}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isSmallScreen ? 2 : 5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} sx={styles.rowHover}>
                  {editingUser === user.id ? (
                    <>
                      <TableCell sx={styles.fontSize}>
                        <TextField
                          label="Operador"
                          value={editFormData?.operatorNumber || ''} // Campo para edição
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData!,
                              operatorNumber: e.target.value,
                            })
                          }
                          fullWidth
                        />
                      </TableCell>
                      <TableCell sx={styles.fontSize}>
                        <TextField
                          label="Nome"
                          value={editFormData?.name || ''}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData!,
                              name: e.target.value,
                            })
                          }
                          fullWidth
                        />
                      </TableCell>
                      {!isSmallScreen && (
                        <TableCell sx={styles.fontSize}>
                          <TextField
                            label="Email"
                            value={editFormData?.email || ''}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData!,
                                email: e.target.value,
                              })
                            }
                            fullWidth
                          />
                        </TableCell>
                      )}
                      {!isSmallScreen && (
                        <TableCell sx={styles.fontSize}>
                          <TextField
                            select
                            label="Função"
                            value={editFormData?.role || ''}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData!,
                                role: e.target.value,
                              })
                            }
                            fullWidth
                          >
                            <MenuItem value="vendedor">Vendedor</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </TextField>
                        </TableCell>
                      )}
                      <TableCell sx={styles.fontSize}>
                        <Button
                          onClick={handleSave}
                          disabled={loading}
                          sx={{
                            backgroundColor: 'green',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'darkgreen',
                            },
                          }}
                        >
                          {loading ? <CircularProgress size={20} /> : 'Salvar'}
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={styles.fontSize}>
                        {user.operatorNumber || '-'}{' '}
                        {/* Exibe operatorNumber */}
                      </TableCell>
                      <TableCell sx={styles.fontSize}>{user.name}</TableCell>
                      {!isSmallScreen && (
                        <TableCell sx={styles.fontSize}>{user.email}</TableCell>
                      )}
                      {!isSmallScreen && (
                        <TableCell sx={styles.fontSize}>{user.role}</TableCell>
                      )}
                      <TableCell sx={styles.fontSize}>
                        <Tooltip title={'Editar usuário'}>
                          <IconButton
                            onClick={() => handleEdit(user)}
                            sx={styles.iconEdit}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={'Deletar usuário'}>
                          <IconButton
                            sx={styles.iconDelete}
                            onClick={() => handleDelete(user.id)}
                            disabled={deleteLoading === user.id}
                          >
                            {deleteLoading === user.id ? (
                              <CircularProgress size={24} />
                            ) : (
                              <DeleteIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isSmallScreen ? 2 : 5} align="center">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
