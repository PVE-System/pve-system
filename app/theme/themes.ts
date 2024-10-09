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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Estilos para a barra de rolagem
        '::-webkit-scrollbar': {
          width: '6px',
          height: '200px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '6px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: orange[800],
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#dedfe1',
        },
        // Garante que a barra de rolagem esteja sempre presente
        body: {
          overflowY: 'scroll',
        },
      },
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: orange[500], // Orange. Um pouco mais claro que no tema dark. Cor principal para botões e ícones.
      contrastText: '#ffffff', // White. Cor para textos dentro do botão.
    },
    secondary: {
      main: '#6b6b6b', // DarkGrey. Cor secundaria para botões e ícones.
      contrastText: orange[600], // Orange. Cor alternativa para textos dentro do botão.
    },
    background: {
      default: '#dedfe1', // LightGrey. Body, Cor de fundo principal.
      alternative: '#A9A9A9', // MediumGray. Cor de fundo alternativa.
      paper: '#f9f9f9', // WhiteGrey. Cor de fundo alternativa para componentes como o Drawer.
    },
    text: {
      primary: '#000000', // Black. Cor do texto padrão.
      secondary: '#6b6b6b', // DarkGrey. Cor do texto secundário.
    },
  },
});

const darkTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Estilos para a barra de rolagem
        '::-webkit-scrollbar': {
          width: '6px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '6px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: orange[800],
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#303030',
        },
        // Garante que a barra de rolagem esteja sempre presente
        body: {
          overflowY: 'scroll',
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: orange[800], // Orange. Cor principal para botões e ícones.
      contrastText: '#ffffff', // White. Cor para textos dentro do botão.
    },
    secondary: {
      main: '#ffffff', // White. Cor secundaria para botões e ícones.
      contrastText: orange[800], // Orange. Cor alternativa para textos dentro do botão.
    },
    background: {
      default: '#303030', // DarkGrey. Body, cor de fundo principal.
      alternative: '#2A2E30', // DarkGreen. Cor de fundo alternativa.
      paper: '#000000', // Black. Cor de fundo alternativa para componentes como o Drawer e Accordion.
    },
    text: {
      primary: '#ffffff', // White. Cor do texto padrão.
      secondary: '#f3f3f3', // LightGrey. Cor do texto secundário.
    },
  },
});

export { lightTheme, darkTheme };
