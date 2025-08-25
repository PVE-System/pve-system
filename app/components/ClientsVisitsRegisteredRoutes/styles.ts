import { Theme } from '@mui/material/styles/createTheme';
import { orange } from '@mui/material/colors';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  filtersContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    mb: 3,
    flexWrap: 'wrap',
  },

  inputContainer: {
    minWidth: 150,
  },

  card: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.alternative,
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',

    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    },
  },

  cardContent: {
    padding: '16px',
  },

  routeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 2,
  },

  routeTitle: {
    fontWeight: 600,
    fontSize: '18px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.primary
        : theme.palette.text.primary,
  },

  routeName: {
    fontSize: '16px',
    fontWeight: 500,
    color: orange[800],
    mb: 1,
    '@media (max-width: 600px)': {
      fontSize: '14px',
    },
  },

  routeDate: {
    fontSize: '14px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },

  routeUserName: {
    fontSize: '14px',
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },

  routeDescription: {
    fontSize: '14px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
    mb: 1,
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },

  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    mb: 2,
  },

  statsRow: {
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
  },

  chip: {
    fontSize: '12px',
    minWidth: '100px',
    height: '24px',
  },

  clientsList: {
    maxHeight: '200px',
    overflow: 'auto',
  },

  clientItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.divider
        : theme.palette.divider,
  },

  clientName: {
    fontSize: '14px',
    fontWeight: 500,
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },

  clientLocation: {
    fontSize: '12px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
  },

  statusChip: {
    fontSize: '10px',
    height: '20px',
  },

  actionsContainer: {
    display: 'flex',
    gap: 1,
    justifyContent: 'flex-end',
    mt: 2,
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },

  noRoutesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    flexDirection: 'column',
    gap: 2,
  },
};

export default styles;
