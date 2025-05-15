'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CircularProgress,
  Container,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import Image from 'next/image';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

export default function ResetPasswordComponent() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const token = searchParams.get('token');

    if (!token) {
      setMessage('Token de redefinição de senha inválido ou ausente.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setMessage('Senha redefinida com sucesso!');
        router.push('/login');
      } else {
        const errorData = await response.json();
        setMessage(
          errorData.error || 'Ocorreu um erro na redefinição da senha.',
        );
      }
    } catch (error) {
      console.error('Erro ao redefinir a senha:', error);
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={styles.container}>
        <Box>
          <Image
            src="/logoPveMenu.png"
            alt="Logo PVE"
            width={150}
            height={150}
            priority
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ ...styles.fontSize, textAlign: 'center' }}
          >
            Redefina a senha para este usuário.
          </Typography>

          {message && (
            <Typography
              variant="body2"
              color="error"
              sx={{ ...styles.fontSize, textAlign: 'center' }}
            >
              {message}
            </Typography>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={sharedStyles.titleForm}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Nova Senha"
              type="password"
              id="password"
              autoComplete="new-password"
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px', // Tamanho da fonte do label
                },
                '& .MuiSelect-select': {
                  fontSize: '14px', // Tamanho da fonte do valor selecionado
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Nova Senha"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              sx={{
                '& .MuiInputLabel-root': {
                  fontSize: '14px', // Tamanho da fonte do label
                },
                '& .MuiSelect-select': {
                  fontSize: '14px', // Tamanho da fonte do valor selecionado
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={styles.button}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Redefinir Senha'}
            </Button>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '300px',
              }}
            >
              <ReportProblemOutlinedIcon color="primary" />
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ ...styles.fontSize, textAlign: 'center', mt: 2 }}
              >
                Lembre-se de que o link de redefinição expira em 30 minutos.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
