import { BorderColor } from '@mui/icons-material';
import { grey, orange } from '@mui/material/colors';

const sharedStyles = {
  container: {
    my: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'grey',
  },

  titlePage: {
    margin: '8px',
    textAlign: 'center',
    '& span': {
      color: orange[800],
    },
  },
};

export default sharedStyles;
