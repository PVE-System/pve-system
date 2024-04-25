import { orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  boxContent: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: '20px',

    '@media (max-width: 800px)': {
      alignItems: 'center',
    },
  },

  boxCol2: {
    display: 'flex',
    justifyContent: 'center',
    /* alignItens: 'center', */
    gap: '80px',
    width: '70%',
    '@media (max-width: 800px)': {
      flexDirection: 'column',
      textAlign: 'center',
      width: '100%',
    },
  },

  boxIcon: {
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
  },

  icon: {
    cursor: 'pointer',
    alignSelf: 'center',
    width: '50px',
    height: '50px',
    transition: 'color 0.3s',
    '&:hover': {
      color: orange[800],
    },
  },
};
export default styles;
