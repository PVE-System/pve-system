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
import { green, orange, red } from '@mui/material/colors';

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
  const [lastAddedQuoteId, setLastAddedQuoteId] = useState<number | null>(null);
  const [industry, setIndustry] = useState<string>('CORFIO');
  const [deleting, setDeleting] = useState<number | null>(null); // Armazena o ID da cotação sendo deletada
  const [lastVisitData, setLastVisitData] = useState<{
    hasHistory: boolean;
    lastVisitConfirmedAt: string | null;
  } | null>(null);

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

        // Atualize o último ID adicionado
        if (sortedQuotes.length > 0) {
          setLastAddedQuoteId(sortedQuotes[0].id); // O maior ID será o primeiro na lista ordenada
        }
      } catch (error) {
        console.error('Error fetching sales quotes:', error);
      } finally {
        setLoadingQuotes(false);
      }
    },
    [clientId],
  );

  useEffect(() => {
    if (quotes.length > 0) {
      setLastAddedQuoteId(quotes[0].id); // O primeiro da lista ordenada é sempre o último adicionado
    }
  }, [quotes]);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  useEffect(() => {
    fetchQuotes(Number(year));
  }, [fetchQuotes, year]);

  // Buscar histórico de visitas do cliente (mesmo padrão do ClientPageTabInfos)
  useEffect(() => {
    if (!clientId || isNaN(Number(clientId))) {
      return;
    }

    const fetchVisitHistory = async () => {
      try {
        const response = await fetch(
          `/api/getVisitClientHistory?clientId=${clientId}`,
        );
        if (!response.ok) {
          console.error('Erro ao buscar histórico de visitas');
          return;
        }
        const data = await response.json();
        setLastVisitData(data);
      } catch (error) {
        console.error('Erro ao buscar histórico de visitas:', error);
      }
    };

    fetchVisitHistory();
  }, [clientId]);

  const addSalesQuote = async () => {
    setAddingQuote(true);
    try {
      const userId = Cookies.get('userId');
      if (!userId) throw new Error('ID do usuário não encontrado');
      const response = await fetch(`/api/registerSalesQuote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          userId: Number(userId),
          industry, // Envia o valor selecionado no campo "Indústria"
        }),
      });
      if (!response.ok) throw new Error('Erro ao adicionar cotação');

      const newQuote = await response.json();
      setLastAddedQuoteId(newQuote.id); // Atualiza o ID do último item gerado
      fetchQuotes(Number(year));
    } catch (error) {
      console.error('Error adding sales quote:', error);
    } finally {
      setAddingQuote(false);
    }
  };

  // Função para deletar uma cotação
  const deleteQuotes = async (quoteId: number) => {
    setDeleting(quoteId); // Define o ID da cotação sendo deletada
    try {
      const response = await fetch(`/api/deleteSalesQuote?id=${quoteId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar cotação');

      // Atualiza a lista após a exclusão
      fetchQuotes(Number(year));
    } catch (error) {
      console.error('Erro ao deletar cotação:', error);
    } finally {
      setDeleting(null); // Reseta o estado após a operação
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
          whatsapp={clientData?.whatsapp || ''}
          emailCommercial={clientData?.emailCommercial || ''}
          onRatingChange={() => {}}
          onConditionChange={() => {}}
          readOnly={false}
          imageUrl={clientData?.imageUrl || null}
          enableImageUpload={false}
          lastVisitData={lastVisitData}
        />
        <Box sx={styles.boxCol2}>
          <Box sx={styles.boxInputAndButtons}>
            <Box sx={styles.inputAndButtomColumnLeft}>
              <TextField
                select
                label="Indústria"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                variant="outlined"
                fullWidth
              >
                <MenuItem value="CORFIO">CORFIO</MenuItem>
                <MenuItem value="TCM">TCM</MenuItem>
              </TextField>
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
            </Box>

            {/* Coluna Direita */}
            <Box sx={styles.inputAndButtomColumnRight}>
              <Box>
                {!manualYearInput ? (
                  <TextField
                    label="Ano"
                    select
                    value={manualYearInput ? '' : year.toString()}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === 'showMore') {
                        setShowAllYears(true);
                        return;
                      }
                      if (selectedValue === 'manualInput') {
                        setManualYearInput(true);
                        return;
                      }
                      const parsedYear = Number(selectedValue);
                      if (!isNaN(parsedYear)) {
                        setYear(parsedYear);
                      }
                    }}
                    sx={{ width: '100%' }}
                  >
                    {Array.from({ length: showAllYears ? 20 : 5 }, (_, i) => {
                      const yearOption = new Date().getFullYear() - i;
                      return (
                        <MenuItem
                          key={yearOption}
                          value={yearOption.toString()}
                        >
                          {yearOption}
                        </MenuItem>
                      );
                    })}
                    {!showAllYears && (
                      <MenuItem
                        value="showMore"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setShowAllYears(true);
                        }}
                      >
                        Ver mais anos...
                      </MenuItem>
                    )}
                    <MenuItem value="manualInput">Escolher ano...</MenuItem>
                  </TextField>
                ) : (
                  <TextField
                    label="Ano"
                    type="number"
                    value={inputYear}
                    onChange={handleYearInput}
                    onKeyDown={handleKeyDown}
                    onBlur={handleYearSubmit}
                    sx={{ width: '100%' }}
                    inputProps={{
                      step: 1,
                      min: 1900,
                      max: new Date().getFullYear(),
                    }}
                  />
                )}
              </Box>
              <Tooltip title="Em desenvolvimento...">
                <Button sx={styles.buttonTotalResult} variant="contained">
                  <Typography variant="subtitle1">
                    Total {year}: {totalQuotes}
                  </Typography>
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* Lista paginada */}
          <List>
            {currentItems.length > 0 ? (
              currentItems.map((quote) => (
                <ListItem
                  key={quote.id}
                  sx={{
                    ...styles.boxList,
                    backgroundColor:
                      quote.id === lastAddedQuoteId ? '#inherit' : 'inherit',
                    border:
                      quote.id === lastAddedQuoteId
                        ? `2px solid ${orange[700]}`
                        : 'none',
                    borderRadius: quote.id === lastAddedQuoteId ? '8px' : '0',
                    transition:
                      quote.id === lastAddedQuoteId
                        ? 'transform 0.2s ease, box-shadow 0.2s ease'
                        : 'none',
                    '&:hover':
                      quote.id === lastAddedQuoteId
                        ? {
                            transform: 'scale(1.05)',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            zIndex: 1,
                          }
                        : {}, // Não aplica hover nos outros itens
                  }}
                >
                  {quote.id === lastAddedQuoteId ? (
                    <Tooltip title="Última cotação">
                      <Typography variant="body1">
                        <Typography component="span" fontWeight="bold">
                          Cotação:
                        </Typography>{' '}
                        {quote.quoteIdentifier}
                      </Typography>
                    </Tooltip>
                  ) : (
                    <Typography variant="body2">
                      <Typography component="span" fontWeight="bold">
                        Cotação:
                      </Typography>{' '}
                      {quote.quoteIdentifier}
                    </Typography>
                  )}
                  <Box>
                    <Tooltip title="Copiar código da negociação.">
                      <IconButton
                        sx={{
                          color: 'inherit', // Cor padrão
                          '&:hover': {
                            color: orange[700], // Cor do ícone ao passar o mouse
                          },
                        }}
                        onClick={() =>
                          navigator.clipboard.writeText(quote.quoteIdentifier)
                        }
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Deletar cotação">
                      <IconButton
                        onClick={() => deleteQuotes(quote.id)}
                        disabled={deleting === quote.id} // Desativa enquanto está deletando
                      >
                        {deleting === quote.id ? ( // Mostra o spinner enquanto está deletando
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon
                            sx={{
                              color: 'inherit', // Cor padrão
                              '&:hover': {
                                color: red[600], // Cor do ícone ao passar o mouse
                              },
                            }}
                          />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
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
