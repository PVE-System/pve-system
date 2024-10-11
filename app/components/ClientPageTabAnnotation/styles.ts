import { green, red } from '@mui/material/colors';
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
  },

  boxButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2,
    '@media (max-width: 800px)': {
      justifyContent: 'center',
    },
  },

  postCommentsButton: {
    marginTop: '20px',
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: 'darkgreen',
      '@media (max-width: 800px)': {
        alignSelf: 'center',
      },
    },
  },

  boxComments: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.default,

    marginBottom: '16px',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },

  commentsContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },

  commentsData: {
    display: 'block',
    marginTop: '50px',
    fontWeight: 'bold',
  },

  commentsIcons: {
    width: 20,
    '&:hover': {
      color: red[600],
    },
  },

  loadComponent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default styles;
