'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import styles from '@/app/components/ExcelDownload/style';
import sharedStyles from '@/app/styles/sharedStyles';

interface ExcelFile {
  url: string;
  name: string;
  date: string;
}

export default function ExcelDownloadFileComponent() {
  const [files, setFiles] = useState<ExcelFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDownload, setLoadingDownload] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<string | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `/api/getExcelFile?folder=ExcelSalesSpreadsheet`,
        );
        const data = await response.json();

        const filesWithCorrectDates = data.files.map((file: any) => ({
          ...file,
          date: file.date
            ? new Date(file.date).toISOString()
            : new Date().toISOString(),
        }));

        setFiles(filesWithCorrectDates || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching files:', error);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoadingUpload(true); // Inicia o carregamento
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(
          `/api/uploadExcelFile?folder=ExcelSalesSpreadsheet`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (response.ok) {
          const newFile = await response.json();
          const newFileWithDate = {
            ...newFile,
            date: new Date().toISOString(),
            name: file.name,
          };

          setFiles([...files, newFileWithDate]);
          event.target.value = '';
        } else {
          console.error('Error uploading file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setLoadingUpload(false); // Termina o carregamento
      }
    }
  };

  const handleDownload = async (fileName: string) => {
    if (!fileName) {
      console.error('File name is missing');
      return;
    }

    setLoadingDownload(fileName); // Inicia o carregamento

    try {
      const response = await fetch(
        `/api/downloadExcelFile?folder=ExcelSalesSpreadsheet&fileName=${encodeURIComponent(fileName)}`,
      );

      if (response.ok) {
        const data = await response.json();
        const fileUrl = data.url;

        if (fileUrl) {
          const a = document.createElement('a');
          a.href = fileUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          console.error('Error: URL not found in response');
        }
      } else {
        console.error('Error downloading file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoadingDownload(null); // Termina o carregamento
    }
  };

  const handleDelete = async (fileUrl: string) => {
    if (!fileUrl) {
      console.error('File URL is missing');
      return;
    }

    setLoadingDelete(fileUrl); // Inicia o carregamento

    try {
      const response = await fetch(
        `/api/deleteExcelFile?fileName=${encodeURIComponent(fileUrl)}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        setFiles(files.filter((file) => file.url !== fileUrl)); // Remove o arquivo da lista
      } else {
        console.error('Error deleting file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setLoadingDelete(null); // Termina o carregamento
    }
  };

  return (
    <Container fixed>
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          <span>Planilha </span>Excel
        </Typography>
      </Box>
      <Box>
        <Card variant="outlined" sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <Typography variant="h6" sx={sharedStyles.subtitleSize}>
              <span>Anexar </span>Planilha
            </Typography>
            <IconButton component="label">
              {loadingUpload ? (
                <CircularProgress size={24} /> // Exibe o CircularProgress durante o upload
              ) : (
                <AttachFileIcon sx={styles.iconUpload} /> // Exibe o ícone normal se não estiver carregando
              )}
              <input type="file" accept="*" onChange={handleUpload} hidden />
            </IconButton>
          </CardContent>
        </Card>
        {loading ? (
          <Box sx={styles.boxCircularProgress}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ marginTop: 4 }}>
            {files
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              ) // Ordena pela data em ordem crescente
              .map((file) => {
                const isDownloading = loadingDownload === file.url;
                const isDeleting = loadingDelete === file.url;

                return (
                  <Card variant="outlined" sx={styles.fileList} key={file.url}>
                    <CardContent sx={styles.contentFileList}>
                      <InsertDriveFileIcon />
                      <Typography
                        variant="body1"
                        sx={{ ...styles.textFileList, flex: 1 }}
                      >
                        Planilha Excel Atualizada em:{' '}
                        <span>
                          {new Date(file.date).toLocaleDateString('pt-BR')}
                        </span>
                      </Typography>

                      <IconButton
                        color="primary"
                        onClick={() => handleDownload(file.url)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <CloudDownloadIcon sx={styles.iconDownload} />
                        )}
                      </IconButton>

                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(file.url)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon sx={styles.iconDelete} />
                        )}
                      </IconButton>
                    </CardContent>
                  </Card>
                );
              })}
          </Box>
        )}
      </Box>
    </Container>
  );
}
