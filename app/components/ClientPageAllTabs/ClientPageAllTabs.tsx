import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge'; // Importação do Badge para notificações
import { Container, useMediaQuery, useTheme } from '@mui/material';
import Cookies from 'js-cookie';
import styles from '@/app/components/ClientPageAllTabs/styles';

import AlertModalClientPageOccurrencesNotification from '../AlertModalClientPageOccurrencesNotification/AlertModalClientPageOccurrencesNotification';

import InfoIcon from '@mui/icons-material/Info';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotesIcon from '@mui/icons-material/Notes';
import AttachmentIcon from '@mui/icons-material/Attachment';
import NotificationsIcon from '@mui/icons-material/Notifications'; // Ícone de exclamação

import ClientPageTabInfos from '@/app/components/ClientPageTabInfos/ClientPageTabInfos';
import ClientPageTabSalesInfos from '@/app/components/ClientPageTabSalesInfos/ClientPageTabSalesInfos';
import ClientPageTabAnnotation from '@/app/components/ClientPageTabAnnotation/ClientPageTabAnnotation';
import ClientPageTabFiles from '@/app/components/ClientPageTabFiles/ClientPageTabFiles';
import { useSearchParams } from 'next/navigation';
import ClientPageTabSalesQuotes from '../ClientPageTabSalesQuotes/ClientPageTabSalesQuotes';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function ClientPageTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [value, setValue] = React.useState(0);

  // Estados para notificações
  const [salesTabNotification, setSalesTabNotification] = React.useState(false);
  const [commentsTabNotification, setCommentsTabNotification] =
    React.useState(false);
  const [filesTabNotification, setFilesTabNotification] = React.useState(false); // Estado para arquivos
  const [salesQuotesTabNotification, setSalesQuotesTabNotification] =
    React.useState(false);

  // Função para buscar o status das abas
  const checkForNotifications = React.useCallback(async () => {
    const userId = Cookies.get('userId');
    if (!userId) {
      console.error('User ID not found in cookies');
      return;
    }

    try {
      const response = await fetch(
        `/api/notificationCheckUpdate?clientId=${clientId}&userId=${userId}`,
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Dados recebidos da API:', data);

        // Verificando se o backend está retornando corretamente os valores
        console.log('Files Tab Changed:', data.filesTabChanged);
        setSalesTabNotification(data.salesTabChanged);
        setCommentsTabNotification(data.commentsTabChanged);
        setFilesTabNotification(data.filesTabChanged); // Verificando aba de arquivos
        setSalesQuotesTabNotification(data.salesQuotesTabChanged);
      } else {
        console.error('Erro ao buscar notificações:', data.error);
      }
    } catch (error) {
      console.error('Erro ao buscar status de notificação:', error);
    }
  }, [clientId]);

  // Efeito para verificar as notificações na montagem do componente
  React.useEffect(() => {
    if (clientId) {
      // Chama a função que verifica as notificações
      checkForNotifications(); // Aqui estamos chamando a função

      console.log('Verificação das notificações foi chamada!');
    }
  }, [clientId, checkForNotifications]); // O useEffect será acionado quando o clientId ou checkForNotifications mudar

  // Função para marcar a aba como visualizada
  const markTabAsViewed = async (tabName: string) => {
    const userId = Cookies.get('userId');
    if (!userId) {
      console.error('User ID not found in cookies');
      return;
    }

    try {
      await fetch(
        `/api/notificationViewed?clientId=${clientId}&userId=${userId}&tabName=${tabName}`,
        { method: 'POST' },
      );

      // Atualiza o estado removendo a notificação
      if (tabName === 'salesQuotes') {
        setSalesQuotesTabNotification(false);
      } else if (tabName === 'sales') {
        setSalesTabNotification(false);
      } else if (tabName === 'comments') {
        setCommentsTabNotification(false);
      } else if (tabName === 'files') {
        setFilesTabNotification(false);
      }
    } catch (error) {
      console.error('Erro ao marcar aba como visualizada:', error);
    }
  };

  // Função para handle change das tabs
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    // Chama a função de marcar como visualizada quando a aba é acessada
    if (newValue === 1) {
      markTabAsViewed('salesQuotes');
    } else if (newValue === 2) {
      markTabAsViewed('sales');
    } else if (newValue === 3) {
      markTabAsViewed('comments');
    } else if (newValue === 4) {
      markTabAsViewed('files');
    }
  };

  if (!clientId) {
    return <div>Client ID not provided</div>;
  }

  return (
    <Container maxWidth="lg" sx={styles.containerTabs}>
      {/* Notificação de ocorrências */}
      {clientId && (
        <AlertModalClientPageOccurrencesNotification clientId={clientId} />
      )}
      <Box>
        <Box sx={styles.boxTabs}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              label={isSmallScreen ? null : 'Informações do cliente'}
              icon={<InfoIcon />}
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              label={isSmallScreen ? null : 'Cotações do cliente'}
              icon={
                <Badge
                  color="warning"
                  badgeContent={
                    <NotificationsIcon style={{ fontSize: '12px' }} />
                  }
                  invisible={!salesQuotesTabNotification}
                >
                  <RequestQuoteIcon />
                </Badge>
              }
              {...a11yProps(1)}
            />

            <Tab
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              label={isSmallScreen ? null : 'Informações de pedidos'}
              icon={
                <Badge
                  color="warning"
                  badgeContent={
                    <NotificationsIcon style={{ fontSize: '12px' }} />
                  } // Ícone de exclamação
                  invisible={!salesTabNotification}
                >
                  <ShoppingCartIcon />
                </Badge>
              }
              {...a11yProps(1)}
            />
            <Tab
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              label={isSmallScreen ? null : 'Histórico de anotações'}
              icon={
                <Badge
                  color="warning"
                  badgeContent={
                    <NotificationsIcon style={{ fontSize: '12px' }} />
                  } // Ícone de exclamação
                  invisible={!commentsTabNotification}
                >
                  <NotesIcon />
                </Badge>
              }
              {...a11yProps(2)}
            />
            <Tab
              sx={{
                fontSize: '12px',
                minWidth: '100px',
                '@media (max-width: 800px)': {
                  minWidth: 'auto',
                },
              }}
              label={isSmallScreen ? null : 'Arquivos e anexos'}
              icon={
                <Badge
                  color="warning"
                  badgeContent={
                    <NotificationsIcon style={{ fontSize: '12px' }} />
                  } // Ícone de notificação
                  invisible={!filesTabNotification} // Estado da notificação para a aba de arquivos
                >
                  <AttachmentIcon />
                </Badge>
              }
              {...a11yProps(3)}
            />
          </Tabs>
        </Box>
        <ClientPageTabPanel value={value} index={0}>
          <Box sx={styles.contentTabs}>
            <ClientPageTabInfos clientId={clientId} />
          </Box>
        </ClientPageTabPanel>
        <ClientPageTabPanel value={value} index={1}>
          <Box sx={styles.contentTabs}>
            <ClientPageTabSalesQuotes clientId={clientId} />
          </Box>
        </ClientPageTabPanel>
        <ClientPageTabPanel value={value} index={2}>
          <Box sx={styles.contentTabs}>
            <ClientPageTabSalesInfos clientId={clientId} />
          </Box>
        </ClientPageTabPanel>
        <ClientPageTabPanel value={value} index={3}>
          <Box sx={styles.contentTabs}>
            <ClientPageTabAnnotation clientId={clientId} />
          </Box>
        </ClientPageTabPanel>
        <ClientPageTabPanel value={value} index={4}>
          <Box sx={styles.contentTabs}>
            <ClientPageTabFiles clientId={clientId} />
          </Box>
        </ClientPageTabPanel>
      </Box>
    </Container>
  );
}
