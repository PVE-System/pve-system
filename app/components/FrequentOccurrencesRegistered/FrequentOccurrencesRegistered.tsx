import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  MobileStepper,
  Paper,
  Button,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './styles';
import sharedStyles from '@/app/styles/sharedStyles';
import AlertModalConfirmDelete from '../AlertModalConfirmDelete/AlertModalConfirmDelete';
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
}

interface FileInfo {
  url: string;
  name: string;
  cleanedName: string;
  date: string;
}

const stepsLabels = ['Problema', 'Solução', 'Conclusão', 'Arquivos anexados'];

export default function FrequentOccurrencesRegistered() {
  const router = useRouter();
  const [globalPage, setGlobalPage] = useState(0);
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [stepIndexes, setStepIndexes] = useState<number[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [occurrenceToDelete, setOccurrenceToDelete] = useState<number | null>(
    null,
  );
  const [occurrenceFiles, setOccurrenceFiles] = useState<{
    [key: number]: FileInfo[];
  }>({});

  useEffect(() => {
    const fetchOccurrences = async () => {
      try {
        const response = await fetch(
          '/api/getAllFrequentOccurrencesRegistered',
        );
        if (!response.ok) throw new Error('Erro ao buscar ocorrências');
        const data = await response.json();
        setOccurrences(data.occurrences);
        setStepIndexes(new Array(data.occurrences.length).fill(0));
      } catch (error) {
        console.error('Erro ao buscar ocorrências:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOccurrences();
  }, []);

  const occurrencesPerPage = 2;
  const totalPages = Math.ceil(occurrences.length / occurrencesPerPage);

  const handleNextGlobal = () => {
    if (globalPage < totalPages - 1) {
      setGlobalPage((prev) => prev + 1);
    }
  };

  const handleBackGlobal = () => {
    if (globalPage > 0) {
      setGlobalPage((prev) => prev - 1);
    }
  };

  const handleNextStep = (index: number) => {
    setStepIndexes((prev) => {
      const newSteps = [...prev];
      newSteps[index] = Math.min(newSteps[index] + 1, stepsLabels.length - 1);
      return newSteps;
    });
  };

  const handleBackStep = (index: number) => {
    setStepIndexes((prev) => {
      const newSteps = [...prev];
      newSteps[index] = Math.max(newSteps[index] - 1, 0);
      return newSteps;
    });
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

  // Função para buscar os arquivos de uma ocorrência
  const fetchOccurrenceFiles = useCallback(async (occurrenceId: number) => {
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

      // Ordenar por data (mais recente primeiro)
      const sortedFiles = treatedFiles.sort((a: FileInfo, b: FileInfo) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setOccurrenceFiles((prev) => ({
        ...prev,
        [occurrenceId]: sortedFiles,
      }));
    } catch (error) {
      console.error('Erro ao buscar arquivos da ocorrência:', error);
    }
  }, []);

  // Buscar arquivos quando uma ocorrência é carregada
  useEffect(() => {
    occurrences.forEach((occurrence) => {
      fetchOccurrenceFiles(occurrence.id);
    });
  }, [occurrences, fetchOccurrenceFiles]);

  const handleOpenFile = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const getContentForStep = (occurrence: Occurrence, stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return occurrence.problem;
      case 1:
        return occurrence.solution;
      case 2:
        return occurrence.conclusion;
      case 3:
        const files = occurrenceFiles[occurrence.id] || [];
        if (files.length === 0) {
          return 'Nenhum arquivo anexado.';
        }
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {files.map((file, index) => (
              <Tooltip key={index} title="Visualizar arquivo em outra aba">
                <Typography
                  variant="body2"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() => handleOpenFile(file.url)}
                >
                  • {file.cleanedName}
                </Typography>
              </Tooltip>
            ))}
          </Box>
        );
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDeleteClick = (id: number) => {
    setOccurrenceToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!occurrenceToDelete) return;

    setDeletingId(occurrenceToDelete);
    try {
      // Primeiro, buscar os arquivos relacionados à ocorrência
      console.log(
        'Buscando arquivos relacionados à ocorrência:',
        occurrenceToDelete,
      );
      const filesResponse = await fetch(
        `/api/getAllFilesBlobByOccurrence?occurrenceId=${occurrenceToDelete}`,
      );
      const filesData = await filesResponse.json();

      console.log('Arquivos encontrados para a ocorrência:', filesData.files);

      // Se existirem arquivos, deletá-los primeiro
      if (filesResponse.ok && filesData.files.length > 0) {
        console.log('Deletando arquivos associados');
        await fetch(`/api/deleteAllFilesBlobByOccurrence`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileUrls: filesData.files.map((file: { url: any }) => file.url),
          }),
        });
        console.log('Arquivos deletados com sucesso');
      }

      // Depois de deletar os arquivos, deletar a ocorrência
      console.log('Tentando deletar a ocorrência do banco de dados');
      const response = await fetch('/api/deleteFrequentOccurrences', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: occurrenceToDelete }),
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar ocorrência');
      }

      setOccurrences((prev) =>
        prev.filter((occ) => occ.id !== occurrenceToDelete),
      );
      setStepIndexes((prev) =>
        prev.filter((_, index) => index !== occurrenceToDelete),
      );
    } catch (error) {
      console.error('Erro ao deletar ocorrência ou arquivos:', error);
      alert('Erro ao deletar ocorrência');
    } finally {
      setDeletingId(null);
      setDeleteModalOpen(false);
      setOccurrenceToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setOccurrenceToDelete(null);
  };

  const handleEditClick = (occurrenceId: number) => {
    router.push(`/frequentOccurrencesEditPage?id=${occurrenceId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const start = globalPage * occurrencesPerPage;
  const end = start + occurrencesPerPage;
  const currentOccurrences = occurrences.slice(start, end);

  return (
    <Box sx={{ mt: 4 }}>
      {currentOccurrences.map((occurrence, index) => {
        const globalIndex = start + index;
        const activeStep = stepIndexes[globalIndex];

        return (
          <Paper key={occurrence.id} sx={styles.cardPaper} elevation={3}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography sx={{ fontSize: { xs: '14px', sm: '18px' } }}>
                Ocorrência #{occurrence.id}
              </Typography>
              <Box>
                <Tooltip title="Editar">
                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(occurrence.id)}
                    sx={{
                      '&:hover': {
                        color: orange[700],
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(occurrence.id)}
                    disabled={deletingId === occurrence.id}
                    sx={{
                      '&:hover': {
                        color: red[700],
                      },
                    }}
                  >
                    {deletingId === occurrence.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
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

            <Typography
              variant="subtitle2"
              sx={{ ...styles.cardPaperText, minHeight: 60, mb: 3 }}
            >
              <strong>{stepsLabels[activeStep]}:</strong>{' '}
              {getContentForStep(occurrence, activeStep)}
            </Typography>

            <MobileStepper
              variant="dots"
              steps={stepsLabels.length}
              position="static"
              activeStep={activeStep}
              sx={{
                backgroundColor: 'grey.600',
                '& .MuiMobileStepper-dot': {
                  backgroundColor: 'grey.400',
                },
                '& .MuiMobileStepper-dotActive': {
                  backgroundColor: 'primary.main',
                },
                borderRadius: '10px',
              }}
              nextButton={
                <Button
                  size="small"
                  onClick={() => handleNextStep(globalIndex)}
                  disabled={activeStep === stepsLabels.length - 1}
                >
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={() => handleBackStep(globalIndex)}
                  disabled={activeStep === 0}
                >
                  <KeyboardArrowLeft />
                </Button>
              }
            />
          </Paper>
        );
      })}

      {occurrences.length > 0 && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button onClick={handleBackGlobal} disabled={globalPage === 0}>
            <KeyboardArrowLeft />
          </Button>
          <Typography sx={styles.cardPaperText}>
            Página {globalPage + 1} de {totalPages}
          </Typography>
          <Button
            onClick={handleNextGlobal}
            disabled={globalPage === totalPages - 1}
          >
            <KeyboardArrowRight />
          </Button>
        </Box>
      )}

      {occurrences.length === 0 && !loading && (
        <Typography sx={styles.cardPaperText} textAlign="center">
          Nenhuma ocorrência registrada.
        </Typography>
      )}

      <AlertModalConfirmDelete
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
