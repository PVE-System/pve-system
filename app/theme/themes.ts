'use client';
import { orange } from '@mui/material/colors';
/* import { Roboto } from 'next/font/google' */
import { createTheme } from '@mui/material/styles';

/* const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
}) */
declare module '@mui/material/styles' {
  interface TypeBackground {
    alternative: string;
  }
}

const lightTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#FF8C00', // Laranja um pouco mais claro que no dark. Cor principal para botões e ícones.
      light: '#F6E7D8', // Cor alternativa para botões e ícones especifica para temas claros.
      contrastText: '#ffffff', // Branco. Cor para textos dentro do botão.
    },
    secondary: {
      main: '#F6E7D8', // Cor secundaria para botões e ícones.
      contrastText: '#EA650A', // Laranja. Cor alternativa para textos dentro do botão.
    },
    background: {
      default: '#B1C7D6', // Pastel claro. Body Cor de fundo principal.AED6F1    B5C7D2
      alternative: '#2A2E30', // DarkGreen Cor de fundo alternativa.
      paper: '#AED1F1', // Azul Pscina. Cor de fundo alternativa para componentes como o Drawer.B5C7D2
    },
    text: {
      primary: '#000000', // Black. Cor do texto padrão.
      secondary: 'EA650A', // Laranjado. Cor do texto secundário, como em listas e descrições.
    },
  },
});

const darkTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: orange[800], // Laranja. Cor principal para botões e ícones.
      light: '#F6E7D8', // Cor para hover nos botões e ícones especifica para temas escuros.
      contrastText: '#ffffff', // Branco. Cor para textos dentro do botão.
    },
    secondary: {
      main: '#ffffff', // Cor secundaria para botões e ícones.
      contrastText: '#EA650A', // Laranja. Cor alternativa para textos dentro do botão.
    },
    background: {
      default: '#303030', // Cinza escuro. Body, cor de fundo principal.
      alternative: '#2A2E30', // DarkGreen Cor de fundo alternativa.
      paper: '#000000', // Preto. Cor de fundo alternativa para componentes como o Drawer e Accordion.
    },
    text: {
      primary: '#ffffff', // Branco. Cor do texto padrão.
      secondary: '#6b6b6b', // Laranjado. Cor do texto secundário, como em listas e descrições.
    },
  },
});

export { lightTheme, darkTheme };
