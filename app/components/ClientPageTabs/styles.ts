import { Theme } from '@mui/material/styles/createTheme';

const styles = {
  containerTabs: {
    paddingLeft: '0px',
    paddingRight: '0px',
    '& .mui-heg063-MuiTabs-flexContainer': {
      justifyContent: 'center',
    },
  },

  boxTabs: {
    borderBottom: 1,
    borderColor: 'divider',
    '@media (max-width: 800px)': {
      paddingLeft: '0px',
      paddingRight: '0px',
    },
  },

  sizeTabs: {
    justifyContent: 'flex-start',
    '& .MuiTab-root': {
      minWidth: '100px',
    },
    '@media (max-width: 800px)': {
      justifyContent: 'center',
      '& .MuiTab-root': {
        minWidth: 'auto',
      },
    },
  },

  contentTabs: {
    background: (theme: Theme) =>
      theme.palette.mode === 'light'
        ? theme.palette.background.paper
        : theme.palette.background.alternative,

    border: '3px solid #FF8C00', //ORANGE mais claro
    borderRadius: '10px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    '& .mui-19kzrtu': {
      padding: '0px',
    },
  },
};

export default styles;
