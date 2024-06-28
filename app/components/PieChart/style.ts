import { orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  cardPieChart: {
    background: '#2A2E30',
    color: '#ffffff',
    marginBottom: '20px',
    borderRadius: 4,
    border: '3px solid',
    borderColor: orange[800],
    height: '370px',
    '@media (max-width: 600px)': {
      height: 'auto',
    },
  },
};

export default styles;
