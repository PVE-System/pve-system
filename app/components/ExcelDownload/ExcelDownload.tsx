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
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import styles from '@/app/components/ExcelDownload/style';
import sharedStyles from '@/app/styles/sharedStyles';
import Cookies from 'js-cookie';
import AlertModal from '../AlertModalDelete/AlertModalDelete';

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
  const [showAlertModal, setShowAlertModal] = useState(false);

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

  const fetchUserRole = async (userId: string): Promise<string | null> => {
    try {
      const response = await fetch(`/api/getUser/${userId}`);
      if (!response.ok) {
        console.error('Failed to fetch user role');
        return null;
      }
      const data = await response.json();
      return data.role;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  const handleDelete = async (fileUrl: string) => {
    const userId = Cookies.get('userId'); // Pega o ID do usuário dos cookies
    if (!userId) {
      console.error('User ID is missing');
      return;
    }

    const role = await fetchUserRole(userId);
    if (role !== 'admin') {
      setShowAlertModal(true); // Mostra o alerta se não for admin
      return;
    }

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
          <span>Planilha </span> de vendas
        </Typography>
        <Box>
          <Typography sx={sharedStyles.subtitleSize}>
            Faça o <span>Download </span> da planilha Excel na versão mais
            atual.
          </Typography>
        </Box>
        <Box sx={styles.boxUploadIcon}>
          <Typography
            variant="h6"
            sx={{
              ...sharedStyles.subtitleSize,
              fontSize: '14px',
            }}
          >
            Anexar Planilha
          </Typography>
          <Tooltip title="Inserir nova planilha" arrow>
            <IconButton component="label">
              {loadingUpload ? (
                <CircularProgress size={24} /> // Exibe o CircularProgress durante o upload
              ) : (
                <AttachFileIcon sx={styles.iconUpload} /> // Exibe o ícone normal se não estiver carregando
              )}
              <input type="file" accept="*" onChange={handleUpload} hidden />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {loading ? (
        <Box sx={styles.boxCircularProgress}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ marginTop: 4 }}>
          {files
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
                      sx={{
                        ...styles.textFileList,
                        ...sharedStyles.subTitleFontFamily,
                        flex: 1,
                      }}
                    >
                      Planilha atualizada no dia:{' '}
                      <span>
                        {new Date(file.date).toLocaleDateString('pt-BR')}
                      </span>
                    </Typography>
                    <Tooltip title="Baixar Planilha" arrow>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDownload(file.url)}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <CloudDownloadIcon sx={styles.iconDownload} />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deletar Planilha" arrow>
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
                    </Tooltip>
                  </CardContent>
                </Card>
              );
            })}
          {showAlertModal && (
            <AlertModal
              open={showAlertModal} // Usar o estado `showAlertModal` aqui
              onClose={() => setShowAlertModal(false)}
              onConfirm={() => setShowAlertModal(false)} // Fechar o modal ao confirmar
              message="Somente para usuários admin" // Mensagem para o usuário
            />
          )}
        </Box>
      )}
    </Container>
  );
}
