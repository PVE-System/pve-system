import { grey, orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  boxProfile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? grey[300]
        : theme.palette.background.alternative,

    border: '2px solid',
    borderColor: orange[700],
    borderRadius: '10px',
    padding: '20px',
    width: '300px',
    height: '600px',

    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',

    '@media (max-width: 800px)': {
      width: '200px',
      height: '550px',
      border: 'none',
      borderRadius: '0px',
      /* borderBottom: '1px solid', */
      background: (theme: Theme) =>
        theme.palette.mode === 'light'
          ? theme.palette.background.paper
          : theme.palette.background.alternative,
    },
  },

  companyName: {
    marginBottom: '16px',
    textAlign: 'center',
    fontSize: '20px',
    '@media (max-width: 800px)': {
      fontSize: '16px',
    },
  },

  imgProfile: {
    borderRadius: '50%',
    cursor: 'pointer',
    marginBottom: '16px',
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
    fontWeight: '600',
    '@media (max-width: 1050px)': {
      fontSize: '10px',
    },
  },
};

export default styles;
