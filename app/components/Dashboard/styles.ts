import { BorderColor } from '@mui/icons-material';
import { Theme } from '@mui/material';
import { orange } from '@mui/material/colors';

const styles = {
  cardsAndPiaChartContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    gap: 3,
    '@media (max-width: 800px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },

  /*Cards Start*/

  cardsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    minWidth: '200px',
  },

  cardsDashboard: {
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.default,

    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '12px',

    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.1s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  cardTitle: {
    fontWeight: 600,
    fontSize: '16px',
    '@media (max-width: 1000px)': {
      fontSize: '14px',
    },
    '@media (max-width: 425px)': {
      fontSize: '12px',
    },
  },

  cardNumber: {
    fontWeight: 'bold',
    /* color: '#fff', */
    fontSize: '24px',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.primary
        : theme.palette.text.primary,
  },

  cardButton: {
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.text.primary
        : theme.palette.text.primary,
    mt: 1,
    px: 3,
    py: 0.5,
    borderRadius: '20px',
    fontSize: '14px',
    textTransform: 'none',
  },

  //Styles accordion
  accordionContainer: {
    borderRadius: '15px',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflowY: 'hidden',
    width: '600px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    '@media (max-width: 800px)': {
      width: '400px',
    },
    '@media (max-width: 450px)': {
      width: '300px',
    },
  },
  accordionBg: {
    /* backgroundColor: '#001F3F', */

    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? '#dedfe1'
        : theme.palette.background.default,
    /*       theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.default, */
  },
  accordionTitle: {
    /* color: '#ffffff', */
    fontFamily: `'MontSerrat', sans-serif`,
    fontSize: '18px',
    // Tamanho da fonte tela Notebook
    '@media (max-width:1050px)': {
      fontSize: '16px',
    },
    // Tamanho da fonte tela Tablet
    '@media (max-width:800px)': {
      fontSize: '14px',
    },
    // Tamanho da fonte tela Mobile
    '@media (max-width:450px)': {
      fontSize: '12px',
    },

    span: {
      fontFamily: `'Open Sans', sans-serif`,
      fontWeight: 600,
      fontSize: '20px',
      color: orange[600],
      marginRight: '10px',
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
        fontSize: '18px',
      },
    },
  },

  accordionContentText: {
    fontSize: '16px',
    // Tamanho da fonte tela Notebook
    '@media (max-width:1050px)': {
      fontSize: '16px',
    },
    // Tamanho da fonte tela Tablet
    '@media (max-width:800px)': {
      fontSize: '14px',
    },
    // Tamanho da fonte tela Mobile
    '@media (max-width:450px)': {
      fontSize: '10px',
    },
  },

  accordionIconList: {
    marginLeft: 'auto',
    marginTop: 'auto',
    cursor: 'pointer',
    fontSize: '24px',
    transition: 'color 0.3s ease', // Para uma transição suave no hover
    '&:hover': {
      color: orange[800],
    },
  },

  ratingStars: {
    marginRight: '10px',
  },
  emptyIcon: {
    color: '#606060',
  },
  arrowIcon: {
    color: 'grey',
  },

  BoxFrequentOccurrencesTitle: {
    fontFamily: `'Montserrat', sans-serif`,
    textAlign: 'center',

    // FontSize Desktop
    fontSize: '22px',
    // FontSize Notebook
    '@media (max-width:1050px)': {
      fontSize: '20px',
    },
    // FontSize Tablet
    '@media (max-width:800px)': {
      fontSize: '14px',
    },
    // FontSize Mobile
    '@media (max-width:450px)': {
      fontSize: '14px',
    },
    span: {
      color: orange[800],
    },
  },

  BoxFrequentOccurrences: {
    border: '2px solid #ccc',
    borderRadius: 2,
    p: 2,
    mb: 4,
    width: '100%',
    maxWidth: '600px',
    '@media (max-width:450px)': {
      border: 'none',
      minWidth: '300px',
      mt: -2,
    },
  },
};

export default styles;
