import { orange, red } from '@mui/material/colors';

const styles = {
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
};

export default styles;
