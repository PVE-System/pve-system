import { Theme } from '@mui/material';
import { orange } from '@mui/material/colors';

const styles = {
  //Styles Cards Col 1
  cardsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  cardsBoxCol1: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '30px',

    '@media (max-width: 1000px)': {
      marginRight: '0', // Removendo margem
    },
    '@media (max-width: 425px)': {
      width: '80%',
    },
  },
  cards: {
    background: (theme: Theme) => theme.palette.background.alternative,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    border: '1px solid white',
    width: '280px',
    marginBottom: '20px',
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  /*   cardsContent: {
    border: '1px solid white',
    width: '280px',
    '@media (max-width: 600px)': {
      width: '100%',
    },
  }, */
  cardsText: {
    color: 'white',
    textAlign: 'center',
    span: {
      color: orange[800],
    },
  },

  //Styles accordion
  accordionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '600px',
    overflowY: 'hidden',
    '@media (max-width: 1000px)': {
      width: '100%',
    },
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },
  accordionBg: {
    background: (theme: Theme) => theme.palette.background.alternative,
  },
  accordionText: {
    span: {
      color: orange[800],
    },
  },
  ratingStars: {
    marginRight: '10px',
  },
};

export default styles;
