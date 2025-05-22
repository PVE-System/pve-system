import React, { useState } from 'react';
import {
  Box,
  Typography,
  MobileStepper,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import styles from './styles';
import sharedStyles from '@/app/styles/sharedStyles';

// Simulação de dados fictícios
const occurrences = [
  {
    problem:
      'Máquina travando na produção, cliente ficou descontente e pediu para trocar a maquina em 24 horas. Máquina travando na produção, cliente ficou descontente e pediu para trocar a maquina em 24 horas.',
    solution: 'Troca do componente defeituoso',
    conclusion: 'Equipamento voltou a funcionar normalmente',
    files: 'Arquivo_anexo_1.pdf',
  },
  {
    problem: 'Erro no sistema de emissão de notas',
    solution: 'Atualização do software fiscal',
    conclusion: 'Notas emitidas normalmente após correção',
    files: 'Arquivo_anexo_2.jpg',
  },
  {
    problem: 'Queda de energia constante',
    solution: 'Instalação de nobreaks',
    conclusion: 'Sistema manteve estabilidade',
    files: 'Arquivo_anexo_3.docx',
  },
  {
    problem: 'Problema da ocorrencia 4',
    solution: 'Instalação de nobreaks',
    conclusion: 'Sistema manteve estabilidade',
    files: 'Arquivo_anexo_3.docx',
  },
];

const stepsLabels = ['Problema', 'Solução', 'Conclusão', 'Arquivos'];

export default function FrequentOccurrencesRegistered() {
  const [globalPage, setGlobalPage] = useState(0);
  const [stepIndexes, setStepIndexes] = useState(occurrences.map(() => 0));

  const occurrencesPerPage = 2;
  const totalPages = Math.ceil(occurrences.length / occurrencesPerPage);

  const handleNextGlobal = () => {
    if (globalPage < totalPages - 1) {
      setGlobalPage((prev) => prev + 1);
    }
  };

  const handleBackGlobal = () => {
    if (globalPage > 0) {
      setGlobalPage((prev) => prev - 1);
    }
  };

  const handleNextStep = (index: number) => {
    setStepIndexes((prev) => {
      const newSteps = [...prev];
      newSteps[index] = Math.min(newSteps[index] + 1, stepsLabels.length - 1);
      return newSteps;
    });
  };

  const handleBackStep = (index: number) => {
    setStepIndexes((prev) => {
      const newSteps = [...prev];
      newSteps[index] = Math.max(newSteps[index] - 1, 0);
      return newSteps;
    });
  };

  const getContentForStep = (
    occurrence: { problem: any; solution: any; conclusion: any; files: any },
    stepIndex: number,
  ) => {
    switch (stepIndex) {
      case 0:
        return occurrence.problem;
      case 1:
        return occurrence.solution;
      case 2:
        return occurrence.conclusion;
      case 3:
        return occurrence.files;
      default:
        return '';
    }
  };

  const start = globalPage * occurrencesPerPage;
  const end = start + occurrencesPerPage;
  const currentOccurrences = occurrences.slice(start, end);

  return (
    <Box sx={{ mt: 4 }}>
      {currentOccurrences.map((occurrence, index) => {
        const globalIndex = start + index;
        const activeStep = stepIndexes[globalIndex];

        return (
          <Paper key={globalIndex} sx={styles.cardPaper} elevation={3}>
            <Typography variant="h6" gutterBottom>
              Ocorrência #{globalIndex + 1}
            </Typography>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={styles.cardPaperText}
            >
              <strong>Cliente:</strong> Raio Material de construção LTDA.
            </Typography>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={styles.cardPaperText}
            >
              <span style={{ ...styles.spanText, marginRight: 6 }}>
                20/05/2025.
              </span>
              Responsável PVE: 09 - Caio Espindola.
            </Typography>

            <Divider sx={{ marginY: 2, borderWidth: 1 }} />

            <Typography
              variant="subtitle2"
              sx={{ ...styles.cardPaperText, minHeight: 60, mb: 3 }}
            >
              <strong>{stepsLabels[activeStep]}:</strong>{' '}
              {getContentForStep(occurrence, activeStep)}
            </Typography>

            <MobileStepper
              variant="dots"
              steps={stepsLabels.length}
              position="static"
              activeStep={activeStep}
              sx={{
                backgroundColor: 'grey.600', // Cor do tema (ex.: azul primário)
                '& .MuiMobileStepper-dot': {
                  backgroundColor: 'grey.400', // Cor dos pontos inativos
                },
                '& .MuiMobileStepper-dotActive': {
                  backgroundColor: 'primary.main', // Cor do ponto ativo
                },
                borderRadius: '10px',
              }}
              nextButton={
                <Button
                  size="small"
                  onClick={() => handleNextStep(globalIndex)}
                  disabled={activeStep === stepsLabels.length - 1}
                >
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={() => handleBackStep(globalIndex)}
                  disabled={activeStep === 0}
                >
                  <KeyboardArrowLeft />
                </Button>
              }
            />
          </Paper>
        );
      })}

      <Box display="flex" justifyContent="center" alignItems="center">
        <Button onClick={handleBackGlobal} disabled={globalPage === 0}>
          <KeyboardArrowLeft />
        </Button>
        <Typography sx={styles.cardPaperText}>
          Página {globalPage + 1} de {totalPages}
        </Typography>
        <Button
          onClick={handleNextGlobal}
          disabled={globalPage === totalPages - 1}
        >
          <KeyboardArrowRight />
        </Button>
      </Box>
    </Box>
  );
}
