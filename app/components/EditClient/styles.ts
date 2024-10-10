import { orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  /*   container: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    border: '3px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? orange[500] : orange[800], //ORANGE mais claro
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  }, */

  containerTabs: {
    paddingLeft: '0px',
    paddingRight: '0px',

    /*     '& .mui-heg063-MuiTabs-flexContainer': {
      justifyContent: 'center',
    }, */
  },

  boxTabs: {
    borderBottom: 1,
    borderColor: 'divider',
    display: 'flex',
    justifyContent: 'center',

    '@media (max-width: 800px)': {
      paddingLeft: '0px',
      paddingRight: '0px',
    },
  },

  contentTabs: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.alternative,

    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    borderRadius: '16px',

    /* borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? orange[500] : orange[800], */

    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    '& .mui-19kzrtu': {
      padding: '0px',
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
        alignSelf: 'center',
      },
    },
  },

  deleteButton: {
    marginTop: '20px',
    backgroundColor: 'red',
    '&:hover': {
      backgroundColor: 'darkred',
      '@media (max-width: 800px)': {
        alignSelf: 'center',
      },
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
