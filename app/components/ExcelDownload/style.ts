import { Theme } from '@mui/material';
import { orange } from '@mui/material/colors';

const styles = {
  card: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '300px',
    borderRadius: 4,
    border: '3px solid',
    borderColor: '#FF8C00', //ORANGE mais claro

    '@media (max-width:450px)': {
      flexDirection: 'column',
      height: 'auto',
    },
  },

  cardContent: {
    width: '300px',
    margin: '80px',

    '@media (max-width:450px)': {
      width: '100%',
      margin: '0',
    },
  },

  icon: {
    width: '50px',
    height: '50px',
    color: 'white',
    transition: 'color 0.3s',
    cursor: 'pointer',
    '&:hover': {
      color: orange[800],
    },
  },
};

export default styles;