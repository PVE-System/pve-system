const styles = {
  headAppContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 3,
  },
  menuIcon: {
    position: 'absolute',
    left: '20px',
    '@media (max-width:450px)': {
      left: '0px',
    },
  },
  inputSearch: {
    /* margin: 'auto', */

    width: {
      sm: '350px',
      md: '500px',
    },
    '@media (max-width:450px)': {
      width: '80%',
      left: '20px',
    },
  },
};

export default styles;
