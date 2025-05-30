import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Container,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './styles';
import sharedStyles from '@/app/styles/sharedStyles';
import { orange, red } from '@mui/material/colors';

interface Occurrence {
  id: number;
  problem: string;
  solution: string;
  conclusion: string;
  attachments: string;
  created_at: string;
  client_name: string;
  client_corfioCode: string;
  user_name: string;
  operator_number?: string;
}

interface FileInfo {
  url: string;
  name: string;
  cleanedName: string;
  date: string;
}

export default function FrequentOccurrencesEdit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const occurrenceId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [occurrence, setOccurrence] = useState<Occurrence | null>(null);
  const [formData, setFormData] = useState({
    problem: '',
    solution: '',
    conclusion: '',
  });
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  useEffect(() => {
    const fetchOccurrence = async () => {
      if (!occurrenceId) return;

      try {
        const response = await fetch(
          `/api/getFrequentOccurrenceById?id=${occurrenceId}`,
        );
        if (!response.ok) throw new Error('Erro ao buscar ocorrência');
        const data = await response.json();
        setOccurrence(data.occurrence);
        setFormData({
          problem: data.occurrence.problem,
          solution: data.occurrence.solution,
          conclusion: data.occurrence.conclusion,
        });
      } catch (error) {
        console.error('Erro ao buscar ocorrência:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOccurrence();
  }, [occurrenceId]);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR');
  };

  const handleUpdate = async () => {
    if (!occurrenceId) return;

    setSaving(true);
    try {
      // Primeiro, fazer upload dos arquivos selecionados
      if (selectedFiles.length > 0) {
        await uploadSelectedFiles();
      }

      // Depois, atualizar os dados da ocorrência
      const response = await fetch(
        `/api/updateFrequentOccurrences?id=${occurrenceId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            problem: formData.problem,
            solution: formData.solution,
            conclusion: formData.conclusion,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar ocorrência');
      }

      router.push('/frequentOccurrencesPage');
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
      alert('Erro ao atualizar ocorrência');
    } finally {
      setSaving(false);
    }
  };

  // Função para remover o hash do nome do arquivo
  const removeHashFromFileName = (fileName: string) => {
    return fileName.replace(/-[^-]+\.[0-9a-z]+$/i, (match) => {
      const ext = match.split('.').pop();
      return `.${ext}`;
    });
  };

  // Função para decodificar o nome do arquivo
  const decodeFileName = (fileName: string) => {
    return decodeURIComponent(fileName);
  };

  // Função para limitar o tamanho do nome do arquivo
  const trimFileName = (name: string, maxLength = 40) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };

  // Função para garantir nomes únicos
  const getUniqueFileName = (baseName: string, existingNames: string[]) => {
    let name = baseName;
    let counter = 1;

    while (existingNames.includes(name)) {
      const match = baseName.match(/(.*)(\.[^.]+)$/);
      if (match) {
        const [_, namePart, extension] = match;
        name = `${namePart} (${counter})${extension}`;
      } else {
        name = `${baseName} (${counter})`;
      }
      counter++;
    }

    return name;
  };

  // Função para buscar os arquivos
  const fetchFiles = useCallback(async () => {
    if (!occurrenceId) return;

    try {
      const response = await fetch(
        `/api/getAllFilesBlobByOccurrence?occurrenceId=${occurrenceId}`,
      );
      if (!response.ok) throw new Error('Erro ao buscar arquivos');
      const data = await response.json();

      const cleanedNamesSet: string[] = [];

      const treatedFiles = data.files.map((file: any) => {
        const rawName = decodeFileName(removeHashFromFileName(file.name));
        const trimmedName = trimFileName(rawName);
        const uniqueName = getUniqueFileName(trimmedName, cleanedNamesSet);
        cleanedNamesSet.push(uniqueName);

        return {
          url: file.url,
          name: file.name,
          cleanedName: uniqueName,
          date: file.date || new Date().toISOString(),
        };
      });

      setFiles(treatedFiles);
    } catch (error) {
      console.error('Erro ao buscar arquivos:', error);
    }
  }, [occurrenceId]);

  // Função para adicionar arquivo à lista de seleção
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      event.target.value = ''; // Limpa o input para permitir selecionar o mesmo arquivo novamente
    }
  };

  // Função para remover arquivo da lista de seleção
  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Função para fazer upload de todos os arquivos selecionados
  const uploadSelectedFiles = async () => {
    if (!occurrenceId || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
          `/api/uploadFilesFrequentOccurrences?occurrenceId=${occurrenceId}`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!response.ok) throw new Error('Erro ao fazer upload do arquivo');
      }

      await fetchFiles(); // Atualiza a lista de arquivos
      setSelectedFiles([]); // Limpa a lista de seleção
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload dos arquivos');
    } finally {
      setUploading(false);
    }
  };

  // Função para deletar arquivo do blob
  const handleFileDelete = async (fileUrl: string) => {
    if (!fileUrl) return;

    setDeletingFile(fileUrl);
    try {
      const response = await fetch('/api/deleteFileBlobByOccurrence', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl }),
      });

      if (!response.ok) throw new Error('Erro ao deletar arquivo');

      await fetchFiles(); // Atualiza a lista de arquivos
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      alert('Erro ao deletar arquivo');
    } finally {
      setDeletingFile(null);
    }
  };

  // Buscar arquivos quando o componente carrega
  useEffect(() => {
    if (occurrenceId) {
      fetchFiles();
    }
  }, [occurrenceId, fetchFiles]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!occurrence) {
    return (
      <Typography sx={styles.cardPaperText} textAlign="center">
        Ocorrência não encontrada.
      </Typography>
    );
  }

  return (
    <Container fixed>
      <Box sx={sharedStyles.container}>
        <Paper sx={styles.BoxCardPaper} elevation={3}>
          <Typography variant="h6">Ocorrência #{occurrence.id}</Typography>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={styles.cardPaperText}
          >
            <strong>Cliente:</strong> {occurrence.client_name} -{' '}
            {occurrence.client_corfioCode}
          </Typography>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={styles.cardPaperText}
          >
            <span style={{ ...styles.spanText, marginRight: 6 }}>
              {formatDate(occurrence.created_at)}.
            </span>
            Registrado por: {occurrence.user_name}.
          </Typography>

          <Divider sx={{ marginY: 2, borderWidth: 1 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Problema"
              multiline
              rows={4}
              value={formData.problem}
              onChange={handleInputChange('problem')}
              fullWidth
            />

            <TextField
              label="Solução"
              multiline
              rows={4}
              value={formData.solution}
              onChange={handleInputChange('solution')}
              fullWidth
            />

            <TextField
              label="Conclusão"
              multiline
              rows={4}
              value={formData.conclusion}
              onChange={handleInputChange('conclusion')}
              fullWidth
            />

            <Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <Typography variant="subtitle2" sx={styles.cardPaperText}>
                  <strong>Arquivos anexados:</strong>
                </Typography>
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                  multiple
                />
                <label htmlFor="file-upload">
                  <Tooltip title="Selecionar arquivo para anexar">
                    <IconButton
                      size="small"
                      component="span"
                      disabled={uploading}
                      sx={{
                        '&:hover': {
                          color: orange[700],
                        },
                      }}
                    >
                      <AttachFileIcon />
                    </IconButton>
                  </Tooltip>
                </label>
              </Box>

              {/* Lista de arquivos selecionados */}
              {selectedFiles.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={styles.cardPaperText}>
                    Arquivos selecionados para upload:
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {selectedFiles.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" sx={styles.cardPaperText}>
                          • {file.name}
                        </Typography>
                        <Tooltip title="Remover da seleção">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveSelectedFile(index)}
                            sx={{
                              '&:hover': {
                                color: red[700],
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Lista de arquivos já anexados */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {files.map((file, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" sx={styles.cardPaperText}>
                      • {file.cleanedName}
                    </Typography>
                    <Tooltip title="Deletar arquivo">
                      <IconButton
                        size="small"
                        onClick={() => handleFileDelete(file.url)}
                        disabled={deletingFile === file.url}
                        sx={{
                          '&:hover': {
                            color: red[700],
                          },
                        }}
                      >
                        {deletingFile === file.url ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
                {files.length === 0 && selectedFiles.length === 0 && (
                  <Typography variant="body2" sx={styles.cardPaperText}>
                    Nenhum arquivo anexado
                  </Typography>
                )}
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
              disabled={saving}
              sx={{ mt: 2 }}
            >
              {saving ? <CircularProgress size={24} /> : 'Concluir edição'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
