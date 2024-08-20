'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';
import { useAuth } from '@/app/contex/authContext'; // Importe o contexto de autenticação

function RegisterTeamComponent() {
  const { logout } = useAuth(); // Obtenha a função de logout do contexto
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  // Estado para armazenar mensagens de feedback
  const [message, setMessage] = useState<string | null>(null);

  // Função para lidar com as mudanças nos campos do formulário
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Função para validar o email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return emailRegex.test(email);
  };

  // Função para validar a senha
  const validatePassword = (password: string): boolean => {
    const passwordRegex = /(?=.*[A-Z])(?=.*[0-9]).{6,}/;
    return passwordRegex.test(password);
  };

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validar o email
    if (!validateEmail(formData.email)) {
      setMessage('Por favor, insira um email válido');
      return;
    }

    // Validar a senha
    if (!validatePassword(formData.password)) {
      setMessage(
        'Senhas com pelo menos 6 caracteres, contendo 1 letra maiúscula e 1 número)',
      );

      return;
    }

    // Verificar se as senhas são iguais
    if (formData.password !== formData.confirmPassword) {
      setMessage('As senhas devem ser iguais');
      return;
    }

    // Enviar requisição POST para a API
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
        }),
      });

      if (response.ok) {
        // Limpar o formulário se o cadastro for bem-sucedido
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: '',
        });
        /* const result = await response.json(); */ // A variável result é declarada, mas não utilizada. Pode ser removida.
        setMessage('Usuário cadastrado com sucesso!');
      } else {
        const error = await response.json();
        setMessage(`Erro: ${error.error}`);
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
            // Regex para validar email
            inputProps={{
              pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
            }}
            // Mensagem de erro personalizada
            /* helperText="Por favor, insira um email válido" */
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            inputProps={{
              pattern: '(?=.*[A-Z])(?=.*[0-9]).{6,}',
            }}
            // Mensagem de erro personalizada
            /* helperText="A partir de 6 caracteres, incluindo 1 letra maiúscula e 1 número" */
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            // Verificação simples para garantir que a confirmação da senha seja obrigatória
            inputProps={{
              minLength: 6,
            }}
            /*  helperText="Confirme sua senha" */
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={styles.button}
          >
            Cadastrar equipe
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/dashboard" variant="body2">
                Voltar para Dashboard
              </Link>
            </Grid>
            <Grid item>
              <Grid item>
                <Link href="#" onClick={logout} variant="body2">
                  {'Página de Login'}
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterTeamComponent;
