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

    // Tamanho da fonte tela Notebook
    '@media (max-width:1050px)': {
      fontSize: '30px',
    },
    // Tamanho da fonte tela Tablet
    '@media (max-width:800px)': {
      fontSize: '28px',
    },
    // Tamanho da fonte tela Mobile
    '@media (max-width:450px)': {
      fontSize: '26px',
    },
  },

  titleForm: {
    fontSize: '18px',

    '@media (max-width:1050px)': {
      fontSize: '18px',
    },

    '@media (max-width:800px)': {
      fontSize: '16px',
    },

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
    // Tamanho da fonte tela desktop
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
      color: orange[800],
      fontSize: '20px',
      '@media (max-width:1050px)': {
        fontSize: '18px',
      },
      // Tamanho da fonte tela Tablet
      '@media (max-width:800px)': {
        fontSize: '16px',
      },
      // Tamanho da fonte tela Mobile
      '@media (max-width:450px)': {
        fontSize: '14px',
      },
    },
  },
};

export default sharedStyles;
