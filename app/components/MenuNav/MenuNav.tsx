'use client';

import * as React from 'react';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { IconButton, Link, Typography } from '@mui/material';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useTheme } from '@/app/theme/ThemeContext';
import styles from '@/app/components/MenuNav/styles';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ArticleIcon from '@mui/icons-material/Article';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessIcon from '@mui/icons-material/Business';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

import { useMediaQuery } from '@mui/material';
import { useAuth } from '@/app/contex/authContext';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { logout } = useAuth();

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    toggleTheme(); // Chame toggleTheme depois de salvar o tema no localStorage
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // Defina os ícones de tema com base no tema atual
  const themeIcon =
    theme === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />;

  const DrawerList = (
    <div role="presentation" onClick={toggleDrawer(false)}>
      <List sx={styles.textMenu}>
        {[
          { name: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
          {
            name: 'Clientes MS',
            icon: <LocationCityIcon />,
            link: '/clientsMsList',
          },
          {
            name: 'Clientes MT',
            icon: <ApartmentIcon />,
            link: '/clientsMtList',
          },
          {
            name: 'Outras UF',
            icon: <BusinessIcon />,
            link: '/clientsOtherUfList',
          },
          {
            name: 'Cadastrar Cliente',
            icon: <AddBusinessIcon />,
            link: '/registerClient',
          },
        ].map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton component="a" href={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={styles.dividerMenu} />
      <List sx={styles.textMenu}>
        {[
          {
            name: 'Planilha Excel',
            icon: <ArticleIcon />,
            link: '/excelDownloadFile',
          },
          {
            name: 'Cadastrar Equipe',
            icon: <GroupAddIcon />,
            link: '/registerTeam',
          },
          {
            name: 'Editar Perfil',
            icon: <ManageAccountsIcon />,
            link: '/editProfile',
          },
          // Adicione mais itens conforme necessário
        ].map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton component="a" href={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box>
      <Button onClick={toggleDrawer(true)}>
        <MenuOpenIcon />
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor={isMobile ? 'top' : 'left'}
      >
        {/* Ícone de fechar o menu */}
        <Box sx={styles.iconCloseMenu}>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon sx={styles.iconCloseMenuColor} />
          </IconButton>
        </Box>
        <Box sx={styles.containerMenu}>
          <Box sx={styles.logoMenu}>
            <Image
              src="/logoPveMenu.png"
              alt="Foto do usuário"
              width={120}
              height={120}
            />
          </Box>
          {DrawerList}
          {/* Ícone que troca o tema */}
          <Box sx={styles.contentMenu}>
            <IconButton
              sx={styles.iconTheme}
              onClick={handleToggleTheme} //função alternar o tema
              color="inherit"
            >
              {themeIcon}
            </IconButton>
            <Divider sx={styles.dividerMenu} />
            <Image
              src="/profile-placeholder.png"
              alt="Foto do usuário"
              width={80}
              height={80}
            />
            <Typography variant="subtitle2" component="h1">
              Nome do Usuário
            </Typography>
          </Box>
          <Box sx={styles.iconLogout}>
            <Link onClick={logout}>
              <IconButton>
                <LogoutIcon />
              </IconButton>
            </Link>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
/* function redirectTo(arg0: string) {
  throw new Error('Function not implemented.');
}
 */
