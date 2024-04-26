import { grey, orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  container: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    border: '3px solid #FF8C00', //ORANGE mais claro
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },

  boxContent: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: '20px',
    '@media (max-width: 800px)': {
      alignItems: 'center',
    },
  },

  highlightedRow: {
    backgroundColor: grey[500] /* Altere a cor de fundo conforme necessário */,
    cursor: 'pointer',
  },
};
export default styles;
