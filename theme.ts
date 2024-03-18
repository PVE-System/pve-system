'use client'
/* import { Roboto } from 'next/font/google' */
import { createTheme } from '@mui/material/styles'

/* const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
}) */

const lightTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#EA650A', // Laranja. Cor principal para botões e ícones.
      light: '#F6E7D8', // Branco. Cor alternativa para botões e ícones.
      contrastText: '#ffffff', // Branco. Cor alternativa para textos.
    },
    secondary: {
      main: '#F6E7D8', // Verde escuro. Cor principal para fundos de páginas individuais de clientes.
      contrastText: '#EA650A', // Laranja. Cor alternativa para textos.
    },
    background: {
      default: '#F6E7D8', // Branco. Cor de fundo principal.
      paper: '#FDD3A9', // Cinza claro. Cor de fundo alternativa para componentes como o Drawer.
    },
  },
})

const darkTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#EA650A', // Laranja. Cor principal para botões e ícones.
      light: '#ffffff', // Branco. Cor alternativa para botões e ícones.
      contrastText: '#ffffff', // Branco. Cor alternativa para textos.
    },
    secondary: {
      main: '#2A2E30', // Verde escuro. Cor principal para fundos de páginas individuais de clientes.
      contrastText: '#EA650A', // Laranja. Cor alternativa para textos.
    },
    background: {
      default: '#303030', // Cinza escuro. Cor de fundo principal.
      paper: '#000000', // Preto. Cor de fundo alternativa para componentes como o Drawer.
    },
  },
})

export { lightTheme, darkTheme }

/* const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#EA650A', // ORANGE. Cor principal para os botoes e icones.
      light: '#ffffff', // WHITE. Cor alternativa para os botoes e icones.
      contrastText: '#ffffff', // WHITE. Cor alternativa para os textos.
    },
    secondary: {
      main: '#2A2E30', // DARKGREEN. Cor principal para os background das paginas individuais de cada cliente.
      contrastText: 'EA650A', // ORANGE. Cor alternativa para os textos.
    },
    background: {
      default: '#303030', // DARKGREY Cor de fundo principal.
      paper: '#000000', // BLACK. Cor de fundo alternativa para os componentes de papelaria como o MENUDRAWER SEARCH.
    },
  },
}) */

/* export default theme
 */
