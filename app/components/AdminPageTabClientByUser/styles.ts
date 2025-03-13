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
};

export default styles;
