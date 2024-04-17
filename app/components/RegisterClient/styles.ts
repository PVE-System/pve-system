import { orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  container: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    border: '3px solid #FF8C00', //ORANGE mais claro
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  boxContent: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: '20px',
    '@media (max-width: 800px)': {
      alignItems: 'center',
    },
  },
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
      borderBottom: '3px solid',
      borderColor: (theme: Theme) =>
        theme.palette.mode === 'light' ? '#000000' : '#ffffff',
    },
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
  boxCol2: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '70%',
    '@media (max-width: 800px)': {
      width: '100%',
    },
  },
  inputsCol2: {
    marginBottom: '10px',
    width: '100%',
  },
  registerButton: {
    background: (theme: Theme) => theme.palette.primary.main,
    marginTop: '20px',
    alignSelf: 'flex-end',
    '@media (max-width: 800px)': {
      alignSelf: 'center',
    },
  },
};

export default styles;
