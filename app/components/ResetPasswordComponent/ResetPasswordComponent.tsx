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
          />
        </Box>
        <Typography variant="subtitle1" sx={sharedStyles.titleForm}>
          Redefina sua senha
        </Typography>

        {message && (
          <Typography variant="body2" color="error">
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
          <Grid container>
            <Grid item xs>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textAlign: 'center', mt: 2 }}
              >
                Lembre-se de que o link de redefinição expira em 30 minutos.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
