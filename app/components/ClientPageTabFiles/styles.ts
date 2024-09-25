import { orange, red } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  card: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '300px',
    /*     borderRadius: 4,
    border: '3px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? orange[500] : orange[800], */

    '@media (max-width:450px)': {
      flexDirection: 'column',
      height: 'auto',
    },
  },

  cardContent: {
    width: '300px',
    margin: '80px',

    '@media (max-width:450px)': {
      width: '100%',
      margin: '0',
    },
  },

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
    justifyContent: 'center',
    /* alignItens: 'center', */
    gap: '80px',
    width: '70%',
    '@media (max-width: 800px)': {
      flexDirection: 'column',
      textAlign: 'center',
      width: '100%',
    },
  },

  boxIconUpload: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 2,
  },

  iconUpload: {
    cursor: 'pointer',
    alignSelf: 'center',
    width: '25px',
    height: '25px',
    transition: 'color 0.3s',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : theme.palette.secondary.main,
    '&:hover': {
      color: orange[800],
    },
  },

  iconDownload: {
    cursor: 'pointer',
    alignSelf: 'center',
    width: '25px',
    height: '25px',
    transition: 'color 0.3s',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : theme.palette.secondary.main,
    '&:hover': {
      color: orange[800],
    },
  },

  iconDelete: {
    cursor: 'pointer',
    alignSelf: 'center',
    width: '25px',
    height: '25px',
    transition: 'color 0.3s',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : theme.palette.secondary.main,
    '&:hover': {
      color: red[600],
    },
  },

  fileList: {
    width: '600px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.default, // Azul claro
    padding: '8px 16px',
    borderRadius: '4px',
    marginBottom: '8px',

    '@media (max-width:1025px)': {
      width: '500px',
    },

    '@media (max-width:770px)': {
      flexDirection: 'column',
      width: '100%',
      height: 'auto',
    },
  },

  boxListItens: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },

  loadComponent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
export default styles;
