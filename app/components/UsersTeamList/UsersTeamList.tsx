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
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import styles from './style';

export interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersTeamList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<User | null>(null);

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
      const response = await fetch('/api/deleteUserByAdmin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user.id);
    setEditFormData({ id: user.id, name: user.name, email: user.email });
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
              <TableCell sx={styles.fontSize}>Email</TableCell>
              <TableCell sx={styles.fontSize}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(users) && users.length > 0 ? (
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
                      <TableCell sx={styles.fontSize}>
                        <Button onClick={handleSave} disabled={loading}>
                          {loading ? <CircularProgress size={20} /> : 'Salvar'}
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={styles.fontSize}>{user.name}</TableCell>
                      <TableCell sx={styles.fontSize}>{user.email}</TableCell>
                      <TableCell sx={styles.fontSize}>
                        <IconButton onClick={() => handleEdit(user)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteLoading === user.id}
                        >
                          {deleteLoading === user.id ? (
                            <CircularProgress size={24} />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
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
