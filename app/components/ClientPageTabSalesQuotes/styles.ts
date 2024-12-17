import { Height } from '@mui/icons-material';
import { Theme } from '@mui/material';

const styles = {
  boxContent: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: '20px',

    '@media (max-width: 800px)': {
      alignItems: 'center',
    },
  },

  boxCol2: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '70%',
    '@media (max-width: 800px)': {
      width: '100%',
    },
  },

  boxButtonAndInput: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',

    '@media (max-width: 450px)': {
      flexDirection: 'column',
      gap: 2,
    },
  },

  buttonQuotesAdd: {
    backgroundColor: 'green',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '150px', // Para evitar que o botão fique pequeno demais
    height: '40px',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
  },

  buttonTotalResult: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '150px', // Para evitar que o botão fique pequeno demais
    height: '40px',
  },

  boxList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.alternative,
  },

  boxPagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    gap: '10px',
  },

  loadComponent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default styles;
