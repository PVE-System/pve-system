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
import { Badge, IconButton, Link, Tooltip, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
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
import { useTheme } from '@/app/theme/ThemeContext';
import styles from '@/app/components/MenuNav/styles';
import { useAuth } from '@/app/contex/authContext'; // Importe o contexto de autenticação
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    imageUrl: string | null;
    role: string;
  }>({ name: '', imageUrl: null, role: '' });
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { user, logout } = useAuth();
  const [hasNotification, setHasNotification] = useState(false);

  const pathname = usePathname();

  // Função para verificar notificações
  const checkForNotification = async () => {
    const userId = Cookies.get('userId');
    if (!userId) {
      console.error('User ID not found in cookies');
      return;
    }

    try {
      const response = await fetch(
        `/api/notificationCheckUpdatePages?userId=${userId}`,
      );
      const data = await response.json();

      if (response.ok) {
        setHasNotification(data.hasNotification); // Atualiza o estado com a resposta da API
      } else {
        console.error('Error fetching notification status:', data.error);
      }
    } catch (error) {
      console.error('Error checking for notifications:', error);
    }
  };

  // Verificação periódica para atualizações de notificação
  useEffect(() => {
    checkForNotification(); // Verifica a notificação apenas quando o pathname muda ou na primeira montagem
  }, [pathname]);

  // Busca dados do usuário e verifica notificação ao carregar a página
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = Cookies.get('userId');
      if (userId) {
        try {
          const response = await fetch(`/api/getUser/${userId}`);
          const data = await response.json();
          setUserData({
            name: data.name,
            imageUrl: data.imageUrl,
            role: data.role,
          });
        } catch (error) {
          console.error('Failed to fetch user data', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
    checkForNotification();
  }, [user?.id]);

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    toggleTheme();
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const themeIcon =
    theme === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />;

  const renderAsIs = (str: any) => {
    if (typeof str !== 'string') {
      return '';
    }
    return str;
  };

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
            icon: (
              <Badge color="error" variant="dot" invisible={!hasNotification}>
                <ArticleIcon />
              </Badge>
            ),
            link: '/excelDownloadFile',
          },

          userData.role === 'admin' && {
            name: 'Cadastrar Equipe',
            icon: <GroupAddIcon />,
            link: '/registerTeam',
          },
          {
            name: 'Editar Perfil',
            icon: <ManageAccountsIcon />,
            link: `/editProfile?id=${user?.id}`,
          },
        ]
          .filter(
            (item): item is { name: string; icon: JSX.Element; link: string } =>
              Boolean(item),
          )
          .map((item) => (
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
        <Box sx={styles.iconCloseMenu}>
          <IconButton onClick={toggleDrawer(false)}>
            <CloseIcon sx={styles.iconCloseMenuColor} />
          </IconButton>
        </Box>
        <Box sx={styles.containerMenu}>
          <Box sx={styles.logoMenu}>
            <Image src="/logoPveMenu.png" alt="Logo" width={120} height={120} />
          </Box>
          {DrawerList}
          <Box sx={styles.contentMenu}>
            <Tooltip title={'Trocar de tema'}>
              <IconButton
                sx={styles.iconTheme}
                onClick={handleToggleTheme}
                color="inherit"
              >
                {themeIcon}
              </IconButton>
            </Tooltip>
            <Divider sx={styles.dividerMenu} />
            <Box>
              {userData.imageUrl ? (
                <Image
                  src={userData.imageUrl}
                  alt="Foto do usuário"
                  width={80}
                  height={80}
                  style={{ borderRadius: '50%' }}
                  priority
                />
              ) : (
                <Image
                  src="/profile-placeholder.png"
                  alt="Placeholder"
                  width={80}
                  height={80}
                  priority
                />
              )}
            </Box>
            <Typography variant="subtitle2" component="h1">
              {renderAsIs(userData.name.slice(0, 25)) || 'Nome do Usuário'}
            </Typography>
          </Box>
          <Box sx={styles.iconLogout}>
            <Link onClick={logout}>
              <Tooltip title={'Sair do sistema'}>
                <IconButton>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
