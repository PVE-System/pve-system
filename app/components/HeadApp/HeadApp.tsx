'use client';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import FilterListIcon from '@mui/icons-material/FilterList';
import useMediaQuery from '@mui/material/useMediaQuery';
import TemporaryDrawer from '@/app/components/MenuNav/MenuNav';
import Menu from '@mui/material/Menu';

import styles from '@/app/components/HeadApp/styles';

export default function HeadApp() {
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  /*Start Funcionalidade provisoria para o filtro de busca*/
  const [filter, setFilter] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleFilterChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFilter(event.target.value);
  };

  const handleFilterIconClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget as HTMLButtonElement);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleMenuItemClick = (value: string) => {
    console.log('Item clicado:', value);
    setFilter(value);
    handleCloseMenu();
  };
  /*End Funcionalidade provisoria para o filtro de busca*/

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={styles.headAppContainer}>
          <Box
            sx={styles.menuIcon} /* sx={{
              position: 'absolute',
              left: isSmallScreen ? 0 : 20,
            }} */
          >
            <TemporaryDrawer />
          </Box>
          <TextField
            sx={styles.inputSearch}
            id="outlined-basic"
            label="Pesquisar"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="filter"
                    onClick={handleFilterIconClick}
                  >
                    <FilterListIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={() => handleMenuItemClick('MS')}>
                      MS
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick('MT')}>
                      MT
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleMenuItemClick('Outros estados')}
                    >
                      Outros estados
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleMenuItemClick('Cliente especial')}
                    >
                      Cliente especial
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick('CNPJ')}>
                      CNPJ
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick('CPF')}>
                      CPF
                    </MenuItem>
                  </Menu>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Container>
    </React.Fragment>
  );
}
