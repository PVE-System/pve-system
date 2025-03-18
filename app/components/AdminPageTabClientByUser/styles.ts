import { grey } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  container: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    /* borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? orange[500] : orange[800], */
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',

    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
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
    flexDirection: 'column',
    gap: '20px',
    width: '70%',
    '@media (max-width: 800px)': {
      width: '100%',
    },
  },

  inputsCol2: {
    width: '100%',
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

  exportExcelButton: {
    marginTop: '20px',
    backgroundColor: 'purple',

    '&:hover': {
      backgroundColor: '#5e005e',
      '@media (max-width: 800px)': {
        /* alignSelf: 'center', */
      },
    },
  },

  exportButton: {
    marginTop: '20px',
    backgroundColor: 'mediumblue',

    '&:hover': {
      backgroundColor: 'darkblue',
      '@media (max-width: 800px)': {
        /* alignSelf: 'center', */
      },
    },
  },

  editButton: {
    marginTop: '20px',
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: 'darkgreen',
      '@media (max-width: 800px)': {
        /* alignSelf: 'center', */
      },
    },
  },
  loadComponent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontSize: {
    fontSize: '16px',
    '@media (max-width: 450px)': {
      fontSize: '12px',
      hover: 'none',
    },
  },
  buttonTagCondition: {
    minWidth: '80px',
    fontSize: '10px',
    fontWeight: '600',
  },
  rowHover: {
    cursor: 'pointer',
    '&:hover': {
      /* backgroundColor: grey[500], */
      backgroundColor: (theme: Theme) =>
        theme.palette.mode === 'light'
          ? theme.palette.background.default
          : grey[700],
    },
  },
  textLink: {
    color: (theme: Theme) => theme.palette.text.primary,
  },
};

export default styles;
