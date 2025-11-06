'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  debounce,
  Divider,
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
import QuotesComposedChart, {
  QuotesComposedChartDatum,
} from '@/app/components/QuotesComposedChart/QuotesComposedChart';

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
  const [year, setYear] = useState(new Date().getFullYear() - 1);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [addingQuote, setAddingQuote] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showAllYears, setShowAllYears] = useState(false);
  const [showAllYearsFirstChart, setShowAllYearsFirstChart] = useState(false);
  const [lastAddedQuoteId, setLastAddedQuoteId] = useState<number | null>(null);
  const [industry, setIndustry] = useState<string>('CORFIO');
  const [deleting, setDeleting] = useState<number | null>(null); // Armazena o ID da cotação sendo deletada
  const [lastVisitData, setLastVisitData] = useState<{
    hasHistory: boolean;
    lastVisitConfirmedAt: string | null;
  } | null>(null);
  const [monthlyChartData, setMonthlyChartData] = useState<
    QuotesComposedChartDatum[]
  >([]);
  const [loadingMonthly, setLoadingMonthly] = useState<boolean>(true);
  const currentYear = new Date().getFullYear();
  const [currentYearChartData, setCurrentYearChartData] = useState<
    QuotesComposedChartDatum[]
  >([]);
  const [loadingCurrentYear, setLoadingCurrentYear] = useState<boolean>(true);
  const scrollRestoreNeededRef = React.useRef<boolean>(false);
  const scrollYBeforeChangeRef = React.useRef<number>(0);
  const [leftYear, setLeftYear] = useState<number>(new Date().getFullYear());
  // Ano do primeiro gráfico (padrão: ano atual)
  const [firstChartYear, setFirstChartYear] = useState<number>(
    new Date().getFullYear(),
  );

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
    fetchQuotes(Number(leftYear));
  }, [fetchQuotes, leftYear]);

  // Função reutilizável para buscar totais mensais
  const fetchMonthlyTotalsByYear = useCallback(
    async (
      targetYear: number,
      setLoading: (loading: boolean) => void,
      setData: (data: QuotesComposedChartDatum[]) => void,
      restoreScroll?: boolean,
    ) => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/getSalesQuotesMonthlyTotals?clientId=${clientId}&year=${targetYear}`,
        );
        const json = await response.json();
        if (!response.ok || !json.success) {
          throw new Error('Erro ao buscar totais mensais');
        }
        const monthLabels = [
          'Jan',
          'Fev',
          'Mar',
          'Abr',
          'Mai',
          'Jun',
          'Jul',
          'Ago',
          'Set',
          'Out',
          'Nov',
          'Dez',
        ];
        const data: QuotesComposedChartDatum[] = (
          json.data as Array<{ month: number; total: number }>
        ).map((m) => ({ label: monthLabels[m.month - 1], count: m.total }));
        setData(data);
      } catch (err) {
        console.error(err);
        setData([]);
      } finally {
        setLoading(false);
        // Restaurar scroll apenas se solicitado
        if (
          restoreScroll &&
          scrollRestoreNeededRef.current &&
          typeof window !== 'undefined'
        ) {
          const y = scrollYBeforeChangeRef.current || window.scrollY;
          window.scrollTo(0, y);
          scrollRestoreNeededRef.current = false;
        }
      }
    },
    [clientId],
  );

  // Buscar totais mensais para o gráfico de comparação
  useEffect(() => {
    fetchMonthlyTotalsByYear(
      year,
      setLoadingMonthly,
      setMonthlyChartData,
      true,
    );
  }, [fetchMonthlyTotalsByYear, year]);

  // Buscar totais mensais para o primeiro gráfico (controlado por firstChartYear)
  useEffect(() => {
    fetchMonthlyTotalsByYear(
      firstChartYear,
      setLoadingCurrentYear,
      setCurrentYearChartData,
    );
  }, [fetchMonthlyTotalsByYear, firstChartYear]);

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
      fetchQuotes(Number(leftYear));
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
      fetchQuotes(Number(leftYear));
    } catch (error) {
      console.error('Erro ao deletar cotação:', error);
    } finally {
      setDeleting(null); // Reseta o estado após a operação
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <Box sx={styles.inputAndButtomColumnLeft}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    width: '100%',
                    flexDirection: { xs: 'column', md: 'row' },
                  }}
                >
                  {/* Select de Ano (independente, padrão ano atual) */}
                  <TextField
                    label="Ano"
                    select
                    value={leftYear.toString()}
                    onChange={(e) => {
                      const parsedYear = Number(e.target.value);
                      if (!Number.isNaN(parsedYear)) setLeftYear(parsedYear);
                    }}
                    size="small"
                    sx={{
                      width: { xs: '100%', md: '160px' },
                      '& .MuiInputBase-root': { height: 40 },
                    }}
                  >
                    {Array.from({ length: 5 }, (_, i) => {
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
                  </TextField>

                  {/* Select de Indústria */}
                  <TextField
                    select
                    label="Indústria"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{
                      '& .MuiInputBase-root': { height: 40 },
                    }}
                  >
                    <MenuItem value="CORFIO">CORFIO</MenuItem>
                    <MenuItem value="TCM">TCM</MenuItem>
                  </TextField>
                </Box>
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
            </Box>

            {/* Coluna Direita */}
            <Box sx={styles.inputAndButtomColumnRight}></Box>
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
                Nenhuma cotação encontrada para o ano {leftYear}.
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
      <Box sx={{ mt: 5 }}>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexWrap: 'wrap',
            mt: 2,
          }}
        >
          <Typography
            sx={{ fontSize: { xs: '20px', md: '26px' }, textAlign: 'center' }}
          >
            Análise gráfica das cotações.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '14px', md: '16px' },
              textAlign: 'center',
              mb: 2,
            }}
          >
            Compare os anos selecionados.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* Input para o primeiro gráfico (padrão: ano atual) */}
            <TextField
              label="Gráfico 1"
              select
              value={firstChartYear.toString()}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === 'showMore') {
                  setShowAllYearsFirstChart(true);
                  return;
                }
                const parsedYear = Number(selectedValue);
                if (!Number.isNaN(parsedYear)) {
                  setFirstChartYear(parsedYear);
                }
              }}
              size="small"
              sx={{ width: 140 }}
            >
              {Array.from(
                { length: showAllYearsFirstChart ? 20 : 5 },
                (_, i) => {
                  const yearOption = new Date().getFullYear() - i;
                  return (
                    <MenuItem key={yearOption} value={yearOption.toString()}>
                      {yearOption}
                    </MenuItem>
                  );
                },
              )}
              {!showAllYearsFirstChart && (
                <MenuItem
                  value="showMore"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowAllYearsFirstChart(true);
                  }}
                >
                  Ver mais anos...
                </MenuItem>
              )}
            </TextField>

            {/* Input para o segundo gráfico (padrão: ano anterior) */}
            <TextField
              label="Gráfico 2"
              select
              value={year.toString()}
              onChange={(e) => {
                const selectedValue = e.target.value;
                // Guardar posição do scroll antes de alterar o ano
                if (typeof window !== 'undefined') {
                  scrollYBeforeChangeRef.current = window.scrollY;
                  scrollRestoreNeededRef.current = true;
                }
                if (selectedValue === 'showMore') {
                  setShowAllYears(true);
                  return;
                }
                const parsedYear = Number(selectedValue);
                if (!isNaN(parsedYear)) {
                  setYear(parsedYear);
                }
              }}
              size="small"
              sx={{ width: 140 }}
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
                    e.preventDefault();
                    setShowAllYears(true);
                  }}
                >
                  Ver mais anos...
                </MenuItem>
              )}
            </TextField>
          </Box>
        </Box>
      </Box>

      {/* Gráfico Composed (Linha/Barra/Área) para o primeiro gráfico */}
      <Box sx={{ mt: 5, overflowX: 'auto', overflowY: 'hidden' }}>
        <Box sx={{ minWidth: 520 }}>
          <QuotesComposedChart
            data={currentYearChartData}
            title={`Cotações ${firstChartYear}. Total: ${currentYearChartData.reduce((acc, d) => acc + d.count, 0)}`}
            height={300}
          />
        </Box>
      </Box>

      {/* Gráfico Composed (Linha/Barra/Área) para o ano selecionado (comparação) */}
      <Box sx={{ mt: 2, overflowX: 'auto', overflowY: 'hidden' }}>
        <Box sx={{ minWidth: 520 }}>
          <QuotesComposedChart
            data={monthlyChartData}
            title={`Cotações ${year}. Total: ${monthlyChartData.reduce((acc, d) => acc + d.count, 0)}`}
            height={300}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ClientPageTabSalesQuotes;
