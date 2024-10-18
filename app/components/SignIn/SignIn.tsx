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
import styles from './styles';
import { CircularProgress } from '@mui/material';

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="/">
        PVE System
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Inicia o loading

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/api/loginAuth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, userId } = await response.json();
        Cookies.set('token', token, { path: '/' });
        Cookies.set('userId', userId, { path: '/' });
        router.push('/dashboard'); // Redireciona sem necessidade de await
        /* window.location.reload(); */ // Força a atualização da página
      } else {
        const error = await response.json();
        setMessage(`${error.error}`);
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setLoading(false); // Finaliza o estado de carregamento apenas se houver um erro
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
          PVE Representações Ltda.
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
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Box sx={sharedStyles.titleForm}>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Lembrar-me"
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.button}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="recoverPassword" variant="body2">
                Esqueceu a senha?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
