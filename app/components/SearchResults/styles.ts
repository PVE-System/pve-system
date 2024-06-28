import { grey, orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  container: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    border: '3px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? orange[500] : orange[800],
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },

  boxContent: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: '20px',
    '@media (max-width: 800px)': {
      alignItems: 'center',
    },
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
  },

  rowHover: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: grey[500],
    },
  },
  textLink: {
    color: (theme: Theme) => theme.palette.text.primary,
  },
  cards: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.alternative
        : theme.palette.background.alternative,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    border: '2px solid',
    borderColor: orange[800],
    width: '280px',
    height: '100px',
    cursor: 'pointer',
    '&:hover': {
      color: orange[800],
    },
    marginBottom: '33px',
    '@media (max-width: 600px)': {
      width: '100%',
      height: 'auto',
    },
  },
};

export default styles;
