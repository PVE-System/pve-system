import { orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  cardPieChart: {
    background: (theme: Theme) => theme.palette.background.alternative,
    color: '#ffffff',
    marginBottom: '20px',
    borderRadius: 4,
    border: '3px solid',
    borderColor: orange[800],
  },
};

export default styles;
