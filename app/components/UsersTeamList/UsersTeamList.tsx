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
  const [deactivateLoading, setDeactivateLoading] = useState<number | null>(
    null,
  );
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

      // Filtra os usuários que estão ativos
      const activeUsers = data.users.filter(
        (user: User) => user.is_active === true,
      );

      // Atualiza o estado com apenas os usuários ativos
      setUsers(activeUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
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

      // 2. Desativar o usuário após deletar os arquivos
      const response = await fetch('/api/deactivateUserByAdmin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Remove o usuário da lista local para não exibi-lo mais
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

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditFormData({
      id: user.id,
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
          name: editFormData.name,
          email: editFormData.email,
          role: editFormData.role,
        }),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editFormData.id ? { ...editFormData } : user,
          ),
        );
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

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
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
                <TableCell colSpan={isSmallScreen ? 2 : 4} align="center">
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
                            backgroundColor: 'green', // Cor verde para o botão
                            color: 'white', // Cor do texto branco
                            '&:hover': {
                              backgroundColor: 'darkgreen', // Cor verde escuro no hover
                            },
                          }}
                        >
                          {loading ? <CircularProgress size={20} /> : 'Salvar'}
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
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
                        {/* <Tooltip
                          title={
                            'Desativar usuário, mantendo registro de sua colaboração'
                          }
                        >
                          <IconButton
                            sx={styles.iconBlock}
                            onClick={() => handleDeactivate(user.id)}
                            disabled={
                              deactivateLoading === user.id || !user.is_active
                            }
                          >
                            {deactivateLoading === user.id ? (
                              <CircularProgress size={24} />
                            ) : (
                              <BlockIcon />
                            )}
                          </IconButton>
                        </Tooltip> */}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isSmallScreen ? 2 : 4} align="center">
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
