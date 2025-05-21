import { blueGrey, orange } from '@mui/material/colors';
import { Theme } from '@mui/material';

const styles = {
  /*   BoxCardPaper: {
    border: '1px solid #ccc',
    borderRadius: 2,
    p: 2,
    mb: 4,
    width: '100%',
    maxWidth: 600,
  }, */

  cardPaper: {
    padding: 2,
    marginBottom: 4,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.1s ease',

    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? blueGrey[100]
        : theme.palette.background.alternative,
  },

  cardPaperText: {
    fontSize: { xs: '12px', sm: '12px', md: '14px' },
  },
  spanText: {
    color: orange[800],
  },
};

export default styles;
