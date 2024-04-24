import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  /*   container: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    border: '3px solid #FF8C00', //ORANGE mais claro
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    '& .mui-19kzrtu': {
      padding: '0px',
    },
  }, */

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
    marginTop: '20px',
    '@media (max-width: 800px)': {
      alignSelf: 'center',
    },
  },

  editButton: {
    background: (theme: Theme) => theme.palette.primary.main,
    marginTop: '20px',
    backgroundColor: 'green',
    '@media (max-width: 800px)': {
      alignSelf: 'center',
    },
  },
};

export default styles;
