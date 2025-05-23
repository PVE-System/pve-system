'use client';

import {
  Box,
  Button,
  Container,
  MobileStepper,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import sharedStyles from '@/app/styles/sharedStyles';
import FrequentOccurrencesRegistered from '../FrequentOccurrencesRegistered/FrequentOccurrencesRegistered';
import styles from './styles';

const stepLabels = [
  'Qual o nome do Cliente TESTE DEPLOY PREVIEW?',
  'Qual foi o problema?',
  'Qual foi a solução?',
  'Qual foi a conclusão?',
  'Finalizar e salvar ocorrência',
  'Arquivos e imagens (opcional)',
];

export default function FrequentOccurrencesComponent() {
  const [step, setStep] = useState(0);
  const [newOccurrence, setNewOccurrence] = useState({
    nameCompany: '',
    problem: '',
    solution: '',
    conclusion: '',
    attachments: '',
  });

  const [savedOccurrenceId, setSavedOccurrenceId] = useState<string | null>(
    null,
  );

  const handleStepperNext = () => {
    if (step < stepLabels.length - 1) setStep(step + 1);
  };

  const handleStepperBack = () => {
    if (step > 0) setStep(step - 1);
  };

  /* const handleSubmitOccurrence = async () => {
    try {
      const response = await axios.post(
        '/api/frequent-occurrences',
        newOccurrence,
      );
      setSavedOccurrenceId(response.data.id);
      setStep(step + 1); // avança para o step de upload
    } catch (error) {
      console.error('Erro ao salvar ocorrência:', error);
    }
  }; */

  const handleUpload = () => {
    // Aqui você pode abrir um input file ou navegar para o componente de upload
    console.log('Abrir fluxo de upload para ID:', savedOccurrenceId);
  };

  return (
    <Container fixed>
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Ocorrências <span>Frequentes</span>
        </Typography>
        <Typography sx={{ ...sharedStyles.subtitleSize, mb: 3 }}>
          Registre e acompanhe problemas <span>recorrentes</span>.
        </Typography>

        {/* --- Formulário com Stepper para criar nova ocorrência --- */}
        <Box sx={styles.BoxCardPaper}>
          <Stepper activeStep={step} orientation="vertical">
            {stepLabels.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box mt={3}>
            {step === 0 && (
              <TextField
                sx={styles.fontSizeInput}
                label="Nome do cliente"
                fullWidth
                value={newOccurrence.nameCompany}
                onChange={(e) =>
                  setNewOccurrence({
                    ...newOccurrence,
                    nameCompany: e.target.value,
                  })
                }
              />
            )}
            {step === 1 && (
              <TextField
                sx={styles.fontSizeInput}
                label="Descreva o problema"
                fullWidth
                multiline
                value={newOccurrence.problem}
                onChange={(e) =>
                  setNewOccurrence({
                    ...newOccurrence,
                    problem: e.target.value,
                  })
                }
              />
            )}
            {step === 2 && (
              <TextField
                sx={styles.fontSizeInput}
                label="Descreva a solução"
                fullWidth
                multiline
                value={newOccurrence.solution}
                onChange={(e) =>
                  setNewOccurrence({
                    ...newOccurrence,
                    solution: e.target.value,
                  })
                }
              />
            )}
            {step === 3 && (
              <TextField
                sx={styles.fontSizeInput}
                label="Informe a conclusão"
                fullWidth
                multiline
                value={newOccurrence.conclusion}
                onChange={(e) =>
                  setNewOccurrence({
                    ...newOccurrence,
                    conclusion: e.target.value,
                  })
                }
              />
            )}
            {step === 4 && (
              <Typography sx={sharedStyles.subtitleSize}>
                Pronto para registrar esta ocorrência?
              </Typography>
            )}
            {step === 5 && (
              <Box>
                <Typography sx={sharedStyles.subtitleSize}>
                  Faça upload de arquivos relacionados
                </Typography>
                {/* Aqui poderá vir o componente de upload futuramente */}
              </Box>
            )}
          </Box>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              onClick={handleStepperBack}
              disabled={step === 0}
              sx={{ fontSize: { xs: '10px', sm: '12px' } }}
            >
              Voltar
            </Button>

            {step < 4 && (
              <Button
                onClick={handleStepperNext}
                sx={{ fontSize: { xs: '10px', sm: '12px' } }}
              >
                Próximo
              </Button>
            )}

            {step === 4 && (
              <Button
                variant="contained"
                color="primary"
                /* onClick={handleSubmitOccurrence} */
                sx={styles.buttonRegister}
              >
                Registrar
              </Button>
            )}

            {step === 5 && (
              <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={handleUpload}>
                  Upload
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setStep(0)}
                  sx={{ fontSize: { xs: '10px', sm: '12px' } }}
                >
                  Pronto
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={styles.BoxCardPaper}>
          <FrequentOccurrencesRegistered />
        </Box>
      </Box>
    </Container>
  );
}
