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
      marginRight: '0', // Remove margin
    },
    '@media (max-width: 425px)': {
      width: '80%',
    },
  },
  cards: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.default,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    border: '2px solid',
    borderColor: orange[800],
    width: '280px',
    cursor: 'pointer',
    '&:hover': {
      color: orange[800],
    },
    marginBottom: '40px',
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
    textAlign: 'center',
    span: {
      color: orange[800],
      fontSize: '22px',
      '@media (max-width:1050px)': {
        fontSize: '20px',
      },
      // Tamanho da fonte tela Tablet
      '@media (max-width:800px)': {
        fontSize: '18px',
      },
      // Tamanho da fonte tela Mobile
      '@media (max-width:450px)': {
        fontSize: '16px',
      },
    },
  },

  //Styles accordion
  accordionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflowY: 'hidden',
    width: '600px',
    '@media (max-width: 800px)': {
      width: '400px',
    },
    '@media (max-width: 450px)': {
      width: '300px',
    },
  },
  accordionBg: {
    backgroundColor: '#001F3F',
  },
  accordionText: {
    color: '#ffffff',
    span: {
      color: orange[800],
      marginRight: '10px',
      fontSize: '20px',
      // Tamanho da fonte tela Notebook
      '@media (max-width:1050px)': {
        fontSize: '20px',
      },
      // Tamanho da fonte tela Tablet
      '@media (max-width:800px)': {
        fontSize: '18px',
      },
      // Tamanho da fonte tela Mobile
      '@media (max-width:450px)': {
        fontSize: '16px',
      },
    },
  },
  ratingStars: {
    marginRight: '10px',
  },
  emptyIcon: {
    color: '#606060',
  },
  arrowIcon: {
    color: '#ffffff',
  },
};

export default styles;
