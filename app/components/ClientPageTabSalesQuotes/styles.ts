import { Theme } from '@mui/material';

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
    flexDirection: 'column',
    gap: '20px',
    width: '70%',
    '@media (max-width: 800px)': {
      width: '100%',
    },
  },

  boxInputAndButtons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    gap: 5,
    flexWrap: 'wrap',
  },

  inputAndButtomColumnLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: '200px',
    maxWidth: '250px',
  },

  buttonQuotesAdd: {
    width: '100%',
    height: '40px',
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: 'darkgreen',
    },
  },

  inputAndButtomColumnRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: '200px',
    maxWidth: '250px',
  },

  buttonTotalResult: {
    width: '100%',
    height: '40px',
  },

  boxList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.alternative,
  },

  boxPagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10px',
    gap: '10px',
  },

  loadComponent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default styles;
