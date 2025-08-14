import { orange } from '@mui/material/colors';

const styles = {
  iconCloseMenu: {
    mt: 2,
    ml: 2,
    display: 'none',
    '@media (max-width:450px)': {
      display: 'block',
    },
  },

  iconCloseMenuColor: {
    color: orange[800],
  },

  containerMenu: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Garante que o conteúdo ocupe toda a altura do Drawer
    alignItems: 'flex', // Centraliza na horizontal se for mobile, senão alinha à esquerda
    justifyContent: 'flex', // Centraliza na vertical se for mobile, senão alinha ao topo

    '@media (max-width:450px)': {
      alignItems: 'center',
      justifyContent: 'center',
    },
  },

  logoMenu: {
    height: 150,
    width: 230,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contentMenu: {
    height: 150,
    width: 230,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    marginTop: 'auto',
  },

  textMenu: {
    '& .MuiListItemButton-root': {
      padding: '4px 16px',
    },
    '& .MuiListItemText-root .MuiTypography-root': {
      fontSize: '14px',
    },
    '& .MuiListItemText-root, & .MuiListItemIcon-root': {
      transition: 'color 0.3s', // Adicionando uma transição suave
    },
    '& .MuiListItem-root:hover .MuiListItemText-root, & .MuiListItem-root:hover .MuiListItemIcon-root':
      {
        color: orange[800], // Alterando a cor do texto quando o mouse está sobre o item da lista
      },
  },

  dividerMenu: {
    backgroundColor: 'grey',
    width: 1,
    height: 0.001,
  },

  iconTheme: {
    display: 'flex',
    marginBottom: 1,
  },

  iconLogout: {
    my: 3,
    color: orange[800],
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default styles;
