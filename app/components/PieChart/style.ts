import { blueGrey, orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  cardPieChart: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? blueGrey[100]
        : theme.palette.background.alternative,
    /*       theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative, */
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

    /* Efeito de reflexo no Gráfico*/
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-150%',
      width: '120%',
      height: '100%',
      background: (theme: Theme) =>
        theme.palette.mode === 'light'
          ? 'linear-gradient(120deg, transparent 0%, rgba(0, 0, 0, 0.2) 50%, transparent 90%)'
          : 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%)',
      transform: 'skewX(-10deg)',
      transition: 'transform 1.0s ease, left 1.0s ease',
    },
    '&:hover::after': {
      left: '-10%',
    },
  },
};

export default styles;
