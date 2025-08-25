import { Theme } from '@mui/material/styles/createTheme';

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

  formSection: {
    mb: 3,
  },

  sectionTitle: {
    fontWeight: 600,
    fontSize: '18px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.primary
        : theme.palette.text.primary,
    mb: 1,
    '@media (max-width: 600px)': {
      fontSize: '14px',
    },
  },

  formRow: {
    display: 'flex',
    gap: 2,
    mb: 2,
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  formField: {
    flex: 1,
    minWidth: '200px',
  },

  clientInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    border: '1px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? 'rgba(0, 0, 0, 0.23)'
        : 'rgba(255, 255, 255, 0.23)',
    borderRadius: '4px',
    padding: '16.5px 14px',
    minHeight: '40px',
    '&:hover': {
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'light'
          ? 'rgba(0, 0, 0, 0.87)'
          : 'rgba(255, 255, 255, 0.87)',
    },
  },

  clientInfo: {
    flex: 1,
    minWidth: '200px',
  },

  actionsContainer: {
    display: 'flex',
    gap: 2,
    justifyContent: 'center',
    mt: 3,
  },

  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  },

  noVisitContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    flexDirection: 'column',
    gap: 2,
  },
};

export default styles;
