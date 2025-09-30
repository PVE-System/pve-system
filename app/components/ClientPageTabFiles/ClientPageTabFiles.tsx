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
  const [lastVisitData, setLastVisitData] = useState<{
    hasHistory: boolean;
    lastVisitConfirmedAt: string | null;
  } | null>(null);

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

        const removeHashFromFileName = (fileName: string) => {
          return fileName.replace(/-[^-]+\.[0-9a-z]+$/i, (match) => {
            const ext = match.split('.').pop();
            return `.${ext}`;
          });
        };

        const decodeFileName = (fileName: string) => {
          return decodeURIComponent(fileName);
        };

        const trimFileName = (name: string, maxLength = 40) => {
          return name.length > maxLength
            ? name.slice(0, maxLength) + '...'
            : name;
        };

        const getUniqueFileName = (
          baseName: string,
          existingNames: string[],
        ) => {
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

        const cleanedNamesSet: string[] = [];

        const treatedFiles = data.files.map((file: any) => {
          const rawName = decodeFileName(removeHashFromFileName(file.name));
          const trimmedName = trimFileName(rawName);
          const uniqueName = getUniqueFileName(trimmedName, cleanedNamesSet);
          cleanedNamesSet.push(uniqueName);

          return {
            ...file,
            cleanedName: uniqueName,
          };
        });

        // Ordenar por data (mais recente primeiro)
        const sortedFiles = treatedFiles.sort((b: any, a: any) => {
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
          ? `files/id=${clientId}`
          : tabIndex === 1
            ? `socialContract/id=${clientId}`
            : tabIndex === 2
              ? `fiscalDocs/id=${clientId}`
              : `accountingDocs/id=${clientId}`;

      await fetchFiles(folder);
      setLoading(false);
    };

    fetchData();
  }, [clientId, fetchClientData, fetchFiles, tabIndex]);

  // Buscar histórico de visitas do cliente (mesmo padrão aplicado nas outras abas)
  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      return;
    }

    const fetchVisitHistory = async () => {
      try {
        const response = await fetch(
          `/api/getVisitClientHistory?clientId=${clientId}`,
        );
        if (!response.ok) {
          console.error('Erro ao buscar histórico de visitas');
          return;
        }
        const data = await response.json();
        setLastVisitData(data);
      } catch (error) {
        console.error('Erro ao buscar histórico de visitas:', error);
      }
    };

    fetchVisitHistory();
  }, [clientId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    const folder =
      newValue === 0
        ? `files/id=${clientId}`
        : newValue === 1
          ? `socialContract/id=${clientId}`
          : newValue === 2
            ? `fiscalDocs/id=${clientId}`
            : `accountingDocs/id=${clientId}`;

    fetchFiles(folder);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileList = event.target.files;
    if (fileList) {
      setLoadingUpload(true);
      const formData = new FormData();
      formData.append('file', fileList[0]);
      const folder =
        tabIndex === 0
          ? `files/id=${clientId}`
          : tabIndex === 1
            ? `socialContract/id=${clientId}`
            : tabIndex === 2
              ? `fiscalDocs/id=${clientId}`
              : `accountingDocs/id=${clientId}`;

      try {
        const uploadUrl =
          tabIndex === 0
            ? `/api/uploadGeneralFilesClient?folder=${encodeURIComponent(folder)}&clientId=${clientId}`
            : `/api/uploadFilesClient?folder=${encodeURIComponent(folder)}&clientId=${clientId}`;

        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const newFile = await response.json();

          const removeHashFromFileName = (fileName: string) => {
            return fileName.replace(/-[^-]+\.[0-9a-z]+$/i, (match) => {
              const ext = match.split('.').pop();
              return `.${ext}`;
            });
          };

          const decodeFileName = (fileName: string) => {
            return decodeURIComponent(fileName);
          };

          const trimFileName = (name: string, maxLength = 40) => {
            return name.length > maxLength
              ? name.slice(0, maxLength) + '...'
              : name;
          };

          const getUniqueFileName = (
            baseName: string,
            existingNames: string[],
          ) => {
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

          const rawFileName = decodeFileName(
            removeHashFromFileName(fileList[0].name),
          );
          const formattedName = trimFileName(rawFileName);

          // Aqui `files` é o estado com a lista dos arquivos já enviados
          const existingNames = files.map(
            (file: { name: string; cleanedName?: string }) =>
              file.cleanedName || file.name,
          );

          const uniqueCleanedName = getUniqueFileName(
            formattedName,
            existingNames,
          );

          const newFileWithDate = {
            ...newFile,
            date: new Date().toISOString(),
            name: fileList[0].name,
            cleanedName: uniqueCleanedName, // aplicar nome único aqui
          };

          setFiles((prevFiles) => [...prevFiles, newFileWithDate]);

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
            ? `files/id=${clientId}`
            : tabIndex === 1
              ? `socialContract/id=${clientId}`
              : tabIndex === 2
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
          lastVisitData={lastVisitData}
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
                    xs: 'Arquivos',
                    md: 'Arquivos',
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
                    xs: 'Social', // Texto reduzido para telas menores
                    md: 'Contrato Social', // Texto completo para tablets e maiores
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
                        primary={file.cleanedName}
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
