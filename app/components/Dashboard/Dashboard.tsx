'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';
import { Rating } from '@mui/material';
import dynamic from 'next/dynamic';

const DynamicChartComponent = dynamic(
  () => import('@/app/components/PieChart/PieChart'),
  { ssr: false },
);

interface Client {
  clientCondition: 'normal' | 'especial' | 'suspenso';
  rating: 1 | 2 | 3;
}

interface ClientTotals {
  normal: number;
  especial: number;
  suspenso: number;
}

const DashboardComponent = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<ClientTotals>({
    normal: 0,
    especial: 0,
    suspenso: 0,
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
            if (client.clientCondition === 'especial') acc.especial += 1;
            if (client.clientCondition === 'suspenso') acc.suspenso += 1;
            if (client.clientCondition === 'normal') acc.normal += 1;
            return acc;
          },
          { especial: 0, suspenso: 0, normal: 0 },
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

  const handleCardClick = (query: string) => {
    window.location.href = `/searchResults?query=${query}`;
  };

  return (
    <Container maxWidth="lg" sx={sharedStyles.container}>
      <Box sx={styles.cardsContainer}>
        <Box sx={styles.cardsBoxCol1}>
          <Card
            variant="outlined"
            sx={styles.cards}
            onClick={() => handleCardClick('normal')}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ ...styles.cardsText, ...sharedStyles.subtitleSize }}
              >
                Cliente Normal <br />
                <span>{clientData.normal} </span>cadastrados
              </Typography>
            </CardContent>
          </Card>
          <Card
            variant="outlined"
            sx={styles.cards}
            onClick={() => handleCardClick('especial')}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ ...styles.cardsText, ...sharedStyles.subtitleSize }}
              >
                Cliente Especial <br />
                <span>{clientData.especial} </span>cadastrados
              </Typography>
            </CardContent>
          </Card>
          <Card
            variant="outlined"
            sx={styles.cards}
            onClick={() => handleCardClick('suspenso')}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ ...styles.cardsText, ...sharedStyles.subtitleSize }}
              >
                Cliente Suspenso <br />
                <span>{clientData.suspenso} </span>cadastrados
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <DynamicChartComponent />
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
            <Typography
              sx={{ ...styles.accordionText, ...sharedStyles.subtitleSize }}
            >
              <span>{ratingCounts.active}</span> Clientes ativos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{ ...styles.accordionText, ...sharedStyles.subtitleSize }}
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
            <Typography
              sx={{ ...styles.accordionText, ...sharedStyles.subtitleSize }}
            >
              <span>{ratingCounts.moderate}</span> Clientes moderado
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{ ...styles.accordionText, ...sharedStyles.subtitleSize }}
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
            <Typography
              sx={{ ...styles.accordionText, ...sharedStyles.subtitleSize }}
            >
              <span>{ratingCounts.inactive}</span> Clientes não ativos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{ ...styles.accordionText, ...sharedStyles.subtitleSize }}
            >
              Fazem pedidos com pouca frequência ou apenas uma única vez.
              <br />
              Importante fazer uma análise, entender os motivos e conversar com
              o cliente.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default DashboardComponent;
