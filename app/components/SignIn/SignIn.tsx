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
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        const { token, userId } = await response.json(); // Capture o ID do usuário
        Cookies.set('token', token, { path: '/' });
        Cookies.set('userId', userId, { path: '/' }); // Salve o ID do usuário no cookie
        window.location.reload(); // Força um refresh da página
      } else {
        const error = await response.json();
        setMessage(`${error.error}`);
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor');
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
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Esqueceu a senha?
              </Link>
            </Grid>
            <Grid item>
              {/* 
              <NextLink href="/register" passHref>
                <Link variant="body2">
                  {'Não tem uma conta?'}
                  <br />
                  {'Inscrever-se'}
                </Link>
              </NextLink> 
              */}
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={styles.copyright} />
    </Container>
  );
}
