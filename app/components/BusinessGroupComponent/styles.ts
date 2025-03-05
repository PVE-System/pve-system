import { Theme } from '@mui/material';
import { blueGrey, green, grey, orange, red } from '@mui/material/colors';

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
        ? blueGrey[100]
        : theme.palette.background.alternative,

    border: 'none',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    transition: 'transform 0.1s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },

    marginBottom: '20px',
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
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? blueGrey[100]
        : theme.palette.background.alternative,
    my: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
    width: '200px',

    transition: 'transform 0.1s ease',
    '&:hover': {
      transform: 'scale(1.10)',
    },

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

  buttonBack: {
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: 'darkGreen',
    },
  },
};

export default styles;
