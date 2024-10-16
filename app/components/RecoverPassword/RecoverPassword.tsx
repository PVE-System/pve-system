'use client';

import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import sharedStyles from '@/app/styles/sharedStyles';

import { CircularProgress } from '@mui/material';
import styles from './styles';

export default function RecoverPassword() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Inicia o loading

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    try {
      const response = await fetch('/api/recoverPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Só precisamos enviar o e-mail
      });

      if (response.ok) {
        // Exibe uma mensagem confirmando o envio do e-mail
        setMessage('Um link de recuperação foi enviado para o seu e-mail.');
      } else {
        const error = await response.json();
        setMessage(
          error.error || 'Ocorreu um erro ao solicitar a recuperação de senha.',
        );
      }
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
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
          Insira o seu email de login para receber um link para alterar a senha.
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            sx={{ width: '400px', textAlign: 'center' }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.button}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              'Enviar link de recuperação'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
