import { Theme } from '@mui/material';
import { orange, red } from '@mui/material/colors';

const styles = {
  card: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.default
        : theme.palette.background.default,
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '300px',
    /*     borderRadius: 4,
    border: '3px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? orange[500] : orange[800], */

    '@media (max-width:450px)': {
      flexDirection: 'column',
      height: 'auto',
    },
  },

  boxCircularProgress: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50px',
  },

  cardContent: {
    width: '300px',
    margin: '80px',

    '@media (max-width:450px)': {
      width: '100%',
      margin: '0',
    },
  },

  fileList: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.alternative
        : theme.palette.background.alternative,

    /*     justifyContent: 'center',
    alignItens: 'center', */
    border: 'none',
    marginBottom: '10px',
    width: '100%',

    '@media (max-width:450px)': {
      flexDirection: 'column',
      height: 'auto',
    },
  },

  contentFileList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
  },

  textFileList: {
    // FontSize Desktop
    fontSize: '16px',
    // FontSize Notebook
    '@media (max-width:1050px)': {
      fontSize: '14px',
    },
    // FontSize Tablet
    '@media (max-width:800px)': {
      fontSize: '12px',
    },
    // FontSize Mobile
    '@media (max-width:450px)': {
      fontSize: '10px',
    },
    span: {
      color: orange[800],
      fontSize: '18px',
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
    },
  },

  boxUploadIcon: {
    my: 4,
    display: 'flex',
    /*  flexDirection: 'column', */
    justifyContent: 'center',
    alignItems: 'center',
    /* background: 'grey', */

    '@media (max-width: 600px)': {
      width: '100%',
    },
  },

  iconUpload: {
    width: '25px',
    height: '25px',
    transition: 'color 0.3s',
    cursor: 'pointer',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : theme.palette.secondary.main,
    '&:hover': {
      color: orange[800],
    },
    '@media (max-width:450px)': {
      width: '30px',
      height: '30px',
    },
  },
  iconDownload: {
    cursor: 'pointer',
    alignSelf: 'center',
    width: '25px',
    height: '25px',
    transition: 'color 0.3s',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : theme.palette.secondary.main,
    '&:hover': {
      color: orange[800],
    },
    '@media (max-width:450px)': {
      width: '20px',
      height: '20px',
    },
  },

  iconDelete: {
    cursor: 'pointer',
    alignSelf: 'center',
    width: '25px',
    height: '25px',
    transition: 'color 0.3s',
    color: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : theme.palette.secondary.main,
    '&:hover': {
      color: red[600],
    },
    '@media (max-width:450px)': {
      width: '20px',
      height: '20px',
    },
  },
};

export default styles;
