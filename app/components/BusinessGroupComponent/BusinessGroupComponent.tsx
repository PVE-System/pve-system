'use client';

import React, { useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  IconButton,
  CircularProgress,
  TextField,
  Button,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';

interface BusinessGroup {
  id: number;
  name: string;
  createdAt: string;
}

export default function BusinessGroupComponent() {
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [loadingEdit, setLoadingEdit] = useState<number | null>(null);
  const [newGroupName, setNewGroupName] = useState('');

  // Busca todos os grupos empresariais
  const fetchBusinessGroups = async () => {
    try {
      const response = await fetch('/api/getAllBusinessGroups');
      const data = await response.json();
      setBusinessGroups(data.businessGroups || []);
    } catch (error) {
      console.error('Erro ao buscar grupos empresariais:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessGroups();
  }, []);

  // Criar um novo grupo empresarial
  const registerNewBusinessGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const response = await fetch('/api/registerBusinessGroups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName }),
      });

      if (response.ok) {
        const newGroup = await response.json();
        setBusinessGroups([...businessGroups, newGroup.businessGroup[0]]);
        setNewGroupName('');
      } else {
        console.error('Erro ao criar grupo empresarial');
      }
    } catch (error) {
      console.error('Erro na criação do grupo:', error);
    }
  };

  // Atualizar um grupo empresarial
  const handleEdit = async (groupId: number, newName: string) => {
    setLoadingEdit(groupId);
    try {
      const response = await fetch(`/api/updateBusinessGroups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        setBusinessGroups(
          businessGroups.map((group) =>
            group.id === groupId ? { ...group, name: newName } : group,
          ),
        );
      } else {
        console.error('Erro ao atualizar grupo');
      }
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
    } finally {
      setLoadingEdit(null);
    }
    console.log('Tentando excluir grupo com ID:', groupId);
  };

  // Deletar um grupo empresarial
  const handleDelete = async (groupId: number) => {
    setLoadingDelete(groupId);
    try {
      const response = await fetch(`/api/deleteBusinessGroups/${groupId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBusinessGroups(
          businessGroups.filter((group) => group.id !== groupId),
        );
      } else {
        console.error('Erro ao excluir grupo');
      }
    } catch (error) {
      console.error('Erro ao excluir grupo:', error);
    } finally {
      setLoadingDelete(null);
    }
    console.log('Tentando excluir grupo com ID:', groupId);
  };

  return (
    <Container fixed>
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Grupo <span>Empresarial</span>
        </Typography>
        <Typography sx={sharedStyles.subtitleSize}>
          Crie e <span>Gerencie</span> os Grupos.
        </Typography>

        {/* Campo de criação de novo grupo */}
        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
          <TextField
            fullWidth
            label="Criar novo Grupo"
            variant="outlined"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={registerNewBusinessGroup}
          >
            Criar
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={styles.boxCircularProgress}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ marginTop: 4 }}>
          {businessGroups.length === 0 ? (
            <Typography>Nenhum grupo empresarial encontrado.</Typography>
          ) : (
            businessGroups.map((group) => (
              <Card key={group.id} sx={{ marginBottom: 2 }}>
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6">{group.name}</Typography>
                  <Box>
                    {/* Botão de Editar */}
                    <Tooltip title="Editar Grupo">
                      <IconButton
                        onClick={() =>
                          handleEdit(
                            group.id,
                            prompt('Novo nome do grupo:', group.name) ||
                              group.name,
                          )
                        }
                        disabled={loadingEdit === group.id}
                      >
                        {loadingEdit === group.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <EditIcon />
                        )}
                      </IconButton>
                    </Tooltip>

                    {/* Botão de Deletar */}
                    <Tooltip title="Excluir Grupo">
                      <IconButton
                        onClick={() => handleDelete(group.id)}
                        disabled={loadingDelete === group.id}
                      >
                        {loadingDelete === group.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}
    </Container>
  );
}
