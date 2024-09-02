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
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
        setFiles(data.files || []);
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
          ? `BalanceSheet/id=${clientId}`
          : `ShipmentReport/id=${clientId}`;
      await fetchFiles(folder);
      setLoading(false);
    };

    fetchData();
  }, [clientId, fetchClientData, fetchFiles, tabIndex]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    const folder =
      newValue === 0
        ? `BalanceSheet/id=${clientId}`
        : `ShipmentReport/id=${clientId}`;
    fetchFiles(folder);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const formData = new FormData();
      formData.append('file', files[0]);
      const folder =
        tabIndex === 0
          ? `BalanceSheet/id=${clientId}`
          : `ShipmentReport/id=${clientId}`;

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
          // Adiciona o arquivo recém-enviado à lista de arquivos
          const newFileWithDate = {
            ...newFile,
            date: new Date().toISOString(),
            name: files[0].name,
          };
          setFiles((prevFiles) => [...prevFiles, newFileWithDate]);
        } else {
          console.error('Error uploading file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleDownloadFile = async (fileUrl: string) => {
    try {
      const response = await fetch(
        `/api/downloadFilesClient?fileUrl=${encodeURIComponent(fileUrl)}&clientId=${clientId}`,
      );
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileUrl.split('/').pop() || 'file';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error('Error downloading file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDeleteFile = async (fileUrl: string) => {
    try {
      const response = await fetch(
        `/api/deleteFilesClient?fileUrl=${encodeURIComponent(fileUrl)}&clientId=${clientId}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file.url !== fileUrl),
        );
      } else {
        console.error('Error deleting file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
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
          phone={clientData?.phone}
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
                label="Balanço Patrimonial"
                sx={{
                  textTransform: 'none',
                }}
              />
              <Tab
                label="Relatório de Embarque"
                sx={{
                  textTransform: 'none',
                }}
              />
            </Tabs>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
            >
              <IconButton component="label">
                <CloudUploadIcon sx={styles.icon} />
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  hidden
                />
              </IconButton>
            </Box>
            <Box sx={{ marginTop: 2 }}>
              <List>
                {files.map((file) => (
                  <ListItem key={file.url}>
                    <AttachFileIcon sx={{ marginRight: 1 }} />
                    <ListItemText
                      primary={file.name}
                      secondary={new Date(file.date).toLocaleDateString(
                        'pt-BR',
                      )}
                    />
                    <IconButton onClick={() => handleDownloadFile(file.url)}>
                      <GetAppIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteFile(file.url)}>
                      <DeleteIcon />
                    </IconButton>
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
