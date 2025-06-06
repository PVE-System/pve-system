import { blueGrey, orange } from '@mui/material/colors';
import { Theme } from '@mui/material';

const styles = {
  BoxCardPaperRegister: {
    border: '2px solid #ccc',
    borderRadius: 2,
    p: 2,
    mb: 4,
    width: '100%',
    maxWidth: 600,
  },

  BoxCardPaperRegistered: {
    border: '2px solid #ccc',
    borderRadius: 2,
    p: 2,
    mb: 4,
    width: '100%',
    maxWidth: '600px',
    '@media (max-width:450px)': {
      border: 'none',
      minWidth: '300px',
    },
  },

  fontSizeInput: {
    '& .MuiInputLabel-root': { fontSize: '14px' },
    '& .MuiInputBase-input': { fontSize: '14px' },
  },

  buttonRegister: {
    padding: { xs: '4px 8px', sm: '4px 8px' },
    fontSize: { xs: '12px', sm: '14px' },
    minWidth: { xs: '80px', sm: '80px' },
  },

  cardPaperText: {
    fontSize: { xs: '12px', sm: '12px', md: '14px' },
  },
  spanText: {
    color: orange[800],
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
};

export default styles;
