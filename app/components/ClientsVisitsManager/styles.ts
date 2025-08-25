import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    padding: '20px',
    '@media (max-width: 800px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  card: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.alternative,
    height: '150px',
    width: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',

    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    },
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    /* justifyContent: 'center', */
  },

  cardTitle: {
    fontWeight: 500,
    fontSize: '16px',
    /* marginBottom: 2, */
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.primary
        : theme.palette.text.primary,
  },

  cardIcon: {
    fontSize: '32px',
    marginBottom: 2,
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.primary.main,
  },
};

export default styles;
