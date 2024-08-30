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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

  useEffect(() => {
    // Fetch the list of files from the server
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `/api/getExcelFile?folder=ExcelSalesSpreadsheet`,
        );
        const data = await response.json();
        console.log('Fetched files:', data.files); // Adicionando log para depuração
        setFiles(data.files || []);
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
          console.log('Uploaded file:', newFile); // Adicionando log para depuração

          // Adicionar a data atual ao novo arquivo
          const newFileWithDate = {
            ...newFile,
            date: new Date().toISOString(), // Adiciona a data atual
            name: file.name, // Preserva o nome do arquivo
          };

          setFiles([...files, newFileWithDate]); // Adiciona o arquivo com a data ao estado

          // Resetar o valor do input de arquivo para permitir novos uploads
          event.target.value = '';
        } else {
          console.error('Error uploading file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleDownload = async (fileName: string) => {
    if (!fileName) {
      console.error('File name is missing');
      return;
    }

    try {
      // Solicita a URL do arquivo com base no nome
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
    }
  };

  const handleDelete = async (fileUrl: string) => {
    if (!fileUrl) {
      console.error('File URL is missing');
      return;
    }

    try {
      const response = await fetch(
        `/api/deleteExcelFile?fileName=${encodeURIComponent(fileUrl)}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        setFiles(files.filter((file) => file.url !== fileUrl)); // Filtra pelo URL completo
      } else {
        console.error('Error deleting file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
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
              <span>Inserir </span>Planilha
            </Typography>
            <IconButton component="label">
              <CloudUploadIcon sx={styles.icon} />
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleUpload}
                hidden
              />
            </IconButton>
          </CardContent>
        </Card>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ marginTop: 4 }}>
            {files.map((file) => {
              console.log('Rendering file:', file); // Adicionando log para depuração
              return (
                <Card variant="outlined" sx={styles.fileList} key={file.url}>
                  <CardContent
                    sx={{
                      display: 'flex', // Define o layout como flexbox
                      alignItems: 'center', // Alinha os itens ao centro verticalmente
                      justifyContent: 'space-between', // Espaça os itens uniformemente
                      gap: 1, // Define um espaço entre os itens
                    }}
                  >
                    <InsertDriveFileIcon
                      color="secondary"
                      sx={{ marginRight: 1 }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ ...styles.textFileList, flex: 1 }}
                    >
                      {/* {file.name} */} Planilha Excel Atualizada em:{' '}
                      <span>
                        {new Date(file.date).toLocaleDateString('pt-BR')}
                      </span>
                    </Typography>

                    <IconButton
                      color="primary"
                      onClick={() => handleDownload(file.url)}
                    >
                      <CloudDownloadIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(file.url)}
                    >
                      <DeleteIcon />
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
