import { blueGrey, orange } from '@mui/material/colors';
import { Theme } from '@mui/material';

const styles = {
  BoxCardPaper: {
    border: '2px solid #ccc',
    borderRadius: 2,
    p: 2,
    mb: 4,
    width: '100%',
    maxWidth: 600,
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
};

export default styles;
