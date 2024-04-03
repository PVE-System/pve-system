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
import DashboardIcon from '@mui/icons-material/Dashboard';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { IconButton, Typography } from '@mui/material';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useTheme } from '@/app/theme/ThemeContext';
import styles from '@/app/components/MenuNav/styles';

import LocationCityIcon from '@mui/icons-material/LocationCity';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import ArticleIcon from '@mui/icons-material/Article';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessIcon from '@mui/icons-material/Business';

// Hook navigation

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <div role="presentation" onClick={toggleDrawer(false)}>
      <List sx={styles.textMenu}>
        {[
          { name: 'Dashboard', icon: <DashboardIcon />, link: '/dashboard' },
          { name: 'Clientes MS', icon: <LocationCityIcon />, link: '/' },
          {
            name: 'Clientes MT',
            icon: <ApartmentIcon />,
            link: '/dashboard',
          },
          { name: 'Clientes BR', icon: <BusinessIcon />, link: '/' },
          {
            name: 'Cadastrar Cliente',
            icon: <AddBusinessIcon />,
            link: '/dashboard',
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
      <Divider />
      <List sx={styles.textMenu}>
        {[
          { name: 'Planilha Excel', icon: <ArticleIcon />, link: '/' },
          {
            name: 'Cadastrar Equipe',
            icon: <GroupAddIcon />,
            link: '/',
          },
          { name: 'Editar Perfil', icon: <ManageAccountsIcon />, link: '/' },
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
    <div>
      <Button sx={{ marginLeft: 0 }} onClick={toggleDrawer(true)}>
        <MenuOpenIcon />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column', // Adiciona flex direction column
            height: '100%', // Garante que o Drawer ocupe toda a altura
          }}
        >
          <Box
            height={150}
            width={230}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={4}
            p={2}
            /* sx={{ border: '2px solid grey' }} */
          >
            <Image
              src="/logoPveMenu.png"
              alt="Foto do usuário"
              width={120}
              height={120}
            />
          </Box>
          {DrawerList}
          <Box
            height={150}
            width={230}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={1}
            sx={{ /* border: '2px solid grey',  */ marginTop: 'auto' }}
          >
            <IconButton
              sx={styles.iconTheme}
              onClick={toggleTheme}
              color="inherit"
            >
              {theme === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>{' '}
            <Image
              src="/profile-placeholder.png"
              alt="Foto do usuário"
              width={80}
              height={80}
            />
            <Typography
              variant="subtitle2"
              component="h1"
              sx={{ mb: 2, textAlign: 'center' }}
            >
              Nome do Usuário
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}
