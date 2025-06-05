'use client';

import {
  Box,
  Button,
  Container,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Autocomplete,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Theme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';
import sharedStyles from '@/app/styles/sharedStyles';
import FrequentOccurrencesRegistered from '../FrequentOccurrencesRegistered/FrequentOccurrencesRegistered';
import AlertModalGeneric from '../AlertModalGeneric/AlertModalGeneric';
import styles from './styles';
import Cookies from 'js-cookie';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { blueGrey, green, grey, orange, red } from '@mui/material/colors';
import FrequentOccurrencesRegisteredCompleted from '../FrequentOccurrencesRegisteredCompleted/FrequentOccurrencesRegisteredCompleted';

interface Client {
  id: string;
  companyName: string;
  corfioCode: string;
  state: string;
}

const stepLabels = [
  'Selecione o Cliente',
  'Qual foi o problema?',
  'Status da ocorrência?',
  'Ações para solucionar o problema?',
  'Qual foi a conclusão final?',
  'Finalizar e salvar ocorrência',
  'Arquivos e imagens (opcional)',
];

export default function FrequentOccurrencesComponent() {
  const [step, setStep] = useState(0);
  const [addingOccurrence, setAddingOccurrence] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newOccurrence, setNewOccurrence] = useState({
    clientId: '',
    problem: '',
    solution: '',
    conclusion: '',
    attachments: '',
    occurrencesStatus: 'EM_ABERTO',
    attachmentsList: [] as { url: string; name: string }[],
  });

  const [savedOccurrenceId, setSavedOccurrenceId] = useState<string | null>(
    null,
  );
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalConfig, setAlertModalConfig] = useState({
    title: '',
    message: '',
    buttonText: 'OK',
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/getAllClientsFrequentOccurrences');
        if (!response.ok) throw new Error('Erro ao buscar clientes');
        const data = await response.json();
        setClients(data.clients);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleStepperNext = () => {
    if (step < stepLabels.length - 1) setStep(step + 1);
  };

  const handleStepperBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmitOccurrence = async () => {
    if (!selectedClient) {
      console.error('Cliente não selecionado');
      return;
    }

    setAddingOccurrence(true);
    try {
      const userId = Cookies.get('userId');
      if (!userId) throw new Error('ID do usuário não encontrado');

      // Garantir que o solution sempre comece com Ação 1: "
      const solutionWithPrefix = newOccurrence.solution.startsWith('Ação 1: ')
        ? newOccurrence.solution
        : `Ação 1: ${newOccurrence.solution}`;

      // Garantir que o conclusion tenha um valor quando status é EM_ABERTO
      const conclusionText =
        newOccurrence.occurrencesStatus === 'EM_ABERTO'
          ? 'Esta ocorrência está em aberto, atualize futuramente quando concluir.'
          : newOccurrence.conclusion;

      const response = await fetch('/api/registerFrequentOccurrence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: Number(selectedClient.id),
          userId: Number(userId),
          problem: newOccurrence.problem,
          solution: solutionWithPrefix,
          conclusion: conclusionText,
          occurrencesStatus: newOccurrence.occurrencesStatus,
          attachments: newOccurrence.attachments || '',
          attachmentsList: newOccurrence.attachmentsList || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Resposta de erro da API:', errorData);
        throw new Error(errorData.error || 'Erro ao salvar ocorrência');
      }

      const data = await response.json();
      console.log('Ocorrência registrada com sucesso. ID:', data.result.id);
      setSavedOccurrenceId(data.result.id);
      setStep(step + 1);
    } catch (error) {
      console.error('Erro ao salvar ocorrência:', error);
      setAlertModalConfig({
        title: 'Erro',
        message:
          error instanceof Error ? error.message : 'Erro ao salvar ocorrência',
        buttonText: 'OK',
      });
      setShowAlertModal(true);
    } finally {
      setAddingOccurrence(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      event.target.value = ''; // Limpa o input para permitir selecionar o mesmo arquivo novamente
    }
  };

  const handleUploadFiles = async () => {
    if (!savedOccurrenceId) {
      console.error(
        'ID da ocorrência não encontrado. savedOccurrenceId:',
        savedOccurrenceId,
      );
      return;
    }
    if (selectedFiles.length === 0) {
      console.error('Nenhum arquivo selecionado');
      return;
    }

    console.log('Iniciando upload para ocorrência ID:', savedOccurrenceId);
    setLoadingUpload(true);
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        console.log(
          'Enviando arquivo:',
          file.name,
          'para ocorrência:',
          savedOccurrenceId,
        );
        const response = await fetch(
          `/api/uploadFilesFrequentOccurrences?occurrenceId=${savedOccurrenceId}`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (response.ok) {
          const blobInfo = await response.json();
          console.log('Arquivo enviado com sucesso:', blobInfo);
          setNewOccurrence((prev) => ({
            ...prev,
            attachmentsList: [
              ...prev.attachmentsList,
              { url: blobInfo.url, name: file.name },
            ],
            attachments: blobInfo.url,
          }));
        } else {
          const errorData = await response.json();
          console.error(
            'Erro ao fazer upload do arquivo:',
            file.name,
            'Erro:',
            errorData,
          );
        }
      }
      setSelectedFiles([]); // Limpa a lista de arquivos selecionados após o upload
    } catch (error) {
      console.error('Erro no processo de upload:', error);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProntoClick = () => {
    if (selectedFiles.length > 0) {
      setAlertModalConfig({
        title: 'Atenção',
        message: 'Você tem arquivos selecionados para fazer upload',
        buttonText: 'OK',
      });
      setShowAlertModal(true);
    } else {
      setAlertModalConfig({
        title: 'Pronto!',
        message: 'Ocorrência e anexos realizados com sucesso!',
        buttonText: 'OK',
      });
      setShowAlertModal(true);
    }
  };

  const handleAlertModalClose = () => {
    setShowAlertModal(false);
    if (selectedFiles.length === 0) {
      window.location.reload();
    }
  };

  const handleSolutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Se o usuário tentar remover o prefixo, não permitir
    if (!value.startsWith('Ação 1: ')) {
      setNewOccurrence({
        ...newOccurrence,
        solution: 'Ação 1: ',
      });
    } else {
      setNewOccurrence({
        ...newOccurrence,
        solution: value,
      });
    }
  };

  const handleOccurrencesStatusChange = (e: any) => {
    const newStatus = e.target.value;
    setNewOccurrence({
      ...newOccurrence,
      occurrencesStatus: newStatus,
      // Se mudar para EM_ABERTO, força o texto padrão
      conclusion:
        newStatus === 'EM_ABERTO'
          ? 'Esta ocorrência está em aberto, atualize futuramente quando concluir.'
          : newOccurrence.conclusion,
    });
  };

  const handleConclusionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newOccurrence.occurrencesStatus !== 'EM_ABERTO') {
      setNewOccurrence({
        ...newOccurrence,
        conclusion: e.target.value,
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container fixed>
      <Box sx={sharedStyles.container}>
        <Typography variant="h4" component="h1" sx={sharedStyles.titlePage}>
          Ocorrências <span>Frequentes</span>
        </Typography>
        <Typography sx={{ ...sharedStyles.subtitleSize, mb: 3 }}>
          Registre e acompanhe problemas <span>recorrentes</span>.
        </Typography>

        <Box sx={styles.BoxCardPaperRegister}>
          <Stepper activeStep={step} orientation="vertical">
            {stepLabels.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box mt={3}>
            {step === 0 && (
              <Autocomplete
                options={clients}
                getOptionLabel={(option) =>
                  `${option.companyName} - ${option.state} - ${option.corfioCode}`
                }
                value={selectedClient}
                onChange={(_, newValue) => {
                  setSelectedClient(newValue);
                  setNewOccurrence({
                    ...newOccurrence,
                    clientId: newValue?.id || '',
                  });
                }}
                filterOptions={(options, state) => {
                  if (state.inputValue === '') {
                    return options;
                  }
                  const lowerCaseInput = state.inputValue.toLowerCase().trim();

                  // Primeiro, tenta a busca por prefixo (mantém a ordenação alfabética)
                  const prefixMatches = options.filter((option) =>
                    option.companyName
                      .toLowerCase()
                      .trim()
                      .startsWith(lowerCaseInput),
                  );

                  // Se encontrou resultados com busca por prefixo, retorna eles
                  if (prefixMatches.length > 0) {
                    return prefixMatches;
                  }

                  // Se não encontrou por prefixo, tenta a busca por termos
                  const searchTerms = lowerCaseInput.split(/\s+/);
                  return options.filter((option) => {
                    const companyName = option.companyName.toLowerCase();
                    return searchTerms.every((term) =>
                      companyName.includes(term),
                    );
                  });
                }}
                getOptionKey={(option) => option.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={styles.fontSizeInput}
                    label="Selecione o Cliente"
                    fullWidth
                  />
                )}
                componentsProps={{
                  paper: {
                    sx: {
                      fontSize: { xs: '12px', sm: '14px' },
                      background: (theme: Theme) =>
                        theme.palette.mode === 'light'
                          ? blueGrey[100]
                          : theme.palette.background.alternative,
                    },
                  },
                }}
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
              <FormControl fullWidth sx={styles.fontSizeInput}>
                <InputLabel>Status da ocorrência?</InputLabel>
                <Select
                  value={newOccurrence.occurrencesStatus}
                  label="Status da ocorrência?"
                  onChange={handleOccurrencesStatusChange}
                >
                  <MenuItem value="EM_ABERTO">Em Aberto</MenuItem>
                  <MenuItem value="CONCLUIDO">Concluído</MenuItem>
                </Select>
              </FormControl>
            )}
            {step === 3 && (
              <TextField
                sx={styles.fontSizeInput}
                label="Descreva a solução"
                fullWidth
                multiline
                value={newOccurrence.solution}
                onChange={handleSolutionChange}
                placeholder="Ação 1: "
              />
            )}
            {step === 4 && (
              <TextField
                sx={styles.fontSizeInput}
                label="Informe a conclusão"
                fullWidth
                multiline
                value={
                  newOccurrence.occurrencesStatus === 'EM_ABERTO'
                    ? 'Esta ocorrência está em aberto, atualize futuramente quando concluir.'
                    : newOccurrence.conclusion
                }
                onChange={handleConclusionChange}
                disabled={newOccurrence.occurrencesStatus === 'EM_ABERTO'}
              />
            )}
            {step === 5 && (
              <Typography sx={sharedStyles.subtitleSize}>
                Pronto para registrar esta ocorrência?
              </Typography>
            )}
            {step === 6 && (
              <Box>
                <Typography sx={sharedStyles.subtitleSize}>
                  Armazene os arquivos relacionados:
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 2,
                    justifyContent: 'center',
                  }}
                >
                  <input
                    type="file"
                    accept="*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="upload-file-input"
                    multiple
                  />
                  <label htmlFor="upload-file-input">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<AttachFileIcon />}
                      sx={{
                        fontSize: { xs: '12px', sm: '12px' },
                      }}
                    >
                      Anexar
                    </Button>
                  </label>
                  <Button
                    variant="contained"
                    sx={{
                      fontSize: { xs: '12px', sm: '12px' },
                      backgroundColor: green[500],
                      '&:hover': {
                        backgroundColor: green[700],
                      },
                    }}
                    onClick={handleUploadFiles}
                    disabled={loadingUpload || selectedFiles.length === 0}
                    startIcon={
                      loadingUpload ? <CircularProgress size={20} /> : null
                    }
                  >
                    {loadingUpload ? 'Enviando...' : 'Upload'}
                  </Button>
                </Box>

                {/* Lista de arquivos selecionados */}
                {selectedFiles.length > 0 && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mt: 2,
                        justifyContent: 'center',
                      }}
                    >
                      Arquivos selecionados:
                    </Typography>
                    <List>
                      {selectedFiles.map((file, index) => (
                        <ListItem
                          key={index}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              onClick={() => handleRemoveSelectedFile(index)}
                              sx={{
                                '&:hover': {
                                  color: red[700],
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText primary={file.name} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Lista de arquivos já enviados */}
                {newOccurrence.attachmentsList.length > 0 && (
                  <Box mt={2}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mt: 2,
                        justifyContent: 'center',
                        color: orange[700],
                      }}
                    >
                      Arquivos anexados com sucesso!
                    </Typography>
                    <List>
                      {newOccurrence.attachmentsList.map(
                        (attachment, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={attachment.name} />
                          </ListItem>
                        ),
                      )}
                    </List>
                  </Box>
                )}
              </Box>
            )}
          </Box>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              onClick={handleStepperBack}
              disabled={step === 0 || step === 6}
              sx={{
                fontSize: { xs: '10px', sm: '12px' },
                '&:hover': {
                  backgroundColor: (theme: Theme) =>
                    theme.palette.mode === 'light' ? blueGrey[100] : '',
                },
              }}
            >
              Voltar
            </Button>

            {step < 5 && (
              <Button
                onClick={handleStepperNext}
                disabled={step === 0 && !selectedClient}
                sx={{
                  fontSize: { xs: '10px', sm: '12px' },
                  '&:hover': {
                    backgroundColor: (theme: Theme) =>
                      theme.palette.mode === 'light' ? blueGrey[100] : '',
                  },
                }}
              >
                Próximo
              </Button>
            )}

            {step === 5 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitOccurrence}
                disabled={addingOccurrence || !selectedClient}
                sx={styles.buttonRegister}
              >
                {addingOccurrence ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Registrar'
                )}
              </Button>
            )}

            {step === 6 && (
              <Button
                variant="contained"
                onClick={handleProntoClick}
                sx={{ fontSize: { xs: '10px', sm: '12px' } }}
              >
                Pronto
              </Button>
            )}
          </Box>
        </Box>

        <Typography
          sx={{
            ...styles.BoxFrequentOccurrencesTitle,
            mt: 3,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textAlign: 'center',
            '@media (max-width:450px)': {
              mt: 2,
              mb: 0,
            },
          }}
        >
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Ocorrências <span>em Aberto</span>
          <WarningIcon color="warning" sx={{ ml: 1 }} />
        </Typography>
        <Box sx={styles.BoxCardPaperRegistered}>
          <FrequentOccurrencesRegistered />
        </Box>
        <Typography
          sx={{
            ...styles.BoxFrequentOccurrencesTitle,
            mt: 3,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textAlign: 'center',
            '@media (max-width:450px)': {
              mt: 2,
              mb: 0,
            },
          }}
        >
          <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
          Ocorrências <span>Concluídas</span>
          <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
        </Typography>
        <Box sx={styles.BoxCardPaperRegistered}>
          <FrequentOccurrencesRegisteredCompleted />
        </Box>
      </Box>

      <AlertModalGeneric
        open={showAlertModal}
        onClose={handleAlertModalClose}
        title={alertModalConfig.title}
        message={alertModalConfig.message}
        buttonText={alertModalConfig.buttonText}
        onConfirm={handleAlertModalClose}
      />
    </Container>
  );
}
