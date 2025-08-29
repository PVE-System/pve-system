import { grey, orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  container: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },

  fontSize: {
    fontSize: '14px',
    '@media (max-width: 450px)': {
      fontSize: '12px',
      hover: 'none',
    },
  },

  rowHover: {
    cursor: 'pointer',
    '&:hover': {
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
