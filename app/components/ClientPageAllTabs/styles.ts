import { orange } from '@mui/material/colors';
import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  containerTabs: {
    paddingLeft: '0px',
    paddingRight: '0px',

    /*     '& .mui-heg063-MuiTabs-flexContainer': {
      justifyContent: 'center',
    }, */
  },

  boxTabs: {
    borderBottom: 1,
    borderColor: 'divider',
    display: 'flex',
    justifyContent: 'center',

    '@media (max-width: 800px)': {
      paddingLeft: '0px',
      paddingRight: '0px',
    },
  },

  contentTabs: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    border: '3px solid',
    borderColor: (theme: Theme) =>
      theme.palette.mode === 'light' ? orange[500] : orange[800],
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    '& .mui-19kzrtu': {
      padding: '0px',
    },
  },
  notificationIcon: {
    display: 'block',
  },
};

export default styles;
