'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Container,
  Tooltip,
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';

import ClientProfile from '@/app/components/ProfileClient/ProfileClient';
import styles from '@/app/components/ClientPageTabFiles/styles';
import sharedStyles from '@/app/styles/sharedStyles';

interface ClientPageTabFilesProps {
  clientId: string;
}

const ClientPageTabFiles: React.FC<ClientPageTabFilesProps> = ({
  clientId,
}) => {
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [files, setFiles] = useState<any[]>([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);

  const fetchClientData = useCallback(async () => {
    try {
      const clientResponse = await fetch(`/api/getClient/${clientId}`);
      if (!clientResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const clientData = await clientResponse.json();
      setClientData(clientData);
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  }, [clientId]);

  const fetchFiles = useCallback(
    async (folder: string) => {
      try {
        const response = await fetch(
          `/api/getFilesClient?folder=${encodeURIComponent(folder)}&clientId=${clientId}`,
        );
        const data = await response.json();

        // Ordena os arquivos por data (mais recente primeiro)
        const sortedFiles = data.files.sort((b: any, a: any) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setFiles(sortedFiles || []);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    },
    [clientId],
  );

  useEffect(() => {
    if (!clientId) return;

    const fetchData = async () => {
      setLoading(true);
      await fetchClientData();
      const folder =
        tabIndex === 0
          ? `socialContract/id=${clientId}`
          : tabIndex === 1
            ? `fiscalDocs/id=${clientId}`
            : `accountingDocs/id=${clientId}`;
      await fetchFiles(folder);
      setLoading(false);
    };

    fetchData();
  }, [clientId, fetchClientData, fetchFiles, tabIndex]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    const folder =
      newValue === 0
        ? `socialContract/id=${clientId}`
        : newValue === 1
          ? `fiscalDocs/id=${clientId}`
          : `accountingDocs/id=${clientId}`;
    fetchFiles(folder);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      setLoadingUpload(true);
      const formData = new FormData();
      formData.append('file', files[0]);
      const folder =
        tabIndex === 0
          ? `socialContract/id=${clientId}`
          : tabIndex === 1
            ? `fiscalDocs/id=${clientId}`
            : `accountingDocs/id=${clientId}`;
      try {
        const response = await fetch(
          `/api/uploadFilesClient?folder=${encodeURIComponent(folder)}&clientId=${clientId}`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (response.ok) {
          const newFile = await response.json();

          // Adiciona o arquivo recém-enviado à lista de arquivos com nome formatado
          const newFileWithDate = {
            ...newFile,
            date: new Date().toISOString(),
            name: files[0].name, // Use o nome do arquivo que o usuário selecionou
          };

          setFiles((prevFiles) => [...prevFiles, newFileWithDate]);

          // Reiniciar o campo de input de arquivo
          event.target.value = '';
        } else {
          console.error('Error uploading file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoadingUpload(false);
      }
    }
  };

  const handleDeleteFile = async (fileUrl: string) => {
    setLoadingDelete(fileUrl);
    try {
      const response = await fetch(
        `/api/deleteFilesClient?fileUrl=${encodeURIComponent(fileUrl)}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.url !== fileUrl),
        );

        // Após deletar, reatualiza a lista de arquivos para garantir que tudo esteja sincronizado
        const folder =
          tabIndex === 0
            ? `socialContract/id=${clientId}`
            : tabIndex === 1
              ? `fiscalDocs/id=${clientId}`
              : `accountingDocs/id=${clientId}`;
        await fetchFiles(folder);
      } else {
        const errorResponse = await response.json();
        console.error(
          'Error deleting file:',
          errorResponse.error || 'Unknown error',
        );
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleDownloadFile = (fileUrl: string) => {
    setLoadingDownload(fileUrl);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank'; // Abre em uma nova aba
    link.download = ''; // Inicia o download automaticamente

    document.body.appendChild(link); // Adiciona o link temporariamente ao DOM
    link.click(); // Simula o clique para abrir a nova aba e iniciar o download
    document.body.removeChild(link); // Remove o link após o clique
    setLoadingDownload(null);
  };

  if (loading) {
    return (
      <Box sx={styles.loadComponent}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container fixed>
      <Box sx={styles.boxContent}>
        <ClientProfile
          rating={clientData?.rating}
          clientCondition={clientData?.clientCondition}
          onRatingChange={(rating) => console.log('Rating:', rating)}
          onConditionChange={(condition) =>
            console.log('Condition:', condition)
          }
          companyName={clientData?.companyName}
          corfioCode={clientData?.corfioCode}
          whatsapp={clientData?.whatsapp}
          emailCommercial={clientData?.emailCommercial}
          readOnly={false}
          imageUrl={clientData?.imageUrl}
          enableImageUpload={false}
        />
        <Box sx={styles.boxCol2}>
          <Box>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              centered
              sx={{
                indicator: {
                  height: '4px',
                  borderRadius: '4px',
                },
              }}
            >
              <Tab
                label={
                  {
                    xs: 'Cont. Social', // Texto reduzido para telas menores
                    md: 'Contrato. Social', // Texto completo para tablets e maiores
                  }[window.innerWidth < 600 ? 'xs' : 'md']
                }
                sx={{
                  textTransform: 'none',
                  fontSize: {
                    xs: '12px',
                    md: '14px',
                  },
                }}
              />
              <Tab
                label={
                  {
                    xs: 'Fiscais', // Texto reduzido para telas menores
                    md: 'Docs Fiscais', // Texto completo para tablets e maiores
                  }[window.innerWidth < 600 ? 'xs' : 'md']
                }
                sx={{
                  textTransform: 'none',
                  fontSize: {
                    xs: '12px',
                    md: '14px',
                  },
                }}
              />

              <Tab
                label={
                  {
                    xs: 'Contábeis',
                    md: 'Docs Contábeis',
                  }[window.innerWidth < 600 ? 'xs' : 'md']
                }
                sx={{
                  textTransform: 'none',
                  fontSize: {
                    xs: '12px',
                    md: '14px',
                  },
                }}
              />
            </Tabs>

            <Box sx={styles.boxIconUpload}>
              <Tooltip title={'Insira um novo arquivo'}>
                <IconButton component="label" disabled={loadingUpload}>
                  {loadingUpload ? (
                    <CircularProgress size={24} />
                  ) : (
                    <AttachFileIcon sx={styles.iconUpload} />
                  )}
                  <input
                    type="file"
                    accept="*"
                    onChange={handleFileChange}
                    hidden
                  />
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <List>
                {files.map((file) => (
                  <ListItem key={file.url} sx={styles.fileList}>
                    <Box sx={styles.boxListItens}>
                      <AttachFileIcon
                        sx={{ marginRight: 1, color: 'darkOrange' }}
                      />
                      <ListItemText
                        primary={
                          file.name && file.name.includes('-')
                            ? decodeURIComponent(
                                file.name.split('-')[0],
                              ).substring(0, 40) +
                              (file.name.split('-')[0].length > 40
                                ? '...'
                                : '') +
                              file.name
                                .split('-')
                                .pop()
                                .match(/\.[0-9a-z]+$/i)[0]
                            : file.name
                        }
                        secondary={new Date(file.date).toLocaleDateString(
                          'pt-BR',
                        )}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: {
                              xs: '10px',
                              md: '14px',
                            },
                          },
                        }}
                        secondaryTypographyProps={{
                          fontSize: {
                            xs: '12px',
                            md: '14px',
                          },
                          style: { color: 'darkOrange', fontWeight: 'bold' },
                        }}
                      />
                    </Box>
                    <Box>
                      <Tooltip title={'Arquivo para download'}>
                        <IconButton
                          onClick={() => handleDownloadFile(file.url)}
                          disabled={loadingDownload === file.url}
                        >
                          {loadingDownload === file.url ? (
                            <CircularProgress size={24} />
                          ) : (
                            <GetAppIcon sx={styles.iconDownload} />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={'Deletar Arquivo'}>
                        <IconButton
                          onClick={() => handleDeleteFile(file.url)}
                          disabled={loadingDelete === file.url}
                        >
                          {loadingDelete === file.url ? (
                            <CircularProgress size={24} />
                          ) : (
                            <DeleteIcon sx={styles.iconDelete} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ClientPageTabFiles;
