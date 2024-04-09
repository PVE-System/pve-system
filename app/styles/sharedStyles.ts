import { orange } from '@mui/material/colors';

const sharedStyles = {
  container: {
    my: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    /* background: 'grey', */
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },

  titlePage: {
    margin: '8px',
    textAlign: 'center',
    '& span': {
      color: orange[800],
    },
    fontSize: '32px',
    // Tamanho da fonte tela Notebook
    '@media (max-width:1050px)': {
      fontSize: '30px',
    },
    // Tamanho da fonte tela Tablet
    '@media (max-width:800px)': {
      fontSize: '28px',
    },
    // Tamanho da fonte tela Mobile
    '@media (max-width:450px)': {
      fontSize: '26px',
    },
  },

  subtitle: {
    // Tamanho da fonte tela desktop
    fontSize: '18px',
    // Tamanho da fonte tela Notebook
    '@media (max-width:1050px)': {
      fontSize: '16px',
    },
    // Tamanho da fonte tela Tablet
    '@media (max-width:800px)': {
      fontSize: '14px',
    },
    // Tamanho da fonte tela Mobile
    '@media (max-width:450px)': {
      fontSize: '12px',
    },
  },
};

export default sharedStyles;
