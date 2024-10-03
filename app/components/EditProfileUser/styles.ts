const styles = {
  formBoxImg: {
    display: 'flex',
    flexDirection: 'center',
    justifyContent: 'center',
  },

  formButtonImg: {
    borderRadius: '50%',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },

  formSubTitle: {
    marginTop: '16px',
    textAlign: 'center',
    fontSize: '16px',

    '@media (max-width: 800px)': {
      fontSize: '14px',
    },
  },

  formBoxInput: {
    display: 'flex',
    flexDirection: 'column',
  },

  inputName: {
    width: '500px',
    /* width: '100%', */
    marginTop: '10px',
    '@media (max-width: 800px)': {
      width: '300px',
    },
  },

  formButtonSubmit: {
    width: '500px',
    /* width: '100%', */
    marginTop: '10px',
    /*  alignItens: 'center', */
    '@media (max-width: 800px)': {
      width: '300px',
    },
  },
};
export default styles;
