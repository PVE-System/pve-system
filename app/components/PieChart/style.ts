import { orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  cardPieChart: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.primary
        : theme.palette.text.primary,

    marginBottom: '20px',
    borderRadius: 4,

    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.1s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },

    height: '375px',
    '@media (max-width: 600px)': {
      height: 'auto',
    },
  },
};

export default styles;
