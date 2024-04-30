import { orange } from '@mui/material/colors';

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
    fontSize: '32px',
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

  subtitleSize: {
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
};

export default sharedStyles;
