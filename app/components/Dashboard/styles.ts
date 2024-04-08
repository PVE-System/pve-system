import { orange } from '@mui/material/colors';

const styles = {
  cardsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  cardsBoxCol1: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '30px',
    /* alignItems: 'center', */
    /* width: '280px', */
    '@media (max-width: 1000px)': {
      marginRight: '0', // Removendo margem direita
      // Definindo a largura como 100% para ocupar toda a largura da tela
    },
    '@media (max-width: 600px)': {
      width: '100%', // Definindo a largura como 100% para ocupar toda a largura da tela
    },
  },
  cards: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width: '280px',
    backgroundColor: 'transparent',
    marginBottom: '20px',
    '@media (max-width: 600px)': {
      // Estilos para telas menores que 600px
      width: '100%', // Definindo a largura como 100% para ocupar toda a largura da tela
    },
  },
  cardsContent: {
    backgroundColor: 'transparent',
    border: '1px solid white',
    width: '280px',
    '@media (max-width: 600px)': {
      // Estilos para telas menores que 600px
      width: '100%', // Definindo a largura como 100% para ocupar toda a largura da tela
    },
  },
  cardsText: {
    textAlign: 'center',
    span: {
      color: orange[800],
    },
  },
  cardGraphicContainer: {
    width: '300px',
    height: '300px',
    '@media (max-width: 1000px)': {
      marginBottom: '20px',
    },
    '@media (max-width: 600px)': {
      // Estilos para telas menores que 600px
      width: '100%', // Definindo a largura como 100% para ocupar toda a largura da tela
    },
  },
  cardGraphic: {
    borderRadius: 4,
  },

  CardGraphicContent: {
    backgroundColor: '#2A2E30',
    border: '1px solid white',
    width: '300px',
    height: '300px',
    '@media (max-width: 600px)': {
      // Estilos para telas menores que 600px
      width: '100%', // Definindo a largura como 100% para ocupar toda a largura da tela
    },
  },

  accordionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '600px',
    overflowY: 'hidden',
    '@media (max-width: 1000px)': {
      // Estilos para telas menores que 600px
      width: '100%', // Definindo a largura como 100% para ocupar toda a largura da tela
    },
    '@media (max-width: 600px)': {
      // Estilos para telas menores que 600px
      width: '100%', // Definindo a largura como 100% para ocupar toda a largura da tela
    },
  },

  accordionText: {
    span: {
      color: orange[800],
    },
  },
};

export default styles;
