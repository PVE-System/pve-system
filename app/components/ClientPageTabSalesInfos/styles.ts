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
