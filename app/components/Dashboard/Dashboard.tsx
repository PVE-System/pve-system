'use client';

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
} from '@mui/material';
import { orange } from '@mui/material/colors';

// Acordion
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';
import { useState } from 'react';

const DashboardComponent = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : null);
    };
  return (
    <Container maxWidth="lg" sx={sharedStyles.container}>
      {/* Primeira linha */}
      <Box sx={styles.cardsContainer}>
        {/* Primeira coluna */}
        <Box sx={styles.cardsBoxCol1}>
          <Card variant="outlined" sx={styles.cards}>
            <CardContent sx={styles.cardsContent}>
              <Typography variant="h6" sx={styles.cardsText}>
                Clientes MS
              </Typography>
              <Typography variant="h6" sx={styles.cardsText}>
                <span>336</span>
                <br />
                Cadastrados
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={styles.cards}>
            <CardContent sx={styles.cardsContent}>
              <Typography variant="h6" sx={styles.cardsText}>
                Clientes MT
              </Typography>
              <Typography variant="h6" sx={styles.cardsText}>
                <span>211</span>
                <br />
                Cadastrados
              </Typography>
            </CardContent>
          </Card>
        </Box>
        {/* Segunda coluna */}
        <Box sx={styles.cardGraphicContainer}>
          <Card variant="outlined" sx={styles.cardGraphic}>
            <CardContent sx={styles.CardGraphicContent}>
              <Typography variant="h6" sx={styles.cardsText}>
                Gráfico dos cadastros:
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
      {/* Segunda linha */}
      <Box sx={styles.accordionContainer}>
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Clientes são ativos.</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Clientes são ativos, fieis e fazem pedidos com frequencia.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography>Clientes com atividade moderada.</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Clientes moderado, pedidos com uma certa frequencia, mas poderia
              melhorar, compensa analisar os motivos e tentar fechar mais
              pedidos.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
          >
            <Typography>Clientes não são ativos.</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Clientes não ativos fazem pedidos poucas vezes por ano,
              independente da concorrência.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default DashboardComponent;
