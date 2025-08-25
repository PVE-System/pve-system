import { Theme } from '@mui/material/styles/createTheme';
import { orange } from '@mui/material/colors';

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  backButton: {
    alignSelf: 'flex-start',
    mb: 2,
  },

  card: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.alternative,
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    width: '100%',
    maxWidth: '600px',
  },

  cardContent: {
    padding: '24px',
  },

  routeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 3,
  },

  routeTitle: {
    fontWeight: 600,
    fontSize: '24px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.primary
        : theme.palette.text.primary,
    '@media (max-width: 600px)': {
      fontSize: '18px',
    },
  },

  routeName: {
    fontSize: '18px',
    fontWeight: 500,
    color: orange[800],
    mb: 1,
    '@media (max-width: 600px)': {
      fontSize: '16px',
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
    mb: 3,
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
    maxHeight: '400px',
    overflow: 'auto',
  },

  clientItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
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
    fontSize: '14px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.secondary
        : theme.palette.text.secondary,
    '@media (max-width: 600px)': {
      fontSize: '12px',
    },
  },

  statusChip: {
    fontSize: '10px',
    height: '20px',
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },

  noRouteContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    flexDirection: 'column',
    gap: 2,
  },
};

export default styles;
