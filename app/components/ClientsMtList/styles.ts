import { grey, orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  container: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    border: '3px solid #FF8C00', //ORANGE mais claro
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
};

export default styles;
