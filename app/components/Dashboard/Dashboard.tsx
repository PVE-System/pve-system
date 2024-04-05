import { Grid, Card, CardContent, Typography, Container } from '@mui/material';
import { orange } from '@mui/material/colors';

// Acordion
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import sharedStyles from '@/app/styles/sharedStyles';
import styles from './styles';

const DashboardComponent = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {/* Primeira linha */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          {/* Primeira coluna */}
          <Grid
            item
            xs={6}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              width: '200px',
            }}
          >
            <Card
              variant="outlined"
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 4,
                width: '200px',
                backgroundColor: 'transparent',
                /* marginBottom: '20px', */
              }}
            >
              <CardContent
                sx={{
                  backgroundColor: 'transparent',
                  border: '1px solid white',
                  width: '200px',
                }}
              >
                <Typography variant="h6" sx={styles.textCard}>
                  Clientes MS
                </Typography>
                <Typography variant="h6" sx={styles.textCard}>
                  <span>336</span>
                  <br />
                  Cadastrados
                </Typography>
              </CardContent>
            </Card>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 4,
                width: '200px',
                backgroundColor: 'transparent',
                marginTop: '20px',
                /* marginBottom: '20px', */
              }}
            >
              <CardContent
                sx={{
                  backgroundColor: 'transparent',
                  border: '1px solid white',
                  width: '200px',
                }}
              >
                <Typography variant="h6" sx={styles.textCard}>
                  Clientes MT
                </Typography>
                <Typography variant="h6" sx={styles.textCard}>
                  <span>211</span>
                  <br />
                  Cadastrados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Segunda coluna */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ borderRadius: 4, height: '100%' }}>
              <CardContent
                sx={{
                  backgroundColor: '#2A2E30',
                  border: '1px solid white',
                  height: '100%',
                }}
              >
                <Typography variant="h6" sx={{ color: 'white' }}>
                  Grafico dos cadastros
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      {/* Segunda linha */}
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={styles.textAccordion}>
                  <span>276 </span>Clientes são ativos.
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Clientes são ativos, fieis e fazem pedidos com frequencia.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={styles.textAccordion}>
                  <span>341 </span>Clientes com atividade moderada.
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Clientes moderado, pedidos com uma certa frequencia, mas
                  poderia melhorar, compensa analisar os motivos e tentar fechar
                  mais pedidos.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ArrowDropDownIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={styles.textAccordion}>
                  <span>153 </span>Clientes não são ativos.
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Clientes não ativos fazem poucas vezes por ano.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardComponent;
