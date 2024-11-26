'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  debounce,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ClientProfile from '@/app/components/ProfileClient/ProfileClient';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from '@/app/components/ClientPageTabSalesQuotes/styles';

interface ClientPageSalesQuotesProps {
  clientId: string;
}

interface Quote {
  id: number;
  quoteIdentifier: string;
}

const ClientPageTabSalesQuotes: React.FC<ClientPageSalesQuotesProps> = ({
  clientId,
}) => {
  const [loadingClient, setLoadingClient] = useState(true);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [inputYear, setInputYear] = useState<string>('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [addingQuote, setAddingQuote] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAllYears, setShowAllYears] = useState(false);
  const [manualYearInput, setManualYearInput] = useState(false);

  const ITEMS_PER_PAGE = 5;

  // Calcular os itens da página atual
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = quotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Total de páginas
  const totalPages = Math.ceil(quotes.length / ITEMS_PER_PAGE);

  // Fetch Client Data
  const fetchClientData = useCallback(async () => {
    setLoadingClient(true);
    try {
      const response = await fetch(`/api/getClient/${clientId}`);
      if (!response.ok) throw new Error('Erro ao buscar dados do cliente');
      const data = await response.json();
      setClientData(data);
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setLoadingClient(false);
    }
  }, [clientId]);

  const fetchQuotes = useCallback(
    async (selectedYear: number) => {
      setLoadingQuotes(true);
      try {
        const response = await fetch(
          `/api/getSalesQuotes?clientId=${clientId}&year=${selectedYear}`,
        );
        const data = await response.json();
        if (!response.ok) throw new Error('Erro ao buscar cotações');

        const sortedQuotes = data.quotes.sort(
          (a: { id: number }, b: { id: number }) => b.id - a.id,
        );

        setQuotes(sortedQuotes);
        setTotalQuotes(data.total);
      } catch (error) {
        console.error('Error fetching sales quotes:', error);
      } finally {
        setLoadingQuotes(false);
      }
    },
    [clientId],
  );

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  useEffect(() => {
    fetchQuotes(Number(year));
  }, [fetchQuotes, year]);

  const addSalesQuote = async () => {
    setAddingQuote(true);
    try {
      const userId = Cookies.get('userId');
      if (!userId) throw new Error('ID do usuário não encontrado');
      const response = await fetch(`/api/addSalesQuote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, userId: Number(userId) }),
      });
      if (!response.ok) throw new Error('Erro ao adicionar cotação');
      fetchQuotes(Number(year));
    } catch (error) {
      console.error('Error adding sales quote:', error);
    } finally {
      setAddingQuote(false);
    }
  };

  const handleYearInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputYear(value); // Atualiza o estado temporário durante a digitação
  };

  const handleYearSubmit = () => {
    const parsedYear = Number(inputYear);
    if (!isNaN(parsedYear) && inputYear.length === 4) {
      setYear(parsedYear); // Atualiza o ano principal quando válido
      setManualYearInput(false); // Sai do modo manual
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleYearSubmit(); // Chama a lógica de submissão ao pressionar Enter
    }
  };

  if (loadingClient || loadingQuotes) {
    return (
      <Box sx={styles.loadComponent}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={styles.boxContent}>
        <ClientProfile
          rating={clientData?.rating || 0}
          clientCondition={clientData?.clientCondition || ''}
          companyName={clientData?.companyName || ''}
          corfioCode={clientData?.corfioCode || ''}
          phone={clientData?.phone || ''}
          emailCommercial={clientData?.emailCommercial || ''}
          onRatingChange={() => {}}
          onConditionChange={() => {}}
          readOnly={false}
          imageUrl={clientData?.imageUrl || null}
          enableImageUpload={false}
        />
        <Box sx={styles.boxCol2}>
          <Box sx={styles.boxButtonAndInput}>
            <Tooltip title="Registrar cotação e gerar código da negociação">
              <Button
                variant="contained"
                onClick={addSalesQuote}
                disabled={addingQuote}
                sx={styles.buttonQuotesAdd}
              >
                {addingQuote ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Cotação +'
                )}
              </Button>
            </Tooltip>
            <Button sx={styles.buttonTotalResult} variant="contained">
              <Typography variant="subtitle1">
                Total {year}: {totalQuotes}
              </Typography>
            </Button>

            <Box>
              {!manualYearInput ? (
                <Select
                  value={manualYearInput ? '' : year.toString()} // Convertendo o número para string
                  onChange={(e) => {
                    const selectedValue = e.target.value;

                    if (selectedValue === 'showMore') {
                      setShowAllYears(true); // Expande para mais anos
                      return;
                    }

                    if (selectedValue === 'manualInput') {
                      setManualYearInput(true); // Ativa o campo de entrada manual
                      return;
                    }

                    const parsedYear = Number(selectedValue); // Converte de volta para número
                    if (!isNaN(parsedYear)) {
                      setYear(parsedYear); // Atualiza o ano selecionado
                    }
                  }}
                  displayEmpty
                  sx={{ minWidth: '150px' }}
                >
                  {Array.from({ length: showAllYears ? 20 : 5 }, (_, i) => {
                    const yearOption = new Date().getFullYear() - i;
                    return (
                      <MenuItem key={yearOption} value={yearOption.toString()}>
                        {yearOption}
                      </MenuItem>
                    );
                  })}
                  {!showAllYears && (
                    <MenuItem
                      value="showMore"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Impede o fechamento do menu
                        setShowAllYears(true);
                      }}
                    >
                      Ver mais anos...
                    </MenuItem>
                  )}
                  <MenuItem value="manualInput">Escolher ano...</MenuItem>
                </Select>
              ) : (
                <TextField
                  label="Digite o ano"
                  type="number"
                  value={inputYear}
                  onChange={handleYearInput}
                  onKeyDown={handleKeyDown} // Envia ao teclar enter
                  onBlur={handleYearSubmit} // Envia ao perder o foco
                  sx={{ minWidth: '150px' }}
                  inputProps={{
                    step: 1,
                    min: 1900,
                    max: new Date().getFullYear(),
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Lista paginada */}
          <List>
            {currentItems.length > 0 ? (
              currentItems.map((quote) => (
                <ListItem key={quote.id} sx={styles.boxList}>
                  <Typography variant="body1">
                    Cotação: {quote.quoteIdentifier}
                  </Typography>
                  <Tooltip title="Copiar código da negociação.">
                    <IconButton
                      onClick={() =>
                        navigator.clipboard.writeText(quote.quoteIdentifier)
                      }
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))
            ) : (
              <Typography variant="body1">
                Nenhuma cotação encontrada para o ano {year}.
              </Typography>
            )}
          </List>

          {/* Controles de paginação */}
          <Box sx={styles.boxPagination}>
            <IconButton
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body2">
              Página {currentPage + 1} de {totalPages}
            </Typography>
            <IconButton
              disabled={currentPage >= totalPages - 1}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientPageTabSalesQuotes;
