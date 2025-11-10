'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Container,
  Tooltip,
  MenuItem,
  useMediaQuery,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
} from '@mui/icons-material';

import LockResetIcon from '@mui/icons-material/LockReset';

import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';

export interface User {
  [x: string]: any;
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminPageTabClientsStatusUpdate() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const response = await fetch('/api/updateClientsRating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setSnackbar({
          open: true,
          message: data.message,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || 'Erro ao atualizar status dos clientes',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      setSnackbar({
        open: true,
        message: 'Erro de conexão ao atualizar status dos clientes',
        severity: 'error',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Box>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          Status de atividade dos clientes e os critérios para avaliar:
        </Typography>
        <Typography variant="body1" component="p" sx={styles.fontSize}>
          • <strong>1 estrela: </strong> Clientes com menos de{' '}
          <strong>10 cotações</strong> nos últimos 6 meses.
        </Typography>
        <Typography variant="body1" component="p" sx={styles.fontSize}>
          • <strong>2 estrelas: </strong> Clientes com{' '}
          <strong>10 a 50 cotações</strong> nos últimos 6 meses.
        </Typography>
        <Typography variant="body1" component="p" sx={styles.fontSize}>
          • <strong>3 estrelas: </strong> Clientes com mais de{' '}
          <strong>50 cotações</strong> nos últimos 6 meses.
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ ...styles.fontSize, mt: 3 }}
        >
          • <strong>Obs: </strong> Nos dias{' '}
          <strong>01 de Janeiro e 01 de Julho</strong> os status dos clientes
          serão atualizados automaticamente pelo sistema.
        </Typography>
        <Typography variant="body1" component="p" sx={styles.fontSize}>
          • <strong>Obs: </strong> Administradores podem atualizar os status dos
          clientes manualmente clicando no botão abaixo.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateStatus}
            disabled={updating}
            startIcon={
              updating ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {updating ? 'Atualizando...' : 'Atualizar status'}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
