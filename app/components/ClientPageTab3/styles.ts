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
    justifyContent: 'flex-end',
    gap: 2,
    '@media (max-width: 800px)': {
      justifyContent: 'center',
    },
  },

  deleteButton: {
    background: (theme: Theme) => theme.palette.primary.main,
    backgroundColor: 'red',
    width: '80px',
    marginTop: '20px',
    '@media (max-width: 800px)': {
      alignSelf: 'center',
    },
  },

  editButton: {
    background: (theme: Theme) => theme.palette.primary.main,
    backgroundColor: 'green',
    width: '80px',
    marginTop: '20px',
    '@media (max-width: 800px)': {
      alignSelf: 'center',
    },
  },
};

export default styles;
