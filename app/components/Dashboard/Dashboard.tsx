'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Link,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { orange } from '@mui/material/colors';
import { useEffect, useRef, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';
import { Rating } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { blueGrey, red } from '@mui/material/colors';
import DashboardExcelUpdateNotification from '../DashboardModalExcelUpdateNotification/DashboardExcelUpdateNotification';
import FrequentOccurrencesRegistered from '../FrequentOccurrencesRegistered/FrequentOccurrencesRegistered';

import WarningIcon from '@mui/icons-material/Warning';
import QuotesDashboardComposedChart from '../QuotesDashboardComposedChart/QuotesDashboardComposedChart';

const DynamicChartComponent = dynamic(
  () => import('@/app/components/PieChart/PieChart'),
  { ssr: false },
);

interface Client {
  clientCondition: 'Normal' | 'Especial' | 'Suspenso';
  rating: 1 | 2 | 3;
}

interface ClientTotals {
  Normal: number;
  Especial: number;
  Suspenso: number;
}

const DashboardComponent = () => {
  const router = useRouter();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const chartScrollRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openRoutes, setOpenRoutes] = useState<
    { id: number; routeName: string; scheduledDate: string }[]
  >([]);
  const [loadingOpenRoutes, setLoadingOpenRoutes] = useState(true);

  const [clientData, setClientData] = useState<ClientTotals>({
    Normal: 0,
    Especial: 0,
    Suspenso: 0,
  });
  const [ratingCounts, setRatingCounts] = useState({
    active: 0,
    moderate: 0,
    inactive: 0,
  });

  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : null);
    };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/getAllClients');
        const data = await response.json();
        const clients: Client[] = data.clients;

        const totals = clients.reduce<ClientTotals>(
          (acc: ClientTotals, client: Client) => {
            if (client.clientCondition === 'Especial') acc.Especial += 1;
            if (client.clientCondition === 'Suspenso') acc.Suspenso += 1;
            if (client.clientCondition === 'Normal') acc.Normal += 1;
            return acc;
          },
          { Especial: 0, Suspenso: 0, Normal: 0 },
        );

        const ratings = clients.reduce(
          (
            acc: { active: number; moderate: number; inactive: number },
            client: Client,
          ) => {
            if (client.rating === 3) acc.active += 1;
            if (client.rating === 2) acc.moderate += 1;
            if (client.rating === 1) acc.inactive += 1;
            return acc;
          },
          { active: 0, moderate: 0, inactive: 0 },
        );

        setClientData(totals);
        setRatingCounts(ratings);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Função para centralizar o scroll horizontal do gráfico
  const centerChartScroll = React.useCallback(() => {
    if (!isXs) return;
    const el = chartScrollRef.current;
    if (!el) return;

    const centerScroll = () => {
      if (el.scrollWidth > el.clientWidth) {
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      }
    };

    // Tentar centralizar imediatamente e após alguns delays
    requestAnimationFrame(() => {
      centerScroll();
      setTimeout(centerScroll, 100);
      setTimeout(centerScroll, 300);
    });
  }, [isXs]);

  // Centralizar scroll horizontal do gráfico em telas pequenas
  useEffect(() => {
    if (!isXs) return;
    const el = chartScrollRef.current;
    if (!el) return;

    // Observar mudanças no tamanho do conteúdo
    const resizeObserver = new ResizeObserver(() => {
      centerChartScroll();
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isXs, centerChartScroll]);

  useEffect(() => {
    const fetchOpenRoutes = async () => {
      try {
        setLoadingOpenRoutes(true);
        const response = await fetch('/api/getVisitRoutes');
        if (!response.ok) throw new Error('Erro ao buscar rotas');
        const data = await response.json();
        const routes = (data?.routes || []) as {
          id: number;
          routeName: string;
          scheduledDate: string;
          routeStatus: string;
        }[];

        const parseDate = (value: string): number => {
          if (!value) return Number.POSITIVE_INFINITY;
          // Formato vindo da API pode ser "DD/MM/AAAA" ou ISO
          if (value.includes('/')) {
            const [dd, mm, yyyy] = value.split('/');
            const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
            return d.getTime();
          }
          const d = new Date(value);
          return isNaN(d.getTime()) ? Number.POSITIVE_INFINITY : d.getTime();
        };

        const open = routes
          .filter((r) => r.routeStatus === 'EM_ABERTO')
          .sort(
            (a, b) => parseDate(a.scheduledDate) - parseDate(b.scheduledDate),
          )
          .map((r) => ({
            id: r.id,
            routeName: r.routeName,
            scheduledDate: r.scheduledDate,
          }));

        setOpenRoutes(open);
      } catch (error) {
        console.error('Erro ao buscar rotas em aberto:', error);
        setOpenRoutes([]);
      } finally {
        setLoadingOpenRoutes(false);
      }
    };

    fetchOpenRoutes();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  /*   const handleCardClick = (query: string) => {
    window.location.href = `/searchResults?query=${query}`;
  }; */

  return (
    <Container
      maxWidth="lg"
      sx={{
        ...sharedStyles.container,
      }}
    >
      <Box
        sx={{
          /* ...styles.cardsAndPiaChartContainer, */
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr',
            md: '1fr auto 1fr',
          },
          alignItems: 'start',
          columnGap: 3,
          rowGap: 2,
          justifyContent: {
            xs: 'center',
            sm: 'center',
            md: 'stretch',
          },
        }}
      >
        {/* Contêiner de Cards */}
        <Box sx={styles.cardsBox}>
          {/* Card Cliente Normal */}
          <Card variant="outlined" sx={styles.cardsDashboard}>
            <CardContent sx={styles.cardContent}>
              <Typography
                variant="h6"
                sx={{
                  ...styles.cardTitle,
                  ...sharedStyles.subTitleFontFamily,
                  color: 'green',
                }}
              >
                Cliente Normal
              </Typography>
              <Typography variant="h4" sx={styles.cardNumber}>
                {clientData.Normal}
              </Typography>
              <Button
                title="Confira a lista destes clientes"
                onClick={() => (window.location.href = '/clientsNormalList')}
                sx={{
                  ...styles.cardButton,
                  backgroundColor: 'green',
                  fontWeight: '600',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'darkgreen',
                  },
                }}
              >
                Normal
              </Button>
            </CardContent>
          </Card>

          {/* Repetição para os outros cards */}
          {/* Card Cliente Especial */}
          <Card variant="outlined" sx={styles.cardsDashboard}>
            <CardContent sx={styles.cardContent}>
              <Typography
                variant="h6"
                sx={{
                  ...styles.cardTitle,
                  ...sharedStyles.subTitleFontFamily,
                  color: 'orange',
                }}
              >
                Cliente Especial
              </Typography>
              <Typography variant="h4" sx={styles.cardNumber}>
                {clientData.Especial}
              </Typography>
              <Button
                title="Confira a lista destes clientes"
                onClick={() => (window.location.href = '/clientsEspecialList')}
                sx={{
                  ...styles.cardButton,
                  backgroundColor: 'orange',
                  fontWeight: '600',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: 'darkorange',
                  },
                }}
              >
                Especial
              </Button>
            </CardContent>
          </Card>

          {/* Card Cliente Suspenso */}
          <Card variant="outlined" sx={styles.cardsDashboard}>
            <CardContent sx={styles.cardContent}>
              <Typography
                variant="h6"
                sx={{
                  ...styles.cardTitle,
                  ...sharedStyles.subTitleFontFamily,
                  color: red[800],
                }}
              >
                Cliente Suspenso
              </Typography>
              <Typography variant="h4" sx={styles.cardNumber}>
                {clientData.Suspenso}
              </Typography>
              <Button
                title="Confira a lista destes clientes"
                sx={{
                  ...styles.cardButton,
                  backgroundColor: red[800],
                  fontWeight: '600',
                  color: 'white',

                  '&:hover': {
                    backgroundColor: red[900],
                  },
                }}
                onClick={() => (window.location.href = '/clientsSuspendedList')}
              >
                Suspenso
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Coluna Central: Gráfico centralizado */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <DynamicChartComponent />
        </Box>

        {/* Coluna Direita: Cards de Rotas em Aberto */}
        <Box sx={styles.backgroundRoutesDashboard}>
          {loadingOpenRoutes ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              {/* <CircularProgress size={24} /> */}
            </Box>
          ) : openRoutes.length === 0 ? (
            <Card variant="outlined" sx={styles.cardsRoutesDashboard}>
              <CardContent sx={styles.cardRoutesContent}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center' }}
                >
                  Nenhuma rota em aberto.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            openRoutes.map((route) => (
              <Card
                key={route.id}
                variant="outlined"
                sx={{ ...styles.cardsRoutesDashboard, cursor: 'pointer' }}
                onClick={() =>
                  window.open(
                    `/clientsVisitsRegisteredRoutes/${route.id}`,
                    '_blank',
                  )
                }
              >
                <CardContent sx={styles.cardRoutesContent}>
                  <Typography
                    variant="h6"
                    sx={{
                      ...styles.cardRoutesTitle,
                      ...sharedStyles.subTitleFontFamily,
                      color: 'primary.main',
                    }}
                  >
                    {route.routeName && route.routeName.length > 35
                      ? `${route.routeName.slice(0, 35)}...`
                      : route.routeName}
                  </Typography>
                  <Typography variant="h5" sx={styles.cardRoutesNumber}>
                    {route.scheduledDate || 'Data não informada'}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
      <Box
        sx={{
          width: { xs: '100%', md: '90%', lg: '90%' },
          mt: 3,
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
        ref={chartScrollRef}
      >
        <Box sx={{ minWidth: { xs: 520, md: 800 } }}>
          <QuotesDashboardComposedChart onLoadComplete={centerChartScroll} />
        </Box>
      </Box>

      {/* Ocorrências Frequentes */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography
          sx={{
            ...styles.BoxFrequentOccurrencesTitle,
            mt: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textAlign: 'center',

            '@media (max-width:450px)': {
              mt: 6,
              mb: 0,
            },
          }}
        >
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Ocorrências <span>Frequentes</span>
          <WarningIcon color="warning" sx={{ ml: 1 }} />
        </Typography>
        <Typography sx={{ fontSize: '12px', mb: 2 }}>
          Clique{' '}
          <Link
            href="/frequentOccurrencesPage"
            color="warning.dark"
            onClick={(e) => {}}
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            aqui
          </Link>{' '}
          para criar e gerenciar ocorrências.
        </Typography>
      </Box>
      <Box sx={{ ...styles.BoxFrequentOccurrences, mb: 3 }}>
        <FrequentOccurrencesRegistered />
      </Box>

      <Typography
        sx={{
          ...styles.BoxFrequentOccurrencesTitle,
          mt: 5,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          textAlign: 'center',
          '@media (max-width:450px)': {
            mt: 2,
          },
        }}
      >
        <CircleIcon sx={{ color: orange[800] }} />
        Fluxo de <span>Cotações</span>
        <CircleIcon sx={{ color: orange[800] }} />
      </Typography>

      <Box sx={styles.accordionContainer}>
        <Accordion
          sx={styles.accordionBg}
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon sx={styles.arrowIcon} />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Rating
              name="read-only"
              value={3}
              readOnly
              max={3}
              icon={<CircleIcon sx={{ color: orange[800] }} />}
              emptyIcon={<CircleOutlinedIcon sx={styles.emptyIcon} />}
              sx={styles.ratingStars}
            />
            <Typography sx={styles.accordionTitle}>
              <span>{ratingCounts.active}</span> Fluxo Grande
            </Typography>
            <FormatListBulletedIcon
              sx={styles.accordionIconList}
              onClick={(e) => {
                e.stopPropagation(); // Evita que o clique no ícone expanda/colapse o Accordion
                window.location.href = '/clientsRating3List'; // Redireciona o usuário
              }}
              titleAccess="Confira a lista destes clientes" // Texto que aparece ao passar o mouse por cima
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                ...styles.accordionContentText,
                ...sharedStyles.subTitleFontFamily,
              }}
            >
              Fazem pedidos com frequência e confiam em nosso trabalho.
              <br />
              São clientes fidelizados que temos um bom relacionamento.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={styles.accordionBg}
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon sx={styles.arrowIcon} />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Rating
              name="read-only"
              value={2}
              readOnly
              max={3}
              icon={<CircleIcon sx={{ color: orange[800] }} />}
              emptyIcon={<CircleOutlinedIcon sx={styles.emptyIcon} />}
              sx={styles.ratingStars}
            />
            <Typography sx={styles.accordionTitle}>
              <span>{ratingCounts.moderate}</span> Fluxo Moderado
            </Typography>
            <FormatListBulletedIcon
              sx={styles.accordionIconList}
              onClick={(e) => {
                e.stopPropagation(); // Evita que o clique no ícone expanda/colapse o Accordion
                window.location.href = '/clientsRating2List'; // Redireciona o usuário
              }}
              titleAccess="Confira a lista destes clientes"
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                ...styles.accordionContentText,
                ...sharedStyles.subTitleFontFamily,
              }}
            >
              Fazem pedidos com uma certa frequência, mas poderia melhorar.
              <br />
              Compensa analisar os motivos e tentar fechar mais pedidos.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          sx={styles.accordionBg}
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon sx={styles.arrowIcon} />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Rating
              name="read-only"
              value={1}
              readOnly
              max={3}
              icon={<CircleIcon sx={{ color: orange[800] }} />}
              emptyIcon={<CircleOutlinedIcon sx={styles.emptyIcon} />}
              sx={styles.ratingStars}
            />
            <Typography sx={styles.accordionTitle}>
              <span>{ratingCounts.inactive}</span>Fluxo Baixo
            </Typography>
            <FormatListBulletedIcon
              sx={styles.accordionIconList}
              onClick={(e) => {
                e.stopPropagation(); // Evita que o clique no ícone expanda/colapse o Accordion
                window.location.href = '/clientsRating1List'; // Redireciona o usuário
              }}
              titleAccess="Confira a lista destes clientes"
            />
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{
                ...styles.accordionContentText,
                ...sharedStyles.subTitleFontFamily,
              }}
            >
              Fazem pedidos com pouca frequência ou apenas uma única vez.
              <br />
              Importante fazer uma análise, entender os motivos, e se necessário
              elaborar alguma estratégia.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box>
        <DashboardExcelUpdateNotification />
      </Box>
    </Container>
  );
};

export default DashboardComponent;
