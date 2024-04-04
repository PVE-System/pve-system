import { orange } from '@mui/material/colors';

const styles = {
  containerMenu: {
    height: 150,
    width: 230,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    marginTop: 'auto',
  },

  logoMenu: {
    height: 150,
    width: 230,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    p: 2,
  },

  iconTheme: {
    display: 'flex',
    marginBottom: 1,
  },

  textMenu: {
    '& .MuiListItemText-root, & .MuiListItemIcon-root': {
      transition: 'color 0.3s', // Adicionando uma transição suave
    },
    '& .MuiListItem-root:hover .MuiListItemText-root, & .MuiListItem-root:hover .MuiListItemIcon-root':
      {
        color: orange[800], // Alterando a cor do texto quando o mouse está sobre o item da lista
      },
  },

  logoutIcon: {
    my: 1,
    color: orange[800],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dividerMenu: {
    orientation: 'vertical',
    dislplay: 'flexItem',
    backgroundColor: 'grey',
    width: 1,
    height: 0.001,
  },
};

export default styles;
