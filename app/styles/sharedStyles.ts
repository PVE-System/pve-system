import { orange, red } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const sharedStyles = {
  container: {
    my: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    /* background: 'grey', */
    '@media (max-width: 600px)': {
      width: '100%',
    },
  },

  titlePage: {
    fontFamily: `'Raleway', sans-serif`,
    fontSize: '32px',
    fontWeight: '600',
    margin: '8px',
    textAlign: 'center',
    '& span': {
      color: orange[800],
    },

    // FontSize Notebook
    '@media (max-width:1050px)': {
      fontSize: '30px',
    },
    // FontSize Tablet
    '@media (max-width:800px)': {
      fontSize: '28px',
    },
    // FontSize Mobile
    '@media (max-width:450px)': {
      fontSize: '26px',
    },
  },

  subtitleSize: {
    fontFamily: `'Montserrat', sans-serif`,
    textAlign: 'center',

    // FontSize Desktop
    fontSize: '18px',
    // FontSize Notebook
    '@media (max-width:1050px)': {
      fontSize: '16px',
    },
    // FontSize Tablet
    '@media (max-width:800px)': {
      fontSize: '14px',
    },
    // FontSize Mobile
    '@media (max-width:450px)': {
      fontSize: '12px',
    },
    span: {
      color: orange[800],
      fontSize: '20px',
      '@media (max-width:1050px)': {
        fontSize: '18px',
      },
      // FontSize Tablet
      '@media (max-width:800px)': {
        fontSize: '16px',
      },
      // FontSize Mobile
      '@media (max-width:450px)': {
        fontSize: '14px',
      },
    },
  },

  subTitleFontFamily: {
    fontFamily: `'Montserrat', sans-serif`,
  },

  buttonFontFamily: {
    fontFamily: `'Open Sans', sans-serif`,
  },

  titleForm: {
    fontSize: '18px',
    // FontSize Notebook
    '@media (max-width:1050px)': {
      fontSize: '18px',
    },
    // FontSize Tablet
    '@media (max-width:800px)': {
      fontSize: '16px',
    },
    // FontSize Mobile
    '@media (max-width:450px)': {
      fontSize: '14px',
      '& .mui-1mxgcu1-MuiFormLabel-root-MuiInputLabel-root': {
        fontSize: '14px',
      },
      '& .mui-11lg7ig-MuiTypography-root': {
        fontSize: '14px',
      },
    },
  },
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    backgroundColor: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.default,
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
  },

  boxModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalAlert: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    padding: 3,
    borderRadius: 2,
    width: '400px',
    boxShadow: 24,
  },

  modalButton: {
    marginTop: 2,
    marginRight: 2,
  },
};

export default sharedStyles;
