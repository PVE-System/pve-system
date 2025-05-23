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
import Menu from '@mui/material/Menu';
import TemporaryDrawer from '@/app/components/MenuNav/MenuNav';
import styles from '@/app/components/HeadApp/styles';
import { useRouter } from 'next/navigation';

export default function HeadApp() {
  const router = useRouter(); // Instanciando o useRouter
  const isSmallScreen = useMediaQuery('(max-width:600px)');
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
    setFilter(value);
    handleCloseMenu();
    // Lógica de redirecionamento para filtros específicos
    let route = '';
    switch (value) {
      case 'MS':
        route = '/clientsMsList';
        break;
      case 'MT':
        route = '/clientsMtList';
        break;
      case 'Outros estados':
        route = '/clientsOtherUfList';
        break;
      case 'CNPJ':
        route = '/clientsCNPJList';
        break;
      case 'CPF':
        route = '/clientsCPFList';
        break;
    }
    if (route) {
      router.push(route); // Usando router.push para redirecionar
    }
  };

  const handleSearch = () => {
    router.push(`/searchResults?query=${encodeURIComponent(filter)}`); // Usando router.push para busca
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={styles.headAppContainer}>
          <Box sx={styles.menuIcon}>
            <TemporaryDrawer />
          </Box>
          <TextField
            sx={styles.inputSearch}
            id="outlined-basic"
            label="Pesquisar"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch(); // Chama a função de busca ao pressionar Enter
              }
            }}
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
                      Outras UF
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
