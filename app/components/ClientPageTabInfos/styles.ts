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

  /*   boxCol1: {
    justifyContent: 'center',
    alignItens: 'center',
    gap: '20px',
    width: '30%',
    '@media (max-width: 800px)': {
      width: '100%',
    },
  }, */

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

  /*   deleteButton: {
    marginTop: '20px',
    backgroundColor: 'red',
    '&:hover': {
      backgroundColor: 'darkred',
      '@media (max-width: 800px)': {
        alignSelf: 'center',
      },
    },
  }, */

  editButton: {
    marginTop: '20px',
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: 'darkgreen',
      '@media (max-width: 800px)': {
        alignSelf: 'center',
      },
    },
  },
};

export default styles;
