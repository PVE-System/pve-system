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
} from '@mui/material';
import { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';
import { Rating } from '@mui/material';
import dynamic from 'next/dynamic';
import { red } from '@mui/material/colors';
import DashboardExcelUpdateNotification from '../DashboardModalExcelUpdateNotification/DashboardExcelUpdateNotification';

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
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      <Box sx={styles.cardsAndPiaChartContainer}>
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
                  color: 'red',
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
                  backgroundColor: 'red',
                  fontWeight: '600',
                  color: 'white',

                  '&:hover': {
                    backgroundColor: red[600],
                  },
                }}
                onClick={() => (window.location.href = '/clientsSuspendedList')}
              >
                Suspenso
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Componente do Gráfico */}
        <Box sx={{ flex: 1 }}>
          <DynamicChartComponent />
        </Box>
      </Box>

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
              emptyIcon={<StarBorderIcon sx={styles.emptyIcon} />}
              sx={styles.ratingStars}
            />
            <Typography sx={styles.accordionTitle}>
              <span>{ratingCounts.active}</span> Clientes ativos
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
              emptyIcon={<StarBorderIcon sx={styles.emptyIcon} />}
              sx={styles.ratingStars}
            />
            <Typography sx={styles.accordionTitle}>
              <span>{ratingCounts.moderate}</span> Clientes moderado
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
              emptyIcon={<StarBorderIcon sx={styles.emptyIcon} />}
              sx={styles.ratingStars}
            />
            <Typography sx={styles.accordionTitle}>
              <span>{ratingCounts.inactive}</span> Clientes pouco ativo
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
