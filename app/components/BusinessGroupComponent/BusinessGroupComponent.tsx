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
import { useRouter } from 'next/navigation';
import AlertModalGeneric from '../AlertModalGeneric/AlertModalGeneric';
import AlertEditModalGeneric from '../AlertEditModalGeneric/AlertEditModalGeneric';

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
  const [newGroups, setNewGroups] = useState<BusinessGroup[]>([]);

  const [lastCreatedGroupId, setLastCreatedGroupId] = useState<number | null>(
    null,
  );
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [editingGroupName, setEditingGroupName] = useState('');

  //Função para exibir o modal generico
  const showModal = (title: string, message: string) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalOpen(true);
  };
  //Função para exibir o modal de edição
  const showEditModal = (groupId: number) => {
    const group =
      businessGroups.find((g) => g.id === groupId) ||
      newGroups.find((g) => g.id === groupId);
    if (group) {
      setEditingGroupId(group.id);
      setEditingGroupName(group.name);
      setEditModalOpen(true);
    }
  };

  // Ordena os grupos
  const sortBusinessGroups = (groups: BusinessGroup[]): BusinessGroup[] => {
    return groups.sort((a, b) =>
      a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }),
    );
  };

  // Busca todos os grupos empresariais
  const fetchBusinessGroups = async () => {
    try {
      const response = await fetch('/api/getAllBusinessGroups');
      const data = await response.json();
      const sortedGroups = (data.businessGroups || []).sort(
        (a: BusinessGroup, b: BusinessGroup) =>
          a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }),
      );

      setBusinessGroups(sortedGroups);
    } catch (error) {
      console.error('Erro ao buscar grupos empresariais:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessGroups();
  }, []);

  // Checar se o nome ja existe
  const checkIfGroupNameExists = (name: string): boolean => {
    const lowerCaseName = name.toLowerCase(); // Converte o nome para minúsculas
    return businessGroups.some(
      (group) => group.name.toLowerCase() === lowerCaseName,
    );
  };

  // Criar um novo grupo empresarial
  const registerNewBusinessGroup = async () => {
    // Verifica se o nome não está vazio
    if (!newGroupName.trim()) return;

    // 🚨 Verifica se o nome já existe ANTES de fazer a requisição
    if (checkIfGroupNameExists(newGroupName)) {
      showModal(
        'Grupo Existente',
        'Este grupo já está cadastrado, confira na lista.',
      );
      return; // Não continua a execução se o nome já existir
    }

    try {
      // Envia a requisição para cadastrar um novo grupo
      const response = await fetch('/api/registerBusinessGroups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName }), // Passa o nome do novo grupo
      });

      // Verifica se a resposta foi bem-sucedida
      if (response.ok) {
        const newGroup = await response.json(); // Espera o retorno do novo grupo

        // Adiciona o novo grupo à lista de novos grupos (estado)
        setNewGroups([newGroup.businessGroup[0], ...newGroups]);

        // Limpa o campo de nome do grupo
        setNewGroupName('');
      } else {
        console.error('Erro ao criar grupo empresarial', response.status); // Loga o erro, se houver
        showModal(
          'Erro ao Criar Grupo',
          'Houve um problema ao cadastrar o grupo. Tente novamente.',
        );
      }
    } catch (error) {
      console.error('Erro na criação do grupo:', error); // Loga qualquer erro durante o processo
      showModal(
        'Erro ao Criar Grupo',
        'Houve um erro ao tentar criar o grupo. Tente novamente mais tarde.',
      );
    }
  };

  // Atualizar um grupo empresarial
  const handleEdit = async (groupId: number, newName: string) => {
    const nameExists = checkIfGroupNameExists(newName);
    if (nameExists) {
      showModal(
        'Grupo Existente',
        'Este grupo já está cadastrado, confira na lista.',
      );
      return;
    }

    setLoadingEdit(groupId);
    try {
      const response = await fetch(`/api/updateBusinessGroups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        const updatedGroups = businessGroups.map((group) =>
          group.id === groupId ? { ...group, name: newName } : group,
        );

        const updatedNewGroups = newGroups.map((group) =>
          group.id === groupId ? { ...group, name: newName } : group,
        );

        // Atualiza os estados
        setBusinessGroups(sortBusinessGroups(updatedGroups));
        setNewGroups(updatedNewGroups); // Aqui atualiza o `newGroups` também
      } else {
        console.error('Erro ao atualizar grupo');
      }
    } catch (error) {
      console.error('Erro ao atualizar grupo:', error);
    } finally {
      setLoadingEdit(null);
    }
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
          sortBusinessGroups(
            businessGroups.filter((group) => group.id !== groupId),
          ),
        );
        setNewGroups(newGroups.filter((group) => group.id !== groupId));
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
          <Tooltip title="Criar um novo grupo empresarial">
            <Button
              variant="contained"
              color="primary"
              onClick={registerNewBusinessGroup}
            >
              Criar
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {loading ? (
        <Box sx={styles.boxCircularProgress}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ marginTop: 4 }}>
          {/* Exibe grupos recém-criados primeiro, com borda laranja */}
          {newGroups.map((group) => (
            <Card
              key={group.id}
              sx={{ ...styles.fileList, ...styles.newGroupAdd }}
            >
              <CardContent sx={styles.contentFileList}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={styles.newGroupAddText}>
                    Grupo criado com sucesso!
                  </Typography>
                  <Typography
                    sx={{
                      ...styles.textFileList,
                      ...sharedStyles.subTitleFontFamily,
                    }}
                    variant="h6"
                  >
                    {group.name}
                  </Typography>
                </Box>
                <Box>
                  {/* Botão de Editar */}
                  <Tooltip title="Editar Grupo">
                    <IconButton
                      onClick={() => showEditModal(group.id)}
                      disabled={loadingEdit === group.id}
                    >
                      {loadingEdit === group.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <EditIcon sx={styles.iconDownload} />
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
                        <DeleteIcon sx={styles.iconDelete} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}

          {/* Exibe lista ordenada de grupos existentes */}
          {businessGroups.length === 0 ? (
            <Typography>Nenhum grupo empresarial encontrado.</Typography>
          ) : (
            businessGroups.map((group) => (
              <Card key={group.id} sx={styles.fileList}>
                <CardContent sx={styles.contentFileList}>
                  <Typography
                    sx={{
                      ...styles.textFileList,
                      ...sharedStyles.subTitleFontFamily,
                      flex: 1,
                    }}
                    variant="h6"
                  >
                    {group.name}
                  </Typography>
                  <Box>
                    {/* Botão de Editar */}
                    <Tooltip title="Editar Grupo">
                      <IconButton
                        onClick={() => showEditModal(group.id)}
                        disabled={loadingEdit === group.id}
                      >
                        {loadingEdit === group.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <EditIcon sx={styles.iconDownload} />
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
                          <DeleteIcon sx={styles.iconDelete} />
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

      <AlertModalGeneric
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Grupo Existente"
        message="Este grupo já está cadastrado, confira na lista."
        buttonText="Ok"
      />
      <AlertEditModalGeneric
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={(newName) => {
          if (editingGroupId !== null) {
            handleEdit(editingGroupId, newName);
          }
        }}
        title="Editar Grupo"
        currentName={editingGroupName}
      />
    </Container>
  );
}
