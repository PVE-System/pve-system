import { grey, orange, red } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  container: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',

    /*     border: '3px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? orange[500] : orange[800], */
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },

  fontSize: {
    fontSize: '14px',
    mb: 1,

    '@media (max-width: 450px)': {
      fontSize: '12px',
      hover: 'none',
    },
  },
};

export default styles;
