'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import React from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  imageUrl?: string;
  createdAt?: string;
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

      // Se `data.users` for um array, use-o; caso contrário, defina como vazio
      if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error('Data is not an array:', data);
        setUsers([]); // Define users como array vazio se `data.users` não for um array
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Define users como array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteLoading(id);
    try {
      const response = await fetch(`/api/deleteUser?id=${id}`, {
        method: 'DELETE',
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
    setEditFormData({ ...user });
  };

  const handleSave = async () => {
    if (!editFormData) return;
    setLoading(true);
    try {
      const response = await fetch('/api/updateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editFormData.id ? { ...editFormData } : user,
          ),
        );
        setEditingUser(null);
        setEditFormData(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      {Array.isArray(users) &&
        users.map((user) => (
          <Box key={user.id} display="flex" alignItems="center" gap={2}>
            {editingUser === user.id ? (
              <>
                <TextField
                  label="Nome"
                  value={editFormData?.name || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      name: e.target.value,
                      id: editFormData?.id || user.id,
                    } as User)
                  }
                />
                <TextField
                  label="Email"
                  value={editFormData?.email || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      email: e.target.value,
                      id: editFormData?.id || user.id,
                    } as User)
                  }
                />
                <TextField
                  label="Senha"
                  type="password"
                  value={editFormData?.password || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      password: e.target.value,
                      id: editFormData?.id || user.id,
                    } as User)
                  }
                />
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : 'Salvar'}
                </Button>
              </>
            ) : (
              <>
                <Typography>{user.name}</Typography>
                <Typography>{user.email}</Typography>
                <Typography>******</Typography>
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
              </>
            )}
          </Box>
        ))}
    </Box>
  );
}
