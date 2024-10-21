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
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import styles from './style';
import sharedStyles from '@/app/styles/sharedStyles';

export interface User {
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
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteLoading(id);
    try {
      // 1. Buscar arquivos associados ao usuário
      const filesResponse = await fetch(
        `/api/getAllFilesBlobByUser?userId=${id}`,
      );
      const filesData = await filesResponse.json();

      if (filesResponse.ok && filesData.files.length > 0) {
        // 2. Deletar os arquivos associados
        console.log('Deleting associated files');
        await fetch(`/api/deleteAllFilesBlobByUser`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileUrls: filesData.files.map((file: { url: any }) => file.url),
          }),
        });
        console.log('Files deleted successfully');
      }

      // 3. Deletar o usuário do banco de dados
      const response = await fetch('/api/deleteUserByAdmin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // 4. Atualizar a lista de usuários
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        console.log('User deleted successfully');
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user or files:', error);
    } finally {
      setDeleteLoading(null); // Finaliza o estado de carregamento
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
          id: editFormData.id, // Passa o `id` no corpo da requisição
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
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/*                 <TableCell colSpan={isSmallScreen ? 2 : 4} align="center">
                  Nenhum usuário encontrado
                </TableCell> */}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
