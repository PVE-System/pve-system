import { BorderColor } from '@mui/icons-material';
import { grey, orange } from '@mui/material/colors';

const sharedStyles = {
  container: {
    my: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    /* background: 'grey', */
    '@media (max-width: 600px)': {
      // Estilos para telas menores que 600px

      width: '100%', // Definindo a largura como 100% para ocupar toda a largura da tela
    },
  },

  titlePage: {
    margin: '8px',
    textAlign: 'center',
    '& span': {
      color: orange[800],
    },
  },
};

export default sharedStyles;
