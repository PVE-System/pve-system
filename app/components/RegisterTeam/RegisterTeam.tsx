'use client';

import * as React from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  CircularProgress,
  Tooltip,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';
import { useAuth } from '@/app/contex/authContext';

function RegisterTeamComponent() {
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'vendedor', // Valor padrão
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /(?=.*[A-Z])(?=.*[0-9]).{6,}/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Ativa o estado de carregamento

    if (!validateEmail(formData.email)) {
      setMessage('Por favor, insira um email válido');
      setLoading(false); // Desativa o estado de carregamento
      return;
    }

    if (!validatePassword(formData.password)) {
      setMessage(
        'Senhas com pelo menos 6 caracteres, contendo 1 letra maiúscula e 1 número)',
      );
      setLoading(false); // Desativa o estado de carregamento
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('As senhas devem ser iguais');
      setLoading(false); // Desativa o estado de carregamento
      return;
    }

    try {
      const response = await fetch('/api/registerUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
        }),
      });

      if (response.ok) {
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: '',
          role: 'vendedor',
        });
        setMessage('Usuário cadastrado com sucesso!');
      } else {
        const error = await response.json();
        setMessage(`Erro: ${error.error}`);
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor');
    } finally {
      setLoading(false); // Finaliza o estado de carregamento ao término
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
        <Typography variant="subtitle1" sx={sharedStyles.subtitleSize}>
          Digite email e senha para cadastrar equipe.
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
          sx={{ ...sharedStyles.titleForm }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            inputProps={{
              pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
            }}
          />

          <TextField
            select
            margin="normal"
            required
            fullWidth
            name="role"
            label="Função"
            id="role"
            value={formData.role}
            onChange={handleChange}
          >
            <MenuItem value="vendedor">Vendedor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            inputProps={{
              pattern: '(?=.*[A-Z])(?=.*[0-9]).{6,}',
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar senha"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            inputProps={{
              minLength: 6,
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.button}
            disabled={loading} // Desativa o botão durante o carregamento
          >
            {loading ? <CircularProgress size={24} /> : 'Cadastrar equipe'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Tooltip title={'Gerenciar todos os usuários'}>
                <Link href="/adminPage" variant="body2">
                  Gerenciar Equipe
                </Link>
              </Tooltip>
            </Grid>
            <Grid item>
              <Link href="#" onClick={logout} variant="body2">
                {'Página de Login'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterTeamComponent;
