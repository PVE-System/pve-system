'use client';

import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import sharedStyles from '@/app/styles/sharedStyles';

import { CircularProgress } from '@mui/material';
import styles from './styles';

import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

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
      const response = await fetch('/api/recoverPasswordResend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Só precisamos enviar o e-mail
      });

      if (response.ok) {
        setMessage('Um link de recuperação foi enviado para o seu e-mail.');
        setTimeout(() => {
          router.push('/');
        }, 5000);
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
            Insira o email do usuário que deseja alterar a senha e receba um
            link em seu email para continuar.
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
        </Box>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            ...sharedStyles.titleForm,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '300px',
          }}
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
            sx={{
              ...styles.button,
              width: '100%',
              maxWidth: '300px',
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
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              'Enviar link de recuperação'
            )}
          </Button>
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
          <ReportProblemOutlinedIcon color="primary" />
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              textAlign: 'center',
              mb: 2,
            }}
          >
            Etapas para nova senha:
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ ...styles.fontSize, textAlign: 'center', mb: 2 }}
          >
            1- Após digitar o email, clique no botão enviar link de recuperação.
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ ...styles.fontSize, textAlign: 'center', mb: 2 }}
          >
            2- Ao receber o email com um link, clique nele para ir à página
            /resetPassword.
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ ...styles.fontSize, textAlign: 'center', mb: 2 }}
          >
            3- Escolha e confirme a nova senha.
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ ...styles.fontSize, textAlign: 'center', mb: 2 }}
          >
            4- Pronto! Senha alterada, você será encaminhado para a página de
            login.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
