import React, { useCallback, useEffect, useState } from 'react';
import {
  Container,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Tooltip,
  Button,
  useMediaQuery,
  Box,
} from '@mui/material';
import { green } from '@mui/material/colors';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import styles from './styles';

interface Client {
  id: number;
  companyName: string;
  state: string;
  responsibleSeller: string;
  cnpj?: string;
  corfioCode?: string;
  city?: string;
}

interface SalesQuote {
  id: number;
  clientId: number;
  quoteName: string;
  quoteNumber: number;
  quotesSuccess?: boolean;
}

interface ClientWithQuotes extends Client {
  businessGroup: string;
  cpf: string | undefined;
  sellerName: any;
  salesQuotes: any;
  quotes: SalesQuote[];
}

const SalesQuotesByState = () => {
  const [stateFilter, setStateFilter] = useState<string>('TODOS CLIENTES');
  const currentYear = new Date().getFullYear();
  const [yearFilter, setYearFilter] = useState<number>(currentYear);
  const [monthFilter, setMonthFilter] = useState<string>('TODOS');
  const [clientsWithQuotes, setClientsWithQuotes] = useState<
    ClientWithQuotes[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const [isPreparingData, setIsPreparingData] = useState(false);
  const [buttonText, setButtonText] = useState('Excel');

  const fetchSalesQuotesData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/getSalesQuotesByState?state=${stateFilter}&year=${yearFilter}&month=${monthFilter}`,
      );

      const data = await res.json();

      if (!data || !Array.isArray(data.clientsWithQuotes)) {
        console.error('Formato inesperado da resposta da API:', data);
        setClientsWithQuotes([]);
        return;
      }

      setClientsWithQuotes(data.clientsWithQuotes);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  }, [monthFilter, stateFilter, yearFilter]);

  useEffect(() => {
    fetchSalesQuotesData();
  }, [fetchSalesQuotesData]);

  const handleRowClick = (clientId: number | string) => {
    window.open(`/clientPage?id=${clientId}`, '_blank');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  //Calc Quotations

  const totalQuotes = clientsWithQuotes.reduce(
    (acc, client) => acc + client.quotes.length,
    0,
  );

  const totalQuotesSuccess = clientsWithQuotes.reduce(
    (acc, client) =>
      acc +
      client.quotes.filter((quote) => quote.quotesSuccess === true).length,
    0,
  );

  //Export to excel

  const handleCopyClick = async () => {
    if (!clientsWithQuotes || clientsWithQuotes.length === 0) {
      console.warn('Nenhum dado para copiar.');
      return;
    }

    try {
      setIsPreparingData(true);
      setButtonText('');

      // Cabeçalho com nova ordem
      let textToCopy =
        'CNPJ ou CPF\tNome da Empresa\tCódigo Corfio\tGrupo Empresarial\tEstado\tCidade\tResponsável\tCotação\tCotação concluída\n';

      clientsWithQuotes.forEach((client) => {
        client.quotes.forEach((quote) => {
          const quoteConcluida =
            quote.quotesSuccess === true ? quote.quoteName : '';
          textToCopy += `${client.cnpj || client.cpf || ''}\t${client.companyName}\t${client.corfioCode || ''}\t${client.businessGroup || ''}\t${client.state}\t${client.city || ''}\t${client.responsibleSeller || ''}\t${quote.quoteName}\t${quoteConcluida}\n`;
        });
      });

      await navigator.clipboard.writeText(textToCopy);

      setButtonText('Copiado');
      setTimeout(() => setButtonText('Excel'), 2000);
    } catch (error) {
      console.error('Erro ao copiar dados:', error);
      setButtonText('Erro ao copiar');
    } finally {
      setIsPreparingData(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      {/* Dropdown para selecionar o estado */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          marginBottom: 2,
        }}
      >
        <TextField
          select
          label="Filtrar por estado"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '14px', // Tamanho da fonte do label
            },
            '& .MuiSelect-select': {
              fontSize: '14px', // Tamanho da fonte do valor selecionado
            },
          }}
        >
          {['MS', 'MT', 'OUTRAS UF', 'TODOS CLIENTES'].map((stateOption) => (
            <MenuItem
              sx={styles.fontSize}
              key={stateOption}
              value={stateOption}
            >
              {stateOption}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Filtrar por ano"
          value={yearFilter}
          onChange={(e) => setYearFilter(parseInt(e.target.value))}
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '14px', // Tamanho da fonte do label
            },
            '& .MuiSelect-select': {
              fontSize: '14px', // Tamanho da fonte do valor selecionado
            },
          }}
        >
          {[...Array(5)].map((_, i) => {
            const year = currentYear - i;
            return (
              <MenuItem key={year} value={year} sx={styles.fontSize}>
                {year}
              </MenuItem>
            );
          })}
        </TextField>

        <TextField
          select
          label="Filtrar por mês"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '14px', // Tamanho da fonte do label
            },
            '& .MuiSelect-select': {
              fontSize: '14px', // Tamanho da fonte do valor selecionado
            },
          }}
        >
          <MenuItem value="TODOS" sx={styles.fontSize}>
            Todos os meses
          </MenuItem>
          {[
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro',
          ].map((month, index) => (
            <MenuItem key={index + 1} value={index + 1} sx={styles.fontSize}>
              {month}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {/* Exibir total de registros encontrados */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'center' },
          marginBottom: 2,
          gap: 1,
          textAlign: { xs: 'center', sm: 'left' },
        }}
      >
        <Box>
          <Typography variant="subtitle2">
            Total de cotações: <strong>{totalQuotes}</strong>
          </Typography>
          <Typography variant="subtitle2">
            Total concluídas: <strong>{totalQuotesSuccess}</strong>
          </Typography>
        </Box>

        <Tooltip title="Copiar dados para colar na planilha">
          <Button
            variant="contained"
            color="primary"
            sx={{ ...styles.exportExcelButton }}
            onClick={handleCopyClick}
            disabled={isPreparingData}
            startIcon={isPreparingData ? <CircularProgress size={20} /> : null}
          >
            {isPreparingData ? '' : buttonText}
          </Button>
        </Tooltip>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  ...styles.fontSize,
                  textAlign: {
                    xs: 'center',
                    sm: 'left',
                  },
                }}
              >
                Cliente:
              </TableCell>
              {!isSmallScreen && (
                <>
                  <TableCell sx={styles.fontSize}>Estado:</TableCell>
                  <TableCell sx={styles.fontSize}>Responsável:</TableCell>
                  <TableCell sx={styles.fontSize}>Nome da Cotação:</TableCell>
                  <TableCell sx={styles.fontSize} align="center">
                    <CheckCircleIcon sx={{ color: green[600] }} />
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : clientsWithQuotes.length > 0 ? (
              clientsWithQuotes.flatMap((client) =>
                client.quotes.map((quote) => (
                  <TableRow
                    key={quote.id}
                    sx={{ ...styles.rowHover, cursor: 'pointer' }}
                    onClick={() => handleRowClick(String(client.id))}
                  >
                    <TableCell sx={styles.fontSize}>
                      {client.companyName.slice(0, 50)}
                    </TableCell>
                    {!isSmallScreen && (
                      <>
                        <TableCell sx={styles.fontSize}>
                          {client.state}
                        </TableCell>
                        <TableCell sx={styles.fontSize}>
                          {client.responsibleSeller}
                        </TableCell>
                        <TableCell sx={styles.fontSize}>
                          {quote.quoteName}
                        </TableCell>
                        <TableCell sx={styles.fontSize} align="center">
                          {quote.quotesSuccess === true ? (
                            <CheckCircleIcon sx={{ color: green[600] }} />
                          ) : (
                            <RadioButtonUncheckedIcon />
                          )}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                )),
              )
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography sx={styles.fontSize}>
                    Nenhuma cotação encontrada para este filtro.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SalesQuotesByState;
