'use client';

import { Card, CardContent, Typography, Container, Box } from '@mui/material';

import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';
import { Rating } from '@mui/material';

//Recurso para desativar o SSR (Server-Side Rendering). Foi necessario para colocar o grafico. (conferir com o Raras se é ok?)
import dynamic from 'next/dynamic';
const DynamicChartComponent = dynamic(
  () => import('@/app/components/PieChart/PieChart'),
  { ssr: false },
);

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
            <CardContent>
              <Typography
                variant="h6"
                sx={{ ...styles.cardsText, ...sharedStyles.subtitleSize }}
              >
                Clientes MS
              </Typography>
              <Typography
                variant="h6"
                sx={{ ...styles.cardsText, ...sharedStyles.subtitleSize }}
              >
                <span>336</span>
                <br />
                Cadastrados
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={styles.cards}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ ...styles.cardsText, ...sharedStyles.subtitleSize }}
              >
                Clientes MT
              </Typography>
              <Typography
                variant="h6"
                sx={{ ...styles.cardsText, ...sharedStyles.subtitleSize }}
              >
                <span>211</span>
                <br />
                Cadastrados
              </Typography>
            </CardContent>
          </Card>
        </Box>
        {/* Segunda coluna */}
        <DynamicChartComponent />
      </Box>
      {/* Segunda linha */}
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
              <span>117 </span>Clientes ativos
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
              <span>055 </span> Clientes moderado
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
              <span>032 </span>Clientes não ativos
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              sx={{ ...styles.accordionText, ...sharedStyles.subtitleSize }}
            >
              Fazem pedidos poucas vezes por ano independente da concorrência.
              <br />
              Mas é importante sempre mantermos contato.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default DashboardComponent;
