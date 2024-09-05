import { green, orange, red } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

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

  inputsCol2: {
    width: '100%',
    marginBottom: '20px',
    /*     '& .MuiInputBaseInput': {
      height: '10px',
    }, */
  },

  boxButton: {
    display: 'flex',
    justifyContent: 'center',
    gap: 2,
    '@media (max-width: 800px)': {
      flexDirection: 'column',
      gap: 0,
    },
  },

  IconUpdate: {
    cursor: 'pointer',
    /* alignSelf: 'center', */
    width: '25px',
    height: '25px',
    transition: 'color 0.3s',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : theme.palette.secondary.main,
    '&:hover': {
      color: orange[700],
    },
    '@media (max-width:450px)': {
      width: '20px',
      height: '20px',
    },
  },

  iconDelete: {
    cursor: 'pointer',
    /* alignSelf: 'center', */
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
    '@media (max-width:450px)': {
      width: '20px',
      height: '20px',
    },
  },
};

export default styles;
