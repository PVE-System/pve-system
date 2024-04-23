import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  boxCol1: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? '#000000' : '#ffffff',
    border: '1px solid',
    borderRadius: '10px',
    padding: '20px',
    width: '30%',
    height: '500px',
    '@media (max-width: 800px)': {
      width: '100%',
      height: '450px',
      border: 'none',
      borderRadius: '0px',
      borderBottom: '1px solid',
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'light' ? '#000000' : '#ffffff',
    },
  },

  imgProfile: {
    borderRadius: '50%',
    cursor: 'pointer',
    marginBottom: '50px',
  },

  statusRating: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  rating: {
    color: '#FFA500',
    fontSize: '32px',
    '@media (max-width: 800px)': {
      fontSize: '24px',
    },
  },

  clientCondition: {
    width: '100%',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  clientConditionButtonBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: '5px',
    marginBottom: '20px',
    width: '100%',
    '@media (max-width: 800px)': {
      width: '80%',
    },
  },

  clientConditionButton: {
    fontSize: '12px',
    '@media (max-width: 1050px)': {
      fontSize: '10px',
    },
  },
};

export default styles;
