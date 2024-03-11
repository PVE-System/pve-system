// src/theme.ts
'use client'
import { Roboto } from 'next/font/google'
import { createTheme } from '@mui/material/styles'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#EA650A', // ORANGE. Cor principal para os botoes e icones.
      light: '#ffffff', // WHITE. Cor alternativa para os botoes e icones.
      contrastText: 'white', // WHITE. Cor alternativa para os textos.
    },
    secondary: {
      main: '#2A2E30', // DARKGREEN. Cor principal para os background das paginas individuais de cada cliente.
      contrastText: 'EA650A', // ORANGE. Cor alternativa para os textos.
    },
    background: {
      default: '#303030', // Cor de fundo principal.
      paper: '#242529', // Cor de fundo alternativa para os componentes de papelaria como o MENUDRAWER SEARCH.
    },
  },
})

export default theme
