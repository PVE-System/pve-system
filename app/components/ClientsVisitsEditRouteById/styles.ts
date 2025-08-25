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
    fontSize: {
      xs: '10px',
      sm: '12px',
      md: '14px',
    },
  },
  fontSizeClientName: {
    fontSize: {
      xs: '10px',
      sm: '12px',
      md: '14px',
    },
    fontWeight: 500,
  },
  rowHover: {
    '&:hover': {
      backgroundColor: 'action.hover',
    },
  },
};

export default styles;
